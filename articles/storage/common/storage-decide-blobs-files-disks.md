---
title: Deciding when to use Azure Blobs, Azure Files, or Azure Disks
description: Learn about the different ways to store and access data in Azure to help you decide which technology to use.
services: storage
author: tamram
ms.service: storage
ms.topic: article
ms.date: 03/28/2018
ms.author: tamram
ms.component: common
---

# Deciding when to use Azure Blobs, Azure Files, or Azure Disks

Microsoft Azure provides several features in Azure Storage for storing and accessing your data in the cloud. This article covers Azure Files, Blobs, and Disks, and is designed to help you choose between these features.

## Scenarios

The following table compares Files, Blobs, and Disks, and shows example scenarios appropriate for each.

| Feature | Description | When to use |
|--------------|-------------|-------------|
| **Azure Files** | Provides an SMB interface, client libraries, and a [REST interface](/rest/api/storageservices/file-service-rest-api) that allows access from anywhere to stored files. | You want to "lift and shift" an application to the cloud which already uses the native file system APIs to share data between it and other applications running in Azure.<br/><br/>You want to store development and debugging tools that need to be accessed from many virtual machines. |
| **Azure Blobs** | Provides client libraries and a [REST interface](/rest/api/storageservices/blob-service-rest-api) that allows unstructured data to  be stored and accessed at a massive scale in block blobs. | You want your application to support streaming and random access scenarios.<br/><br/>You want to be able to access application data from anywhere. |
| **Azure Disks** | Provides client libraries and a [REST interface](/rest/api/compute/manageddisks/disks/disks-rest-api) that allows data to be persistently stored and accessed from an attached virtual hard disk. | You want to lift and shift applications that use native file system APIs to read and write data to persistent disks.<br/><br/>You want to store data that is not required to be accessed from outside the virtual machine to which the disk is attached. |

## Comparison: Files and Blobs

The following table compares Azure Files with Azure Blobs.  
  
||||  
|-|-|-|  
|**Attribute**|**Azure Blobs**|**Azure Files**|  
|Durability options|LRS, ZRS, GRS, RA-GRS|LRS, ZRS, GRS|  
|Accessibility|REST APIs|REST APIs<br /><br /> SMB 2.1 and SMB 3.0 (standard file system APIs)|  
|Connectivity|REST APIs -- Worldwide|REST APIs - Worldwide<br /><br /> SMB 2.1 -- Within region<br /><br /> SMB 3.0 -- Worldwide|  
|Endpoints|`http://myaccount.blob.core.windows.net/mycontainer/myblob`|`\\myaccount.file.core.windows.net\myshare\myfile.txt`<br /><br /> `http://myaccount.file.core.windows.net/myshare/myfile.txt`|  
|Directories|Flat namespace|True directory objects|  
|Case sensitivity of names|Case sensitive|Case insensitive, but case preserving|  
|Capacity|Up to 500 TiB containers|5 TiB file shares|  
|Throughput|Up to 60 MiB/s per block blob|Up to 60 MiB/s per share|  
|Object Size|Up to about 4.75 TiB per block blob|Up to 1 TiB per file|  
|Billed capacity|Based on bytes written|Based on file size|  
|Client libraries|Multiple languages|Multiple languages|  
  
## Comparison: Files and Disks

Azure Files complement Azure Disks. A disk can only be attached to one Azure Virtual Machine at a time. Disks are fixed-format VHDs stored as page blobs in Azure Storage, and are used by the virtual machine to store durable data. File shares in Azure Files can be accessed in the same way as the local disk is accessed (by using native file system APIs), and can be shared across many virtual machines.  
 
The following table compares Azure Files with Azure Disks.  
 
||||  
|-|-|-|  
|**Attribute**|**Azure Disks**|**Azure Files**|  
|Scope|Exclusive to a single virtual machine|Shared access across multiple virtual machines|  
|Snapshots and Copy|Yes|Yes|  
|Configuration|Connected at startup of the virtual machine|Connected after the virtual machine has started|  
|Authentication|Built-in|Set up with net use|  
|Cleanup|Automatic|Manual|  
|Access using REST|Files within the VHD cannot be accessed|Files stored in a share can be accessed|  
|Max Size|4 TiB disk|5 TiB File Share and 1 TiB file within share|  
|Max IOps|500 IOps|1000 IOps|  
|Throughput|Up to 60 MiB/s per Disk|Target is 60 MiB/s per File Share (can get higher for higher IO sizes)|  

## Next steps

When making decisions about how your data is stored and accessed, you should also consider the costs involved. For more information, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).
  
Some SMB features are not applicable to the cloud. For more information, see [Features not supported by the Azure File service](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).
  
For more information about disks, see [Managing disks and images](../../virtual-machines/windows/about-disks-and-vhds.md) and [How to Attach a Data Disk to a Windows Virtual Machine](../../virtual-machines/windows/attach-managed-disk-portal.md).
