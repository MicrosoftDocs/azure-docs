---
title: Create an ASP.NET Core web app with Azure Cache for Redis
description: In this quickstart, you learn how to create an ASP.NET Core web app with Azure Cache for Redis.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other
ms.topic: quickstart
ms.date: 04/24/2024

---

# Quickstart: Use Azure Cache for Redis with an ASP.NET Core web app

In this quickstart, you incorporate Azure Cache for Redis into an ASP.NET Core web application that connects to Azure Cache for Redis to store and retrieve data from the cache.

There are also caching providers in .NET core. To quickly start using Redis with minimal changes to your existing code, see:

- [ASP.NET core Output Cache provider](/aspnet/core/performance/caching/output#redis-cache)
- [ASP.NET core Distributed Caching provider](/aspnet/core/performance/caching/distributed#distributed-redis-cache)
- [ASP.NET core Redis session provider](/aspnet/core/fundamentals/app-state#configure-session-state)

## Skip to the code on GitHub

Clone the repo [https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet-core](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet-core) on GitHub.

As a next step, you can see a real-world scenario eShop application demonstrating the ASP.NET core caching providers: [ASP.NET core eShop using Redis caching providers](https://github.com/Azure-Samples/azure-cache-redis-demos).

Features included:

- Redis Distributed Caching
- Redis session state provider

Deployment instructions are in the README.md.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Make a note of the **HOST NAME** and the **Primary** access key. You use these values later to construct the *CacheConnection* secret.

## Add a local secret for the connection string

In your command window, execute the following command to store a new secret named *CacheConnection*, after replacing the placeholders, including angle brackets, for your cache name and primary access key:

```dos
dotnet user-secrets set CacheConnection "<cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<primary-access-key>"
```

## Connect to the cache with RedisConnection

The `RedisConnection` class manages the connection to your cache. The connection is made in this statement in `HomeController.cs` in the *Controllers* folder:

```csharp
_redisConnection = await _redisConnectionFactory;
```

In `RedisConnection.cs`, you see the `StackExchange.Redis` namespace is added to the code. This is needed for the `RedisConnection` class.

```csharp
using StackExchange.Redis;
```

The `RedisConnection` code ensures that there's always a healthy connection to the cache by managing the `ConnectionMultiplexer` instance from `StackExchange.Redis`. The `RedisConnection` class recreates the connection when a connection is lost and unable to reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

## Layout views in the sample

The home page layout for this sample is stored in the *_Layout.cshtml* file. From this page, you start the actual cache testing by clicking the **Azure Cache for Redis Test** from this page.

1. Open *Views\Shared\\_Layout.cshtml*.

1. You should see in `<div class="navbar-header">`:

    ```html
    <a class="navbar-brand" asp-area="" asp-controller="Home" asp-action="RedisCache">Azure Cache for Redis Test</a>
    ```

:::image type="content" source="media/cache-web-app-aspnet-core-howto/cache-welcome-page.png" alt-text="screenshot of welcome page":::

### Showing data from the cache

From the home page, you select **Azure Cache for Redis Test** to see the sample output.

1. In **Solution Explorer**, expand the **Views** folder, and then right-click the **Home** folder.

1. You should see this code in the *RedisCache.cshtml* file.

    ```csharp
    @{
        ViewBag.Title = "Azure Cache for Redis Test";
    }

    <h2>@ViewBag.Title.</h2>
    <h3>@ViewBag.Message</h3>
    <br /><br />
    <table border="1" cellpadding="10">
        <tr>
            <th>Command</th>
            <th>Result</th>
        </tr>
        <tr>
            <td>@ViewBag.command1</td>
            <td><pre>@ViewBag.command1Result</pre></td>
        </tr>
        <tr>
            <td>@ViewBag.command2</td>
            <td><pre>@ViewBag.command2Result</pre></td>
        </tr>
        <tr>
            <td>@ViewBag.command3</td>
            <td><pre>@ViewBag.command3Result</pre></td>
        </tr>
        <tr>
            <td>@ViewBag.command4</td>
            <td><pre>@ViewBag.command4Result</pre></td>
        </tr>
        <tr>
            <td>@ViewBag.command5</td>
            <td><pre>@ViewBag.command5Result</pre></td>
        </tr>
    </table>
    ```

## Run the app locally

1. Execute the following command in your command window to build the app:

    ```dos
    dotnet build
    ```

1. Then run the app with the following command:

    ```dos
    dotnet run
    ```

1. Browse to `https://localhost:5001` in your web browser.

1. Select **Azure Cache for Redis Test** in the navigation bar of the web page to test cache access.

:::image type="content" source="./media/cache-web-app-aspnet-core-howto/cache-simple-test-complete-local.png" alt-text="Screenshot of simple test completed local":::

<!-- Clean up include -->
[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
