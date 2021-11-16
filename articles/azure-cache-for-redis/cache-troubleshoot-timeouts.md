---
title: Troubleshoot Azure Cache for Redis latency and timeouts
description: Learn how to resolve common latency and timeout issues with Azure Cache for Redis, such as Redis server patching and StackExchange.Redis timeout exceptions.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.custom: devx-track-csharp
ms.date: 11/3/2021
---
# Troubleshoot Azure Cache for Redis latency and timeouts

A client operation that does not receive a timely response results in timeout exceptions in the client application. An operation could timeout at various stages. Based on where the timeout coming from, there are various reasons and mitigations.

This section discusses troubleshooting timeout issues that occur when connecting to Azure Cache for Redis.
<!-- I think we should move this. -->

- [Redis server patching](#redis-server-patching)
- [StackExchange.Redis timeout exceptions](#stackexchangeredis-timeout-exceptions)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Redis server patching

Azure Cache for Redis regularly updates its server software as part of the managed service functionality that it provides. This [patching](cache-failover.md) activity takes place largely behind the scene. During the failovers when Redis server nodes are being patched, Redis clients connected to these nodes can experience temporary timeouts as connections are switched between these nodes. For more information on the side-effects patching can have on your application and how to improve its handling of patching events, see [How does a failover affect my client application](cache-failover.md#how-does-a-failover-affect-my-client-application).

## StackExchange.Redis timeout exceptions

StackExchange.Redis uses a configuration setting named `synctimeout` for synchronous operations with a default value of 5000 ms. If a synchronous call doesn’t complete in this time, the StackExchange.Redis client throws a timeout error similar to the following example:

```output
    System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641, inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0 IOCP: (Busy=6, Free=999, Min=2,Max=1000), WORKER (Busy=7,Free=8184,Min=2,Max=8191)
```

This error message contains metrics that can help point you to the cause and possible resolution of the issue. The following table contains details about the error message metrics.

| Error message metric | Details |
| --- | --- |
| `inst` |In the last time slice: 0 commands have been issued |
| `mgr` |The socket manager is doing `socket.select`, which means it's asking the OS to indicate a socket that has something to do. The reader isn't actively reading from the network because it doesn't think there's anything to do |
| `queue` |There are 73 total in-progress operations |
| `qu` |6 of the in-progress operations are in the unsent queue and haven't yet been written to the outbound network |
| `qs`|67 of the in-progress operations have been sent to the server but a response isn't yet available. The response could be `Not yet sent by the server` or `sent by the server but not yet processed by the client.` |
| `qc` |Zero of the in-progress operations have seen replies but haven't yet been marked as complete because they're waiting on the completion loop |
| `wr` |There's an active writer (meaning the six unsent requests aren't being ignored) bytes/activewriters |
| `in` |There are no active readers and zero bytes are available to be read on the NIC bytes/activereaders |

In the preceding exception example, the `IOCP` and `WORKER` sections each include a `Busy` value that is greater than the `Min` value. The difference means that you should adjust your `ThreadPool` settings. You can [configure your ThreadPool settings](cache-management-faq.yml#important-details-about-threadpool-growth) to ensure that your thread pool scales up quickly under burst scenarios.

You can use the following steps to eliminate possible root causes.

1. As a best practice, make sure you're using the ForceReconnect pattern to detect and replace stalled connections as described in the article [Connection resilience](cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis).

   For more information on using StackExchange.Redis, see [Connect to the cache using StackExchange.Redis](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache). 

1. Ensure that your server and the client application are in the same region in Azure. For example, you might be getting timeouts when your cache is in East US but the client is in West US and the request doesn't complete within the `synctimeout` interval or you might be getting timeouts when you're debugging from your local development machine.

    It’s highly recommended to have the cache and in the client in the same Azure region. If you have a scenario that includes cross region calls, you should set the `synctimeout` interval to a value higher than the default 5000-ms interval by including a `synctimeout` property in the connection string. The following example shows a snippet of a connection string for StackExchange.Redis provided by Azure Cache for Redis with a `synctimeout` of 8000 ms.

    ```output
    synctimeout=8000,cachename.redis.cache.windows.net,abortConnect=false,ssl=true,password=...
    ```

1. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.
1. If your requests are bound by bandwidth limitations on the server or client, it takes longer for them to complete and can cause timeouts. To see if your timeout is because of network bandwidth on the server, see [Server-side bandwidth limitation](cache-troubleshoot-server.md#server-side-bandwidth-limitation). To see if your timeout is because of client network bandwidth, see [Client-side bandwidth limitation](cache-troubleshoot-client.md#client-side-bandwidth-limitation).
1. Are you getting CPU bound on the server or on the client?

   - Check if you're getting bound by CPU on your client. High CPU could cause the request to not be processed within the `synctimeout` interval and cause a request to time out. Moving to a larger client size or distributing the load can help to control this problem.
   - Check if you're getting CPU bound on the server by monitoring the CPU [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). Requests coming in while Redis is CPU bound can cause those requests to time out. To address this condition, you can distribute the load across multiple shards in a premium cache, or upgrade to a larger size or pricing tier. For more information, see [Server-side bandwidth limitation](cache-troubleshoot-server.md#server-side-bandwidth-limitation).
1. Are there commands taking long time to process on the server? Long-running commands that are taking long time to process on the redis-server can cause timeouts. For more information about long-running commands, see [Long-running commands](cache-troubleshoot-server.md#long-running-commands). You can connect to your Azure Cache for Redis instance using the redis-cli client or the [Redis Console](cache-configure.md#redis-console). Then, run the [SLOWLOG](https://redis.io/commands/slowlog) command to see if there are requests slower than expected. Redis Server and StackExchange.Redis are optimized for many small requests rather than fewer large requests. Splitting your data into smaller chunks may improve things here.

    For information on connecting to your cache's TLS/SSL endpoint using redis-cli and stunnel, see the blog post [Announcing ASP.NET Session State Provider for Redis Preview Release](https://devblogs.microsoft.com/aspnet/announcing-asp-net-session-state-provider-for-redis-preview-release/).
1. High Redis server load can cause timeouts. You can monitor the server load by monitoring the `Redis Server Load` [cache performance metric](cache-how-to-monitor.md#available-metrics-and-reporting-intervals). A server load of 100 (maximum value) signifies that the Redis server has been busy, with no idle time, processing requests. To see if certain requests are taking up all of the server capability, run the SlowLog command, as described in the previous paragraph. For more information, see High CPU usage / Server Load.
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

## Client-side troubleshooting

### Traffic burst and thread pool configuration 

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side. Check the metric "Errors" (Type: UnresponsiveClients) to validate if your client hosts can keep up with sudden spike in traffic.

If you are using StackExchange.Redis, see for troubleshooting further

### Large key value 

See <updated development best practices link> for an explanation of how large key values lead to timeouts.

You can use the `redis-cli --bigkeys` command to check for large keys in your cache. See [redis-cli, the Redis command line interface -- Redis](https://redis.io/topics/rediscli) for more information.
    1. Increase the size of your VM to get higher bandwidth capabilities
        - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
        - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
    1. Increase the number of connection objects your application uses.
        - Use a round-robin approach to make requests over different connection objects

### High CPU on client hosts

High CPU usage on the client side can cause that the client host to fail to keep up with the responses from Azure Cache For Redis and result in a timeout. Our recommendation is not having Client CPU above 80%. Check the metric "Errors" (Type: `UnresponsiveClients`) to validate if your client hosts are able to process responses from Redis server in time.

Monitor the client's system-wide CPU usage using metrics available in the Azure portal or through performance counters on the machine. Be careful not to monitor *process* CPU because a single process might have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU may also cause high in: XXX values in TimeoutException error messages as described in the [Traffic burst](cache-troubleshoot-client.md#traffic-burst) section.

To mitigate a client machine's high CPU usage:
    - Investigate what is causing CPU spikes.
    - Upgrade your client to a larger VM size with more CPU capacity.

### Network bandwidth limitation on client hosts

Depending on the architecture of client machines, they may have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth by overloading network capacity, then data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts. We recommend hosting client applications in the same region as the Azure Cache For Redis and client machines to have as much network bandwidth as the cache you are using.

Monitor how your Bandwidth usage change over time using [an example BandwidthLogger](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). This code may not run successfully in some environments with restricted permissions (like Azure web sites).

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity

### TCP settings for Linux based client applications

Due to optimistic TCP settings in Linux, client applications hosted on Linux could experience connectivity issues. See <link to 15 mins issue>

### RedisSessionStateProvider retry timeout
If you're using RedisSessionStateProvider, ensure you have set the retry timeout correctly.`retryTimeoutInMilliseconds` should be higher than `operationTimeoutInMilliseconds`, otherwise no retries occur. In the following example `retryTimeoutInMilliseconds` is set to 3000. For more information, see [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md) and [How to use the configuration parameters of Session State Provider and Output Cache Provider](https://github.com/Azure/aspnet-redis-providers/wiki/Configuration).

 ```xml
 
 <add 
    name="AFRedisCacheSessionStateProvider"
    type="Microsoft.Web.Redis.RedisSessionStateProvider"
    host="enbwcache.redis.cache.windows.net"
    port="6380"
    accessKey="..."
    ssl="true"
    databaseId="0"
    applicationName="AFRedisCacheSessionState"
    connectionTimeoutInMilliseconds = "5000"
    operationTimeoutInMilliseconds = "1000"
    retryTimeoutInMilliseconds="3000"
    >
```

## Server-side troubleshooting

### Server maintenance

Planned or unplanned maintenance can cause disruptions with client connections. The number and type of exceptions depends on the location of the request in the code path, when the cache closes its connections. For instance, an operation that sends a request but hasn't received a response when the failover occurs might get a time-out exception. New requests on the closed connection object receive connection exceptions until the reconnection happens successfully. To check whether your Azure Cache for Redis had a failover during the time when you encountered timeouts, check the metric "Errors" (Type: Failover) on the portal. See <patching and failover link> for more information on failovers.

### High CPU load

High CPU load means the Redis server will be unable to keep up with the requests leading to timeout. Check the "Server Load" metric on your cache to check CPU load. Common causes for high CPU load are running expensive or long running commands<add link to section below> and high volume of operations. Depending on the expected operations volume and client connections, your cache may need to be scaled up or out. See <link for when to scale> for when to scale. [Create alerts](cache-how-to-monitor#alerts) on metrics like CPU or server load to be notified early about potential impacts

### High Memory usage

1. High memory usage causes page faults, which in turn leads to increase in CPU load. Check the "Used Memory", "Used Memory Percentage" and "Used Memory RSS" metrics on the portal to see your Azure Cache for Redis memory usage. More information on memory management <link>. Consider scaling to a large cache sku to get more memory. [Create alerts](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-monitor#alerts) on metrics like CPU or server load to be notified early about potential impacts.

### Long running commands

Some commands are more expensive than others to execute, depending on their complexity, and that may cause high CPU/Server Load, or Redis timeouts as that type of commands can be computational &/or memory intensive. Because Redis is a single-threaded server side system, the time needed to run some more time expensive commands may cause some latency or timeouts on client side, as server can be busy dealing with these expensive commands. Command complexity is described on top of each command description, on [Redis.io commands](https://redis.io/commands) :

Customers can use a console to run these Redis commands to investigate long running and expensive commands.

- [SLOWLOG](https://redis.io/commands/slowlog) is used in order to read and reset the Redis slow queries log and can be used to investigate long running commands on client side.
The Redis Slow Log is a system to log queries that exceeded a specified execution time. The execution time does not include I/O operations like talking with the client, sending the reply and so forth, but just the time needed to actually execute the command. Using the SLOWLOG command, Customers can measure/log expensive commands being executed against their Redis server.
- [MONITOR](https://redis.io/commands/monitor) is a debugging command that streams back every command processed by the Redis server. It can help in understanding what is happening to the database. Be aware that this command have high performance impact and may cause performance degradation.
- [INFO](https://redis.io/commands/info)  - command returns information and statistics about the server in a format that is simple to parse by computers and easy to read by humans. On this 
    case the CPU section could be useful to investigate the CPU usage.

A **server_load** of 100 (maximum value) signifies that the Redis server has been busy all the time (has not been idle) processing the requests.

Output sample:

```azurecli-interactive
# CPU
used_cpu_sys:530.70
used_cpu_user:445.09
used_cpu_avg_ms_per_sec:0
server_load:0.01
event_wait:1
event_no_wait:1
event_wait_count:10
event_no_wait_count:1
```

- [CLIENT LIST](https://redis.io/commands/client-list)  - returns information and statistics about the client connections server in a mostly human readable format.

### Network bandwidth exceeded

If the Redis server exceeds the available network bandwidth, then responses are not be sent back fast enough,causing timeouts on the client side.

You can estimate how much network bandwidth is being used by checking the Cache Read and Cache Write metrics on the portal. For bandwidth information per tier, see [Azure Cache for Redis planning FAQs](cache-planning-faq.yml#azure-cache-for-redis-performance).

## Additional information

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
