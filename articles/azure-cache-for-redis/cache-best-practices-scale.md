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

Consider reducing data as much as you can in the cache before scaling your clustered cache in or out. Reducing data ensures that smaller amounts of data have to be moved thus improving the reliability of the scale operation. 

## Scale before the server load is too high

Start scaling before the server load or memory gets too high. If it is too high, that means Redis server is busy. The busy Redis server will not have enough resources to perform scaling and data redistribution.

<!--this is text that came from Best Practises -->
* **Some cache sizes** are hosted on VMs with four or more cores. Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs.  [See here for details around VM sizes and cores](./cache-planning-faq.yml#azure-cache-for-redis-performance)

Some cache sizes are hosted on VMs with four or more cores. Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs. See here for details around VM sizes and cores.

For more guidance on when to scale, see [When to scale](cache-how-to-scale.md#when-to-scale).
