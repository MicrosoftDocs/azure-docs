---
title: Use dependency injection in .NET Azure Functions
description: Learn how to use dependency injection for registering and using services in .NET functions

ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
ms.date: 03/24/2021
ms.reviewer: jehollan
---
# Use dependency injection in .NET Azure Functions

Azure Functions supports the dependency injection (DI) software design pattern, which is a technique to achieve [Inversion of Control (IoC)](/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.

- Dependency injection in Azure Functions is built on the .NET Core Dependency Injection features. Familiarity with [.NET Core dependency injection](/aspnet/core/fundamentals/dependency-injection) is recommended. There are differences in how you override dependencies and how configuration values are read with Azure Functions on the Consumption plan.

- Support for dependency injection begins with Azure Functions 2.x.

- Dependency injection patterns differ depending on whether your C# functions run [in-process](functions-dotnet-class-library.md) or [out-of-process](dotnet-isolated-process-guide.md).  

> [!IMPORTANT]
> The guidance in this article applies only to [C# class library functions](functions-dotnet-class-library.md), which run in-process with the runtime. This custom dependency injection model doesn't apply to [.NET isolated functions](dotnet-isolated-process-guide.md), which lets you run .NET functions out-of-process. The .NET isolated worker process model relies on regular ASP.NET Core dependency injection patterns. To learn more, see [Dependency injection](dotnet-isolated-process-guide.md#dependency-injection) in the .NET isolated worker process guide.

## Prerequisites

Before you can use dependency injection, you must install the following NuGet packages:

- [Microsoft.Azure.Functions.Extensions](https://www.nuget.org/packages/Microsoft.Azure.Functions.Extensions/)

- [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) package version 1.0.28 or later

- [Microsoft.Extensions.DependencyInjection](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection/) (currently, only version 2.x or later supported)

## Register services

To register services, create a method to configure and add components to an `IFunctionsHostBuilder` instance.  The Azure Functions host creates an instance of `IFunctionsHostBuilder` and passes it directly into your method.

> [!WARNING]
> For function apps running in the Consumption or Premium plans, modifications to configuration values used in triggers can cause scaling errors. Any changes to these properties by the `FunctionsStartup` class results in a function app startup error.
>
> Injection of `IConfiguration` can lead to unexpected behavior. To learn more about adding configuration sources, see [Customizing configuration sources](#customizing-configuration-sources).

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

        public MyHttpTrigger(IHttpClientFactory httpClientFactory, IMyService service)
        {
            this._client = httpClientFactory.CreateClient();
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

Azure Functions apps provide the same service lifetimes as [ASP.NET Dependency Injection](/aspnet/core/fundamentals/dependency-injection#service-lifetimes). For a Functions app, the different service lifetimes behave as follows:

- **Transient**: Transient services are created upon each resolution of the service.
- **Scoped**: The scoped service lifetime matches a function execution lifetime. Scoped services are created once per function execution. Later requests for that service during the execution reuse the existing service instance.
- **Singleton**: The singleton service lifetime matches the host lifetime and is reused across function executions on that instance. Singleton lifetime services are recommended for connections and clients, for example `DocumentClient` or `HttpClient` instances.

View or download a [sample of different service lifetimes](https://github.com/Azure/azure-functions-dotnet-extensions/tree/main/src/samples/DependencyInjection/Scopes) on GitHub.

## Logging services

If you need your own logging provider, register a custom type as an instance of [`ILoggerProvider`](/dotnet/api/microsoft.extensions.logging.iloggerfactory), which is available through the [Microsoft.Extensions.Logging.Abstractions](https://www.nuget.org/packages/Microsoft.Extensions.Logging.Abstractions/) NuGet package.

Application Insights is added by Azure Functions automatically.

> [!WARNING]
> - Don't add `AddApplicationInsightsTelemetry()` to the services collection, which registers services that conflict with services provided by the environment.
> - Don't register your own `TelemetryConfiguration` or `TelemetryClient` if you are using the built-in Application Insights functionality. If you need to configure your own `TelemetryClient` instance, create one via the injected `TelemetryConfiguration` as shown in [Log custom telemetry in C# functions](functions-dotnet-class-library.md?tabs=v2%2Ccmd#log-custom-telemetry-in-c-functions).

### ILogger\<T\> and ILoggerFactory

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
            "samplingSettings": {
                "isEnabled": true,
                "excludedTypes": "Request"
            }
        },
        "logLevel": {
            "MyNamespace.HttpTrigger": "Information"
        }
    }
}
```

For more information about log levels, see [Configure log levels](configure-monitoring.md#configure-log-levels).

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

You can extract values from the `IConfiguration` instance into a custom type. Copying the app settings values to a custom type makes it easy test your services by making these values injectable. Settings read into the configuration instance must be simple key/value pairs. Please note that, the functions running on Elastic Premium SKU has this constraint "App setting names can only contain letters, numbers (0-9), periods ("."), colons (":") and underscores ("_")"

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

Refer to [Options pattern in ASP.NET Core](/aspnet/core/fundamentals/configuration/options) for more details regarding working with options.

## Using ASP.NET Core user secrets

When developing locally, ASP.NET Core provides a [Secret Manager tool](/aspnet/core/security/app-secrets#secret-manager) that allows you to store secret information outside the project root. It makes it less likely that secrets are accidentally committed to source control. Azure Functions Core Tools (version 3.0.3233 or later) automatically reads secrets created by the ASP.NET Core Secret Manager.

To configure a .NET Azure Functions project to use user secrets, run the following command in the project root.

```bash
dotnet user-secrets init
```

Then use the `dotnet user-secrets set` command to create or update secrets.

```bash
dotnet user-secrets set MySecret "my secret value"
```

To access user secrets values in your function app code, use `IConfiguration` or `IOptions`.

## Customizing configuration sources

To specify additional configuration sources, override the `ConfigureAppConfiguration` method in your function app's `StartUp` class.

The following sample adds configuration values from a base and an optional environment-specific app settings files.

```csharp
using System.IO;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace
{
    public class Startup : FunctionsStartup
    {
        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
        {
            FunctionsHostBuilderContext context = builder.GetContext();

            builder.ConfigurationBuilder
                .AddJsonFile(Path.Combine(context.ApplicationRootPath, "appsettings.json"), optional: true, reloadOnChange: false)
                .AddJsonFile(Path.Combine(context.ApplicationRootPath, $"appsettings.{context.EnvironmentName}.json"), optional: true, reloadOnChange: false)
                .AddEnvironmentVariables();
        }
        
        public override void Configure(IFunctionsHostBuilder builder)
        {
        }
    }
}
```

Add configuration providers to the `ConfigurationBuilder` property of `IFunctionsConfigurationBuilder`. For more information on using configuration providers, see [Configuration in ASP.NET Core](/aspnet/core/fundamentals/configuration/#configuration-providers).

A `FunctionsHostBuilderContext` is obtained from `IFunctionsConfigurationBuilder.GetContext()`. Use this context to retrieve the current environment name and resolve the location of configuration files in your function app folder.

By default, configuration files such as *appsettings.json* are not automatically copied to the function app's output folder. Update your *.csproj* file to match the following sample to ensure the files are copied.

```xml
<None Update="appsettings.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>      
</None>
<None Update="appsettings.Development.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    <CopyToPublishDirectory>Never</CopyToPublishDirectory>
</None>
```

## Next steps

For more information, see the following resources:

- [How to monitor your function app](functions-monitoring.md)
- [Best practices for functions](functions-best-practices.md)
