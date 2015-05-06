<properties 
	pageTitle="Azure Redis Cache FAQ" 
	description="Learn the answers to common questions, patterns and best practices for Azure Redis Cache" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/01/2015" 
	ms.author="sdanie"/>

# Azure Redis Cache FAQ

Learn the answers to common questions, patterns and best practices for Azure Redis Cache.

<a name="cache-size"></a>
## What Redis Cache offering and size should I use?

Each Azure Redis Cache offering provides different levels of **size**, **bandwidth**, **high availability** and **SLA** options.

-	Basic SKU - Single node, no replication or SLA, cache sizes from 250 MB up to 53 GB.
-	Standard SKU - Primary/Secondary nodes with automatic replication, 99.9% SLA, cache sizes from 250 MB to 53 GB.

If you desire high availability, choose the standard cache offering which has a 99.9% SLA. For development and prototyping, or for scenarios where an SLA is not required, the basic offering could be appropriate.

The cache sizes and bandwidth map roughly to the sizes and bandwidth of the virtual machines that host the cache. The 250 MB sizes for both the basic and standard offerings are hosted on the Extra Small (A0) virtual machine size, which is hosted using shared cores, while the other sizes are hosted using dedicated cores. The 1 GB cache sizes are hosted on the Small (A1) virtual machine size, which has 1 dedicated virtual core that is used to service both the operating system and the redis cache. Larger cache sizes are hosted on larger VM instances with multiple dedicated virtual cores.

If your cache has a high throughput, choose the 1 GB size or larger so that the cache is running using dedicated cores. The 1 GB cache size is hosted on a 1 core virtual machine. This core is used to service both the OS and the cache. Caches larger than 1 GB run on virtual machines with multiple cores, and the Redis cache uses a dedicated core that is not shared with the OS.

**Redis is single-threaded** so having more than two cores does not provide additional benefit over having just two cores, but **larger VM sizes typically have more bandwidth than smaller sizes**. If the cache server or client reaches the bandwidth limits, then you will receive timeouts on the client side.

The following table shows the maximum bandwidth values observed while testing various sizes of Azure Redis Cache using `redis-benchmark.exe` from an Iaas VM against the Azure Redis Cache endpoint. Note that these values are not guaranteed and there is no SLA for these number, but should be typical. You should load test your own application to determine the right cache size for your application.

<table>
  <tr>
    <th>Cache Name</th>
    <th>Cache Size</th>
    <th>Get/sec (Simple GET calls of 1 KB values)</th>
    <th>Bandwidth (MBits/sec)</th>
  </tr>
  <tr>
    <td>C0</td>
    <td>250 MB</td>
    <td>610</td>
    <td>5</td>
  </tr>
  <tr>
    <td>C1</td>
    <td>1 GB</td>
    <td>12,200</td>
    <td>100</td>
  </tr>
  <tr>
    <td>C2</td>
    <td>2.5 GB</td>
    <td>24,300</td>
    <td>200</td>
  </tr>
  <tr>
    <td>C3</td>
    <td>6 GB</td>
    <td>48,875</td>
    <td>400</td>
  </tr>
  <tr>
    <td>C4</td>
    <td>13 GB</td>
    <td>61,350</td>
    <td>500</td>
  </tr>
  <tr>
    <td>C5</td>
    <td>26 GB</td>
    <td>112,275</td>
    <td>1000</td>
  </tr>
  <tr>
    <td>C6</td>
    <td>53 GB</td>
    <td>153,219</td>
    <td>1000+</td>
  </tr>
</table>

