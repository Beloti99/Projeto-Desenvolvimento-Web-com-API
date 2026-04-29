import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';

const PlantCard = ({ planta }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(planta.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Impede o clique de navegar caso estejamos encapsulando o card em um link no futuro
    toggleFavorite(planta.id);
  };

  return (
    <div className="plant-card">
      <button 
        className={`fav-btn ${favorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label="Toggle Favorite"
      >
        <Heart size={20} fill={favorite ? "currentColor" : "none"} />
      </button>

      <div className="card-img-wrapper">
        <img src={planta.imagem} alt={planta.nome} loading="lazy" />
      </div>
      
      <div className="plant-card-content">
        <div className="plant-card-header">
          <h3 className="plant-card-title">{planta.nome}</h3>
        </div>
        <p className="plant-card-subtitle">{planta.nomeCientifico}</p>
        
        <div className="plant-badges">
          <span className="badge">{planta.categoria}</span>
          <span className="badge badge-outline">{planta.luz}</span>
          {planta.dificuldade === 'Fácil' && <span className="badge badge-outline" style={{borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)'}}>Fácil cuidar</span>}
        </div>
        
        <Link to={`/plantas/${planta.id}`} className="btn-details">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default PlantCard;
