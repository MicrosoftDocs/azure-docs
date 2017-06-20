---
title: 'Frequently asked questions (FAQ) about Azure IaaS VM disks | Microsoft Docs'
description: Frequently asked questions about Azure IaaS VM disks and premium disks (managed and unmanaged)
services: storage
documentationcenter: ''
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: e2a20625-6224-4187-8401-abadc8f1de91
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/15/2017
ms.author: robinsh

---
# Frequently asked questions about Azure IaaS VM disks and managed and unmanaged premium disks

This article answers some frequently asked questions about Azure Managed Disks and Azure Premium Storage.

## Managed Disks

**What is Managed Disks?**

Managed Disks is a feature that simplifies disk management for Azure IaaS VMs by handling storage account management for you. For more information, see the [Managed Disks overview](storage-managed-disks-overview.md).

**If I create a standard managed disk from an existing VHD that's 80 GB, how much will that cost me?**

A standard managed disk created from an 80-GB VHD is treated as the next available standard disk size, which is an S10 disk. You're charged according to the S10 disk pricing. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage).

**Are there any transaction costs for standard managed disks?**

Yes. You're charged for each transaction. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage).

**For a standard managed disk, will I be charged for the actual size of the data on the disk or for the provisioned capacity of the disk?**

You're charged based on the provisioned capacity of the disk. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage).

**How is pricing of premium managed disks different from unmanaged disks?**

The pricing of premium managed disks is the same as unmanaged premium disks.

**Can I change the storage account type (Standard or Premium) of my managed disks?**

Yes. You can change the storage account type of your managed disks by using the Azure portal, PowerShell, or the Azure CLI.

**Is there a way that I can copy or export a managed disk to a private storage account?**

Yes. You can export your managed disks by using the Azure portal, PowerShell, or the Azure CLI.

**Can I use a VHD file in an Azure storage account to create a managed disk with a different subscription?**

No

**Can I use a VHD file in an Azure storage account to create a managed disk in a different region?**

No

**Are there any scale limitations for customers that use managed disks?**

Managed Disks eliminates the limits associated with storage accounts. However, the number of managed disks per subscription is limited to 2,000 by default. This number can be increased by calling support.

**Can I take an incremental snapshot of a managed disk?**

No. The current snapshot capability makes a full copy of a managed disk. However, we are planning to support incremental snapshots in the future.

**Can VMs in an availability set consist of a combination of managed and unmanaged disks?**

No. The VMs in an availability set must use either all managed disks or all unmanaged disks. When you create an availability set, you can choose which type of disks you want to use.

**Is Managed Disks the default option in the Azure portal?**

Not currently, but it will become the default in the future.

**Can I create an empty managed disk?**

Yes. You can create an empty disk. A managed disk can be created independently of a VM, for example, without attaching it to a VM.

**What is the supported fault domain count for an availability set that uses Managed Disks?**

Depending on the region where the availability set that uses Managed Disks is located, the supported fault domain count is 2 or 3.

**How is the standard storage account for diagnostics set up?**

You set up a private storage account for VM diagnostics. In the future, we plan to switch diagnostics to Managed Disks as well.

**What kind of Role-Based Access Control support is available for Managed Disks?**

Managed Disks supports three key default roles:

* Owner: Can manage everything, including access

* Contributor: Can manage everything except access

* Reader: Can view everything, but can't make changes

**Is there a way that I can copy or export a managed disk to a private storage account?**

You can get a read-only shared access signature URI for the managed disk and use it to copy the contents to a private storage account or on-premises storage.

**Can I create a copy of my managed disk?**

Customers can take a snapshot of their managed disks and then use the snapshot to create another managed disk.

**Are unmanaged disks still supported?**

Yes. We support unmanaged and managed disks. We recommend that you use managed disks for new workloads and migrate your current workloads to managed disks.


**If I create a 128-GB disk and then increase the size to 130 GB, will I be charged for the next disk size (512 GB)?**

Yes

**Can I create LRS, GRS, and ZRS managed disks?**

Managed Disks currently supports only locally redundant storage (LRS).

**Can I shrink or downsize my managed disks?**
No. This feature is not supported currently. 

**Can I change the computer name property when a specialized (not created by using the System Preparation tool or generalized) operating system disk is used to provision a VM?**

No. You can't update the computer name property. The new VM inherits it from the parent VM, which was used to create the operating system disk. 

**Where can I find sample Azure Resource Manager templates to create VMs with managed disks?**
* [List of templates using Managed Disks](https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md)
* https://github.com/chagarw/MDPP

## Managed Disks and Storage Service Encryption 

**Is Azure Storage Service Encryption enabled by default when I create a managed disk?**

Yes

**Who manages the encryption keys?**

Keys are managed by Microsoft.

**Can I disable Storage Service Encryption for my managed disks?**

No

**Is Storage Service Encryption only available in specific regions?**

No. It's available in all the regions where Managed Disks are available. Managed Disks is available in all public regions and Germany.

**How can I find out if my managed disk is encrypted?**

You can find out the time when a managed disk was created from the Azure portal, the Azure CLI, and PowerShell. If the time is after June 9, 2017, then your disk is encrypted. 

