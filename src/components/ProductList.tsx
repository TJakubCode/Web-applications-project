import React, { useEffect, useState } from 'react';
import { type Product, ProductItem } from './ProductItem';

interface ProductListProps {
    onProductSelect?: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // 1. NOWY STAN: Przechowuje frazę wyszukiwania
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
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

    // 2. FILTROWANIE: Tworzymy nową listę w locie na podstawie wpisanego tekstu
    // Używamy toLowerCase() aby wielkość liter nie miała znaczenia
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={styles.center}>Ładowanie produktów...</div>;
    if (error) return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;

    return (
        <div style={styles.container}>
            {/* 3. INPUT WYSZUKIWARKI */}
            <input 
                type="text" 
                placeholder="Szukaj produktu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                }}
            />

            <div style={styles.list}>
                {/* 4. ZMIANA: Mapujemy po przefiltrowanej liście, a nie po wszystkich */}
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} onClick={() => onProductSelect && onProductSelect(product.id)} style={{cursor: 'pointer'}}>
                            <ProductItem product={product} />
                        </div>
                    ))
                ) : (
                    <div style={{textAlign: 'center', color: '#888'}}>Nie znaleziono produktów.</div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Segoe UI, sans-serif'
    },
    list: {
        display: 'flex',
        flexDirection: 'column'
    },
    center: {
        textAlign: 'center',
        marginTop: '50px',
        fontSize: '1.2rem'
    }
};

export default ProductList;