---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/31/2019
 ms.author: rogarana
 ms.custom: include file
---



This article answers some frequently asked questions about Azure Managed Disks and Azure Premium SSD disks.

## Managed Disks

**What is Azure Managed Disks?**

Managed Disks is a feature that simplifies disk management for Azure IaaS VMs by handling storage account management for you. For more information, see the [Managed Disks overview](../articles/virtual-machines/windows/managed-disks-overview.md).

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

**Can I use a VHD file in an Azure storage account to create a managed disk with a different subscription?**

Yes.

**Can I use a VHD file in an Azure storage account to create a managed disk in a different region?**

No.

**Are there any scale limitations for customers that use managed disks?**

Managed Disks eliminates the limits associated with storage accounts. However, the maximum limit is 50,000 managed disks per region and per disk type for a subscription.

**Can VMs in an availability set consist of a combination of managed and unmanaged disks?**

No. The VMs in an availability set must use either all managed disks or all unmanaged disks. When you create an availability set, you can choose which type of disks you want to use.

**Is Managed Disks the default option in the Azure portal?**

Yes.

**Can I create an empty managed disk?**

Yes. You can create an empty disk. A managed disk can be created independently of a VM, for example, without attaching it to a VM.

**What is the supported fault domain count for an availability set that uses Managed Disks?**

Depending on the region where the availability set that uses Managed Disks is located, the supported fault domain count is 2 or 3.

**How is the standard storage account for diagnostics set up?**

You set up a private storage account for VM diagnostics.

**What kind of Role-Based Access Control support is available for Managed Disks?**

Managed Disks supports three key default roles:

* Owner: Can manage everything, including access
* Contributor: Can manage everything except access
* Reader: Can view everything, but can't make changes

**Is there a way that I can copy or export a managed disk to a private storage account?**

You can generate a read-only shared access signature (SAS) URI for the managed disk and use it to copy the contents to a private storage account or on-premises storage. You can use the SAS URI using the Azure portal, Azure PowerShell, the Azure CLI, or [AzCopy](../articles/storage/common/storage-use-azcopy.md)

**Can I create a copy of my managed disk?**

Customers can take a snapshot of their managed disks and then use the snapshot to create another managed disk.

**Are unmanaged disks still supported?**

Yes, both unmanaged and managed disks are supported. We recommend that you use managed disks for new workloads and migrate your current workloads to managed disks.

**Can I co-locate unmanaged and managed disks on the same VM?**

No.

**If I create a 128-GB disk and then increase the size to 130 gibibytes (GiB), will I be charged for the next disk size (256 GiB)?**

Yes.

**Can I create locally redundant storage, geo-redundant storage, and zone-redundant storage managed disks?**

Azure Managed Disks currently supports only locally redundant storage managed disks.

**Can I shrink or downsize my managed disks?**

No. This feature is not supported currently.

**Can I break a lease on my disk?**

No. This is not supported currently as a lease is present to prevent accidental deletion when the disk is being used.

**Can I change the computer name property when a specialized (not created by using the System Preparation tool or generalized) operating system disk is used to provision a VM?**

No. You can't update the computer name property. The new VM inherits it from the parent VM, which was used to create the operating system disk. 