For instructions on downloading the Redis tools such as `redis-benchmark.exe`, see the [How can I run Redis commands?](#cache-commands) section.

<a name="cache-region"></a>
## In what region should I locate my cache?

For best performance and lowest latency, locate your Azure Redis Cache in the same region as your cache client application.

<a name="cache-timeouts"></a>
## Why am I seeing timeouts?

Timeouts happen in the client that you use to talk to Redis. For the most part Redis server does not time out. When a command is sent to the Redis server, the command is queued up and Redis server eventually picks up the command and executes it. However the client can time out during this process and if it does an exception is raised on the calling side. For more information on troubleshooting timeout issues, see [Investigating timeout exceptions in StackExchange.Redis for Azure Redis Cache](http://azure.microsoft.com/blog/2015/02/10/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

<a name="cache-monitor"></a>
## How do I monitor the health and performance of my cache?

Microsoft Azure Redis Cache instances can be monitored in the [Azure Preview Portal](https://portal.azure.com). You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. These tools enable you to monitor the health of your Azure Redis Cache instances and help you manage your caching applications. For more information on monitoring your caches, see [Monitor Azure Redis Cache](https://msdn.microsoft.com/library/azure/dn763945.aspx).

<a name="cache-disconnect"></a>
## Why was my client disconnected from the cache?

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

<a name="cache-configuration"></a>
## What do the StackExchange.Redis configuration options do?

StackExchange.Redis has many options. This section talks about some of the common settings. For more detailed information about StackExchange.Redis options, see [StackExchange.Redis configuration](https://github.com/StackExchange/StackExchange.Redis/blob/master/Docs/Configuration.md).

<table>
  <tr>
    <th>ConfigurationOptions</th>
    <th>Description</th>
    <th>Recommendation</th>
  </tr>
  <tr>
    <td>AbortOnConnectFail</td>
    <td>When set to true, the connection will not reconnect after a network failure.</td>
    <td>Set to false and let StackExchange.Redis reconnect automatically.</td>
  </tr>
  <tr>
    <td>ConnectRetry</td>
    <td>The number of times to repeat connection attempts during initial connect.</td>
    <td></td>
  </tr>
  <tr>
    <td>ConnectTimeout</td>
    <td>Timeout in ms for connect operations.</td>
    <td></td>
  </tr>
</table>

In most cases the default values of the client are sufficient. You can fine tune the options based on your workload.

-	Retries
	-	For ConnectRetry and ConnectTimeout the general guidance is to fail fast and retry again. This is based on your workload and how much time on average it takes for your client to issue a Redis command and receive a response.
	-	Let StackExchange.Redis automatically reconnect instead of checking connection status and reconnecting yourself. **Avoid using the ConnectionMultiplexer.IsConnected property**.
	-	Snowballing - sometimes you may run into an issue where you are retrying and this snowballs and never recovers. In this case you should consider using an exponential backoff retry algorithm as described in [Retry general guidance](https://github.com/mspnp/azure-guidance/blob/master/Retry-General.md) published by the Microsoft Patterns & Practices group.
-	Timeout values
	-	Consider your workload and set the values accordingly. If you are storing large values, set the timeout to a higher value.
		-	Set ABortOnConnectFail to false and let StackExchange.Redis reconnect for you.
-	Use a single ConnectionMultiplexer instance for the application. You can use a LazyConnection to create a single instance that is returned by a Connection property, as shown in [Connect to the cache using the ConnectionMultiplexer class](https://msdn.microsoft.com/library/azure/dn690521.aspx#Connect).
-	Set the `ConnectionMultiplexer.ClientName` property to an app instance unique name for diagnostic purposes.
-	Use multiple `ConnectionMultiplexer` instances for custom workloads.
	-	You can follow this model if you have varying load in your application. For example:
		-	You can have one multiplexer for dealing with large keys. 
		-	You can have one multiplexer for dealing with small keys. 
		-	You can set different values for connection timeouts and retry logic for each ConnectionMultiplexer that you use.
		-	Set the `ClientName` property on each multiplexer to help with diagnostics. 
		-	This will lead to more streamlined latency per `ConnectionMultiplexer`.

<a name="cache-redis-commands"></a>
## What are some of the considerations when using common Redis commands?

-	You should not run certain Redis commands which take a long time to complete without understanding the impact of these commands.
	-	For example, do not run the [KEYS](http://redis.io/commands/keys) command in production as it could take a long time to return depending on the number of keys. Redis is a single-threaded server and it processes commands one at a time. If you have other commands issued after KEYS, they will not be processed until Redis processes the KEYS command.
-	Key sizes - should I use small key/values or large key/values? In general it depends on the scenario. If your scenario requires larger keys then you can adjust the ConnectionTimeout and retry values and adjust your retry logic. From a Redis server perspective, smaller values are observed to have better performance.
	-	This does not mean that you can't store larger values in Redis; you must be aware of the following considerations. Latencies will be higher. If you have one set of data that is larger and one that is smaller, you can use multiple ConnectionMultiplexer instances, each configured with a different set of timeout and retry values, as described in the previous [What do the StackExchange.Redis configuration options do](#cache-configuration) section.


<a name="cache-ssl"></a>
## When should I enable the non-SSL port for connecting to Redis?

Redis server does not support SSL out of the box, but Azure Redis Cache does. If you are connecting to Azure Redis Cache and your client supports SSL, like StackExchange.Redis, then you should use SSL.

Note that the non-SSL port is disabled by default for new Azure Redis Cache instances. If your client does not support SSL, then you must enable the non-SSL port by following the directions in the [Access ports](https://msdn.microsoft.com/library/azure/dn793612.aspx#AccessPorts) section of the [Configure a cache in Azure Redis Cache](https://msdn.microsoft.com/library/azure/dn793612.aspx) article.

Redis tools such as `redis-cli` do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post.

For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.

<a name="cache-benchmarking"></a>
## How can I benchmark and test the performance of my cache?

-	[Enable cache diagnostics](https://msdn.microsoft.com/library/azure/dn763945.aspx#EnableDiagnostics) so you can [monitor](https://msdn.microsoft.com/library/azure/dn763945.aspx) the health of your cache. You can view the metrics in the portal and you can also [download and review](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) them using the tools of your choice.
-	You can use redis-benchmark.exe to load test your Redis server.
	-	Ensure that the load testing client and the Redis cache are in the same region.
-	Use redis-cli.exe and monitor the cache using the INFO command.
	-	If your load is causing high memory fragmentation then you should scale up to a larger cache size.
-	For instructions on downloading the Redis tools, see the [How can I run Redis commands?](#cache-commands) section.

<a name="cache-commands"></a>
## How can I run Redis commands?

You can use any of the commands listed at [Redis commands](http://redis.io/commands#). To run these commands you can use the following tools.

-	Download the [Redis command line tools](https://github.com/MSOpenTech/redis/releases/download/win-2.8.19.1/redis-2.8.19.zip).
-	Connect to the cache using `redis-cli.exe`. Pass in the cache endpoint using the -h switch and the key using -a as shown in the following example.
	-	`redis-cli -h <your cache name>.redis.cache.windows.net -a <key>`
-	Note that the Redis command line tools do not work with the SSL port, but you can use a utility such as `stunnel` to securely connect the tools to the SSL port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post.

<a name="cache-common-patterns"></a>
## What are some common cache patterns and considerations?

-	Microsoft Patterns & Practices has the following guidance.
	-	[Caching guidance](https://github.com/mspnp/azure-guidance/blob/master/Caching.md).
	-	[Azure Cloud Application Design and Implementation Guidance](https://github.com/mspnp/azure-guidance)
-	[Common cache patterns with Azure Redis Cache](cache-howto-common-cache-patterns/)

<a name="cache-reference"></a>
## Why doesn't Azure Redis Cache have an MSDN class library reference like some of the other Azure services?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache, giving you access to a secure, dedicated Redis cache, managed by Microsoft. A variety of [Redis clients](http://redis.io/clients) are available for many programming languages. Each client has its own API that makes calls to the Redis cache instance using [Redis commands](http://redis.io/commands).

Because each client is different, there is not one centralized class reference on MSDN; instead each client maintains its own reference documentation. In addition to the reference documentation, there are several tutorials on Azure.com showing how to get started with Azure Redis Cache using different languages and cache clients on the [Redis Cache documentation](http://azure.microsoft.com/documentatgion/services/redis-cache/) page.




