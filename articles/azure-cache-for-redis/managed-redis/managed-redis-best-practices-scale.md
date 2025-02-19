---
title: Best practices for scaling for Azure Managed Redis (preview)
description: Learn how to scale your Azure Managed Redis.

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Best Practices for Scaling in Azure Managed Redis (preview)

## Scale before load is too high

Start scaling before the CPU or memory usage gets too high. If it's too high, that means Redis server is busy. The busy Redis server doesn't have enough resources to scale and redistribute data. For more information, see [When to scale](managed-redis-how-to-scale.md#when-to-scale).

## Minimizing your data helps scaling complete quicker

If preserving the data in the cache isn't a requirement, consider flushing the data prior to scaling. Flushing the cache helps the scaling operation complete more quickly so the new capacity is available sooner.

## Using TLS/SSL

If you're using TLS/SSL, there will be a higher CPU overhead on the cache to handle encryption. This is especially true if you're using a lot of connections or if you're using an instance with fewer vCPUs. Consider [scaling up to a higher tier](managed-redis-how-to-scale.md#performance-tiers) if you need additional performance.

## Next steps

- [Scale an Azure Managed Redis instance](managed-redis-how-to-scale.md)
