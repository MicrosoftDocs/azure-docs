---
title: Introduction to Azure Storage | Microsoft Docs
description: Introduction to Azure Storage, Microsoft's data storage in the cloud.
services: storage
documentationcenter: ''
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/09/2017
ms.author: robinsh
---
<!-- this is the same version that is in the MVC branch -->
# Introduction to Microsoft Azure Storage

Microsoft Azure Storage is a Microsoft-managed cloud service that provides storage that is highly available, secure, durable, scalable, and redundant. Microsoft takes care of maintenance and handles critical problems for you. 

Azure Storage consists of three data services: Blob storage, File storage, and Queue storage. Blob storage supports both standard and premium storage, with premium storage using only SSDs for the fastest performance possible. Another feature is cool storage, allowing you to storage large amounts of rarely accessed data for a lower cost.

In this article, you learn about the following:
* the Azure Storage services
* the types of storage accounts
* accessing your blobs, queues, and files
* encryption
* replication 
* transferring data into or out of storage
* the many storage client libraries available. 


<!-- RE-ENABLE THESE AFTER MVC GOES LIVE 
To get up and running with Azure Storage quickly, check out one of the following Quickstarts:
* [Create a storage account using PowerShell](storage-quick-create-storage-account-powershell.md)
* [Create a storage account using CLI](storage-quick-create-storage-account-cli.md)
-->


## Introducing the Azure Storage services

To use any of the services provided by Azure Storage -- Blob storage, File storage, and Queue storage -- you first create a storage account, and then you can transfer data to/from a specific service in that storage account. 

## Blob storage

Blobs are basically files like those that you store on your computer (or tablet, mobile device, and so on). They can be pictures, Microsoft Excel files, HTML files, virtual hard disks (VHDs), big data such as logs, database backups  -- pretty much anything. Blobs are stored in containers, which are similar to folders. 

After storing files in Blob storage, you can access them from anywhere in the world using URLs, the REST interface, or one of the Azure SDK storage client libraries. Storage client libraries are available for multiple languages, including Node.js, Java, PHP, Ruby, Python, and .NET. 

There are three types of blobs -- block blobs, append blobs, and page blobs (used for VHD files).

* Block blobs are used to hold ordinary files up to about 4.7 TB. 
* Page blobs are used to hold random access files up to 8 TB in size. These are used for the VHD files that back VMs.
* Append blobs are made up of blocks like the block blobs, but are optimized for append operations. These are used for things like logging information to the same blob from multiple VMs.

For very large datasets where network constraints make uploading or downloading data to Blob storage over the wire unrealistic, you can ship a set of hard drives to Microsoft to import or export data directly from the data center. See [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](../storage-import-export-service.md).

## Azure Files
[Azure Files](../files/storage-files-introduction.md) enables you to set up highly available network file shares that can be accessed by using the standard Server Message Block (SMB) protocol. That means that multiple VMs can share the same files with both read and write access. You can also read the files using the REST interface or the storage client libraries. 

One thing that distinguishes Azure Files from files on a corporate file share is that you can access the files from anywhere in the world using a URL that points to the file and includes a shared access signature (SAS) token. You can generate SAS tokens; they allow specific access to a private asset for a specific amount of time. 

File shares can be used for many common scenarios: 

* Many on-premises applications use file shares. This feature makes it easier to migrate those applications that share data to Azure. If you mount the file share to the same drive letter that the on-premises application uses, the part of your application that accesses the file share should work with minimal, if any, changes.

* Configuration files can be stored on a file share and accessed from multiple VMs. Tools and utilities used by multiple developers in a group can be stored on a file share, ensuring that everybody can find them, and that they use the same version.

* Diagnostic logs, metrics, and crash dumps are just three examples of data that can be written to a file share and processed or analyzed later.

At this time, Active Directory-based authentication and access control lists (ACLs) are not supported, but they will be at some time in the future. The storage account credentials are used to provide authentication for access to the file share. This means anybody with the share mounted will have full read/write access to the share.

## Queue storage

The Azure Queue service is used to store and retrieve messages. Queue messages can be up to 64 KB in size, and a queue can contain millions of messages. Queues are generally used to store lists of messages to be processed asynchronously. 

For example, say you want your customers to be able to upload pictures, and you want to create thumbnails for each picture. You could have your customer wait for you to create the thumbnails while uploading the pictures. An alternative would be to use a queue. When the customer finishes his upload, write a message to the queue. Then have an Azure Function retrieve the message from the queue and create the thumbnails. Each of the parts of this processing can be scaled separately, giving you more control when tuning it for your usage.

