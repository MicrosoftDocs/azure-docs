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
	ms.date="05/09/2016" 
	ms.author="sdanie"/>

# How to troubleshoot Azure Redis Cache

-	Convert the Blog post: https://azure.microsoft.com/en-us/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/
-	https://gist.github.com/JonCole/db0e90bedeb3fc4823c2
-	https://gist.github.com/JonCole/9225f783a40564c9879d
-	Copy the ones from FAQ
-	Include tools that a customer can run such as slowlog/ monitor.
-	Goal: Make it readable and actionable.

## StackExchange.Redis timeout exceptions

StackExchange.Redis uses a configuration setting named `synctimeout` for synchronous operations which has a default value  of 1000 ms. If a synchronous call doesn’t complete in the stipulated time, it will throw a timeout error. The error thrown looks something like this: System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641, inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0
 IOCP: (Busy=6, Free=999, Min=2,Max=1000), WORKER (Busy=7,Free=8184,Min=2,Max=8191)

Below is an explanation of the error codes:

| Error code | Details                                                                                                                                                                                                                                          |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| inst       | in the last time slice: 0 commands have been issued                                                                                                                                                                                              |
| mgr        | the socket manager is performing "socket.select", which means it is asking the OS to indicate a socket that has something to do; basically: the reader is not actively reading from the network because it doesn't think there is anything to do |
| queue      | there are 73 total in-progress operations                                                                                                                                                                                                        |
| qu         | 6 of those are in unsent queue: they have not yet been written to the outbound network                                                                                                                                                           |
| qs         | 67 of those have been sent to the server but a response is not yet available. The response could be `Not yet sent by the server` or `sent by the server but not yet processed by the client.`                                                   |
| qc         | 0 of those have seen replies but have not yet been marked as complete due to waiting on the completion loop                                                                                                                                      |
| wr         | there is an active writer (meaning - those 6 unsent are not being ignored) bytes/activewriters                                                                                                                                                   |
| in         | there are no active readers and zero bytes are available to be read on the NIC bytes/activereaders                                                                                                                                               |


### Steps to investigate

As a best practice make sure you are using the following pattern to connect using StackExhange Redis client 
private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() => { return ConnectionMultiplexer.Connect("cachename.redis.cache.windows.net,ssl=true,abortConnect=false,password=password"); });

public static ConnectionMultiplexer Connection { get { return lazyConnection.Value; } }

2.Check if you your Azure Redis Cache and the Client in the same region in Azure. For example, you might be getting timeouts when your cache is in East US but the client is in West US and the request doesn't complete in synctimeout time or you might be getting timeouts when you are debugging from your local development machinex. a.It’s highly recommended to have the cache and in the client in the same Azure region. If you have a scenario to do a cross region calls, you would want to set the synctimeout to a higher value.

3.Are you using the latest version of the StackExchange.Redis NuGet package? Check here to verify if you are using latest version of StackExchange.Redis https://www.nuget.org/packages/StackExchange.Redis/.There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version would help.
4.Are you getting network bound on the server? Following are the max bandwidth we got while testing various sizes of Redis cache. (Following numbers are not guaranteed and is what we got while testing using redis-benchmark.exe running from an Iaas VM against the Azure Redis Cache endpoint)If there are requests that are getting bound by bandwidth, it will take longer for them to complete and thereby cause timeouts. It is recommended to move to a higher cache size to get more bandwidth. Go here for more information on the bandwidth numbers. 

Are you getting network bound on the client? Verify you are not getting network bound on you client. Getting Network bound on the client would create a bottleneck and cause timeouts. Moving to a higher VM size on the client to be lined up with the size/speed of the cache would give you the optimal results.You can use the Bandwidth Monitor program to check the bandwidth that you are getting on the client.
6.Are you getting CPU bound on the server or on the client? Check if you are getting bound by CPU on your client which could cause the request to not be processed under the syntimeout setting, thus causing a timeout. Moving to a higher machine size or distributing your load would help to control this.Check if you are getting CPU bound on the server from the portal. Requests coming in while Redis is CPU bound would cause those requests to timeout. One thing you could do is to split your data across multiple caches to distribute the load.
7.Are there commands taking long time to process on the server? There can be commands that are taking long time to process on the redis-server causing the request to timeout. Few examples of long running commands are mget with large number of keys, keys * or poorly written lua script.You can connect to the Azure Redis Cache using the redis-cli client and run the SlowLog command to see if there are requests taking longer than expected. More details regarding the command can be found here http://redis.io/commands/slowlogRedis Server and StackExchange.Redis are optimized for many small requests rather than fewer large requests. Splitting your data into smaller chunks may improve things here. Check this blog post here on how to use redis-cli.exe with stunnel to connect to the SSL endpoint.

