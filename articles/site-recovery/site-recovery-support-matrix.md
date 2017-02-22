---
title: Azure Site Recovery support matrix | Microsoft Docs
description: Summarizes the supported operating systems and components for Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 1bbcc13c-ea21-4349-9ddf-0d7dfdcdcbfb
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/04/2016
ms.author: raynew

---
# Azure Site Recovery support matrix

This article summarizes supported operating systems and components for Azure Site Recovery. A list of supported components and prerequisites is available for each deployment scenario in each the corresponding deployment article, and this document summarizes them.

## Support for Azure replication scenarios

**Deployment** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
**Azure portal** | On-premises VMware VMs to Azure storage, with Resource Manager or classic storage and networks.<br/><br/> Fail over to Resource Manager-based or classic VMs. | On-premises Hyper-V VMs (not in VMM clouds) to Azure storage, with Resource Manager or classic storage and networks.<br/><br/> Fail over to Resource Manager-based or classic VMs. | On-premises Hyper-V VMs in MM clouds) to Azure storage, with Resource Manager or classic storage and networks.<br/><br/> Fail over to Resource Manager-based or classic VMs.
**Classic portal** | Maintenance mode only. New vaults can't be created. | Maintenance mode only. | Maintenance mode only.
**PowerShell** | Not currently supported. | Supported | Supported


## Support for secondary site replication scenarios

**Deployment** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
**Azure portal** | On-premises VMware VMs to secondary VMware site.<br/><br/> Download the help guide](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf) the InMage Scout user guide. Not available in the Azure portal | Not supported | On-premises Hyper-V VMs in VMM clouds to a secondary VMM cloud<br/><br/> Standard Hyper-V Replication only, SAN not supported
**Classic portal** | Maintenance mode only. New vaults can't be created. | Maintenance mode only. | Maintenance mode only.
**PowerShell** | Not supported. | NA | Supported



## Support for virtualization server operating systems

### Host servers (replicate to Azure)

**VMware VM/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | ---
vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates | Windows Server 2016, Windows Server 2012 R2 with latest updates<br/><br/> A Hyper-V site that mixes hosts running Windows Server 2016 and 2012 R2 isn't currently supported. | Windows Server 2016, Windows Server 2012 R2 with latest updates<br/><br/> Windows Server 2016 hosts should be managed by VMM running System Center 2016.<br/><br/> A VMM 2016 cloud with a mixture of Windows Server 2016 and 2012 R2 hosts isn't currently supported.

### Host servers (replicate to secondary site)

**VMware VM/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates | Windows Server 2016, Windows Server 2012 R2, or Windows Server 2012 with latest updates.<br/><br/> Windows Server 2016 hosts should be managed by VMM running System Center 2016.<br/><br/> A VMM 2016 cloud with a mixture of Windows Server 2016 and earlier hosts isn't currently supported.


## Support for replicated machines

### Machines (replicate to Azure)

Virtual machines must meet [Azure requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).

**Requirement** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
What's replicated | Any workload on Windows or Linux VM | Any workload | Any workload
Host OS | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3<bbr/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3. | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx) | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx)


### Machines (replicate to secondary site)

