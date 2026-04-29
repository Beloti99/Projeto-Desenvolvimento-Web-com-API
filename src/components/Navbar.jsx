import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Moon, Sun, Heart, TreePine, Flower2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  return (
    <nav className="navbar glass">
      <Link to="/" className="logo">
        <Leaf size={28} />
        GuiaPaisagismo
      </Link>
      <div className="navbar-links">
        <Link to="/">Início</Link>
        <Link to="/categoria/Árvores" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TreePine size={18} /> Árvores
        </Link>
        <Link to="/categoria/Flores" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Flower2 size={18} /> Flores
        </Link>
        <Link to="/categoria/Folhagens" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Leaf size={18} /> Folhagens
        </Link>
        <Link to="/favoritos" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Heart size={20} fill={favorites.length > 0 ? "var(--danger)" : "none"} color={favorites.length > 0 ? "var(--danger)" : "currentColor"} />
          {favorites.length > 0 && <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>({favorites.length})</span>}
        </Link>

        <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
