import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import HeaderLogado from '../components/HeaderLogado';
import './Perfil.css';

const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return '';
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
};

const getInitials = (nome) => {
  if (!nome) return '?';
  const parts = nome.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Perfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (active) setLoading(false);
        navigate('/login');
        return;
      }
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="perfil-container">
      <HeaderLogado titulo="IncluiVagas" voltarPara="/" />

      {loading ? (
        <p className="perfil-loading">Carregando...</p>
      ) : (
        <div className="perfil-card">

          {/* AVATAR */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar-wrapper">
              <div className="perfil-avatar-circle">
                <span className="perfil-avatar-initials">{getInitials(userData?.nome)}</span>
              </div>
            </div>
            <div className="perfil-info-basic">
              <h2 className="perfil-nome">{userData?.nome || 'Usuário'}</h2>
              {userData?.dataNascimento && (
                <p className="perfil-idade">{calcularIdade(userData.dataNascimento)} anos</p>
              )}
              <p className="perfil-localizacao">
                {[userData?.cidade, userData?.estado].filter(Boolean).join(', ') || '—'}
              </p>
            </div>
          </div>

          {/* BADGES */}
          <div className="perfil-badges">
            <span className="perfil-badge">{userData?.formacao || 'Formação'}</span>
            <span className="perfil-badge">{userData?.tipoDeficiencia || 'Tipo de deficiência'}</span>
            <span className="perfil-badge">{userData?.idiomaPrincipal || 'Idioma'}</span>
          </div>

          <hr className="perfil-divider" />

          {/* MENU ITEM 1 — Informações Pessoais */}
          <button className="perfil-menu-item" onClick={() => navigate('/dados-pessoais')}>
            <span className="perfil-menu-label">Informações Pessoais</span>
            <span className="perfil-menu-arrow">❯</span>
          </button>

          {/* MENU ITEM 2 — Meu Currículo */}
          <button className="perfil-menu-item" onClick={() => navigate('/meu-curriculo')}>
            <span className="perfil-menu-label">Meu Currículo</span>
            <span className="perfil-menu-arrow">❯</span>
          </button>

        </div>
      )}
    </div>
  );
}
