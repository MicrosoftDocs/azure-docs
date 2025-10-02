---
title: Reliability in Azure Files
description: Learn about reliability in Azure Files, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-file-storage
ai-usage: ai-assisted
ms.date: 09/18/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who needs to understand the details of how Azure Files works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Files

This article describes reliability support in [Azure Files](/azure/storage/files/storage-files-introduction), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support). It also covers cross-region protection through geo-redundant storage (GRS) options. For more information, see [Azure reliability](/azure/reliability/overview).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

Azure Files provides fully managed file shares in the cloud that are accessible via industry-standard Server Message Block (SMB) and Network File System (NFS) protocols. Depending on the Azure region, Azure Files can support a range of redundancy configurations to enable both high availability (HA) and disaster recovery (DR) for hosted workloads:

 - *Locally redundant storage (LRS) and zone-redundant storage (ZRS)* are designed for HA and ensure data durability within a single datacenter or across availability zones.

 - *GRS and geo-zone-redundant storage (GZRS)* provide cross-region DR and replicate data to a secondary region to safeguard against regional outages.

> [!NOTE]
> Azure Files is part of the Azure Storage platform. Some of the capabilities of Azure Files are common across many Azure Storage services. In this article, we use *Azure Storage* to refer to these common capabilities.

## Production deployment recommendations

To learn how to deploy Azure Files to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Files](/azure/well-architected/service-guides/azure-files) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Files is available in two media tiers: 

- The **Premium tier** uses solid-state drives (SSD) for high performance. This tier is recommended for workloads that require low latency.

- The **Standard tier** supports hard disk drives (HDD). HDD file shares provide a cost-effective storage option for general purpose file shares.

