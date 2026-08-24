import { useState, useEffect } from "react";
import "./MobileNav.css";

import {
  LiaIconsSolid,
  LiaShoppingBasketSolid,
  LiaUserCircle,
  LiaShoppingBagSolid,
  LiaScrollSolid,
  LiaBarsSolid,
} from "react-icons/lia";
import { IoMdExit } from "react-icons/io";

interface mobileProps {
  changePage(name: string): void;
  handleLogout(): void;
  currentUser: string;
}

function MobileNav({ changePage, handleLogout, currentUser }: mobileProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (): void => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    const myself = document.getElementById("menu");

    const handleOutsideClick = (event: PointerEvent) => {
      if (myself && !myself.contains(event.target as Node)) setExpanded(false);
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div id="menu" className={expanded ? "menu-expanded" : "menu-collapsed"}>
        <div id="menu-btn" onClick={toggleExpand}>
          <LiaBarsSolid size={32} />
        </div>

        <div
          id="mobile-options"
          className={expanded ? "menu-expanded" : "menu-collapsed"}
          style={{ visibility: expanded ? "visible" : "hidden" }}
        >
          <button onClick={() => changePage("products")}>
            Products <LiaIconsSolid size={32} className="icon" />
          </button>
          <button onClick={() => changePage("cart")}>
            Cart <LiaShoppingBasketSolid size={32} className="icon" />
          </button>
          <button onClick={() => changePage("orders")}>
            Purchase history <LiaScrollSolid size={32} className="icon" />
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                color: "#368a39",
                fontSize: "12px",
              }}
            >
              {currentUser} <LiaUserCircle size={32} className="icon" />
            </span>
            Log out <IoMdExit size={32} className="icon" />
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
