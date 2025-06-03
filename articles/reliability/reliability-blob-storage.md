---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 01/03/2025
ms.update-cycle: 180-days
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud, designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure your data remains available and durable in the face of both planned and unplanned events.

<!-- Anastasia: We don't have this kind of summary in other guides (although maybe we should?) - I'll leave this with you to decide. If we do keep it, I'd like to make some adjustments but can do that later. -->
Azure Blob Storage supports comprehensive redundancy options including availability zone deployment with zone-redundant storage (ZRS), multi-region protection through geo-redundant configurations, and sophisticated failover capabilities. The service automatically handles transient faults and provides configurable retry policies to maintain consistent access to your data. With built-in redundancy mechanisms that store multiple copies of your data across different fault domains, Azure Blob Storage is engineered to deliver exceptional durability and availability for mission-critical workloads.

This article describes reliability support in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview), and covers both regional resiliency with availability zones and cross-region resiliency through geo-redundant storage. 

## Production deployment recommendations

<!-- Anastasia - should we link to the WAF service guide here instead of us providing our own recommendation list? https://learn.microsoft.com/en-us/azure/well-architected/service-guides/azure-blob-storage -->

For production workloads in regions that support it, we recommend that you:

- Use **Standard general-purpose v2** storage accounts.
- Use **Zone-redundant storage (ZRS)** redundancy configurations. ZRS provides automatic replication across multiple availability zones within a region.

If you have reliability requirements that can't be met with zone redundancy, consider replicating your data to another region by using geo-redundant storage or object replication.

## Reliability architecture overview

<!-- Anastasia: Question for you - should we be talking about ZRS and GRS in that much detail here?

I wonder if we should keep the LRS explanation, but then just say something like "later in this document you'll also learn how to keep these copies in different physical availablity zones and regions" but not get into the details until the AZ/multi-region section. -->

Azure Storage maintains multiple copies of your storage account to ensure that availability and durability targets are met, even in the face of failures. The way in which data is replicated provides differing levels of protection. Each option offers its own benefits, so the option you choose depends upon the degree of resiliency your applications require.

- [Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

  :::image type="content" source="media/blob-storage/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="media/blob-storage/locally-redundant-storage.png":::

- [Zone-redundant storage (ZRS)](/azure/storage/common/storage-redundancy#zone-redundant-storage) retains a copy of a storage account and replicates it in each of the separate availability zones within the same region. 

  :::image type="content" source="media/blob-storage/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/blob-storage/zone-redundant-storage.png":::

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage), unlike LRS and ZRS, provides support for unplanned failovers to a secondary region when there's an outage in the primary region. During the failover process, DNS entries for your storage account service endpoints are automatically updated to make the secondary region's endpoints the new primary endpoints. Once the unplanned failover is complete, clients can begin writing to the new primary endpoints.

  :::image type="content" source="media/blob-storage/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS or RA-GRS" lightbox="media/blob-storage/geo-redundant-storage.png":::

- [Read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS)](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region) also provide geo-redundant storage, but offer the added benefit of read access to the secondary endpoint. These options are ideal for applications designed for high availability business-critical applications. If the primary endpoint experiences an outage, applications configured for read access to the secondary region can continue to operate. Microsoft recommends RA-GZRS for maximum availability and durability of your storage accounts.

  :::image type="content" source="media/blob-storage/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS or RA-GZRS" lightbox="media/blob-storage/geo-zone-redundant-storage.png":::

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries** which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Blob Storage provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your blob data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

### Region support

Zone-redundant blob storage accounts can be deployed into any [region that supports availability zones](./regions-list.md).

