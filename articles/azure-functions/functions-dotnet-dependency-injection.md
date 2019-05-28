---
title: Use dependency injection in .NET Azure Functions
description: Learn how to use dependency injection for registering and using services in .NET functions
services: functions
documentationcenter: na
author: craigshoemaker
manager: jeconnoc
keywords: azure functions, functions, serverless architecture

ms.service: azure-functions
ms.devlang: dotnet
ms.topic: reference
ms.date: 03/22/2019
ms.author: jehollan, glenga, cshoe
---
# Use dependency injection in .NET Azure Functions

Azure Functions supports the dependency injection (DI) software design pattern, which is a technique for achieving [Inversion of Control (IoC)](https://docs.microsoft.com/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.

Azure Functions builds on top of the ASP.NET Core Dependency Injection features.  You should understand services, lifetimes, and design patterns of [ASP.NET Core dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection) before using them in functions.

## Prerequisites

Before you can use dependency injection, you must install the [Microsoft.Azure.Functions.Extensions](https://www.nuget.org/packages/Microsoft.Azure.Functions.Extensions/) NuGet package. You can install this package by running the following command from the package console:

```powershell
Install-Package Microsoft.Azure.Functions.Extensions
```
You must also be using version 1.0.28 of the [Microsoft.NET.Sdk.Functions package](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/), or a later version.

## Registering services

To register services, you can create a configure method and add components to an `IFunctionsHostBuilder` instance.  The Azure Functions host creates an `IFunctionsHostBuilder` and passes it directly into your configured method.

To register your configure method, you must add an assembly attribute that specifies the type for your configure method using the `FunctionsStartup` attribute.

```csharp
[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton((s) => {
                return new CosmosClient(Environment.GetEnvironmentVariable("COSMOSDB_CONNECTIONSTRING"));
            });
            builder.Services.AddSingleton<ILoggerProvider, MyLoggerProvider>();
        }
    }
}
```

## Service lifetimes

Azure Function apps provide the same service lifetimes as [ASP.NET Dependency Injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection#service-lifetimes), transient, scoped, and singleton.

In a function app, a scoped service lifetime matches a function execution lifetime. Scoped services are created once per execution.  Later requests for that service during the execution reuse that instance.  A singleton service lifetime matches the host lifetime and is reused across function executions on that instance.

Singleton lifetime services are recommended for connections and clients, for example a `SqlConnection`, `CloudBlobClient`, or `HttpClient`.

View or download a [sample of different service lifetimes](https://aka.ms/functions/di-sample).

## Logging services

If you need your own logging provider, the recommended way is to register an `ILoggerProvider`.  For Application Insights, Functions adds Application Insights automatically for you.  

> [!WARNING]
> Do not add `AddApplicationInsightsTelemetry()` to the services collection as it will register services that will conflict with what is provided by the environment. 
 
## Function app provided services

The function host will register many services itself.  Below are services that are safe to take a dependency on.  Other host services are not supported to register or depend on.  If there are other services you want to take a dependency on, please [create an issue and discussion on GitHub](https://github.com/azure/azure-functions-host).

|Service Type|Lifetime|Description|
|--|--|--|
|`Microsoft.Extensions.Configuration.IConfiguration`|Singleton|Runtime configuration|
|`Microsoft.Azure.WebJobs.Host.Executors.IHostIdProvider`|Singleton|Responsible for providing the ID of the host instance|

### Overriding Host Services

Overriding services provided by the host is currently not supported.  If there are services you want to overriding, please [create an issue and discussion on GitHub](https://github.com/azure/azure-functions-host).

## Next steps

For more information, see the following resources:

* [How to monitor your function app](functions-monitoring.md)
* [Best practices for functions](functions-best-practices.md)
