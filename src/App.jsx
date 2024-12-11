import { Bounce, ToastContainer } from "react-toastify";
import Allroutes from "./allroutes/Allroutes";
import "./App.css";
import ThemeContext from "./utils/themeContext/ThemeContext";
import { useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/navbar/Navbar";

const App = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white ">
      <Navbar/>
      <Allroutes />

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme={`${theme == 'light' ? 'light': "dark"}`}
        transition={Bounce}
      />
    </div>
  );
};

export default App;
