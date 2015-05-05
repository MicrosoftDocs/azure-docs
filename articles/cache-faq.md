<properties 
	pageTitle="Azure Redis Cache FAQ" 
	description="Learn the answers to common questions, patterns, and best practices for Azure Redis Cache" 
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

This guide shows you how to get started using 
**Azure Redis Cache**. The samples are written in C\# code and
use the .NET API. The scenarios covered include **creating and configuring a cache**, **configuring cache clients**, **adding and removing objects from the cache**, and **storing ASP.NET session state in the cache**. For more
information on using Azure Redis Cache, refer to the [Next Steps][] section.

<a name="cache-size"></a>
## What Redis Cache offering and size should I use?

Each Azure Redis Cache offering provides different levels of size, bandwidth, and SLA options.

-	Basic SKU - Single node, no replication or SLA, cache sizes from 250 MB up to 53 GB.
-	Standard SKU - Primary/Secondary nodes with automatic replication, 99.9% SLA, cache sizes from 250 MB to 53 GB.

If you desire an SLA, choose the standard cache offering which has a 99.9% SLA. For development and prototyping, or for scenarios where an SLA is not required, the basic offering could be appropriate.

The cache sizes and bandwidth map roughly to the sizes and bandwidth of the virtual machines that host the cache. The 250 MB sizes for both the basic and standard offerings are hosted on the Extra Small (A0) virtual machine size, which is hosted using shared cores, while the other sizes are hosted using dedicated cores. The 1 GB cache sizes are hosted on the Small (A1) virtual machine size, which has 1 dedicated virtual core that is used to service both the operating system and the redis cache. Larger cache sizes are hosted on larger VM instances with multiple dedicated virtual cores.

If your cache has a high throughput, choose the 1 GB size or larger so that the cache is running using dedicated cores. The 1 GB cache size is hosted on a 1 core virtual machine. This core is used to service both the OS and the cache. Caches larger than 1 GB run on virtual machines with multiple cores, and the Redis cache uses a dedicated core that is not shared with the OS.

Redis is single-threaded so having more than two cores does not provide additional benefit over having just two cores, but larger VM sizes typically have more bandwidth than smaller sizes. If the cache server or client reaches the bandwidth limits, then you will receive timeouts on the client side.

The following table shows the maximum bandwidth values observed while testing various sizes of Azure Redis Cache using redis-benchmark.exe from an Iaas VM against the Azure Redis Cache endpoint. Note that the values are not guaranteed, but should be typical.

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


<a name="cache-region"></a>
## In what region should I locate my cache?

For best performance and lowest latency, locate your Azure Redis Cache in the same region as your cache client application.

<a name="cache-reference"></a>
## Why doesn't Azure Redis Cache have an MSDN class library reference like some of the other Azure services?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache, giving you access to a secure, dedicated Redis cache, managed by Microsoft. A variety of [Redis clients](http://redis.io/clients) are available for many programming languages. Each client has its own API that makes calls to the Redis cache instance using [Redis commands](http://redis.io/commands).

