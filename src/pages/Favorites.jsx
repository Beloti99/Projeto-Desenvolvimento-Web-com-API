import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartCrack, ArrowLeft } from 'lucide-react';
import { fetchPlantas } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import PlantCard from '../components/PlantCard';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [plantasFav, setPlantasFav] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarFavoritos = async () => {
      setLoading(true);
      const dados = await fetchPlantas();
      const filtradas = dados.filter(p => favorites.includes(p.id));
      setPlantasFav(filtradas);
      setLoading(false);
    };
    carregarFavoritos();
  }, [favorites]);

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Link to="/" className="btn-back">
          <ArrowLeft size={20} /> Voltar ao Início
        </Link>
      </div>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Minhas Plantas Favoritas</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Plantas que você salvou para ver mais tarde.</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando favoritos...</p>
        </div>
      ) : plantasFav.length > 0 ? (
        <div className="plant-grid">
          {plantasFav.map(planta => (
            <PlantCard key={planta.id} planta={planta} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <HeartCrack size={64} />
          <h2>Nenhum favorito ainda</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>Você ainda não salvou nenhuma planta aos seus favoritos.</p>
          <Link to="/" className="btn-details" style={{ display: 'inline-block' }}>
            Explorar Plantas
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
