---
title: Best practices for Connection Resilience
description: Learn how to make your Azure Cache for Redis connections resilient.
author: shpathak-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/01/2021
ms.author: shpathak
---
 Best Practice Draft

# Scaling

## Scaling under load
While scaling a cache under load, configure your maxmemory-reserved setting to improve system responsiveness 

## Scaling clusters
Consider reducing data as much as you can in the cache before scaling your clustered cache in or out. This will ensure that smaller amounts of data have to be moved thus improving the reliability of the scale operation. 

## Scale before the server load is too high

Start scaling before the server load or memory gets too high. If it is too high, that means redis-server is busy and will not have enough resources to perform scaling and data redistribution 

Some cache sizes are hosted on VMs with four or more cores. Distribute the TLS encryption/decryption and TLS connection/disconnection workloads across multiple cores to bring down overall CPU usage on the cache VMs. See here for details around VM sizes and cores 

See [when to scale](Link to when to scale) for more guidance on when to scale. 

