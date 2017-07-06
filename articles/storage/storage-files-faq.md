---
title: Frequently asked questions about Azure File Storage | Microsoft Docs
description: Find answers to frequently asked questions about Azure File Storage.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 05/27/2017
ms.author: renash
---
# Frequently Asked Questions about Azure File Storage

## General
* **Q. What is Azure File Storage?**  
   
    Azure File Storage is a distributed file system in Azure. It provides an SMB protocol interface which allows users to mount the storage as a native share on supportedAzure Virtual Machine or  on-premises machine.

* **Q. Why is Azure File Storage useful?**  
   
    Azure File Storage provides shared data access across multiple VMs and platforms. Refer to [Why Azure File Storage is useful](storage-files-introduction.md#why-azure-file-storage-is-useful).

* **Q. When should I use Azure File vs Azure Blob vs Azure Disk ?**  
   
    Microsoft Azure provides several ways to store and access data in the cloud.  
   
    Azure File Storage - Provides an SMB interface, client libraries, and a REST interface that allows easy access from anywhere to stored files.  
   
    Azure Blobs - Provides client libraries and a REST interface that allows unstructured data to be stored and accessed at a massive scale in block blobs.  
   
    Azure Data Disks - Provides client libraries and a REST interface that allows data to be persistently stored and accessed from an attached virtual hard disk.  
   
    Learn more on [Deciding when to use Azure Blobs, Azure Files, or Azure Data Disks](storage-decide-blobs-files-disks.md)

* **Q. How do I get started using Azure FIle Storage?**  
   
    You can start by creating an Azure file share. You can create Azure File shares using Azure Portal, the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API.In this tutorial, you will learn:

    * [Learn how to create Azure File share using the Portal](storage-file-how-to-create-file-share.md#create-file-share-through-the-portal)
    * [Learn how to create Azure File share using Powershell](storage-file-how-to-create-file-share.md#create-file-share-through-powershell)
    * [Learn how to create Azure File share using CLI](storage-file-how-to-create-file-share.md#create-file-share-through-command-line-interface-cli)

* **Q. What replications are supported by Azure File Storage?**  
   
    Azure File stroage only supports LRS or GRS right now. We plan to support RA-GRS but there is no timeline to share yet.

## Security, Authentication and Access Control

* **Q. What are different ways to access files in Azure File Storage?**
    
    You can mount the file share on your local machine using SMB 3.0 protocol or use tools like [Storage Explorer](http://storageexplorer.com/) to access files in your file share. From your application, you can use storage client libraries, REST APIs or Powershell to access your files in Azure File share.

* **Q. How can I provide access to a specific file using a web browser?**
    
    Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a particular file for a specific period of time. Anyone who possesses this url can access the file directly from any web browser while it is valid. SAS keys can be easily generated from UI like Storage Explorer.

* **Q. Is it possible to specify read-only or write-only permissions on folders within the share?**
    
    You don't have this level of control over permissions if you mount the file share via SMB. However, you can achieve this by creating a shared access signature (SAS) via the REST API or client libraries.  

* **Q. How can I enable Server Side encryption for Azure File Storage?**

    [Server Side Encryption](storage-service-encryption.md) for Azure File Storage is generally available in all regions and public and national clouds. You can enable SSE for Azure File Storage using [Azure portal](https://portal.azure.com/),[Microsoft Azure Storage Resource Provider API](/rest/api/storagerp/storageaccounts), [Azure Powershell](https://msdn.microsoft.com/library/azure/mt607151.aspx) or [Azure CLI](storage-azure-cli.md).
    
    After enabling SSE on Azure File Storage, any new data written to the file storage in that storage account will be automatically encrypted. This feature is available for all new data written to existing or new shares in an existing or new storage account. There is no additional charge for enabling this feature. Learn more on [how to enable SSE on Azure File Storage](storage-service-encryption.md).

* **Q. Is Active Directory-based authentication supported by Azure File Storage?**
   
    We currently do not support AD-based authentication or ACLs, but do have it in our list of feature requests. For now, the Azure Storage account keys are used to provide authentication to the file share. We do offer a workaround using shared access signatures (SAS) via the REST API or the client libraries. Using SAS, you can generate tokens with specific permissions that are valid for a specified time interval. For example, you can generate a token with read-only access to a given file with 10 minutes expiry. Anyone who possesses this token while it is valid has read-only access to that file for those 10 minutes.
   
    SAS is only supported via the REST API or client libraries. When you mount the file share via the SMB protocol, you can't use a SAS to delegate access to its contents. 

## On-Premises Access

* **Q.Do I have to use Azure ExpressRoute to connect to Azure File Storage from an on-premises VM?**
   
    No. If you don't have ExpressRoute, you can still access the file share from on-premises as long as you have port 445 (TCP Outbound) open for Internet access. However, you can use ExpressRoute with Azure File Storage if you like.

* **Q. How can I mount an Azure File share on my local machine?** 
    
    You can mount the file share via the SMB protocol as long as port 445 (TCP Outbound) is open and your client supports the SMB 3.0 protocol (for example, you're using Windows 10 or Windows Server 2012). Please work with your local ISP provider to unblock the port. In the interim, you can view your files using [Storage Explorer](../vs-azure-tools-storage-explorer-files.md#view-a-file-shares-contents).


## Billing and Pricing
* **Q. Does the network traffic between an Azure VM and a file share count as external bandwidth that is charged to the subscription?**
   
    If the file share and VM are in the same Azure region, the traffic between them is free. If they are in different regions, the traffic between them will be charged as external bandwidth.

## Backup

* **Q. How do I backup my Azure File Share?**
    
    You can use AzCopy, RoboCopy, or a 3rd party backup tool that can backup a mounted file share. We expect to have the ability to take snapshots of File shares in the near future; you will be able to use this feature to backup your Azure File share.

## Performance

* **Q. What are the scale limits of Azure File Storage?**
    For information on scalability and performance targets of Azure File Storage, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md#scalability-targets-for-blobs-queues-tables-and-files).

* **Q. My performance was slow when trying to unzip files into Azure File Storage. What should I do?**
    
    To transfer large numbers of files into Azure File Storage, we recommend that you use AzCopy(Windows, Preview for Linux/Unix) or Azure Powershell as these tools have been optimized for network transfer.

* **Q. What patches has been released to fix slow-performance issue with Azure File Storage?**
    
    The Windows team recently released a patch to fix a slow performance issue when the customer accesses Azure File Storage from Windows 8.1 or Windows Server 2012 R2. For more information, please check out the associated KB article, [Slow performance when you access Azure File Storage from Windows 8.1 or Server 2012 R2](https://support.microsoft.com/kb/3114025).

## Features and Interoperability with other services
* **Q. Is a "File Share Witness" for a failover cluster one of the use cases for Azure File Storage?**
   
    This is not currently supported.

* **Q. Is there a rename operation in the REST API?**
   
    Not at this time.

* **Q. Can you have nested shares, in other words, a share under a share?**
    
    No. The file share is the virtual driver that you can mount, so nested shares are not supported.

* **Q. Using Azure File Storage with IBM MQ**
    
    IBM has released a document to guide IBM MQ customers when configuring Azure File Storage with their service. For more information, please check out [How to setup IBM MQ Multi instance queue manager with Microsoft Azure File Service](https://github.com/ibm-messaging/mq-azure/wiki/How-to-setup-IBM-MQ-Multi-instance-queue-manager-with-Microsoft-Azure-File-Service).


## Troubleshooting
* **Q. How do I troubleshoot Azure File Storage errors?**
    
    You can refer to [Azure File Storage Troubleshooting Article](storage-troubleshoot-file-connection-problems.md) for end-to-end troubleshooting guidance. 


## See also
See these links for more information about Azure File storage.

### Conceptual articles and videos
* [Azure File Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure File Storage with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
* [Using the Azure CLI with Azure Storage](storage-azure-cli.md)
* [Troubleshooting Azure File Storage problems](storage-troubleshoot-file-connection-problems.md)

### Blog posts
* [Azure File Storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Migrating data to Azure File Storage](https://azure.microsoft.com/blog/migrating-data-to-microsoft-azure-files/)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)

