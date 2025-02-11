import { useState, useRef, useEffect } from "react";
import { IoVolumeMute, IoVolumeMediumSharp } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { RiArrowUpDoubleLine } from "react-icons/ri";
import WeatherComponent from "../components/WeatherComponent";
import Popup from "./MainPopup";
import { Poem, MainProps } from "../types/types";

const Main: React.FC<MainProps> = ({
  poems,
  selectedPoem,
  setSelectedPoem,
}) => {
  const [isFromList, setIsFromList] = useState<boolean>(false);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 모바일에서만 적용
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 처음 입장 시 랜덤 시 선택
  useEffect(() => {
    if (!selectedPoem) {
      getRandomPoem();
    } else {
      setPoem(selectedPoem);
      setIsFromList(true); // ✅ 리스트에서 선택됨
      // playMusic(selectedPoem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPoem]);
  // ✅ poem이 변경될 때 음악 재생
  useEffect(() => {
    if (poem && audioRef.current) {
      playMusic(poem);
    }
  }, [poem]);

  // ✅ 음악 재생 함수
  const playMusic = (poem: Poem) => {
    if (!poem.music) return; // 음악이 없으면 실행하지 않음

    if (!audioRef.current) {
      console.warn("🎵 audioRef가 아직 생성되지 않음.");
      return;
    }

    const audio = audioRef.current;

    // ✅ 기존 음악이 재생 중이면 완전히 정지하고 소스 삭제
    audio.pause();
    audio.removeAttribute("src"); // ✅ 기존 소스 제거 (중복 방지)
    audio.load(); // ✅ 강제로 리셋하여 기존 음악을 완전히 정지

    // ✅ 새로운 음악 소스 설정 후 로드
    audio.src = import.meta.env.BASE_URL + poem.music;
    audio.load();

    // ✅ 로드 완료 후 재생
    audio.addEventListener("canplaythrough", function playHandler() {
      audio.play().catch(error => console.error("자동 재생 실패:", error));
      audio.removeEventListener("canplaythrough", playHandler); // 이벤트 중복 방지
    });
  };

  // ✅ 랜덤 시 가져오기 (입장 시 & 랜덤 버튼 클릭 시)
  const getRandomPoem = () => {
    if (poems.length < 2) return;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * poems.length);
    } while (poems[randomIndex].id === poem?.id); // ✅ 중복 방지

    setIsFromList(false); // ✅ 랜덤 시 선택됨 (즉시 반영)
    setSelectedPoem(poems[randomIndex]); // ✅ App.tsx의 상태도 변경

    setTimeout(() => {
      setIsFromList(false); // ✅ 비동기 업데이트 보장
    }, 0);

    // playMusic(poems[randomIndex]);
  };

  // ✅ 다음 시 가져오기 (리스트 선택 후)
  const getNextPoem = () => {
    if (!poem || poems.length < 2) return;

    const currentIndex = poems.findIndex(p => p.id === poem.id);
    const nextIndex = (currentIndex + 1) % poems.length;

    setSelectedPoem(poems[nextIndex]); // ✅ App.tsx의 상태도 변경
    setIsFromList(true); // ✅ 리스트에서 선택됨

    setTimeout(() => {
      setIsFromList(true); // ✅ 비동기 업데이트 보장
    }, 0);

    // playMusic(poems[nextIndex]);
  };

  // ✅ 음소거 토글
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(audioRef.current.muted);
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
          {/* ✅ 오디오 태그 */}
          <audio ref={audioRef} autoPlay loop />

          <div className="poem_wrap">
            <div
              className={`close_bt_bg mobile left ${menuOpen ? "on" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            ></div>
            <div className={`poem_box left ${menuOpen ? "open" : ""}`}>
              <div className="mobile" onClick={() => setMenuOpen(!menuOpen)}>
                <p className="btn">
                  <RiArrowUpDoubleLine />
                </p>
              </div>
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
                  <button type="button" className="volume" onClick={toggleMute}>
                    {isMuted ? <IoVolumeMute /> : <IoVolumeMediumSharp />}
                    <strong>{isMuted ? "음소거 해제" : "음소거"}</strong>
                  </button>

                  <button
                    type="button"
                    className="fullscreen"
                    onClick={() => setIsPopupOpen(true)}
                  >
                    <AiOutlineFullscreen />
                    <strong>크게보기</strong>
                  </button>

                  {/* ✅ 버튼 상태 변경 */}
                  <button
                    type="button"
                    className="refresh"
                    onClick={isFromList ? getNextPoem : getRandomPoem}
                  >
                    <MdRefresh />
                    <strong>{isFromList ? "다음 시" : "다음 랜덤 시"}</strong>
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
                    {String(new Date(poem.date).getFullYear())}.
                    {String(new Date(poem.date).getMonth() + 1).padStart(
                      2,
                      "0"
                    )}
                    .{String(new Date(poem.date).getDate()).padStart(2, "0")}
                    <br /> - ㅊㅁ -
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {poem && isPopupOpen && (
        <Popup
          poem={poem}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          toggleMute={toggleMute}
          isMuted={isMuted}
        />
      )}
    </>
  );
};

export default Main;