**How can I encrypt my existing disks that were created before June 10, 2017?**

As of June 10, 2017, new data written to existing managed disks is automatically encrypted. We are also planning to encrypt existing data, and the encryption will happen asynchronously in the background. If you must encrypt existing data now, create a copy of your disk. New disks will be encrypted.

* [Copy managed disks by using the Azure CLI](https://docs.microsoft.com/en-us/azure/storage/scripts/storage-linux-cli-sample-copy-managed-disks-to-same-or-different-subscription?toc=%2fcli%2fmodule%2ftoc.json)

* [Copy managed disks by using PowerShell](https://docs.microsoft.com/en-us/azure/storage/scripts/storage-windows-powershell-sample-copy-managed-disks-to-same-or-different-subscription?toc=%2fcli%2fmodule%2ftoc.json)

**Are managed snapshots and images encrypted?**

Yes. All managed snapshots and images created after June 9, 2017, are automatically encrypted. 

**Can I convert VMs with unmanaged disks that are located on storage accounts that are or were previously encrypted to managed disks?**

No. This feature is not supported yet. It is expected to come out by the end of July. 

**Will an exported VHD from a managed disk or a snapshot also be encrypted?**

No. But if you export a VHD to an encrypted storage account from an encrypted managed disk or snapshot, then it's encrypted. 

## Premium disks: Managed and unmanaged

**If a VM uses a size series that supports Premium Storage, such as a DSv2, can I attach both premium and standard data disks?** 

Yes

**Can I attach both premium and standard data disks to a size series that doesn't support Premium Storage, such as D, Dv2, G, or F series?**

No. You can attach only standard data disks to VMs that don't use a size series that supports Premium Storage.

**If I create a premium data disk from an existing VHD that was 80 GB, how much will that cost?**

A premium data disk created from an 80-GB VHD is treated as the next-available premium disk size, which is a P10 disk. You're charged according to the P10 disk pricing.

**Are there transaction costs to use Premium Storage?**

There is a fixed cost for each disk size, which comes provisioned with specific limits on IOPS and throughput. The other costs are outbound bandwidth and snapshot capacity, if applicable. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage).

**What are the limits for IOPS and throughput that I can get from the disk cache?**

The combined limits for cache and local SSD for a DS series are 4,000 IOPS per core and 33 MB per second per core. The GS series offers 5,000 IOPS per core and 50 MB per second per core.

**Is the local SSD supported for a Managed Disks VM?**

The local SSD is temporary storage that is included with a Managed Disks VM. There is no extra cost for this temporary storage. We recommend that you do not use this local SSD to store your application data because it isn't persisted in Azure Blob storage.

**Are there any repercussions for the use of TRIM on premium disks?**

There is no downside to the use of TRIM on Azure disks on either premium or standard disks.

## New disk sizes: Managed and unmanaged

**What is the largest disk size supported for operating system and data disks?**

The partition type that Azure supports for an operating system disk is the master boot record (MBR). The MBR format supports a disk size up to 2 TB. The largest size that Azure supports for an operating system disk is 2 TB. Azure supports up to 4 TB for data disks. 

**What is the largest page blob size that's supported?**

The largest page blob size that Azure supports is 8 TB (8,191 GB). We don't support page blobs larger than 4 TB (4,095 GB) attached to a VM as data or operating system disks.

**Do I need to use a new version of Azure tools to create, attach, resize, and upload disks larger than 1 TB?**

You don't need to upgrade your existing Azure tools to create, attach, or resize disks larger than 1 TB. To upload your VHD file from on-premises directly to Azure as a page blob or unmanaged disk, you need to use the latest tool sets:

|Azure Tools      | Supported Versions                                |
|-----------------|---------------------------------------------------|
|PowerShell | Version number 4.1.0: June 2017 release or later|
|Azure CLI version 1     | Version number 0.10.13: May 2017 release or later|
|AzCopy	          | Version number 6.1.0: June 2017 release or later|

The support for Azure CLI version 2 and Azure Storage Explorer is coming soon. 

**Are P4 and P6 disk sizes supported for unmanaged disks or page blob?**

No. P4 (32 GB) and P6 (64 GB) disk sizes are supported only for managed disks. Support for unmanaged disks and page blob is coming soon.

**If my existing premium managed disk less than 64 GB was created before the small disk was enabled (around June 15, 2017), how is it billed?**

Existing small premium disks less than 64 GB continue to be billed according to the P10 pricing tier. 

**How can I switch the disk tier of small premium disks less than 64 GB from P10 to P4 or P6?**

You can take a snapshot of your small disks and then create a disk to automatically switch the pricing tier to P4 or P6 based on the provisioned size. 


## What if my question isn't answered here?

If your question isn't listed here, let us know so that we can help you find an answer. You can post a question at the end of this article in the comments. To engage with the Azure Storage team and other community members about this article, use the MSDN [Azure Storage forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazuredata).

To request features, submit your requests and ideas to the [Azure Storage feedback forum](https://feedback.azure.com/forums/217298-storage).
