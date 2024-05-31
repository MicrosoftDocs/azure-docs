---
title: Azure Files geo-redundancy for large file shares
description: Azure Files geo-redundancy for large file shares significantly improves standard SMB file share capacity and performance limits when using geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) options.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 05/29/2024
ms.author: kendownie
ms.custom: references_regions
---

# Azure Files geo-redundancy for large file shares

Azure Files geo-redundancy for large file shares significantly improves capacity and performance for standard SMB file shares when using geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) options. 

Azure Files has offered 100 TiB standard SMB shares for years with locally redundant storage (LRS) and zone-redundant storage (ZRS). However, geo-redundant file shares had a 5 TiB capacity limit and were sometimes throttled due to IO operations per second (IOPS) and throughput limits. Now, geo-redundant standard SMB file shares support up to 100 TiB capacity with improved IOPS and throughput limits.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

## Geo-redundant storage options

Azure maintains multiple copies of your data to ensure durability and high availability. For protection against regional outages, you can configure your storage account for GRS or GZRS to copy your data asynchronously in two geographic regions that are hundreds of miles apart. This feature adds GRS and GZRS support for standard storage accounts that have the large file shares feature enabled.

- **Geo-redundant storage (GRS)** copies your data synchronously three times within a single physical location in the primary region. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times.

- **Geo-zone-redundant storage (GZRS)** copies your data synchronously across three Azure availability zones in the primary region. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times.

If the primary region becomes unavailable for any reason, you can [initiate an account failover](../common/storage-initiate-account-failover.md) to the secondary region.  

> [!NOTE]  
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured as GRS or GZRS. The file shares won't be accessible in the secondary region unless a failover occurs.

## New limits for geo-redundant shares

In regions that are now generally available, all standard SMB file shares that are geo-redundant (both new and existing) now support up to 100TiB capacity and have higher performance limits: 

| **Attribute** | **Previous limit** | **New limit** |
|---------------|-------------------|---------------|
| Capacity per share | 5 TiB | 100 TiB (20x increase) |
| Max IOPS per share | 1,000 IOPS | Up to [storage account limits](./storage-files-scale-targets.md#storage-account-scale-targets) (20x increase) |
| Max throughput per share | Up to 60 MiB/s | Up to [storage account limits](./storage-files-scale-targets.md#storage-account-scale-targets) (150x increase) |

## Region availability
Azure Files geo-redundancy for large file shares is generally available in all regions except China East 2 and China North 2, which are still in preview. 

## Pricing

Pricing is based on the standard file share tier and redundancy option configured for the storage account. To learn more, see [Azure Files Pricing](https://azure.microsoft.com/pricing/details/storage/files/).

## Register for the feature

To get started, register for the feature using Azure portal or PowerShell. This step is required for regions that are in preview and is no longer required for regions that are generally available. 

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true).
2. Search for and select **Preview features**.
3. Click the **Type** filter and select **Microsoft.Storage**.
4. Select **Azure Files geo-redundancy for large file shares** and click **Register**.

# [Azure PowerShell](#tab/powershell)

To register your subscription using Azure PowerShell, run the following commands. Replace `<your-subscription-id>` and `<your-tenant-id>` with your own values. 

```azurepowershell-interactive
Connect-AzAccount -SubscriptionId <your-subscription-id> -TenantId <your-tenant-id> 
Register-AzProviderFeature -FeatureName AllowLfsForGRS -ProviderNamespace Microsoft.Storage 
```
---

## Configure geo-redundancy and 100 TiB capacity for standard SMB file shares 

In regions that are now generally available:
- All standard SMB file shares (new and existing) support up to 100 TiB capacity and you can select any redundancy option supported in the region. Since all standard SMB file shares now support up to 100 TiB capacity, the large file share (LargeFileSharesState) property on storage accounts is no longer used and will be removed in the future. 
- If you have existing file shares, you can now increase the file share size up to 100 TiB (share quotas aren't automatically increased).
- Performance limits (IOPS and throughput) for your file shares have automatically increased to the storage account limits. 

Perform the following steps to configure 100TiB shares and geo-redundancy for new and existing SMB file shares:

### Create a new storage account and file share

Perform the following steps to configure geo-redundancy for a new storage account and Azure file share.

1. [Create a standard storage account](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account) and select geo-redundant storage (GRS) or geo-zone redundant storage (GZRS) for the **Redundancy** option.
2. [Create an SMB Azure file share](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-file-share). New file shares that are created default to 100 TiB.

#### Existing storage accounts with a redundancy option of LRS or ZRS

1. [Change the redundancy option](../common/redundancy-migration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) for your storage account to GRS or GZRS.
2. [Increase the file share quota](storage-how-to-create-file-share.md?tabs=azure-portal#expand-existing-file-shares) up to 100 TiB. [New file shares that are created](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-file-share) default to 100 TiB.

#### Existing storage accounts with a redundancy option of GRS, GZRS, RA-GRS, or RA-GZRS

1. [Increase the file share quota](storage-how-to-create-file-share.md?tabs=azure-portal#expand-existing-file-shares) up to 100 TiB. [New file shares that are created](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-file-share) default to 100 TiB.

## Snapshot and sync frequency

To ensure file shares are in a consistent state when a failover occurs, a system snapshot is created in the primary region every 15 minutes and is replicated to the secondary region. When a failover occurs to the secondary region, the share state is based on the latest system snapshot in the secondary region. Due to geo-lag or other issues, the latest system snapshot in the secondary region may be older than 15 minutes.

The Last Sync Time (LST) property on the storage account indicates the last time that data from the primary region was written successfully to the secondary region. For Azure Files, the Last Sync Time is based on the latest system snapshot in the secondary region. You can use PowerShell or Azure CLI to [check the Last Sync Time](../common/last-sync-time-get.md#get-the-last-sync-time-property) for a storage account.

It's important to understand the following about the Last Sync Time property:

- The Last Sync Time property on the storage account is based on the service (Files, Blobs, Tables, Queues) in the storage account that's the furthest behind.
- The Last Sync Time isn't updated if no changes have been made on the storage account.
- The Last Sync Time calculation can time out if the number of file shares exceeds 100 per storage account. Less than 100 file shares per storage account is recommended.

## Failover considerations

This section lists considerations that might impact your ability to fail over to the secondary region.

- Storage account failover is blocked if a system snapshot doesn't exist in the secondary region.
- Storage account failover is blocked if the storage account contains more than 100,000 file shares. To failover the storage account, open a support request.
- File handles and leases aren't retained on failover, and clients must unmount and remount the file shares.
- File share quota might change after failover. The file share quota in the secondary region will be based on the quota that was configured when the system snapshot was taken in the primary region.
- Copy operations in progress are aborted when a failover occurs. When the failover to the secondary region completes, retry the copy operation.

To failover a storage account, see [initiate an account failover](../common/storage-initiate-account-failover.md).

## See also

- [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md)
