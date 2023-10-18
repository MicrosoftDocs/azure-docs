---
title: Storage FSLogix profile container Azure Virtual Desktop - Azure
description: Options for storing your Azure Virtual Desktop FSLogix profile on Azure Storage.
author: Heidilohr
ms.topic: conceptual
ms.date: 10/27/2022
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
|Use case|General purpose|General purpose to enterprise scale|Cross-platform|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|All regions|[Select regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true)|All regions|
|Redundancy|Locally redundant/zone-redundant/geo-redundant/geo-zone-redundant|Locally redundant/zone-redundant [with cross-zone replication](../azure-netapp-files/cross-zone-replication-introduction.md)/geo-redundant [with cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md)|Locally redundant/zone-redundant/geo-redundant|
|Tiers and performance| Standard (Transaction optimized)<br>Premium<br>Up to max 100K IOPS per share with 10 GBps per share at about 3-ms latency|Standard<br>Premium<br>Ultra<br>Up to max 460K IOPS per volume with 4.5 GBps per volume at about 1 ms latency. For IOPS and performance details, see [Azure NetApp Files performance considerations](../azure-netapp-files/azure-netapp-files-performance-considerations.md) and [the FAQ](../azure-netapp-files/faq-performance.md#how-do-i-convert-throughput-based-service-levels-of-azure-netapp-files-to-iops).|Standard HDD: up to 500 IOPS per-disk limits<br>Standard SSD: up to 4k IOPS per-disk limits<br>Premium SSD: up to 20k IOPS per-disk limits<br>We recommend Premium disks for Storage Spaces Direct|
|Capacity|100 TiB per share, Up to 5 PiB per general purpose account |100 TiB per volume, up to 12.5 PiB per NetApp account|Maximum 32 TiB per disk|
|Required infrastructure|Minimum share size 1 GiB|Minimum capacity pool 2 TiB, min volume size 100 GiB|Two VMs on Azure IaaS (+ Cloud Witness) or at least three VMs without and costs for disks|
|Protocols|SMB 3.0/2.1, NFSv4.1 (preview), REST|[NFSv3, NFSv4.1](../azure-netapp-files/azure-netapp-files-create-volumes.md), [SMB 3.x/2.x](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md), [dual-protocol](../azure-netapp-files/create-volumes-dual-protocol.md)|NFSv3, NFSv4.1, SMB 3.1|

## Azure management details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, on-premises|Cloud, on-premises|
|Backup|Azure backup snapshot integration|Azure NetApp Files snapshots<br>Azure NetApp Files backup|Azure backup snapshot integration|
|Security and compliance|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|[Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|[All Azure supported certificates](https://www.microsoft.com/trustcenter/compliance/complianceofferings)|
|Microsoft Entra integration|[Native Active Directory and Microsoft Entra Domain Services](../storage/files/storage-files-active-directory-overview.md)|[Microsoft Entra Domain Services and Native Active Directory](../azure-netapp-files/faq-smb.md#does-azure-netapp-files-support-azure-active-directory)|Native Active Directory or Microsoft Entra Domain Services support only|

Once you've chosen your storage method, check out [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) for information about our pricing plans.

## Azure Files tiers

Azure Files offers two different tiers of storage: premium and standard. These tiers let you tailor the performance and cost of your file shares to meet your scenario's requirements.

- Premium file shares are backed by solid-state drives (SSDs) and are deployed in the FileStorage storage account type. Premium file shares provide consistent high performance and low latency for input and output (IO) intensive workloads. Premium file shares use a provisioned billing model, where you pay for the amount of storage you would like your file share to have, regardless of how much you use.

- Standard file shares are backed by hard disk drives (HDDs) and are deployed in the general purpose version 2 (GPv2) storage account type. Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability, such as general-purpose file shares and dev/test environments. Standard file shares use a pay-as-you-go billing model, where you pay based on storage usage, including data stored and transactions.

To learn more about how billing works in Azure Files, see [Understand Azure Files billing](../storage/files/understanding-billing.md).

The following table lists our recommendations for which performance tier to use based on your workload. These recommendations will help you select the performance tier that meets your performance targets, budget, and regional considerations. We've based these recommendations on the example scenarios from [Remote Desktop workload types](/windows-server/remote/remote-desktop-services/remote-desktop-workloads). 

| Workload type | Recommended file tier |
|--------|-----------|
| Light (fewer than 200 users) | Standard file shares |
| Light (more than 200 users) | Premium file shares or standard with multiple file shares |
|Medium|Premium file shares|
|Heavy|Premium file shares|
|Power|Premium file shares|

For more information about Azure Files performance, see [File share and file scale targets](../storage/files/storage-files-scale-targets.md#azure-files-scale-targets). For more information about pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/).

## Azure NetApp Files tiers

Azure NetApp Files volumes are organized in capacity pools. Volume performance is defined by the service level of the hosting capacity pool. Three performance levels are offered, ultra, premium and standard. For more information, see [Storage hierarchy of Azure NetApp Files](../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md). Azure NetApp Files performance is [a function of tier times capacity](../azure-netapp-files/azure-netapp-files-performance-considerations.md). More provisioned capacity leads to higher performance budget, which likely results in a lower tier requirement, providing a more optimal TCO.

The following table lists our recommendations for which performance tier to use based on workload defaults.

| Workload | Example Users | Azure NetApp Files |
|----------|---------------|--------------------|
| Light | Users doing basic data entry tasks | Standard tier  |
| Medium | Consultants and market researchers | Premium tier: small-medium user count<br>Standard tier: large user count |
| Heavy | Software engineers, content creators | Premium tier: small-medium user count<br>Standard tier: large user count |
| Power | Graphic designers, 3D model makers, machines learning researchers | Ultra tier: small user count<br>Premium tier: medium user count<br> Standard tier: large user count |

In order to provision the optimal tier and volume size, consider using [this calculator](https://github.com/ANFTechTeam/Fslogix-Calculator) for guidance. 

## Next steps

To learn more about FSLogix profile containers, user profile disks, and other user profile technologies, see the table in [FSLogix profile containers and Azure Files](fslogix-containers-azure-files.md).

If you're ready to create your own FSLogix profile containers, get started with one of these tutorials:

- [Set up FSLogix Profile Container with Azure Files and Active Directory](fslogix-profile-container-configure-azure-files-active-directory.md)
- [Set up FSLogix Profile Container with Azure NetApp Files](create-fslogix-profile-container.md)
