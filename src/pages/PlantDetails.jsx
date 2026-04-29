import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Sun, Clock, Tag, Heart, ShieldAlert, Sprout } from 'lucide-react';
import { fetchPlantaById } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';

const PlantDetails = () => {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const carregarPlanta = async () => {
      const dados = await fetchPlantaById(id);
      setPlanta(dados);
      setLoading(false);
    };
    carregarPlanta();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (!planta) {
    return (
      <div className="container empty-state" style={{ marginTop: '4rem' }}>
        <h2>Planta não encontrada.</h2>
        <Link to="/" className="btn-details" style={{ display: 'inline-block', marginTop: '2rem' }}>Voltar ao Início</Link>
      </div>
    );
  }

  const favorite = isFavorite(planta.id);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/" className="btn-back">
        <ArrowLeft size={20} /> Voltar para lista
      </Link>

      <div className="details-wrapper">
        <img src={planta.imagem} alt={planta.nome} className="details-image" />
        
        <div className="details-content">
          <div className="details-header">
            <div className="details-title">
              <h1>{planta.nome}</h1>
              <p className="details-subtitle">{planta.nomeCientifico}</p>
            </div>
            <button 
              className={`fav-btn ${favorite ? 'active' : ''}`}
              style={{ position: 'relative', top: '0', right: '0' }}
              onClick={() => toggleFavorite(planta.id)}
              aria-label="Toggle Favorite"
            >
              <Heart size={24} fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="plant-badges" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <span className="badge">{planta.categoria}</span>
            {planta.petFriendly && (
              <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                Pet Friendly 🐾
              </span>
            )}
            <span className="badge badge-outline">Dificuldade: {planta.dificuldade || 'Média'}</span>
          </div>

          <p className="details-description">{planta.descricao}</p>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon"><Tag size={20} /></div>
              <div className="info-content">
                <strong>Tipo</strong>
                <span>{planta.tipo}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><Droplet size={20} /></div>
              <div className="info-content">
                <strong>Regar</strong>
                <span>{planta.rega}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><Sun size={20} /></div>
              <div className="info-content">
                <strong>Luz Necessária</strong>
                <span>{planta.luz}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><Clock size={20} /></div>
              <div className="info-content">
                <strong>Ciclo de Vida</strong>
                <span>{planta.cicloDeVida}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><Sprout size={20} /></div>
              <div className="info-content">
                <strong>Cuidado</strong>
                <span>{planta.dificuldade || 'Média'}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><ShieldAlert size={20} /></div>
              <div className="info-content">
                <strong>Pet-friendly?</strong>
                <span>{planta.petFriendly ? 'Sim, seguro' : 'Não, tóxica'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
