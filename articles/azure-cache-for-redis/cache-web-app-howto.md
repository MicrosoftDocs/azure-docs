---
title: 'Quickstart: Use Azure Cache for Redis with ASP.NET'
description: Modify a sample ASP.NET web app and connect the app to Azure Cache for Redis.


ms.topic: quickstart
ms.date: 03/25/2022
ms.custom: devx-track-csharp, mvc, mode-other
#Customer intent: As an ASP.NET web app developer who is new to Azure Cache for Redis, I want to create a new ASP.NET web app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with an ASP.NET web app

In this quickstart, you use Visual Studio 2019 to modify an ASP.NET web application that connects to Azure Cache for Redis to store and get data from the cache. Then, you deploy the app to Azure App Service.

## Skip to the code

This article describes how to modify the code for a sample app to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the sample code, see the [ASP.NET quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/aspnet) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/dotnet)
- [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** and **Azure development** workloads.

## Create a cache

Next, create the cache to use with the app.

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

### Edit the CacheSecrets.config file

1. On your computer, create a file named *CacheSecrets.config*. Put the file in a location where it isn't checked in with the source code of your sample application. For this quickstart, the *CacheSecrets.config* file is in the *C:\AppSecrets\\* folder.

1. Edit the *CacheSecrets.config* file to add the following content.

   In the code:

   - Replace `<cache-name>` with your cache host name.
   - Replace `<access-key>` with the primary access key for your cache.

     > [!TIP]
     > You can use the secondary access key during key rotation as an alternate key while you regenerate the primary access key.
     >

    ```xml
    <appSettings>
        <add key="CacheConnection" value="<cache-name>.redis.cache.windows.net,abortConnect=false,ssl=true,allowAdmin=true,password=<access-key>"/>
    </appSettings>
    ```

1. Save the file.

## Update the MVC application

In this section, a model-view-controller (MVC) application displays a simple test for the connection to Azure Cache for Redis.

### How the web.config file connects to the cache

When you run the application locally, the information in *CacheSecrets.config* is used to connect to your Azure Cache for Redis instance. Later, you can deploy this application to Azure. At that time, you configure an app setting in Azure that the application uses to retrieve the cache connection information instead of using the config file.

Because the *CacheSecrets.config* file isn't deployed to Azure with your application, you use it only when you test  the application locally. Keep this information as secure as possible to help prevent malicious access to your cache data.

### Update the web.config file

1. In Solution Explorer, open the *web.config* file.

   :::image type="content" source="media/cache-web-app-howto/cache-web-config.png" alt-text="Screenshot that shows the web.config file in Visual Studio Solution Explorer.":::

1. In the *web.config* file, set the `<appSettings>` element to run the application locally:

   `<appSettings file="C:\AppSecrets\CacheSecrets.config">`

The ASP.NET runtime merges the contents of the external file with the markup in the `<appSettings>` element. The runtime ignores the file attribute if the specified file can't be found. Your secrets (the connection string to your cache) aren't included as part of the source code for the application. When you deploy your web app to Azure, the *CacheSecrets.config* file isn't deployed.

## Install StackExchange.Redis

Your solution requires the `StackExchange.Redis` package to run.

To install the `StackExchange.Redis` package:

1. To configure the app to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) NuGet package for Visual Studio, select **Tools** > **NuGet Package Manager** > **Package Manager Console**.

1. In the Package Manager Console window, run the following command:

    ```powershell
    Install-Package StackExchange.Redis
    ```

The NuGet package downloads and adds the required assembly references for your client application to access Azure Cache for Redis by using the `StackExchange.Redis` client.

## Connect to the cache by using RedisConnection

The connection to your cache is managed by the `RedisConnection` class. The connection is first made in this statement that's in *ContosoTeamStats/Controllers/HomeController.cs*:

```csharp
   private static Task<RedisConnection> _redisConnectionFactory = RedisConnection.InitializeAsync(connectionString: ConfigurationManager.AppSettings["CacheConnection"].ToString()););

```

The value of the `CacheConnection` secret is accessed by using the Secret Manager configuration provider and is used as the password parameter.

In *RedisConnection.cs*, you can see that the StackExchange.Redis namespace is added to the code. The `RedisConnection` class requires the namespace.

```csharp
using StackExchange.Redis;
```

The `RedisConnection` code ensures that there's always a healthy connection to the cache. The connection is managed via the `ConnectionMultiplexer` instance in StackExchange.Redis. The `RedisConnection` class re-creates the connection when a connection is lost and unable to reconnect automatically.

