namespace BackEmp.Api.Dtos;

public record class EmpleadoSummaryDto(
    int Id,
    string Nombre,
    string Apellidos,
    string PuestoName, // Asumiendo que quieres el nombre del puesto
    string Departamento,
    decimal Salario,
    DateOnly FechaNacimiento
);