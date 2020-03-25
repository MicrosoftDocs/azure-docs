---
title: Deciding when to use Azure Blobs, Azure Files, or Azure Disks
description: Learn about the different ways to store and access data in Azure to help you decide which technology to use.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 11/28/2018
ms.author: tamram
ms.subservice: common
---

# Deciding when to use Azure Blobs, Azure Files, or Azure Disks

Microsoft Azure provides several features in Azure Storage for storing and accessing your data in the cloud. This article covers Azure Files, Blobs, and Disks, and is designed to help you choose between these features.

## Scenarios

The following table compares Files, Blobs, and Disks, and shows example scenarios appropriate for each.

| Feature | Description | When to use |
|--------------|-------------|-------------|
| **Azure Files** | Provides an SMB interface, client libraries, and a [REST interface](/rest/api/storageservices/file-service-rest-api) that allows access from anywhere to stored files. | You want to "lift and shift" an application to the cloud which already uses the native file system APIs to share data between it and other applications running in Azure.<br/><br/>You want to store development and debugging tools that need to be accessed from many virtual machines. |
| **Azure Blobs** | Provides client libraries and a [REST interface](/rest/api/storageservices/blob-service-rest-api) that allows unstructured data to be stored and accessed at a massive scale in block blobs.<br/><br/>Also supports [Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md) for enterprise big data analytics solutions. | You want your application to support streaming and random access scenarios.<br/><br/>You want to be able to access application data from anywhere.<br/><br/>You want to build an enterprise data lake on Azure and perform big data analytics. |
| **Azure Disks** | Provides client libraries and a [REST interface](/rest/api/compute/manageddisks/disks/disks-rest-api) that allows data to be persistently stored and accessed from an attached virtual hard disk. | You want to lift and shift applications that use native file system APIs to read and write data to persistent disks.<br/><br/>You want to store data that is not required to be accessed from outside the virtual machine to which the disk is attached. |


## Next steps

When making decisions about how your data is stored and accessed, you should also consider the costs involved. For more information, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).
  
Some SMB features are not applicable to the cloud. For more information, see [Features not supported by the Azure File service](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).
 
For more information about Azure Blobs, see our article, [What is Azure Blob storage?](../blobs/storage-blobs-overview.md).

For more information about Disk Storage, see our [Introduction to managed disks](../../virtual-machines/windows/managed-disks-overview.md).

For more information about Azure Files, see our article, [Planning for an Azure Files deployment](../files/storage-files-planning.md).