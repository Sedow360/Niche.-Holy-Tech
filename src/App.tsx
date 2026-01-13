import PostPage from "./assets/PostPage.tsx";
import Archive from "./assets/Archive.tsx";
import AdminLogin from './assets/Admin.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostPage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
