---
title: Storage FSLogix profile container Windows Virtual Desktop - Azure
description: Options for storing your Windows Virtual Desktop FSLogix profile on Azure Storage.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: helohr
manager: lizross
---
# Storage options for FSLogix profile containers in Windows Virtual Desktop

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article compares storage solutions that Azure offers for Windows Virtual Desktop FSLogix user profile containers.

Windows Virtual Desktop offers FSLogix profile containers as the recommended user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. At sign-in, this container is dynamically attached to the computing environment using a natively supported Virtual Hard Disk (VHD) and a Hyper-V Virtual Hard Disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

The following tables compare the storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

## Azure platform details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Use case|General purpose|Ultra performance or migration from NetApp on-premises|Cross-platform|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|All regions|[Select regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all)|All regions|
|Redundancy|Locally redundant/zone-redundant/geo-redundant|Locally redundant|Locally redundant/zone-redundant/geo-redundant|
|Tiers and performance|Standard<br>Premium<br>Up to max 100k IOPS per share with 5 GBps per share at about 3 ms latency|Standard<br>Premium<br>Ultra<br>Up to 320k (16K) IOPS with 4.5 GBps per volume at about 1 ms latency|Standard HDD: up to 500 IOPS per-disk limits<br>Standard SSD: up to 4k IOPS per-disk limits<br>Premium SSD: up to 20k IOPS per-disk limits<br>We recommend Premium disks for Storage Spaces Direct|
|Capacity|100 TiB per share|100 TiB per volume, up to 12.5 PiB per subscription|Maximum 32 TiB per disk|
|Required infrastructure|Minimum share size 1 GiB|Minimum capacity pool 4 TiB, min volume size 100 GiB|Two VMs on Azure IaaS (+ Cloud Witness) or at least three VMs without and costs for disks|
|Protocols|SMB 2.1/3. and REST|NFSv3, NFSv4.1 (preview), SMB 3.x/2.x|NFSv3, NFSv4.1, SMB 3.1|

## Azure management details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, on-premises (via ExpressRoute)|Cloud, on-premises|
|Backup|Azure backup snapshot integration|Azure NetApp Files snapshots|Azure backup snapshot integration|
|Security and compliance|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|ISO completed|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|
|Azure Active Directory integration|[Native Active Directory and Azure Active Directory Domain Services](https://docs.microsoft.com/azure/storage/files/storage-files-active-directory-overview)|[Azure Active Directory Domain Services and Native Active Directory](../azure-netapp-files/azure-netapp-files-faqs.md#does-azure-netapp-files-support-azure-active-directory)|Native Active Directory or Azure Active Directory Domain Services support only|

Once you've chosen your storage method, check out [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for information about our pricing plans.

## Azure Files tiers
Azure Files offers two different tiers of storage, premium and standard, to allow you to tailor your shares to the performance and price requirements of your scenario:

•	Premium file shares: Premium file shares are backed by solid-state drives (SSDs) and are deployed in the FileStorage storage account type. Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. 

•	Standard file shares: Standard file shares are backed by hard disk drives (HDDs) and are deployed in the general purpose version 2 (GPv2) storage account type. Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.

Depends on the target performance, cost and regional considerations, you can select the most appropriate performance tier for storing the user profile data. We have included our recommendation based on the performance of the typical [remote desktop workloads types](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/remote-desktop-workloads). 

|Workload type|File Tiers|
|--------|-----------|
|Light|Less than 200 concurrent active users: Standard file shares|
| |More than 200 concurrent active users: Standard file shares. You may also consider using Standard file shares with multiple shares if you are scaling up from existing Standard file shares or plan to manage scale out for cost efficiency.|
|Medium|Premium file shares|
|Heavy|Premium file shares|
|Power|Premium file shares|

You can leverage the guidance above and further optimize for your WVD scenario. Detailed information of Azure Files on performance targets ([Standard](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-scale-targets#file-share-and-file-scale-targets), [Premium](https://docs.microsoft.com/azure/storage/files/storage-files-planning#understanding-provisioning-for-premium-file-shares)) and [pricing](https://azure.microsoft.com/pricing/details/storage/files/) is available to help you further fine tune the file share solution.

## Next steps

To learn more about FSLogix profile containers, user profile disks, and other user profile technologies, see the table in [FSLogix profile containers and Azure files](fslogix-containers-azure-files.md).

If you're ready to create your own FSLogix profile containers, get started with one of these tutorials:

- [Getting started with FSLogix profile containers on Azure Files in Windows Virtual Desktop](https://techcommunity.microsoft.com/t5/Windows-IT-Pro-Blog/Getting-started-with-FSLogix-profile-containers-on-Azure-Files/ba-p/746477)
- [Create an FSLogix profile container for a host pool using Azure NetApp files](create-fslogix-profile-container.md)
- The instructions in [Deploy a two-node Storage Spaces Direct scale-out file server for UPD storage in Azure](/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment/) also apply when you use an FSLogix profile container instead of a user profile disk

You can also start from the very beginning and set up your own Windows Virtual Desktop solution at [Create a tenant in Windows Virtual Desktop](tenant-setup-azure-active-directory.md).
