import { useEffect, useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

const ModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light"; // 기본값: 다크모드
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("darkmode");
      document.body.classList.remove("lightmode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("lightmode");
      document.body.classList.remove("darkmode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      className={`mode-toggle ${isDarkMode ? "dark" : "light"}`}
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      <div className="toggle-inner">
        <div className="btn_icon">
          {isDarkMode ? (
            <IoMoon className="icon moon" />
          ) : (
            <IoSunny className="icon sun" />
          )}
        </div>
        <span className="label">{isDarkMode ? "DarkMode" : "LightMode"}</span>
      </div>
    </button>
  );
};

export default ModeToggle;
