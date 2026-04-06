---
title: Introduction to Azure Files
description: An overview of Azure Files, a service that enables you to create and use network file shares in the cloud using either SMB or NFS protocols.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 04/03/2026
ms.author: kendownie
# Customer intent: As a cloud architect, I want to implement Azure Files for shared network storage, so that I can simplify file management and enhance accessibility across various operating systems in both cloud and hybrid environments.
---

# What is Azure Files?

Azure Files provides fully managed file shares in the cloud that you can access through the [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview), [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System), and [Azure Files REST API](/rest/api/storageservices/file-service-rest-api). You can mount Azure file shares concurrently from cloud or on-premises deployments. You can access SMB Azure file shares from Windows, Linux, and macOS clients. You can access NFS Azure file shares from Linux clients. You can also cache SMB Azure file shares on Windows servers by using [Azure File Sync](../file-sync/file-sync-introduction.md) for fast access near where the data is being used.

## Why Azure Files is useful

The following are some common scenarios for using Azure Files.

### Replace or supplement on-premises file servers

Use Azure Files to replace or supplement traditional on-premises file servers or network-attached storage (NAS) devices. Popular operating systems such as Windows, macOS, and Linux can directly mount Azure file shares wherever they are in the world. You can also use Azure File Sync to replicate SMB Azure file shares to Windows servers, either on-premises or in the cloud, for performance and distributed caching of the data. By using [identity-based authentication](storage-files-active-directory-overview.md), SMB Azure file shares can work with on-premises Active Directory Domain Services (AD DS) for access control.

For a walkthrough, see [Replace your file server with a serverless Azure file share](https://youtu.be/H04e9AgbcSc).

### Lift and shift applications

Azure Files makes it easy to "lift and shift" applications to the cloud that expect a file share to store file application or user data. Azure Files enables both a full lift and shift scenario, where both the application and its data are moved to Azure, and a "hybrid" lift and shift scenario, where the application data is moved to Azure Files, and the application continues to run on-premises.

For a walkthrough on using Azure Files for FSLogix profile containers with Azure Virtual Desktop, see [Getting started with FSLogix profile containers on Azure Files](https://www.youtube.com/embed/9S5A1IJqfOQ).

### Simplify cloud development

Use Azure Files to simplify new cloud development projects. For example:

#### Shared application settings

A common pattern for distributed applications is to have configuration files in a centralized location where many application instances can access them. Application instances can load their configuration through the [Azure Files REST API](/rest/api/storageservices/file-service-rest-api), and humans can access them by mounting the share locally.

#### Diagnostic share

An Azure file share is a convenient place for cloud applications to write their logs, metrics, and crash dumps. Application instances can write logs by using the File REST API, and developers can access them by mounting the file share on their local machine. This approach provides flexibility, as developers can embrace cloud development without having to abandon existing tooling.

#### Dev/Test/Debug

When developers or administrators work on VMs in the cloud, they often need a set of tools or utilities. Copying such utilities and tools to each VM can be time consuming. By mounting an Azure file share locally on the VMs, developers and administrators can quickly access their tools and utilities, no copying required.

#### Containerization

You can use Azure file shares as persistent volumes for stateful containers. Containers deliver "build once, run anywhere" capabilities that enable developers to accelerate innovation. For the containers that access raw data at every start, a shared file system is required to allow these containers to access the file system no matter which instance they run on.

## Key benefits of Azure Files

Azure Files offers the following benefits.

### Easy to use

When you mount an Azure file share on your computer, you don't need to do anything special to access the data. Just go to the path where the file share is mounted and open or modify a file.

### Shared access

Azure Files supports the industry standard SMB and NFS protocols. You can seamlessly replace your on-premises file shares with Azure Files without worrying about application compatibility. Being able to share a file system across multiple machines, applications, and application instances is a significant advantage for applications that need shareability.

### Fully managed

You can create Azure file shares without the need to manage hardware or an OS. This means you don't have to deal with patching the server OS with critical security upgrades or replacing faulty hard disks.

### Scripting and tooling

Use PowerShell cmdlets and Azure CLI to create, mount, and manage Azure file shares as part of the administration of Azure applications. Create and manage Azure file shares by using the Azure portal and Azure Storage Explorer.

### Resiliency

Azure Files is built to be always available. When you replace on-premises file shares with Azure Files, you no longer have to wake up to deal with local power outages or network issues.

### Familiar programmability

Applications running in Azure can access data in the share via file [system I/O APIs](/dotnet/api/system.io.file). Developers can use their existing code and skills to migrate applications. In addition to System IO APIs, you can use [Azure Storage Client Libraries](</previous-versions/azure/dn261237(v=azure.100)>) or the [Azure Files REST API](/rest/api/storageservices/file-service-rest-api).

## Next steps

- [Plan for an Azure Files deployment](storage-files-planning.md)
- [Create an Azure file share](storage-how-to-create-file-share.md)
- [Migrate to Azure file shares](storage-files-migration-overview.md)
- [Azure Files FAQ](storage-files-faq.md)
