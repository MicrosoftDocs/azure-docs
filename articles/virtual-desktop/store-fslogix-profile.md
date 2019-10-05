---
title: Storage options for FSLogix profile containers - Azure
description: Options for storing your Windows Virtual Desktop FSLogix profile on Azure Storage.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: helohr
---
# Storage options for FSLogix profile containers

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article compares storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

Windows Virtual Desktop offers FSLogix profile containers as the recommended user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. At sign in, this container is dynamically attached to the computing environment using natively supported Virtual Hard Disk (VHD) and Hyper-V virtual hard disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

## Comparing Azure storage options

The following table compares the storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

Azure platform details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Platform service|Yes, Azure-native solution|Yes, Azure-native solution|No, self-managed|
|Regional availability|Broad availability|Currently available in [at least nine regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all)|Azure Compute-supported DC regions, premium disks are broadly available and recommended for Storage Spaces Direct|
|Redundancy|LRS/ZRS/GRS|Locally redundant, cross-region replication coming soon|LRS/ZRS/GRS|
|Tiers|Standard Premium|Standard Premium Ultra|Standard HDD, Standard SSD|
|Performance|Up to max 100k IOPs, 5 GBps, and about 3 ms latency per share|Up to 320k (16K) IOPS with 4.5 GBps per volume and about 1 ms latency|Standard HDD: 500 IOPS per disk limits<br>Standard SSD Up to 4k IOPS per disk limits<br>Premium SSD: Up to 20k IOPS per disk limits|
|Capacity|100 TiB per share|100 TiB per volume, up to 12.5 PiB per subscription|Max. 32 TiB per disk|
|Required infrastructure|At least one file share|Minimum capacity pool 4 TiB, min volume size 100 GiB|At least two virtual machines on Azure IaaS with Cloud Witness, or at least three virtual machines without Cloud Witness and costs for disks|
|Protocols|SMB 2.1, SMB 3.x, REST|NFSv3, NFSv4.1 (preview), SMB 3.x, SMB 2.x||
|Plans|Standard: pay-as-you-go ($0.06 per GiB)<br>Premium |||

Azure management details

|Features|Azure Files|Azure NetApp Files|Storage Spaces Direct|
|--------|-----------|------------------|---------------------|
|Access|Cloud, on-premises and hybrid (Azure file sync)|Cloud, [on-prem (ExpressRoute)](./azure-netapp-files/azure-netapp-files/azure-netapp-files-network-topologies#hybrid-environments) ||
|Azure Active Directory integration||||
|Backup||||
|Security compliance||||




|