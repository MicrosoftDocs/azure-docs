---
title: Azure Site Recovery support matrix for replicating from Azure to Azure | Microsoft Docs
description: Summarizes the supported operating systems and components for Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/13/2017
ms.author: sujayt

---
# Azure Site Recovery support matrix for replicating from Azure to Azure

> [!div class="op_single_selector"]
> * [Replicate from Azure to Azure](site-recovery-support-matrix-azure-to-azure.md)
> * [Replicate from on-premises to Azure](site-recovery-support-matrix-to-azure.md)
> * [Replicate to customer-owned secondary site](site-recovery-support-matrix-to-sec-site.md)



This article summarizes supported configurations and components for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region. For more about Azure Site Recovery requirements, see the [prerequisites](site-recovery-prereq.md).


## User interface options

**Interface** |  |
--- | --- | ---
**Azure portal** | Supported |
**Classic portal** | Not supported |
**PowerShell** | Not currently supported |
**REST API** | Not currently supported |
**CLI** | Not currently supported |


## Resource move support

**Ressource move type** |  | Remarks|
--- | --- | ---

**Move vault across resource groups** | Not supported |You cannot move the Recovery services vault across resource groups. |

**Move Compute, Storage and Network across resource groups** | Not supported |If you move a virtual machine (or its associated components such as storage and network after enabling replication, you need to disable replication and enable it again. |


## Support for deployment models

**Classic** | Supported | You can only replicate a classic virtual machine and recover it as a classic virtual machine. You cannot recover it as a Resource manager virtual machine.|
**Resource Manager** | Supported | |

## Support for replicated machine OS versions

The following table summarizes replicated operating system support for Azure virtual machines. This support is applicable for any workload running on the mentioned OS.

 **Operating system version** |
--- | --- |
64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 6.8, 7.1, 7.2 <br/><br/> CentOS 6.5, 6.6, 6.7, 6.8, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 <br/><br/> SUSE Linux Enterprise Server 11 SP4 <br/>(Upgrade of replicating machines from SLES 11 SP3 to SLES 11 SP4 is not supported. If a replicated machine has been upgraded from SLES 11SP3 to SLES 11 SP4, you'll need to disable replication and protect the machine again post the upgrade.) 


>[!IMPORTANT]
>
> On Red Hat Enterprise Linux Server 7+ and CentOS 7+ servers, kernel version 3.10.0-514 is supported starting from version 9.8 of the Azure Site Recovery mobility service.<br/><br/>
> Customers on the 3.10.0-514 kernel with a version of the mobility service lower than version 9.8 are required to disable replication, update the version of the mobility service to version 9.8 and then enable replication again.  

## Supported file systems and guest storage configurations on Azure virtual machines running Linux operating system 

* File systems: ext3, ext4, ReiserFS (Suse Linux Enterprise Server only), XFS (upto v4 only)
* Volume manger : LVM2
* Multipath software : Device Mapper


>[!Note]
> On Linux servers the following directories (if set up as separate partitions/file-systems) must all be on the same disk (the OS disk) on the source server:   / (root), /boot, /usr, /usr/local, /var, /etc<br/><br/>
> XFS v5 features such as metadata checksum are currently not supported by ASR on XFS filesystems. Ensure that your XFS filesystems aren't using any v5 features. You can use the xfs_info utility to check the XFS superblock for the partition. If ftype is set to 1, then XFSv5 features are being used. 
>

## Support for Compute configuration

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Size | Any Azure VM size with atleast 2 CPU cores and 1 GB RAM | Refer to [Azure virtual machine sizes](./virtual-machines/windows/sizes.md)
Network interface (NIC) | Upto maximum number of NICs supported by a specific Azure VM size | NICs are created when the VM is created as part of Test failover or Failover operation. The number of NICs on the failover VM depends on the number of NICs the source VM has at the time of enabling replication. If you add/remove NIC after enabling replication, it does not impact NIC count on the failover VM. 
Availability sets | Supported | If you use the default option during 'enable replication' sgtep in portal, the availability set is auto created based on source site configuration. You can always change the target availability set in 'Replicated item > Settings > Compute and Network > Availability set'
Hybrid Use Benefit (HUB) VMs | Supported | If the source VM has HUB license enabled, the Test failvoer or Failover VM also will use the HUB license.
Virtual machine scale sets | Not supported |
Azure Gallery Images - Microsoft published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
Azure Gallery images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
Azure Gallery images - Microsoft published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
Custom images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
VMs migrated using Site Recovery | Supported | If it is a VMware/Physical machine migrated to Azure using Site Recovery, you need to uninstall the older version of mobility service before replicating it to another Azure region. 
Standard VM extensions | |

## Support for Network configuration
The following tables summarize network configuration support in various deployment scenarios that use Azure Site Recovery to replicate to Azure.

### Host network configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | ---
NIC teaming | Yes<br/><br/>Not supported in physical machines| Yes
VLAN | Yes | Yes
IPv4 | Yes | Yes
IPv6 | No | No

### Guest VM network configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | ---
NIC teaming | No | No
IPv4 | Yes | Yes
IPv6 | No | No
Static IP (Windows) | Yes | Yes
Static IP (Linux) | No | No
Multi-NIC | Yes | Yes

### Failed-over Azure VM network configuration

**Azure networking** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | ---
Express Route | Yes | Yes
ILB | Yes | Yes
ELB | Yes | Yes
Traffic Manager | Yes | Yes
Multi-NIC | Yes | Yes
Reserved IP | Yes | Yes
IPv4 | Yes | Yes
Retain source IP | Yes | Yes


## Support for storage
The following tables summarize storage configuration support in various deployment scenarios that use Azure Site Recovery to replicate to Azure.

### Host storage configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | --- | ---
NFS | Yes for VMware<br/><br/> No for physical servers | N/A
SMB 3.0 | N/A | Yes
SAN (ISCSI) | Yes | Yes
Multi-path (MPIO)<br></br>Tested with: Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON | Yes | Yes

### Guest or physical server storage configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | ---
VMDK | Yes | N/A
VHD/VHDX | N/A | Yes
Gen 2 VM | N/A | Yes
EFI/UEFI| No | Yes
Shared cluster disk | Yes for VMware<br/><br/> N/A for physical servers | No
Encrypted disk | No | No
NFS | No | N/A
SMB 3.0 | No | No
RDM | Yes<br/><br/> N/A for physical servers | N/A
Disk > 1 TB | No | No
Volume with striped disk > 1 TB<br/><br/> LVM-Logical Volume Management | Yes | Yes
Storage Spaces | No | Yes
Hot add/remove disk | No | No
Exclude disk | Yes | Yes
Multi-path (MPIO) | N/A | Yes

**Azure storage** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | ---
LRS | Yes | Yes
GRS | Yes | Yes
RA-GRS | Yes | Yes
Cool storage | No | No
Hot storage| No | No
Encryption at rest(SSE)| Yes | Yes
Premium storage | Yes | Yes
Import/export service | No | No


## Support for Azure compute configuration

**Compute feature** | **VMware/physical server** | **Hyper-V (with/without Virtual Machine Manager)**
--- | --- | --- | ---
Availability sets | Yes | Yes
HUB | Yes | Yes  

## Failed-over Azure VM requirements

You can deploy Site Recovery to replicate virtual machines and physical servers running any operating system supported by Azure. This includes most versions of Windows and Linux. On-premises VMs that you want to replicate must conform with the following Azure requirements while replicating to Azure.

**Entity** | **Requirements** | **Details**
--- | --- | ---
**Guest operating system** | Hyper-V to Azure replication: Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication: Check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) | Prerequisites check will fail if unsupported.
**Guest operating system architecture** | 64-bit | Prerequisites check will fail if unsupported
**Operating system disk size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Operating system disk count** | 1 | Prerequisites check will fail if unsupported.
**Data disk count** | 64 or less if you are replicating **VMware VMs to Azure**; 16 or less if you are replicating **Hyper-V VMs to Azure** | Prerequisites check will fail if unsupported
**Data disk VHD size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Network adapters** | Multiple adapters are supported |
**Shared VHD** | Not supported | Prerequisites check will fail if unsupported
**FC disk** | Not supported | Prerequisites check will fail if unsupported
**Hard disk format** | VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
**Bitlocker** | Not supported | Bitlocker must be disabled before protecting a virtual machine.
**VM name** | Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. The VM name must start and end with a letter or number. | Update the value in the virtual machine properties in Site Recovery.
**VM type** | Generation 1<br/><br/> Generation 2 -- Windows | Generation 2 VMs with an OS disk type of basic (which includes one or two data volumes formatted as VHDX) and less than 300 GB of disk space are supported.<br></br>Linux Generation 2 VMs aren't supported. [Learn more](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/)|

## Support for Recovery Services vault actions

**Action** | **VMware/physical server** | **Hyper-V (no Virtual Machine Manager)** | **Hyper-V (with Virtual Machine Manager)**
--- | --- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No | No


## Support for Provider and Agent

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
**Azure Site Recovery Provider** | Coordinates communications between on-premises servers and Azure <br/><br/> Installed on on-premises Virtual Machine Manager servers, or on Hyper-V servers if there's no Virtual Machine Manager server | 5.1.19 ([available from portal](http://aka.ms/downloaddra)) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Azure Site Recovery Unified Setup (VMware to Azure)** | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.3.4246.1 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Mobility service** | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate  | N/A (available from portal) | N/A
**Microsoft Azure Recovery Services (MARS) agent** | Coordinates replication between Hyper-V VMs and Azure<br/><br/> Installed on on-premises Hyper-V servers (with or without a Virtual Machine Manager server) | Latest agent ([available from portal](http://aka.ms/latestmarsagent)) |






## Next steps
[Check prerequisites](site-recovery-prereq.md)
