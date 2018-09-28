---
title: Cache ASP.NET Output Cache Provider
description: Learn how to cache ASP.NET Page Output using Azure Redis Cache
services: redis-cache
documentationcenter: na
author: wesmc7777
manager: cfowler
editor: tysonn

ms.assetid: 78469a66-0829-484f-8660-b2598ec60fbf
ms.service: cache
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: cache-redis
ms.workload: tbd
ms.date: 02/14/2017
ms.author: wesmc

---
# ASP.NET Output Cache Provider for Azure Redis Cache
The Redis Output Cache Provider is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP responses (page output caching). The provider plugs into the new output cache provider extensibility point that was introduced in ASP.NET 4.

To use the Redis Output Cache Provider, first configure your cache, and then configure your ASP.NET application using the Redis Output Cache Provider NuGet package. This topic provides guidance on configuring your application to use the Redis Output Cache Provider. For more information about creating and configuring an Azure Redis Cache instance, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

## Store ASP.NET page output in the cache
To configure a client application in Visual Studio using the Redis Cache Session State NuGet package, click **NuGet Package Manager**, **Package Manager Console** from the **Tools** menu.

Run the following command from the `Package Manager Console` window.
    
```
Install-Package Microsoft.Web.RedisOutputCacheProvider
```

The Redis Output Cache Provider NuGet package has a dependency on the StackExchange.Redis.StrongName package. If the StackExchange.Redis.StrongName package is not present in your project, it is installed. For more information about the Redis Output Cache Provider NuGet package, see the [RedisOutputCacheProvider](https://www.nuget.org/packages/Microsoft.Web.RedisOutputCacheProvider/) NuGet page.

>[!NOTE]
>In addition to the strong-named StackExchange.Redis.StrongName package, there is also the StackExchange.Redis non-strong-named version. If your project is using the non-strong-named StackExchange.Redis version you must uninstall it, otherwise you get naming conflicts in your project. For more information about these packages, see [Configure .NET cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-clients).
>
>

The NuGet package downloads and adds the required assembly references and adds the following section into your web.config file. This section contains the required configuration for your ASP.NET application to use the Redis Output Cache Provider.

```xml
<caching>
  <outputCache defaultProvider="MyRedisOutputCache">
    <providers>
      <!-- For more details check https://github.com/Azure/aspnet-redis-providers/wiki -->
      <!-- Either use 'connectionString' OR 'settingsClassName' and 'settingsMethodName' OR use 'host','port','accessKey','ssl','connectionTimeoutInMilliseconds' and 'operationTimeoutInMilliseconds'. -->
      <!-- 'databaseId' and 'applicationName' can be used with both options. -->
      <!--
      <add name="MyRedisOutputCache" 
        host = "127.0.0.1" [String]
        port = "" [number]
        accessKey = "" [String]
        ssl = "false" [true|false]
        databaseId = "0" [number]
        applicationName = "" [String]
        connectionTimeoutInMilliseconds = "5000" [number]
        operationTimeoutInMilliseconds = "1000" [number]
        connectionString = "<Valid StackExchange.Redis connection string>" [String]
        settingsClassName = "<Assembly qualified class name that contains settings method specified below. Which basically return 'connectionString' value>" [String]
        settingsMethodName = "<Settings method should be defined in settingsClass. It should be public, static, does not take any parameters and should have a return type of 'String', which is basically 'connectionString' value.>" [String]
        loggingClassName = "<Assembly qualified class name that contains logging method specified below>" [String]
        loggingMethodName = "<Logging method should be defined in loggingClass. It should be public, static, does not take any parameters and should have a return type of System.IO.TextWriter.>" [String]
        redisSerializerType = "<Assembly qualified class name that implements Microsoft.Web.Redis.ISerializer>" [String]
      />
      -->
      <add name="MyRedisOutputCache" type="Microsoft.Web.Redis.RedisOutputCacheProvider"
           host=""
           accessKey=""
           ssl="true" />
    </providers>
  </outputCache>
</caching>
```

The commented section provides an example of the attributes and sample settings for each attribute.

Configure the attributes with the values from your cache blade in the Microsoft Azure portal, and configure the other values as desired. For instructions on accessing your cache properties, see [Configure Redis cache settings](cache-configure.md#configure-redis-cache-settings).

* **host** – specify your cache endpoint.
* **port** – use either your non-SSL port or your SSL port, depending on the ssl settings.
* **accessKey** – use either the primary or secondary key for your cache.
* **ssl** – true if you want to secure cache/client communications with ssl; otherwise false. Be sure to specify the correct port.
  * The non-SSL port is disabled by default for new caches. Specify true for this setting to use the SSL port. For more information about enabling the non-SSL port, see the [Access Ports](cache-configure.md#access-ports) section in the [Configure a cache](cache-configure.md) topic.
* **databaseId** – Specified which database to use for cache output data. If not specified, the default value of 0 is used.
* **applicationName** – Keys are stored in redis as `<AppName>_<SessionId>_Data`. This naming scheme enables multiple applications to share the same key. This parameter is optional and if you do not provide it a default value is used.
* **connectionTimeoutInMilliseconds** – This setting allows you to override the connectTimeout setting in the StackExchange.Redis client. If not specified, the default connectTimeout setting of 5000 is used. For more information, see [StackExchange.Redis configuration model](http://go.microsoft.com/fwlink/?LinkId=398705).
* **operationTimeoutInMilliseconds** – This setting allows you to override the syncTimeout setting in the StackExchange.Redis client. If not specified, the default syncTimeout setting of 1000 is used. For more information, see [StackExchange.Redis configuration model](http://go.microsoft.com/fwlink/?LinkId=398705).

Add an OutputCache directive to each page for which you wish to cache the output.

```
<%@ OutputCache Duration="60" VaryByParam="*" %>
```

In the previous example, the cached page data remains in the cache for 60 seconds, and a different version of the page is cached for each parameter combination. For more information about the OutputCache directive, see [@OutputCache](http://go.microsoft.com/fwlink/?linkid=320837).

Once these steps are performed, your application is configured to use the Redis Output Cache Provider.

## Next steps
Check out the [ASP.NET Session State Provider for Azure Redis Cache](cache-aspnet-session-state-provider.md).

