---
title: "Tutorial: Implement a protected endpoint to your API"
description: Protect the endpoint of an API, then run it to ensure it's listening for HTTP requests.
services: active-directory
author: cilwerner

ms.service: active-directory
ms.subservice: develop
ms.author: cwerner
manager: CelesteDG
ms.topic: tutorial
ms.date: 11/1/2022
#Customer intent: As an application developer I want to protect the endpoint of my API and run it to ensure it is listening for HTTP requests
---

# Tutorial: Implement a protected endpoint to your API

Protecting an API endpoint ensures that only authorized users are permitted access. The Microsoft identity platform provides a way to protect API endpoints by using the [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web/) NuGet package.

In this tutorial:

> [!div class="checklist"]
> * Implement authentication
> * Add weather information for the API to display
> * Test the API with an unauthenticated GET request

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Create and configure an ASP.NET Core project for authentication](web-api-tutorial-02-prepare-api.md).

## Implement authorization

1. Open the *Program.cs* file and replace the contents with the following snippet:

    ```csharp
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Identity.Web;

    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(options =>
            {
                builder.Configuration.Bind("AzureAd", options);
                options.TokenValidationParameters.NameClaimType = "name";
            }, options => { builder.Configuration.Bind("AzureAd", options); });

        builder.Services.AddAuthorization(config =>
        {
            config.AddPolicy("AuthZPolicy", policyBuilder =>
                policyBuilder.Requirements.Add(new ScopeAuthorizationRequirement() { RequiredScopesConfigurationKey = $"AzureAd:Scopes" }));
        });

    // Add services to the container.
    builder.Services.AddRazorPages();

    var app = builder.Build();

    app.UseAuthentication();
    app.UseAuthorization();

    var weatherSummaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

    app.MapGet("/weatherforecast", [Authorize(Policy = "AuthZPolicy")] () =>
        {
            var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateTime.Now.AddDays(index),
                    Random.Shared.Next(-20, 55),
                    weatherSummaries[Random.Shared.Next(weatherSummaries.Length)]
                ))
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthorization();

    app.MapRazorPages();

    app.Run();

    record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
    {
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    } 
    ```

## Test the application

### [Visual Studio](#tab/visual-studio)

1. In Visual Studio, select **Start without debugging**.

### [Visual Studio Code](#tab/visual-studio-code)

1. Start the application by typing the following in the terminal:

    ```powershell
    dotnet run
    ```

1. A similar output to the following should be displayed in the terminal. This confirms that the application is running on `http://localhost:{port}` and listening for requests.

    ```powershell
    Building...
    info: Microsoft.Hosting.Lifetime[0]
        Now listening on: http://localhost:{port}
    info: Microsoft.Hosting.Lifetime[0]
        Application started. Press Ctrl+C to shut down.
    ...
    ```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. Start the application by selecting **Play the executing solution**.
---

The web page `http://localhost:{host}` displays an output similar to the following image. This is because the API is being called without authentication. In order to make an authorized call, refer to [Next steps](#next-steps) for how-to guides on how to access a protected web API.

:::image type="content" source="./media/web-api-tutorial-03-protect-endpoint/display-web-page-401.png" alt-text="Screenshot that shows the 401 error when the web page is launched.":::

## Next steps

> [!div class="nextstepaction"]
> 
> [How-to: Call an API using Postman](howto-call-a-web-api-with-postman.md)
>
> [How-to: Call an API using cURL](howto-call-a-web-api-with-curl.md)
