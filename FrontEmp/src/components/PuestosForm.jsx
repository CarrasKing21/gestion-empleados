import { useState, useEffect } from 'react'; // Importa los hooks useState y useEffect de React
import Button from './ui/Button'; // Importa el componente Button
import styles from './EmpleadoForm.module.css'; // Reutilizamos los estilos CSS del formulario de empleado para mantener la consistencia

const PuestosForm = ({ isOpen, onClose, onSave, puestoToEdit, isSaving }) => { // Componente funcional PuestosForm
  const [puestoData, setPuestoData] = useState({ // Estado para almacenar los datos del puesto en el formulario
    name: '', // Nombre del puesto
    descripcion: '',
  });
  const [errors, setErrors] = useState({}); // Estado para almacenar los errores de validación del formulario
  const [apiError, setApiError] = useState(null); // Estado para almacenar errores devueltos por la API
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); // Estado para controlar la animación de salida del modal

  const resetForm = () => { // Función para resetear el formulario a sus valores iniciales
    setPuestoData({ name: '', descripcion: '' }); // Resetea los datos del puesto
    setErrors({}); // Limpia los errores de validación
    setApiError(null); // Limpia cualquier error de la API
  };

  useEffect(() => {
    if (puestoToEdit) {
      setPuestoData({
        name: puestoToEdit.name || '',
        descripcion: puestoToEdit.descripcion || '',
      });
    } else { // Si no hay puesto para editar (es un formulario de creación)
      resetForm(); // Resetea el formulario
    }
    if (isOpen) { // Si el modal está abierto
      setIsAnimatingOut(false); // Desactiva la animación de salida para que la animación de entrada funcione
    }
  }, [puestoToEdit, isOpen]); // Se ejecuta cuando puestoToEdit o isOpen cambian

  const validate = (data) => { // Función para validar los datos del formulario
    const newErrors = {}; // Objeto para almacenar los nuevos errores
    if (!data.name.trim()) newErrors.name = 'El nombre del puesto es obligatorio.'; // Valida que el nombre del puesto no esté vacío
    setErrors(newErrors); // Actualiza el estado de errores
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores, false en caso contrario
  };

  const handleChange = (e) => { // Manejador de cambios para los inputs del formulario
    const { name, value } = e.target; // Extrae el nombre y el valor del input
    const newData = { ...puestoData, [name]: value }; // Crea una nueva copia de los datos del puesto con el valor actualizado
    setPuestoData(newData); // Actualiza el estado de los datos del puesto
    if (apiError) setApiError(null); // Si hay un error de API, lo limpia
    if (errors[name]) { // Si el campo actual tenía un error
      validate(newData); // Revalida todos los datos para actualizar los errores
    }
  };

  const handleSubmit = async (e) => { // Manejador para el envío del formulario
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    if (validate(puestoData)) { // Si los datos del formulario son válidos
      try {
        setApiError(null); // Limpia cualquier error de API anterior
        await onSave(puestoData, puestoToEdit?.id); // Llama a la función onSave (del hook) para guardar o actualizar el puesto
      } catch (error) { // Si onSave devuelve un error (promesa rechazada)
        setApiError(error.message); // Establece el mensaje de error de la API
      }
    }
  };

  const handleClose = () => { // Manejador para cerrar el modal
    setIsAnimatingOut(true); // Inicia la animación de salida
    setTimeout(() => { // Esperamos a que la animación de salida termine (300ms) antes de llamar a onClose
      onClose(); // Llama a la función onClose (del hook) para cerrar el modal
    }, 300); // Duración del temporizador: 300ms (igual que la animación)
  };

  if (!isOpen) return null; // Si el modal no debe estar abierto, no renderiza nada

  return ( // Renderiza el modal y el formulario
    <div className={`${styles.modal} ${isAnimatingOut ? styles.modalFadeOut : styles.modalFadeIn}`}> {/* Contenedor del modal (fondo gris) con animaciones */}
      <div className={`${styles.formContainer} ${isAnimatingOut ? styles.formSlideOut : styles.formSlideIn}`}> {/* Contenedor del formulario con animaciones */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate> {/* Formulario, previene validación HTML por defecto */}
          <h2>{puestoToEdit ? 'Editar Puesto' : 'Crear Puesto'}</h2> {/* Título dinámico del formulario */}

          {apiError && ( // Si hay un error de API
            <div className={styles.apiErrorContainer}> {/* Contenedor para mostrar el error de la API */}
              <p>{apiError}</p> {/* Muestra el mensaje de error de la API */}
            </div>
          )}

          <div className={styles.formGroup}> {/* Grupo de formulario para el nombre del puesto */}
            <label htmlFor="name">Nombre del Puesto</label> {/* Etiqueta del campo */}
            <input id="name" type="text" name="name" value={puestoData.name} onChange={handleChange} className={errors.name ? styles.error : ''} required /> {/* Input para el nombre del puesto */}
            {errors.name && <span className={styles.errorText}>{errors.name}</span>} {/* Muestra el error si existe */}
          </div>

          <div className={styles.formGroup}> {/* Grupo de formulario para la descripción */}
            <label htmlFor="descripcion">Descripción</label> {/* Etiqueta del campo */}
            <textarea id="descripcion" name="descripcion" value={puestoData.descripcion} onChange={handleChange} rows="3"></textarea> {/* Textarea para la descripción */}
          </div>

          <div className={styles.formActions}> {/* Contenedor para los botones de acción del formulario */}
            <Button type="submit" variant="primary" disabled={isSaving}> {/* Botón de envío (Guardar/Actualizar) */}
              {isSaving ? ( // Si se está guardando
                <> {/* Fragmento para agrupar el spinner y el texto */}
                  <span className={styles.spinner}></span> {/* Spinner de carga */}
                  Guardando... {/* Texto "Guardando..." */}
                </>
              ) : ( // Si no se está guardando
                puestoToEdit ? 'Actualizar' : 'Crear' // Texto dinámico: "Actualizar" o "Crear"
              )} {/* Deshabilitado mientras se guarda */}
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSaving}> {/* Botón de cancelar */}
              Cancelar {/* Texto del botón */}
            </Button> {/* Deshabilitado mientras se guarda */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PuestosForm; // Exporta el componente PuestosForm