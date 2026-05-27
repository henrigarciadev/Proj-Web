import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Cadastro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '', cpf: '', rg: '', estado: '', cidade: '',
    situacao: '', sexo: '', dataNascimento: '',
    endereco: '', nro: '', compl: '', bairro: '', cep: '',
    pais: 'Brasil', telefone: '', celular: '', email: '',
    senha: '', 
    formacao: ''
  });

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Carrega todos os estados do Brasil ao iniciar a página
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?ordenar=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error('Erro ao buscar estados:', err));
  }, []);

  // Carrega as cidades sempre que o estado selecionado mudar
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Se mudar o estado manualmente, limpa a cidade anterior
  const handleEstadoChange = (e) => {
    const novoEstado = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      estado: novoEstado,
      cidade: '' 
    }));
  };

  // Busca por CEP integrada
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          // Atualiza o estado primeiro, o useEffect cuidará de carregar as cidades em seguida
          setFormData(prevState => ({
            ...prevState,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            estado: data.uf || '',
            cidade: data.localidade || '' // Atribui direto (a lista de cidades sincronizará pelo estado)
          }));
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
      }
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    
    if (!formData.senha || formData.senha.length < 6) {
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
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
        formacao: formData.formacao,
        createdAt: new Date()
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/login'); 
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert('Erro ao criar conta: ' + error.message);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-header">
        <button type="button" className="btn-voltar" onClick={() => navigate('/login')}>
          ❮ VOLTAR
        </button>
        <h1>CADASTRO</h1>
        <div style={{ width: '80px' }}></div> 
      </div>

      <form className="cadastro-form" onSubmit={handleEnviar}>
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

          {/* Menu de Seleção de Estado */}
          <div className="form-group size-medium">
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleEstadoChange}>
              <option value="">Selecione...</option>
              {estados.map(est => (
                <option key={est.id} value={est.sigla}>{est.sigla} - {est.nome}</option>
              ))}
            </select>
          </div>

          {/* Menu de Seleção de Cidade baseado no Estado */}
          <div className="form-group size-large">
            <label>Cidade:</label>
            <select name="cidade" value={formData.cidade} onChange={handleChange} disabled={!formData.estado}>
              <option value="">{formData.estado ? "Selecione..." : "Escolha um estado primeiro"}</option>
              {/* Garante que se o CEP trouxer uma cidade direta que ainda não carregou na lista, ela apareça selecionada */}
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
          <label>Senha de Acesso:</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
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
          <button type="button" className="btn-cancelar" onClick={() => navigate('/login')}>
            CANCELAR
          </button>
          <button type="submit" className="btn-enviar">
            ENVIAR
          </button>
        </div>
      </form>
    </div>
  );
}