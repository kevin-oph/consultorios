import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PatientsTable({ data, searchTerm, setSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const pageSize = 15;

  // Optimización de rendimiento: Retrasa ligeramente la búsqueda para evitar tirones al teclear rápido
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Regresar a la página 1 al buscar
    }, 200);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Agrupar pacientes únicos por CURP de manera optimizada
  const pacientesUnicos = useMemo(() => {
    const map = {};
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const curp = item.CURP || item.curp || 'SIN_CURP';
      
      let nombrePaciente = 'No Capturado';
      for (const key of Object.keys(item)) {
        const upperKey = key.toUpperCase();
        if ((upperKey.includes('NOMBRE') || upperKey.includes('PACIENTE') || upperKey.includes('CIUDADANO')) && item[key]) {
          nombrePaciente = item[key];
          break;
        }
      }

      if (nombrePaciente === 'No Capturado') {
        nombrePaciente = item.PACIENTE || item.CIUDADANO || item.NOMBRE || item.NOMBRE_PACIENTE || item.COMPLETO || 'No Capturado';
      }

      let telefonoPaciente = 'NO CAPTURADO';
      for (const key of Object.keys(item)) {
        const upperKey = key.toUpperCase();
        if ((upperKey.includes('TEL') || upperKey.includes('CELULAR') || upperKey.includes('MOVIL')) && item[key]) {
          telefonoPaciente = item[key];
          break;
        }
      }

      if (!map[curp]) {
        map[curp] = {
          nombre: String(nombrePaciente).trim(),
          curp: curp,
          colonia: item.COLONIA || item.colonia || 'No Capturado',
          municipio: item.MUNICIPIO || item.municipio || 'No Capturado',
          telefono: String(telefonoPaciente).trim(),
          visitasCount: 1
        };
      } else {
        if (map[curp].nombre === 'No Capturado' && nombrePaciente !== 'No Capturado') {
          map[curp].nombre = String(nombrePaciente).trim();
        }
        map[curp].visitasCount += 1;
      }
    }
    return Object.values(map);
  }, [data]);

  // Filtrado optimizado sobre las propiedades directas
  const filteredPatients = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return pacientesUnicos;

    return pacientesUnicos.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      p.curp.toLowerCase().includes(query) ||
      p.colonia.toLowerCase().includes(query) ||
      p.municipio.toLowerCase().includes(query)
    );
  }, [pacientesUnicos, debouncedSearch]);

  // Paginación limpia de 15 en 15
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Exportar a Excel
  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,PACIENTE,CURP,COLONIA,MUNICIPIO,VISITAS,TELEFONO\n";
    pacientesUnicos.forEach(p => {
      csvContent += `"${p.nombre}","${p.curp}","${p.colonia}","${p.municipio}",${p.visitasCount},"${p.telefono}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "directorio_pacientes_unicos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-emerald-600" />
            Directorio Único de Ciudadanos Atendidos
          </h3>
          <p className="text-xs text-gray-500">Mostrando pacientes únicos ({filteredPatients.length} encontrados en total)</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por Nombre, CURP..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg pl-9 pr-3 py-2 w-full focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={exportToExcel}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="py-2.5 px-4">Ciudadano / Paciente</th>
              <th className="py-2.5 px-4">CURP</th>
              <th className="py-2.5 px-4">Colonia</th>
              <th className="py-2.5 px-4">Municipio</th>
              <th className="py-2.5 px-4 text-center">Visitas Reales</th>
              <th className="py-2.5 px-4">Teléfono Celular</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-2.5 px-4 font-semibold text-gray-800">{p.nombre}</td>
                  <td className="py-2.5 px-4 text-gray-600 font-mono text-[11px]">{p.curp}</td>
                  <td className="py-2.5 px-4 text-gray-600">{p.colonia}</td>
                  <td className="py-2.5 px-4 text-gray-600">{p.municipio}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
                      {p.visitasCount} visitas
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-blue-600 font-medium">{p.telefono}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400 text-xs">
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-gray-500">
          Página <span className="font-semibold text-gray-700">{currentPage}</span> de <span className="font-semibold text-gray-700">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}