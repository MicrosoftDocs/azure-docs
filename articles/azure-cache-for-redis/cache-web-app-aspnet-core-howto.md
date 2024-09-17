---
title: 'Quickstart: Use Azure Cache for Redis with ASP.NET Core'
description: Modify a sample ASP.NET Core web app and connect the app to Azure Cache for Redis.



ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other
ms.topic: quickstart
ms.date: 04/24/2024
#Customer intent: As an ASP.NET Core developer who is new to Azure Cache for Redis, I want to create a new ASP.NET Core app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with an ASP.NET Core web app

In this quickstart, you incorporate Azure Cache for Redis into an ASP.NET Core web application that connects to Azure Cache for Redis to store and get data from the cache.

You can use a caching provider in your ASP.NET Core web app. To quickly start using Redis with minimal changes to your existing code, see:

- [ASP.NET Core output cache provider](/aspnet/core/performance/caching/output#redis-cache)
- [ASP.NET Core distributed caching provider](/aspnet/core/performance/caching/distributed#distributed-redis-cache)
- [ASP.NET Core Redis session provider](/aspnet/core/fundamentals/app-state#configure-session-state)

## Skip to the code

This article describes how to modify the code for a sample app to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the code, see the [ASP.NET Core quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet-core) on GitHub.

You can clone the [Azure Cache for Redis samples](https://github.com/Azure-Samples/azure-cache-redis-samples) GitHub repository, and then go to the *quickstart/aspnet-core* directory to view the completed source code for the steps that are described in this article.

The *quickstart/aspnet-core* directory is also configured as an [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) template. Use the open-source azd tool to streamline provisioning and deployment from a local environment to Azure. Optionally, run the `azd up` command to automatically provision an Azure Cache for Redis instance, and to configure the local sample app to connect to it:

```azdeveloper
azd up
```

### Explore the eShop sample

As a next step, you can see a real-world scenario eShop application that demonstrates the ASP.NET Core caching providers: [ASP.NET Core eShop by using Redis caching providers](https://github.com/Azure-Samples/azure-cache-redis-demos).

Features include:

- Redis distributed caching
- Redis session state provider

Deployment instructions are in the *README.md* file in the [ASP.NET Core quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet-core) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create-entra-id.md)]

[!INCLUDE [redis-cache-passwordless](includes/redis-cache-passwordless.md)]

[!INCLUDE [redis-access-policy](includes/redis-access-policy.md)]

## Add a local secret for the host name

In your command window, run the following command to store a new secret named *RedisHostName*. In the code, replace the placeholders, including angle brackets, with your cache name and primary access key:

```dos
dotnet user-secrets set RedisHostName "<cache-name>.redis.cache.windows.net"
```

## Connect to the cache by using RedisConnection

The `RedisConnection` class manages the connection to your cache. The connection is made in this statement in *HomeController.cs* in the *Controllers* folder:

```csharp
_redisConnection = await _redisConnectionFactory;
```

The *RedisConnection.cs* file includes the StackExchange.Redis and Azure.Identity namespaces at the top of the file to include essential types to connect to Azure Cache for Redis:

```csharp
using StackExchange.Redis;
using Azure.Identity;
```

The `RedisConnection` class code ensures that there's always a healthy connection to the cache. The connection is managed by the `ConnectionMultiplexer` instance from StackExchange.Redis. The `RedisConnection` class re-creates the connection when a connection is lost and can't reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in the [StackExchange.Redis GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

## Verify layout views in the sample

The home page layout for this sample is stored in the *_Layout.cshtml* file. In the next section, you test the cache by using the controller that you add here.

1. Open *Views\Shared\\_Layout.cshtml*.

1. Verify that the following line is in `<div class="navbar-header">`:

    ```html
    <a class="navbar-brand" asp-area="" asp-controller="Home" asp-action="RedisCache">Azure Cache for Redis Test</a>
    ```

:::image type="content" source="media/cache-web-app-aspnet-core-howto/cache-welcome-page.png" alt-text="Screenshot that shows a welcome page on a webpage.":::

### Show data from the cache

On the home page, select **Azure Cache for Redis Test** in the navigation bar to see the sample output.

1. In Solution Explorer, expand the **Views** folder, and then right-click the **Home** folder.

1. Verify that the following code is in the *RedisCache.cshtml* file:

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

1. In a Command Prompt window, build the app by using the following command:

    ```dos
    dotnet build
    ```

1. Run the app by using this command:

    ```dos
    dotnet run
    ```

1. In a web browser, go to `https://localhost:5001`.

1. On the webpage navigation bar, select **Azure Cache for Redis Test** to test cache access.

:::image type="content" source="./media/cache-web-app-aspnet-core-howto/cache-simple-test-complete-local.png" alt-text="Screenshot that shows a simple test completed locally.":::

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience best practices for your cache](cache-best-practices-connection.md)
- [Development best practices for your cache](cache-best-practices-development.md)
