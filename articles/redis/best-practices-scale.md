---
title: Best practices for scaling for Azure Managed Redis
description: Learn how to scale your Azure Managed Redis.
ms.date: 05/18/2025
ms.service: azure-managed-redis
ms.topic: conceptual
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Best Practices for Scaling in Azure Managed Redis

In this article, we discuss concepts of when and why to scale your Azure Managed Redis cache.

## Scale before load is too high

Start scaling before the CPU or memory usage gets too high. If it's too high, that means Redis server is busy. The busy Redis server doesn't have enough resources to scale and redistribute data. For more information, see [When to scale](how-to-scale.md#when-to-scale).

## Minimizing your data helps scaling complete quicker

If preserving the data in the cache isn't a requirement, consider flushing the data before scaling. Flushing the cache helps the scaling operation complete more quickly so the new capacity is available sooner.

## Using TLS/SSL

If you're using TLS/SSL, the CPU experiences higher overhead for the cache to handle encryption. This increased overhead is especially significant if you're using many connections or if you're using an instance with fewer vCPUs. Consider [scaling up to a higher tier](how-to-scale.md#performance-tiers) if you need more performance.

## Next steps

- [Scale an Azure Managed Redis instance](how-to-scale.md)
