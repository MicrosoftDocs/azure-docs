---
title: ASP.NET Output Cache Provider for Azure Cache for Redis
description: Learn how to cache ASP.NET Page Output using Azure Cache for Redis. The Redis Output Cache Provider is an out-of-process storage mechanism for output cache data.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: conceptual
ms.date: 05/18/2021

---
# ASP.NET Output Cache Provider for Azure Cache for Redis

The Redis Output Cache Provider is an out-of-process storage mechanism for output cache data. This data is specifically for full HTTP responses (page output caching). The provider plugs into the new output cache provider extensibility point that was introduced in ASP.NET 4. For ASP.NET Core applications, read [Response caching in ASP.NET Core](/aspnet/core/performance/caching/response).

To use the Redis Output Cache Provider, first configure your cache, and then configure your ASP.NET application using the Redis Output Cache Provider NuGet package. This article provides guidance on configuring your application to use the Redis Output Cache Provider. For more information about creating and configuring an Azure Cache for Redis instance, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

## Store ASP.NET page output in the cache

To configure a client application in Visual Studio using the Azure Cache for Redis Session State NuGet package, select **NuGet Package Manager**, **Package Manager Console** from the **Tools** menu.

Run the following command from the `Package Manager Console` window.

```powershell
Install-Package Microsoft.Web.RedisOutputCacheProvider
```

