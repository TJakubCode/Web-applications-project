import React, { useEffect, useState } from 'react';
import { type Product } from './ProductItem';
import './ProductDetails.css';

interface Review {
    id: number;
    username: string;
    content: string;
    created_at: string;
}

interface ProductDetailsProps {
    productId: number;
    currentUser: string | null;
    isAdmin: boolean;
    onBack: () => void;
}

interface ProductWithStock extends Product {
    stock: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, currentUser, isAdmin, onBack }) => {
    const [product, setProduct] = useState<ProductWithStock | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [newReview, setNewReview] = useState('');
    const [message, setMessage] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await fetch(`/api/products/${productId}`);
                const prodData = await prodRes.json();
                setProduct(prodData);

                const revRes = await fetch(`/api/reviews/${productId}`);
                const revData = await revRes.json();
                setReviews(revData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [productId]);

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("Czy na pewno chcesz usunąć tę opinię?")) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser })
            });

            if (res.ok) {
                const revRes = await fetch(`/api/reviews/${productId}`);
                setReviews(await revRes.json());
            } else {
                alert("Nie masz uprawnień do usunięcia tej opinii.");
            }
            } catch (e) {
                console.error(e);
        }
    };
    const addToCart = async () => {
        if (!currentUser || !product) return;

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentUser,
                    product_id: product.id,
                    quantity: quantity
                })
            });

            if (res.ok) {
                setMessage('Dodano do koszyka!');
                setProduct({ ...product, stock: product.stock - quantity });
                setQuantity(1);
            } else {
                const err = await res.json();
                setMessage(`Błąd: ${err.error}`);
            }
        } catch {
            setMessage('Błąd serwera');
        }
    };

    const addReview = async () => {
        if (!currentUser || !newReview.trim()) return;

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentUser,
                    product_id: productId,
                    content: newReview
                })
            });

            if (res.ok) {
                setNewReview('');
                const revRes = await fetch(`/api/reviews/${productId}`);
                setReviews(await revRes.json());
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!product) return <div className="details-loading">Ładowanie...</div>;

    return (
        <div className="details-container">
            <button onClick={onBack} className="back-btn">← Wróć do listy</button>

            <div className="details-card">
                <div className="details-image-section">
                    <img src={product.image || ''} alt={product.title} className="details-image" />
                </div>
                
                <div className="details-info-section">
                    <h1 className="details-title">{product.title}</h1>
                    <span className="details-category">{product.category}</span>
                    <h2 className="details-price">{product.price} $</h2>
                    
                    <p className="details-stock">
                        Dostępne w magazynie: <strong>{product.stock} szt.</strong>
                    </p>
                    
                    <p className="details-description">{product.description}</p>

                    <div className="details-actions">
                        <div className="quantity-control">
                            <label>Ilość:</label>
                            <input 
                                type="number" 
                                min="1" 
                                max={product.stock} 
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>
                        <button 
                            className="add-cart-btn" 
                            onClick={addToCart}
                            disabled={product.stock === 0 || !currentUser}
                        >
                            {product.stock === 0 ? 'Wyprzedane' : !currentUser ? 'Zaloguj się by kontynuować' : 'Dodaj do koszyka'}
                        </button>
                    </div>
                    {message && <p className="action-message">{message}</p>}
                </div>
            </div>

            <div className="reviews-section">
                <h3>Opinie użytkowników</h3>
                
                <div className="add-review-box">
                    <textarea 
                        placeholder="Napisz swoją opinię..." 
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <button id="add-opinion-btn" onClick={addReview} disabled = {!currentUser}> {currentUser ? 'Dodaj opinię' : 'Zaloguj się by kontynuować'}</button>
                </div>

                <div className="reviews-list">
                    {reviews.length === 0 && <p>Brak opinii</p>}
                    {reviews.map(rev => (
                        <div key={rev.id} className="review-item">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <strong>{rev.username}</strong> 
                                    <small>{new Date(rev.created_at).toLocaleDateString()}</small>
                                </div>
                                
                                {(isAdmin || currentUser === rev.username) && (
                                    <button 
                                        onClick={() => handleDeleteReview(rev.id)}
                                        style={{
                                            background: '#d32f2f', 
                                            color: 'white', 
                                            border: 'none', 
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            borderRadius: '4px',
                                            flexBasis: '20%',
                                        }}
                                    >
                                        Usuń
                                    </button>
                                )}
                            </div>
                            <p className="opinion">{rev.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;