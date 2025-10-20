import React from 'react';
import "tailwindcss";

const Hero = () => {
  return (
    <>
      <section id='home' className='pt-40 pb-20 bg-light bg-opacity-90 bg-[url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect fill=\"%2303876a\" fill-opacity=\"0.1\" width=\"100\" height=\"100\"/></svg>")] text-center scroll-mt-10 w-'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl md:text-5xl font-bold text-primary mb-5'>Bem-estar e relaxamento <br /> para seu corpo e sua mente <br /> em Recife</h1>
        <p className='text-lg text-dark max-w-2xl mx-auto mb-8'>
          Descubra os benefícios da massoterapia <br /> com uma profissional especializada e transforme sua qualidade de vida.
        </p>
        <a href='#services' className='bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-accent hover:-translate-y-1 transition-all shadow-lg hover:shadow-primary/30'>
          Conheça nossos Serviços
        </a>
      </div>
    </section>
    </>
  );
};

export default Hero;