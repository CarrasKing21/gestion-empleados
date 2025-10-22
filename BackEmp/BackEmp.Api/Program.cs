using BackEmp.Api;
using BackEmp.Api.Data;
using BackEmp.Api.Dtos;
using BackEmp.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("BackEmp");
builder.Services.AddSqlite<BackEmpContext>(connString);

const string ReactFrontend = "ReactFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ReactFrontend,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // La URL de tu app de React
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

var app = builder.Build();

app.UseCors(ReactFrontend);

app.MapEmpleadosEndpoints();
app.MapPuestosEndpoints();

await app.MigrateDbAsync();

app.Run();
