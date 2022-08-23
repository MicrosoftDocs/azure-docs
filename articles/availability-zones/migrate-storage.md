---
title: Migrate Azure Storage accounts to availability zone support 
description: Learn how to migrate your Azure storage accounts to availability zone support.
author: anaharris-ms
ms.service: storage
ms.topic: conceptual
ms.date: 08/23/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate Azure Storage accounts to availability zone support

This guide describes how to migrate Azure Storage accounts from non-availability zone support to availability zone support. We'll take you through the different options for migration.

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the Service-Level Agreement (SLA) for Azure Storage even in the face of failures.

Azure Storage offers the following types of replication:

- Locally redundant storage (LRS)
- Zone-redundant storage (ZRS)
- Geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS)
- Geo-zone-redundant storage (GZRS) or read-access geo-zone-redundant storage (RA-GZRS)

For an overview of each of these options, see [Azure Storage redundancy](../storage/common/storage-redundancy.md).

You can switch a storage account from one type of replication to any other type, but some switching scenarios are more straightforward than others.

Changes between local and geo-redundant storage, or between non-read-access (RA) and read-access (RA) storage are simple changes that can be made easily using the Azure portal, PowerShell or the Azure CLI. But changes between zone-redundant and non-zone-redundant replication types require migration of the data in the storage account within the primary region and can take considerably longer.

This article describes two basic options for migrating your storage account to availability zone support:

- [Live migration](#migration-option-1-live-migration)
- [Manual migration](#migration-option-2-manual-migration)

> [!NOTE]
> For details on how to switch from **any** Azure storage replication configuration to **any** other, see [Change how a storage account is replicated](../storage/common/redundancy-migration.md).

## Prerequisites

- Make sure your storage account(s) are in a region that supports ZRS. To determine whether or not the region supports ZRS, see [Zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage).

- Confirm that your storage account(s) is a general-purpose v2 account. If your storage account is v1, you'll need to upgrade it to v2. To learn how to upgrade your v1 account, see [Upgrade to a general-purpose v2 storage account](../storage/common/storage-account-upgrade.md).

## Downtime requirements

If you choose manual migration, downtime is required but you have more control over when the migration starts. If you choose live migration, there's no downtime requirement but the migration process could take up to 72 hours to begin.

## Migration option 1: Live migration

### When to perform a live migration

Perform a live migration if:

- You want to migrate your storage account from LRS to ZRS in the primary region with no application downtime.

- You want to migrate your storage account from ZRS to GZRS or RA-GZRS.

- You don't need the migration to be completed by a certain date. While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete.  Generally, the more data you have in your account, the longer it takes to migrate that data.

### Live migration considerations

During a live migration, you can access data in your storage account with no loss of durability or availability. The Azure Storage SLA is maintained during the migration process. There's no data loss associated with a live migration. Service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

However, be aware of the following limitations:

- The archive tier is not currently supported for ZRS accounts.

- Unmanaged disks don't support ZRS or GZRS.

- Only general-purpose v2 storage accounts support GZRS and RA-GZRS. GZRS and RA-GZRS support block blobs, page blobs (except for VHD disks), files, tables, and queues.

- Live migration from LRS to ZRS isn't supported if the storage account contains Azure Files NFSv4.1 shares.

- For premium performance, live migration is supported for premium file share accounts, but not for premium block blob or premium page blob accounts.

### How to perform a live migration

#### Customer-initiated live migration

> [!IMPORTANT]
> Customer-initiated live migration is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Customer-initiated live migration replaces the previous requirement to create a support request to perform a live migration. Now an Azure customer can easily initiate the migration from within the Azure portal. Once initiated, the migration could still take up to 72 hours to begin, but delays related to opening and managing a support request are eliminated.

> [!NOTE]
> Customer-initiated live migration is only available from the Azure portal, not from PowerShell or the Azure CLI.

To change the redundancy option for your storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. **Save**.

    :::image type="content" source="media/migration-guides/storage-change-replication-option.png" alt-text="Screenshot showing how to change replication option in portal." lightbox="media/migration-guides/storage-change-replication-option.png":::

#### Request a live migration by creating a support request

If you need to migrate a production workload and don't want to use the customer-initiated migration preview, you can still open a support ticket to request Microsoft to do the live migration for you:

[Request a live migration](../storage/common/redundancy-migration.md) by creating a new support request from the Azure portal.

## Migration option 2: Manual migration

### When to use a manual migration

Use a manual migration if:

- You need the migration to be completed by a certain date.

- You want to migrate your data to a ZRS storage account that's in a different region than the source account.

- You want to migrate data from ZRS to LRS, GRS or RA-GRS and you don't want to use the customer-initiated migration feature in preview.

- Your storage account is a premium page blob or block blob account.

- Your storage account includes data that's in the archive tier.

### How to manually migrate Azure Storage accounts

To manually migration your Azure Storage accounts:

1. Create a new storage account in the primary region with Zone Redundant Storage (ZRS) as the redundancy setting.

1. Copy the data from your existing storage account to the new storage account. To perform a copy operation, use one of the following options:

    - **Option 1:** Copy data by using an existing tool such as [AzCopy](../storage/common/storage-use-azcopy-v10.md), [Azure Data factory](../data-factory/connector-azure-blob-storage.md?tabs=data-factory), one of the Azure Storage client libraries, or a reliable third-party tool.

    - **Option 2:** If you're familiar with Hadoop or HDInsight, you can attach both the source storage account and destination storage account to your cluster. Then, parallelize the data copy process with a tool like [DistCp](https://hadoop.apache.org/docs/r1.2.1/distcp.html).

1. Determine which type of replication you need and follow the directions in [Change how a storage account is replicated](../storage/common/redundancy-migration.md).

## Next steps

For detailed guidance on changing the replication configuration for an Azure Storage account from any type to any other type, see:

> [!div class="nextstepaction"]
> [Change how a storage account is replicated](../storage/common/redundancy-migration.md)

For more guidance on moving an Azure Storage account to another region, see:

> [!div class="nextstepaction"]
> [Move an Azure Storage account to another region](../storage/common/storage-account-move.md)

Learn more about:

> [!div class="nextstepaction"]
> [Azure Storage redundancy](../storage/common/storage-redundancy.md)

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)