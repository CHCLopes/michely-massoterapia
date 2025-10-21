import React, { useState } from 'react';
import { XMarkIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

const AgendamentoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dataAgendamento: '',
    horarioAgendamento: '',
    quantidadePessoas: '1',
    nome: '',
    telefone: '',
    endereco: '',
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
    // Corrigindo o problema do fuso horário - usando a data UTC
    const dataUTC = new Date(date + 'T12:00:00Z'); // Usando meio-dia UTC para evitar problemas de fuso
    const dataLocal = new Date(dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000);
    
    setFormData({
      ...formData,
      dataAgendamento: dataLocal.toISOString().split('T')[0] // Garante a data correta
    });
    setMostrarCalendario(false);
  };

  const isDataPassada = (date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(date + 'T12:00:00Z');
    return dataSelecionada < hoje;
  };

  const gerarProximosDias = () => {
    const dias = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje);
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

  // Função para gerar horários disponíveis das 09:30 às 19:00 em intervalos de 30min
  const gerarHorariosDisponiveis = (dataSelecionada) => {
    const horariosBase = [];
    
    // Gera horários das 09:30 às 19:00 em intervalos de 30 minutos
    for (let hora = 9; hora <= 19; hora++) {
      if (hora === 9) {
        // Para as 9h, só adiciona 09:30
        horariosBase.push('09:30');
      } else if (hora === 19) {
        // Para as 19h, só adiciona 19:00
        horariosBase.push('19:00');
      } else {
        // Para outras horas, adiciona :00 e :30
        horariosBase.push(`${hora.toString().padStart(2, '0')}:00`);
        horariosBase.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }

    // Se não há data selecionada, retorna todos os horários
    if (!dataSelecionada) return horariosBase;

    const hoje = new Date();
    const dataAgendamento = new Date(dataSelecionada + 'T12:00:00Z');
    
    // Verifica se a data selecionada é hoje
    const isHoje = dataAgendamento.toDateString() === hoje.toDateString();

    if (!isHoje) {
      // Para datas futuras, todos os horários estão disponíveis
      return horariosBase;
    }

    // Para hoje, filtra horários com pelo menos 3 horas de antecedência
    const agora = new Date();
    const tresHorasADiante = new Date(agora.getTime() + 3 * 60 * 60 * 1000); // +3 horas

    return horariosBase.filter(horario => {
      const [horas, minutos] = horario.split(':').map(Number);
      const horarioAgendamento = new Date();
      horarioAgendamento.setHours(horas, minutos, 0, 0);
      
      return horarioAgendamento >= tresHorasADiante;
    });
  };

  // Função para validar o agendamento completo
  const validarAgendamento = () => {
    if (!formData.dataAgendamento || !formData.horarioAgendamento) {
      return { valido: false, mensagem: 'Data e horário são obrigatórios' };
    }

    const dataAgendamento = new Date(formData.dataAgendamento + 'T12:00:00Z');
    const hoje = new Date();
    const isHoje = dataAgendamento.toDateString() === hoje.toDateString();

    if (isHoje) {
      // Converter formato "09:30" para horas e minutos
      const [horas, minutos] = formData.horarioAgendamento.split(':').map(Number);
      const horarioAgendamento = new Date();
      horarioAgendamento.setHours(horas, minutos, 0, 0);
      
      const tresHorasADiante = new Date(hoje.getTime() + 3 * 60 * 60 * 1000);
      
      if (horarioAgendamento < tresHorasADiante) {
        return { 
          valido: false, 
          mensagem: 'Agendamento deve ter no mínimo 3 horas de antecedência para hoje' 
        };
      }
    }

    return { valido: true, mensagem: '' };
  };

  // Função ATUALIZADA para enviar email
const enviarEmail = async (dados) => {
  // URL da function do Netlify
  const apiUrl = '/.netlify/functions/enviar-email';
  
  const emailData = {
    to: 'michelymassoterapia@gmail.com', // Vai receber os agendamentos
    subject: `📅 Agendamento - ${dados.data_agendamento} - ${dados.nome}`,
    dados: dados
  };

  console.log('📤 Enviando para Netlify Function...');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Erro ao enviar agendamento');
  }

  return result;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validacao = validarAgendamento();
    if (!validacao.valido) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Preparar dados para o email
      const dadosParaEmail = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        idade: formData.idade,
        quantidade_pessoas: formData.quantidadePessoas,
        data_agendamento: new Date(formData.dataAgendamento + 'T12:00:00Z').toLocaleDateString('pt-BR'),
        horario_agendamento: formData.horarioAgendamento,
        observacoes: formData.observacoes || 'Nenhuma observação',
        data_hora_solicitacao: new Date().toLocaleString('pt-BR'),
        timestamp: new Date().toISOString(),
      };

      // Enviar email
      await enviarEmail(dadosParaEmail);
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Erro ao enviar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dataAgendamento: '',
      horarioAgendamento: '',
      quantidadePessoas: '1',
      nome: '',
      telefone: '',
      endereco: '',
      email: '',
      idade: '',
      observacoes: ''
    });
    setSubmitStatus('');
    setMostrarCalendario(false);
  };

  if (!isOpen) return null;

  const horariosDisponiveis = gerarHorariosDisponiveis(formData.dataAgendamento);
  const validacao = validarAgendamento();

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
          
          {/* Data de Agendamento */}
          <div>
            <label htmlFor="dataAgendamento" className="block text-sm font-medium text-dark mb-2">
              Data de Agendamento *
            </label>
            <div className="relative">
              <input
                type="text"
                id="dataAgendamento"
                name="dataAgendamento"
                required
                readOnly
                value={formData.dataAgendamento ? 
                  new Date(formData.dataAgendamento + 'T12:00:00Z').toLocaleDateString('pt-BR') : 
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
                          : formData.dataAgendamento === dia.data
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

          {/* Hora de Agendamento */}
          <div>
            <label htmlFor="horarioAgendamento" className="block text-sm font-medium text-dark mb-2">
              Hora de Agendamento *
            </label>
            <div className="relative">
              <select
                id="horarioAgendamento"
                name="horarioAgendamento"
                required
                value={formData.horarioAgendamento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-white"
                disabled={isSubmitting || !formData.dataAgendamento}
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
              {!formData.dataAgendamento 
                ? 'Selecione uma data primeiro' 
                : formData.dataAgendamento === new Date().toISOString().split('T')[0]
                ? `⏰ Para hoje, horários disponíveis a partir de ${new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                : `🕒 Horários disponíveis: 09:30 - 19:00 (30min intervalos)`
              }
            </p>
            
            {/* Mensagem de validação em tempo real */}
            {formData.horarioAgendamento && !validacao.valido && (
              <p className="text-xs text-red-500 mt-1">
                {validacao.mensagem}
              </p>
            )}
          </div>

          {/* Quantidade de Pessoas */}
          <div>
            <label htmlFor="quantidadePessoas" className="block text-sm font-medium text-dark mb-2">
              Quantidade de Pessoas *
            </label>
            <select
              id="quantidadePessoas"
              name="quantidadePessoas"
              required
              value={formData.quantidadePessoas}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={isSubmitting}
            >
              <option value="1">1 pessoa</option>
              <option value="2">2 pessoas</option>
              <option value="3">3 ou mais pessoas</option>
            </select>
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

          {/* Telefone */}
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

          {/* Endereço */}
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-dark mb-2">
              Endereço *
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              required
              value={formData.endereco}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Seu endereço completo"
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
              {validacao.mensagem || '❌ Erro ao enviar solicitação. Tente novamente ou entre em contato diretamente.'}
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
              disabled={isSubmitting || !validacao.valido}
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-accent hover:-translate-y-1 transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Agendamento'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-light rounded-b-2xl text-center">
          <p className="text-sm text-dark">
            ⚠️ Horário de funcionamento: 09:30 - 19:00 • Agendamentos para hoje exigem 3 horas de antecedência • Cancelamentos com no mínimo 3 horas de antecedência
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoModal;