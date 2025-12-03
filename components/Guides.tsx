import React, { useState } from 'react';
import { Flame, Droplets, Calculator, ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckCircle, Thermometer, Clock, Search } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

const Guides: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('termofusion');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const guides: GuideSection[] = [
    {
      id: 'termofusion',
      title: 'Termofusión: Guía Completa y Profesional',
      icon: Flame,
      color: 'text-orange-500',
      content: (
        <div className="space-y-6 text-slate-700">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
             <h4 className="font-bold text-orange-800 mb-2">Los 3 Mandamientos de la Fusión</h4>
             <ul className="list-disc pl-5 space-y-1 text-sm text-orange-700">
               <li><strong>Temperatura Correcta:</strong> La termofusora debe estar entre 260°C y 270°C.</li>
               <li><strong>Limpieza Absoluta:</strong> Un caño sucio o con grasa es una fuga asegurada.</li>
               <li><strong>No Girar:</strong> Jamás girar las piezas al unirlas, solo empujar recto.</li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
               <Clock className="w-4 h-4 text-blue-500" /> Tabla de Tiempos (260°C)
             </h4>
             <div className="overflow-x-auto">
               <table className="w-full text-sm border-collapse border border-slate-200">
                 <thead>
                   <tr className="bg-slate-100">
                     <th className="border p-2">Diámetro</th>
                     <th className="border p-2">Calentamiento</th>
                     <th className="border p-2">Acople (Max)</th>
                     <th className="border p-2">Enfriamiento (Fijo)</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td className="border p-2 font-bold">20 mm</td>
                     <td className="border p-2 text-center">5 seg</td>
                     <td className="border p-2 text-center">4 seg</td>
                     <td className="border p-2 text-center">2 min</td>
                   </tr>
                   <tr>
                     <td className="border p-2 font-bold">25 mm</td>
                     <td className="border p-2 text-center">7 seg</td>
                     <td className="border p-2 text-center">4 seg</td>
                     <td className="border p-2 text-center">2 min</td>
                   </tr>
                   <tr>
                     <td className="border p-2 font-bold">32 mm</td>
                     <td className="border p-2 text-center">8 seg</td>
                     <td className="border p-2 text-center">6 seg</td>
                     <td className="border p-2 text-center">4 min</td>
                   </tr>
                 </tbody>
               </table>
               <p className="text-xs text-slate-400 mt-1 italic">* Si hace menos de 5°C ambiente, sumar un 50% al tiempo de calentamiento.</p>
             </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-3">Inspección Visual: El Doble Anillo</h4>
            <p className="text-sm text-slate-600 mb-4">
              Una fusión perfecta debe mostrar dos anillos uniformes de material extruido. Si no ves los anillos, la fusión es débil (fria).
            </p>
            
            {/* CSS Diagram of Fusion */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
               <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                     <div className="h-12 w-20 bg-green-600 rounded-l-md relative border-r-4 border-green-700"></div>
                     <div className="h-16 w-4 bg-green-500 rounded-full scale-y-125 z-10 shadow-lg border border-green-600"></div>
                     <div className="h-14 w-20 bg-green-600 rounded-r-md border-l-4 border-green-700 -ml-1"></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">CORRECTO<br/>Anillos Uniformes</span>
               </div>

               <div className="text-center opacity-50">
                  <div className="flex items-center justify-center mb-2">
                     <div className="h-12 w-20 bg-red-400 rounded-l-md border-r-0"></div>
                     <div className="h-12 w-2 bg-red-300 z-10"></div>
                     <div className="h-14 w-20 bg-red-400 rounded-r-md -ml-1"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">INCORRECTO<br/>Sin Anillos (Fusión Fría)</span>
               </div>
            </div>
          </div>

          <div className="space-y-2">
             <h4 className="font-bold text-slate-800">Secretos Profesionales</h4>
             <div className="bg-white border-l-4 border-blue-500 p-3 shadow-sm">
                <p className="text-sm"><strong>El Alcohol es tu mejor amigo:</strong> Limpia siempre la punta del caño y el interior del accesorio con alcohol antes de fusionar. El polvo del corte crea micro-poros.</p>
             </div>
             <div className="bg-white border-l-4 border-red-500 p-3 shadow-sm">
                <p className="text-sm"><strong>Cuidado con el "Chupete":</strong> Si empujas demasiado el caño dentro de la boquilla, cerrarás el paso interno del agua. Marca siempre la profundidad de inserción con un lápiz antes de calentar.</p>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 'fugas',
      title: 'Detección de Fugas: Métodos y Lógica',
      icon: Droplets,
      color: 'text-blue-500',
      content: (
        <div className="space-y-6 text-slate-700">
          <p>Localizar una fuga requiere paciencia y método deductivo. Seguir este protocolo te ahorrará romper paredes innecesariamente.</p>
          
          <div className="space-y-4">
             <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
               <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">1</div>
               <div>
                 <h4 className="font-bold text-slate-800">Prueba Hidrostática (Manómetro)</h4>
                 <p className="text-sm text-slate-600 mb-2">
                   Es la prueba reina. Coloca un manómetro en una salida (ducha o lavatorio).
                 </p>
                 <ul className="text-xs space-y-1 text-slate-500 bg-white p-2 rounded border border-slate-100">
                    <li>• Sube la presión a 1.5 veces la de trabajo (ej. 4 bar).</li>
                    <li>• Cierra la llave de paso general.</li>
                    <li>• Espera 15-30 minutos.</li>
                    <li>• <strong>Si baja rápido:</strong> Rotura importante o canilla abierta.</li>
                    <li>• <strong>Si baja muy lento:</strong> Microfuga o goteo en inodoro.</li>
                 </ul>
               </div>
             </div>

             <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
               <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">2</div>
               <div>
                 <h4 className="font-bold text-slate-800">Aislación por Sectores</h4>
                 <p className="text-sm text-slate-600">
                   Si confirmaste pérdida de presión, cierra las llaves de paso de cada ambiente (Baño 1, Baño 2, Cocina).
                   Repite la prueba. Donde la presión caiga al abrir la llave sectorial, ahí está el problema.
                 </p>
               </div>
             </div>
             
             <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
               <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">3</div>
               <div>
                 <h4 className="font-bold text-slate-800">Tecnología Avanzada</h4>
                 <p className="text-sm text-slate-600 mb-2">Si no puedes romper para buscar:</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                       <strong>Geófono:</strong> Micrófono de suelo. Escucha el sonido del agua escapando. Funciona mejor en silencio absoluto.
                    </div>
                    <div className="bg-white p-2 rounded border">
                       <strong>Cámara Termográfica:</strong> Detecta la diferencia de temperatura. Ideal para caños de agua caliente (se ve una mancha roja expandiéndose).
                    </div>
                    <div className="bg-white p-2 rounded border">
                       <strong>Gas Trazador:</strong> Se inyecta una mezcla de Hidrógeno/Nitrógeno y se usa un sensor ("olfato electrónico") para detectar dónde sale el gas.
                    </div>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded text-sm mt-2 border border-yellow-200 flex items-start gap-2">
             <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
             <p><strong>Recuerda:</strong> Una mancha de humedad no siempre indica la fuga exacta. El agua corre por las carpetas y puede aparecer metros más allá de la rotura real.</p>
          </div>
        </div>
      )
    },
    {
      id: 'calculator',
      title: 'Cómo usar la Calculadora de Precios',
      icon: Calculator,
      color: 'text-green-500',
      content: (
        <div className="space-y-4 text-slate-700">
          <p>Esta herramienta está diseñada para no perder dinero por inflación ni por olvidar costos ocultos.</p>
          
          <ol className="list-decimal pl-5 space-y-3 text-sm">
            <li>
                <strong>Carga de Materiales:</strong> Usa el botón <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">Catálogo</span> para precios rápidos actualizados. Si el precio cambió, usa el deslizador de "Ajuste por Inflación" y dale a APLICAR.
            </li>
            <li>
                <strong>Mano de Obra:</strong> No cobres "a ojo". Calcula cuántos días te llevará y multiplica por tu jornal ideal.
            </li>
            <li>
                <strong>Gastos Generales (15%):</strong> La app agrega esto automáticamente. Cubre nafta, desgaste de herramientas, seguro, celular y días de lluvia.
            </li>
            <li>
                <strong>Beneficio (10%):</strong> Es tu ganancia neta para crecimiento de la empresa, no para vivir.
            </li>
            <li>
                <strong>Exportar:</strong> Al finalizar, dale a "Crear Presupuesto" para llevar todos los datos a una hoja lista para imprimir.
            </li>
          </ol>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="no-print">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <BookOpen className="w-6 h-6 text-blue-600"/> Guías y Recursos
         </h2>
         <p className="text-sm text-slate-500">Manuales técnicos y mejores prácticas para el profesional.</p>
      </div>

      <div className="grid gap-4">
        {guides.map((guide) => (
          <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <button 
              onClick={() => toggleSection(guide.id)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <div className="flex items-center gap-4">
                 <div className={`p-2 rounded-lg bg-slate-50 ${guide.color}`}>
                   <guide.icon className="w-6 h-6" />
                 </div>
                 <span className="font-bold text-slate-800 text-lg">{guide.title}</span>
              </div>
              {openSection === guide.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {openSection === guide.id && (
              <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2">
                 {guide.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white text-center">
         <h3 className="font-bold text-lg mb-2">¿Necesitas más capacitación?</h3>
         <p className="text-slate-300 text-sm mb-4">Sigue nuestras redes para cursos completos sobre gas, plomería y electricidad.</p>
         <a 
           href="https://instagram.com/nubeeducativa" 
           target="_blank" 
           rel="noreferrer"
           className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg select-none"
         >
           Seguir a @nubeeducativa
         </a>
      </div>
    </div>
  );
};

export default Guides;