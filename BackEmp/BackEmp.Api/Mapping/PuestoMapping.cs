using BackEmp.Api.Dtos;
using BackEmp.Api.Entities;

namespace BackEmp.Api.Mapping;

public static class PuestoMapping
{
    public static PuestoDto ToPuestoDto(this Puesto puesto)
    {
        return new PuestoDto(puesto.Id, puesto.Name, puesto.Descripcion);
    }

    public static Puesto ToEntity(this CreatePuestoDto puestoDto)
    {
        return new Puesto
        {
            Name = puestoDto.Name,
            Descripcion = puestoDto.Descripcion
        };
    }

    public static Puesto ToEntity(this UpdatePuestoDto puestoDto, int id)
    {
        return new Puesto
        {
            Id = id,
            Name = puestoDto.Name,
            Descripcion = puestoDto.Descripcion
        };
    }
}