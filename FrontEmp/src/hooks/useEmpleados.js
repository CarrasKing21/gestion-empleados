import { useState, useEffect, useMemo } from 'react'; // Importa los hooks de React
import { getEmpleados, createEmpleado, getPuestos, updateEmpleado, deleteEmpleado, createPuesto, updatePuesto, deletePuesto } from '../services/empleadoService'; // Importa las funciones de servicio de la API
import { toast } from 'react-hot-toast'; // Importa la librería de notificaciones toast


// Hook principal para gestionar la lógica de negocio de empleados y puestos.
export function useEmpleados() {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
  const [puestos, setPuestos] = useState([]); // Estado para almacenar la lista de puestos
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar si los datos iniciales están cargando
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error globales
  const [isSaving, setIsSaving] = useState(false); // Estado para indicar si una operación de guardado/actualización está en curso

  // Estado para el formulario de Empleados
  const [isEmpleadoFormOpen, setIsEmpleadoFormOpen] = useState(false); // Estado para controlar la visibilidad del formulario de empleados
  const [editingEmpleado, setEditingEmpleado] = useState(null); // Estado para almacenar el empleado que se está editando (null si es nuevo)

  // Estado para el formulario de Puestos
  const [isPuestoFormOpen, setIsPuestoFormOpen] = useState(false); // Estado para controlar la visibilidad del formulario de puestos
  const [editingPuesto, setEditingPuesto] = useState(null); // Estado para almacenar el puesto que se está editando (null si es nuevo)

  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda actual del usuario
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Estado para el término de búsqueda con retardo (debounce)
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la paginación
  const itemsPerPage = 6; // Número de elementos a mostrar por página

  useEffect(() => { // Efecto para la carga inicial de datos al montar el componente
    // Carga inicial de datos (empleados y puestos) en paralelo.
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [empleadosData, puestosData] = await Promise.all([getEmpleados(), getPuestos()]);
        setEmpleados(empleadosData || []);
        setPuestos(puestosData || []);
        setError(null); // Limpia cualquier error anterior
      } catch (err) {
        console.error("Error al cargar datos:", err); // Registra el error en consola
        setEmpleados([]); // Vacía la lista de empleados
        setPuestos([]); // Vacía la lista de puestos
        setError("No se pudieron cargar los datos."); // Establece un mensaje de error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Efecto para aplicar el "debounce" (retardo) al término de búsqueda
  useEffect(() => { // Se ejecuta cada vez que searchTerm cambia
    const timerId = setTimeout(() => { // Establece un temporizador
      setDebouncedSearchTerm(searchTerm); // Actualiza el término de búsqueda con retardo después de 300ms
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    // Limpia el temporizador si el usuario sigue escribiendo
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Reseteamos a la primera página si cambia el término de búsqueda con retardo
  useEffect(() => { // Se ejecuta cuando debouncedSearchTerm cambia
    setCurrentPage(1); // Establece la página actual a 1
  }, [debouncedSearchTerm]); // Ahora depende del término con retardo

  const handleSaveEmpleado = async (empleadoData, id) => { // Función para guardar o actualizar un empleado
    const operation = id ? 'actualizar' : 'crear'; // Determina si es una operación de actualización o creación
    const successMessage = `Empleado ${operation === 'actualizar' ? 'actualizado' : 'creado'} correctamente`; // Mensaje de éxito dinámico
    
    setIsSaving(true); // Activa el estado de guardado (muestra spinner en botón)
    try { // Intenta realizar la operación
      const response = id // Si hay un ID, es una actualización
        ? await updateEmpleado(id, empleadoData) // Llama al servicio para actualizar
        : await createEmpleado(empleadoData); // Llama al servicio para crear

      // La respuesta del backend puede tener el empleado dentro de 'result' o ser el objeto directamente.
      const savedEmpleado = id ? response : response.result;

      if (id) {
        // Al actualizar, la respuesta del backend no incluye 'puestoName', solo 'puestoId'.
        // Para mantener la consistencia en la tabla, buscamos el 'puestoName' y lo añadimos.
        // También nos aseguramos de mantener todos los datos que ya teníamos del empleado.
        const puesto = puestos.find(p => Number(p.id) === Number(empleadoData.puestoId));
        setEmpleados(prev => prev.map(emp => // Actualiza la lista de empleados
          (emp.id === id ? { ...emp, ...empleadoData, puestoName: puesto ? puesto.name : 'No asignado' } : emp) // Si es el empleado editado, actualiza sus datos y el nombre del puesto
        ));
      } else {
        // Al crear, la respuesta del backend ya incluye 'puestoName'.
        setEmpleados(prev => [...prev, savedEmpleado]); // Añade el nuevo empleado a la lista
      }
      
      toast.success(successMessage); // Muestra una notificación de éxito
    } catch (err) {
      const apiData = err.response?.data;
      const validationErrors = apiData?.errors ? Object.entries(apiData.errors).map(([field, messages]) => `${field}: ${messages.join(' ')}`).join('\n') : null;
      const errorMessage = validationErrors || apiData?.title || err.message || `Error al ${operation} el empleado.`;
      
      toast.error(`Error al ${operation} el empleado.`);
      // Devolvemos el error para que el formulario pueda mostrarlo si se mantiene abierto.
      return Promise.reject(new Error(errorMessage)); // Rechaza la promesa con el mensaje de error
    } finally {
      setIsSaving(false); // Desactiva el estado de guardado (oculta spinner)
      // Aseguramos que el formulario se cierre y el empleado en edición se resetee siempre
      setIsEmpleadoFormOpen(false); // Cierra el formulario de empleados
      setEditingEmpleado(null); // Resetea el empleado en edición
    }
  };

  const handleSavePuesto = async (puestoData, id) => {
    const operation = id ? 'actualizar' : 'crear';
    const successMessage = `Puesto ${operation === 'actualizar' ? 'actualizado' : 'creado'} correctamente`;

    setIsSaving(true); // Activa el estado de guardado
    try { // Intenta realizar la operación
      const savedPuesto = id // Si hay un ID, es una actualización
        ? await updatePuesto(id, puestoData) // Llama al servicio para actualizar
        : await createPuesto(puestoData); // Llama al servicio para crear

      if (id) { // Si es una actualización
        // Actualizamos el puesto en la lista de puestos
        setPuestos(prev => prev.map(p => (p.id === id ? { ...p, ...puestoData } : p)));
        // También actualizamos los empleados que tengan este puesto para reflejar el nuevo nombre
        setEmpleados(prev => prev.map(emp =>
          (Number(emp.puestoId) === Number(id) ? { ...emp, puestoName: puestoData.name } : emp) // Actualiza el puestoName del empleado
        ));
      } else {
        setPuestos(prev => [...prev, savedPuesto]); // Añade el nuevo puesto a la lista
      }

      toast.success(successMessage); // Muestra una notificación de éxito
      // Cerramos el formulario y reseteamos el estado de edición
      setIsPuestoFormOpen(false); // Cierra el formulario de puestos
      setEditingPuesto(null); // Resetea el puesto en edición
    } catch (err) {
      const apiData = err.response?.data;
      const validationErrors = apiData?.errors ? Object.entries(apiData.errors).map(([field, messages]) => `${field}: ${messages.join(' ')}`).join('\n') : null;
      const errorMessage = validationErrors || apiData?.title || err.message || `Error al ${operation} el puesto.`;

      toast.error(`Error al ${operation} el puesto.`);
      // Devolvemos el error para que el formulario pueda mostrarlo.
      return Promise.reject(new Error(errorMessage)); // Rechaza la promesa con el mensaje de error
    } finally {
      setIsSaving(false); // Desactiva el estado de guardado
    }
  };

  const handleDeletePuesto = async (id) => {
    toast.promise( // Envuelve la operación en una promesa para mostrar notificaciones de carga, éxito y error
      (async () => { // Función asíncrona que contiene la lógica de eliminación
        const empleadoConPuesto = empleados.find(emp => Number(emp.puestoId) === Number(id)); // Busca si algún empleado tiene este puesto asignado
        if (empleadoConPuesto) { // Si se encuentra un empleado con este puesto
          throw new Error(`No se puede eliminar. El puesto está asignado a ${empleadoConPuesto.nombre}.`); // Lanza un error
        }
        await deletePuesto(id);
        setPuestos(prev => prev.filter(p => p.id !== id));
      })(),
      {
        loading: 'Eliminando puesto...',
        success: 'Puesto eliminado con éxito',
        error: (err) => { // Manejador de errores para la notificación
          const apiData = err.response?.data;
          if (apiData && apiData.errors) { // Si hay errores de validación de la API
            const validationErrors = Object.entries(apiData.errors)
              .map(([field, messages]) => `${field}: ${messages.join(' ')}`)
              .join('\n');
            return validationErrors || apiData.title || 'Error de validación.';
          }
          return err.message || 'Error al eliminar el puesto. Inténtalo de nuevo.'; // Devuelve el mensaje de error
        }
      }
    );
  };

  const handleDeleteEmpleado = async (id) => {
    toast.promise(deleteEmpleado(id), {
      loading: 'Eliminando empleado...',
      success: () => { // Función que se ejecuta en caso de éxito
        setEmpleados(prev => prev.filter(emp => emp.id !== id)); // Elimina el empleado de la lista local
        return 'Empleado eliminado con éxito'; // Mensaje de éxito
      },
      error: (err) => { // Función que se ejecuta en caso de error
        const apiData = err.response?.data;
        if (apiData && apiData.errors) { // Si hay errores de validación de la API
          const validationErrors = Object.entries(apiData.errors) // Formatea los errores de validación
            .map(([field, messages]) => `${field}: ${messages.join(' ')}`)
            .join('\n');
          return validationErrors || apiData.title || 'Error de validación.';
        }
        const apiError = apiData?.message || apiData?.title;
        return apiError || 'Error al eliminar el empleado. Inténtalo de nuevo.';
      }
    });
  };

  const handleAddClick = () => { // Manejador para abrir el formulario de creación de empleado
    setEditingEmpleado(null); // Resetea el empleado en edición (indica creación)
    setIsEmpleadoFormOpen(true); // Abre el formulario de empleados
  };

  const handleEditClick = (empleado) => { // Manejador para abrir el formulario de edición de empleado
    setEditingEmpleado(empleado); // Establece el empleado a editar
    setIsEmpleadoFormOpen(true); // Abre el formulario de empleados
  };

  const handleCloseForm = () => { // Manejador para cerrar el formulario de empleados
    setIsEmpleadoFormOpen(false); // Cierra el formulario de empleados
    setEditingEmpleado(null); // Resetea el empleado en edición
  };

  const handleAddPuestoClick = () => { // Manejador para abrir el formulario de creación de puesto
    setEditingPuesto(null); // Resetea el puesto en edición (indica creación)
    setIsPuestoFormOpen(true); // Abre el formulario de puestos
  };

  const handleEditPuestoClick = (puesto) => { // Manejador para abrir el formulario de edición de puesto
    setEditingPuesto(puesto); // Establece el puesto a editar
    setIsPuestoFormOpen(true); // Abre el formulario de puestos
  };

  const handleClosePuestoForm = () => { // Manejador para cerrar el formulario de puestos
    setIsPuestoFormOpen(false); // Cierra el formulario de puestos
    setEditingPuesto(null); // Resetea el puesto en edición
  };

  // Filtramos la lista de empleados basándonos en el término de búsqueda con retardo.
  const filteredEmpleados = useMemo(() => { // useMemo para optimizar el filtrado
    return empleados.filter(emp => { // Filtra cada empleado
    const term = debouncedSearchTerm.toLowerCase(); // Convierte el término de búsqueda a minúsculas
    return ( // Devuelve true si el empleado coincide con el término en alguno de sus campos
      (emp.nombre && emp.nombre.toLowerCase().includes(term)) || // Busca en el nombre
      (emp.apellidos && emp.apellidos.toLowerCase().includes(term)) || // Busca en los apellidos
      (emp.departamento && emp.departamento.toLowerCase().includes(term)) || // Busca en el departamento
      (emp.puestoName && emp.puestoName.toLowerCase().includes(term)) // Busca en el nombre del puesto
    );
    });
  }, [empleados, debouncedSearchTerm]); // Dependencias: se recalcula si empleados o debouncedSearchTerm cambian

  // Calculamos el número total de páginas basándonos en los empleados filtrados.
  const totalPages = useMemo(() => Math.ceil(filteredEmpleados.length / itemsPerPage), [filteredEmpleados, itemsPerPage]); // Calcula el total de páginas

  // Obtenemos los empleados para la página actual.
  const paginatedEmpleados = useMemo(() => { // useMemo para optimizar la paginación
    const startIndex = (currentPage - 1) * itemsPerPage; // Calcula el índice de inicio para la página actual
    return filteredEmpleados.slice(startIndex, startIndex + itemsPerPage); // Devuelve un subconjunto de empleados para la página
  }, [filteredEmpleados, currentPage, itemsPerPage]); // Dependencias: se recalcula si filteredEmpleados, currentPage o itemsPerPage cambian

  const handlePageChange = (page) => { // Manejador para cambiar la página de la tabla
    if (page >= 1 && page <= totalPages) { // Si la página solicitada es válida
      setCurrentPage(page); // Actualiza la página actual
    }
  };

  // Si la página actual se queda vacía (por eliminar el último empleado),
  // volvemos a la página anterior.
  useEffect(() => {
    if (paginatedEmpleados.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [paginatedEmpleados, currentPage]);

  return { // Devuelve un objeto con todos los estados y funciones que el componente principal necesita
    empleados: paginatedEmpleados, // Devolvemos los empleados paginados y con el nombre del puesto
    currentPage,
    totalPages,
    handlePageChange,
    puestos,
    isLoading,
    error,
    isSaving,
    // Empleados
    isEmpleadoFormOpen,
    editingEmpleado,
    handleSaveEmpleado,
    handleDeleteEmpleado,
    handleAddClick,
    handleEditClick,
    handleCloseForm,
    // Puestos
    isPuestoFormOpen,
    editingPuesto,
    handleSavePuesto,
    handleDeletePuesto,
    handleAddPuestoClick,
    handleEditPuestoClick,
    handleClosePuestoForm,
    // Búsqueda
    searchTerm,
    isSearching: searchTerm !== debouncedSearchTerm, // Nuevo estado para el indicador
    setSearchTerm,
  };
}