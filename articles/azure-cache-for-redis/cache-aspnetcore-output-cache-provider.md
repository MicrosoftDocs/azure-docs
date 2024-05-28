---
title: ASP.NET core Output Cache Provider for Azure Cache for Redis
description: Learn how to cache ASP.NET core Page Output using Azure Cache for Redis. The Redis Output Cache Provider is an out-of-process storage mechanism for output cache data.
author: CawaMS
ms.author: CawaMS
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: conceptual
ms.date: 05/25/2024
---
# ASP.NET Core Output Cache Provider for Azure Cache for Redis
This article explains how to configure Redis output caching middleware in an ASP.NET Core app. 

The output caching middleware enables caching of HTTP responses. The benefits for using output caching include:

* Saving web server resource utilitzation from repeatedly generating HTTP responses and rendering HTML web pages.
* Improving web request performance by reducing dependencies calls.

For an introduction to ASP.NET Core output caching middleware, see [Output caching](/aspnet/core/performance/caching/overview#output-caching).

The benefits for using Redis as the storage for output caching include:

* Saving web server memory resource utilization by saving cached content in an external Redis.
* Improving web application resiliency by persisting cached content in an external Redis in the scenarios of server failover or restart.
* The Redis output caching implementation includes performance and storage optimizations comparing with custom implementations of the Output Caching middleware providers.

The output caching middleware can be used in all types of ASP.NET Core apps: Minimal API, Web API with controllers, MVC, and Razor Pages. For a detailed walkthrough on output caching syntax and features, see [Output caching middleware in ASP.NET Core](/aspnet/core/performance/caching/output).

## Add Redis output caching middleware to an empty ASP.NET core web application
Pre-requisites:

* Install .NET 8 SDK or later. [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
* Install Visual Studio Code. [Download](https://code.visualstudio.com/download)
* Create an Azure Cache for Redis instance.
    - [Quickstart: Create an open-source Redis cache](./quickstart-create-redis.md)
    - [Quickstart: Create a Redis Enterprise cache](./quickstart-create-redis-enterprise.md)
* (Optional) For an end-to-end application that uses Redis output caching, see [.NET 8 Web Application with Redis Output Caching and Azure Open AI](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/output-cache-open-ai)

### Step 1: Create an empty ASP.NET core web application
Open the command Prompt. Use the .NET commandline to create an empty ASP.NET core web application.

    ```cli
    mkdir RedisOutputCache
    cd RedisOutputCache
    dotnet new web
    ```

### Step 2: Add Redis Output Caching Nuget Packages
Make sure your command prompt is in the project folder where the *.csproj file is located. Install the [Microsoft.AspNetCore.OutputCaching.StackExchangeRedis](https://www.nuget.org/packages/Microsoft.AspNetCore.OutputCaching.StackExchangeRedis) nuget package.

```
dotnet add package Microsoft.AspNetCore.OutputCaching.StackExchangeRedis
```

### Step 3: Add Redis Output Caching middleware in the web application startup code

1. Open the project director in Visual Studio Code by typing *Code .* in the command prompt.

    ```
    code .
    ```
    If prompted, click *Yes I trust the author* button to proceed.

2. Open *Program.cs* file.
3. Add the following function calls. *AddStackExchangeRedisOutputCache(), AddOutputCache(), UseOutputCache()*.

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
    Save the *Program.cs* file. Make sure the application builds with no error in the Command Prompt.

    ```
    dotnet build
    ```

### Step 4: Configure one endpoint or page

Add the cached endpoint under *app.MetGet()*.

```csharp
app.MapGet("/", () => "Hello World!");

//Added for caching HTTP response of one end point
app.MapGet("/cached",()=> "Hello Redis Output Cache" + DateTime.Now).CacheOutput();
```
Save the *Program.cs* file. Make sure the application builds with no error in the Command Prompt.

```
dotnet build
```

### Step 5: Configure Redis Cache connection
It's security best practice to not store password in clear text in source-controlled code files. ASP.NET core provides [User Secrets management](/aspnet/core/security/app-secrets) to ensure secrets such as connection strings are saved and accessed securely. We will use this feature to manage the Azure Cache for Redis connection strings.

1. Enable secret storage

    ```cli
    dotnet user-secrets init
    ```
2. Obtain the Azure Cache for Redis connection string in [Azure Portal](https://aka.ms/publicportal). 
    * The connection string for OSS Redis can be found in the *Authentication* blade. Looking like the following:
    *<Azure_redis_name>.redis.cache.windows.net:6380,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False*
    * The access keys for Enterprise Redis can found in the *Access Keys* section. The connection string can be derived with other Redis info in the *Overview* blade:
    *<Azure_redis_name>.<Azure_region>.redisenterprise.cache.azure.net:10000,password=<Azure_redis_primary_accesskey>,ssl=True,abortConnect=False*
3. Set Redis Connection for the web application

    ```cli
    dotnet user-secrets set RedisCacheConnection <Azure_Redis_ConnectionString>
    ```
4. Run your application:

    ```cli
    dotnet build
    dotnet run
    ```
    The Command Prompt will display information the following:

    ```
    Building...
    info: Microsoft.Hosting.Lifetime[14]
    Now listening on: http://localhost:5063
    info: Microsoft.Hosting.Lifetime[0]
    Application started. Press Ctrl+C to shut down.
    ...
    ```

### Step 6: Verify the Redis output cache is working
Browse to the local host URL, for example, http://localhost:5063/cached. Observe the current time is being displayed. Refreshing the browser will not change the time since the content is cached. Below is an example text displayed by the /cached endpoint.

```
Hello Redis Output Cache5/27/2024 8:31:35 PM
```
