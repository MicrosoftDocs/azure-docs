---
title: Migrate from AWS and other platforms to Managed Disks in Azure | Microsoft Docs
description: Create VMs in Azure using VHDs uploaded from other clouds like AWS or other virtualization platforms and take advantage of Azure Managed Disks.
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
ms.custom: H1Hack27Feb2017

---

# Migrate from Amazon Web Services (AWS) and other platforms to Managed Disks in Azure

You can upload VHD files from AWS or on-premises virtualization solutions to Azure to create VMs that take advantage of Managed Disks. Azure Managed Disks removes the need of to managing storage accounts for Azure IaaS VMs. You have to only specify the type (Premium or Standard) and size of disk you need, and Azure will create and manage the disk for you. 

You can upload either generalized and specialized VHDs. 
- **Generalized VHD** - has had all of your personal account information removed using Sysprep. 
- **Specialized VHD** - maintains the user accounts, applications and other state data from your original VM. 

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
>
>


| Scenario                                                                                                                         | Documentation                                                                                                                       |
|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| You have an existing AWS EC2 instances that you could like to migrate to Azure Managed Disks                                     | [Move a VM from Amazon Web Services (AWS) to Azure](aws-to-azure.md)                           |
| You have a VM from and other virtualization platform that you would like to use to use as an image to create multiple Azure VMs. | [Upload a generalized VHD and use it to create a new VMs in Azure](upload-generalized-managed.md) |
| You have a uniquely customized VM that you would like to recreate in Azure.                                                      | [Upload a specialized VHD to Azure and create a new VM](create-vm-specialized.md)         |


## Overview of Managed Disks

Azure Managed Disks simplifies VM management by removing the need to manage storage accounts. Managed Disks also benefit from better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set will be sufficiently isolated from each other to avoid single point of failures. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures. 
Based on your needs, you can choose from two types of storage options: 
 
- [Premium Managed Disks](../../storage/storage-premium-storage.md) are Solid State Drive (SSD) based storage storage media which delivers highperformance, low-latency disk support for virtual machines running I/O-intensive workloads. You can take advantage of the speed and performance of these disks by migrating to Premium Managed Disks.  

- [Standard Managed Disks](../../storage/storage-standard-storage.md) use Hard Disk Drive (HDD) based storage media and are best suited for Dev/Test and other infrequent access workloads that are less sensitive to performance variability.  

## Plan for the migration to Managed Disks

This section helps you to make the best decision on VM and disk types.


### Location

Pick a location where Azure Managed Disks are available. If you are migrating to Premium Managed Disks, also ensure that Premium storage is available in the region where you are planning to migrate to. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to Premium Managed Disks, you have to update the size of the VM to Premium Storage capable size available in the region where VM is located. Review the VM sizes that are Premium Storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](sizes.md).
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

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
