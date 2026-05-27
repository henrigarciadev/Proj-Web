import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import HeaderLogado from '../components/HeaderLogado';
import './MeuCurriculo.css';

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

const MeuCurriculo = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sobreMimExpandido, setSobreMimExpandido] = useState(false);

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
        console.error("Erro ao buscar currículo:", err);
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
    <div className="curriculo-container">
      <HeaderLogado titulo="IncluiVagas" voltarPara="/perfil" />

      {loading ? (
        <p className="curriculo-loading">Carregando...</p>
      ) : (
        <div className="curriculo-card">

          {/* TOP ROW: avatar + name info + edit button */}
          <div className="curriculo-top-row">
            <div className="curriculo-avatar-circle">
              <span className="curriculo-avatar-initials">{getInitials(userData?.nome)}</span>
            </div>
            <div className="curriculo-top-info">
              <h2 className="curriculo-nome">{userData?.nome || 'Usuário'}</h2>
              {userData?.dataNascimento && (
                <p className="curriculo-sub">{calcularIdade(userData.dataNascimento)} anos</p>
              )}
              <p className="curriculo-sub">{userData?.formacao || '—'}</p>
            </div>
            <button className="curriculo-btn-editar" onClick={() => navigate('/dados-pessoais')}>
              ✏️ Editar
            </button>
          </div>

          <hr className="curriculo-divider" />

          {/* FIELDS — label above value pattern */}
          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Nome</span>
            <span className="curriculo-field-value">{userData?.nome || '—'}</span>
          </div>

          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Idade</span>
            <span className="curriculo-field-value">
              {userData?.dataNascimento ? `${calcularIdade(userData.dataNascimento)} anos` : '—'}
            </span>
          </div>

          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Formação</span>
            <span className="curriculo-field-value">{userData?.formacao || '—'}</span>
          </div>

          {/* TAGS — Cursos */}
          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Cursos &amp; Habilidades</span>
            <div className="curriculo-tags">
              {(userData?.habilidades || []).length > 0
                ? userData.habilidades.map((h, i) => (
                    <span key={i} className="curriculo-tag">{h}</span>
                  ))
                : <span className="curriculo-tag-empty">Nenhuma cadastrada</span>
              }
            </div>
          </div>

          {/* TAGS — Línguas */}
          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Línguas</span>
            <div className="curriculo-tags">
              {(userData?.linguas || []).length > 0
                ? userData.linguas.map((l, i) => (
                    <span key={i} className="curriculo-tag">{l}</span>
                  ))
                : <span className="curriculo-tag-empty">Nenhuma cadastrada</span>
              }
            </div>
          </div>

          {/* Sobre mim — truncated with "Veja mais" */}
          <div className="curriculo-field-group">
            <span className="curriculo-field-label">Sobre mim</span>
            {(() => {
              const texto = userData?.sobreMim || '';
              const truncado = texto.length > 150;
              const exibido = sobreMimExpandido || !truncado
                ? texto || '—'
                : texto.substring(0, 150) + '...';
              return (
                <p className="curriculo-sobre-texto">
                  {exibido}
                  {truncado && (
                    <button
                      className="curriculo-btn-veja-mais"
                      onClick={() => setSobreMimExpandido(!sobreMimExpandido)}
                    >
                      {sobreMimExpandido ? ' Ver menos' : ' Veja mais'}
                    </button>
                  )}
                </p>
              );
            })()}
          </div>

        </div>
      )}
    </div>
  );
};

export default MeuCurriculo;
