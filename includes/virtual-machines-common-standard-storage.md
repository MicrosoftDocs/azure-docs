---
title: "include file"
description: "include file"
services: storage
author: yuemlu
ms.service: storage
ms.topic: "include"
ms.date: 06/05/2018
ms.author: yuemlu
ms.custom: "include file"
---

# Cost-effective Standard Storage and unmanaged and managed Azure VM disks

Azure Standard Storage delivers reliable, low-cost disk support for VMs running latency-insensitive workloads. It also supports blobs, tables, queues, and files. With Standard Storage, the data is stored on hard disk drives (HDDs). When working with VMs, you can use standard SSD and HDD disks for Dev/Test scenarios and less critical workloads, and premium SSD disks for mission-critical production applications. Standard Storage is available in all Azure regions. 

This article focuses on the use of standard SSD and HDD disks. For more information about the use of storage with blobs, tables, queues, and files, see [Introduction to Storage](../articles/storage/common/storage-introduction.md).

## Disk types

There are two ways to create standard disks for Azure VMs:

**Unmanaged disks**:
This type of disk is the original method where you manage the storage accounts used to store the VHD files that correspond to the VM disks. VHD files are stored as page blobs in storage accounts. Unmanaged disks can be attached to any Azure VM size, including the VMs that primarily use Premium Storage, such as the DSv2 and GS series. Azure VMs support attaching several standard disks, allowing up to 256 TiB of storage per VM. If you use the preview disk sizes, you can have up to around 2 PiB of storage per VM.

[**Azure Managed Disks**](../articles/virtual-machines/windows/managed-disks-overview.md):
This feature manages the storage accounts used for the VM disks for you. You specify the type (Premium SSD, Standard SSD, or Standard HDD) and size of disk you need, and Azure creates and manages the disk for you. You don't have to worry about placing the disks across multiple storage accounts in order to ensure you stay within the scalability limits for the storage accounts -- Azure handles that for you.

Even though both types of disks are available, we recommend using Managed Disks to take advantage of their many features.

To get started with Azure Standard Storage, visit [Get started for free](https://azure.microsoft.com/pricing/free-trial/). 

For information on how to create a VM with Managed Disks, see one of the following articles.

* [Create a VM using Resource Manager and PowerShell](../articles/virtual-machines/windows/quick-create-powershell.md)
* [Create a Linux VM using the Azure CLI](../articles/virtual-machines/linux/quick-create-cli.md)

## Standard Storage Features

Let's take a look at some of the features of Standard Storage. For more details, please see [Introduction to Azure
Storage](../articles/storage/common/storage-introduction.md).

**Standard Storage**: Azure Standard Storage supports Azure Disks, Azure Blobs, Azure Files, Azure Tables, and Azure Queues. To use Standard Storage services, start with [Create an Azure Storage account](../articles/storage/common/storage-quickstart-create-account.md).

