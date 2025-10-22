import { useEmpleados } from '../hooks/useEmpleados.js';
import EmpleadoTable from '../components/EmpleadoTable';
import EmpleadoForm from '../components/EmpleadoForm';

function EmpleadosPage() {
  const {
    empleados,
    totalEmpleados,
    puestos,
    isLoading,
    error,
    isFormOpen,
    isSaving,
    editingEmpleado,
    currentPage,
    totalPages,
    handlePageChange,
    searchTerm,
    isSearching,
    setSearchTerm,
    handleSaveEmpleado,
    handleDeleteEmpleado,
    handleAddClick,
    handleEditClick,
    handleCloseForm,
  } = useEmpleados();

  return (
    <>
      <EmpleadoTable
        totalEmpleados={totalEmpleados}
        empleados={empleados}
        isLoading={isLoading}
        error={error}
        onAddEmployee={handleAddClick}
        onEditEmployee={handleEditClick}
        onDeleteEmployee={handleDeleteEmpleado}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchTermChange={setSearchTerm}
      />
      <EmpleadoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveEmpleado}
        empleadoToEdit={editingEmpleado}
        isSaving={isSaving}
        puestos={puestos}
      />
    </>
  );
}

export default EmpleadosPage;
