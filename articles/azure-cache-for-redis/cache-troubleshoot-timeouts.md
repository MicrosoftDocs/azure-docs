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

A client operation that does not receive a timely response can result in a timeout exception. An operation could timeout at various stages. Where the timeout comes from helps to determine the cause and the mitigation. 
<!-- what do we want to say about latency -->

This section discusses troubleshooting for latency and timeout issues that occur when connecting to Azure Cache for Redis.
- [Client-side troubleshooting](#client-side-troubleshooting)
- [Server-side troubleshooting](#server-side-troubleshooting)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Client-side troubleshooting

### Traffic burst and thread pool configuration

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis server but not yet consumed on the client side. Check the metric "Errors" (Type: UnresponsiveClients) to validate if your client hosts can keep up with a sudden spike in traffic.

### Large key value

See <!-- updated development best practices link --> for an explanation of how large key values lead to timeouts.

You can use the `redis-cli --bigkeys` command to check for large keys in your cache. See [redis-cli, the Redis command line interface--Redis](https://redis.io/topics/rediscli) for more information.
    1. Increase the size of your VM to get higher bandwidth capabilities
        - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
        - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
    1. Increase the number of connection objects your application uses.
        - Use a round-robin approach to make requests over different connection objects

### High CPU on client hosts

High CPU usage on the client side can cause that the client host to fail to keep up with the responses from Redis server and result in a timeout. Our recommendation is to keep client CPU below 80%. Check the metric "Errors" (Type: `UnresponsiveClients`) to determine if your client hosts can process responses from Redis server in time.

Monitor the client's system-wide CPU usage using metrics available in the Azure portal or through performance counters on the machine. Be careful not to monitor *process* CPU because a single process might have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU can also cause high in: XXX values in TimeoutException error messages as described in the [Traffic burst](cache-troubleshoot-client.md#traffic-burst) section.

To mitigate a client machine's high CPU usage:
    - Investigate what is causing CPU spikes.
    - Upgrade your client to a larger VM size with more CPU capacity.

### Network bandwidth limitation on client hosts

Depending on the architecture of client machines, they may have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth by overloading network capacity, then data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts. We recommend hosting client applications in the same region as the Azure Cache For Redis. We recommend that client machines have as much network bandwidth as the cache you're using.

Monitor how your bandwidth usage change over time using [an example BandwidthLogger](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). This code might not run successfully in some environments with restricted permissions (like Azure web sites).

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity

### TCP settings for Linux based client applications

Because of optimistic TCP settings in Linux, client applications hosted on Linux could experience connectivity issues. See <!-- link to 15 mins issue -->

### RedisSessionStateProvider retry timeout

If you're using `RedisSessionStateProvider`, ensure you have set the retry timeout correctly. The `retryTimeoutInMilliseconds` value should be higher than the `operationTimeoutInMilliseconds` value. Otherwise, no retries occur. In the following example, `retryTimeoutInMilliseconds` is set to 3000. For more information, see [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md) and [How to use the configuration parameters of Session State Provider and Output Cache Provider](https://github.com/Azure/aspnet-redis-providers/wiki/Configuration).

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

Planned or unplanned maintenance can cause disruptions with client connections. The number and type of exceptions depends on the location of the request in the code path, when the cache closes its connections. For instance, an operation that sends a request but hasn't received a response when the failover occurs might get a time-out exception. New requests on the closed connection object receive connection exceptions until the reconnection happens successfully. To check whether your Azure Cache for Redis had a failover during when timeouts occured, check the metric "Errors" (Type: Failover) on the portal. See <!-- patching and failover link --> for more information on failovers.

### High CPU load

High CPU load means the Redis server is unable to keep up with the requests leading to timeout. Check the "Server Load" metric on your cache to check CPU load. Common causes for high CPU load are running expensive or long running commands <!-- add link to section below --> and high volume of operations. Depending on the expected operations volume and client connections, your cache may need to be scaled up or out. See <!-- link for when to scale --> for when to scale. [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.

### High Memory usage

High memory usage causes page faults, which in turn leads to increase in CPU load. Check the "Used Memory", "Used Memory Percentage" and "Used Memory RSS" metrics on the portal to see your Azure Cache for Redis memory usage. More information on memory management. Consider scaling to a large cache sku to get more memory. [Create alerts](cache-how-to-monitor.md#alerts) on metrics like CPU or server load to be notified early about potential impacts.

### Long running commands

Some commands are more expensive than others to execute, depending on their complexity, and that may cause high CPU/Server Load, or Redis timeouts as that type of commands can be computational &/or memory intensive. Because Redis is a single-threaded server-side system, the time needed to run some more time expensive commands may cause some latency or timeouts on client side, as server can be busy dealing with these expensive commands. Command complexity is described on top of each command description, on [Redis.io commands](https://redis.io/commands) :

Customers can use a console to run these Redis commands to investigate long running and expensive commands.

- [SLOWLOG](https://redis.io/commands/slowlog) is used in order to read and reset the Redis slow queries log and can be used to investigate long running commands on client side.
The Redis Slow Log is a system to log queries that exceeded a specified execution time. The execution time does not include I/O operations like talking with the client, sending the reply, and so forth, but just the time needed to actually execute the command. Using the SLOWLOG command, Customers can measure/log expensive commands being executed against their Redis server.
- [MONITOR](https://redis.io/commands/monitor) is a debugging command that streams back every command processed by the Redis server. It can help in understanding what is happening to the database. Be aware that this command have high performance impact and may cause performance degradation.
- [INFO](https://redis.io/commands/info) - command returns information and statistics about the server in a format that is simple to parse by computers and easy to read by humans. In this  case, the CPU section could be useful to investigate the CPU usage.

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

## StackExchange.Redis timeout exceptions

For more specific information to address timeouts when using StackExchange.Redis, see [Investigating timeout exceptions in StackExchange.Redis](https://azure.microsoft.com/en-us/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

## Additional information

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
