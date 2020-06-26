---
title: Use dependency injection in .NET Azure Functions
description: Learn how to use dependency injection for registering and using services in .NET functions
author: craigshoemaker

ms.topic: reference
ms.date: 09/05/2019
ms.author: cshoe
ms.reviewer: jehollan
---
# Use dependency injection in .NET Azure Functions

Azure Functions supports the dependency injection (DI) software design pattern, which is a technique to achieve [Inversion of Control (IoC)](https://docs.microsoft.com/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.

- Dependency injection in Azure Functions is built on the .NET Core Dependency Injection features. Familiarity with [.NET Core dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection) is recommended. There are differences in how you override dependencies and how configuration values are read with Azure Functions on the Consumption plan.

- Support for dependency injection begins with Azure Functions 2.x.

## Prerequisites

Before you can use dependency injection, you must install the following NuGet packages:

- [Microsoft.Azure.Functions.Extensions](https://www.nuget.org/packages/Microsoft.Azure.Functions.Extensions/)

- [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) package version 1.0.28 or later

## Register services

To register services, create a method to configure and add components to an `IFunctionsHostBuilder` instance.  The Azure Functions host creates an instance of `IFunctionsHostBuilder` and passes it directly into your method.

To register the method, add the `FunctionsStartup` assembly attribute that specifies the type name used during startup.

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();

            builder.Services.AddSingleton<IMyService>((s) => {
                return new MyService();
            });

            builder.Services.AddSingleton<ILoggerProvider, MyLoggerProvider>();
        }
    }
}
```

This example uses the [Microsoft.Extensions.Http](https://www.nuget.org/packages/Microsoft.Extensions.Http/) package required to register an `HttpClient` at startup.

### Caveats

A series of registration steps run before and after the runtime processes the startup class. Therefore, keep in mind the following items:

- *The startup class is meant for only setup and registration.* Avoid using services registered at startup during the startup process. For instance, don't try to log a message in a logger that is being registered during startup. This point of the registration process is too early for your services to be available for use. After the `Configure` method is run, the Functions runtime continues to register additional dependencies, which can affect how your services operate.

- *The dependency injection container only holds explicitly registered types*. The only services available as injectable types are what are setup in the `Configure` method. As a result, Functions-specific types like `BindingContext` and `ExecutionContext` aren't available during setup or as injectable types.

## Use injected dependencies

Constructor injection is used to make your dependencies available in a function. The use of constructor injection requires that you do not use static classes for injected services or for your function classes.

The following sample demonstrates how the `IMyService` and `HttpClient` dependencies are injected into an HTTP-triggered function.

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading.Tasks;

namespace MyNamespace
{
    public class MyHttpTrigger
    {
        private readonly HttpClient _client;
        private readonly IMyService _service;

        public MyHttpTrigger(HttpClient httpClient, MyService service)
        {
            this._client = httpClient;
            this._service = service;
        }

        [FunctionName("MyHttpTrigger")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            var response = await _client.GetAsync("https://microsoft.com");
            var message = _service.GetMessage();

            return new OkObjectResult("Response from function with injected dependencies.");
        }
    }
}
```