### Requirements

Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. All blob types (block blobs, append blobs, and page blobs) support zone-redundant configurations, but the type of storage account you use determines which capabilities are available. For more information, see [Supported storage account types](/azure/storage/common/storage-redundancy#supported-storage-account-types).

### Cost

When you enable zone-redundant storage, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

- **Create a blob storage account with zone redundancy:** To create a new storage account with zone-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, GZRS, or RA-GZRS as the redundancy option during account creation.

- **Migration**. To convert an existing storage account to zone-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for detailed migration options and requirements.

### Normal operations

This section describes what to expect when blob storage accounts are configured for zone redundancy and all availability zones are operational.

**Traffic routing between zones**: Azure Blob Storage uses an active/active approach where client requests are automatically distributed across storage clusters in multiple availability zones. The service uses intelligent load balancing to optimize performance while maintaining data consistency. Traffic distribution is transparent to applications and requires no client-side configuration. <!-- TODO check with PG. As far as I know, ZRS is active-passive. -->

**Data replication between zones**: All write operations to zone-redundant storage are replicated synchronously across all availability zones within the region. When you upload or modify blob data, the operation isn't considered complete until the data has been successfully written to storage clusters in all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures, though it may result in slightly higher write latency compared to locally redundant storage. <!-- TODO check with PG about latency -->

### Zone-down experience

This section describes what to expect when a blob storage account is configured for zone redundancy and there's an availability zone outage:

- **Detection and response:** Microsoft automatically detects zone failures and initiates failover processes. No customer action is required for zone-redundant storage accounts.

<!-- Need to confirm with PG, but as far as I know there's no way for a customer to find out when a zone failure/failover occurs, so we omit the 'Notification' item. -->

- **Active requests:** In-flight requests mght be dropped during the failover and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss:**  No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime:** Minimal downtime (typically seconds to minutes) may occur during automatic failover as traffic is redirected to healthy zones. <!-- TODO check with PG about this. Their doc says "If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing. These updates could affect your application if you access data before the updates are complete." We should confirm if they have an estimate on how long there might be impact. -->

- **Traffic rerouting.** Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

### Failback

When the failed availability zone recovers, Azure Blob Storage automatically restores normal operations across all of the availability zones.

### Testing for zone failures

Azure Blob Storage manages replication, traffic routing, failover, and failback for zone-redundant storage. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

## Multi-region support

Azure Blob Storage provides native multi-region support through geo-redundant storage configurations that automatically replicate your data to a secondary region. The service supports both geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS), as well as read-access configurations (RA-GRS and RA-GZRS) that allow applications to read data from the secondary region even when the primary region is available.

GRS, GZRS, RA-GRS, and RA-GZRS require [Azure paired regions](./regions-paired.md) to provide protection against regional disasters.

GRS and GZRS configurations asynchronously replicate data from the primary region to a secondary region. The secondary region is automatically determined based on Azure paired regions, ensuring geographic separation for disaster recovery. Data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

RA-GRS and RA-GZRS configurations enable applications to implement active-passive architectures by allowing read access to both the primary and secondary regions. This capability lets you direct read operations to the secondary region for improved performance, load balancing, or as a seamless fallback during primary region outages, enhancing overall application resilience and availability.

Customer-managed (unplanned) failover enables you to fail over your entire geo-redundant storage account to the secondary region if the storage service endpoints for the primary region become unavailable. During failover, the original secondary region becomes the new primary region. All storage service endpoints are then redirected to the new primary region. After the storage service endpoint outage is resolved, you can perform another failover operation to fail back to the original primary region.

Azure Blob Storage supports three types of failover that are intended for different situations:

- **Customer-managed unplanned failover:** Enables you to initiate recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** Enables you to initiate recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region.

- **Microsoft-managed failover:** In exceptional situations, Microsoft might initiate failover for all GRS storage accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

### Region support

Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS), as well as customer initiated failover and failback are available in all [Azure paired regions](./regions-paired.md) that support general-purpose v2 storage accounts.

### Considerations

<!-- Anastasia - I suggest that this section is where we introduce the flavours of geo-redundancy (GRS, RA-GRS, GZRS, RA-GZRS). -->

When implementing multi-region Azure Blob Storage, consider the following important factors:

**Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated. The replication lag is expected to be less than 15 minutes, but this is an estimate and not guaranteed.

**Secondary region access**: With standard GRS and GZRS configurations, the secondary region is not accessible for reads until a failover occurs. Only RA-GRS and RA-GZRS configurations provide read access to the secondary region during normal operations.

**Feature limitations**: Some Azure Blob Storage features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain blob types, access tiers, and management operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.

### Cost

Multi-region Azure Blob Storage configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

- **Create a new storage account plan with geo-redundancy.** To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS, RA-GRS, GZRS, or RA-GZRS during account creation.

- **Migration.** To convert an existing storage account to geo-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Blob Storage uses an active/passive approach where all write operations and most read operations are directed to the primary region. For RA-GRS and RA-GZRS configurations, applications can optionally read from the secondary region by accessing the secondary endpoint, but this requires explicit application configuration and is not automatic.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS/RA-GRS, or ZRS for GZRS/RA-GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).
	
   The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region. You can monitor the replication time through the [Last Sync Time property](/azure/storage/common/last-sync-time-get).

