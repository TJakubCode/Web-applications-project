import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

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
        description TEXT,
        category TEXT,
        image TEXT
    )
`);

interface Product {
    id: number;
    title: string;
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
        const { title, description, category, image } = req.body;
        
        const result = await db.run(
            'INSERT INTO products (title, description, category, image) VALUES (?, ?, ?, ?)',
            [title, description, category, image]
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

        if (result.changes === 0) {
            return res.status(404).json({ error: "PRODUCT NOT FOUND" });
        }

        res.json({ message: "SUCCESSFULLY DELETED" });
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.patch('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, category, image } = req.body;

        const result = await db.run(
            `UPDATE products SET 
                title = ?, 
                description = ?, 
                category = ?, 
                image = ? 
            WHERE id = ?`,
            [title, description, category, image, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "PRODUCT NOT FOUND" });
        }

        res.json({ message: "SUCCESSFULLY UPDATED" });
    } catch{
        res.status(500).json({ error: "SERVER ERROR" });
    }
});

app.get('/sync', async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products : Product[] = await response.json();

        const stmt = await db.prepare(`INSERT OR REPLACE INTO products (title, description, category, image) VALUES (?, ?, ?, ?)`);

        products.forEach(item => {
            stmt.run(item.title, item.description, item.category, item.image);
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