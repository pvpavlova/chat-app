import "./NavBar.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

export default function NavBar() {
  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <span className="logo">SPHERO</span>
      </div>
      <div className="navbar-center">
        <div className="search-bar">
          <SearchOutlinedIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search for friends, posts or videos"
            className="search-input"
          />
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
          <span className="navbar-link">TimeLine</span>
        </div>
        <div className="navbar-icons">
          <div className="navbar-icon-item">
            <PersonOutlineOutlinedIcon />
            <span className="navbar-icon-badge">1</span>
          </div>
           <div className="navbar-icon-item">
            <ChatOutlinedIcon />
            <span className="navbar-icon-badge">2</span>
          </div>
           <div className="navbar-icon-item">
            <NotificationsNoneOutlinedIcon />
            <span className="navbar-icon-badge">1</span>
          </div>
        </div>
        <img src="assets/logo.webp" alt="" className="navbar-img" />
      </div>
    </div>
  );
}
