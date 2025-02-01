import { useState, useEffect } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // isOpen 상태가 변경될 때 <body> 클래스 업데이트
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menuOpen");
    } else {
      document.body.classList.remove("menuOpen");
    }

    return () => {
      document.body.classList.remove("menuOpen");
    };
  }, [isOpen]);

  return (
    <header>
      {/* 햄버거 버튼 */}
      <button
        id="menuToggle"
        className={isOpen ? "active" : ""}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        aria-label="메뉴 열기/닫기"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* 네비게이션 메뉴 */}
      <ul className={`navMenu ${isOpen ? "open" : ""}`}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/services">Services</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
