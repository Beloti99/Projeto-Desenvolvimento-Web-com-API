import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchPlantas } from '../services/api';
import PlantCard from '../components/PlantCard';

const Category = () => {
  const { nome } = useParams();
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPlantas = async () => {
      setLoading(true);
      const dados = await fetchPlantas();
      // Filtrar plantas onde a categoria seja igual ou contenha o nome da URL
      const filtradas = dados.filter(p => 
        p.categoria.toLowerCase() === nome.toLowerCase() || 
        p.categoria.toLowerCase().includes(nome.toLowerCase().replace('s', ''))
      );
      setPlantas(filtradas);
      setLoading(false);
    };
    carregarPlantas();
  }, [nome]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/" className="btn-back" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Voltar ao Início
      </Link>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{nome}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore nossa coleção de plantas desta categoria.</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando plantas...</p>
        </div>
      ) : (
        <div className="plant-grid">
          {plantas.length > 0 ? (
            plantas.map(planta => (
              <PlantCard key={planta.id} planta={planta} />
            ))
          ) : (
            <div className="empty-state">
              <h2>Nenhuma planta encontrada</h2>
              <p>Não encontramos nenhuma planta nesta categoria no momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;
