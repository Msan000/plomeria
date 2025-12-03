import React, { useState, useEffect } from 'react';
import { Calculator, FileText, ClipboardCheck, Wrench, BookOpen, Lock, ChevronRight, Instagram, GraduationCap, X, Heart } from 'lucide-react';
import { AppTab } from './types';
import PriceCalculator from './components/PriceCalculator';
import BudgetGenerator from './components/BudgetGenerator';
import SafetyChecklist from './components/SafetyChecklist';
import Guides from './components/Guides';

const PIN_CODE = "2123";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CALCULATOR);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Persistent navigation state
  useEffect(() => {
    const savedTab = localStorage.getItem('mps_active_tab');
    if (savedTab && Object.values(AppTab).includes(savedTab as AppTab)) {
      setActiveTab(savedTab as AppTab);
    }
    
    // Check session validity (simple check)
    const session = sessionStorage.getItem('mps_session');
    if (session === 'valid') {
      setIsAuthenticated(true);
    }
  }, []);

  // Popup Timer Logic
  useEffect(() => {
    if (isAuthenticated) {
      // Check if popup has already been shown in this session
      const hasShown = sessionStorage.getItem('mps_popup_shown');
      
      if (!hasShown) {
        const timer = setTimeout(() => {
          setShowPopup(true);
          sessionStorage.setItem('mps_popup_shown', 'true');
        }, 15000); // 15 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    localStorage.setItem('mps_active_tab', tab);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN_CODE) {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('mps_session', 'valid');
    } else {
      setLoginError(true);
      setPinInput('');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.CALCULATOR:
        return <PriceCalculator onExportToBudget={() => handleTabChange(AppTab.BUDGET)} />;
      case AppTab.BUDGET:
        return <BudgetGenerator />;
      case AppTab.CHECKLIST:
        return <SafetyChecklist />;
      case AppTab.GUIDES:
        return <Guides />;
      default:
        return <PriceCalculator />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Maestro Plomero</h1>
          <p className="text-blue-600 font-bold tracking-widest text-xs mb-6 uppercase">Suite 2026</p>
          <p className="text-slate-500 mb-6 text-sm">Ingrese su PIN de acceso para continuar</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              className="w-full text-center text-3xl tracking-[1em] py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm font-medium animate-pulse">PIN Incorrecto</p>}
            
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Ingresar <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 select-none">© Nube Educativa</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-inter relative">
      
      {/* 15-Second Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border-t-4 border-pink-500">
            <button 
              onClick={() => setShowPopup(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">¡Gracias por tu compra!</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Esperamos que la <strong>Suite 2026</strong> sea tu mejor herramienta en la obra. Estamos creando más contenido exclusivo para vos.
              </p>
              
              <a 
                href="https://instagram.com/nubeeducativa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowPopup(false)}
                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Seguir a @nubeeducativa
                </div>
              </a>
              <p className="text-xs text-slate-400 mt-4">Novedades, cursos y tips todas las semanas.</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed h-full bg-slate-900 text-white shadow-xl z-10 no-print">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Maestro Plomero</h1>
              <span className="text-xs text-blue-400 font-bold tracking-widest">SUITE 2026</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleTabChange(AppTab.CALCULATOR)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.CALCULATOR 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="font-medium">Calculadora</span>
          </button>
          
          <button
            onClick={() => handleTabChange(AppTab.BUDGET)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.BUDGET 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Presupuestos</span>
          </button>
          
          <button
            onClick={() => handleTabChange(AppTab.CHECKLIST)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.CHECKLIST 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span className="font-medium">Seguridad</span>
          </button>

          <button
            onClick={() => handleTabChange(AppTab.GUIDES)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === AppTab.GUIDES 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Guías & Tips</span>
          </button>

          <a 
             href="https://drive.google.com/drive/folders/1xLlSzCh8gHou-lJ92Efsgy_gTlOe5pwA?usp=drive_link"
             target="_blank"
             rel="noopener noreferrer"
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white group"
          >
            <GraduationCap className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
            <span className="font-medium">Acceso Curso</span>
          </a>
        </nav>

        <div className="p-6 border-t border-slate-800">
           <a 
              href="https://instagram.com/nubeeducativa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors mb-2 select-none"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-xs font-bold">@nubeeducativa</span>
            </a>
          <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1 select-none">Derechos Reservados</p>
            <p className="select-none">Nube Educativa © 2025</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-20 shadow-md no-print flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Maestro Plomero</h1>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest leading-none">SUITE 2026</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen transition-all">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
        
        {/* Footer for desktop main area (branding redundancy) */}
        <div className="hidden md:block text-center py-6 text-slate-300 text-xs select-none">
          App desarrollada para Nube Educativa - Todos los derechos reservados.
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-50 no-print pb-safe">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => handleTabChange(AppTab.CALCULATOR)}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === AppTab.CALCULATOR ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === AppTab.CALCULATOR ? 'bg-blue-50' : ''}`}>
              <Calculator className={`w-5 h-5 ${activeTab === AppTab.CALCULATOR ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-bold">Costos</span>
          </button>
          
          <button
            onClick={() => handleTabChange(AppTab.BUDGET)}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === AppTab.BUDGET ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
             <div className={`p-1 rounded-full ${activeTab === AppTab.BUDGET ? 'bg-blue-50' : ''}`}>
               <FileText className={`w-5 h-5 ${activeTab === AppTab.BUDGET ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-bold">Presup.</span>
          </button>
          
          <button
            onClick={() => handleTabChange(AppTab.CHECKLIST)}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === AppTab.CHECKLIST ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
             <div className={`p-1 rounded-full ${activeTab === AppTab.CHECKLIST ? 'bg-blue-50' : ''}`}>
              <ClipboardCheck className={`w-5 h-5 ${activeTab === AppTab.CHECKLIST ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-bold">Segur.</span>
          </button>

           <button
            onClick={() => handleTabChange(AppTab.GUIDES)}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === AppTab.GUIDES ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
             <div className={`p-1 rounded-full ${activeTab === AppTab.GUIDES ? 'bg-blue-50' : ''}`}>
              <BookOpen className={`w-5 h-5 ${activeTab === AppTab.GUIDES ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-bold">Guías</span>
          </button>

          <a
            href="https://drive.google.com/drive/folders/1xLlSzCh8gHou-lJ92Efsgy_gTlOe5pwA?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-blue-600"
          >
             <div className="p-1 rounded-full">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold">Curso</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default App;