---
title: Azure region pairs and nonpaired regions
description: Learn about Azure region pairs and regions without a pair.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 01/13/2025
ms.author: anaharris
ms.custom: references_regions, subject-reliability
---

# Azure region pairs and nonpaired regions

Azure regions are independent of each other. However, Microsoft associates some Azure regions with another region, where both are usually in the same geography. Together the regions form a *region pair*. Many other regions aren't paired, and instead use availability zones as their primary means of redundancy. This article describes both how region pairs and nonpaired regions are used in Azure.

Region pairs are used by some Azure services to support geo-replication and geo-redundancy, and to support some aspects of disaster recovery in the unlikely event that a region experiences a catastrophic and unrecoverable failure.

However, many Azure services support geo-redundancy whether the regions are paired or not, and you can design a highly resilient solution whether you use paired regions, nonpaired regions, or a combination.

## Paired regions

Some Azure services use paired regions to build their multi-region geo-replication and geo-redundancy strategy. For example, [Azure geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage) (GRS) can automatically replicate data to a paired region.

If you're in a region with a pair, then using its pair as a secondary region provides several benefits:

- **Region recovery sequence**. In the unlikely event of a geography-wide outage, the recovery of one region is prioritized out of every region pair. Components that are deployed across paired regions have one of the regions prioritized for recovery.
- **Sequential updating**. Planned Azure system updates are staggered across region pairs to minimize downtime, impact of bugs, and any logical failures in the rare event of a faulty update.
- **Physical isolation**. Azure strives to ensure a minimum distance of 300 miles (483 kilometers) between paired regions, although it isn't possible across all geographies. Region separation reduces the likelihood that natural disasters, civil unrest, power outages, or physical network outages affects multiple regions simultaneously. Isolation is subject to the constraints within a geography, such as geography size, power or network infrastructure availability, and regulations.
- **Data residency**. To meet data residency requirements, almost all regions reside within the same geography as their pair. To learn about the exceptions, see [list of region pairs](#list-of-region-pairs).

> [!IMPORTANT]
> Deploying resources to a region in a pair doesn't automatically make them more resilient, nor does it provide automatic high availability or disaster recovery capabilities or failover. It's critical that you develop your own high availability and disaster recovery plans, regardless of whether you use paired regions or not.
>
> Even if you configure service features to use region pairs, don't rely on Microsoft-managed failover between those pairs as your primary disaster recovery approach. For example, Microsoft-managed failover of GRS-enabled storage accounts is only performed in catastrophic situations and after repeated failed recovery attempts.

You aren't limited to using services within a single region, or within your region's pair. Although an Azure service might rely upon a specific regional pair for some of its reliability capabilities, you can host your services in any region that satisfies your business needs. For example, an Azure solution can use Azure Storage in the Canada Central region with GRS storage to replicate data to the paired region, Canada East, while using Azure compute resources located in East US, and Azure OpenAI resources located in West US.

### List of region pairs

The table below lists Azure region pairs:

| Geography | Region in pair | Region in pair |
| --- | --- | --- |
| **Asia-Pacific** | East Asia (Hong Kong Special Administrative Region) | Southeast Asia (Singapore) |
| **Australia** | Australia East | Australia Southeast |
| | Australia Central | Australia Central 2\* |
| **Brazil** | Brazil South | South Central US |
| | Brazil Southeast\* | Brazil South |
| **Canada** | Canada Central | Canada East |
| **China** | China North | China East |
| | China North 2 | China East 2 |
| | China North 3 | China East 3\* |
| **Europe** | North Europe (Ireland) | West Europe (Netherlands) |
| **France** | France Central | France South\* |
| **Germany** | Germany West Central | Germany North\* |
| **India** | Central India | South India |
| |South India | Central India |
| | West India | South India |
| **Japan** | Japan East | Japan West |
| **Korea** | Korea Central | Korea South\* |
| **Norway** | Norway East | Norway West\* |
| **South Africa** | South Africa North | South Africa West\* |
| **Sweden** | Sweden Central | Sweden South\* |
| **Switzerland** | Switzerland North | Switzerland West\* |
| **United Kingdom** | UK West | UK South |
| **United States** | East US | West US |
| | East US 2 | Central US |
| | North Central US | South Central US |
| | West US 2 | West Central US |
| | West US 3 | East US |
| **United Arab Emirates** | UAE North | UAE Central\* |
| **US Department of Defense** | US DoD East\* | US DoD Central\* |
| **US Government** | US Gov Arizona\* | US Gov Texas\* |
| | US Gov Virginia\* | US Gov Texas\* |
| | US Gov Texas\* | US Gov Virginia\* |

(\*) Certain regions are access restricted to support specific customer scenarios, such as in-country disaster recovery. These regions are available only upon request by [creating a new support request](/troubleshoot/azure/general/region-access-request-process#reserved-access-regions).

> [!IMPORTANT]
> - West India is paired in one direction only. West India's secondary region is South India, but South India's secondary region is Central India.
> - West US 3 is paired in one direction with East US. East US is bidirectionally paired with West US.
> - Brazil South is paired with a region outside of its geography. Brazil South's secondary region is South Central US. The secondary region of South Central US isn't Brazil South.

## Nonpaired regions

Azure continues to expand globally, and many of our newer regions provide multiple [availability zones](./availability-zones-overview.md) for higher resiliency, and don't have a region pair.

Many Azure services support geo-replication and geo-redundancy between any arbitrary set of regions, and don't rely on region pairs. It's important to understand how multi-region support works for the particular services you use. To learn about the details of each service, see [Azure service reliability guides](./overview-reliability-guidance.md).

### List of nonpaired regions

The table below lists Azure regions without a region pair:

| Geography | Region |
|-----|----|
| Austria | Austria East (coming soon) |
| Israel | Israel Central|
| Italy | Italy North|
| Mexico | Mexico Central |
| New Zealand | New Zealand North |
| Poland | Poland Central |
| Qatar | Qatar Central |
| Spain | Spain Central|

## Next steps

- [What are Azure regions?](./regions-overview.md)
- [Azure regions with availability zones](availability-zones-region-support.md)
- [Reliability guidance](./reliability-guidance-overview.md)
