---
title: Best practices for the managed tiers
description: Learn the best practices when using the high performance Azure Managed Redis tiers.

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# What are the best practices for the Azure Managed Redis (preview)

Here are some best practices for Azure Managed Redis (preview).

## Zone redundancy

We strongly recommend that you deploy new caches in a [zone redundant](managed-redis-high-availability.md) configuration. Zone redundancy ensures that Redis Enterprise nodes are spread among three availability zones, boosting redundancy from data center-level outages. Using zone redundancy increases availability. For more information, see [Service Level Agreements (SLA) for Online Services](https://azure.microsoft.com/support/legal/sla/cache/v1_1/).

Zone redundancy is important on the Enterprise tier because your cache instance always uses at least three nodes. Two nodes are data nodes, which hold your data, and a _quorum node_. Increasing capacity scales the number of data nodes in even-number increments.

There's also another node called a quorum node. This node monitors the data nodes and automatically selects the new primary node if there was a failover. Zone redundancy ensures that the nodes are distributed evenly across three availability zones, minimizing the potential for quorum loss. Customers aren't charged for the quorum node and there's no other charge for using zone redundancy beyond [intra-zonal bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/).

## Data persistence vs data backup

The [data persistence](managed-redis-how-to-persistence.md) feature is designed to automatically provide a quick recovery point for data when a cache goes down. The quick recovery is made possible by storing the RDB or AOF file in a managed disk that is mounted to the cache instance. Persistence files on the disk aren't accessible to users or cannot be used by any other AMR instance.

Many customers want to use persistence to take periodic backups of the data on their cache. We don't recommend that you use data persistence in this way. Instead, use the [import/export](managed-redis-how-to-import-export-data.md) feature. You can export copies of data in RDB format directly into your chosen storage account and trigger the data export as frequently as you require. This exported data can then be imported to any Redis instance. Export can be triggered either from the portal or by using the CLI, PowerShell, or SDK tools.

## Related content

- [Best Practices - Development](managed-redis-best-practices-development.md)
