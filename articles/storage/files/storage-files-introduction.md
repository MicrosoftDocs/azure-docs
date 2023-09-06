---
title: Introduction to Azure Files
description: An overview of Azure Files, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 09/14/2022
ms.author: kendownie
---

# What is Azure Files?
Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview), [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System), and [Azure Files REST API](/rest/api/storageservices/file-service-rest-api). Azure file shares can be mounted concurrently by cloud or on-premises deployments. SMB Azure file shares are accessible from Windows, Linux, and macOS clients. NFS Azure file shares are accessible from Linux clients. Additionally, SMB Azure file shares can be cached on Windows servers with [Azure File Sync](../file-sync/file-sync-introduction.md) for fast access near where the data is being used.

Here are some videos on common use cases for Azure Files:
* [Replace your file server with a serverless Azure file share](https://youtu.be/H04e9AgbcSc)
* [Getting started with FSLogix profile containers on Azure Files in Azure Virtual Desktop leveraging AD authentication](https://www.youtube.com/embed/9S5A1IJqfOQ)

To get started using Azure Files, see [Quickstart: Create and use an Azure file share](storage-how-to-use-files-portal.md).

## Why Azure Files is useful
Azure file shares can be used to:

* **Replace or supplement on-premises file servers**:  
    Azure Files can be used to replace or supplement traditional on-premises file servers or network-attached storage (NAS) devices. Popular operating systems such as Windows, macOS, and Linux can directly mount Azure file shares wherever they are in the world. SMB Azure file shares can also be replicated with Azure File Sync to Windows servers, either on-premises or in the cloud, for performance and distributed caching of the data. With [Azure Files AD Authentication](storage-files-active-directory-overview.md), SMB Azure file shares can work with Active Directory Domain Services (AD DS) hosted on-premises for access control. 

* **"Lift and shift" applications**:  
    Azure Files makes it easy to "lift and shift" applications to the cloud that expect a file share to store file application or user data. Azure Files enables both the "classic" lift and shift scenario, where both the application and its data are moved to Azure, and the "hybrid" lift and shift scenario, where the application data is moved to Azure Files, and the application continues to run on-premises. 

* **Simplify cloud development**:  
    Azure Files can also be used to simplify new cloud development projects. For example:
    * **Shared application settings**:  
        A common pattern for distributed applications is to have configuration files in a centralized location where they can be accessed from many application instances. Application instances can load their configuration through the [Azure Files REST API](/rest/api/storageservices/file-service-rest-api), and humans can access them by mounting the share locally.

    * **Diagnostic share**:  
        An Azure file share is a convenient place for cloud applications to write their logs, metrics, and crash dumps. Logs can be written by the application instances via the File REST API, and developers can access them by mounting the file share on their local machine. This enables great flexibility, as developers can embrace cloud development without having to abandon any existing tooling they know and love.

    * **Dev/Test/Debug**:  
        When developers or administrators are working on VMs in the cloud, they often need a set of tools or utilities. Copying such utilities and tools to each VM can be a time consuming exercise. By mounting an Azure file share locally on the VMs, a developer and administrator can quickly access their tools and utilities, no copying required.
* **Containerization**:  
    Azure file shares can be used as persistent volumes for stateful containers. Containers deliver "build once, run anywhere" capabilities that enable developers to accelerate innovation. For the containers that access raw data at every start, a shared file system is required to allow these containers to access the file system no matter which instance they run on.

## Key benefits
* **Easy to use**. When an Azure file share is mounted on your computer, you don't need to do anything special to access the data: just navigate to the path where the file share is mounted and open/modify a file. 
* **Shared access**. Azure file shares support the industry standard SMB and NFS protocols, meaning you can seamlessly replace your on-premises file shares with Azure file shares without worrying about application compatibility. Being able to share a file system across multiple machines, applications, and application instances is a significant advantage for applications that need shareability. 
* **Fully managed**. Azure file shares can be created without the need to manage hardware or an OS. This means you don't have to deal with patching the server OS with critical security upgrades or replacing faulty hard disks.
* **Scripting and tooling**. PowerShell cmdlets and Azure CLI can be used to create, mount, and manage Azure file shares as part of the administration of Azure applications. You can create and manage Azure file shares using Azure portal and Azure Storage Explorer. 
* **Resiliency**. Azure Files has been built from the ground up to be always available. Replacing on-premises file shares with Azure Files means you no longer have to wake up to deal with local power outages or network issues. 
* **Familiar programmability**. Applications running in Azure can access data in the share via file [system I/O APIs](/dotnet/api/system.io.file). Developers can therefore leverage their existing code and skills to migrate existing applications. In addition to System IO APIs, you can use [Azure Storage Client Libraries](/previous-versions/azure/dn261237(v=azure.100)) or the [Azure Files REST API](/rest/api/storageservices/file-service-rest-api).

## Training

For self-paced training, see the following modules:

- [Introduction to Azure Files](/training/modules/introduction-to-azure-files/)
- [Configure Azure Files and Azure File Sync](/training/modules/configure-azure-files-file-sync/)

## Architecture

For guidance on architecting solutions on Azure Files using established patterns and practices, see the following:

- [Azure enterprise cloud file share](/azure/architecture/hybrid/azure-files-private)
- [Hybrid file services](/azure/architecture/hybrid/hybrid-file-services)
- [Use Azure file shares in a hybrid environment](/azure/architecture/hybrid/azure-file-share)
- [Hybrid file share with disaster recovery for remote and local branch workers](/azure/architecture/example-scenario/hybrid/hybrid-file-share-dr-remote-local-branch-workers)
- [Azure files accessed on-premises and secured by AD DS](/azure/architecture/example-scenario/hybrid/azure-files-on-premises-authentication)

## Case studies
* Organizations across the world are leveraging Azure Files and Azure File Sync to optimize file access and storage. [Check out their case studies here](azure-files-case-study.md).

## Next Steps
* [Plan for an Azure Files deployment](storage-files-planning.md)
* [Create Azure file Share](storage-how-to-create-file-share.md)
* [Connect and mount an SMB share on Windows](storage-how-to-use-files-windows.md)
* [Connect and mount an SMB share on Linux](storage-how-to-use-files-linux.md)
* [Connect and mount an SMB share on macOS](storage-how-to-use-files-mac.md)
* [Connect and mount an NFS share on Linux](storage-files-how-to-mount-nfs-shares.md)
* [Azure Files FAQ](storage-files-faq.md)
