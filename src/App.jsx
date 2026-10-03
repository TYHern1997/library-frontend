import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import AuthPage from './pages/authpage';
import NavBar from './components/navbar';
import UsersPage from './pages/userspage';
import ProfilePage from './pages/profilepage';



export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}