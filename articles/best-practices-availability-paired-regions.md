---
title: Business continuity & disaster recovery - Azure Paired Regions
description: Learn about Azure regional pairing, to ensure that applications are resilient during data center failures.
author: jpconnock
manager: angrobe
ms.service: multiple
ms.topic: article
ms.date: 01/09/2020
ms.author: jeconnoc
---

# Business continuity and disaster recovery (BCDR): Azure Paired Regions

## What are paired regions?

An Azure region consists of a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated low-latency network.  This ensures that Azure services within an Azure region offer the best possible performance and security.  

An Azure geography defines an area of the world containing at least one Azure Region. Geographies define a discrete market, typically containing two or more regions, that preserves data residency and compliance boundaries.  Find more information about Azure's global infrastructure [here](https://azure.microsoft.com/global-infrastructure/regions/)

Each Azure region is paired with another region within the same geography, together making a regional pair. Azure serializes platform updates (planned maintenance) across regional pairs, ensuring that only one paired region updates at a time. In the event of an outage affecting multiple regions, at least one region in each pair will be prioritized for recovery.

![AzureGeography](./media/best-practices-availability-paired-regions/GeoRegionDataCenter.png)

Some Azure services take further advantage of paired regions to ensure business continuity and to protect against data loss.  For example, [Azure Geo-redundant Storage](./storage/common/storage-redundancy-grs.md) (GRS) replicates data to a secondary region automatically, ensuring that data is durable even in the event that the primary region is not recoverable. 

It is important to note that not all Azure services automatically replicate data, nor do all Azure services automatically fall-back from a failed region to its pair.  In such cases, recovery and replication must be configured by the customer.

## Can I select my regional pairs?

No. For Azure services that rely upon regional pairs, such as Azure's [redundant storage](./storage/common/storage-redundancy) services, the pairs are fixed.  However, you can create your own disaster recovery solution by building  services in any number of regions and leveraging Azure services to pair them.  

For example, customers may leverage Azure services such as [AzCopy](./storage/common/storage-use-azcopy-v10.md) to schedule data backups to a Storage account in a different region.  Using [Azure DNS and Azure Traffic Manager](./networking/disaster-recovery-dns-traffic-manager.md), customers can design a resilient architecture for their applications that will survive the loss of the primary region.

## Am I limited to using services within my regional pairs?

No. While your redundant storage solution may rely upon a regional pair, you may host your other services in any region that satisfies your business needs.  An Azure GRS storage solution may pair data in Canada Central with a peer in Canada East while using Compute resources located in East US.  

## Must I use Azure regional pairs?

No. Customers can leverage Azure services to architect a resilient service without relying on Azure's regional pairs.  However, we recommend that you configure business continuity disaster recovery (BCDR) across regional pairs to benefit from Azure’s [isolation](./security/fundamentals/isolation-choices) and [availability](./availability-zones/az-overview) policies. For applications which support multiple active regions, we recommend using both regions in a region pair where possible. This will ensure optimal availability for applications and minimized recovery time in the event of a disaster. 

## Azure Regional Pairs

| Geography | Paired regions |  |
|:--- |:--- |:--- |
| Asia |East Asia (Hong Kong) | Southeast Asia (Singapore) |
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

> [!Important]
> - West India is paired in one direction only. West India's secondary region is South India, but South India's secondary region is Central India.
> - Brazil South is unique because it is paired with a region outside of its own geography. Brazil South’s secondary region is South Central US. South Central US’s secondary region is not Brazil South.


## An example of paired regions
The image below illustrates a hypothetical application which uses the regional pair for disaster recovery. The green numbers highlight the cross-region activities of three Azure services (Azure compute, storage, and database) and how they are configured to replicate across regions. The unique benefits of deploying across paired regions are highlighted by the orange numbers.

![Overview of Paired Region Benefits](./media/best-practices-availability-paired-regions/PairedRegionsOverview2.png)

Figure 2 – Hypothetical Azure regional pair

## Cross-region activities
As referred to in figure 2.

![IaaS](./media/best-practices-availability-paired-regions/1Green.png) **Azure Compute (IaaS)** – You must provision additional compute resources in advance to ensure resources are available in another region during a disaster. For more information, see [Azure resiliency technical guidance](https://github.com/uglide/azure-content/blob/master/articles/resiliency/resiliency-technical-guidance.md). 

![Storage](./media/best-practices-availability-paired-regions/2Green.png) **Azure Storage** - If you're using managed disks, learn about [cross-region backups](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region#virtual-machines) with Azure Backup, and [replicating VMs](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication) from one region to another with Azure Site Recovery. If you're using storage accounts, then geo-redundant storage (GRS) is configured by default when an Azure Storage account is created. With GRS, your data is automatically replicated three times within the primary region, and three times in the paired region. For more information, see [Azure Storage Redundancy Options](storage/common/storage-redundancy.md).

![Azure SQL](./media/best-practices-availability-paired-regions/3Green.png) **Azure SQL Database** – With Azure SQL Database Geo-Replication, you can configure asynchronous replication of transactions to any region in the world; however, we recommend you deploy these resources in a paired region for most disaster recovery scenarios. For more information, see [Geo-Replication in Azure SQL Database](sql-database/sql-database-geo-replication-overview.md).

![Resource Manager](./media/best-practices-availability-paired-regions/4Green.png) **Azure Resource Manager** - Resource Manager inherently provides logical isolation of components across regions. This means logical failures in one region are less likely to impact another.

## Benefits of paired regions

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
