import React, { useState, useEffect } from 'react';
import { ChecklistItem, ChecklistMode } from '../types';
import { Save, Share2, Printer, CheckSquare, AlertTriangle, Shield, CheckCircle2, Circle } from 'lucide-react';

const ITEMS_NEW_INSTALL: ChecklistItem[] = [
  // EPP
  { id: 'epp1', label: 'Casco de seguridad (IRAM 3620)', checked: false, category: 'EPP', critical: true },
  { id: 'epp2', label: 'Calzado de seguridad (Puntera acero/plástica)', checked: false, category: 'EPP', critical: true },
  { id: 'epp3', label: 'Guantes de protección (Según riesgo)', checked: false, category: 'EPP' },
  { id: 'epp4', label: 'Protección ocular (Antiparras/Gafas)', checked: false, category: 'EPP', critical: true },
  // Documentación
  { id: 'doc1', label: 'ART Vigente del Personal (Nómina)', checked: false, category: 'Documentación' },
  { id: 'doc2', label: 'Programa de Seguridad Aprobado (Si corresponde)', checked: false, category: 'Documentación' },
  // Entorno
  { id: 'sit1', label: 'Señalización de Obra / Vallado', checked: false, category: 'Sitio' },
  { id: 'sit2', label: 'Orden y Limpieza (Pasillos libres)', checked: false, category: 'Sitio' },
  { id: 'sit3', label: 'Tablero Eléctrico con Disyuntor y Térmica', checked: false, category: 'Electricidad', critical: true },
  // Altura (si aplica)
  { id: 'alt1', label: 'Arnés de seguridad (Trabajos > 2m)', checked: false, category: 'Altura' },
  { id: 'alt2', label: 'Andamios/Escaleras aseguradas', checked: false, category: 'Altura' },
];

const ITEMS_URGENT: ChecklistItem[] = [
  { id: 'urg1', label: 'Corte de Agua verificado', checked: false, category: 'Bloqueo', critical: true },
  { id: 'urg2', label: 'Riesgo Eléctrico evaluado (Zona húmeda)', checked: false, category: 'Bloqueo', critical: true },
  { id: 'urg3', label: 'Ventilación adecuada (Gases/Vapores)', checked: false, category: 'Ambiente' },
  { id: 'urg4', label: 'Iluminación auxiliar disponible', checked: false, category: 'Ambiente' },
  { id: 'urg5', label: 'Herramientas aisladas', checked: false, category: 'Herramientas' },
];

