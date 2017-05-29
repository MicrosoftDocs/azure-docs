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

>[!NOTE]
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article summarizes supported configurations and components for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region.

## User interface options

** ** |  **Supported / Not supported**
--- | ---
**Azure portal** | Supported
**Classic portal** | Not supported
**PowerShell** | Not currently supported
**REST API** | Not currently supported
**CLI** | Not currently supported


## Resource move support

**Resource move type** | **Supported / Not supported** | **Remarks**  
--- | --- | ---
**Move vault across resource groups** | Not supported |You cannot move the Recovery services vault across resource groups.
**Move Compute, Storage and Network across resource groups** | Not supported |If you move a virtual machine (or its associated components such as storage and network) after enabling replication, you need to disable replication and enable replication for the virtual machine again.


## Support for deployment models

**Deployment model** | **Supported / Not supported** | **Remarks**  
--- | --- | ---
**Classic** | Supported | You can only replicate a classic virtual machine and recover it as a classic virtual machine. You cannot recover it as a Resource Manager virtual machine.
**Resource Manager** | Supported |

## Support for replicated machine OS versions

The below support is applicable for any workload running on the mentioned OS.

#### Windows

- 64-bit Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 with at least SP1

#### Linux

- Red Hat Enterprise Linux 6.7, 6.8, 7.1, 7.2
- CentOS 6.5, 6.6, 6.7, 6.8, 7.0, 7.1, 7.2
- Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3)
- SUSE Linux Enterprise Server 11 SP3
- SUSE Linux Enterprise Server 11 SP4
	- Upgrade of replicating machines from SLES 11 SP3 to SLES 11 SP4 is not supported. If a replicated machine has been upgraded from SLES 11SP3 to SLES 11 SP4, you need to disable replication and protect the machine again post the upgrade.


>[!IMPORTANT]
>
> On Red Hat Enterprise Linux Server 7+ and CentOS 7+ servers, kernel version 3.10.0-514 is supported starting from version 9.8 of the Azure Site Recovery mobility service.<br/><br/>
> Customers on the 3.10.0-514 kernel with a version of the mobility service lower than version 9.8 are required to disable replication, update the version of the mobility service to version 9.8 and then enable replication again.  

## Supported file systems and guest storage configurations on Azure virtual machines running Linux OS

* File systems: ext3, ext4, ReiserFS (Suse Linux Enterprise Server only), XFS (upto v4 only)
* Volume manager : LVM2
* Multipath software : Device Mapper


>[!Note]
> On Linux servers the following directories (if set up as separate partitions/file-systems) must all be on the same disk (the OS disk) on the source server :   / (root), /boot, /usr, /usr/local, /var, /etc<br/><br/>
> XFS v5 features such as metadata checksum are currently not supported by Azure Site Recovery on XFS filesystems. Ensure that your XFS filesystems aren't using any v5 features. You can use the xfs_info utility to check the XFS superblock for the partition. If ftype is set to 1, then XFSv5 features are being used.
>

## Support for Compute configuration

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Size | Any Azure VM size with atleast 2 CPU cores and 1-GB RAM | Refer to [Azure virtual machine sizes](../virtual-machines/windows/sizes.md)
Availability sets | Supported | If you use the default option during 'Enable replication' step in portal, the availability set is auto created based on source region configuration. You can change the target availability set in 'Replicated item > Settings > Compute and Network > Availability set' any time.
Hybrid Use Benefit (HUB) VMs | Supported | If the source VM has HUB license enabled, the Test failover or Failover VM also uses the HUB license.
Virtual machine scale sets | Not supported |
Azure Gallery Images - Microsoft published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
Azure Gallery images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery.
Custom images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery.
VMs migrated using Site Recovery | Supported | If it is a VMware/Physical machine migrated to Azure using Site Recovery, you need to uninstall the older version of mobility service and restart the machine before replicating it to another Azure region.

