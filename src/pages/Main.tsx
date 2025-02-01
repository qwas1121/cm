import { useEffect, useState, useRef } from "react";
import { IoVolumeMute, IoVolumeMediumSharp } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import WeatherComponent from "../components/WeatherComponent";
import poemData from "../assets/poem.json";
import Popup from "./MainPopup";

interface Poem {
  id: number;
  title: string;
  content: string;
  bg?: string;
  img?: string;
  music?: string;
  date: string | Date;
  bg_black: boolean;
}

const Main = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isEntered, setIsEntered] = useState(false); // ✅ 입장
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ✅ 팝업 상태
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPoemId = useRef<number | null>(null);

  // ✅ 랜덤한 시 선택 (이전과 같은 시가 나오지 않도록 설정)
  const getRandomPoem = () => {
    if (poemData.length < 2) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * poemData.length);
    } while (poemData[randomIndex].id === lastPoemId.current);

    const selectedPoem = poemData[randomIndex];
    lastPoemId.current = selectedPoem.id;

    setPoem({
      ...selectedPoem,
      date:
        typeof selectedPoem.date === "string"
          ? new Date(selectedPoem.date + "T00:00:00Z")
          : selectedPoem.date,
    });

    setIsMuted(false); // ✅ 새로운 시 선택 시 음소거 해제

    // ✅ 음악 변경 (입장한 상태일 때만 재생)
    if (audioRef.current) {
      audioRef.current.pause(); // 기존 음악 정지
      audioRef.current.src = ""; // 기존 소스 제거
    }
    if (selectedPoem.music && isEntered) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = import.meta.env.BASE_URL + selectedPoem.music;
          audioRef.current
            .play()
            .catch((error) => console.error("자동 재생 실패:", error));
        }
      }, 100); // 🎯 브라우저 정책에 맞게 약간의 지연 추가
    }
  };

  // ✅ 페이지 접속 or 새로고침 시 자동 실행 (랜덤 시 선택)
  useEffect(() => {
    getRandomPoem();
  }, []);

  // ✅ "입장하기" 버튼 클릭 시 음악 자동 재생
  const handleEnter = () => {
    setIsEntered(true);
    if (audioRef.current && poem?.music) {
      audioRef.current.src = import.meta.env.BASE_URL + poem.music;
      audioRef.current
        .play()
        .catch((error) => console.error("자동 재생 실패:", error));
    }
  };

  // ✅ 음소거 토글
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(audioRef.current.muted);
    }
  };

  // ✅ 팝업 열기 (기존 음악 유지)
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // ✅ 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* ✅ 입장하기 버튼 (z-index로 최상단) */}
      {!isEntered && (
        <div className="intro-overlay">
          <div className="intro-content">
            <h1>대춘이 시집</h1>
            <button className="enter-button" onClick={handleEnter}>
              입장하기
            </button>
          </div>
        </div>
      )}

      {poem && isEntered && (
        <section
          className={`mainpage ${poem.bg_black ? "on" : ""}`}
          key={poem.id}
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}${poem.bg})`,
          }}
        >
          {/* ✅ 오디오 태그를 이용한 자동 재생 & 음소거 가능 */}
          {poem.music && (
            <audio
              ref={audioRef}
              src={import.meta.env.BASE_URL + poem.music}
              autoPlay
              loop
            />
          )}

          <div className="poem_wrap">
            <div className="poem_box left">
              <div className="poem_inner">
                <WeatherComponent />
                <div
                  className="inner_img"
                  style={{
                    backgroundImage: `url(${import.meta.env.BASE_URL}${
                      poem.img
                    })`,
                  }}
                ></div>
                <div className="btns">
                  {/* ✅ 음소거 토글 버튼 */}
                  <button type="button" className="volume" onClick={toggleMute}>
                    {isMuted ? <IoVolumeMute /> : <IoVolumeMediumSharp />}
                    <strong>{isMuted ? "음소거 해제" : "음소거"}</strong>
                  </button>

                  {/* ✅ 팝업 열기 */}
                  <button
                    type="button"
                    className="fullscreen"
                    onClick={openPopup} // ✅ 이제 openPopup이 정상적으로 동작함
                  >
                    <AiOutlineFullscreen />
                    <strong>크게보기</strong>
                  </button>
                  <button
                    type="button"
                    className="refresh"
                    onClick={getRandomPoem}
                  >
                    <MdRefresh />
                    <strong>다음 랜덤 시</strong>
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ box_right 내용 유지 */}
            <div className="poem_box right">
              <div className="poem_inner">
                <div className="poem_texts">
                  <h2 className="poem_title">{poem.title}</h2>
                  <p className="poem_text">
                    {poem.content.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <p className="sign">
                    {String(
                      poem.date instanceof Date
                        ? poem.date.getFullYear()
                        : new Date(poem.date).getFullYear()
                    )}
                    .
                    {String(
                      poem.date instanceof Date
                        ? poem.date.getMonth() + 1
                        : new Date(poem.date).getMonth() + 1
                    ).padStart(2, "0")}{" "}
                    .
                    {String(
                      poem.date instanceof Date
                        ? poem.date.getDate()
                        : new Date(poem.date).getDate()
                    ).padStart(2, "0")}
                    <br /> - ㅊㅁ -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ✅ 팝업 연결 */}
      {poem && isPopupOpen && (
        <Popup
          poem={poem}
          isOpen={isPopupOpen}
          onClose={closePopup} // ✅ 팝업 닫기 함수 전달
          toggleMute={toggleMute} // ✅ 메인의 음소거 상태 변경 함수 전달
          isMuted={isMuted} // ✅ 현재 음소거 상태 전달
        />
      )}
    </>
  );
};

export default Main;
