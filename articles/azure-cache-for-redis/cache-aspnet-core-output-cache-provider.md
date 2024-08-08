---
title: ASP.NET Core output cache provider for Azure Cache for Redis
description: Use the Redis Output Cache Provider to cache ASP.NET Core page output out of process by using Azure Cache for Redis.
author: flang-msft
ms.author: cawa
ms.service: azure-cache-redis
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: how-to
ms.date: 06/14/2024

#customer intent: As a cloud developer, I want to understand core output caching via Azure Cache for Redis so that I can implement it for storing page output.
---

# ASP.NET Core Output Cache Provider for Azure Cache for Redis

This article explains how to configure Redis output caching middleware in an ASP.NET Core app. The output caching middleware enables caching of HTTP responses. The benefits of using output caching include:

- Saving web server resource utilization from repeatedly generating HTTP responses and rendering HTML webpages.
- Improving web request performance by reducing dependency calls.

The benefits of using Azure Cache for Redis as your output cache include:

- Saving web server memory resource utilization by storing cached content in an external Redis database.
- Improving web application resiliency by persisting cached content in an external Redis database in the scenario of server failover or restart.

You can use the output caching middleware in all types of ASP.NET Core apps: minimal API, web API with controllers, Model-View-Controller (MVC), and Razor Pages. For a detailed walkthrough of output caching syntax and features, see [Output caching middleware in ASP.NET Core](/aspnet/core/performance/caching/output).

## Prerequisites

- [Download](https://dotnet.microsoft.com/download/dotnet/8.0) and install .NET 8 SDK or later.
- [Download](https://code.visualstudio.com/download) and install Visual Studio Code.
- Create an Azure Cache for Redis instance. For more information, see:
  - [Quickstart: Create an open-source Redis cache](./quickstart-create-redis.md)
  - [Quickstart: Create a Redis Enterprise cache](./quickstart-create-redis-enterprise.md)

For an end-to-end application that uses Redis output caching, see [.NET 8 Web Application with Redis Output Caching and Azure OpenAI](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/output-cache-open-ai).

## Add Redis output caching middleware to an empty ASP.NET core web application

Here's the procedure for using Azure Cache for Redis as the output caching middleware in an ASP.NET Core app. The output caching middleware enables caching of HTTP responses as page output.

### Create an empty ASP.NET core web application

Open a command prompt. Use the .NET command line to create an empty ASP.NET core web application:

```cmd
mkdir RedisOutputCache
cd RedisOutputCache
dotnet new web
```

### Add NuGet packages for Redis output caching

Make sure your command prompt is in the project folder that contains the `*.csproj` file. Install the [Microsoft.AspNetCore.OutputCaching.StackExchangeRedis](https://www.nuget.org/packages/Microsoft.AspNetCore.OutputCaching.StackExchangeRedis) NuGet package:

```cmd
dotnet add package Microsoft.AspNetCore.OutputCaching.StackExchangeRedis
```

### Add Redis output caching middleware in the web application's startup code

1. Use the command prompt to open the project directory in Visual Studio Code:

    ```cmd
   code .
    ```

    If you're prompted, select **Yes I trust the author** to proceed.

1. Open the _Program.cs_ file.

1. Add the `AddStackExchangeRedisOutputCache()`, `AddOutputCache()`, and `UseOutputCache()` function calls:

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

1. Save the _Program.cs_ file. Make sure the application builds with no errors in the command prompt:

    ```cmd
    dotnet build
    ```

### Configure one endpoint or page

1. Add the cached endpoint under `app.MetGet()`:

    ```csharp
    app.MapGet("/", () => "Hello World!");
    
    //Added for caching HTTP response of one end point
    app.MapGet("/cached",()=> "Hello Redis Output Cache" + DateTime.Now).CacheOutput();
    ```

1. Save the _Program.cs_ file. Make sure the application builds with no errors in the command prompt:

    ```cmd
    dotnet build
    ```

### Configure the Redis Cache connection

It's a security best practice to avoid storing passwords in clear text in source-controlled code files. ASP.NET Core provides [user secrets management](/aspnet/core/security/app-secrets) to help ensure that secrets, such as connection strings, are saved and accessed securely. Use this feature to manage the Azure Cache for Redis connection strings.

1. Enable the storage of secrets by using the Azure CLI:

    ```cli
    dotnet user-secrets init
    ```

1. Obtain the Azure Cache for Redis connection strings by using the Azure portal.

    You can find the connection string for open source Redis tiers by selecting **Authentication** on the **Resource** menu. Here's an example string: `<Azure_redis_name>.redis.cache.windows.net:6380,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False`.

    You can find the access keys for Redis Enterprise by selecting **Access keys** on the **Resource** menu. The connection string can be derived with other Redis information from the **Overview** section of the **Resource** menu. Here's an example string: `<Azure_redis_name>.<Azure_region>.redisenterprise.cache.azure.net:10000,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False`.

1. Set the Redis connection for the web application by using the Azure CLI:

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

### Verify that the Redis output cache is working

1. Browse to the local host URL. Here's an example: `http://localhost:5063/cached`.

1. Observe if the current time is being displayed. Refreshing the browser doesn't change the time because the content is cached. The `/cached` endpoint might display text like the following example:

    ```cmd
    Hello Redis Output Cache5/27/2024 8:31:35 PM
    ```

## Related content

- [ASP.NET Output Cache Provider for Azure Cache for Redis](cache-aspnet-output-cache-provider.md)
- [Output caching](/aspnet/core/performance/caching/overview#output-caching)
