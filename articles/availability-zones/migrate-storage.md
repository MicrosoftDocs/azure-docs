---
title: Migrate Azure Storage accounts to availability zone support 
description: Learn how to migrate your Azure storage accounts to availability zone support.
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate Azure Storage accounts to availability zone support
 
This guide describes how to migrate Azure Storage accounts from non-availability zone support to availability support. We'll take you through the different options for migration.

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the Service-Level Agreement (SLA) for Azure Storage even in the face of failures.

Azure Storage offers the following types of replication:

- Locally redundant storage (LRS)
- Zone-redundant storage (ZRS)
- Geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS)
- Geo-zone-redundant storage (GZRS) or read-access geo-zone-redundant storage (RA-GZRS)

For an overview of each of these options, see [Azure Storage redundancy](../storage/common/storage-redundancy.md).

You can switch a storage account from one type of replication to any other type, but some scenarios are more straightforward than others. This article describes two basic options for migration. The first is a manual migration and the second is a live migration that you must initiate by contacting Microsoft support.

## Prerequisites

- Make sure your storage account(s) are in a region that supports ZRS. To determine whether or not the region supports ZRS, see [Zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage).

- Confirm that your storage account(s) is a general-purpose v2 account. If your storage account is v1, you'll need to upgrade it to v2. To learn how to upgrade your v1 account, see [Upgrade to a general-purpose v2 storage account](../storage/common/storage-account-upgrade.md).

## Downtime requirements

If you choose manual migration, downtime is required. If you choose live migration, there's no downtime requirement.

## Migration Option 1: Manual Migration

### When to use a manual migration

Use a manual migration if:

- You need the migration to be completed by a certain date.

- You want to migrate your data to a ZRS storage account that's in a different region than the source account.

- You want to migrate data from ZRS to LRS, GRS or RA-GRS.

- Your storage account is a premium page blob or block blob account.

- Your storage account includes data that's in the archive tier.

### How to manually migrate Azure Storage accounts

To manually migration your Azure Storage accounts:

1. Create a new storage account in the primary region with Zone Redundant Storage (ZRS) as the redundancy setting.

1. Copy the data from your existing storage account to the new storage account. To perform a copy operation, use one of the following options:

    -  **Option 1:** Copy data by using an existing tool such as [AzCopy](../storage/common/storage-use-azcopy-v10.md), [Azure Data factory](../data-factory/connector-azure-blob-storage.md?tabs=data-factory), one of the Azure Storage client libraries, or a reliable third-party tool.

    - **Option 2:** If you're familiar with Hadoop or HDInsight, you can attach both the source storage account and destination storage account to your cluster. Then, parallelize the data copy process with a tool like [DistCp](https://hadoop.apache.org/docs/r1.2.1/distcp.html).

1. Determine which type of replication you need and follow the directions in [Switch between types of replication](../storage/common/redundancy-migration.md#switch-between-types-of-replication).

## Migration Option 2: Request a live migration

### When to request a live migration

Request a live migration if:

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

### How to request a Live migration

[Request a live migration](../storage/common/redundancy-migration.md) by creating a new support request from Azure portal.

## Next steps

For more guidance on moving an Azure Storage account to another region, see:

> [!div class="nextstepaction"]
> [Move an Azure Storage account to another region](../storage/common/storage-account-move.md).

Learn more about:

> [!div class="nextstepaction"]
> [Azure Storage redundancy](../storage/common/storage-redundancy.md)

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)