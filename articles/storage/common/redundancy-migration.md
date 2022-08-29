---
title: Change how a storage account is replicated
titleSuffix: Azure Storage
description: Learn how to change how data in an existing storage account is replicated.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: how-to
ms.date: 08/29/2022
ms.author: jammart
ms.subservice: common 
ms.custom: devx-track-azurepowershell
---

# Change how a storage account is replicated

In this article, you will learn how to change the replication setting for an existing storage account.

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures.

Azure Storage offers the following types of replication:

- Locally redundant storage (LRS)
- Zone-redundant storage (ZRS)
- Geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS)
- Geo-zone-redundant storage (GZRS) or read-access geo-zone-redundant storage (RA-GZRS)

For an overview of each of these options, see [Azure Storage redundancy](storage-redundancy.md).

## Before you make any changes

Before you change any of your replication settings, be sure to review all of these topics first:

- [Options for changing replication types](#options-for-changing-replication-types)
- [Restrictions](#restrictions)
- [Downtime requirements](#downtime-requirements)
- [Costs associated with changing how data is replicated](#costs-associated-with-changing-how-data-is-replicated)

## Options for changing replication types

You can convert a storage account from any type of replication to any other type, although some conversion scenarios are more straightforward than others. Consider the scenarios noted under [Restrictions](#restrictions) to determine the right path for you.

The following table shows the three factors that determine the options available for converting from one to another:

| Redundancy factor                                                                       | Option for changing |
|-----------------------------------------------------------------------------------------|---------------------|
| Geo-redundancy <br /><sub>(single "local" region vs. geo-redundant)</sub>                       | [Change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli) |
| Read access (RA) to the secondary region <br /><sub>(when geo-redundancy is used)</sub> | [Change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli) |
| Zone redundancy                                                                         | [Storage account migration](#storage-account-migration) <br /><sub>(live migration or manual migration)</sub> |

If you just want to add or remove geo-replication or read access to the secondary region, you can [change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli).

To add or remove zone-redundancy requires migration of the data in the storage account within the primary region, and can take considerably longer. There are two supported migration methods: live migration and manual migration. Live migration is recommended, but you can use manual migration if you want more control over the process, or if another method is not supported, such as live migration. The two migration methods are explained in more detail later in [Storage account migration](#storage-account-migration).

If you want to change both the zone-redundancy factor and either geo-redundancy, read-access or both, a two-step process will be required. You will first need to make the geo-redundancy and read-access change(s), then perform a migration to change the zone-redundancy.

The following table shows the options for converting from each replication setting to every other:

| Convert         | ...to: | LRS| GRS <sup>1,2</sup> | RA-GRS <sup>1,2</sup> | ZRS <sup>5</sup> | GZRS <sup>1,2,5</sup> | RA-GZRS <sup>1,2,5</sup> |
|-----------------|--------|----|-----|--------|-----|------|---------|
| <b>…from:       |        |    |     |        |     |      |         |
| <b> LRS</b>     |        | ***N/A*** | Use Azure portal, PowerShell, or CLI | Use Azure portal, PowerShell, or CLI | Migrate | convert to GRS first, then migrate to GZRS | Convert to RA-GRS first, then migrate to RA-GZRS |
| <b> GRS</b>     |        | Use Azure portal, PowerShell, or CLI | ***N/A*** | Use Azure portal, PowerShell, or CLI | Convert to LRS first, then migrate to ZRS | Migrate |Convert to RA-GRS first, then migrate to RA-GZRS |
| <b> RA-GRS</b>  |        | Use Azure portal, PowerShell, or CLI | Use Azure portal, PowerShell, or CLI | ***N/A*** | Convert to LRS first, then migrate to ZRS | Convert to GRS first, then migrate to GZRS | Migrate |
| <b> ZRS</b>     |        | Migrate | Convert to GZRS first, then migrate to GRS | Convert to RA-GZRS first, then migrate to RA-GRS |***N/A*** | Migrate<br><br> <b>-OR-</b><br><br>Use Azure Portal, PowerShell or Azure CLI to change the replication setting as part of a failback operation only<sup>4</sup> | Migrate<br><br> <b>-OR-</b><br><br>Use Azure Portal, PowerShell or Azure CLI to change the replication setting as part of a failback operation only<sup>4</sup> |
| <b> GZRS</b>    |        | Convert to ZRS first, then migrate to LRS | Migrate | Convert to RA-GZRS first, then migrate to RA-GRS | Use Azure portal, PowerShell, or CLI | ***N/A*** | Use Azure portal, PowerShell, or CLI |
| <b> RA-GZRS</b> |        | Convert to ZRS first, then migrate to LRS | Convert to GZRS first, then migrate to GRS | Migrate | Use Azure portal, PowerShell, or CLI | Use Azure portal, PowerShell, or CLI | ***N/A*** |

<sup>1</sup> Converting from local to geo-redundancy incurs a one-time egress charge. See [Costs associated with changing how data is replicated](#costs-associated-with-changing-how-data-is-replicated). <br />
<sup>2</sup> Migrating from LRS to GRS is not supported if the storage account contains blobs in the archive tier. See [the section about Access tiers](#access-tier).<br />
<sup>3</sup> Live migration is supported for standard general-purpose v2 and premium file share storage accounts. Live migration is not supported for premium block blob or page blob storage accounts. While live migration is supported for premium file share storage accounts, it must be initiated by opening a support request with Microsoft. Customer-initiated live migration is not currently supported for Premium file share accounts. See [the storage account type section](#storage-account-type).<br />
<sup>4</sup> After an account failover to the secondary region, it's possible to initiate a failback from the new primary back to the new secondary with PowerShell or Azure CLI (version 2.30.0 or later). For more information, See [the failover and failback section](#failover-and-failback) and [use caution when failing back to the original primary](storage-disaster-recovery-guidance.md#use-caution-when-failing-back-to-the-original-primary).<br />
<sup>5</sup> Migrating from LRS to ZRS is not supported if the NFSv3 protocol support is enabled for Azure Blob Storage or if the storage account contains Azure Files NFSv4.1 shares. See [Protocol support](#protocol-support).<br />

## Restrictions

Restrictions apply to some replication change scenarios depending on:

- [Storage account type](#storage-account-type)
- [Region](#region)
- [Access tier](#access-tier)
- [Protocol support](#protocol-support)
- [Failover and failback](#failover-and-failback)

### Storage account type

When planning to change your replication settings, consider the following restrictions related to the storage account type.

Some storage account types only support certain replication configurations, which affects whether they can be simply changed, or require migration:

| Storage account type        | Supports LRS | Supports ZRS | Supports live migration | Supports manual migration |
|:----------------------------|:------------:|:------------:|:-----------------------:|:-------------------------:|
| Standard general purpose v2 | Yes          | Yes          | Yes                     | Yes                       |
| Premium file shares         | Yes          | Yes          | Yes <sp>1</sp>          | Yes                       |
| Premium block block blob    | Yes          | Yes          | No                      | Yes                       |
| Premium page blob           | Yes          | No           | No                      | No                        |
| Managed disks<sup>2</sup>   | Yes          | No           | No                      | No                        |
| Standard general purpose v1 | Yes          | No           | No <sup>3</sup>         | Yes                       |
| ZRS Classic<sup>4</sup><br /><sub>(available in standard general purpose v1 accounts)</sub>     | Yes          | No           | No                      | No                        |

<sup>1</sup> Currently, live migration for Premium file shares is only available by opening a support request; customer-initiated live migration is not yet supported.<br />
<sup>2</sup> Managed disks are only available for LRS and cannot be migrated to ZRS. You can store snapshots and images for standard SSD managed disks on standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/). For information about integration with availability sets, see [Introduction to Azure managed disks](../../virtual-machines/managed-disks-overview.md#integration-with-availability-sets).<br />
<sup>3</sup> If your storage account is v1, you'll need to upgrade it to v2 before performing a live migration. To learn how to upgrade your v1 account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md).<br />
<sup>4</sup> ZRS Classic storage accounts have been deprecated. For information about converting ZRS Classic accounts, see [Converting ZRS Classic accounts](#converting-zrs-classic-accounts).<br />

Note that live migration is supported for standard general-purpose v2 and premium file share storage accounts. It is not supported for premium block blob or page blob storage accounts.

#### Converting ZRS Classic accounts

> [!IMPORTANT]
> Microsoft will deprecate and migrate ZRS Classic accounts on March 31, 2021. More details will be provided to ZRS Classic customers before deprecation.
>
> After ZRS becomes generally available in a given region, customers will no longer be able to create ZRS Classic accounts from the Azure portal in that region. Using Microsoft PowerShell and Azure CLI to create ZRS Classic accounts is an option until ZRS Classic is deprecated. For information about where ZRS is available, see [Azure Storage redundancy](storage-redundancy.md).

ZRS Classic asynchronously replicates data across data centers within one to two regions. Replicated data may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

ZRS Classic is available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

To manually migrate ZRS account data to or from an LRS, GRS, RA-GRS, or ZRS Classic account, use one of the following tools: AzCopy, Azure Storage Explorer, PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.

You can also upgrade your ZRS Classic storage account to ZRS by using the Azure portal, PowerShell, or Azure CLI in regions where ZRS is available.

### Region

Make sure the region where your storage account is located supports all of the desired replication settings. For example, if you are converting your account to zone-redundant (ZRS, GZRS, or RA-GZRS), make sure your storage account is in a region that supports it. See the lists of supported regions for [Zone-redundant storage](storage-redundancy.md#zone-redundant-storage) and [Geo-zone-redundant storage](storage-redundancy.md#geo-zone-redundant-storage).

If you want to migrate your data into a zone-redundant storage account located in a region different than the source account, you must perform a manual migration. For more details, see [Move an Azure Storage account to another region](storage-account-move.md).

### Access tier

Ensure the desired replication option supports the access tier currently used in the storage account. For example, GZRS storage accounts do not currently support the archive tier. See [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md) for more details.

To change the redundancy configuration for a storage account that contains blobs in the Archive tier, you must first rehydrate all archived blobs to the Hot or Cool tier. Microsoft recommends that you avoid changing the redundancy configuration for a storage account that contains archived blobs if at all possible, because rehydration operations can be costly and time-consuming. Another option that avoids the rehydration expense is a [manual migration](#perform-a-manual-migration).

### Protocol support

Converting your storage account to zone-redundancy is not supported if the NFSv3 protocol support is enabled for Azure Blob Storage, or if the storage account contains Azure Files NFSv4.1 shares.

### Failover and failback

If you performed an [account failover](storage-disaster-recovery-guidance.md) for your (RA-)GRS or (RA-)GZRS account, the account is locally redundant (LRS) in the new primary region after the failover. Live migration to ZRS or GZRS for an LRS account resulting from a failover is not supported. This is true even in the case of so-called failback operations. For example, if you perform an account failover from RA-GZRS to the LRS in the secondary region, and then configure it again to RA-GRS and perform another account failover to the original primary region, you can't perform a live migration to RA-GZRS in the primary region. Instead, you'll need to perform a manual migration to ZRS or GZRS.

If you want to change an account from ZRS to GZRS or RA-GZRS, you can perform a migration unless you are performing a failback operation after failover.

## Downtime requirements

With live migration, no downtime is required but the migration process could take up to 72 hours to begin once requested. If you choose manual migration, downtime is required but you have more control over the timing of the migration process.

## Costs associated with changing how data is replicated

The costs associated with changing how data is replicated depend on your conversion path. Ordering from least to the most expensive, Azure Storage redundancy offerings include LRS, ZRS, GRS, RA-GRS, GZRS, and RA-GZRS.

For example, going *from* LRS to any other type of replication will incur additional charges because you are moving to a more sophisticated redundancy level. Migrating *to* GRS or RA-GRS will incur an egress bandwidth charge at the time of migration because your entire storage account is being replicated to the secondary region. All subsequent writes to the primary region also incur egress bandwidth charges to replicate the write to the secondary region. For details on bandwidth charges, see [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

If you migrate your storage account from GRS to LRS, there is no additional cost, but your replicated data is deleted from the secondary location.

> [!IMPORTANT]
> If you migrate your storage account from RA-GRS to GRS or LRS, that account is billed as RA-GRS for an additional 30 days beyond the date that it was converted.

## Change the replication setting using the portal, PowerShell, or the CLI

You can use the Azure portal, PowerShell, or Azure CLI to change the replication setting for a storage account, as long as you are not changing how data is replicated in the primary region. If you are migrating from LRS in the primary region to ZRS in the primary region or vice versa, then you must perform either a manual migration or a live migration.

Changing how your storage account is replicated does not result in down time for your applications.

# [Portal](#tab/portal)

To change the redundancy option for your storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. **Save**.

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

## Storage account migration

There are two supported methods for migrating your storage account:

- [Live migration](#perform-a-live-migration)
- [Manual migration](#perform-a-manual-migration)

Live migration is the preferred method if:

- Data availability must be maintained during the migration process
- The exact timing of the migration is not critical
- You want to minimize the amount of effort required to complete the migration

Manual migration might be the best option if you want the most control over the process, including the timing. It might be the only option in scenarios where live migration is not supported.

You must perform a manual migration if:

- You want to migrate your data into a ZRS storage account that is located in a region different than the source account.
- Your storage account is a premium page blob or block blob account.
- Your storage account includes data in the archive tier and rehydrating the data is not desired.

### Perform a live migration

The live migration option is available in most scenarios where you want to change zone-redundancy. The only exceptions are those previously noted under [Restrictions](#restrictions).

During a live migration, you can access data in your storage account with no loss of durability or availability. The Azure Storage SLA is maintained during the migration process and there is no data loss associated with a live migration. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to ZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data.

#### Customer-initiated live migration

> [!IMPORTANT]
> Customer-initiated live migration is currently in preview.
> This preview version is provided without a service level agreement, and might not be suitable for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Customer-initiated live migration replaces the previous requirement to create a support request to perform a live migration. Now an Azure customer can easily initiate the migration from within the Azure portal. Once initiated, the migration could still take up to 72 hours to begin, but potential delays related to opening and managing a support request are eliminated.

Customer-initiated live migration is only available from the Azure portal, not from PowerShell or the Azure CLI. To initiate the migration, perform the same steps used for changing other replication factors in the Azure portal as described in [Change the replication setting using the portal, PowerShell, or the CLI](#change-the-replication-setting-using-the-portal-powershell-or-the-cli).

#### Support-requested live migration

Customer-initiated live migration is preferred over requesting it by opening a support request. However, if you do not want to use the preview feature, you can still request live migration through the [Azure Support portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

> [!IMPORTANT]
> If you need to migrate more than one storage account, create a single support ticket and specify the names of the accounts to convert on the **Details** tab.

Follow these steps to request a live migration:

1. In the Azure portal, navigate to a storage account that you want to migrate.
1. Under **Support + troubleshooting**, select **New Support Request**.
1. Complete the **Basics** tab based on your account information:
    - **Issue type**: Select **Technical**.
    - **Service**: Select **My Services**, then **Storage Account Management**.
    - **Resource**: Select a storage account to migrate. If you need to specify multiple storage accounts, you can do so in the **Details** section.
    - **Problem type**: Choose **Data Migration**.
    - **Problem subtype**: Choose **Migrate to ZRS, GZRS, or RA-GZRS**.

    :::image type="content" source="media/redundancy-migration/request-live-migration-basics-portal.png" alt-text="Screenshot showing how to request a live migration - Basics tab":::

1. Select **Next**. On the **Solutions** tab, you can check the eligibility of your storage accounts for migration.
1. Select **Next**. If you have more than one storage account to migrate, then on the **Details** tab, specify the name for each account, separated by a semicolon.

    :::image type="content" source="media/redundancy-migration/request-live-migration-details-portal.png" alt-text="Screenshot showing how to request a live migration - Details tab":::

1. Fill out the additional required information on the **Details** tab, then select **Review + create** to review and submit your support ticket. A support person will contact you to provide any assistance you may need.

### Perform a manual migration

A manual migration provides more flexibility and control than a live migration, so you can use this option if you need the migration to complete by a certain date.

> [!IMPORTANT]
> A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a [live migration](#perform-a-live-migration) option. A live migration is an in-place migration with no downtime.

You must perform a manual migration if:

- You want to migrate your data into a ZRS storage account that is located in a region different than the source account.
- Your storage account is a premium page blob or block blob account.
- Your storage account includes data in the archive tier and rehydrating the data is not desired.
- You want to perform a migration that is normally a two-step process in a single step. For example, when you perform a manual migration from LRS to ZRS in the primary region or vice versa, the destination storage account can be geo-redundant and can also be configured for read access to the secondary region. So you can migrate an LRS account to a GZRS or RA-GZRS account in one step.

You cannot perform a manual migration if:

- You want to  migrate from ZRS to GZRS or RA-GZRS. You must request a live migration.

With a manual migration, you copy the data from your existing storage account to a new storage account, such as one that uses ZRS in the primary region. To perform a manual migration, you can use one of the following options:

- Copy data by using an existing tool such as AzCopy, one of the Azure Storage client libraries, or a reliable third-party tool.
- If you're familiar with Hadoop or HDInsight, you can attach both the source storage account and destination storage account account to your cluster. Then, parallelize the data copy process with a tool like DistCp.

For more details, see [Move an Azure Storage account to another region](storage-account-move.md).

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

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
