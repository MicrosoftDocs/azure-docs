---
title: Reliability in Azure Files
description: Learn about reliability in Azure Files, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-file-storage
ms.date: 06/05/2025
---

# Reliability in Azure Files

Azure Files provides fully managed file shares in the cloud that are accessible via Server Message Block (SMB) and Network File System (NFS) protocols. Azure Files supports multiple redundancy options including locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and geo-zone-redundant storage (GZRS). The service offers availability zone support through zone-redundant storage configurations and provides built-in transient fault handling through Azure Storage client libraries with configurable retry policies.

This article describes reliability and availability zones support in [Azure Files](/azure/storage/files/storage-files-introduction). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

To learn about how to deploy Azure Files to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see Architecture best practices for [Azure Files](/azure/well-architected/service-guides/azure-files) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Files implements redundancy at the storage account level, with file shares inheriting the redundancy configuration. The service supports multiple redundancy models that differ in their approach to data protection:

[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?branch=main#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

:::image type="content" source="media/reliability-storage-files/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="media/reliability-storage-files/locally-redundant-storage.png" border="false":::

Zone-redundant storage and geo-redundant storage provide additional protections, and are described in detail below.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Files, implement the following recommendations:

- **Use the Azure Storage client libraries** which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your file operations based on file size and network conditions. Larger files require longer timeouts, while smaller operations can use shorter values to detect failures quickly. <!-- PG: Please verify this is valid advice. -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Files provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your blob data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

:::image type="content" source="media/reliability-storage-files/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/reliability-storage-files/zone-redundant-storage.png" border="false":::

### Region support

<!-- TODO check this. Looks like SSD file shares are supported in a subset of regions: https://learn.microsoft.com/en-us/azure/storage/files/redundancy-premium-file-shares#zrs-support-for-ssd-azure-file-shares -->

Zone-redundant Azure Files can be deployed in any region that supports availability zones, with the following exceptions:
- Australia East
- Brazil South  
- Canada Central
- Central India
- Korea Central

For the complete list of regions that support availability zones, see [Azure regions with availability zones](./regions-list.md).

### Requirements

<!-- TODO check this -->

Zone redundancy is available for the following storage account types:

- Standard general-purpose v2 storage accounts with Standard_ZRS SKU
- Premium FileStorage accounts with Premium_ZRS SKU
- Standard HDD file shares and premium SSD file shares.

### Cost

When you enable zone-redundant storage, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure availability zone support

- **Create a storage account with zone redundancy:** To create a new file share with zone-redundant storage, see [Create an Azure file share](/azure/storage/files/storage-how-to-create-file-share) and select ZRS, GZRS, or RA-GZRS as the redundancy option during account creation.

- **Migration**. To convert an existing storage account to zone-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for detailed migration options and requirements.

### Normal operations

This section describes what to expect when a file storage account is configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones**. Azure Files with zone-redundant storage (ZRS) automatically distributes requests across storage clusters in multiple availability zones. Traffic distribution is transparent to applications and requires no client-side configuration.

- **Data replication between zones**. All write operations to zone-redundant storage are replicated synchronously across all availability zones within the region. When you create or modify files, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage.

### Zone-down experience

This section describes what to expect when a file storage account is configured for zone redundancy and there's an availability zone outage.

- **Detection and response**: Microsoft automatically detects zone failures and initiates failover processes. No customer action is required for zone-redundant storage accounts.

- **Active requests**: In-flight requests might be dropped during the failover and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss**: No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime**: A small amount of downtime (typically a few seconds ) may occur during automatic failover as traffic is redirected to healthy zones.

- **Traffic rerouting**: Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

### Failback

When the failed availability zone recovers, Azure Files automatically restores normal operations across all of the availability zones.

### Testing for zone failures

Azure Files manages replication, traffic routing, failover, and failback for zone-redundant storage. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

## Multi-region support

Azure Files provides a range of geo-redundancy and failover capabilities to suit different requirements.

> [!IMPORTANT]
> Geo-redundant storage works within [Azure paired regions](./regions-paired.md). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Replication across paired regions

Azure Files provides two types of geo-redundant storage in paired regions:

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region. Data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

   :::image type="content" source="media/reliability-storage-files/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS." lightbox="media/reliability-storage-files/geo-redundant-storage.png" border="false":::

- [Geo-zone redundant storage (GZRS)](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availabilty zones in the primary region, and also into the paired region.

  :::image type="content" source="media/reliability-storage-files/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS." lightbox="media/reliability-storage-files/geo-redundant-storage.png" border="false":::

> [!IMPORTANT]
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured and billed as GRS or GZRS.

#### Failover types

Azure Files supports three types of failover that are intended for different situations:

- **Customer-managed unplanned failover:** Enables you to initiate recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** Enables you to initiate recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region.

- **Microsoft-managed failover:** In exceptional situations, Microsoft might initiate failover for all GRS storage accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

### Region support

Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS), as well as customer initiated failover and failback are available in all [Azure paired regions](./regions-paired.md) that support general-purpose v2 storage accounts.

### Requirements

You must use Standard general-purpose v2 storage accounts with standard HDD file shares to enable geo-redundant storage. Premium FileStorage accounts and premium SSD file shares do not support geo-redundant configurations. <!-- TODO check -->

Geo-redundant storage options (GRS and GZRS) are only supported for standard HDD file shares. Premium SSD file shares do not support geo-redundant configurations and are limited to locally redundant or zone-redundant storage within a single region. For information on to configure multi-region support with Premium SSD file shares, see [Alternative Multi-region approaches](#alternative-multi-region-approaches). <!-- TODO check this -->

### Considerations

When implementing multi-region Azure Files, consider the following important factors:

- **Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated. The replication lag is expected to be less than 15 minutes, but this is an estimate and not guaranteed.

- **Secondary region access**: The secondary region is not accessible for reads until a failover occurs.

- **Feature limitations**: Some Azure Blob Storage features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain blob types, access tiers, and management operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy. <!-- TODO check what this applies to files -->

### Cost

Multi-region Azure Files configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

- **Create a new storage account plan with geo-redundancy.** To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS, RA-GRS, GZRS, or RA-GZRS during account creation.

- **Migration.** To convert an existing storage account to geo-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

  > [!WARNING]
  > After your account is reconfigured for geo-redundancy, it may take a significant amount of time before existing data in the new primary region is fully copied to the new secondary.
  >
  > **To avoid a major data loss**, check the value of the [Last Sync Time property](/azure/storage/common/last-sync-time-get) before initiating an unplanned failover. To evaluate potential data loss, compare the last sync time to the last time at which data was written to the new primary. <!-- TODO check this applies to files -->

- **Disable geo-redundancy.** Convert geo-redundant storage accounts back to single-region configurations (LRS or ZRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Files uses an active/passive approach where all write operations and most read operations are directed to the primary region.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS, or ZRS for GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).
	
   The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region. You can monitor the replication time through the [Last Sync Time property](/azure/storage/common/last-sync-time-get).

### Region-down experience

<!-- TODO copy from blob storage guide -->

### Multi-region failback

<!-- TODO copy from blob storage guide -->

### Testing for region failures

<!-- TODO copy from blob storage guide -->

### Alternative multi-region approaches

If your application requires geo-replication across nonpaired regions, or you need more control over multi-region deployment than the native geo-redundant options provide, consider implementing a custom multi-region architecture. <!-- TODO active/active, or when geo-redundant storage limitations prevent its use (such as with premium SSD file shares) -->

Azure Files can be deployed across multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency. When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

TODO

**Azure File Sync**: Deploy Azure File Sync with sync servers in multiple regions connected to regional file shares. This provides multi-region access with local performance while maintaining central management.

**Application-level replication**: Implement custom replication logic using Azure Data Factory, AzCopy, or Azure Functions to synchronize data between file shares in different regions. This approach requires custom development and conflict resolution mechanisms.

## Backups

<!-- TODO check this -->

Azure Files integrates with Azure Backup to provide point-in-time recovery capabilities that complement redundancy features for protection against accidental deletion, corruption, or ransomware attacks.

Azure Backup for Azure Files creates share-level snapshots stored within the same storage account, providing rapid recovery for individual files or entire shares. Backup policies support retention periods up to 10 years with customizable backup frequency.

For comprehensive protection, combine Azure Backup with geo-redundant storage to protect against both accidental data loss and regional outages. For more information, see [About Azure file share backup](/azure/backup/azure-file-share-backup-overview).

## Service-level agreement

The service-level agreement (SLA) for Azure Files describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. The availability SLA you'll be eligible for depends on the storage tier and the replication type you use. For more information, review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [What is Azure Files?](/azure/storage/files/storage-files-introduction)
- [Azure Files redundancy](/azure/storage/files/files-redundancy)
- [Planning for an Azure Files deployment](/azure/storage/files/storage-files-planning)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
- [Azure reliability](/azure/reliability/overview)
- [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions)
