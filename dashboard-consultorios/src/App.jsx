import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import PatientsTable from './components/PatientsTable';
import MedicamentosTable from './components/MedicamentosTable';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMunicipio, setSelectedMunicipio] = useState('TODOS');
  const [selectedColonia, setSelectedColonia] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar el JSON de datos procesados
  useEffect(() => {
    fetch('/data/datos_consultorios.json')
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando los datos:', err);
        setLoading(false);
      });
  }, []);

  // Obtener listas únicas para los filtros desplegables
  const municipios = useMemo(() => {
    const setM = new Set(data.map(item => item.MUNICIPIO).filter(Boolean));
    return ['TODOS', ...Array.from(setM)].sort();
  }, [data]);

  const colonias = useMemo(() => {
    let filtered = data;
    if (selectedMunicipio !== 'TODOS') {
      filtered = data.filter(item => item.MUNICIPIO === selectedMunicipio);
    }
    const setC = new Set(filtered.map(item => item.COLONIA).filter(Boolean));
    return ['TODAS', ...Array.from(setC)].sort();
  }, [data, selectedMunicipio]);

  // 1. DATOS GLOBALES PARA KPIS Y GRÁFICAS (Estables y sin bloqueo por teclado)
  const globalFilteredData = useMemo(() => {
    return data.filter(item => {
      const matchMun = selectedMunicipio === 'TODOS' || item.MUNICIPIO === selectedMunicipio;
      const matchCol = selectedColonia === 'TODAS' || item.COLONIA === selectedColonia;
      return matchMun && matchCol;
    });
  }, [data, selectedMunicipio, selectedColonia]);

  // Cálculos analíticos robustos
  const totalRecords = globalFilteredData.length;

  const uniqueVisits = useMemo(() => {
    const refs = new Set(globalFilteredData.map(item => item['REFERENCIA DE VENTA']).filter(Boolean));
    return refs.size > 0 ? refs.size : totalRecords;
  }, [globalFilteredData, totalRecords]);

  const uniquePatients = useMemo(() => {
    const curps = new Set(globalFilteredData.map(item => item.CURP).filter(Boolean));
    return Array.from(curps);
  }, [globalFilteredData]);

  const uniquePatientsCount = uniquePatients.length;

  const avgVisits = useMemo(() => {
    if (uniquePatientsCount === 0) return 0;
    return (uniqueVisits / uniquePatientsCount).toFixed(1);
  }, [uniqueVisits, uniquePatientsCount]);

  const uniqueLocationsCount = useMemo(() => {
    const locs = new Set(globalFilteredData.map(item => item.COLONIA).filter(Boolean));
    return locs.size;
  }, [globalFilteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando inteligencia territorial y operativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Tarjetas KPI */}
        <KPICards 
          totalRecords={totalRecords}
          uniqueVisits={uniqueVisits}
          uniquePatientsCount={uniquePatientsCount}
          uniqueLocationsCount={uniqueLocationsCount}
          avgVisits={avgVisits}
        />

        {/* Sección de Gráficos Analíticos */}
        <ChartsSection data={globalFilteredData} />

        {/* Sección de Filtros Operativos */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Filtro Territorial y Operativo
            </h2>
            <p className="text-xs text-gray-500">Visualiza el total estatal, municipal, foráneos y registros sin captura</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-gray-600 mb-1">Municipio:</label>
              <select 
                value={selectedMunicipio} 
                onChange={(e) => { setSelectedMunicipio(e.target.value); setSelectedColonia('TODAS'); }}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {municipios.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-gray-600 mb-1">Colonia / Localidad:</label>
              <select 
                value={selectedColonia} 
                onChange={(e) => setSelectedColonia(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {colonias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button 
              onClick={() => { setSelectedMunicipio('TODOS'); setSelectedColonia('TODAS'); setSearchTerm(''); }}
              className="mt-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
            >
              Ver Todo
            </button>
          </div>
        </div>

        {/* Directorio de Pacientes */}
        <PatientsTable data={globalFilteredData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Tabla General de Medicamentos */}
        <MedicamentosTable data={globalFilteredData} />

      </main>
    </div>
  );
}