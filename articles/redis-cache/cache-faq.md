<properties 
	pageTitle="Azure Redis Cache FAQ | Microsoft Azure" 
	description="Learn the answers to common questions, patterns and best practices for Azure Redis Cache" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/28/2016" 
	ms.author="sdanie"/>

# Azure Redis Cache FAQ

Learn the answers to common questions, patterns and best practices for Azure Redis Cache. 





## Planning FAQs

-	[What Redis Cache offering and size should I use?](#what-redis-cache-offering-and-size-should-i-use)
-	[Azure Redis Cache performance](#azure-redis-cache-performance)
-	[In what region should I locate my cache?](#in-what-region-should-i-locate-my-cache)
-	[How am I billed for Azure Redis Cache?](#how-am-i-billed-for-azure-redis-cache)

<a name="cache-size"></a>
### What Redis Cache offering and size should I use?
Each Azure Redis Cache offering provides different levels of **size**, **bandwidth**, **high availability** and **SLA** options.

The following are considerations for choosing a Cache offering.

-	**Memory**: The Basic and Standard tiers offer 250 MB – 53 GB. The Premium tier offers up to 530 GB with more available [on request](mailto:wapteams@microsoft.com?subject=Redis%20Cache%20quota%20increase). For more information see [Azure Redis Cache Pricing](https://azure.microsoft.com/pricing/details/cache/).
-	**Network Performance**: If you have a workload that requires high throughput the Premium tier offers more bandwidth compared to Standard or Basic. Also within each tier larger sizes caches have more bandwidth because of the underlying VM that hosts the cache. Please see the [following table](#cache-performance) for more information.
-	**Throughput**: The Premium tier offers the maximum available throughput. If the cache server or client reaches the bandwidth limits, you will receive timeouts on the client side. Please see the following table for more information.
-	**High Availability/SLA**: Azure Redis Cache guarantees that a Standard/Premium cache will be available at least 99.9% of the time. To learn more about our SLA,  see [Azure Redis Cache Pricing](https://azure.microsoft.com/support/legal/sla/cache/v1_0/). The SLA only covers connectivity to the Cache endpoints. The SLA does not cover protection from data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss.
-	**Redis Data Persistence**: The Premium tier allows you to persist the cache data in an Azure Storage account. In a Basic/Standard cache all the data is stored only in memory. In case of underlying infrastructure issues there can be potential data loss. We recommend using the Redis data persistence feature in the Premium tier to increase resiliency against data loss. Azure Redis Cache offers RDB and AOF (coming soon) options in Redis persistence. For more information, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md).
-	**Redis Cluster**: If you want to create caches larger than 53 GB or want to shard data across multiple Redis nodes, you can use Redis clustering which is available in the Premium tier. Each node consists of a primary/replica cache pair for high availability. For more information, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md).
-	**Enhanced security and network isolation**: Azure Virtual Network (VNET) deployment provides enhanced security and isolation for your Azure Redis Cache, as well as subnets, access control policies, and other features to further restrict access. For more information, see [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).
-	**Configure Redis**: In both the Standard and Premium tiers, you can configure Redis for Keyspace notifications.
-	**Maximum number of client connections**: The Premium tier offers the maximum number of clients that can connect to Redis, with a higher number of connections for larger sized caches. [Please refer to the pricing page for details](https://azure.microsoft.com/pricing/details/cache/).
-	**Dedicated Core for Redis Server**: In the Premium tier all cache sizes have a dedicated core for Redis. In the Basic/Standard tiers the C1  size and above have a dedicated core for Redis server.
-	**Redis is single-threaded** so having more than two cores does not provide additional benefit over having just two cores, but larger VM sizes typically have more bandwidth than smaller sizes. If the cache server or client reaches the bandwidth limits, then you will receive timeouts on the client side.
-	**Performance improvements**: Caches in the Premium tier are deployed on hardware which have faster processors and gives better performance compared to the Basic or Standard tier. Premium tier Caches have higher throughput and lower latencies.

<a name="cache-performance"></a>
### Azure Redis Cache performance

The following table shows the maximum bandwidth values observed while testing various sizes of Standard and Premium caches using `redis-benchmark.exe` from an Iaas VM against the Azure Redis Cache endpoint. Note that these values are not guaranteed and there is no SLA for these numbers, but should be typical. You should load test your own application to determine the right cache size for your application.

From this table we can draw the following conclusions.

-	Throughput for the same sized Cache is higher in Premium as compared to Standard tier. Eg. For a 6 GB Cache, throughput of P1 is 140K RPS as compared to 49K for C3.
-	With Redis clustering, throughput increases linearly as you increase the number of shards (nodes) in the cluster. Eg. If you create a P4 cluster of 10 shards, then the available throughput is 250K *10 = 2.5 Million RPS
-	Throughput for bigger key sizes is higher in Premium tier as compared to Standard Tier.

| Pricing tier             | Size   | CPU cores | Available bandwidth                                    | 1 KB Key size                            |
|--------------------------|--------|-----------|--------------------------------------------------------|------------------------------------------|
| **Standard cache sizes** |        |           | **Megabits per sec (Mb/s) / Megabytes per sec (MB/s)** | **Requests per second (RPS)**            |
| C0                       | 250 MB | Shared    | 5 / 0.625                                              | 600                                      |
| C1                       | 1 GB   | 1         | 100 / 12.5                                             | 12200                                    |
| C2                       | 2.5 GB | 2         | 200 / 25                                               | 24000                                    |
| C3                       | 6 GB   | 4         | 400 / 50                                               | 49000                                    |
| C4                       | 13 GB  | 2         | 500 / 62.5                                             | 61000                                    |
| C5                       | 26 GB  | 4         | 1000 / 125                                             | 115000                                   |
| C6                       | 53 GB  | 8         | 2000 / 250                                             | 150000                                   |
| **Premium cache sizes**  |        | **CPU cores per shard**  |                                         | **Requests per second (RPS), per shard** |
| P1                       | 6 GB   | 2         | 1000 / 125                                             | 140000                                   |
| P2                       | 13 GB  | 4         | 2000 / 250                                             | 220000                                   |
| P3                       | 26 GB  | 4         | 2000 / 250                                             | 220000                                   |
| P4                       | 53 GB  | 8         | 4000 / 500                                             | 250000                                   |


For instructions on downloading the Redis tools such as `redis-benchmark.exe`, see the [How can I run Redis commands?](#cache-commands) section.

<a name="cache-region"></a>
### In what region should I locate my cache?

For best performance and lowest latency, locate your Azure Redis Cache in the same region as your cache client application.

<a name="cache-billing"></a>
### How am I billed for Azure Redis Cache?

Azure Redis Cache pricing is [here](https://azure.microsoft.com/pricing/details/cache/). The pricing page lists pricing as an hourly rate. Caches are billed on a per-minute basis from the time that the cache is created until the time that a cache is deleted. There is no option for stopping or pausing the billing of a cache.

## Development FAQs

-	[What do the StackExchange.Redis configuration options do?](#what-do-the-stackexchangeredis-configuration-options-do)
-	[What Redis cache clients can I use?](#what-redis-cache-clients-can-i-use)
-	[Is there a local emulator for Azure Redis Cache?](#is-there-a-local-emulator-for-azure-redis-cache)
-	[How can I run Redis commands?](#how-can-i-run-redis-commands)
-	[Why doesn't Azure Redis Cache have an MSDN class library reference like some of the other Azure services?](#why-doesnt-azure-redis-cache-have-an-msdn-class-library-reference-like-some-of-the-other-azure-services)

<a name="cache-configuration"></a>
### What do the StackExchange.Redis configuration options do?

StackExchange.Redis has many options. This section talks about some of the common settings. For more detailed information about StackExchange.Redis options, see [StackExchange.Redis configuration](https://github.com/StackExchange/StackExchange.Redis/blob/master/Docs/Configuration.md).

ConfigurationOptions|Description|Recommendation
---|---|---
AbortOnConnectFail|When set to true, the connection will not reconnect after a network failure.|Set to false and let StackExchange.Redis reconnect automatically.
ConnectRetry|The number of times to repeat connection attempts during initial connect.| See below for guidance. |
ConnectTimeout|Timeout in ms for connect operations.| See below for guidance. |

In most cases the default values of the client are sufficient. You can fine tune the options based on your workload.

-	**Retries**
	-	For ConnectRetry and ConnectTimeout the general guidance is to fail fast and retry again. This is based on your workload and how much time on average it takes for your client to issue a Redis command and receive a response.
	-	Let StackExchange.Redis automatically reconnect instead of checking connection status and reconnecting yourself. **Avoid using the ConnectionMultiplexer.IsConnected property**.
	-	Snowballing - sometimes you may run into an issue where you are retrying and this snowballs and never recovers. In this case you should consider using an exponential backoff retry algorithm as described in [Retry general guidance](best-practices-retry-general.md) published by the Microsoft Patterns & Practices group.
-	**Timeout values**
	-	Consider your workload and set the values accordingly. If you are storing large values, set the timeout to a higher value.
	-	Set `AbortOnConnectFail` to false and let StackExchange.Redis reconnect for you.
	-	Use a single ConnectionMultiplexer instance for the application. You can use a LazyConnection to create a single instance that is returned by a Connection property, as shown in [Connect to the cache using the ConnectionMultiplexer class](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache).
	-	Set the `ConnectionMultiplexer.ClientName` property to an app instance unique name for diagnostic purposes.
	-	Use multiple `ConnectionMultiplexer` instances for custom workloads.
	-	You can follow this model if you have varying load in your application. For example:
	-	You can have one multiplexer for dealing with large keys.
	-	You can have one multiplexer for dealing with small keys.
	-	You can set different values for connection timeouts and retry logic for each ConnectionMultiplexer that you use.
	-	Set the `ClientName` property on each multiplexer to help with diagnostics.
	-	This will lead to more streamlined latency per `ConnectionMultiplexer`.

### What Redis cache clients can I use?

One of the great things about Redis is that there are many clients supporting many different development languages. For a current list of clients, see [Redis clients](http://redis.io/clients). For tutorials that cover several different languages and clients, see [How to use Azure Redis Cache](cache-dotnet-how-to-use-azure-redis-cache.md) and click the desired language from the language switcher at the top of the article.

[AZURE.INCLUDE [redis-cache-create](../../includes/redis-cache-access-keys.md)]

<a name="cache-emulator"></a>
### Is there a local emulator for Azure Redis Cache?

There is no local emulator for Azure Redis Cache, but you can run the MSOpenTech version of redis-server.exe from the [Redis command line tools](https://github.com/MSOpenTech/redis/releases/) on your local machine and connect to it to get a similar experience to a local cache emulator, as shown in the following example.


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


You can optionally configure a [redis.conf](http://redis.io/topics/config) file to more closely match the [default cache settings](cache-configure.md#default-redis-server-configuration) for your online Azure Redis Cache if desired.

<a name="cache-commands"></a>
### How can I run Redis commands?

You can use any of the commands listed at [Redis commands](http://redis.io/commands#) except for the commands listed at [Redis commands not supported in Azure Redis Cache](cache-configure.md#redis-commands-not-supported-in-azure-redis-cache). To run Redis commands you have several options.

-	If you have a Standard or Premium cache, you can run Redis commands using the [Redis Console](cache-configure.md#redis-console). This provides a secure way to run Redis commands in the Azure Portal.
-	You can also use the Redis command line tools. To use them, perform the following steps.
-	Download the [Redis command line tools](https://github.com/MSOpenTech/redis/releases/).
-	Connect to the cache using `redis-cli.exe`. Pass in the cache endpoint using the -h switch and the key using -a as shown in the following example.
-	`redis-cli -h <your cache="" name="">
.redis.cache.windows.net -a <key>
  `
  -	Note that the Redis command line tools do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post.

<a name="cache-reference"></a>
### Why doesn't Azure Redis Cache have an MSDN class library reference like some of the other Azure services?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache and can be accessed by a wide variety of [Redis clients](http://redis.io/clients) which are available for many programming languages. Each client has its own API that makes calls to the Redis cache instance using [Redis commands](http://redis.io/commands).

Because each client is different, there is not one centralized class reference on MSDN; instead each client maintains its own reference documentation. In addition to the reference documentation, there are several tutorials showing how to get started with Azure Redis Cache using different languages and cache clients. To access these tutorials, see [How to use Azure Redis Cache](cache-dotnet-how-to-use-azure-redis-cache.md) and click the desired language from the language switcher at the top of the article.


## Security FAQs

-	[When should I enable the non-SSL port for connecting to Redis?](#when-should-i-enable-the-non-ssl-port-for-connecting-to-redis)

<a name="cache-ssl"></a>
### When should I enable the non-SSL port for connecting to Redis?

Redis server does not support SSL out of the box, but Azure Redis Cache does. If you are connecting to Azure Redis Cache and your client supports SSL, like StackExchange.Redis, then you should use SSL.

Note that the non-SSL port is disabled by default for new Azure Redis Cache instances. If your client does not support SSL, then you must enable the non-SSL port by following the directions in the [Access ports](cache-configure.md#access-ports) section of the [Configure a cache in Azure Redis Cache](cache-configure.md) article.

Redis tools such as `redis-cli` do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post.

For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.

## Production FAQs

-	[What are some of the considerations when using common Redis commands?](#what-are-some-of-the-considerations-when-using-common-redis-commands)
-	[How can I benchmark and test the performance of my cache?](#how-can-i-benchmark-and-test-the-performance-of-my-cache)
-	[Important details about ThreadPool growth](#important-details-about-threadpool-growth)
-	[Enable server GC to get more throughput on the client when using StackExchange.Redis](#enable-server-gc-to-get-more-throughput-on-the-client-when-using-stackexchangeredis)


<a name="cache-redis-commands"></a>
### What are some of the considerations when using common Redis commands?

-	You should not run certain Redis commands which take a long time to complete without understanding the impact of these commands.
-	For example, do not run the [KEYS](http://redis.io/commands/keys) command in production as it could take a long time to return depending on the number of keys. Redis is a single-threaded server and it processes commands one at a time. If you have other commands issued after KEYS, they will not be processed until Redis processes the KEYS command.
-	Key sizes - should I use small key/values or large key/values? In general it depends on the scenario. If your scenario requires larger keys then you can adjust the ConnectionTimeout and retry values and adjust your retry logic. From a Redis server perspective, smaller values are observed to have better performance.
-	This does not mean that you can't store larger values in Redis; you must be aware of the following considerations. Latencies will be higher. If you have one set of data that is larger and one that is smaller, you can use multiple ConnectionMultiplexer instances, each configured with a different set of timeout and retry values, as described in the previous [What do the StackExchange.Redis configuration options do](#cache-configuration) section.



<a name="cache-benchmarking"></a>
### How can I benchmark and test the performance of my cache?

-	[Enable cache diagnostics](cache-how-to-monitor.md#enable-cache-diagnostics) so you can [monitor](cache-how-to-monitor.md) the health of your cache. You can view the metrics in the Azure Portal and you can also [download and review](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) them using the tools of your choice.
-	You can use redis-benchmark.exe to load test your Redis server.
-	Ensure that the load testing client and the Redis cache are in the same region.
-	Use redis-cli.exe and monitor the cache using the INFO command.
-	If your load is causing high memory fragmentation then you should scale up to a larger cache size.
-	For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.


<a name="threadpool"></a>
### Important details about ThreadPool growth

The CLR ThreadPool has two types of threads - "Worker" and "I/O Completion Port" (aka IOCP) threads.  

-	Worker threads are used when for things like processing `Task.Run(…)` or `ThreadPool.QueueUserWorkItem(…)` methods.  These threads are also used by various components in the CLR when work needs to happen on a background thread.
-	IOCP threads are used when asynchronous IO happens (e.g. reading from the network).  

The thread pool provides new worker threads or I/O completion threads on demand (without any throttling) until it reaches the "Minimum" setting for each type of thread.  By default, the minimum number of threads is set to the number of processors on a system.  

Once the number of existing (busy) threads hits the "minimum" number of threads, the ThreadPool will throttle the rate at which is injects new threads to one thread per 500 milliseconds.  This means that if your system gets a burst of work needing an IOCP thread, it will process that work very quickly.   However, if the burst of work is more than the configured "Minimum" setting, there will be some delay in processing some of the work as the ThreadPool waits for one of two things to happen.

1. An existing thread becomes free to process the work.
1. No existing thread becomes free for 500ms, so a new thread is created.

Basically, it means that when the number of Busy threads is greater than Min threads, you are likely paying a 500ms delay before network traffic is processed by the application.  Also, it is important to note that when an existing thread stays idle for longer than 15 seconds (based on what I remember), it will be cleaned up and this cycle of growth and shrinkage can repeat.

If we look at an example error message from StackExchange.Redis (build 1.0.450 or later), you will see that it now prints ThreadPool statistics (see IOCP and WORKER details below).

	System.TimeoutException: Timeout performing GET MyKey, inst: 2, mgr: Inactive, 
	queue: 6, qu: 0, qs: 6, qc: 0, wr: 0, wq: 0, in: 0, ar: 0, 
	IOCP: (Busy=6,Free=994,Min=4,Max=1000), 
	WORKER: (Busy=3,Free=997,Min=4,Max=1000)

In the above example, you can see that for IOCP thread there are 6 busy threads and the system is configured to allow 4 minimum threads.  In this case, the client would have likely seen two 500 ms delays because 6 > 4.

Note that StackExchange.Redis can hit timeouts if growth of either IOCP or WORKER threads gets throttled.

### Recommendation

Given this information, we strongly recommend that customers set the minimum configuration value for IOCP and WORKER threads to something larger than the default value.  We can't give one-size-fits-all guidance on what this value should be because the right value for one application will be too high/low for another application.  This setting can also impact the performance of other parts of complicated applications, so each customer needs to fine-tune this setting to their specific needs.  A good starting place is 200 or 300, then test and tweak as needed.

How to configure this setting:

-	In ASP.NET, use the ["minIoThreads" configuration setting][] under the `<processModel>` configuration element in web.config.  If you are running inside of Azure WebSites, this setting is not exposed through the configuration options.  However, you should still be able to set this programmatically (see below) from your Application_Start method in global.asax.cs.

> **Important Note:** the value specified in this configuration element is a *per-core* setting.  For example, if you have a 4 core machine and want your minIOThreads setting to be 200 at runtime, you would use `<processModel minIoThreads="50"/>`.

-	Outside of ASP.NET, use the [ThreadPool.SetMinThreads(…)](https://msdn.microsoft.com/library/system.threading.threadpool.setminthreads.aspx) API.

<a name="server-gc"></a>
### Enable server GC to get more throughput on the client when using StackExchange.Redis

Enabling server GC can optimize the client and provide better performance and throughput when using StackExchange.Redis. For more information on server GC and how to enable it, see the following articles.

-	[To enable server GC](https://msdn.microsoft.com/library/ms229357.aspx)
-	[Fundamentals of Garbage Collection](https://msdn.microsoft.com/library/ee787088.aspx)
-	[Garbage Collection and Performance](https://msdn.microsoft.com/library/ee851764.aspx)





## Monitoring and troubleshooting FAQs

The FAQs in this section cover common monitoring and troubleshooting questions. For more information about monitoring and troubleshooting your Azure Redis Cache instances, see [How to monitor Azure Redis Cache](cache-how-to-monitor.md) and [How to troubleshoot Azure Redis Cache](cache-how-to-troubleshoot.md).

-	[How do I monitor the health and performance of my cache?](#how-do-i-monitor-the-health-and-performance-of-my-cache)
-	[My cache diagnostics storage account settings changed, what happened?](#my-cache-diagnostics-storage-account-settings-changed-what-happened)
-	[Why is diagnostics enabled for some new caches but not others?](#why-is-diagnostics-enabled-for-some-new-caches-but-not-others)
-	[Why am I seeing timeouts?](#why-am-i-seeing-timeouts)
-	[Why was my client disconnected from the cache?](#why-was-my-client-disconnected-from-the-cache)

<a name="cache-monitor"></a>
### How do I monitor the health and performance of my cache?

Microsoft Azure Redis Cache instances can be monitored in the [Azure Portal](https://portal.azure.com). You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. For more information, see [Monitor Azure Redis Cache](cache-how-to-monitor.md).

The **Support + troubleshooting** section of the Redis Cache **Settings** blade also contains several tools for monitoring and troubleshooting your caches. 

-	**Troubleshoot** provides information about common issues and strategies for resolving them.
-	**Audit logs** provides information on actions performed on your cache. You can also use filtering to expand this view to include other resources.
-	**Resource health** watches your resource and tells you if it's running as expected. For more information about the Azure Resource health service, see [Azure Resource health overview](../resource-health/resource-health-overview.md).
-	**New support request** provides options to open a support request for your cache.

These tools enable you to monitor the health of your Azure Redis Cache instances and help you manage your caching applications. For more information, see [Support & troubleshooting settings](cache-configure.md#support-amp-troubleshooting-settings).

### My cache diagnostics storage account settings changed, what happened?

Caches in the same region and subscription share the same diagnostics storage settings, and if the configuration is changed (diagnostics enabled/disabled or changing the storage account) it applies to all caches in the subscription that are in that region. If the diagnostics settings for your cache have changed, check to see if the diagnostic settings for another cache in the same subscription and region have changed. One way to check is to view the audit logs for your cache for a `Write DiagnosticSettings` event. For more information on working with audit logs, see [View events and audit logs](../azure-portal/insights-debugging-with-events.md) and [Audit operations with Resource Manager](../resource-group-audit.md). For more information on monitoring Azure Redis Cache events, see [Operations and alerts](cache-how-to-monitor.md#operations-and-alerts).

### Why is diagnostics enabled for some new caches but not others?

Caches in the same region and subscription share the same diagnostics storage settings. If you create a new cache in the same region and subscription as another cache that has diagnostics enabled, diagnostics is enabled on the new cache using the same settings.


<a name="cache-timeouts"></a>
### Why am I seeing timeouts?

Timeouts happen in the client that you use to talk to Redis. For the most part Redis server does not time out. When a command is sent to the Redis server, the command is queued up and Redis server eventually picks up the command and executes it. However the client can time out during this process and if it does an exception is raised on the calling side. For more information on troubleshooting timeout issues, see [Client side troubleshooting](cache-how-to-troubleshoot.md#client-side-troubleshooting) and [StackExchange.Redis timeout exceptions](Client side troubleshooting](cache-how-to-troubleshoot.md#stackexchangeredis-timeout-exceptions).

'<-- Loc Comment: Broken link: [StackExchange.Redis timeout exceptions](Client side troubleshooting](cache-how-to-troubleshoot.md#stackexchangeredis-timeout-exceptions). "(Client side troubleshooting]" should be removed. -->'

<a name="cache-disconnect"></a>
### Why was my client disconnected from the cache?

The following are some common reason for a cache disconnect.

-	Client-side causes
	-	The client application was redeployed.
	-	The client application performed a scaling operation.
		-	In the case of Cloud Services or Web Apps, this may be due to auto-scaling.
	-	The networking layer on the client side changed.
	-	Transient errors occurred in the client or in the network nodes between the client and the server.
	-	The bandwidth threshold limits were reached.
	-	CPU bound operations took too long to complete.
-	Server-side causes
	-	On the standard cache offering, the Azure Redis Cache service initiated a fail-over from the primary node to the secondary node.
	-	Azure was patching the instance where the cache was deployed
		-	This can be for Redis server updates or general VM maintenance.





## Prior Cache offering FAQs

-	[Which Azure Cache offering is right for me?](#which-azure-cache-offering-is-right-for-me)

### Which Azure Cache offering is right for me?

>[AZURE.IMPORTANT]As per last year's [announcement](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/), Azure Managed Cache Service and Azure In-Role Cache service will be retired on November 30, 2016. Our recommendation is to use [Azure Redis Cache](https://azure.microsoft.com/services/cache/). For information on migrating, please see [Migrate from Managed Cache Service to Azure Redis Cache](cache-migrate-to-redis.md).

### Azure Redis Cache
Azure Redis Cache is Generally Available in sizes up to 53 GB and has an availability SLA of 99.9%. The new [premium tier](cache-premium-tier-intro.md) offers sizes up to 530 GB and support for clustering, VNET, and persistence, with a 99.9% SLA.

Azure Redis Cache gives customers the ability to use a secure, dedicated Redis cache, managed by Microsoft. With this offer, you get to leverage the rich feature set and ecosystem provided by Redis, and reliable hosting and monitoring from Microsoft.

Unlike traditional caches which deal only with key-value pairs, Redis is popular for its highly performant data types. Redis also supports running atomic operations on these types, like appending to a string; incrementing the value in a hash; pushing to a list; computing set intersection, union and difference; or getting the member with highest ranking in a sorted set. Other features include support for transactions, pub/sub, Lua scripting, keys with a limited time-to-live, and configuration settings to make Redis behave more like a traditional cache.

Another key aspect to Redis success is the healthy, vibrant open source ecosystem built around it. This is reflected in the diverse set of Redis clients available across multiple languages. This allows it to be used by nearly any workload you would build inside of Azure. 

For more information about getting started with Azure Redis Cache, see [How to Use Azure Redis Cache](cache-dotnet-how-to-use-azure-redis-cache.md) and [Azure Redis Cache documentation](https://azure.microsoft.com/documentation/services/redis-cache/).

### Managed Cache service
[Managed Cache service is set to be retired November 30, 2016.](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/)

### In-Role Cache
[In-Role Cache is set to be retired November 30, 2016.](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/)





["minIoThreads" configuration setting]: https://msdn.microsoft.com/library/vstudio/7w2sway1(v=vs.100).aspx
