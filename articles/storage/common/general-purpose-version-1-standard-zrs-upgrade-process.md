---
title: Change how a ZRS Classic storage account is replicated
titleSuffix: Azure Storage
description: Learn how to change how to upgrade a ZRS Classic storage account to a General Purpose V2 account.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/21/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
# Customer intent: "As a cloud administrator, I want to upgrade from my General Purpose V1 Zone Redundant Storage (ZRS) storage account, to a General Purpose V2 account, so that I can take advantage of the latest features and improvements."
---

# Upgrade General Purpose v1 (GPv1) with ZRS redundancy account to GPv2

> [!IMPORTANT]
>  General Purpose V1 account with ZRS redundancy were deprecated on March 31, 2021. Customers can no longer create General Purpose v1 (GPv1) with ZRS redundancy accounts. If you still have some, you should upgrade them to General Purpose v2 (GPv2) accounts.

General Purpose v1 (GPv1) with ZRS redundancy was available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

General Purpose v1 (GPv1) with ZRS redundancy asynchronously replicated data across data centers within one to two regions. Replicated data wasn't available unless Microsoft initiated a failover to the secondary. A General Purpose v1 (GPv1) with ZRS redundancy account can't be converted to or from LRS, GRS, or RA-GRS.


To upgrade your General Purpose v1 (GPv1) with ZRS redundancy account to GPv2, use the Azure portal, PowerShell, or Azure CLI in regions where GPv2 is available:

# [Portal](#tab/portal)

To upgrade to GPv2 in the Azure portal, navigate to the **Configuration** settings of the account and choose **Upgrade**:

![Upgrade to GPv2 in the Portal](media/redundancy-migration/portal-zrs-classic-upgrade.png)

# [PowerShell](#tab/powershell)

To upgrade to GPv2 using PowerShell, call the following command:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage_account> -UpgradeToStorageV2
```

# [Azure CLI](#tab/azure-cli)

To upgrade to ZRS using Azure CLI, call the following command:

```cli
az storage account update -g <resource_group> -n <storage_account> --set kind=StorageV2
```

---


## Downtime requirements

During a [conversion](#perform-a-conversion), you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and no data is lost during a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

If you choose to perform a manual migration, downtime is required but you have more control over the timing of the migration process.

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
