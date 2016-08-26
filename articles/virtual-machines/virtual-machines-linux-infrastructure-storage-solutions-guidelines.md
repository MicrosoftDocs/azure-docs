<properties
	pageTitle="Storage Solutions Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying storage solutions in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="iainfou"/>

# Storage infrastructure guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] 

This article focuses on understanding storage needs and design considerations for achieving optiumum virtual machine (VM) performance.


## Implementation guidelines for storage

Decisions:

- Do you need to use Standard or Premium storage for your workload?
- Do you need disk striping to create disks larger than 1023 GB?
- Do you need disk striping to achieve optimal I/O performance for your workload?
- What set of storage accounts do you need to host your IT workload or infrastructure?

Tasks:

- Review I/O demands of the applications you will be deploying and plan the appropriate number and type of storage accounts.
- Create the set of storage accounts using your naming convention. You can use the Azure CLI or the portal.


## Storage

Azure Storage is a key part of deploying and managing virtual machines (VMs) and applications. Azure Storage provides services for storing file data, unstructured data, and messages, and it is also part of the infrastructure supporting VMs.

There are two types of storage accounts available for supporting VMs:

- Standard storage account gives you access to blob storage (used for storing Azure VM disks), table storage, queue storage, and file storage
- [Premium storage](../storage/storage-premium-storage.md) delivers high-performance, low-latency disk support for I/O intensive workloads, such as MongoDB Sharded cluster, and currently supports Azure VM disks only.

Azure creates VMs with an operating system disk, a temporary disk, and zero or more optional data disks. The operating system disk and data disks are Azure page blobs, whereas the temporary disk is stored locally on the node where the machine lives. Take care when designing applications to only use this temporary disk for non-persistent data as the VM may be migrated between hosts during a maintenance event. Any data stored on the temporary disk would be lost.

Durability and high availability is provided by the underlying Azure Storage environment in order to ensure that your data remains protected against unplanned maintenance or hardware failures. As you design your Azure Storage environment, you can choose to replicate VM storage locally within a given Azure datacenter, across Azure datacenters within a given region, or even across Azure datacenters across different regions. You can read [more about the replication options for high availability](../storage/storage-introduction.md#replication-for-durability-and-high-availability).

Operating system disks and data disks have a maximum size of 1023 gigabytes (GB) because the maximum size of a blob is 1024 GB and that must contain the metadata (footer) of the VHD file (a GB is 1024<sup>3</sup> bytes). You can use Logical Volume Manager (LVM) to surpass this limit by pooling together data disks to present logical volumes larger than 1023GB to your VM.

There are some scalability limits when designing your Azure Storage deployments - see [Microsoft Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md#storage-limits) for more details. Also see [Azure storage scalability and performance targets](../storage/storage-scalability-targets.md).

When it comes to application storage, you can store unstructured object data such as documents, images, backups, configuration data, logs, etc. using blob storage. Rather than your application writing to a virtual disk attached to the VM, the application can write directly to Azure blob storage. Blob storage also provides the option of [hot and cool storage tiers](../storage/storage-blob-storage-tiers.md) depending on you availability needs and cost constraints.


## Striped disks
Besides providing the ability to create disks larger than 1023 GB, in many instances, using striping for data disks enhances performance by allowing multiple blobs to back the storage for a single volume. With striping, the I/O required to write and read data from a single logical disk proceeds in parallel.

Azure imposes limits on the amount of data disks and bandwidth available, depending on the VM size. For details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

If you are using disk striping for Azure data disks, consider the following guidelines:

- Data disks should always be the maximum size (1023 GB)
- Attach the maximum data disks allowed for the VM size
- Use LVM
- Avoid using Azure data disk caching options (caching policy = None)

For more information, see [Configuring LVM on a Linux VM](virtual-machines-linux-configure-lvm.md).


## Multiple storage accounts

When designing out your Azure Storage environment, you can make use of multiple storage accounts as the number of VMs you deploy increases. This helps distribute out the I/O across the underlying Azure Storage infrastructure in order to maintain optimum performance for your VMs and applications. As you design the applications that will be deployed, consider the I/O requirements each VM will have and balance out those VMs across Azure Storage accounts. Try to avoid grouping all the high I/O demanding VMs being grouped together in just one or two accounts.

For more information as to the I/O capabilities of the different Azure Storage options and some recommend maximums, see [Azure storage scalability and performance targets](../storage/storage-scalability-targets.md).


## Next steps

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)] 