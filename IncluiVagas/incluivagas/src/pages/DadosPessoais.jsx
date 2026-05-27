import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import HeaderLogado from '../components/HeaderLogado';
import './DadosPessoais.css';

export default function DadosPessoais() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '', cpf: '', rg: '', estado: '', cidade: '',
    situacao: '', sexo: '', dataNascimento: '',
    endereco: '', nro: '', compl: '', bairro: '', cep: '',
    pais: 'Brasil', telefone: '', celular: '', email: '',
    formacao: ''
  });

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (active) setLoadingData(false);
        navigate('/login');
        return;
      }
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            nome: data.nome || '',
            cpf: data.cpf || '',
            rg: data.rg || '',
            estado: data.estado || '',
            cidade: data.cidade || '',
            situacao: data.situacao || '',
            sexo: data.sexo || '',
            dataNascimento: data.dataNascimento || '',
            endereco: data.endereco || '',
            nro: data.numero || '',
            compl: data.complemento || '',
            bairro: data.bairro || '',
            cep: data.cep || '',
            pais: data.pais || 'Brasil',
            telefone: data.telefone || '',
            celular: data.celular || '',
            email: data.email || '',
            formacao: data.formacao || ''
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        if (active) setLoadingData(false);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?ordenar=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error('Erro ao buscar estados:', err));
  }, []);

  useEffect(() => {
    if (formData.estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios?ordenar=nome`)
        .then(res => res.json())
        .then(data => setCidades(data))
        .catch(err => console.error('Erro ao buscar cidades:', err));
    } else {
      setCidades([]);
    }
  }, [formData.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstadoChange = (e) => {
    const novoEstado = e.target.value;
    setFormData(prev => ({ ...prev, estado: novoEstado, cidade: '' }));
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            estado: data.uf || '',
            cidade: data.localidade || ''
          }));
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
      }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) { navigate('/login'); return; }
      await updateDoc(doc(db, "usuarios", user.uid), {
        nome: formData.nome,
        cpf: formData.cpf,
        rg: formData.rg,
        estado: formData.estado,
        cidade: formData.cidade,
        situacao: formData.situacao,
        sexo: formData.sexo,
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
        numero: formData.nro,
        complemento: formData.compl,
        bairro: formData.bairro,
        cep: formData.cep,
        pais: formData.pais,
        telefone: formData.telefone,
        celular: formData.celular,
        email: formData.email,
        formacao: formData.formacao
      });
      alert('Dados atualizados com sucesso!');
      navigate('/perfil');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert('Erro ao salvar dados: ' + error.message);
    }
  };

  return (
    <div className="dados-container">
      <HeaderLogado titulo="IncluiVagas" voltarPara="/perfil" />

      <div className="dados-header">
        <button type="button" className="btn-voltar" onClick={() => navigate('/perfil')}>❮ VOLTAR</button>
        <h1>DADOS PESSOAIS</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {loadingData ? (
        <p className="dados-loading">Carregando...</p>
      ) : (
        <form className="dados-form" onSubmit={handleSalvar}>
          <h2>Dados Pessoais</h2>

          <div className="form-group full-width">
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group size-medium">
              <label>CPF:</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>RG:</label>
              <input type="text" name="rg" value={formData.rg} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>CEP:</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="00000-000" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group size-xlarge">
              <label>Endereço:</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
            </div>
            <div className="form-group size-small">
              <label>Nro:</label>
              <input type="text" name="nro" value={formData.nro} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>Compl.:</label>
              <input type="text" name="compl" value={formData.compl} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group size-large">
              <label>Bairro:</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>Estado:</label>
              <select name="estado" value={formData.estado} onChange={handleEstadoChange}>
                <option value="">Selecione...</option>
                {estados.map(est => (
                  <option key={est.id} value={est.sigla}>{est.sigla} - {est.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group size-large">
              <label>Cidade:</label>
              <select name="cidade" value={formData.cidade} onChange={handleChange} disabled={!formData.estado}>
                <option value="">{formData.estado ? "Selecione..." : "Escolha um estado primeiro"}</option>
                {formData.cidade && !cidades.find(c => c.nome === formData.cidade) && (
                  <option value={formData.cidade}>{formData.cidade}</option>
                )}
                {cidades.map(cid => (
                  <option key={cid.id} value={cid.nome}>{cid.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group size-medium">
              <label>Situação:</label>
              <input type="text" name="situacao" value={formData.situacao} onChange={handleChange} />
            </div>
            <div className="form-group size-small">
              <label>Sexo:</label>
              <input type="text" name="sexo" value={formData.sexo} onChange={handleChange} maxLength="1" />
            </div>
            <div className="form-group size-large">
              <label>Data de Nascimento:</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>País:</label>
              <input type="text" name="pais" value={formData.pais} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group size-medium">
              <label>Telefone:</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
            </div>
            <div className="form-group size-medium">
              <label>Celular:</label>
              <input type="text" name="celular" value={formData.celular} onChange={handleChange} />
            </div>
            <div className="form-group size-large">
              <label>E-mail:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Formação:</label>
            <textarea
              name="formacao"
              value={formData.formacao}
              onChange={handleChange}
              rows="4"
              placeholder="Descreva sua formação profissional..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={() => navigate('/perfil')}>
              CANCELAR
            </button>
            <button type="submit" className="btn-salvar">
              SALVAR
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
