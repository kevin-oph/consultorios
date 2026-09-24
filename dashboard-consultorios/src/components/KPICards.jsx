import React from 'react';
import { Users, FileText, MapPin, Building, Repeat } from 'lucide-react';

export default function KPICards({ totalRecords, uniqueVisits, uniquePatientsCount, uniqueLocationsCount, avgVisits }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* Tarjeta 1: Atenciones Reales */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Atenciones Reales</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{uniqueVisits.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Transacciones únicas</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
          <FileText size={22} />
        </div>
      </div>

      {/* Tarjeta 2: Pacientes Únicos */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Pacientes Únicos</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{uniquePatientsCount.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">CURPs registrados</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
          <Users size={22} />
        </div>
      </div>

      {/* Tarjeta 3: Promedio de Consultas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Visitas / Paciente</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{avgVisits}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Índice de seguimiento</p>
        </div>
        <div className="bg-teal-50 text-teal-600 p-3 rounded-lg">
          <Repeat size={22} />
        </div>
      </div>

      {/* Tarjeta 4: Colonias Atendidas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Colonias Atendidas</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{uniqueLocationsCount.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Zonas geográficas</p>
        </div>
        <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
          <MapPin size={22} />
        </div>
      </div>

      {/* Tarjeta 5: Registros Brutos */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Registros Brutos</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalRecords.toLocaleString()}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Base de datos inicial</p>
        </div>
        <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
          <Building size={22} />
        </div>
      </div>

    </div>
  );
}