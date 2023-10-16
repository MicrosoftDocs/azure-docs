---
title: Migrate Azure Storage accounts to availability zone support 
description: Learn how to migrate your Azure storage accounts to availability zone support.
author: sonmitt
ms.service: azure-storage
ms.topic: conceptual
ms.date: 02/27/2023
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---

# Migrate Azure Storage accounts to availability zone support

This guide describes how to migrate or convert Azure Storage accounts to add availability zone support.

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the Service-Level Agreement (SLA) for Azure Storage even in the face of failures.

By default, data in a storage account is replicated three times within a single data center in the primary region. If your application must be highly available, you can convert the data in the primary region to zone-redundant storage (ZRS). ZRS takes advantage of Azure availability zones to replicate data within the primary region across three separate data centers.

Azure Storage offers the following types of replication:

- Locally redundant storage (LRS)
- Zone-redundant storage (ZRS)
- Geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS)
- Geo-zone-redundant storage (GZRS) or read-access geo-zone-redundant storage (RA-GZRS)

For an overview of each of these options, see [Azure Storage redundancy](../storage/common/storage-redundancy.md).

This article describes two basic options for adding availability zone support to a storage account:

- [Conversion](#option-1-conversion): If your application must be highly available, you can convert the storage account in the primary region to zone-redundant storage (ZRS), without experiencing any downtime. ZRS takes advantage of Azure availability zones to replicate data in the primary region across three separate data centers.
- [Manual migration](#option-2-manual-migration): Manual migration gives you complete control over the migration process by allowing you to use tools such as AzCopy move to a new storage account with the desired replication settings at the time of your choosing. This option typically does involve downtime.

> [!NOTE]
> For complete details on how to change how your storage account is replicated, see [Change how a storage account is replicated](../storage/common/redundancy-migration.md).

## Prerequisites

Before making any changes, review the [limitations for changing replication types](../storage/common/redundancy-migration.md#limitations-for-changing-replication-types) to understand your options for migrating or converting your storage account. Many storage accounts can be converted directly to ZRS, while others either require a multi-step process or a manual migration. After reviewing the limitations, choose the right option in this article to convert your storage account based on:

- [Storage account type](../storage/common/redundancy-migration.md#storage-account-type)
- [Region](../storage/common/redundancy-migration.md#region)
- [Access tier](../storage/common/redundancy-migration.md#access-tier)
- [Protocols enabled](../storage/common/redundancy-migration.md#protocol-support)
- [Failover status](../storage/common/redundancy-migration.md#failover-and-failback)
- [Feature conflicts](../storage/common/redundancy-migration.md#feature-conflicts)

## Downtime requirements

During a conversion to ZRS, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the conversion process and there is no data loss. Storage service endpoints, access keys, shared access signatures, and other account options remain unchanged after the conversion.

If you choose manual migration, some downtime is required, but you have more control over when the process starts and completes.

## Option 1: Conversion

During a conversion, you can access data in your storage account with no loss of durability or availability. [The Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/) is maintained during the migration process and there is no data loss associated with a conversion. Storage service endpoints, access keys, shared access signatures, and other account options remain unchanged after the migration.

### When to perform a conversion

Perform a conversion if:

- You want to convert your storage account from LRS to ZRS in the primary region with no application downtime.
- You don't need the change to be completed by a certain date. While Microsoft handles your request for conversion promptly, there's no guarantee as to when it will complete.  Generally, the more data you have in your account, the longer it takes to replicate that data. If you need more control over the timing of a migration, consider using [manual migration](#option-2-manual-migration).
- You want to minimize the amount of manual effort required to complete the change.

### Conversion considerations

Conversion can be used in most situations to add availability zone support, but in some cases you will need to use multiple steps or perform a manual migration. For example, if you also want to migrate from LRS to RA-GZRS, you will need to perform a two-step process. Perform the conversion to ZRS as one step, and then change from ZRS to RA-GZRS as a separate step. These steps can be performed in any order.

### How to perform a conversion

A conversion can be accomplished in one of two ways:

- [A Customer-initiated conversion](#customer-initiated-conversion)
- [Request a conversion by creating a support request](#request-a-conversion-by-creating-a-support-request)

#### Customer-initiated conversion

Customer-initiated conversion adds a new option for customers to start a conversion. Now, instead of needing to open a support request, customers can request the conversion directly from within the Azure portal. Once initiated, the conversion could still take up to 72 hours to actually begin, but potential delays related to opening and managing a support request are eliminated.

Customer-initiated conversion is only available from the Azure portal, not from PowerShell or the Azure CLI. To initiate the conversion, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Data management** select **Redundancy**.
1. Update the **Redundancy** setting.
1. Select **Save**.

    :::image type="content" source="../storage/common/media/redundancy-migration/change-replication-option.png" alt-text="Screenshot showing how to change replication option in portal." lightbox="../storage/common/media/redundancy-migration/change-replication-option.png":::

#### Request a conversion by creating a support request

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

    :::image type="content" source="../storage/common/media/redundancy-migration/request-live-migration-problem-desc-portal.png" alt-text="Screenshot showing how to request a conversion - Problem description tab." lightbox="../storage/common/media/redundancy-migration/request-live-migration-problem-desc-portal.png":::

1. Select **Next**. The **Recommended solution** tab might be displayed briefly before it switches to the **Solutions** page. On the **Solutions** page, you can check the eligibility of your storage account(s) for conversion:
    - **Target replication type**: (choose the desired option from the drop-down)
    - **Storage accounts from**: (enter a single storage account name or a list of accounts separated by semicolons)
    - Select **Submit**.

    :::image type="content" source="../storage/common/media/redundancy-migration/request-live-migration-solutions-portal.png" alt-text="Screenshot showing how to check the eligibility of your storage account(s) for conversion - Solutions page." lightbox="../storage/common/media/redundancy-migration/request-live-migration-solutions-portal.png":::

1. Take the appropriate action if the results indicate your storage account is not eligible for conversion. If it is eligible, select **Return to support request**.

1. Select **Next**. If you have more than one storage account to migrate, then on the **Details** tab, specify the name for each account, separated by a semicolon.

    :::image type="content" source="../storage/common/media/redundancy-migration/request-live-migration-details-portal.png" alt-text="Screenshot showing how to request a conversion - Additional details tab." lightbox="../storage/common/media/redundancy-migration/request-live-migration-details-portal.png":::

1. Fill out the extra required information on the **Additional details** tab, then select **Review + create** to review and submit your support ticket. A support person will contact you to provide any assistance you may need.

## Option 2: Manual migration

A manual migration provides more flexibility and control than a conversion. You can use this option if you need the migration to complete by a certain date, or if conversion is [not supported for your scenario](../storage/common/redundancy-migration.md#limitations-for-changing-replication-types). Manual migration is also useful when moving a storage account to another region. See [Move an Azure Storage account to another region](../storage/common/storage-account-move.md) for more details.

### When to use a manual migration

Use a manual migration if:

- You need the migration to be completed by a certain date.

- You want to migrate your data to a ZRS storage account that's in a different region than the source account.

- Your storage account is a premium page blob or block blob account.

- Your storage account includes data that's in the archive tier and it would be too costly to rehydrate the data before converting the account.

### How to manually migrate Azure Storage accounts

To manually migration your Azure Storage accounts:

1. Create a new storage account in the primary region with zone redundant storage (ZRS) as the redundancy setting.

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
> [Azure services and regions that support availability zones](availability-zones-service-support.md)