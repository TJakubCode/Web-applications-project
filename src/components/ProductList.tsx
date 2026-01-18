import React, { useEffect, useState } from 'react';
import { type Product, ProductItem } from './ProductItem';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Dzięki PROXY używamy teraz ścieżki względnej!
                // Nie musimy pisać http://localhost:3000
                const response = await fetch('/api/products');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError("Nie udało się pobrać listy produktów.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={styles.center}>Ładowanie produktów...</div>;
    if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Nasze Produkty</h2>
            
            <div style={styles.list}>
                {products.map((product) => (
                    // Tutaj używamy naszego nowego komponentu
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Segoe UI, sans-serif'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
    },
    list: {
        display: 'flex',
        flexDirection: 'column' // Upewnienie się, że są jeden pod drugim
    },
    center: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '1.2rem'
    }
};

export default ProductList;