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
        image TEXT
    )
`);

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    image: string | null;
}

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const products = await db.all<Product[]>('SELECT * FROM products');
        res.json(products);
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const { title, price, description, category, image } = req.body;
        const result = await db.run(
            'INSERT INTO products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)',
            [title, price, description, category, image]
        );
        res.status(201).json({ id: result.lastID, message: "SUCCESSFULLY ADDED" });
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.run('DELETE FROM products WHERE id = ?', [id]);
        if (result.changes === 0) return res.status(404).json({ error: "PRODUCT NOT FOUND" });
        res.json({ message: "SUCCESSFULLY DELETED" });
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.patch('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, price, description, category, image } = req.body;
        const result = await db.run(
            `UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ? WHERE id = ?`,
            [title, price, description, category, image, id]
        );
        if (result.changes === 0) return res.status(404).json({ error: "PRODUCT NOT FOUND" });
        res.json({ message: "SUCCESSFULLY UPDATED" });
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});


app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "USER REGISTERED" });
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: "USERNAME TAKEN" });
        }
        console.error(err);
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) {
            return res.status(401).json({ error: "INVALID CREDENTIALS" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ message: "LOGIN SUCCESS", username: user.username });
        } else {
            res.status(401).json({ error: "INVALID CREDENTIALS" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "SERVER ERROR" });
    }
});


app.get('/sync', async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products : Product[] = await response.json();
        const stmt = await db.prepare(`INSERT OR REPLACE INTO products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)`);
        products.forEach(item => {
            stmt.run(item.title, item.price, item.description, item.category, item.image);
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