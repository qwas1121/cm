// ✅ **Poem 데이터 타입**
export interface Poem {
  id: number;
  title: string;
  content: string;
  bg?: string;
  img?: string;
  class: string;
  music?: string;
  date: string | Date;
  bg_black: boolean;
  category: { id: string; name: string }[];
}

// ✅ **Main 컴포넌트 Props 타입**
export interface MainProps {
  poems: Poem[];
  selectedPoem: Poem | null;
  setSelectedPoem: (poem: Poem) => void;
}

// ✅ **Header 컴포넌트 Props 타입**
export interface HeaderProps {
  poems: Poem[];
  onSelectPoem: (poem: Poem) => void;
}

// ✅ Input(텍스트, 체크박스) 변경 이벤트 타입
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

// ✅ 버튼 클릭 이벤트 타입
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

// ✅ 날짜 선택 (캘린더) 이벤트 타입
export type DateChangeEvent = Date | null;
