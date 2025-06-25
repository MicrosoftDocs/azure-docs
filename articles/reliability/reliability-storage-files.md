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

Azure Files is available in two tiers: the premium tier uses solid state disks (SSD) for high performance, and the standard tier supports hard disk drives (HDD) for cost efficiency. To learn more about Azure Files tiers, see [Plan to deploy Azure Files](/azure/storage/files/storage-files-planning#storage-tiers).

Azure Files implements redundancy at the storage account level, with file shares inheriting the redundancy configuration. The service supports multiple redundancy models that differ in their approach to data protection.

<!-- The rest of this section is copied from the Blob guide -->
[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?branch=main#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

:::image type="content" source="media/reliability-storage-files/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="media/reliability-storage-files/locally-redundant-storage.png" border="false":::

Zone-redundant storage and geo-redundant storage provide additional protections, and are described in detail below.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when using Azure Files, configure appropriate timeout values for your file operations based on file size and network conditions. Larger files require longer timeouts, while smaller operations can use shorter values to detect failures quickly. <!-- PG: Please verify this is valid advice. -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Files provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your file data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

<!-- This diagram is copied from the Blob guide -->
:::image type="content" source="media/reliability-storage-files/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/reliability-storage-files/zone-redundant-storage.png" border="false":::

### Region support

ZRS is supported in HDD (standard) file shares in [all regions with availability zones](./regions-list.md).

ZRS is supported for SSD (premium) file shares through the `FileStorage` storage account kind. For a list of regions that support ZRS for SSD file share accounts, see [ZRS support for SSD file shares](/azure/storage/files/redundancy-premium-file-shares#zrs-support-for-ssd-azure-file-shares).

### Cost

When you enable zone-redundant storage, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure availability zone support

- **Create a file share with zone redundancy:** To create a new file share with zone-redundant storage, see [Create an Azure file share](/azure/storage/files/storage-how-to-create-file-share) and select ZRS or GZRS as the redundancy option during account creation.

<!-- The rest of this section is copied from the Blob guide -->
- **Migration**. To convert an existing storage account to zone-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for detailed migration options and requirements.

- **Disable zone redundancy.** Convert zone-redundant storage accounts back to a nonzonal configuration (LRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a file storage account is configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones**. Azure Files with zone-redundant storage (ZRS) automatically distributes requests across storage clusters in multiple availability zones. Traffic distribution is transparent to applications and requires no client-side configuration.

<!-- This bullet is copied from the Blob guide -->
- **Data replication between zones**. All write operations to zone-redundant storage are replicated synchronously across all availability zones within the region. When you create or modify files, the operation isn't considered complete until the data has been successfully replicated across all of the availability zones. This synchronous replication ensures strong consistency and zero data loss during zone failures. However, it may result in slightly higher write latency compared to locally redundant storage.

### Zone-down experience

This section describes what to expect when a file storage account is configured for zone redundancy and there's an availability zone outage.

<!-- The rest of this section is copied from the Blob guide -->

- **Detection and response**: Microsoft automatically detects zone failures and initiates failover processes. No customer action is required for zone-redundant storage accounts.

- **Active requests**: In-flight requests might be dropped during the failover and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss**: No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime**: A small amount of downtime (typically a few seconds) may occur during automatic failover as traffic is redirected to healthy zones.

- **Traffic rerouting**: Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

### Failback

When the failed availability zone recovers, Azure Files automatically restores normal operations across all of the availability zones.

### Testing for zone failures

Azure Files manages replication, traffic routing, failover, and failback for zone-redundant storage. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

## Multi-region support

Azure Files provides a range of geo-redundancy and failover capabilities to suit different requirements.

<!-- This note is copied from the Blob guide -->
> [!IMPORTANT]
> Geo-redundant storage works within [Azure paired regions](./regions-paired.md). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Replication across paired regions

Azure Files provides two types of geo-redundant storage in paired regions:

<!-- These bullets are copied from the Blob guide (but note that the blob guide includes RA-GRS and RA-GZRS, which aren't avalable for Azure Files) -->

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region. Data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

   :::image type="content" source="media/reliability-storage-files/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS." lightbox="media/reliability-storage-files/geo-redundant-storage.png" border="false":::

- [Geo-zone redundant storage (GZRS)](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availabilty zones in the primary region, and also into the paired region.

  :::image type="content" source="media/reliability-storage-files/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS." lightbox="media/reliability-storage-files/geo-redundant-storage.png" border="false":::

> [!IMPORTANT]
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured and billed as GRS or GZRS.

#### Failover types

Azure Files supports three types of failover that are intended for different situations:

<!-- The rest of this section is copied from the Blob guide -->

- **Customer-managed unplanned failover:** Enables you to initiate recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** Enables you to initiate recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region.

- **Microsoft-managed failover:** In exceptional situations, Microsoft might initiate failover for all GRS storage accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

### Region support

<!-- This section is copied from the Blob guide -->

Geo-redundant storage, as well as customer initiated failover and failback are available in all [Azure paired regions](./regions-paired.md) that support general-purpose v2 storage accounts.

### Requirements

Azure Files only supports geo-redundancy (GRS or GZRS) for standard (HDD) file shares. Premium (SSD) file shares must use LRS or ZRS. If you have premium file shares and you want to replicate the data across regions for higher resiliency, see [Alternative multi-region approaches](#alternative-multi-region-approaches).

### Considerations

When implementing multi-region Azure Files, consider the following important factors:

<!-- This bullet is copied from the Blob guide -->
- **Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated. The replication lag is expected to be less than 15 minutes, but this is an estimate and not guaranteed.

- **Secondary region access**: The secondary region is not accessible for reads until a failover occurs.

- **Feature limitations**: Some Azure Files features are not supported or have limitations when using geo-redundant storage or when using customer-managed failover. These include certain file share types, access tiers, and management tools and operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.

### Cost

Multi-region Azure Files configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure multi-region support

- **Create a new storage account with geo-redundancy.** To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS or GZRS during account creation.

<!-- The rest of this section is copied from the Blob guide -->

- **Migration.** To convert an existing storage account to geo-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

  > [!WARNING]
  > After your account is reconfigured for geo-redundancy, it may take a significant amount of time before existing data in the new primary region is fully copied to the new secondary.
  >
  > **To avoid a major data loss**, check the value of the [Last Sync Time property](/azure/storage/common/last-sync-time-get) before initiating an unplanned failover. To evaluate potential data loss, compare the last sync time to the last time at which data was written to the new primary.

- **Disable geo-redundancy.** Convert geo-redundant storage accounts back to single-region configurations (LRS or ZRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions**: Azure Files uses an active/passive approach where all write operations and most read operations are directed to the primary region.

- **Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS, or ZRS for GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS).
	
  <!-- This paragraph is copied from the Blob guide -->
   The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region. You can monitor the replication time through the [Last Sync Time property](/azure/storage/common/last-sync-time-get).

### Region-down experience

<!-- This whole section is copied from the Blob guide -->

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

<!-- This whole section is copied from the Blob guide -->

The failback process differs significantly between Microsoft-managed and customer-managed failover scenarios:

- **Customer-managed failover (unplanned)**: After an unplanned failover, the storage account is configured with locally redundant storage (LRS). In order to fail back, you need to re-establish the GRS relationship and wait for the data to be replicated.

- **Customer-managed failover (planned)**: After a planned failover, the storage account remains geo-replicated (GRS). You can initiate another failover in order to fail back to the original primary region, and the same failover considerations apply.

- **Microsoft-managed failover**: If Microsoft initiates a failover, it's likely that a significant disaster has occurred in the primary region, and the primary region might not be recoverable. Any timelines or recovery plans depends on the extent of the regional disaster and recovery efforts. You should monitor Azure Service Health communications for details.

### Testing for region failures

<!-- This whole section is copied from the Blob guide -->

You can simulate regional failures to test your disaster recovery procedures:

- **Planned failover testing**: For geo-redundant storage accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Although planned failover doesn't require data loss it does involve downtime during both failover and failback.

- **Secondary endpoint testing**: For RA-GRS and RA-GZRS configurations, regularly test read operations against the secondary endpoint to ensure your application can successfully read data from the secondary region.

### Alternative multi-region approaches

The cross-region failover capabilities of Azure Files aren't suitable for the following scenarios:

- You use file share types that don't support geo-redundancy.

- Your storage account is in a nonpaired region.

- Your business uptime goals aren't satisfied by the recovery time or data loss that the built-in failover options provide.

- You need to fail over to a region that isn't your primary region's pair.

- You need an active/active configuration across regions.

You can design a cross-region failover solution tailored to your needs. A complete treatment of deployment topologies for Azure Files is outside the scope of this article, but you can consider a multi-region deployment model. Common custom multi-region approaches include:

- **Multiple storage accounts:** Azure Files can be deployed across multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency. When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

- **Azure File Sync**: Deploy [Azure File Sync](/azure/storage/file-sync/file-sync-introduction) with sync servers in multiple regions connected to regional file shares. This provides multi-region access with local performance while maintaining central management. For an example approach, see [Sync between two Azure file shares for Backup and Disaster Recovery](https://github.com/Azure-Samples/azure-files-samples/tree/master/SyncBetweenTwoAzureFileSharesForDR).

- **Application-level replication**: Implement custom replication logic using [Azure Data Factory](/azure/data-factory/introduction) or [AzCopy](/azure/storage/common/storage-use-azcopy-v10) to synchronize data between file shares in different regions. This approach requires custom development and conflict resolution mechanisms.

## Backups

<!-- Anastasia: I'll revisit this after we finalise the 'backups' section in the blob storage article. -->

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
