---
title: Azure Files geo-redundancy for large file shares (preview)
description: Azure Files geo-redundancy for large file shares (preview) significantly improves standard SMB file share capacity and performance limits when using geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) options.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 08/28/2023
ms.author: kendownie
ms.custom: references_regions
---

# Azure Files geo-redundancy for large file shares (preview)

Azure Files geo-redundancy for large file shares (preview) significantly improves capacity and performance for standard SMB file shares when using geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) options. 

Azure Files has supported large file shares for several years, which not only provides file share capacity up to 100 TiB but also improves IOPS and throughput. Large file shares are widely adopted by customers using locally redundant storage (LRS) and zone-redundant storage (ZRS), but they haven't been available for geo-redundant storage (GRS) and geo-zone redundant storage (GZRS) until now.

Azure Files geo-redundancy for large file shares (the "preview") is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). You may use the preview in production environments.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

## Geo-redundant storage options

Azure maintains multiple copies of your data to ensure durability and high availability. For protection against regional outages, you can configure your storage account for GRS or GZRS to copy your data asynchronously in two geographic regions that are hundreds of miles apart. This preview adds GRS and GZRS support for standard storage accounts that have the large file shares feature enabled.

- **Geo-redundant storage (GRS)** copies your data synchronously three times within a single physical location in the primary region. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times.

- **Geo-zone-redundant storage (GZRS)** copies your data synchronously across three Azure availability zones in the primary region. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times.

If the primary region becomes unavailable for any reason, you can [initiate an account failover](../common/storage-initiate-account-failover.md) to the secondary region.  

> [!NOTE]  
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured as GRS or GZRS. The file shares won't be accessible in the secondary region unless a failover occurs.

## Large file share limits

Enabling large file shares when using geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) significantly increases your standard file share capacity and performance limits: 

| **Attribute** | **Current limit** | **Large file share limit** |
|---------------|-------------------|---------------|
| Capacity per share | 5 TiB | 100 TiB (20x increase) |
| Max IOPS per share | 1,000 IOPS | 20,000 IOPS (20x increase) |
| Max throughput per share | Up to 60 MiB/s | Up to [storage account limits](./storage-files-scale-targets.md#storage-account-scale-targets) |

## Region availability

Azure Files geo-redundancy for large file shares preview is currently available in the following regions:

- Australia Central
- Australia Central 2
- Australia East
- Australia Southeast
- Brazil South
- Brazil Southeast
- Canada Central
- Canada East
- Central India
- Central US
- China East 2
- China East 3
- China North 2
- China North 3
- East Asia
- East US
- East US 2
- France Central
- France South
- Germany North
- Germany West Central
- Japan East
- Japan West
- Korea Central
- Korea South
- North Central US
- North Europe
- Norway East
- Norway West
- South Africa North
- South Africa West
- South Central US
- South India
- Southeast Asia
- Sweden Central
- Sweden South
- Switzerland North
- Switzerland West
- UAE Central
- UAE North
- UK South
- UK West
- US Gov Arizona
- US Gov Texas
- US Gov Virginia
- West Central US
- West Europe
- West India
- West US
- West US 2
- West US 3

## Pricing

Pricing is based on the standard file share tier and redundancy option configured for the storage account. To learn more, see [Azure Files Pricing](https://azure.microsoft.com/pricing/details/storage/files/).

## Register for the preview

To get started, register for the preview using the Azure portal or PowerShell.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true).
2. Search for and select **Preview features**.
3. Click the **Type** filter and select **Microsoft.Storage**.
4. Select **Azure Files geo-redundancy for large file shares preview** and click **Register**.

# [Azure PowerShell](#tab/powershell)

To register your subscription using Azure PowerShell, run the following commands. Replace `<your-subscription-id>` and `<your-tenant-id>` with your own values. 

```azurepowershell-interactive
Connect-AzAccount -SubscriptionId <your-subscription-id> -TenantId <your-tenant-id> 
Register-AzProviderFeature -FeatureName AllowLfsForGRS -ProviderNamespace Microsoft.Storage 
```
---

## Enable geo-redundancy and large file shares for standard SMB file shares

With Azure Files geo-redundancy for large file shares preview, you can enable geo-redundancy and large file shares for new and existing standard SMB file shares.

### Create a new storage account and file share

Perform the following steps to configure geo-redundancy and large file shares for a new Azure file share.

1. [Create a standard storage account](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account).
   - Select geo-redundant storage (GRS) or geo-zone redundant storage (GZRS) for the **Redundancy** option.
   - In the Advanced section, select **Enable large file shares**.

2. [Create an SMB Azure file share](storage-how-to-create-file-share.md?tabs=azure-portal#create-a-file-share).

### Existing storage accounts and file shares  

The steps to enable geo-redundancy for large file shares will vary based on the redundancy option that's currently configured for your storage account. Follow the steps below based on the appropriate redundancy option for your storage account.

#### Existing storage accounts with a redundancy option of LRS or ZRS

1. [Change the redundancy option](../common/redundancy-migration.md?tabs=portal#change-the-replication-setting-using-the-portal-powershell-or-the-cli) for your storage account to GRS or GZRS.
1. Verify that the [large file shares setting is enabled](storage-how-to-create-file-share.md#enable-large-file-shares-on-an-existing-account) on your storage account.
1. **Optional:** [Increase the file share quota](storage-how-to-create-file-share.md?tabs=azure-portal#expand-existing-file-shares) up to 100 TiB.

#### Existing storage accounts with a redundancy option of GRS, GZRS, RA-GRS, or RA-GZRS

1. Enable the [large file shares](storage-how-to-create-file-share.md#enable-large-file-shares-on-an-existing-account) setting on your storage account.
1. **Optional:** [Increase the file share quota](storage-how-to-create-file-share.md?tabs=azure-portal#expand-existing-file-shares) up to 100 TiB.

## Snapshot and sync frequency

To ensure file shares are in a consistent state when a failover occurs, a system snapshot is created in the primary region every 15 minutes and is replicated to the secondary region. When a failover occurs to the secondary region, the share state will be based on the latest system snapshot in the secondary region. Due to geo-lag or other issues, the latest system snapshot in the secondary region may be older than 15 minutes.

The Last Sync Time (LST) property on the storage account indicates the last time that data from the primary region was written successfully to the secondary region. For Azure Files, the Last Sync Time is based on the latest system snapshot in the secondary region. You can use PowerShell or Azure CLI to [check the Last Sync Time](../common/last-sync-time-get.md#get-the-last-sync-time-property) for a storage account.

It's important to understand the following about the Last Sync Time property:

- The Last Sync Time property on the storage account is based on the service (Files, Blobs, Tables, Queues) in the storage account that's the furthest behind.
- The Last Sync Time isn't updated if no changes have been made on the storage account.
- The Last Sync Time calculation can time out if the number of file shares exceeds 100 per storage account. Less than 100 file shares per storage account is recommended.

## Failover considerations

This section lists considerations that might impact your ability to fail over to the secondary region.

- Storage account failover will be blocked if a system snapshot doesn't exist in the secondary region.

- File handles and leases aren't retained on failover, and clients must unmount and remount the file shares.

- File share quota might change after failover. The file share quota in the secondary region will be based on the quota that was configured when the system snapshot was taken in the primary region.

- Copy operations in progress will be aborted when a failover occurs. When the failover to the secondary region completes, retry the copy operation.

To test storage account failover, see [initiate an account failover](../common/storage-initiate-account-failover.md).

## See also

- [Disaster recovery and storage account failover](../common/storage-disaster-recovery-guidance.md)
