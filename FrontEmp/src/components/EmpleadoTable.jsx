import React, { useState, useMemo, useEffect } from 'react'; // Importa React y hooks esenciales
import EditButton from './ui/EditButton'; // Importa el componente de botón de edición
import DeleteButton from './ui/DeleteButton'; // Importa el componente de botón de eliminación
import Button from './ui/Button'; // Importa el componente de botón genérico
import DataTable from './ui/DataTable'; // Importa el componente de tabla de datos
import styles from './EmpleadoTable.module.css'; // Importa los estilos CSS específicos del componente
import Spinner from './ui/Spinner'; // Importa el componente de spinner de carga


// Funciones de ayuda para formatear los datos
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'No especificado';
  }
  // Formatea el número como moneda para España (Euro) con el formato local
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};
const formatDate = (dateString) => {
  if (!dateString) { // Si la cadena de fecha está vacía o nula
    return 'No especificada';
  }
  try {
    const date = new Date(dateString); // Crea un objeto Date a partir de la cadena
    // Formatea la fecha al estilo local de España (dd/mm/aaaa) usando Intl.DateTimeFormat
    return new Intl.DateTimeFormat('es-ES').format(date);
  } catch (error) {
    // Si la fecha no es válida, devuelve el string original
    return dateString;
  }
};

// Función auxiliar para generar los números de página a mostrar
const getPaginationGroup = (currentPage, totalPages) => { // Recibe la página actual y el total de páginas
  const pageNeighbours = 1; // Cuántos números mostrar a cada lado de la página actual
  const totalNumbers = (pageNeighbours * 2) + 3; // Números vecinos + página actual + primera y última página
  const totalBlocks = totalNumbers + 2; // Incluyendo los '...'

  if (totalPages <= totalBlocks) { // Si el total de páginas es menor o igual al número de bloques a mostrar
    // Si no hay suficientes páginas para necesitar '...', muestra todos los números
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPage = Math.max(2, currentPage - pageNeighbours); // Calcula la página de inicio para los vecinos
  const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours); // Calcula la página final para los vecinos

  let pages = [1]; // Siempre incluye la primera página

  if (startPage > 2) { // Si hay un salto entre la primera página y los vecinos
    pages.push('...'); // Añade '...'
  }

  for (let i = startPage; i <= endPage; i++) { // Añade los números de página vecinos
    pages.push(i);
  }

  if (endPage < totalPages - 1) { // Si hay un salto entre los vecinos y la última página
    pages.push('...'); // Añade '...'
  }

  pages.push(totalPages); // Siempre incluye la última página

  return pages; // Devuelve el array de números de página y '...'
};

