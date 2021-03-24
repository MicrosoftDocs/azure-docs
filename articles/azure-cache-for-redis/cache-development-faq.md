---
title: Azure Cache for Redis development FAQs
description: Learn the answers to common questions that help you develop for Azure Cache for Redis
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.custom: devx-track-csharp
ms.date: 08/06/2020
---
# Azure Cache for Redis development FAQs

This article provides answers to common questions about how to develop for Azure Cache for Redis.

## Common questions and answers
This section covers the following FAQs:

* [How can I get started with Azure Cache for Redis?](#how-can-i-get-started-with-azure-cache-for-redis)
* [What do the StackExchange.Redis configuration options do?](#what-do-the-stackexchangeredis-configuration-options-do)
* [What Azure Cache for Redis clients can I use?](#what-azure-cache-for-redis-clients-can-i-use)
* [Is there a local emulator for Azure Cache for Redis?](#is-there-a-local-emulator-for-azure-cache-for-redis)
* [How can I run Redis commands?](#how-can-i-run-redis-commands)
* [Why doesn't Azure Cache for Redis have an MSDN class library reference?](#why-doesnt-azure-cache-for-redis-have-an-msdn-class-library-reference)
* [Can I use Azure Cache for Redis as a PHP session cache?](#can-i-use-azure-cache-for-redis-as-a-php-session-cache)
* [What are Redis databases?](#what-are-redis-databases)

### How can I get started with Azure Cache for Redis?
There are several ways you can get started with Azure Cache for Redis.

* You can check out one of our tutorials available for [.NET](cache-dotnet-how-to-use-azure-redis-cache.md), [ASP.NET](cache-web-app-howto.md), [Java](cache-java-get-started.md), [Node.js](cache-nodejs-get-started.md), and [Python](cache-python-get-started.md).
* You can watch [How to Build High-Performance Apps Using Microsoft Azure Cache for Redis](https://azure.microsoft.com/documentation/videos/how-to-build-high-performance-apps-using-microsoft-azure-cache/).
* You can check out the client documentation for the clients that match the development language of your project to see how to use Redis. There are many Redis clients that can be used with Azure Cache for Redis. For a list of Redis clients, see [https://redis.io/clients](https://redis.io/clients).

If you don't already have an Azure account, you can:

* [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.
* [Activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=redis_cache_hero). Your MSDN subscription gives you credits every month that you can use for paid Azure services.

### What do the StackExchange.Redis configuration options do?
StackExchange.Redis has many options. This section talks about some of the common settings. For more detailed information about StackExchange.Redis options, see [StackExchange.Redis configuration](https://stackexchange.github.io/StackExchange.Redis/Configuration).

| ConfigurationOptions | Description | Recommendation |
| --- | --- | --- |
| AbortOnConnectFail |When set to true, the connection will not reconnect after a network failure. |Set to false and let StackExchange.Redis reconnect automatically. |
| ConnectRetry |The number of times to repeat connection attempts during initial connect. |See the following notes for guidance. |
| ConnectTimeout |Timeout in ms for connect operations. |See the following notes for guidance. |

Usually the default values of the client are sufficient. You can fine-tune the options based on your workload.

* **Retries**
  * For ConnectRetry and ConnectTimeout, the general guidance is to fail fast and retry again. This guidance is based on your workload and how much time on average it takes for your client to issue a Redis command and receive a response.
  * Let StackExchange.Redis automatically reconnect instead of checking connection status and reconnecting yourself. **Avoid using the ConnectionMultiplexer.IsConnected property**.
  * Snowballing - sometimes you may run into an issue where you are retrying and the retries snowball and never recovers. If snowballing occurs, you should consider using an exponential backoff retry algorithm as described in [Retry general guidance](/azure/architecture/best-practices/transient-faults) published by the Microsoft Patterns & Practices group.
  
* **Timeout values**
  * Consider your workload and set the values accordingly. If you are storing large values, set the timeout to a higher value.
  * Set `AbortOnConnectFail` to false and let StackExchange.Redis reconnect for you.
  * Use a single ConnectionMultiplexer instance for the application. You can use a LazyConnection to create a single instance that is returned by a Connection property, as shown in [Connect to the cache using the ConnectionMultiplexer class](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache).
  * Set the `ConnectionMultiplexer.ClientName` property to an app instance unique name for diagnostic purposes.
  * Use multiple `ConnectionMultiplexer` instances for custom workloads.
    * You can follow this model if you have varying load in your application. For example:
    * You can have one multiplexer for dealing with large keys.
    * You can have one multiplexer for dealing with small keys.
    * You can set different values for connection timeouts and retry logic for each ConnectionMultiplexer that you use.
    * Set the `ClientName` property on each multiplexer to help with diagnostics.
    * This guidance may lead to more streamlined latency per `ConnectionMultiplexer`.

### What Azure Cache for Redis clients can I use?
One of the great things about Redis is that there are many clients supporting many different development languages. For a current list of clients, see [Redis clients](https://redis.io/clients). For tutorials that cover several different languages and clients, see [How to use Azure Cache for Redis](cache-dotnet-how-to-use-azure-redis-cache.md) and it's sibling articles in the table of contents.

[!INCLUDE [redis-cache-create](../../includes/redis-cache-access-keys.md)]

### Is there a local emulator for Azure Cache for Redis?
There is no local emulator for Azure Cache for Redis, but you can run the MSOpenTech version of redis-server.exe from the [Redis command-line tools](https://github.com/MSOpenTech/redis/releases/) on your local machine and connect to it to get a similar experience to a local cache emulator, as shown in the following example:

```csharp
private static Lazy<ConnectionMultiplexer>
    lazyConnection = new Lazy<ConnectionMultiplexer> (() =>
    {
        // Connect to a locally running instance of Redis to simulate
        // a local cache emulator experience.
        return ConnectionMultiplexer.Connect("127.0.0.1:6379");
    });

public static ConnectionMultiplexer Connection
{
    get
    {
        return lazyConnection.Value;
    }
}
```

You can optionally configure a [redis.conf](https://redis.io/topics/config) file to more closely match the [default cache settings](cache-configure.md#default-redis-server-configuration) for your online Azure Cache for Redis if desired.

### How can I run Redis commands?
You can use any of the commands listed at [Redis commands](https://redis.io/commands#) except for the commands listed at [Redis commands not supported in Azure Cache for Redis](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis). You have several options to run Redis commands.

* If you have a Standard or Premium cache, you can run Redis commands using the [Redis Console](cache-configure.md#redis-console). The Redis console provides a secure way to run Redis commands in the Azure portal.
* You can also use the Redis command-line tools. To use them, perform the following steps:
* Download the [Redis command-line tools](https://github.com/MSOpenTech/redis/releases/).
* Connect to the cache using `redis-cli.exe`. Pass in the cache endpoint using the -h switch and the key using -a as shown in the following example:
* `redis-cli -h <Azure Cache for Redis name>.redis.cache.windows.net -a <key>`

> [!NOTE]
> The Redis command-line tools do not work with the TLS port, but you can use a utility such as `stunnel` to securely connect the tools to the TLS port by following the directions in the [How to use the Redis command-line tool with Azure Cache for Redis](./cache-how-to-redis-cli-tool.md) article.
>
>

### Why doesn't Azure Cache for Redis have an MSDN class library reference?
Microsoft Azure Cache for Redis is based on the popular open-source in-memory data store, Redis. It can be accessed by a wide variety of [Redis clients](https://redis.io/clients) for many programming languages. Each client has its own API that makes calls to the Azure Cache for Redis instance using [Redis commands](https://redis.io/commands).

Because each client is different, there is not one centralized class reference on MSDN, and each client maintains its own reference documentation. In addition to the reference documentation, there are several tutorials showing how to get started with Azure Cache for Redis using different languages and cache clients. To access these tutorials, see [How to use Azure Cache for Redis](cache-dotnet-how-to-use-azure-redis-cache.md) and it's sibling articles in the table of contents.

### Can I use Azure Cache for Redis as a PHP session cache?
Yes, to use Azure Cache for Redis as a PHP session cache, specify the connection string to your Azure Cache for Redis instance in `session.save_path`.

> [!IMPORTANT]
> When using Azure Cache for Redis as a PHP session cache, you must URL encode the security key used to connect to the cache, as shown in the following example:
>
> `session.save_path = "tcp://mycache.redis.cache.windows.net:6379?auth=<url encoded primary or secondary key here>";`
>
> If the key is not URL encoded, you may receive an exception with a message like: `Failed to parse session.save_path`
>

For more information about using Azure Cache for Redis as a PHP session cache with the PhpRedis client, see [PHP Session handler](https://github.com/phpredis/phpredis#php-session-handler).

### What are Redis databases?

Redis Databases are just a logical separation of data within the same Redis instance. The cache memory is shared between all the databases and actual memory consumption of a given database depends on the keys/values stored in that database. For example, a C6 cache has 53 GB of memory, and a P5 has 120 GB. You can choose to put all 53 GB / 120 GB into one database or you can split it up between multiple databases. 

> [!NOTE]
> When using a Premium Azure Cache for Redis with clustering enabled, only database 0 is available. This limitation is an intrinsic Redis limitation and is not specific to Azure Cache for Redis. For more information, see [Do I need to make any changes to my client application to use clustering?](cache-how-to-premium-clustering.md#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering).
> 
> 

## Next steps

Learn about other [Azure Cache for Redis FAQs](cache-faq.md).