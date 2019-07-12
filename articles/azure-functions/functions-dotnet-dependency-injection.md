---
title: Use dependency injection in .NET Azure Functions
description: Learn how to use dependency injection for registering and using services in .NET functions
services: functions
documentationcenter: na
author: craigshoemaker
manager: gwallace
keywords: azure functions, functions, serverless architecture

ms.service: azure-functions
ms.devlang: dotnet
ms.topic: reference
ms.date: 05/28/2019
ms.author: cshoe
ms.reviewer: jehollan
---
# Use dependency injection in .NET Azure Functions

Azure Functions supports the dependency injection (DI) software design pattern, which is a technique to achieve [Inversion of Control (IoC)](https://docs.microsoft.com/dotnet/standard/modern-web-apps-azure-architecture/architectural-principles#dependency-inversion) between classes and their dependencies.

Azure Functions builds on top of the ASP.NET Core Dependency Injection features. Being aware of services, lifetimes, and design patterns of [ASP.NET Core dependency injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection) before using DI features in an Azure Functions app is recommended.

Support for dependency injection begins with Azure Functions 2.x.

## Prerequisites

Before you can use dependency injection, you must install the following NuGet packages:

- [Microsoft.Azure.Functions.Extensions](https://www.nuget.org/packages/Microsoft.Azure.Functions.Extensions/)

- [Microsoft.NET.Sdk.Functions package](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions/) version 1.0.28 or later

- Optional: [Microsoft.Extensions.Http](https://www.nuget.org/packages/Microsoft.Extensions.Http/) Only required for registering HttpClient at startup

## Register services

To register services, you can create a method to configure and add components to an `IFunctionsHostBuilder` instance.  The Azure Functions host creates an instance of `IFunctionsHostBuilder` and passes it directly into your method.

To register the method, add the `FunctionsStartup` assembly attribute that specifies the type name used during startup. Also code is referencing a prerelease of [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/) on Nuget.

```csharp
using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Cosmos;

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

## Use injected dependencies

ASP.NET Core uses constructor injection to make your dependencies available to your function. The following sample demonstrates how the `IMyService` and `HttpClient` dependencies are injected into an HTTP-triggered function.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MyNamespace
{
    public class HttpTrigger
    {
        private readonly IMyService _service;
        private readonly HttpClient _client;

        public HttpTrigger(IMyService service, IHttpClientFactory httpClientFactory)
        {
            _service = service;
            _client = httpClientFactory.CreateClient();;
        }

        [FunctionName("GetPosts")]
        public async Task<IActionResult> Get(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "posts")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            var res = await _client.GetAsync("https://microsoft.com");
            await _service.AddResponse(res);

            return new OkResult();
        }
    }
}
```

The use of constructor injection means that you should not use static functions if you want to take advantage of dependency injection.

## Service lifetimes

Azure Functions apps provide the same service lifetimes as [ASP.NET Dependency Injection](https://docs.microsoft.com/aspnet/core/fundamentals/dependency-injection#service-lifetimes): transient, scoped, and singleton.

In a functions app, a scoped service lifetime matches a function execution lifetime. Scoped services are created once per execution. Later requests for that service during the execution reuse the existing service instance. A singleton service lifetime matches the host lifetime and is reused across function executions on that instance.

Singleton lifetime services are recommended for connections and clients, for example `SqlConnection`, `CloudBlobClient`, or `HttpClient` instances.

View or download a [sample of different service lifetimes](https://aka.ms/functions/di-sample) on GitHub.

## Logging services

If you need your own logging provider, the recommended way is to register an `ILoggerProvider` instance. Application Insights is added by Azure Functions automatically.

> [!WARNING]
> Do not add `AddApplicationInsightsTelemetry()` to the services collection as it registers services that conflict with services provided by the environment.

## Function app provided services

The function host registers many services. The following services are safe to take as a dependency in your application:

|Service Type|Lifetime|Description|
|--|--|--|
|`Microsoft.Extensions.Configuration.IConfiguration`|Singleton|Runtime configuration|
|`Microsoft.Azure.WebJobs.Host.Executors.IHostIdProvider`|Singleton|Responsible for providing the ID of the host instance|

If there are other services you want to take a dependency on, [create an issue and propose them on GitHub](https://github.com/azure/azure-functions-host).

### Overriding host services

Overriding services provided by the host is currently not supported.  If there are services you want to override, [create an issue and propose them on GitHub](https://github.com/azure/azure-functions-host).

## Next steps

For more information, see the following resources:

- [How to monitor your function app](functions-monitoring.md)
- [Best practices for functions](functions-best-practices.md)
