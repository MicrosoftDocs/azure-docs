---
title: Introduction to Azure Files | Microsoft Docs
description: An overview of Azure Files, a service that enables you to create and use network file shares in the cloud using the industry standard SMB protocol.
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
ms.topic: get-started-article
ms.date: 05/27/2017
ms.author: renash
---

# Introduction to Azure Files
Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx). Azure File shares can be mounted concurrently by cloud or on-premises deployments of Windows, macOS, and Linux. Additionally, Azure File shares can be cached on Windows Servers with Azure File Sync for fast access near where the data is being used.

## Videos
| Introducing Azure File storage (27m) | Azure File storage Tutorial (5 minutes)  |
|-|-|
| [![Screencast of the Introducing Azure File storage video - click to play!](./media/storage-files-introduction/azure-files-introduction-video-snapshot1.png)](https://www.youtube.com/watch?v=zlrpomv5RLs) | [![Screencast of the Azure File storage Tutorial - click to play!](./media/storage-files-introduction/azure-files-introduction-video-snapshot2.png)](https://channel9.msdn.com/Blogs/Azure/Azure-File-storage-with-Windows/) |

## Why Azure Files is useful
Azure File shares can be used to:

* **Replace or supplement on-premises file servers**:  
    Azure Files can be used to completely replace or supplement traditional on-premises file servers or NAS devices. Popular operating systems such as Windows, macOS, and Linux can directly mount Azure File shares wherever they are in the world. Azure File shares can also be replicated with Azure File Sync to Windows Servers, either on-premises or in the cloud, for performant and distributed caching of the data where it's being used.

* **"Lift and Shift" applications**:  
    Azure Files makes it easy to "lift and shift" applications to the cloud that expect a file share to store file application or user data. Azure Files enables both the "classic" lift and shift scenario, where both the application and it's data are moved to Azure, and the "hybrid" lift and shift scenario, where the application data is moved to Azure Files, and the application continues to run on-premises. 

* **Simplify Cloud Development**:  
    Azure Files can also be used in numerous ways to simplify new cloud development projects. For example:
    * **Shared Application Settings**:  
        A common pattern for distributed applications is to have configuration files in a centralized location where they can be accessed from many application instances. Application instances can load their configuration through the File REST API, and humans can access them as needed by mounting the SMB share locally.

    * **Diagnostic Share**:  
        An Azure File share is a convenient place for cloud applications to their write logs, metrics, and crash dumps. Logs can be writtten by the application instances via the File REST API, and developers can access them by simply mounting the file share on their local machine. This enables great flexibility, as developers can embrace cloud development without having to abandon any existing tooling they know and love.

    * **Dev/Test/Debug**:  
        When developers or administrators are working on VMs in the cloud, they often need a set of tools or utilities. Copying such utilities and tools to each VM can be a time consuming exercise. By mounting an Azure File share locally on the VMs, a developer and administrator can quickly access their tools and utilities, no copying required.

## Key Benefits
* **Shared access:**. Azure File shares support the industry standard SMB protocol, meaning you can seamlessly replace your on-premises file shares with Azure File shares without worrying about application compatibility. Being able to share a file system across multiple machines, applications/instances is a significant advantage with Azure File storage for applications that need shareability. 
* **Fully Managed**. Azure File shares can be created without the need to manage hardware or an OS. This means you don't have to deal with patching the server OS with critical security upgrades or replacing faulty hard disks.
* **Scripting and Tooling**. PowerShell cmdlets and Azure CLI  can be used to create, mount, and manage File storage shares as part of the administration of Azure applications.You can create and manage Azure file shares using Azure Portal and Azure storage Explorer. 
* **Resiliency**. Azure File storage has been built from the ground up to be always available. Replacing on-premises file shares with Azure File storage means you no longer have to wake up to deal with local power outages or network issues. 
* **Familiar Programmability**. Applications running in Azure can access data in the share via file [system I/O APIs](https://msdn.microsoft.com/library/system.io.file.aspx). Developers can therefore leverage their existing code and skills to migrate existing applications. In addition to System IO APIs, you can use [Azure Storage Client Libraries](https://msdn.microsoft.com/library/azure/dn261237.aspx) or the [Azure Storage REST API](/rest/api/storageservices/file-service-rest-api).

## Next Steps
* [Create Azure File Share](storage-how-to-create-file-share.md)
* [Connect and Mount on Windows](storage-how-to-use-files-windows.md)
* [Connect and Mount on Linux](storage-how-to-use-files-linux.md)
* [Connect and Mount on macOS](storage-how-to-use-files-mac.md)