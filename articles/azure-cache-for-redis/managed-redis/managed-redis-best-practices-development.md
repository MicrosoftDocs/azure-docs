---
title: Best practices for development for Azure Managed Redis (preview)
description: Learn how to develop code for Azure Managed Redis.

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Development with Azure Managed Redis(preview)

## Connection resilience and server load

When developing client applications, be sure to consider the relevant best practices for [connection resilience](managed-redis-best-practices-connection.md) and [managing server load](managed-redis-best-practices-server-load.md).

## Consider more keys and smaller values

Azure Managed Redis (preview) works best with smaller values. To spread the data over multiple keys, consider dividing bigger chunks of data in to smaller chunks. For more information on ideal value size, see this [article](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/).

## Large request or response size

A large request/response can cause timeouts. As an example, suppose your timeout value configured on your client is 1 second. Your application requests two keys (for example, 'A' and 'B') at the same time (using the same physical network connection). Most clients support request _pipelining_, where both requests 'A' and 'B' are sent one after the other without waiting for their responses. The server sends the responses back in the same order. If response 'A' is large, it can eat up most of the timeout for later requests.

In the following example, request 'A' and 'B' are sent quickly to the server. The server starts sending responses 'A' and 'B' quickly. Because of data transfer times, response 'B' must wait behind response 'A' times out even though the server responded quickly.

```dos
|-------- 1 Second Timeout (A)----------|
|-Request A-|
     |-------- 1 Second Timeout (B) ----------|
     |-Request B-|
            |- Read Response A --------|
                                       |- Read Response B-| (**TIMEOUT**)
```

This request/response is a difficult one to measure. You could instrument your client code to track large requests and responses.

Resolutions for large response sizes are varied but include:

- Optimize your application for a large number of small values, rather than a few large values.
  - The preferred solution is to break up your data into related smaller values.
  - See the post [What is the ideal value size range for redis? Is 100 KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details on why smaller values are recommended.
- Increase the size of your virtual machine (VM) to get higher bandwidth capabilities
  - More bandwidth on your client or server VM can reduce data transfer times for larger responses.
  - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client might not be enough.
- Increase the number of connection objects your application uses.
  - Use a round-robin approach to make requests over different connection objects.

## Use pipelining

Try to choose a Redis client that supports [Redis pipelining](https://redis.io/topics/pipelining). Pipelining helps make efficient use of the network and get the best throughput possible.

## Avoid expensive operations

Some Redis operations, like the [KEYS](https://redis.io/commands/keys) command, are expensive and should be avoided. For some considerations around long running commands, see  [long-running commands](managed-redis-troubleshoot-timeouts.md#long-running-commands).

## Choose an appropriate tier

Azure Managed Redis offers Memory Optimized, Balanced, Compute Optimized and Flash Optimized tiers. See more information on how to choose a tier [here](managed-redis-how-to-scale.md#performance-tiers).
We recommend performance testing to choose the right tier and validate connection settings. For more information, see [Performance testing](managed-redis-best-practices-performance.md).

## Choose an appropriate availability mode

Azure Managed Redis offers the option to enable or disable high availability configuration. When high availability mode is disabled, the data your AMR instance will not be replicated and hence your Redis instance will be unavailable during maintenance. All data in the AMR instance will also be lost in the event of planned or unplanned maintenance. We recommend disabling the high availability only for your development or test workloads. Performance of Redis instances with high availability could also be lower due to the lack of data replication which is crucial distribute load between primary and replica data shard.

## Client in same region as Redis instance

Locate your Redis instance and your application in the same region. Connecting to a Redis in a different region can significantly increase latency and reduce reliability.  

While you can connect from outside of Azure, it isn't recommended, especially when using Redis for accelerating your application or database performance.. If you're using Redis server as just a key/value store, latency might not be the primary concern.

## Rely on hostname not public IP address

The public IP address assigned to your AMR instance can change as a result of a scale operation or backend improvement. We recommend relying on the hostname instead of an explicit public IP address.

## Use TLS encryption

Azure Managed Redis requires TLS encrypted communications by default. TLS versions 1.2 and 1.3 are currently supported. If your client library or tool doesn't support TLS, then enabling unencrypted connections is possible.

## Monitor memory usage, CPU usage metrics, client connections and network bandwidth

When using Azure Managed Redis instance in production, we recommend setting alerts for "Used Memory Percentage", "CPU" metrics, "Connected Clients". If these metrics are consistently above 75%, consider scaling your instance to a  bigger memory or better throughput tier. See [when to scale](managed-redis-how-to-scale.md#when-to-scale) for more details.

## Consider enabling Data Persistence or Data Backup

Redis is designed for ephemeral data by default, which means that in rare cases, your data can be lost due to various circumstances like maintenance or outages. If your application is sensitive to data loss, we recommend enabling data persistence or periodic data backup using data export operation.

The [data persistence](managed-redis-how-to-persistence.md) feature is designed to automatically provide a quick recovery point for data when a cache goes down. The quick recovery is made possible by storing the RDB or AOF file in a managed disk that is mounted to the cache instance. Persistence files on the disk aren't accessible to users or cannot be used by any other AMR instance.

Many customers want to use persistence to take periodic backups of the data on their cache. We don't recommend that you use data persistence in this way. Instead, use the [import/export](managed-redis-how-to-import-export-data.md) feature. You can export copies of data in RDB format directly into your chosen storage account and trigger the data export as frequently as you require. This exported data can then be imported to any Redis instance. Export can be triggered either from the portal or by using the CLI, PowerShell, or SDK tools.

## Client library-specific guidance

For more information, see [Azure Managed Redis Client libraries](managed-redis-best-practices-client-libraries.md)

## Related content

- [Performance testing](managed-redis-best-practices-performance.md)
- [Failover and patching for Azure Cache for Redis](managed-redis-failover.md)
