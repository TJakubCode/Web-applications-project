import { useEffect, useState } from "react";

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

const OrderHistory = ({ currentUser }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<
    OrderItem[] | null
  >(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/orders/${currentUser}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setOrders(await res.json());
    };
    fetchOrders();
  }, [currentUser]);

  const showDetails = async (orderId: number) => {
    const res = await fetch(`/api/orders/details/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setSelectedOrderItems(await res.json());
      setSelectedOrderId(orderId);
    }
  };

  return (
    <div
      style={{
        width: "98vw",
        margin: "20px auto",
        color: "black",
        fontSize: "1rem",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>Purchase history</h2>

      {orders.length === 0 && <p style={{ marginLeft: "20px" }}>No orders</p>}

      <div style={{ display: "flex", gap: "10px", textAlign: "left" }}>
        <div style={{ flex: 1 }}>
          {orders.map((order, key) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "white",
                border:
                  (selectedOrderId === order.id ? "2px" : "1px") +
                  " solid " +
                  (selectedOrderId === order.id ? "#a9a9a9" : "#e8e8e8"),
                borderRadius: "10px",
                padding: "5px",
                cursor: "pointer",
                marginLeft: selectedOrderId === order.id ? "0px" : "20px",
                marginRight: selectedOrderId === order.id ? "20px" : "0px",
                fontSize: "0.9rem",
              }}
              onClick={() => showDetails(order.id)}
            >
              <p>
                <strong>Order #{orders.length - key}</strong>
              </p>
              <p>Date: {new Date(order.created_at).toLocaleString()}</p>
              <p style={{ color: "#4caf50" }}>
                Total: {order.total.toFixed(2)} $
              </p>
            </div>
          ))}
        </div>

        {selectedOrderItems && (
          <div
            style={{
              flex: 1,
              border: "2px solid #a9a9a9",
              paddingLeft: "1rem",
              borderRadius: "10px",
              backgroundColor: "white",
              fontSize: "0.9rem",
            }}
          >
            <h3>Order details #{selectedOrderId}</h3>
            {selectedOrderItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "2rem",
                  borderBottom: "2px solid #a9a9a9",
                }}
              >
                <img
                  src={item.image}
                  style={{
                    width: "20%",
                    maxWidth: "200px",
                    maxHeight: "200px",
                    flexShrink: "0",
                    objectFit: "contain",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>
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
