---
title: Stream database backups using Oracle Recovery Manager
description: Streaming database backups using Oracle Recovery Manager (RMAN). 
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 06/5/2023
---

# Stream database backups using Oracle Recovery Manager

In this article, you learn about how Azure VMs support streaming database backups with Oracle Recovery Manager (RMAN). The streaming process uses either the destination of a virtual tape library package, or writes those backups directly to a local or remote filesystem. This article describes how various virtual tape library packages are integrated with Oracle RMAN. For a few of the packages, you see links to the Azure Marketplace.  

The backup and restore utility Oracle RMAN (Recovery MANager) can be configured to stream and capture back up images of Oracle databases then stream and send those back-up images to two different types of destinations. 

## Device type SBT 

The serial backup tape (SBT) type of destination was originally designed for interacting with tape drives, though not directly.  To simplify the interaction with multiple tape devices available when RMAN was created, Oracle developed an application programming interface (API) to interact with software packages to manage tape devices.  

The device type SBT sends commands to software packages through its defined API. The software package vendors create corresponding “plug-ins” that interact according to the specifications of the API to translate the RMAN commands for the software package. Oracle doesn't charge more for this functionality, but various software vendors may charge licensing and support fees for their “plug-ins” to connect to the API for RMAN published by Oracle. 

To use Device type SBT, the corresponding media management vendor (MMV) software must be previously installed onto the OS platform on which the Oracle database is available.  Backups to the SBT installation aren't available “out of the box” following an Oracle database installation.  Where there's no limit to the number of MMV packages that can be connected to an Oracle database instance, but it's exceedingly rare for there to be more than one in use at any time. 

Many of these software packages, originally available for on-premises installation, are also available in the Azure Marketplace.
- CommVault
- Veritas NetBackup
- Dell PowerProtect DD Virtual Edition (DDVE)
- Veeam Backup & Replication 

Other software packages can be found by searching the Azure Marketplace… 

## Device type disk 

A more universal configuration option for Oracle RMAN is device type disk. For this option, streamed database backup images are written to OS filesystem directories directly addressable from the OS image on which the Oracle database runs.  The storage used for backups is either directly mounted on the OS platform, or remotely mounted as a fileshare. 

There's no extra licensing or support charges for this option because the DISK adapter for Oracle RMAN is entirely contained within the Oracle RDBMS software. 

There are six storage options for Oracle RMAN backups within an Azure VM, of which five are Azure fileshares.

- Locally attached managed disk
- Azure blob over NFS
- Azure blobfuse 2.0
- Azure Files standard over CIFS/SMB
- Azure Files premium over NFS
- Azure NetApp Files 

Each of these options has advantages or disadvantages in the areas of capacity, pricing, performance, durability.  The following table is provided to allow easy comparison of features and prices.


| **Type** | **Tier** | **Docs** | **Mount protocol for VM** | **Support model** | **Prices** | **Notes** |
|---|---|---|---|---|---|---|
| **Managed disk** | Standard HDD | [Introduction to Azure managed disks](/azure/virtual-machines/managed-disks-overview) | SCSI | Microsoft | [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) | 1 |
| **Managed disk** | Standard SSD | [Introduction to Azure managed disks](/azure/virtual-machines/managed-disks-overview) | SCSI | Microsoft | [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) | 1 |
| **Managed disk** | Premium SSD | [Introduction to Azure managed disks](/azure/virtual-machines/managed-disks-overview) | SCSI | Microsoft | [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) | 1 |
| **Managed disk** | Premium SSD v2 | [Introduction to Azure managed disks](/azure/virtual-machines/managed-disks-overview) | SCSI | Microsoft | [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) | 1 |
| **Managed disk** | UltraDisk | [Introduction to Azure managed disks](/azure/virtual-machines/managed-disks-overview) | SCSI | Microsoft | [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) | 1 |
| **Azure blob** | Block blobs | [Mount Blob Storage by using the Network File System (NFS) 3.0 protocol](/azure/storage/blobs/network-file-system-protocol-support-how-to?tabs=linux) | NFS v3.0 | Microsoft | [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) | 2 |
| **Azure** **blobfuse** | v1 | [How to mount Azure Blob Storage as a file system with BlobFuse v1](/azure/storage/blobs/storage-how-to-mount-container-linux?tabs=RHEL) | Fuse | Open source/GitHub | n/a | 3, 5, 6 |
| **Azure** **blobfuse** | v2 | [What is BlobFuse? - BlobFuse2](/azure/storage/blobs/blobfuse2-what-is) | Fuse | Open source/GitHub | n/a | 3, 5, 6 |
| **Azure Files** | Standard | [What is Azure Files?](/azure/storage/files/storage-files-introduction) | SMB/CIFS | Microsoft | [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) | 4, 6 |
| **Azure Files** | Premium | [What is Azure Files?](/azure/storage/files/storage-files-introduction) | SMB/CIFS, NFS v4.1 | Microsoft | [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/) | 4, 7 |
| **Azure NetApp Files** | Standard | [Azure NetApp Files ](https://docs.netapp.com/us-en/cloud-manager-azure-netapp-files/) | SMB/CIFS, NFS v3.0, NFS v4.1 | Microsoft/NetApp | [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/) | 4, 8, 11 |
| **Azure NetApp Files** | Premium | [Azure NetApp Files ](https://docs.netapp.com/us-en/cloud-manager-azure-netapp-files/) | SMB/CIFS, NFS v3.0, NFS v4.1 | Microsoft/NetApp | [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/) | 4, 9, 11 |
| **Azure NetApp Files** | Ultra | [Azure NetApp Files](https://docs.netapp.com/us-en/cloud-manager-azure-netapp-files/) | SMB/CIFS, NFS v3.0, NFS v4.1 | Microsoft/NetApp | [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/)  | 4, 10, 11 |

**Legend:**

<sup>1</sup> Restricted by device-level and cumulative VM-level I/O limits on IOPS and I/O throughput.

- device limits are specified in the pricing documentation. 
- cumulative limits for VM sizes are specified in the documentation [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes)

<sup>2 </sup>Choose _hierarchical storage_ in 1<sup>st</sup> drop-down, then _blob only_ in the 2<sup>nd</sup> drop-down.

<sup>3</sup> Choose _flat storage_ in 1<sup>st</sup> drop-down, then _blob only_ in the 2<sup>nd</sup> drop-down.

<sup>4</sup> Uses CIFS protocol for which later versions of RHEL/OEL Linux are recommended.

- don't use lower Linux versions (that is, RHEL7/OEL7 below 7.5) for CIFS
- consider using mount option ``cache=none`` for Oracle archived redo log files use-case with CIFS mounts.

<sup>5</sup> supported on GitHub by the Azure Storage product group within Microsoft as an open source project in GitHub.

<sup>6</sup> _hot_ usage tier recommended.

<sup>7</sup> _premium_ usage tier recommended.

<sup>8</sup> I/O throughput of 16 MiB/s per TiB allocated.

<sup>9</sup> I/O throughput of 64 MiB/s per TiB allocated.

<sup>10</sup> I/O throughput of 128 MiB/s per TiB allocated.

<sup>11</sup> [ANF calculator](https://anftechteam.github.io/calc/) is useful for quick pricing calculations.

## Next steps
[Storage options for oracle on Azure VMs](oracle-storage.md)
