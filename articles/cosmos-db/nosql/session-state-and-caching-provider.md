---
title: Use Azure Cosmos DB as an ASP.NET session state and caching provider
description: Learn how to use Azure Cosmos DB as an ASP.NET session state and caching provider
author: StefArroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/06/2022
---

# Use Azure Cosmos DB as an ASP.NET session state and caching provider
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The Azure Cosmos DB session and cache provider allows you to use Azure Cosmos DB and leverage its low latency and global scale capabilities for storing session state data and as a distributed cache within your application.

## What is session state?

[Session state](/aspnet/core/fundamentals/app-state?view=aspnetcore-5.0#configure-session-state&preserve-view=true) is user data that tracks a user browsing through a web application during a period of time, within the same browser. The session state expires, and it's limited to the interactions a particular browser is having which does not extend across browsers. It is considered ephemeral data, if it is not present it will not break the application. However, when it exists, it makes the experience faster for the user because the web application does not need to fetch it on every browser request for the same user.

It is often backed by some storage mechanism, that can in some cases, be external to the current web server and enable load-balancing requests of the same browser across multiple web servers to achieve higher scalability.

The simplest session state provider is the in-memory provider that only stores data on the local web server memory and requires the application to use [Application Request Routing](/iis/extensions/planning-for-arr/using-the-application-request-routing-module). This makes the browser session sticky to a particular web server (all requests for that browser need to always land on the same web server). The provider works well on simple scenarios but the stickiness requirement can bring load-balancing problems when web applications scale.

There are many external storage providers available, that can store the session data in a way that can be read and accessed by multiple web servers without requiring session stickiness and enable a higher scale.

## Session state scenarios

Azure Cosmos DB can be used as a session state provider through the extension package [Microsoft.Extensions.Caching.Cosmos](https://www.nuget.org/packages/Microsoft.Extensions.Caching.Cosmos) uses the [Azure Cosmos DB .NET SDK](sdk-dotnet-v3.md), using a Container as an effective session storage based on a key/value approach where the key is the session identifier.

Once the package is added, you can use `AddCosmosCache` as part of your Startup process (services.AddSession and app.UseSession are [common initialization](/aspnet/core/fundamentals/app-state?view=aspnetcore-5.0#configure-session-stat&preserve-view=true) steps required for any session state provider):

```csharp
public void ConfigureServices(IServiceCollection services)
{
  /* Other service configurations */
  services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
  {
      CosmosClientBuilder clientBuilder = new CosmosClientBuilder("myConnectionString")
        .WithApplicationRegion("West US");
      cacheOptions.ContainerName = "myContainer";
      cacheOptions.DatabaseName = "myDatabase";
      cacheOptions.ClientBuilder = clientBuilder;
      /* Creates the container if it does not exist */
      cacheOptions.CreateIfNotExists = true; 
  });

  services.AddSession(options =>
  {
      options.IdleTimeout = TimeSpan.FromSeconds(3600);
      options.Cookie.IsEssential = true;
  });
  /* Other service configurations */
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    /* Other configurations */

    app.UseSession();

    /* app.UseEndpoints and other configurations */
}
```

Where you specify the database and container you want the session state to be stored and optionally, create them if they don't exist using the `CreateIfNotExists` attribute.

> [!IMPORTANT]
> If you provide an existing container instead of using `CreateIfNotExists`, make sure it has [time to live enabled](how-to-time-to-live.md).

You can customize your SDK client configuration by using the `CosmosClientBuilder` or if your application is already using a `CosmosClient` for other operations with Azure Cosmos DB, you can also inject it into the provider:

```csharp
services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
{
    cacheOptions.ContainerName = "myContainer";
    cacheOptions.DatabaseName = "myDatabase";
    cacheOptions.CosmosClient = preExistingClient;
    /* Creates the container if it does not exist */
    cacheOptions.CreateIfNotExists = true; 
});
```

After this, you can use ASP.NET Core sessions like with any other provider and use the HttpContext.Session object. Keep in mind to always try to load your session information asynchronously as per the [ASP.NET recommendations](/aspnet/core/fundamentals/app-state?view=aspnetcore-5.0#load-session-state-asynchronously&preserve-view=true).

##  Distributed cache scenarios

Given that the Azure Cosmos DB provider implements the [IDistributedCache interface to act as a distributed cache provider](/aspnet/core/performance/caching/distributed?view=aspnetcore-5.0&preserve-view=true), it can also be used for any application that requires distributed cache, not just for web applications that require a performant and distributed session state provider.

Distributed caches require data consistency to provide independent instances to be able to share that cached data. When using the Azure Cosmos DB provider, you can:

- Use your Azure Cosmos DB account in **Session consistency** if you can enable [Application Request Routing](/iis/extensions/planning-for-arr/using-the-application-request-routing-module) and make requests sticky to a particular instance.
- Use your Azure Cosmos DB account in **Bounded Staleness or Strong consistency** without requiring request stickiness. This provides the greatest scale in terms of load distribution across your instances.

To use the Azure Cosmos DB provider as a distributed cache, it needs to be registered in `ConfiguredService`s with the `services.AddCosmosCache` call. Once that is done, any constructor in the application can ask for the cache by referencing `IDistributedCache` and it will receive the instance injected by [dependency injection](/dotnet/core/extensions/dependency-injection) to be used:

```csharp
public class MyBusinessClass
{
    private readonly IDistributedCache cache;

    public MyBusinessClass(IDistributedCache cache)
    {
        this.cache = cache;
    }
    
    public async Task SomeOperationAsync()
    {
        string someCachedValue = await this.cache.GetStringAsync("someKey");
        /* Use the cache */
    }
}
```

## Troubleshooting and diagnosing
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Since the Azure Cosmos DB provider uses the .NET SDK underneath, all the existing [performance guidelines](performance-tips-dotnet-sdk-v3.md) and [troubleshooting guides](troubleshoot-dotnet-sdk.md) apply to understanding any potential issue. Note, there is a distinct way to get access to the Diagnostics from the underlying Azure Cosmos DB operations because they cannot be exposed through the IDistributedCache APIs.

Registering the optional diagnostics delegate will allow you to capture and conditionally log any diagnostics to troubleshoot any cases like high latency:

```csharp
void captureDiagnostics(CosmosDiagnostics diagnostics)
{
    if (diagnostics.GetClientElapsedTime() > SomePredefinedThresholdTime)
    {
        Console.WriteLine(diagnostics.ToString());
    }
}

services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
{
    cacheOptions.DiagnosticsHandler = captureDiagnostics;
    /* other options */
});
```

## Next steps
- To find more details on the Azure Cosmos DB session and cache provider see the [source code on GitHub](https://github.com/Azure/Microsoft.Extensions.Caching.Cosmos/).
- [Try out](https://github.com/Azure/Microsoft.Extensions.Caching.Cosmos/tree/master/sample) the Azure Cosmos DB session and cache provider by exploring a sample Explore an ASP.NET Core web application.
- Read more about [distributed caches](/aspnet/core/performance/caching/distributed?view=aspnetcore-5.0&preserve-view=true) in .NET.
