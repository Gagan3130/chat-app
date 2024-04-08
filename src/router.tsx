import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./page/Home";
import "./App.css";
import Chat from "./page/Chat";
import { useEffect } from "react";
import { cookiesStore } from "./lib/utils.lb";
import { AppConstants } from "./lib/constants";
import ChatContextProvider from "./context/chatProvider";

export function Router() {
  const user = cookiesStore.get({ key: AppConstants.cookieKeys.TOKEN });
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [location]);
  return (
    <div className="app">
      <Routes>
        <Route key={"login"} path="/" element={<Home />} />
        <Route
          key={"chat"}
          path="/chat"
          element={
            <ChatContextProvider>
              <Chat />
            </ChatContextProvider>
          }
        />
      </Routes>
    </div>
  );
}
