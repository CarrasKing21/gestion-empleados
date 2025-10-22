import { useState, useEffect } from 'react'; // Importa los hooks useState y useEffect de React
import Button from './ui/Button'; // Importa el componente Button
import styles from './EmpleadoForm.module.css'; // Importa los estilos CSS específicos del formulario

const EmpleadoForm = ({ isOpen, onClose, onSave, empleadoToEdit, isSaving, puestos = [] }) => { // Componente funcional EmpleadoForm
  const [empleadoData, setEmpleadoData] = useState({ // Estado para almacenar los datos del empleado en el formulario
    nombre: '', // Nombre del empleado
    apellidos: '',
    departamento: '',
    salario: '',
    fechaNacimiento: '',
    puestoId: ''
  });
  const [errors, setErrors] = useState({}); // Estado para almacenar los errores de validación del formulario
  const [apiError, setApiError] = useState(null); // Estado para almacenar errores devueltos por la API
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); // Estado para controlar la animación de salida del modal

  const resetForm = () => { // Función para resetear el formulario a sus valores iniciales
    setEmpleadoData({ nombre: '', apellidos: '', departamento: '', salario: '', fechaNacimiento: '', puestoId: '' }); // Resetea los datos del empleado
    setErrors({}); // Limpia los errores de validación
    setApiError(null); // Limpia cualquier error de la API
  };

  useEffect(() => {
    if (empleadoToEdit) {
      setEmpleadoData({
        nombre: empleadoToEdit.nombre || '',
        apellidos: empleadoToEdit.apellidos || '',
        departamento: empleadoToEdit.departamento || '',
        salario: empleadoToEdit.salario || '',
        // Aseguramos que la fecha esté en formato YYYY-MM-DD para el input
        // Si existe, tomamos solo los primeros 10 caracteres.
        fechaNacimiento: empleadoToEdit.fechaNacimiento ? empleadoToEdit.fechaNacimiento.substring(0, 10) : '',
        puestoId: empleadoToEdit.puestoId || ''
      });
    } else { // Si no hay empleado para editar (es un formulario de creación)
      resetForm(); // Resetea el formulario
    }
    // Si el modal se abre, nos aseguramos de que la animación de salida esté desactivada para que la animación de entrada funcione
    if (isOpen) { // Si el modal está abierto
      setIsAnimatingOut(false); // Desactiva la animación de salida
    }
  }, [empleadoToEdit, isOpen, puestos]); // Se ejecuta cuando empleadoToEdit, isOpen o puestos cambian

  const validate = (data) => { // Función para validar los datos del formulario
    const newErrors = {}; // Objeto para almacenar los nuevos errores
    if (!data.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.'; // Valida que el nombre no esté vacío
    if (!data.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.'; // Valida que los apellidos no estén vacíos
    if (!data.puestoId) newErrors.puestoId = 'Debe seleccionar un puesto.'; // Valida que se haya seleccionado un puesto
    if (data.salario && data.salario < 0) newErrors.salario = 'El salario no puede ser negativo.'; // Valida que el salario no sea negativo
    
    setErrors(newErrors); // Actualiza el estado de errores
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores, false en caso contrario
  };

  const handleChange = (e) => { // Manejador de cambios para los inputs del formulario
    const { name, value } = e.target; // Extrae el nombre y el valor del input
    const newData = { ...empleadoData, [name]: value }; // Crea una nueva copia de los datos del empleado con el valor actualizado
    setEmpleadoData(newData); // Actualiza el estado de los datos del empleado
    // Limpia el error de la API si el usuario empieza a escribir
    if (apiError) setApiError(null); // Si hay un error de API, lo limpia
    // Revalida el campo si ya tenía un error para dar feedback inmediato
    if (errors[name]) { // Si el campo actual tenía un error
      validate(newData); // Revalida todos los datos para actualizar los errores
    }
  };

  const handleSubmit = async (e) => { // Manejador para el envío del formulario
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    if (validate(empleadoData)) { // Si los datos del formulario son válidos
      try {
        setApiError(null); // Limpia cualquier error de API anterior
        await onSave(empleadoData, empleadoToEdit?.id); // Llama a la función onSave (del hook) para guardar o actualizar el empleado
      } catch (error) { // Si onSave devuelve un error (promesa rechazada)
        setApiError(error.message); // Establece el mensaje de error de la API
      }
    }
  };

  const handleBlur = (e) => { // Manejador para cuando un input pierde el foco
    const { name } = e.target; // Extrae el nombre del input
    // Validamos cuando el usuario sale del campo, solo si el campo tiene algún valor
    if (empleadoData[name]) validate(empleadoData); // Si el campo tiene datos, valida el formulario
  };

  const handleClose = () => { // Manejador para cerrar el modal
    setIsAnimatingOut(true); // Inicia la animación de salida
    // Esperamos a que la animación de salida termine (300ms) antes de llamar a onClose para que el modal se desmonte
    setTimeout(() => { // Establece un temporizador
      onClose(); // Llama a la función onClose (del hook) para cerrar el modal
    }, 300); // Duración del temporizador: 300ms (igual que la animación)
  };

  if (!isOpen) return null; // Si el modal no debe estar abierto, no renderiza nada

  return ( // Renderiza el modal y el formulario
    // Aplicamos clases dinámicas para las animaciones de entrada y salida del fondo del modal
    <div className={`${styles.modal} ${isAnimatingOut ? styles.modalFadeOut : styles.modalFadeIn}`}> {/* Contenedor del modal (fondo gris) */}
      {/* Aplicamos clases dinámicas para las animaciones de entrada y salida del contenedor del formulario */}
      <div className={`${styles.formContainer} ${isAnimatingOut ? styles.formSlideOut : styles.formSlideIn}`}> {/* Contenedor del formulario */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate> {/* Formulario, previene validación HTML por defecto */}
        <h2>{empleadoToEdit ? 'Editar Empleado' : 'Crear Empleado'}</h2> {/* Título dinámico del formulario */}

        {apiError && ( // Si hay un error de API
          <div className={styles.apiErrorContainer}> {/* Contenedor para mostrar el error de la API */}
            <p>{apiError}</p> {/* Muestra el mensaje de error de la API */}
          </div>
        )}

        <div className={styles.formGroup}> {/* Grupo de formulario para el nombre */}
          <label htmlFor="nombre">Nombre</label> {/* Etiqueta del campo */}
          <input id="nombre" type="text" name="nombre" value={empleadoData.nombre} onChange={handleChange} onBlur={handleBlur} className={errors.nombre ? styles.error : ''} required /> {/* Input para el nombre */}
          {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>} {/* Muestra el error si existe */}
        </div>

        <div className={styles.formGroup}> {/* Grupo de formulario para los apellidos */}
          <label htmlFor="apellidos">Apellidos</label> {/* Etiqueta del campo */}
          <input id="apellidos" type="text" name="apellidos" value={empleadoData.apellidos} onChange={handleChange} onBlur={handleBlur} className={errors.apellidos ? styles.error : ''} required /> {/* Input para los apellidos */}
          {errors.apellidos && <span className={styles.errorText}>{errors.apellidos}</span>} {/* Muestra el error si existe */}
        </div>

        <div className={styles.formGroup}> {/* Grupo de formulario para el departamento */}
          <label htmlFor="departamento">Departamento</label> {/* Etiqueta del campo */}
          <input id="departamento" type="text" name="departamento" value={empleadoData.departamento} onChange={handleChange} /> {/* Input para el departamento */}
        </div>

        <div className={styles.formGroup}> {/* Grupo de formulario para el salario */}
          <label htmlFor="salario">Salario</label> {/* Etiqueta del campo */}
          <input id="salario" type="number" name="salario" value={empleadoData.salario} onChange={handleChange} onBlur={handleBlur} className={errors.salario ? styles.error : ''} /> {/* Input para el salario */}
          {errors.salario && <span className={styles.errorText}>{errors.salario}</span>} {/* Muestra el error si existe */}
        </div>

        <div className={styles.formGroup}> {/* Grupo de formulario para la fecha de nacimiento */}
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label> {/* Etiqueta del campo */}
          <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={empleadoData.fechaNacimiento} onChange={handleChange} /> {/* Input para la fecha de nacimiento */}
        </div>

        <div className={styles.formGroup}> {/* Grupo de formulario para el puesto */}
          <label htmlFor="puestoId">Puesto</label> {/* Etiqueta del campo */}
          <select id="puestoId" name="puestoId" value={empleadoData.puestoId} onChange={handleChange} onBlur={handleBlur} className={errors.puestoId ? styles.error : ''} required> {/* Select para el puesto */}
            <option value="">Selecciona un puesto</option> {/* Opción por defecto */}
            {puestos.map(p => ( // Mapea la lista de puestos para crear las opciones
              <option key={p.id} value={p.id}>{p.name}</option> // Cada opción de puesto
            ))}
          </select>
          {errors.puestoId && <span className={styles.errorText}>{errors.puestoId}</span>} {/* Muestra el error si existe */}
        </div>

        <div className={styles.formActions}> {/* Contenedor para los botones de acción del formulario */}
          <Button type="submit" variant="primary" disabled={isSaving}> {/* Botón de envío (Guardar/Actualizar) */}
            {isSaving ? ( // Si se está guardando
              <> {/* Fragmento para agrupar el spinner y el texto */}
                <span className={styles.spinner}></span> {/* Spinner de carga */}
                Guardando... {/* Texto "Guardando..." */}
              </>
            ) : ( // Si no se está guardando
              empleadoToEdit ? 'Actualizar' : 'Crear' // Texto dinámico: "Actualizar" o "Crear"
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

export default EmpleadoForm; // Exporta el componente EmpleadoForm
