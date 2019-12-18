---
title: Support matrix-Hyper-V disaster recovery to a secondary VMM site with Azure Site Recovery
description: Summarizes support for Hyper-V VM replication in VMM clouds to a secondary site with Azure Site Recovery.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/06/2019
ms.author: raynew
---

# Support matrix for disaster recovery of Hyper-V VMs to a secondary site

This article summarizes what's supported when you use the [Azure Site Recovery](site-recovery-overview.md) service to replicate Hyper-V VMs managed in System Center Virtual Machine Manager (VMM) clouds to a secondary site. If you want to replicate Hyper-V VMs to Azure, review [this support matrix](hyper-v-azure-support-matrix.md).

> [!NOTE]
> You can only replicate to a secondary site when your Hyper-V hosts are managed in VMM clouds.


## Host servers

**Operating system** | **Details**
--- | ---
Windows Server 2012 R2 | Servers must be running the latest updates.
Windows Server 2016 |  VMM 2016 clouds with a mixture of Windows Server 2016 and 2012 R2 hosts aren't currently supported.<br/><br/> Deployments that upgraded from System Center 2012 R2 VMM 2012 R2 to System Center 2016 aren't currently supported.


## Replicated VM support

The following table summarizes operating system support for machines replicated with Site Recovery. Any workload can be running on the supported operating system.

**Windows version** | **Hyper-V (with VMM)**
--- | ---
Windows Server 2016 | Any guest operating system [supported by Hyper-V](https://docs.microsoft.com/windows-server/virtualization/hyper-v/Supported-Windows-guest-operating-systems-for-Hyper-V-on-Windows) on Windows Server 2016 
Windows Server 2012 R2 | Any guest operating system [supported by Hyper-V](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn792027%28v%3dws.11%29) on Windows Server 2012 R2

## Linux machine storage

Only Linux machines with the following storage can be replicated:

- File system (EXT3, ETX4, ReiserFS, XFS).
- Multipath software-device Mapper.
- Volume manager (LVM2).
- Physical servers with HP CCISS controller storage are not supported.
- The ReiserFS file system is supported only on SUSE Linux Enterprise Server 11 SP3.

## Network configuration - Host/Guest VM

**Configuration** | **Supported**  
--- | --- 
Host - NIC teaming | Yes 
Host - VLAN | Yes 
Host - IPv4 | Yes 
Host - IPv6 | No 
Guest VM - NIC teaming | No
Guest VM - IPv4 | Yes
Guest VM - IPv6 | No
Guest VM - Windows/Linux - Static IP address | Yes
Guest VM - Multi-NIC | Yes


## Storage

### Host storage

**Storage (host)** | **Supported**
--- | --- 
NFS | N/A
SMB 3.0 |  Yes
SAN (ISCSI) | Yes
Multi-path (MPIO) | Yes

### Guest or physical server storage

**Configuration** | **Supported**
--- | --- | 
VMDK |  N/A
VHD/VHDX | Yes (up to 16 disks)
Gen 2 VM | Yes
Shared cluster disk | No
Encrypted disk | No
UEFI| N/A
NFS | No
SMB 3.0 | No
RDM | N/A
Disk > 1 TB | Yes
Volume with striped disk > 1 TB<br/><br/> LVM | Yes
Storage Spaces | Yes
Hot add/remove disk | No
Exclude disk | Yes
Multi-path (MPIO) | Yes

## Vaults

**Action** | **Supported**
--- | --- 
Move vaults across resource groups (within or across subscriptions) |  No
Move storage, network, Azure VMs across resource groups (within or across subscriptions) | No

## Azure Site Recovery Provider

The Provider coordinates communications between VMM servers. 

**Latest** | **Updates**
--- | --- 
5.1.19 ([available from portal](https://aka.ms/downloaddra) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)



## Next steps

[Replicate Hyper-V VMs in VMM clouds to a secondary site](tutorial-vmm-to-vmm.md)

