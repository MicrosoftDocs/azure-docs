---
title: Create Azure Managed Disks from AWS and on-premises VHDs | Microsoft Docs
description: Create VMs in Azure using VHDs uploaded from other clouds like AWS or other on-premises virtualization platforms and take advantage of Azure Managed Disks.
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

# Migrate AWS and on-premises VMs to Managed Disks in Azure

You can upload VHD files from AWs or on-premises virtualization solutions to Azure to create VMs that take advantage of Managed Disks. 

You can upload either generalized and specialized VHDs. 
**Generalized VHD** - a generalized VHD has had all of your personal account information removed using Sysprep. 
**Specialized VHD** - a specialized VHD maintains the user accounts, applications and other state data from your original VM. 

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>

## Migration options

- [Migrate from Amazon Web Services (AWS) to Azure Managed Disks](virtual-machines-windows-aws-to-azure.md)
- [Upload a generalized VHD to Azure and create a new VM using Managed Disks](virtual-machines-windows-upload-generalized-managed.md)
- [Upload a specialized VHD to Azure and create a new VM using Managed Disks](virtual-machines-windows-upload-specialized.md)


## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.


### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services byRegion](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](virtual-machines-windows-sizes.md).
Review the performance characteristics of virtual machines that work with Premium Storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

### Disk sizes

**Premium Managed Disks**

There are three types of Premium Managed disks that can be used with your VM and each has specific IOPs and throughput limits. Consider these limits when choosing the Premium disk type for your VM based on the needs of your application in terms of capacity, performance, scalability, and peak loads.

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

### Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

### Pricing

Review the [pricing for Managed Disks](https://azure.microsoft.com/en-us/pricing/details/managed-disks/). Pricing of Premium Managed Disks is same as the Premium Unmanaged Disks. But pricing for Standard Managed Disks is different than Standard Unmanaged Disks.


## Next Steps

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](virtual-machines-windows-prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)