For more information, see [Plan to deploy Azure Files - Storage tiers](/azure/storage/files/storage-files-planning#storage-tiers).

Azure Files implements redundancy at the storage account level, and file shares inherit that redundancy configuration automatically. The service supports multiple redundancy models that differ in their approach to data protection.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when you use Azure Files, configure appropriate timeout values for your file operations based on file size and network conditions. Larger files require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

To ensure that only secure connections are established to your NFS share, we recommend that you configure a private endpoint for your storage account. A private endpoint uses Azure Private Link to assign a static IP address to your storage account from within your virtual network's private address space. A private endpoint helps to prevent connectivity interruptions from dynamic IP address changes. For more information about security for your NFS shares, see [NFS file shares - Security and networking](/azure/storage/files/files-nfs-protocol#security-and-networking).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Files provides robust availability zone support through ZRS configurations that automatically distribute your data across multiple availability zones within a region. Unlike LRS, ZRS guarantees that Azure synchronously replicates your file data across multiple availability zones. ZRS ensures that your data remains accessible even if one zone experiences an outage.

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

- **Create a file share with zone redundancy.** To create a new file share with ZRS, see [Create an Azure file share](/azure/storage/files/create-classic-file-share) and select **ZRS** or **GZRS** as the redundancy option during account creation.

- **Change replication type.** To convert an existing storage account to ZRS and learn about migration options and requirements, see [Change redundancy configuration for Azure Files](/azure/storage/files/files-change-redundancy-configuration?tabs=portal).

- **Disable zone redundancy.** Convert ZRS accounts back to a nonzonal configuration, such as LRS, through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a file storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Zone-down experience

This section describes what to expect when a file storage account is configured for zone redundancy and there's an availability zone outage.

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting:** Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality by using the surviving zones with no customer intervention required. No remounting of Azure file shares from the connected clients is required.

### Zone recovery

[!INCLUDE [Storage - Zone recovery](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Multi-region support

[!INCLUDE [Storage - Multi-region support introduction](includes/storage/reliability-storage-multi-region-support-include.md)]

> [!IMPORTANT]
> Azure Files only supports geo-redundancy (GRS or GZRS) for standard (HDD) file shares. 
>
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the standard (HDD) file shares are configured and billed as GRS or GZRS.

[!INCLUDE [Storage - Multi-region support introduction failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

### Region support

[!INCLUDE [Storage - Multi-region support region support](includes/storage/reliability-storage-multi-region-region-support-include.md)]

### Requirements

- **Standard file shares only:** Azure Files only supports geo-redundancy (GRS or GZRS) for standard (HDD) file shares. Premium (SSD) file shares must use LRS or ZRS. If you have premium file shares and you want to replicate the data across regions for higher resiliency, see [Alternative multi-region approaches](#alternative-multi-region-approaches).

- **GRS and GZRS only:** Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the standard (HDD) file shares are configured and billed as GRS or GZRS.

### Considerations

When you implement multi-region Azure Files, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

- **Last Sync Time:** For Azure Files, the Last Sync Time is based on the latest system snapshot in the secondary region.

    The Last Sync Time calculation can time out if there are more than 100 file shares in a storage account. We recommend that you deploy 100 or fewer file shares for each storage account to avoid timeouts.

- **Secondary region access:** The secondary region isn't accessible for reads until a failover occurs.

- **Feature limitations:** Some Azure Files features aren't supported or have limitations when you use GRS or customer-managed failover. These limitations include specific file share types, access tiers, and management tools and operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before you implement geo-redundancy.

### Cost

[!INCLUDE [Storage - Multi Region cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

### Configure multi-region support

[!INCLUDE [Storage - Multi Region create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

- **Enable geo-redundancy on an existing file storage account.** To convert an existing file storage account to GRS, see [Change redundancy configuration for Azure Files](/azure/storage/files/files-change-redundancy-configuration?tabs=portal).

  > [!WARNING]
  > After your account is reconfigured for geo-redundancy, it might take a significant amount of time before existing data in the new primary region is fully copied to the new secondary region.
  >
  > **To avoid a major data loss**, check the value of the [Last Sync Time property](/azure/storage/common/last-sync-time-get) before you initiate an unplanned failover. To evaluate potential data loss, compare the last sync time to the last time at which data was written to the new primary region.

- **Disable geo-redundancy.** Convert GRS accounts back to single-region configurations (LRS or ZRS) through the same redundancy configuration change process.

### Normal operations

This section describes what to expect when a storage account is configured for geo-redundancy and all regions are operational.

- **Traffic routing between regions:** Azure Files uses an active-passive approach where all read and write operations are directed to the primary region.

- **Data replication between regions:** Write operations are first committed to the primary region by using the configured redundancy type (LRS for GRS, or ZRS for GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region, where it's stored by using LRS.

  [!INCLUDE [Storage - Multi Region Normal operations - lag](includes/storage/reliability-storage-multi-region-normal-operations-lag-include.md)]

### Region-down experience

[!INCLUDE [Storage - Multi Region Down experience](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

### Region recovery

[!INCLUDE [Storage - Multi Region Failback](includes/storage/reliability-storage-multi-region-failback-include.md)]

### Testing for region failures

For GRS accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process. Planned failover doesn't require data loss, but it does require downtime during both failover and failback.

### Alternative multi-region approaches

[!INCLUDE [Storage - Alternative multi-region approaches - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

- You use file share types that don't support geo-redundancy.

[!INCLUDE [Storage - Alternative multi-region approaches - introduction](includes/storage/reliability-storage-multi-region-alternative-introduction-include.md)]

Consider the following common high-level approaches:

- **Multiple storage accounts:** Azure Files can be deployed across multiple regions by using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use nonpaired regions, and more granular control over replication timing and data consistency. When you implement multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions.

- **Application-level replication:** Implement custom replication logic by using [Azure Data Factory](/azure/data-factory/introduction) or [AzCopy](/azure/storage/common/storage-use-azcopy-v10) to synchronize data between file shares in different regions. This approach requires custom development and conflict resolution mechanisms.

- **Use Azure File Sync to replicate files to a file share in another Azure region.** You can use [Azure File Sync](/azure/storage/file-sync/file-sync-introduction) to sync between an SMB Azure file share (*cloud endpoint*), an on-premises Windows file server, and a mounted file share that runs on a virtual machine (VM) in another Azure region (a *DR server endpoint*).

  This approach requires you to deploy multiple file shares and a VM to coordinate the synchronization process.

  If you use this approach for multi-region file replication:

  - Disable cloud tiering to ensure that all data is present locally on the file server.

  - Provision enough storage on the Azure VM to hold the entire dataset.

  - Access and modify files on the server endpoint, and not in Azure, to ensure that changes replicate quickly to the secondary region.

## Backups

[Azure Files backup](/azure/backup/azure-file-share-backup-overview) is a native integration between Azure Files and Azure Backup that's designed to safeguard data against accidental deletion, corruption, and ransomware attacks.

Azure Files backup creates share-level snapshots stored within the same storage account. This capability enables the rapid recovery of both individual files and entire file shares. You can also use *backup policies* to provide long retention periods with customizable backup frequency.

You can create your snapshots and store them in two different ways:

- **Share-level storage:** For operational and short-term recovery scenarios, you can create share-level snapshots and store them within the same storage account. Share-level snapshots enable rapid recovery of individual files or entire file shares to either the original or an alternate location.

- **Vaulted backup storage:** By using vaulted backup, you can copy your daily snapshots to an Azure Recovery Services vault. To enhance security, this vault is isolated and air-gapped from the primary storage account.
  
  When you use a paired Azure region and configure the vault to use GRS, the vault replicates data to the paired region. This replication supports cross-region recovery and DR workflows.

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [Azure Files documentation](../storage/files/storage-files-introduction.md)
- [Azure Files redundancy](../storage/files/files-redundancy.md)
- [Plan for an Azure Files deployment](../storage/files/storage-files-planning.md)
- [Azure reliability](overview.md)
