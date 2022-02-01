---
title: Best practices for development
titleSuffix: Azure Cache for Redis
description: Learn how to develop code for Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 11/3/2021
ms.author: franlanglois
---

# Development

## Connection resilience and server load

When developing client applications, be sure to consider the relevant best practices for [connection resilience](cache-best-practices-connection.md) and [managing server load](cache-best-practices-server-load.md).

## Consider more keys and smaller values

Azure Cache for Redis works best with smaller values. Consider dividing bigger chunks of data in to smaller chunks to spread the data over multiple keys. For more information on ideal value size, see this [article](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/).

## Large request or response size

A large request/response can cause timeouts. As an example, suppose your timeout value configured on your client is 1 second. Your application requests two keys (for example, 'A' and 'B') at the same time (using the same physical network connection). Most clients support request "pipelining", where both requests 'A' and 'B' are sent one after the other without waiting for their responses. The server sends the responses back in the same order. If response 'A' is large, it can eat up most of the timeout for later requests.

In the following example, request 'A' and 'B' are sent quickly to the server. The server starts sending responses 'A' and 'B' quickly. Because of data transfer times, response 'B' must wait behind response 'A' times out even though the server responded quickly.

```console
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
- Increase the size of your VM to get higher bandwidth capabilities
  - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
  - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
- Increase the number of connection objects your application uses.
  - Use a round-robin approach to make requests over different connection objects.

## Key distribution

If you're planning to use Redis clustering, first read [Redis Clustering Best Practices with Keys](https://redislabs.com/blog/redis-clustering-best-practices-with-keys/).

## Use pipelining

Try to choose a Redis client that supports [Redis pipelining](https://redis.io/topics/pipelining). Pipelining helps make efficient use of the network and get the best throughput possible.

## Avoid expensive operations

Some Redis operations, like the [KEYS](https://redis.io/commands/keys) command, are expensive and should be avoided. For some considerations around long running commands, see  [long-running commands](cache-troubleshoot-timeouts.md#long-running-commands).

## Choose an appropriate tier

Use Standard or Premium tier for production systems.  Don't use the Basic tier in production. The Basic tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache. C0 caches are only meant for simple dev/test scenarios because:

- they share a CPU core
- use little memory
- are prone to *noisy neighbor* issues

We recommend performance testing to choose the right tier and validate connection settings. For more information, see [Performance testing](cache-best-practices-performance.md).

## Client in same region as cache

Locate your cache instance and your application in the same region. Connecting to a cache in a different region can significantly increase latency and reduce reliability.  

While you can connect from outside of Azure, it is not recommended *especially when using Redis as a cache*.  If you're using Redis server as just a key/value store, latency may not be the primary concern.

## Use TLS encryption

Azure Cache for Redis requires TLS encrypted communications by default. TLS versions 1.0, 1.1 and 1.2 are currently supported. However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible.

If your client library or tool doesn't support TLS, then enabling unencrypted connections is possible through the [Azure portal](cache-configure.md#access-ports) or [management APIs](/rest/api/redis/2021-06-01/redis/update). In cases where encrypted connections aren't possible, we recommend placing your cache and client application into a virtual network. For more information about which ports are used in the virtual network cache scenario, see this [table](cache-how-to-premium-vnet.md#outbound-port-requirements).

## Client library-specific guidance

- [StackExchange.Redis (.NET)](cache-best-practices-connection.md#using-forcereconnect-with-stackexchangeredis)
- [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
- [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
- [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
- [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
- [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
- [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)
- [ASP.NET Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)

## Next steps

- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [Performance testing](cache-best-practices-performance.md)
- [Failover and patching for Azure Cache for Redis](cache-failover.md)
