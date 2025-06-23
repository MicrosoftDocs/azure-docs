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

:::image type="content" source="media/reliability-storage-files/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="media/reliability-storage-files/locally-redundant-storage.png":::

Zone-redundant storage and geo-redundant storage provide additional protections, and are described in detail below.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Files, implement the following recommendations:

- **Use the Azure Storage client libraries** which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your file operations based on file size and network conditions. Larger files require longer timeouts, while smaller operations can use shorter values to detect failures quickly. <!-- TODO verify -->

<!-- TODO check about SMB vs. NFS -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Files provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your blob data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

:::image type="content" source="media/reliability-storage-files/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/reliability-storage-files/zone-redundant-storage.png":::

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
<!-- TODO here down -->

Azure Files provides native multi-region support through geo-redundant storage configurations. Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) automatically replicate your data to a paired secondary region, providing protection against regional outages.

Geo-redundant storage options (GRS and GZRS) are only supported for standard HDD file shares. Premium SSD file shares do not support geo-redundant configurations and are limited to locally redundant or zone-redundant storage within a single region. For information on to configure multi-region support with Premium SSD file shares, see [Alternative Multi-region approaches](#alternative-multi-region-approaches).

- [GRS](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region.

   :::image type="content" source="media/blob-storage/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS." lightbox="media/blob-storage/geo-redundant-storage.png" border="false":::

- [GZRS](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availabilty zones in the primary region, and also into the paired region.

  :::image type="content" source="media/blob-storage/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS." lightbox="media/blob-storage/geo-redundant-storage.png" border="false":::

>[NOTE]
>The secondary region is automatically determined by Azure based on the primary region selection using established Azure paired regions. Data in the secondary region is only accessible during a Microsoft-managed failover or through customer-managed failover capabilities.

### Region support

Azure Files geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on the primary region selection and cannot be customized. For a complete list of Azure paired regions, see [Azure paired regions](./regions-list.md).

Geo-redundant storage is available in regions that support paired regions. Not all regions have established pairs, so verify region pairing before deploying geo-redundant configurations.

### Requirements

You must use Standard general-purpose v2 storage accounts with standard HDD file shares to enable geo-redundant storage. Premium FileStorage accounts and premium SSD file shares do not support geo-redundant configurations.

### Considerations

During normal operations, geo-redundant storage provides the same performance as locally redundant or zone-redundant storage since all operations target the primary region. The secondary region data is only accessible during failover scenarios.

Data in the secondary region is replicated asynchronously, which means recent writes may not be available in the secondary region during failover. The Recovery Point Objective (RPO) is typically less than 15 minutes but is not guaranteed.

### Cost

Geo-redundant storage (GRS and GZRS) is priced higher than single-region options due to cross-region replication and additional storage in the secondary region. For current pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure multi-region support

- **Create**. When creating a new storage account, select Geo-redundant storage (GRS) or Geo-zone-redundant storage (GZRS) as the redundancy option for standard file shares. For detailed steps, see [Create a storage account](/azure/storage/common/storage-account-create).
- **Migrate**. Convert existing storage accounts to geo-redundant configurations using the redundancy configuration change feature. Review supported conversion types at [Change how a storage account is replicated](/azure/storage/common/redundancy-migration).
- **Disable**. Convert geo-redundant storage accounts back to single-region configurations (LRS or ZRS) through the same redundancy configuration change process.

### Normal operations

TODO

- **Traffic routing between regions**. During normal operations, all client traffic is directed to the primary region. The secondary region is passive and not accessible for read or write operations in standard GRS/GZRS configurations.

- **Data replication between regions**. Azure Files replicates data asynchronously from the primary region to the secondary region. Data is first committed in the primary region (synchronously across zones for GZRS or locally for GRS), then replicated to the secondary region with potential delays of up to 15 minutes.

### Region-down experience

TODO

- **Detection and response**: Microsoft automatically detects regional service health and can initiate Microsoft-managed failover during significant regional outages. Customers can also initiate customer-managed failover through Azure management tools when needed.

- **Notification**: Regional outages are communicated through Azure Service Health and Azure Resource Health.

- **Active requests**: During regional failover, active requests to the primary region will fail until failover completes and traffic is redirected to the secondary region. Applications should implement retry logic to handle temporary failures during failover.

- **Expected data loss**: Some data loss may occur during regional failover due to asynchronous replication. Recent writes that have not yet replicated to the secondary region may be lost, with RPO typically less than 15 minutes.

- **Expected downtime**: Customer-managed failover typically completes within one hour, though timing depends on data size and service conditions. Microsoft-managed failover timing varies based on the scope and severity of the regional outage.

- **Traffic rerouting**: After failover, the secondary region becomes the new primary region. File share endpoints remain the same, but DNS resolution redirects to the new primary region location.

### Multi-region failback

TODO

- **Customer-managed failover failback**: After the original region recovers, you must manually initiate failback through the Azure portal, Azure CLI, or Azure PowerShell. The failback process converts the storage account from geo-redundant to locally redundant, requiring you to reconfigure redundancy settings.

- **Microsoft-managed failover failback**: Microsoft does not automatically fail back after Microsoft-managed failover. You must evaluate service recovery and manually initiate failback when appropriate for your workload.

### Testing for region failures

You can test regional failover by initiating customer-managed failover through Azure management tools. This process validates your disaster recovery procedures and application resilience to regional outages. Plan testing during maintenance windows since failover affects service availability.

### Alternative multi-region approaches

For applications requiring active-active multi-region access or when geo-redundant storage limitations prevent its use (such as with premium SSD file shares), consider these approaches:

**Azure File Sync**: Deploy Azure File Sync with sync servers in multiple regions connected to regional file shares. This provides multi-region access with local performance while maintaining central management.

**Application-level replication**: Implement custom replication logic using Azure Data Factory, AzCopy, or Azure Functions to synchronize data between file shares in different regions. This approach requires custom development and conflict resolution mechanisms.

**Regional deployment patterns**: Deploy separate Azure Files instances in multiple regions with application-level traffic management using Azure Traffic Manager or Azure Front Door for routing and failover.

## Backups

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