**Requirement** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
What's replicated | Any workload on Windows or Linux VM | Any workload | Any workload
Host OS | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3<bbr/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2).<br/><br/> Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3. | Any guest OS supported by Hyper-V](https://technet.microsoft.com/library/mt126277.aspx)


## Support for Provider and agent

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
**Azure Site Recovery Provider** | Coordinates communications between on-premises servers and Azure/secondary site <br/><br/> Installed on on-premises VMM servers, or on Hyper-V servers if there's no VMM server | 5.1.1700 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Azure Site Recovery Unified Setup (VMware to Azure)** | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.3.4246.1 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Mobility service** | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate  | NA (available from portal) | .
**Microsoft Azure Recovery Services (MARS) agent** | Coordinates replication between Hyper-V VMs and Azure<br/><br/> Installed on on-premises Hyper-V servers (with or without a VMM server) | |

## Support for networking

### Networking (replicate to Azure)

**Host networking** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
NIC teaming | Yes<br/><br/>Not supported in physical machines| Yes | Yes
VLAN | Yes | Yes | Yes
IPv4 | Yes | Yes | Yes
IPv6 | No | No | No

**Guest VM networking** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
NIC teaming | No | No | No
IPv4 | Yes | Yes | Yes
IPv6 | No | No | No
Static IP (Windows) | Yes | Yes | Yes
Static IP (Linux) | No | No | No
Multi-NIC | Yes | Yes | Yes

**Azure networking** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
Express Route | Yes | Yes | Yes
ILB | Yes | Yes | Yes
ELB | Yes |  |
Traffic Manager | Yes | Yes | Yes
Multi-NIC | Yes | Yes | Yes
Reserved IP | Yes | Yes | Yes
IPv4 | Yes | Yes | Yes
Retain source IP | Yes | Yes | Yes

### Networking (replicate to secondary site)

**Host networking** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NIC teaming | Yes | Yes
VLAN | Yes | Yes
IPv4 | Yes | Yes
IPv6 | No | No

**Guest VM networking** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NIC teaming | No | No
IPv4 | Yes | Yes
IPv6 | No | No
Static IP (Windows) | Yes | Yes
Static IP (Linux) | Yes | Yes
Multi-NIC | Yes | Yes


## Support for storage

### Storage (replicate to Azure)

**Storage (host)** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
NFS | Yes for VMware<br/><br/> No for physical servers | NA | NA
SMB 3.0 | NA | Yes | Yes
SAN (ISCSI) | Yes | Yes | Yes
Multi-path (MPIO) | Yes for VMware<br/><br/> NA for physical servers | Yes | Yes

**Storage (guest VM/physical server)** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
VMDK | Yes | NA | NA
VHD/VHDX | NA | Yes | Yes
Gen 2 VM | NA | Yes | Yes
Shared cluster disk | Yes for VMware<br/><br/> NA for physical servers | No | No
Encrypted disk | No | No | No
EFI/UEFI| No | Yes | Yes
NFS | No | No | No
SMB 3.0 | No | No | No
RDM | Yes<br/><br/> NA for physical servers | NA | NA
Disk > 1 TB | No | No | No
Volume with striped disk > 1 TB<br/><br/> LVM | Yes | Yes | Yes
Storage Spaces | No | Yes | Yes
Hot add/remove disk | No | No | No
Exclude disk | Yes | No | No
Multi-path (MPIO) | NA | Yes | Yes

**Azure storage** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
LRS | Yes | Yes | Yes
GRS | Yes | Yes | Yes
Cool storage | No | No | No
Hot storage| No | No | No
Encryption at rest | Yes | Yes | Yes
Premium storage | Yes | No | No
Import/export service | No | No | No


### Storage (replicate to secondary site)

**Storage (host)** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NFS | Yes | NA
SMB 3.0 | NA | Yes
SAN (ISCSI) | Yes | Yes
Multi-path (MPIO) | Yes | Yes

**Storage (guest VM/physical server)** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
VMDK | Yes | NA
VHD/VHDX | NA | Yes (up to 16 disks)
Gen 2 VM | NA | Yes
Shared cluster disk | Yes  | No
Encrypted disk | No | No
UEFI| No | NA
NFS | No | No
SMB 3.0 | No | No
RDM | Yes | NA
Disk > 1 TB | No | Yes
Volume with striped disk > 1 TB<br/><br/> LVM | Yes | Yes
Storage Spaces | No | Yes
Hot add/remove disk | No | No
Exclude disk | No | No
Multi-path (MPIO) | NA | Yes

## Support for Recovery Services vault actions

### Vaults (replicate to Azure)

**Action** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No | No

### Vaults (replicate to secondary site)

**Action** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No


## Support for Azure compute (replicate to Azure)

**Compute feature** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
Shared disk guest clusters | No | No | No
Availability sets | No | No | No
HUB | Yes | Yes | Yes

## Support for Azure VMs

You can deploy Site Recovery to replicate virtual machines and physical servers, running any operating system supported by Azure. This includes most versions of Windows and Linux. On-premises VMs that you want to replicate must conform with Azure requirements.

**Feature** | **Requirements** | **Details**
--- | --- | ---
**Hyper-V host** | Should be running Windows Server 2012 R2 or later | Prerequisites check will fail if operating system unsupported
**VMware hypervisor** | Supported operating system | [Check requirements](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment)
**Guest operating system** | Hyper-V to Azure replication: Site Recovery supports all operating systems that are [supported by Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx). <br/><br/> For VMware and physical server replication: Check the Windows and Linux [prerequisites](site-recovery-vmware-to-azure-classic.md#before-you-start-deployment) | Prerequisites check will fail if unsupported.
**Guest operating system architecture** | 64-bit | Prerequisites check will fail if unsupported
**Operating system disk size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Operating system disk count** | 1 | Prerequisites check will fail if unsupported.
**Data disk count** | 64 or less if you are replicating **VMware VMs to Azure**; 16 or less if you are replicating **Hyper-V VMs to Azure** | Prerequisites check will fail if unsupported
**Data disk VHD size** | Up to 1023 GB | Prerequisites check will fail if unsupported
**Network adapters** | Multiple adapters are supported |
**Static IP address** | Supported | If the primary virtual machine is using a static IP address you can specify the static IP address for the virtual machine that will be created in Azure.<br/><br/> Static IP address for a **Linux VM running on Hyper-V** isn't supported.
**iSCSI disk** | Not supported | Prerequisites check will fail if unsupported
**Shared VHD** | Not supported | Prerequisites check will fail if unsupported
**FC disk** | Not supported | Prerequisites check will fail if unsupported
**Hard disk format** | VHD <br/><br/> VHDX | Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises the virtual machines continue to use the VHDX format.
**Bitlocker** | Not supported | Bitlocker must be disabled before protecting a virtual machine.
**VM name** | Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. Should start and end with a letter or number | Update the value in the virtual machine properties in Site Recovery
**VM type** | Generation 1<br/><br/> Generation 2 - Windows | Generation 2 VMs with an OS disk type of basic, which includes one or two data volumes formatted as VHDX and less than 300 GB are supported.<br/><br/>. Linux Generation 2 VM's aren't supported. [Learn more](https://azure.microsoft.com/blog/2015/04/28/disaster-recovery-to-azure-enhanced-and-were-listening/) |








## Next steps
Check [prerequisites](site-recovery-prereq.md)
