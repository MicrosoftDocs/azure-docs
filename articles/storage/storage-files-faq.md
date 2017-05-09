---
title: Azure File Storage Frequently Asked Questions | Microsoft Docs
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
ms.topic: get-started-article
ms.date: 03/21/2017
ms.author: renash
---
# Azure File Storage FAQ

* [General](#general)
* [Security, Authentication and Access Control](#security)
* [On-Premises Access](#onpremise)
* [Billing and Pricing](#billing)
* [Backup](#backup)
* [Performance](#performance)
* [Troubleshooting](#troubleshooting)

<a id="general"></a>
## General


* **Q. File storage is replicated only via LRS or GRS right now, right?**  
   
    We plan to support RA-GRS but there is no timeline to share yet.

<a id="security"></a>
## Security, Authentication and Access Control

* **Q. What are different ways to access files in Azure File storage?**
    
    You can mount the fileshare on your local machine using SMB 3.0 protocol or use tools like [Storage Explorer](http://storageexplorer.com/) or Cloudberry to access files in your file share. From your application, you can use Client Libraries, REST API or Powershell to access your files in Azure File share.

* **Q. How can I provide access to a specific file over a web browser?**
    
    Using SAS, you can generate tokens with specific permissions that are valid over a specified time interval. For example, you can generate a token with read-only access to a particular file for a specific period of time. Anyone who possesses this url can perform download directly from any web browser while it is valid. SAS keys can be easily generated from UI like Storage Explorer.

* **Q. Is it possible to specify read-only or write-only permissions on folders within the share?**
    
    You don't have this level of control over permissions if you mount the file share via SMB. However, you can achieve this by creating a shared access signature (SAS) via the REST API or client libraries.  

* **Q. How can I enable Server Side encryption for Azure File Storage?**

    [Server Side Encryption](https://docs.microsoft.com/en-us/azure/storage/storage-service-encryption) is currently in Preview. During preview, the feature can only be enabled for newly created Azure Resource Manager (ARM) Storage accounts.
    You can enable this feature on Azure Resource Manager storage account using the Azure Portal. We plan to have [Azure Powershell](https://msdn.microsoft.com/en-us/library/azure/mt607151.aspx), [Azure CLI](https://docs.microsoft.com/en-us/azure/storage/storage-azure-cli-nodejs) or the [Microsoft Azure Storage Resource Provider API](https://docs.microsoft.com/en-us/rest/api/storagerp/storageaccounts) for enabling encryption for file storage by end of February. There is no additional charge for enabling this feature. When you enable Storage Service Encryption for Azure File Storage your data is automatically encrypted for you. 
    Find out more about Storage Service Encryption. You can also reach out to ssediscussions@microsoft.com for additional questions on the preview.

* **Q. Is Active Directory-based authentication supported by File storage?**
   
    We currently do not support AD-based authentication or ACLs, but do have it in our list of feature requests. For now, the Azure Storage account keys are used to provide authentication to the file share. We do offer a workaround using shared access signatures (SAS) via the REST API or the client libraries. Using SAS, you can generate tokens with specific permissions that are valid over a specified time interval. For example, you can generate a token with read-only access to a given file. Anyone who possesses this token while it is valid has read-only access to that file.
   
    SAS is only supported via the REST API or client libraries. When you mount the file share via the SMB protocol,  you can't use a SAS to delegate access to its contents. 

<a id="onpremise"></a>
## On-Premises Access

* **Q. Does connecting from on-premises virtual machines to Azure File Storage depend on Azure ExpressRoute?**
   
    No. If you don't have ExpressRoute, you can still access the file share from on-premises as long as you have port 445 (TCP Outbound) open for Internet access. However, you can use ExpressRoute with File storage if you like.

* **Q. How can I mount Azure file share on my local machine?** 
    
    You can mount the file share via the SMB protocol as long as port 445 (TCP Outbound) is open and your client supports the SMB 3.0 protocol (*e.g.*, Windows 8 or Windows Server 2012). Please work with your local ISP provider to unblock the port. In the interim, you can view your files using Storage Explorer or any other third party such as Cloudberry.


<a id="billing"></a>
## Billing and Pricing
* **Q. Does the network traffic between an Azure virtual machine and a file share count as external bandwidth that is charged to the subscription?**
   
    If the file share and virtual machine are in different regions, the traffic between them will be charged as external bandwidth.

* **Q. If network traffic is between a virtual machine and a file share in the same region, is it free?**
   
    Yes. It is free if the traffic is in the same region.

<a id="backup"></a>
## Backup

* **Q. How do I backup my Azure File Share?**
    
    File share snapshots feature is in short term plans and in the meantime customers can utilize AzCopy/Robocopy tools or 3rd party backup tools that can backup a mounted file share as a workaround.

<a id="performace"></a>
## Performance

* **Q. My performance was slow when trying to unzip files into in File storage. What should I do?**
    
    To transfer large numbers of files into File storage, we recommend that you use AzCopy, Azure Powershell (Windows), or the Azure CLI (Linux/Unix), as these tools have been optimized for network transfer.

* **Q. Patch released to fix slow-performance issue with Azure File Storage**
    
    The Windows team recently released a patch to fix a slow performance issue when the customer accesses Azure File Storage from Windows 8.1 or Windows Server 2012 R2. For more information, please check out the associated KB article, [Slow performance when you access Azure File Storage from Windows 8.1 or Server 2012 R2](https://support.microsoft.com/en-us/kb/3114025).

<a id="interop"></a>
## Features and Interoperability with other services
* **Q. Is a "File Share Witness" for a failover cluster one of the use cases for Azure File Storage?**
   
    This is not supported currently.

* **Q. Will a Rename operation also be added to the REST API?**
   
    Rename is not yet supported in our REST API.

* **Q. Can you have nested shares, in other words, a share under a share?**
    
    No. The file share is the virtual driver that you can mount, so nested shares are not supported.

* **Q. Using Azure File Storage with IBM MQ**
    
    IBM has released a document to guide IBM MQ customers when configuring Azure File Storage with their service. For more information, please check out [How to setup IBM MQ Multi instance queue manager with Microsoft Azure File Service](https://github.com/ibm-messaging/mq-azure/wiki/How-to-setup-IBM-MQ-Multi-instance-queue-manager-with-Microsoft-Azure-File-Service).


<a id="troubleshooting"></a>
## Troubleshooting
* **Q. How do I troubleshoot Azure File Storage errors?**
    
    You can refer to [Azure File Storage Troubleshooting Article](storage-troubleshoot-file-connection-problems.md) for end-to-end troubleshooting guidance. 


## Also See
See these links for more information about Azure File storage.

### Conceptual articles and videos
* [Azure File Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure File Storage with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
* [Using the Azure CLI with Azure Storage](storage-azure-cli.md#create-and-manage-file-shares)
* [Troubleshooting Azure File storage problems](https://docs.microsoft.com/en-us/azure/storage/storage-troubleshoot-file-connection-problems)

### Blog posts
* [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Migrating data to Azure File ](https://azure.microsoft.com/en-us/blog/migrating-data-to-microsoft-azure-files/)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)

