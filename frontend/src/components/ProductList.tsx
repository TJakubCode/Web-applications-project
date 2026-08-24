import { useEffect, useState } from "react";
import { type Product } from "./ProductItem";
import ProductItem from "./ProductItem";
import "./ProductList.css";
import { LiaSearchSolid } from "react-icons/lia";

const MAX_TITLE_LENGTH = 30;

interface ProductListProps {
  onProductSelect?: (id: number) => void;
}

const ProductList = ({ onProductSelect }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const shortenedProducts = filteredProducts.map((product) => {
    if (product.title.length < MAX_TITLE_LENGTH) return product;

    return {
      ...product,
      title: product.title.substring(0, MAX_TITLE_LENGTH) + "...",
    };
  });

  if (loading) return <div id="loading">Loading products...</div>;

  return (
    <div id="list-container">
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "90%",
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <span id="searchbar">
          Type product name here{" "}
          <LiaSearchSolid size={32} style={{ marginLeft: "10px" }} />
        </span>
        <input
          id="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div id="products">
        {shortenedProducts.length > 0 ? (
          shortenedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect && onProductSelect(product.id)}
            >
              <ProductItem product={product} />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#888" }}>
            Nie znaleziono produktów.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
