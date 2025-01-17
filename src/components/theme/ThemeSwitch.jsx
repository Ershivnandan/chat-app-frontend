import { useContext } from "react";
import ThemeContext from "../../utils/themeContext/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded text-black text-2xl dark:text-white"
      >
        {theme === "light" ? <MdDarkMode /> : <MdLightMode />} 
      </button>
    </>
  );
};

export default ThemeSwitch;
