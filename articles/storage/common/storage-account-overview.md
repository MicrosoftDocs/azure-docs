---
title: Azure storage account overview | Microsoft Docs
description: Understand options for creating and using an Azure Storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 09/13/2018
ms.author: tamram
ms.component: common
---

# Azure storage account overview

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, tables, and disks. Data in your Azure storage account is durable and highly available, secure, massively scalable, and accessible from anywhere in the world over HTTP or HTTPS. 

To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).

## Types of storage accounts

Azure Storage provides three types of storage accounts. Each type supports different features and has its own pricing model. Consider these differences before you create a storage account to determine the type of account that is best for your applications. The types of storage accounts are:

* **General-purpose v2** accounts (recommended for most scenarios)
* **General-purpose v1** accounts
* **Blob storage** accounts

The following table describes the types of storage accounts and their capabilities:

| Storage account type | Supported services                       | Supported performance tiers | Supported access tiers               | Replication options                                                | Deployment model<sup>1</sup>  | Encryption<sup>2</sup> |
|----------------------|------------------------------------------|-----------------------------|--------------------------------------|--------------------------------------------------------------------|-------------------|------------|
| General-purpose V2   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | Hot, Cool, Archive<sup>3</sup> | LRS, ZRS<sup>4</sup>, GRS, RA-GRS | Resource Manager | Encrypted  |
| General-purpose V1   | Blob, File, Queue, Table, and Disk       | Standard, Premium           | N/A                                  | LRS, GRS, RA-GRS                                                   | Resource Manager, Classic  | Encrypted  |
| Blob storage         | Blob (block blobs and append blobs only) | Standard                    | Hot, Cool, Archive<sup>3</sup>                            | LRS, GRS, RA-GRS                                                   | Resource Manager  | Encrypted  |

<sup>1</sup>Using the Azure Resource Manager deployment model is recommended. Storage accounts using the classic deployment model can still be created in some locations, and existing classic accounts continue to be supported. For more information, see [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](../../azure-resource-manager/resource-manager-deployment-model.md).

<sup>2</sup>All storage accounts are encrypted using Storage Service Encryption (SSE) for data at rest. For more information, see [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md).

<sup>3</sup>The archive tier is available at level of an individual blob only, not at the storage account level. Only block blobs and append blobs can be archived. For more information, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

<sup>4</sup>Zone-redundant storage (ZRS) is available only for standard general-purpose v2 storage accounts. For more information about ZRS, see [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md). For more information about other replication options, see [Azure Storage replication](storage-redundancy.md).

### General-purpose v2 accounts

General-purpose v2 storage accounts support the latest Azure Storage features and incorporate all of the functionality of general-purpose v1 and Blob storage accounts. General-purpose v2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices. General-purpose v2 storage accounts support these Azure Storage services:

- Blobs (all types)
- Files
- Disks
- Queues
- Tables

Microsoft recommends using a general-purpose v2 storage account for most scenarios. You can easily upgrade a general-purpose v1 or Blob storage account to a general-purpose v2 account with no downtime or application rewrites, and without the need to copy data. For more information on upgrading to a general-purpose v2 account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md). 

