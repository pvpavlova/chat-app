
import Feed from "../../organisms/Feed/Feed";
import"./HomePage.css"

import SideBar from '../../organisms/SideBar/SideBar';

export default function HomePage({user}) {
  return (
    <>
    <div className="home-container">
          <SideBar></SideBar>
          <Feed  user={user} ></Feed>
    </div>

  </>)
}
