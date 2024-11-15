import Root from "./Root";
import HomePage from "./components/pages/HomePage/HomePage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import RegistrationPage from "./components/pages/RegistrationPage/RegistrationPage";
import { useState } from 'react';
import { useEffect } from 'react';
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import ProtectedRoute from './services/HOC/ProtectedRoute'
import axiosInstance, { setAccessToken } from './services/axiosInstance';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ChatPage from "./components/pages/ChatPage/ChatPage";
import GalleryPage from "./components/pages/GalleryPage/GalleryPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosInstance.get(`${import.meta.env.VITE_API}/token/refresh`)
      .then((res) => {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  
   const router = createBrowserRouter([
   {
      path: '/',
      element: <Root user={user} setUser={setUser} />,
      children: [
        {
          path: '/',
          element:  user ? <Navigate to="/main" /> : <Navigate to="/signin" />,
        },
        {
          path: '/signin',
          element: <LoginPage setUser={setUser} />,
        },
        {
          path: '/signup',
          element: <RegistrationPage setUser={setUser} />,
        }, 
        {
          path: '/main',
          element: (
            <ProtectedRoute isAllowed={user !== null}>
              <HomePage  user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: '/chat',
          element: (
            <ProtectedRoute isAllowed={user !== null}>
              <ChatPage  user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute isAllowed={user !== null}>
              <ProfilePage  user={user} />
            </ProtectedRoute>
          ),
        },
         {
          path: '/gallery',
          element: (
            <ProtectedRoute isAllowed={user !== null}>
              <GalleryPage  user={user} />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
if (loading) return <div>Loading...</div>; 
  return <RouterProvider router={router} />;
}
