---
title: Azure storage account overview | Microsoft Docs
description: Understand options for creating and using an Azure Storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/07/2019
ms.author: tamram
ms.subservice: common
---

# Azure storage account overview

An Azure storage account contains all of your Azure Storage data objects: blobs, files, queues, tables, and disks. The storage account provides a unique namespace for your Azure Storage data that is accessible from anywhere in the world over HTTP or HTTPS. Data in your Azure storage account is durable and highly available, secure, and massively scalable.

To learn how to create an Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).

## Types of storage accounts

[!INCLUDE [storage-account-types-include](../../../includes/storage-account-types-include.md)]

### General-purpose v2 accounts

General-purpose v2 storage accounts support the latest Azure Storage features and incorporate all of the functionality of general-purpose v1 and Blob storage accounts. General-purpose v2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices. General-purpose v2 storage accounts support these Azure Storage services:

- Blobs (all types: Block, Append, Page)
- Files
- Disks
- Queues
- Tables

> [!NOTE]
> Microsoft recommends using a general-purpose v2 storage account for most scenarios. You can easily upgrade a general-purpose v1 or Blob storage account to a general-purpose v2 account with no downtime and without the need to copy data.
>
> For more information on upgrading to a general-purpose v2 account, see [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md).

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

### Block blob storage accounts

A block blob storage account is a specialized storage account for storing unstructured object data as block blobs. This storage account type supports block blobs and append blobs, but not page blobs, tables or queues.

Compared with general-purpose v2 and blob storage accounts, block blob storage accounts provide low and consistent latency, and higher transaction rates.

Block blob storage accounts do not currently support tiering to hot, cool, or archive access tiers.

### FileStorage storage accounts

A FileStorage storage account is a specialized storage account used to store and create premium file shares. FileStorage storage accounts offer unique performance dedicated characteristics such as IOPS bursting. For more information on these characteristics, see the [File share performance tiers](../files/storage-files-planning.md#file-share-performance-tiers) section of the Files planning guide.

## Naming storage accounts

When naming your storage account, keep these rules in mind:

- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.

## Performance tiers

General-purpose storage accounts may be configured for either of the following performance tiers:

* A standard performance tier for storing blobs, files, tables, queues, and Azure virtual machine disks.
* A premium performance tier for storing unmanaged virtual machine disks only.

Block blob storage accounts provide a premium performance tier for storing block blobs and append blobs.

FileStorage storage accounts provide a premium performance tier for Azure file shares.

## Access tiers for block blob data

Azure Storage provides different options for accessing block blob data based on usage patterns. Each access tier in Azure Storage is optimized for a particular pattern of data usage. By selecting the right access tier for your needs, you can store your block blob data in the most cost-effective manner.

The available access tiers are:

* The **Hot** access tier, which is optimized for frequent access of objects in the storage account. Accessing data in the hot tier is most cost-effective, while storage costs are higher. New storage accounts are created in the hot tier by default.
* The **Cool** access tier, which is optimized for storing large amounts of data that is infrequently accessed and stored for at least 30 days. Storing data in the cool tier is more cost-effective, but accessing that data may be more expensive than accessing data in the hot tier.
* The **Archive** tier, which is available only for individual block blobs. The archive tier is optimized for data that can tolerate several hours of retrieval latency and will remain in the Archive tier for at least 180 days. The archive tier is the most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers.

If there is a change in the usage pattern of your data, you can switch between these access tiers at any time. For more information about access tiers, see [Azure Blob storage: hot, cool, and archive access tiers](../blobs/storage-blob-storage-tiers.md).

> [!IMPORTANT]
> Changing the access tier for an existing storage account or blob may result in additional charges. For more information, see the [Storage account billing section](#storage-account-billing).

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
> Block blob and blob storage accounts expose only the blob service endpoint.

The URL for accessing an object in a storage account is constructed by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure your storage account to use a custom domain for blobs. For more information, see [Configure a custom domain name for your Azure Storage account](../blobs/storage-custom-domain-name.md).  

## Control access to account data

By default, the data in your account is available only to you, the account owner. You have control over who may access your data and what permissions they have.

Every request made against your storage account must be authorized. At the level of the service, the request must include a valid *Authorization* header, which includes all of the information necessary for the service to validate the request before executing it.

You can grant access to the data in your storage account using any of the following approaches:

- **Azure Active Directory:** Use Azure Active Directory (Azure AD) credentials to authenticate a user, group, or other identity for access to blob and queue data. If authentication of an identity is successful, then Azure AD returns a token to use in authorizing the request to Azure Blob storage or Queue storage. For more information, see [Authenticate access to Azure Storage using Azure Active Directory](storage-auth-aad.md).
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

* To learn how to create a general-purpose Azure storage account, see [Create a storage account](storage-quickstart-create-account.md).
* To learn how to create a block blob storage account, see [Create a block blob storage account](../blobs/storage-blob-create-account-block-blob.md).
* To manage or delete an existing storage account, see [Manage Azure storage accounts](storage-account-manage.md).
