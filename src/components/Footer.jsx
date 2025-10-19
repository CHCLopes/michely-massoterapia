import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import "tailwindcss";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8 scroll-mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-xl text-secondary font-bold mb-6"> Michely<br />Massoterapia </h3>
            <p className="mb-4">
              Especializada em massoterapia e bem-estar, proporcionando relaxamento e qualidade de vida.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl text-secondary font-bold mb-6">Contato</h3>
            <p className="flex items-center mb-3">
              <FaWhatsapp className="mr-3 text-secondary" />
              (81) 99709-0559
            </p>
            <p className="flex items-center">
              <FaEnvelope className="mr-3 text-secondary" />
              michelyrfarias@yahoo.com.br
            </p>
          </div>
          
          <div>
            <h3 className="text-xl text-secondary font-bold mb-6">Atendimento</h3>
            <p>Segunda a Sábado, das 08h as 19h </p>
          </div>
          
          <div>
            <h3 className="text-xl text-secondary font-bold mb-6">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FaWhatsapp />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FaTelegram />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p>&copy; 2025 Michely Massoterapia - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;