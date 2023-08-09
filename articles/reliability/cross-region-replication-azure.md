---
title: Cross-region replication in Azure
description: Learn about Cross-region replication in Azure.
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 12/12/2022
ms.author: anaharris
ms.custom: references_regions
---

# Cross-region replication in Azure: Business continuity and disaster recovery 

Many organizations require both high availability provided by availability zones that are also supported with protection from large-scale phenomena and regional disasters. Azure regions are designed to offer protection against local disasters with availability zones. But they can also provide protection from regional or large geography disasters with disaster recovery by making use of another region that uses *cross-region replication*.

## Cross-region replication

To ensure customers are supported across the world, Azure maintains multiple geographies. These discrete demarcations define a disaster recovery and data residency boundary across one or multiple Azure regions. 

Cross-region replication is one of several important pillars in the Azure business continuity and disaster recovery strategy. Cross-region replication builds on the synchronous replication of your applications and data that exists by using availability zones within your primary Azure region for high availability. Cross-region replication asynchronously replicates the same applications and data across other Azure regions for disaster recovery protection. 

![Image depicting high availability via asynchronous replication of applications and data across other Azure regions for disaster recovery protection.](./media/cross-region-replication.png)

Some Azure services take advantage of cross-region replication to ensure business continuity and protect against data loss. Azure provides several [storage solutions](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region) that make use of cross-region replication to ensure data availability. For example, [Azure geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage) (GRS) replicates data to a secondary region automatically. This approach ensures that data is durable even if the primary region isn't recoverable.

Not all Azure services automatically replicate data or automatically fall back from a failed region to cross-replicate to another enabled region. In these scenarios, recovery and replication must be configured by the customer. These examples are illustrations of the *shared responsibility model*. It's a fundamental pillar in your disaster recovery strategy. For more information about the shared responsibility model and to learn about business continuity and disaster recovery in Azure, see [Business continuity management in Azure](business-continuity-management-program.md).

Shared responsibility becomes the crux of your strategic decision-making when it comes to disaster recovery. Azure doesn't require you to use cross-region replication, and you can use services to build resiliency without cross-replicating to another enabled region. But we strongly recommend that you configure your essential services across regions to benefit from [isolation](../security/fundamentals/isolation-choices.md) and improve [availability](availability-zones-service-support.md). 

For applications that support multiple active regions, we recommend that you use available multiple enabled regions. This practice ensures optimal availability for applications and minimized recovery time if an event affects availability. Whenever possible, design your application for [maximum resiliency](/azure/architecture/framework/resiliency/overview) and ease of [disaster recovery](/azure/architecture/framework/resiliency/backup-and-recovery).

## Benefits of cross-region replication

Architecting cross-regional replication for your services and data can be decided on a per-service basis. You'll necessarily take a cost-benefit analysis approach based on your organization's strategic and business requirements. Primary and ripple benefits of cross-region replication are complex, extensive, and deserve elaboration. These benefits include:

- **Region recovery sequence**: If a geography-wide outage occurs, recovery of one region is prioritized out of every enabled set of regions. Applications that are deployed across enabled region sets are guaranteed to have one of the regions prioritized for recovery. If an application is deployed across regions, any of which isn't enabled for cross-regional replication, recovery can be delayed.
- **Sequential updating**: Planned Azure system updates for your enabled regions are staggered chronologically to minimize downtime, impact of bugs, and any logical failures in the rare event of a faulty update.
- **Physical isolation**: Azure strives to ensure a minimum distance of 300 miles (483 kilometers) between datacenters in enabled regions, although it isn't possible across all geographies. Datacenter separation reduces the likelihood that natural disaster, civil unrest, power outages, or physical network outages can affect multiple regions. Isolation is subject to the constraints within a geography, such as geography size, power or network infrastructure availability, and regulations.
- **Data residency**: Regions reside within the same geography as their enabled set (except for Brazil South and Singapore) to meet data residency requirements for tax and law enforcement jurisdiction purposes. 

