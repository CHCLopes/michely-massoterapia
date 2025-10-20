import React, { useState } from 'react';
import { XMarkIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

const AgendamentoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dataDesejada: '',
    horarioDesejado: '',
    nome: '',
    telefone: '',
    email: '',
    idade: '',
    observacoes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateSelect = (date) => {
    setFormData({
      ...formData,
      dataDesejada: date
    });
    setMostrarCalendario(false);
  };

  const isDataPassada = (date) => {
    return new Date(date) < new Date().setHours(0, 0, 0, 0);
  };

  const gerarProximosDias = () => {
    const dias = [];
    const hoje = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() + i);
      const dataStr = data.toISOString().split('T')[0];
      
      dias.push({
        data: dataStr,
        formatada: data.toLocaleDateString('pt-BR', { 
          weekday: 'short', 
          day: '2-digit', 
          month: '2-digit' 
        }),
        passada: isDataPassada(dataStr)
      });
    }
    
    return dias;
  };

  // Horários disponíveis
  const horariosDisponiveis = [
    '07:00','08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dataDesejada || !formData.horarioDesejado) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulação de envio - substitua pela integração desejada
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Dados do agendamento:', formData);
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Erro ao processar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dataDesejada: '',
      horarioDesejado: '',
      nome: '',
      telefone: '',
      email: '',
      idade: '',
      observacoes: ''
    });
    setSubmitStatus('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            Agendar Sessão
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-light transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-6 h-6 text-dark" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Data Desejada */}
          <div>
            <label htmlFor="dataDesejada" className="block text-sm font-medium text-dark mb-2">
              Data Desejada *
            </label>
            <div className="relative">
              <input
                type="text"
                id="dataDesejada"
                name="dataDesejada"
                required
                readOnly
                value={formData.dataDesejada ? 
                  new Date(formData.dataDesejada).toLocaleDateString('pt-BR') : 
                  ''
                }
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer bg-white"
                placeholder="Selecione uma data"
                disabled={isSubmitting}
              />
              <CalendarDaysIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Seletor de Datas */}
            {mostrarCalendario && (
              <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-white shadow-lg">
                <h3 className="text-sm font-semibold text-dark mb-3">
                  Selecione uma data disponível
                </h3>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                  {gerarProximosDias().map((dia) => (
                    <button
                      key={dia.data}
                      type="button"
                      onClick={() => !dia.passada && handleDateSelect(dia.data)}
                      disabled={dia.passada}
                      className={`
                        p-2 text-xs rounded-lg border transition-all
                        ${dia.passada
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : formData.dataDesejada === dia.data
                          ? 'bg-primary border-primary text-white'
                          : 'bg-light border-gray-200 text-dark hover:bg-secondary hover:border-primary'
                        }
                      `}
                    >
                      <div className="font-medium">{dia.formatada.split(' ')[1]}</div>
                      <div className="text-[10px] opacity-70">
                        {dia.formatada.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Legenda Simplificada */}
                <div className="mt-3 flex gap-4 text-xs text-dark">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Indisponível</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Horário Desejado */}
          <div>
            <label htmlFor="horarioDesejado" className="block text-sm font-medium text-dark mb-2">
              Horário Desejado *
            </label>
            <div className="relative">
              <select
                id="horarioDesejado"
                name="horarioDesejado"
                required
                value={formData.horarioDesejado}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
                disabled={isSubmitting || !formData.dataDesejada}
              >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map((horario) => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
              <ClockIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {!formData.dataDesejada ? 'Selecione uma data primeiro' : 'Horários disponíveis para o dia escolhido'}
            </p>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-dark mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Seu nome completo"
              disabled={isSubmitting}
            />
          </div>

          {/* Telefone/WhatsApp */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-dark mb-2">
              Telefone/WhatsApp *
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="(11) 99999-9999"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="seu@email.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Idade */}
          <div>
            <label htmlFor="idade" className="block text-sm font-medium text-dark mb-2">
              Idade *
            </label>
            <input
              type="number"
              id="idade"
              name="idade"
              required
              min="1"
              max="120"
              value={formData.idade}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Sua idade"
              disabled={isSubmitting}
            />
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-dark mb-2">
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows="3"
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Alguma observação importante? (opcional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Status Message */}
          {submitStatus === 'success' && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Agendamento solicitado com sucesso! Entraremos em contato para confirmação.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ❌ Erro ao enviar solicitação. Tente novamente ou entre em contato diretamente.
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.dataDesejada || !formData.horarioDesejado}
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-accent hover:-translate-y-1 transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Agendamento'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-light rounded-b-2xl text-center">
          <p className="text-sm text-dark">
            ⚠️ O agendamento será confirmado após contato
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoModal;