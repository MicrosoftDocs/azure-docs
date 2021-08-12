---
title: Best practices for Development
description: Learn how to develop code for Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---

# Development

## Consider smaller keys

Redis works best with smaller values, so consider dividing bigger chunks of data to spread over multiple keys. In this Redis discussion, some considerations are listed that you should consider carefully. Read this article for an example problem that can be caused by large values.

## Understand key distribution

If you are planning to use Redis clustering, see redis clustering best practices with keys.

## Use pipelining

Try to choose a Redis client that supports Redis pipelining. Pipelining helps make efficient use of the network and get the best throughput possible.

## Avoid expensive operations

Some Redis operations, like the KEYS command, are very expensive and should be avoided. For more information, see some considerations around long-running commands  

* **Avoid expensive operations** - Some Redis operations, like the [KEYS](https://redis.io/commands/keys) command, are *very* expensive and should be avoided.  For more information, see some considerations around [long-running commands](cache-troubleshoot-server.md#long-running-commands)

## Choose tier appropriately

Conduct performance testing to choose the right tier and validate connection settings. See [Resilience and performance testing](Link to testing section)

## Client in same region as cache

Ideally, client applications should be hosted in the same region as the cache.

* **Use pipelining.**  Try to choose a Redis client that supports [Redis pipelining](https://redis.io/topics/pipelining). Pipelining helps make efficient use of the network and get the best throughput possible.

* **Locate your cache instance and your application in the same region.**  Connecting to a cache in a different region can significantly increase latency and reduce reliability.  While you can connect from outside of Azure, it  not recommended *especially when using Redis as a cache*.  If you're using Redis as just a key/value store, latency may not be the primary concern.

## Client library specific guidance

* [StackExchange.Redis (.NET)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-stackexchange-redis-md)
* [Java - Which client should I use?](https://gist.github.com/warrenzhu25/1beb02a09b6afd41dff2c27c53918ce7#file-azure-redis-java-best-practices-md)
* [Lettuce (Java)](https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md)
* [Jedis (Java)](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-java-jedis-md)
* [Node.js](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md)
* [PHP](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-php-md)
* [HiRedisCluster](https://github.com/Azure/AzureCacheForRedis/blob/main/HiRedisCluster%20Best%20Practices.md)
* [ASP.NET Session State Provider](https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-session-state-provider-md)