### Region-down experience

This section describes what to expect when a storage account is configured for geo-redundancy and there's an outage in the primary region.

- **Customer-managed failover (unplanned)**: You can initiate manual failover for geo-redundant storage accounts when storage in the primary region is unavailable. However, this approach can result in data loss, and your storage account will lose its geo-replication pairing.

    - **Detection and response:** In the unlikely event that your storage account is unavailable in your primary region, you can consider initiating a customer-managed unplanned failover. To make this decision, consider the following factors:
      
      <!-- TODO Check with PG about whether there are specific signals to watch for in montoring or Resource Health -->

      - Whether Microsoft has advised you to perform failover to another region.

      It's important to be aware that an unplanned failover [can result in data loss](/azure/storage/common/storage-disaster-recovery-guidance#anticipate-data-loss-and-inconsistencies), so you need to weigh up whether the risk of data loss is justified by the restoration of service.
    
    - **Active requests:** In-flight requests fail during failover; applications must retry to new primary endpoint. <!-- TODO check this. I think that during the failover process the storage account beomes temporarily unavailable for writes. -->

    - **Expected data loss:** During an unplanned failover, it's likely that you will have some data loss. This is because of the asynchronous replication lag, which means that recent writes may not be replicated.
    
      You can check the [Last Sync time](TODO) to understand how much data could be lost during an unplanned failover. Typically the data loss is expected to be less than 15 minutes.

    - **Expected downtime:** Typically within 60 minutes depending on account size and complexity.

    - **Traffic rerouting:** Azure automatically updates storage account endpoints. Applications may need DNS cache clearing.

    For more information on initiating customer-managed failover, see [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover) and [How customer-managed (unplanned) failover works](/azure/storage/common/storage-failover-customer-managed-unplanned).

- **Customer-managed failover (planned)**: TODO

  - **Detection and response:** You're responsible for deciding to fail over. You'd typically do so if you need to fail over between regions even though your storage account is healthy. For example, a major outage of another component that you can't recover from in the primary region.

  - **Active requests:** The storage account beomes temporarily unavailable for writes.

  - **Expected data loss:** No data loss is expected because the failover process waits for all data to be synchronised.

  - **Expected downtime:** Up to 60 minutes, which includes the time that the account is locked for writes to enable synchronisation to complete.

  - **Traffic rerouting:** Azure automatically updates storage account endpoints; applications may need DNS cache clearing.

- **Microsoft-managed failover**: In rare cases of major disasters where Microsoft determines the primary region is permanently unrecoverable, Microsoft initiates automatic failover to the secondary region. This process is managed entirely by Microsoft and requires no customer action. The amount of time that elapses before failover occurs depends on the severity of the disaster and the time required to assess the situation.

  > [!IMPORTANT]
  > Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover would likely be initiated for an entire region. It can't be initiated for individual storage accounts, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend you use customer-managed failover.

### Failback

The failback process differs significantly between Microsoft-managed and customer-managed failover scenarios:

- **Customer-managed failover (unplanned)**: After an unplanned failover, the storage account is configured with locally redundant storage (LRS). In order to fail back, you need to re-establish the GRS relationship and wait for the data to be replicated.

- **Customer-managed failover (planned)**: After a planned failover, the storage account remains geo-replicated (GRS). You can initiate another failover in order to fail back to the original primary region, and the same failover considerations apply.

- **Microsoft-managed failover**: If Microsoft initiates a failover, it's likely that a significant disaster has occurred in the primary region, and the primary region might not be recoverable. Any timelines or recovery plans depends on the extent of the regional disaster and recovery efforts. You should monitor Azure Service Health communications for details.

### Testing for region failures

You can simulate regional failures to test your disaster recovery procedures:

- **Planned failover testing**: For geo-redundant storage accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Although planned failover doesn't require data loss it does involve downtime during both failover and failback.

- **Secondary endpoint testing**: For RA-GRS and RA-GZRS configurations, regularly test read operations against the secondary endpoint to ensure your application can successfully read data from the secondary region.

### Alternative multi-region approaches

If your application requires geo-replication across nonpaired regions, or you need more control over multi-region deployment than the native geo-redundant options provide, consider implementing a custom multi-region architecture.

