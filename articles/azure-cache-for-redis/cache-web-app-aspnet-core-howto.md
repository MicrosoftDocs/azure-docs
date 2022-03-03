---
title: Create an ASP.NET Core web app with Azure Cache for Redis
description: In this quickstart, you learn how to create an ASP.NET Core web app with Azure Cache for Redis
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other
ms.topic: quickstart
ms.date: 03/31/2021
#Customer intent: As an ASP.NET Core developer, new to Azure Cache for Redis, I want to create a new ASP.NET Core web app that uses Azure Cache for Redis.
---
# Quickstart: Use Azure Cache for Redis with an ASP.NET Core web app

In this quickstart, you incorporate Azure Cache for Redis into an ASP.NET Core web application that connects to Azure Cache for Redis to store and retrieve data from the cache.

## Skip to the code on GitHub

Go straight to the code by downloading the [ASP.NET Core quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet-core) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

## Create a cache

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

Make a note of the **HOST NAME** and the **Primary** access key. You will use these values later to construct the *CacheConnection* secret.

## Create an ASP.NET Core web app

In your command window, execute the following command to store a new secret named *CacheConnection*, after replacing the placeholders, including angle brackets, for your cache name and primary access key:

```dotnetcli
dotnet user-secrets set CacheConnection "<cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<primary-access-key>"
```

## Update the HomeController and Layout

The following statements in *Controllers\HomeController.cs* get and set values on the cache for use in the sample.

<!-- This section can be revamped to copy the dotnet-core sample. So we could have one section talking about setting and getting values on the cache (the corresponding code is lines 41 - 72 in aspnet-core/ContosoTeamStats/Controllers/HomeController.cs), and another section about the ConnectionMultiplexer (corresponding to RedisConnection.cs) -->

```csharp
    public async Task<ActionResult> RedisCache()
    {
        _redisConnection = await _redisConnectionFactory;
        ViewBag.Message = "A simple example with Azure Cache for Redis on ASP.NET Core.";

        // Perform cache operations using the cache object...

        // Simple PING command
        ViewBag.command1 = "PING";
        ViewBag.command1Result = (await _redisConnection.BasicRetryAsync(async (db) => await db.ExecuteAsync(ViewBag.command1))).ToString();

        // Simple get and put of integral data types into the cache
        string key = "Message";
        string value = "Hello! The cache is working from ASP.NET Core!";

        ViewBag.command2 = $"SET {key} \"{value}\"";
        ViewBag.command2Result = (await _redisConnection.BasicRetryAsync(async (db) => await db.StringSetAsync(key, value))).ToString();

        ViewBag.command3 = $"GET {key}";
        ViewBag.command3Result = (await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync(key))).ToString();

        key = "LastUpdateTime";
        value = DateTime.UtcNow.ToString();

        ViewBag.command4 = $"GET {key}";
        ViewBag.command4Result = (await _redisConnection.BasicRetryAsync(async (db) => await db.StringGetAsync(key))).ToString();

        ViewBag.command5 = $"SET {key}";
        ViewBag.command5Result = (await _redisConnection.BasicRetryAsync(async (db) => await db.StringSetAsync(key, value))).ToString();

        return View();
        }
```

## Connnect to the cache with RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is made in the statement in HomeController.cs:

```csharp
_redisConnection = await _redisConnectionFactory;
```

You must have this statement in your code as seen in `RedisConnection.cs` to use the `RedisConnection` class.

```csharp
using StackExchange.Redis;
```

The `RedisConnection` code uses the `ConnectionMultiplexer` pattern, but abstracts it. Using `ConnectionMultiplexer` is common across Redis applications. Look at this code to see one implementation.

For more information, see [StackExchange's `ConnectionMultiplexer`](https://stackexchange.github.io/StackExchange.Redis/Basics.html).

:::code language="csharp" source="~/samples-cache/quickstart/aspnet-core/ContosoTeamStats/RedisConnection.cs":::

## Views in the sample

Open *Views\Shared\\_Layout.cshtml*.

You should see:

```cshtml
<a class="navbar-brand" asp-area="" asp-controller="Home" asp-action="RedisCache">Azure Cache for Redis Test</a>
```

## Run the app locally

Execute the following command in your command window to build the app:

```dotnetcli
dotnet build
```

Then run the app with the following command:

```dotnetcli
dotnet run
```

Browse to `https://localhost:5001` in your web browser.

Select **Azure Cache for Redis Test** in the navigation bar of the web page to test cache access.

In the example below, you can see the `Message` key previously had a cached value, which was set using the Redis Console in the Azure portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

![Simple test completed local](./media/cache-web-app-aspnet-core-howto/cache-simple-test-complete-local.png)

## Clean up resources

If you're continuing to the next tutorial, you can keep the resources that you created in this quickstart and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources that you created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible. When you delete a resource group, all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.

### To delete a resource group

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource groups**.

2. In the **Filter by name...** box, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group, in the results list, select **...**, and then select **Delete resource group**.

    ![Delete](./media/cache-web-app-howto/cache-delete-resource-group.png)

You're asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and then select **Delete**.

After a few moments, the resource group and all of its resources are deleted.

## Next steps

For information on deploying to Azure, see:

> [!div class="nextstepaction"]
> [Tutorial: Build an ASP.NET Core and SQL Database app in Azure App Service](../app-service/tutorial-dotnetcore-sqldb-app.md)

For information about storing the cache connection secret in Azure Key Vault, see:

> [!div class="nextstepaction"]
> [Azure Key Vault configuration provider in ASP.NET Core](/aspnet/core/security/key-vault-configuration)

Want to scale your cache from a lower tier to a higher tier?

> [!div class="nextstepaction"]
> [How to Scale Azure Cache for Redis](./cache-how-to-scale.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
