import "../assets/css/main.css";
import { IoVolumeMute, IoVolumeMediumSharp } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import WeatherComponent from "../components/WeatherComponent";
import poemData from "../assets/poem.json";
import { useEffect, useState, useRef } from "react";

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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const lastPoemId = useRef<number | null>(null); // ✅ 이전 시 저장

  // ✅ 랜덤한 시 선택 (이전과 같은 시가 나오지 않도록 설정)
  const getRandomPoem = () => {
    if (poemData.length < 2) return; // ✅ 시가 1개밖에 없으면 변경 불가능

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * poemData.length);
    } while (poemData[randomIndex].id === lastPoemId.current); // ✅ 이전 시와 다를 때까지 반복

    const selectedPoem = poemData[randomIndex];
    lastPoemId.current = selectedPoem.id; // ✅ 현재 시를 저장

    setPoem({
      ...selectedPoem,
      date: typeof selectedPoem.date === "string"
        ? new Date(selectedPoem.date + "T00:00:00Z")
        : selectedPoem.date,
    });

    setIsMuted(false); // ✅ 새로운 시 선택 시 음소거 해제
  };

  // ✅ 페이지 접속 or 새로고침 시 자동 실행 (랜덤 시 선택)
  useEffect(() => {
    getRandomPoem();
  }, []); // ✅ 첫 렌더링 시 실행

  // ✅ `poem` 상태가 변경된 후 실행 → 새로운 음악 적용
  useEffect(() => {
    if (poem?.music && iframeRef.current) {
      iframeRef.current.src = import.meta.env.BASE_URL + poem.music;
    }
  }, [poem]); // ✅ `poem`이 변경될 때마다 실행

  // ✅ 음소거 토글
  const toggleMute = () => {
    if (iframeRef.current) {
      iframeRef.current.src = isMuted ? import.meta.env.BASE_URL + poem?.music : ""; // ✅ 음소거 시 음악을 제거
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {poem && (
        <section
          className={`mainpage ${poem.bg_black ? "on" : ""}`}
          key={poem.id}
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}${poem.bg})`,
          }}
        >
          {/* ✅ iframe을 사용하여 해당 시의 음악 자동 재생 */}
          {poem.music && (
            <iframe
              ref={iframeRef}
              src={import.meta.env.BASE_URL + poem.music}
              allow="autoplay"
              id="audio"
              style={{ display: "none" }}
            ></iframe>
          )}

          <div className="poem_wrap">
            <div className="poem_box left">
              <div className="poem_inner">
                <WeatherComponent />
                <div className="inner_img" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${poem.img})` }}></div>
                <div className="btns">
                  {/* ✅ 클릭하면 음소거 토글 버튼 */}
                  <button type="button" className="volume" onClick={toggleMute}>
                    {isMuted ? <IoVolumeMute /> : <IoVolumeMediumSharp />}
                    <strong>{isMuted ? "음소거 해제" : "음소거"}</strong>
                  </button>

                  <button type="button" className="fullscreen">
                    <AiOutlineFullscreen />
                    <strong>크게보기</strong>
                  </button>
                  <button type="button" className="refresh" onClick={getRandomPoem}>
                    <MdRefresh />
                    <strong>다음 랜덤 시</strong>
                  </button>
                </div>
              </div>
            </div>
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
                    {String(poem.date instanceof Date ? poem.date.getFullYear() : new Date(poem.date).getFullYear())}.
                    {String(poem.date instanceof Date ? poem.date.getMonth() + 1 : new Date(poem.date).getMonth() + 1).padStart(2, "0")} .
                    {String(poem.date instanceof Date ? poem.date.getDate() : new Date(poem.date).getDate()).padStart(2, "0")}
                    <br /> - ㅊㅁ -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Main;
