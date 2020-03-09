---
title: Regional redundancy and failover recovery with Azure HPC Cache
description: Techniques to provide failover capabilities for disaster recovery with Azure HPC Cache 
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: rohogue
---

# Use multiple caches for regional failover recovery

Each Azure HPC Cache instance runs within a particular subscription and in one region. This means that your cache workflow could possibly be disrupted if the region has a full outage.

This article describes a strategy to reduce risk of work disruption by using a second region for cache failover.

The key is using back-end storage that is accessible from multiple regions. This storage can be either an on-premises NAS system with appropriate DNS support, or Azure Blob storage that resides in a different region from the cache.

As your workflow proceeds in your primary region, data is saved in the long-term storage outside of the region. If the cache region becomes unavailable, you can create a duplicate Azure HPC Cache instance in a secondary region, connect to the same storage, and resume work from the new cache.

## Planning for regional failover

To set up a cache that is prepared for possible failover, follow these steps:

1. Make sure that your back-end storage is accessible in a second region.
1. When planning to create the primary cache instance, you should also prepare to replicate this setup process in the second region. Include these items:

   1. Virtual network and subnet structure
   1. Cache capacity
   1. Storage target details, names, and namespace paths
   1. Details about client machines, if they are located in the same region as the cache
   1. Mount command for use by cache clients

   > [!NOTE]
   > Azure HPC Cache can be created programmatically, either through an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) or by directly accessing its API. Contact the Azure HPC Cache team for details.

## Failover example

As an example, imagine that you want to locate your Azure HPC Cache in Azure's East US region. It will access data stored in your on-premises data center.

You can use a cache in the West US 2 region as a failover backup.

When creating the cache in East US, prepare a second cache for deployment in West US 2. You can use scripting or templates to automate this preparation.

In the event of a region-wide failure in East US, create the cache you have prepared in the West US 2 region.

After the cache is created, add storage targets that point to the same on-premises data stores and use the same aggregated namespace paths as the old cache's storage targets.

If the original clients are affected, create new clients in the West US 2 region for use with the new cache.

All clients will need to mount the new cache, even if the clients were not affected by the region outage. The new cache has different mount addresses from the old one.

## Learn more

The Azure application architecture guide includes more information about how to [recover from a region-wide service disruption](<https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region>).
<!-- this should be an internal link instead of a URL but I can't find the tree  -->
