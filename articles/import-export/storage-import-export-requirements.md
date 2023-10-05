---
title: Requirements for Azure Import/Export service | Microsoft Docs
description: Understand the software and hardware requirements for Azure Import/Export service.
author: alkohli
services: storage
ms.service: azure-import-export
ms.topic: conceptual
ms.date: 05/19/2022
ms.author: alkohli
---
# Azure Import/Export system requirements

This article describes the important requirements for your Azure Import/Export service. We recommend that you review the information carefully before you use the Import/Export service and then refer back to it as necessary during the operation.

## Supported operating systems

To prepare the hard drives using the WAImportExport tool, the following **64-bit OS that support BitLocker Drive Encryption** are supported.


|Platform |Version |
|---------|---------|
|Windows     | Windows 7 Enterprise, Windows 7 Ultimate <br> Windows 8 Pro, Windows 8 Enterprise, Windows 8.1 Pro, Windows 8.1 Enterprise <br> Windows 10        |
|Windows Server     |Windows Server 2008 R2 <br> Windows Server 2012, Windows Server 2012 R2         |

## Other required software for Windows client

|Platform |Version |
|---------|---------|
|.NET Framework    | 4.5.1       |
| BitLocker        |  _          |


## Supported storage accounts

> [!Note]
> Classic storage accounts will not be supported starting **August 1, 2023**.

Azure Import/Export service supports the following types of storage accounts:

- Standard General Purpose v2 storage accounts (recommended for most scenarios)
- Blob Storage accounts
- General Purpose v1 storage accounts (both Classic or Azure Resource Manager deployments)

> [!IMPORTANT]
> Network File System (NFS) 3.0 protocol support in Azure Blob Storage is not supported with Azure Import/Export.

For more information about storage accounts, see [Azure storage accounts overview](../storage/common/storage-account-overview.md).

Each job may be used to transfer data to or from only one storage account. In other words, a single import/export job cannot span across multiple storage accounts. For information on creating a new storage account, see [How to Create a Storage Account](../storage/common/storage-account-create.md).

> [!IMPORTANT]
> For storage accounts where the [Virtual Network Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) feature has been enabled, use the **Allow trusted Microsoft services...** setting to [enable Import/Export](../storage/common/storage-network-security.md) service to perform import/export of data to/from Azure.

## Supported storage types

The following list of storage types is supported with Azure Import/Export service.


|Job  |Storage Service |Supported  |Not supported  |
|---------|---------|---------|---------|
|Import     |  Azure Blob Storage <br><br> Azure Files storage       | Block blobs and Page blobs supported <br><br> Files supported          |
|Export     |   Azure Blob Storage       | Block blobs, Page blobs, and Append blobs supported         | Azure Files not supported<br>Export from archive tier not supported|


## Supported hardware

For the Azure Import/Export service, you need supported disks to copy data.

### Supported disks

The following list of disks is supported for use with the Import/Export service.


|Disk type  |Size  |Supported |
|---------|---------|---------|
|SSD    |   2.5"      |SATA III          |
|HDD<sup>*</sup>     |  2.5"<br>3.5"       |SATA II, SATA III         |

<sup>*</sup>An HDD must have 512-byte sectors; 4096-byte (4K) sectors are not supported.

If you use Advanced Format (or 512e) drive and connect the drive to the system using USB to SATA Hard Drive adapter, make sure that the system sees the logical sector size as 512. If the drive reports 4096 logical sector size, choose one of these options:

- Use direct SATA connection to prepare the drive.
- Use USB to SATA hard drive adapter that reports logical sector size as 512 for advanced format drives.
 

To check the logical sector size that the disk reports, run the following commands:
1. Run PowerShell as Administrator.
1. To identify the disk drive number, run `Get-disk` cmdlet. Make a note of the number of the USB connected drive.
1. To see the logical sector size on this disk, run the following command:

    `Get-Disk -number <Enter Disk Number> | fl *`

### Unsupported disks

The following disk types are not supported:

- USBs.
- External HDD with built-in USB adaptor.
- Disks that are inside the casing of an external HDD.

### Using multiple disks

A single import/export job can have:

- A maximum of 10 HDD/SSDs.
- A mix of HDD/SSD of any size.

Large number of drives can be spread across multiple jobs and there is no limits on the number of jobs that can be created. For import jobs, only the first data volume on the drive is processed. The data volume must be formatted with NTFS.

When preparing hard drives and copying the data using the WAImportExport tool, you can use external USB adaptors. Most off-the-shelf USB 3.0 or later adaptors should work.

## Next steps

* [Transfer data with the AzCopy command-line utility](../storage/common/storage-use-azcopy-v10.md)
