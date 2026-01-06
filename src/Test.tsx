import axios from 'axios';
import { useState, useEffect } from 'react';

interface Product {
      id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string
}

export default function Test() {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
        setData(response.data);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {data.map(item => (
        <p key={item.id}>{item.title}</p>
      ))}
    </div>
  );
}