---
title: How to mount and use Azure File shares | Microsoft Docs
description: Learn how to mount Azure File shares over SMB on Windows, Linux, and macOS.
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

# How to mount and use Azure File shares
[Azure File storage](storage-file-storage.md) is a service that offers file shares in the cloud using the industry standard Server Message Block (SMB) Protocol. With SMB, an Azure File Share can be mounted and presented to the OS as a locally available share.

## <a id="prereq"></a>Prerequisites for mounting an Azure File share
1. **Storage Account Name and Key**: You will need access to your subscription in Azure Portal or your primary or secondary storage account name and key. SAS key is not supported for mounting.
2. **Open SMB over TCP port 445**: If you are connecting to a Azure File Share, check to see if your firewall is not blocking TCP ports 445 from client machine.
3. **Operating system support for SMB 2.1 or 3.0**: To mount an Azure File share from an Azure virtual machine in the same region over SMB, your OS must support at least SMB 2.1. In order to mount an Azure File share from outside of the Azure region, your OS must support the encryption functionality of SMB 3.0. 

## Windows support for mounting an Azure File Share
| Windows version | SMB version | Supports mounting from Azure VM | Supports mounting from on-premises |
|-----------------|-------------|---------------------------------|------------------------------------|
| Windows Server 2016 | SMB 3.1.1 | Yes | Yes |
| Windows 10 version 1703 | SMB 3.1.1 | Yes | Yes |
| Windows 10 version 1607 | SMB 3.1.1 | Yes | Yes |
| Windows 10 version 1511 | SMB 3.1.1 | Yes | Yes |
| Windows 10 version 1507 | SMB 3.1.1 | Yes | Yes |
| Windows Server 2012 R2 | SMB 3.0.2 | Yes | Yes |
| Windows 8.1 | SMB 3.0.2 | Yes | Yes |
| Windows Server 2012 | SMB 3.0 | Yes | Yes |
| Windows Server 2008 R2 | SMB 2.1 | Yes | No |
| Windows 7 | SMB 2.1 | Yes | No | 

> [!Note]  
> Windows Server 2008 R2 and Windows 7 do not support mounting from on-premises or cross-Azure region because they do not implement SMB 3.x. More information can be found [here](#prereq).

## Linux support for mounting an Azure File Share
| Linux distribution | Functional SMB version | Supports mounting from Azure VM | Supports mounting from on-premises |
|--------------------|------------------------|---------------------------------|------------------------------------|
| Ubuntu 14.04+ | SMB 2.1 | Yes | No |
| RHEL 7+ | SMB 2.1 | Yes | No |
| CentOS 7+ | SMB 2.1 | Yes | No |
| Debian 8+ | SMB 2.1 | Yes | No |
| openSUSE 13.2+ | SMB 2.1 | Yes | No |
| SUSE Linux Enterprise Server 12 | SMB 2.1 | Yes | No |
| SUSE Linux Enterprise Server 12 (Premium Image) | SMB 2.1 | Yes | No |

> [!Note]  
> Popular Linux distributions do not support mounting from on-premises or cross-Azure region because the recommended package for SMB support, the `cifs-utils` package, does not yet fully implement SMB 3.x. More information can be found [here](#prereq).

## macOS support for mounting an Azure File Share
| macOS name | macOS version | SMB version | Supports mounting from on-premises |
|---------------|-------------|---------------------------------|------------------------------------|
| macOS Sierra | 10.12 | 3.0 | Yes |
| macOS El Capitan | 10.11 | 3.0 | Yes |

## Next Steps
* [Mount the file share from a machine running Windows](storage-file-how-to-use-files-windows.md)
* [Mount the file share from a machine running Linux](storage-how-to-use-files-linux.md)
* [Mount the file share from a machine running macOS](storage-file-how-to-use-files-mac.md)
See these links for more information about Azure File storage.

* [FAQ](storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-file-connection-problems.md)

### Conceptual articles and videos
* [Azure File Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure File Storage with Linux](storage-how-to-use-files-linux.md)

### Tooling support for Azure File Storage
* [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
* [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
* [Using the Azure CLI with Azure Storage](storage-azure-cli.md#create-and-manage-file-shares)
* [Troubleshooting Azure File storage problems](https://docs.microsoft.com/en-us/azure/storage/storage-troubleshoot-file-connection-problems)

### Blog posts
* [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Migrating data to Azure File ](https://azure.microsoft.com/en-us/blog/migrating-data-to-microsoft-azure-files/)
* [SMB versions](http://blogs.technet.com/b/josebda/archive/2013/10/02/windows-server-2012-r2-which-version-of-the-smb-protocol-smb-1-0-smb-2-0-smb-2-1-smb-3-0-or-smb-3-02-you-are-using.aspx)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)