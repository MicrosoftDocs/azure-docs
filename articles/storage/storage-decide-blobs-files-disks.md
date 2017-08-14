---
title: Deciding when to use Azure Blobs, Azure Files, or Azure Data Disks
description: Learn about the different ways to store and access data in Azure to help you decide which technology to use.
services: storage
documentationcenter: ''
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: robinsh
---

# Deciding when to use Azure Blobs, Azure Files, or Azure Data Disks

Microsoft Azure provides several features in Azure Storage for storing and accessing your data in the cloud. This article covers Azure Files, Blobs, and Data Disks, and is designed to help you choose between these features.

## Scenarios

The following table compares Files, Blobs, and Data Disks, and shows example scenarios appropriate for each.

| Feature | Description | When to use |
|--------------|-------------|-------------|
| **Azure Files** | Provides an SMB interface, client libraries, and a [REST interface](/rest/api/storageservices/file-service-rest-api) that allows access from anywhere to stored files. | You want to "lift and shift" an application to the cloud which already uses the native file system APIs to share data between it and other applications running in Azure.<br/><br/>You want to store development and debugging tools that need to be accessed from many virtual machines. |
| **Azure Blobs** | Provides client libraries and a [REST interface](/rest/api/storageservices/blob-service-rest-api) that allows unstructured data to  be stored and accessed at a massive scale in block blobs. | You want your application to support streaming and random access scenarios.<br/><br/>You want to be able to access application data from anywhere. |
| **Azure Data Disks** | Provides client libraries and a [REST interface](/rest/api/compute/virtualmachines/virtualmachines-create-or-update) that allows data to be  persistently stored and accessed from an attached virtual hard disk. | You want to lift and shift applications that use native file system APIs to read and write data to persistent disks.<br/><br/>You want to store data that is not required to be accessed from outside the virtual machine to which the disk is attached. |

## Comparison: Files and Blobs

The following table compares Azure Files with Azure Blobs.  
  
||||  
|-|-|-|  
|**Attribute**|**Azure Blobs**|**Azure Files**|  
|Durability options|LRS, ZRS, GRS (and RA-GRS for higher availability)|LRS, GRS|  
|Accessibility|REST APIs|REST APIs<br /><br /> SMB 2.1 and SMB 3.0 (standard file system APIs)|  
|Connectivity|REST APIs -- Worldwide|REST APIs - Worldwide<br /><br /> SMB 2.1 -- Within region<br /><br /> SMB 3.0 -- Worldwide|  
|Endpoints|`http://myaccount.blob.core.windows.net/mycontainer/myblob`|`\\myaccount.file.core.windows.net\myshare\myfile.txt`<br /><br /> `http://myaccount.file.core.windows.net/myshare/myfile.txt`|  
|Directories|Flat namespace|True directory objects|  
|Case sensitivity of names|Case sensitive|Case insensitive, but case preserving|  
|Capacity|Up to 500 TB containers|5 TB file shares|  
|Throughput|Up to 60 MB/s per block blob|Up to 60 MB/s per share|  
|Object Size|Up to 200 GB/block blob|Up to 1TB/file|  
|Billed capacity|Based on bytes written|Based on file size|  
|Client libraries|Multiple languages|Multiple languages|  
  
## Comparison: Files and Data Disks

Azure Files complement Azure Data Disks. A data disk can only be attached to one Azure Virtual Machine at a time. Data disks are fixed-format VHDs stored as page blobs in Azure Storage, and are used by the virtual machine to store durable data. File shares in Azure Files can be accessed in the same way as the local disk is accessed (by using native file system APIs), and can be shared across many virtual machines.  
 
The following table compares Azure Files with Azure Data Disks.  
 
||||  
|-|-|-|  
|**Attribute**|**Azure Data Disks**|**Azure Files**|  
|Scope|Exclusive to a single virtual machine|Shared access across multiple virtual machines|  
|Snapshots and Copy|Yes|No|  
|Configuration|Connected at startup of the virtual machine|Connected after the virtual machine has started|  
|Authentication|Built-in|Set up with net use|  
|Cleanup|Automatic|Manual|  
|Access using REST|Files within the VHD cannot be accessed|Files stored in a share can be accessed|  
|Max Size|1 TB disk|5 TB File Share and 1 TB file within share|  
|Max 8KB IOps|500 IOps|1000 IOps|  
|Throughput|Up to 60 MB/s per Disk|Up to 60 MB/s per File Share|  

## Next steps

When making decisions about how your data is stored and accessed, you should also consider the costs involved. For more information, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).
  
Some SMB features are not applicable to the cloud. For more information, see [Features not supported by the Azure File service](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).
  
For more information about data disks, see [Managing disks and images](storage-about-disks-and-vhds-linux.md) and [How to Attach a Data Disk to a Windows Virtual Machine](../virtual-machines/windows/classic/attach-disk.md).