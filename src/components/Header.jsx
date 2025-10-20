import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const NAV_ITEMS = [
  { href: "#home", label: "Início" },
  { href: "#services", label: "Serviços" },
  { href: "#about", label: "Sobre" },
  { href: "#testimonials", label: "Depoimentos" },
  { href: "#contact", label: "Contato" }
];

const Header = ({ abrirModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Função para abrir o modal diretamente
  const handleAgendarClick = (e) => {
    e.preventDefault();
    closeMenu(); // Fecha o menu mobile se estiver aberto
    abrirModal(); // Abre o modal de agendamento
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="mx-auto px-4 py-3">
        
        {/* Grid Principal - Substituindo o flex */}
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-4">
          
          {/* Logo - Primeira coluna */}
          <a 
            href="#home" 
            className="grid grid-cols-[fit_auto] grid-rows-[auto_auto] gap-0 p-0 text-xl md:text-2xl font-bold text-primary cursor-pointer justify-self-start text-start"
            aria-label="Voltar para o Início"
            onClick={(e) => handleNavClick(e, '#home')}
          >
            <img
              src="/src/assets/FaviconSVG.svg"
              alt="Logo Michely Massoterapia"
              className="w-16 h-16 md:w-16 md:h-16 object-contain filter drop-shadow-lg row-span-full"
            />
            <span className="col-2 row-1">Michely <br />            
            </span>
            <span className="col-2 row-2 font-size-2xl font-semibold">Massoterapia</span>              
          </a>

          {/* Menu Desktop - Segunda coluna (centralizada) */}
          <nav className="hidden md:block justify-self-center" aria-label="Navegação principal">
            <ul className="grid grid-flow-col gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href} 
                    className="text-dark font-medium hover:text-primary transition-colors text-sm whitespace-nowrap"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Container Direita - Terceira coluna */}
          <div className="grid grid-cols-[auto_auto] gap-4 items-center justify-self-end">
            
            {/* Botão Agendar Horário Desktop */}
            <button 
              className="hidden md:inline-block bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-accent transition-all shadow-lg hover:shadow-primary/30 text-sm hover:-translate-y-0.5 whitespace-nowrap"
              onClick={handleAgendarClick}
            >
              Agendar Horário
            </button>

            {/* Botão Menu Hamburguer */}
            <button 
              className="bg-secondary md:hidden p-2 rounded-lg hover:bg-light transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-dark" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Segunda linha: Botão Agendar Horário Centralizado - apenas em mobile */}
        <div className="md:hidden grid justify-center mt-4">
          <button 
            className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-accent transition-all shadow-lg hover:shadow-primary/30 text-center max-w-xs text-lg hover:-translate-y-0.5 justify-self-center col-span-full"
            onClick={handleAgendarClick}
          >
            Agendar Horário
          </button>
        </div>

        {/* Menu Mobile */}
        <div 
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav aria-label="Navegação mobile">
            <ul className="grid gap-2 bg-light rounded-lg p-3 shadow-inner">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href} 
                    className="block text-dark font-medium hover:text-primary transition-colors p-2 hover:bg-white rounded text-sm"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              {/* Item adicional para agendamento no menu mobile */}
              <li className="border-t border-gray-200 pt-2 mt-2">
                <button 
                  className="block w-full text-primary font-semibold hover:bg-primary hover:text-white transition-colors p-2 rounded text-sm text-center"
                  onClick={handleAgendarClick}
                >
                  📅 Agendar Sessão
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;