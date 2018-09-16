---
title: "include file"
description: "include file"
services: storage
author: rogara
ms.service: storage
ms.topic: "include"
ms.date: 04/09/2018
ms.author: rogarana
ms.custom: "include file"
---

## About VHDs
The VHDs used in Azure are .vhd files stored as page blobs in a standard or premium storage account in Azure. For details about page blobs, see [Understanding block blobs and page blobs](/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs/). For details about premium storage, see [High-performance premium storage and Azure VMs](../articles/virtual-machines/windows/premium-storage.md).

Azure supports the fixed disk VHD format. The fixed format lays the logical disk out linearly within the file, so that disk offset X is stored at blob offset X. A small footer at the end of the blob describes the properties of the VHD. Often, the fixed-format wastes space because most disks have large unused ranges in them. However, Azure stores .vhd files in a sparse format, so you receive the benefits of both the fixed and dynamic disks at the same time. For more information, see [Getting started with virtual hard disks](https://technet.microsoft.com/library/dd979539.aspx).

All VHD files in Azure that you want to use as a source to create disks or images are read-only, except the .vhd files uploaded or copied to Azure storage by the user (which can be either read-write or read-only). When you create a disk or image, Azure makes copies of the source .vhd files. These copies can be read-only or read-and-write, depending on how you use the VHD.

When you create a virtual machine from an image, Azure creates a disk for the virtual machine that is a copy of the source .vhd file. To protect against accidental deletion, Azure places a lease on any source .vhd file that’s used to create an image, an operating system disk, or a data disk.

Before you can delete a source .vhd file, you’ll need to remove the lease by deleting the disk or image. To delete a .vhd file that is being used by a virtual machine as an operating system disk, you can delete the virtual machine, the operating system disk, and the source .vhd file all at once by deleting the virtual machine and deleting all associated disks. However, deleting a .vhd file that’s a source for a data disk requires several steps in a set order. First you detach the disk from the virtual machine, then delete the disk, and then delete the .vhd file.

> [!WARNING]
> If you delete a source .vhd file from storage, or delete your storage account, Microsoft can't recover that data for you.

## Types of disks 
Azure Disks are designed for 99.999% availability. Azure Disks have consistently delivered enterprise-grade durability, with an industry-leading ZERO% Annualized Failure Rate.

There are three performance tiers for storage that you can choose from when creating your disks -- Premium SSD Disks, Standard SSD (Preview), and Standard HDD Storage. Also, there are two types of disks -- unmanaged and managed.

### Standard HDD disks
Standard HDD disks are backed by HDDs, and deliver cost-effective storage. Standard HDD storage can be replicated locally in one datacenter, or be geo-redundant with primary and secondary data centers. For more information about storage replication, see [Azure Storage replication](../articles/storage/common/storage-redundancy.md). 

For more information about using Standard HDD disks, see [Standard Storage and Disks](../articles/virtual-machines/windows/standard-storage.md).

### Standard SSD disks (preview)
Standard SSD disks are designed to address the same kind of workloads as Standard HDD disks, but offer more consistent performance and reliability than HDD. Standard SSD disks combine elements of Premium SSD disks and Standard HDD disks to form a cost-effective solution best suited for applications like web servers that do not need high IOPS on disks. Where available, Standard SSD disks are the recommended deployment option for most workloads. Standard SSD disks are only available as Managed Disks, and while in preview are only available in [select regions](../articles/virtual-machines/windows/faq-for-disks.md) and with the locally redundant storage (LRS) resiliency type.

### Premium SSD disks 
Premium SSD disks are backed by SSDs, and delivers high-performance, low-latency disk support for VMs running I/O-intensive workloads. Typically you can use Premium SSD disks with sizes that include an "s" in the series name. For example, there is the Dv3-Series and the Dsv3-series, the Dsv3-series can be used with Premium SSD disks.  For more information, please see [Premium Storage](../articles/virtual-machines/windows/premium-storage.md).

### Unmanaged disks
Unmanaged disks are the traditional type of disks that have been used by VMs. With these disks, you create your own storage account and specify that storage account when you create the disk. Make sure you don't put too many disks in the same storage account, because you could exceed the [scalability targets](../articles/storage/common/storage-scalability-targets.md) of the storage account (20,000 IOPS, for example), resulting in the VMs being throttled. With unmanaged disks, you have to figure out how to maximize the use of one or more storage accounts to get the best performance out of your VMs.

### Managed disks 
Managed Disks handles the storage account creation/management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You simply specify the disk size and the performance tier (Standard/Premium), and Azure creates and manages the disk for you. As you add disks or scale the VM up and down, you don't have to worry about the storage being used. 

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, see the [Managed Disks Overview](../articles/virtual-machines/windows/managed-disks-overview.md).

We recommend that you use Azure Managed Disks for new VMs, and that you convert your previous unmanaged disks to managed disks, to take advantage of the many features available in Managed Disks.

### Disk comparison
The following table provides a comparison of Standard HDD, Standard SSD, and Premium SSD for unmanaged and managed disks to help you decide what to use.

|    | Azure Premium Disk |Azure Standard SSD Disk (preview)| Azure Standard HDD Disk 
|--- | ------------------ | ------------------------------- | ----------------------- 
| Disk Type | Solid State Drives (SSD) | Solid State Drives (SSD) | Hard Disk Drives (HDD)  
| Overview  | SSD-based high-performance, low-latency disk support for VMs running IO-intensive workloads or hosting mission critical production environment |More consistent performance and reliability than HDD. Optimized for low-IOPS workloads| HDD-based cost effective disk for infrequent access
| Scenario  | Production and performance sensitive workloads |Web servers, lightly used enterprise applications and Dev/Test| Backup, Non-critical, Infrequent access 
| Disk Size | P4: 32 GiB (Managed Disks only)<br>P6: 64 GiB (Managed Disks only)<br>P10: 128 GiB<br>P15: 256 GiB (Managed Disks only)<br>P20: 512 GiB<br>P30: 1024 GiB<br>P40: 2048 GiB<br>P50: 4095 GiB |Managed Disks only:<br>E10: 128 GiB<br>E15: 256 GiB<br>E20: 512 GiB<br>E30: 1024 GiB<br>E40: 2048 GiB<br>E50: 4095 GiB | Unmanaged Disks: 1 GiB – 4 TiB (4095 GiB) <br><br>Managed Disks:<br> S4: 32 GiB <br>S6: 64 GiB <br>S10: 128 GiB <br>S15: 256 GiB <br>S20: 512 GiB <br>S30: 1024 GiB <br>S40: 2048 GiB<br>S50: 4095 GiB
| Max Throughput per Disk | 250 MiB/s | Upto 60 MiB/s | Upto 60 MiB/s 
| Max IOPS per Disk | 7500 IOPS | Upto 500 IOPS | Upto 500 IOPS 