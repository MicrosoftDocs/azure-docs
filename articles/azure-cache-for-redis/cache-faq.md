---
title: Azure Cache for Redis FAQ | Microsoft Docs
description: Learn the answers to common questions, patterns, and best practices for Azure Cache for Redis
services: cache
documentationcenter: ''
author: yegu-ms
manager: jhubbard
editor: ''

ms.assetid: c2c52b7d-b2d1-433a-b635-c20180e5cab2
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: article
ms.date: 04/29/2019
ms.author: yegu

---
# Azure Cache for Redis FAQ
Learn the answers to common questions, patterns, and best practices for Azure Cache for Redis.

## What if my question isn't answered here?
If your question isn't listed here, let us know and we'll help you find an answer.

* You can post a question in the comments at the end of this FAQ and engage with the Azure Cache team and other community members about this article.
* To reach a wider audience, you can post a question on the [Azure Cache MSDN Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azurecache) and engage with the Azure Cache team and other members of the community.
* If you want to make a feature request, you can submit your requests and ideas to [Azure Cache for Redis User Voice](https://feedback.azure.com/forums/169382-cache).
* You can also send an email to us at [Azure Cache External Feedback](mailto:azurecache@microsoft.com).

## Azure Cache for Redis basics
The FAQs in this section cover some of the basics of Azure Cache for Redis.

* [What is Azure Cache for Redis?](#what-is-azure-cache-for-redis)
* [How can I get started with Azure Cache for Redis?](#how-can-i-get-started-with-azure-cache-for-redis)

The following FAQs cover basic concepts and questions about Azure Cache for Redis and are answered in one of the other FAQ sections.

* [What Azure Cache for Redis offering and size should I use?](#what-azure-cache-for-redis-offering-and-size-should-i-use)
* [What Azure Cache for Redis clients can I use?](#what-azure-cache-for-redis-clients-can-i-use)
* [Is there a local emulator for Azure Cache for Redis?](#is-there-a-local-emulator-for-azure-cache-for-redis)
* [How do I monitor the health and performance of my cache?](#how-do-i-monitor-the-health-and-performance-of-my-cache)

## Planning FAQs
* [What Azure Cache for Redis offering and size should I use?](#what-azure-cache-for-redis-offering-and-size-should-i-use)
* [Azure Cache for Redis performance](#azure-cache-for-redis-performance)
* [In what region should I locate my cache?](#in-what-region-should-i-locate-my-cache)
* [How am I billed for Azure Cache for Redis?](#how-am-i-billed-for-azure-cache-for-redis)
* [Can I use Azure Cache for Redis with Azure Government Cloud, Azure China Cloud, or Microsoft Azure Germany?](#can-i-use-azure-cache-for-redis-with-azure-government-cloud-azure-china-cloud-or-microsoft-azure-germany)

## Development FAQs
* [What do the StackExchange.Redis configuration options do?](#what-do-the-stackexchangeredis-configuration-options-do)
* [What Azure Cache for Redis clients can I use?](#what-azure-cache-for-redis-clients-can-i-use)
* [Is there a local emulator for Azure Cache for Redis?](#is-there-a-local-emulator-for-azure-cache-for-redis)
* [How can I run Redis commands?](#how-can-i-run-redis-commands)
* [Why doesn't Azure Cache for Redis have an MSDN class library reference like some of the other Azure services?](#why-doesnt-azure-cache-for-redis-have-an-msdn-class-library-reference-like-some-of-the-other-azure-services)
* [Can I use Azure Cache for Redis as a PHP session cache?](#can-i-use-azure-cache-for-redis-as-a-php-session-cache)
* [What are Redis databases?](#what-are-redis-databases)

## Security FAQs
* [When should I enable the non-SSL port for connecting to Redis?](#when-should-i-enable-the-non-ssl-port-for-connecting-to-redis)

## Production FAQs
* [What are some production best practices?](#what-are-some-production-best-practices)
* [What are some of the considerations when using common Redis commands?](#what-are-some-of-the-considerations-when-using-common-redis-commands)
* [How can I benchmark and test the performance of my cache?](#how-can-i-benchmark-and-test-the-performance-of-my-cache)
* [Important details about ThreadPool growth](#important-details-about-threadpool-growth)
* [Enable server GC to get more throughput on the client when using StackExchange.Redis](#enable-server-gc-to-get-more-throughput-on-the-client-when-using-stackexchangeredis)
* [Performance considerations around connections](#performance-considerations-around-connections)

## Monitoring and troubleshooting FAQs
The FAQs in this section cover common monitoring and troubleshooting questions. For more information about monitoring and troubleshooting your Azure Cache for Redis instances, see [How to monitor Azure Cache for Redis](cache-how-to-monitor.md) and [How to troubleshoot Azure Cache for Redis](cache-how-to-troubleshoot.md).

* [How do I monitor the health and performance of my cache?](#how-do-i-monitor-the-health-and-performance-of-my-cache)
* [Why am I seeing timeouts?](#why-am-i-seeing-timeouts)
* [Why was my client disconnected from the cache?](#why-was-my-client-disconnected-from-the-cache)

## Prior Cache offering FAQs
* [Which Azure Cache offering is right for me?](#which-azure-cache-offering-is-right-for-me)

### What is Azure Cache for Redis?
Azure Cache for Redis is based on the popular open-source software [Redis](https://redis.io/). It gives you access to a secure, dedicated Azure Cache for Redis, managed by Microsoft, and accessible from any application within Azure. For a more detailed overview, see the [Azure Cache for Redis](https://azure.microsoft.com/services/cache/) product page on Azure.com.

### How can I get started with Azure Cache for Redis?
There are several ways you can get started with Azure Cache for Redis.

* You can check out one of our tutorials available for [.NET](cache-dotnet-how-to-use-azure-redis-cache.md), [ASP.NET](cache-web-app-howto.md), [Java](cache-java-get-started.md), [Node.js](cache-nodejs-get-started.md), and [Python](cache-python-get-started.md).
* You can watch [How to Build High-Performance Apps Using Microsoft Azure Cache for Redis](https://azure.microsoft.com/documentation/videos/how-to-build-high-performance-apps-using-microsoft-azure-cache/).
* You can check out the client documentation for the clients that match the development language of your project to see how to use Redis. There are many Redis clients that can be used with Azure Cache for Redis. For a list of Redis clients, see [https://redis.io/clients](https://redis.io/clients).

If you don't already have an Azure account, you can:

* [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.
* [Activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=redis_cache_hero). Your MSDN subscription gives you credits every month that you can use for paid Azure services.

<a name="cache-size"></a>

### What Azure Cache for Redis offering and size should I use?
Each Azure Cache for Redis offering provides different levels of **size**, **bandwidth**, **high availability**, and **SLA** options.

The following are considerations for choosing a Cache offering.

* **Memory**: The Basic and Standard tiers offer 250 MB – 53 GB. The Premium tier offers up to 530 GB. For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).
* **Network Performance**: If you have a workload that requires high throughput, the Premium tier offers more bandwidth compared to Standard or Basic. Also within each tier, larger size caches have more bandwidth because of the underlying VM that hosts the cache. For more information, see the [following table](#cache-performance).
* **Throughput**: The Premium tier offers the maximum available throughput. If the cache server or client reaches the bandwidth limits, you may receive timeouts on the client side. For more information, see the following table.
* **High Availability/SLA**: Azure Cache for Redis guarantees that a Standard/Premium cache is available at least 99.9% of the time. To learn more about our SLA, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). The SLA only covers connectivity to the Cache endpoints. The SLA does not cover protection from data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss.
* **Redis Data Persistence**: The Premium tier allows you to persist the cache data in an Azure Storage account. In a Basic/Standard cache, all the data is stored only in memory. Underlying infrastructure issues might result in potential data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss. Azure Cache for Redis offers RDB and AOF (coming soon) options in Redis persistence. For more information, see [How to configure persistence for a Premium Azure Cache for Redis](cache-how-to-premium-persistence.md).
* **Redis Cluster**: To create caches larger than 53 GB, or to shard data across multiple Redis nodes, you can use Redis clustering, which is available in the Premium tier. Each node consists of a primary/replica cache pair for high availability. For more information, see [How to configure clustering for a Premium Azure Cache for Redis](cache-how-to-premium-clustering.md).
* **Enhanced security and network isolation**: Azure Virtual Network (VNET) deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access. For more information, see [How to configure Virtual Network support for a Premium Azure Cache for Redis](cache-how-to-premium-vnet.md).
* **Configure Redis**: In both the Standard and Premium tiers, you can configure Redis for Keyspace notifications.
* **Maximum number of client connections**: The Premium tier offers the maximum number of clients that can connect to Redis, with a higher number of connections for larger sized caches. Clustering does not increase the number of connections available for a clustered cache. For more information, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/).
* **Dedicated Core for Redis Server**: In the Premium tier, all cache sizes have a dedicated core for Redis. In the Basic/Standard tiers, the C1 size and above have a dedicated core for Redis server.
* **Redis is single-threaded** so having more than two cores does not provide additional benefit over having just two cores, but larger VM sizes typically have more bandwidth than smaller sizes. If the cache server or client reaches the bandwidth limits, then you receive timeouts on the client side.
* **Performance improvements**: Caches in the Premium tier are deployed on hardware that has faster processors, giving better performance compared to the Basic or Standard tier. Premium tier Caches have higher throughput and lower latencies.

<a name="cache-performance"></a>

### Azure Cache for Redis performance
The following table shows the maximum bandwidth values observed while testing various sizes of Standard and Premium caches using `redis-benchmark.exe` from an IaaS VM against the Azure Cache for Redis endpoint. For SSL throughput, redis-benchmark is used with stunnel to connect to the Azure Cache for Redis endpoint.

>[!NOTE] 
>These values are not guaranteed and there is no SLA for these numbers, but should be typical. You should load test your own application to determine the right cache size for your application.
>These numbers might change as we post newer results periodically.
>

From this table, we can draw the following conclusions:

* Throughput for the caches that are the same size is higher in the Premium tier as compared to the Standard tier. For example, with a 6 GB Cache, throughput of P1 is 180,000 requests per second (RPS) as compared to 100,000 RPS for C3.
* With Redis clustering, throughput increases linearly as you increase the number of shards (nodes) in the cluster. For example, if you create a P4 cluster of 10 shards, then the available throughput is 400,000 * 10 = 4 million RPS.
* Throughput for bigger key sizes is higher in the Premium tier as compared to the Standard Tier.

| Pricing tier | Size | CPU cores | Available bandwidth | 1-KB value size | 1-KB value size |
| --- | --- | --- | --- | --- | --- |
| **Standard cache sizes** | | |**Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**Requests per second (RPS) Non-SSL** |**Requests per second (RPS) SSL** |
| C0 | 250 MB | Shared | 100 / 12.5  |  15,000 |   7,500 |
| C1 |   1 GB | 1      | 500 / 62.5  |  38,000 |  20,720 |
| C2 | 2.5 GB | 2      | 500 / 62.5  |  41,000 |  37,000 |
| C3 |   6 GB | 4      | 1000 / 125  | 100,000 |  90,000 |
| C4 |  13 GB | 2      | 500 / 62.5  |  60,000 |  55,000 |
| C5 |  26 GB | 4      | 1,000 / 125 | 102,000 |  93,000 |
| C6 |  53 GB | 8      | 2,000 / 250 | 126,000 | 120,000 |
| **Premium cache sizes** | |**CPU cores per shard** | **Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** |**Requests per second (RPS) Non-SSL, per shard** |**Requests per second (RPS) SSL, per shard** |
| P1 |   6 GB |  2 | 1,500 / 187.5 | 180,000 | 172,000 |
| P2 |  13 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P3 |  26 GB |  4 | 3,000 / 375   | 350,000 | 341,000 |
| P4 |  53 GB |  8 | 6,000 / 750   | 400,000 | 373,000 |
| P5 | 120 GB | 20 | 6,000 / 750   | 400,000 | 373,000 |

For instructions on setting up stunnel or downloading the Redis tools such as `redis-benchmark.exe`, see the [How can I run Redis commands?](#cache-commands) section.

<a name="cache-region"></a>

### In what region should I locate my cache?
For best performance and lowest latency, locate your Azure Cache for Redis in the same region as your cache client application.

<a name="cache-billing"></a>

### How am I billed for Azure Cache for Redis?
Azure Cache for Redis pricing is [here](https://azure.microsoft.com/pricing/details/cache/). The pricing page lists pricing as an hourly rate. Caches are billed on a per-minute basis from the time that the cache is created until the time that a cache is deleted. There is no option for stopping or pausing the billing of a cache.

### Can I use Azure Cache for Redis with Azure Government Cloud, Azure China Cloud, or Microsoft Azure Germany?
Yes, Azure Cache for Redis is available in Azure Government Cloud, Azure China 21Vianet Cloud, and Microsoft Azure Germany. The URLs for accessing and managing Azure Cache for Redis are different in these clouds compared with Azure Public Cloud.

| Cloud   | Dns Suffix for Redis            |
|---------|---------------------------------|
| Public  | *.redis.cache.windows.net       |
| US Gov  | *.redis.cache.usgovcloudapi.net |
| Germany | *.redis.cache.cloudapi.de       |
| China   | *.redis.cache.chinacloudapi.cn  |

For more information on considerations when using Azure Cache for Redis with other clouds, see the following links.

- [Azure Government Databases - Azure Cache for Redis](../azure-government/documentation-government-services-database.md#azure-cache-for-redis)
- [Azure China 21Vianet Cloud - Azure Cache for Redis](https://www.azure.cn/home/features/redis-cache/)
- [Microsoft Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)

For information on using Azure Cache for Redis with PowerShell in Azure Government Cloud, Azure China 21Vianet Cloud, and Microsoft Azure Germany, see [How to connect to other clouds - Azure Cache for Redis PowerShell](cache-howto-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds).

<a name="cache-configuration"></a>

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
  * Snowballing - sometimes you may run into an issue where you are retrying and the retries snowball and never recovers. If snowballing occurs, you should consider using an exponential backoff retry algorithm as described in [Retry general guidance](../best-practices-retry-general.md) published by the Microsoft Patterns & Practices group.
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

<a name="cache-emulator"></a>

### Is there a local emulator for Azure Cache for Redis?
There is no local emulator for Azure Cache for Redis, but you can run the MSOpenTech version of redis-server.exe from the [Redis command-line tools](https://github.com/MSOpenTech/redis/releases/) on your local machine and connect to it to get a similar experience to a local cache emulator, as shown in the following example:

    private static Lazy<ConnectionMultiplexer>
          lazyConnection = new Lazy<ConnectionMultiplexer>
        (() =>
        {
            // Connect to a locally running instance of Redis to simulate a local cache emulator experience.
            return ConnectionMultiplexer.Connect("127.0.0.1:6379");
        });

        public static ConnectionMultiplexer Connection
        {
            get
            {
                return lazyConnection.Value;
            }
        }


You can optionally configure a [redis.conf](https://redis.io/topics/config) file to more closely match the [default cache settings](cache-configure.md#default-redis-server-configuration) for your online Azure Cache for Redis if desired.

<a name="cache-commands"></a>

### How can I run Redis commands?
You can use any of the commands listed at [Redis commands](https://redis.io/commands#) except for the commands listed at [Redis commands not supported in Azure Cache for Redis](cache-configure.md#redis-commands-not-supported-in-azure-cache-for-redis). You have several options to run Redis commands.

* If you have a Standard or Premium cache, you can run Redis commands using the [Redis Console](cache-configure.md#redis-console). The Redis console provides a secure way to run Redis commands in the Azure portal.
* You can also use the Redis command-line tools. To use them, perform the following steps:
* Download the [Redis command-line tools](https://github.com/MSOpenTech/redis/releases/).
* Connect to the cache using `redis-cli.exe`. Pass in the cache endpoint using the -h switch and the key using -a as shown in the following example:
* `redis-cli -h <Azure Cache for Redis name>.redis.cache.windows.net -a <key>`

> [!NOTE]
> The Redis command-line tools do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [How to use the Redis command-line tool with Azure Cache for Redis](https://docs.microsoft.com/azure/azure-cache-for-redis/cache-how-to-redis-cli-tool) article.
>
>

<a name="cache-reference"></a>

### Why doesn't Azure Cache for Redis have an MSDN class library reference like some of the other Azure services?
Microsoft Azure Cache for Redis is based on the popular open-source Azure Cache for Redis. It can be accessed by a wide variety of [Redis clients](https://redis.io/clients) for many programming languages. Each client has its own API that makes calls to the Azure Cache for Redis instance using [Redis commands](https://redis.io/commands).

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
>

For more information about using Azure Cache for Redis as a PHP session cache with the PhpRedis client, see [PHP Session handler](https://github.com/phpredis/phpredis#php-session-handler).

### What are Redis databases?

Redis Databases are just a logical separation of data within the same Redis instance. The cache memory is shared between all the databases and actual memory consumption of a given database depends on the keys/values stored in that database. For example, a C6 cache has 53 GB of memory. You can choose to put all 53 GB into one database or you can split it up between multiple databases. 

> [!NOTE]
> When using a Premium Azure Cache for Redis with clustering enabled, only database 0 is available. This limitation is an intrinsic Redis limitation and is not specific to Azure Cache for Redis. For more information, see [Do I need to make any changes to my client application to use clustering?](cache-how-to-premium-clustering.md#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
> 
> 


<a name="cache-ssl"></a>

### When should I enable the non-SSL port for connecting to Redis?
Redis server does not natively support SSL, but Azure Cache for Redis does. If you are connecting to Azure Cache for Redis and your client supports SSL, like StackExchange.Redis, then you should use SSL.

>[!NOTE]
>The non-SSL port is disabled by default for new Azure Cache for Redis instances. If your client does not support SSL, then you must enable the non-SSL port by following the directions in the [Access ports](cache-configure.md#access-ports) section of the [Configure a cache in Azure Cache for Redis](cache-configure.md) article.
>
>

Redis tools such as `redis-cli` do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](https://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post.

For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.

### What are some production best practices?
* [StackExchange.Redis best practices](#stackexchangeredis-best-practices)
* [Configuration and concepts](#configuration-and-concepts)
* [Performance testing](#performance-testing)

#### StackExchange.Redis best practices
* Set `AbortConnect` to false, then let the ConnectionMultiplexer reconnect automatically. [See here for details](https://gist.github.com/JonCole/36ba6f60c274e89014dd#file-se-redis-setabortconnecttofalse-md).
* Reuse the ConnectionMultiplexer - do not create a new one for each request. The `Lazy<ConnectionMultiplexer>` pattern [shown here](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache) is recommended.
* Redis works best with smaller values, so consider chopping up bigger data into multiple keys. In [this Redis discussion](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ), 100 kb is considered large. Read [this article](https://gist.github.com/JonCole/db0e90bedeb3fc4823c2#large-requestresponse-size) for an example problem that can be caused by large values.
* Configure your [ThreadPool settings](#important-details-about-threadpool-growth) to avoid timeouts.
* Use at least the default connectTimeout of 5 seconds. This interval gives StackExchange.Redis sufficient time to re-establish the connection in the event of a network blip.
* Be aware of the performance costs associated with different operations you are running. For instance, the `KEYS` command is an O(n) operation and should be avoided. The [redis.io site](https://redis.io/commands/) has details around the time complexity for each operation that it supports. Click each command to see the complexity for each operation.

#### Configuration and concepts
* Use Standard or Premium Tier for Production systems. The Basic Tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache. C0 caches are typically used for simple dev/test scenarios.
* Remember that Redis is an **In-Memory** data store. Read [this article](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md) so that you are aware of scenarios where data loss can occur.
* Develop your system such that it can handle connection blips [due to patching and failover](https://gist.github.com/JonCole/317fe03805d5802e31cfa37e646e419d#file-azureredis-patchingexplained-md).

#### Performance testing
* Start by using `redis-benchmark.exe` to get a feel for possible throughput before writing your own perf tests. Because `redis-benchmark` does not support SSL, you must [enable the Non-SSL port through the Azure portal](cache-configure.md#access-ports) before you run the test. For examples, see [How can I benchmark and test the performance of my cache?](#how-can-i-benchmark-and-test-the-performance-of-my-cache)
* The client VM used for testing should be in the same region as your Azure Cache for Redis instance.
* We recommend using Dv2 VM Series for your client as they have better hardware and should give the best results.
* Make sure your client VM you choose has at least as much computing and bandwidth capability as the cache you are testing.
* Enable VRSS on the client machine if you are on Windows. [See here for details](https://technet.microsoft.com/library/dn383582.aspx).
* Premium tier Redis instances have better network latency and throughput because they are running on better hardware for both CPU and Network.

<a name="cache-redis-commands"></a>

### What are some of the considerations when using common Redis commands?

* Avoid using certain Redis commands that take a long time to complete, unless you fully understand the impact of these commands. For example, do not run the [KEYS](https://redis.io/commands/keys) command in production. Depending on the number of keys, it could take a long time to return. Redis is a single-threaded server and it processes commands one at a time. If you have other commands issued after KEYS, they will not be processed until Redis processes the KEYS command. The [redis.io site](https://redis.io/commands/) has details around the time complexity for each operation that it supports. Click each command to see the complexity for each operation.
* Key sizes - should I use small key/values or large key/values? It depends on the scenario. If your scenario requires larger keys, you can adjust the ConnectionTimeout, then retry values and adjust your retry logic. From a Redis server perspective, smaller values give better performance.
* These considerations don't mean that you can't store larger values in Redis; you must be aware of the following considerations. Latencies will be higher. If you have one set of data that is larger and one that is smaller, you can use multiple ConnectionMultiplexer instances, each configured with a different set of timeout and retry values, as described in the previous [What do the StackExchange.Redis configuration options do](#cache-configuration) section.

<a name="cache-benchmarking"></a>

### How can I benchmark and test the performance of my cache?
* [Enable cache diagnostics](cache-how-to-monitor.md#enable-cache-diagnostics) so you can [monitor](cache-how-to-monitor.md) the health of your cache. You can view the metrics in the Azure portal and you can also [download and review](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) them using the tools of your choice.
* You can use redis-benchmark.exe to load test your Redis server.
* Ensure that the load testing client and the Azure Cache for Redis are in the same region.
* Use redis-cli.exe and monitor the cache using the INFO command.
* If your load is causing high memory fragmentation, you should scale up to a larger cache size.
* For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.

The following commands provide an example of using redis-benchmark.exe. For accurate results, run these commands from a VM in the same region as your cache.

* Test Pipelined SET requests using a 1k payload

  `redis-benchmark.exe -h **yourcache**.redis.cache.windows.net -a **yourAccesskey** -t SET -n 1000000 -d 1024 -P 50`
* Test Pipelined GET requests using a 1k payload.
  NOTE: Run the SET test shown above first to populate cache

  `redis-benchmark.exe -h **yourcache**.redis.cache.windows.net -a **yourAccesskey** -t GET -n 1000000 -d 1024 -P 50`

<a name="threadpool"></a>

### Important details about ThreadPool growth
The CLR ThreadPool has two types of threads - "Worker" and "I/O Completion Port" (IOCP) threads.

* Worker threads are used for things like processing the `Task.Run(…)`, or `ThreadPool.QueueUserWorkItem(…)` methods. These threads are also used by various components in the CLR when work needs to happen on a background thread.
* IOCP threads are used when asynchronous IO happens, such as when reading from the network.

The thread pool provides new worker threads or I/O completion threads on demand (without any throttling) until it reaches the "Minimum" setting for each type of thread. By default, the minimum number of threads is set to the number of processors on a system.

Once the number of existing (busy) threads hits the "minimum" number of threads, the ThreadPool will throttle the rate at which it injects new threads to one thread per 500 milliseconds. Typically, if your system gets a burst of work needing an IOCP thread, it will process that work quickly. However, if the burst of work is more than the configured "Minimum" setting, there will be some delay in processing some of the work as the ThreadPool waits for one of two things to happen.

1. An existing thread becomes free to process the work.
2. No existing thread becomes free for 500 ms, so a new thread is created.

Basically, it means that when the number of Busy threads is greater than Min threads, you are likely paying a 500-ms delay before network traffic is processed by the application. Also, it is important to note that when an existing thread stays idle for longer than 15 seconds (based on what I remember), it will be cleaned up and this cycle of growth and shrinkage can repeat.

If we look at an example error message from StackExchange.Redis (build 1.0.450 or later), you will see that it now prints ThreadPool statistics (see IOCP and WORKER details below).

    System.TimeoutException: Timeout performing GET MyKey, inst: 2, mgr: Inactive,
    queue: 6, qu: 0, qs: 6, qc: 0, wr: 0, wq: 0, in: 0, ar: 0,
    IOCP: (Busy=6,Free=994,Min=4,Max=1000),
    WORKER: (Busy=3,Free=997,Min=4,Max=1000)

In the previous example, you can see that for IOCP thread there are six busy threads and the system is configured to allow four minimum threads. In this case, the client would have likely seen two 500-ms delays, because 6 > 4.

Note that StackExchange.Redis can hit timeouts if growth of either IOCP or WORKER threads gets throttled.

### Recommendation

Given this information, we strongly recommend that customers set the minimum configuration value for IOCP and WORKER threads to something larger than the default value. We can't give one-size-fits-all guidance on what this value should be because the right value for one application will likely be too high or low for another application. This setting can also impact the performance of other parts of complicated applications, so each customer needs to fine-tune this setting to their specific needs. A good starting place is 200 or 300, then test and tweak as needed.

How to configure this setting:

* We recommend changing this setting programmatically by using the [ThreadPool.SetMinThreads (...)](/dotnet/api/system.threading.threadpool.setminthreads#System_Threading_ThreadPool_SetMinThreads_System_Int32_System_Int32_) method in `global.asax.cs`. For example:

```cs
private readonly int minThreads = 200;
void Application_Start(object sender, EventArgs e)
{
    // Code that runs on application startup
    AreaRegistration.RegisterAllAreas();
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
    ThreadPool.SetMinThreads(minThreads, minThreads);
}
```

  > [!NOTE]
  > The value specified by this method is a global setting, affecting the whole AppDomain. For example, if you have a 4-core machine and want to set *minWorkerThreads* and *minIoThreads* to 50 per CPU during run-time, you would use **ThreadPool.SetMinThreads(200, 200)**.

* It is also possible to specify the minimum threads setting by using the [*minIoThreads* or *minWorkerThreads* configuration setting](https://msdn.microsoft.com/library/vstudio/7w2sway1(v=vs.100).aspx) under the `<processModel>` configuration element in `Machine.config`, usually located at `%SystemRoot%\Microsoft.NET\Framework\[versionNumber]\CONFIG\`. **Setting the number of minimum threads in this way is generally not recommended, because it is a System-wide setting.**

  > [!NOTE]
  > The value specified in this configuration element is a *per-core* setting. For example, if you have a 4-core machine and want your *minIoThreads* setting to be 200 at runtime, you would use `<processModel minIoThreads="50"/>`.
  >

<a name="server-gc"></a>

### Enable server GC to get more throughput on the client when using StackExchange.Redis
Enabling server GC can optimize the client and provide better performance and throughput when using StackExchange.Redis. For more information on server GC and how to enable it, see the following articles:

* [To enable server GC](/dotnet/framework/configure-apps/file-schema/runtime/gcserver-element)
* [Fundamentals of Garbage Collection](/dotnet/standard/garbage-collection/fundamentals)
* [Garbage Collection and Performance](/dotnet/standard/garbage-collection/performance)


### Performance considerations around connections

Each pricing tier has different limits for client connections, memory, and bandwidth. While each size of cache allows *up to* a certain number of connections, each connection to Redis has overhead associated with it. An example of such overhead would be CPU and memory usage as a result of TLS/SSL encryption. The maximum connection limit for a given cache size assumes a lightly loaded cache. If load from connection overhead *plus* load from client operations exceeds capacity for the system, the cache can experience capacity issues even if you have not exceeded the connection limit for the current cache size.

For more information about the different connections limits for each tier, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). For more information about connections and other default configurations, see [Default Redis server configuration](cache-configure.md#default-redis-server-configuration).

<a name="cache-monitor"></a>

### How do I monitor the health and performance of my cache?
Microsoft Azure Cache for Redis instances can be monitored in the [Azure portal](https://portal.azure.com). You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. For more information, see [Monitor Azure Cache for Redis](cache-how-to-monitor.md).

The Azure Cache for Redis **Resource menu** also contains several tools for monitoring and troubleshooting your caches.

* **Diagnose and solve problems** provides information about common issues and strategies for resolving them.
* **Resource health** watches your resource and tells you if it's running as expected. For more information about the Azure Resource health service, see [Azure Resource health overview](../resource-health/resource-health-overview.md).
* **New support request** provides options to open a support request for your cache.

These tools enable you to monitor the health of your Azure Cache for Redis instances and help you manage your caching applications. For more information, see the "Support & troubleshooting settings" section of [How to configure Azure Cache for Redis](cache-configure.md).

<a name="cache-timeouts"></a>

### Why am I seeing timeouts?
Timeouts happen in the client that you use to talk to Redis. When a command is sent to the Redis server, the command is queued up and Redis server eventually picks up the command and executes it. However the client can time out during this process and if it does an exception is raised on the calling side. For more information on troubleshooting timeout issues, see [Client-side troubleshooting](cache-how-to-troubleshoot.md#client-side-troubleshooting) and [StackExchange.Redis timeout exceptions](cache-how-to-troubleshoot.md#stackexchangeredis-timeout-exceptions).

<a name="cache-disconnect"></a>

### Why was my client disconnected from the cache?
The following are some common reason for a cache disconnect.

* Client-side causes
  * The client application was redeployed.
  * The client application performed a scaling operation.
    * In the case of Cloud Services or Web Apps, this may be due to autoscaling.
  * The networking layer on the client side changed.
  * Transient errors occurred in the client or in the network nodes between the client and the server.
  * The bandwidth threshold limits were reached.
  * CPU bound operations took too long to complete.
* Server-side causes
  * On the standard cache offering, the Azure Cache for Redis service initiated a fail-over from the primary node to the secondary node.
  * Azure was patching the instance where the cache was deployed
    * This can be for Redis server updates or general VM maintenance.

### Which Azure Cache offering is right for me?
> [!IMPORTANT]
> As per last year's [announcement](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/), Azure Managed Cache Service and Azure In-Role Cache service **have been retired** on November 30, 2016. Our recommendation is to use [Azure Cache for Redis](https://azure.microsoft.com/services/cache/). For information on migrating, see [Migrate from Managed Cache Service to Azure Cache for Redis](cache-migrate-to-redis.md).
>
>

### Azure Cache for Redis
Azure Cache for Redis is Generally Available in sizes up to 53 GB and has an availability SLA of 99.9%. The new [premium tier](cache-premium-tier-intro.md) offers sizes up to 530 GB and support for clustering, VNET, and persistence, with a 99.9% SLA.

Azure Cache for Redis gives customers the ability to use a secure, dedicated Azure Cache for Redis, managed by Microsoft. With this offer, you get to leverage the rich feature set and ecosystem provided by Redis, and reliable hosting and monitoring from Microsoft.

Unlike traditional caches that deal only with key-value pairs, Redis is popular for its highly performant data types. Redis also supports running atomic operations on these types, like appending to a string; incrementing the value in a hash; pushing to a list; computing set intersection, union and difference; or getting the member with highest ranking in a sorted set. Other features include support for transactions, pub/sub, Lua scripting, keys with a limited time-to-live, and configuration settings to make Redis behave more like a traditional cache.

Another key aspect to Redis success is the healthy, vibrant open- source ecosystem built around it. This is reflected in the diverse set of Redis clients available across multiple languages. This ecosystem and wide range of clients allow Azure Cache for Redis to be used by nearly any workload you would build inside of Azure.

For more information about getting started with Azure Cache for Redis, see [How to Use Azure Cache for Redis](cache-dotnet-how-to-use-azure-redis-cache.md) and [Azure Cache for Redis documentation](index.md).

### Managed Cache service
[Managed Cache service was retired November 30, 2016.](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/)

To view archived documentation, see [Archived Managed Cache Service Documentation](/previous-versions/azure/azure-services/dn386094(v=azure.100)).

### In-Role Cache
[In-Role Cache was retired November 30, 2016.](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/)

To view archived documentation, see [Archived In-Role Cache Documentation](/previous-versions/azure/azure-services/dn386103(v=azure.100)).

["minIoThreads" configuration setting]: https://msdn.microsoft.com/library/vstudio/7w2sway1(v=vs.100).aspx
