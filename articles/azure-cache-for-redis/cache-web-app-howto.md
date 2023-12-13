---
title: Create an ASP.NET web app with Azure Cache for Redis
description: In this quickstart, you learn how to create an ASP.NET web app with Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: quickstart
ms.date: 03/25/2022
ms.author: franlanglois
ms.custom: devx-track-csharp, mvc, mode-other

---

# Quickstart: Use Azure Cache for Redis with an ASP.NET web app

In this quickstart, you use Visual Studio 2019 to create an ASP.NET web application that connects to Azure Cache for Redis to store and retrieve data from the cache. You then deploy the app to Azure App Service.

## Skip to the code on GitHub

Clone the repo [https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** and **Azure development** workloads.

## Create a cache

Next, you create the cache for the app.

[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

### To edit the *CacheSecrets.config* file

1. Create a file on your computer named *CacheSecrets.config*. Put it in a location where it won't be checked in with the source code of your sample application. For this quickstart, the *CacheSecrets.config* file is located at *C:\AppSecrets\CacheSecrets.config*.

1. Edit the *CacheSecrets.config* file. Then add the following content:

    ```xml
    <appSettings>
        <add key="CacheConnection" value="<cache-name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<access-key>"/>
    </appSettings>
    ```

1. Replace `<cache-name>` with your cache host name.

1. Replace `<access-key>` with the primary key for your cache.

    > [!TIP]
    > You can use the secondary access key during key rotation as an alternate key while you regenerate the primary access key.
   >
1. Save the file.

## Update the MVC application

In this section, you can see an MVC application that presents a view that displays a simple test against Azure Cache for Redis.

### How the web.config file connects to the cache

When you run the application locally, the information in *CacheSecrets.config* is used to connect to your Azure Cache for Redis instance. Later, you can deploy this application to Azure. At that time, you configure an app setting in Azure that the application uses to retrieve the cache connection information instead of this file.

Because the file *CacheSecrets.config* isn't deployed to Azure with your application, you only use it while testing the application locally. Keep this information as secure as possible to prevent malicious access to your cache data.

#### To update the *web.config* file

1. In **Solution Explorer**, open the *web.config* file.

     :::image type="content" source="media/cache-web-app-howto/cache-web-config.png" alt-text="Web.config":::

1. In the *web.config* file, you can set the `<appSettings>` element for running the application locally.

    `<appSettings file="C:\AppSecrets\CacheSecrets.config">`

The ASP.NET runtime merges the contents of the external file with the markup in the `<appSettings>` element. The runtime ignores the file attribute if the specified file can't be found. Your secrets (the connection string to your cache) aren't included as part of the source code for the application. When you deploy your web app to Azure, the *CacheSecrets.config* file isn't deployed.

## Install StackExchange.Redis

Your solution needs the `StackExchange.Redis` package to run. Install it, with this procedure:

1. To configure the app to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) NuGet package for Visual Studio, select **Tools > NuGet Package Manager > Package Manager Console**.

1. Run the following command from the `Package Manager Console` window:

    ```powershell
    Install-Package StackExchange.Redis
    ```

1. The NuGet package downloads and adds the required assembly references for your client application to access Azure Cache for Redis with the `StackExchange.Redis` client.

<!--

Philo - Isn't this superfluous now? 

1. If you prefer to use a strong-named version of the `StackExchange.Redis` client library, install the `StackExchange.Redis` package.
 -->

## Connect to the cache with RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is first made in this statement from `ContosoTeamStats/Controllers/HomeController.cs`:

```csharp
   private static Task<RedisConnection> _redisConnectionFactory = RedisConnection.InitializeAsync(connectionString: ConfigurationManager.AppSettings["CacheConnection"].ToString()););

```

The value of the *CacheConnection* secret is accessed using the Secret Manager configuration provider and is used as the password parameter.

In `RedisConnection.cs`, you see the `StackExchange.Redis` namespace has been added to the code. This is needed for the `RedisConnection` class.

```csharp
using StackExchange.Redis;
```

The `RedisConnection` code ensures that there is always a healthy connection to the cache by managing the `ConnectionMultiplexer` instance from `StackExchange.Redis`. The `RedisConnection` class recreates the connection when a connection is lost and unable to reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/aspnet/ContosoTeamStats/RedisConnection.cs "::: -->

## Layout views in the sample

The home page layout for this sample is stored in the *_Layout.cshtml* file. From this page, you start the actual cache testing by clicking the **Azure Cache for Redis Test** from this page.

1. In **Solution Explorer**, expand the **Views** > **Shared** folder. Then open the *_Layout.cshtml* file.

1. You see the following line in `<div class="navbar-header">`.

    ```csharp
    @Html.ActionLink("Azure Cache for Redis Test", "RedisCache", "Home", new { area = "" }, new { @class = "navbar-brand" })
    ```

    :::image type="content" source="media/cache-web-app-howto/cache-welcome-page.png" alt-text="screenshot of welcome page":::

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

By default, the project is configured to host the app locally in [IIS Express](/iis/extensions/introduction-to-iis-express/iis-express-overview) for testing and debugging.

### To run the app locally

1. In Visual Studio, select **Debug** > **Start Debugging** to build and start the app locally for testing and debugging.

1. In the browser, select **Azure Cache for Redis Test** on the navigation bar.

1. In the following example, the `Message` key previously had a cached value, which was set by using the Azure Cache for Redis console in the portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

   :::image type="content" source="media/cache-web-app-howto/cache-simple-test-complete-local.png" alt-text="Screenshot of simple test completed local":::

## Publish and run in Azure

After you successfully test the app locally, you can deploy the app to Azure and run it in the cloud.

### To publish the app to Azure

1. In Visual Studio, right-click the project node in Solution Explorer. Then select **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-app.png" alt-text="Publish":::

1. Select **Microsoft Azure App Service**, select **Create New**, and then select **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-to-app-service.png" alt-text="Publish to App Service":::

1. In the **Create App Service** dialog box, make the following changes:

    | Setting | Recommended value | Description |
    | ------- | :---------------: | ----------- |
    | **App name** | Use the default. | The app name is the host name for the app when it's deployed to Azure. The name might have a timestamp suffix added to it to make it unique if necessary. |
    | **Subscription** | Choose your Azure subscription. | This subscription is charged for any related hosting costs. If you have multiple Azure subscriptions, verify that the subscription that you want is selected.|
    | **Resource group** | Use the same resource group where you created the cache (for example, *TestResourceGroup*). | The resource group helps you manage all resources as a group. Later, when you want to delete the app, you can just delete the group. |
    | **App Service plan** | Select **New**, and then create a new App Service plan named *TestingPlan*. <br />Use the same **Location** you used when creating your cache. <br />Choose **Free** for the size. | An App Service plan defines a set of compute resources for a web app to run with. |

    :::image type="content" source="media/cache-web-app-howto/cache-create-app-service-dialog.png" alt-text="App Service dialog box":::

1. After you configure the App Service hosting settings, select **Create**.

1. Monitor the **Output** window in Visual Studio to see the publishing status. After the app has been published, the URL for the app is logged:

   :::image type="content" source="media/cache-web-app-howto/cache-publishing-output.png" alt-text="Publishing output":::

### Add the app setting for the cache

After the new app has been published, add a new app setting. This setting is used to store the cache connection information.

#### To add the app setting

1. Type the app name in the search bar at the top of the Azure portal to find the new app you created.

   :::image type="content" source="media/cache-web-app-howto/cache-find-app-service.png" alt-text="Find app":::

2. Add a new app setting named **CacheConnection** for the app to use to connect to the cache. Use the same value you configured for `CacheConnection` in your *CacheSecrets.config* file. The value contains the cache host name and access key.

   :::image type="content" source="media/cache-web-app-howto/cache-add-app-setting.png" alt-text="Add app setting":::

### Run the app in Azure

1. In your browser, go to the URL for the app. The URL appears in the results of the publishing operation in the Visual Studio output window. It's also provided in the Azure portal on the overview page of the app you created.

1. Select **Azure Cache for Redis Test** on the navigation bar to test cache access as you did with the local version.

## Clean up resources

If you continue to use this quickstart, you can keep the resources you created and reuse them.

Otherwise, if you're finished with the quickstart sample application, you can delete the Azure resources that you created in this quickstart to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible. When you delete a resource group, all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually on the left instead of deleting the resource group.

### To delete a resource group

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource groups**.

1. In the **Filter by name...** box, type the name of your resource group. The instructions for this article used a resource group named *TestResources*. On your resource group, in the results list, select **...**, and then select **Delete resource group**.

    :::image type="content" source="media/cache-dotnet-core-quickstart/cache-delete-resource-group.png" alt-text="Delete":::

1. You're asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and then select **Delete**.

After a few moments, the resource group and all of its resources are deleted.

## Next steps

- [Connection resilience](cache-best-practices-connection.md)
- [Best Practices Development](cache-best-practices-development.md)
