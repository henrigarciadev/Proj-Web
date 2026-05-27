import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo linkada para voltar para a Home */}
        <Link to="/" className="header-logo">
          <span className="logo-u">Û</span>ncluiVagas
        </Link>

        {/* Menu de Navegação */}
        <nav className="header-nav">
          <Link to="/" className="nav-item">HOME</Link>
          <Link to="/empresas" className="nav-item">EMPRESAS</Link>
          <Link to="/servicos" className="nav-item">SERVIÇOS</Link>
          <Link to="/login" className="btn-login-header">LOGIN</Link>
        </nav>
      </div>
    </header>
  );
}