import { Link } from "react-router-dom";
import ThemeSwitch from "../theme/ThemeSwitch";

const Navbar = () => {
  return (
    <div className="pt-5">
      <nav className="flex justify-between py-1 border border-black dark:border-white px-10 mx-5 rounded-full t-2 items-center">
        <div className="flex text-center items-center flex-col p-1">
          <img className="w-8" src="/logo.png" alt="" />
          <p className="font-extrabold text-gray-700 dark:text-gray-200  text-base">
            S <span className="font-medium text-gray-500">chat</span>
          </p>
        </div>
        <div className="flex justify-center gap-2 items-center">
            <ul className="flex gap-4 cursor-pointer font-medium">
                <li>About</li>
                <Link to={'/login'}><li>Login</li></Link>
            </ul>
          <ThemeSwitch />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
