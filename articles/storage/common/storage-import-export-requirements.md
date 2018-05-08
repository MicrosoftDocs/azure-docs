---
title: System requirements for Azure Import/Export service | Microsoft Docs
description: Understand the software and hardware requirements for Azure Import/Export service.
author: alkohli
manager: syadav
services: storage

ms.service: storage
ms.topic: article
ms.date: 05/02/2018
ms.author: alkohli

---
# Azure Import/Export system requirements
This article describes the important system requirements for your Azure Import/Export service. We recommend that you review the information carefully before you use the Import/Export service and then refer back to it as necessary during the operation.

## Supported operating systems
To prepare the hard drives using the WAImportExport tool, the following 64-bit OS are supported.

- Windows 7 Enterprise, Windows 7 Ultimate 
- Windows 8 Pro, Windows 8 Enterprise, Windows 8.1 Pro, Windows 8.1 Enterprise, 
- Windows 10, 
- Windows Server 2008 R2, 
- Windows Server 2012, 
- Windows Server 2012 R2. 

All of the preceding OS support BitLocker Drive Encryption.

## Supported storage accounts
Azure Import/Export service supports the following Azure storage accounts.
- Classic
- Blob Storage accounts
- General Purpose v1 storage accounts. 

Each job may be used to transfer data to or from only one storage account. In other words, a single import/export job cannot span across multiple storage accounts. For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md#create-a-storage-account).

> [!IMPORTANT] 
> The Azure Import Export service does not support storage accounts where the [Virtual Network Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) feature has been enabled. 

## Supported data types
The following list of data types is supported with Azure Import/Export service.

Import
- Blob storage; Block blobs, Page Blobs are supported.
- Azure Files

Export
- Blob storage; Block blobs, Page blobs, and Append blobs are supported.
- Azure Files are not supported.


## Supported hardware 

For the Azure Import/Export service, you need supported disks and supported SATA connectors to copy data.

### Supported disks
The following list of disks is supported for use with the Import/Export service.
- 2.5" SSD
- 2.5" HDD, both SATA II and SATA III
- 3.5" HDD, both SATA II and SATA III

> [!IMPORTANT]
> - External hard disk drives with a built-in USB adaptor are not supported. 
> - The disk inside the casing of an external HDD cannot be used; do not send external HDDs.

A single import/export job can have:
- A maximum of 10 HDD/SSDs.
- A mix of HDD/SSD of any size.

Large number of drives can be spread across multiple jobs and there is no limits on the number of jobs that can be created. 

For import jobs, only the first data volume on the drive is processed. The data volume must be formatted with NTFS.

### Supported external USB adaptors
Following is a list of external USB adaptors used to copy data to internal HDDs. 
- Anker 68UPSATAA-02BU
- Anker 68UPSHHDS-BU
- Startech SATADOCK22UE
- Orico 6628SUS3-C-BK (6628 Series)
- Thermaltake BlacX Hot-Swap SATA External Hard Drive Docking Station (USB 2.0 & eSATA)


## Next steps

* [Setting up the WAImportExport tool](storage-import-export-tool-how-to.md)
* [Transfer data with the AzCopy command-line utility](storage-use-azcopy.md)
* [Azure Import Export REST API sample](https://azure.microsoft.com/documentation/samples/storage-dotnet-import-export-job-management/)

