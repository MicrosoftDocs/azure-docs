---
title: Storage options for FSLogix profile containers - Azure
description: Options for storing your Windows Virtual Desktop FSLogix profile on Azure Storage.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/07/2019
ms.author: helohr
---
# Storage options for FSLogix profile containers

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article compares storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

Windows Virtual Desktop offers FSLogix profile containers as the recommended user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. At sign in, this container is dynamically attached to the computing environment using natively supported Virtual Hard Disk (VHD) and Hyper-V virtual hard disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

## Comparing Azure storage options

The following table compares the storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|Ring 0, broad availability|Ring 1, currently available in [at least nine regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all)|Azure Compute-supported DC regions, premium disks are broadly available and recommended for Storage Spaces Direct|
|Protocols|SMB 2.1/3. and REST|NFSv3, NFSv4.1 (preview), SMB 3.x/2.x|NFSv3, NFSv4.1, SMB 3.1|
|Security and compliance|All Azure-supported certificates|Azure AD Domain Services and Native Active Directory|Native Active Directory or Azure Active Directory Domain Services support only|
|Azure Active Directory integration|Azure Active Directory and Azure Active Directory Domain Services|Azure AD Domain Services and Native Active Directory|Native Active Directory or Azure Active Directory Domain Services support only|
|Tiers and performance|Standard Premium Up to max 100k IOPS per share with 5 GBps per share at about 3 ms latency|Standard Premium Ultra Up to 320k (16K) IOPS with 4.5 GBps per Volume at about 1 ms latency|Standard HDD Up to 500 IOPS per-disk limits Standard SSD Up to 4k IOPS per-disk limits Premium SSD Up to 20k IOPS per-disk limits|
|Capacity|100 TiB per share|100 TiB per volume, up to 12.5 PiB per subscription|Maximum 32 TiB per disk|
|Redundancy|LRS/ZRS/GRS|Locally redundant|LRS/ZRS/GRS|
|Backup|Azure backup snapshot integration|Azure NetApp Files snapshots|Azure backup snapshot integration|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, on-premises (via ExpressRoute)|Cloud, on-premises|
|Minimum|At least one virtual machine|Minimum capacity pool 4 TiB, min volume size 100 GiB|Two VMs on Azure IaaS (+ Cloud Witness) or at least three VMs without and costs for disks|

For more about our pricing plans, check out [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).


Azure platform details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|Broad availability|Currently available in [at least nine regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all)|Azure Compute-supported DC regions, premium disks are broadly available and recommended for Storage Spaces Direct|
|Redundancy|LRS/ZRS/GRS|Locally redundant, cross-region replication coming soon|LRS/ZRS/GRS|
|Tiers and performance|Standard Premium Up to max 100k IOPS per share with 5 GBps per share at about 3 ms latency|Standard Premium Ultra Up to 320k (16K) IOPS with 4.5 GBps per Volume at about 1 ms latency|Standard HDD Up to 500 IOPS per-disk limits Standard SSD Up to 4k IOPS per-disk limits Premium SSD Up to 20k IOPS per-disk limits|
|Capacity|100 TiB per share|100 TiB per volume, up to 12.5 PiB per subscription|Max. 32 TiB per disk|
|Required infrastructure|At least one file share|Minimum capacity pool 4 TiB, min volume size 100 GiB|At least two virtual machines on Azure IaaS with Cloud Witness, or at least three virtual machines without Cloud Witness and costs for disks|
|Protocols|SMB 2.1, SMB 3.x, REST|NFSv3, NFSv4.1 (preview), SMB 3.x, SMB 2.x||

Azure management details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, [on-prem (ExpressRoute)](../azure-netapp-files/azure-netapp-files-network-topologies#hybrid-environments) ||
|Azure Active Directory integration||||
|Backup||||
|Security compliance||||




|