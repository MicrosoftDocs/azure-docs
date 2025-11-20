---
title: Azure region pairs and nonpaired regions
description: Learn about Azure region pairs and regions without a pair.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 03/19/2025
ms.author: anaharris
ms.custom: references_regions, subject-reliability
---

# Azure region pairs and nonpaired regions

This article describes how region pairs and nonpaired regions are used in Azure.

Azure regions are independent of each other. However, Microsoft associates some Azure regions with another region, where both are usually in the same geography. Together the regions form a *region pair*. These region pairs are then used by a small number of Azure services to support geo-replication and geo-redundancy. The pairs are also used to support some aspects of disaster recovery in the unlikely event that a region experiences a catastrophic and unrecoverable failure.

However, many regions aren't paired, and instead use availability zones as their primary means of redundancy.  In addition, many Azure services support geo-redundancy whether regions are paired or not.

You can design a highly resilient solution whether you use paired regions, nonpaired regions, or a combination. 

## Paired regions

Some Azure services use paired regions to build their multi-region geo-replication and geo-redundancy strategy. For example, [Azure geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage) (GRS) can automatically replicate data to a paired region.

If you're in a region that's paired, then using its pair as a secondary region provides several benefits:

- **Region recovery sequence**. In the unlikely event of a geography-wide outage, the recovery of one region is prioritized out of every region pair. Components that are deployed across paired regions have one of the regions prioritized for recovery.
- **Sequential updating**. Azure strives to stagger any planned system updates across region pairs. This approach minimizes the impact of bugs or logical failures in the rare event of a faulty update, and to prevent downtime to solutions that have been designed to use paired regions together for resiliency.
- **Data residency**. To meet data residency requirements, almost all regions reside within the same geography as their pair. To learn about the exceptions, see the [list of Azure regions](./regions-list.md).

> [!IMPORTANT]
> Deploying resources to a region in a pair doesn't automatically make them more resilient, nor does it provide automatic high availability or disaster recovery capabilities or failover. It's critical that you develop your own high availability and disaster recovery plans, regardless of whether you use paired regions or not.
>
> Even if you configure service features to use region pairs, don't rely on Microsoft-managed failover between those pairs as your primary disaster recovery approach. For example, Microsoft-managed failover of GRS-enabled storage accounts is only performed in catastrophic situations and after repeated failed recovery attempts.

You aren't limited to using services within a single region, or within your region's pair. Although an Azure service might rely upon a specific regional pair for some of its reliability capabilities, you can host your services in any region that satisfies your business needs. For example, an Azure solution can use Azure Storage in the Canada Central region with GRS storage to replicate data to the paired region, Canada East, while using Azure compute resources located in East US, and Azure OpenAI resources located in West US.

To see a list of regions that includes all region pairs, see [List of Azure regions](./regions-list.md).

### Asymmetrically paired regions

Most region pairs are *symmetrical*, which means that each region is bidirectionally paired with another region. For example, West US is paired with East US and East US is paired with West US.

*Asymmetrical region pairs* involve regions that are not bidirectionally paired. The list below includes public asymmetrical regions pairs:

- Brazil South is paired with South Central US, which is outside of the Brazil geography. South Central US isn't paired with Brazil South.
- US Gov Arizona is paired with US Gov Texas. US Gov Texas is bidirectionally paired with US Gov Virginia.
- West India is paired with South India, but South India is paired with Central India.
- West US 3 is paired in one direction with East US. East US is bidirectionally paired with West US.

To see a list of regions that includes all asymmetrical region pairs, see [Azure region pairs](./regions-list.md).

## Nonpaired regions

Azure continues to expand globally, and many of our newer regions provide multiple [availability zones](./availability-zones-overview.md) for higher resiliency, and don't have a region pair.

Many Azure services support geo-replication and geo-redundancy between any arbitrary set of regions, and don't rely on region pairs. It's important to understand how multi-region support works for the particular services you use. To learn about the details of each service, see [Azure service reliability guides](./overview-reliability-guidance.md).

To see a list of regions that includes all nonpaired regions, see [Azure region pairs](./regions-list.md).

## Related content

- [What are Azure regions?](./regions-overview.md)
- [List of Azure regions](regions-list.md)
- [Reliability guidance](./reliability-guidance-overview.md)