General-purpose v2 storage accounts offer multiple access tiers for storing data based on your usage patterns. For more information, see [Access tiers for block blob data](#access-tiers-for-block-blob-data).

### General-purpose v1 accounts

General-purpose v1 accounts provide access to all Azure Storage services, but may not have the latest features or the lowest per gigabyte pricing. General-purpose v1 storage accounts support these Azure Storage services:

- Blobs (all types)
- Files
- Disks
- Queues
- Tables

While general-purpose v2 accounts are recommended in most cases, general-purpose v1 accounts are best suited to these scenarios: 

* Your applications require the Azure classic deployment model. General-purpose v2 accounts and Blob storage accounts support only the Azure Resource Manager deployment model.

* Your applications are transaction-intensive or use significant geo-replication bandwidth, but do not require large capacity. In this case, general-purpose v1 may be the most economical choice.

* You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

### Blob storage accounts

A Blob storage account is a specialized storage account for storing unstructured object data as block blobs. Blob storage accounts provide the same durability, availability, scalability, and performance features that are available with general-purpose v2 storage accounts. Blob storage accounts support storing block blobs and append blobs, but not page blobs.

Blob storage accounts offer multiple access tiers for storing data based on your usage patterns. For more information, see [Access tiers for block blob data](#access-tiers-for-block-blob-data).

## Naming storage accounts

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

## Performance tiers

General-purpose storage accounts may be configured for either of the following performance tiers:

* A standard performance tier for storing blobs, files, tables, queues, and Azure virtual machine disks.
* A premium performance tier for storing Azure virtual machine disks only. See [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../../virtual-machines/windows/premium-storage.md) for an in-depth overview of Premium storage.

## Access tiers for block blob data

Azure Storage provides different options for accessing block blob data based on usage patterns. Each access tier in Azure Storage is optimized for a particular pattern of data usage. By selecting the right access tier for your needs, you can store your block blob data in the most cost-effective manner.

The available access tiers are:

* The **hot** access tier, which is optimized for frequent access of objects in the storage account. Accessing data in the hot tier is most cost-effective, while storage costs are somewhat higher. New storage accounts are created in the hot tier by default.
* The **cool** access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for at least 30 days. Storing data in the cool tier is more cost-effective, but accessing that data may be somewhat more expensive than accessing data in the hot tier.
* The **archive** tier, which is available only for individual block blobs. The archive tier is optimized for data that can tolerate several hours of retrieval latency and will remain in the archive tier for at least 180 days. The archive tier is the most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers. 

> [!NOTE]
> The [Premium access tier](../blobs/storage-blob-storage-tiers.md#premium-access-tier) is available in limited preview as a locally redundant storage (LRS) account in the North Europe, US East 2, US Central and US West regions. To learn how to register for the preview, see [Introducing Azure Premium Blob Storage](http://aka.ms/premiumblob).

If there is a change in the usage pattern of your data, you can switch between these access tiers at any time. 

> [!IMPORTANT]
> Changing the access tier for an existing storage account or blob may result in additional charges.

For more information about access tiers, see [Azure Blob storage: Premium (preview), hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

## Replication

[!INCLUDE [storage-common-redundancy-options](../../../includes/storage-common-redundancy-options.md)]

For more information about storage replication, see [Azure Storage replication](storage-redundancy.md).

## Encryption

All data in your storage account is encrypted on the service side. For more information about encryption, see [Azure Storage Service Encryption for data at rest](storage-service-encryption.md).

## Storage account endpoints

A storage account provides a unique namespace in Azure for your data. Every object that you store in Azure Storage has an address that includes your unique account name. The combination of the account name and the Azure Storage service endpoint forms the endpoints for your storage account.

For example, if your general-purpose storage account is named *mystorageaccount*, then the default endpoints for that account are:

* Blob storage: http://*mystorageaccount*.blob.core.windows.net
* Table storage: http://*mystorageaccount*.table.core.windows.net
* Queue storage: http://*mystorageaccount*.queue.core.windows.net
* Azure Files: http://*mystorageaccount*.file.core.windows.net

> [!NOTE]
> A Blob storage account exposes only the Blob service endpoint.

The URL for accessing an object in a storage account is constructed by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure your storage account to use a custom domain for blobs. For more information, see [Configure a custom domain name for your Azure Storage account](../blobs/storage-custom-domain-name.md).  

## Control access to account data

By default, the data in your account is available only to you, the account owner. You have control over who may access your data and what permissions they have.

Every request made against your storage account must be authorized. At the level of the service, the request must include a valid *Authorization* header, which includes all of the information necessary for the service to validate the request before executing it.

You can grant access to the data in your storage account using any of the following approaches:

- **Azure Active Directory:** Use Azure Active Directory (Azure AD) credentials to authenticate a user, group, or other identity for access to blob and queue data (preview). If authentication of an identity is successful, then Azure AD returns a token to use in authorizing the request to Azure Blob storage or Queue storage. For more information, see [Authenticate access to Azure Storage using Azure Active Directory (preview)](storage-auth-aad.md).
- **Shared Key authorization:** Use your storage account access key to construct a connection string that your application uses at runtime to access Azure Storage. The values in the connection string are used to construct the *Authorization* header that is passed to Azure Storage. For more information, see [Configure Azure Storage connection strings](storage-configure-connection-string.md).
- **Shared access signature:** Use a shared access signature to delegate access to resources in your storage account, if you are not using Azure AD authentication. A shared access signature is a token that encapsulates all of the information needed to authorize a request to Azure Storage on the URL. You can specify the storage resource, the permissions granted, and the interval over which the permissions are valid as part of the shared access signature. For more information, see [Using shared access signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md).

> [!NOTE]
> Authenticating users or applications using Azure AD credentials provides superior security and ease of use over other means of authorization. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. You can also continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. 
>
> Microsoft recommends using Azure AD authentication for your Azure Storage blob and queue applications when possible.

## Copying data into a storage account

Microsoft provides utilities and libraries for importing your data from on-premises storage devices or third-party cloud storage providers. Which solution you use depends on the quantity of data you are transferring. 

When you upgrade to a general-purpose v2 account from a general-purpose v1 or Blob storage account, your data is automatically migrated. Microsoft recommends this pathway for upgrading your account. However, if you decide to move data from a general-purpose v1 account to a Blob storage account, then you'll need to migrate your data manually, using the tools and libraries described below. 

### AzCopy

AzCopy is a Windows command-line utility designed for high-performance copying of data to and from Azure Storage. You can use AzCopy to copy data into a Blob storage account from an existing general-purpose storage account, or to upload data from on-premises storage devices. For more information, see [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Data movement library

The Azure Storage data movement library for .NET is based on the core data movement framework that powers AzCopy. The library is designed for high-performance, reliable, and easy data transfer operations similar to AzCopy. You can use it to take advantage of the features provided by AzCopy in your application natively without having to deal with running and monitoring external instances of AzCopy. For more information, see [Azure Storage Data Movement Library for .Net](https://github.com/Azure/azure-storage-net-data-movement)

### REST API or client library

You can create a custom application to migrate your data into a Blob storage account using one of the Azure client libraries or the Azure storage services REST API. Azure Storage provides rich client libraries for multiple languages and platforms like .NET, Java, C++, Node.JS, PHP, Ruby, and Python. The client libraries offer advanced capabilities such as retry logic, logging, and parallel uploads. You can also develop directly against the REST API, which can be called by any language that makes HTTP/HTTPS requests.

For more information about the Azure Storage REST API, see [Azure Storage Services REST API Reference](https://docs.microsoft.com/rest/api/storageservices/). 

> [!IMPORTANT]
> Blobs encrypted using client-side encryption store encryption-related metadata with the blob. If you copy a blob that is encrypted with client-side encryption, ensure that the copy operation preserves the blob metadata, and especially the encryption-related metadata. If you copy a blob without the encryption metadata, the blob content cannot be retrieved again. For more information regarding encryption-related metadata, see [Azure Storage Client-Side Encryption](../common/storage-client-side-encryption.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Azure Import/Export service

If you have a large amount of data to import to your storage account, consider the Azure Import/Export service. The Import/Export service is used to securely import large amounts of data to Azure Blob storage and Azure Files by shipping disk drives to an Azure datacenter. 

The Import/Export service can also be used to transfer data from Azure Blob storage to disk drives and ship to your on-premises sites. Data from one or more disk drives can be imported either to Azure Blob storage or Azure Files. For more information, see [What is Azure Import/Export service?](https://docs.microsoft.com/azure/storage/common/storage-import-export-service).

## Storage account billing

[!INCLUDE [storage-account-billing-include](../../../includes/storage-account-billing-include.md)]

## Next steps

* To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).
* To manage or delete an existing storage account, see [Manage Azure storage accounts](storage-account-manage.md).