Although it is not possible to create your own regional pairings, you can nevertheless create your own disaster recovery solution by building your services in any number of regions and then using Azure services to pair them. For example, you can use Azure services such as [AzCopy](../storage/common/storage-use-azcopy-v10.md) to schedule data backups to an Azure Storage account in a different region. Using [Azure DNS and Azure Traffic Manager](../networking/disaster-recovery-dns-traffic-manager.md), you can design a resilient architecture for your applications that will survive the loss of the primary region.

Azure controls planned maintenance and recovery prioritization for regional pairs. Some Azure services rely upon regional pairs by default, such as Azure [redundant storage](../storage/common/storage-redundancy.md).

You are not limited to using services within your regional pairs. Although an Azure service can rely upon a specific regional pair, you can host your other services in any region that satisfies your business needs. For example, an Azure GRS storage solution can pair data in Canada Central with a peer in Canada East while using Azure Compute resources located in East US.

## Azure cross-region replication pairings for all geographies

Regions are paired for cross-region replication based on proximity and other factors.

>[!IMPORTANT]
>To learn more about your region's architecture, please contact your Microsoft sales or customer representative.

**Azure regional pairs**

| Geography | Regional pair A | Regional pair B |
| --- | --- | --- |
| Asia-Pacific |East Asia (Hong Kong Special Administrative Region) | Southeast Asia (Singapore) |
| Australia |Australia East |Australia Southeast |
| Australia |Australia Central |Australia Central 2\* |
| Brazil |Brazil South |South Central US |
| Brazil |Brazil Southeast\* |Brazil South |
| Canada |Canada Central |Canada East |
| China |China North |China East|
| China |China North 2 |China East 2|
| China |China North 3 |China East 3\* |
| Europe |North Europe (Ireland) |West Europe (Netherlands) |
| France |France Central|France South\*|
| Germany |Germany West Central |Germany North\* |
| India |Central India |South India |
| India |West India |South India |
| Japan |Japan East |Japan West |
| Korea |Korea Central |Korea South\* |
| United States |East US |West US |
| United States |East US 2 |Central US |
| United States |North Central US |South Central US |
| United States |West US 2 |West Central US |
| United States|West US 3 |East US |
| Norway | Norway East | Norway West\* |
| South Africa | South Africa North |South Africa West\* |
| Sweden | Sweden Central |Sweden South\* |
| Switzerland | Switzerland North |Switzerland West\* |
| UK |UK West |UK South |
| United Arab Emirates | UAE North | UAE Central\* |
| US Department of Defense |US DoD East\* |US DoD Central\* |
| US Government |US Gov Arizona\* |US Gov Texas\* |
| US Government |US Gov Virginia\* |US Gov Texas\* |

(\*) Certain regions are access restricted to support specific customer scenarios, such as in-country/region disaster recovery. These regions are available only upon request by [creating a new support request](/troubleshoot/azure/general/region-access-request-process#reserved-access-regions).

> [!IMPORTANT]
> - West India is paired in one direction only. West India's secondary region is South India, but South India's secondary region is Central India.
> - Brazil South is unique because it's paired with a region outside of its geography. Brazil South's secondary region is South Central US. The secondary region of South Central US isn't Brazil South.

## Regions with availability zones and no region pair

Azure continues to expand globally with Qatar as the first region with no regional pair and achieves high availability by leveraging [availability zones](../reliability/availability-zones-overview.md) and [locally redundant or zone-redundant storage (LRS/ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage). Regions without a pair will not have [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage). Such regions follow [data residency](https://azure.microsoft.com/global-infrastructure/data-residency/#overview) guidelines allowing the option to keep data resident within the same region. Customers are responsible for data resiliency based on their Recovery Point Objective or Recovery Time Objective (RTO/RPO) needs and may move, copy, or access their data from any location globally. In the rare event that an entire Azure region is unavailable, customers will need to plan for their Cross Region Disaster Recovery per guidance from [Azure services that support high availability](../reliability/availability-zones-service-support.md#azure-services-with-availability-zone-support) and  [Azure Resiliency – Business Continuity and Disaster Recovery](https://azure.microsoft.com/mediahandler/files/resourcefiles/resilience-in-azure-whitepaper/resiliency-whitepaper-2022.pdf).

## Next steps

- [Azure services and regions that support availability zones](availability-zones-service-support.md)
- [Quickstart templates](https://aka.ms/azqs)
