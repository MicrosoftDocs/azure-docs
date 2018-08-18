---
title: Azure storage account overview | Microsoft Docs
description: Understand options for creating and using an Azure Storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/18/2018
ms.author: tamram
ms.component: common
---

# Azure Storage account overview

An Azure storage account provides a unique namespace in the cloud to store and access your data objects in Azure Storage. A storage account contains any blobs, files, queues, tables, and disks that you create under that account. All objects in a storage account are billed together as a group. By default, the data in your account is available only to you, the account owner.

To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).

## Types of storage accounts

Azure Storage provides three types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the option that is best for your applications. The three types of storage accounts are:

* **General-purpose v2 (GPv2)** accounts. GPv2 accounts store blobs, files, queues, tables, and disks. Recommended for most scenarios.
* **General-purpose v1 (GPv1)** accounts. GPv1 accounts store blobs, files, queues, tables, and disks. 
* **Blob storage** accounts. Blob storage accounts store block blobs and page blobs only.

The following table describes the three types of storage accounts and their capabilities:

| Storage account type | Supported services                       | Supported performance tiers | Supported access tiers               | Replication options                                                | Deployment model<sup>1</sup>  | Encryption<sup>2</sup> |
|----------------------|------------------------------------------|-----------------------------|--------------------------------------|--------------------------------------------------------------------|-------------------|------------|
| General-purpose V2   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | Hot, Cool, Archive<sup>3</sup> | LRS, ZRS<sup>4</sup>, GRS, RA-GRS | Resource manager | Encrypted  |
| General-purpose V1   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | N/A                                  | LRS, GRS, RA-GRS                                                   | Resource manager, Classic  | Encrypted  |
| Blob storage         | Blob (block blobs and append blobs only) | Standard                    | Hot, Cool, Archive<sup>3</sup>                            | LRS, GRS, RA-GRS                                                   | Resource manager  | Encrypted  |

<sup>1</sup>Using the Azure Resource Manager deployment model is recommended. Storage accounts using the classic deployment model can still be created in some locations, and existing classic accounts continue to be supported. For more information, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../../azure-resource-manager/resource-manager-deployment-model.md).

<sup>2</sup>All storage accounts are encryption using Storage Service Encryption (SSE) for data at rest. For more information, see [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md).

<sup>3</sup>The archive tier is available at the individual blob level only, not at the storage account level. Only block blobs and append blobs can be archived. For more information, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

<sup>4</sup>Zone-redundant storage (ZRS) is available only for standard general-purpose v2 storage accounts. For more information about ZRS, see [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md). For more information about other replication options, see [Azure Storage replication](common/storage-redundancy.md).

### General-purpose v2

General-purpose v2 (GPv2) storage accounts support the latest Azure Storage features and incorporate all functionality of GPv1 and Blob storage accounts. GPv2 accounts are recommended for most scenarios. GPv2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices.

GPv2 storage accounts expose the **Access Tier** attribute at the account level, which specifies the default storage account tier as **Hot** or **Cool**. If your data usage changes, you can switch between these storage tiers at any time. 

The access tier for the account is applied to blobs within the account, unless a blob has its access tier set explicitly. The **archive tier** can only be applied at the blob level.

For block blobs in a GPv2 storage account, you can choose between hot and cool storage tiers at the account level, or hot, cool, and archive tiers at the blob level based on access patterns. Store frequently, infrequently, and rarely accessed data in the hot, cool, and archive storage tiers respectively to optimize costs. 

For more information on migrating your older storage accounts to GPv2 accounts, see [Migrate to general-purpose v2 storage accounts](storage-account-migrate.md).

### General-purpose v1

General-purpose v1 (GPv1) accounts provide access to all Azure Storage services, but may not have the latest features or the lowest per gigabyte pricing. While GPv2 accounts are recommended, GPv1 accounts are best suited for certain scenarios: 

* Your applications require the classic deployment model. GPv2 accounts and Blob storage accounts use only the Azure Resource Manager deployment model.

* Your applications are transaction-intensive or use significant geo-replication bandwidth, but do not require large capacity. In this case, GPv1 may be more economical.

