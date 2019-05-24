---
title: How to troubleshoot Azure Cache for Redis | Microsoft Docs
description: Learn how to resolve common issues with Azure Cache for Redis.
services: cache
documentationcenter: ''
author: yegu-ms
manager: jhubbard
editor: ''

ms.assetid: 928b9b9c-d64f-4252-884f-af7ba8309af6
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: article
ms.date: 03/15/2019
ms.author: yegu

---
# How to troubleshoot Azure Cache for Redis

This article helps troubleshoot different categories of issues you may experience when connecting with Azure Cache for Redis instances.

- [Client-side troubleshooting](#client-side-troubleshooting) helps identify and resolve issues in the application connecting to your cache.
- [Server-side troubleshooting](#server-side-troubleshooting) helps identify and resolve issues that occur on the Azure Cache for Redis side.
- [Data-loss troubleshooting](#data-loss-troubleshooting) helps identify and resolve incidents where keys are expected but not found in your cache.
- [StackExchange.Redis timeout exceptions](#stackexchangeredis-timeout-exceptions) provides specific guidance on troubleshooting issues with the StackExchange.Redis library.

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>
>

## Client-side troubleshooting

This section discusses troubleshooting issues that occur because of a condition on the client application.

- [Memory pressure on the client](#memory-pressure-on-the-client)
- [Burst of traffic](#burst-of-traffic)
- [High client CPU usage](#high-client-cpu-usage)
- [Client-Side Bandwidth Exceeded](#client-side-bandwidth-exceeded)
- [Large Request/Response Size](#large-requestresponse-size)

### Memory pressure on the client

Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of responses from the cache. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly.

To detect memory pressure on the client:

- Monitor memory usage on machine to make sure that it doesn't exceed available memory.
- Monitor the client's `Page Faults/Sec` performance counter. During normal operation, most systems have some page faults. Spikes in page faults corresponding with request timeouts can indicate memory pressure.

High memory pressure on the client can be mitigated several ways:

- Dig into your memory usage patterns to reduce memory consumption on the client.
- Upgrade your client VM to a larger size with more memory.

### Burst of traffic

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side.

Monitor how your `ThreadPool` statistics change over time using [an example `ThreadPoolLogger`](https://github.com/JonCole/SampleCode/blob/master/ThreadPoolMonitor/ThreadPoolLogger.cs). You can use  `TimeoutException` messages from StackExchange.Redis like below to further investigate:

    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0,
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)

In the preceding exception, there are several issues that are interesting:

- Notice that in the `IOCP` section and the `WORKER` section you have a `Busy` value that is greater than the `Min` value. This difference means your `ThreadPool` settings need adjusting.
- You can also see `in: 64221`. This value indicates that 64,211 bytes have been received at the client's kernel socket layer but haven't been read by the application. This difference typically means that your application (for example, StackExchange.Redis) isn't reading data from the network as quickly as the server is sending it to you.

You can [configure your `ThreadPool` Settings](https://gist.github.com/JonCole/e65411214030f0d823cb) to make sure that your thread pool scales up quickly under burst scenarios.

### High client CPU usage

High client CPU usage indicates the system can't keep up with the work it's been asked to do. Even though the cache sent the response quickly, the client may fail to process the response in a timely fashion.

Monitor the client's system-wide CPU usage using metrics available in the Azure portal or through performance counters on the machine. Be careful not to monitor *process* CPU because a single process can have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU may also cause high `in: XXX` values in `TimeoutException` error messages as described in the [Burst of traffic](#burst-of-traffic) section.

> [!NOTE]
> StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `TimeoutException` error messages. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.
>
>

To mitigate a client's high CPU usage:

- Investigate what is causing CPU spikes.
- Upgrade your client to a larger VM size with more CPU capacity.

### Client-side bandwidth exceeded

Depending on the architecture of client machines, they may have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth by overloading network capacity, then data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts.

Monitor how your Bandwidth usage change over time using [an example `BandwidthLogger`](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). This code may not run successfully in some environments with restricted permissions (like Azure web sites).

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity.

### Large Request/Response Size

A large request/response can cause timeouts. As an example, suppose your timeout value configured on your client is 1 second. Your application requests two keys (for example, 'A' and 'B') at the same time (using the same physical network connection). Most clients support request "pipelining", where both requests 'A' and 'B' are sent one after the other without waiting for their responses. The server sends the responses back in the same order. If response 'A' is large, it can eat up most of the timeout for later requests.

In the following example, request 'A' and 'B' are sent quickly to the server. The server starts sending responses 'A' and 'B' quickly. Because of data transfer times, response 'B' must wait behind response 'A' times out even though the server responded quickly.

    |-------- 1 Second Timeout (A)----------|
    |-Request A-|
         |-------- 1 Second Timeout (B) ----------|
         |-Request B-|
                |- Read Response A --------|
                                           |- Read Response B-| (**TIMEOUT**)

This request/response is a difficult one to measure. You could instrument your client code to track large requests and responses.

Resolutions for large response sizes are varied but include:

1. Optimize your application for a large number of small values, rather than a few large values.
    - The preferred solution is to break up your data into related smaller values.
    - See the post [What is the ideal value size range for redis? Is 100 KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details on why smaller values are recommended.
1. Increase the size of your VM to get higher bandwidth capabilities
    - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
    - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
1. Increase the number of connection objects your application uses.
    - Use a round-robin approach to make requests over different connection objects.

## Server-side troubleshooting

This section discusses troubleshooting issues that occur because of a condition on the cache server.

- [Memory Pressure on the server](#memory-pressure-on-the-server)
- [High CPU usage / Server Load](#high-cpu-usage--server-load)
- [Server Side Bandwidth Exceeded](#server-side-bandwidth-exceeded)

### Memory Pressure on the server

Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly. There are several possible causes of this memory pressure:

- The cache is filled with data near its maximum capacity.
- Redis is seeing high memory fragmentation. This fragmentation is most often caused by storing large objects since Redis is optimized for small objects.

Redis exposes two stats through the [INFO](https://redis.io/commands/info) command that can help you identify this issue: "used_memory" and "used_memory_rss". You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) using the portal.

There are several possible changes you can make to help keep memory usage healthy:

- [Configure a memory policy](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys. This policy may not be sufficient if you have fragmentation.
- [Configure a maxmemory-reserved value](cache-configure.md#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation. For more information, see the additional [considerations for memory reservations](#considerations-for-memory-reservations) below.
- Break up your large cached objects into smaller related objects.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like used memory to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity.

#### Considerations for Memory Reservations

Updating memory reservation values, like maxmemory-reserved, can affect cache performance. Suppose you have a 53-GB cache that is filled with 49 GB of data. Changing the reservation value to 8 GB drops the system's max available memory to 45 GB. If _used_memory_ or _used_memory_rss_ values are higher than 45 GB, the system may evict data until both _used_memory_ and _used_memory_rss_ are below 45 GB. Eviction can increase server load and memory fragmentation.

### High CPU usage / Server Load

A high server load or CPU usage means the server can't process requests in a timely fashion. The server may be slow to respond and unable to keep up with request rates.

[Monitor metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) such as CPU or server load. Watch for spikes in CPU usage that correspond with timeouts.

There are several changes you can make to mitigate high server load:

- Investigate what is causing CPU spikes such as running [expensive commands](#expensive-commands) or page faulting because of high memory pressure.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more CPU capacity.

#### Expensive commands

Not all Redis commands are created equally - some are more expensive to run than others. The [Redis commands documentation](https://redis.io/commands) shows the time complexity of each command. It's recommended you review the commands you're running on your cache to understand the performance impact of those commands. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without knowing that it's an O(N) operation. You can avoid KEYS by using [SCAN](https://redis.io/commands/scan) to reduce CPU spikes.

Using the [SLOWLOG](https://redis.io/commands/slowlog) command, you can measure expensive commands being executed against the server.

### Server-Side Bandwidth Exceeded

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, then data won't be sent to the client as quickly. Clients requests could time out because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](cache-how-to-monitor.md#view-metrics-with-azure-monitor) in the portal.

To mitigate situations where network bandwidth usage is close to maximum capacity:

- Change client call behavior to reduce network demand.
- [Create alerts](cache-how-to-monitor.md#alerts) on metrics like cache read or cache write to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity.

## Data-loss troubleshooting

I expected for certain data to be in my Azure Cache for Redis instance but it didn't seem to be there.

See [What happened to my data in Redis?](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md) for possible causes and resolutions.

## StackExchange.Redis timeout exceptions

StackExchange.Redis uses a configuration setting named `synctimeout` for synchronous operations with a default value of 1000 ms. If a synchronous call doesn’t complete in this time, the StackExchange.Redis client throws a timeout error similar to the following example:

    System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641, inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0 IOCP: (Busy=6, Free=999, Min=2,Max=1000), WORKER (Busy=7,Free=8184,Min=2,Max=8191)

This error message contains metrics that can help point you to the cause and possible resolution of the issue. The following table contains details about the error message metrics.

| Error message metric | Details |
| --- | --- |
| inst |In the last time slice: 0 commands have been issued |
| mgr |The socket manager is doing `socket.select`, which means it's asking the OS to indicate a socket that has something to do. The reader isn't actively reading from the network because it doesn't think there's anything to do |
| queue |There are 73 total in-progress operations |
| qu |6 of the in-progress operations are in the unsent queue and haven't yet been written to the outbound network |
| qs |67 of the in-progress operations have been sent to the server but a response isn't yet available. The response could be `Not yet sent by the server` or `sent by the server but not yet processed by the client.` |
| qc |0 of the in-progress operations have seen replies but haven't yet been marked as complete because they're waiting on the completion loop |
| wr |There's an active writer (meaning the 6 unsent requests aren't being ignored) bytes/activewriters |
| in |There are no active readers and zero bytes are available to be read on the NIC bytes/activereaders |

### Steps to investigate

1. As a best practice, make sure you're using the following pattern to connect when using the StackExchange.Redis client.

    ```csharp
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
    ```

    For more information, see [Connect to the cache using StackExchange.Redis](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache).

1. Ensure that your server and the client application are in the same region in Azure. For example, you might be getting timeouts when your cache is in East US but the client is in West US and the request doesn't complete within the `synctimeout` interval or you might be getting timeouts when you're debugging from your local development machine. 

    It’s highly recommended to have the cache and in the client in the same Azure region. If you have a scenario that includes cross region calls, you should set the `synctimeout` interval to a value higher than the default 1000-ms interval by including a `synctimeout` property in the connection string. The following example shows a snippet of a connection string for StackExchange.Redis provided by Azure Cache for Redis with a `synctimeout` of 2000 ms.

        synctimeout=2000,cachename.redis.cache.windows.net,abortConnect=false,ssl=true,password=...
1. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.
1. If your requests are bound by bandwidth limitations on the server or client, it takes longer for them to complete and can cause timeouts. To see if your timeout is because of network bandwidth on the server, see [Server-side bandwidth exceeded](#server-side-bandwidth-exceeded). To see if your timeout is because of client network bandwidth, see [Client-side bandwidth exceeded](#client-side-bandwidth-exceeded).
1. Are you getting CPU bound on the server or on the client?

   - Check if you're getting bound by CPU on your client. High CPU could cause the request to not be processed within the `synctimeout` interval and cause a request to time out. Moving to a larger client size or distributing the load can help to control this problem.
   - Check if you're getting CPU bound on the server by monitoring the `CPU` [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). Requests coming in while Redis is CPU bound can cause those requests to time out. To address this condition, you can distribute the load across multiple shards in a premium cache, or upgrade to a larger size or pricing tier. For more information, see [Server Side Bandwidth Exceeded](#server-side-bandwidth-exceeded).
1. Are there commands taking long time to process on the server? Long-running commands that are taking long time to process on the redis-server can cause timeouts. For more information about long-running commands, see [Expensive commands](#expensive-commands). You can connect to your Azure Cache for Redis instance using the redis-cli client or the [Redis Console](cache-configure.md#redis-console). Then, run the [SLOWLOG](https://redis.io/commands/slowlog) command to see if there are requests slower than expected. Redis Server and StackExchange.Redis are optimized for many small requests rather than fewer large requests. Splitting your data into smaller chunks may improve things here.

    For information on connecting to your cache's SSL endpoint using redis-cli and stunnel, see the blog post [Announcing ASP.NET Session State Provider for Redis Preview Release](https://blogs.msdn.com/b/webdev/archive/2014/05/12/announcing-asp-net-session-state-provider-for-redis-preview-release.aspx).
1. High Redis server load can cause timeouts. You can monitor the server load by monitoring the `Redis Server Load` [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). A server load of 100 (maximum value) signifies that the redis server has been busy, with no idle time, processing requests. To see if certain requests are taking up all of the server capability, run the SlowLog command, as described in the previous paragraph. For more information, see High CPU usage / Server Load.
1. Was there any other event on the client side that could have caused a network blip? Common events include: scaling the number of client instances up or down, deploying a new version of the client, or autoscale enabled. In our testing, we have found that autoscale or scaling up/down can cause outbound network connectivity to be lost for several seconds. StackExchange.Redis code is resilient to such events and reconnects. While reconnecting, any requests in the queue can time out.
1. Was there a large request preceding several small requests to the cache that timed out? The parameter `qs` in the error message tells you how many requests were sent from the client to the server, but haven't processed a response. This value can keep growing because StackExchange.Redis uses a single TCP connection and can only read one response at a time. Even though the first operation timed out, it doesn't stop more data from being sent to or from the server. Other requests will be blocked until the large request is finished and can cause time outs. One solution is to minimize the chance of timeouts by ensuring that your cache is large enough for your workload and splitting large values into smaller chunks. Another possible solution is to use a pool of `ConnectionMultiplexer` objects in your client, and choose the least loaded `ConnectionMultiplexer` when sending a new request. Loading across multiple connection objects should prevent a single timeout from causing other requests to also time out.
1. If you're using `RedisSessionStateProvider`, ensure you have set the retry timeout correctly. `retryTimeoutInMilliseconds` should be higher than `operationTimeoutInMilliseconds`, otherwise no retries occur. In the following example `retryTimeoutInMilliseconds` is set to 3000. For more information, see [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md) and [How to use the configuration parameters of Session State Provider and Output Cache Provider](https://github.com/Azure/aspnet-redis-providers/wiki/Configuration).

    ```xml
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
    ```

1. Check memory usage on the Azure Cache for Redis server by [monitoring](cache-how-to-monitor.md#available-metrics-and-reporting-intervals) `Used Memory RSS` and `Used Memory`. If an eviction policy is in place, Redis starts evicting keys when `Used_Memory` reaches the cache size. Ideally, `Used Memory RSS` should be only slightly higher than `Used memory`. A large difference means there's memory fragmentation (internal or external). When `Used Memory RSS` is less than `Used Memory`, it means part of the cache memory has been swapped by the operating system. If this swapping occurs, you can expect some significant latencies. Because Redis doesn't have control over how its allocations are mapped to memory pages, high `Used Memory RSS` is often the result of a spike in memory usage. When Redis server frees memory, the allocator takes the memory but it may or may not give the memory back to the system. There may be a discrepancy between the `Used Memory` value and memory consumption as reported by the operating system. Memory may have been used and released by Redis but not given back to the system. To help mitigate memory issues, you can do the following steps:

   - Upgrade the cache to a larger size so that you aren't running against memory limitations on the system.
   - Set expiration times on the keys so that older values are evicted proactively.
   - Monitor the `used_memory_rss` cache metric. When this value approaches the size of their cache, you're likely to start seeing performance issues. Distribute the data across multiple shards if you're using a premium cache, or upgrade to a larger cache size.

   For more information, see [Memory Pressure on the server](#memory-pressure-on-the-server).

## Additional information

- [What Azure Cache for Redis offering and size should I use?](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use)
- [How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
- [How can I run Redis commands?](cache-faq.md#how-can-i-run-redis-commands)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
