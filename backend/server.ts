/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

app.use(express.json());

const db: Database<sqlite3.Database, sqlite3.Statement> = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL,
        description TEXT,
        category TEXT,
        image TEXT,
        stock INTEGER
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )
`);

const adminUser = await db.get("SELECT * FROM users WHERE username = 'admin'");
if (!adminUser) {
    const hashedPassword = await bcrypt.hash("123", 10);
    await db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ['admin', hashedPassword, 'admin']
    );
}

await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY(username) REFERENCES users(username),
        FOREIGN KEY(product_id) REFERENCES products(id)
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(username) REFERENCES users(username)
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    )
`);

interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    image: string | null;
    stock:number
}

app.post('/api/checkout', async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        

        const cart = await db.all('SELECT c.quantity, p.id as product_id, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.username = ?', [username]);
        
        if (cart.length === 0) return res.status(400).json({ error: "Cart is empty" });


        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);


        const orderResult = await db.run('INSERT INTO orders (username, total) VALUES (?, ?)', [username, total]);
        const orderId = orderResult.lastID;


        const stmt = await db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        for (const item of cart) {
            await stmt.run(orderId, item.product_id, item.quantity, item.price);
        }
        await stmt.finalize();


        await db.run('DELETE FROM cart WHERE username = ?', [username]);

        res.json({ message: "Operacja zakończona pomyślnie", orderId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/orders/:username', async (req: Request, res: Response) => {
    try {
        const orders = await db.all('SELECT * FROM orders WHERE username = ? ORDER BY created_at DESC', [req.params.username]);
        res.json(orders);
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/orders/details/:id', async (req: Request, res: Response) => {
    try {
        const items = await db.all(`
            SELECT oi.quantity, oi.price, p.title, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`, 
            [req.params.id]
        );
        res.json(items);
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await db.all<Product[]>('SELECT * FROM products');
        res.json(products);
    } catch{
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const { title, price, description, category, image, stock} = req.body;
        const result = await db.run(
            'INSERT INTO products (title, price, description, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [title, price, description, category, image, stock]
        );
        res.status(201).json({ id: result.lastID, message: "Pomyślnie dodano" });
    } catch{
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) return res.status(404).json({ error: "Nie znaleziono produktu" });
        res.json(product);
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.patch('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, price, description, category, image, stock } = req.body;
        const result = await db.run(
            `UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ?, stock = ? WHERE id = ?`,
            [title, price, description, category, image, stock, id]
        );
        if (result.changes === 0) return res.status(404).json({ error: "Nie znaleziono produktu" });
        res.json({ message: "Pomyślnie zaktualizowano" });
    } catch{
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.patch('/api/products/:id/:stock', async (req: Request, res: Response) => {
    try {
        const { id, stock } = req.params;
        const result = await db.run(
            `UPDATE products SET stock = stock + ? WHERE id = ?`,
            [stock, id]
        );

        if (result.changes === 0) return res.status(404).json({ error: "Nie znaleziono produktu" });
        res.json({ message: "Pomyślnie zaktualizowano" });
    } catch{
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/api/cart', async (req: Request, res: Response) => {
    try {
        const { username, product_id, quantity } = req.body;
        
        const product = await db.get('SELECT stock FROM products WHERE id = ?', [product_id]);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ error: "Produktu nie ma w magazynie" });
        }

        const existing = await db.get('SELECT * FROM cart WHERE username = ? AND product_id = ?', [username, product_id]);
        
        if (existing) {
            await db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id]);
        } else {
            await db.run('INSERT INTO cart (username, product_id, quantity) VALUES (?, ?, ?)', [username, product_id, quantity]);
        }

        await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);

        res.json({ message: "Added to cart" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/cart/:username', async (req: Request, res: Response) => {
    try {
        const cart = await db.all(`
            SELECT c.id, c.product_id ,c.quantity, p.title, p.price, p.image 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.username = ?`, 
            [req.params.username]
        );
        res.json(cart);
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.delete('/api/cart/:id', async (req: Request, res: Response) => {
    try {
        await db.run('DELETE FROM cart WHERE id = ?', [req.params.id]);
        res.json({ message: "Usunięto z koszyka" });
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/api/reviews/:productId', async (req: Request, res: Response) => {
    try {
        const reviews = await db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [req.params.productId]);
        res.json(reviews);
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
        const { username, product_id, content } = req.body;
        await db.run('INSERT INTO reviews (username, product_id, content) VALUES (?, ?, ?)', [username, product_id, content]);
        res.json({ message: "Dodano opinię" });
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Required fields missing" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'user']);
        res.status(201).json({ message: "Zarejestrowano użytkownika" });
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: "USERNAME TAKEN" });
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) return res.status(401).json({ error: "Nieprawidłowa tożsamość" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ message: "Zalogowano pomyślnie", username: user.username, role: user.role });
        } else {
            res.status(401).json({ error: "Błędne hasło" });
        }
    } catch {
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        const user = await db.get('SELECT role FROM users WHERE username = ?', [username]);
        if (!user) return res.status(401).json({ error: "User not found" });

        const review = await db.get('SELECT * FROM reviews WHERE id = ?', [id]);
        if (!review) return res.status(404).json({ error: "Review not found" });

        if (user.role === 'admin' || review.username === username) {
            await db.run('DELETE FROM reviews WHERE id = ?', [id]);
            return res.json({ message: "Usunięto opinię" });
        } else {
            return res.status(403).json({ error: "Odmowa dostępu" });
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

app.get('/sync', async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products : Product[] = await response.json();
        const stmt = await db.prepare(`INSERT OR REPLACE INTO products (title, price, description, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)`);
        products.forEach(item => {
            stmt.run(item.title, item.price, item.description, item.category, item.image, 50);
        });
        stmt.finalize();
        res.send({ message: `SYNCHRONIZED ${products.length} PRODUCTS.` });
    } catch (error) {
        console.error(error);
        res.status(500).send('SERVER ERROR.');
    }
});

const sendSignal = async () => {
    try {
        await fetch('http://localhost:3000/sync');
    } catch (error) {
        console.error('SERVER SYNC ERROR:', error);
    }
};

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON: http://localhost:${PORT}`);
});

sendSignal();