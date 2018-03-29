---
title: Create an ASP.NET Web App with Redis Cache | Microsoft Docs
description: In this quickstart, you learn how to create an ASP.NET Web App with Redis Cache
services: redis-cache
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 454e23d7-a99b-4e6e-8dd7-156451d2da7c
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache-redis
ms.devlang: na
ms.topic: quickstart
ms.date: 03/26/2018
ms.author: wesmc
ms.custom: mvc

#Customer intent: As an ASP.NET developer, new to Azure Redis Cache, I want to create a new ASP.NET Web app that uses Redis Cache.

---
# Quickstart: Create a ASP.NET Web App with Redis Cache
> [!div class="op_single_selector"]
> * [.NET](cache-dotnet-how-to-use-azure-redis-cache.md)
> * [ASP.NET](cache-web-app-howto.md)
> * [Node.js](cache-nodejs-get-started.md)
> * [Java](cache-java-get-started.md)
> * [Python](cache-python-get-started.md)
> 
> 

## Overview

This quickstart shows how to create and deploy an ASP.NET web application to Azure App Service using Visual Studio 2017. The sample application connects to an Azure Redis Cache to store and retrieve data from the cache. When you complete the quickstart you have a running web app, hosted in Azure, that reads and writes to an Azure Redis Cache.

![Simple test completed Azure](./media/cache-web-app-howto/cache-simple-test-complete-azure.png)


## Prerequisites
To complete the quickstart, you must have the following prerequisites:

