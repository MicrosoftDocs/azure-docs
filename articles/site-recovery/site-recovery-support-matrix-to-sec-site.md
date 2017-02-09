---
title: Azure Site Recovery support matrix for replicating to secondary site | Microsoft Docs
description: Summarizes the supported operating systems and components for Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 01/24/2017
ms.author: raynew

---
# Azure Site Recovery support matrix for replicating to a customer-owned secondary site

> [!div class="op_single_selector"]
> * [Replicate to Azure](site-recovery-support-matrix-to-azure.md)
> * [Replicate to customer owned secondary site](site-recovery-support-matrix-to-sec-site.md)

This article summarizes supported configurations and components for Azure Site Recovery when replicating and recovering to a customer owned secondary site. For more about prerequisites for Azure Site Recovery, see [Site Recovery best practices](site-recovery-best-practices.md).

## Support for deployment options

**Deployment** | **VMware/physical server** | **Hyper-V (no VMM)** | **Hyper-V (with VMM)**
--- | --- | --- | ---
**Azure portal** | On-premises VMware VMs to secondary VMware site.<br/><br/> Download the [InMage Scout user guide](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf) (not available in the Azure portal). | Not supported | On-premises Hyper-V VMs in VMM clouds to a secondary VMM cloud.<br/><br/> Standard Hyper-V Replication only. SAN not supported.
**Classic portal** | Maintenance mode only. New vaults can't be created. | Not supported | Maintenance mode only
**PowerShell** | Not supported | Not supported | Supported

## Support for datacenter management servers

### Virtualization management entities

**Deployment** | **Support**
--- | ---
**VMware VM/physical server** | vSphere 6.0, 5.5, or 5.1 with latest update
**Hyper-V (with VMM)** | SCVMM 2016 and SCVMM 2012 R2

  >[!Note]
  > An SCVMM 2016 cloud with a mixture of Windows Server 2016 and 2012 R2 hosts isn't currently supported.

### Host servers

**Deployment** | **Support**
--- | ---
**VMware VM/physical server** | vCenter 5.5 or 6.0 (support for 5.5 features only)
**Hyper-V (no VMM)** | Not a supported configuration for replicating to a secondary site
**Hyper-V with VMM** | Windows Server 2016, Windows Server 2012 R2 with the latest updates.<br/><br/> Windows Server 2016 hosts should be managed by SCVMM 2016.

## Support for replicated machine OS versions
The following table summarizes operating system support in various deployment scenarios encountered while using Azure Site Recovery. This support is applicable for any workload running on the mentioned OS.

**VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4 or 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 | Any guest OS [supported by Hyper-V](https://technet.microsoft.com/library/mt126277.aspx)

>[!Note]
>Storage support for Linux versions
>file system (EXT3, ETX4, ReiserFS, XFS),
>Multipath software-Device Mapper,
>Volume manager: (LVM2),
>and physical servers with HP CCISS controller storage are not supported.
>The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3.

## Support for network configuration
The following tables summarize network configuration support in various deployment scenarios that use Azure Site Recovery to replicate to Azure.

### Host network configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NIC teaming | Yes | Yes
VLAN | Yes | Yes
IPv4 | Yes | Yes
IPv6 | No | No

### Guest VM network configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NIC teaming | No | No
IPv4 | Yes | Yes
IPv6 | No | No
Static IP (Windows) | Yes | Yes
Static IP (Linux) | Yes | Yes
Multi-NIC | Yes | Yes


## Support for storage
The following tables summarize storage configuration support in various deployment scenarios that use Azure Site Recovery to replicate to Azure.

### Host storage configuration

**Storage (host)** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
NFS | Yes | N/A
SMB 3.0 | N/A | Yes
SAN (ISCSI) | Yes | Yes
Multi-path (MPIO) | Yes | Yes

### Guest or physical server storage configuration

**Configuration** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
VMDK | Yes | N/A
VHD/VHDX | N/A | Yes (up to 16 disks)
Gen 2 VM | N/A | Yes
Shared cluster disk | Yes  | No
Encrypted disk | No | No
UEFI| No | N/A
NFS | No | No
SMB 3.0 | No | No
RDM | Yes | N/A
Disk > 1 TB | No | Yes
Volume with striped disk > 1 TB<br/><br/> LVM | Yes | Yes
Storage Spaces | No | Yes
Hot add/remove disk | No | No
Exclude disk | No | No
Multi-path (MPIO) | N/A | Yes

## Support for Recovery Services vault actions

**Action** | **VMware/physical server** | **Hyper-V (with VMM)**
--- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No
Move storage, network, and Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No

## Support for Provider and Agent

**Name** | **Description** | **Latest version** | **Details**
--- | --- | --- | --- | ---
**Azure Site Recovery Provider** | Coordinates communications between on-premises servers and Azure <br/><br/> Installed on on-premises VMM servers, or on Hyper-V servers if there's no VMM server | 5.1.19 ([available from portal](http://aka.ms/downloaddra)) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Mobility service** | Coordinates replication between on-premises VMware servers or physical servers and the secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate  | N/A (available from portal) | N/A


## Next steps
[Prepare for deployment](site-recovery-best-practices.md)
