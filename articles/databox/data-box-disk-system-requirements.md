---
title: Microsoft Azure Data Box Disk system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Disk 
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.custom: linux-related-content
ms.topic: article
ms.date: 04/18/2024
ms.author: shaas
---

::: zone target="docs"

# Azure Data Box Disk system requirements

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article describes the important system requirements for your Microsoft Azure Data Box Disk solution and for the clients connecting to the Data Box Disk. We recommend that you review the information carefully before you deploy your Data Box Disk, and then refer back to it as necessary during the deployment and subsequent operation.

The system requirements include the supported platforms for clients connecting to disks, supported storage accounts, and storage types.

::: zone-end

::: zone target="chromeless"

## Review prerequisites

1. You must have ordered your Data Box Disk using the [Tutorial: Order your Azure Data Box Disk](data-box-disk-deploy-ordered.md). You have received your disks and one connecting cable per disk.
2. You have a client computer available from which you can copy the data. Your client computer must:

    - Run a supported operating system.
    - Have any additional required software installed.

::: zone-end

## Supported operating systems for clients

The following tables contain a list of the supported operating systems for disk unlock and data copy operations for use on clients connected to Data Box Disks.

### [Hardware encrypted disks](#tab/hardware)

The following supported operating systems can be used with hardware encrypted Data Box Disks.

| **Operating system** | **Tested versions** |
| --- | --- |
| Windows Server<sup><b>*</b></sup> | 2022 |
| Windows (64-bit)<sup><b>*</b></sup> | 10, 11 |
|Linux <br> <li> Ubuntu </li><li> Debian </li><li>  CentOS| <br>22 <br> 9 <br> 9 |

<sup><b>*</b></sup>Data copy operations are only supported on Linux-based hosts when using hardware-encrypted disks. Windows-based machines can be used for data validation only. 

### [Software encrypted disks](#tab/software)

The following supported operating systems can be used with software encrypted Data Box Disks.

| **Operating system** | **Tested versions** |
| -------------------- | ------------------- |
| Windows Server       | 2008 R2 SP1<br>2012<br>2012 R2<br>2016<br>2022 |
| Windows (64-bit)     | 7, 8, 10, 11        |
| Linux <br> <li> Ubuntu </li><li> Debian </li><li> Red Hat Enterprise Linux (RHEL) </li><li> CentOS | <br>14, 16, 18, 22<br> 8.11, 9<br>7.0<br>7.0, 7.5, 8.0, 9.0 |

---

## Other required software for Windows clients

For Windows client, following should also be installed.

| **Software**| **Version** |
| --- | --- |
| Windows PowerShell |5.0 |
| .NET Framework |4.5.1 |
| Windows Management Framework |5.1|
| BitLocker| - |

## Other required software for Linux clients

For Linux client, the Data Box Disk toolset installs the following required software:

- dislocker
- OpenSSL

The following additional software is required.

| Hardware encrypted disks | Software encrypted disks  |
|--------------------------|---------------------------|
| NTFS-3g                  | <li> Sedutil-cli <li> Exfat utils |

## Supported connection

| Hardware encrypted disks | Software encrypted disks  |
|--------------------------|---------------------------|
| SATA 3 <br> All other connections are unsupported | USB 3.0 or later |

## Supported storage accounts

> [!Note]
> Classic storage accounts are not supported beginning **August 1, 2023**.

The following table contains supported storage types for Data Box Disks.

| **Storage account** | **Supported access tiers** |
| --- | --- |
| Classic Standard | |
| General-purpose v1 Standard  | Hot, Cool |
| General-purpose v1 Premium   |  |
| General-purpose v2 Standard<sup>*</sup> | Hot, Cool |
| General-purpose v2 Premium   |  |
| Blob storage account | |
| Block Blob storage Premium | |

<sup>*</sup> *Azure Data Lake Storage Gen2 (ADLS Gen2) is supported.*

> [!IMPORTANT]
> Network File System (NFS) 3.0 protocol support in Azure Blob storage is not supported with Data Box Disk.

## Supported storage types for upload

Here is a list of the storage types supported for uploaded to Azure using Data Box Disk.

| **File format** | **Notes** |
| --- | --- |
| Azure block blob | |
| Azure page blob  | |
| Azure Files  | |
| Managed Disks | |

::: zone target="docs"

## Next step

* [Deploy your Azure Data Box Disk](data-box-disk-deploy-ordered.md)

::: zone-end
