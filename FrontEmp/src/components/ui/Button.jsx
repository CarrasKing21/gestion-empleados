// Importamos React para poder crear componentes y usar JSX
import React, { Children } from 'react';

// Importamos el archivo de estilos CSS asociado a este componente, donde se definen las clases .btn, .primary, .secondary, etc.
import './Button.css'; 

// Definimos un componente funcional llamado Button
// Este componente es reutilizable y configurable mediante props
const Button = ({
  variant = 'primary',   // Prop para definir la variante de estilo del botón (ej: 'primary', 'secondary', 'danger'). Por defecto es 'primary'.
  size = 'medium',       // Prop para definir el tamaño del botón ('small', 'medium', 'large'). Por defecto es 'medium'.
  disabled = false,      // Prop booleana que define si el botón está deshabilitado. Por defecto es false.
  children,              // Prop que representa el contenido interno del botón (texto, íconos, otros elementos).
  onClick,               // Prop que es una función que se ejecutará cuando se haga clic en el botón.
  className = '',        // Prop para añadir clases CSS adicionales personalizadas al botón. Por defecto es una cadena vacía.
  title,                 // Prop para el atributo 'title' del botón (tooltip) y como 'aria-label' si no hay texto visible.
  ...props               // Resto de props que se pasarán directamente al elemento <button> nativo.
}) => {

  // Combinamos dinámicamente las clases CSS
  // - 'btn' es la clase base para todos los botones
  // - 'variant' y 'size' cambian el color, borde y tamaño según el tipo de botón
  // - 'className' permite añadir clases personalizadas externas
  const classNames = `btn ${variant} ${size} ${className}`;

  // Determina si el botón tiene contenido de texto visible.
  // Esto nos ayuda a decidir si necesitamos un aria-label.
  const hasVisibleText = Children.toArray(children).some(child => typeof child === 'string' && child.trim() !== '');

  // Prepara los props de accesibilidad.
  // Si no hay texto visible y hay un 'title', lo usamos como 'aria-label'.
  const accessibilityProps = !hasVisibleText && title ? { 'aria-label': title } : {}; // Si no hay texto visible y hay un título, usa el título como aria-label

  // Renderizamos el botón con sus propiedades dinámicas
  return (
    <button // Elemento HTML button
      className={classNames}   // Aplica las clases CSS calculadas dinámicamente
      title={title}            // Establece el atributo 'title' para el tooltip visual
      disabled={disabled}      // Establece el atributo 'disabled' si la prop 'disabled' es true
      onClick={onClick}        // Asigna la función 'onClick' al evento de clic
      {...props}               // Pasa todas las demás props restantes al elemento button
      {...accessibilityProps}  // Añade los props de accesibilidad (aria-label) si son necesarios
    >
      {/* children representa el contenido dentro del botón (por ejemplo: <Button>Guardar</Button>) */}
      {children}
    </button>
  );
};

// Exportamos el componente para que pueda ser utilizado en otros archivos
export default Button; 
