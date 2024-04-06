import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./page/Home";
import "./App.css";
import Chat from "./page/Chat";
import { useEffect } from "react";
import { cookiesStore } from "./lib/utils.lb";
import { AppConstants } from "./lib/constants";

export function Router() {
  const user = cookiesStore.get({ key: AppConstants.cookieKeys.TOKEN });
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, []);
  return (
    <div className="app">
      <Routes>
        <Route key={"login"} path="/" element={<Home />} />
        <Route key={"chat"} path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}