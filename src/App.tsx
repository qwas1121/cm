import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import DarkModeToggle from "./components/ModeToggle";
import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import { Poem } from "./types/types";

import poemData from "./assets/poem.json";

import "./assets/css/main.css";
import "./assets/css/poem_list.css";
import "./assets/css/calendar.css";
import "./assets/css/mode.css";

function App() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  const [isEntered, setIsEntered] = useState(false);

  // ✅ "입장하기" 버튼 클릭 시 처리
  const handleEnter = () => {
    setIsEntered(true); // ✅ 입장하기 화면 사라짐
  };

  useEffect(() => {
    // ✅ 가나다순 정렬 후 상태 저장
    const sortedPoems = [...poemData].sort((a, b) =>
      a.title.localeCompare(b.title, "ko-KR")
    );
    setPoems(sortedPoems);
  }, []);

  return (
    <BrowserRouter basename="/DaeChun">
      {!isEntered && (
        <div className="intro-overlay">
          <div className="intro-content">
            <img
              src={`${import.meta.env.BASE_URL}img/logo_intro.svg`}
              alt="ㅊㅁ"
            />
            <p>
              이곳은 <span>ㅊㅁ</span>의 시를 모아둔 웹페이지입니다.
              <br />
              입장 시 음악이 들릴 예정이니 볼륨을 키워주세요.
            </p>
            <button className="enter-button" onClick={handleEnter}>
              입장하기
            </button>
          </div>
        </div>
      )}
      {isEntered && (
        <>
          <DarkModeToggle />
          <Header poems={poems} onSelectPoem={setSelectedPoem} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  poems={poems}
                  selectedPoem={selectedPoem}
                  setSelectedPoem={setSelectedPoem}
                />
              }
            />
          </Routes>
          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
