---
title: 'Quickstart: Use Azure Cache for Redis in .NET Core'
description: In this quickstart, learn how to access Azure Cache for Redis in your .NET Core apps

ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet, ignite-2024
ms.topic: quickstart
ms.date: 12/20/2024
zone_pivot_groups: redis-type
#Customer intent: As a .NET developer, new to Azure Redis, I want to create a new Node.js app that uses Azure Managed Redis or Azure Cache for Redis.
---

# Quickstart: Use Azure Redis in .NET Core

In this quickstart, you incorporate Azure Cache for Redis into a .NET Core app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET Core console app.

## Skip to the code on GitHub

Clone the repo [https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet-core) on GitHub.

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

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the Library for using Microsoft Entra ID Authentication

The [Azure.StackExchange.Redis](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) library contains the Microsoft Entra ID authentication method for connecting to Azure Redis services using Microsoft Entra ID. It's applicable to all Azure Cache for Redis, Azure Cache for Redis Enterprise, and Azure Managed Redis (Preview).

```cli
dotnet add package Microsoft.Azure.StackExchangeRedis
```

---

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

1. Edit the _Web.config_ file. Then add the following content:

    ```json
    "_redisHostName":"<cache-hostname>"
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview section of the Resource menu in the Azure portal.

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

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview section of the Resource menu in the Azure portal. 

   For example, with Azure Cache for Redis: _my-redis.eastus.azure.net:6380_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).
::: zone-end

## Run the sample

If you opened any files, save them, and build the app with the following command:

```dos
dotnet build
```

To test serialization of .NET objects, run the app with the following command:

```dos
dotnet run
```

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Screenshot sowing console app completed.":::

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
