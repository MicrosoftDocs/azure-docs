---
title: Change how a storage account is replicated
titleSuffix: Azure Storage
description: Learn how to change how data in an existing storage account is replicated.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: how-to
ms.date: 09/21/2022
ms.author: jammart
ms.subservice: common 
ms.custom: devx-track-azurepowershell
---

# Change how a storage account is replicated

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures.

A combination of three factors determine how your storage account is replicated and accessible:

- **Zone redundancy** - whether data is replicated between different zones within the primary region (LRS vs. ZRS)
- **Geo-redundancy** - replication within a single "local" region or between different regions (LRS vs. GRS)
- **Read access (RA)** - read access to the secondary region in the event of a failover when geo-redundancy is used (GRS vs. RA-GRS)

For an overview of all of the redundancy options, see [Azure Storage redundancy](storage-redundancy.md).

In this article, you will learn how to change the replication setting(s) for an existing storage account.

## Options for changing the replication type

You can change how your storage account is replicated from any type to any other. There are four basic ways to change the settings:

- [Use the Azure portal, Azure PowerShell, or the Azure CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)
- [Initiate a conversion from within the Azure portal (preview)](#customer-initiated-conversion-preview)
- [Request a conversion by creating a support request with Microsoft](#support-requested-conversion)
- [Perform a manual migration](#manual-migration)

To add or remove geo-replication or read access to the secondary region, you can simply [change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli).

To add or remove zone-redundancy requires using either [customer-initiated conversion (preview)](#customer-initiated-conversion-preview), [support-requested conversion](#support-requested-conversion), or [a manual migration](#manual-migration). 

During a conversion, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the conversion process and there is no data loss. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the conversion.

Performing a manual migration involves downtime and requires the most manual effort, but you have more control over the timing of the process.

If you want to change how data is replicated in the primary region and also configure geo-replication or read-access, a two-step process is required. Geo-redundancy and read-access can be changed at the same time, but zone-redundancy must be changed separately. It doesn't matter which is done first.

> [!NOTE]
> While Microsoft handles your request for a conversion promptly, there's no guarantee as to when it will complete. If you need your data converted by a certain date, Microsoft recommends that you perform a manual migration instead.
>
> Generally, the more data you have in your account, the longer it takes to replicate that data to other zones in the region.

### Replication change table

The following table provides an overview of how to switch from each type of replication to another.

> [!NOTE]
> Manual migration is an option for any scenario in which you want to change the replication setting within the [limitations for changing replication types](#limitations-for-changing-replication-types), so that option has been omitted from the table below to simplify it.
>
> Also, some changes noted in the table involve a two-step process such as switching from LRS to GRS/RA-GRS first, then converting to GZRS/RA-GZRS. The order of the steps doesn't matter. You could also convert from LRS to ZRS first, then switch to GZRS/RA-GZRS. The switch is listed first in the table because it appears to occur almost instantaneously, while the conversion typically takes much longer. Performing the faster change first allows you to initiate both required changes around the same time and not have to wait for the longer change to complete before proceeding with the other one.

| Switching | …to LRS | …to GRS/RA-GRS <sup>6</sup> | …to ZRS | …to GZRS/RA-GZRS <sup>6</sup> |
|--------------------|----------------------------------------------------|---------------------------------------------------------------------|----------------------------------------------------|---------------------------------------------------------------------|
| **…from LRS** | **N/A** | [Use Azure portal, PowerShell, or CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)<sup>1,2</sup> | [Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3,5</sup><br>**- or -**</br>[Support-requested conversion](#support-requested-conversion)<sup>3,5</sup> | [Switch to GRS/RA-GRS first](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)<sup>1,2</sup>, then perform a conversion to GZRS/RA-GZRS using:<br><br>[Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3,5</sup><br>**- or -**</br>[Support-requested conversion](#support-requested-conversion)<sup>3,5</sup> |
| **…from GRS/RA-GRS** | [Use Azure portal, PowerShell, or CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli) | **N/A** | [Switch to LRS first](#change-the-replication-setting-using-the-portal-powershell-or-the-cli), then perform a conversion to ZRS using:<br><br>[Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3,5</sup><br>**- or -**</br>[Support-requested conversion](#support-requested-conversion)<sup>3,5</sup> | [Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3,5</sup><br>**- or -**</br>[Support-requested conversion](#support-requested-conversion)<sup>3,5</sup> |
| **…from ZRS** | [Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3</sup> | [Switch to GZRS/RA-GZRS first](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)<sup>1,2</sup>, then perform a conversion to GRS/RA-GRS using:<br><br>[Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3</sup> | **N/A** | [Use Azure portal, PowerShell, or CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)<sup>2</sup> |
| **…from GZRS/RA-GZRS** | [Switch to ZRS first](#change-the-replication-setting-using-the-portal-powershell-or-the-cli), then perform a conversion to LRS using:<br><br>[Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3</sup> | [Customer-initiated conversion](#customer-initiated-conversion-preview)<sup>3</sup> | [Use Azure portal, PowerShell, or CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli)| **N/A** |

<sup>1</sup> Incurs a one-time egress charge.<br />
<sup>2</sup> Switching to geo-redundancy is not supported if the storage account contains blobs in the archive tier.<br />
<sup>3</sup> Conversion is supported for standard general-purpose v2 and premium file share storage accounts. It is not supported for premium block blob or page blob storage accounts.<br />
<sup>4</sup> After an account failover to the secondary region, it's possible to initiate a fail back from the new primary back to the new secondary with PowerShell or Azure CLI (version 2.30.0 or later). For more information, see [Use caution when failing back to the original primary](storage-disaster-recovery-guidance.md#use-caution-when-failing-back-to-the-original-primary). <br />
<sup>5</sup> Converting from LRS to ZRS is not supported if the NFSv3 protocol support is enabled for Azure Blob Storage or if the storage account contains Azure Files NFSv4.1 shares. <br />
<sup>6</sup> Even though enabling geo-redundancy appears to occur instantaneously, failover to the secondary region cannot be initiated until data synchronization between the two regions has completed.

## Change the replication setting

Depending on your scenario from the table above, use one of the methods below to change your replication settings.

### Change the replication setting using the portal, PowerShell, or the CLI

In most cases you can use the Azure portal, PowerShell, or the Azure CLI to change the geo-redundant or read access (RA) replication setting for a storage account. If you are initiating a zone redundancy conversion, you can change the setting from within the Azure portal, but not from PowerShell or the Azure CLI.

Changing how your storage account is replicated in the portal does not result in down time for your applications. This includes changes that require a conversion.

# [Portal](#tab/portal)

To change the redundancy option for your storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. Select **Save**.

    :::image type="content" source="media/redundancy-migration/change-replication-option.png" alt-text="Screenshot showing how to change replication option in portal." lightbox="media/redundancy-migration/change-replication-option.png":::

# [PowerShell](#tab/powershell)

To change the redundancy option for your storage account with PowerShell, call the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command and specify the `-SkuName` parameter:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage_account> `
    -SkuName <sku>
```

# [Azure CLI](#tab/azure-cli)

To change the redundancy option for your storage account with Azure CLI, call the [az storage account update](/cli/azure/storage/account#az-storage-account-update) command and specify the `--sku` parameter:

```azurecli-interactive
az storage account update \
    --name <storage-account>
    --resource-group <resource_group> \
    --sku <sku>
```

---

### Perform a conversion

Converting your storage account to add or remove zone-redundancy makes the change without incurring any down time.

During a conversion, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the process and there is no data loss associated with a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the conversion.

There are two ways to initiate a conversion:

- [Customer-initiated](#customer-initiated-conversion-preview)
- [Support-requested](#support-requested-conversion)

#### Customer-initiated conversion (preview)

> [!IMPORTANT]
> Customer-initiated conversion is currently in preview and available in all public ZRS regions except for the following:
>
> - (Europe) West Europe
> - (Europe) UK South
> - (North America) Canada Central
> - (North America) East US
> - (North America) East US 2
>
> To opt in to the preview, see [Set up preview features in Azure subscription](../../azure-resource-manager/management/preview-features.md) and specify **CustomerInitiatedMigration** as the feature name.
>
> This preview version is provided without a service level agreement, and might not be suitable for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Customer-initiated conversion adds a new option for customers to start a conversion. Now, instead of needing to open a support request, customers can start the conversion directly from within the Azure portal. Once initiated, the conversion could still take up to 72 hours to actually begin, but potential delays related to opening and managing a support request are eliminated.

Customer-initiated conversion is only available from the Azure portal, not from PowerShell or the Azure CLI. To initiate the conversion, perform the same steps used for changing other replication settings in the Azure portal as described in [Change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli).

#### Support-requested conversion

Customers can still request a conversion by opening a support request with Microsoft.

> [!IMPORTANT]
> If you need to convert more than one storage account, create a single support ticket and specify the names of the accounts to convert on the **Additional details** tab.

Follow these steps to request a conversion from Microsoft:

1. In the Azure portal, navigate to a storage account that you want to convert.
1. Under **Support + troubleshooting**, select **New Support Request**.
1. Complete the **Problem description** tab based on your account information:
    - **Summary**: (some descriptive text).
    - **Issue type**: Select **Technical**.
    - **Subscription**: Select your subscription from the drop-down.
    - **Service**: Select **My Services**, then **Storage Account Management** for the **Service type**.
    - **Resource**: Select a storage account to convert. If you need to specify multiple storage accounts, you can do so on the **Additional details** tab.
    - **Problem type**: Choose **Data Migration**.
    - **Problem subtype**: Choose **Migrate to ZRS, GZRS, or RA-GZRS**.

    :::image type="content" source="media/redundancy-migration/request-live-migration-problem-desc-portal.png" alt-text="Screenshot showing how to request a conversion - Problem description tab.":::

1. Select **Next**. The **Recommended solution** tab might be displayed briefly before it switches to the **Solutions** page. On the **Solutions** page, you can check the eligibility of your storage account(s) for conversion:
    - **Target replication type**: (choose the desired option from the drop-down)
    - **Storage accounts from**: (enter a single storage account name or a list of accounts separated by semicolons)
    - Select **Submit**.

    :::image type="content" source="media/redundancy-migration/request-live-migration-solutions-portal.png" alt-text="Screenshot showing how to check the eligibility of your storage account(s) for conversion - Solutions page.":::

1. Take the appropriate action if the results indicate your storage account is not eligible for conversion. If it is eligible, select **Return to support request**.

1. Select **Next**. If you have more than one storage account to migrate, then on the **Details** tab, specify the name for each account, separated by a semicolon.

    :::image type="content" source="media/redundancy-migration/request-live-migration-details-portal.png" alt-text="Screenshot showing how to request a conversion - Additional details tab.":::

1. Fill out the additional required information on the **Additional details** tab, then select **Review + create** to review and submit your support ticket. A support person will contact you to provide any assistance you may need.

### Manual migration

A manual migration provides more flexibility and control than a conversion. You can use this option if you need the migration to complete by a certain date, or if conversion is [not supported for your scenario](#limitations-for-changing-replication-types). Manual migration is also useful when moving a storage account to another region. See [Move an Azure Storage account to another region](storage-account-move.md) for more details.

You must perform a manual migration if:

- You want to migrate your storage account to a different region.
- Your storage account is a block blob account.
- Your storage account includes data in the archive tier and rehydrating the data is not desired.

> [!IMPORTANT]
> A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a [conversion](#perform-a-conversion) option. A conversion is an in-place migration with no downtime.

With a manual migration, you copy the data from your existing storage account to a new storage account. To perform a manual migration, you can use one of the following options:

- Copy data by using an existing tool such as AzCopy, one of the Azure Storage client libraries, or a reliable third-party tool.
- If you're familiar with Hadoop or HDInsight, you can attach both the source storage account and destination storage account to your cluster. Then, parallelize the data copy process with a tool like DistCp.

For more detailed guidance on how to perform a manual migration, see [Move an Azure Storage account to another region](storage-account-move.md).

## Limitations for changing replication types

Limitations apply to some replication change scenarios depending on:

- [Storage account type](#storage-account-type)
- [Region](#region)
- [Access tier](#access-tier)
- [Protocol support](#protocol-support)
- [Failover and failback](#failover-and-failback)

### Storage account type

When planning to change your replication settings, consider the following limitations related to the storage account type.

Some storage account types only support certain redundancy configurations, which affects whether they can be converted or migrated and, if so, how. For more details on Azure storage account types and the supported redundancy options, see [the storage account overview](storage-account-overview.md#types-of-storage-accounts).

The following table provides an overview of redundancy options available for storage account types and whether conversion and manual migration are supported:

| Storage account type        | Supports LRS | Supports ZRS | Supports conversion<br>(from the portal) | Supports conversion<br>(by support request) | Supports manual migration |
|:----------------------------|:------------:|:------------:|:-----------------------:|:-------------------------:|:-------------------------:|
| Standard general purpose v2 | &#x2705;     | &#x2705;     | &#x2705;                | &#x2705;                  | &#x2705;                  |
| Premium file shares         | &#x2705;     | &#x2705;     |                         | &#x2705; <sup>1</sup>     | &#x2705;                  |
| Premium block blob          | &#x2705;     | &#x2705;     |                         |                           | &#x2705;                  |
| Premium page blob           | &#x2705;     |              |                         |                           |                           |
| Managed disks<sup>2</sup>   | &#x2705;     |              |                         |                           |                           |
| Standard general purpose v1 | &#x2705;     |              |    <sup>3</sup>         |                           | &#x2705;                  |
| ZRS Classic<sup>4</sup><br /><sub>(available in standard general purpose v1 accounts)</sub> | &#x2705; |  |  |  |

<sup>1</sup> Conversion for premium file shares is only available by [opening a support request](#support-requested-conversion); [Customer-initiated conversion (preview)](#customer-initiated-conversion-preview) is not currently supported.<br />
<sup>2</sup> Managed disks are only available for LRS and cannot be migrated to ZRS. You can store snapshots and images for standard SSD managed disks on standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/). For information about integration with availability sets, see [Introduction to Azure managed disks](../../virtual-machines/managed-disks-overview.md#integration-with-availability-sets).<br />
<sup>3</sup> If your storage account is v1, you'll need to upgrade it to v2 before performing a conversion. To learn how to upgrade your v1 account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md).<br />
<sup>4</sup> ZRS Classic storage accounts have been deprecated. For information about converting ZRS Classic accounts, see [Converting ZRS Classic accounts](#converting-zrs-classic-accounts).<br />

#### Converting ZRS Classic accounts

> [!IMPORTANT]
> ZRS Classic accounts were deprecated on March 31, 2021. Customers can no longer create ZRS Classic accounts. If you still have some, you should upgrade them to general purpose v2 accounts.

ZRS Classic was available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

ZRS Classic accounts asynchronously replicated data across data centers within one to two regions. Replicated data was not available unless Microsoft initiated a failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

To change ZRS Classic to another replication type, use one of the following methods:

- Upgrade it to ZRS first
- [Manually migrate the data directly to another replication type](#manual-migration)

To upgrade your ZRS Classic storage account to ZRS, use the Azure portal, PowerShell, or Azure CLI in regions where ZRS is available:

# [Portal](#tab/portal)

To upgrade to ZRS in the Azure portal, navigate to the **Configuration** settings of the account and choose **Upgrade**:

![Upgrade ZRS Classic to ZRS in the Portal](media/redundancy-migration/portal-zrs-classic-upgrade.png)

# [PowerShell](#tab/powershell)

To upgrade to ZRS using PowerShell, call the following command:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage_account> -UpgradeToStorageV2
```

# [Azure CLI](#tab/azure-cli)

To upgrade to ZRS using Azure CLI, call the following command:

```cli
az storage account update -g <resource_group> -n <storage_account> --set kind=StorageV2
```

---

To manually migrate your ZRS Classic account data to another type of replication, follow the steps to [perform a manual migration](#manual-migration).

### Region

Make sure the region where your storage account is located supports all of the desired replication settings. For example, if you are converting your account to zone-redundant (ZRS, GZRS, or RA-GZRS), make sure your storage account is in a region that supports it. See the lists of supported regions for [Zone-redundant storage](storage-redundancy.md#zone-redundant-storage) and [Geo-zone-redundant storage](storage-redundancy.md#geo-zone-redundant-storage).

The [customer-initiated conversion (preview)](#customer-initiated-conversion-preview) to ZRS is available in all public ZRS regions except for the following:

- (Europe) West Europe
- (Europe) UK South
- (North America) Canada Central
- (North America) East US
- (North America) East US 2

If you want to migrate your data into a zone-redundant storage account located in a region different from the source account, you must perform a manual migration. For more details, see [Move an Azure Storage account to another region](storage-account-move.md).

### Access tier

Ensure the desired replication option supports the access tier currently used in the storage account. For example, GZRS storage accounts do not currently support the archive tier. See [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md) for more details.

To change the redundancy configuration for a storage account that contains blobs in the Archive tier, you must first rehydrate all archived blobs to the Hot or Cool tier. Microsoft recommends that you avoid changing the redundancy configuration for a storage account that contains archived blobs if at all possible, because rehydration operations can be costly and time-consuming. An option that avoids the rehydration time and expense is a [manual migration](#manual-migration).

### Protocol support

Converting your storage account to zone-redundancy (ZRS, GZRS or RA-GZRS) is not supported if the NFSv3 protocol support is enabled for Azure Blob Storage, or if the storage account contains Azure Files NFSv4.1 shares.

### Failover and failback

After an account failover to the secondary region, it's possible to initiate a failback from the new primary back to the new secondary with PowerShell or Azure CLI (version 2.30.0 or later). For more information, see [use caution when failing back to the original primary](storage-disaster-recovery-guidance.md#use-caution-when-failing-back-to-the-original-primary).

If you performed an [account failover](storage-disaster-recovery-guidance.md) for your (RA-)GRS or (RA-)GZRS account, the account is locally redundant (LRS) in the new primary region after the failover. Live migration to ZRS or GZRS for an LRS account resulting from a failover is not supported. This is true even in the case of so-called failback operations. For example, if you perform an account failover from RA-GZRS to the LRS in the secondary region, and then configure it again to RA-GRS and perform another account failover to the original primary region, you can't perform a conversion to RA-GZRS in the primary region. Instead, you'll need to perform a manual migration to ZRS or GZRS.

## Downtime requirements

During a conversion, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and there is no data loss associated with a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

If you initiate a conversion from the Azure portal, the migration process could take up to 72 hours to begin, and possibly longer if requested by opening a support request.

If you choose to perform a manual migration, downtime is required but you have more control over the timing of the migration process.

## Costs associated with changing how data is replicated

The costs associated with changing how data is replicated depend on your conversion path. Ordering from least to the most expensive, Azure Storage redundancy offerings include LRS, ZRS, GRS, RA-GRS, GZRS, and RA-GZRS.

For example, going *from* LRS to any other type of replication will incur additional charges because you are moving to a more sophisticated redundancy level. Migrating *to* GRS or RA-GRS will incur an egress bandwidth charge at the time of the conversion or migration because your entire storage account is being replicated to the secondary region. All subsequent writes to the primary region also incur egress bandwidth charges to replicate the write to the secondary region. For details on bandwidth charges, see [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

If you migrate your storage account from GRS to LRS, there is no additional cost, but your replicated data is deleted from the secondary location.

> [!IMPORTANT]
> If you migrate your storage account from RA-GRS to GRS or LRS, that account is billed as RA-GRS for an additional 30 days beyond the date that it was converted.

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
