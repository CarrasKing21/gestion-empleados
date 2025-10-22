using BackEmp.Api.Dtos;
using BackEmp.Api.Entities;

namespace BackEmp.Api.Mapping;

public static class EmpleadoMapping
{
    public static Empleado ToEntity(this CreateEmpleadoDto empleadoDto)
    {
        return new Empleado
        {
            Nombre = empleadoDto.Nombre,
            Apellidos = empleadoDto.Apellidos, // Añadido
            PuestoId = empleadoDto.PuestoId,
            Departamento = empleadoDto.Departamento,
            Salario = empleadoDto.Salario,
            FechaNacimiento = empleadoDto.FechaNacimiento
        };
    }

    public static Empleado ToEntity(this UpdateEmpleadoDto empleadoDto, int id)
    {
        return new Empleado
        {
            Id = id,
            Nombre = empleadoDto.Nombre,
            Apellidos = empleadoDto.Apellidos, // Añadido
            PuestoId = empleadoDto.PuestoId,
            Departamento = empleadoDto.Departamento,
            Salario = empleadoDto.Salario,
            FechaNacimiento = empleadoDto.FechaNacimiento
        };
    }

    public static EmpleadoSummaryDto ToEmpleadoSummaryDto(this Empleado empleado)
    {
        return new EmpleadoSummaryDto(
            empleado.Id,
            empleado.Nombre,
            empleado.Apellidos, // Añadido
            empleado.Puesto?.Name ?? "Desconocido", // Asegura que Puesto no sea null
            empleado.Departamento,
            empleado.Salario,
            empleado.FechaNacimiento
        );
    }

    public static EmpleadoDetailsDto ToEmpleadoDetailsDto(this Empleado empleado)
    {
        return new EmpleadoDetailsDto(
            empleado.Id, empleado.Nombre, empleado.Apellidos, empleado.PuestoId,
            empleado.Puesto?.Name ?? "Desconocido", // Asegura que Puesto no sea null
            empleado.Departamento, empleado.Salario, empleado.FechaNacimiento
        );
    }
}