using TorchTrackApp.Models;
using TorchTrackApp.Services;
using Microsoft.OpenApi.Models;
using System.Reflection;
using TorchTrackApp.Sockets;

namespace TorchTrackApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            #region Instanciate {builder} Variable From WebApplication Class
            var builder = WebApplication.CreateBuilder(args);
            #endregion

            #region Add Services To The Container 
            builder.Services.Configure<MongoDBSettings>(
            builder.Configuration.GetSection("MongoDB"));
            builder.Services.AddSingleton<MongoDBServices>();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddControllersWithViews();
            builder.Services.AddSignalR();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(
                "v1",
                new OpenApiInfo
                {
                    Version = "v1.0",
                    Title = "Torch Track API",
                    Description = @"REST API that interacts with the TorchTrackLib"
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                //c.IncludeXmlComments(xmlPath);
            });
            #endregion

            #region Register Cors
            builder.Services.AddCors(
            options =>
            {
                options.AddDefaultPolicy(
                builder =>
                {
                    builder.WithOrigins(
                    "https://localhost:44351",
                    "https://localhost:4200",
                    "https://www.google.com/")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            #endregion

            #region Instanciate {app} Variable With Build() From {builder} variable
            var app = builder.Build();
            #endregion

            #region Configure The HTTP Request Pipeline & Control When Swagger Is In Use
            app.UseSwagger();
            app.UseSwaggerUI();

            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapHub<MyHub>("/myhub");
            //});

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(
            builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });
            app.UseAuthorization();

            app.MapHub<MyHub>("/myhub");

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
            #endregion
        }
    }
}