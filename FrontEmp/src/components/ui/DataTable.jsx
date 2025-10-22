import React from 'react';
import styles from './DataTable.module.css';

const DataTable = ({
  columns,
  data,
  noDataMessage = "No hay datos que mostrar.",
  noResultsOnSearchMessage = "No se encontraron resultados con ese criterio."
}) => {

  // Determina si la data está vacía porque no hay resultados de búsqueda o porque no hay datos en absoluto.
  const isSearchActive = typeof noResultsOnSearchMessage === 'string';
  const message = isSearchActive ? noResultsOnSearchMessage : noDataMessage;

  if (data.length === 0) {
    return <p className={styles.emptyMessage}>{message}</p>;
  }

  return (
    <table className={styles.dataTable}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {/* Si la columna tiene un renderizador personalizado, lo usa. Si no, muestra el dato directamente. */}
                {col.Cell ? col.Cell({ row }) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;