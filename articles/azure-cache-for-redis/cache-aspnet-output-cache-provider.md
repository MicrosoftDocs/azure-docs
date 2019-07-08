---
title: ASP.NET Output Cache Provider for Azure Cache for Redis
description: Learn how to cache ASP.NET Page Output using Azure Cache for Redis
services: cache
documentationcenter: na
author: yegu-ms
manager: jhubbard
editor: tysonn

ms.assetid: 78469a66-0829-484f-8660-b2598ec60fbf
ms.service: cache
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: cache
ms.workload: tbd
ms.date: 04/22/2018
ms.author: yegu

---
# ASP.NET Output Cache Provider for Azure Cache for Redis

The Redis Output Cache Provider is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP responses (page output caching). The provider plugs into the new output cache provider extensibility point that was introduced in ASP.NET 4.

To use the Redis Output Cache Provider, first configure your cache, and then configure your ASP.NET application using the Redis Output Cache Provider NuGet package. This topic provides guidance on configuring your application to use the Redis Output Cache Provider. For more information about creating and configuring an Azure Cache for Redis instance, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

## Store ASP.NET page output in the cache

To configure a client application in Visual Studio using the Azure Cache for Redis Session State NuGet package, click **NuGet Package Manager**, **Package Manager Console** from the **Tools** menu.

Run the following command from the `Package Manager Console` window.

```
Install-Package Microsoft.Web.RedisOutputCacheProvider
```

