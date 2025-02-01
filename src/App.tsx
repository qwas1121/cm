import { BrowserRouter, Route, Routes } from "react-router-dom";

import DarkModeToggle from "./components/ModeToggle";
import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";

import "./assets/css/main.css";
import "./assets/css/mode.css";

function App() {
  return (
    <>
      <BrowserRouter basename="/DaeChun">
        <DarkModeToggle />
        <Header></Header>
        <Routes>
          <Route path="/" element={<Main />}></Route>
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </>

    // <div>
    //   <Main />
    //   <Footer />
    // </div>
  );
}

export default App;