const SafetyChecklist: React.FC = () => {
  const [mode, setMode] = useState<ChecklistMode>(ChecklistMode.NEW_INSTALL);
  const [items, setItems] = useState<ChecklistItem[]>(ITEMS_NEW_INSTALL);
  const [responsibleName, setResponsibleName] = useState('');
  const [workSite, setWorkSite] = useState('');

  useEffect(() => {
    if (mode === ChecklistMode.NEW_INSTALL) setItems(ITEMS_NEW_INSTALL);
    else setItems(ITEMS_URGENT);
  }, [mode]);

  const toggleItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);
  const criticalPending = items.filter(i => i.critical && !i.checked).length;

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Shield className="w-6 h-6 text-blue-600"/> Checklist de Seguridad
           </h2>
           <p className="text-sm text-slate-500">Conformidad con Ley 19.587 / Res. SRT 911/96</p>
        </div>
        
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setMode(ChecklistMode.NEW_INSTALL)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === ChecklistMode.NEW_INSTALL ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Obra Nueva
          </button>
          <button
            onClick={() => setMode(ChecklistMode.URGENT_REPAIR)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
              mode === ChecklistMode.URGENT_REPAIR ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3" /> Reparación
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className={`rounded-xl p-6 border shadow-sm transition-colors duration-500 ${
        progress === 100 
          ? 'bg-green-50 border-green-200' 
          : criticalPending > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
           <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={progress === 100 ? '#22c55e' : '#3b82f6'} strokeWidth="3" strokeDasharray={`${progress}, 100`} className="transition-all duration-1000 ease-out" />
             </svg>
             <span className="absolute text-xl font-bold text-slate-700">{progress}%</span>
           </div>
           
           <div className="flex-1 text-center md:text-left">
             <h3 className="font-bold text-lg text-slate-800">
               {progress === 100 ? 'Sitio Seguro y Verificado' : 'Inspección en Curso'}
             </h3>
             <p className="text-sm text-slate-600 mt-1">
               {progress === 100 
                 ? 'Se han cumplido todos los puntos de control.' 
                 : `Faltan ${items.length - items.filter(i => i.checked).length} puntos por verificar.`
               }
             </p>
             {criticalPending > 0 && (
               <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                 <AlertTriangle className="w-3 h-3" /> {criticalPending} Puntos Críticos Pendientes
               </div>
             )}
           </div>
        </div>
      </div>
      
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <input 
          placeholder="Responsable de la inspección" 
          className="bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={responsibleName}
          onChange={e => setResponsibleName(e.target.value)}
        />
        <input 
          placeholder="Ubicación de la obra" 
          className="bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={workSite}
          onChange={e => setWorkSite(e.target.value)}
        />
      </div>

      {/* Checklist Groups */}
      <div className="space-y-6">
        {categories.map(cat => {
           const catItems = items.filter(i => i.category === cat);
           if (catItems.length === 0) return null;
           
           return (
             <div key={cat} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                 <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wide">{cat}</h4>
                 <span className="text-xs font-medium text-slate-400">{catItems.filter(i => i.checked).length}/{catItems.length}</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {catItems.map(item => (
                   <div 
                     key={item.id}
                     onClick={() => toggleItem(item.id)}
                     className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${item.checked ? 'bg-slate-50/50' : ''}`}
                   >
                     <div className={`flex-shrink-0 transition-all duration-300 ${item.checked ? 'text-green-500 scale-110' : item.critical ? 'text-orange-400' : 'text-slate-300'}`}>
                        {item.checked ? <CheckCircle2 className="w-6 h-6 fill-green-50" /> : <Circle className="w-6 h-6" />}
                     </div>
                     <div className="flex-1">
                        <p className={`font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {item.label}
                        </p>
                        {item.critical && !item.checked && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Obligatorio</span>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )
        })}
      </div>

      {/* Signature & Print */}
      <div className="flex justify-end pt-6 no-print">
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all font-medium"
        >
          <Printer className="w-5 h-5" />
          <span>Generar Reporte PDF</span>
        </button>
      </div>

      {/* Print Layout */}
      <div className="hidden print:block p-8 bg-white text-black">
         <div className="text-center border-b-2 border-black pb-4 mb-6">
           <h1 className="text-2xl font-bold uppercase">Permiso de Trabajo Seguro</h1>
           <p className="text-sm">Conformidad RGRL / Ley 19.587</p>
         </div>
         
         <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
           <div><span className="font-bold">Obra:</span> {workSite || '____________________'}</div>
           <div><span className="font-bold">Fecha:</span> {new Date().toLocaleString('es-AR')}</div>
           <div><span className="font-bold">Responsable:</span> {responsibleName || '____________________'}</div>
         </div>

         <div className="space-y-4">
           {items.map(item => (
             <div key={item.id} className="flex items-center justify-between border-b border-slate-200 py-1">
               <span className="text-sm">{item.label}</span>
               <span className="font-bold text-sm">{item.checked ? 'SI' : 'NO'}</span>
             </div>
           ))}
         </div>

         <div className="mt-12 flex justify-between">
            <div className="text-center w-1/3">
              <div className="border-t border-black pt-2">Firma Responsable</div>
            </div>
            <div className="text-center w-1/3">
              <div className="border-t border-black pt-2">Firma Operario</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SafetyChecklist;