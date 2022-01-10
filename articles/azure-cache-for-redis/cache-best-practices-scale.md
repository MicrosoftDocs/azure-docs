---
title: Best practices for scaling
titleSuffix: Azure Cache for Redis
description: Learn how to scale your Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 08/25/2021
ms.author: franlanglois
---

# Scaling

## Scaling under load

While scaling a cache under load, configure your maxmemory-reserved setting to improve system responsiveness. For more information, see [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting).

## Scaling clusters

Try reducing data as much as you can in the cache before scaling your clustered cache in or out. Reducing data ensures smaller amounts of data have to be moved, which reduces the time required for the scale operation. For more information on when to scale, see [When to scale](cache-how-to-scale.md#when-to-scale).

## Scale before load is too high

Start scaling before the server load or memory usage gets too high. If it's too high, that means Redis server is busy. The busy Redis server doesn't have enough resources to scale and redistribute data.

## Cache sizes

If you are using TLS and you have a high number of connections, consider scaling out so that you can distribute the load over more cores. Some cache sizes are hosted on VMs with four or more cores.

Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs. For more information, see [details around VM sizes and cores](./cache-planning-faq.yml#azure-cache-for-redis-performance).

## Next steps

- [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting)
- [Scale an Azure Cache for Redis instance](cache-how-to-scale.md)
