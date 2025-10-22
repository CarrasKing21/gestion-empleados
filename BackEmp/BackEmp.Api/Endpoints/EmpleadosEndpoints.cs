using BackEmp.Api.Dtos;
using BackEmp.Api.Entities;
using Microsoft.EntityFrameworkCore;
using BackEmp.Api.Data;
using BackEmp.Api.Mapping;


namespace BackEmp.Api.Endpoints;

public static class EmpleadosEndpoints
{
    const string GetEmpleadoEndpointName = "GetEmpleado";

    public static RouteGroupBuilder MapEmpleadosEndpoints(this WebApplication app)
    {

        var group = app.MapGroup("empleados")
            .WithParameterValidation();

        //GET /empleados
        group.MapGet("/", async (BackEmpContext dbContext) => 
            dbContext.Empleados
                     .Include(empleado => empleado.Puesto)
                     .Select(empleado => empleado.ToEmpleadoSummaryDto())
                     .AsNoTracking()
                     .ToListAsync());

        //GET /empleados/1
        group.MapGet("/{id}", async (int id, BackEmpContext dbContext) =>
        {
            Empleado? empleado = await dbContext.Empleados
                                        .Include(e => e.Puesto) // Cargar la propiedad de navegación Puesto
                                        .SingleOrDefaultAsync(e => e.Id == id);

            return empleado is null ?
            Results.NotFound() : Results.Ok(empleado.ToEmpleadoDetailsDto());
        })
        .WithName(GetEmpleadoEndpointName);

        //POST /empleados
        group.MapPost("/", async (CreateEmpleadoDto newEmpleado, BackEmpContext dbContext) =>
        {

            Empleado empleado = newEmpleado.ToEntity();
            

            dbContext.Empleados.Add(empleado);
            await dbContext.SaveChangesAsync();

            // Recargamos el empleado con la información del puesto para la respuesta
            await dbContext.Entry(empleado)
                           .Reference(e => e.Puesto)
                           .LoadAsync();

            return Results.CreatedAtRoute(
            GetEmpleadoEndpointName,
            new { id = empleado.Id },
            empleado.ToEmpleadoDetailsDto());
        });

        //PUT /empelados
        group.MapPut("/{id}", async (int id, UpdateEmpleadoDto updateEmpleado, BackEmpContext dbContext) =>
        {
            var existingEmpleado = await dbContext.Empleados.FindAsync(id);

            if (existingEmpleado is null)
            {
                return Results.NotFound();
            }

            dbContext.Entry(existingEmpleado)
                .CurrentValues
                .SetValues(updateEmpleado.ToEntity(id));

             await dbContext.SaveChangesAsync();


            return Results.NoContent();

        });

        //DELETE /empleados/1
        group.MapDelete("/{id}", async (int id, BackEmpContext dbContext) =>
        {
            await dbContext.Empleados
                .Where(empleado => empleado.Id == id)
                .ExecuteDeleteAsync();
                
            return Results.NoContent();
        });

        return group;
    }

}