This example uses the [Microsoft.Extensions.Http](https://www.nuget.org/packages/Microsoft.Extensions.Http/) package required to register an `HttpClient` at startup.

## Service lifetimes

Azure Functions apps provide the same service lifetimes as [ASP.NET Dependency Injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection#service-lifetimes). For a Functions app, the different service lifetimes behave as follows:

- **Transient**: Transient services are created upon each request of the service.
- **Scoped**: The scoped service lifetime matches a function execution lifetime. Scoped services are created once per execution. Later requests for that service during the execution reuse the existing service instance.
- **Singleton**: The singleton service lifetime matches the host lifetime and is reused across function executions on that instance. Singleton lifetime services are recommended for connections and clients, for example `SqlConnection` or `HttpClient` instances.

View or download a [sample of different service lifetimes](https://aka.ms/functions/di-sample) on GitHub.

## Logging services

If you need your own logging provider, register a custom type as an instance of [`ILoggerProvider`](https://docs.microsoft.com/dotnet/api/microsoft.extensions.logging.iloggerfactory), which is available through the [Microsoft.Extensions.Logging.Abstractions](https://www.nuget.org/packages/Microsoft.Extensions.Logging.Abstractions/) NuGet package.

Application Insights is added by Azure Functions automatically.

> [!WARNING]
> - Do not add `AddApplicationInsightsTelemetry()` to the services collection as it registers services that conflict with services provided by the environment.
> - Do not register your own `TelemetryConfiguration` or `TelemetryClient` if you are using the built-in Application Insights functionality. If you need to configure your own `TelemetryClient` instance, create one via the injected `TelemetryConfiguration` as shown in [Monitor Azure Functions](./functions-monitoring.md#version-2x-and-later-2).

### ILogger<T> and ILoggerFactory

The host injects `ILogger<T>` and `ILoggerFactory` services into constructors.  However, by default these new logging filters are filtered out of the function logs.  You need to modify the `host.json` file to opt-in to additional filters and categories.

The following example demonstrates how to add an `ILogger<HttpTrigger>` with logs that are exposed to the host.

```csharp
namespace MyNamespace
{
    public class HttpTrigger
    {
        private readonly ILogger<HttpTrigger> _log;

        public HttpTrigger(ILogger<HttpTrigger> log)
        {
            _log = log;
        }

        [FunctionName("HttpTrigger")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req)
        {
            _log.LogInformation("C# HTTP trigger function processed a request.");

            // ...
    }
}
```

The following example `host.json` file adds the log filter.

```json
{
    "version": "2.0",
    "logging": {
        "applicationInsights": {
            "samplingExcludedTypes": "Request",
            "samplingSettings": {
                "isEnabled": true
            }
        },
        "logLevel": {
            "MyNamespace.HttpTrigger": "Information"
        }
    }
}
```

## Function app provided services

The function host registers many services. The following services are safe to take as a dependency in your application:

|Service Type|Lifetime|Description|
|--|--|--|
|`Microsoft.Extensions.Configuration.IConfiguration`|Singleton|Runtime configuration|
|`Microsoft.Azure.WebJobs.Host.Executors.IHostIdProvider`|Singleton|Responsible for providing the ID of the host instance|

If there are other services you want to take a dependency on, [create an issue and propose them on GitHub](https://github.com/azure/azure-functions-host).

### Overriding host services

Overriding services provided by the host is currently not supported.  If there are services you want to override, [create an issue and propose them on GitHub](https://github.com/azure/azure-functions-host).

## Working with options and settings

Values defined in [app settings](./functions-how-to-use-azure-function-app-settings.md#settings) are available in an `IConfiguration` instance, which allows you to read app settings values in the startup class.

You can extract values from the `IConfiguration` instance into a custom type. Copying the app settings values to a custom type makes it easy test your services by making these values injectable. Settings read into the configuration instance must be simple key/value pairs.

Consider the following class that includes a property named consistent with an app setting:

```csharp
public class MyOptions
{
    public string MyCustomSetting { get; set; }
}
```

And a `local.settings.json` file that might structure the custom setting as follows:
```json
{
  "IsEncrypted": false,
  "Values": {
    "MyOptions:MyCustomSetting": "Foobar"
  }
}
```

From inside the `Startup.Configure` method, you can extract values from the `IConfiguration` instance into your custom type using the following code:

```csharp
builder.Services.AddOptions<MyOptions>()
                .Configure<IConfiguration>((settings, configuration) =>
                                           {
                                                configuration.GetSection("MyOptions").Bind(settings);
                                           });
```

Calling `Bind` copies values that have matching property names from the configuration into the custom instance. The options instance is now available in the IoC container to inject into a function.

The options object is injected into the function as an instance of the generic `IOptions` interface. Use the `Value` property to access the values found in your configuration.

```csharp
using System;
using Microsoft.Extensions.Options;

public class HttpTrigger
{
    private readonly MyOptions _settings;

    public HttpTrigger(IOptions<MyOptions> options)
    {
        _settings = options.Value;
    }
}
```

Refer to [Options pattern in ASP.NET Core](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/options) for more details regarding working with options.

> [!WARNING]
> Avoid attempting to read values from files like *local.settings.json* or *appsettings.{environment}.json* on the Consumption plan. Values read from these files related to trigger connections aren't available as the app scales because the hosting infrastructure has no access to the configuration information as the scale controller creates new instances of the app.

## Next steps

For more information, see the following resources:

- [How to monitor your function app](functions-monitoring.md)
- [Best practices for functions](functions-best-practices.md)
