import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Printer, RefreshCw, PieChart, Search, ArrowRight, Save, TrendingUp, Wrench, AlertCircle } from 'lucide-react';
import { Material, PresetMaterial } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Catalog of realistic prices (Estimated Argentina 2025 base)
const CATALOG: PresetMaterial[] = [
  { name: 'Caño IPS Fusión 20mm (Agua)', category: 'Cañerías', unit: 'tira 4m', basePrice: 12500 },
  { name: 'Caño IPS Fusión 25mm (Agua)', category: 'Cañerías', unit: 'tira 4m', basePrice: 18900 },
  { name: 'Caño PVC Desagüe 110mm', category: 'Cañerías', unit: 'tira 4m', basePrice: 24500 },
  { name: 'Caño PVC Desagüe 40mm', category: 'Cañerías', unit: 'tira 4m', basePrice: 8500 },
  { name: 'Codo 20mm Fusión 90°', category: 'Accesorios', unit: 'un', basePrice: 1200 },
  { name: 'Tee 20mm Fusión', category: 'Accesorios', unit: 'un', basePrice: 1500 },
  { name: 'Llave de Paso 20mm Fusión', category: 'Grifería', unit: 'un', basePrice: 22000 },
  { name: 'Adhesivo PVC x 250cc', category: 'Adhesivos', unit: 'un', basePrice: 14500 },
  { name: 'Cinta Teflón Alta Densidad', category: 'Adhesivos', unit: 'un', basePrice: 3500 },
  { name: 'Flexible Mallado 1/2 x 40cm', category: 'Accesorios', unit: 'un', basePrice: 9500 },
  { name: 'Tanque 500L Tricapa', category: 'Tanques', unit: 'un', basePrice: 145000 },
  { name: 'Caño Sigas 25mm (Gas)', category: 'Gas', unit: 'tira 4m', basePrice: 42000 },
];

interface Props {
  onExportToBudget?: () => void;
}

