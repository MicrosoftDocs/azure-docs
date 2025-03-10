---
title: Troubleshoot Azure Cache for Redis latency and timeouts
description: Learn how to resolve common latency and timeout issues with Azure Cache for Redis, such as Redis server patching and timeout exceptions.



ms.topic: conceptual
ms.custom: devx-track-csharp
ms.date: 12/02/2023

---

# Troubleshoot Azure Cache for Redis latency and timeouts

A client operation that doesn't receive a timely response can result in a high latency or timeout exception. An operation could time out at various stages. Where the timeout comes from helps to determine the cause and the mitigation.

This section discusses troubleshooting for latency and timeout issues that occur when connecting to Azure Cache for Redis.

- [Client-side troubleshooting](#client-side-troubleshooting)
  - [Traffic burst and thread pool configuration](#troubleshoot-azure-cache-for-redis-latency-and-timeouts)
  - [Large key value](#large-key-value)
  - [High CPU on client hosts](#high-cpu-on-client-hosts)
  - [Network bandwidth limitation on client hosts](#network-bandwidth-limitation-on-client-hosts)
  - [TCP settings for Linux based client applications](#tcp-settings-for-linux-based-client-applications)
  - [RedisSessionStateProvider retry timeout](#redissessionstateprovider-retry-timeout)
- [Server-side troubleshooting](#server-side-troubleshooting)
  - [Server maintenance](#server-maintenance)
  - [High server load](#high-server-load)
  - [[Spikes in server load](#spikes-in-server-load)]
  - [High memory usage](#high-memory-usage)
  - [Long running commands](#long-running-commands)
  - [Network bandwidth limitation](#network-bandwidth-limitation)
  - [StackExchange.Redis timeout exceptions](#stackexchangeredis-timeout-exceptions)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#related-content) section.
>

## Client-side troubleshooting

Here's the client-side troubleshooting.

### Traffic burst and thread pool configuration

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis server but not yet consumed on the client side. Check the metric "Errors" (Type: UnresponsiveClients) to validate if your client hosts can keep up with a sudden spike in traffic.

You can use  `TimeoutException` messages from StackExchange.Redis to further investigate:

```output
    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0,
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)
```

In the preceding exception, there are several issues that are interesting:

- Notice that in the `IOCP` section and the `WORKER` section you have a `Busy` value that is greater than the `Min` value. This difference means your `ThreadPool` settings need adjusting.
- You can also see `in: 64221`. This value indicates that 64,221 bytes were received at the client's kernel socket layer but weren't read by the application. This difference typically means that your application (for example, StackExchange.Redis) isn't reading data from the network as quickly as the server is sending it to you.

You can [configure your `ThreadPool` Settings](cache-management-faq.yml#important-details-about-threadpool-growth) to make sure that your thread pool scales up quickly under burst scenarios.

### Large key value

For information about using multiple keys and smaller values, see [Consider more keys and smaller values](cache-best-practices-development.md#consider-more-keys-and-smaller-values).

You can use the `redis-cli --bigkeys` command to check for large keys in your cache. For more information, see [redis-cli, the Redis command line interface--Redis](https://redis.io/topics/rediscli).

- Increase the size of your VM to get higher bandwidth capabilities
  - More bandwidth on your client or server VM might reduce data transfer times for larger responses.
  - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client might not be enough.
- Increase the number of connection objects your application uses.
  - Use a round-robin approach to make requests over different connection objects

### High CPU on client hosts

High client CPU usage indicates the system can't keep up with the work assigned to it. Even though the cache sent the response quickly, the client might fail to process the response in a timely fashion. Our recommendation is to keep client CPU less 80%. Check the metric "Errors" (Type: `UnresponsiveClients`) to determine if your client hosts can process responses from Redis server in time.

Monitor the client's system-wide CPU usage using metrics available in the Azure portal or through performance counters on the machine. Be careful not to monitor process CPU because a single process can have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU might also cause high `in: XXX` values in `TimeoutException` error messages as described in the [[Traffic burst](#traffic-burst-and-thread-pool-configuration)] section.

> [!NOTE]
> StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `TimeoutException` error messages. Ensure you are using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). Bugs are regularly fixed in the code to make it more robust to timeouts. Having the latest version is important.
>

To mitigate a client's high CPU usage:

- Investigate what is causing CPU spikes.
- Upgrade your client to a larger VM size with more CPU capacity.

### Network bandwidth limitation on client hosts

Depending on the architecture of client machines, they might have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth by overloading network capacity, then data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts.

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity. For more information, see [Large request or response size](cache-best-practices-development.md#large-request-or-response-size).

### TCP settings for Linux based client applications

Because of optimistic TCP settings in Linux, client applications hosted on Linux could experience connectivity issues. For more information, see [TCP settings for Linux-hosted client applications](cache-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications)

### RedisSessionStateProvider retry timeout

If you're using `RedisSessionStateProvider`, ensure you set the retry timeout correctly. The `retryTimeoutInMilliseconds` value should be higher than the `operationTimeoutInMilliseconds` value. Otherwise, no retries occur. In the following example, `retryTimeoutInMilliseconds` is set to 3000. For more information, see [ASP.NET Session State Provider for Azure Cache for Redis](cache-aspnet-session-state-provider.md) and [ASP.NET Output Cache Provider for Azure Cache for Redis](cache-aspnet-output-cache-provider.md).

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

Here's the server-side troubleshooting.

### Server maintenance

Planned or unplanned maintenance can cause disruptions with client connections. The number and type of exceptions depends on the location of the request in the code path, and when the cache closes its connections. For instance, an operation that sends a request but doesn't receive a response when the failover occurs might get a time-out exception. New requests on the closed connection object receive connection exceptions until the reconnection happens successfully.

For more information, check these other sections:

- [Update channel and Schedule updates](cache-administration.md#update-channel-and-schedule-updates)
- [Connection resilience](cache-best-practices-connection.md#connection-resilience)
- `AzureRedisEvents` [notifications](cache-failover.md#can-i-be-notified-in-advance-of-maintenance)

To check whether your Azure Cache for Redis had a failover during when timeouts occurred, check the metric **Errors**. On the Resource menu of the Azure portal, select **Metrics**. Then create a new chart measuring the `Errors` metric, split by `ErrorType`. Once you create this chart, you see a count for **Failover**.

For more information on failovers, see [Failover and patching for Azure Cache for Redis](cache-failover.md).

### High server load

High server load means the Redis server is unable to keep up with the requests, leading to timeouts. The server might be slow to respond and unable to keep up with request rates.

[Monitor metrics](monitor-cache.md#monitor-azure-cache-for-redis) such as server load. Watch for spikes in `Server Load` usage that correspond with timeouts. [Create alerts](monitor-cache.md#create-alerts) on metrics on server load to be notified early about potential impacts.

There are several changes you can make to mitigate high server load:

- Investigate what is causing high server load such as [long-running commands](#long-running-commands), noted in this article, because of high memory pressure.
- [Scale](cache-how-to-scale.md) out to more shards to distribute load across multiple Redis processes or scale up to a larger cache size with more CPU cores. For more information, see  [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).
- If your production workload on a _C1_ cache is negatively affected by extra latency from some internal defender scan runs, you can reduce the effect by scaling to a higher tier offering  with multiple CPU cores, such as _C2_.

#### Spikes in server load

On _C0_ and _C1_ caches, you might see short spikes in server load not caused by an increase in requests a couple times a day while internal defender scanning is running on the VMs. You see higher latency for requests while internal defender scans happen on these tiers. Caches on the  _C0_ and _C1_ tiers only have a single core to multitask, dividing the work of serving internal defender scanning and Redis requests.

### High memory usage

This section was moved. For more information, see [High memory usage](cache-troubleshoot-server.md#high-memory-usage).

### Long running commands

Some Redis commands are more expensive to execute than others. The [Redis commands documentation](https://redis.io/commands) shows the time complexity of each command. Redis command processing is single-threaded. Any command that takes a long time to run can block all others that come after it.

Review the commands that you're issuing to your Redis server to understand their performance impacts. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without knowing that it's an O(N) operation. You can avoid KEYS by using [SCAN](https://redis.io/commands/scan) to reduce CPU spikes.

Using the [SLOWLOG GET](https://redis.io/commands/slowlog-get) command, you can measure expensive commands being executed against the server.

Customers can use a console to run these Redis commands to investigate long running and expensive commands.

- [SLOWLOG](https://redis.io/commands/slowlog) is used to read and reset the Redis slow queries log. It can be used to investigate long running commands on client side.
The Redis Slow Log is a system to log queries that exceeded a specified execution time. The execution time doesn't include I/O operations like talking with the client, sending the reply, and so forth, but just the time needed to actually execute the command. Customers can measure/log expensive commands being executed against their Redis server using the `SLOWLOG` command.
- [MONITOR](https://redis.io/commands/monitor) is a debugging command that streams back every command processed by the Redis server. It can help in understanding what is happening to the database. This command is demanding and can negatively affect performance. It can degrade performance.
- [INFO](https://redis.io/commands/info) - command returns information and statistics about the server in a format that is simple to parse by computers and easy to read by humans. In this  case, the CPU section could be useful to investigate the CPU usage. A server load of 100 (maximum value) signifies that the Redis server was busy all the time and was never idle when processing the requests.

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

- [CLIENT LIST](https://redis.io/commands/client-list) -  returns information and statistics about the client connections server in a mostly human readable format.

### Network bandwidth limitation

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, then data isn't sent to the client as quickly. Client requests could time out because the server can't push data to the client fast enough.

The "Cache Read" and "Cache Write" metrics can be used to see how much server-side bandwidth is being used. You can [view these metrics](monitor-cache.md#view-cache-metrics) in the portal. [Create alerts](monitor-cache.md#create-alerts) on metrics like cache read or cache write to be notified early about potential impacts.

To mitigate situations where network bandwidth usage is close to maximum capacity:

- Change client call behavior to reduce network demand.
- [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity. For more information, see [Azure Cache for Redis planning FAQs](cache-planning-faq.yml#azure-cache-for-redis-performance).

## StackExchange.Redis timeout exceptions

For more specific information to address timeouts when using StackExchange.Redis, see [Investigating timeout exceptions in StackExchange.Redis](https://azure.microsoft.com/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

## Related content

- [Troubleshoot Azure Cache for Redis client-side issues](cache-troubleshoot-client.md)
- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
- [Monitor Azure Cache for Redis](monitor-cache.md)