Because each client is different, there is not one centralized class reference on MSDN; instead each client maintains its own reference documentation. In addition to the reference documentation, there are several tutorials on Azure.com showing how to get started with Azure Redis Cache using different languages and cache clients on the [Redis Cache documentation](http://azure.microsoft.com/documentation/services/redis-cache/) page.

<a name="cache-timeouts"></a>
## Why am I seeing high latency and timeouts?

Timeouts in Azure Redis Cache are due to client timeout settings. Redis server does not time out. When a command is called on Redis server, the call is queued up and Redis server eventually picks up the command and executes it. However the client can time out during this process and if it does an exception is raised on the calling side. For more information on troubleshooting timeout issues, see [Investigating timeout exceptions in StackExchange.Redis for Azure Redis Cache](http://azure.microsoft.com/blog/2015/02/10/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

<a name="cache-monitor"></a>
## How do I monitor the health and performance of my cache?

Microsoft Azure Redis Cache instances can be monitored in the [Azure Preview Portal](https://portal.azure.com). You can view metrics, pin metrics charts to the Startboard, customize the date and time range of monitoring charts, add and remove metrics from the charts, and set alerts when certain conditions are met. These tools enable you to monitor the health of your Azure Redis Cache instances and help you manage your caching applications. For more information on monitoring your caches, see [Monitor Azure Redis Cache](https://msdn.microsoft.com/library/azure/dn763945.aspx).

<a name="cache-disconnect"></a>
## Why was I disconnected from the cache?

The following are some common reason for a cache disconnect.

-	Client-side causes
	-	The client application was redeployed.
		-	In the case of Cloud Services or Web Apps, this may be due to auto-scaling
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
	-	Let StackExchange.Redis automatically reconnect instead of checking connection status and reconnecting yourself. Avoid using the ConnectionMultiplexer.IsConnected property.
	-	Snowballing - sometimes you may run into an issue where you are retrying and this snowballs and never recovers. In this case you should consider using an exponential backoff retry algorithm as described in [Retry general guidance](https://github.com/mspnp/azure-guidance/blob/master/Retry-General.md) published by the Microsoft Patterns & Practices group.
-	Timeout values
	-	Consider your workload and set the values accordingly. If you are storing large values, set the timeout to a higher value.
		-	Set it to false and let StackExchange.Redis reconnect for you.
	-	Use a single ConnectionMultiplexer instance for the application. You can use a LazyConnection to create a single instance that is returned by a Connection property, as shown in the following example.

	private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
	 {
		return ConnectionMultiplexer.Connect("<cachename>.redis.cache.windows.net,ssl=true,password=<password>,abortConnect=false");
	});
			
	public static ConnectionMultiplexer Connection
	{
		get
		{
			 return lazyConnection.Value;
		}
	}
	
-	Set the `ConnectionMultiplexer.ClientName` property to an app instance unique name for diagnostic purposes.
-	Use multiple `ConnectionMultiplexer` instances for custom workloads
	-	You can follow this model if you have varying load in your application. For example:
		-	You can have one multiplexer for dealing with large keys. 
		-	You can have one multiplexer for dealing with small keys. 
		-	You can set different values for connection timeouts and retry logic for each ConnectionMultiplexer that you use.
		-	Set the `ClientName` property on each multiplexer to help with diagnostics. 
		-	This will lead to more streamlined latency per `ConnectionMultiplexer`

<a name="cache-redis-commands"></a>
## What are some of the considerations when using common Redis commands?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache. It gives you access to a secure, dedicated Redis cache, managed by Microsoft. A cache created using Azure Redis Cache is accessible from any application within Microsoft Azure.

<a name="cache-ssl"></a>
## When should I use the SSL port for connecting to Redis?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache. It gives you access to a secure, dedicated Redis cache, managed by Microsoft. A cache created using Azure Redis Cache is accessible from any application within Microsoft Azure.

<a name="cache-client-version"></a>
## What version of cache clients and ASP.NET providers should I use?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache. It gives you access to a secure, dedicated Redis cache, managed by Microsoft. A cache created using Azure Redis Cache is accessible from any application within Microsoft Azure.

<a name="cache-benchmarking"></a>
## How can I benchmark and test the performance of my cache?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache. It gives you access to a secure, dedicated Redis cache, managed by Microsoft. A cache created using Azure Redis Cache is accessible from any application within Microsoft Azure.

<a name="cache-common-patterns"></a>
## What are some common cache patterns and considerations?

Microsoft Azure Redis Cache is based on the popular open source Redis Cache. It gives you access to a secure, dedicated Redis cache, managed by Microsoft. A cache created using Azure Redis Cache is accessible from any application within Microsoft Azure.



<a name="next-steps"></a>
## Next Steps

Now that you've learned the basics of Azure Redis Cache,
follow these links to learn how to do more complex caching tasks.

-	[Enable cache diagnostics](https://msdn.microsoft.com/library/azure/dn763945.aspx#EnableDiagnostics) so you can [monitor](https://msdn.microsoft.com/library/azure/dn763945.aspx) the health of your cache. You can view the metrics in the portal and you can also [download and review](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) them using the tools of your choice.
-	Learn more about the StackExchange.Redis client: [StackExchange.Redis cache client documentation][]
	-	Azure Redis Cache can be accessed from many Redis clients and development languages. For more information, see [http://redis.io/clients][] and [Develop in other languages for Azure Redis Cache][].
	-	Azure Redis Cache can also be used with services such as Redsmin. For more information, see  [How to retrieve an Azure Redis connection string and use it with Redsmin][].
-	See the [redis][] documentation and read about [redis data types][] and [a fifteen minute introduction to Redis data types][].
-   See the MSDN Reference: [Azure Redis Cache][]


<!-- INTRA-TOPIC LINKS -->
[Next Steps]: #next-steps
[Introduction to Azure Redis Cache (Video)]: #video
[What is Azure Redis Cache?]: #what-is
[Create an Azure Cache]: #create-cache
[Which type of caching is right for me?]: #choosing-cache
[Prepare Your Visual Studio Project to Use Azure Caching]: #prepare-vs
[Configure Your Application to Use Caching]: #configure-app
[Get Started with Azure Redis Cache]: #getting-started-cache-service
[Create the cache]: #create-cache
[Configure the cache]: #enable-caching
[Configure the cache clients]: #NuGet
[Working with Caches]: #working-with-caches
[Connect to the cache]: #connect-to-cache
[Add and retrieve objects from the cache]: #add-object
[Specify the expiration of an object in the cache]: #specify-expiration
[Store ASP.NET session state in the cache]: #store-session

  



   
<!-- LINKS -->



[http://redis.io/clients]: http://redis.io/clients
[Develop in other languages for Azure Redis Cache]: http://msdn.microsoft.com/library/azure/dn690470.aspx
[How to retrieve an Azure Redis connection string and use it with Redsmin]: https://redsmin.uservoice.com/knowledgebase/articles/485711-how-to-connect-redsmin-to-azure-redis-cache
[Azure Redis Session State Provider]: http://go.microsoft.com/fwlink/?LinkId=398249
[How to: Configure a Cache Client Programmatically]: http://msdn.microsoft.com/library/windowsazure/gg618003.aspx
[Session State Provider for Azure Cache]: http://go.microsoft.com/fwlink/?LinkId=320835
[Azure AppFabric Cache: Caching Session State]: http://www.microsoft.com/showcase/details.aspx?uuid=87c833e9-97a9-42b2-8bb1-7601f9b5ca20
[Output Cache Provider for Azure Cache]: http://go.microsoft.com/fwlink/?LinkId=320837
[Azure Shared Caching]: http://msdn.microsoft.com/library/windowsazure/gg278356.aspx
[Team Blog]: http://blogs.msdn.com/b/windowsazure/
[Azure Caching]: http://www.microsoft.com/showcase/Search.aspx?phrase=azure+caching
[How to Configure Virtual Machine Sizes]: http://go.microsoft.com/fwlink/?LinkId=164387
[Azure Caching Capacity Planning Considerations]: http://go.microsoft.com/fwlink/?LinkId=320167
[Azure Caching]: http://go.microsoft.com/fwlink/?LinkId=252658
[How to: Set the Cacheability of an ASP.NET Page Declaratively]: http://msdn.microsoft.com/library/zd1ysf1y.aspx
[How to: Set a Page's Cacheability Programmatically]: http://msdn.microsoft.com/library/z852zf6b.aspx
[Configure a cache in Azure Redis Cache]: http://msdn.microsoft.com/library/azure/dn793612.aspx

[StackExchange.Redis configuration model]: http://github.com/StackExchange/StackExchange.Redis/blob/master/Docs/Configuration.md

[Work with .NET objects in the cache]: http://msdn.microsoft.com/library/dn690521.aspx#Objects


[NuGet Package Manager Installation]: http://go.microsoft.com/fwlink/?LinkId=240311
[Cache Pricing Details]: http://www.windowsazure.com/pricing/details/cache/
[Microsoft Azure preview portal]: https://portal.azure.com/

[Overview of Azure Redis Cache]: http://go.microsoft.com/fwlink/?LinkId=320830
[Azure Redis Cache]: http://go.microsoft.com/fwlink/?LinkId=398247

[Migrate to Azure Redis Cache]: http://go.microsoft.com/fwlink/?LinkId=317347
[Azure Redis Cache Samples]: http://go.microsoft.com/fwlink/?LinkId=320840
[Using Resource groups to manage your Azure resources]: http://azure.microsoft.com/documentation/articles/resource-group-overview/

[StackExchange.Redis]: http://github.com/StackExchange/StackExchange.Redis
[StackExchange.Redis cache client documentation]: http://github.com/StackExchange/StackExchange.Redis#documentation

[Redis]: http://redis.io/documentation
[Redis data types]: http://redis.io/topics/data-types
[a fifteen minute introduction to Redis data types]: http://redis.io/topics/data-types-intro

[How Application Strings and Connection Strings Work]: http://azure.microsoft.com/blog/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work/

[Azure Free Trial]: http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero