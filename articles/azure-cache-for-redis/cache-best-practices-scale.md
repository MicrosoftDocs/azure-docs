---
title: Best practices for Scaling your Azure Cache for Redis
description: Learn how to scale your Azure Cache for Redis.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
 
# Scaling

## Scaling under load

While scaling a cache under load, configure your maxmemory-reserved setting to improve system responsiveness.

## Scaling clusters

Try reducing data as much as you can in the cache before scaling your clustered cache in or out. Reducing data ensures smaller amounts of data have to be moved, which improves the reliability of the scale operation.

## Scale before load is too high

Start scaling before the server load or memory usage gets too high. If it's too high, that means Redis server is busy. The busy Redis server doesn't have enough resources to scale and redistribute data.

## Cache sizes

Some cache sizes are hosted on VMs with four or more cores. Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs. For more information, see [details around VM sizes and cores](./cache-planning-faq.yml#azure-cache-for-redis-performance)

For more information on when to scale, see [When to scale](cache-how-to-scale.md#when-to-scale).
