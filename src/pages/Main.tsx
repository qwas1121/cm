// import React from "react";
import "../assets/css/main.css";
// import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMute } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";

const Main = () => {
  return (
    <section className="mainpage">
      <div className="poem_wrap">
        <div className="poem_box left">
          <div className="poem_inner">
            <div className="inner_img">이미지 들어갈곳</div>
            <p className="today_text">Today is 2025.01.31 🌧️</p>
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
                <strong>다른 시 보기</strong>
              </button>
            </div>
          </div>
        </div>
        <div className="poem_box right">
          <div className="poem_inner">
            <div className="poem_texts">
              <h2 className="poem_title">제목입니다.</h2>
              <p className="poem_text">
                내용입니다.
                <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
                내용내용 내용 <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
