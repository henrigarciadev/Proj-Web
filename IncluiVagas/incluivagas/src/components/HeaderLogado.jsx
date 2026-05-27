import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HeaderLogado.css';

export default function HeaderLogado({ titulo = "IncluiVagas", voltarPara }) {
  const navigate = useNavigate();

  const handleVoltar = () => {
    if (voltarPara) {
      navigate(voltarPara);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="header-logado">
      <div className="hl-left">
        <button className="hl-back-btn" onClick={handleVoltar} aria-label="Voltar">❮</button>
        <span className="hl-titulo">{titulo}</span>
      </div>

      <div className="hl-center">
        <div className="hl-search-bar">
          <span className="hl-search-icon">🔍</span>
          <span className="hl-search-placeholder">Pesquisar</span>
        </div>
      </div>

      <div className="hl-right">
        <Link to="/perfil" className="hl-icon-btn" title="Meu currículo">📄</Link>
        <button className="hl-icon-btn" title="Menu">⋮</button>
        <Link to="/perfil" className="hl-avatar" title="Meu perfil">
          <span className="hl-avatar-initials">?</span>
        </Link>
      </div>
    </header>
  );
}
