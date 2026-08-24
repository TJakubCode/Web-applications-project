import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login.tsx";
import ProductList from "./components/ProductList.tsx";
import ProductDetails from "./components/ProductDetails.tsx";
import Cart from "./components/Cart.tsx";
import OrderHistory from "./components/OrderHistory.tsx";
import MobileNav from "./components/MobileNav.tsx";

import {
  LiaIconsSolid,
  LiaShoppingBasketSolid,
  LiaUserCircle,
  LiaShoppingBagSolid,
  LiaScrollSolid,
} from "react-icons/lia";
import { IoMdExit } from "react-icons/io";

const MOBILE_WIDTH = 900;

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("products");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = (): boolean => {
    console.log(window.innerWidth);
    return width < MOBILE_WIDTH;
  };

  const changePage = (page: string) => {
    if ((page === "cart" || page === "orders") && !currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setCurrentPage(page);
    if (page !== "details") setSelectedProductId(null);
  };

  const handleLoginSuccess = (username: string, role: string) => {
    setCurrentUser(username);
    setIsAdmin(role === "admin");
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage("products");
  };

  const handleProductSelect = (id: number) => {
    setSelectedProductId(id);
    setCurrentPage("details");
  };

  return (
    <>
      <nav>
        <h1 style={{ fontStyle: "italic", display: "flex" }}>
          <LiaShoppingBagSolid />
          SHOPLY
        </h1>

        {currentUser ? (
          isMobile() ? (
            <div
              style={{
                position: "relative",
                width: "145px",
                height: "50px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <MobileNav
                changePage={changePage}
                handleLogout={handleLogout}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <>
              {currentUser && (
                <div id="options">
                  <button onClick={() => changePage("products")}>
                    Products <LiaIconsSolid size={32} className="icon" />
                  </button>
                  <button onClick={() => changePage("cart")}>
                    Cart <LiaShoppingBasketSolid size={32} className="icon" />
                  </button>
                  <button onClick={() => changePage("orders")}>
                    Purchase history{" "}
                    <LiaScrollSolid size={32} className="icon" />
                  </button>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  justifyContent: "flex-end",
                }}
              >
                <>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "#368a39",
                      fontSize: "1.2rem",
                    }}
                  >
                    {currentUser} <LiaUserCircle size={32} className="icon" />
                  </span>
                  <button onClick={handleLogout}>
                    Log out <IoMdExit size={32} className="icon" />
                  </button>
                </>
              </div>
            </>
          )
        ) : (
          <div style={{ position: "relative" }}>
            <button
              id="login-btn"
              style={{ position: "relative", zIndex: "11" }}
              onClick={() => setLoginModalOpen(!loginModalOpen)}
            >
              Log in / Register
              <LiaUserCircle size={64} className="icon" />
            </button>

            <div
              id="dropdown"
              className={loginModalOpen ? "dropped" : "standard"}
            >
              <div id="login-tab">
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          </div>
        )}
      </nav>

      {currentPage === "products" && (
        <>
          <h1>Products</h1>
          <ProductList onProductSelect={handleProductSelect} />
        </>
      )}

      {currentPage === "details" && selectedProductId && (
        <ProductDetails
          productId={selectedProductId}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onBack={() => changePage("products")}
        />
      )}

      {currentPage === "cart" && currentUser && (
        <Cart
          currentUser={currentUser}
          onCheckoutSuccess={() => changePage("orders")}
        />
      )}

      {currentPage === "orders" && currentUser && (
        <OrderHistory currentUser={currentUser} />
      )}
    </>
  );
}

export default App;
