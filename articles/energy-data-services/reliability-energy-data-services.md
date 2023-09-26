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


# Reliability in Azure Data Manager for Energy

This article describes reliability support in Azure Data Manager for Energy, and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/resiliency/overview).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability if a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](../reliability/availability-zones-overview.md).

Azure Data Manager for Energy supports zone-redundant instance by default and there's no additional configuration required.

## Prerequisites

The Azure Data Manager for Energy supports availability zones in the following regions:


| Americas         | Europe               |
|------------------|----------------------|
| South Central US | North Europe         |
| East US          | West Europe          |
| Brazil South     |                      |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. There may be a brief degradation of performance until the service self-heals and rebalances underlying capacity to adjust to healthy zones. During this period, you may experience 5xx errors and you may have to retry API calls until the service is restored.

## Disaster recovery: cross-region failover
*Business Continuity Disaster Recovery (BCDR)* is the ability of a service to continue business operations in the face of a disaster (fire, flood, earthquake, etc.). Services running in a primary region have recovery in place (or provide recovery capabilities) to a secondary region that's sufficiently distanced to avoid the same impacts. *Cross-region replication* is the process of copying data across different geographic regions for redundancy, performance, or compliance purposes. Both disaster recovery and cross-region replication are essential for ensuring business continuity and resilience in the energy sector.

### Cross-region disaster recovery in multi-region geography
Azure Data Manager for Energy is a regional service and, therefore, is susceptible to region-down service failures. Azure Data Manager for Energy follows an active-passive failover configuration to recover from regional disaster. An active-passive configuration keeps warm Azure Data Manager for Energy resource running in the secondary region, but doesn't send traffic there unless the primary region fails. 

:::image type="content" source="media/reliability-energy-data-services/cross-region-disaster-recovery.png" alt-text="Diagram of Azure data manager for energy cross region disaster recovery workflow." lightbox="media/reliability-energy-data-services/cross-region-disaster-recovery.png":::

Below is the list of primary and secondary regions for regions where disaster recovery is supported:

| Geography        | Primary              | Secondary        |
|------------------|----------------------|------------------|
|Americas          | South Central US     | North Central US |
|Americas          | East US              | West US          |
|Europe            | North Europe         | West Europe      |
|Europe            | West Europe          | North Europe     |

Azure Data Manager for Energy uses Azure Storage, Azure Cosmos DB and Elasticsearch index as underlying data stores for persisting your data partition data. These data stores offer high durability, availability, and scalability. Azure Data Manager for Energy uses [geo-zone-redundant storage](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or GZRS to automatically replicate data to a secondary region that's hundreds of miles away from the primary region. The same security features enabled in the primary region (for example, encryption at rest using your encryption key) to protect your data are applicable to the secondary region. Similarly, Azure Cosmos DB is a globally distributed data service, which replicates the metadata (catalog) across regions. Elasticsearch index snapshots are taken at regular intervals and geo-replicated to the secondary region. All inflight data are ephemeral and therefore subject to loss. For example, in-transit data that is part of an on-going ingestion job that isn't persisted yet is lost, and you must restart the ingestion process upon recovery.

> [!IMPORTANT]
> In the following regions, disaster recovery is not available. For more information please contact your Microsoft sales or customer representative.
> 1. Brazil South

#### Set up disaster recovery and outage detection

Azure Data Manager for Energy service continuously monitors service health in the primary region. If a hard service down failure is detected in the primary region, we attempt recovery before initiating failover to the secondary region on your behalf. We will notify you about the failover progress. Once the failover completes, you could connect to the Azure Data Manager for Energy resource in the secondary region and continue operations. However, there could be slight degradation in performance due to any capacity constraints in the secondary region. 

##### Managing the resources in your subscription
You must handle the failover of your business apps connecting to Azure Data Manager for Energy resource and hosted in the same primary region. Additionally, you're responsible for recovering any diagnostic logs stored in your Log Analytics Workspace. 

If you [set up private links](how-to-set-up-private-links.md) to your Azure Data Manager for Energy resource in the primary region, then you must create a secondary private endpoint to the same resource in the [paired region](../reliability/cross-region-replication-azure.md#azure-paired-regions).  
    
> [!CAUTION]
> If you don't enable public access networks or create a secondary private endpoint before an outage, you'll lose access to the failed over Azure Data Manager for Energy resource in the secondary region. You will be able to access the Azure Data Manager for Energy resource only after the primary region failback is complete.
   
> [!IMPORTANT]
> After failover and until the primary region failback completes, you will be unable to perform state modifications to Azure Data Manager for Energy resource created in your subscription. For example, 
> - you cannot **Enable** or **Disable** public access networks.
> - you cannot **Approve** or **Reject** private endpoint connection to Azure Data Manager for Energy resource
> - you cannot create a new data partition.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](../reliability/availability-zones-overview.md)
