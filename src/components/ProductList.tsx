import React, { useEffect, useState } from 'react';
import { type Product, ProductItem } from './ProductItem';
import './ProductList.css'

interface ProductListProps {
    onProductSelect?: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div id="loading">Ładowanie produktów...</div>;

    return (
        <div id="list-container">
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

            <div id="products">
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


export default ProductList;