For more information, see [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) and the code in a [GitHub repo](https://github.com/StackExchange/StackExchange.Redis).

<!-- :::code language="csharp" source="~/samples-cache/quickstart/aspnet/ContosoTeamStats/RedisConnection.cs "::: -->

## Verify layout views in the sample

The home page layout for this sample is stored in the *_Layout.cshtml* file. From this page, you start the actual cache testing by selecting **Azure Cache for Redis Test** on this page.

1. In Solution Explorer, select **Views**, and then right-click the **Shared** folder. Then, open the *_Layout.cshtml* file.

1. Verify that the following line is in `<div class="navbar-header">`:

    ```csharp
    @Html.ActionLink("Azure Cache for Redis Test", "RedisCache", "Home", new { area = "" }, new { @class = "navbar-brand" })
    ```

    :::image type="content" source="media/cache-web-app-howto/cache-welcome-page.png" alt-text="Screenshot that shows welcome and navigation options on a webpage.":::

### Show data from the cache

On the home page, select **Azure Cache for Redis Test** in the navigation bar to see the sample output.

1. In Solution Explorer, select **Views**, and then right-click the **Home** folder.

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

By default, the project is configured to host the app locally in [IIS Express](/iis/extensions/introduction-to-iis-express/iis-express-overview) for testing and debugging.

To run the app locally:

1. In Visual Studio, select **Debug** > **Start Debugging** to build and start the app locally for testing and debugging.

1. In the browser, select **Azure Cache for Redis Test** on the navigation bar.

1. In the following example, the `Message` key previously had a cached value, which was set by using the Azure Cache for Redis console in the portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

   :::image type="content" source="media/cache-web-app-howto/cache-simple-test-complete-local.png" alt-text="Screenshot that shows a simple test completed locally.":::

## Publish and run in Azure

After you successfully test the app locally, you can deploy the app to Azure and run it in the cloud.

To publish the app to Azure:

1. In Visual Studio, in Solution Explorer, right-click the project node and select **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-app.png" alt-text="Screenshot that shows the Publish menu command highlighted in Azure.":::

1. Select **Microsoft Azure App Service** > **Create New** > **Publish**.

   :::image type="content" source="media/cache-web-app-howto/cache-publish-to-app-service.png" alt-text="Screenshot that shows menu options to set to publish to App Service.":::

1. In the **Create App Service** dialog box, make the following changes:

    | Setting | Action | Description |
    | ------- | :---------------: | ----------- |
    | **App name** | Use the default. | The app name is the host name for the app when it's deployed to Azure. The name might have a timestamp suffix added to it to make the app name unique. |
    | **Subscription** | Select your Azure subscription. | This subscription is charged for any related hosting costs. If you have multiple Azure subscriptions, verify that the subscription that you want to use is selected.|
    | **Resource group** | Use the same resource group that you used to create the cache (for example, **TestResourceGroup**). | The resource group helps you manage all resources as a group. Later, when you want to delete the app, you can delete the resource group to delete all related resources. |
    | **App Service plan** | Select **New**, and then create a new App Service plan named **TestingPlan**. <br />Use the same value for **Location** that you used when you created your cache. <br />For size, select **Free**. | An App Service plan defines a set of compute resources for a web app to run with. |

    :::image type="content" source="media/cache-web-app-howto/cache-create-app-service-dialog.png" alt-text="Screenshot that shows the App Service dialog box in Azure.":::

1. After you configure the App Service host settings, select **Create**.

1. In the Output window, check the publishing status. After the app is published, the URL for the app appears as output:

   :::image type="content" source="media/cache-web-app-howto/cache-publishing-output.png" alt-text="Screenshot that shows the publishing output window in Visual Studio.":::

### Add an app setting for the cache

After the new app is published, add a new app setting in the Azure portal. This setting stores the cache connection information.

To add the app setting:

1. In the Azure portal, enter the name of the app in the search bar.

   :::image type="content" source="media/cache-web-app-howto/cache-find-app-service.png" alt-text="Screenshot that shows searching for an app in the Azure portal.":::

1. Add a new app setting named **CacheConnection** for the app to use to connect to the cache. Use the same value that you used for `CacheConnection` in the *CacheSecrets.config* file. The value contains the cache host name and access key.

   :::image type="content" source="media/cache-web-app-howto/cache-add-app-setting.png" alt-text="Screenshot that shows adding an app setting.":::

### Run the app in Azure

1. In your browser, go to the URL for the app. The URL appears in the results of the publishing operation in the Visual Studio Output window. It also appears in the Azure portal on the Overview pane of your app.

1. On the webpage navigation bar, select **Azure Cache for Redis Test** to test cache access like you did with the local version.

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Connection resilience best practices for your cache](cache-best-practices-connection.md)
- [Development best practices for your cache](cache-best-practices-development.md)
