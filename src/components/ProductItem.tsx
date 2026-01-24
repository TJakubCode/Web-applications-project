import React from 'react';
import './ProductItem.css';


export interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    category: string | null;
    image: string | null;
    stock:number
}

interface ProductItemProps {
    product: Product;
}

export const ProductItem = ({ product } : ProductItemProps) => {
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
                        <div>
                            <span style={{fontSize:'22px'}}>Kategoria:</span>
                            <span className="product-category">{product.category}</span>
                        </div>
                        <div>
                            <span style={{fontSize:'22px'}}>Cena:</span>
                            <span className="product-price">{product.price}$</span>
                        </div>
                        
                    </>
                    
                )}
                
                <p className="product-description">
                    {product.description || "Brak opisu."}
                </p>
            </div>
        </div>
    );
};