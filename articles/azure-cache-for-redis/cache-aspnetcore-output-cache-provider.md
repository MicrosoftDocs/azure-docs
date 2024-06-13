---
title: ASP.NET core Output Cache Provider for Azure Cache for Redis
description: Use the Redis Output Cache Provider to cache ASP.NET core page output out of process with Azure Cache for Redis.
author: flang-msft
ms.author: cawa
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: how-to
ms.date: 06/13/2024


#CustomerIntent: As a cloud developer, I want to understand core output caching using Azure Cache for Redis so that I can implement it for storing page output.
---
# ASP.NET Core Output Cache Provider for Azure Cache for Redis

This article explains how to configure Redis output caching middleware in an ASP.NET Core app. The output caching middleware enables caching of HTTP responses. The benefits for using output caching include:

- Saving web server resource utilization from repeatedly generating HTTP responses and rendering HTML web pages.
- Improving web request performance by reducing dependencies calls.

The benefits of using Azure Cache for Redis as your output cache include:

- Saving web server memory resource utilization by saving cached content in an external Redis.
- Improving web application resiliency by persisting cached content in an external Redis in the scenarios of server failover or restart.
- The Redis output caching implementation includes performance and storage optimizations comparing with custom implementations of the Output Caching middleware providers.

The output caching middleware can be used in all types of ASP.NET Core apps: Minimal API, Web API with controllers, MVC, and Razor Pages. For a detailed walkthrough on output caching syntax and features, see [Output caching middleware in ASP.NET Core](/aspnet/core/performance/caching/output).

## Prerequisites

- Install .NET 8 SDK or later. [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- Install Visual Studio Code. [Download](https://code.visualstudio.com/download)
- Create an Azure Cache for Redis instance.
  - [Quickstart: Create an open-source Redis cache](./quickstart-create-redis.md)
  - [Quickstart: Create a Redis Enterprise cache](./quickstart-create-redis-enterprise.md)

For an end-to-end application that uses Redis output caching, see [.NET 8 Web Application with Redis Output Caching and Azure OpenAI](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/output-cache-open-ai)

## Add Redis output caching middleware to an empty ASP.NET core web application

Here's the procedure for using Azure Cache for Redis as the output caching middleware in an ASP.NET Core app. The output caching middleware enables caching of HTTP responses as page output.

### Create an empty ASP.NET core web application

Open the command prompt. Use the .NET command line to create an empty ASP.NET core web application.

```cmd
mkdir RedisOutputCache
cd RedisOutputCache
dotnet new web
```

### Add Redis Output Caching NuGet Packages

Make sure your command prompt is in the project folder where the `*.csproj` file is located. Install the [Microsoft.AspNetCore.OutputCaching.StackExchangeRedis](https://www.nuget.org/packages/Microsoft.AspNetCore.OutputCaching.StackExchangeRedis) NuGet package.

```cmd
dotnet add package Microsoft.AspNetCore.OutputCaching.StackExchangeRedis
```

### Add Redis Output Caching middleware in the web application startup code

1. Open the project director in Visual Studio Code by typing _Code ._ in the command prompt.

    ```cmd
   code .
    ```

 If prompted, select **Yes I trust the author** to proceed.

1. Open _Program.cs_ file.

1. Add the following function calls. `AddStackExchangeRedisOutputCache()`, `AddOutputCache()`, `UseOutputCache()`.

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    // add Redis Output Cache Middleware service
    builder.Services.AddStackExchangeRedisOutputCache(options => {
        options.Configuration = builder.Configuration["RedisCacheConnection"];
    });
    builder.Services.AddOutputCache(options => {
        // optional: named output-cache profiles
    });


    var app = builder.Build();

    app.MapGet("/", () => "Hello World!");

    // use Redis Output Caching Middleware service
    app.UseOutputCache();

    app.Run();

    ```

1. Save the _Program.cs_ file. Make sure the application builds with no error in the Command Prompt.

    ```cmd
    dotnet build
    ```

### Configure one endpoint or page

1. Add the cached endpoint under `app.MetGet()`.

    ```csharp
    app.MapGet("/", () => "Hello World!");
    
    //Added for caching HTTP response of one end point
    app.MapGet("/cached",()=> "Hello Redis Output Cache" + DateTime.Now).CacheOutput();
    ```

1. Save the _program.cs_ file. Make sure the application builds with no error in the Command Prompt.

    ```cmd
    dotnet build
    ```

### Configure Redis Cache connection

It's security best practice to not store password in clear text in source-controlled code files. ASP.NET core provides [User Secrets management](/aspnet/core/security/app-secrets) to ensure secrets, such as connection strings, are saved and accessed securely. Use this feature to manage the Azure Cache for Redis connection strings.

1. Enable secret storage using the CLI.

    ```cli
    dotnet user-secrets init
    ```

1. Obtain the Azure Cache for Redis connection strings using the Azure portal.

    The connection string for OSS Azure Cache for Redis can be found by selecting **Authentication** on the Resource menu.
      `<Azure_redis_name>.redis.cache.windows.net:6380,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False`

    The access keys for Enterprise Redis can found by selecting **Access keys** from the Resource menu. The connection string can be derived with other Redis information from the **Overview** section of the Resource menu.
      `<Azure_redis_name>.<Azure_region>.redisenterprise.cache.azure.net:10000,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False`

1. Set the Redis connection for the web application using the CLI

    ```cli
    dotnet user-secrets set RedisCacheConnection <Azure_Redis_ConnectionString>
    ```

1. Run your application:

    ```cli
    dotnet build
    dotnet run
    ```

    The command prompt displays progress:

    ```cmd
    Building...
    info: Microsoft.Hosting.Lifetime[14]
    Now listening on: http://localhost:5063
    info: Microsoft.Hosting.Lifetime[0]
    Application started. Press Ctrl+C to shut down.
    ...
    ```

### Verify the Redis output cache is working

1. Browse to the local host URL, for example:
    `http://localhost:5063/cached`

2. Observe if the current time is being displayed. Refreshing the browser doesn't change the time because the content is cached. The following example of text might be displayed by the /cached endpoint.

    ```cmd
    Hello Redis Output Cache5/27/2024 8:31:35 PM
    ```

## Related content

- [ASP.NET Output Cache Provider for Azure Cache for Redis](cache-aspnet-output-cache-provider.md)
- [Output caching](/aspnet/core/performance/caching/overview#output-caching)
