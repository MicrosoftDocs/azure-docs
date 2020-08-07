---
title: Troubleshoot Azure Cache for Redis timeouts
description: Learn how to resolve common timeout issues with Azure Cache for Redis, such as redis server patching and StackExchange.Redis timeout exceptions.
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 10/18/2019
---
# Troubleshoot Azure Cache for Redis timeouts

This section discusses troubleshooting timeout issues that occur when connecting to Azure Cache for Redis.

- [Redis server patching](#redis-server-patching)
- [StackExchange.Redis timeout exceptions](#stackexchangeredis-timeout-exceptions)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Redis server patching

Azure Cache for Redis regularly updates its server software as part of the managed service functionality that it provides. This [patching](cache-failover.md) activity takes place largely behind the scene. During the failovers when Redis server nodes are being patched, Redis clients connected to these nodes may experience temporary timeouts as connections are switched between these nodes. See [How does a failover affect my client application](cache-failover.md#how-does-a-failover-affect-my-client-application) for more information on what side-effects patching can have on your application and how you can improve its handling of patching events.

## StackExchange.Redis timeout exceptions

StackExchange.Redis uses a configuration setting named `synctimeout` for synchronous operations with a default value of 1000 ms. If a synchronous call doesn’t complete in this time, the StackExchange.Redis client throws a timeout error similar to the following example:

```output
    System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641, inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0 IOCP: (Busy=6, Free=999, Min=2,Max=1000), WORKER (Busy=7,Free=8184,Min=2,Max=8191)
```

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

You can use the following steps to investigate possible root causes.

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

    ```output
    synctimeout=2000,cachename.redis.cache.windows.net,abortConnect=false,ssl=true,password=...
    ```

1. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.
1. If your requests are bound by bandwidth limitations on the server or client, it takes longer for them to complete and can cause timeouts. To see if your timeout is because of network bandwidth on the server, see [Server-side bandwidth limitation](cache-troubleshoot-server.md#server-side-bandwidth-limitation). To see if your timeout is because of client network bandwidth, see [Client-side bandwidth limitation](cache-troubleshoot-client.md#client-side-bandwidth-limitation).
1. Are you getting CPU bound on the server or on the client?

   - Check if you're getting bound by CPU on your client. High CPU could cause the request to not be processed within the `synctimeout` interval and cause a request to time out. Moving to a larger client size or distributing the load can help to control this problem.
   - Check if you're getting CPU bound on the server by monitoring the CPU [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). Requests coming in while Redis is CPU bound can cause those requests to time out. To address this condition, you can distribute the load across multiple shards in a premium cache, or upgrade to a larger size or pricing tier. For more information, see [Server-side bandwidth limitation](cache-troubleshoot-server.md#server-side-bandwidth-limitation).
1. Are there commands taking long time to process on the server? Long-running commands that are taking long time to process on the redis-server can cause timeouts. For more information about long-running commands, see [Long-running commands](cache-troubleshoot-server.md#long-running-commands). You can connect to your Azure Cache for Redis instance using the redis-cli client or the [Redis Console](cache-configure.md#redis-console). Then, run the [SLOWLOG](https://redis.io/commands/slowlog) command to see if there are requests slower than expected. Redis Server and StackExchange.Redis are optimized for many small requests rather than fewer large requests. Splitting your data into smaller chunks may improve things here.

    For information on connecting to your cache's TLS/SSL endpoint using redis-cli and stunnel, see the blog post [Announcing ASP.NET Session State Provider for Redis Preview Release](https://devblogs.microsoft.com/aspnet/announcing-asp-net-session-state-provider-for-redis-preview-release/).
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

   For more information, see [Memory pressure on Redis server](cache-troubleshoot-server.md#memory-pressure-on-redis-server).

## Additional information

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
