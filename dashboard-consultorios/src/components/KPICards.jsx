import React from 'react';
import { Users, FileText, MapPin, Building2 } from 'lucide-react';

export default function KPICards({ data }) {
  // Total de filas/registros en el filtro actual
  const totalRegistros = data.length;

  // Pacientes únicos basados en CURP válida
  const pacientesUnicos = new Set(
    data.map(item => item.CURP && item.CURP !== 'NO CAPTURADO' ? item.CURP : null).filter(Boolean)
  ).size;

  // Calcular Visitas Reales basadas en folios únicos (REFERENCIA DE VENTA)
  const visitasReales = new Set(
    data.map(item => item['REFERENCIA DE VENTA']).filter(Boolean)
  ).size;

  // Colonias únicas limpias (excluyendo basura o "No capturado")
  const totalColonias = new Set(
    data.map(item => {
      const col = (item.COLONIA || '').trim().toUpperCase();
      return (col && col !== 'NO CAPTURADO' && col !== 'NO CAPTURADO POR USUARIO') ? col : null;
    }).filter(Boolean)
  ).size;

  // Municipios únicos
  const totalMunicipios = new Set(
    data.map(item => (item.MUNICIPIO || 'NO CAPTURADO').toUpperCase()).filter(m => m !== 'NO CAPTURADO')
  ).size;

  const cards = [
    { 
      title: 'Visitas / Atenciones Reales', 
      value: visitasReales.toLocaleString(), 
      subtext: `(${totalRegistros.toLocaleString()} insumos/recetas)`,
      icon: FileText, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Pacientes Únicos (CURP)', 
      value: pacientesUnicos.toLocaleString(), 
      subtext: 'Ciudadanos atendidos',
      icon: Users, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Colonias Atendidas', 
      value: totalColonias.toLocaleString(), 
      subtext: 'Zonas mapeadas',
      icon: MapPin, 
      color: 'bg-amber-500' 
    },
    { 
      title: 'Municipios', 
      value: totalMunicipios.toLocaleString(), 
      subtext: 'Cobertura regional',
      icon: Building2, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{card.subtext}</p>
            </div>
            <div className={`p-3 rounded-lg text-white ${card.color}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}