Azure Blob Storage can be deployed in multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency. When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

**Object replication** provides an additional option for cross-region data replication that enables asynchronous copying of block blobs between storage accounts. Unlike the built-in geo-redundant storage options that use fixed paired regions, object replication allows you to replicate data between storage accounts in any Azure regions, including non-paired regions. This approach gives you full control over source and destination regions, replication policies, and the specific containers and blob prefixes to replicate.

Object replication can be configured to replicate all blobs within a container, or specific subsets based on blob prefixes and tags. The replication is asynchronous and happens in the background. You can configure multiple replication policies and even chain replication across multiple storage accounts to create sophisticated multi-region topologies.

Object replication isn't compatible with all storage accounts. For example, object replication doesn't work with storage accounts that use hierarchical namespaces (also called Azure Data Lake Gen2 accounts).

For detailed implementation guidance, see [Object replication for block blobs](/azure/storage/blobs/object-replication-overview) and [Configure object replication](/azure/storage/blobs/object-replication-configure).

## Backups

Azure Blob Storage provides multiple data protection mechanisms that complement redundancy for comprehensive backup strategies. While the service's built-in redundancy protects against infrastructure failures, additional backup capabilities protect against accidental deletion, corruption, and malicious activities.

**Point-in-time restore** allows you to restore block blob data to a previous state within a configured retention period (up to 365 days). This feature is fully managed by Microsoft and provides granular recovery capabilities at the container or blob level. Point-in-time restore data is stored in the same region as the source account and is accessible even during regional outages if using geo-redundant configurations.

**Blob versioning** automatically maintains previous versions of blobs when they are modified or deleted. Each version is stored as a separate object and can be accessed independently. Versions are stored in the same region as the current blob and follow the same redundancy configuration as the storage account.

**Soft delete** provides a safety net for accidentally deleted blobs and containers by retaining deleted data for a configurable period. Soft-deleted data remains in the same storage account and region, making it immediately available for recovery. For geo-redundant accounts, soft-deleted data is also replicated to the secondary region.

**Blob snapshots** create read-only point-in-time copies of blobs that can be used for backup and recovery scenarios. Snapshots are stored in the same storage account and follow the same redundancy and geo-replication settings as the base blob.

For cross-region backup requirements, consider using **Azure Backup for Blobs**, which provides centralized backup management and can store backup data in different regions from the source data. This service provides operational and vaulted backup options with configurable retention policies and restore capabilities. For more information, see [Azure Backup for Blobs overview](/azure/backup/blob-backup-overview).

When implementing backup strategies for Azure Blob Storage, consider the following best practices:

## Reliability during service maintenance

Azure Blob Storage is designed to maintain high availability during planned maintenance activities. Microsoft performs regular maintenance on the underlying storage infrastructure, including hardware updates, software patches, and capacity management operations.

During planned maintenance, Azure Blob Storage leverages its redundant architecture to maintain service availability. For zone-redundant storage configurations, maintenance is performed on one availability zone at a time, ensuring that your data remains accessible through the other zones. For geo-redundant configurations, maintenance in the primary region doesn't affect read access to the secondary region for RA-GRS and RA-GZRS accounts.

Most maintenance operations are transparent to applications and don't require any action from customers. However, you may experience slight increases in latency during maintenance windows as traffic is redistributed across available infrastructure. Applications with built-in retry logic and appropriate timeout configurations will handle these temporary variations automatically.

Microsoft provides advance notification of planned maintenance that may impact service availability through Azure Service Health notifications. For critical workloads, consider implementing monitoring and alerting to track storage account performance during maintenance windows and ensure your applications are performing as expected.

## Service-level agreement

The service-level agreement (SLA) for Azure Blob Storage describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. The availability SLA you'll be eligible for depends on the storage tier and the replication type you use. For more information, see [SLA for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/).

### Related content

- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure Blob Storage overview](/azure/storage/blobs/storage-blobs-overview)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Disaster recovery and storage account failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Use geo-redundancy to design highly available applications](/azure/storage/common/geo-redundant-design)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
- [Monitor Azure Blob Storage](/azure/storage/blobs/monitor-blob-storage)
- [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy)
- [Transient fault guidance](/azure/well-architected/reliability/handle-transient-faults)
- [Manage blob lifecycle](/azure/storage/blobs/lifecycle-management-overview)
- [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions)
