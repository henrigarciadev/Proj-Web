import React from "react";
import { Link } from "react-router-dom";
import "./Empresas.css";

function Empresas() {
  return (
    <div className="main-page-wrapper theme-gradient">
      {/* Mantendo as mesmas ondas decorativas no fundo para consistência de design */}
      <div className="bg-shape-top"></div>
      <div className="bg-shape-bottom"></div>

      <div className="empresas-page-content">
        <section className="empresas-section-title">
          <h1>VEJA ABAIXO AS EMPRESAS PARCEIRAS!</h1>
        </section>

        <section className="hero-grid-layout">
          {/* Lado Esquerdo: Lista de Empresas */}
          <div className="hero-text-side">
            <div className="companies-header-row">
              <div className="company-badge-icon">🏢</div>
              <div>
                <h2 className="companies-main-subtitle">EMPRESAS PARCEIRAS</h2>
                <p className="ficticious-alert-text">As empresas citadas são fictícias</p>
              </div>
            </div>

            <ul className="companies-bullet-list">
              <li><Link to="/enviar-curriculo/coppardi">Coppardi</Link> –</li>
              <li>Curnnal –</li>
              <li>Ackevane –</li>
              <li>...</li>
            </ul>

            <div className="companies-footer-actions">
              <Link to="/visualizar-mais" className="view-more-link">
                Visualizar mais empresas
              </Link>
              
              <h3 className="interest-prompt-text">Se interessou em alguma?</h3>
              <p className="login-instruction-text">
                Faça o <Link to="/login" className="login-inline-link">Login</Link> e entre em contato!
              </p>
            </div>
          </div>

          {/* Lado Direito: Espaço para a Imagem das Empresas */}
          <div className="hero-image-side">
            {/* Quando for reativar a imagem real das empresas (hero.png): */}
            {/* <img src={empresaImg} alt="Empresas parceiras" className="hero-display-img" /> */}
            
            {/* Placeholder indicado em branco */}
            <div className="image-empty-placeholder">
              <span>[ IMAGEM: hero.png (Ilustração Cadeira de Rodas) VAI AQUI ]</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Empresas;