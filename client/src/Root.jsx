import { Outlet } from 'react-router-dom';
import Navbar from './components/organisms/NavBar/NavBar';

export default function Root({ user, setUser }) {
  return (
    <>
      <Navbar  user={user} setUser={setUser} />

      <div>
        <Outlet />
      </div>
    </>
  );
}
