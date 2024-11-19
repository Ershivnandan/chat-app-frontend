import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./utils/themeContext/ThemeContext";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
