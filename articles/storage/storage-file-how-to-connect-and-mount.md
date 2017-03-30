---
title: How to Mount and Use Azure File Share | Microsoft Docs
description: An overview of how to Mount and Use Azure File Share on Azure File Storage, Microsoft's cloud file system. Learn how to mount Azure File shares over SMB and lift classic on-premises workloads to the cloud without rewriting any code.
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

# About Mounting Azure File Share
Azure File storage is a service that offers file shares in the cloud using the standard Server Message Block (SMB) Protocol. Both SMB 2.1 and SMB 3.0 are supported. Azure File Share can be mounted from a computer running Windows or Linux or Mac OS. Note that this can be done whether the server is at locat datacenter, on-premises or in Azure provided the [prereqisites](#prereq) below are met. This makes lift and shift migration to Azure of applications which involved both Windows and Linux servers possible.

<a id=prereq></a>

## Prerequisites for mounting Azure File

### Storage Account Name and Key
You will need access to your subscription in Azure Portal or your primary or secondary storage account name and key. SAS key is not supported for mounting.

### Open SMB over TCP port 445
If you are connecting to a Azure FIle Share, check to see if your firewall is not blocking TCP ports 445 from client machine.

### Operating system support for SMB 2.1 or 3.0
#### Windows OS with SMB 2.1
Windows OS prior to Windows Server 2012 support SMB 2.1 only. When using an OS which supports SMB 2.1, you will be able to mount the Azure File Share on an Azure VM from within the same region only.
* An Azure virtual machine in the same region

#### Windows OS with SMB 3.0
With support for SMB 3.0, File storage supports encryption and persistent
handles from SMB 3.0 clients. Support for encryption means that SMB 3.0 clients
can mount a file share from anywhere. Either of the following will work.
* An Azure virtual machine in the same region
* An Azure virtual machine in a different region
* An on-premises client application

#### Linux OS supporting SMB 2.1 or 3.0
Linux distributions do not support encryption feature in SMB 3.0 yet.In some distributions user may get error 115 if attempting to mount using SMB 3.0 due to missing feature. If the Linux SMB client used doesn’t support encryption, instead mount using SMB 2.1 from a Linux VM on the same data center as the Azure Files storage account.
* Most Linux SMB client doesn’t yet support encryption, so mounting a file share
from Linux still requires that the client be in the same Azure region as the
file share.

#### MacOS
SMB 3.0 is supported starting macOS Sierra. There are known bugs affecting macOS performance over SMB.

## Supported Operating Systems List
When a client accesses File storage, the SMB version used depends on the SMB
version supported by the operating system. The table below provides a summary of
support for Windows and Linux clients. Please refer to this blog for more
details on [SMB
versions](http://blogs.technet.com/b/josebda/archive/2013/10/02/windows-server-2012-r2-which-version-of-the-smb-protocol-smb-1-0-smb-2-0-smb-2-1-smb-3-0-or-smb-3-02-you-are-using.aspx).

| Windows and Linux Client                        | SMB Version Supported |
|-------------------------------------------------|-----------------------|
| Windows 7                                       | SMB 2.1               |
| Windows Server 2008 R2                          | SMB 2.1               |
| Windows 8                                       | SMB 3.0               |
| Windows Server 2012                             | SMB 3.0               |
| Windows Server 2012 R2                          | SMB 3.0               |
| Windows 10                                      | SMB 3.0               |
| Ubuntu Server 14.04+                            | SMB 2.1               |
| RHEL 7+                                         | SMB 2.1               |
| CentOS 7+                                       | SMB 2.1               |
| Debian 8                                        | SMB 2.1               |
| openSUSE 13.2+                                  | SMB 2.1               |
| SUSE Linux Enterprise Server 12                 | SMB 2.1               |
| SUSE Linux Enterprise Server 12 (Premium Image) | SMB 2.1               |
| Mac OS Sierra                                   | SMB 3.0               |

## Next Steps
* [Mount the file share from a machine running Windows](storage-file-how-to-use-files-windows.md)
* [Mount the file share from a machine running Linux](storage-how-to-use-files-linux.md)
* [Mount the file share from a machine running macOS](storage-file-how-to-use-files-mac.md)

## Also See
See these links for more information about Azure File storage.

* [FAQ](storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-file-connection-problems.md)

### Conceptual articles and videos
* [Azure Files Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
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