## Support for Storage configuration

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Maximum OS disk size | Maximum OS disk size supported by Azure| Refer to [Disks used by VMs](../storage/storage-about-disks-and-vhds-windows.md#disks-used-by-vms)
Maximum data disk size | Maximum data disk size supported by Azure| Refer to [Disks used by VMs](../storage/storage-about-disks-and-vhds-windows.md#disks-used-by-vms)
Number of data disks | Upto 64 as supported by a specific Azure VM size | Refer to [Azure virtual machine sizes](../virtual-machines/windows/sizes.md)
Disks on standard storage accounts | Supported |
Disks on premium storage accounts | Supported | If a VM has disks spread across premium and standard storage accounts, you can select a different target storage account for each disk to ensure you have the same storage configuration in target region
Standard Managed disks | Not supported |  
Premium Managed disks | Not supported |
Storage spaces | Not supported |   	 	 
Encryption at rest (SSE) | Supported | For cache and target storage accounts, you can select an SSE enabled storage account. 	 
Azure Disk Encryption (ADE) | Not supported |
Hot add/remove disk	| Not supported | If you add or remove data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Not supported|	Temporary disk is excluded by default.
LRS | Supported |
GRS | Supported |
RA-GRS | Supported |
ZRS | Supported |  
Cool and Hot Storage | Not supported | Virtual machine disks are not supported on cool and hot storage

## Support for Network configuration
**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Network interface (NIC) | Upto maximum number of NICs supported by a specific Azure VM size | NICs are created when the VM is created as part of Test failover or Failover operation. The number of NICs on the failover VM depends on the number of NICs the source VM has at the time of enabling replication. If you add/remove NIC after enabling replication, it does not impact NIC count on the failover VM.
Internet Load Balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Internal Load balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Public IP| Supported | You need to associate an already existing public IP to the NIC or create one and associate to the NIC using an azure automation script in a recovery plan.
NSG on NIC (Resource Manager)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.  
NSG on subnet (ARM and Classic)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.
NSG on VM (Classic)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.
Reserved IP (Static IP) / Retain source IP | Supported | If the NIC on the source VM has static IP configuration and the target subnet has the same IP available, it is assigned to the failover VM. If the target subnet does not have the same IP available, one of the available IPs in the subnet is reserved for this VM. You can specify a fixed IP of your choice in 'Replicated item > Settings > Compute and Network > Network interfaces'. You can select the NIC and specify the subnet and IP of your choice.
Dynamic IP| Supported | If the NIC on the source VM has dynamic IP configuration, the NIC on the failover VM is also Dynamic by default. You can specify a fixed IP of your choice in 'Replicated item > Settings > Compute and Network > Network interfaces'. You can select the NIC and specify the subnet and IP of your choice.
Traffic Manager integration	| Supported | You can pre-configure your traffic manager in such a way that the traffic is routed to the endpoint in source region on a regular basis and to the endpoint in target region in case of failover.
Azure managed DNS | Supported |
Custom DNS	| Supported | 	 
Unauthenticated Proxy | Supported | Refer to [networking guidance document.](site-recovery-azure-to-azure-networking-guidance.md)	 
Authenticated Proxy | Not supported | If the VM is using an authenticated proxy for outbound connectivity, it cannot be replicated using Azure Site Recovery.	 
Site to Site VPN with on-premises (with or without ExpressRoute)| Supported | Ensure that the UDRs and NSGs are configured in such a way that the Site recovery traffic is not routed to on-premises. Refer to [networking guidance document.](site-recovery-azure-to-azure-networking-guidance.md)	 
VNET to VNET connection	| Supported | Refer to [networking guidance document.](site-recovery-azure-to-azure-networking-guidance.md)	 


## Next steps
- Learn more about [networking guidance for replicating Azure VMs](site-recovery-azure-to-azure-networking-guidance.md)
- Start protecting your workloads by [replicating Azure VMs](site-recovery-azure-to-azure.md)
