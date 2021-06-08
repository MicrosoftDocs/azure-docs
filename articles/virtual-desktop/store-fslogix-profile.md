---
title: Storage FSLogix profile container Azure Virtual Desktop - Azure
description: Options for storing your Azure Virtual Desktop FSLogix profile on Azure Storage.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: helohr
manager: femila
---
# Storage options for FSLogix profile containers in Azure Virtual Desktop

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article compares storage solutions that Azure offers for Azure Virtual Desktop FSLogix user profile containers. We recommend storing FSLogix profile containers on Azure Files for most of our customers.

Azure Virtual Desktop offers FSLogix profile containers as the recommended user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Azure Virtual Desktop. At sign-in, this container is dynamically attached to the computing environment using a natively supported Virtual Hard Disk (VHD) and a Hyper-V Virtual Hard Disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

The following tables compare the storage solutions Azure Storage offers for Azure Virtual Desktop FSLogix profile container user profiles.

## Azure platform details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Use case|General purpose|Ultra performance or migration from NetApp on-premises|Cross-platform|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|All regions|[Select regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all)|All regions|
|Redundancy|Locally redundant/zone-redundant/geo-redundant/geo-zone-redundant|Locally redundant|Locally redundant/zone-redundant/geo-redundant|
|Tiers and performance| Standard (Transaction optimized)<br>Premium<br>Up to max 100K IOPS per share with 10 GBps per share at about 3 ms latency|Standard<br>Premium<br>Ultra<br>Up to 4.5GBps per volume at about 1 ms latency. For IOPS and performance details, see [Azure NetApp Files performance considerations](../azure-netapp-files/azure-netapp-files-performance-considerations.md) and [the FAQ](../azure-netapp-files/azure-netapp-files-faqs.md#how-do-i-convert-throughput-based-service-levels-of-azure-netapp-files-to-iops).|Standard HDD: up to 500 IOPS per-disk limits<br>Standard SSD: up to 4k IOPS per-disk limits<br>Premium SSD: up to 20k IOPS per-disk limits<br>We recommend Premium disks for Storage Spaces Direct|
|Capacity|100 TiB per share, Up to 5 PiB per general purpose account |100 TiB per volume, up to 12.5 PiB per subscription|Maximum 32 TiB per disk|
|Required infrastructure|Minimum share size 1 GiB|Minimum capacity pool 4 TiB, min volume size 100 GiB|Two VMs on Azure IaaS (+ Cloud Witness) or at least three VMs without and costs for disks|
|Protocols|SMB 3.0/2.1, NFSv4.1 (preview), REST|NFSv3, NFSv4.1 (preview), SMB 3.x/2.x|NFSv3, NFSv4.1, SMB 3.1|

## Azure management details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, on-premises (via ExpressRoute)|Cloud, on-premises|
|Backup|Azure backup snapshot integration|Azure NetApp Files snapshots|Azure backup snapshot integration|
|Security and compliance|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|ISO completed|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|
|Azure Active Directory integration|[Native Active Directory and Azure Active Directory Domain Services](../storage/files/storage-files-active-directory-overview.md)|[Azure Active Directory Domain Services and Native Active Directory](../azure-netapp-files/azure-netapp-files-faqs.md#does-azure-netapp-files-support-azure-active-directory)|Native Active Directory or Azure Active Directory Domain Services support only|

Once you've chosen your storage method, check out [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for information about our pricing plans.

## Azure Files tiers

Azure Files offers two different tiers of storage: premium and standard. These tiers let you tailor the performance and cost of your file shares to meet your scenario's requirements.

- Premium file shares are backed by solid-state drives (SSDs) and are deployed in the FileStorage storage account type. Premium file shares provide consistent high performance and low latency for input and output (IO) intensive workloads. 

- Standard file shares are backed by hard disk drives (HDDs) and are deployed in the general purpose version 2 (GPv2) storage account type. Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability, such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.

The following table lists our recommendations for which performance tier to use based on your workload. These recommendations will help you select the performance tier that meets your performance targets, budget, and regional considerations. We've based these recommendations on the example scenarios from [Remote Desktop workload types](/windows-server/remote/remote-desktop-services/remote-desktop-workloads). 

| Workload type | Recommended file tier |
|--------|-----------|
| Light (fewer than 200 users) | Standard file shares |
| Light (more than 200 users) | Premium file shares or standard with multiple file shares |
|Medium|Premium file shares|
|Heavy|Premium file shares|
|Power|Premium file shares|

For more information about Azure Files performance, see [File share and file scale targets](../storage/files/storage-files-scale-targets.md#azure-files-scale-targets). For more information about pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

## Next steps

To learn more about FSLogix profile containers, user profile disks, and other user profile technologies, see the table in [FSLogix profile containers and Azure files](fslogix-containers-azure-files.md).

If you're ready to create your own FSLogix profile containers, get started with one of these tutorials:

- [Getting started with FSLogix profile containers on Azure Files in Azure Virtual Desktop](create-file-share.md)
- [Create an FSLogix profile container for a host pool using Azure NetApp files](create-fslogix-profile-container.md)
- The instructions in [Deploy a two-node Storage Spaces Direct scale-out file server for UPD storage in Azure](/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment/) also apply when you use an FSLogix profile container instead of a user profile disk

You can also start from the very beginning and set up your own Azure Virtual Desktop solution at [Create a tenant in Azure Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md).
