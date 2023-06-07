---
title: Reliability in Azure Data Manager for Energy
description: Find out about reliability in Azure Data Manager for Energy
author: bharathim 
ms.author: anaharris
ms.topic: conceptual
ms.service: energy-data-services
ms.custom: subject-reliability, references_regions
ms.date: 06/07/2023
---


# Reliability in Azure Data Manager for Energy (Preview)

This article describes reliability support in Azure Data Manager for Energy, and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](../reliability/overview.md).

[!INCLUDE [preview features callout](../energy-data-services/includes/preview/preview-callout.md)]



## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability if a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](availability-zones-overview.md).

Azure Data Manager for Energy Preview supports zone-redundant instance by default and there's no setup required.

### Prerequisites

The Azure Data Manager for Energy Preview supports availability zones in the following regions:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. There may be a brief degradation of performance until the service self-heals and rebalances underlying capacity to adjust to healthy zones. 

If you're experiencing failures with Azure Data Manager for Energy PreviewAPIs, you may need to implement a retry mechanism for 5XX errors.

## Disaster recovery: cross-region failover
*Business Continuity Disaster Recovery (BCDR)* is the ability of a service to continue business operations in the face of a disaster (fire, flood, earthquake, etc.). Services running in a primary region have recovery in place (or provide recovery capabilities) to a secondary sufficiently distanced to not be susceptible to the same impacts. *Cross-region replication* is the process of copying data across different geographic regions for redundancy, performance, or compliance purposes. Both disaster recovery and cross-region replication are essential for ensuring business continuity and resilience in the energy sector.

### Cross-region disaster recovery in multi-region geography
Azure Data Manager for Energy Preview is a regional service and therefore susceptible to hard region-down service failures. Azure Data Manager for Energy Preview follows a multi-region deployment with active-passive failover configuration. An active-passive configuration keeps warm instances in the secondary region, but doesn't send traffic there unless the primary region fails.

:::image type="content" source="media/reliability-azure-data-manager-for-energy/cross-region-disaster-recovery.png" alt-text="Azure data manager for energy cross region disaster recovery workflow.":::

Azure Data Manager for Energy Preview uses Azure Storage and Azure Cosmos DB as underlying data stores for persisting your data partition data. These data stores offer high durability, availability and scalability. We use [Geo-zone-redundant storage](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or GZRS to automatically replicate data to a secondary region that is hundreds of miles away from the primary region. The same security features enabled in the primary region (for example, encryption at rest using your encryption key) to protect your data is applicable to the secondary region. Similarly, Azure Cosmos DB is a globally distributed data service, which replicates the metadata (catalog) across regions. Elastic index snapshots are taken at regular intervals and geo-replicated to the secondary region. All inflight data are ephemeral and therefore subject to loss. For example, data that is part of an on-going ingestion job that isn't persisted yet is lost, and you have to restart the ingestion process upon recovery.

#### Set up disaster recovery and outage detection

Azure Data Manager for Energy Preview service continuously monitors service health in the primary region. If a hard service down failure is detected in the primary region, we attempt recovery before initiating failover to the secondary region on your behalf. You're notified about the failover progress through established communication channels. Once the failover completes, you could connect to the Azure Data Manager for Energy Preview instance in the secondary region and continue operations. However, there could be slight degradation in performance due to any capacity constraints in the secondary region. Once the primary region is available, Microsoft initiates failback of Azure Data Manager for Energy Preview resource, and also syncs back your persisted back to the primary region. 

You must handle the failover of your business apps connecting to Azure Data Manager for Energy Preview resource and hosted in the same primary region. Additionally, you're responsible for recovering any diagnostic logs stored in your Log Analytics Workspace. 

If you had [Set up private links](../energy-data-services/how-to-set-up-private-links.md) to your Azure Data Manager for Energy Preview resource in the primary region, then you must create a secondary private endpoint to the same resource in the [Paired region](cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies).  
    
> [!CAUTION]
> If you had not enabled public access networks or created a secondary private endpoint before an outage, you will lose access to the Azure Data Manager for Energy Preview resource.
   
> [!IMPORTANT]
> After failover completes, 
> you cannot Enable or Disable public access networks.
> you cannot Approve or Reject private endpoint connection to Azure Data Manager for Energy Preview resource

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)