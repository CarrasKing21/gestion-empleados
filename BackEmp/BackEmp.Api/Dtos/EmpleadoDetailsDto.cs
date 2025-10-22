namespace BackEmp.Api.Dtos;

public record class EmpleadoDetailsDto(
    int Id,
    string Nombre,
    string Apellidos,
    int PuestoId,
    string PuestoName, // Asumiendo que quieres el nombre del puesto para los detalles
    string Departamento,
    decimal Salario,
    DateOnly FechaNacimiento
);