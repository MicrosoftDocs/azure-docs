---
title: Migrate Managed Cache Service applications to Redis - Azure | Microsoft Docs
description: Learn how to migrate Managed Cache Service and In-Role Cache applications to Azure Cache for Redis
services: cache
documentationcenter: na
author: yegu-ms
manager: jhubbard
editor: tysonn

ms.assetid: 041f077b-8c8e-4d7c-a3fc-89d334ed70d6
ms.service: cache
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: cache
ms.workload: tbd
ms.date: 05/30/2017
ms.author: yegu

---
# Migrate from Managed Cache Service to Azure Cache for Redis
Migrating your applications that use Azure Managed Cache Service to Azure Cache for Redis can be accomplished with minimal changes to your application, depending on the Managed Cache Service features used by your caching application. While the APIs are not exactly the same they are similar, and much of your existing code that uses Managed Cache Service to access a cache can be reused with minimal changes. This article shows how to make the necessary configuration and application changes to migrate your Managed Cache Service applications to use Azure Cache for Redis, and shows how some of the features of Azure Cache for Redis can be used to implement the functionality of a Managed Cache Service cache.

>[!NOTE]
>Managed Cache Service and In-Role Cache were [retired](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/) November 30, 2016. If you have any In-Role Cache deployments that you want to migrate to Azure Cache for Redis, you can follow the steps in this article.

## Migration Steps
The following steps are required to migrate a Managed Cache Service application to use Azure Cache for Redis.

* Map Managed Cache Service features to Azure Cache for Redis
* Choose a Cache Offering
* Create a Cache
* Configure the Cache Clients
  * Remove the Managed Cache Service Configuration
  * Configure a cache client using the StackExchange.Redis NuGet Package
* Migrate Managed Cache Service code
  * Connect to the cache using the ConnectionMultiplexer class
  * Access primitive data types in the cache
  * Work with .NET objects in the cache
* Migrate ASP.NET Session State and Output caching to Azure Cache for Redis 

## Map Managed Cache Service features to Azure Cache for Redis
Azure Managed Cache Service and Azure Cache for Redis are similar but implement some of their features in different ways. This section describes some of the differences and provides guidance on implementing the features of Managed Cache Service in Azure Cache for Redis.

