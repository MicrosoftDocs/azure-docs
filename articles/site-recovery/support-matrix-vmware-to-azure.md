---
title: Azure Site Recovery support matrix for replicating VMware VMs and physical servers to Azure | Microsoft Docs
description: Summarizes the supported operating systems and components for replicating VMware VMs to Azure with the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: article
ms.date: 01/11/2018
ms.author: raynew

---
# Support matrix for VMware and physical server replication to Azure


This article summarizes supported components and settings for disaster recovery of VMware VMs to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Supported scenarios

**Scenario** | **Details**
--- | ---
**VMware VMs** | You can perform disaster recovery to Azure for on-premises VMware VMs. You can deploy this scenario in the Azure portal, or using PowerShell.
**Physical servers** | You can perform disaster recovery to Azure for on-premises Windows/Linux physical servers. You can deploy this scenario in the Azure portal.

## On-premises virtualization servers

**Server** | **Requirements** | **Details**
--- | --- | ---
**VMware** | vCenter Server 6.5, 6.0 or 5.5 or vSphere 6.5, 6.0, 5.5 | We recommend you use a vCenter server
**Physical servers** | NA


## Replicated machines

The following table summarizes replication support for machines. Site Recovery supports replication of any workload running on a machine with a supported operating system.

**Component** | **Details**
--- | ---
Machine configuration | Machines that replicate to Azure must meet [Azure requirements](#failed-over-azure-vm-requirements).
Machine operating system (Windows) | 64-bit Windows Server 2016  (Server Core, Server with Desktop Experience)\*, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1
Machine operating system (Linux) | Red Hat Enterprise Linux : 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.4 <br/><br/>CentOS : 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.4 <br/><br/>Ubuntu 14.04 LTS server[ (supported kernel versions)](#supported-ubuntu-kernel-versions-for-vmwarephysical-servers)<br/><br/>Ubuntu 16.04 LTS server[ (supported kernel versions)](#supported-ubuntu-kernel-versions-for-vmwarephysical-servers)<br/><br/>Debian 7 <br/><br/>Debian 8<br/><br/>Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/>SUSE Linux Enterprise Server 11 SP3 <br/><br/>SUSE Linux Enterprise Server 11 SP4 <br/>(Upgrade of replicating machines from SLES 11 SP3 to SLES 11 SP4 is not supported. If a replicated machine has been upgraded from SLES 11SP3 to SLES 11 SP4, you'll need to disable replication and protect the machine again post the upgrade.)

>[!NOTE]
>
> - On Linux distributions, only the stock kernels that are part of the minor version release/update of the distribution are supported.
>
> - Upgrades across major versions of a Linux distribution on an Azure Site Recovery protected VMware virtual machine or physical server is not supported. While upgrading the operating system across major versions (for example CentOS 6.* to CentOS 7.*), disable replication for the machine, upgrade the operating system on the machine, and then enable replication again.
>

### Ubuntu kernel versions


**Supported release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | 9.10 | 3.13.0-24-generic to 3.13.0-121-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-81-generic |
14.04 LTS | 9.11 | 3.13.0-24-generic to 3.13.0-128-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-91-generic |
14.04 LTS | 9.12 | 3.13.0-24-generic to 3.13.0-132-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-96-generic |
14.04 LTS | 9.13 | 3.13.0-24-generic to 3.13.0-137-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-104-generic |
16.04 LTS | 9.10 | 4.4.0-21-generic to 4.4.0-81-generic,<br/>4.8.0-34-generic to 4.8.0-56-generic,<br/>4.10.0-14-generic to 4.10.0-24-generic |
16.04 LTS | 9.11 | 4.4.0-21-generic to 4.4.0-91-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-32-generic |
16.04 LTS | 9.12 | 4.4.0-21-generic to 4.4.0-96-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-35-generic |
16.04 LTS | 9.13 | 4.4.0-21-generic to 4.4.0-104-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic |

## Linux file systems/guest storage configurations

**Component** | **Supported**
--- | ---
File systems | ext3, ext4, ReiserFS (Suse Linux Enterprise Server only), XFS
Volume manager | LVM2
Multipath software | Device Mapper
Paravirtualized storage devices | Devices exported by paravirtualized drivers aren't supported.
Multi-queue block IO devices | Not supported.
Physical servers with the HP CCISS storage controller | Not supported.
Directories | These directories (if set up as separate partitions/file-systems) must all be on the same OS disk on the source server: /(root), /boot, /usr, /usr/local, /var, /etc </br></br>  If / (root) volume is an LVM volume, then /boot must reside on a separate partition on the same disk and not be an LVM volume.<br/><br/>
XFSv5 | XFSv5 features on XFS file systems such as metadata checksum are supported from version 9.10 of the Mobility service onwards. Use the xfs_info utility to check the XFS superblock for the partition. If ftype is set to 1, then XFSv5 features are in use.



## Network

**Component** | **Supported**
--- | ---
Host network NIC teaming | Supported for VMware VMs <br/><br/>Not supported for physical machine replication
Host network VLAN | Yes
Host network IPv4 | Yes
Host network IPv6 | No
Guest/server network NIC teaming | No
Guest/server network IPv4 | Yes
Guest/server network IPv6 | No
Guest/server network static IP (Windows) | Yes
Guest/server network static IP (Linux) | Yes <br/><br/>VMs are configured to use DHCP on failback  
Guest/server network multiple NICs | Yes


## Azure VM network (after failover)

**Component** | **Supported**
--- | ---
Express Route | Yes
ILB | Yes
ELB | Yes
Traffic Manager | Yes
Multi-NIC | Yes
Reserved IP address | Yes
IPv4 | Yes
Retain source IP address | Yes
Virtual Network Service Endpoints<br/><br/> (Azure storage firewalls and VNETs) | No


## Storage


**Component** | **Supported**
--- | ---
Host NFS | Yes for VMware<br/><br/> No for physical servers
Host SAN (ISCSI) | Yes
Host Multi-path (MPIO) | Yes - tested with: Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON
Guest/server VMDK | Yes
Guest/server EFI/UEFI| Partial (Migration to Azure for Windows Server 2012 and later VMware virtual machines only.) </br></br> ** See note at the end of the table.
Guest/server shared cluster disk | No
Guest/server encrypted disk | No
Guest/server NFS | No
Guest/server SMB 3.0 | No
Guest/server RDM | Yes<br/><br/> N/A for physical servers
Guest/server disk > 1 TB | Yes<br/><br/>Up to 4095 GB
Guest/server disk with 4K logical and 4k physical sector size | Yes
Guest/server disk with 4K logical and 512 bytes physical sector size | Yes
Guest/server volume with striped disk > 4 TB <br><br/>LVM-Logical Volume Management | Yes
Guest/server - Storage Spaces | No
Guest/server hot add/remove disk | No
Guest/server - exclude disk | Yes
Guest/server multi-path (MPIO) | N/A

> [!NOTE]
> ** UEFI ** boot VMware virtual machines running Windows Server 2012 or later, can be migrated to Azure. Following restrictions apply.
> - Only migration to Azure is supported. Failback to on-premises VMware site not supported.
> - The server should not have more than 4 partitions on the OS disk.
> - Requires Azure Site Recovery Mobility service version 9.13 or later.
> - Not supported for Physical servers.


## Azure storage

**Component** | **Supported**
--- | ---
LRS | Yes
GRS | Yes
RA-GRS | Yes
Cool storage | No
Hot storage| No
Block Blobs | No
Encryption at rest(SSE)| Yes
Premium storage | Yes
Import/export service | No
Virtual Network Service Endpoints<br/><br/> Azure storage firewalls and VNETs configured on target storage/cache storage account (used to store replication data) | No
General purpose V2 storage accounts (Both Hot and Cool tier) | No


## Azure compute

**Featuree** | **Supported**
--- | ---
Availability sets | Yes
HUB | Yes   
Managed disks | Yes

## Azure VM requirements

On-premises VMs that you replicate to Azure must meet the Azure VM requirements summarized in this table.

**Component** | **Requirements** | **Details**
--- | --- | ---
**Guest operating system** | Verify [supported operating systems](#replicated machines) | Prerequisites check fails if unsupported.
**Guest operating system architecture** | 64-bit | Prerequisites check fails if unsupported
**Operating system disk size** | Up to 2048 GB | Prerequisites check fails if unsupported
**Operating system disk count** | 1 | Prerequisites check will fail if unsupported.
**Data disk count** | 64 or less if you are replicating **VMware VMs to Azure**; 16 or less if you are replicating **Hyper-V VMs to Azure** | Prerequisites check will fail if unsupported
**Data disk VHD size** | Up to 4095 GB | Prerequisites check fails if unsupported
**Network adapters** | Multiple adapters are supported |
**Shared VHD** | Not supported | Prerequisites check fails if unsupported
**FC disk** | Not supported | Prerequisites check fails if unsupported
**Hard disk format** | VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
**Bitlocker** | Not supported | Bitlocker must be disabled before you enable replication for a machine.
**VM name** | 1 - 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. | Update the value in the machine properties in Site Recovery.
**VM type** | Generation 1<br/><br/> Generation 2 -- Windows | Generation 2 VMs with an OS disk type of basic (which includes one or two data volumes formatted as VHDX) and less than 300 GB of disk space are supported.<br></br>Linux Generation 2 VMs aren't supported. [Learn more](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/)|

## Vault tasks

**Action** | **Supported**
--- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No


## Mobility service

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
**Azure Site Recovery Unified Setup ** | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.12.4653.1 (available from portal) | [Latest features and fixes](https://aka.ms/latest_asr_updates)
**Mobility service** | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate  | 9.12.4653.1 (available from portal) | [Latest features and fixes](https://aka.ms/latest_asr_updates)


## Next steps
[Learn how](tutorial-prepare-azure.md) to prepare Azure for disaster recovery of VMware VMs.
