---
title: Support matrix for replicating VMware VMs and physical servers to Azure with Azure Site Recovery | Microsoft Docs
description: Summarizes the supported operating systems and components for replicating VMware VMs and physical server to Azure using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: article
ms.date: 03/29/2018
ms.author: raynew

---
# Support matrix for VMware and physical server replication to Azure

This article summarizes supported components and settings for disaster recovery of VMware VMs to Azure by using [Azure Site Recovery](site-recovery-overview.md).

## Supported scenarios

**Scenario** | **Details**
--- | ---
VMware VMs | You can perform disaster recovery to Azure for on-premises VMware VMs. You can deploy this scenario in the Azure portal or by using PowerShell.
Physical servers | You can perform disaster recovery to Azure for on-premises Windows/Linux physical servers. You can deploy this scenario in the Azure portal.

## On-premises virtualization servers

**Server** | **Requirements** | **Details**
--- | --- | ---
VMware | vCenter Server 6.5, 6.0, or 5.5 or vSphere 6.5, 6.0, or 5.5 | We recommend that you use a vCenter server.
Physical | N/A


## Replicated machines

The following table summarizes replication support for VMware VMs and physical servers. Site Recovery supports replication of any workload running on a machine with a supported operating system.

**Component** | **Details**
--- | ---
Machine settings | Machines that replicate to Azure must meet [Azure requirements](#azure-vm-requirements).
Windows operating system | 64-bit Windows Server 2016 (Server Core, Server with Desktop Experience), Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1. Windows 2016 Nano Server isn't supported.
Linux operating system | Red Hat Enterprise Linux: 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.4 <br/><br/>CentOS: 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.4 <br/><br/>Ubuntu 14.04 LTS server[ (supported kernel versions)](#ubuntu-kernel-versions)<br/><br/>Ubuntu 16.04 LTS server[ (supported kernel versions)](#ubuntu-kernel-versions)<br/><br/>Debian 7/Debian 8[ (supported kernel versions)](#debian-kernel-versions)<br/><br/>Oracle Enterprise Linux 6.4, 6.5 running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/>SUSE Linux Enterprise Server 11 SP3, SUSE Linux Enterprise Server 11 SP4 <br/><br/>Upgrading replicated machines from SP3 to SP4 isn't supported. To upgrade, disable replication and enable it again after the upgrade.

>[!NOTE]
>
> - On Linux distributions, only the stock kernels that are part of the distribution minor version release/update are supported.
>
> - Upgrading protected machines across major Linux distribution versions isn't supported. To upgrade, disable replication, upgrade the operating system, and then enable replication again.
>

### Ubuntu kernel versions


**Supported release** | **Azure Site Recovery Mobility Service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | 9.11 | 3.13.0-24-generic to 3.13.0-128-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-91-generic |
14.04 LTS | 9.12 | 3.13.0-24-generic to 3.13.0-132-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-96-generic |
14.04 LTS | 9.13 | 3.13.0-24-generic to 3.13.0-137-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-104-generic |
14.04 LTS | 9.14 | 3.13.0-24-generic to 3.13.0-142-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-116-generic |
16.04 LTS | 9.11 | 4.4.0-21-generic to 4.4.0-91-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-32-generic |
16.04 LTS | 9.12 | 4.4.0-21-generic to 4.4.0-96-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-35-generic |
16.04 LTS | 9.13 | 4.4.0-21-generic to 4.4.0-104-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic |
16.04 LTS | 9.14 | 4.4.0-21-generic to 4.4.0-116-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-36-generic,<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1011-azure |


### Debian kernel versions


**Supported release** | **Azure Site Recovery Mobility Service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | 9.14 | 3.2.0-4-amd64 to 3.2.0-5-amd64, 3.16.0-0.bpo.4-amd64 |
Debian 8 | 9.14 | 3.16.0-4-amd64 to 3.16.0-5-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.5-amd64 |


## Linux file systems/guest storage

**Component** | **Supported**
--- | ---
File systems | ext3, ext4, XFS.
Volume manager | LVM2.
Multipath software | Device Mapper.
Paravirtualized storage devices | Devices exported by paravirtualized drivers aren't supported.
Multi-queue block IO devices | Not supported.
Physical servers with the HP CCISS storage controller | Not supported.
Directories | These directories (if set up as separate partitions/file-systems) all must be on the same OS disk on the source server: /(root), /boot, /usr, /usr/local, /var, /etc.</br></br> /boot should be on a disk partition and not be an LVM volume.<br/><br/>
Free space requirements| 2 GB on the /root partition <br/><br/> 250 MB on the installation folder
XFSv5 | XFSv5 features on XFS file systems, such as metadata checksum, are supported from Mobility Service version 9.10 onward. Use the xfs_info utility to check the XFS superblock for the partition. If ftype is set to 1, then XFSv5 features are in use.



## Network

**Component** | **Supported**
--- | ---
Host network NIC Teaming | Supported for VMware VMs. <br/><br/>Not supported for physical machine replication.
Host network VLAN | Yes.
Host network IPv4 | Yes.
Host network IPv6 | No.
Guest/server network NIC Teaming | No.
Guest/server network IPv4 | Yes.
Guest/server network IPv6 | No.
Guest/server network static IP (Windows) | Yes.
Guest/server network static IP (Linux) | Yes. <br/><br/>VMs are configured to use DHCP on failback.
Guest/server network multiple NICs | Yes.


## Azure VM network (after failover)

**Component** | **Supported**
--- | ---
Azure ExpressRoute | Yes
ILB | Yes
ELB | Yes
Azure Traffic Manager | Yes
Multi-NIC | Yes
Reserved IP address | Yes
IPv4 | Yes
Retain source IP address | Yes
Azure Virtual Network service endpoints<br/><br/> (Azure Storage firewalls and virtual networks) | No

## Storage
**Component** | **Supported**
--- | ---
Host NFS | Yes for VMware<br/><br/> No for physical servers
Host SAN (ISCSI) | Yes
Host multipath (MPIO) | Yes, tested with Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON
Guest/server VMDK | Yes
Guest/server EFI/UEFI| Partial (migration to Azure for Windows Server 2012 and later VMware virtual machines only) </br></br> See the note at the end of the table
Guest/server shared cluster disk | No
Guest/server encrypted disk | No
Guest/server NFS | No
Guest/server SMB 3.0 | No
Guest/server RDM | Yes<br/><br/> N/A for physical servers
Guest/server disk > 1 TB | Yes<br/><br/>Up to 4,095 GB
Guest/server disk with 4K logical and 4k physical sector size | Yes
Guest/server disk with 4K logical and 512 bytes physical sector size | Yes
Guest/server volume with striped disk >4 TB <br><br/>Logical volume management (LVM)| Yes
Guest/server - Storage Spaces | No
Guest/server hot add/remove disk | No
Guest/server - exclude disk | Yes
Guest/server multipath (MPIO) | N/A

> [!NOTE]
> UEFI boot VMware virtual machines running Windows Server 2012 or later can be migrated to Azure. The following restrictions apply:

> - Only migration to Azure is supported. Failback to on-premises VMware site isn't supported.
> - The server shouldn't have more than four partitions on the OS disk.
> - Requires Mobility Service version 9.13 or later.
> - Not supported for physical servers.

## Azure storage

**Component** | **Supported**
--- | ---
Locally redundant storage | Yes
Geo-redundant storage | Yes
Read-access geo-redundant storage | Yes
Cool storage | No
Hot storage| No
Block blobs | No
Encryption at rest (Storage Service Encryption)| Yes
Premium storage | Yes
Import/export service | No
Virtual Network service endpoints<br/><br/> Storage firewalls and virtual networks configured on target storage/cache storage account (used to store replication data) | No
General purpose v2 storage accounts (both hot and cool tiers) | No

## Azure compute

**Feature** | **Supported**
--- | ---
Availability sets | Yes
HUB | Yes
Managed disks | Yes

## Azure VM requirements

On-premises VMs that you replicate to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs a prerequisites check, it will fail if some of the requirements aren't met.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Verify [supported operating systems](#replicated machines). | Check fails if unsupported. 
Guest operating system architecture | 64-bit. | Check fails if unsupported. 
Operating system disk size | Up to 2,048 GB. | Check fails if unsupported. 
Operating system disk count | 1 | Check fails if unsupported.  
Data disk count | 64 or less. | Check fails if unsupported.  
Data disk size | Up to 4,095 GB | Check fails if unsupported. 
Network adapters | Multiple adapters are supported. | 
Shared VHD | Not supported. | Check fails if unsupported. 
FC disk | Not supported. | Check fails if unsupported. 
BitLocker | Not supported. | BitLocker must be disabled before you enable replication for a machine. | 
VM name | From 1 to 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.


## Vault tasks

**Action** | **Supported**
--- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No


## Mobility Service

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
Azure Site Recovery Unified Setup | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.12.4653.1 (available from portal) | [Latest features and fixes](https://aka.ms/latest_asr_updates)
Mobility Service | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate | 9.12.4653.1 (available from portal) | [Latest features and fixes](https://aka.ms/latest_asr_updates)


## Next steps
[Learn how](tutorial-prepare-azure.md) to prepare Azure for disaster recovery of VMware VMs.
