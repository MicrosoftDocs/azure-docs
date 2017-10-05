---
title: Frequently asked questions about Azure File storage | Microsoft Docs
description: Find answers to frequently asked questions about Azure File storage.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 07/19/2017
ms.author: renash
---
# Frequently Asked Questions about Azure File storage

## General
* **Q. What is Azure File storage?**  
   
    Azure File storage is a distributed file system in Azure. It provides an SMB protocol interface which allows users to mount the storage as a native share on supported Azure Virtual Machine or on-premises machine.

* **Q. Why is Azure File storage useful?**  
   
    Azure File storage provides shared data access across multiple VMs and platforms. Refer to [Why Azure File storage is useful](storage-files-introduction.md#why-azure-file-storage-is-useful).

* **Q. When should I use Azure File vs Azure Blob vs Azure Disk ?**  
   
    Microsoft Azure provides several ways to store and access data in the cloud.  
   
    Azure File storage - Provides an SMB interface, client libraries, and a REST interface that allows easy access from anywhere to stored files.  
   
    Azure Blobs - Provides client libraries and a REST interface that allows unstructured data to be stored and accessed at a massive scale in block blobs.  
   
    Azure Data Disks - Provides client libraries and a REST interface that allows data to be persistently stored and accessed from an attached virtual hard disk.  
   
    Learn more on [Deciding when to use Azure Blobs, Azure Files, or Azure Data Disks](../common/storage-decide-blobs-files-disks.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)

* **Q. How do I get started using Azure File storage?**  
   
    You can start by creating an Azure file share. You can create Azure File shares using Azure Portal, the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API.In this tutorial, you will learn:

    * [Learn how to create Azure File share using the Portal](storage-how-to-create-file-share.md#create-file-share-through-the-portal)
    * [Learn how to create Azure File share using Powershell](storage-how-to-create-file-share.md#create-file-share-through-powershell)
    * [Learn how to create Azure File share using CLI](storage-how-to-create-file-share.md#create-file-share-through-command-line-interface-cli)

* **Q. What replications are supported by Azure File storage?**  
   
    Azure File storage only supports LRS or GRS right now. We plan to support RA-GRS but there is no timeline to share yet.
    
## Scale Targets/Limits

* **Q. How many clients can I mount the fileshares on simultaneously?**

    There is a 2000 open handles quota on a fileshare. Once you have 2000 open handles, you will get an error that quota is reached.

## Security, Authentication and Access Control

* **Q. What are different ways to access files in Azure File storage?**
    
    You can mount the file share on your local machine using SMB 3.0 protocol or use tools like [Storage Explorer](http://storageexplorer.com/) to access files in your file share. From your application, you can use storage client libraries, REST APIs or Powershell to access your files in Azure File share.

* **Q. How can I provide access to a specific file using a web browser?**
    
    Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a particular file for a specific period of time. Anyone who possesses this url can access the file directly from any web browser while it is valid. SAS keys can be easily generated from UI like Storage Explorer.

* **Q. Is it possible to specify read-only or write-only permissions on folders within the share?**
    
    You don't have this level of control over permissions if you mount the file share via SMB. However, you can achieve this by creating a shared access signature (SAS) via the REST API or client libraries.  

* **Q. How can I enable Server Side encryption for Azure File storage?**

    [Server Side Encryption](../common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for Azure File storage is generally available in all regions and public and national clouds. You can enable SSE for Azure File storage using [Azure portal](https://portal.azure.com/),[Microsoft Azure Storage Resource Provider API](/rest/api/storagerp/storageaccounts), [Azure Powershell](https://msdn.microsoft.com/library/azure/mt607151.aspx) or [Azure CLI](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
    
    After enabling SSE on Azure File storage, any new data written to the file storage in that storage account will be automatically encrypted. This feature is available for all new data written to existing or new shares in an existing or new storage account. There is no additional charge for enabling this feature. Learn more on [how to enable SSE on Azure File storage](../common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

* **Q. Is Active Directory-based authentication supported by Azure File storage?**
   
    We currently do not support AD-based authentication or ACLs, but do have it in our list of feature requests. For now, the Azure Storage account keys are used to provide authentication to the file share. We do offer a workaround using shared access signatures (SAS) via the REST API or the client libraries. Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a given file with 10 minutes expiry. Anyone who possesses this token while it is valid has read-only access to that file for those 10 minutes.
   
    SAS is only supported via the REST API or client libraries. When you mount the file share via the SMB protocol, you can't use a SAS to delegate access to its contents. 
    
* **Q. What are the data compliance policies supported for Azure File storage?**

   Azure File Storage runs on top of the same storage architecture as other storage services in Azure Storage and applies the same data compliance policies. More information on Azure Storage data compliance, you can download and refer to [Microsoft Azure Data Protection document](http://go.microsoft.com/fwlink/?LinkID=398382&clcid=0x409).

## On-Premises Access

* **Q.Do I have to use Azure ExpressRoute to connect to Azure File storage from an on-premises VM?**
   
    No. If you don't have ExpressRoute, you can still access the file share from on-premises as long as you have port 445 (TCP Outbound) open for Internet access. However, you can use ExpressRoute with Azure File storage if you like.

* **Q. How can I mount an Azure File share on my local machine?** 
    
    You can mount the file share via the SMB protocol as long as port 445 (TCP Outbound) is open and your client supports the SMB 3.0 protocol (for example, you're using Windows 10 or Windows Server 2012). Please work with your local ISP provider to unblock the port. In the interim, you can view your files using [Storage Explorer](../../vs-azure-tools-storage-explorer-files.md#view-a-file-shares-contents).


## Billing and Pricing
* **Q. Does the network traffic between an Azure VM and a file share count as external bandwidth that is charged to the subscription?**
   
    If the file share and VM are in the same Azure region, the traffic between them is free. If they are in different regions, the traffic between them will be charged as external bandwidth.

## Backup

* **Q. How do I backup my Azure File Share?**
    
    You can use AzCopy, RoboCopy, or a 3rd party backup tool that can backup a mounted file share. We expect to have the ability to take snapshots of File shares in the near future; you will be able to use this feature to backup your Azure File share.

## Performance

* **Q. What are the scale limits of Azure File storage?**
    For information on scalability and performance targets of Azure File storage, see [Azure Storage Scalability and Performance Targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#scalability-targets-for-blobs-queues-tables-and-files).

* **Q. My performance was slow when trying to unzip files into Azure File storage. What should I do?**
    
    To transfer large numbers of files into Azure File storage, we recommend that you use AzCopy(Windows, Preview for Linux/Unix) or Azure Powershell as these tools have been optimized for network transfer.

* **Q. What patches has been released to fix slow-performance issue with Azure File storage?**
    
    The Windows team recently released a patch to fix a slow performance issue when the customer accesses Azure File storage from Windows 8.1 or Windows Server 2012 R2. For more information, please check out the associated KB article, [Slow performance when you access Azure File storage from Windows 8.1 or Server 2012 R2](https://support.microsoft.com/kb/3114025).

## Features and Interoperability with other services
* **Q. Is a "File Share Witness" for a failover cluster one of the use cases for Azure File storage?**
   
    This is not currently supported.

* **Q. Is there a rename operation in the REST API?**
   
    Not at this time.

* **Q. Can you have nested shares, in other words, a share under a share?**
    
    No. The file share is the virtual driver that you can mount, so nested shares are not supported.

* **Q. Using Azure File storage with IBM MQ**
    
    IBM has released a document to guide IBM MQ customers when configuring Azure File storage with their service. For more information, please check out [How to setup IBM MQ Multi instance queue manager with Microsoft Azure File Service](https://github.com/ibm-messaging/mq-azure/wiki/How-to-setup-IBM-MQ-Multi-instance-queue-manager-with-Microsoft-Azure-File-Service).


## Troubleshooting
* **Q. How do I troubleshoot Azure File storage errors?**
    
    You can refer to [Azure File storage Troubleshooting Article](storage-troubleshoot-windows-file-connection-problems.md) for end-to-end troubleshooting guidance. 


## See also
See these links for more information about Azure File storage.

### Conceptual articles and videos
* [Azure File storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure File storage with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage
* [How to use AzCopy with Microsoft Azure Storage](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)
* [Using the Azure CLI with Azure Storage](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)
* [Troubleshooting Azure File storage problems](storage-troubleshoot-linux-file-connection-problems.md)

### Blog posts
* [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Migrating data to Azure File storage](https://azure.microsoft.com/blog/migrating-data-to-microsoft-azure-files/)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)
