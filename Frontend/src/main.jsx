import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import UserContext from "./context/UserContext.jsx";
import SocketContext from "./context/SocketContext.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CaptainContext>
      <UserContext>
        <SocketContext>
            <App />
        </SocketContext>  
      </UserContext>
    </CaptainContext>
  </BrowserRouter>
);
