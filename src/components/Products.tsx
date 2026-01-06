import axios from 'axios';
import { useState, useEffect } from 'react';
import './Products.css';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

const Products = () => {
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
        <table id="top">
            {data.map((item) => (
                <tr key={item.id} className="product-row">
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.price} $</td>
                    <td>{item.description.substring(0, 50)}...</td> 
                    <td>{item.category}</td>
                </tr>
            ))}
        </table>
    );
};

export default Products;