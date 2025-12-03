import React, { useState } from 'react';
import { Flame, Droplets, Calculator, ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckCircle, Thermometer, Clock, Search, FileText, ClipboardCheck, Save, Smartphone } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

const Guides: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('manual_app');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const guides: GuideSection[] = [
    {
      id: 'manual_app',
      title: 'Manual de Uso: Domina la Suite',
      icon: Smartphone,
      color: 'text-green-500',
      content: (
        <div className="space-y-8 text-slate-700">
          <p className="text-sm font-medium">
            Bienvenido a <strong>Maestro Plomero Suite 2026</strong>. Esta herramienta funciona como un sistema integrado. Aquí te explicamos cómo sacar el máximo provecho a cada sección.
          </p>
          
          {/* Seccion Calculadora */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-lg">
              <div className="bg-blue-600 text-white p-1 rounded">1</div> Calculadora de Costos
            </h4>
            <p className="text-sm mb-3">El corazón de la app. Aquí defines cuánto cuesta realmente el trabajo.</p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <Search className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                <span>
                  <strong>Catálogo vs. Manual:</strong> Usa el botón "Catálogo" para buscar precios de referencia (IPS, Sigas, etc.). Si no encuentras algo, usa "+ Manual" para escribirlo tú mismo.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="font-bold text-red-500 text-xs mt-1 border border-red-200 px-1 rounded">INFLACIÓN</div>
                <span>
                  <strong>Ajuste Global:</strong> ¿Subieron los precios un 5% hoy? No cambies uno por uno. Mueve el deslizador superior al 5% y dale a <strong>APLICAR</strong>. Esto actualizará todos los ítems de la lista instantáneamente.
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <Calculator className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                <span>
                  <strong>Beneficio Automático:</strong> La app suma automáticamente un 15% de gastos generales (movilidad, seguro) y un 10% de ganancia neta. El "Precio Sugerido" es lo que deberías cobrar para ser rentable.
                </span>
              </li>
            </ul>
          </div>

          {/* Seccion Presupuesto */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-lg">
              <div className="bg-blue-600 text-white p-1 rounded">2</div> Generador de Presupuestos
            </h4>
            <p className="text-sm mb-3">Transforma tus cálculos en un documento PDF profesional.</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
               <li>
                 <strong>Importación Inteligente:</strong> No escribas dos veces. Arriba a la derecha tienes un botón <span className="font-bold text-slate-600">Importar Costos</span>. Al tocarlo, trae todo lo que calculaste en la pestaña anterior.
               </li>
               <li>
                 <strong>Personalización:</strong> Toca el recuadro "Logo Empresa" para subir tu imagen desde el celular. Completa tus datos una sola vez; la app los recordará.
               </li>
               <li>
                 <strong>Modo WhatsApp:</strong> El botón verde genera un mensaje de texto automático con el saludo al cliente y el total, listo para enviar.
               </li>
               <li>
                 <strong>PDF / Imprimir:</strong> El botón azul abre la vista de impresión del sistema. Desde allí puedes "Guardar como PDF" para enviarlo por mail.
               </li>
            </ol>
          </div>

          {/* Seccion Checklist */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-lg">
              <div className="bg-blue-600 text-white p-1 rounded">3</div> Checklist de Seguridad
            </h4>
            <p className="text-sm mb-3">Tu respaldo legal ante la ART y el cliente.</p>
            <ul className="space-y-2 text-sm">
               <li>• <strong>Dos Modos:</strong> Usa "Obra Nueva" para instalaciones completas (exige casco, botines, disyuntor) o "Reparación" para urgencias (exige corte de agua y electricidad).</li>
               <li>• <strong>Puntos Críticos:</strong> Los ítems marcados como <span className="text-red-500 font-bold text-xs">OBLIGATORIO</span> no deben ignorarse bajo ningún concepto.</li>
               <li>• <strong>Respaldo:</strong> Al finalizar, imprime o guarda el PDF. Si hay un accidente, este documento prueba que verificaste la seguridad antes de empezar.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
             <Save className="w-5 h-5 text-blue-600 shrink-0" />
             <div>
                <h5 className="font-bold text-blue-800 text-sm">Guardado Automático</h5>
                <p className="text-xs text-blue-700">
                  No necesitas crear cuenta. Todo lo que escribes se guarda en la memoria de tu teléfono/navegador. Si cierras la app y vuelves mañana, tus precios y datos seguirán ahí (mientras no borres el historial de navegación).
                </p>
             </div>
          </div>
        </div>
      )
    },
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