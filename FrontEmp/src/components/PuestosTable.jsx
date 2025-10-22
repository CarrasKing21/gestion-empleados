import React, { useState, useMemo, useEffect } from 'react';
import DataTable from './ui/DataTable';
import Spinner from './ui/Spinner';
import Button from './ui/Button';
import EditButton from './ui/EditButton';
import DeleteButton from './ui/DeleteButton';
import styles from './PuestosTable.module.css';

const PuestosTable = ({ puestos, isLoading, error, onAddPuesto, onEditPuesto, onDeletePuesto }) => {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const columns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Descripción', accessor: 'descripcion' },
    {
      header: 'Acciones',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className={styles.actions}>
          <EditButton onClick={() => onEditPuesto(row)} title="Editar puesto" />
          <DeleteButton
            onClick={() => handleDeleteClick(row.id)}
            isConfirming={confirmingDeleteId === row.id}
            title={confirmingDeleteId === row.id ? `Confirmar eliminación de ${row.name}` : `Eliminar ${row.name}`}
          />
        </div>
      ),
    },
  ], [onEditPuesto, confirmingDeleteId]);

  useEffect(() => {
    if (confirmingDeleteId !== null) {
      const timer = setTimeout(() => setConfirmingDeleteId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDeleteId]);

  const handleDeleteClick = (id) => {
    if (confirmingDeleteId === id) {
      onDeletePuesto(id);
      setConfirmingDeleteId(null);
    } else {
      setConfirmingDeleteId(id);
    }
  };

  if (isLoading) {
    return <div className={styles.centered}><Spinner /></div>;
  }

  if (error) {
    return <div className={`${styles.centered} ${styles.error}`}>{error}</div>
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h1>Gestión de Puestos</h1>
        <Button onClick={onAddPuesto} variant="primary">Añadir Puesto</Button>
      </div>
      <DataTable
        columns={columns}
        data={puestos}
        noDataMessage="No hay puestos que mostrar."
      />
    </div>
  );
};

export default PuestosTable;