* You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

### Blob storage accounts

A Blob storage account is a specialized storage account for storing unstructured data as blobs (objects). Blob storage accounts provide the same durability, availability, scalability, and performance features that are available with GPv2 storage accounts. Blob storage accounts support only block and append blobs, and not page blobs.

## Replication

[!INCLUDE [storage-common-redundancy-options](../../../includes/storage-common-redundancy-options.md)]

For more information about storage replication, see [Azure Storage replication](storage-redundancy.md).

## Access tiers for object data

When you create or modify a GPv2 or Blob storage account, you can specify the access tier for the blobs (objects) in the storage account. Each access tier in Azure Storage is optimized for a particular pattern of data usage. By selecting the right access tier for your needs, you can store your blob data most cost-effectively. 

The access tiers available for your storage account are:

* The **Hot** access tier, which is optimized for frequent access of objects in the storage account. Accessing data in the Hot tier is most cost-effective, while storage costs are somewhat higher. A new storage account is created in the Hot tier by default.
* The **Cool** access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for at least 30 days. Storing data in the Cool tier is more cost-effective, while accessing that data may be somewhat more expensive than accessing data in the Hot tier.
* The **Archive** tier, which is available only at the level of an individual blob. The Archive tier is optimized for data that can tolerate several hours of retrieval latency and will remain in the archive tier for at least 180 days. The Archive tier is the most cost-effective option for storing data, while accessing that data is more expensive than accessing data in the Hot or Cool tiers. 

If there is a change in the usage pattern of your data, you can switch between these access tiers at any time. Changing the access tier may result in additional charges.

For more information about access tiers, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

## Performance tier

General-purpose storage accounts have two performance tiers:

* A standard storage performance tier for storing blobs, files, tables, queues, and Azure virtual machine disks.
* A premium storage performance tier for storing Azure virtual machine disks. See [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../articles/virtual-machines/windows/premium-storage.md) for an in-depth overview of Premium storage.

## Storage account endpoints

Every object that you store in Azure Storage has a unique URL address. The storage account name forms the subdomain of that address. The combination of subdomain and domain name, which is specific to each service, forms an *endpoint* for your storage account.

For example, if your storage account is named *mystorageaccount*, then the default endpoints for your storage account are:

* Blob service: http://*mystorageaccount*.blob.core.windows.net
* Table service: http://*mystorageaccount*.table.core.windows.net
* Queue service: http://*mystorageaccount*.queue.core.windows.net
* File service: http://*mystorageaccount*.file.core.windows.net

> [!NOTE]
> A Blob storage account exposes only the Blob service endpoint.

The URL for accessing an object in a storage account is constructed by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure your storage account to use a custom domain for blobs. For more information, see [Configure a custom domain Name for your Blob Storage Endpoint](../blobs/storage-custom-domain-name.md).  

## Storage account billing

[!INCLUDE [storage-account-billing-include](../../../includes/storage-account-billing-include.md)]

## Pricing and billing
All storage accounts use a pricing model for blob storage based on the tier of each blob. When using a storage account, the following billing considerations apply:

* **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the storage tier. The per-gigabyte cost decreases as the tier gets cooler.

* **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive storage tier, you are charged a per-gigabyte data access charge for reads.

* **Transaction costs**: There is a per-transaction charge for all tiers that increases as the tier gets cooler.

* **Geo-Replication data transfer costs**: This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.

* **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.

* **Changing the storage tier**: Changing the account storage tier from cool to hot incurs a charge equal to reading all the data existing in the storage account. However, changing the account storage tier from hot to cool incurs a charge equal to writing all the data into the cool tier (GPv2 accounts only).

> [!NOTE]
> For more information on the pricing model for Blob storage accounts, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.


## Next steps

* To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).

* To manage or delete an existing storage account, see [Manage Azure storage accounts](storage-manage-account.md).

* To migrate a GPv1 or Blob storage account to a GPv2 storage account, see [Migrate to general-purpose v2 storage accounts](storage-account-migrate.md).