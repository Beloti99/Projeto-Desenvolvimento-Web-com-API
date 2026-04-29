import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import PlantDetails from './pages/PlantDetails';
import Favorites from './pages/Favorites';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categoria/:nome" element={<Category />} />
              <Route path="/plantas/:id" element={<PlantDetails />} />
              <Route path="/favoritos" element={<Favorites />} />
            </Routes>
          </main>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