Is there a high Redis-server server load ? Using the Redis-cli client tool, you can connect to your Redis endpoint and run "INFO CPU" to check the value of server_load. A server load of 100 (maximum value) signifies that the redis server has been busy all the time (has not been idle) processing the requests.Run Slowlog from redis-cli to see if there are any requests that are taking more time to process causing server load to max out.
9.Was there any other event on the client side that could have caused a network blip? Check on the client (web, worker role or an Iaas VM) if there was an event like scaling the number of client instances up or down, or deploying a new version of the client or auto-scale is enabled?In our testing we have found that autoscale or scaling up/down can cause outbound network connectivity can be lost for several seconds. StackExchange.Redis code is resilient to such events and will reconnect. During this time of reconnection any requests in the queue can time out.
10.Was there a big request preceding several small requests to the Redis Cache that timed out? The parameter “qs” in the error message tells you how many requests were sent from the client to the server, but have not yet processed a response. This value keeps growing because StackExchange.Redis uses a single TCP connection and can only read one response at a time. Even though the first operation timed out, it does not stop the data being sent to/from the server, and other requests are blocked until this is finished. Thereby, causing time outs. One solution is to minimize the chance of timeouts by ensuring that your cache is large enough for your workload and splitting large values into smaller chunks.Another possible solution is to use a pool of ConnectionMultiplexer objects in your client, and choose the "least loaded" ConnectionMultiplexer when sending a new request. This should prevent a single timeout from causing other requests to also timeout.

11. Are you using RedisSessionStateprovider and have set the retry timeout correctly? Following are the settings for RedisSessionStateProvider. retrytimeoutInMilliseconds should be higher that operationTimeoutinMilliseonds, otherwise it won't retry.For example, for the following setting, it would at least retry 3 times before timing out. More details about the setting can be found here. 


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
	  retryTimeoutInMilliseconds="3000"/>