| Managed Cache Service feature | Managed Cache Service support | Azure Cache for Redis support |
| --- | --- | --- |
| Named caches |A default cache is configured, and in the Standard and Premium cache offerings, up to nine additional named caches can be configured if desired. |Azure Cache for Redis has a configurable number of databases (default of 16) that can be used to implement a similar functionality to named caches. For more information, see [What are Redis databases?](cache-faq.md#what-are-redis-databases) and [Default Redis server configuration](cache-configure.md#default-redis-server-configuration). |
| High Availability |Provides high availability for items in the cache in the Standard and Premium cache offerings. If items are lost due to a failure, backup copies of the items in the cache are still available. Writes to the secondary cache are made synchronously. |High availability is available in the Standard and Premium cache offerings, which have a two node Primary/Replica configuration (each shard in a Premium cache has a primary/replica pair). Writes to the replica are made asynchronously. For more information, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). |
| Notifications |Allows clients to receive asynchronous notifications when a variety of cache operations occur on a named cache. |Client applications can use Redis pub/sub or [Keyspace notifications](cache-configure.md#keyspace-notifications-advanced-settings) to achieve a similar functionality to notifications. |
| Local cache |Stores a copy of cached objects locally on the client for extra-fast access. |Client applications would need to implement this functionality using a dictionary or similar data structure. |
| Eviction Policy |None or LRU. The default policy is LRU. |Azure Cache for Redis supports the following eviction policies: volatile-lru, allkeys-lru, volatile-random, allkeys-random, volatile-ttl, noeviction. The default policy is volatile-lru. For more information, see [Default Redis server configuration](cache-configure.md#default-redis-server-configuration). |
| Expiration Policy |The default expiration policy is Absolute and the default expiration interval is 10 minutes. Sliding and Never policies are also available. |By default items in the cache do not expire, but an expiration can be configured on a per write basis using cache set overloads. |
| Regions and Tagging |Regions are subgroups for cached items. Regions also support the annotation of cached items with additional descriptive strings called tags. Regions support the ability to perform search operations on any tagged items in that region. All items within a region are located within a single node of the cache cluster. |an Azure Cache for Redis consists of a single node (unless Redis cluster is enabled) so the concept of Managed Cache Service regions does not apply. Redis supports searching and wildcard operations when retrieving keys so descriptive tags can be embedded within the key names and used to retrieve the items later. For an example of implementing a tagging solution using Redis, see [Implementing cache tagging with Redis](https://stackify.com/implementing-cache-tagging-redis/). |
| Serialization |Managed Cache supports NetDataContractSerializer, BinaryFormatter, and the use of custom serializers. The default is NetDataContractSerializer. |It is the responsibility of the client application to serialize .NET objects before placing them into the cache, with the choice of the serializer up to the client application developer. For more information and sample code, see [Work with .NET objects in the cache](cache-dotnet-how-to-use-azure-redis-cache.md#work-with-net-objects-in-the-cache). |
| Cache emulator |Managed Cache provides a local cache emulator. |Azure Cache for Redis does not have an emulator, but you can [run the MSOpenTech build of redis-server.exe locally](cache-faq.md#cache-emulator) to provide an emulator experience. |

## Choose a Cache Offering
Microsoft Azure Cache for Redis is available in the following tiers:

* **Basic** – Single node. Multiple sizes up to 53 GB.
* **Standard** – Two-node Primary/Replica. Multiple sizes up to 53 GB. 99.9% SLA.
* **Premium** – Two-node Primary/Replica with up to 10 shards. Multiple sizes from 6 GB to 530 GB. All Standard tier features and more including support for [Redis cluster](cache-how-to-premium-clustering.md), [Redis persistence](cache-how-to-premium-persistence.md), and [Azure Virtual Network](cache-how-to-premium-vnet.md). 99.9% SLA.

Each tier differs in terms of features and pricing. The features are covered later in this guide, and for more information on pricing, see [Cache Pricing Details](https://azure.microsoft.com/pricing/details/cache/).

A starting point for migration is to pick the size that matches the size of your previous Managed Cache Service cache, and then scale up or down depending on the requirements of your application. For more information on choosing the right Azure Cache for Redis offering, see [What Azure Cache for Redis offering and size should I use](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use).

## Create a Cache
[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

## Configure the Cache Clients
Once the cache is created and configured, the next step is to remove the Managed Cache Service configuration, and add the Azure Cache for Redis configuration and references so that cache clients can access the cache.

* Remove the Managed Cache Service Configuration
* Configure a cache client using the StackExchange.Redis NuGet Package

### Remove the Managed Cache Service Configuration
Before the client applications can be configured for Azure Cache for Redis, the existing Managed Cache Service configuration and assembly references must be removed by uninstalling the Managed Cache Service NuGet package.

To uninstall the Managed Cache Service NuGet package, right-click the client project in **Solution Explorer** and choose **Manage NuGet Packages**. Select the **Installed packages** node, and type W**indowsAzure.Caching** into the Search installed packages box. Select **Windows** **Azure Cache** (or **Windows** **Azure Caching** depending on the version of the NuGet package), click **Uninstall**, and then click **Close**.

![Uninstall Azure Managed Cache Service NuGet Package](./media/cache-migrate-to-redis/IC757666.jpg)

Uninstalling the Managed Cache Service NuGet package removes the Managed Cache Service assemblies and the Managed Cache Service entries in the app.config or web.config of the client application. Because some customized settings may not be removed when uninstalling the NuGet package, open web.config or app.config and ensure that the following elements are removed.

Ensure that the `dataCacheClients` entry is removed from the `configSections` element. Do not remove the entire `configSections` element; just remove the `dataCacheClients` entry, if it is present.

```xml
<configSections>
  <!-- Existing sections omitted for clarity. -->
  <section name="dataCacheClients"type="Microsoft.ApplicationServer.Caching.DataCacheClientsSection, Microsoft.ApplicationServer.Caching.Core" allowLocation="true" allowDefinition="Everywhere"/>
</configSections>
```

Ensure that the `dataCacheClients` section is removed. The `dataCacheClients` section will be similar to the following example.

```xml
<dataCacheClients>
  <dataCacheClientname="default">
    <!--To use the in-role flavor of Azure Cache, set identifier to be the cache cluster role name -->
    <!--To use the Azure Managed Cache Service, set identifier to be the endpoint of the cache cluster -->
    <autoDiscoverisEnabled="true"identifier="[Cache role name or Service Endpoint]"/>

    <!--<localCache isEnabled="true" sync="TimeoutBased" objectCount="100000" ttlValue="300" />-->
    <!--Use this section to specify security settings for connecting to your cache. This section is not required if your cache is hosted on a role that is a part of your cloud service. -->
    <!--<securityProperties mode="Message" sslEnabled="true">
      <messageSecurity authorizationInfo="[Authentication Key]" />
    </securityProperties>-->
  </dataCacheClient>
</dataCacheClients>
```

Once the Managed Cache Service configuration is removed, you can configure the cache client as described in the following section.

### Configure a cache client using the StackExchange.Redis NuGet Package
[!INCLUDE [redis-cache-configure](../../includes/redis-cache-configure-stackexchange-redis-nuget.md)]

## Migrate Managed Cache Service code
The API for the StackExchange.Azure Cache for Redis client is similar to the Managed Cache Service. This section provides an overview of the differences.

### Connect to the cache using the ConnectionMultiplexer class
In Managed Cache Service, connections to the cache were handled by the `DataCacheFactory` and `DataCache` classes. In Azure Cache for Redis, these connections are managed by the `ConnectionMultiplexer` class.

Add the following using statement to the top of any file from which you want to access the cache.

```csharp
using StackExchange.Redis
```

If this namespace doesn’t resolve, be sure that you have added the StackExchange.Redis NuGet package as described in [Quickstart: Use Azure Cache for Redis with a .NET application](cache-dotnet-how-to-use-azure-redis-cache.md).

> [!NOTE]
> Note that the StackExchange.Redis client requires .NET Framework 4 or higher.
> 
> 

To connect to an Azure Cache for Redis instance, call the static `ConnectionMultiplexer.Connect` method and pass in the endpoint and key. One approach to sharing a `ConnectionMultiplexer` instance in your application is to have a static property that returns a connected instance, similar to the following example. This approach provides a thread-safe way to initialize a single connected `ConnectionMultiplexer` instance. In this example `abortConnect` is set to false, which means that the call will succeed even if a connection to the cache is not established. One key feature of `ConnectionMultiplexer` is that it will automatically restore connectivity to the cache once the network issue or other causes are resolved.

```csharp
private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
{
    return ConnectionMultiplexer.Connect("contoso5.redis.cache.windows.net,abortConnect=false,ssl=true,password=...");
});

public static ConnectionMultiplexer Connection
{
    get
    {
        return lazyConnection.Value;
    }
}
```

The cache endpoint, keys, and ports can be obtained from the **Azure Cache for Redis** blade for your cache instance. For more information, see [Azure Cache for Redis properties](cache-configure.md#properties).

Once the connection is established, return a reference to the Azure Cache for Redis database by calling the `ConnectionMultiplexer.GetDatabase` method. The object returned from the `GetDatabase` method is a lightweight pass-through object and does not need to be stored.

```csharp
IDatabase cache = Connection.GetDatabase();

// Perform cache operations using the cache object...
// Simple put of integral data types into the cache
cache.StringSet("key1", "value");
cache.StringSet("key2", 25);

// Simple get of data types from the cache
string key1 = cache.StringGet("key1");
int key2 = (int)cache.StringGet("key2");
```

The StackExchange.Redis client uses the `RedisKey` and `RedisValue` types for accessing and storing items in the cache. These types map onto most primitive language types, including string, and often are not used directly. Redis Strings are the most basic kind of Redis value, and can contain many types of data, including serialized binary streams, and while you may not use the type directly, you will use methods that contain `String` in the name. For most primitive data types, you store and retrieve items from the cache using the `StringSet` and `StringGet` methods, unless you are storing collections or other Redis data types in the cache. 

`StringSet` and `StringGet` are similar to the Managed Cache Service `Put` and `Get` methods, with one major difference being that before you set and get a .NET object into the cache you must serialize it first. 

When calling `StringGet`, if the object exists, it is returned, and if it does not, null is returned. In this case, you can retrieve the value from the desired data source and store it in the cache for subsequent use. This pattern is known as the cache-aside pattern.

To specify the expiration of an item in the cache, use the `TimeSpan` parameter of `StringSet`.

```csharp
cache.StringSet("key1", "value1", TimeSpan.FromMinutes(90));
```

Azure Cache for Redis can work with .NET objects as well as primitive data types, but before a .NET object can be cached it must be serialized. This serialization is the responsibility of the application developer, and gives the developer flexibility in the choice of the serializer. For more information and sample code, see [Work with .NET objects in the cache](cache-dotnet-how-to-use-azure-redis-cache.md#work-with-net-objects-in-the-cache).

## Migrate ASP.NET Session State and Output caching to Azure Cache for Redis
Azure Cache for Redis has providers for both ASP.NET Session State and Page Output caching. To migrate your application that uses the Managed Cache Service versions of these providers, first remove the existing sections from your web.config, and then configure the Azure Cache for Redis versions of the providers. For instructions on using the Azure Cache for Redis ASP.NET providers, see [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md) and [ASP.NET Output Cache Provider for Azure Cache for Redis](cache-aspnet-output-cache-provider.md).

## Next steps
Explore the [Azure Cache for Redis documentation](https://azure.microsoft.com/documentation/services/cache/) for tutorials, samples, videos, and more.