**Where can I find sample Azure Resource Manager templates to create VMs with managed disks?**
* [List of templates using Managed Disks](https://github.com/Azure/azure-quickstart-templates/)
* https://github.com/chagarw/MDPP

**When creating a disk from a blob, is there any continually existing relationship with that source blob?**

No, when the new disk is created it is a full standalone copy of that blob at that time and there is no connection between the two. If you like, once you've created the disk, the source blob may be deleted without affecting the newly created disk in any way.

**Can I rename a managed or unmanaged disk after it has been created?**

For managed disks you cannot rename them. However, you may rename an unmanaged disk as long as it is not currently attached to a VHD or VM.

**Can I use GPT partitioning on an Azure Disk?**

Generation 1 images can only use GPT partitioning on data disks, not OS disks. OS disks must use the MBR partition style.

[Generation 2 images](https://docs.microsoft.com/azure/virtual-machines/linux/generation-2) can use GPT partitioning on the OS disk as well as the data disks.

**What disk types support snapshots?**

Premium SSD, standard SSD, and standard HDD support snapshots. For these three disk types, snapshots are supported for all disk sizes (including disks up to 32 TiB in size). Ultra disks do not support snapshots.

**What are Azure disk reservations?**
Disk reservation is the option to purchase one year of disk storage in advance, reducing your total cost. For details regarding Azure disk reservations, see our article on the subject: [Understand how your reservation discount is applied to Azure Disk](../articles/cost-management-billing/reservations/understand-disk-reservations.md).

**What options does Azure disk reservation offer?**    
Azure disk reservation provides the option to purchase Premium SSDs in the specified SKUs from P30 (1 TiB) up to P80 (32 TiB) for a one-year term. There is no limitation on the minimum amount of disks necessary to purchase a disk reservation. Additionally, you can choose to pay with a single, upfront payment or monthly payments. There is no additional transactional cost applied for Premium SSD Managed Disks.    

Reservations are made in the form of disks, not capacity. In other words, when you reserve a P80 (32 TiB) disk, you get a single P80 disk, you cannot then divide that specific reservation up into two smaller P70 (16 TiB) disks. You can, of course, reserve as many or as few disks as you like, including two separate P70 (16 TiB) disks.

**How is Azure disk reservation applied?**    
Disks reservation follows a model similar to reserved virtual machine (VM) instances. The difference being that a disk reservation cannot be applied to different SKUs, while a VM instance can. See [Save costs with Azure Reserved VM Instances](../articles/virtual-machines/linux/prepay-reserved-vm-instances.md) for more information on VM instances.     

**Can I use my data storage purchased through Azure disks reservation across multiple regions?**    
Azure disks reservation are purchased for a specific region and SKU (like P30 in East US 2), and therefore cannot be used outside these constructs. You can always purchase an additional Azure Disks Reservation for your disk storage needs in other regions or SKUs.    

**What happens when my Azure disks reservation expires?**    
You will receive email notifications 30 days prior to expiration and again on the expiration date. Once the reservation expires, deployed disks will continue to run and will be billed with the latest [pay-as-you-go rates](https://azure.microsoft.com/pricing/details/managed-disks/).

### Azure shared disks

**Is the shared disks feature supported for unmanaged disks or page blobs?**

No, it is only supported for premium SSD managed disks.

**What regions support shared disks?**

Currently only West Central US.

**Can shared disks be used as an OS disk?**

No, shared disks are only supported for data disks.

**What disk sizes support shared disks?**

Only premium SSDs that are P15 or greater support shared disks.

**If I have an existing premium SSD, can I enable shared disks on it?**

All managed disks created with API version 2019-07-01 or higher can enable shared disks. To do this, you need to unmount the disk from all VMs that it is attached to. Next, edit the `maxShares` property on the disk.

**If I no longer want to use a disk in shared mode, how do I disable it?**

Unmount the disk from all VMs that it is attached to. Then edit the maxShare property on the disk to 1.

**Can you resize a shared disk?**

Yes.

**Can I enable write accelerator on a disk that also has shared disks enabled?**

No.

**Can I enable host caching for a disk that has shared disk enabled?**

The only supported host caching option is 'None'.

## Ultra disks

**What should I set my ultra disk throughput to?**
If you are unsure what to set your disk throughput to, we recommend you start by assuming an IO size of 16 KiB and adjust the performance from there as you monitor your application. The formula is: Throughput in MBps = # of IOPS * 16 / 1000.

**I configured my disk to 40000 IOPS but I'm only seeing 12800 IOPS, why am I not seeing the performance of the disk?**
In addition to the disk throttle, there is an IO throttle that gets imposed at the VM level. Please ensure that the VM size you are using can support the levels that are configured on your disks. For details regarding IO limits imposed by your VM, see [Sizes for Windows virtual machines in Azure](../articles/virtual-machines/windows/sizes.md).

**Can I use caching levels with an ultra disk?**
No, ultra disks do not support the different caching methods that are supported on other disk types. Set the disk caching to None.

**Can I attach an ultra disk to my existing VM?**
Maybe, your VM has to be in a region and availability zone pair that supports Ultra disks. See [getting started with ultra disks](../articles/virtual-machines/windows/disks-enable-ultra-ssd.md) for details.

**Can I use an ultra disk as the OS disk for my VM?**
No, ultra Disks are only supported as data disks and are only supported as 4K native disks.

**Can I convert an existing disk to an ultra disk?**
No, but you can migrate the data from an existing disk to an ultra disk. To migrate an existing disk to an ultra Disk, attach both disks to the same VM, and copy the disk's data from one disk to the other or leverage a 3rd party solution for data migration.

**Can I create snapshots for ultra disks?**
No, snapshots are not yet available.

**Is Azure Backup available for ultra disks?**
No, Azure Backup support is not yet available.

**Can I attach an ultra disk to a VM running in an availability set?**
No, this is not yet supported.

**Can I enable Azure Site Recovery for VMs using ultra disks?**
No, Azure Site Recovery is not yet supported for ultra disks.

## Uploading to a managed disk

**Can I upload data to an existing managed disk?**

No, upload can only be used during the creation of a new empty disk with the **ReadyToUpload** state.

**How do I upload to a managed disk?**

Create a managed disk with the [createOption](https://docs.microsoft.com/rest/api/compute/disks/createorupdate#diskcreateoption) property of [creationData](https://docs.microsoft.com/rest/api/compute/disks/createorupdate#creationdata) set to "Upload", then you can upload data to it.

**Can I attach a disk to a VM while it is in an upload state?**

No.

**Can I take a snapshot of a manged disk in an upload state?**

No.

## Standard SSD disks

**What are Azure Standard SSD disks?**
Standard SSD disks are standard disks backed by solid-state media, optimized as cost effective storage for workloads that need consistent performance at lower IOPS levels.

<a id="standard-ssds-azure-regions"></a>**What are the regions currently supported for Standard SSD disks?**
All Azure regions now support Standard SSD disks.

**Is Azure Backup available when using Standard SSDs?**
Yes, Azure Backup is now available.

**What is the benefit of using Standard SSD disks instead of HDD?**
Standard SSD disks deliver better latency, consistency, availability, and reliability compared to HDD disks. Application workloads run a lot more smoothly on Standard SSD because of that. Note, Premium SSD disks are the recommended solution for most IO-intensive production workloads.

**Can I use Standard SSDs as Unmanaged Disks?**
No, Standard SSDs disks are only available as Managed Disks.

**Do Standard SSD Disks support "single instance VM SLA"?**
No, Standard SSDs do not have single instance VM SLA. Use Premium SSD disks for single instance VM SLA.

## Migrate to Managed Disks

**Is there any impact of migration on the Managed Disks performance?**

Migration involves movement of the Disk from one Storage location to another. This is orchestrated via background copy of data, which can take several hours to complete, typically less than 24 Hrs depending on the amount of data in the disks. During that time your application can experience higher than usual read latency as some reads can get redirected to the original location, and can take longer to complete. There is no impact on write latency during this period.  

**What changes are required in a pre-existing Azure Backup service configuration prior/after migration to Managed Disks?**

No changes are required.

**Will my VM backups created via Azure Backup service before the migration continue to work?**

Yes, backups work seamlessly.

**What changes are required in a pre-existing Azure Disks Encryption configuration prior/after migration to Managed Disks?**

No changes are required.

**Is automated migration of an existing virtual machine scale set from unmanaged disks to Managed Disks supported?**

No. You can create a new scale set with Managed Disks using the image from your old scale set with unmanaged disks.

**Can I create a Managed Disk from a page blob snapshot taken before migrating to Managed Disks?**

No. You can export a page blob snapshot as a page blob and then create a Managed Disk from the exported page blob.

**Can I fail over my on-premises machines protected by Azure Site Recovery to a VM with Managed Disks?**

Yes, you can choose to failover to a VM with Managed Disks.

**Is there any impact of migration on Azure VMs protected by Azure Site Recovery via Azure to Azure replication?**

No. Azure Site Recovery Azure to Azure protection for VMs with Managed Disks is available.

**Can I migrate VMs with unmanaged disks that are located on storage accounts that are or were previously encrypted to managed disks?**

Yes

## Managed Disks and Storage Service Encryption

**Is Server-side Encryption enabled by default when I create a managed disk?**

Yes. Managed Disks are encrypted with server-side encryption with platform managed keys. 

**Is the boot volume encrypted by default on a managed disk?**

Yes. By default, all managed disks are encrypted, including the OS disk.

**Who manages the encryption keys?**

Platform managed keys are managed by Microsoft. You can also use and manage your own keys stored in Azure Key Vault. 

**Can I disable Server-side Encryption for my managed disks?**

No.

**Is Server-side Encryption only available in specific regions?**

No. Server-side Encryption with both platform and customer managed keys are available in all the regions where Managed Disks are available. 

**Does Azure Site Recovery support server-side encryption with customer-managed key for on-premises to Azure and Azure to Azure disaster recovery scenarios?**

Yes. 

**Can I backup Managed Disks encrypted with server-side encryption with customer-managed key using Azure Backup service?**

Yes.

**Are managed snapshots and images encrypted?**

Yes. All managed snapshots and images are automatically encrypted. 

**Can I convert VMs with unmanaged disks that are located on storage accounts that are or were previously encrypted to managed disks?**

Yes

**Will an exported VHD from a managed disk or a snapshot also be encrypted?**

No. But if you export a VHD to an encrypted storage account from an encrypted managed disk or snapshot, then it's encrypted. 

## Premium disks: Managed and unmanaged

**If a VM uses a size series that supports Premium SSD disks, such as a DSv2, can I attach both premium and standard data disks?** 

Yes.

**Can I attach both premium and standard data disks to a size series that doesn't support Premium SSD disks, such as D, Dv2, G, or F series?**

No. You can attach only standard data disks to VMs that don't use a size series that supports Premium SSD disks.

**If I create a premium data disk from an existing VHD that was 80 GB, how much will that cost?**

A premium data disk created from an 80-GB VHD is treated as the next-available premium disk size, which is a P10 disk. You're charged according to the P10 disk pricing.

**Are there transaction costs to use Premium SSD disks?**

There is a fixed cost for each disk size, which comes provisioned with specific limits on IOPS and throughput. The other costs are outbound bandwidth and snapshot capacity, if applicable. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/storage).

**What are the limits for IOPS and throughput that I can get from the disk cache?**

The combined limits for cache and local SSD for a DS series are 4,000 IOPS per core and 33 MiB per second per core. The GS series offers 5,000 IOPS per core and 50 MiB per second per core.

**Is the local SSD supported for a Managed Disks VM?**

The local SSD is temporary storage that is included with a Managed Disks VM. There is no extra cost for this temporary storage. We recommend that you do not use this local SSD to store your application data because it isn't persisted in Azure Blob storage.

**Are there any repercussions for the use of TRIM on premium disks?**

There is no downside to the use of TRIM on Azure disks on either premium or standard disks.

## New disk sizes: Managed and unmanaged

**What regions support bursting capability for applicable premium SSD disk size?**

The bursting capability is currently supported in all regions in Azure Public Cloud, with support for sovereign clouds coming soon. 

**What regions are 4/8/16 GiB Managed Disk sizes (P1/P2/P3, E1/E2/E3) supported in?**

These new disk sizes are currently supported in all regions in Azure Public Cloud, with support for sovereign clouds coming soon. 

**Are P1/P2/P3 disk sizes supported for unmanaged disks or page blobs?**

No, it is only supported on premium SSD managed disks. 

**Are E1/E2/E3 disk sizes supported for unmanaged disks or page blobs?**

No, standard SSD managed disks of any size cannot be used with unmanaged disks or page blobs.

**What is the largest Managed disk size supported for operating system and data disks?**

The partition type that Azure supports for an operating system disk is the master boot record (MBR). The MBR format supports a disk size up to 2 TiB. The largest size that Azure supports for an operating system disk is 2 TiB. Azure supports up to 32 TiB for managed data disks.

**What is the largest Unmanaged Disk size supported for operating system and data disks?**

The partition type that Azure supports for an operating system disk is the master boot record (MBR). The MBR format supports a disk size up to 2 TiB. The largest size that Azure supports for an operating system Unmanaged disk is 2 TiB. Azure supports up to 4 TiB for data Unmanaged disks.

**What is the largest page blob size that's supported?**

The largest page blob size that Azure supports is 8 TiB (8,191 GiB). The maximum page blob size when attached to a VM as data or operating system disks is 4 TiB (4,095 GiB).

**Do I need to use a new version of Azure tools to create, attach, resize, and upload disks larger than 1 TiB?**

You don't need to upgrade your existing Azure tools to create, attach, or resize disks larger than 1 TiB. To upload your VHD file from on-premises directly to Azure as a page blob or unmanaged disk, you need to use the latest tool sets listed below. We only support VHD uploads of up to 8 TiB.

|Azure tools      | Supported versions                                |
|-----------------|---------------------------------------------------|
|Azure PowerShell | Version number 4.1.0: June 2017 release or later|
|Azure CLI v1     | Version number 0.10.13: May 2017 release or later|
|Azure CLI v2     | Version number 2.0.12: July 2017 release or later|
|AzCopy              | Version number 6.1.0: June 2017 release or later|

**Are P4 and P6 disk sizes supported for unmanaged disks or page blobs?**

P4 (32 GiB) and P6 (64 GiB) disk sizes are not supported as the default disk tiers for unmanaged disks and page blobs. You need to explicitly [set the Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) to P4 and P6 to have your disk mapped to these tiers. If you deploy a unmanaged disk or page blob with the disk size or content length less than 32 GiB or between 32 GiB to 64 GiB without setting the Blob Tier, you will continue to land on P10 with 500 IOPS and 100 MiB/s and the mapped pricing tier.

**If my existing premium managed disk less than 64 GiB was created before the small disk was enabled (around June 15, 2017), how is it billed?**

Existing small premium disks less than 64 GiB continue to be billed according to the P10 pricing tier.

**How can I switch the disk tier of small premium disks less than 64 GiB from P10 to P4 or P6?**

You can take a snapshot of your small disks and then create a disk to automatically switch the pricing tier to P4 or P6 based on the provisioned size.

**Can you resize existing Managed Disks from sizes fewer than 4 tebibytes (TiB) to new newly introduced disk sizes up to 32 TiB?**

Yes.

**What are the largest disk sizes supported by Azure Backup and Azure Site Recovery service?**

The largest disk size supported by Azure Backup is 32 TiB (4 TiB for encrypted disks). The largest disk size supported by Azure Site Recovery is 8 TiB. Support for the larger disks up to 32 TiB is not yet available in Azure Site Recovery.

**What are the recommended VM sizes for larger disk sizes (>4 TiB) for Standard SSD and Standard HDD disks to achieve optimized disk IOPS and Bandwidth?**

To achieve the disk throughput of Standard SSD and Standard HDD large disk sizes (>4 TiB) beyond 500 IOPS and 60 MiB/s, we recommend you deploy a new VM from one of the following VM sizes to optimize your performance: B-series, DSv2-series, Dsv3-Series, ESv3-Series, Fs-series, Fsv2-series, M-series, GS-series, NCv2-series, NCv3-series, or Ls-series VMs. Attaching large disks to existing VMs or VMs that are not using the recommended sizes above may experience lower performance.

**How can I upgrade my disks (>4 TiB) which were deployed during the larger disk sizes preview in order to get the higher IOPS & bandwidth at GA?**

You can either stop and start the VM that the disk is attached to or, detach and re-attach your disk. The performance targets of larger disk sizes have been increased for both premium SSDs and standard SSDs at GA.

**What regions are the managed disk sizes of 8 TiB, 16 TiB, and 32 TiB supported in?**

The 8 TiB, 16 TiB, and 32 TiB disk SKUs are supported in all regions under global Azure, Microsoft Azure Government, and Azure China 21Vianet.

**Do we support enabling Host Caching on all disk sizes?**

We support Host Caching of ReadOnly and Read/Write on disk sizes less than 4 TiB. For disk sizes more than 4 TiB, we don't support setting caching option other than None. We recommend leveraging caching for smaller disk sizes where you can expect to observe better performance boost with data cached to the VM.

## What if my question isn't answered here?

If your question isn't listed here, let us know and we'll help you find an answer. You can post a question at the end of this article in the comments. To engage with the Azure Storage team and other community members about this article, use the MSDN [Microsoft Q&A question page for Azure Storage](https://docs.microsoft.com/answers/products/azure?product=storage).

To request features, submit your requests and ideas to the [Azure Storage feedback forum](https://feedback.azure.com/forums/217298-storage).
