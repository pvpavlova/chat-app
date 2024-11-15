import "./NavBar.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance, { setAccessToken } from "../../../services/axiosInstance";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API}/auth/logout`
    ); 
     localStorage.removeItem('user');
    if (response.status === 200) {
      setUser(null);
      setAccessToken("");
      navigate("/signin");
    }
  };

  const handleHomeClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/signin");
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <Link to="/" onClick={handleHomeClick}>
          <span className="logo">SPHERO</span>
        </Link>
      </div>
      <div className="navbar-center">
        <div className="search-bar">
          <SearchOutlinedIcon className="search-icon" />
          <input type="text" placeholder="" className="search-input" />
        </div>
      </div>
      <div className="navbar-right">
        {user?.email ? (
          <>
            <Link to="/profile" className="link"><img src="assets/logo.webp" alt="Profile" className="navbar-img" /></Link>  
            <span onClick={logoutHandler} className="exit">
              Выйти
            </span>
          </>
        ) : (
          <>
            <Link to="/signin" className="exit">
              Войти
            </Link>
           
          </>
        )}
      </div>
    </div>
  );
}
