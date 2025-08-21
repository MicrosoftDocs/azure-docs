---
title: Change how a ZRS Classic storage account is replicated
titleSuffix: Azure Storage
description: Learn how to change how data in an existing storage account is replicated.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/21/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
# Customer intent: "As a cloud administrator, I want to change the replication settings of my ZRS Classic storage account, so that I can optimize cost and availability based on my organization's data protection requirements."
---

# Change how a storage account is replicated

Azure Storage always stores multiple copies of your data to protect it in the face of both planned and unplanned events. These events include transient hardware failures, network or power outages, and massive natural disasters. Data redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/), even in the face of failures.

This article describes the process of changing replication settings for an existing storage account.

## Options for changing the replication type

When deciding which redundancy configuration is best for your scenario, consider the tradeoffs between lower costs and higher availability. The factors that help determine which redundancy configuration you should choose include:

- **How your data is replicated within the primary region.** Data in the primary region can be replicated locally using [locally redundant storage (LRS)](storage-redundancy.md#locally-redundant-storage), or across Azure availability zones using [zone-redundant storage (ZRS)](storage-redundancy.md#zone-redundant-storage).
- **Whether your data is geo-replicated.** Geo-replication provides protection against regional disasters by replicating your data to a second region that is geographically distant to the primary region. Geo-replicated configurations include [geo-redundant storage (GRS)](storage-redundancy.md#geo-redundant-storage) and [geo-zone-redundant storage (GZRS)](storage-redundancy.md#geo-zone-redundant-storage).
- **Whether your application requires read access to the replicated data in the secondary region.** You can configure your storage account to allow read access to data replicated to the secondary region if the primary region becomes unavailable for any reason. Configurations that provide [read access to data in the secondary region](storage-redundancy.md#read-access-to-data-in-the-secondary-region) include read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS).

For a detailed overview of all of the redundancy options, see [Azure Storage redundancy](storage-redundancy.md).

You can change your storage account's redundancy configurations as needed, though some configurations are subject to [limitations](#limitations-for-changing-replication-types) and [downtime requirements](#downtime-requirements). Reviewing these limitations and requirements before making any changes within your environment helps avoid conflicts with your own timeframe and uptime requirements.

There are three ways to change the replication settings:

- [Add or remove geo-replication or read access](#change-the-redundancy-configuration-using-azure-portal-powershell-or-azure-cli) to the secondary region.
- [Add or remove zone-redundancy](#perform-a-conversion) by performing a conversion.
- [Perform a manual migration](#manual-migration) in scenarios where the first two options aren't supported, or to ensure the change is completed within a specific timeframe.

Geo-redundancy and read-access can be changed at the same time. However, any change that also involves zone-redundancy requires a conversion and must be performed separately using a two-step process. These two steps can be performed in any order.

#### Converting ZRS Classic accounts

> [!IMPORTANT]
> ZRS Classic accounts were deprecated on March 31, 2021. Customers can no longer create ZRS Classic accounts. If you still have some, you should upgrade them to general purpose v2 accounts.

ZRS Classic was available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

ZRS Classic accounts asynchronously replicated data across data centers within one to two regions. Replicated data wasn't available unless Microsoft initiated a failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

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

If you want to migrate your data into a zone-redundant storage account located in a region different from the source account, you must perform a manual migration. For more information, see [Move an Azure Storage account to another region](storage-account-move.md).

## Downtime requirements

During a [conversion](#perform-a-conversion), you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and no data is lost during a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

If you choose to perform a manual migration, downtime is required but you have more control over the timing of the migration process.

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
