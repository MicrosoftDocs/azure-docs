---
title: Planning for an Azure Files deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: jgerend

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/08/2016
ms.author: wgries
---

# Planning for an Azure Files deployment
[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. Because Azure Files is fully managed, deploying it in production scenarios is much easier than deploying and managing a file server or NAS device. This article addresses the topics to consider when deploying an Azure File share for production use within your organization.

## Data access method
Azure Files offers two, built-in, convenient data access methods for you and your users to access your data:

1. **Direct cloud access**: Any Azure File share can be mounted by [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and/or [Linux](storage-how-to-use-files-linux.md) with the industry standard Server Message Block (SMB) protocol or via the File REST API. With SMB, reads and writes to files on the share are made directly on the file share in Azure. To mount by a VM in Azure, the SMB client in the OS must support at least SMB 2.1. To mount on-premises, such as on a user's workstation, the SMB client supported by the workstation must support at least SMB 3.0 (with encryption). In addition to SMB, new applications or services may directly access the file share via File REST, which provides an easy and scalable application programming interface for software development.
2. **[Azure File Sync](azure-file-sync-introduction.md)**: With Azure File Sync (preview), shares can be replicated to Windows Servers on-premises or in Azure. You and your users would then access the file share through the Windows Server, such as through a SMB or NFS share. This is particularly useful for scenarios in which data will be accessed and modified far away from an Azure datacenter, such as in a branch office scenario. Data may be replicated between multiple Windows Server endpoints, such as between multiple branch offices. Finally, data may be tiered to Azure Files, such that all data is still accessible via the Server, but the Server does not have a fully copy of the data. Rather, data is seamlessly recalled when opened by your user.

The following table illustrates the trade-offs when deciding how your users will interact with their Azure File share:

| | Direct cloud access | Azure File Sync |
|------------------------|------------|-----------------|
| Supported protocol | SMB 2.1, SMB 3.0, and File REST API. | On-premises access to data over SMB (any supported version), NFS, FTPS, etc. |
| Latency to on-premises | As fast as on-premises connection speed allows. For very fast connections, or connections close to the Azure datacenter, using an Azure File share may be indistinguishable from using an on-premises file server. For slower connections, or connections very far away from the Azure datacenter, accessing directly via SMB may be significantly slower than using an on-premises file server. | High latency connections mitigated by the fact that the on-premises file server has a fast cache of the data. |
| Access Control | Enforced via SAS token. | File System ACLS enforced by on-premises file server; Azure File Sync stores them and replicates them to each Server in the Sync Group. |

## Data security
Azure Files has several built-in options for ensuring data security:

* Support for encryption in both over-the-wire protocols: SMB 3.0 encryption and File REST over HTTPS. By default: 
    * Clients which support SMB 3.0 encryption will send and receive data over an encrypted channel.
    * Clients which do not support SMB 3.0, can communicate intra-datacenter over SMB 2.1 or SMB 3.0 without encryption. Note that clients are not allowed to communicate inter-datacenter over SMB 2.1 or SMB 3.0 without encryption.
    * Clients can communicate over File REST with either HTTP or HTTPS.
* Optional encryption at-rest: when selected, data will be encrypted with fully-managed keys. Enabling encryption at-rest does not increase storage costs or reduce performance. 
* Optional requirement of encrypted data in-transit: when selected, Azure Files will not allow access to the data over unencrypted channels. Specifically, only HTTPS and SMB 3.0 with encryption connections will be allowed. 

    > [!Important]  
    > Requiring secure transfer of data will cause older SMB clients not capable of communicating with SMB 3.0 with encryption to fail. See [Mount on Windows](storage-how-to-use-files-windows.md), [Mount on Linux](storage-how-to-use-files-linux.md), [Mount on macOS](storage-how-to-use-files-mac.md) for more information.

For maximum security, we strongly recommend always enabling both encryption at-rest and enabling encryption of data in-transit whenever you are using modern clients to access your data. For example, if you need to mount a share on a Windows Server 2008 R2 VM, which only supports SMB 2.1, you need to allow unencrypted traffic to your storage account since SMB 2.1 does not support encryption.

If you are using Azure File Sync to access your Azure File share, we will always use HTTPS and SMB 3.0 with encryption to sync your data to your Windows Servers, regardless of whether you require encryption of data at-rest.

## Data redundancy
Azure Files supports two data redundancy options: locally redundant storage (LRS) and geo-redundant storage (GRS). The following sections describe the differences between locally redundant storage and geo-redundant storage:

### Locally redundant storage
[!INCLUDE [storage-common-redundancy-LRS](../../../includes/storage-common-redundancy-LRS.md)]

### Geo-redundant storage
[!INCLUDE [storage-common-redundancy-GRS](../../../includes/storage-common-redundancy-GRS.md)]

## Data growth pattern
Today, the maximum size for an Azure File share is 5 TiB, inclusive of share snapshots. Because of this current limitation, you must consider the expected data growth when deploying an Azure File share. Note that an Azure Storage account, can store multiple shares with a total of 500 TiB stored across all shares.

It is possible to sync multiple Azure File shares to a single Windows File Server with Azure File Sync. This allows you to ensure that older, very large file shares that you may have on-premises can be brought into Azure File Sync. Please see [Planning for an Azure File Sync Deployment](planning-azure-files-deployment.md) for more information.

## Data transfer method
There are many easy options to bulk transfer data from an existing file share, such as an on-premises file share, into Azure Files. A few common ones include (non-exhaustive list):

* **[Azure File Sync](azure-file-sync-introduction.md)**: As part of a first sync between an Azure File share (a "Cloud Endpoint") and a Windows directory namespace (a "Server Endpoint"), Azure File Sync will replicate all data from the existing file share to Azure Files.
* **[Azure Import/Export](../common/storage-import-export-service?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: The Azure Import/Export service allows you to securely transfer large amounts of data into an Azure File share by shipping hard disk drives to an Azure datacenter. 
* **[Robocopy](https://technet.microsoft.com/library/cc733145.aspx)**: Robocopy is a well known copy tool that ships with Windows and Windows Server. Robocopy may be used to transfer data into Azure Files by mounting the file share locally, and then using the mounted location as the destination in the Robocopy command.
* **[AzCopy](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#file-upload)**: AzCopy is a command-line utility designed for copying data to and from Azure Files, as well as Azure Blob storage, using simple commands with optimal performance. AzCopy is available for Windows, Linux, and macOS.

## Next steps
* [Planning for an Azure File Sync Deployment](planning-azure-file-sync-deployment.md)
* [Deploying Azure Files](azure-files-deployment-guide.md)
* [Deploying Azure File Sync](azure-file-sync-deployment-guide.md)