import React, { useState } from 'react';
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Cta from './components/Cta'
import Footer from './components/Footer'
import AgendamentoModal from './components/AgendamentoModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModal = () => {
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <Header abrirModal={abrirModal} />
      <Hero abrirModal={abrirModal} />
      <Services />
      <About />
      <Testimonials />
      <Cta abrirModal={abrirModal} />
      <Footer />
      <AgendamentoModal 
        isOpen={isModalOpen} 
        onClose={fecharModal} 
      />
    </div>
  )
}

export default App