---
title: 'Quickstart: Use an Azure Redis cache in .NET Framework'
description: In this quickstart, learn how to access an Azure Redis cache from your .NET apps

ms.devlang: csharp
ms.topic: quickstart
ms.custom: devx-track-csharp, mvc, mode-other, devx-track-dotnet, ignite-2024
ms.date: 12/20/2024
zone_pivot_groups: redis-type
#Customer intent: As a .NET developer, new to Azure Redis, I want to create a new Node.js app that uses Azure Managed Redis or Azure Cache for Redis.
---

# Quickstart: Use an Azure Redis caches in .NET Framework

In this quickstart, you incorporate Azure Cache for Redis into a .NET Framework app to have access to a secure, dedicated cache that is accessible from any application within Azure. You specifically use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) client with C# code in a .NET console app.

## Skip to the code on GitHub

Clone the repo from [Azure-Samples/azure-cache-redis-samples](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/dotnet) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/)
- [.NET Framework 4 or higher](https://dotnet.microsoft.com/download/dotnet-framework) is required by the StackExchange.Redis client.

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

1. Open your project in Visual Studio

1. Right click on the project, choose **Manage NuGet Packages...**

1. Search for `Microsoft.Azure.StackExchangeRedis`

1. Click **Install** button to install

1. Accept all prompted content to finish installation

----

### Connect to the cache using Microsoft Entra ID

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

::: zone-end

### To edit the _app.config_ file

1. Edit the _app.config_ file by adding the following content:

    ```xml
    <appSettings>
        <add key="RedisHostName" value="<cache-hostname-with-portnumber>"/>
    </appSettings>
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview from the Resource menu in Azure portal.

   For example, with Azure Managed Redis or the Enterprise tiers: _my-redis.eastus.azure.net:10000_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

::: zone pivot="azure-cache-redis"

::: zone-end

### To edit the _app.config_ file

1. Edit the _app.config_ file by adding the following content:

    ```xml
    <appSettings>
        <add key="RedisHostName" value="<cache-hostname-with-portnumber>"/>
    </appSettings>
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview from the Resource menu in Azure portal.

   For example, with Azure Cache for Redis: _my-redis.eastus.azure.net:6380_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

## Run the sample

Press **Ctrl+F5** to build and run the console app to test serialization of .NET objects.

:::image type="content" source="media/cache-dotnet-core-quickstart/cache-console-app-complete.png" alt-text="Console app completed":::

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
