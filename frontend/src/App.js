// import logo from "./logo.svg";
import "./App.css";
import React from "react";
// import { Button, ButtonGroup } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Homepages from "./pages/Homepages";
import ChatPages from "./pages/ChatPages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepages />} />
        <Route path="/chat" element={<ChatPages />} />
      </Routes>
    </div>
  );
}

export default App;