The Redis Output Cache Provider NuGet package has a dependency on the StackExchange.Redis package. If the StackExchange.Redis package isn't present in your project, it's installed. For more information about the Redis Output Cache Provider NuGet package, see the [RedisOutputCacheProvider](https://www.nuget.org/packages/Microsoft.Web.RedisOutputCacheProvider/) NuGet page.

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

Configure the attributes on the left with the values from your cache in the Microsoft Azure portal. Also, configure the other values you want. For instructions on accessing your cache properties, see [Configure Azure Cache for Redis settings](cache-configure.md#configure-azure-cache-for-redis-settings).

| Attribute | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| *host* | string | "localhost" | The Redis server IP address or host name |
| *port* | positive integer | 6379 (non-TLS/SSL)<br/>6380 (TLS/SSL) | Redis server port |
| *accessKey* | string | "" | Redis server password when Redis authorization is enabled. The value is an empty string by default, which means the session state provider won’t use any password when it connects to Redis server. **If your Redis server is in a publicly accessible network like Azure Cache for Redis, be sure to enable Redis authorization to improve security, and provide a secure password.** |
| *ssl* | boolean | **false** | Whether to connect to Redis server via TLS. This value is **false** by default because Redis doesn’t support TLS by default. **If you're using Azure Cache for Redis, which supports SSL by default, be sure to set this value to true to improve security.**<br/><br/>The non-TLS port is disabled by default for new caches. Specify **true** for this setting to use the non-TLS port. For more information about enabling the non-TLS port, see the [Access Ports](cache-configure.md#access-ports) section in the [Configure a cache](cache-configure.md) article. |
| *databaseIdNumber* | positive integer | 0 | *This attribute can be specified only through either web.config or AppSettings.*<br/><br/>Specify which Redis database to use. |
| *connectionTimeoutInMilliseconds* | positive integer | Provided by StackExchange.Redis | Used to set *ConnectTimeout* when creating StackExchange.Redis.ConnectionMultiplexer. |
| *operationTimeoutInMilliseconds* | positive integer | Provided by StackExchange.Redis | Used to set *SyncTimeout* when creating StackExchange.Redis.ConnectionMultiplexer. |
| *connectionString* (Valid StackExchange.Redis connection string) | string | *n/a* | Either a parameter reference to AppSettings or web.config, or else a valid StackExchange.Redis connection string. This attribute can provide values for *host*, *port*, *accessKey*, *ssl*, and other StackExchange.Redis attributes. For a closer look at *connectionString*, see [Setting connectionString](#setting-connectionstring) in the [Attribute notes](#attribute-notes) section. |
| *settingsClassName*<br/>*settingsMethodName* | string<br/>string | *n/a* | *These attributes can be specified only through either web.config or AppSettings.*<br/><br/>Use these attributes to provide a connection string. *settingsClassName* should be an assembly qualified class name that contains the method specified by *settingsMethodName*.<br/><br/>The method specified by *settingsMethodName* should be public, static, and void (accepting no parameters), with a return type of **string**. This method returns the actual connection string. |
| *loggingClassName*<br/>*loggingMethodName* | string<br/>string | *n/a* | *These attributes can be specified only through either web.config or AppSettings.*<br/><br/>Use these attributes to debug your application by providing logs from Session State/Output Cache along with logs from StackExchange.Redis. *loggingClassName* should be an assembly qualified class name that contains the method specified by *loggingMethodName*.<br/><br/>The method specified by *loggingMethodName* should be public, static, and void (accept no parameters), with a return type of **System.IO.TextWriter**. |
| *applicationName* | string | The module name of the current process or "/" | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>The app name prefix to use in Redis cache. The customer may use the same Redis cache for different purposes. To insure that the session keys don't collide, it can be prefixed with the application name. |
| *throwOnError* | boolean | true | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>Whether to throw an exception when an error occurs.<br/><br/>For more about *throwOnError*, see [Notes on *throwOnError*](#notes-on-throwonerror) in the [Attribute notes](#attribute-notes) section. |
| *retryTimeoutInMilliseconds* | positive integer | 5000 | *SessionStateProvider only*<br/>*This attribute can be specified only through either web.config or AppSettings.*<br/><br/>How long to retry when an operation fails. If this value is less than *operationTimeoutInMilliseconds*, the provider won't retry.<br/><br/>For more about *retryTimeoutInMilliseconds*, see [Notes on *retryTimeoutInMilliseconds*](#notes-on-retrytimeoutinmilliseconds) in the [Attribute notes](#attribute-notes) section. |
| *redisSerializerType* | string | *n/a* | Specifies the assembly qualified type name of a class that implements Microsoft.Web.Redis. Serializer and that contains the custom logic to serialize and deserialize the values. For more information, see [About *redisSerializerType*](#about-redisserializertype) in the [Attribute notes](#attribute-notes) section. |

## Attribute notes

### Setting *connectionString*

The value of *connectionString* is used as key to fetch the actual connection string from AppSettings, if such a string exists in AppSettings. If not found inside AppSettings, the value of *connectionString* will be used as key to fetch actual connection string from the web.config **ConnectionString** section, if that section exists. If the connection string doesn't exist in AppSettings or the web.config **ConnectionString** section, the literal value of *connectionString* will be used as the connection string when creating StackExchange.Redis.ConnectionMultiplexer.

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
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvider"
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
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvider"
             name = "MySessionStateStore"
             connectionString = "MyRedisConnectionString"/>
    </providers>
</sessionState>
```

#### Example 3

```xml
<sessionState mode="Custom" customProvider="MySessionStateStore">
    <providers>
        <add type = "Microsoft.Web.Redis.RedisSessionStateProvider"
             name = "MySessionStateStore"
             connectionString = "mycache.redis.cache.windows.net:6380,password=actual access key,ssl=True,abortConnect=False"/>
    </providers>
</sessionState>
```

### Notes on *throwOnError*

Currently, if an error occurs during a session operation, the session state provider throws an exception. Throwing the exception shuts down the application.

This behavior has been modified in a way that supports the expectations of existing ASP.NET session state provider users while also allowing you to act on exceptions. The default behavior still throws an exception when an error occurs, consistent with other ASP.NET session state providers. Existing code should work the same as before.

If you set *throwOnError* to **false**, then instead of throwing an exception when an error occurs, it fails silently. To see if there was an error and, if so, discover what the exception was, check the static property *Microsoft.Web.Redis.RedisSessionStateProvider.LastException*.

### Notes on *retryTimeoutInMilliseconds*

The *retryTimeoutInMilliseconds* setting provides some logic to simplify the case where a session operation should retry on failure because of a network glitch or something else. The *retryTimeoutInMilliseconds* setting also allows you to control the retry timeout or to completely opt out of retry.

If you set *retryTimeoutInMilliseconds* to a number, for example 2000, when a session operation fails, it retries for 2000 milliseconds before treating it as an error. To have the session state provider apply this retry logic, just configure the timeout. The first retry will happen after 20 milliseconds, which is sufficient in most cases when a network glitch happens. After that, it will retry every second until it times out. Right after the time-out, it will retry one more time to make sure that it won’t cut off the timeout by (at most) one second.

If you don’t think you need retry or if you want to handle the retry logic yourself, set *retryTimeoutInMilliseconds* to 0. For example, you might not want retry when you're running the Redis server on the same machine as your application.

### About *redisSerializerType*

The serialization to store the values on Redis is done in a binary format by default, which is provided by the **BinaryFormatter** class. Use *redisSerializerType* to specify the assembly qualified type name of a class that implements **Microsoft.Web.Redis.ISerializer** and has the custom logic to serialize and deserialize the values. For example, here's a Json serializer class using JSON.NET:

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
            if (data == null)
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

In the previous example, the cached page data remains in the cache for 60 seconds, and a different version of the page is cached for each parameter combination. For more information about the OutputCache directive, see [@OutputCache](/previous-versions/dotnet/netframework-4.0/hdxfb6cy(v=vs.100)).

After you do these steps, your application is configured to use the Redis Output Cache Provider.

## Third-party output cache providers

* [NCache](https://www.alachisoft.com/blogs/how-to-use-a-distributed-cache-for-asp-net-output-cache/)
* [Apache Ignite](https://apacheignite-net.readme.io/docs/aspnet-output-caching)

## Next steps

Check out the [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md).
