import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TreePine, Flower2, Leaf } from 'lucide-react';
import { fetchPlantas } from '../services/api';
import PlantCard from '../components/PlantCard';

const Home = () => {
  const [plantas, setPlantas] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroLuz, setFiltroLuz] = useState('Todas');
  const [filtroRega, setFiltroRega] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPlantas = async () => {
      const dados = await fetchPlantas();
      setPlantas(dados);
      setLoading(false);
    };
    carregarPlantas();
  }, []);

  const categorias = ["Árvores", "Flores", "Folhagens"];

  const plantasFiltradas = plantas.filter(planta => {
    const matchBusca = planta.nome.toLowerCase().includes(busca.toLowerCase());
    const matchLuz = filtroLuz === 'Todas' || planta.luz.includes(filtroLuz);
    const matchRega = filtroRega === 'Todas' || planta.rega === filtroRega;
    return matchBusca && matchLuz && matchRega;
  });

  return (
    <>
      <section className="hero">
        <h1>Transforme Seu Espaço</h1>
        <p>Descubra a planta perfeita para sua casa ou jardim com o nosso guia completo. Filtre por necessidades, dificuldades e encontre sua próxima paixão verde.</p>
      </section>

      <div className="container">
        <div className="filters-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Qual planta você está procurando?" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="advanced-filters">
            <select 
              className="filter-select" 
              value={filtroLuz} 
              onChange={(e) => setFiltroLuz(e.target.value)}
            >
              <option value="Todas">Luz: Qualquer</option>
              <option value="Sol Pleno">Sol Pleno</option>
              <option value="Meia-sombra">Meia-sombra</option>
              <option value="Sombra">Sombra</option>
            </select>

            <select 
              className="filter-select" 
              value={filtroRega} 
              onChange={(e) => setFiltroRega(e.target.value)}
            >
              <option value="Todas">Rega: Qualquer</option>
              <option value="Baixa">Baixa (Pouca água)</option>
              <option value="Moderada">Moderada</option>
              <option value="Frequente">Frequente (Muita água)</option>
            </select>
            
            {/* Atalhos para categorias */}
            {categorias.map(cat => {
              const catIcons = {
                'Árvores': <TreePine size={16} />,
                'Flores': <Flower2 size={16} />,
                'Folhagens': <Leaf size={16} />
              };
              return (
                <button 
                  key={cat} 
                  className="filter-select"
                  style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-secondary)', border: 'none', paddingRight: '1.5rem', backgroundImage: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => navigate(`/categoria/${cat}`)}
                >
                  {catIcons[cat]} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando plantas...</p>
          </div>
        ) : (
          <div className="plant-grid">
            {plantasFiltradas.length > 0 ? (
              plantasFiltradas.map(planta => (
                <PlantCard key={planta.id} planta={planta} />
              ))
            ) : (
              <div className="empty-state">
                <h2>Nenhuma planta encontrada</h2>
                <p>Tente ajustar os filtros ou os termos da busca.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
