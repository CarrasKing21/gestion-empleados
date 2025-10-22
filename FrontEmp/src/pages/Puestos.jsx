import React, { useState, useEffect } from 'react';
import { getPuestos } from '../services/empleadoService';
import PuestosTable from '../components/PuestosTable';

const Puestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const puestosData = await getPuestos();
        const puestosList = Array.isArray(puestosData) ? puestosData : [];
        setPuestos(puestosList);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los puestos:", err);
        setPuestos([]);
        setError("No se pudieron cargar los datos de los puestos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Gestión de Puestos</h2>
      <PuestosTable puestos={puestos} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Puestos;
