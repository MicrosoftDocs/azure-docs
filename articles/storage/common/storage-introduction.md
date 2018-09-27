---
title: Introduction to Azure Storage - Cloud storage on Azure | Microsoft Docs
description: Azure Storage is Microsoft's cloud storage solution. Azure Storage provides storage for data objects that is highly available, secure, durable, massively scalable, and redundant.
services: storage
author: tamram
ms.service: storage
ms.topic: get-started-article
ms.date: 07/11/2018
ms.author: tamram
ms.component: common
---

# Introduction to Azure Storage

Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers a massively scalable object store for data objects, a file system service for the cloud, a messaging store for reliable messaging, and a NoSQL store. Azure Storage is:

- **Durable and highly available.** Redundancy ensures that your data is safe in the event of transient hardware failures. You can also opt to replicate data across datacenters or geographical regions for additional protection from local catastrophe or natural disaster. Data replicated in this way remains highly available in the event of an unexpected outage. 
- **Secure.** All data written to Azure Storage is encrypted by the service. Azure Storage provides you with fine-grained control over who has access to your data.
- **Scalable.** Azure Storage is designed to be massively scalable to meet the data storage and performance needs of today's applications. 
- **Managed.** Microsoft Azure handles maintenance and any critical problems for you.
- **Accessible.** Data in Azure Storage is accessible from anywhere in the world over HTTP or HTTPS. Microsoft provides SDKs for Azure Storage in a variety of languages -- .NET, Java, Node.js, Python, PHP, Ruby, Go, and others -- as well as a mature REST API. Azure Storage supports scripting in Azure PowerShell or Azure CLI. And the Azure portal and Azure Storage Explorer offer easy visual solutions for working with your data.  

## Azure Storage services

Azure Storage includes these data services: 

- [Azure Blobs](../blobs/storage-blobs-introduction.md): A massively scalable object store for text and binary data.
- [Azure Files](../files/storage-files-introduction.md): Managed file shares for cloud or on-premises deployments.
- [Azure Queues](../queues/storage-queues-introduction.md): A messaging store for reliable messaging between application components. 
- [Azure Tables](../tables/table-storage-overview.md): A NoSQL store for schemaless storage of structured data.

Each service is accessed through a storage account. To get started, see [Create a storage account](storage-quickstart-create-account.md).

## Blob storage

Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data, such as text or binary data. 

Blob storage is ideal for:

* Serving images or documents directly to a browser.
* Storing files for distributed access.
* Streaming video and audio.
* Storing data for backup and restore, disaster recovery, and archiving.
* Storing data for analysis by an on-premises or Azure-hosted service.

