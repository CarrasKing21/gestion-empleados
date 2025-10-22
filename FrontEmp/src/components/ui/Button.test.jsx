import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

// `describe` agrupa tests relacionados. En este caso, para el componente Button.
describe('Button Component', () => {

  // `it` o `test` define un caso de prueba individual.
  it('debería renderizar el botón con el texto que se le pasa como hijo', () => {
    // 1. Arrange (Preparar): Renderizamos el componente que queremos probar.
    // Le pasamos el texto "Click me" como `children`.
    render(<Button>Click me</Button>);

    // 2. Act (Actuar) & Assert (Afirmar): Buscamos el botón en la pantalla y comprobamos que existe.
    // `screen.getByRole` busca un elemento por su rol de accesibilidad.
    // `{ name: /click me/i }` busca un botón cuyo texto visible sea "Click me" (sin importar mayúsculas/minúsculas).
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    // `expect` es la aserción. Comprobamos si el elemento encontrado está en el documento.
    expect(buttonElement).toBeInTheDocument();
  });

});