<!-- this bookmark is used by other articles; you'll need to update them before this goes into production ROBIN-->
## Table storage
<!-- add a link to the old table storage to this paragraph once it's moved -->
Standard Azure Table Storage is now part of Cosmos DB. Also available is Premium Tables for Azure Table storage, offering throughput-optimized tables, global distribution, and automatic secondary indexes. To learn more and try out the new premium experience, please check out [Azure Cosmos DB: Table API](https://aka.ms/premiumtables).

## Disk storage

The Azure Storage team also owns Disks, which includes all of the managed and unmanaged disk capabilities used by virtual machines. For more information about these features, please see the [Compute Service documentation](https://docs.microsoft.com/azure/#pivot=services&panel=Compute).

## Types of storage accounts 

This table shows the various kinds of storage accounts and which objects can be used with each.

|**Type of storage account**|**General-purpose Standard**|**General-purpose Premium**|**Blob storage, hot and cool access tiers**|
|-----|-----|-----|-----|
|**Services supported**| Blob, File, Queue Services | Blob Service | Blob Service|
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

This section looks two ways to secure the storage account and its data. For detailed information about securing your storage account and your data, see the [Azure Storage security guide](storage-security-guide.md).

### Securing access to storage accounts using Azure AD

One way to secure access to your storage data is by controlling access to the storage account keys. With Resource Manager Role-Based Access Control (RBAC), you can assign roles to users, groups, or applications. These roles are tied to a specific set of actions that are allowed or disallowed. Using RBAC to grant access to a storage account only handles the management operations for that storage account, such as changing the access tier. You can't use RBAC to grant access to data objects like a specific container or file share. You can, however, use RBAC to grant access to the storage account keys, which can then be used to read the data objects. 

### Securing access using shared access signatures 

You can use shared access signatures and stored access policies to secure your data objects. A shared access signature (SAS) is a string containing a security token that can be attached to the URI for an asset that allows you to delegate access to specific storage objects and to specify constraints such as permissions and the date/time range of access. This feature has extensive capabilities. For detailed information, refer to [Using Shared Access Signatures (SAS)](storage-dotnet-shared-access-signature-part-1.md).

### Public access to blobs

The Blob Service allows you to provide public access to a container and its blobs, or a specific blob. When you indicate that a container or blob is public, anyone can read it anonymously; no authentication is required. An example of when you would want to do this is when you have a website that is using images, video, or documents from Blob storage. For more information, see [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md) 

## Encryption

There are a couple of basic kinds of encryption available for the Storage services. 

### Encryption at rest 

You can enable Storage Service Encryption (SSE) on either the Files service (preview) or the Blob service for an Azure storage account. If enabled, all data written to the specific service is encrypted before written. When you read the data, it is decrypted before returned. 

### Client-side encryption

The storage client libraries have methods you can call to programmatically encrypt data before sending it across the wire from the client to Azure. It is stored encrypted, which means it also is encrypted at rest. When reading the data back, you decrypt the information after receiving it. 

### Encryption in transit with Azure File shares

See [Using Shared Access Signatures (SAS)](../storage-dotnet-shared-access-signature-part-1.md) for more information on shared access signatures. See [Manage anonymous read access to containers and blobs](../blobs/storage-manage-access-to-resources.md) and [Authentication for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dd179428.aspx) for more information on secure access to your storage account.

For more details about securing your storage account and encryption, see the [Azure Storage security guide](storage-security-guide.md).

## Replication

In order to ensure that your data is durable, Azure Storage has the ability to keep (and manage) multiple copies of your data. This is called replication, or sometimes redundancy. When you set up your storage account, you select replication type. In most cases, this setting can be modified after the storage account is set up. 

All storage accounts have **locally redundant storage (LRS)**. This means three copies of your data are managed by Azure Storage in the data center specified when the storage account was set up. When changes are committed to one copy, the other two copies are updated before returning success. This means the three replicas are always in sync. Also, the three copies reside in separate fault domains and upgrade domains, which means your data is available even if a storage node holding your data fails or is taken offline to be updated. 

**Locally redundant storage (LRS)**

As explained above, with LRS you have three copies of your data in a single datacenter. This handles the problem of data becoming unavailable if a storage node fails or is taken offline to be updated, but not the case of an entire datacenter becoming unavailable.

**Zone redundant storage (ZRS)**

Zone-redundant storage (ZRS) maintains the three local copies of your data as well as another set of three copies of your data. The second set of three copies is replicated asynchronously across datacenters within one or two regions. Note that ZRS is only available for block blobs in general-purpose storage accounts. Also, once you have created your storage account and selected ZRS, you cannot convert it to use to any other type of replication, or vice versa.

ZRS accounts provide higher durability than LRS, but ZRS accounts do not have metrics or logging capability. 

**Geo-redundant storage (GRS)**

Geo-redundant storage (GRS) maintains the three local copies of your data in a primary region plus another set of three copies of your data in a secondary region hundreds of miles away from the primary region. In the event of a failure at the primary region, Azure Storage will fail over to the secondary region. 

**Read-access geo-redundant storage (RA-GRS)** 

Read-access geo-redundant storage is exactly like GRS except that you get read access to the data in the secondary location. If the primary data center becomes unavailable temporarily, you can continue to read the data from the secondary location. This can be very helpful. For example, you could have a web application that changes into read-only mode and points to the secondary copy, allowing some access even though updates are not available. 

> [!IMPORTANT]
> You can change how your data is replicated after your storage account has been created, unless you specified ZRS when you created the account. However, note that you may incur an additional one-time data transfer cost if you switch from LRS to GRS or RA-GRS.
>

For more information about replication, see [Azure Storage replication](storage-redundancy.md).

For disaster recovery information, see [What to do if an Azure Storage outage occurs](storage-disaster-recovery-guidance.md).

For an example of how to leverage RA-GRS storage to ensure high availability, see [Designing Highly Available Applications using RA-GRS](storage-designing-ha-apps-with-ragrs.md).

## Transferring data to and from Azure Storage

You can use the AzCopy command-line utility to copy blob, and file data within your storage account or across storage accounts. See one of the following articles for help:

* [Transfer data with AzCopy for Windows](storage-use-azcopy.md)
* [Transfer data with AzCopy for Linux](storage-use-azcopy-linux.md)

AzCopy is built on top of the [Azure Data Movement Library](https://www.nuget.org/packages/Microsoft.Azure.Storage.DataMovement/), which is currently available in preview.

The Azure Import/Export service can be used to import or export large amounts of blob data to or from your storage account. You prepare and mail multiple hard drives to an Azure data center, where they will transfer the data to/from the hard drives and send the hard drives back to you. For more information about the Import/Export service, see [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](../storage-import-export-service.md).

## Pricing

For detailed information about pricing for Azure Storage, see the [Pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Storage APIs, libraries, and tools
Azure Storage resources can be accessed by any language that can make HTTP/HTTPS requests. Additionally, Azure Storage offers programming libraries for several popular languages. These libraries simplify many aspects of working with Azure Storage by handling details such as synchronous and asynchronous invocation, batching of operations, exception management, automatic retries, operational behavior, and so forth. Libraries are currently available for the following languages and platforms, with others in the pipeline:

### Azure Storage data services
* [Storage Services REST API](/rest/api/storageservices/)
* [Storage Client Library for .NET](https://docs.microsoft.com/dotnet/api/?view=azurestorage-8.1.1)
* [Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp)
* [Storage Client Library for Java/Android](https://azure.microsoft.com/develop/java/)
* [Storage Client Library for Node.js](http://dl.windowsazure.com/nodestoragedocs/index.html)
* [Storage Client Library for PHP](https://azure.microsoft.com/develop/php/)
* [Storage Client Library for Python](https://azure.microsoft.com/develop/python/)
* [Storage Client Library for Ruby](https://azure.microsoft.com/develop/ruby/)
* [Storage Cmdlets for PowerShell](/powershell/module/azure.storage/?view=azurermps-4.1.0&viewFallbackFrom=azurermps-4.0.0)
* [Storage Commands for CLI 2.0](/cli/azure/storage)

## Next steps

* [Learn more about Blob storage](../blobs/storage-blobs-introduction.md)
* [Learn more about File storage](../storage-files-introduction.md)
* [Learn more about Queue storage](../queues/storage-queues-introduction.md)

<!-- RE-ENABLE THESE AFTER MVC GOES LIVE 
To get up and running with Azure Storage quickly, check out one of the following Quickstarts:
* [Create a storage account using PowerShell](storage-quick-create-storage-account-powershell.md)
* [Create a storage account using CLI](storage-quick-create-storage-account-cli.md)
-->

<!-- FIGURE OUT WHAT TO DO WITH ALL THESE LINKS.

Azure Storage resources can be accessed by any language that can make HTTP/HTTPS requests. Additionally, Azure Storage offers programming libraries for several popular languages. These libraries simplify many aspects of working with Azure Storage by handling details such as synchronous and asynchronous invocation, batching of operations, exception management, automatic retries, operational behavior and so forth. Libraries are currently available for the following languages and platforms, with others in the pipeline:

### Azure Storage data services
* [Storage Services REST API](https://docs.microsoft.com/rest/api/storageservices/)
* [Storage Client Library for .NET](https://docs.microsoft.com/dotnet/api/?view=azurestorage-8.1.1)
* [Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp)
* [Storage Client Library for Java/Android](https://azure.microsoft.com/develop/java/)
* [Storage Client Library for Node.js](http://dl.windowsazure.com/nodestoragedocs/index.html)
* [Storage Client Library for PHP](https://azure.microsoft.com/develop/php/)
* [Storage Client Library for Python](https://azure.microsoft.com/develop/python/)
* [Storage Client Library for Ruby](https://azure.microsoft.com/develop/ruby/)
* [Storage Cmdlets for PowerShell](/powershell/module/azure.storage/?view=azurermps-4.1.0&viewFallbackFrom=azurermps-4.0.0)

### Azure Storage management services
* [Storage Resource Provider REST API Reference](/rest/api/storagerp/)
* [Storage Resource Provider Client Library for .NET](/dotnet/api/microsoft.azure.management.storage)
* [Storage Resource Provider Cmdlets for PowerShell 1.0](/powershell/module/azure.storage)
* [Storage Service Management REST API (Classic)](https://msdn.microsoft.com/library/azure/ee460790.aspx)

### Azure Storage data movement services
* [Storage Import/Export Service REST API](../storage-import-export-service.md)
* [Storage Data Movement Client Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.DataMovement/)

### Tools and utilities
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
* [Azure Storage Client Tools](../storage-explorers.md)
* [Azure SDKs and Tools](https://azure.microsoft.com/tools/)
* [Azure Storage Emulator](http://www.microsoft.com/download/details.aspx?id=43709)
* [Azure PowerShell](/powershell/azure/overview)
* [AzCopy Command-Line Utility](http://aka.ms/downloadazcopy)

## Next steps
To learn more about Azure Storage, explore these resources:

### Documentation
* [Azure Storage Documentation](https://azure.microsoft.com/documentation/services/storage/)
* [Create a storage account](../storage-create-storage-account.md)

<!-- after our quick starts are available, replace this link with a link to one of those. 
Had to remove this article, it refers to the VS quickstarts, and they've stopped publishing them. Robin --> 
<!--* [Get started with Azure Storage in five minutes](storage-getting-started-guide.md)
-->

### For administrators
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [Using Azure CLI with Azure Storage](../storage-azure-cli.md)

### For .NET developers
* [Get started with Azure Blob storage using .NET](../blobs/storage-dotnet-how-to-use-blobs.md)
* [Develop for Azure Files with .NET](../files/storage-dotnet-how-to-use-files.md)
* [Get started with Azure Table storage using .NET](../../cosmos-db/table-storage-how-to-use-dotnet.md)
* [Get started with Azure Queue storage using .NET](../storage-dotnet-how-to-use-queues.md)

### For Java/Android developers
* [How to use Blob storage from Java](../blobs/storage-java-how-to-use-blob-storage.md)
* [Develop for Azure Files with Java](../files/storage-java-how-to-use-file-storage.md)
* [How to use Table storage from Java](../../cosmos-db/table-storage-how-to-use-java.md)
* [How to use Queue storage from Java](../storage-java-how-to-use-queue-storage.md)

### For Node.js developers
* [How to use Blob storage from Node.js](../blobs/storage-nodejs-how-to-use-blob-storage.md)
* [How to use Table storage from Node.js](../../cosmos-db/table-storage-how-to-use-nodejs.md)
* [How to use Queue storage from Node.js](../storage-nodejs-how-to-use-queues.md)

### For PHP developers
* [How to use Blob storage from PHP](../blobs/storage-php-how-to-use-blobs.md)
* [How to use Table storage from PHP](../../cosmos-db/table-storage-how-to-use-php.md)
* [How to use Queue storage from PHP](../storage-php-how-to-use-queues.md)

### For Ruby developers
* [How to use Blob storage from Ruby](../blobs/storage-ruby-how-to-use-blob-storage.md)
* [How to use Table storage from Ruby](../../cosmos-db/table-storage-how-to-use-ruby.md)
* [How to use Queue storage from Ruby](../storage-ruby-how-to-use-queue-storage.md)

### For Python developers
* [How to use Blob storage from Python](../blobs/storage-python-how-to-use-blob-storage.md)
* [Develop for Azure Files with Python](../files/storage-python-how-to-use-file-storage.md)
* [How to use Table storage from Python](../../cosmos-db/table-storage-how-to-use-python.md)
* [How to use Queue storage from Python](../storage-python-how-to-use-queue-storage.md)