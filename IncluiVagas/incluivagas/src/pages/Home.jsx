import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="main-page-wrapper theme-gradient">
      {/* Elementos decorativos de fundo (ondas/waves fluidas do seu design) */}
      <div className="bg-shape-top"></div>
      <div className="bg-shape-bottom"></div>

      <section className="hero-grid-layout">
        {/* Lado Esquerdo: Mensagem de Boas-vindas */}
        <div className="hero-text-side">
          <h1 className="hero-main-title">
            BEM-VINDO AO<br />
            <span className="brand-light-text">INCLUIVAGAS</span>
          </h1>
          <hr className="hero-decor-line" />
          <h2 className="hero-subtitle-text">AQUI VOCÊ PODE TUDO</h2>

          <Link to="/saibamais">
            <button className="saiba-mais-btn">SAIBA MAIS</button>
          </Link>
        </div>

        {/* Lado Direito: Container da Imagem */}
        <div className="hero-image-side">
          {/* Quando for colocar a imagem real, basta descomentar a linha abaixo: */}
          {/* <img src={mulher} alt="Pessoa trabalhando" className="hero-display-img" /> */}
          
          {/* Placeholder indicado (Ficará em branco com a borda sutil) */}
          <div className="image-empty-placeholder">
            <span>[ IMAGEM: mulher.png VAI AQUI ]</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;