* [Visual Studio 2017 with the Azure SDK for .NET](https://www.visualstudio.com/downloads/)
* You need an Azure account to complete the quickstart. You can [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.


## Create the Visual Studio project

Open Visual Studio and click **File**, **New**, **Project**.

Expand the **Visual C#** node in the **Templates** list, select **Cloud**, and click **ASP.NET Web Application**. Ensure that **.NET Framework 4.5.2** or higher is selected.  Type **ContosoTeamStats** into the **Name** textbox and click **OK**.
   
![Create project](./media/cache-web-app-howto/cache-create-project.png)

Select **MVC** as the project type. 

Ensure that **No Authentication** is specified for the **Authentication** settings. Depending on your version of Visual Studio, the default may be set to something else. To change it, click **Change Authentication** and select **No Authentication**.

![Select project template](./media/cache-web-app-howto/cache-select-template.png)

Click **OK** to create the project.


## Create a cache

Next, you create the cache for the app.

[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-access-keys](../../includes/redis-cache-access-keys.md)]

Create a file on your computer named *CacheSecrets.config* and place it in a location where it won't be checked in with the source code of your sample application. For this quickstart, the *CacheSecrets.config* file is located here, *C:\AppSecrets\CacheSecrets.config*.
   
Edit the *CacheSecrets.config* file and add the following contents:

```xml
<appSettings>
    <add key="CacheConnection" value="YourCacheName.redis.cache.windows.net,abortConnect=false,ssl=true,password=YourAccessKey"/>
</appSettings>
```

Replace **YourCacheName** with your cache host name.

Replace **YourAccessKey** with the key (primary or secondary) for your cache.

Save the file.


## Update the MVC application

In this section, you update the application to support a new view that will display a simple test against an Azure Redis Cache.

* [Update the web.config file with an app setting for the cache](#Update-the-webconfig-file-with-an-app-setting-for-the-cache)
* [Configure the application to use the StackExchange.Redis client](#configure-the-application-to-use-stackexchangeredis)
* [Update the HomeController and Layout](#update-the-homecontroller-and-layout)
* [Add a new RedisCache view](#add-a-new-rediscache-view)


### Update the web.config file with an app setting for the cache

When you run the application locally, the information in *CacheSecrets.config* is used to connect to your Azure Redis Cache instance. Later you'll deploy this application to Azure. At that time, you will configure an app setting in Azure that the application will use to retrieve the cache connection information instead of this file. Since *CacheSecrets.config* is not deployed to Azure with your application, you only use it while testing the application locally. You want to keep this information as secure as possible to prevent malicous access to your cache data.

In **Solution Explorer**, double-click the *web.config* file to open it.
   
![Web.config](./media/cache-web-app-howto/cache-web-config.png)

In the *web.config* file, find the `<appSetting>` element, and add the following `file` attribute. If you used a different file name or location, substitute those values for the ones shown in the example.
   
   * Before: `<appSettings>`
   * After: ` <appSettings file="C:\AppSecrets\CacheSecrets.config">`
  
The ASP.NET runtime merges the contents of the external file with the markup in the `<appSettings>` element. The runtime ignores the file attribute if the specified file cannot be found. Your secrets (the connection string to your cache) are not included as part of the source code for the application. When you deploy your web app to Azure, the *CacheSecrests.config* file won't be deployed. 


### Configure the application to use StackExchange.Redis

To configure the app to use the [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) NuGet package for Visual Studio, click **Tools > NuGet Package Manager > Package Manager Console**.

Run the following command from the `Package Manager Console` window:
    
```
Install-Package StackExchange.Redis
```

The NuGet package downloads and adds the required assembly references for your client application to access Azure Redis Cache with the StackExchange.Redis cache client. If you prefer to use a strong-named version of the `StackExchange.Redis` client library, install the `StackExchange.Redis.StrongName` package.


### Update the HomeController and Layout

In **Solution Explorer**, expand the **Controllers** folder, and open the *HomeController.cs* file.

Add the following method to the `HomeController` class to support a new `RedisCache` action.

```csharp
public ActionResult RedisCache()
{
    ViewBag.Message = "A simple example with Azure Redis Cache on ASP.NET.";

    return View();
}
```

In **Solution Explorer**, expand **Views**>**Shared** folder, and open the *_Layout.cshtml* file.   

Replace :
```
@Html.ActionLink("Application name", "Index", "Home", new { area = "" }, new { @class = "navbar-brand" })
```

With:
```
@Html.ActionLink("Azure Redis Cache Test", "RedisCache", "Home", new { area = "" }, new { @class = "navbar-brand" })
```



### Add a new RedisCache view

In **Solution Explorer**, expand the **Views** folder and then right-click the **Home** folder, and choose **Add** > **View...**. 

In the Add View dialog, enter **RedisCache** for the View Name and click **Add**.
   
Replace the code in the *RedisCache.cshtml* file with the following code:

```
@using System.Configuration;
@using StackExchange.Redis;

@{
    ViewBag.Title = "Azure Redis Cache Test";

    var lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
    {
        string cacheConnection = ConfigurationManager.AppSettings["CacheConnection"].ToString();
        return ConnectionMultiplexer.Connect(cacheConnection);
    });

    // Connection refers to a property that returns a ConnectionMultiplexer
    // as shown in the previous example.
    IDatabase cache = lazyConnection.Value.GetDatabase();

    // Perform cache operations using the cache object...
    // Simple put of integral data types into the cache

    string pingResult = cache.Execute("PING").ToString();

    string key1 = cache.StringGet("Message").ToString();
    string setResult = cache.StringSet("Message", "Hello! The cache is working from ASP.NET!").ToString();
    string key2 = cache.StringGet("Message");

    string clientListResult = cache.Execute("CLIENT", "LIST").ToString().Replace(" id=", "\rid=");

    lazyConnection.Value.Dispose();

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
        <td>PING</td>
        <td><pre>@pingResult</pre></td>
    </tr>
    <tr>
        <td>GET Message</td>
        <td><pre>@key1</pre></td>
    </tr>
    <tr>
        <td>SET Message "Hello! The cache is working from ASP.NET!"</td>
        <td>@setResult</td>
    </tr>
    <tr>
        <td>GET Message</td>
        <td><pre>@key2</pre></td>
    </tr>
    <tr>
        <td>CLIENT LIST</td>
        <td><pre>@clientListResult</pre></td>
    </tr>
</table>
```


## Run the app locally

By default the project is configured to host the app locally in [IIS Express](https://docs.microsoft.com/iis/extensions/introduction-to-iis-express/iis-express-overview) for testing and debugging.

In Visual Studio on the menu, click **Debug** > **Start Debugging** to build and start the app locally for testing and debugging.

In the browser, click **Azure Redis Cache Test** on the navigation bar.

In the example below, you can see the `Message` key previous had a cached value which was set using the Redis Console in the portal. The app updated that cached value. The app also executed the `PING` and `CLIENT LIST` commands.

![Simple test completed local](./media/cache-web-app-howto/cache-simple-test-complete.png)



## Publish and run in Azure

Once you have successfully tested the app locally, you will deploy the app to Azure and run it in the cloud.


### Publish the app to Azure

In Visual Studio, right-click the project node in Solution Explorer, and choose **Publish**.
   
![Publish](./media/cache-web-app-howto/cache-publish-app.png)

Click **Microsoft Azure App Service**, choose **Create New**, and click **Publish**.
   
![Publish to app service](./media/cache-web-app-howto/cache-publish-to-app-service.png)

In the **Create App Service** dialog, make the following changes:

| Setting | Recommended Value | Description |
| ------- | :---------------: | ----------- |
| App Name | Use default | The app name will be the host name for the app when deployed to Azure. The name may have a timestamp suffix added to it if necessary to make it unique. |
| Subscription | Choose your Azure subscription | This subscription will be charged for any related hosting charges. If you have multiple Azure subscriptions, Verify the desired subscription is selected.|
| Resource Group | Use the same resource group where you created the cache. For example, *TestResourceGroup*. | The resource group helps you want to manage all resources as a group. Later when you want to delete the app, you can just delete the group. |
| App Service Plan | Click **New** and create a new App Service Plan named *TestingPlan*. <br />Use the same **Location** you used when creating your cache. <br />Choose **Free** for the size. | An App Service plan defines a set of compute resources for a web app to run with. |

![App Service Dialog](./media/cache-web-app-howto/cache-create-app-service-dialog.png)

Once you have the App Service hosting settings configured, click **Create** to create a new App Service for your app.

Monitor the **Output** window in Visual Studio to see the status of the publish to Azure. When publishing has successfully completed, the URL for the App Service is logged as shown below:

![Publishing Output](./media/cache-web-app-howto/cache-publishing-output.png)

### Add the app setting for the cache

Once publishing has completed, add a new app setting to the App Service. This setting will be used to store the cache connection information. Type the App Name in the search bar at the top of the Azure portal to find the new App Service you just created for the app.

![Find App Service](./media/cache-web-app-howto/cache-find-app-service.png)
   
Add a new app setting named **CacheConnection** for the app to use to connect to the cache. Use the same value you configured for `CacheConnection` in your *CacheSecrets.config* file. The value contains the host name and access key to the cache.

![Add App Setting](./media/cache-web-app-howto/cache-add-app-setting.png)

### Run the app in Azure. 

In your browser, browse to the URL for the App Service. The URL is shown in the results of the publishing operation in the Output window in Visual Studio. It is also provided in the Azure portal on the Overview page of the App Service you created.

Click **Azure Redis Cache Test** on the navigation bar to test cache access.

![Simple test completed Azure](./media/cache-web-app-howto/cache-simple-test-complete-azure.png)



## Clean up resources

If you will be continuing to the next tutorial, you can keep the resources created in this quickstart and reuse them.

Otherwise, if you are finished with the quickstart sample application, you can delete the Azure resources used in order to conserve cost and resources. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
> 
> 

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this topic used a resource group named *TestResources*. For your group, click **...** then **Delete resource group**.

   
![Delete](./media/cache-web-app-howto/cache-delete-resource-group.png)



You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.
   
After a few moments the resource group and all of its contained resources are deleted.



## Next steps

In this next tutorial, you will use Azure Redis Cache in a more real-world scenario to improve performance of an app. You will update this application to cache leaderboard results using the cache-aside pattern with ASP.NET and a database.

> [!div class="nextstepaction"]
> [Create a cache-aside leaderboard on ASP.NET](cache-web-app-cache-aside-leaderboard.md)