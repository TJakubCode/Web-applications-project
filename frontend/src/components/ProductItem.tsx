import "./ProductItem.css";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>

        {product.category && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="category-title">Category:</span>
              <span className="product-category">{product.category}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="price-title">Price:</span>
              <span className="product-price">{product.price}$</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
