---
title: Reliability in Azure Files
description: Learn about reliability in Azure Files, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-file-storage
ms.date: 07/23/2025
---

# Reliability in Azure Files

Azure Files provides fully managed file shares in the cloud that are accessible via industry-standard Server Message Block (SMB) and Network File System (NFS) protocols. As a comprehensive cloud storage solution, Azure Files is designed to deliver enterprise-grade reliability and high availability for both on-premises integration and cloud-native workloads. 

Azure Files supports multiple redundancy configurations including locally redundant storage (LRS) for protection within a single datacenter, zone-redundant storage (ZRS) for availability zone deployments, geo-redundant storage (GRS) for cross-region protection, and geo-zone-redundant storage (GZRS) for the highest level of durability. 

This article describes reliability and availability zones support in [Azure Files](/azure/well-architected/service-guides/azure-files), covering both regional resiliency through availability zone configurations and cross-region protection through geo-redundant storage options. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

> [!NOTE]
> Azure Files is part of the Azure Storage platform. Some of the capabilities of Azure Files are common across many Azure Storage services. In this document, we use "Azure Storage" to indicate these common capabilities.

## Production deployment recommendations

To learn about how to deploy Azure Files to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Files](/azure/well-architected/service-guides/azure-files) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Files is available in two media tiers: 

- **Premium tier** uses solid state disks (SSD) for high performance.
- **Standard tier** uses hard disk drives (HDD) for cost efficiency. 

To learn more about Azure Files tiers, see [Plan to deploy Azure Files](/azure/storage/files/storage-files-planning#storage-tiers).

Azure Files implements redundancy at the storage account level, with file shares inheriting the redundancy configuration. The service supports multiple redundancy models that differ in their approach to data protection.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Files, configure appropriate timeout values for your file operations based on file size and network conditions. Larger files require longer timeouts, while smaller operations can use shorter values to detect failures quickly. <!-- PG: Please verify this is valid advice. -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Files provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your file data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

ZRS is supported in HDD (standard) file shares in [all regions with availability zones](./regions-list.md).

ZRS is supported for SSD (premium) file shares through the `FileStorage` storage account kind. For a list of regions that support ZRS for SSD file share accounts, see [ZRS support for SSD file shares](/azure/storage/files/redundancy-premium-file-shares#zrs-support-for-ssd-azure-file-shares).

### Requirements

ZRS is supported by all file share types.

### Cost

[!INCLUDE [Storage - Availability zone cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure availability zone support

- **Create a file share with zone redundancy:** To create a new file share with ZRS, see [Create an Azure file share](/azure/storage/files/storage-how-to-create-file-share) and select ZRS or GZRS as the redundancy option during account creation.

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Normal operations

This section describes what to expect when a file storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Zone-down experience

This section describes what to expect when a file storage account is configured for zone redundancy and there's an availability zone outage.

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting.** Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required. No remounting of Azure file shares from the connected clients is required.

### Failback

[!INCLUDE [Storage - Zone failback](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Multi-region support

[!INCLUDE [Storage - Multi-region support introduction](includes/storage/reliability-storage-multi-region-support-include.md)]

> [!IMPORTANT]
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured and billed as GRS or GZRS.

[!INCLUDE [Storage - Multi-region support introduction failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

### Region support

[!INCLUDE [Storage - Multi-region support region support](includes/storage/reliability-storage-multi-region-region-support-include.md)]

### Requirements

Azure Files only supports geo-redundancy (GRS or GZRS) for standard (HDD) file shares. Premium (SSD) file shares must use LRS or ZRS. If you have premium file shares and you want to replicate the data across regions for higher resiliency, see [Alternative multi-region approaches](#alternative-multi-region-approaches).

### Considerations

When implementing multi-region Azure Files, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

- **Secondary region access**: The secondary region is not accessible for reads until a failover occurs.

- **Feature limitations**: Some Azure Files features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain file share types, access tiers, and management tools and operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.

### Cost

[!INCLUDE [Storage - Multi Region cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure multi-region support

- **Create a new storage account with geo-redundancy.** To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS or GZRS during account creation.

[!INCLUDE [Storage - Multi Region Configure multi-region support - enable-disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Files uses an active/passive approach where all read and write operations are directed to the primary region.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS, or ZRS for GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).

  [!INCLUDE [Storage - Multi Region Normal operations - lag](includes/storage/reliability-storage-multi-region-normal-operations-lag-include.md)]

### Region-down experience

[!INCLUDE [Storage - Multi Region Down experience](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

### Failback

[!INCLUDE [Storage - Multi Region Failback](includes/storage/reliability-storage-multi-region-failback-include.md)]

### Testing for region failures

For geo-redundant storage accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Although planned failover doesn't require data loss it does involve downtime during both failover and failback.

### Alternative multi-region approaches

[!INCLUDE [Storage - Alternative multi-region approaches - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

- You use file share types that don't support geo-redundancy.

You can, however, design a custom cross-region failover solution that's tailored to your needs.

[!INCLUDE [Storage - Alternative multi-region approaches - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

Below are some common high-level approaches to consider:

- **Multiple storage accounts:** Azure Files can be deployed across multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency. When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

- **Azure File Sync**: Deploy [Azure File Sync](/azure/storage/file-sync/file-sync-introduction) with sync servers in multiple regions connected to regional file shares. This provides multi-region access with local performance while maintaining central management. For an example approach, see [Sync between two Azure file shares for Backup and Disaster Recovery](https://github.com/Azure-Samples/azure-files-samples/tree/master/SyncBetweenTwoAzureFileSharesForDR).

- **Application-level replication**: Implement custom replication logic using [Azure Data Factory](/azure/data-factory/introduction) or [AzCopy](/azure/storage/common/storage-use-azcopy-v10) to synchronize data between file shares in different regions. This approach requires custom development and conflict resolution mechanisms.

## Backups

[Azure Files backup](/azure/backup/azure-file-share-backup-overview) is an integration between Azure Files and Azure Backup. Azure Files backup provides point-in-time recovery features and offers capabilities that complement Azure Files redundancy features to protect your files against accidental deletion, corruption, or ransomware attacks.

Azure Files backup creates share-level snapshots stored within the same storage account. This allows for the rapid recovery of both individual file and entire files shares. You can also use *backup policies* to provide long retention periods with customizable backup frequency.

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [What is Azure Files?](/azure/storage/files/storage-files-introduction)
- [Azure Files redundancy](/azure/storage/files/files-redundancy)
- [Planning for an Azure Files deployment](/azure/storage/files/storage-files-planning)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
- [Azure reliability](/azure/reliability/overview)
- [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions)
