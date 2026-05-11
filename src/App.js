import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FormLayanan from './components/FormLayanan';
import AdminRegister from './components/AdminRegister';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar Sederhana */}
        <nav className="bg-green-700 text-white shadow-lg p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">DLH BOMBANA - LAYANAN DIGITAL</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Beranda / Form</Link>
              <Link to="/admin" className="hover:underline text-yellow-300">Panel Petugas</Link>
            </div>
          </div>
        </nav>

        {/* Area Konten Utama */}
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<FormLayanan />} />
            <Route path="/admin" element={<AdminRegister />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-10">
          <p>&copy; 2026 Dinas Lingkungan Hidup Kabupaten Bombana</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

