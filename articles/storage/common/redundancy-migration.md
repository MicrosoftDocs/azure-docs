---
title: Changing the redundancy option for a storage account 
titleSuffix: Azure Storage
description: Learn how to change how data in an existing storage account is replicated.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/10/2020
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Changing the redundancy option for a storage account

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures.

You can change how your storage account is replicated by using the [Azure portal](https://portal.azure.com/), [Azure Powershell](storage-powershell-guide-full.md), [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), or one of the [Azure Storage client libraries](https://docs.microsoft.com/azure/index#pivot=sdkstools). Changing how your storage account is replicated does not result in down time.

> [!NOTE]
> Currently, you cannot use the Azure portal or the Azure Storage client libraries to convert your account to ZRS, GZRS, or RA-GZRS. To migrate your account to ZRS, see [Zone-redundant storage (ZRS) for building highly available Azure Storage applications](storage-redundancy-zrs.md) for details. To migrate GZRS or RA-GZRS, see [Geo-zone-redundant storage for highly availability and maximum durability (preview)](storage-redundancy-zrs.md) for details.

## Costs associated with migration

Costs associated with migration to a different redundancy option depend on your conversion path. Ordering from least to the most expensive, Azure Storage redundancy offerings include LRS, ZRS, GRS, RA-GRS, GZRS, and RA-GZRS. For example, going *from* LRS to any other type of replication will incur additional charges because you are moving to a more sophisticated redundancy level. Migrating *to* GRS or RA-GRS will incur an egress bandwidth charge because your data (in your primary region) is being replicated to your remote secondary region. This charge is a one-time cost at initial setup. After the data is copied, there are no further migration charges. You are only charged for replicating any new or updates to existing data. For details on bandwidth charges, see [Azure Storage Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

If you migrate your storage account from GRS to LRS, there is no additional cost, but your replicated data is deleted from the secondary location.

If you migrate your storage account from RA-GRS to GRS or LRS, that account is billed as RA-GRS for an additional 30 days beyond the date that it was converted.

## Converting to ZRS replication

Migrating to or from LRS, GRS, and RA-GRS is straightforward. Use the Azure portal or the Storage Resource Provider API to change your account's redundancy type. Azure will then replicate your data accordingly. 

Migrating data to ZRS requires a different strategy. ZRS migration involves the physical movement of data from a single storage stamp to multiple stamps within a region.

There are two primary options for migration to ZRS: 

- Manually copy or move data to a new ZRS account from an existing account.
- Request a live migration.

> [!IMPORTANT]
> Live migration is not currently supported for premium file shares. Only manually copying or moving data is currently supported.

If you need the migration to complete by a certain date consider performing a manual migration. A manual migration provides more flexibility than a live migration. With a manual migration, you're in control of the timing.

To perform a manual migration, you have options:
- Use existing tooling like AzCopy, one of the Azure Storage client libraries, or reliable third-party tools.
- If you're familiar with Hadoop or HDInsight, attach both source and destination (ZRS) account to your cluster. Then, parallelize the data copy process with a tool like DistCp.
- Build your own tooling using one of the Azure Storage client libraries.

A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a live migration option. A live migration is an in-place migration with no downtime. 

During a live migration, you can use your storage account while your data is migrated between source and destination storage stamps. During the migration process, you have the same level of durability and availability SLA as you normally do.

Keep in mind the following restrictions on live migration:

- While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to ZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data. 
- Live migration is supported only for storage accounts that use LRS or GRS replication. If your account uses RA-GRS, then you need to first change your account's replication type to either LRS or GRS before proceeding. This intermediary step removes the secondary read-only endpoint provided by RA-GRS before migration.
- Your account must contain data.
- You can only migrate data within the same region. If you want to migrate your data into a ZRS account located in a region different than the source account, then you must perform a manual migration.
- Only standard storage account types support live migration. Premium storage accounts must be migrated manually.
- Live migration from ZRS to LRS, GRS or RA-GRS is not supported. You will need to manually move the data to a new or an existing storage account.
- Managed disks are only available for LRS and cannot be migrated to ZRS. You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/). For integration with availability sets see [Introduction to Azure managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#integration-with-availability-sets).
- LRS or GRS accounts with Archive data cannot be migrated to ZRS.

You can request live migration through the [Azure Support portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). From the portal, select the storage account you want to convert to ZRS.
1. Select **New Support Request**
2. Complete the **Basics** based on your account information. In the **Service** section, select **Storage Account Management** and the resource you want to convert to ZRS. 
3. Select **Next**. 
4. Specify the following values the **Problem** section: 
    - **Severity**: Leave the default value as-is.
    - **Problem Type**: Select **Data Migration**.
    - **Category**: Select **Migrate to ZRS**.
    - **Title**: Type a descriptive title, for example, **ZRS account migration**.
    - **Details**: Type additional details in the **Details** box, for example, I would like to migrate to ZRS from [LRS, GRS] in the \_\_ region. 
5. Select **Next**.
6. Verify that the contact information is correct on the **Contact information** blade.
7. Select **Create**.

A support person will contact you and provide any assistance you need.

## Live migration to ZRS FAQ

**Should I plan for any downtime during the migration?**

There is no downtime caused by the migration. During a live migration, you can continue using your storage account while your data is migrated between source and destination storage stamps. During the migration process, you have the same level of durability and availability SLA as you normally do.

**Is there any data loss associated with the migration?**

There is no data loss associated with the migration. During the migration process, you have the same level of durability and availability SLA as you normally do.

**Are any updates required to the application(s) once the migration is complete?**

Once the migration is complete the replication type of the account(s) will change to "Zone-redundant storage (ZRS)". Service endpoints, access keys, SAS, and any other account option options remain unchanged and intact.

**Can I request a live migration of my general-purpose v1 account(s) to ZRS?**

ZRS only supports general-purpose v2 accounts so before submitting a request for a live migration to ZRS make sure to upgrade your account(s) to general-purpose v2. See [Azure storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview) and [Upgrade to a general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade) for more details.

**Can I request a live migration of my read-access geo-redundant storage (RA-GRS) account(s) to ZRS?**

Before submitting a request for a live migration to ZRS make sure your application(s) or workload(s) no longer require access to the secondary read-only endpoint and change the replication type of your storage account(s) to geo-redundant storage (GRS). See [Changing replication strategy](https://docs.microsoft.com/azure/storage/common/storage-redundancy#changing-replication-strategy) for more details.

**Can I request a live migration of my storage account(s) to ZRS  to another region?**

If you want to migrate your data into a ZRS account located in a region different from the region of the source account, then you must perform a manual migration.

## ZRS Classic: A legacy option for block blobs redundancy

> [!IMPORTANT]
> Microsoft will deprecate and migrate ZRS Classic accounts on March 31, 2021. More details will be provided to ZRS Classic customers before deprecation.
>
> After ZRS becomes [generally available](#support-coverage-and-regional-availability) in a given region, customers will no longer be able to create ZRS Classic accounts from the Azure portal in that region. Using Microsoft PowerShell and Azure CLI to create ZRS Classic accounts is an option until ZRS Classic is deprecated.

ZRS Classic asynchronously replicates data across data centers within one to two regions. Replicated data may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

ZRS Classic is available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

To manually migrate ZRS account data to or from an LRS, GRS, RA-GRS, or ZRS Classic account, use one of the following tools: AzCopy, Azure Storage Explorer, PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.

You can also upgrade your ZRS Classic account(s) to ZRS in the Azure portal or with Azure PowerShell or Azure CLI in the regions where ZRS is available. To upgrade to ZRS in the Azure portal, navigate to the **Configuration** settings of the account and choose **Upgrade**:

![Upgrade ZRS Classic to ZRS in the Portal](media/storage-redundancy-zrs/portal-zrs-classic-upgrade.png)

To upgrade to ZRS using PowerShell,  call the following command:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage_account> -UpgradeToStorageV2
```

To upgrade to ZRS using Azure CLI, call the following command:

```cli
az storage account update -g <resource_group> -n <storage_account> --set kind=StorageV2
```

## Migrate a storage account to GZRS or RA-GZRS

You can migrate any existing storage account to GZRS or RA-GZRS. Migrating from an existing ZRS account to GZRS or RA-GZRS is straightforward, while migrating from an LRS, GRS, or RA-GRS account is more involved. The following sections describe how to migrate in either case.

**Known limitations**

- Archive tier is not currently supported on (RA-)GZRS accounts. See [Azure Blob storage: hot, cool, and archive access tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers) for more details.
- Managed disks do not support (RA-)GZRS. You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/).

### Migrating from a ZRS account

To convert an existing ZRS account to RA-GZRS, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) cmdlet to change the SKU for the account. Remember to replace the placeholder values with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> -AccountName <storage-account> -SkuName "Standard_RAGZRS"
```

### Migrating from an LRS, GRS, or RA-GRS account

There are two options for migrating to GZRS or RA-GZRS from an LRS, GRS, or RA-GRS account:

- You can manually copy or move data to a new GZRS or RA-GZRS account from an existing account.
- You can request a live migration.

#### Perform a manual migration

If you need the migration to complete by a certain date, consider performing a manual migration. A manual migration provides more flexibility than a live migration. With a manual migration, you're in control of the timing.

To manually migrate data from an existing account to a GZRS or RA-GZRS account, use a tool that can copy data efficiently. Some examples include:

- Use a utility like AzCopy or a reliable third-party tool. For information about AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).
- If you're familiar with Hadoop or HDInsight, attach both the source and destination storage accounts to your cluster. Next, parallelize the data copy process with a tool like DistCp.
- Build your own tooling using one of the Azure Storage client libraries.

#### Perform a live migration

A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a live migration option. A live migration is an in-place migration with no downtime.

During a live migration, you can use your storage account while your data is migrated between source and destination storage accounts. During the live migration process, your account continues to meet its SLA for durability and availability. There is no downtime or data loss caused by the live migration.

Only general-purpose v2 accounts support GZRS/RA-GZRS, so before submitting a request for a live migration to GZRS/RA-GZRS, you must upgrade your account to general-purpose v2. For more information, see [Azure storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview) and [Upgrade to a general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade).

Once the migration is complete, the storage account's replication setting will be updated to **Geo-zone-redundant storage (GZRS)** or **Read-access geo-zone-redundant storage (RA-GZRS)**. Service endpoints, access keys, shared access signatures (SAS), and any other account option options remain unchanged and intact.

Keep in mind the following restrictions on live migration:

- While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to GZRS or RA-GZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data.
- Your account must contain data.
- You can only migrate data within the same region.
- Only standard storage account types support live migration. Premium storage accounts must be migrated manually.
- Live migration from a GZRS or RA-GZRS account to an LRS, GRS, or RA-GRS account is not supported. You will need to manually move the data to a new or an existing storage account.
- You can request a live migration from RA-GRS to RA-GZRS. However, migrating from RA-GRS to GZRS is not supported. In this case, you must request a live migration to RA-GZRS and then manually convert the storage account to use GZRS.
- Managed disks support LRS only and cannot be migrated to GZRS or RA-GZRS. For integration with availability sets, see [Introduction to Azure managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#integration-with-availability-sets).
- You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS, ZRS, GZRS, and RA-GZRS options](https://azure.microsoft.com/pricing/details/managed-disks/).
- Accounts containing large file shares are not supported for GZRS.

To request a live migration, use the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). From the portal, select the storage account to migrate to GZRS or RA-GZRS, and follow these instructions:

1. Select **New Support Request**.
2. Complete the **Basics** based on your account information. In the **Service** section, select **Storage Account Management** and specify the account to be migrated.
3. Select **Next**.
4. Specify the following values the **Problem** section:
    - **Severity**: Leave the default value as-is.
    - **Problem Type**: Select **Data Migration**.
    - **Category**: Select **Migrate to (RA-)GZRS within a region**.
    - **Title**: Type a descriptive title, for example, **(RA-)GZRS account migration**.
    - **Details**: Type additional details in the **Details** box, for example, "I would like to migrate to GZRS from [LRS, GRS] in the \_\_ region." or "I would like to migrate to RA-GZRS from [LRS, RA-GRS] in the \_\_ region."
5. Select **Next**.
6. Verify that the contact information is correct on the **Contact information** blade.
7. Select **Create**.

A support representative will contact you to provide assistance.


## What is the RPO and RTO with GRS?

**Recovery Point Objective (RPO):** In GRS and RA-GRS, the storage service asynchronously geo-replicates the data from the primary to the secondary location. In the event that the primary region becomes unavailable, you can perform an account failover (preview) to the secondary region. When you initiate a failover, recent changes that haven't yet been geo-replicated may be lost. The number of minutes of potential data that's lost is known as the RPO. The RPO indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there's currently no SLA on how long geo-replication takes.

**Recovery Time Objective (RTO):** The RTO is a measure of how long it takes to perform the failover and get the storage account back online. The time to perform the failover includes the following actions:

- The time until the customer initiates the failover of the storage account from the primary to the secondary region.
- The time required by Azure to perform the failover by changing the primary DNS entries to point to the secondary location.

## Paired regions

When you create a storage account, you select the primary region for the account. The paired secondary region is determined based on the primary region, and can't be changed. For up-to-date information about regions supported by Azure, see [Business continuity and disaster recovery (BCDR): Azure paired regions](../../best-practices-availability-paired-regions.md).

## See also

- [Azure Storage redundancy](storage-redundancy.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Designing highly available applications using read-access geo-redundant storage](storage-designing-ha-apps-with-ragrs.md)
