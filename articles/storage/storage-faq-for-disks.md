---
title: 'Frequently Asked Questions (FAQ) about Azure IaaS VM Disks | Microsoft Docs'
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
# Frequently Asked Questions about Azure IaaS VM Disks and managed and unmanaged premium disks

In this article, we'll visit some of the frequently asked questions about Managed Disks and Premium Storage.

## Managed Disks

**What is Azure Managed Disks?**

Managed Disks is a feature that simplifies disk management for Azure IaaS VMs by handling storage account management for you. For more information, please see the [Managed Disks Overview](storage-managed-disks-overview.md).

**If I create a standard managed disk from an existing VHD that was 80 GB in size, how much will that cost me?**

A standard managed disk created from an 80 GB VHD will be treated as the next available standard disk size, which is an S10 disk. You will be charged as per the S10 disk pricing. Please check the [pricing page](https://azure.microsoft.com/pricing/details/storage) for details.

**Are there any transaction costs for standard managed disks?**

Yes, you are charged for each transaction. Please check the [pricing page] (https://azure.microsoft.com/pricing/details/storage) for details.

**For a standard managed disk, will I be charged for the actual size of the data on the disk or for the provisioned capacity of the disk?**

You are charged based on the provisioned capacity of the disk. Please check the [pricing page](https://azure.microsoft.com/pricing/details/storage) for details.

**How is pricing of premium managed disks different than unmanaged disks?**

The pricing of premium managed disks is the same as unmanaged premium disks.

**Can I change the storage account type (Standard/Premium) of my managed disks?**

Yes. You can change the storage account type of your managed disks using the Azure portal, PowerShell, or the Azure CLI.

**Is there a way I can copy or export a managed disk to a private storage account?**

Yes, you can export your managed disks using the Azure portal, PowerShell, or the Azure CLI.

**Can I use a VHD file in an Azure storage account to create a managed disk in a different subscriptions?**

No.

**Can I use a VHD file in an Azure storage account to create a managed disk in a different region?**

No.

**Will there be any scale limitations for customers using managed disks?**

Managed Disks eliminates the limits associated with storage accounts. However, the number of managed disks per subscription is limited to 2000 by default. This can be increased by calling support.

**Can I take an incremental snapshot of a managed disk?**

No. The current Snapshot capability makes a full copy of a managed disk. However, we are planning to support incremental snapshots in the future.

**Can VMs in an Availability Set consist of a mixture of managed and unmanaged disks?**

No, the VMs in an Availability Set must use either all managed or all unmanaged disks. When creating an Availability Set, you can choose which type of disks you want to use.

**Is Managed Disks the default option in the Azure portal?**

Not currently, but it will become the default in the future.


**Can I create an empty managed disk?**

Yes, you can create an empty disk. A managed disk can be created independently of a VM, i.e., without attaching it to a VM.

**What is the supported fault domain count for Availability Sets using Managed Disks?**

The supported fault domain count is 2 or 3 for Availability Sets using Managed Disks depending on the region in which it is located.

**How is the standard storage account for diagnostics set up?**

You set up a private storage account for VM diagnostics. In the future, we plan to switch diagnostics to Managed Disks as well.

**What kind of RBAC support do we have for Managed Disks?**
Managed Disks supports three key default roles:

1.  Owner: Can manage everything, including access.

2.  Contributor: Can manage everything except access.

3.  Reader: Can view everything, but can't make changes.

**Is there a way I can copy or export a managed disk to a private storage account?**

You can get a read-only shared access signature (SAS) URI for the managed disk and use it to copy the contents to a private storage account or on-premises storage.

**Can I create a copy of my managed disk?**

Customers can take a snapshot of their managed disks and then use the snapshot to create another managed disk.

**Is unmanaged disks still supported?**

Yes, we support both managed and unmanaged disks. However, we recommend you start using managed disks for new workloads and migrate your current workloads to Managed Disks.


**If I create a disk of size 128 GB and then increase the size to 130 GB will I be charged for the next disk size (512 GB)?**

Yes.

**Can I create the LRS, GRS, and ZRS Managed Disks?**

Azure Managed Disks currently only supports locally-redundant storage (LRS).

**Can I shrink/downsize my Managed Disks?**
No. This feature is not supported currently. 

**Can I change the computer name property when using a specialized (not sysprepped or generalized) OS disk to provision a VM**
No. You cannot update computer name property. New VM will inherit it from the parent VM which was used to create the OS disk. 

**Where can I find sample Azure resource manager templates to create VMs with Managed Disks**
* https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md
* https://github.com/chagarw/MDPP

## Managed Disks and Storage service encryption (SSE)

**Is SSE enabled by default when I create a Managed Disk?**

Yes

**Who manages the encryption keys?**

Keys are managed by Microsoft.

**Can I disable SSE for my Managed Disks?**

No

**Is SSE available in only specific regions?**

No. It is available in all the regions where Managed Disks are available. Managed Disks is available in all public regions and Germany regions.

**How can I find if my Managed Disk is encrypted?**

You can find created time of Managed Disks from Azure portal, CLI and PowerShell. If created time is greater than June 9th, 2017 then your disks are encrypted. 

**How can I encrypt my existing disks created before June 10th, 2017?**

Starting June 10th 2017, new data written to existing Managed Disks will be automatically encrypted. We are also planning to encrypt existing data as well and the encryption will happen asynchronously in the background. If you must encrypt existing data now, then a workaround is to create copy of your disks. New Disks will be encrypted.

[Copy Managed Disks using CLI](https://docs.microsoft.com/en-us/azure/storage/scripts/storage-linux-cli-sample-copy-managed-disks-to-same-or-different-subscription?toc=%2fcli%2fmodule%2ftoc.json)

[Copy Managed Disks using PowerShell](https://docs.microsoft.com/en-us/azure/storage/scripts/storage-windows-powershell-sample-copy-managed-disks-to-same-or-different-subscription?toc=%2fcli%2fmodule%2ftoc.json)

**Are managed snapshots and images encrypted?**

Yes. All managed snapshots and images created after June 9th, 2017 are automatically encrypted. 

**Can I convert VMs with unmanaged disks that are located on storage accounts that are or have previously been encrypted to managed disks?

No. This feature is not supported yet. It is expected to come out by end of July. 

**Will an exported VHD from a Managed Disk or a snapshot also be encrypted?**

No. But if you export a VHD to an encrypted storage account from an encrypted Managed Disk or snapshot then it will be encrypted. 


## Managed Disks and port 8443

**Why do customers have to unblock outbound traffic on port 8443 for VMs using Azure Managed Disks?**
The Azure VM Agent uses port 8443 to report the status of each VM extension to the Azure platform. Without this port being unblocked, the VM agent won't be able to report the status of any VM extension. For more information about the VM agent, please see [Azure Virtual Machine Agent overview](../virtual-machines/windows/agent-user-guide.md).

**What happens if a VM is deployed with extensions and the port is not unblocked?**

The deployment will result in an error. 

**What happens if a VM is deployed with no extensions and the port is not unblocked?**

There will be no impact on the deployment. 

**What happens if an extension is installed on a VM which is already provisioned and running and the VM does not have port 8443 unblocked?**

The extension won't be successfully deployed. The status of the extension will be unknown. 

**What happens if an Azure resource manager template is used to provision multiple VMs with port 8443 blocked -- one VM with extensions and a second VM dependent on the first VM?**

The first VM will show as a failed deployment because the extensions were not successfully deployed. The second VM will not be deployed. 

**Will this requirement of the port being unblocked apply to all VM extensions?**

Yes.

**Do both inbound and outbound connections on port 8443 have to be unblocked?**

No. Only outbound connections on port 8443 have to be unblocked. 

**Is having outbound connections on port 8443 being unblocked required for the entire lifetime of the VM?**

Yes.

**Does having this port unblocked affect the performance of the VM?**

No.

**Is there an estimated date for this issue to be fixed so I no longer have to unblock port 8443?**

Yes, by the end of June 2017.

## Premium Disks – both managed and unmanaged

**If a VM uses a size series that supports Premium storage, such as a DSv2, can I attach both premium and standard data disks?** 

Yes.

**Can I attach both premium and standard data disks to a size series that does not support Premium storage, such as D, Dv2, G or F series?**

No. You can only attach standard data disks to VMs that do not use a size series that supports Premium storage.

**If I create a premium data disk from an existing VHD that was 80 GB in size, how much will that cost me?**

A premium data disk created from 80 GB VHD will be treated as the next available premium disk size, which is a P10 disk. You will be charged as per the P10 disk pricing.

**Are there transaction costs when using Premium Storage?**

There is a fixed cost for each disk size which comes provisioned with specific limits on IOPS and throughput. The other costs are outbound bandwidth and snapshot capacity, if applicable. Please check the [pricing page](https://azure.microsoft.com/pricing/details/storage) for details.

**What are the limits for IOPS and throughput that can I get from the disk cache?**

The combined limits for cache and local SSD for a DS series are 4000 IOPS per core and 33 MB per second per core. The GS series offers 5000 IOPS per core and 50 MB per second per core.

**Is the local SSD supported for Managed Disks VMs?**

The local SSD is temporary storage that is included with a managed disks VM. There is no extra cost for this temporary storage. It is recommended that you do not use this local SSD for storing your application data as it is not persisted in Azure Blob storage.

**Is there any repercurssions on using TRIM on Premium Disks?**

There is no downside of using TRIM on Azure Disks on either Premium or Standard Disks.

## New Disk Sizes - both managed and unmanaged

**What is the largest disk size supported for OS and Data Disks?**

The partition type Azure supports for OS Disks is MBR(Master Boot Record). The MBR format supports up to 2TB disk size. So the largest OS Disks Azure support is 2TB. For Data Disks, Azure supports up to 4TB. 

**What is the largest page blob size supported?**

The largest page blob size Azure supports is 8TB (8191GB). We don't support attaching any page blobs larger than 4TB (4095GB) to a VM as Data or OS disks.

**Do I need to use a new version of Azure tools to create, attach, resize and upload disks larger than 1TB?**

You do not need to upgrade your existing Azure tools to create, attach, or resize disks larger than 1TB. If you would like to directly upload your VHD file from on-premises to Azure as a page blob/unManaged Disks. You would need to pick up the latest toolsets listed below.

|Azure Tools      | Supported Versions                                |
|-----------------|---------------------------------------------------|
|Azure Powershell | Version number v4.1.0 – June 2017 Release or above|
|Azure CLI v1     | Version number 0.10.13 – May 2017 Release or above|
|AzCopy	          | Version number v6.1.0 – June 2017 Release or above|

The support for Azure CLI v2 and Storage Explorer is coming soon. 

**Are P4 and P6 disk sizes supported for unmanaged Disks or Page Blob?**

No, P4(32GB) and P6(64GB) disk sizes are only supported for Managed Disks. The support for unmanged Disks and Page Blob is coming soon.

**How is my existing Premium Managed disks with size less than 64 GB that is created before small disk is enabled (Around June 15th) billed?**

Existing small Premium disks with size less than 64 GB will continue be billed as per P10 pricing tier. 

**How can I switch the disk tier of small Premium Disks with size less than 64 GB from P10 to P4 or P6?**

You can take a snapshot of your small disks and then create a disk which will automatically switch the pricing tier to P4 or P6 based on the provisioned size. 


## What if my question isn't answered here?

If your question isn't listed here, let us know and we'll help you find an answer. You can post a question at the end of this article in the comments or in the MSDN [Azure Storage forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazuredata) to engage with the Azure Storage team and other community members about this article.

To make a feature request, please submit your requests and ideas to the [Azure Storage feedback forum](https://feedback.azure.com/forums/217298-storage).