const PriceCalculator: React.FC<Props> = ({ onExportToBudget }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [inflationFactor, setInflationFactor] = useState<number>(0); // Percentage
  const [searchTerm, setSearchTerm] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('mps_calculator');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setMaterials(parsed.materials || []);
      setLaborCost(parsed.laborCost || 0);
      // We don't load inflationFactor, we start at 0 so user applies it as needed per session/update
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    const data = { materials, laborCost };
    localStorage.setItem('mps_calculator', JSON.stringify(data));
  }, [materials, laborCost]);

  const addFromCatalog = (item: PresetMaterial) => {
    const newMat: Material = {
      id: Date.now().toString(),
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: 1,
      unitPrice: Math.round(item.basePrice)
    };
    setMaterials([...materials, newMat]);
    setSearchTerm('');
    setIsCatalogOpen(false);
  };

  const addCustomMaterial = () => {
    const newMat: Material = {
      id: Date.now().toString(),
      name: 'Material Personalizado',
      category: 'Varios',
      unit: 'un',
      quantity: 1,
      unitPrice: 0
    };
    setMaterials([...materials, newMat]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Re-apply inflation to existing materials
  const applyInflationToAll = () => {
    if (materials.length === 0) return;
    if (inflationFactor === 0) return;

    const factor = 1 + (inflationFactor / 100);
    
    setMaterials(materials.map(m => ({
      ...m,
      unitPrice: Math.ceil(m.unitPrice * factor) // Round up to nearest integer
    })));
    
    setInflationFactor(0); // Reset after applying to avoid double application
  };

  const calculateTotals = useMemo(() => {
    const materialsTotal = materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
    const directCost = materialsTotal + laborCost;
    
    // Industry Standard in Arg: 
    // 15% General Expenses (Movilidad, Herramientas, Seguro)
    // 10-20% Profit on top of everything
    const generalExpenses = directCost * 0.15;
    const subtotal = directCost + generalExpenses;
    const profit = subtotal * 0.10;
    const finalPrice = subtotal + profit;

    return {
      materialsTotal,
      directCost,
      generalExpenses,
      subtotal,
      profit,
      finalPrice
    };
  }, [materials, laborCost]);

  const chartData = [
    { name: 'Materiales', value: calculateTotals.materialsTotal },
    { name: 'Mano de Obra', value: laborCost },
    { name: 'Gastos Gral.', value: calculateTotals.generalExpenses },
    { name: 'Beneficio', value: calculateTotals.profit },
  ].filter(i => i.value > 0);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleExportToBudget = () => {
    // Create budget items from materials + labor line
    const budgetItems = materials.map(m => ({
      id: m.id,
      description: m.name,
      quantity: m.quantity,
      unit: m.unit,
      unitPrice: m.unitPrice
    }));

    // Add labor as an item
    if (laborCost > 0) {
      budgetItems.push({
        id: 'labor-' + Date.now(),
        description: 'Mano de Obra Especializada',
        quantity: 1,
        unit: 'gl',
        unitPrice: laborCost
      });
    }
    
    const currentBudget = JSON.parse(localStorage.getItem('mps_budget') || '{}');
    currentBudget.items = budgetItems;
    localStorage.setItem('mps_budget', JSON.stringify(currentBudget));
    
    if(onExportToBudget) onExportToBudget();
  };

  const filteredCatalog = CATALOG.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Calculadora de Costos</h2>
           <p className="text-slate-500 text-sm">Estima costos de materiales y mano de obra con precios de mercado.</p>
        </div>
        
        <div className="flex gap-2">
           <button onClick={() => {
             setMaterials([]); setLaborCost(0);
           }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Borrar todo">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Materials & Labor */}
        <div className="xl:col-span-2 space-y-6">
          
           {/* Inflation Tool */}
           <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                 <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-red-400"/> Ajuste por Inflación
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Actualiza todos los precios de la lista actual instantáneamente.
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  className="w-32 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  value={inflationFactor}
                  onChange={(e) => setInflationFactor(parseInt(e.target.value))}
                />
                <span className="text-xl font-bold w-12 text-right">{inflationFactor}%</span>
                <button 
                  onClick={applyInflationToAll}
                  disabled={inflationFactor === 0 || materials.length === 0}
                  className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${
                    inflationFactor > 0 && materials.length > 0
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  APLICAR
                </button>
              </div>
            </div>
          </div>

          {/* Material Search & List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-slate-700 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600"/> 1. Materiales
              </h3>
              <div className="flex gap-2">
                 <button 
                  onClick={addCustomMaterial}
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  + Manual
                </button>
                <button 
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="flex items-center gap-1 text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Catálogo
                </button>
              </div>
            </div>

            {/* Catalog Dropdown */}
            {isCatalogOpen && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar caño, codo, adhesivo..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredCatalog.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => addFromCatalog(item)}
                      className="flex flex-col items-start p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left"
                    >
                      <span className="font-medium text-sm text-slate-700 line-clamp-1">{item.name}</span>
                      <div className="flex justify-between w-full mt-1">
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>
                        <span className="text-xs font-bold text-blue-600">${item.basePrice.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Added Materials List */}
            <div className="space-y-2">
              {materials.length === 0 && !isCatalogOpen && (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-400">No hay materiales cargados.</p>
                  <button onClick={() => setIsCatalogOpen(true)} className="mt-2 text-blue-600 font-medium hover:underline text-sm">Abrir Catálogo</button>
                </div>
              )}
              
              {materials.map((mat) => (
                <div key={mat.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white border border-slate-100 p-3 rounded-lg hover:shadow-md hover:border-blue-100 transition-all">
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      className="w-full font-medium text-slate-700 bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300"
                      value={mat.name}
                      onChange={(e) => updateMaterial(mat.id, 'name', e.target.value)}
                    />
                    <span className="text-xs text-slate-400">{mat.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                      <input
                        type="number"
                        className="w-16 text-center bg-transparent border-none py-1 text-sm focus:ring-0"
                        value={mat.quantity}
                        onChange={(e) => updateMaterial(mat.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <span className="text-xs text-slate-400 border-l border-slate-200 px-2 py-1">{mat.unit}</span>
                    </div>

                    <div className="relative w-28">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                      <input
                        type="number"
                        className={`w-full pl-5 pr-2 py-1 text-right text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${inflationFactor > 0 ? 'text-green-600 font-semibold' : ''}`}
                        value={inflationFactor > 0 ? Math.ceil(mat.unitPrice * (1 + inflationFactor/100)) : mat.unitPrice}
                        readOnly={inflationFactor > 0} // Read only during inflation preview
                        title={inflationFactor > 0 ? "Precio con inflación aplicada. Click Aplicar para confirmar." : "Precio actual"}
                        onChange={(e) => updateMaterial(mat.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <button 
                      onClick={() => removeMaterial(mat.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {inflationFactor > 0 && materials.length > 0 && (
                <div className="text-center text-xs text-amber-600 font-medium py-2 bg-amber-50 rounded-lg mt-2 flex items-center justify-center gap-2">
                   <AlertCircle className="w-3 h-3"/>
                   Estás previsualizando un aumento del {inflationFactor}%. Pulsa "APLICAR" arriba para confirmar.
                </div>
              )}
            </div>
          </div>

          {/* Labor Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-700 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-green-600"/> 2. Mano de Obra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                 <label className="block text-sm font-medium text-slate-600 mb-1">Costo Total Estimado</label>
                 <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold text-slate-700 text-lg"
                    value={laborCost || ''}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                 </div>
              </div>
              <div className="col-span-1 bg-green-50 p-3 rounded-xl border border-green-100 text-sm text-green-800">
                <p className="font-medium mb-1">💡 Tip para Argentina:</p>
                <p>Calcula tu jornal base y multiplícalo por los días estimados. No olvides incluir ayudante si es necesario.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Results sticky */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 sticky top-6">
            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600"/> Resumen
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Materiales</span>
                <span className="font-medium">${Math.round(calculateTotals.materialsTotal * (1 + (inflationFactor > 0 ? inflationFactor/100 : 0))).toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Mano de Obra</span>
                <span className="font-medium">${laborCost.toLocaleString('es-AR')}</span>
              </div>
              <div className="h-px bg-slate-100 my-2"></div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Costo Directo</span>
                <span>${Math.round(calculateTotals.directCost + (calculateTotals.materialsTotal * (inflationFactor/100))).toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-xs text-amber-600">
                <span>+ Gastos Grales (15%)</span>
                <span>${Math.round(calculateTotals.generalExpenses + (calculateTotals.materialsTotal * (inflationFactor/100) * 0.15)).toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between text-xs text-purple-600">
                <span>+ Beneficio (10%)</span>
                <span>${Math.round(calculateTotals.profit + (calculateTotals.materialsTotal * (inflationFactor/100) * 0.10)).toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl shadow-lg shadow-slate-200 mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-16 h-16 text-white"/>
              </div>
              <div className="text-center relative z-10">
                <span className="text-xs text-blue-200 font-medium uppercase tracking-widest">Precio Sugerido</span>
                <div className="text-3xl font-bold text-white mt-1">
                  ${Math.round(calculateTotals.finalPrice + (calculateTotals.materialsTotal * (inflationFactor/100) * 1.25)).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Chart */}
            {calculateTotals.finalPrice > 0 && (
              <div className="h-40 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString('es-AR')}`} 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-3">
              <button 
                onClick={handleExportToBudget}
                disabled={materials.length === 0 && laborCost === 0}
                className={`w-full flex justify-center items-center gap-2 text-white px-4 py-3 rounded-xl transition-all font-medium ${
                    materials.length === 0 && laborCost === 0 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
                }`}
              >
                <span>Crear Presupuesto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => window.print()}
                className="w-full flex justify-center items-center gap-2 bg-white text-slate-600 border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Detalle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Only View */}
      <div className="hidden print:block p-8 bg-white text-black">
        <h1 className="text-2xl font-bold mb-2">Detalle de Costos - {new Date().toLocaleDateString('es-AR')}</h1>
        <table className="w-full text-sm mt-6 border-collapse">
           <thead>
             <tr className="border-b-2 border-black">
               <th className="text-left py-2">Ítem</th>
               <th className="text-center py-2">Cant.</th>
               <th className="text-right py-2">Unitario</th>
               <th className="text-right py-2">Subtotal</th>
             </tr>
           </thead>
           <tbody>
             {materials.map(m => (
               <tr key={m.id} className="border-b border-gray-200">
                 <td className="py-2">{m.name}</td>
                 <td className="text-center py-2">{m.quantity} {m.unit}</td>
                 <td className="text-right py-2">${m.unitPrice.toLocaleString()}</td>
                 <td className="text-right py-2">${(m.quantity * m.unitPrice).toLocaleString()}</td>
               </tr>
             ))}
             <tr>
               <td className="py-2 font-bold" colSpan={3}>Mano de Obra</td>
               <td className="text-right py-2 font-bold">${laborCost.toLocaleString()}</td>
             </tr>
           </tbody>
        </table>
        <div className="mt-8 text-right text-xl font-bold">
          Total Sugerido: ${calculateTotals.finalPrice.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;