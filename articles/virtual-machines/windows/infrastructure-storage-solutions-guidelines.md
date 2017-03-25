---
title: Storage solutions for Windows VMs in Azure | Microsoft Docs
description: Learn about the key design and implementation guidelines for deploying storage solutions in Azure infrastructure services.
documentationcenter: ''
services: virtual-machines-windows
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 4ceb7d32-7a0d-4004-b701-c2bbcaff6b0b
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/17/2017
ms.author: iainfou
ms.custom: H1Hack27Feb2017

---
# Azure storage infrastructure guidelines for Windows VMs

[!INCLUDE [virtual-machines-windows-infrastructure-guidelines-intro](../../../includes/virtual-machines-windows-infrastructure-guidelines-intro.md)]

This article focuses on understanding storage needs and design considerations for achieving optimum virtual machine (VM) performance.

## Implementation guidelines for storage
Decisions:

* Are you going to use Azure Managed Disks or unmanaged disks?
* Do you need to use Standard or Premium storage for your workload?
* Do you need disk striping to create disks larger than 1023 GB?
* Do you need disk striping to achieve optimal I/O performance for your workload?
* What set of storage accounts do you need to host your IT workload or infrastructure?

Tasks:

* Review I/O demands of the applications you are deploying and plan the appropriate number and type of storage accounts.
* Create the set of storage accounts using your naming convention. You can use Azure PowerShell or the portal.

## Storage
Azure Storage is a key part of deploying and managing virtual machines (VMs) and applications. Azure Storage provides services for storing file data, unstructured data, and messages, and it is also part of the infrastructure supporting VMs.

[Azure Managed Disks](../../storage/storage-managed-disks-overview.md) handles storage for you behind the scenes. With unmanaged disks, you create storage accounts to hold the disks (VHD files) for your Azure VMs. When scaling up, you must make sure you created additional storage accounts so you don’t exceed the IOPS limit for storage with any of your disks. With Managed Disks handling storage, you are no longer limited by the storage account limits (such as 20,000 IOPS / account). You also no longer have to copy your custom images (VHD files) to multiple storage accounts. You can manage them in a central location – one storage account per Azure region – and use them to create hundreds of VMs in a subscription. We recommend you use Managed Disks for new deployments.

There are two types of storage accounts available for supporting VMs:

* Standard storage accounts give you access to blob storage (used for storing Azure VM disks), table storage, queue storage, and file storage.
* [Premium storage](../../storage/storage-premium-storage.md) accounts deliver high-performance, low-latency disk support for I/O intensive workloads, such as SQL Servers in an AlwaysOn cluster. Premium storage currently supports Azure VM disks only.

Azure creates VMs with an operating system disk, a temporary disk, and zero or more optional data disks. The operating system disk and data disks are Azure page blobs, whereas the temporary disk is stored locally on the node where the machine lives. Take care when designing applications to only use this temporary disk for non-persistent data as the VM may be migrated between hosts during a maintenance event. Any data stored on the temporary disk would be lost.

Durability and high availability is provided by the underlying Azure Storage environment to ensure that your data remains protected against unplanned maintenance or hardware failures. As you design your Azure Storage environment, you can choose to replicate VM storage:

* locally within a given Azure datacenter
* across Azure datacenters within a given region
* across Azure datacenters across different regions

You can read [more about the replication options for high availability](../../storage/storage-introduction.md#replication-for-durability-and-high-availability).

Operating system disks and data disks have a maximum size of 1023 gigabytes (GB). The maximum size of a blob is 1024 GB and that must contain the metadata (footer) of the VHD file (a GB is 1024<sup>3</sup> bytes). You can use Storage Spaces in Windows Server 2012 to surpass this limit by pooling together data disks to present logical volumes larger than 1023GB to your VM.

There are some scalability limits when designing your Azure Storage deployments - for more information, see [Microsoft Azure subscription and service limits, quotas, and constraints](../../azure-subscription-service-limits.md#storage-limits). Also see [Azure storage scalability and performance targets](../../storage/storage-scalability-targets.md).

For application storage, you can store unstructured object data such as documents, images, backups, configuration data, logs, etc. using blob storage. Rather than your application writing to a virtual disk attached to the VM, the application can write directly to Azure blob storage. Blob storage also provides the option of [hot and cool storage tiers](../../storage/storage-blob-storage-tiers.md) depending on your availability needs and cost constraints.

## Striped disks
Besides allowing you to create disks larger than 1023 GB, in many instances, using striping for data disks enhances performance by allowing multiple blobs to back the storage for a single volume. With striping, the I/O required to write and read data from a single logical disk proceeds in parallel.

Azure imposes limits on the number of data disks and amount of bandwidth available, depending on the VM size. For details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

If you are using disk striping for Azure data disks, consider the following guidelines:

* Data disks should always be the maximum size (1023 GB).
* Attach the maximum data disks allowed for the VM size.
* Use Storage Spaces.
* Avoid using Azure data disk caching options (caching policy = None).

For more information, see [Storage spaces - designing for performance](http://social.technet.microsoft.com/wiki/contents/articles/15200.storage-spaces-designing-for-performance.aspx).

## Multiple storage accounts
This section does not apply to [Azure Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), as you do not create separate storage accounts. 

When designing your Azure Storage environment for unmanaged disks, you can use multiple storage accounts as the number of VMs you deploy increases. This approach helps distribute out the I/O across the underlying Azure Storage infrastructure to maintain optimum performance for your VMs and applications. As you design the applications that you are deploying, consider the I/O requirements each VM has and balance out those VMs across Azure Storage accounts. Try to avoid grouping all the high I/O demanding VMs in to just one or two storage accounts.

For more information about the I/O capabilities of the different Azure Storage options and some recommend maximums, see [Azure storage scalability and performance targets](../../storage/storage-scalability-targets.md).

## Next steps
[!INCLUDE [virtual-machines-windows-infrastructure-guidelines-next-steps](../../../includes/virtual-machines-windows-infrastructure-guidelines-next-steps.md)]

