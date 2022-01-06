import React, { useEffect} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { setAccessToken } from './accessToken';
import Bye from './pages/Bye';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {

  useEffect(() => {
    fetch("http://localhost:3001/refresh_token",
      {
        method: 'POST',
        credentials: 'include'
      }
    )
    .then(async x => {
      const {accessToken} = await x.json();
      console.log({accessToken})
      setAccessToken(accessToken);
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <div>
          <header>
            <div>
            <div><Link to='/'>Home</Link></div>
              <div><Link to='/register'>Register</Link></div>
              <div><Link to='/login'>Login</Link></div>
              <div><Link to='/bye'>Bye</Link></div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bye" element={<Bye />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}


