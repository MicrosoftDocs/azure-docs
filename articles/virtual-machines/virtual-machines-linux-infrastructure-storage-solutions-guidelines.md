<properties
	pageTitle="Azure Storage Solutions Infrastructure Guidelines"
	description="Learn about the key design and implementation guidelines for deploying storage solutions in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="v-livech"/>

# Azure Storage Solutions Infrastructure Guidelines

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.

## Storage

Azure Storage is an integral part of many Azure solutions. Azure Storage provides services for storing file data, unstructured data, and messages, and it is also part of the infrastructure supporting virtual machines.

There are two types of storage accounts available from Azure. A standard storage account gives you access to blob storage (used for storing Azure virtual machine disks), table storage, queue storage, and file storage. Premium storage is designed for high-performance applications, such as SQL Servers in an AlwaysOn cluster, and currently supports Azure virtual machine disks only.

Storage accounts are bound to scalability targets. See [Microsoft Azure subscription and service limits, quotas, and constraints](../articles/azure-subscription-service-limits.md#storage-limits) to become familiar with current Azure storage limits. Also see [Azure storage scalability and performance targets](../articles/storage/storage-scalability-targets.md).

Azure creates virtual machines with an operating system disk, a temporary disk, and zero or more optional data disks. The operating system disk and data disks are Azure page blobs, whereas the temporary disk is stored locally on the node where the machine lives. This makes the temporary disk unfit for data that must persist during a system recycle, because the machine might silently be migrated from one node to another, losing any data in that disk. Do not store anything on the temporary drive.

Operating system disks and data disks have a maximum size of 1023 gigabytes (GB) because the maximum size of a blob is 1024 GB and that must contain the metadata (footer) of the VHD file (a GB is 1024<sup>3</sup> bytes). You can implement disk striping in Windows to surpass this limit.

## Striped disks
Besides providing the ability to create disks larger than 1023 GB, in many instances, using striping for data disks enhances performance by allowing multiple blobs to back the storage for a single volume. With striping, the I/O required to write and read data from a single logical disk proceeds in parallel.

Azure imposes limits on the amount of data disks and bandwidth available, depending on the virtual machine size. For details, see [Sizes for virtual machines](../articles/virtual-machines/virtual-machines-linux-sizes.md).

If you are using disk striping for Azure data disks, consider the following guidelines:

- Data disks should always be the maximum size (1023 GB)
- Attach the maximum data disks allowed for the virtual machine size
- Use storage spaces configuration
- Use storage striping configuration
- Avoid using Azure data disk caching options (caching policy = None)

For more information, see [Storage spaces - designing for performance](http://social.technet.microsoft.com/wiki/contents/articles/15200.storage-spaces-designing-for-performance.aspx).

## Multiple storage accounts

Using multiple storage accounts to back the disks associated with many virtual machines ensures that the aggregated I/O of those disks is well below the scalability targets for each one of those storage accounts.

We recommend that you start with the deployment of one virtual machine per storage account.

## Storage layout design

To implement these strategies to implement the disk subsystem of the virtual machines with good performance, an IT workload or infrastructure typically takes advantage of many storage accounts. These host many VHD blobs. In some instances, more than one blob is associated to one single volume in a virtual machine.

This situation can add complexity to the management tasks. Designing a sound strategy for storage, including appropriate naming for the underlying disks and associated VHD blobs is key.

## Implementation guidelines recap for storage

Decisions:

- Do you need disk striping to create disks larger than 500 terabytes (TB)?
- Do you need disk striping to achieve optimal performance for your workload?
- What set of storage accounts do you need to host your IT workload or infrastructure?

Task:

- Create the set of storage accounts using your naming convention. You can use the Azure portal, the Azure classic portal, or the **New-AzureStorageAccount** PowerShell cmdlet.
