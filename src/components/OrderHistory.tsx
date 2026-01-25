import { useEffect, useState } from 'react';

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

const OrderHistory = ({ currentUser } : OrderHistoryProps) => {
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
        <div style={{ width: '80vw', margin: '20px auto', color: 'white', fontSize:'24px' }}>
            <h2>Historia zamówień</h2>
            
            {orders.length === 0 && <p>Brak zamówień</p>}

            <div style={{ display: 'flex', gap: '20px', textAlign:'left' }}>
                <div style={{ flex: 1 }}>
                    {orders.map(order => (
                        <div key={order.id} 
                             style={{ 
                                 border: '1px solid #444', 
                                 padding: '15px', 
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

                {selectedOrderItems && (
                    <div style={{ flex: 1, border: '1px solid #444', paddingLeft: '20px'}}>
                        <h3>Szczegóły zamówienia #{selectedOrderId}</h3>
                        {selectedOrderItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', borderStyle: 'solid', borderColor: 'gray',borderWidth: '2px 0px 2px 0px' }}>
                                <img src={item.image} style={{width: '100px', objectFit: 'contain'}} />
                                <div>
                                    <p style={{ margin: 0, fontSize: '24px' }}>{item.title}</p>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '20px' }}>
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