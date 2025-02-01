import { IoVolumeMute, IoVolumeMediumSharp } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";

import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

interface PopupProps {
  poem: {
    id: number;
    title: string;
    content: string;
    bg?: string;
    img?: string;
    music?: string;
    date: string | Date;
    bg_black: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  toggleMute: () => void; // ✅ 메인의 음소거 상태 변경 함수
  isMuted: boolean; // ✅ 현재 음소거 상태
}

const Popup: React.FC<PopupProps> = ({
  poem,
  isOpen,
  onClose,
  toggleMute,
  isMuted,
}) => {
  const [fontTitleSize, setFontTitleSize] = useState(26);
  const [fontSize, setFontSize] = useState(16);

  // ✅ 글씨 크기 조절 함수 (최대/최소 범위 지정)
  const increaseFontSize = () => {
    setFontTitleSize((prev) => Math.min(prev + 2, 40)); // 최대 제목 크기 40px
    setFontSize((prev) => Math.min(prev + 2, 30)); // 최대 본문 크기 30px
  };

  const decreaseFontSize = () => {
    setFontTitleSize((prev) => Math.max(prev - 2, 20)); // 최소 제목 크기 18px
    setFontSize((prev) => Math.max(prev - 2, 10)); // 최소 본문 크기 12px
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="btns">
          {/* ✅ 음소거 버튼 */}
          <button className="volume" onClick={toggleMute}>
            {isMuted ? <IoVolumeMute /> : <IoVolumeMediumSharp />}
            <strong>{isMuted ? "음소거 해제" : "음소거"}</strong>
          </button>

          {/* ✅ 글씨 크기 조절 버튼 */}
          <button onClick={decreaseFontSize}>
            <FaMinus />
            <strong>글씨작게</strong>
          </button>
          <button onClick={increaseFontSize}>
            <FaPlus />
            <strong>글씨크게</strong>
          </button>
        </div>

        {/* ✅ 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose />
        </button>

        <div className="modal_poem">
          <div
            className="poem_img"
            style={{
              backgroundImage: `url(${import.meta.env.BASE_URL}${poem.bg})`,
            }}
          ></div>
          <div className="modal_poem_cont">
            <div
              className="inner_bg"
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}${poem.bg})`,
              }}
            ></div>
            <div className="color_bg"></div>
            <div className="text_wrap">
              <h2
                className="poem_title"
                style={{ fontSize: `${fontTitleSize}px` }} // ✅ 제목 크기 반영
              >
                {poem.title}
              </h2>
              <p
                className="poem_text"
                style={{ fontSize: `${fontSize}px` }} // ✅ 본문 크기 반영
              >
                {poem.content.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <p className="sign">
                {String(new Date(poem.date).getFullYear())}.
                {String(new Date(poem.date).getMonth() + 1).padStart(2, "0")}.
                {String(new Date(poem.date).getDate()).padStart(2, "0")}
                <br /> - ㅊㅁ -
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Popup;
