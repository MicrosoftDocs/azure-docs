<properties 
	pageTitle="How to troubleshoot Azure Redis Cache | Microsoft Azure" 
	description="Learn how to resolve common issues with Azure Redis Cache." 
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
	ms.date="05/23/2016" 
	ms.author="sdanie"/>

# How to troubleshoot Azure Redis Cache

This article provides guidance for troubleshooting the following categories of Azure Redis Cache issues.

-	[Client side troubleshooting](#client-side-troubleshooting) - This section provides guidelines on identifying and resolving issues caused by the application connecting to Azure Redis Cache.
-	[Server side troubleshooting](#server-side-troubleshooting) - This section provides guidelines on identifying and resolving issues caused on the Azure Redis Cache server side.
-	[StackExchange.Redis timeout exceptions](#stackexchangeredis-timeout-exceptions) - This section provides information on troubleshooting issues when using the StackExchange.Redis client.


>[AZURE.NOTE] Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.

## Client side troubleshooting


This section discusses troubleshooting issues that occur because of a condition on the client application.

-	[Memory pressure on the client](#memory-pressure-on-the-client)
-	[Burst of traffic](#burst-of-traffic)
-	[High client CPU usage](#high-client-cpu-usage)
-	[Client Side Bandwidth Exceeded](#client-side-bandwidth-exceeded)
-	[Large Request/Response Size](#large-requestresponse-size)
-	[What happened to my data in Redis?](#what-happened-to-my-data-in-redis)

### Memory pressure on the client

#### Problem

Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of data that was sent by the Redis instance without any delay. When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk. This *page faulting* causes the system to slow down significantly.

#### Measurement 

1.	Monitor memory usage on machine to make sure that it does not exceed available memory. 
2.	Monitor the `Page Faults/Sec` performance counter. Most systems will have some page faults even during normal operation, so watch for spikes in this page faults performance counter which correspond with timeouts.

#### Resolution

Upgrade your client to a larger client VM size with more memory or dig into your memory usage patterns to reduce memory consuption.


### Burst of traffic

#### Problem

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side.

#### Measurement 

Monitor how your `ThreadPool` statistics change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/ThreadPoolMonitor/ThreadPoolLogger.cs). You can also look at the `TimeoutException` message from StackExchange.Redis. Here is an example :

    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0, 
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)

In the above message, there are several issues that are interesting:

 1. Notice that in the `IOCP` section and the `WORKER` section you have a `Busy` value that is greater than the `Min` value. This means that your `ThreadPool` settings need adjusting.
 2. You can also see `in: 64221`. This indicates that 64211 bytes have been received at the kernel socket layer but haven't yet been read by the application (e.g. StackExchange.Redis). This typically means that your application isn't reading data from the network as quickly as the server is sending it to you.

#### Resolution

Configure your [ThreadPool Settings](https://gist.github.com/JonCole/e65411214030f0d823cb) to make sure that your thread pool will scale up quickly under burst scenarios.


### High client CPU usage

#### Problem

High CPU usage on the client is an indication that the system cannot keep up with the work that it has been asked to perform. This means that the client may fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

#### Measurement

Monitor the System Wide CPU usage through the Azure Portal or through the associated performance counter. Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. As a result of high CPU, you may also see high `in: XXX` values in `TimeoutException` error messages as described in the [Burst of traffic](#burst-of-traffic) section.

>[AZURE.NOTE] StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `TimeoutException` error messages. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.

#### Resolution

Upgrade to a larger VM size with more CPU capacity or investigate what is causing CPU spikes. 



### Client side bandwidth exceeded

#### Problem

Different sized client machines have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth, then data will not be processed on the client side as quickly as the server is sending it. This can lead to timeouts.

#### Measurement

Monitor how your Bandwidth usage change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). Note that this code may not run successfully in some environments with restricted permissions (like Azure web sites).

#### Resolution 

Increase Client VM size or reduce network bandwidth consumption.


### Large Request/Response Size

#### Problem

A large request/response can cause timeouts. As an example, Suppose your timeout value configured on your client is 1 second. Your application requests two keys (e.g. 'A' and 'B') at the same time (using the same physical network connection). Most clients support "Pipelining" of requests, such that both requests 'A' and 'B' are sent on the wire to the server one after the other without waiting for the responses. The server will send the responses back in the same order. If response 'A' is large enough it can eat up most of the timeout for subsequent requests. 

The following example demonstrates this scenario. In this scenario, Request 'A' and 'B' are sent quickly, the server starts sending responses 'A' and 'B' quickly, but because of data transfer times, 'B' get stuck behind the other request and times out even though the server responded quickly.

    |-------- 1 Second Timeout (A)----------|
    |-Request A-|
         |-------- 1 Second Timeout (B) ----------|
         |-Request B-|
                |- Read Response A --------|
                                           |- Read Response B-| (**TIMEOUT**)



#### Measurement

This is a difficult one to measure. You basically have to instrument your client code to track large requests and responses. 

#### Resolution

1.	Redis is optimized for a large number of small values, rather than a few large values. The preferred solution is to break up your data into related smaller values. See the [What is the ideal value size range for redis? Is 100KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) post for details around why smaller values are recommended.
2.	Increase the size of your VM (for client and Redis Cache Server), to get higher bandwidth capabilities, reducing data transfer times for larger responses. Note that getting more bandwidth on just the server or just on the client may not be enough. Measure your bandwidth usage and compare it to the capabilities of the size of VM you currently have.
3.	Increase the number of `ConnectionMultiplexer` objects you use and round-robin requests over different connections.


### What happened to my data in Redis?

#### Problem

I expected for certain data to be in my Azure Redis Cache instance but it didn't seem to be there.

##### Resolution

See [What happened to my data in Redis?](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md) for possible causes and resolutions.


## Server side troubleshooting

This section discusses troubleshooting issues that occur because of a condition on the cache server.

-	[Memory Pressure on the server](#memory-pressure-on-the-server)
-	[High CPU usage / Server Load](#high-cpu-usage-server-load)
-	[Server Side Bandwidth Exceeded](#server-side-bandwidth-exceeded)

### Memory Pressure on the server

#### Problem

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk. This *page faulting* causes the system to slow down significantly. There are several possible causes of this memory pressure: 

1.	You have filled the cache to full capacity with data. 
2.	Redis is seeing high memory fragmentation - most often caused by storing large objects (Redis is optimized for a small objects - See the [What is the ideal value size range for redis? Is 100KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) post for details). 

#### Measurement

Redis exposes two metrics that can help you identify this issue. The first is `used_memory` and the other is `used_memory_rss`. [These metrics](cache-how-to-monitor.md#available-metrics-and-reporting-intervals) are available in the Azure Portal or through the [Redis INFO](http://redis.io/commands/info) command.

#### Resolution

There are several possible changes that you can make to help keep memory usage healthy:

1. [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. Note that this may not be sufficient if you have fragmentation.
2. [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation.
3. Break up your large cached objects into smaller related objects.
4. [Scale](cache-how-to-scale.md) to a larger cache size.
5. If you are using a [premium cache with Redis cluster enabled](cache-how-to-premium-clustering.md) you can [increase the number of shards](cache-how-to-premium-clustering.md#change-the-cluster-size-on-a-running-premium-cache).

### High CPU usage / Server Load

#### Problem

High CPU usage can mean that the client side can fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

#### Measurement

Monitor the System Wide CPU usage through the Azure Portal or through the associated performance counter. Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high. Watch for spikes in CPU usage that correspond with timeouts.

#### Resolution

[Scale](cache-how-to-scale.md) to a larger cache tier with more CPU capacity or investigate what is causing CPU spikes. 

### Server Side Bandwidth Exceeded

#### Problem

Different sized cache instances have limitations on how much network bandwidth they have available. If the server exceeds the available bandwidth, then data will not be sent to the client as quickly. This can lead to timeouts.

#### Measurement

You can monitor the `Cache Read` metric, which is the amount of data read from the cache in Megabytes per second (MB/s) during the specified reporting interval. This value corresponds to the network bandwidth used by this cache. If you want to set up alerts for server side network bandwidth limits, you can create them using this `Cache Read` counter. Compare your readings with the values in [this table](cache-faq.md#cache-performance) for the observed bandwidth limits for various cache pricing tiers and sizes.

#### Resolution

If you are consistently near the observed maximum bandwidth for your pricing tier and cache size, consider [scaling](cache-how-to-scale.md) to a pricing tier or size that has greater network bandwidth, using the values in [this table](cache-faq.md#cache-performance) as a guide.


## StackExchange.Redis timeout exceptions

StackExchange.Redis uses a configuration setting named `synctimeout` for synchronous operations which has a default value  of 1000 ms. If a synchronous call doesn’t complete in the stipulated time, the StackExchange.Redis client throws a timeout error similar to the following example.

	System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641, inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0 IOCP: (Busy=6, Free=999, Min=2,Max=1000), WORKER (Busy=7,Free=8184,Min=2,Max=8191)


This error message contains metrics that can help point you to the cause and possible resolution of the issue. The following table contains details about the error message metrics.

| Error message metric | Details                                                                                                                                                                                                                                          |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| inst       | In the last time slice: 0 commands have been issued                                                                                                                                                                                              |
| mgr        | The socket manager is performing `socket.select` which means it is asking the OS to indicate a socket that has something to do; basically: the reader is not actively reading from the network because it doesn't think there is anything to do |
| queue      | There are 73 total in-progress operations                                                                                                                                                                                                        |
| qu         | 6 of the in-progress operations are in the unsent queue and have not yet been written to the outbound network                                                                                                                                                           |
| qs         | 67 of he in-progress operations have been sent to the server but a response is not yet available. The response could be `Not yet sent by the server` or `sent by the server but not yet processed by the client.`                                                   |
| qc         | 0 of the in-progress operations have seen replies but have not yet been marked as complete due to waiting on the completion loop                                                                                                                                      |
| wr         | There is an active writer (meaning the 6 unsent requests are not being ignored) bytes/activewriters                                                                                                                                                   |
| in         | There are no active readers and zero bytes are available to be read on the NIC bytes/activereaders                                                                                                                                               |


### Steps to investigate

1. As a best practice make sure you are using the following pattern to connect when using the StackExchange.Redis client.


	    private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
	    {
	        return ConnectionMultiplexer.Connect("cachename.redis.cache.windows.net,abortConnect=false,ssl=true,password=...");
	
	    });
	
	    public static ConnectionMultiplexer Connection
	    {
	        get
	        {
	            return lazyConnection.Value;
	        }
	    }


    For more information, see [Connect to the cache using StackExchange.Redis](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache).

2. Ensure that your Azure Redis Cache and the client application are in the same region in Azure. For example, you might be getting timeouts when your cache is in East US but the client is in West US and the request doesn't complete within the `synctimeout` interval or you might be getting timeouts when you are debugging from your local development machine. 

    It’s highly recommended to have the cache and in the client in the same Azure region. If you have a scenario that includes cross region calls, you should set the `synctimeout` interval to a value higher than the default 1000 ms interval by including a `synctimeout` property in the connection string. The following example shows a StackExchange.Redis cache connection string snippet with a `synctimeout` of 2000 ms.

        synctimeout=2000,cachename.redis.cache.windows.net,abortConnect=false,ssl=true,password=...

3. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.

4. If there are requests that are getting bound by bandwidth limitations on the server or client, it will take longer for them to complete and thereby cause timeouts. To see if your timeout is due to network bandwidth on the server, see [Server side bandwidth exceeded](#server-side-bandwidth-exceeded). To see if your timeout is due to client network bandwidth, see [Client side bandwidth exceeded](#client-side-bandwidth-exceeded).

6. Are you getting CPU bound on the server or on the client?
	-	Check if you are getting bound by CPU on your client which could cause the request to not be processed within the `synctimeout` interval, thus causing a timeout. Moving to a larger client size or distributing the load can help to control this. 
	-	Check if you are getting CPU bound on the server by monitoring the `CPU` [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). Requests coming in while Redis is CPU bound can cause those requests to timeout. To address this you can distribute the load across multiple shards in a premium cache, or upgrade to a larger size or pricing tier. For more information, see [Server Side Bandwidth Exceeded](#server-side-bandwidth-exceeded).

7. Are there commands taking long time to process on the server? Long running commands that are taking long time to process on the redis-server can cause timeouts. Some examples of long running commands are `mget` with large numbers of keys, `keys *` or poorly written lua scripts. You can connect to your Azure Redis Cache instance using the redis-cli client or use the [Redis Console](cache-configure.md#redis-console) and run the [SlowLog](http://redis.io/commands/slowlog) command to see if there are requests taking longer than expected. Redis Server and StackExchange.Redis are optimized for many small requests rather than fewer large requests. Splitting your data into smaller chunks may improve things here. 

    For information on connecting to the Azure Redis Cache SSL endpoint using redis-cli and stunnel, see the [Announcing ASP.NET Session State Provider for Redis Preview Release](http://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx) blog post. For more information, see [SlowLog](http://redis.io/commands/slowlog).

8. High Redis server load can cause timeouts. You can monitor the server load by monitoring the `Redis Server Load` [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). A server load of 100 (maximum value) signifies that the redis server has been busy, with no idle time, processing requests. To see if certain requests are taking up all of the server capability, run the SlowLog command, as described in the previous paragraph. For more information, see [High CPU usage / Server Load](#high-cpu-usage-server-load).

9. Was there any other event on the client side that could have caused a network blip? Check on the client (web, worker role or an Iaas VM) if there was an event like scaling the number of client instances up or down, or deploying a new version of the client or auto-scale is enabled?In our testing we have found that autoscale or scaling up/down can cause outbound network connectivity can be lost for several seconds. StackExchange.Redis code is resilient to such events and will reconnect. During this time of re-connection any requests in the queue can time out.

10. Was there a big request preceding several small requests to the Redis Cache that timed out? The parameter `qs` in the error message tells you how many requests were sent from the client to the server, but have not yet processed a response. This value can keep growing because StackExchange.Redis uses a single TCP connection and can only read one response at a time. Even though the first operation timed out, it does not stop the data being sent to/from the server, and other requests are blocked until this is finished, causing time outs. One solution is to minimize the chance of timeouts by ensuring that your cache is large enough for your workload and splitting large values into smaller chunks. Another possible solution is to use a pool of `ConnectionMultiplexer` objects in your client, and choose the least loaded `ConnectionMultiplexer` when sending a new request. This should prevent a single timeout from causing other requests to also timeout.

11. If you are using `RedisSessionStateprovider`, ensure you have set the retry timeout correctly. `retrytimeoutInMilliseconds` should be higher than `operationTimeoutinMilliseonds`, otherwise no retries will occur. In the following example `retrytimeoutInMilliseconds` is set to 3000. For more information, see [ASP.NET Session State Provider for Azure Redis Cache](cache-aspnet-session-state-provider.md) and [How to use the configuration parameters of Session State Provider and Output Cache Provider](https://github.com/Azure/aspnet-redis-providers/wiki/Configuration).


	<add
	  name="AFRedisCacheSessionStateProvider"
	  type="Microsoft.Web.Redis.RedisSessionStateProvider"
	  host="enbwcache.redis.cache.windows.net"
	  port="6380"
	  accessKey="…"
	  ssl="true"
	  databaseId="0"
	  applicationName="AFRedisCacheSessionState"
	  connectionTimeoutInMilliseconds = "5000"
	  operationTimeoutInMilliseconds = "1000"
	  retryTimeoutInMilliseconds="3000" />


12. Check memory usage on the Azure Redis Cache server by [monitoring](cache-how-to-monitor.md#available-metrics-and-reporting-intervals) `Used Memory RSS` and `Used Memory`. If an eviction policy is in place, Redis starts evicting keys when `Used_Memory` reaches the cache size. Ideally, `Used Memory RSS` should be only slightly higher than `Used memory`. A large difference means there is memory fragmentation (internal or external. When `Used Memory RSS` is less than `Used Memory`, it means part of the cache memory has been swapped  by the operating system. If this occurs you can expect some significant latencies. Because Redis does not have control over how its allocations are mapped to memory pages, high `Used Memory RSS` is often the result of a spike in memory usage. When Redis frees memory, the memory is given back to the allocator, and the allocator may or may not give the memory back to the system. There may be a discrepancy between the `Used Memory` value and memory consumption as reported by the operating system. It may be due to the fact memory has been used and released by Redis, but not given back to the system. To help mitigate memory issues you can perform the following steps.
    -	Upgrade the cache to a larger size so that you are not running up against memory limitations on the system.
    -	Set expiration times on the keys so that older values are evicted proactively.
    -	Monitor the the `used_memory_rss` cache metric. When this value approaches the size of their cache, you are likely to start seeing performance issues. Distribute the data across multiple shards if you are using a premium cache, or upgrade to a larger cache size.

    For more information, see [Memory Pressure on the server](#memory-pressure-on-the-server).

## Additional information

-	[What Redis Cache offering and size should I use?](cache-faq.md#what-redis-cache-offering-and-size-should-i-use)
-	[How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
-	[How can I run Redis commands?](cache-faq.md#how-can-i-run-redis-commands)
-	[How to monitor Azure Redis Cache](cache-how-to-monitor.md)