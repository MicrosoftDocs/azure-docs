---
title: Zone-redundant registries for high availability
description: Learn about enabling zone redundancy in Azure Container Registry by creating a container registry registry or geographic replica in an Azure availability zone. Zone redundancy is a feature of the Premium service tier.
ms.topic: article
ms.date: 11/10/2020
---
# Enable zone redundancy in Azure Container Registry for resiliency and high availability

In addition to [geo-replication](container-registry-geo-replication.md), a feature that replicates registry data across one or more Azure regions to reduce latency for regional operations, Azure Container Registry supports optional *zone redundancy*. 

This article shows how to set up a zone-redundant container registry or regional replica. Zone redundancy provides resiliency and high availability of a registry or replica in a specific region.

This feature is available in the Premium container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

## Limitations

* Zone redundancy for Azure Container Registry is currently only supported in the following regions: East US, East US2, and West US2
* You can currently add a registry or a regional replica to an availability zone only when you create it. 
* After enabling zone redundancy in a registry or regional replica, you can't disable it.

> [!NOTE]
> In a geo-replicated registry, not all replicas (including the home replica) need to be zone redundant. You can enable zone redundancy on a replica by replica basis.

** Customer cannot migration from non Zone redundant registry to ZoneRedundancy registry.  Should we mention a workaround here? [What does this mean??] **

## About zone redundancy

Zone redundancy, enabled by Azure [availability zones](../availability-zones/az-overview.md), provides resiliency and high availability to an Azure container registry deployed within selected Azure regions. Availability zones are unique physical locations within an Azure region. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. When configured for zone-redundancy, a registry (or a geographic registry replica) is replicated across all zones in the availability zone, protecting against datacenter failures.

Might need statement like "Zonal ILB ASEs must be created using ARM templates. Once a zonal ILB ASE is created via an ARM template, it can be viewed and interacted with via the Azure portal and CLI. An ARM template is only needed for the initial creation of a zonal ILB ASE."

From Susan:

nitial set of az supported public regions are EUS, EUS2, and WUS2. EUS2EUAP and Dogfood4 are used for internal test.
We are rolling it out to Canary today (Nov 10). Cli and Portal are working in progress, this property can be tested through arm template.
 
Please call out the following limitiations in our docs:

 


 
Dan Lepow, Let me know if you have any questions. thanks!

Questions:
1. Is this preview??
1. Why are we doing this?
1. What is customer benefit/use scenario?
1. What is migration scenario (non zone-redundant to zone redundant registry)? 
1. How does geo-repl and zone redundancy intersect?

## Next steps

* Learn more about [regions that support availability zones](../availability-zones/az-region.md)


