---
title: Migrate from AWS and other platforms to Managed Disks in Azure | Microsoft Docs
description: Create VMs in Azure using VHDs uploaded from other clouds like AWS or other virtualization platforms and take advantage of Azure Managed Disks.
services: virtual-machines-windows
documentationcenter: ''
author: roygara
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/07/2017
ms.author: rogarana
ms.custom: H1Hack27Feb2017

---

# Migrate from Amazon Web Services (AWS) and other platforms to Managed Disks in Azure

You can upload VHD files from AWS or on-premises virtualization solutions to Azure to create VMs that take advantage of Managed Disks. Azure Managed Disks removes the need to manage storage accounts for Azure IaaS VMs. You have to only specify the type (Premium or Standard) and size of disk you need, and Azure creates and manages the disk for you. 

You can upload either generalized and specialized VHDs. 
- **Generalized VHD** - has had all of your personal account information removed using Sysprep. 
- **Specialized VHD** - maintains the user accounts, applications, and other state data from your original VM. 

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>


| Scenario                                                                                                                         | Documentation                                                                                                                       |
|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| You have existing AWS EC2 instances that you would like to migrate to Azure VMs using managed disks                              | [Move a VM from Amazon Web Services (AWS) to Azure](aws-to-azure.md)                           |
| You have a VM from another virtualization platform that you would like to use as an image to create multiple Azure VMs. | [Upload a generalized VHD and use it to create a new VM in Azure](upload-generalized-managed.md) |
| You have a uniquely customized VM that you would like to recreate in Azure.                                                      | [Upload a specialized VHD to Azure and create a new VM](create-vm-specialized.md)         |


## Overview of Managed Disks

Azure Managed Disks simplifies VM management by removing the need to manage storage accounts. Managed Disks also benefit from better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set are sufficiently isolated from each other to avoid a single point of failure. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.
Based on your needs, you can choose from four types of storage options. To learn about the available disk types, see our article [Select a disk type](disks-types.md).

## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.

If you are planning on migrating from unmanaged disks to managed disks, you should be aware that users with the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role will not be able to change the VM size (as they could pre-conversion). This is because VMs with managed disks require the user to have the Microsoft.Compute/disks/write permission on the OS disks.

### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

### Disk sizes

**Premium Managed Disks**

There are seven types of premium managed disks that can be used with your VM and each has specific IOPs and throughput limits. Take into consideration these limits when choosing the Premium disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

| Premium Disks Type  | P4    | P6    | P10   | P15   | P20   | P30   | P40   | P50   | 
|---------------------|-------|-------|-------|-------|-------|-------|-------|-------|
| Disk size           | 32 GB| 64 GB| 128 GB| 256 GB|512 GB | 1024 GB (1 TB)    | 2048 GB (2 TB)    | 4095 GB (4 TB)    | 
| IOPS per disk       | 120   | 240   | 500   | 1100  |2300              | 5000              | 7500              | 7500              | 
| Throughput per disk | 25 MB per second  | 50 MB per second  | 100 MB per second | 125 MB per second |150 MB per second | 200 MB per second | 250 MB per second | 250 MB per second |

**Standard Managed Disks**

There are seven types of standard managed disks that can be used with your VM. Each of them have different capacity but have same IOPS and throughput limits. Choose the type of Standard Managed disks based on the capacity needs of your application.

| Standard Disk Type  | S4               | S6               | S10              | S15              | S20              | S30              | S40              | S50              | 
|---------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------| 
| Disk size           | 30 GB            | 64 GB            | 128 GB           | 256 GB           |512 GB           | 1024 GB (1 TB)   | 2048 GB (2TB)    | 4095 GB (4 TB)   | 
| IOPS per disk       | 500              | 500              | 500              | 500              |500              | 500              | 500             | 500              | 
| Throughput per disk | 60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second |60 MB per second | 60 MB per second | 60 MB per second | 60 MB per second | 

### Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

### Pricing

Review the [pricing for Managed Disks](https://azure.microsoft.com/pricing/details/managed-disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.


## Next Steps

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