Objects in Blob storage can be accessed from anywhere in the world via HTTP or HTTPS. Users or client applications can access blobs via URLs, the [Azure Storage REST API](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api), [Azure PowerShell](https://docs.microsoft.com/powershell/module/azure.storage), [Azure CLI](https://docs.microsoft.com/cli/azure/storage), or an Azure Storage client library. The storage client libraries are available for multiple languages, including [.NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage/client), [Java](https://docs.microsoft.com/java/api/overview/azure/storage/client), [Node.js](http://azure.github.io/azure-storage-node), [Python](https://azure-storage.readthedocs.io/), [PHP](http://azure.github.io/azure-storage-php/), and [Ruby](http://azure.github.io/azure-storage-ruby).

For more information about Blob storage, see [Introduction to object storage on Azure](../blobs/storage-blobs-introduction.md).

## Azure Files
[Azure Files](../files/storage-files-introduction.md) enables you to set up highly available network file shares that can be accessed by using the standard Server Message Block (SMB) protocol. That means that multiple VMs can share the same files with both read and write access. You can also read the files using the REST interface or the storage client libraries.

One thing that distinguishes Azure Files from files on a corporate file share is that you can access the files from anywhere in the world using a URL that points to the file and includes a shared access signature (SAS) token. You can generate SAS tokens; they allow specific access to a private asset for a specific amount of time.

File shares can be used for many common scenarios:

* Many on-premises applications use file shares. This feature makes it easier to migrate those applications that share data to Azure. If you mount the file share to the same drive letter that the on-premises application uses, the part of your application that accesses the file share should work with minimal, if any, changes.

* Configuration files can be stored on a file share and accessed from multiple VMs. Tools and utilities used by multiple developers in a group can be stored on a file share, ensuring that everybody can find them, and that they use the same version.

* Diagnostic logs, metrics, and crash dumps are just three examples of data that can be written to a file share and processed or analyzed later.

At this time, Active Directory-based authentication and access control lists (ACLs) are not supported, but they will be at some time in the future. The storage account credentials are used to provide authentication for access to the file share. This means anybody with the share mounted will have full read/write access to the share.

For more information about Azure Files, see [Introduction to Azure Files](../files/storage-files-introduction.md).

## Queue storage

The Azure Queue service is used to store and retrieve messages. Queue messages can be up to 64 KB in size, and a queue can contain millions of messages. Queues are generally used to store lists of messages to be processed asynchronously.

For example, say you want your customers to be able to upload pictures, and you want to create thumbnails for each picture. You could have your customer wait for you to create the thumbnails while uploading the pictures. An alternative would be to use a queue. When the customer finishes his upload, write a message to the queue. Then have an Azure Function retrieve the message from the queue and create the thumbnails. Each of the parts of this processing can be scaled separately, giving you more control when tuning it for your usage.

For more information about Azure Queues, see [Introduction to Queues](../queues/storage-queues-introduction.md).

## Table storage

Azure Table storage is now part of Azure Cosmos DB. To see Azure Table storage documentation, see the [Azure Table Storage Overview](../tables/table-storage-overview.md). In addition to the existing Azure Table storage service, there is a new Azure Cosmos DB Table API offering that provides throughput-optimized tables, global distribution, and automatic secondary indexes. To learn more and try out the new premium experience, please check out [Azure Cosmos DB Table API](https://aka.ms/premiumtables).

For more information about Table storage, see [Overview of Azure Table storage](../tables/table-storage-overview.md).

## Disk storage

Azure Storage also includes managed and unmanaged disk capabilities used by virtual machines. For more information about these features, please see the [Compute Service documentation](https://docs.microsoft.com/en-gb/azure/#pivot=products&panel=Compute).

## Types of storage accounts

This table shows the various kinds of storage accounts and which objects can be used with each.

|**Type of storage account**|**General-purpose Standard**|**General-purpose Premium**|**Blob storage, hot and cool access tiers**|
|-----|-----|-----|-----|
|**Services supported**| Blob, File, Queue, and Table Services | Blob Service | Blob Service|
|**Types of blobs supported**|Block blobs, page blobs, and append blobs | Page blobs | Block blobs and append blobs|

### General-purpose storage accounts

There are two kinds of general-purpose storage accounts.

#### Standard storage

The most widely used storage accounts are standard storage accounts, which can be used for all types of data. Standard storage accounts use magnetic media to store data.

#### Premium storage

Premium storage provides high-performance storage for page blobs, which are primarily used for VHD files. Premium storage accounts use SSD to store data. Microsoft recommends using Premium Storage for all of your VMs.

### Blob Storage accounts

The Blob Storage account is a specialized storage account used to store block blobs and append blobs. You can't store page blobs in these accounts, therefore you can't store VHD files. These accounts allow you to set an access tier to Hot or Cool; the tier can be changed at any time.

The hot access tier is used for files that are accessed frequently -- you pay a higher cost for storage, but the cost of accessing the blobs is much lower. For blobs stored in the cool access tier, you pay a higher cost for accessing the blobs, but the cost of storage is much lower.

## Accessing your blobs, files, and queues

Each storage account has two authentication keys, either of which can be used for any operation. There are two keys so you can roll over the keys occasionally to enhance security. It is critical that these keys be kept secure because their possession, along with the account name, allows unlimited access to all data in the storage account.

This section looks at two ways to secure the storage account and its data. For detailed information about securing your storage account and your data, see the [Azure Storage security guide](storage-security-guide.md).

### Securing access to storage accounts using Azure AD

One way to secure access to your storage data is by controlling access to the storage account keys. With Resource Manager Role-Based Access Control (RBAC), you can assign roles to users, groups, or applications. These roles are tied to a specific set of actions that are allowed or disallowed. Using RBAC to grant access to a storage account only handles the management operations for that storage account, such as changing the access tier. You can't use RBAC to grant access to data objects like a specific container or file share. You can, however, use RBAC to grant access to the storage account keys, which can then be used to read the data objects.

### Securing access using shared access signatures

You can use shared access signatures and stored access policies to secure your data objects. A shared access signature (SAS) is a string containing a security token that can be attached to the URI for an asset that allows you to delegate access to specific storage objects and to specify constraints such as permissions and the date/time range of access. This feature has extensive capabilities. For detailed information, refer to [Using Shared Access Signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md).

### Public access to blobs

The Blob Service allows you to provide public access to a container and its blobs, or a specific blob. When you indicate that a container or blob is public, anyone can read it anonymously; no authentication is required. An example of when you would want to do this is when you have a website that is using images, video, or documents from Blob storage. For more information, see [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md)

## Encryption

There are two basic kinds of encryption available for the Storage services. For more information about security and encryption, see the [Azure Storage security guide](storage-security-guide.md).

### Encryption at rest

Azure Storage Service Encryption (SSE) at rest helps you protect and safeguard your data to meet your organizational security and compliance commitments. With this feature, Azure Storage automatically encrypts your data prior to persisting to storage and decrypts prior to retrieval. The encryption, decryption, and key management are totally transparent to users.


SSE automatically encrypts data in all performance tiers (Standard and Premium), all deployment models (Azure Resource Manager and Classic), and all of the Azure Storage services (Blob, Queue, Table, and File). SSE does not affect Azure Storage performance.

For more information about SSE encryption at rest, see [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md).

### Client-side encryption

The storage client libraries have methods you can call to programmatically encrypt data before sending it across the wire from the client to Azure. It is stored encrypted, which means it also is encrypted at rest. When reading the data back, you decrypt the information after receiving it.

For more information about client-side encryption, see [Client-Side Encryption with .NET for Microsoft Azure Storage](storage-client-side-encryption.md).

## Replication

In order to ensure that your data is durable, Azure Storage replicates multiple copies of your data. When you set up your storage account, you select a replication type. In most cases, this setting can be modified after the storage account has been created. 

[!INCLUDE [storage-common-redundancy-options](../../../includes/storage-common-redundancy-options.md)]

For disaster recovery information, see [What to do if an Azure Storage outage occurs](storage-disaster-recovery-guidance.md).

## Transferring data to and from Azure Storage

You can use the AzCopy command-line utility to copy blob, and file data within your storage account or across storage accounts. See one of the following articles for help:

* [Transfer data with AzCopy for Windows](storage-use-azcopy.md)
* [Transfer data with AzCopy for Linux](storage-use-azcopy-linux.md)

AzCopy is built on top of the [Azure Data Movement Library](https://www.nuget.org/packages/Microsoft.Azure.Storage.DataMovement/), which is currently available in preview.

The Azure Import/Export service can be used to import or export large amounts of blob data to or from your storage account. You prepare and mail multiple hard drives to an Azure data center, where they will transfer the data to/from the hard drives and send the hard drives back to you. For more information about the Import/Export service, see [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](../storage-import-export-service.md).

To import large amounts of blob data to your storage account in a quick, inexpensive, and reliable way, you can also use Azure Data Box Disk. Microsoft ships up to 5 encrypted solid-state disks (SSDs) with a 40 TB capacity, to your datacenter through a regional carrier. You quickly configure the disks, copy data to disks over a USB connection, and ship the disks back to Azure. In the Azure datacenter, your data is automatically uploaded from drives to the cloud. For more information about this solution, go to [Azure Data Box Disk overview](https://docs.microsoft.com/azure/databox/data-box-disk-overview).

## Pricing

For detailed information about pricing for Azure Storage, see the [Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Storage APIs, libraries, and tools
Azure Storage resources can be accessed by any language that can make HTTP/HTTPS requests. Additionally, Azure Storage offers programming libraries for several popular languages. These libraries simplify many aspects of working with Azure Storage by handling details such as synchronous and asynchronous invocation, batching of operations, exception management, automatic retries, operational behavior, and so forth. Libraries are currently available for the following languages and platforms, with others in the pipeline:

### Azure Storage data API and library references
* [Storage Services REST API](https://docs.microsoft.com/rest/api/storageservices/)
* [Storage Client Library for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage)
* [Storage Client Library for Java/Android](https://docs.microsoft.com/java/api/overview/azure/storage)
* [Storage Client Library for Node.js](https://docs.microsoft.com/javascript/api/azure-storage)
* [Storage Client Library for Python](https://github.com/Azure/azure-storage-python)
* [Storage Client Library for PHP](https://github.com/Azure/azure-storage-php)
* [Storage Client Library for Ruby](https://github.com/Azure/azure-storage-ruby)
* [Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp)

### Azure Storage management API and library references
* [Storage Resource Provider REST API](https://docs.microsoft.com/rest/api/storagerp/)
* [Storage Resource Provider Client Library for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage/management)
* [Storage Service Management REST API (Classic)](https://msdn.microsoft.com/library/azure/ee460790.aspx)

### Azure Storage data movement API and library references
* [Storage Import/Export Service REST API](https://docs.microsoft.com/rest/api/storageimportexport/)
* [Storage Data Movement Client Library for .NET](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.datamovement)

### Tools and utilities
* [Azure PowerShell Cmdlets for Storage](https://docs.microsoft.com/powershell/module/azure.storage)
* [Azure CLI Cmdlets for Storage](https://docs.microsoft.com/cli/azure/storage)
* [AzCopy Command-Line Utility](http://aka.ms/downloadazcopy)
* [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
* [Azure Storage Client Tools](../storage-explorers.md)
* [Azure Developer Tools](https://azure.microsoft.com/tools/)

## Next steps

To get up and running with Azure Storage, see [Create a storage account](storage-quickstart-create-account.md).
