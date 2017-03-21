---
title: Introduction to Azure Files | Microsoft Docs
description: An overview of Azure Files, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
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
# Introduction to Azure Files
Azure Files is Microsoft's easy to use cloud file system. Azure Files offers network file shares in the cloud using the industry standard [Server Message Block (SMB) Protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and [Common Internet File System (CIFS)](https://technet.microsoft.com/en-us/library/cc939973.aspx). Azure File shares can be mounted simultaneously by clients such as on-premises deployments of Windows, macOS, or Linux, or by Azure Virtual Machines. 

Azure File shares can be used to:

* Completely replace on-premises file shares without globally available file shares for today's mobile workforce.
* Provide file share functionality for virtual machines running in Azure.
* Enable "lift and shift" migration of applications that depend on file semantics to the cloud, without expensive rewrites.

## Videos
| Introducing Azure Files (27m) | Azure Files Tutorial (5 minutes)  |
|-|-|
| [![Screencap of the Introducing Azure Files video - click to play!](media/azure-files-introduction-video-snapshot1.png)](https://www.youtube.com/watch?v=zlrpomv5RLs) | [![Screencap of the Azure Files Tutorial - click to play!](media/azure-files-introduction-video-snapshot2.png)](https://channel9.msdn.com/Blogs/Azure/Azure-File-Storage-with-Windows/) |

## Why is Azure Files useful?
Azure Files allows you to replace Windows Server, Linux, or NAS based file servers hosted on-premises or in the cloud, with an OS-free cloud file share. This has the following benefits:

* **Simplicity**. Azure File shares can be created without the need to manage hardware or an OS. This means you don't have to deal with patching the server OS with critical security upgrades or replacing faulty hard disks.
* **Compatibility**. Azure File shares support the industry standard SMB protocol, meaning you can seamlessly replace your on-premises file shares with Azure File shares without worrying about application compatibility.
* **Resiliency**. Azure Files has been built from the ground up to be always available. Replacing on-premises file shares with Azure Files means you no longer have to wake up to deal with local power outages or network issues. 

## How does it work?
Managing Azure File shares is a lot simpler than managing file shares on-premises. The following diagram illustrates the Azure Files management constructs:

![File Concepts](../../includes/media/storage-file-concepts-include/files-concepts.png)

* **Storage Account**: All access to Azure Storage is done through a storage account. See Azure Storage Scalability and Performance Targets for details about storage account capacity.
* **Share**: A File storage share is an SMB file share in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the 5 TB total capacity of the file share.
* **Directory**: An optional hierarchy of directories.
* **File**: A file in the share. A file may be up to 1 TB in size.
* URL format: Files are addressable using the following URL format:  

    ```
    https://<storage account>.file.core.windows.net/<share>/<directory/directories>/<file>
    ```

## See Also
* **[Azure Blob](../storage/storage-dotnet-how-to-use-blobs.md)**: Massively-scalable object storage for unstructured data
* **[Azure Table](../storage/storage-dotnet-how-to-use-tables.md)**: Flexible NoSQL database
* **[Azure Queues](../storage/storage-dotnet-how-to-use-queues.md)**: Durable queues for large-volume cloud services
* **[Azure Disks](../storage/storage-premium-storage.md)**: Premium storage for I/O intensive applications