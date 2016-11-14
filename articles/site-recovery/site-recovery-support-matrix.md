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
ms.date: 11/14/2016
ms.author: raynew

---
# Azure Site Recovery support matrix

This article summarizes supported operating systems and components for Azure Site Recovery. A list of supported components and prerequisites is available for each deployment scenario in each the corresponding deployment article, and this document summarizes them.

## Supported operating systems for virtualization servers

### Replication to Azure

**VMware VM/physical server** | **Hyper-V (no VMM) ** | **Hyper-V (with VMM)**
--- | --- | ---
vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates | Windows Server 2012 R2 with latest updates | Windows Server 2012 R2 with latest updates

### Replication to secondary site

**VMware VM/physical server* | **Hyper-V (with VMM)**
--- | --- | ---
vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates | At least Windows Server 2012 with latest updates


## Support requirements for replicated machines

### Replication to Azure

Virtual machines must meet [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements).

**Requirement** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
What's replicated | Any workload on Windows or Linux VM | Any workload | Any workload
Host OS | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3<bbr/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3. | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx) | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx)


## Replication to secondary site

**Requirement** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
What's replicated | Any workload on Windows or Linux VM | Any workload | Any workload
Host OS | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3<bbr/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2).<br/><br/> Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3. | Any guest OS supported by Hyper-V](https://technet.microsoft.com/library/mt126277.aspx)


## Provider and agent versions

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
**Azure Site Recovery Provider** | Coordinates communications between on-premises servers and Azure/secondary site <br/><br/> Installed on on-premises VMM servers, or Hyper-V servers if there's no VMM server | 5.1.1700 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Azure Site Recovery Unified Setup (VMware to Azure)** | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.3.4246.1 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Mobility service** | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on  VMware VM or physical servers you want to replicate  | NA (available from portal) | .
**Microsoft Azure Recovery Services (MARS) agent** | Coordinates replication between Hyper-V VMs and Azure<br/><br/> Installed on on-premises Hyper-V servers (with or without a VMM server) | |

## Networking support requirements

### Replication to Azure

**Host networking** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
NIC teaming | Yes | Yes | Yes
VLAN | Yes | Yes | Yes
IPv4 | Yes | Yes | Yes
IPv6 | No | No | No

**Guest VM networking** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
NIC teaming | Yes | No | No
IPv4 | Yes | Yes | Yes
IPv6 | No | No | No
Static IP (Windows) | Yes | Yes | Yes
Static IP (Linux) | Yes | No | No
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

### Replication to secondary site

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


## Storage support requirements

### Replicate to Azure

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


## Replicate to secondary site

**Storage (host)** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NFS | Yes | NA
SMB 3.0 | NA | Yes
SAN (ISCSI) | Yes | Yes
Multi-path (MPIO) | Yes | Yes

**Storage (guest VM/physical server)** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
VMDK | Yes | NA
VHD/VHDX | NA | Yes (up to 64 disks)
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

## Actions supported for Recovery Services vaults

### Replicate to Azure

**Action** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No | No

### Replicate to secondary site

**Action** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No


## Azure compute support (replicate to Azure)

**Compute feature** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | ---
Shared disk guest clusters | No | No | No
Availability sets | No | No | No
HUB | Yes | Yes | Yes









## Next steps
[Prepare for deployment](site-recovery-best-practices.md)
