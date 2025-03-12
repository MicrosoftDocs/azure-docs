---
title: Create an ASP.NET Core web app with an Azure Redis cache
description: In this quickstart, you learn how to create an ASP.NET Core web app with an Azure Redis cache.

ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other, ignite-2024
ms.topic: quickstart
ms.date: 12/20/2024
zone_pivot_groups: redis-type
#Customer intent: As an ASP.NET developer, new to Azure Redis, I want to create a new Node.js app that uses Azure Managed Redis or Azure Cache for Redis.
---

# Quickstart: Use Azure Redis with an ASP.NET Core web app

In this quickstart, you incorporate Azure Cache for Redis into an ASP.NET Core web application that connects to Azure Cache for Redis to store and retrieve data from the cache.

There are also caching providers in .NET core. To quickly start using Redis with minimal changes to your existing code, see:

- [ASP.NET core Output Cache provider](/aspnet/core/performance/caching/output#redis-cache)
- [ASP.NET core Distributed Caching provider](/aspnet/core/performance/caching/distributed#distributed-redis-cache)
- [ASP.NET core Redis session provider](/aspnet/core/fundamentals/app-state#configure-session-state)

## Skip to the code on GitHub

Clone the [https://github.com/Azure-Samples/azure-cache-redis-samples](https://github.com/Azure-Samples/azure-cache-redis-samples) GitHub repo and navigate to the `quickstart/aspnet-core` directory to view the completed source code for the steps ahead.

The `quickstart/aspnet-core` directory is also configured as an [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/overview) template. Use the open-source `azd` tool to streamline the provisioning and deployment from a local environment to Azure. Optionally, run the `azd up` command to automatically provision an Azure Cache for Redis instance, and to configure the local sample app to connect to it:

```azdeveloper
azd up
```

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [.NET Core SDK](https://dotnet.microsoft.com/download)

::: zone pivot="azure-managed-redis"

## Create an Azure Managed Redis (preview) instance

[!INCLUDE [managed-redis-create](includes/managed-redis-create.md)]

::: zone-end

::: zone pivot="azure-cache-redis"

## Create an Azure Cache for Redis instance

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

::: zone-end

## Microsoft Entra ID Authentication (recommended)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the Library for using Microsoft Entra ID Authentication

The [Azure.StackExchange.Redis](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) library contains the Microsoft Entra ID authentication method for connecting to Azure Redis services using Microsoft Entra ID. It is applicable to all Azure Cache for Redis, Azure Cache for Redis Enterprise, and Azure Managed Redis (Preview).

```cli
dotnet add package Microsoft.Azure.StackExchangeRedis
```

## Connect to the cache using Microsoft Entra ID

1. Include the libraries in your code

   ```csharp
   using Azure.Identity;
   using StackExchange.Redis
   ```

1. Using the default Azure credentials to authenticate the client connection. This enables your code to use the signed-in user credential when running locally, and an Azure managed identity when running in Azure without code change.

    ```csharp
    var configurationOptions = await ConfigurationOptions.Parse($"{_redisHostName}").ConfigureForAzureWithTokenCredentialAsync(new DefaultAzureCredential());
    ConnectionMultiplexer _newConnection = await ConnectionMultiplexer.ConnectAsync(configurationOptions);
    IDatabase Database = _newConnection.GetDatabase();
    ```

::: zone pivot="azure-managed-redis"

### To edit the _appsettings.json_ file

1. Edit the _appsettings.json_ file. Then add the following content:

    ```json
    "_redisHostName":"<cache-hostname>"
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview blade of Azure Portal.

   For example, with Azure Managed Redis or the Enterprise tiers: _my-redis.eastus.azure.net:10000_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

::: zone-end

::: zone pivot="azure-cache-redis"

### To edit the _appsettings.json_ file

1. Edit the _appsettings.json_ file. Then add the following content:

    ```json
    "_redisHostName":"<cache-hostname>"
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview blade of Azure Portal.

   For example, with Azure Cache for Redis: _my-redis.eastus.azure.net:6380_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

::: zone-end

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

   :::image type="content" source="./media/cache-web-app-aspnet-core-howto/cache-simple-test-complete-local.png" alt-text="Screenshot of simple test completed locally.":::

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
