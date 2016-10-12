<properties
	pageTitle="Azure Site Recovery support matrix | Microsoft Azure"
	description="Summarizes the supported operating systems and components for Azure Site Recovery"
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="10/05/2016"
	ms.author="raynew"/>

# Azure Site Recovery support matrix

This article summarizes supported operating systems and components for Azure Site Recovery deployments. A list of supported components and prerequisites is available for each deployment scenario in each the corresponding deployment article, and this document summarizes them.

## Supported operating systems for virtualization servers


**Source** | **Target** | **Host OS**
---|---|---|--- 
**Hyper-V hosts (without VMM)** | Azure | Windows Server 2012 R2 with latest updates
**Hyper-V hosts (with VMM)** | Azure | Windows Server 2012 R2 with latest updates
**Hyper-V hosts (with VMM)** | Secondary VMM site | At least Windows Server 2012 with latest updates
**VMware hosts/vCenter** | Azure | vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates
**VMware hosts/vCenter** | Secondary VMware site | vCenter 5.5 or 6.0 (support for 5.5 features only) <br/><br/> vSphere 6.0, 5.5, or 5.1 with latest updates

## Supported requirements for replicated machines

**Source** | **What's replicated** | **Target** | **Host OS**
---|---|---|--- 
**Hyper-V VMs** | Any workload | Azure | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx)<br/><br/> VMs must meet [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements)
**Hyper-V VMs (with VMM)** | Any workload | Azure | Any guest OS [supported by Azure](https://technet.microsoft.com/library/cc794868.aspx)<br/><br/> VMs must meet [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements)
**Hyper-V VMs (with VMM)** | Any workload | Secondary VMM site | Any guest OS [supported by Hyper-V](https://technet.microsoft.com/library/mt126277.aspx)
**VMware VMs** | Any workload running on Windows VM | Azure | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1<br/><br/> VMs must meet [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements)
**VMware VMs** | Any workload running on Linux VM | Azure | Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 <br/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3.<br/><br/> VMs must meet [Azure requirements](site-recovery-best-practices.md#azure-virtual-machine-requirements)
**VMware VMs** | Any workload running on Windows VM | Secondary VMware site | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1
**VMware VMs** | Any workload running on Linux VM | Secondary VMware site | Red Hat Enterprise Linux 6.7, 7.1, 7.2 <br/><br/> Centos 6.5, 6.6, 6.7, 7.0, 7.1, 7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 <br/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3.
**Physical servers** | Any workload running on Windows | Azure | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 with at least SP1
**Physical servers** | Any workload running on Linux | Azure | Red Hat Enterprise Linux 6.7,7.1,7.2 <br/><br/> Centos 6.5, 6.6,6.7,7.0,7.1,7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 <br/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3.
**Physical servers** | Any workload running on Windows | Secondary site | 64-bit Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 with at least SP1
**Physical servers** | Any workload running on Linux | Secondary site | Red Hat Enterprise Linux 6.7,7.1,7.2 <br/><br/> Centos 6.5, 6.6,6.7,7.0,7.1,7.2 <br/><br/> Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3) <br/><br/> SUSE Linux Enterprise Server 11 SP3 <br/><br/> Storage required: File system (EXT3, ETX4, ReiserFS, XFS); Multipath software-Device Mapper (multipath)); Volume manager: (LVM2). Physical servers with HP CCISS controller storage are not supported. The ReiserFS filesystem is supported only on SUSE Linux Enterprise Server 11 SP3.


## Provider versions

**Name** | **Description** | **Latest version** | **Support** | **Details**
---|---|---|---| ---
**Azure Site Recovery Provider** | Coordinates communications between on-premises servers and Azure/secondary site <br/><br/> Installed on on-premises VMM servers, or Hyper-V servers if there's no VMM server | 5.1.1700 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Azure Site Recovery Unified Setup (VMware to Azure)** | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | 9.3.4246.1 (available from portal) | [Latest features and fixes](https://support.microsoft.com/kb/3155002)
**Mobility service** | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site | NA (available from portal) | Installed on each VMware VM or physical server that you want to replicate. **Microsoft Azure Recovery Services (MARS) agent** | Coordinates replication between Hyper-V VMs and Azure<br/><br/> Installed on on-premises Hyper-V servers (with or without a VMM server) | 2.0.8689.0 (available from portal) | This agent is used by Azure Site Recovery and Azure Backup). [Learn more] (https://support.microsoft.com/en-us/kb/2997692)

## Next steps

[Prepare for deployment](site-recovery-best-practices.md)

