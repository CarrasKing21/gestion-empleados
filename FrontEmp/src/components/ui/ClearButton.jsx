import React from 'react';
import Button from './Button'; // Ruta correcta
import { IconX } from '@tabler/icons-react';

const ClearButton = (props) => {
  return (
    <Button variant="secondary" size="small" {...props}>
      <p>Limpiar buscador</p>
    </Button>
  );
};

export default ClearButton;
