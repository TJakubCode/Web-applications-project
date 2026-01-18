import React from 'react';
import './ProductItem.css';


export interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    image: string | null;
}

interface ProductItemProps {
    product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    return (
        <div className="product-card">
            <div className="product-image-container">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="product-image" 
                    />
                ) : (
                    <div className="product-placeholder">Brak zdjęcia</div>
                )}
            </div>

            <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                
                {product.category && (
                    <>
                        <span className="product-category">{product.category}</span>
                        <span className="product-price">{product.price}$</span>
                    </>
                    
                )}
                
                <p className="product-description">
                    {product.description || "Brak opisu."}
                </p>
            </div>
        </div>
    );
};