const EmpleadoTable = ({
  empleados, // Lista de empleados a mostrar
  isLoading, // Estado de carga de los datos
  error, // Mensaje de error si ocurre uno
  onAddEmployee, // Función para añadir un nuevo empleado
  onEditEmployee, // Función para editar un empleado existente
  onDeleteEmployee, // Función para eliminar un empleado
  // Props de paginación
  currentPage,
  totalPages,
  onPageChange,
  totalEmpleados,
  searchTerm,
  onSearchTermChange,
  isSearching,
}) => { // Componente funcional EmpleadoTable que recibe varias props
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null); // Estado para controlar qué empleado está en proceso de confirmación de borrado
  // Definimos las columnas para la tabla de empleados usando useMemo para optimizar
  const columns = useMemo(() => [ // useMemo memoriza el resultado de esta función y solo la recalcula si sus dependencias cambian
    {
      header: 'Nombre', // Encabezado de la columna
      accessor: 'nombre', // Clave para acceder al valor en los datos del empleado
    },
    {
      header: 'Apellidos', // Encabezado de la columna
      accessor: 'apellidos', // Clave para acceder al valor
    },
    {
      header: 'Departamento', // Encabezado de la columna
      accessor: 'departamento', // Clave para acceder al valor
    },
    {
      header: 'Salario', // Encabezado de la columna
      accessor: 'salario', // Clave para acceder al valor
      Cell: ({ row }) => formatCurrency(row.salario), // Usamos el renderizador para formatear
    },
    {
      header: 'Fecha Nacimiento', // Encabezado de la columna
      accessor: 'fechaNacimiento', // Clave para acceder al valor
      Cell: ({ row }) => formatDate(row.fechaNacimiento), // Usamos el renderizador para formatear
    },
    {
      header: 'Puesto', // Encabezado de la columna
      accessor: 'puestoName', // Clave para acceder al nombre del puesto
      Cell: ({ row }) => row.puestoName || 'No asignado',
    },
    {
      header: 'Acciones', // Encabezado de la columna para los botones de acción
      accessor: 'actions', // Clave para acceder a las acciones (no hay valor directo, se renderiza)
      // Renderizador personalizado para la celda de acciones
      Cell: ({ row }) => (
        <div className={styles.actions}> {/* Contenedor para los botones de acción */}
          <EditButton onClick={() => onEditEmployee(row)} /> {/* Botón de edición, llama a onEditEmployee con el empleado actual */}
          <DeleteButton
            onClick={() => handleDeleteClick(row.id)} // Llama a handleDeleteClick al hacer clic
            isConfirming={confirmingDeleteId === row.id} // Pasa el estado de confirmación al botón
            title={confirmingDeleteId === row.id ? `Confirmar eliminación de ${row.nombre}` : `Eliminar a ${row.nombre}`} // Título del botón (tooltip)
          />
        </div>
      ),
    },
  ], [onEditEmployee, onDeleteEmployee, confirmingDeleteId]); // Dependencias: se recalcula si estas props o estado cambian

  useEffect(() => { // Efecto para manejar el temporizador de confirmación de borrado
    if (confirmingDeleteId !== null) { // Si hay un ID en confirmación
      const timer = setTimeout(() => { // Inicia un temporizador
        setConfirmingDeleteId(null); // Después de 3 segundos, resetea el ID de confirmación
      }, 3000); // Duración del temporizador: 3 segundos
      return () => clearTimeout(timer); // Función de limpieza: cancela el temporizador si el componente se desmonta o la dependencia cambia
    }
  }, [confirmingDeleteId]); // Se ejecuta cuando confirmingDeleteId cambia

  const handleDeleteClick = (id) => { // Manejador para el clic en el botón de eliminar
    if (confirmingDeleteId === id) { // Si ya se está confirmando este ID
      onDeleteEmployee(id); // Llama a la función de eliminación real
      setConfirmingDeleteId(null); // Resetea el estado de confirmación
    } else { // Si es el primer clic
      setConfirmingDeleteId(id); // Establece el ID para iniciar la confirmación
    }
  };

  if (isLoading) { // Si los datos están cargando
    return <div className={styles.centered}><Spinner /></div>; // Muestra un spinner centrado
  }

  if (error) { // Si hay un error
    return <div className={styles.centered}>{error}</div>; // Muestra el mensaje de error centrado
  }

  return ( // Renderiza la tabla y sus controles
    <div className={styles.tableContainer}> {/* Contenedor principal de la tabla */}
      <div className={styles.tableHeader}> {/* Encabezado de la sección de la tabla */}
        <h1>Gestión de Empleados</h1> {/* Título principal */}
        <div className={styles.controlsContainer}> {/* Contenedor para el botón de añadir y la búsqueda */}
          <Button onClick={onAddEmployee} variant="primary">Añadir Empleado</Button> {/* Botón para añadir empleado */}
          <div className={styles.searchControls}> {/* Controles para la barra de búsqueda */}
            <input
              type="text" // Tipo de input: texto
              placeholder="Buscar empleado..." // Texto de marcador de posición
              value={searchTerm} // Valor actual del input, controlado por el estado
              onChange={(e) => onSearchTermChange(e.target.value)} // Manejador de cambio, actualiza el término de búsqueda
              className={styles.searchInput} // Clase CSS para el estilo del input
            />
            {isSearching && ( // Si se está realizando una búsqueda (debounced)
              <div className={styles.spinnerContainer}><Spinner size="small" /></div> // Muestra un spinner pequeño
            )}
          </div>
        </div>
      </div>

      {/* Usamos el componente DataTable para mostrar los empleados */}
      <DataTable // Componente genérico de tabla
        columns={columns} // Columnas definidas anteriormente
        data={empleados} // Datos de los empleados a mostrar
        noDataMessage="No hay empleados que mostrar." // Mensaje si no hay datos
        noResultsOnSearchMessage={searchTerm ? "No se encontraron empleados con ese criterio de búsqueda." : null} // Mensaje si no hay resultados de búsqueda
      />

      {/* Añadimos los controles de paginación si hay más de una página */}
      {totalPages > 1 && ( // Solo muestra los controles si hay más de una página
        <div className={styles.paginationControls}> {/* Contenedor de los controles de paginación */}
          <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}> {/* Botón "Anterior" */}
            Anterior {/* Texto del botón */}
          </Button> {/* Deshabilitado si estamos en la primera página */}
          <div className={styles.pageNumbers}> {/* Contenedor para los números de página */}
            {getPaginationGroup(currentPage, totalPages).map((page, index) => { // Mapea el grupo de páginas generado
              if (page === '...') { // Si el elemento es '...'
                return <span key={`dots-${index}`} className={styles.dots}>...</span>; // Renderiza los puntos suspensivos
              }
              return (
                <Button
                  key={page} // Clave única para cada botón de página
                  onClick={() => onPageChange(page)} // Cambia de página al hacer clic
                  variant={currentPage === page ? 'primary' : 'secondary'} // Variante de estilo (primario si es la página actual)
                  className={styles.pageNumberButton} // Clase CSS adicional
                >
                  {page} {/* Número de página */}
                </Button>
              );
            })}
          </div>
          <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}> {/* Botón "Siguiente" */}
            Siguiente {/* Texto del botón */}
          </Button> {/* Deshabilitado si estamos en la última página */}
        </div>
      )}
    </div>
  );
};

export default EmpleadoTable; // Exporta el componente EmpleadoTable