The Redis Output Cache Provider NuGet package has a dependency on the StackExchange.Redis.StrongName package. If the StackExchange.Redis.StrongName package is not present in your project, it is installed. For more information about the Redis Output Cache Provider NuGet package, see the [RedisOutputCacheProvider](https://www.nuget.org/packages/Microsoft.Web.RedisOutputCacheProvider/) NuGet page.

>[!NOTE]
>In addition to the strong-named StackExchange.Redis.StrongName package, there is also the StackExchange.Redis non-strong-named version. If your project is using the non-strong-named StackExchange.Redis version you must uninstall it; otherwise, you will experience naming conflicts in your project. For more information about these packages, see [Configure .NET cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-clients).

The NuGet package downloads and adds the required assembly references and adds the following section into your web.config file. This section contains the required configuration for your ASP.NET application to use the Redis Output Cache Provider.

```xml
<caching>
  <outputCache defaultProvider="MyRedisOutputCache">
    <providers>
      <add name="MyRedisOutputCache" type="Microsoft.Web.Redis.RedisOutputCacheProvider"
           host=""
           accessKey=""
           ssl="true" />
    </providers>
  </outputCache>
</caching>
```

Configure the attributes with the values from your cache blade in the Microsoft Azure portal, and configure the other values as desired. For instructions on accessing your cache properties, see [Configure Azure Cache for Redis settings](cache-configure.md#configure-azure-cache-for-redis-settings).

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| *host* | string | "localhost" | The Redis server IP address or host name |
| *port* | positive integer | 6379 (non-SSL)<br/>6380 (SSL) | Redis server port |
| *accessKey* | string | "" | Redis server password when Redis authorization is enabled. The value is empty string by default, which means the session state provider won’t use any password when connecting to Redis server. **If your Redis server is in a publicly accessible network like Azure Redis Cache, be sure to enable Redis authorization to improve security, and provide a secure password.** |
| *ssl* | boolean | **false** | Whether to connect to Redis server via SSL. This value is **false** by default because Redis doesn’t support SSL out of the box. **If you are using Azure Redis Cache which supports SSL out of the box, be sure to set this to true to improve security.**<br/><br/>The non-SSL port is disabled by default for new caches. Specify **true** for this setting to use the SSL port. For more information about enabling the non-SSL port, see the [Access Ports](cache-configure.md#access-ports) section in the [Configure a cache](cache-configure.md) topic. |
| *databaseIdNumber* | positive integer | 0 | *This attribute can be specified only through either web.config or AppSettings.*<br/><br/>Specify which Redis database to use. |
| *connectionTimeoutInMilliseconds* | positive integer | Provided by StackExchange.Redis | Used to set *ConnectTimeout* when creating StackExchange.Redis.ConnectionMultiplexer. |
| *operationTimeoutInMilliseconds* | positive integer | Provided by StackExchange.Redis | Used to set *SyncTimeout* when creating StackExchange.Redis.ConnectionMultiplexer. |
| *connectionString* (Valid StackExchange.Redis connection string) | string | *n/a* | Either a parameter reference to AppSettings or web.config, or else a valid StackExchange.Redis connection string. This attribute can provide values for *host*, *port*, *accessKey*, *ssl*, and other StackExchange.Redis attributes. For a closer look at *connectionString*, see [Setting connectionString](#setting-connectionstring) in the [Attribute notes](#attribute-notes) section. |
| *settingsClassName*<br/>*settingsMethodName* | string<br/>string | *n/a* | *These attributes can be specified only through either web.config or AppSettings.*<br/><br/>Use these attributes to provide a connection string. *settingsClassName* should be an assembly qualified class name that contains the method specified by *settingsMethodName*.<br/><br/>The method specified by *settingsMethodName* should be public, static, and void (not take any parameters), with a return type of **string**. This method returns the actual connection string. |
| *loggingClassName*<br/>*loggingMethodName* | string<br/>string | *n/a* | *These attributes can be specified only through either web.config or AppSettings.*<br/><br/>Use these attributes to debug your application by providing logs from Session State/Output Cache along with logs from StackExchange.Redis. *loggingClassName* should be an assembly qualified class name that contains the method specified by *loggingMethodName*.<br/><br/>The method specified by *loggingMethodName* should be public, static, and void (not take any parameters), with a return type of **System.IO.TextWriter**. |
| *applicationName* | string | The module name of the current process or "/" | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>The app name prefix to use in Redis cache. The customer may use the same Redis cache for different purposes. To insure that the session keys do not collide, it can be prefixed with the application name. |
| *throwOnError* | boolean | true | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>Whether to throw an exception when an error occurs.<br/><br/>For more about *throwOnError*, see [Notes on *throwOnError*](#notes-on-throwonerror) in the [Attribute notes](#attribute-notes) section. |>*Microsoft.Web.Redis.RedisSessionStateProvider.LastException*. |
| *retryTimeoutInMilliseconds* | positive integer | 5000 | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>How long to retry when an operation fails. If this value is less than *operationTimeoutInMilliseconds*, the provider will not retry.<br/><br/>For more about *retryTimeoutInMilliseconds*, see [Notes on *retryTimeoutInMilliseconds*](#notes-on-retrytimeoutinmilliseconds) in the [Attribute notes](#attribute-notes) section. |
| *redisSerializerType* | string | *n/a* | Specifies the assembly qualified type name of a class that implements Microsoft.Web.Redis. ISerializer and that contains the custom logic to serialize and deserialize the values. For more information, see [About *redisSerializerType*](#about-redisserializertype) in the [Attribute notes](#attribute-notes) section. |
|

## Attribute notes

### Setting *connectionString*

The value of *connectionString* is used as key to fetch the actual connection string from AppSettings, if such a string exists in AppSettings. If not found inside AppSettings, the value of *connectionString* will be used as key to fetch actual connection string from the web.config **ConnectionString** section, if that section exists. If the connection string does not exists in AppSettings or the web.config **ConnectionString** section, the literal value of *connectionString* will be used as the connection string when creating StackExchange.Redis.ConnectionMultiplexer.

The following examples illustrate how *connectionString* is used.

#### Example 1

```xml
<connectionStrings>
    <add name="MyRedisConnectionString" connectionString="mycache.redis.cache.windows.net:6380,password=actual access key,ssl=True,abortConnect=False" />
</connectionStrings>
```

In `web.config`, use above key as parameter value instead of actual value.

```xml
<sessionState mode="Custom" customProvider="MySessionStateStore">
    <providers>
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvide"
             name = "MySessionStateStore"
             connectionString = "MyRedisConnectionString"/>
    </providers>
</sessionState>
```

#### Example 2

```xml
<appSettings>
    <add key="MyRedisConnectionString" value="mycache.redis.cache.windows.net:6380,password=actual access key,ssl=True,abortConnect=False" />
</appSettings>
```

In `web.config`, use above key as parameter value instead of actual value.

```xml
<sessionState mode="Custom" customProvider="MySessionStateStore">
    <providers>
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvide"
             name = "MySessionStateStore"
             connectionString = "MyRedisConnectionString"/>
    </providers>
</sessionState>
```

#### Example 3

```xml
<sessionState mode="Custom" customProvider="MySessionStateStore">
    <providers>
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvide"
             name = "MySessionStateStore"
             connectionString = "mycache.redis.cache.windows.net:6380,password=actual access key,ssl=True,abortConnect=False"/>
    </providers>
</sessionState>
```

### Notes on *throwOnError*

Currently, if an error occurs during a session operation, the session state provider will throw an exception. This shuts down the application.

This behavior has been modified in a way that supports the expectations of existing ASP.NET session state provider users while also providing the ability to act on exceptions, if desired. The default behavior still throws an exception when an error occurs, consistent with other ASP.NET session state providers; existing code should work the same as before.

If you set *throwOnError* to **false**, then instead of throwing an exception when an error occurs, it will fail silently. To see if there was an error and, if so, discover what the exception was, check the static property *Microsoft.Web.Redis.RedisSessionStateProvider.LastException*.

### Notes on *retryTimeoutInMilliseconds*

This provides some retry logic to simplify the case where some session operation should retry on failure because of things like network glitch, while also allowing you to control the retry timeout or opt out of retry entirely.

If you set *retryTimeoutInMilliseconds* to a number, for example 2000, then when a session operation fails, it will retry for 2000 milliseconds before treating it as an error. So to have the session state provider to apply this retry logic, just configure the timeout. The first retry will happen after 20 milliseconds, which is sufficient in most cases when a network glitch happens. After that, it will retry every second until it times out. Right after the time out, it will retry one more time to make sure that it won’t cut off the timeout by (at most) one second.

If you don’t think you need retry (for example, when you are running the Redis server on the same machine as your application) or if you want to handle the retry logic yourself, set *retryTimeoutInMilliseconds* to 0.

### About *redisSerializerType*

By default, the serialization to store the values on Redis is done in a binary format provided by the **BinaryFormatter** class. Use *redisSerializerType* to specify the assembly qualified type name of a class that implements **Microsoft.Web.Redis.ISerializer** and has the custom logic to serialize and deserialize the values. For example, here is a Json serializer class using JSON.NET:

```cs
namespace MyCompany.Redis
{
    public class JsonSerializer : ISerializer
    {
        private static JsonSerializerSettings _settings = new JsonSerializerSettings() { TypeNameHandling = TypeNameHandling.All };

        public byte[] Serialize(object data)
        {
            return Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data, _settings));
        }

        public object Deserialize(byte[] data)
        {
            if (data == null)6t6
            {
                return null;
            }
            return JsonConvert.DeserializeObject(Encoding.UTF8.GetString(data), _settings);
        }
    }
}
```

Assuming this class is defined in an assembly with name **MyCompanyDll**, you can set the parameter *redisSerializerType* to use it:

```xml
<sessionState mode="Custom" customProvider="MySessionStateStore">
    <providers>
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvider"
             name = "MySessionStateStore"
             redisSerializerType = "MyCompany.Redis.JsonSerializer,MyCompanyDll"
             ... />
    </providers>
</sessionState>
```

## Output cache directive

Add an OutputCache directive to each page for which you wish to cache the output.

```xml
<%@ OutputCache Duration="60" VaryByParam="*" %>
```

In the previous example, the cached page data remains in the cache for 60 seconds, and a different version of the page is cached for each parameter combination. For more information about the OutputCache directive, see [@OutputCache](https://go.microsoft.com/fwlink/?linkid=320837).

Once these steps are performed, your application is configured to use the Redis Output Cache Provider.

## Next steps

Check out the [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md).
