/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import './Cart.css';

interface CartItem {
    id: number;
    quantity: number;
    title: string;
    price: number;
    image: string;
    stock: number
}

interface CartProps {
    currentUser: string;
    onCheckoutSuccess?: () => void; // Nowy prop do przekierowania po sukcesie
}

const Cart: React.FC<CartProps> = ({ currentUser }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    const calculateTotal = (cartItems: CartItem[]) => {
        const sum = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    };

    const handleCheckout = async () => {
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUser })
                });

                if (res.ok) {
                    alert('Zamówienie zostało złożone!');
                    setItems([]);
                    setTotal(0);
                } else {
                    alert('Błąd podczas składania zamówienia');
                }
            } catch (e) {
                console.error(e);
            }
        };

    const fetchCart = async () => {
        try {
            const res = await fetch(`/api/cart/${currentUser}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
                calculateTotal(data);
            }
        } catch (e) {
            console.error("Błąd pobierania koszyka", e);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [currentUser]);

    

    

    const removeFromCart = async (item: CartItem) => {
        try {
            await fetch(`/api/products/${item.id}/${item.quantity}`, {
                method: 'PATCH',
            });
            await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
            
            fetchCart(); 
        } catch (e) {
            console.error(e);
        }
    };

    
    if (items.length === 0) {
        return (
            <div className="cart-container">
                <h2>Twój Koszyk</h2>
                <div className="cart-empty">Koszyk jest pusty.</div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Twój Koszyk</h2>
            <div className="cart-items">
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-img-wrapper">
                            <img src={item.image} alt={item.title} className="cart-item-image" />
                        </div>
                        
                        <div className="cart-item-details">
                            <h3>{item.title}</h3>
                            <p>Cena: {item.price} $</p>
                            <p>Ilość: <strong>{item.quantity}</strong></p>
                        </div>
                        
                        <div className="cart-item-actions">
                            <p className="item-total">{(item.price * item.quantity).toFixed(2)} $</p>
                            <button onClick={() => removeFromCart(item)} className="remove-btn">Usuń</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="cart-summary">
                <h3>Łącznie do zapłaty: <span style={{color: '#4caf50'}}>{total.toFixed(2)} $</span></h3>
                <button className="checkout-btn" onClick={handleCheckout}>
                    Złóż zamówienie
                </button>
            </div>
        </div>
    );
};

export default Cart;