---
title: Troubleshoot latency and timeouts
description: Troubleshoot common Azure Cache for Redis latency and timeout issues, such as high CPU loads, memory pressure, and network bandwidth limitations.



ms.topic: troubleshooting
ms.custom: devx-track-csharp
ms.date: 04/10/2025
appliesto:
  - ✅ Azure Cache for Redis

---

# Troubleshoot Azure Cache for Redis latency and timeouts

An Azure Cache for Redis client operation that doesn't receive a timely response can cause high latency or a timeout exception. This article explains how to troubleshoot common issues that can lead to high latency and timeouts.

An operation could experience issues or time out at various stages. The source of the issue helps determine the cause and the mitigation. This article is divided into client-side and server-side issues.

**Client-side issues**
- [High client connections](#high-client-connections)
- [High CPU on client hosts](#high-cpu-on-client-hosts)
- [Large key values](#large-key-values)
- [Memory pressure on Redis client](#memory-pressure-on-redis-client)
- [Network bandwidth limitations on client hosts](#network-bandwidth-limitation-on-client-hosts)
- [RedisSessionStateProvider retryTimeout](#redissessionstateprovider-retrytimeout)
- [TCP settings for Linux based client applications](#tcp-settings-for-linux-based-client-applications)
- [Traffic burst and thread pool configuration](#traffic-burst-and-thread-pool-configuration)

**Server-side issues**
- [High memory usage](#high-memory-usage)
- [High server load](#high-server-load)
- [Long running commands](#long-running-commands)
- [Network bandwidth limitations](#network-bandwidth-limitations)
- [Server maintenance](#server-maintenance)

## Client-side troubleshooting

The following client-side issues can affect latency and performance and lead to timeouts.

### High client connections

Client requests for client connections beyond the maximum for the cache can fail. High client connections can also cause high server load when processing repeated reconnection attempts.

High client connections might indicate a connection leak in client code. Connections might not be getting reused or closed properly. Review client code for connection use.

If the high connections are all legitimate and required client connections, you might need to upgrade your cache to a size with a higher connection limit. Check if the **Max aggregate for Connected Clients** metric is close to or higher than the maximum number of allowed connections for your cache size. For more information on sizing per client connections, see [Azure Cache for Redis performance](cache-planning-faq.yml#azure-cache-for-redis-performance).

### High CPU on client hosts

High client CPU usage indicates that the system can't keep up with the work assigned to it. Even if the cache sends the response quickly, the client might fail to process the response fast enough. It's best to keep client CPU at less than 80%.

To mitigate a client's high CPU usage:

- Investigate the cause of CPU spikes.
- Upgrade your client to a larger virtual machine (VM) size with more CPU capacity.

Monitor the client's system-wide CPU usage by [using metrics available in the Azure portal](/azure/redis/monitor-cache#view-cache-metric) or through performance counters on the VM. Check the metric **Errors (Type: UnresponsiveClients)** to determine if your client hosts can process responses from the Redis server in time.

Be careful not to monitor process CPU, because a single process can have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU might also cause high `in: XXX` values in `timeoutException` error messages. See the [Traffic burst and thread pool configuration](#traffic-burst-and-thread-pool-configuration) section for an example.

StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `timeoutException` error messages. Make sure to use the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/), because bugs are regularly fixed to make the code more resistant to timeouts. For more information, see [Investigating `timeout` exceptions in StackExchange.Redis](https://azure.microsoft.com/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

### Large key values

You can use the `redis-cli --bigkeys` command to check for large keys in your cache. For more information about redis-cli, the Redis command line interface, see [Redis CLI](https://redis.io/topics/rediscli).

To mitigate the issue:

- Increase the size of your VM to get higher bandwidth capabilities. More bandwidth on your client or server VM might reduce data transfer times for larger responses. Compare your current network usage on both VMs to the limits of your current VM sizes. More bandwidth on only the server or client might not be enough.

- Increase the number of connection objects your application uses. Use a round-robin approach to make requests over different connection objects. For information about using multiple keys and smaller values, see [Consider more keys and smaller values](cache-best-practices-development.md#consider-more-keys-and-smaller-values).

### Memory pressure on Redis client

Memory pressure on the client can lead to performance problems that delay processing of cache responses. When memory pressure occurs, the system might page data to disk. This _page faulting_ causes the system to slow down significantly.

To detect memory pressure on the client:

- Monitor memory usage on the VM to make sure that it doesn't exceed available memory.
- Monitor the client's `Page Faults/Sec` performance counter. During normal operation, most systems have some page faults. Spikes in page faults corresponding with request timeouts can indicate memory pressure.

To mitigate high memory pressure on the client:

- Investigate your memory usage patterns to reduce memory consumption on the client.
- Upgrade your client VM to a larger size with more memory.

### Network bandwidth limitation on client hosts

Depending on their architecture, client machines might have limitations on network bandwidth availability. If the client exceeds the available bandwidth by overloading network capacity, data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts.

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity. For more information, see [Large request or response size](cache-best-practices-development.md#large-request-or-response-size).

### RedisSessionStateProvider retryTimeout

If you use `RedisSessionStateProvider`, ensure you set the `retryTimeout` correctly. The `retryTimeoutInMilliseconds` value should be higher than the `operationTimeoutInMilliseconds` value. Otherwise, no retries occur.

In the following example, `retryTimeoutInMilliseconds` is set to `3000`.

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

### TCP settings for Linux based client applications

Client applications hosted on Linux could experience connectivity issues because of optimistic TCP settings in Linux. For more information, see [TCP settings for Linux-hosted client applications](cache-best-practices-connection.md#tcp-settings-for-linux-hosted-client-applications).

### Traffic burst and thread pool configuration

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis server but not yet consumed on the client side. Check the **Errors (Type: UnresponsiveClients)** metric to validate whether your client hosts can keep up with sudden spikes in traffic. You can [configure your ThreadPool settings](cache-management-faq.yml#important-details-about-threadpool-growth) to ensure that your thread pool scales up quickly under burst scenarios.

You can use `timeoutException` messages from StackExchange.Redis to investigate further.

```output
    System.timeoutException: timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0,
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)
```

The preceding exception demonstrates several issues.

- In the `IOCP` section and the `WORKER` section, the `Busy` value is greater than the `Min` value, which means that the `ThreadPool` settings need adjusting.
- The value `in: 64221` indicates that 64,221 bytes were received at the client's kernel socket layer but not read by the application. This difference typically means that your application, for example StackExchange.Redis, isn't reading data from the network as quickly as the server is sending it.

StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `timeoutException` error messages. Make sure to use the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/), because bugs are regularly fixed to make the code more resistant to timeouts. For more information, see [Investigating timeout exceptions in StackExchange.Redis](https://azure.microsoft.com/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).

## Server-side troubleshooting

The following server-side issues can affect performance and lead to timeouts.

### High memory usage

Memory pressure on the server can lead to various performance problems that delay request processing. When memory pressure occurs, the system pages data to disk, which causes the system to slow down significantly.

Some possible causes of memory pressure are that the cache is filled with data to near its maximum capacity, or that the Redis server has high memory fragmentation.

Fragmentation is likely when a load pattern is storing data with high size variation, for example when data is spread across 1-KB and 1-MB sizes. When a 1-KB key is deleted from existing memory, a 1-MB key can't fit into the space, causing fragmentation. Similarly, if 1-MB key is deleted, an added 1.5-MB key can't fit into the existing reclaimed memory. This unused free memory results in fragmentation.

If a cache is fragmented and is running under high memory pressure, the system does a failover to try to recover Resident Set Size (RSS) memory. Redis exposes two statistics, `used_memory` and `used_memory_rss`, through the [INFO](https://redis.io/commands/info) command, which can help you identify this issue. You can also [view these metrics in the Azure portal](/azure/redis/monitor-cache#view-cache-metrics).

If the `used_memory_rss` value is higher than 1.5 times the `used_memory` metric, there's fragmentation in memory. The fragmentation can cause issues when:
- Memory usage is close to the maximum memory limit for the cache.
- The `used_memory_rss` metric is higher than the maximum memory limit, potentially resulting in page faulting in memory.

You can take several actions to help keep memory usage healthy.

- [Configure a memory policy](cache-configure.md#memory-policies) and set expiration times on your keys. This policy might not be sufficient if you have fragmentation.
- [Configure maxmemory-reserved and maxfragmentationmemory-reserved values](cache-configure.md#memory-policies) that are large enough to compensate for memory fragmentation.
- [Create alerts](/azure/redis/monitor-cache#create-alerts) on metrics like used memory to be notified early about potential impacts.
- [Scale](cache-how-to-scale.md) to a larger cache size with more memory capacity. For more information, see [Azure Cache for Redis planning FAQs](cache-planning-faq.yml).

For more recommendations on memory management, see [Best practices for memory management](cache-best-practices-memory-management.md).

### High server load

High server load means the Redis server is busy and unable to keep up with requests, leading to timeouts or slow responses. To mitigate high server load, first investigate the cause, such as [long-running commands](#long-running-commands) due to high memory pressure.

You can [monitor metrics](/azure/redis/monitor-cache#view-cache-metrics) such as server load from the Azure portal. To check the **Server Load** metric, select **Insights** under **Monitoring** from the left navigation menu on your cache page and view the **Server Load** graph. Or select **Metrics** under **Monitoring** in the left navigation menu, and then select **Server Load** under **Metrics**.

Watch for spikes in **Server Load** usage that correspond with timeouts. [Create alerts](/azure/redis/monitor-cache#create-alerts) on server load metrics to be notified early about potential impacts.

#### Spikes in server load

On C0 and C1 caches, you might see short spikes in server load not caused by an increase in requests, while internal Defender scanning is running on the VMs. On these tiers, you see higher latency for requests while internal Defender scans occur.

Caches on the C0 and C1 tiers have only a single core to multitask, dividing the work of serving internal Defender scanning and Redis requests. If extra latency from internal Defender scans negatively affects your production workload on a C1 cache, you can scale to a higher tier offering with multiple CPU cores, such as C2. For more information, see [Choosing the right tier](cache-overview.md#choosing-the-right-tier).

For more information about rapid changes in the number of client connections, see [Avoid client connection spikes](cache-best-practices-connection.md#avoid-client-connection-spikes).

#### Scaling

You can [scale](cache-how-to-scale.md) out to more shards to distribute load across multiple Redis processes, or scale up to a larger cache size with more CPU cores. Scaling operations are CPU and memory intensive, because they can involve moving data around nodes and changing cluster topology. For more information, see [Azure Cache for Redis planning FAQs](cache-planning-faq.yml) and [Scaling](cache-best-practices-scale.md).

### Long running commands

Some Redis commands are more expensive to execute than others. The Redis [Commands](https://redis.io/commands) documentation shows the time complexity of each command. Redis command processing is single-threaded. Any command that takes a long time to run can block others that follow it.

Review the commands you issue to your Redis server to understand their performance impacts. For instance, the [KEYS](https://redis.io/commands/keys) command is often used without the knowledge that it's a Big O Notation (O(N)) operation. To reduce CPU spikes, you can avoid `KEYS` by using [SCAN](https://redis.io/commands/scan).

You can run the following Redis commands in a console to investigate long running and expensive commands.

- [CLIENT LIST](https://redis.io/commands/client-list)

  The `CLIENT LIST` command returns information and statistics about the client connections server in a mostly human readable format.

- [INFO](https://redis.io/commands/info)

  The `INFO` command returns information and statistics about the server in a format that's simple for computers to parse and easy for humans to read. The `CPU` section can be useful to investigate CPU usage. A `server_load` of `100` (maximum value) signifies that the Redis server was busy all the time and was never idle when processing the requests.

  The following example shows an output from the `INFO` command:

  ```console
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

- [MONITOR](https://redis.io/commands/monitor)

  `MONITOR` is a debugging command that streams back every command processed by the Redis server. `MONITOR` can help you understand what's happening to the database. This command is demanding and can negatively affect and degrade performance.

- [SLOWLOG](https://redis.io/commands/slowlog)

  The Redis Slow Log is a system to log queries that exceeded a specified execution time. The execution time doesn't include I/O operations like talking with the client or sending the reply, but only the time needed to actually execute the command.

  The `SLOWLOG` command reads and resets the Redis slow queries log, and can also be used to investigate long running commands on the client side. You can monitor and log expensive commands being executed against the Redis server by using [SLOWLOG GET](https://redis.io/commands/slowlog-get).

<a name="network-bandwidth-limitation"></a>
### Network bandwidth limitations

Different cache sizes have different network bandwidth capacities. If the server exceeds the available bandwidth, data isn't sent to the client as quickly. Client requests could time out because the server can't push data to the client fast enough.

You can [monitor metrics](/azure/redis/monitor-cache#view-cache-metric) such as **Cache Read** and **Cache Write** in the Azure portal to see how much server-side bandwidth is being used. [Create alerts](/azure/redis/monitor-cache#create-alerts) on these metrics to be notified early about potential impacts.

To mitigate situations where network bandwidth usage is close to maximum capacity:

- Change client call behavior to reduce network demand.
- [Scale](cache-how-to-scale.md) to a larger cache size with more network bandwidth capacity. For more information, see [Azure Cache for Redis planning FAQs](cache-planning-faq.yml#azure-cache-for-redis-performance).

### Server maintenance

Planned or unplanned maintenance can cause disruptions with client connections. The number and type of exceptions depend on the location of the request in the code path, and when the cache closes its connections.

If your Azure Redis cache undergoes a failover, all client connections from the node that went down are transferred to the node that's still running. The server load could spike because of the increased connections. You can try rebooting your client applications so that all the client connections get recreated and redistributed among the two nodes.

An operation that sends a request but doesn't receive a response when the failover occurs might get a `timeout` exception. New requests on the closed connection object receive connection exceptions until the reconnection happens successfully.

To check whether your Azure Redis cache had a failover during the time your `timeout` exceptions occurred, check the **Errors** metric. On the Azure portal page for your cache, select **Metrics** under **Monitoring** in the left navigation menu. Then create a new chart measuring the **Errors** metric, split by **ErrorType**. Once you create this chart, you see a count for **Failover**. For more information on failovers, see [Failover and patching for Azure Cache for Redis](cache-failover.md).

For more information about mitigating issues due to server maintenance, see the following articles:

- [Update channel and schedule updates](cache-administration.md#update-channel-and-schedule-updates)
- [Connection resilience](cache-best-practices-connection.md#connection-resilience)
- [AzureRedisEvents notifications](cache-failover.md#can-i-be-notified-in-advance-of-maintenance)

<a name="stackexchangeredis-timeout-exceptions"></a>
## Related content

- [Investigating `timeout` exceptions in StackExchange.Redis](https://azure.microsoft.com/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/).
- [Connectivity troubleshooting](cache-troubleshoot-connectivity.md)
- [Troubleshoot data loss in Azure Cache for Redis](cache-troubleshoot-data-loss.md)
- [How can I run Redis commands?](cache-development-faq.yml#how-can-i-run-redis-commands-)
- [How can I benchmark and test the performance of my cache?](cache-management-faq.yml#how-can-i-benchmark-and-test-the-performance-of-my-cache-)
- [Monitor Azure Cache for Redis](/azure/redis/monitor-cache)
