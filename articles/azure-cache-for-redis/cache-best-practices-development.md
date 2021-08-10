---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
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

## Choose tier appropriately
Conduct performance testing to choose the right tier and validate connection settings. See [Resilience and performance testing](Link to testing section)

## Client in same region as cache
Ideally, client applications should be hosted in the same region as the cache.
