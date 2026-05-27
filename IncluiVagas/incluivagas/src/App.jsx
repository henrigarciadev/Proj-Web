import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Public header
import Header from './components/Header';

// Public pages
import Home from './pages/Home';
import Empresas from './pages/Empresas';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Configuracoes from './pages/Configuracao';

// Logged-in pages (each includes HeaderLogado internally)
import Perfil from './pages/Perfil';
import MeuCurriculo from './pages/MeuCurriculo';
import DadosPessoais from './pages/DadosPessoais';
import EnviarCurriculo from './pages/EnviarCurriculo';

// Layout for public pages: renders Header above the current page
function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES — with global Header via PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>

        {/* LOGGED ROUTES — no global Header; each page includes HeaderLogado internally */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/meu-curriculo" element={<MeuCurriculo />} />
        <Route path="/dados-pessoais" element={<DadosPessoais />} />
        <Route path="/enviar-curriculo/:empresaId" element={<EnviarCurriculo />} />
      </Routes>
    </Router>
  );
}

export default App;
