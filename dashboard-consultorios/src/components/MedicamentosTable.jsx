import React, { useState, useMemo } from 'react';
import { Pill, Search, Download } from 'lucide-react';

export default function MedicamentosTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Agrupar y contar todos los medicamentos/insumos de la base de datos completa
  const medicamentosList = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      // Revisa las posibles columnas donde venga el nombre del medicamento o servicio
      const med = item.SERVICIO || item.MEDICAMENTO || item.DESCRIPCION || item.CONCEPTO || 'NO ESPECIFICADO';
      const cleanMed = String(med).trim().toUpperCase();
      counts[cleanMed] = (counts[cleanMed] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([medicamento, cantidad]) => ({ medicamento, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad); // Ordenados del más entregado al menos
  }, [data]);

  // Filtrar según la búsqueda del usuario
  const filteredMedicamentos = useMemo(() => {
    return medicamentosList.filter(item => 
      item.medicamento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicamentosList, searchTerm]);

  // Función opcional para exportar esta tabla de medicamentos a CSV/Excel rápido
  const exportMedicamentosToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,MEDICAMENTO / SERVICIO,CANTIDAD TOTAL DISPENSADA\n";
    medicamentosList.forEach(row => {
      csvContent += `"${row.medicamento}",${row.cantidad}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventario_medicamentos_dispenados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Pill size={18} className="text-emerald-600" />
            Catálogo y Desglose General de Medicamentos e Insumos
          </h3>
          <p className="text-xs text-gray-500">Total de {medicamentosList.length} productos o servicios registrados en el padrón</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar medicamento..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg pl-9 pr-3 py-2 w-full focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button 
            onClick={exportMedicamentosToCSV}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            Exportar Fármacos
          </button>
        </div>
      </div>

      {/* Tabla con scroll para ver todos */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase sticky top-0 border-b border-gray-200">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">Medicamento / Servicio / Insumo</th>
              <th className="py-2.5 px-4 text-right">Cantidad Total Repartida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredMedicamentos.length > 0 ? (
              filteredMedicamentos.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition">
                  <td className="py-2 px-4 text-gray-400 font-medium">{idx + 1}</td>
                  <td className="py-2 px-4 text-gray-800 font-medium">{item.medicamento}</td>
                  <td className="py-2 px-4 text-right font-bold text-emerald-700">
                    {item.cantidad.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">pzas</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-400 text-xs">
                  No se encontraron medicamentos con ese nombre en la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}