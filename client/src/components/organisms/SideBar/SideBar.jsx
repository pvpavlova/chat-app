import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  VerifiedUser,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <li className="sidebarListItem">
              <VerifiedUser className="sidebarIcon" />
              <span>Профиль</span>
            </li>
          </Link>
            <Link to="/main" style={{ textDecoration: "none", color: "inherit" }}><li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span>Лента</span>
          </li></Link>
          
          <Link to="/chat" style={{ textDecoration: "none", color: "inherit" }}>
            <li className="sidebarListItem">
              <Chat className="sidebarIcon" />
              <span>Сообщения</span>
            </li>
          </Link>
          <Link to="/gallery" style={{ textDecoration: "none", color: "inherit" }}>
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span>Фотографии</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
