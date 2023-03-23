---

title: Reliability in Azure Data Manager for Energy
description: Find out about reliability in Azure Data Manager for Energy
author: bharathim 
ms.author: anaharris
ms.topic: conceptual
ms.service: energy-data-services
ms.custom: subject-reliability, references_regions
ms.date: 01/13/2023
---


# Reliability in Azure Data Manager for Energy (Preview)

This article describes reliability support in Azure Data Manager for Energy, and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](../reliability/overview.md).

[!INCLUDE [preview features callout](../energy-data-services/includes/preview/preview-callout.md)]



## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability in the case of a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](availability-zones-overview.md).

Azure Data Manager for Energy Preview supports zone-redundant instance by default and there's no setup required.

### Prerequisites

The Azure Data Manager for Energy Preview supports availability zones in the following regions:


| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. There may be a brief degradation of performance until the service self-heals and re-balances underlying capacity to adjust to healthy zones. 

If you're experiencing failures with Azure Data Manager for Energy PreviewAPIs, you may need to implement a retry mechanism for 5XX errors.

## Disaster recovery: cross-region failover
*Business Continuity Disaster Recovery (BCDR)* is the ability of a service to continue business operations in the face of a disaster (fire, flood, earthquake, etc.). Services running in a primary region have recovery in place (or provide recovery capabilities) to a secondary sufficiently distanced to not be susceptible to the same impacts. *Cross-region replication* is the process of copying data across different geographic regions for redundancy, performance, or compliance purposes. Both disaster recovery and cross-region replication are essential for ensuring business continuity and resilience in the energy sector.

### Cross-region disaster recovery in multi-region geography
Azure Data Manager for Energy Preview is a regional service and therefore susceptible to hard region-down service failures. Azure Data Manager for Energy Preview follows the Microsoft-controlled service-initiated active passive failover strategy, that is, service instances running your production workloads in the primary region will actively serve traffic, and some instances will be kept on warm standby in the secondary region for disaster recovery purposes only.

When an Azure Data Manager for Energy Preview instance is provisioned in your subscription, certain resources like Azure Kubernetes Service (AKS), Azure Cosmos DB, Azure Storage are provisioned in both the primary and the secondary regions. Data that you ingest into your data partitions are backed by Azure Storage and Azure Cosmos DB. These data stores offer high durability, availability and scalability. We use Geo Zone Redundant Storage (https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) or GZRS to automatically replicate data to a secondary region that is hundreds of miles away from the primary region. Your data will be protected by the same security features enabled in the primary region (for example, encrypted at rest using your encryption key). Similarly, Azure Cosmos DB is a globally distributed data service, which replicates the metadata (catalog) across regions. Elastic index snapshots are taken at regular intervals and geo-replicated to the secondary region. All inflight data are ephemeral in nature and will not be protected. For example, if you have any on-going ingestion jobs and the data is not persisted yet, they are subject to loss, and you will have to restart the ingestion process upon recovery.

#### Outage detection, notification, and management

Azure Data Manager for Energy Preview will continuously monitor the health of the service in the primary region. When we detect a hard region-down service failure from which we decide that we cannot recover, and conclude that the same problem does not impact the secondary region, we will initiate a service failover to the secondary region. You will be notified about the failover progress through established communication channels. Once the failover completes, you should be to connect to the Azure Data Manager for Energy Preview instance in the secondary region and continue operations. However, there could be slight degradation in performance due to any capacity constraints in the secondary region. Once the primary region is available, Microsoft will initiate failback of Azure Data Manager for Energy Preview instance and also sync back your persisted back to the primary region. 

If your business applications running on top of Azure Data Manager for Energy Preview instance are impacted due to an outage, then you are responsible for failover of your apps and recover diagnostic logs stored in the Log Analytics workspace.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)