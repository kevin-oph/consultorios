import React, { useState, useMemo } from 'react';
import { Search, UserCheck, ChevronLeft, ChevronRight, ArrowUpDown, Download } from 'lucide-react';

export default function PatientsTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByVisits, setSortByVisits] = useState(true);
  const itemsPerPage = 50;

  // Agrupar y unificar por CURP (Paciente único) calculando VISITAS REALES por folios distintos
  const aggregatedPatients = useMemo(() => {
    const map = {};
    
    data.forEach(item => {
      const curp = item.CURP && item.CURP !== 'NO CAPTURADO' ? item.CURP : (item.NOMBRE + '-' + Math.random());
      const referenciaVenta = String(item['REFERENCIA DE VENTA'] || '').trim();
      
      if (!map[curp]) {
        map[curp] = {
          nombre: item.NOMBRE || 'SIN DATO',
          curp: item.CURP || 'SIN CAPTURAR',
          colonia: item.COLONIA || 'SIN DATO',
          municipio: item.MUNICIPIO || 'SIN DATO',
          celular: item['T. CELULAR'] || item['T_CELULAR'] || item['CELULAR'] || 'NO CAPTURADO',
          referencesSet: new Set(), // Usamos un Set para almacenar folios únicos de visita
        };
      }
      
      if (referenciaVenta) {
        map[curp].referencesSet.add(referenciaVenta);
      }
    });

    // Convertir el Set a un número exacto de visitas reales
    return Object.values(map).map(patient => ({
      ...patient,
      totalVisitas: patient.referencesSet.size > 0 ? patient.referencesSet.size : 1
    }));
  }, [data]);

  // Filtrar y ordenar
  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const result = aggregatedPatients.filter(p => 
      p.nombre.toLowerCase().includes(term) ||
      p.curp.toLowerCase().includes(term) ||
      p.colonia.toLowerCase().includes(term) ||
      p.celular.toLowerCase().includes(term)
    );

    return result.sort((a, b) => {
      if (sortByVisits) {
        return b.totalVisitas - a.totalVisitas; // Más visitas primero
      } else {
        return a.nombre.localeCompare(b.nombre); // Alfabético
      }
    });
  }, [aggregatedPatients, searchTerm, sortByVisits]);

  // Paginación
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Función para exportar los datos filtrados a CSV (compatible con Excel)
  const exportToCSV = () => {
    const headers = ['NOMBRE', 'CURP', 'COLONIA', 'MUNICIPIO', 'VISITAS_REALES', 'CELULAR'];
    const csvRows = [headers.join(',')];

    filteredPatients.forEach(p => {
      const row = [
        `"${p.nombre}"`,
        `"${p.curp}"`,
        `"${p.colonia}"`,
        `"${p.municipio}"`,
        p.totalVisitas,
        `"${p.celular}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'directorio_consultorios_emiliano_zapata.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" size={20} />
            Directorio Único de Ciudadanos Atendidos
          </h3>
          <p className="text-xs text-gray-500">
            Mostrando pacientes únicos ({filteredPatients.length.toLocaleString()} encontrados en total)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Botón de Exportar a Excel/CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            title="Descargar lista filtrada en Excel"
          >
            <Download size={15} />
            <span>Exportar a Excel</span>
          </button>

          {/* Botón Ordenar */}
          <button
            onClick={() => {
              setSortByVisits(!sortByVisits);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              sortByVisits 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <ArrowUpDown size={14} />
            <span>{sortByVisits ? 'Más Frecuentes 🥇' : 'Alfabético (A-Z)'}</span>
          </button>

          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por Nombre, CURP..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100">
              <th className="py-3 px-4 font-semibold">Ciudadano / Paciente</th>
              <th className="py-3 px-4 font-semibold">CURP</th>
              <th className="py-3 px-4 font-semibold">Colonia</th>
              <th className="py-3 px-4 font-semibold">Municipio</th>
              <th className="py-3 px-4 font-semibold text-center">Visitas Reales</th>
              <th className="py-3 px-4 font-semibold">Teléfono Celular</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {currentPatients.length > 0 ? (
              currentPatients.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.nombre}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{row.curp}</td>
                  <td className="py-3 px-4">{row.colonia}</td>
                  <td className="py-3 px-4">{row.municipio}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      row.totalVisitas > 3 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {row.totalVisitas} {row.totalVisitas === 1 ? 'visita' : 'visitas'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-blue-600">{row.celular}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No se encontraron ciudadanos coincidentes con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
        <span className="text-xs text-gray-500">
          Página <span className="font-semibold text-gray-700">{currentPage}</span> de <span className="font-semibold text-gray-700">{totalPages}</span> 
          {' '}(Mostrando hasta {itemsPerPage} registros por página)
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}