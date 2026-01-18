import React, { useEffect, useState } from 'react';

interface Order {
    id: number;
    total: number;
    created_at: string;
}

interface OrderItem {
    title: string;
    price: number;
    quantity: number;
    image: string;
}

interface OrderHistoryProps {
    currentUser: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ currentUser }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[] | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`/api/orders/${currentUser}`);
            if (res.ok) setOrders(await res.json());
        };
        fetchOrders();
    }, [currentUser]);

    const showDetails = async (orderId: number) => {
        const res = await fetch(`/api/orders/details/${orderId}`);
        if (res.ok) {
            setSelectedOrderItems(await res.json());
            setSelectedOrderId(orderId);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', color: 'white' }}>
            <h2>Historia zamówień</h2>
            
            {orders.length === 0 && <p>Brak zamówień.</p>}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Lista zamówień */}
                <div style={{ flex: 1 }}>
                    {orders.map(order => (
                        <div key={order.id} 
                             style={{ 
                                 border: '1px solid #444', 
                                 padding: '15px', 
                                 marginBottom: '10px', 
                                 borderRadius: '8px',
                                 background: selectedOrderId === order.id ? '#333' : '#1a1a1a',
                                 cursor: 'pointer'
                             }}
                             onClick={() => showDetails(order.id)}
                        >
                            <p><strong>Zamówienie #{order.id}</strong></p>
                            <p>Data: {new Date(order.created_at).toLocaleString()}</p>
                            <p style={{ color: '#4caf50' }}>Suma: {order.total.toFixed(2)} $</p>
                        </div>
                    ))}
                </div>

                {/* Szczegóły wybranego zamówienia (pokazuje się po prawej) */}
                {selectedOrderItems && (
                    <div style={{ flex: 1, border: '1px solid #444', paddingLeft: '20px' }}>
                        <h3>Szczegóły zamówienia #{selectedOrderId}</h3>
                        {selectedOrderItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff' }} />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.title}</p>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>
                                        {item.quantity} x {item.price.toFixed(2)} $
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;