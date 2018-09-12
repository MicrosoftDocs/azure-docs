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

An Azure storage account provides a unique namespace to store and access your Azure Storage data objects. A storage account contains any blobs, files, queues, tables, and disks that you create under that account. All objects in a storage account are billed together as a group. 

To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).

## Types of storage accounts

Azure Storage provides three types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the type of account that is best for your applications. The three types of storage accounts are:

* **General-purpose v2** accounts
* **General-purpose v1** accounts
* **Blob storage** accounts

The following table describes the three types of storage accounts and their capabilities:

| Storage account type | Supported services                       | Supported performance tiers | Supported access tiers               | Replication options                                                | Deployment model<sup>1</sup>  | Encryption<sup>2</sup> |
|----------------------|------------------------------------------|-----------------------------|--------------------------------------|--------------------------------------------------------------------|-------------------|------------|
| General-purpose V2   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | Hot, Cool, Archive<sup>3</sup> | LRS, ZRS<sup>4</sup>, GRS, RA-GRS | Resource Manager | Encrypted  |
| General-purpose V1   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | N/A                                  | LRS, GRS, RA-GRS                                                   | Resource Manager, Classic  | Encrypted  |
| Blob storage         | Blob (block blobs and append blobs only) | Standard                    | Hot, Cool, Archive<sup>3</sup>                            | LRS, GRS, RA-GRS                                                   | Resource Manager  | Encrypted  |

<sup>1</sup>Using the Azure Resource Manager deployment model is recommended. Storage accounts using the classic deployment model can still be created in some locations, and existing classic accounts continue to be supported. For more information, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../../azure-resource-manager/resource-manager-deployment-model.md).

<sup>2</sup>All storage accounts are encryption using Storage Service Encryption (SSE) for data at rest. For more information, see [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md).

<sup>3</sup>The archive tier is available at the individual blob level only, not at the storage account level. Only block blobs and append blobs can be archived. For more information, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

<sup>4</sup>Zone-redundant storage (ZRS) is available only for standard general-purpose v2 storage accounts. For more information about ZRS, see [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md). For more information about other replication options, see [Azure Storage replication](storage-redundancy.md).

### General-purpose v2

General-purpose v2 storage accounts support the latest Azure Storage features and incorporate all functionality of general-purpose v1 and Blob storage accounts. General-purpose v2 accounts are recommended for most scenarios. General-purpose v2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices.

General-purpose v2 storage accounts offer multiple access tiers for storing data based on your usage patterns. For more information, see [Access tiers for blob data](#access-tiers-for-blob-data).

### General-purpose v1

General-purpose v1 accounts provide access to all Azure Storage services, but may not have the latest features or the lowest per gigabyte pricing. While general-purpose v2 accounts are recommended, general-purpose v1 accounts are best suited to these scenarios: 

* Your applications require the classic deployment model. General-purpose v2 accounts and Blob storage accounts support only the Azure Resource Manager deployment model.

* Your applications are transaction-intensive or use significant geo-replication bandwidth, but do not require large capacity. In this case, general-purpose v1 may be the most economical choice.

* You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

### Blob storage accounts

A Blob storage account is a specialized storage account for storing unstructured data as blobs (objects). Blob storage accounts provide the same durability, availability, scalability, and performance features that are available with general-purpose v2 storage accounts. Blob storage accounts support block blobs and append blobs, but not page blobs.

General-purpose v2 storage accounts offer multiple access tiers for storing data based on your usage patterns. For more information, see [Access tiers for blob data](#access-tiers-for-blob-data).

## Performance tiers

General-purpose storage accounts have two performance tiers:

* A standard storage performance tier for storing blobs, files, tables, queues, and Azure virtual machine disks. For more information about standard storage, see [Cost-effective Standard Storage and unmanaged and managed Azure VM disks](../../virtual-machines/windows/standard-storage).
* A premium storage performance tier for storing Azure virtual machine disks. See [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../../virtual-machines/windows/premium-storage.md) for an in-depth overview of Premium storage.

## Access tiers for blob data

Azure Storage provides different options for accessing data based on usage patterns. Each access tier in Azure Storage is optimized for a particular pattern of data usage. By selecting the right access tier for your needs, you can store your blob data in the most cost-effective manner.

The available access tiers are:

* The **Hot** access tier, which is optimized for frequent access of objects in the storage account. Accessing data in the hot tier is most cost-effective, while storage costs are somewhat higher. New storage accounts are created in the hot tier by default.
* The **Cool** access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for at least 30 days. Storing data in the cool tier is more cost-effective, but accessing that data may be somewhat more expensive than accessing data in the hot tier.
* The **Archive** tier, which is available only for individual block blobs. The archive tier is optimized for data that can tolerate several hours of retrieval latency and will remain in the archive tier for at least 180 days. The archive tier is the most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers. 

If there is a change in the usage pattern of your data, you can switch between these access tiers at any time. 

> [!IMPORTANT]
> Changing the access tier for an existing storage account or blob may result in additional charges.

For more information about access tiers, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

## Replication

[!INCLUDE [storage-common-redundancy-options](../../../includes/storage-common-redundancy-options.md)]

For more information about storage replication, see [Azure Storage replication](storage-redundancy.md).

## Storage account endpoints

Every object that you store in Azure Storage has a unique URL address. The storage account name forms the subdomain of that address. The combination of subdomain and domain name, which is specific to each service, forms an *endpoint* for your storage account.

For example, if your general-purpose storage account is named *mystorageaccount*, then the default endpoints for that account are:

* Blob storage: http://*mystorageaccount*.blob.core.windows.net
* Table storage: http://*mystorageaccount*.table.core.windows.net
* Queue storage: http://*mystorageaccount*.queue.core.windows.net
* Azure Files: http://*mystorageaccount*.file.core.windows.net

> [!NOTE]
> A Blob storage account exposes only the Blob service endpoint.

The URL for accessing an object in a storage account is constructed by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure your storage account to use a custom domain for blobs. For more information, see [Configure a custom domain Name for your Blob Storage Endpoint](../blobs/storage-custom-domain-name.md).  

## Control access to storage account data

By default, the data in your account is available only to you, the account owner. You have control over who may access your data and what permissions they have.

Every request made against your storage account must be authorized. At the level of the service, the request must include a valid *Authorization* header, which includes all of the information necessary for the service to validate the request before executing it.

You can access data in an Azure Storage account using any of the following approaches:

- Use Azure AD credentials to authenticate a user, group, or other identity. If authentication of an identity is successful, then Azure AD returns a token, which is used to authorize the request to Azure Blob storage or Queue storage. 
- Use a shared access signature 
- shared key

## Storage account billing

[!INCLUDE [storage-account-billing-include](../../../includes/storage-account-billing-include.md)]

## Next steps

* To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).
* To manage or delete an existing storage account, see [Manage Azure storage accounts](storage-manage-account.md).