12. Is used_memory_rss higher than used_memory? Using redis-cli.exe you can connect to the cache and run the redis INFO command that outputs the following related to memory allocationused_memory_rss: Number of bytes that Redis allocated as seen by the operating system (a.k.a resident set size).used_memory: total number of bytes allocated by Redis using its allocator (either standard libc, malloc, jemalloc etc.) cache size: size of the cache created (26 GB in this case). With an eviction policy set, Redis will start evicting keys when Used_Memory hits cache size. Ideally, the used_memory_rss value should be only slightly higher than used_memory. When rss >> used, a large difference means there is memory fragmentation (internal or external. When used >> rss, it means part of Redis memory has been swapped off by the operating system: expect some significant latencies. Because Redis does not have control over how its allocations are mapped to memory pages, high used_memory_rss is often the result of a spike in memory usage. When Redis frees memory, the memory is given back to the allocator, and the allocator may or may not give the memory back to the system. There may be a discrepancy between the used_memory value and memory consumption as reported by the operating system. It may be due to the fact memory has been used and released by Redis, but not given back to the system. More details can be found at http://www.redis.io/commands/info We are currently testing some changes on our end that make it so that the system has better behavior when there is fragmentation and is not rolled out yet. Meanwhile, there are following things that you can do to mitigate it: •Upgrade the cache to a larger size so that you are not running up against memory limitations on the system.
•Set expiration times on the keys so that older values are evicted proactively.
•Monitor the Redis “info” command, especially the used_memory_rss value. When that value approaches the size of their cache, you are likely to start seeing performance issues. Shard the data across multiple cache to be at a lower utilization of memory or upgrading to a larger cache can help.



## Client side troubleshooting


This section discusses troubleshooting issues that occur because of a condition on the cache client.

-	[Memory pressure on the client](#memory-pressure-on-the-client)
-	[Burst of traffic](#burst-of-traffic)
-	[High client CPU usage](#high-client-cpu-usage)
-	[Client Side Bandwidth Exceeded](#client-side-bandwidth-exceeded)
-	[Large Request/Response Size](#large-requestresponse-size)

### Memory pressure on the client

#### Problem

Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of data that was sent by the Redis instance without any delay. When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk. This *page faulting* causes the system to slow down significantly.

#### Measurement 

1.	Monitory memory usage on machine to make sure that it does not exceed available memory. 
2.	Monitor the `Page Faults/Sec` performance counter. Most systems will have some page faults even during normal operation, so watch for spikes in this page faults performance counter which correspond with timeouts.

#### Resolution

Upgrade to a larger client VM size with more memory or dig into your memory usage patterns to reduce memory consuption.


### Burst of traffic

#### Problem

Bursts of traffic combined with poor ThreadPool settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side.

#### Measurement 

Monitor how your ThreadPool statistics change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/ThreadPoolMonitor/ThreadPoolLogger.cs). You can also look at the `TimeoutException` message from StackExchange.Redis. Here is an example :

    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0, 
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)

In the above message, there are several issues that are interesting:

 1. Notice that in the "IOCP" section and the "WORKER" section you have a "Busy" value that is greater than the "Min" value. This means that your threadpool settings need adjusting.
 2. You can also see "in: 64221". This indicates that 64211 bytes have been received at the kernel socket layer but haven't yet been read by the application (e.g. StackExchange.Redis). This typically means that your application isn't reading data from the network as quickly as the server is sending it to you.

#### Resolution

Configure your [ThreadPool Settings](https://gist.github.com/JonCole/e65411214030f0d823cb) to make sure that your threadpool will scale up quickly under burst scenarios.


## High client CPU usage

#### Problem

High CPU usage on the client is an indication that the system cannot keep up with the work that it has been asked to perform. This means that the client may fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

#### Measurement

Monitor the System Wide CPU usage through the azure portal or through the associated perf counter. Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. As a result of high CPU, you may also see high "in: XXX" values in TimeoutException error messages as described above in the "Burst of traffic" section.

#### Resolution

Upgrade to a larger VM size with more CPU capacity or investigate what is causing CPU spikes. 

----------

## Client Side Bandwidth Exceeded

`Problem:` Different sized client machines have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth, then data will not be processed on the client side as quickly as the server is sending it. This can lead to timeouts.

`Measurement:` Monitor how your Bandwidth usage change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). Note that this code may not run successfully in some environments with restricted permissions (like Azure WebSites).

`Resolution:` Increase Client VM size or reduce network bandwidth consumption.

----------

## Large Request/Response Size

`Problem:` A large request/response can cause timeouts. As an example, Suppose your timeout value configured on your client is 1 second. Your application requests two keys (e.g. 'A' and 'B') at the same time (using the same physical network connection). Most clients support "Pipelining" of requests, such that both requests 'A' and 'B' are sent on the wire to the server one after the other without waiting for the responses. The server will send the responses back in the same order. If response 'A' is large enough it can eat up most of the timeout for subsequent requests. 

Below, I will try to demonstrate this. In this scenario, Request 'A' and 'B' are sent quickly, the server starts sending responses 'A' and 'B' quickly, but because of data transfer times, 'B' get stuck behind the other request and times out even though the server responded quickly.

    |-------- 1 Second Timeout (A)----------|
    |-Request A-|
         |-------- 1 Second Timeout (B) ----------|
         |-Request B-|
                |- Read Response A --------|
                                           |- Read Response B-| (**TIMEOUT**)



`Measurement:` This is a difficult one to measure. You basically have to instrument your client code to track large requests and responses. 

`Resolution:` 

 1. Redis is optimized for a large number of small values, rather than a few large values. The preferred solution is to break up your data into related smaller values. [See here](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details around why smaller values are recommended.
 2. Increase the size of your VM (for client and Redis Cache Server), to get higher bandwidth capabilities, reducing data transfer times for larger responses. Note that getting more bandwidth on just the server or just on the client may not be enough. Measure your bandwidth usage and compare it to the capabilities of the size of VM you currently have.
 3. Increase the number of ConnectionMultiplexer objects you use and round-robin requests over different connections.






## Server side troubleshooting

Diagnosing Redis errors on the *server side*
---------------
Customers periodically ask "Why am I getting errors when talking to Redis". The answer is complicated - it could be a client or server side problem. In this article, I am going to talk about server side issues. For client side issues, [see here](https://gist.github.com/JonCole/db0e90bedeb3fc4823c2)

Server side delays can be caused by several things like:

## Memory Pressure on the server

`Problem:` Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk. This *page faulting* causes the system to slow down significantly. There are several possible causes of this memory pressure: 

 1. You have filled the cache to full capacity with data. 
 2. Redis is seeing high memory fragmentation - most often caused by storing large objects (Redis is optimized for a small objects - [See here](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details). 

`Measurement:` Redis exposes two stats that can help you identify this issue. The first is "used_memory" and the other is "used_memory_rss". These stats are available through the Azure Portal or through the [Redis INFO](http://redis.io/commands/info) command.

`Resolution:` There are several possible changes that you can make to help keep memory usage healthy:

 1. [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. Note that this may not be sufficient if you have fragmentation.
 2. [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation.
 3. Break up your large cached objects into smaller related objects.
 4. Upgrade to a larger cache size.

## High CPU usage / Server Load

`Problem:` High CPU usage can mean that the client side can fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

`Measurement:` Monitor the System Wide CPU usage through the azure portal or through the associated perf counter. Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high. Watch for spikes in CPU usage that correspond with timeouts.

`Resolution:` Upgrade to a larger VM size with more CPU capacity or investigate what is causing CPU spikes. 

##Server Side Bandwidth Exceeded

`Problem:` Different sized cache instances have limitations on how much network bandwidth they have available. If the server exceeds the available bandwidth, then data will not be sent to the client as quickly. This can lead to timeouts.

`Measurement:` Coming soon...

`Resolution:` Coming soon...


##Running Expensive Operations/Scripts

`Problem:` [See SLOWLOG](http://redis.io/commands/slowlog). More coming soon...

`Measurement:` coming soon...

`Resolution:` coming soon... 


