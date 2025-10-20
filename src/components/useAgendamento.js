import { useState } from 'react';

export const useAgendamento = () => {
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false);

  const openAgendamento = () => setIsAgendamentoOpen(true);
  const closeAgendamento = () => setIsAgendamentoOpen(false);

  return {
    isAgendamentoOpen,
    openAgendamento,
    closeAgendamento
  };
};