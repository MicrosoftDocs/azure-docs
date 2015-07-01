<properties
	pageTitle="Improve Business Continuity with Azure Regional Pairs"
	description="Use Regional pairs to keep applications resilient during data center failures."
	services="multiple"
	documentationCenter=""
	authors="robb"
	manager="jwhit"
	editor="tysonn"/>

<tags
    ms.service="backup"
    ms.workload="storage-backup-recovery"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="06/30/2015"
    ms.author="rboucher"/>

# Improve Business Continuity using Azure Regional Pairs

## Azure paired regions

Azure operates in multiple geographies around the world. An Azure geography is a defined area of the world containing at least one Azure Region. An Azure region is an area within a geography containing one or more datacenters.

Each Azure region is paired with another region within the same geography (with the exception of Brazil South which is paired with a region outside its geography), together making a regional pair


![AzureGeography](./media/infrastructure-paired-regions/GeoRegionDataCenter.png)

Figure 1 – Azure regional pair diagram



| Geography     |  Paired Regions  |                  |
| :-------------| :-------------   | :-------------   |
| North America | North Central US | South Central US |
|               | East US          | West US          |
|               | US East 2        | US Central       |
| Europe        | North Europe     | West Europe      |
| Asia          | South East Asia  | East Asia        |
| China         | East China       | North China      |
| Japan         | Japan East       | Japan West       |
| Brazil        | Brazil South (1) | South Central US |
| Australia     | Australia East   | Australia Southeast |
| US Government | US Gov Iowa      | US Gov Virginia  |

Table 1 - Mapping of azure regional pairs

> (1) Brazil South is unique because it is paired with a region outside of its own geography. Note that Brazil South’s secondary region is South Central US but South Central US’s secondary region is not Brazil South.

We recommend you replicate workloads across regional pairs because you benefit from Azure’s isolation and availability policies. For example, planned Azure system updates are deployed sequentially (not at the same time) across paired regions. That means that even in the rare event of a faulty update, both regions will not be affected simultaneously. Furthermore, in the unlikely event of a broad outage, recovery of at least one region out of every pair is prioritized first.

Figure 1 below shows a hypothetical regional pair. The green numbers highlight the cross-region activities of three Azure services (Azure Compute, Storage, and Database) and how they are configured to replicate across regions. The unique benefits of deploying across paired regions are highlighted in orange.


![Overview of Paired Region Benefits](./media/infrastructure-paired-regions/PairedRegionsOverview2.png)

![1Green](./media/infrastructure-paired-regions/1Green.png) **Azure Compute** – You must provision additional compute resources in advance to ensure resources are available in another region during a disaster. We recommended you deploy them across paired regions. Azure will let you provision them in other locations.

![2Green](./media/infrastructure-paired-regions/2Green.png) **Azure Storage** - Geo-Redundant storage (GRS) is configured by default when an Azure Storage account is created. With GRS, your data is replicated three times within the primary region, and is replicated three times in the paired region. GRS only permits replication to the paired region and cannot be configured differently. For more information, see [Azure Storage Redundancy Options](./storage-redundancy/).


![3Green](./media/infrastructure-paired-regions/3Green.png) **Azure SQL Databases** – With Azure SQL Geo-Replication, you can configure asynchronous replication of transactions to other Microsoft Azure Database servers. Standard Geo-Replication only permits asynchronous replication to the paired region. With Premium Geo-replication, however, you can configure replication to any region in the world, however, it is recommended to deploy them to the paired region. For more information, see [Geo-Replication in Azure SQL Database](https://msdn.microsoft.com/library/azure/dn783447.aspx)

![4Green](./media/infrastructure-paired-regions/4Green.png) **Independent management services** - Azure Resource Manager inherently provides logical isolation of service management components across regions – no configuration is required. This means logical failures in one region are less likely to impact another.

**What are the benefits of a paired region?**

![5Orange](./media/infrastructure-paired-regions/5Orange.png)
**Physical isolation** – When possible, Azure prefers at least 300 miles of separation between datacenters in a regional pair, although this is not practical or possible in all geographies. Physical datacenter separation reduces the likelihood of natural disasters, civil unrest, power outages, or physical network outages affecting both regions at once. Isolation is subject to the constraints within the geography (geography size, power/network infrastructure availability, regulations).

![6Orange](./media/infrastructure-paired-regions/6Orange.png)
**Consistent application state** - As mentioned previously, some Azure services only permit replication to the paired region (such as Geo-Redundant Storage) while others can be configured (such as Premium SQL Geo-Replication) or implemented (such as Compute resources) to replicate to any region. You must replicate all resources needed for an application to the same paired region in order to preserve the entire application state in the event of primary region loss.

![7Orange](./media/infrastructure-paired-regions/7Orange.png)
**Region recovery order** – In the event of a broad outage, recovery of one region is  prioritized out of every pair.  Applications that are deployed across paired regions are guaranteed to have one of the regions recovered with priority.  If an application is deployed across regions that are not paired, recovery may be delayed – in the worst case the chosen regions may be the last two to be recovered.

![8Orange](./media/infrastructure-paired-regions/8Orange.png)
**Sequential updates** –  Planned Azure system updates are rolled out to paired regions sequentially (not at the same time) to minimize downtime, the effect of bugs, and logical failures, in the rare event that a bad update is rolled out.


![9Orange](./media/infrastructure-paired-regions/9Orange.png)
**Data residency** – A region resides within the same geography as its pair  in order to meet data residency requirements for tax and law enforcement jurisdiction purposes.
