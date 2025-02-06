import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

import { IoCloseCircle } from "react-icons/io5";
import { InputChangeEvent, Poem } from "../types/types";

import categoryDate from "../assets/category.json";

interface SearchProps {
  poems: Poem[];
  setFilteredPoems: (poems: Poem[]) => void;
}

const Search: React.FC<SearchProps> = ({ poems, setFilteredPoems }) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [searchText, setSearchText] = useState<string>(""); // 🔍 검색어
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 📅 선택된 날짜
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // ☑️ 선택된 카테고리
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false); // 📅 달력 표시 여부

  useEffect(() => {
    setCategories(categoryDate);
  }, []);

  // ✅ 검색어 입력 핸들러
  const handleSearchChange = (e: InputChangeEvent) => {
    setSearchText(e.target.value);
  };

  // ✅ 체크박스 선택 핸들러
  const handleCategoryChange = (e: InputChangeEvent) => {
    const value = e.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(cat => cat !== value)
        : [...prev, value]
    );
  };

  // ✅ FullCalendar에 표시할 이벤트 (시가 있는 날짜)
  const calendarEvents = poems.map(poem => ({
    start: poem.date, // 시가 있는 날짜
    display: "dots", // 날짜를 강조하는 배경 스타일
  }));

  // ✅ 날짜 입력
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  const clearDate = () => {
    setSelectedDate(null);
    setIsCalendarOpen(false);
  };
  const renderDayCell = (arg: { date: Date }) => {
    return { html: arg.date.getDate().toString() };
  };
  const handleDateClick = (info: DateClickArg) => {
    // console.log("📅 클릭한 날짜:", info.date);

    // ✅ 로컬 시간 변환
    const localDate = new Date(
      info.date.getTime() - info.date.getTimezoneOffset() * 60000
    );

    setSelectedDate(localDate); // ✅ string → Date 타입으로 저장
    setIsCalendarOpen(false);
  };

  // ✅ FullCalendar 설정
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    headerToolbar: {
      left: "title",
      right: "prev,next",
    },
    height: "auto",
    initialView: "dayGridMonth",
    locale: "ko",
    weekends: true,
    fixedWeekCount: false,
    dayCellContent: renderDayCell,
    titleFormat: {
      year: "numeric",
      month: "long",
    } as Intl.DateTimeFormatOptions,
    dateClick: handleDateClick,
    events: calendarEvents,
  };

  // ✅ 초기화 버튼 핸들러
  const handleReset = () => {
    setSearchText("");
    setSelectedDate(null);
    setSelectedCategories([]);
    setFilteredPoems(poems);
  };

  // ✅ 필터링 적용
  useEffect(() => {
    let filtered = poems;

    // 🔍 검색어 필터링
    if (searchText) {
      filtered = filtered.filter(
        poem =>
          poem.title.includes(searchText) || poem.content.includes(searchText)
      );
    }

    // 📅 날짜 필터링
    if (selectedDate) {
      filtered = filtered.filter(
        poem =>
          new Date(poem.date).toDateString() === selectedDate.toDateString()
      );
    }

    // ☑️ 카테고리 필터링
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(poem =>
        poem.category.some(cat => selectedCategories.includes(cat.id))
      );
    }

    setFilteredPoems(filtered); // ✅ 필터링된 결과 적용
  }, [searchText, selectedDate, selectedCategories, poems, setFilteredPoems]);

  return (
    <div className="search_box">
      <div className="hd_logo">
        <div className="logo_img"></div>
      </div>
      {/* ✅ 초기화 버튼 */}
      <div className="sch_title">
        <p>원하는 시를 검색해 보세요.</p>
        <button type="button" onClick={handleReset}>
          초기화
        </button>
      </div>
      <div className="search_inner">
        {/* 🔍 검색 입력 */}
        <div className="sch_text">
          <div className="input_wrap">
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchText}
              onChange={handleSearchChange}
            />
            {searchText && (
              <button className="clear_btn" onClick={() => setSearchText("")}>
                <IoCloseCircle />
              </button>
            )}
          </div>
        </div>

        {/* 📅 캘린더 */}
        <div className="sch_cal">
          <div className="input_wrap">
            <input
              type="text"
              readOnly
              value={
                selectedDate ? selectedDate.toISOString().split("T")[0] : ""
              }
              placeholder="날짜를 선택하세요."
              onClick={toggleCalendar}
            />
            {selectedDate && (
              <button className="clear_btn" onClick={clearDate}>
                <IoCloseCircle />
              </button>
            )}
          </div>
          {isCalendarOpen && (
            <div className="main_calendar">
              <FullCalendar {...calendarOptions} />
            </div>
          )}
        </div>

        {/* ☑️ 카테고리 필터 */}
        <ul className="cate_list">
          {categories.map(category => (
            <li key={category.id}>
              <p
                className={`checkbox ${category.id}`}
                ref={el => {
                  if (el) {
                    el.style.setProperty(
                      "--category-color",
                      `var(--${category.id})`
                    );
                  }
                }}
              >
                <input
                  type="checkbox"
                  value={category.id}
                  id={`check_${category.id}`}
                  onChange={handleCategoryChange}
                  checked={selectedCategories.includes(category.id)}
                />
                <label htmlFor={`check_${category.id}`}>{category.name}</label>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