**Standard SSD disks:** Standard SSD disks provide more reliable performance than Standard HDD disks, and are currently available. For more information about region availability of Standard SSD disks, see [region availability of Standard SSD disks](../articles/virtual-machines/windows/faq-for-disks.md#standard-ssds-azure-regions).

**Standard HDD disks:** Standard HDD disks can be attached to all Azure VMs including size-series VMs used with Premium Storage such as the DSv2 and GS series. A Standard HDD disk can only be attached to one VM. However, you can attach one or more of these disks to a VM, up to the maximum disk count defined for that VM size. In the following section on Standard Storage Scalability and Performance Targets, we describe the specifications in more detail.

**Standard page blob**: Standard page blobs are used to hold persistent disks for VMs and can also be accessed directly through REST like other types of Azure Blobs. [Page blobs](/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs) are a collection of 512-byte pages optimized for random read and write operations. 

**Storage Replication:** In most regions, data in a standard storage account can be replicated locally or geo-replicated across multiple data centers. The four types of replication available are Locally-Redundant Storage (LRS), Zone-Redundant Storage (ZRS), Geo-Redundant Storage (GRS), and Read Access Geo-Redundant Storage (RA-GRS). Managed Disks in Standard Storage currently support Locally-Redundant Storage (LRS) only. For more information, please see [Storage Replication](../articles/storage/common/storage-redundancy.md).

## Scalability and Performance Targets

In this section, we describe the Scalability and Performance targets you need to consider when using standard storage.

### Account limits – does not apply to managed disks

| **Resource** | **Default Limit** |
|--------------|-------------------|
| TB per storage account  | 500 TB |
| Max ingress<sup>1</sup> per storage account (US Regions) | 10 Gbps if GRS/ZRS enabled, 20 Gbps for LRS |
| Max egress<sup>1</sup> per storage account (US Regions) | 20 Gbps if RA-GRS/GRS/ZRS enabled, 30 Gbps for LRS |
| Max ingress<sup>1</sup> per storage account (European and Asian Regions) | 5 Gbps if GRS/ZRS enabled, 10 Gbps for LRS |
| Max egress<sup>1</sup> per storage account (European and Asian Regions) | 10 Gbps if RA-GRS/GRS/ZRS enabled, 15 Gbps for LRS |
| Total Request Rate (assuming 1 KB object size) per storage account | Up to 20,000 IOPS, entities per second, or messages per second |

<sup>1</sup> Ingress refers to all data (requests) being sent to a storage account. Egress refers to all data (responses) being received from a storage account.

For more information, see [Azure Storage Scalability and Performance Targets](../articles/storage/common/storage-scalability-targets.md).

If the needs of your application exceed the scalability targets of a single storage account, build your application to use multiple storage accounts and partition your data across those storage accounts. Alternately, you can Azure Managed Disks, and Azure manages the partitioning and placement of your data for you.

### Standard Disks Limits

Unlike Premium Disks, the input/output operations per second (IOPS) and throughput (bandwidth) of Standard Disks are not provisioned. The performance of standard disks varies with the VM size to which the disk is attached, not to the size of the disk. You could expect to achieve up to the performance limit listed in the table below.

**Standard disks limits (managed and unmanaged)**

| **VM Tier**            | **Basic Tier VM** | **Standard Tier VM** |
|------------------------|-------------------|----------------------|
| Max Disk size          | 32,767 GiB           | 32,767 GiB        |
| Max 8 KB IOPS per disk | Up to 2,000         | Up to 2,000        |
| Max Bandwidth per disk | Up to 500 MB/s     | Up to 500 MB/s      |

If your workload requires high-performance, low-latency disk support, you should consider using Premium Storage. To know more benefits of Premium Storage, visit [High-Performance Premium Storage and Azure VM Disks](../articles/virtual-machines/windows/premium-storage.md).

## Snapshots and copy blob

To the Storage service, the VHD file is a page blob. You can take snapshots of page blobs, and copy them to another location, such as a different storage account.

### Unmanaged disks

You can create [incremental snapshots](../articles/virtual-machines/windows/incremental-snapshots.md) for unmanaged standard disks in the same way you use snapshots with Standard Storage. We recommend that you create snapshots and then copy those snapshots to a geo-redundant standard storage account if your source disk is in a locally-redundant storage account. For more information, see [Azure Storage Redundancy Options](../articles/storage/common/storage-redundancy.md).

If a disk is attached to a VM, certain API operations are not permitted on the disks. For example, you cannot perform a [Copy Blob](/rest/api/storageservices/Copy-Blob) operation on that blob as long as the disk is attached to a VM. Instead, first create a snapshot of that blob by using the [Snapshot
Blob](/rest/api/storageservices/Snapshot-Blob) REST API method, and then perform the [Copy
Blob](/rest/api/storageservices/Copy-Blob) of the snapshot to copy the attached disk. Alternatively, you can detach the disk and then perform any necessary operations.

To maintain geo-redundant copies of your snapshots, you can copy snapshots from a locally-redundant storage account to a geo-redundant standard storage account by using AzCopy or Copy Blob. For more information, see [Transfer data with the AzCopy Command-Line Utility](../articles/storage/common/storage-use-azcopy.md) and [Copy Blob](/rest/api/storageservices/Copy-Blob).

For detailed information on performing REST operations against page blobs in standard storage accounts, see [Azure Storage Services REST API](/rest/api/storageservices/Azure-Storage-Services-REST-API-Reference).

### Managed disks

A snapshot for a managed disk is a read-only copy of the managed disk which is stored as a standard managed disk. Incremental Snapshots are not currently supported for Managed Disks but will be supported in the future.

If a managed disk is attached to a VM, certain API operations are not permitted on the disks. For example, you cannot generate a shared access signature (SAS) to perform a copy operation while the disk is attached to a VM. Instead, first create a snapshot of the disk, and then perform the copy of the snapshot. Alternately, you can detach the disk and then generate a shared access signature (SAS) to perform the copy operation.

## Pricing and Billing

When using Standard Storage, the following billing considerations apply:

* Standard storage unmanaged disks/data size 
* Standard managed disks
* Standard storage snapshots
* Outbound data transfers
* Transactions

**Unmanaged storage data and disk size:** For unmanaged disks and other data (blobs, tables, queues, and files), you are charged only for the amount of space you are using. For example, if you have a VM whose page blob is provisioned as 127 GB, but the VM is really only using 10 GB of space, you are billed for 10 GB of space. We support Standard storage up to 8191 GB, and Standard unmanaged disks up to 4095 GB. 

**Managed disks:** Billing for standard managed disks depends on the provisioned size of the disk. Azure maps the provisioned size (rounded up) to the nearest Managed Disks option as specified in the tables below. Each managed disk maps to one of the supported provisioned sizes and is billed accordingly. For example, if you create a standard managed disk and specify a provisioned size of 200 GiB, you are billed as per the pricing of the S15 Disk type.

| **Standard HDD Managed <br>Disk Type** | **S4** | **S6** | **S10** | **S15** | **S20** | **S30** | **S40** | **S50** | **S60** | **S70** | **S80** |
|------------------|---------|---------|--------|--------|--------|----------------|----------------|----------------|----------------|----------------|----------------|
| Disk Size        | 32 GiB  | 64 GiB  | 128 GiB | 256 GiB | 512 GiB | 1,024 GiB (1 TiB) | 2,048 GiB (2 TiB) | 4,095 GiB (4 TiB) | 8,192 GiB (8 TiB) | 16,385 GiB (16 TiB) | 32,767 GiB (32 TiB) |


**Snapshots**: Snapshots of standard disks are billed for the additional capacity used by the snapshots. For information on snapshots, see [Creating a Snapshot of a Blob](/rest/api/storageservices/Creating-a-Snapshot-of-a-Blob).

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Transaction**: Azure charges $0.0036 per 100,000 transactions for standard storage. Transactions include both read and write operations to storage.

For detailed information on pricing for Standard Storage, Virtual Machines, and Managed Disks, see:

* [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/)
* [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks)

## Azure Backup service support

Virtual machines with unmanaged disks can be backed up using Azure Backup. [More details](../articles/backup/backup-azure-vms-first-look-arm.md).

You can also use the Azure Backup service with Managed Disks to create a backup job with time-based backups, easy VM restoration and backup retention policies. You can read more about this at [Using Azure Backup service for VMs with Managed Disks](../articles/backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup).

## Next steps

* [Introduction to Azure Storage](../articles/storage/common/storage-introduction.md)

* [Create a storage account](../articles/storage/common/storage-quickstart-create-account.md)

* [Managed Disks Overview](../articles/virtual-machines/linux/managed-disks-overview.md)

* [Create a VM using Resource Manager and PowerShell](../articles/virtual-machines/windows/quick-create-powershell.md)

* [Create a Linux VM using the Azure CLI](../articles/virtual-machines/linux/quick-create-cli.md)
