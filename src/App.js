import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
      const pokemonData = await Promise.all(result.data.results.map(async (p) => {
        const res = await axios.get(p.url);
        return { 
          name: p.name, 
          image: res.data.sprites.front_default, 
          height: res.data.height,
          weight: res.data.weight,
          types: res.data.types.map(type => type.type.name).join(', '),
        };
      }));
      setPokemon(pokemonData);
    };
    fetchData();
  }, []);

  const filteredPokemon = pokemon.filter(p => p.name.includes(search.toLowerCase()));

  const handleCardClick = (p) => {
    setSelectedPokemon(p);
  };

  return (
    <div className="app p-6 flex">
      <div className="w-2/3 h-[calc(200vh-200px)] overflow-y-scroll">
        <h1 className="text-4xl font-bold mb-4 text-center bg-gray-300 p-8">Pokémon List</h1>
        <input 
          type="text" 
          placeholder="Search Pokémon" 
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          onChange={(e) => setSearch(e.target.value)} 
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredPokemon.map((p, index) => (
            <div 
              key={index} 
              className="card border rounded-lg shadow-lg p-6 bg-white cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => handleCardClick(p)}
            >
              <h3 className="text-xl font-semibold text-center">{p.name}</h3>
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-32 h-auto mx-auto mb-2"
              />
              <p className="text-center text-lg text-gray-700">{p.types}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/3 ml-4 flex-none" style={{ height: '400px', width: '400px', marginTop: '200px',marginLeft:'80px' }}>
        {selectedPokemon ? (
          <div className="border rounded-lg shadow-xl p-4 bg-white h-full">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">{selectedPokemon.name}</h2>
            <img 
              src={selectedPokemon.image} 
              alt={selectedPokemon.name} 
              className="w-48 h-auto mx-auto mb-4 rounded-lg shadow-md"
            />
            <p className="text-center text-lg text-gray-700"><strong>Height:</strong> {selectedPokemon.height}</p>
            <p className="text-center text-lg text-gray-700"><strong>Weight:</strong> {selectedPokemon.weight}</p>
            <p className="text-center text-lg text-gray-700"><strong>Types:</strong> {selectedPokemon.types}</p>
          </div>
        ) : (
          <div className="border rounded-lg shadow-xl p-6 bg-gray-100 text-center transition duration-300 ease-in-out transform hover:scale-105 h-full">
            <p className="text-lg text-gray-600">Select a Pokémon to see details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
