import React from 'react';

export interface Product {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    image: string | null;
}

interface ProductItemProps {
    product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    return (
        <div style={styles.card}>
            <div style={styles.imageContainer}>
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        style={styles.image} 
                    />
                ) : (
                    <div style={styles.placeholder}>Brak zdjęcia</div>
                )}
            </div>

            <div style={styles.content}>
                <h3 style={styles.title}>{product.title}</h3>
                
                {product.category && (
                    <span style={styles.category}>{product.category}</span>
                )}
                
                <p style={styles.description}>
                    {product.description || "Brak opisu."}
                </p>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    imageContainer: {
        width: '100%',
        height: '250px',
        overflow: 'hidden',
        borderRadius: '6px',
        backgroundColor: '#f9f9f9'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#aaa',
        fontSize: '0.9rem'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '1.25rem',
        color: '#333'
    },
    category: {
        display: 'inline-block',
        fontSize: '0.75rem',
        backgroundColor: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px',
        color: '#555',
        marginBottom: '8px',
        width: 'fit-content'
    },
    description: {
        margin: 0,
        color: '#666',
        lineHeight: '1.5'
    }
};