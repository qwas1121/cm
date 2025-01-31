import "../assets/css/main.css";
// import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMute } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";

import WeatherComponent from "../components/WeatherComponent";
import poemData from "../assets/poem.json";
import { useEffect, useState } from "react";
interface Poem {
  id: number;
  title: string;
  content: string;
  bg?: string;
  img?: string;
  date: Date;
  bg_black: boolean;
}

const Main = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  useEffect(() => {
    getRandomPoem();
  }, []);

  // 랜덤한 시 선택 함수
  const getRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poemData.length);
    const selectedPoem = poemData[randomIndex];

    setPoem({
      ...selectedPoem,
      date: new Date(selectedPoem.date + "T00:00:00Z"), // ✅ 날짜 변환
    });
  };

  return (
    <>
      {poem && (
        <section
          className={`mainpage ${poem.bg_black ? "on" : ""}`}
          key={poem.id}
          style={{ backgroundImage: `url(${poem.bg})` }}
        >
          {" "}
          <div className="poem_wrap">
            <div className="poem_box left">
              <div className="poem_inner">
                <WeatherComponent />
                <div className="inner_img">
                  <img src={poem.img} alt={poem.title} />
                </div>
                <div className="btns">
                  <button type="button" className="volume">
                    {/* <IoVolumeMediumSharp /> */}
                    <IoVolumeMute />
                    <strong>음소거</strong>
                  </button>
                  <button type="button" className="fullscreen">
                    <AiOutlineFullscreen />
                    <strong>크게보기</strong>
                  </button>
                  <button type="button" className="refresh">
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
                    {String(poem.date.getFullYear())}.
                    {String(poem.date.getMonth() + 1).padStart(2, "0")}.
                    {String(poem.date.getDate()).padStart(2, "0")}
                    <br /> - 이춘미 -
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
