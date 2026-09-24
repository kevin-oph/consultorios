import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import PatientsTable from './components/PatientsTable';
import { Loader2, AlertCircle, Filter, RefreshCw } from 'lucide-react';

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros (por defecto en 'TODOS' para ver el universo completo)
  const [selectedMunicipio, setSelectedMunicipio] = useState('TODOS');
  const [selectedColonia, setSelectedColonia] = useState('TODAS');

  useEffect(() => {
    fetch('/data/datos_consultorios.json')
      .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo de datos.');
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        // Mostramos todo el universo de datos por defecto para tener visibilidad total
        setFilteredData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar los datos:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Efecto para aplicar los filtros dinámicamente
  useEffect(() => {
    if (data.length === 0) return;

    let result = data;

    if (selectedMunicipio !== 'TODOS') {
      result = result.filter(item => (item.MUNICIPIO || 'NO CAPTURADO').toUpperCase() === selectedMunicipio);
    }

    if (selectedColonia !== 'TODAS') {
      result = result.filter(item => (item.COLONIA || 'NO CAPTURADO').toUpperCase() === selectedColonia);
    }

    setFilteredData(result);
  }, [selectedMunicipio, selectedColonia, data]);

  // Obtener listas únicas para los selectores (incluyendo "NO CAPTURADO")
  const municipiosList = ['TODOS', ...new Set(data.map(item => (item.MUNICIPIO || 'NO CAPTURADO').toUpperCase()))].sort();
  
  const coloniasList = ['TODAS', ...new Set(
    data
      .filter(item => selectedMunicipio === 'TODOS' || (item.MUNICIPIO || 'NO CAPTURADO').toUpperCase() === selectedMunicipio)
      .map(item => (item.COLONIA || 'NO CAPTURADO').toUpperCase())
  )].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-blue-900">
        <Loader2 className="animate-spin mb-3" size={48} />
        <p className="font-semibold text-lg">Cargando inteligencia territorial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-600">
        <AlertCircle size={48} className="mb-3" />
        <p className="font-bold text-lg">Ocurrió un error</p>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* BARRA DE FILTROS TERRITORIALES */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                <Filter size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Filtro Territorial y Operativo</h3>
                <p className="text-xs text-gray-500">Visualiza el total estatal, municipal, foráneos y registros sin captura</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Selector de Municipio */}
              <div className="flex flex-col text-xs">
                <label className="font-semibold text-gray-600 mb-1">Municipio:</label>
                <select 
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedMunicipio}
                  onChange={(e) => {
                    setSelectedMunicipio(e.target.value);
                    setSelectedColonia('TODAS');
                  }}
                >
                  {municipiosList.map((mun, idx) => (
                    <option key={idx} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>

              {/* Selector de Colonia */}
              <div className="flex flex-col text-xs">
                <label className="font-semibold text-gray-600 mb-1">Colonia / Localidad:</label>
                <select 
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none max-w-xs"
                  value={selectedColonia}
                  onChange={(e) => setSelectedColonia(e.target.value)}
                >
                  {coloniasList.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Botón de limpiar filtros */}
              <button 
                onClick={() => {
                  setSelectedMunicipio('TODOS');
                  setSelectedColonia('TODAS');
                }}
                className="mt-4 md:mt-0 flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                title="Mostrar todo"
              >
                <RefreshCw size={14} />
                <span>Ver Todo</span>
              </button>
            </div>
          </div>
        </div>

        {/* MÉTRICAS (KPIs) DINÁMICAS */}
        <KPICards data={filteredData} />

        {/* GRÁFICAS */}
        <ChartsSection data={filteredData} />

        {/* TABLA DETALLADA DE CONTACTO */}
        <PatientsTable data={filteredData} />

      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        Municipio de Emiliano Zapata &bull; Dirección de Sistemas y Desarrollo Tecnológico © 2026
      </footer>
    </div>
  );
}