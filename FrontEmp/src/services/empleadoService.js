import axios from 'axios'; // Importa la librería Axios para realizar peticiones HTTP

// Lee la URL base de la API desde las variables de entorno de Vite.
// Proporciona una URL de fallback para desarrollo si la variable no está definida.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5237'; // Define la URL base de la API

const EMPLEADOS_URL = `${API_BASE_URL}/empleados`; // Construye la URL específica para el endpoint de empleados
const PUESTOS_URL = `${API_BASE_URL}/puestos`; // Construye la URL específica para el endpoint de puestos

// Función de ayuda para simular un retardo en las peticiones
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene todos los empleados desde el backend.
 * Devuelve un array de empleados extraído de la propiedad 'result' de la respuesta.
 */
export const getEmpleados = async () => {
  try { // Intenta realizar la petición
    await delay(1000); // Simula un retardo de 1 segundo para mostrar la animación de carga
    const response = await axios.get(EMPLEADOS_URL); // Realiza una petición GET a la URL de empleados
    return response.data.result || response.data; // Devuelve los datos de los empleados (maneja si vienen en 'result' o directamente)
  } catch (error) { // Captura cualquier error que ocurra durante la petición
    console.error('Error al obtener los empleados:', error); // Registra el error en la consola
    throw error; // Relanza el error para que sea manejado por el código que llamó a esta función
  }
};

/**
 * Crea un nuevo empleado en el backend.
 * @param {object} empleadoData - Los datos del nuevo empleado.
 */
export const createEmpleado = async (empleadoData) => {
  try { // Intenta realizar la petición
    await delay(1500); // Simula un retardo de 1.5 segundos
    const response = await axios.post(EMPLEADOS_URL, empleadoData); // Realiza una petición POST para crear un empleado
    return response.data; // Devuelve los datos del empleado creado
  } catch (error) { // Captura cualquier error
    console.error('Error al crear el empleado:', error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Obtiene todos los puestos desde el backend.
 */
export const getPuestos = async () => {
  try { // Intenta realizar la petición
    await delay(1000); // Simula un retardo de 1 segundo
    const response = await axios.get(PUESTOS_URL); // Realiza una petición GET para obtener los puestos
    return response.data; // Devuelve los datos de los puestos
  } catch (error) { // Captura cualquier error
    console.error('Error al obtener los puestos:', error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Crea un nuevo puesto en el backend.
 * @param {object} puestoData - Los datos del nuevo puesto.
 */
export const createPuesto = async (puestoData) => {
  try { // Intenta realizar la petición
    await delay(1500); // Simula un retardo de 1.5 segundos
    const response = await axios.post(PUESTOS_URL, puestoData); // Realiza una petición POST para crear un puesto
    return response.data; // Devuelve los datos del puesto creado
  } catch (error) { // Captura cualquier error
    console.error('Error al crear el puesto:', error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Actualiza un puesto existente en el backend.
 * @param {number} id - El ID del puesto a actualizar.
 * @param {object} puestoData - Los nuevos datos del puesto.
 */
export const updatePuesto = async (id, puestoData) => {
  try { // Intenta realizar la petición
    await delay(1500); // Simula un retardo de 1.5 segundos
    const response = await axios.put(`${PUESTOS_URL}/${id}`, puestoData); // Realiza una petición PUT para actualizar un puesto
    return response.data; // Devuelve los datos del puesto actualizado
  } catch (error) { // Captura cualquier error
    console.error(`Error al actualizar el puesto con ID ${id}:`, error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Actualiza un empleado existente en el backend.
 * @param {number} id - El ID del empleado a actualizar.
 * @param {object} empleadoData - Los nuevos datos del empleado.
 */
export const updateEmpleado = async (id, empleadoData) => {
  try { // Intenta realizar la petición
    await delay(1500); // Simula un retardo de 1.5 segundos
    const response = await axios.put(`${EMPLEADOS_URL}/${id}`, empleadoData); // Realiza una petición PUT para actualizar un empleado
    return response.data; // Devuelve los datos del empleado actualizado
  } catch (error) { // Captura cualquier error
    console.error(`Error al actualizar el empleado con ID ${id}:`, error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Elimina un puesto del backend.
 * @param {number} id - El ID del puesto a eliminar.
 */
export const deletePuesto = async (id) => {
  try { // Intenta realizar la petición
    // No se espera una respuesta con contenido, solo la confirmación de éxito (status 200 o 204)
    await axios.delete(`${PUESTOS_URL}/${id}`); // Realiza una petición DELETE para eliminar un puesto
  } catch (error) { // Captura cualquier error
    console.error(`Error al eliminar el puesto con ID ${id}:`, error); // Registra el error
    throw error; // Relanza el error
  }
};

/**
 * Elimina un empleado del backend.
 * @param {number} id - El ID del empleado a eliminar.
 */
export const deleteEmpleado = async (id) => {
  try { // Intenta realizar la petición
    // No se espera una respuesta con contenido, solo la confirmación de éxito (status 200 o 204)
    await axios.delete(`${EMPLEADOS_URL}/${id}`); // Realiza una petición DELETE para eliminar un empleado
  } catch (error) { // Captura cualquier error
    console.error(`Error al eliminar el empleado con ID ${id}:`, error); // Registra el error
    throw error; // Relanza el error
  }
};
