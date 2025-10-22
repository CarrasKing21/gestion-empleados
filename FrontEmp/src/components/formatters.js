// src/utils/formatters.js

export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'No especificado';
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};