---
title: Storage account overview
titleSuffix: Azure Storage
description: Learn about the different types of storage accounts in Azure Storage. Review account naming, performance tiers, access tiers, redundancy, encryption, endpoints, and more.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/14/2021
ms.author: tamram
ms.subservice: common
---

# Storage account overview

An Azure storage account contains all of your Azure Storage data objects: blobs, file shares, queues, tables, and disks. The storage account provides a unique namespace for your Azure Storage data that's accessible from anywhere in the world over HTTP or HTTPS. Data in your storage account is durable and highly available, secure, and massively scalable.

To learn how to create an Azure storage account, see [Create a storage account](storage-account-create.md).

## Types of storage accounts

Azure Storage offers several types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the type of account that's best for your applications.

The following table describes the types of storage accounts recommended by Microsoft for most scenarios. All of these use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) deployment model.

| Type of storage account | Supported storage services | Redundancy options | Usage |
|--|--|--|--|
| Standard general-purpose v2 | Blob (including Data Lake Storage<sup>1</sup>), Queue, and Table storage, Azure Files  | LRS/GRS/RA-GRS<br /><br />ZRS/GZRS/RA-GZRS<sup>2</sup> | Standard storage account type for blobs, file shares, queues, and tables. Recommended for most scenarios using Azure Storage. Note that if you want support for NFS file shares in Azure Files, use the premium file shares account type. |
| Premium block blobs<sup>3</sup> | Blob storage (including Data Lake Storage<sup>1</sup>) | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for block blobs and append blobs. Recommended for scenarios with high transactions rates, or scenarios that use smaller objects or require consistently low storage latency. [Learn more about example workloads.](../blobs/storage-blob-performance-tiers.md#premium-performance) |
| Premium file shares<sup>3</sup> | Azure Files | LRS<br /><br />ZRS<sup>2</sup> | Premium storage account type for file shares only. Recommended for enterprise or high-performance scale applications. Use this account type if you want a storage account that supports both SMB and NFS file shares. |
| Premium page blobs<sup>3</sup> | Page blobs only | LRS | Premium storage account type for page blobs only. [Learn more about page blobs and sample use cases.](../blobs/storage-blob-pageblob-overview.md) |

<sup>1</sup> Data Lake Storage is a set of capabilities dedicated to big data analytics, built on Azure Blob storage. For more information, see [Introduction to Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md) and [Create a storage account to use with Data Lake Storage Gen2](../blobs/create-data-lake-storage-account.md).

<sup>2</sup> Zone-redundant storage (ZRS) and geo-zone-redundant storage (GZRS/RA-GZRS) are available only for standard general-purpose v2, premium block blobs, and premium file shares accounts in certain regions. For more information, see [Azure Storage redundancy](storage-redundancy.md).

<sup>3</sup> Storage accounts in a premium performance tier use solid-state drives (SSDs) for low latency and high throughput.

Legacy storage accounts are also supported. For more information, see [Legacy storage account types](#legacy-storage-account-types).

## Storage account endpoints

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has an address that includes your unique account name. The combination of the account name and the Azure Storage service endpoint forms the endpoints for your storage account.

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

The following table lists the format of the endpoint for each of the Azure Storage services.

| Storage service | Endpoint |
|--|--|
| Blob storage | `https://<storage-account>.blob.core.windows.net` |
| Data Lake Storage Gen2 | `https://<storage-account>.dfs.core.windows.net` |
| Azure Files | `https://<storage-account>.file.core.windows.net` |
| Queue storage | `https://<storage-account>.queue.core.windows.net` |
| Table storage | `https://<storage-account>.table.core.windows.net` |

Construct the URL for accessing an object in a storage account by appending the object's location in the storage account to the endpoint. For example, the URL for a blob will be similar to:

`http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*`

You can also configure your storage account to use a custom domain for blobs. For more information, see [Configure a custom domain name for your Azure Storage account](../blobs/storage-custom-domain-name.md).  

## Migrate a storage account

The following table summarizes and points to guidance on how to move, upgrade, or migrate a storage account:

| Migration scenario | Details |
|--|--|
| Move a storage account to a different subscription | Azure Resource Manager provides options for moving a resource to a different subscription. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different resource group | Azure Resource Manager provides options for moving a resource to a different resource group. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md). |
| Move a storage account to a different region | To move a storage account, create a copy of your storage account in another region. Then, move your data to that account by using AzCopy, or another tool of your choice. For more information, see [Move an Azure Storage account to another region](storage-account-move.md). |
| Upgrade to a general-purpose v2 storage account | You can upgrade a general-purpose v1 storage account or Blob storage account to a general-purpose v2 account. Note that this action cannot be undone. For more information, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md). |
| Migrate a classic storage account to Azure Resource Manager | The Azure Resource Manager deployment model is superior to the classic deployment model in terms of functionality, scalability, and security. For more information about migrating a classic storage account to Azure Resource Manager, see the "Migration of storage accounts" section of [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](../../virtual-machines/migration-classic-resource-manager-overview.md#migration-of-storage-accounts). |

## Transfer data into a storage account

Microsoft provides services and utilities for importing your data from on-premises storage devices or third-party cloud storage providers. Which solution you use depends on the quantity of data you're transferring. For more information, see [Azure Storage migration overview](storage-migration-overview.md).

## Storage account encryption

All data in your storage account is automatically encrypted on the service side. For more information about encryption and key management, see [Azure Storage encryption for data at rest](storage-service-encryption.md).

## Storage account billing

Azure Storage bills based on your storage account usage. All objects in a storage account are billed together as a group. Storage costs are calculated according to the following factors:

- **Region** refers to the geographical region in which your account is based.
- **Account type** refers to the type of storage account you're using.
- **Access tier** refers to the data usage pattern you've specified for your general-purpose v2 or Blob storage account.
- **Capacity** refers to how much of your storage account allotment you're using to store data.
- **Redundancy** determines how many copies of your data are maintained at one time, and in what locations.
- **Transactions** refer to all read and write operations to Azure Storage.
- **Data egress** refers to any data transferred out of an Azure region. When the data in your storage account is accessed by an application that isn't running in the same region, you're charged for data egress. For information about using resource groups to group your data and services in the same region to limit egress charges, see [What is an Azure resource group?](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group).

The [Azure Storage pricing page](https://azure.microsoft.com/pricing/details/storage/) provides detailed pricing information based on account type, storage capacity, replication, and transactions. The [Data Transfers pricing details](https://azure.microsoft.com/pricing/details/data-transfers/) provides detailed pricing information for data egress. You can use the [Azure Storage pricing calculator](https://azure.microsoft.com/pricing/calculator/?scenario=data-management) to help estimate your costs.

[!INCLUDE [cost-management-horizontal](../../../includes/cost-management-horizontal.md)]

## Legacy storage account types

The following table describes the legacy storage account types. These account types are not recommended by Microsoft, but may be used in certain scenarios:

| Type of legacy storage account | Supported storage services | Redundancy options | Deployment model | Usage |
|--|--|--|--|--|
| Standard general-purpose v1 | Blob, Queue, and Table storage, Azure Files | LRS/GRS/RA-GRS | Resource Manager, Classic | General-purpose v1 accounts may not have the latest features or the lowest per-gigabyte pricing. Consider using for these scenarios:<br /><ul><li>Your applications require the Azure [classic deployment model](../../azure-portal/supportability/classic-deployment-model-quota-increase-requests.md).</li><li>Your applications are transaction-intensive or use significant geo-replication bandwidth, but don't require large capacity. In this case, general-purpose v1 may be the most economical choice.</li><li>You use a version of the Azure Storage REST API that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and you can't upgrade your application.</li></ul> |
| Standard Blob storage | Blob storage (block blobs and append blobs only) | LRS/GRS/RA-GRS | Resource Manager | Microsoft recommends using standard general-purpose v2 accounts instead when possible. |

## Next steps

- [Create a storage account](storage-account-create.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Recover a deleted storage account](storage-account-recover.md)
