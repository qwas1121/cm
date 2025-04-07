import { useState, useEffect } from "react";
import { HeaderProps, Poem } from "../types/types";
import Search from "./Search";

const Header: React.FC<HeaderProps> = ({ poems, onSelectPoem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems); // ✅ 검색된 시 목록

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

      <div className={`navMenu ${isOpen ? "open" : ""}`}>
        <div className="nav_inner">
          {/* 🔍 검색 기능 추가 → 필터링된 결과 적용 */}
          <Search poems={poems} setFilteredPoems={setFilteredPoems} />

          {/* 📖 시 리스트 (검색 결과 적용) */}
          <ul className="poem_list">
            {filteredPoems.map(poem => (
              <li
                key={poem.id}
                onClick={() => {
                  onSelectPoem(poem);
                  setIsOpen(false);
                }}
              >
                <div className="poem_cover">
                  <div
                    className="img"
                    style={{
                      backgroundImage: `url(${
                        import.meta.env.BASE_URL
                      }img/img_${poem.class}${
                        window.innerWidth <= 768 ? "_m" : ""
                      }.webp)`,
                    }}
                  ></div>
                </div>
                <div className="labels">
                  {poem.category.map(cat => (
                    <span
                      key={cat.id}
                      className={`${cat.id}`}
                      ref={el => {
                        if (el) {
                          el.style.setProperty(
                            "--category-color",
                            `var(--${cat.id})`
                          );
                          el.style.setProperty(
                            "--category-text",
                            `var(--${cat.id}T)`
                          );
                        }
                      }}
                    >
                      {cat.name}
                    </span> // ✅ 한글 이름 표시
                  ))}
                </div>
                <strong className="poem_title">{poem.title}</strong>
                <p className="poem_date">
                  {String(new Date(poem.date).getFullYear())}.
                  {String(new Date(poem.date).getMonth() + 1).padStart(2, "0")}.
                  {String(new Date(poem.date).getDate()).padStart(2, "0")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
