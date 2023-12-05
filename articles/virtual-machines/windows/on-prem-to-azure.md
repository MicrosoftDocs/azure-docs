---
title: Migrate from AWS and other platforms to managed disks in Azure 
description: Create VMs in Azure using VHDs uploaded from other clouds like AWS or other virtualization platforms and use Azure managed disks.
author: roygara
manager: twooley
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: conceptual
ms.date: 10/07/2017
ms.author: rogarana
ms.custom: H1Hack27Feb2017

---

# Migrate from Amazon Web Services (AWS) and other platforms to managed disks in Azure

**Applies to:** :heavy_check_mark: Windows VMs 

You can upload VHD files from AWS or on-premises virtualization solutions to Azure to create virtual machines (VMs) that use managed disks. Azure managed disks removes the need to manage storage accounts for Azure IaaS VMs. You just specify the type of disk, and the size of that disk that you need, and Azure creates and manages the disk for you. 

You can upload either generalized and specialized VHDs. 
- **Generalized VHD** - has had all of your personal account information removed using Sysprep. 
- **Specialized VHD** - maintains the user accounts, applications, and other state data from your original VM. 

> [!IMPORTANT]
> Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md)
>
>


| Scenario                                                                                                                         | Documentation                                                                                                                       |
|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| You have existing AWS EC2 instances that you would like to migrate to Azure VMs using managed disks                              | [Move a VM from Amazon Web Services (AWS) to Azure](aws-to-azure.md)                           |
| You have a VM from another virtualization platform that you would like to use as an image to create multiple Azure VMs. | [Upload a generalized VHD and use it to create a new VM in Azure](upload-generalized-managed.md) |
| You have a uniquely customized VM that you would like to recreate in Azure.                                                      | [Upload a specialized VHD to Azure and create a new VM](create-vm-specialized.md)         |


## Overview of managed disks

Azure managed disks simplifies VM management by removing the need to manage storage accounts. Managed disks also benefit from better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set are sufficiently isolated from each other to avoid a single point of failure. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.
Based on your needs, you can choose from four types of storage options. To learn about the available disk types, see our article [Select a disk type](../disks-types.md).

## Plan for the migration to managed disks

This section helps you to make the best decision on VM and disk types.

If you are planning on migrating from unmanaged disks to managed disks, you should be aware that users with the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role will not be able to change the VM size (as they could pre-conversion). This is because VMs with managed disks require the user to have the Microsoft.Compute/disks/write permission on the OS disks.

### Location

Pick a location where Azure managed disks are available. If you are migrating to premium SSDs, also ensure that premium storage is available in the region where you are planning to migrate to. See [Azure Services by Region](https://azure.microsoft.com/regions/#services) for up-to-date information on available locations.

### VM sizes

If you are migrating to premium SSDs, you have to update the size of the VM to premium storage capable size available in the region where VM is located. Review the VM sizes that are premium storage capable. The Azure VM size specifications are listed in [Sizes for virtual machines](../sizes.md).
Review the performance characteristics of virtual machines that work with premium storage and choose the most appropriate VM size that best suits your workload. Make sure that there is sufficient bandwidth available on your VM to drive the disk traffic.

### Disk sizes

For information on available disk types and sizes, see [What disk types are available in Azure?](../disks-types.md).

### Disk caching policy 

**Premium Managed Disks**

By default, disk caching policy is *Read-Only* for all the Premium data disks, and *Read-Write* for the Premium operating system disk attached to the VM. This configuration setting is recommended to achieve the optimal performance for your application’s IOs. For write-heavy or write-only data disks (such as SQL Server log files), disable disk caching so that you can achieve better application performance.

### Pricing

Review the [pricing for managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).


## Next Steps

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md)