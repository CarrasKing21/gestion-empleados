// Importa React para poder usar JSX
import React from 'react';
// Importa el componente base Button de tu librería
import Button from './Button'; 
// Importa el icono de papelera desde la librería de iconos Tabler
import { IconTrash } from '@tabler/icons-react'; 

// Componente DeleteButton, reutiliza el componente Button
const DeleteButton = ({ isConfirming = false, ...props }) => {
  // Determina la clase, el texto y el icono en función del estado de confirmación.
  const buttonText = isConfirming ? 'Confirmar' : 'Eliminar'; // El texto del botón cambia según el estado de confirmación
  const buttonClassName = isConfirming ? 'confirm' : ''; // La clase CSS cambia si está en estado de confirmación

  return (
    // Componente Button con variante 'danger' y las props calculadas.
    <Button // Renderiza el componente Button
      variant="danger" // Establece la variante de estilo a 'danger' (rojo)
      className={buttonClassName} // Aplica la clase CSS dinámica (ej. 'confirm')
      {...props} // Pasa todas las demás props al componente Button
    >
      {/* Icono de papelera con tamaño 16 y margen a la derecha para separar del texto */}
      <IconTrash size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> {/* Icono de papelera de Tabler Icons */}
      {/* El texto del botón cambia dinámicamente según el estado de confirmación */}
      {buttonText} 
    </Button>
  );
};

// Exporta el componente para poder usarlo en otros archivos 
export default DeleteButton; 
