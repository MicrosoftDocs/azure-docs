---
title: Migrate Azure VMs to Managed Disks | Microsoft Docs
description: Migrate Azure virtual machines created using unmanaged disks in storage accounts to use Managed Disks.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/07/2017
ms.author: cynthn

---

# Migrate Azure VMs to Managed Disks in Azure

Azure managed disks removes the need of managing [Storage accounts](../storage/storage-introduction.md) for Azure VMs. You only have specify the type ([Premium](../storage/storage-premium-storage-performance.md) or [Standard](../storage/storage-standard-storage.md) and size of disk you need, and Azure will create and manage the disk for you. Moreover, migrate your existing Azure VMs to Managed Disks to benefit from  better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set will be sufficiently isolated from each other to avoid single point of failures. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.

If you are currently using Standard storage option for your Disks, migrate to Premium Managed Disks to take advantage of speed and performance of these Disks. [Premium Managed Disks](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage-performance) are stored on Solid State Drives (SSD) which deliver high-performance, low-latency disk support for virtual machines running I/O-intensive workloads.

You can migrate to Managed Disks in following scenarios:

| Convert...                                            | Documentation link                                                                                                                                                                                                                                                                  |
|----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| VMs in an availability set that use unmanaged disks to managed disks   | [Convert VMs in an availability set to use managed disks](virtual-machines-windows-convert-unmanaged-to-managed-disks.md#convert-vms-in-an-availability-set-to-managed-disks-in-a-managed-availability-set)                                                                        |
| Premium unmanaged disks to Premium managed disks   | [Convert existing Azure VMs to managed disks of the same storage type](virtual-machines-windows-convert-unmanaged-to-managed-disks.md#convert-existing-azure-vms-to-managed-disks-of-the-same-storage-type)                                                                         |
| Standard unmanaged disks to Standard managed disks | [Convert existing Azure VMs to managed disks of the same storage type](virtual-machines-windows-convert-unmanaged-to-managed-disks.md#convert-existing-azure-vms-to-managed-disks-of-the-same-storage-type)                                                                         |
| Standard unmanaged disks to Premium managed disks  | [Migrate existing Azure VMs using Standard Unmanaged Disks to Premium Managed Disks](virtual-machines-windows-convert-unmanaged-to-managed-disks.md#migrate-existing-azure-vms-using-standard-unmanaged-disks-to-premium-managed-disks)                            |
| Classic to Resource Manager with managed disks     | [Migrate a single VM](virtual-machines-windows-migrate-single-classic-to-rm.md) - or - [Migrate all VMs in a vNet](virtual-machines-windows-ps-migration-classic-resource-manager.md) and then [Convert a VM from unmanaged disks to managed disks](virtual-machines-windows-convert-unmanaged-to-managed-disks.md) | 



## Plan for the conversion to Managed Disks

This section helps you to make the best decision on VM and disk types.


## Location

Pick a location where Azure Managed Disks are available. If you are moving to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to move to. See [Azure Services byRegion](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

## VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](virtual-machines-windows-sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

## Disk sizes

**Premium Managed Disks**

There are three types of Premium Managed disks that can be used with your VM and each has specific IOPs and throughput limits. Take into consideration these limits when choosing the Premium disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

| Premium Disks Type  | P10               | P20               | P30               |
|---------------------|-------------------|-------------------|-------------------|
| Disk size           | 128 GB            | 512 GB            | 1024 GB (1 TB)    |
| IOPS per disk       | 500               | 2300              | 5000              |
| Throughput per disk | 100 MB per second | 150 MB per second | 200 MB per second |

**Standard Managed Disks**

There are five types of Standard Managed disks that can be used with your VM. Each of them have different capacity but have same IOPS and throughput limits. Choose the type of Standard Managed disks based on the capacity needs of your application.

| Standard Disk Type  | S4               | S6               | S10              | S20              | S30              |
|---------------------|------------------|------------------|------------------|------------------|------------------|
| Disk size           | 30 GB            | 64 GB            | 128 GB           | 512 GB           | 1024 GB (1 TB)   |
| IOPS per disk       | 500              | 500              | 500              | 500              | 500              |
| Throughput per disk | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second |

## Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

## Pricing

Review the [pricing for Managed Disks](https://azure.microsoft.com/en-us/pricing/details/storage/disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.



## Next steps

- Learn more about [Managed Disks](../storage/storage-managed-disks-overview.md)
