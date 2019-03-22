---
title: Use dependency injection in .NET Azure Functions
description: Learn how to leverage dependency injection for registering and using services in .NET functions
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, serverless architecture

ms.service: azure-functions
ms.devlang: dotnet
ms.topic: reference
ms.date: 03/22/2019
ms.author: jehollan
---
# Use dependency injection in .NET Azure Functions

Azure Functions supports the dependency injection (DI) software design pattern, which is a technique for achieving [Inversion of Control (IoC)](https://docs.microsoft.com/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.

Azure Functions builds on top of the ASP.NET Core Dependency Injection features.  It is helpful to understand services, lifetimes, and design patterns of [ASP.NET Core dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection).

## Registering services

To register services, you can create a configure method and add components to an `IFunctionAppBuilder` instance.  The Azure Functions host creates an `IFunctionAppBuilder` and passes it directly into your configured method.

To specify your configure method, you must create an assembly attribute that specifies the type for your configure method using the `FunctionStartup` attribute.

```csharp
[assembly: FunctionAppStartup(typeof(Startup))]

namespace MyNamespace
{
    class Startup : IFunctionAppStartup
    {
        public void Configure(IFunctionAppBuilder builder)
        {
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton((s) => {
                return new CosmosClient(Environment.GetEnvironmentVariable("COSMOSDB_CONNECTIONSTRING"));
            });
            builder.Services.AddSingleton<ILoggerFactory, MyLoggerFactor>();
        }
    }
}
```

## Service lifetimes

Azure Function apps provide the same service lifetimes as [ASP.NET Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection#service-lifetimes), specifically transient, scoped, and singleton.

In a function app, a scoped service lifetime matches a function execution lifetime. Scoped services are created once per execution and subsequent requests for that service within the execution scope will reuse that instance.  A singleton service lifetime will match the host lifetime and be re-used across function executions on that instance.

Singleton lifetime services are recommended for connections and clients, for example a `SqlConnection`, `CloudBlobClient`, or `HttpClient`.

View or download a sample of different service lifetimes (link to the GUID sample thing).

## Function app provided services

The function app host will register many services itself as part of the functions runtime.  Below are some of the services that are registered on the host.

|Service Type|Lifetime|Description|
|--|--|--|
|...|...|...|