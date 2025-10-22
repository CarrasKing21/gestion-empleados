import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useEmpleados } from './hooks/useEmpleados';
import EmpleadoTable from './components/EmpleadoTable';
import EmpleadoForm from './components/EmpleadoForm';
import PuestosTable from './components/PuestosTable';
import PuestosForm from './components/PuestosForm';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('empleados'); // 'empleados' o 'puestos'
  const {
    empleados,
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
    setSearchTerm,
    isSearching,
    currentPage,
    totalPages,
    handlePageChange,
  } = useEmpleados();

  return (
    <>
      <header>
        <h1>Gestión de Personal</h1>
        <nav>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('empleados'); }} className={activeView === 'empleados' ? 'active' : ''}>
            Empleados
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('puestos'); }} className={activeView === 'puestos' ? 'active' : ''}>
            Puestos
          </a>
        </nav>
      </header>

      <main>
        {activeView === 'empleados' ? (
          <>
            <EmpleadoTable empleados={empleados} isLoading={isLoading} error={error} onAddEmployee={handleAddClick} onEditEmployee={handleEditClick} onDeleteEmployee={handleDeleteEmpleado} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} searchTerm={searchTerm} onSearchTermChange={setSearchTerm} isSearching={isSearching} />
            <EmpleadoForm isOpen={isEmpleadoFormOpen} onClose={handleCloseForm} onSave={handleSaveEmpleado} empleadoToEdit={editingEmpleado} isSaving={isSaving} puestos={puestos} />
          </>
        ) : (
          <>
            <PuestosTable puestos={puestos} isLoading={isLoading} error={error} onAddPuesto={handleAddPuestoClick} onEditPuesto={handleEditPuestoClick} onDeletePuesto={handleDeletePuesto} />
            <PuestosForm isOpen={isPuestoFormOpen} onClose={handleClosePuestoForm} onSave={handleSavePuesto} puestoToEdit={editingPuesto} isSaving={isSaving} />
          </>
        )}
      </main>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;