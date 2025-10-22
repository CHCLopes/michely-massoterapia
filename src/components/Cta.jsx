import React from 'react';

const Cta = ({ abrirModal }) => {
  return (
    <section 
      id="contact" 
      className="py-24 text-white text-center scroll-mt-20"
      style={{
        background: 'linear-gradient(to right, #07a0a4, #8dd3c7)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 pt-6 pl-6 backdrop-blur-sm border border-white/20 shadow-lg shadow-white/30">
            <img
              src="/images/iconSVG.svg"
              alt="Logo Michely Massoterapia"
              className="w-40 h-40 md:w-24 md:h-24 object-contain filter drop-shadow-lg"
            />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Pronto para uma experiência transformadora?
        </h2>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 opacity-90">
          Agende agora mesmo sua sessão e descubra os benefícios da massoterapia para sua saúde e bem-estar.
        </p>
        <button 
          onClick={abrirModal}
          className="inline-block bg-white text-[#07a0a4] px-8 py-4 rounded-full font-bold hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-lg hover:shadow-white/30 text-lg"
        >
          Venha para Michely Massoterapia
        </button>
      </div>
    </section>
  );
};

export default Cta;