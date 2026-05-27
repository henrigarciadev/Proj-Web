import React, { useState } from 'react';
import './Configuracao.css';

// Importação dos ícones salvos na pasta assets
import televisionIcon from '../assets/television.png';
import speakerIcon from '../assets/speaker-filled-audio-tool.png';
import bellIcon from '../assets/bell.png';
import shareIcon from '../assets/share.png';
import telephoneIcon from '../assets/telephone-handle-silhouette.png';

export default function Configuracoes() {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

  const itensMenu = [
    {
      id: 'video',
      titulo: 'Vídeo',
      descricao: 'Ajustar brilho, luz noturna e exibição das imagens',
      icone: televisionIcon,
    },
    {
      id: 'som',
      titulo: 'Som',
      descricao: 'Níveis de volume, saída, entrada e dispositivos',
      icone: speakerIcon,
    },
    {
      id: 'notificacoes',
      titulo: 'Notificações',
      descricao: 'Alertar sobre contratos ou entrevistas disponíveis',
      icone: bellIcon,
    },
    {
      id: 'dados',
      titulo: 'Compartilhamento de dados',
      descricao: 'Ajustar dados que deseja compartilhar ou ocultar',
      icone: shareIcon,
    },
    {
      id: 'denuncia',
      titulo: 'Denúncia',
      descricao: 'Entre em contato com autoridades caso haja descumprimento',
      icone: telephoneIcon,
    },
  ];

  const handleCliqueItem = (id) => {
    setOpcaoSelecionada(id);
    console.log(`Configuração selecionada: ${id}`);
  };

  return (
    <div className="config-container">
      <div className="config-box">
        <h1 className="config-title">CONFIGURAÇÕES</h1>
        <p className="config-subtitle">Gerencie suas preferências de acessibilidade e sistema</p>
        
        <div className="menu-config">
          {itensMenu.map((item) => (
            <div 
              key={item.id} 
              className={`item-config ${opcaoSelecionada === item.id ? 'ativo' : ''}`}
              onClick={() => handleCliqueItem(item.id)}
            >
              <div className="icone-container-config">
                <img src={item.icone} alt={`Ícone de ${item.titulo}`} className="icone-config" />
              </div>
              <div className="texto-config">
                <h2>{item.titulo}</h2>
                <p>{item.descricao}</p>
              </div>
              <div className="seta-indicadora">❯</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}