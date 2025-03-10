---
title: Change redundancy configuration for Azure Files
description: Learn how to change how Azure Files data in an existing storage account is replicated.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/15/2025
ms.author: kendownie
ms.custom: references_regions, devx-track-azurepowershell
---

# Change how Azure Files data is replicated

Azure always stores multiple copies of your data to protect it in the face of both planned and unplanned events. These events include transient hardware failures, network or power outages, and natural disasters. Data redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Microsoft Online Services](https://azure.microsoft.com/support/legal/sla/storage/).

This article describes the process of changing replication settings for an existing storage account that hosts Azure file shares.

## Options for changing the replication type

When deciding which redundancy configuration is best for your scenario, consider the tradeoffs between lower costs and higher availability. The factors that help determine which redundancy configuration you should choose include:

- **How your data is replicated within the primary region.** Data in the primary region can be replicated locally using [locally redundant storage (LRS)](files-redundancy.md#locally-redundant-storage), or across Azure availability zones using [zone-redundant storage (ZRS)](files-redundancy.md#zone-redundant-storage).
- **Whether your data requires geo-redundancy.** Geo-redundancy provides protection against regional disasters by replicating your data to a second region that is geographically distant to the primary region. Azure Files supports both [geo-redundant storage (GRS)](files-redundancy.md#geo-redundant-storage) and [geo-zone-redundant storage (GZRS)](files-redundancy.md#geo-zone-redundant-storage).

> [!IMPORTANT]
> Azure Files doesn't support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). If a storage account is configured to use RA-GRS or RA-GZRS, the file shares will be configured and billed as GRS or GZRS.

For a detailed overview of all of the redundancy options for Azure Files, see [Azure Files redundancy](files-redundancy.md).

You can change your storage account's redundancy configurations as needed, though some configurations are subject to [limitations](#limitations-for-changing-replication-types) and [downtime requirements](#downtime-requirements). Reviewing these limitations and requirements before making any changes within your environment helps avoid conflicts with your own timeframe and uptime requirements.

There are three ways to change the replication settings:

- [Add or remove geo-redundancy or read access](#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to the secondary region.
- [Add or remove zone-redundancy](#perform-a-conversion) by performing a conversion.
- [Perform a manual migration](#manual-migration) in scenarios where the first two options aren't supported, or to ensure the change is completed within a specific timeframe.

Geo-redundancy and read-access can be changed at the same time. However, any change that also involves zone-redundancy requires a conversion and must be performed separately using a two-step process. These two steps can be performed in any order.

### Changing redundancy configuration

The following table provides an overview of how to switch between replication types.

> [!NOTE]
> Manual migration is an option for any scenario in which you want to change the replication setting within the [limitations for changing replication types](#limitations-for-changing-replication-types). The manual migration option is excluded from the following table for simplification.

| Switching | …to LRS | …to GRS <sup>6</sup> | …to ZRS | …to GZRS <sup>2,6</sup> |
|--------------------|----------------------------------------------------|---------------------------------------------------------------------|----------------------------------------------------|---------------------------------------------------------------------|
| **…from LRS** | **N/A** | Use [Azure portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) <sup>1,2</sup> | [Perform a conversion](#perform-a-conversion)<sup>2,3,4,5</sup> | First, use the [Portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to switch to GRS <sup>1</sup>, then [perform a conversion](#perform-a-conversion) to GZRS <sup>3,4,5</sup> |
| **…from GRS** | Use [Azure portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) | **N/A** | First, use the [Portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to switch to LRS, then [perform a conversion](#perform-a-conversion) to ZRS <sup>3,5</sup> | [Perform a conversion](#perform-a-conversion)<sup>3,5</sup> |
| **…from ZRS** | [Perform a conversion](#perform-a-conversion)<sup>3</sup> | First, use the [Portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to switch to GZRS, then [perform a conversion](#perform-a-conversion) to GRS<sup>3</sup> | **N/A** | Use [Azure portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) <sup>1</sup> |
| **…from GZRS** | First, use the [Portal](files-change-redundancy-configuration.md?tabs=portal#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), [PowerShell](files-change-redundancy-configuration.md?tabs=powershell#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli), or [CLI](files-change-redundancy-configuration.md?tabs=azure-cli#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to switch to ZRS, then [perform a conversion](#perform-a-conversion) to LRS <sup>3</sup> | [Perform a conversion](#perform-a-conversion)<sup>3</sup> | [Use Azure portal, PowerShell, or CLI](#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli)| **N/A** |

<sup>1</sup> [Adding geo-redundancy incurs a one-time egress charge](#costs-associated-with-changing-how-data-is-replicated).<br />
<sup>2</sup> If your storage account contains blobs in the archive tier, review the [access tier limitations](../common/redundancy-migration.md#access-tier) before changing the redundancy type to geo- or zone-redundant.<br />
<sup>3</sup> The type of conversion supported depends on the storage account type. For more information, see the [storage account table](#storage-account-type).<br />
<sup>4</sup> Conversion to ZRS or GZRS for an LRS account resulting from a failover isn't supported. For more information, see [Failover and failback](#failover-and-failback).<br />
<sup>5</sup> Converting from LRS to ZRS [isn't supported if the NFSv3 protocol support is enabled for Azure Blob Storage or if the storage account contains Azure Files NFSv4.1 shares with public endpoints enabled](#protocol-support). <br />
<sup>6</sup> Even though enabling geo-redundancy appears to occur instantaneously, failover to the secondary region can't be initiated until data synchronization between the two regions is complete.<br />

## Change the replication setting

Depending on your scenario from the [changing redundancy configuration](#changing-redundancy-configuration) section, use one of the following methods to change your replication settings.

### Change the redundancy configuration using Azure portal, PowerShell, or Azure CLI

In most cases you can use the Azure portal, PowerShell, or the Azure CLI to change the geo-redundant or read access (RA) replication setting for a storage account.

Changing how your storage account is replicated in the Azure portal doesn't result in down time for your applications, including changes that require a conversion.

# [Portal](#tab/portal)

To change the redundancy option for your storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. Select **Save**.

    :::image type="content" source="../common/media/redundancy-migration/change-replication-option-sml.png" alt-text="Screenshot showing how to change replication option in portal." lightbox="../common/media/redundancy-migration/change-replication-option.png":::

# [PowerShell](#tab/powershell)

You can use Azure PowerShell to change the redundancy options for your storage account.

To change between locally redundant and geo-redundant storage, call the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) cmdlet and specify the `-SkuName` parameter.

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> `
    -Name <storage_account> `
    -SkuName <sku>
```

# [Azure CLI](#tab/azure-cli)

You can use the Azure CLI to change the redundancy options for your storage account.

To change between locally redundant and geo-redundant storage, call the [az storage account update](/cli/azure/storage/account#az-storage-account-update) command and specify the `--sku` parameter:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --sku <sku>
```

---

### Perform a conversion

A redundancy "conversion" is the process of changing the zone-redundancy aspect of a storage account.

During a conversion, there's [no data loss or application downtime required](#downtime-requirements).

There are two ways to initiate a conversion:

- [Customer-initiated](#customer-initiated-conversion)
- [Support-initiated](#support-initiated-conversion)

> [!TIP]
> Microsoft recommends using a customer-initiated conversion instead of support-initiated conversion whenever possible. A customer-initiated conversion allows you to initiate the conversion and monitor its progress directly from within the Azure portal. Because the conversion is initiated by the customer, there is no need to create and manage a support request.

#### Customer-initiated conversion

Instead of opening a support request, customers in most regions can start a conversion and monitor its progress. This option eliminates potential delays related to creating and managing support requests. For help determining the regions in which customer-initiated conversion is supported, see the [region limitations](#region) article.

For standard file shares, customer-initiated conversion can be completed in supported regions using the Azure portal, PowerShell, or the Azure CLI. 

For premium file shares, customer-initiated conversion is available through PowerShell and Azure CLI. Or you can request a [support-initiated conversion](#support-initiated-conversion).

After initiation, the conversion could still take up to 72 hours to begin.

> [!IMPORTANT]
> There is no SLA for completion of a conversion.
>
> If you need more control over when a conversion begins and finishes, consider a [Manual migration](#manual-migration). Generally, the more data you have in your account, the longer it takes to replicate that data to other zones or regions.
>
> For more information about the timing of a customer-initiated conversion, see [Timing and frequency](#timing-and-frequency).

# [Portal](#tab/portal)

To add or modify a storage account's zonal-redundancy within the Azure portal, perform these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. Select **Save**.

    :::image type="content" source="../common/media/redundancy-migration/change-replication-zone-option-sml.png" alt-text="Screenshot showing how to change the zonal-replication option in portal." lightbox="../common/media/redundancy-migration/change-replication-zone-option.png":::

# [PowerShell](#tab/powershell)

To change between locally redundant and zone-redundant storage with PowerShell, call the [Start-AzStorageAccountMigration](/powershell/module/az.storage/start-azstorageaccountmigration) command and specify the `-TargetSku` parameter:

```powershell
Start-AzStorageAccountMigration
    -AccountName <String>
    -ResourceGroupName <String>
    -TargetSku <String>
    -AsJob
```

# [Azure CLI](#tab/azure-cli)

To change between locally redundant and zone-redundant storage with Azure CLI, call the [az storage account migration start](/cli/azure/storage/account/migration#az-storage-account-migration-start) command and specify the `--sku` parameter:

```azurecli-interactive
az storage account migration start  \
    -- account-name <string> \
    -- g <string> \
    --sku <string> \
    --no-wait
```

---

##### Monitoring customer-initiated conversion progress

As the conversion request is evaluated and processed, the status should progress through the list shown in the following table:

| Status                                         | Explanation                                                                          |
|------------------------------------------------|--------------------------------------------------------------------------------------|
| Submitted for conversion                       | The conversion request was successfully submitted for processing.                    |
| In Progress<sup>1</sup>                        | The conversion is in progress.                                                |
| Completed<br>**- or -**</br>Failed<sup>2</sup> | The conversion is completed successfully.<br>**- or -**</br>The conversion failed.                 |

<sup>1</sup> Once initiated, the conversion could take up to 72 hours to begin. If the conversion doesn't enter the "In Progress" status within 96 hours of initiating the request, submit a support request to Microsoft to determine why. For more information about the timing of a customer-initiated conversion, see [Timing and frequency](#timing-and-frequency).<br />
<sup>2</sup> If the conversion fails, submit a support request to Microsoft to determine the reason for the failure.<br />

> [!NOTE]
> While Microsoft handles your request for a conversion promptly, there's no guarantee as to when it will complete. If you need your data converted by a certain date, Microsoft recommends that you perform a manual migration instead.
>
> Generally, the more data you have in your account, the longer it takes to replicate that data to other zones in the region.

# [Portal](#tab/portal)

The status of your customer-initiated conversion is displayed on the **Redundancy** page of the storage account:

:::image type="content" source="../common/media/redundancy-migration/change-replication-status-sml.png" alt-text="Screenshot showing the status of the conversion request on the Redundancy page of the Azure portal." lightbox="../common/media/redundancy-migration/change-replication-status.png":::

# [PowerShell](#tab/powershell)

To track the current migration status of the conversion initiated on your storage account, call the [Get-AzStorageAccountMigration](/powershell/module/az.storage/get-azstorageaccountmigration) cmdlet:

```powershell
Get-AzStorageAccountMigration
   -AccountName <String>
   -ResourceGroupName <String>
```

# [Azure CLI](#tab/azure-cli)

To track the current migration status of the conversion initiated on your storage account, use the [az storage account migration show](/cli/azure/storage/account/migration#az-storage-account-migration-show) command:

```azurecli-interactive
az storage account migration show \
    --account-name <string> \
    - g <sting> \
    -n "default"
```

---

#### Support-initiated conversion

Customers can request a conversion by opening a support request with Microsoft.

> [!TIP]
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

    :::image type="content" source="../common/media/redundancy-migration/request-live-migration-problem-desc-portal-sml.png" alt-text="Screenshot showing how to request a conversion - Problem description tab." lightbox="../common/media/redundancy-migration/request-live-migration-problem-desc-portal.png":::

1. Select **Next**. The **Recommended solution** tab might be displayed briefly before it switches to the **Solutions** page. On the **Solutions** page, you can check the eligibility of your storage account(s) for conversion:
    - **Target replication type**: (choose the desired option from the drop-down)
    - **Storage accounts from**: (enter a single storage account name or a list of accounts separated by semicolons)
    - Select **Submit**.

    :::image type="content" source="../common/media/redundancy-migration/request-live-migration-solutions-portal-sml.png" alt-text="Screenshot showing how to check the eligibility of your storage account(s) for conversion - Solutions page." lightbox="../common/media/redundancy-migration/request-live-migration-solutions-portal.png":::

1. Take the appropriate action if the results indicate your storage account isn't eligible for conversion. Otherwise, select **Return to support request**.

1. Select **Next**. If you have more than one storage account to migrate, on the **Details** tab, specify the name for each account, separated by a semicolon.

    :::image type="content" source="../common/media/redundancy-migration/request-live-migration-details-portal-sml.png" alt-text="Screenshot showing how to request a conversion - Additional details tab." lightbox="../common/media/redundancy-migration/request-live-migration-details-portal.png":::

1. Provide the required information on the **Additional details** tab, then select **Review + create** to review and submit your support ticket. An Azure support agent reviews your case and contacts you to provide assistance.

### Manual migration

A manual migration provides more flexibility and control than a conversion. You can use this option if you need your data moved by a certain date, or if conversion [isn't supported for your scenario](#limitations-for-changing-replication-types). Manual migration is also useful when moving a storage account to another region. For more detail, see [Move an Azure Storage account to another region](../common/storage-account-move.md).

You must perform a manual migration if you want to migrate your storage account to a different region.

> [!IMPORTANT]
> A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a [conversion](#perform-a-conversion) option. A conversion is an in-place migration with no downtime.

With a manual migration, you copy the data from your existing storage account to a new storage account. To perform a manual migration, you can use one of the following options:

- Copy data by using an existing tool such as AzCopy, one of the Azure Storage client libraries, or a reliable non-Microsoft tool.
- If you're familiar with Hadoop or HDInsight, you can attach both the source storage account and destination storage account to your cluster. Then, parallelize the data copy process with a tool like DistCp.

For more detailed guidance on how to perform a manual migration, see [Move an Azure Storage account to another region](../common/storage-account-move.md).

## Limitations for changing replication types

> [!IMPORTANT]
> Boot diagnostics doesn't support premium storage accounts or zone-redundant storage accounts. When either premium or zone-redundant storage accounts are used for boot diagnostics, users receive a `StorageAccountTypeNotSupported` error upon starting their virtual machine (VM).

Limitations apply to some replication change scenarios depending on:

- [Region](#region)
- [Feature conflicts](#feature-conflicts)
- [Storage account type](#storage-account-type)
- [Protocol support](#protocol-support)
- [Failover and failback](#failover-and-failback)

### Region

Make sure the region where your storage account is located supports all of the desired replication settings. For example, if you're converting your account to zone-redundant (ZRS or GZRS), make sure your storage account is in a region that supports it. See the lists of supported regions for [Zone-redundant storage](files-redundancy.md#zone-redundant-storage) and [Geo-zone-redundant storage](files-redundancy.md#geo-zone-redundant-storage).

> [!IMPORTANT]
> [Customer-initiated conversion](#customer-initiated-conversion) from LRS to ZRS is available in all public regions that support ZRS except for the following:
>
> - (North America) Mexico Central
>
> [Customer-initiated conversion](#customer-initiated-conversion) from existing ZRS accounts to LRS is available in all public regions.

### Feature conflicts

Some storage account features aren't compatible with other features or operations. For example, the ability to fail over to the secondary region is the key feature of geo-redundancy, but other features aren't compatible with failover. For more information about features and services not supported with failover, see [Unsupported features and services](../common/storage-disaster-recovery-guidance.md#unsupported-features-and-services). The conversion of an account to GRS or GZRS might be blocked if a conflicting feature is enabled, or it might be necessary to disable the feature later before initiating a failover.

### Storage account type

When planning to change your replication settings, consider the following limitations related to the storage account type.

Some storage account types only support certain redundancy configurations, which affect whether they can be converted or migrated and, if so, how. For more information on Azure storage account types and the supported redundancy options, see [the storage account overview](../common/storage-account-overview.md#types-of-storage-accounts).

The following table lists the redundancy options available for storage account types and whether conversion and manual migration are supported:

| Storage account type        | Supports LRS | Supports ZRS | Supports conversion<br>(from the Azure portal) | Supports conversion<br>(by support request) | Supports manual migration |
|:----------------------------|:------------:|:------------:|:-----------------------:|:-------------------------:|:-------------------------:|
| Standard general purpose v2 | &#x2705;     | &#x2705;     | &#x2705;                | &#x2705;                  | &#x2705;                  |
| Premium file shares         | &#x2705;     | &#x2705;     | &#x2705;                | &#x2705; <sup>1</sup>     | &#x2705;                  |

<sup>1</sup> Customer-initiated conversion can be undertaken using [Azure Portal](../common/redundancy-migration.md?tabs=portal#customer-initiated-conversion), [PowerShell](../common/redundancy-migration.md?tabs=powershell#customer-initiated-conversion) or the [Azure CLI](../common/redundancy-migration.md?tabs=azure-cli#customer-initiated-conversion). You can also [open a support request](#support-initiated-conversion).<br />

### Protocol support

You can't convert storage accounts to zone-redundancy (ZRS or GZRS) if either of the following cases are true:

- NFSv3 protocol support is enabled for Azure Blob Storage
- The storage account contains Azure Files NFSv4.1 shares with public endpoint access enabled

Converting **NFSv4.1 shares with public endpoints enabled isn't supported**. To change redundancy for NFS shares with public endpoints, follow these steps in order:

1. [Disable access](storage-files-networking-endpoints.md#restrict-public-endpoint-access) to the storage account's public endpoint.
1. Submit the conversion request to change redundancy of the given storage account.
1. Once the storage account is migrated, [configure private or public endpoints](storage-files-networking-endpoints.md) as required.

### Failover and failback

After an account failover to the secondary region, it's possible to initiate a failback from the new primary back to the new secondary with PowerShell or Azure CLI (version 2.30.0 or later). [Initiate the failover](../common/storage-initiate-account-failover.md#initiate-the-failover).

If you performed a customer-managed account failover to recover from an outage for your GRS account, the account becomes locally redundant (LRS) in the new primary region after the failover. Conversion to ZRS or GZRS for an LRS account resulting from a failover isn't supported, even for so-called failback operations. For example, if you perform an account failover from GRS to LRS in the secondary region, and then configure it again as GRS, it remains LRS in the new secondary region (the original primary). If you then perform another account failover to failback to the original primary region, it remains LRS again in the original primary. In this case, you can't perform a conversion to ZRS or GZRS in the primary region. Instead, perform a manual migration to add zone-redundancy.

## Downtime requirements

During a [conversion](#perform-a-conversion), you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and no data is lost during a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

If you choose to perform a manual migration, downtime is required but you have more control over the timing of the migration process.

## Timing and frequency

The customer-initiated zone-redundancy [conversion process](#customer-initiated-conversion) could take up to 72 hours to begin after initiation, but can take longer due to resource availability, data volume, and other factors. It could take longer to start if you [request a conversion by opening a support request](#support-initiated-conversion).  To monitor the progress of a customer-initiated conversion, see [Monitoring customer-initiated conversion progress](#monitoring-customer-initiated-conversion-progress).

> [!IMPORTANT]
> There is no SLA for completion of a conversion. If you need more control over when a conversion begins and finishes, consider a [Manual migration](#manual-migration). Generally, the more data you have in your account, the longer it takes to replicate that data to other zones or regions.

After a zone-redundancy conversion, you must wait at least 72 hours before changing the redundancy setting of the storage account again. The temporary hold allows background processes to complete before making another change, ensuring the consistency and integrity of the account. For example, going from LRS to GZRS is a two-step process. You must add zone redundancy in one operation, then add geo-redundancy in a second. After going from LRS to ZRS, you must wait at least 72 hours before going from ZRS to GZRS.

## Costs associated with changing how data is replicated

Azure Files offers several options for configuring replication. These options, ordered by least- to most-expensive, include:

- LRS
- ZRS
- GRS
- GZRS

The costs associated with changing how data is replicated in your storage account depend on which [aspects of your redundancy configuration](#options-for-changing-the-replication-type) you change. A combination of data storage and egress bandwidth pricing determines the cost of making a change. For details on pricing, see [Azure Files Pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

If you add zone-redundancy in the primary region, there's no initial cost associated with making that conversion, but the ongoing data storage cost is higher due to the increased replication and storage space required.

Geo-redundancy incurs an egress bandwidth charge at the time of the change because your entire storage account is being replicated to the secondary region. All subsequent writes to the primary region also incur egress bandwidth charges to replicate the write to the secondary region.

If you remove geo-redundancy (change from GRS to LRS), there's no cost for making the change, but your replicated data is deleted from the secondary location.

## See also

- [Azure Files redundancy](files-redundancy.md)
