---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 06/25/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud, designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure your data remains available and durable in the face of both planned and unplanned events.

Azure Blob Storage supports built-in redundancy mechanisms that store multiple copies of your data across different fault domains. It provides comprehensive redundancy options including availability zone deployment with zone-redundant storage (ZRS), multi-region protection through geo-redundant configurations, and sophisticated failover capabilities.

This article describes reliability support in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview), and covers both regional resiliency with availability zones and cross-region resiliency through geo-redundant storage. 

## Production deployment recommendations

To learn about how to deploy Azure Blob Storage to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Blob Storage](/azure/well-architected/service-guides/azure-blob-storage) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Storage offers several redundancy options to help you protect your data against different types of failures. Each option provides a specific level of data redundancy, so you can choose the one that best matches your application's requirements.

By default, Azure Storage uses [Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy#locally-redundant-storage). LRS keeps three copies of your data within a single datacenter, protecting against hardware failures such as drive or server rack issues.

However, LRS is the lowest-cost redundancy option. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

:::image type="content" source="media/blob-storage/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated within a single datacenter with LRS" border="false":::

For higher levels of protection, consider [zone-redundant storage](#availability-zone-support) or [geo-redundant storage](#multi-region-support), which replicate your data across multiple zones or regions.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries**, which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Blob Storage provides robust availability zone support through zone-redundant storage (ZRS) configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for ZRS, Azure synchronously replicates your blob data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

:::image type="content" source="media/blob-storage/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/blob-storage/zone-redundant-storage.png" border="false":::

### Region support

Zone-redundant blob storage accounts can be deployed into any [region that supports availability zones](./regions-list.md).

### Requirements

Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. All blob types (block blobs, append blobs, and page blobs) support zone-redundant configurations, but the type of storage account you use determines which capabilities are available. For more information, see [Supported storage account types](/azure/storage/common/storage-redundancy#supported-storage-account-types).

### Cost

When you enable ZRS, you're charged at a different rate than LRS due to the additional replication and storage overhead. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

- **Create a blob storage account with zone redundancy:** To create a new storage account with zone-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage(GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation.

- **Migration**. To convert an existing storage account to ZRS and learn about migration options and requirements, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration).

- **Disable zone redundancy.** Convert ZRS accounts back to a nonzonal configuration (LRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a blob storage account is configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones**: Azure Blob Storage with ZRS automatically distributes requests across storage clusters in multiple availability zones. Traffic distribution is transparent to applications and requires no client-side configuration.

- **Data replication between zones**: All write operations to ZRS are replicated synchronously across all availability zones within the region. When you upload or modify blob data, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage. <!-- TODO Imani confirming whether we can quantify or provide any more details around the latency impact for ZRS -->

### Zone-down experience

This section describes what to expect when a blob storage account is configured for ZRS and there's an availability zone outage.

- **Detection and response:** Microsoft automatically detects zone failures and initiates failover processes. No customer action is required for zone-redundant storage accounts.

- **Active requests:** In-flight requests might be dropped during the failover and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss:**  No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime:** A small amount of downtime - typically, a few seconds - may occur during automatic failover as traffic is redirected to healthy zones. <!-- TODO Imani confirming -->

- **Traffic rerouting.** Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

### Failback

When the failed availability zone recovers, Azure Blob Storage automatically restores normal operations across all of the availability zones.

### Testing for zone failures

Azure Blob Storage manages replication, traffic routing, failover, and failback for zone-redundant storage. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

## Multi-region support

Azure Blob Storage provides a range of geo-redundancy and failover capabilities to suit different requirements.

> [!IMPORTANT]
> Geo-redundant storage only works within [Azure paired regions](./regions-paired.md). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Replication across paired regions

Blob Storage provides several types of geo-redundant storage in paired regions. Whichever type of geo-redundant storage you use, data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region.

   :::image type="content" source="media/blob-storage/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS." lightbox="media/blob-storage/geo-redundant-storage.png" border="false":::

- [Geo-zone redundant storage (GZRS)](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availabilty zones in the primary region, and also into the paired region.

  :::image type="content" source="media/blob-storage/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS." lightbox="media/blob-storage/geo-redundant-storage.png" border="false":::

- [Read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS)](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region) extends GRS and GZRS, with the added benefit of read access to the secondary endpoint. These options are ideal for applications designed for high availability business-critical applications. In the unlikely event that the primary endpoint experiences an outage, applications configured for read access to the secondary region can continue to operate.

#### Failover types

Azure Blob Storage supports three types of failover that are intended for different situations:

- **Customer-managed unplanned failover:** You are responsible for initiating recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** You are responsible for initiating recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region.

- **Microsoft-managed failover:** In exceptional situations, Microsoft might initiate failover for all GRS storage accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

Geo-redundant storage accounts can use any of these failover types. You don't need to preconfigure a storage account to use any of the failover types ahead of time.

### Region support

Geo-redundant storage, as well as customer initiated failover and failback are available in all [Azure paired regions](./regions-paired.md) that support general-purpose v2 storage accounts.

### Considerations

When implementing multi-region Azure Blob Storage, consider the following important factors:

- **Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated. The replication lag is expected to be less than 15 minutes, but this is an estimate and not guaranteed.

- **Secondary region access**: With GRS and GZRS configurations, the secondary region is not accessible for reads until a failover occurs. RA-GRS and RA-GZRS configurations provide read access to the secondary region during normal operations.

- **Feature limitations**: Some Azure Blob Storage features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain blob types, access tiers, and management operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.

### Cost

Multi-region Azure Blob Storage configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

- **Create a new storage account with geo-redundancy.** To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS, RA-GRS, GZRS, or RA-GZRS during account creation.

- **Migration.** To convert an existing storage account to geo-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

  > [!WARNING]
  > After your account is reconfigured for geo-redundancy, it may take a significant amount of time before existing data in the new primary region is fully copied to the new secondary.
  >
  > **To avoid a major data loss**, check the value of the [Last Sync Time property](/azure/storage/common/last-sync-time-get) before initiating an unplanned failover. To evaluate potential data loss, compare the last sync time to the last time at which data was written to the new primary.

- **Disable geo-redundancy.** Convert geo-redundant storage accounts back to single-region configurations (LRS or ZRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Blob Storage uses an active/passive approach where all write operations and most read operations are directed to the primary region.

  For RA-GRS and RA-GZRS configurations, applications can optionally read from the secondary region by accessing the secondary endpoint, but this requires explicit application configuration and is not automatic.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS/RA-GRS, or ZRS for GZRS/RA-GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).
	
   The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region. You can monitor the replication time through the [Last Sync Time property](/azure/storage/common/last-sync-time-get).

### Region-down experience

This section describes what to expect when a storage account is configured for geo-redundancy and there's an outage in the primary region.

- **Customer-managed failover (unplanned)**: An unplanned failover is intended to be used when storage in the primary region is unavailable.

    - **Detection and response:** In the unlikely event that your storage account is unavailable in your primary region, you can consider initiating a customer-managed unplanned failover. To make this decision, consider the following factors:
      
      - Whether [Azure Resource Health](/azure/service-health/resource-health-overview) show problems accessing the storage account in your primary region.
      - Whether Microsoft has advised you to perform failover to another region.

      > [!WARNING]
      > An unplanned failover [can result in data loss](/azure/storage/common/storage-disaster-recovery-guidance#anticipate-data-loss-and-inconsistencies). Before initiating a customer-managed failover, decide whether the risk of data loss is justified by the restoration of service.
    
    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** During an unplanned failover, it's likely that you will have some data loss. This is because of the asynchronous replication lag, which means that recent writes may not be replicated. You can check the [Last Sync time](/azure/storage/common/last-sync-time-get) to understand how much data could be lost during an unplanned failover. Typically the data loss is expected to be less than 15 minutes, but that's not guaranteed.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps DNS entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary. 

    - **Post-failover configuration:** After an unplanned failover completes, your storage account in the destination region uses the LRS tier. If you need to geo-replicate it again, you need to re-enable GRS and wait for the data to be replicated to the new secondary region.

    For more information on initiating customer-managed failover, see [How customer-managed (unplanned) failover works](/azure/storage/common/storage-failover-customer-managed-unplanned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Customer-managed failover (planned)**: A planned failover is intended to be used when storage remains operational in the primary region, but you need to fail over your whole solution to a secondary region for another reason.

    - **Detection and response:** You're responsible for deciding to fail over. You'd typically do so if you need to fail over between regions even though your storage account is healthy. For example, a major outage of another component that you can't recover from in the primary region.

    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** No data loss is expected because the failover process waits for all data to be synchronized.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity. During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps DNS entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary. 

    - **Post-failover configuration:** After a planned failover completes, your storage account in the destination region continues to be geo-replicated and remains on the GRS tier.

    For more information on initiating customer-managed failover, see [How customer-managed (planned) failover works](/azure/storage/common/storage-failover-customer-managed-planned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Microsoft-managed failover**: In the rare case of a major disaster, where Microsoft determines the primary region is permanently unrecoverable, Microsoft might initiate automatic failover to the secondary region. This process is managed entirely by Microsoft and requires no customer action. The amount of time that elapses before failover occurs depends on the severity of the disaster and the time required to assess the situation.

  > [!IMPORTANT]
  > Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover would likely be initiated for an entire region. It can't be initiated for individual storage accounts, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend you use customer-managed failover.

### Failback

The failback process differs significantly between Microsoft-managed and customer-managed failover scenarios:

- **Customer-managed failover (unplanned)**: After an unplanned failover, the storage account is configured with locally redundant storage (LRS). In order to fail back, you need to re-establish the GRS relationship and wait for the data to be replicated.

- **Customer-managed failover (planned)**: After a planned failover, the storage account remains geo-replicated (GRS). You can initiate another customer-managed failover in order to fail back to the original primary region. [The same failover considerations apply](#region-down-experience).

- **Microsoft-managed failover**: If Microsoft initiates a failover, it's likely that a significant disaster has occurred in the primary region, and the primary region might not be recoverable. Any timelines or recovery plans depends on the extent of the regional disaster and recovery efforts. You should monitor Azure Service Health communications for details.

### Testing for region failures

You can simulate regional failures to test your disaster recovery procedures:

- **Planned failover testing**: For geo-redundant storage accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Although planned failover doesn't require data loss it does involve downtime during both failover and failback.

- **Secondary endpoint testing**: For RA-GRS and RA-GZRS configurations, regularly test read operations against the secondary endpoint to ensure your application can successfully read data from the secondary region.

### Alternative multi-region approaches

It may be the case that the cross-region failover capabilities of Azure Blob Storage are unsuitable for the following reasons:

- Your storage account is in a nonpaired region.

- Your business uptime goals aren't satisfied by the recovery time or data loss that the built-in failover options provide.

- You need to fail over to a region that isn't your primary region's pair.

- You need an active/active configuration across regions.

Instead, you can design a cross-region failover solution that's tailored to your needs. A complete treatment of deployment topologies for Azure Blob Storage is outside the scope of this article, but you can consider a multi-region deployment model.

Azure Blob Storage can be deployed across multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency. When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

**Object replication** provides an additional option for cross-region data replication that provides asynchronous copying of block blobs between storage accounts. Unlike the built-in geo-redundant storage options that use fixed paired regions, object replication allows you to replicate data between storage accounts in any Azure region, including non-paired regions. This approach gives you full control over source and destination regions, replication policies, and the specific containers and blob prefixes to replicate.

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

## Service-level agreement

The service-level agreement (SLA) for Azure Blob Storage describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. The availability SLA you'll be eligible for depends on the storage tier and the replication type you use. For more information, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

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
