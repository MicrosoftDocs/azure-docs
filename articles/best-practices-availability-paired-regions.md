---
title: 'Business continuity and disaster recovery (BCDR): Azure Paired Regions | Microsoft Docs'
description: Learn about Azure regional pairing, to ensure that applications are resilient during data center failures.
author: rayne-wiselman
manager: carmon
ms.service: multiple
ms.topic: article
ms.date: 07/01/2019
ms.author: raynew
---

# Business continuity and disaster recovery (BCDR): Azure Paired Regions

## What are paired regions?

Azure operates in multiple geographies around the world. An Azure geography is a defined area of the world that contains at least one Azure Region. An Azure region is an area within a geography, containing one or more datacenters.

Each Azure region is paired with another region within the same geography, together making a regional pair. The exception is Brazil South, which is paired with a region outside its geography. Across the region pairs Azure serializes platform updates (planned maintenance), so that only one paired region is updated at a time. In the event of an outage affecting multiple regions, at least one region in each pair will be prioritized for recovery.

![AzureGeography](./media/best-practices-availability-paired-regions/GeoRegionDataCenter.png)

Figure 1 – Azure regional pairs

| Geography | Paired regions |  |
|:--- |:--- |:--- |
| Asia |East Asia |Southeast Asia |
| Australia |Australia East |Australia Southeast |
| Australia |Australia Central |Australia Central 2 |
| Brazil |Brazil South |South Central US |
| Canada |Canada Central |Canada East |
| China |China North |China East|
| China |China North 2 |China East 2|
| Europe |North Europe (Ireland) |West Europe (Netherlands) |
| France |France Central|France South|
| Germany |Germany Central |Germany Northeast |
| India |Central India |South India |
| India |West India |South India |
| Japan |Japan East |Japan West |
| Korea |Korea Central |Korea South |
| North America |East US |West US |
| North America |East US 2 |Central US |
| North America |North Central US |South Central US |
| North America |West US 2 |West Central US 
| South Africa | South Africa North | South Africa West
| UK |UK West |UK South |
| United Arab Emirates | UAE North | UAE Central
| US Department of Defense |US DoD East |US DoD Central |
| US Government |US Gov Arizona |US Gov Texas |
| US Government |US Gov Iowa |US Gov Virginia |
| US Government |US Gov Virginia |US Gov Texas |

Table 1 - Mapping of Azure regional pairs

- West India is paired in one direction only. West India's secondary region is South India, but South India's secondary region is Central India.
- Brazil South is unique because it is paired with a region outside of its own geography. Brazil South’s secondary region is South Central US. South Central US’s secondary region is not Brazil South.
- US Gov Iowa's secondary region is US Gov Virginia.
- US Gov Virginia's secondary region is US Gov Texas.
- US Gov Texas' secondary region is US Gov Arizona.


We recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure’s isolation and availability policies. For applications which support multiple active regions, we recommend using both regions in a region pair where possible. This will ensure optimal availability for applications and minimized recovery time in the event of a disaster. 

## An example of paired regions
Figure 2 below shows a hypothetical application which uses the regional pair for disaster recovery. The green numbers highlight the cross-region activities of three Azure services (Azure compute, storage, and database) and how they are configured to replicate across regions. The unique benefits of deploying across paired regions are highlighted by the orange numbers.

![Overview of Paired Region Benefits](./media/best-practices-availability-paired-regions/PairedRegionsOverview2.png)

Figure 2 – Hypothetical Azure regional pair

## Cross-region activities
As referred to in figure 2.

![IaaS](./media/best-practices-availability-paired-regions/1Green.png) **Azure Compute (IaaS)** – You must provision additional compute resources in advance to ensure resources are available in another region during a disaster. For more information, see [Azure resiliency technical guidance](resiliency/resiliency-technical-guidance.md).

![Storage](./media/best-practices-availability-paired-regions/2Green.png) **Azure Storage** - If you're using managed disks, learn about [cross-region backups](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region#virtual-machines) with Azure Backup, and [replicating VMs](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication) from one region to another with Azure Site Recovery. If you're using storage accounts, then geo-redundant storage (GRS) is configured by default when an Azure Storage account is created. With GRS, your data is automatically replicated three times within the primary region, and three times in the paired region. For more information, see [Azure Storage Redundancy Options](storage/common/storage-redundancy.md).

![Azure SQL](./media/best-practices-availability-paired-regions/3Green.png) **Azure SQL Database** – With Azure SQL Database Geo-Replication, you can configure asynchronous replication of transactions to any region in the world; however, we recommend you deploy these resources in a paired region for most disaster recovery scenarios. For more information, see [Geo-Replication in Azure SQL Database](sql-database/sql-database-geo-replication-overview.md).

![Resource Manager](./media/best-practices-availability-paired-regions/4Green.png) **Azure Resource Manager** - Resource Manager inherently provides logical isolation of components across regions. This means logical failures in one region are less likely to impact another.

## Benefits of paired regions
As referred to in figure 2.  

![Isolation](./media/best-practices-availability-paired-regions/5Orange.png)
**Physical isolation** – When possible, Azure prefers at least 300 miles of separation between datacenters in a regional pair, although this isn't practical or possible in all geographies. Physical datacenter separation reduces the likelihood of natural disasters, civil unrest, power outages, or physical network outages affecting both regions at once. Isolation is subject to the constraints within the geography (geography size, power/network infrastructure availability, regulations, etc.).  

![Replication](./media/best-practices-availability-paired-regions/6Orange.png)
**Platform-provided replication** - Some services such as Geo-Redundant Storage provide automatic replication to the paired region.

![Recovery](./media/best-practices-availability-paired-regions/7Orange.png)
**Region recovery order** – In the event of a broad outage, recovery of one region is prioritized out of every pair. Applications that are deployed across paired regions are guaranteed to have one of the regions recovered with priority. If an application is deployed across regions that are not paired, recovery might be delayed – in the worst case the chosen regions may be the last two to be recovered.

![Updates](./media/best-practices-availability-paired-regions/8Orange.png)
**Sequential updates** – Planned Azure system updates are rolled out to paired regions sequentially (not at the same time) to minimize downtime, the effect of bugs, and logical failures in the rare event of a bad update.

![Data](./media/best-practices-availability-paired-regions/9Orange.png)
**Data residency** – A region resides within the same geography as its pair (with the exception of Brazil South) in order to meet data residency requirements for tax and law enforcement jurisdiction purposes.
