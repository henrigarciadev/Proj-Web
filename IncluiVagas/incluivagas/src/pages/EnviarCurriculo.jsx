import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import HeaderLogado from '../components/HeaderLogado';
import './EnviarCurriculo.css';

const getInitials = (nome) => {
  if (!nome) return '?';
  const parts = nome.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const capitalizar = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, c => c.toUpperCase());
};

export default function EnviarCurriculo() {
  const navigate = useNavigate();
  const { empresaId } = useParams();
  const [userData, setUserData] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

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
        console.error("Erro ao buscar dados do usuário:", err);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const handleEnviar = async () => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }

    setEnviando(true);
    try {
      await addDoc(collection(db, "candidaturas"), {
        usuarioId: user.uid,
        empresaId: empresaId,
        mensagem: mensagem,
        timestamp: new Date(),
        status: "enviado"
      });
      alert("Currículo enviado com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao enviar currículo:", error);
      alert("Erro ao enviar currículo: " + error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="enviar-container">
      <HeaderLogado titulo="IncluiVagas" />

      <div className="enviar-header">
        <button type="button" className="btn-voltar" onClick={() => navigate(-1)}>❮ VOLTAR</button>
        <div style={{ flex: 1 }}></div>
      </div>

      {loading ? (
        <p className="enviar-loading">Carregando...</p>
      ) : (
        <div className="enviar-card">

          <h2 className="enviar-empresa-nome">{capitalizar(empresaId)}</h2>

          <hr className="enviar-divider" />

          <h3 className="enviar-secao-titulo">Seus dados que serão enviados</h3>

          <div className="enviar-user-row">
            <div className="enviar-avatar-circle">
              <span className="enviar-avatar-initials">{getInitials(userData?.nome)}</span>
            </div>
            <div>
              <p className="enviar-user-nome">{userData?.nome || '—'}</p>
              <p className="enviar-user-sub">{userData?.formacao || '—'}</p>
            </div>
          </div>

          <div className="enviar-field-group">
            <span className="enviar-field-label">Cursos &amp; Habilidades</span>
            <div className="enviar-tags">
              {(userData?.habilidades || []).length > 0
                ? userData.habilidades.map((h, i) => (
                    <span key={i} className="enviar-tag">{h}</span>
                  ))
                : <span className="enviar-tag-empty">Nenhuma cadastrada</span>
              }
            </div>
          </div>

          <div className="enviar-field-group">
            <span className="enviar-field-label">Línguas</span>
            <div className="enviar-tags">
              {(userData?.linguas || []).length > 0
                ? userData.linguas.map((l, i) => (
                    <span key={i} className="enviar-tag">{l}</span>
                  ))
                : <span className="enviar-tag-empty">Nenhuma cadastrada</span>
              }
            </div>
          </div>

          <div className="enviar-field-group">
            <span className="enviar-field-label">Sobre mim</span>
            <p className="enviar-sobre-texto">
              {(() => {
                const texto = userData?.sobreMim || '';
                if (texto.length > 150) return texto.substring(0, 150) + '...';
                return texto || '—';
              })()}
            </p>
          </div>

          <hr className="enviar-divider" />

          <div className="enviar-field-group">
            <label className="enviar-field-label" htmlFor="mensagem-empresa">
              Mensagem para a empresa (opcional)
            </label>
            <textarea
              id="mensagem-empresa"
              className="enviar-textarea"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Escreva uma mensagem para a empresa (opcional)..."
              rows="4"
            />
          </div>

          <div className="enviar-actions">
            <button
              className="btn-enviar-curriculo"
              onClick={handleEnviar}
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : '📄 ENVIAR CURRÍCULO'}
            </button>
            <button
              type="button"
              className="btn-cancelar-envio"
              onClick={() => navigate(-1)}
            >
              CANCELAR
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
