import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Share2, Upload, FileCheck, ArrowDown, ClipboardCopy } from 'lucide-react';
import { BudgetItem, ClientInfo } from '../types';

const BudgetGenerator: React.FC = () => {
  const [client, setClient] = useState<ClientInfo>({
    name: '',
    cuit: '',
    address: '',
    city: '',
    phone: '',
    budgetNumber: `P-${new Date().getFullYear()}-001`,
    date: new Date().toISOString().split('T')[0],
    validityDays: 7, // Inflation high -> lower validity
    condition: 'Consumidor Final',
    notes: 'FORMA DE PAGO: 50% de anticipo para acopio de materiales y congelar precios. Saldo al finalizar el trabajo.\n\nVALIDEZ: Debido a la situación inflacionaria, este presupuesto tiene una validez de 7 días. Pasado dicho plazo, los precios se actualizarán.\n\nEXCLUSIONES: No incluye trabajos de albañilería gruesa ni retiro de escombros salvo aclaración expresa.',
  });

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [logo, setLogo] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('mps_budget');
    if (saved) {
      const parsed = JSON.parse(saved);
      if(parsed.client) setClient(parsed.client);
      if(parsed.items) setItems(parsed.items);
      if(parsed.logo) setLogo(parsed.logo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mps_budget', JSON.stringify({ client, items, logo }));
  }, [client, items, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0
    };
    setItems([...items, newItem]);
  };

  const importFromCalculator = () => {
     const savedCalc = localStorage.getItem('mps_budget');
     if(savedCalc) {
       const parsed = JSON.parse(savedCalc);
       if(parsed.items && parsed.items.length > 0) {
         if(confirm('¿Sobrescribir los ítems actuales con los de la calculadora?')) {
            setItems(parsed.items);
         }
       } else {
         alert('Primero debes exportar desde la calculadora.');
       }
     }
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totals = React.useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    // In Argentina, "Presupuesto X" usually doesn't discriminate IVA for Final Consumers, 
    // but professionals need to know. Let's assume the unit price is FINAL for simplicity in this app unless marked otherwise.
    // Or we can add IVA on top. Let's stick to standard practice: Subtotal + IVA = Total.
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  }, [items]);

  const handleWhatsApp = () => {
    const text = `Hola ${client.name}, adjunto el presupuesto ${client.budgetNumber}.\n\n*Total: $${totals.total.toLocaleString('es-AR')}*\n\nQuedo a disposición.\nSaludos.`;
    window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 no-print sticky top-0 z-30">
         <div className="w-full md:w-auto">
            <h2 className="text-xl font-bold text-slate-800">Editor de Presupuestos</h2>
            <p className="text-xs text-slate-500">Diseña documentos profesionales listos para enviar.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={importFromCalculator}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <ArrowDown className="w-4 h-4" /> Importar Costos
            </button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
            </button>
             <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">PDF / Imprimir</span>
            </button>
         </div>
      </div>

      {/* A4 Paper Container - Responsive Width */}
      <div className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] flex flex-col print:shadow-none print:w-full print:max-w-none print:m-0 overflow-hidden">
        
        {/* Header Color Strip */}
        <div className="h-4 bg-slate-900 w-full shrink-0"></div>

        <div className="p-4 md:p-12 flex-1 flex flex-col">
          
          {/* Document Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 border-b border-slate-100 pb-8 gap-6 md:gap-0">
            
            {/* Left Side: Logo & Company Info */}
            <div className="w-full md:w-1/2 md:pr-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-6 group relative w-48 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors shrink-0">
                {logo ? (
                   <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center text-slate-400">
                    <Upload className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-[10px] uppercase font-bold">Logo Empresa</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer no-print"
                />
              </div>
              <div className="space-y-2 w-full">
                 <input 
                   placeholder="Nombre de tu Empresa"
                   className="font-bold text-lg w-full focus:outline-none placeholder-slate-300 text-center md:text-left"
                 />
                 <input 
                   placeholder="Dirección / Teléfono"
                   className="text-sm text-slate-500 w-full focus:outline-none placeholder-slate-300 text-center md:text-left"
                 />
                 <input 
                   placeholder="Email / Web"
                   className="text-sm text-slate-500 w-full focus:outline-none placeholder-slate-300 text-center md:text-left"
                 />
              </div>
            </div>

            {/* Right Side: Budget Info */}
            <div className="w-full md:w-1/2 text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-200 tracking-tighter mb-4">PRESUPUESTO</h1>
              <div className="space-y-2 flex flex-col items-center md:items-end">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-slate-400">N°:</span>
                  <input 
                    className="text-right font-bold text-slate-800 focus:outline-none w-32 border-b border-transparent hover:border-slate-300 focus:border-blue-500 transition-all" 
                    value={client.budgetNumber}
                    onChange={e => setClient({...client, budgetNumber: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-slate-400">Fecha:</span>
                  <input 
                    type="date"
                    className="text-right text-sm text-slate-600 focus:outline-none"
                    value={client.date}
                    onChange={e => setClient({...client, date: e.target.value})}
                  />
                </div>
                 <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-slate-400">Validez:</span>
                  <span className="text-sm text-slate-600">{client.validityDays} días</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info Grid */}
          <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="col-span-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Cliente</label>
                <input 
                  className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 text-slate-800 font-medium"
                  value={client.name}
                  onChange={e => setClient({...client, name: e.target.value})}
                  placeholder="Nombre o Razón Social"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">CUIT / DNI</label>
                <input 
                  className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 text-slate-600 text-sm"
                  value={client.cuit}
                  onChange={e => setClient({...client, cuit: e.target.value})}
                  placeholder="00-00000000-0"
                />
              </div>
              <div className="col-span-1">
                 <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Condición</label>
                 <select 
                   className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 text-slate-600 text-sm appearance-none"
                   value={client.condition}
                   onChange={e => setClient({...client, condition: e.target.value as any})}
                 >
                   <option>Consumidor Final</option>
                   <option>Resp. Inscripto</option>
                   <option>Monotributista</option>
                   <option>Exento</option>
                 </select>
              </div>
               <div className="col-span-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Domicilio</label>
                <input 
                  className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 focus:outline-none py-1 text-slate-600 text-sm"
                  value={client.address}
                  onChange={e => setClient({...client, address: e.target.value})}
                  placeholder="Calle, Número, Piso"
                />
              </div>
            </div>
          </div>

          {/* Items Table - Responsive Scroll */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 text-xs uppercase tracking-wider">
                  <th className="py-3 text-left w-12">Cant.</th>
                  <th className="py-3 text-left">Descripción</th>
                  <th className="py-3 text-right w-24">Precio Unit.</th>
                  <th className="py-3 text-right w-24">Total</th>
                  <th className="w-8 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-300 italic">
                       No hay ítems. Agrega uno manualmente o importa desde la calculadora.
                     </td>
                   </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                     <td className="py-3 px-2 align-top">
                       <input 
                        type="number"
                        className="w-full text-center bg-transparent focus:outline-none text-slate-600 font-medium"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-2 align-top">
                      <textarea 
                        rows={1}
                        className="w-full bg-transparent focus:outline-none text-slate-800 resize-none overflow-hidden"
                        value={item.description}
                        onChange={e => {
                           updateItem(item.id, 'description', e.target.value);
                           e.target.style.height = 'auto';
                           e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="Descripción del trabajo..."
                      />
                    </td>
                    <td className="py-3 px-2 text-right align-top">
                       <input 
                        type="number"
                        className="w-full text-right bg-transparent focus:outline-none text-slate-600"
                        value={item.unitPrice}
                        onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-slate-800 align-top">
                      ${(item.quantity * item.unitPrice).toLocaleString('es-AR')}
                    </td>
                    <td className="py-3 text-center align-top no-print">
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={addItem} 
              className="mt-4 flex items-center gap-2 text-xs uppercase font-bold text-blue-600 hover:text-blue-800 no-print tracking-wider"
            >
              <Plus className="w-4 h-4" /> Agregar Ítem
            </button>
          </div>

          {/* Footer Section */}
          <div className="mt-auto">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 border-t-2 border-slate-900 pt-6">
                
                {/* Terms */}
                <div className="w-full md:flex-1">
                   <h4 className="text-xs font-bold uppercase text-slate-900 mb-2">Condiciones Comerciales</h4>
                   <textarea 
                      className="w-full h-32 text-xs text-slate-500 bg-transparent border-none resize-none focus:ring-0 p-0 leading-relaxed"
                      value={client.notes}
                      onChange={e => setClient({...client, notes: e.target.value})}
                   />
                </div>

                {/* Totals */}
                <div className="w-full md:w-64 space-y-3 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
                   <div className="flex justify-between text-slate-500 text-sm">
                      <span>Subtotal</span>
                      <span>${totals.subtotal.toLocaleString('es-AR')}</span>
                   </div>
                   <div className="flex justify-between text-slate-500 text-sm">
                      <span>IVA (21%)</span>
                      <span>${totals.iva.toLocaleString('es-AR')}</span>
                   </div>
                   <div className="h-px bg-slate-200 my-2"></div>
                   <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-slate-900">${totals.total.toLocaleString('es-AR')}</span>
                   </div>
                   <p className="text-[10px] text-right text-slate-400 italic">Precios expresados en Pesos Argentinos</p>
                </div>
             </div>
             
             {/* Signature Area (Optional for printed version) */}
             <div className="mt-16 pt-8 border-t border-dashed border-slate-300 hidden print:block">
                <div className="flex justify-between text-xs text-slate-400">
                   <div className="text-center w-40">
                      <div className="h-10"></div>
                      <div className="border-t border-slate-300 pt-1">Firma del Cliente</div>
                      <div>Acepto el presupuesto</div>
                   </div>
                   <div className="text-center w-40">
                       <div className="h-10"></div>
                       <div className="border-t border-slate-300 pt-1">Firma Responsable</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
        
        {/* Bottom Color Strip */}
        <div className="h-2 bg-blue-600 w-full shrink-0"></div>
      </div>
    </div>
  );
};

export default BudgetGenerator;