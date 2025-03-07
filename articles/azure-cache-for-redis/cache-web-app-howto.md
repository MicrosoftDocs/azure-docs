---
title: Create an ASP.NET web app with an Azure Redis cache
description: In this quickstart, you learn how to create an ASP.NET web app with an Azure Redis cache

ms.topic: quickstart
ms.date: 12/12/2024
ms.custom: devx-track-csharp, mvc, mode-other, ignite-2024
zone_pivot_groups: redis-type
#Customer intent: As an ASP.NET developer, new to Azure Redis, I want to create a new Node.js app that uses Azure Managed Redis or Azure Cache for Redis.
---

# Quickstart: Use Azure Redis with an ASP.NET web app

In this quickstart, you use Visual Studio 2019 to create an ASP.NET web application that connects to Azure Cache for Redis to store and retrieve data from the cache. You then deploy the app to Azure App Service.

## Skip to the code on GitHub

Clone the repo [https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** and **Azure development** workloads.
- [.NET Framework 4 or higher](https://dotnet.microsoft.com/download/dotnet-framework) is required by the StackExchange.Redis client.

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

### Install the library for using Microsoft Entra ID Authentication

The [Azure.StackExchange.Redis](https://www.nuget.org/packages/Microsoft.Azure.StackExchangeRedis) library contains the Microsoft using Microsoft Entra ID authentication method for connecting to Azure Redis services using Microsoft Entra ID. It's applicable to all Azure Cache for Redis, Azure Cache for Redis Enterprise, and Azure Managed Redis (Preview).

1. Open your project in Visual Studio

1. Right click on the project, choose **Manage NuGet Packages...**

1. Search for `Microsoft.Azure.StackExchangeRedis`

1. Click **Install** button to install

1. Accept all prompted content to finish installation

### Connect to the cache using Microsoft Entra ID

1. Include the libraries in your code

   ```
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

### To edit the *web.config* file

1. Edit the *Web.config* file by adding the following content:

    ```xml
    <appSettings>
        <add key="RedisHostName" value="<cache-hostname-with-portnumber>"/>
    </appSettings>
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview on the Resource menu in Azure portal. 

   For example, with Azure Managed Redis or the Enterprise tiers: _my-redis.eastus.azure.net:10000_

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

::: zone-end

::: zone pivot="azure-cache-redis"

### To edit the *web.config* file

1. Edit the *Web.config* file by adding the following content:

    ```xml
    <appSettings>
        <add key="RedisHostName" value="<cache-hostname-with-portnumber>"/>
    </appSettings>
    ```

1. Replace `<cache-hostname>` with your cache host name as it appears in the Overview on the Resource menu in Azure portal.

   For example with Azure Cache for Redis, *my-redis.eastus.azure.net:6380*

1. Save the file.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

::: zone-end

## Run the app locally

By default, the project is configured to host the app locally in [IIS Express](/iis/extensions/introduction-to-iis-express/iis-express-overview) for testing and debugging.

### To run the app locally

1. In Visual Studio, select **Debug** > **Start Debugging** to build and start the app locally for testing and debugging.

1. In the browser, select **Azure Cache for Redis Test** on the navigation bar.

1. In the following example, the `Message` key previously had a cached value, which was set by using the Azure Cache for Redis console in the portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

   :::image type="content" source="media/cache-web-app-howto/cache-simple-test-complete-local.png" alt-text="Screenshot of simple test completed locally.":::

## Publish and run in Azure

After you successfully test the app locally, you can deploy the app to Azure and run it in the cloud.

### To publish the app to Azure

1. In Visual Studio, right-click the project node in Solution Explorer. Then select **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-app.png" alt-text="Screenshot showing publish button.":::

1. Select **Microsoft Azure App Service**, select **Create New**, and then select **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-to-app-service.png" alt-text="Screenshot showing how to publish to App Service.":::

1. In the **Create App Service** dialog box, make the following changes:

    | Setting | Recommended value | Description |
    | ------- | :---------------: | ----------- |
    | **App name** | Use the default. | The app name is the host name for the app when deployed to Azure. The name might have a timestamp suffix added to it to make it unique if necessary. |
    | **Subscription** | Choose your Azure subscription. | This subscription is charged for any related hosting costs. If you have multiple Azure subscriptions, verify that the subscription that you want is selected.|
    | **Resource group** | Use the same resource group where you created the cache (for example, *TestResourceGroup*). | The resource group helps you manage all resources as a group. Later, when you want to delete the app, you can just delete the group. |
    | **App Service plan** | Select **New**, and then create a new App Service plan named *TestingPlan*. <br />Use the same **Location** you used when creating your cache. <br />Choose **Free** for the size. | An App Service plan defines a set of compute resources for a web app to run with. |

    :::image type="content" source="media/cache-web-app-howto/cache-create-app-service-dialog.png" alt-text="Screenshot showing the App Service dialog box.":::

1. After you configure the App Service hosting settings, select **Create**.

1. Monitor the **Output** window in Visual Studio to see the publishing status. After the app is published, the URL for the app is logged:

   :::image type="content" source="media/cache-web-app-howto/cache-publishing-output.png" alt-text="Screenshot publishing information in the output pane.":::

### Add the app setting for the cache

After the new app is published, add a new app setting. This setting is used to store the cache connection information.

#### To add the app setting

1. To find the new app you created, type the app name in the search bar at the top of the Azure portal.

   :::image type="content" source="media/cache-web-app-howto/cache-find-app-service.png" alt-text="Screenshot showing how to find the app on the Azure portal.":::

2. Add a new app setting named **CacheConnection** for the app to use to connect to the cache. Use the same value you configured for `RedisHostName` in your *web.config* file.

### Run the app in Azure

1. In your browser, go to the URL for the app. The URL appears in the results of the publishing operation in the Visual Studio output window. The URL is also provided in the Azure portal on the overview page of the app you created.

1. Select **Azure Cache for Redis Test** on the navigation bar to test cache access as you did with the local version.

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
