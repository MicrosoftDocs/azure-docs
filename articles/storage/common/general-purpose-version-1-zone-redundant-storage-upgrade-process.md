---
title: How to upgrade a General Purpose v1 (GPv1) with ZRS redundancy account to GPv2
titleSuffix: Azure Storage
description: Learn how to upgrade a ZRS Classic storage account to a General Purpose V2 account.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/21/2025
ms.author: normesta
ms.subservice: storage-common-concepts
# Customer intent: "As a cloud administrator, I want to upgrade from my General Purpose V1 Zone Redundant Storage (ZRS) storage account, to a General Purpose V2 account, so that I can take advantage of the latest features and improvements."
---

# Upgrade General Purpose v1 (GPv1) with ZRS redundancy to GPv2

> [!IMPORTANT]
> General purpose V1 account with ZRS redundancy will be retired in October 2026. Customers will no longer create general purpose v1 (GPv1) with ZRS redundancy accounts after Q1, 2026. Existing GPv1 with ZRS redundancy accounts must be upgraded to general purpose v2 (GPv2) before October 13, 2026 to avoid service disruption. See [GPv1 standard ZRS account retirement FAQ](general-purpose-v-1-zone-redundant-storage-migration-freq-asked-questions.md) for more information.

General purpose v1 (GPv1) with ZRS redundancy was available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

General purpose v1 (GPv1) with ZRS redundancy asynchronously replicated data across data centers within one to two regions. Replicated data wasn't available unless Microsoft initiated a failover to the secondary. A general purpose v1 (GPv1) with ZRS redundancy account can't be converted to or from LRS, GRS, or RA-GRS.

To upgrade your general purpose v1 (GPv1) with ZRS redundancy account to GPv2, use the Azure portal, PowerShell, or Azure CLI in regions where GPv2 is available:

# [Portal](#tab/portal)

To upgrade to GPv2 in the Azure portal, navigate to the **Configuration** settings of the account and choose **Upgrade**.

:::image type="content" source="media/redundancy-migration/portal-zrs-classic-upgrade.png" alt-text="<Screenshot of a storage account setup screen with options for upgrade, performance, replication, and Data Lake features.>":::
<!---![Upgrade to GPv2 in the Portal](media/redundancy-migration/portal-zrs-classic-upgrade.png) -->

# [PowerShell](#tab/powershell)

To upgrade to GPv2 using PowerShell, call the following command:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage_account> -UpgradeToStorageV2
```
> [!NOTE]
> If you are in a region that does not support GPv2 with ZRS redundancy, you will not be able to upgrade your GPv1 account to GPv2 with ZRS redundancy. You will need to contact support to upgrade to GPv2 with LRS or GRS redundancy instead. Or migrate your account to a region that supports ZRS.
> For more information about regions that do not support ZRS, see [Regions without ZRS support](./general-purpose-version-1-zone-redundant-storage-migration-overview.md#regions-without-zrs-support). For more information about what information is required when contacting support, see [Information required for support request](./general-purpose-version-1-zone-redundant-storage-migration-overview.md#information-required-for-support-request).

# [Azure CLI](#tab/azure-cli)

To upgrade to ZRS using Azure CLI, call the following command:

```cli
az storage account update -g <resource_group> -n <storage_account> --set kind=StorageV2
```
---

## Downtime requirements

During a conversion, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and no data is lost during a conversion. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

If you choose to perform a manual migration, downtime is required but you have more control over the timing of the migration process.

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
