---
title: Azure Site Recovery support matrix for replicating from Azure to Azure | Microsoft Docs
description: Summarizes the supported operating systems and configurations for Azure Site Recovery replication of Azure virtual machines (VMs) from one region to another for disaster recovery (DR) needs.
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
ms.date: 06/10/2017
ms.author: sujayt

---
# Azure Site Recovery support matrix for replicating from Azure to Azure


>[!NOTE]
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article summarizes supported configurations and components for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region.

## User interface options

**User interface** |  **Supported / Not supported**
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
**Classic** | Supported | You can only replicate a classic virtual machine and recover it as a classic virtual machine. You cannot recover it as a Resource Manager virtual machine. If you deploy a classic VM without a virtual network and directly to an Azure region, it is not supported.
**Resource Manager** | Supported |

## Support for replicated machine OS versions

The below support is applicable for any workload running on the mentioned OS.

#### Windows

- 64-bit Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 with at least SP1

#### Linux

- Red Hat Enterprise Linux 6.7, 6.8, 7.1, 7.2, 7.3
- CentOS 6.5, 6.6, 6.7, 6.8, 7.0, 7.1, 7.2, 7.3
- Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3)
- SUSE Linux Enterprise Server 11 SP3

## Supported file systems and guest storage configurations on Azure virtual machines running Linux OS

* File systems: ext3, ext4, ReiserFS (Suse Linux Enterprise Server only), XFS
* Volume manager : LVM2
* Multipath software : Device Mapper

## Region support

You can replicate and recover VMs between any two regions within the same geographic cluster.

**Geographic cluster** | **Azure regions**
-- | --
America | Canada East, Canada Central, South Central US, West Central US, East US, East US 2, West US, West US 2, Central US, North Central US
Europe | UK West, UK South, North Europe, West Europe
Asia | South India, Central India, Southeast Asia, East Asia, Japan East, Japan West
Australia	| Australia East, Australia Southeast

>[!NOTE]
>
> For Brazil South region, you can only replicate and failover to one of South Central US, West Central US, East US, East US 2, West US, West US 2 and North Central US regions and fail back.


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
Maximum OS disk size | Maximum OS disk size supported by Azure| Refer to [Disks used by VMs.](../storage/storage-about-disks-and-vhds-windows.md#disks-used-by-vms)
Maximum data disk size | Maximum data disk size supported by Azure| Refer to [Disks used by VMs.](../storage/storage-about-disks-and-vhds-windows.md#disks-used-by-vms)
Number of data disks | Upto 64 as supported by a specific Azure VM size | Refer to [Azure virtual machine sizes](../virtual-machines/windows/sizes.md)
Temporary disk | Always excluded from replication | Temporary disk is excluded from replication always. You should not put any persistent data on temporary disk as per Azure guidance. Refer to [Temporary disk on Azure VMs](../storage/storage-about-disks-and-vhds-windows.md#temporary-disk) for more details.
Data change rate on the disk | Maximum of 6 Mbps per disk | If the average data change rate on the disk is beyond 6 Mbps continuously, replication will not catch up. However, if it is an occasional data burst and the data change rate is greater than 6 Mbps for some time and comes down, replication will catch up. In this case, you might see slightly delayed recovery points.
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

>[!IMPORTANT]
> Ensure that you follow the [storage guidance](../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) for your source Azure virtual machines to avoid any performance issues. If you follow the default settings, Site Recovery will create the required storage accounts based on the source configuration. If you customize and select your own settings, ensure you follow the (../storage/storage-scalability-targets.md#scalability-targets-for-virtual-machine-disks) as your source VMs.

## Support for Network configuration
**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Network interface (NIC) | Upto maximum number of NICs supported by a specific Azure VM size | NICs are created when the VM is created as part of Test failover or Failover operation. The number of NICs on the failover VM depends on the number of NICs the source VM has at the time of enabling replication. If you add/remove NIC after enabling replication, it does not impact NIC count on the failover VM.
Internet Load Balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Internal Load balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Public IP| Supported | You need to associate an already existing public IP to the NIC or create one and associate to the NIC using an azure automation script in a recovery plan.
NSG on NIC (Resource Manager)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.  
NSG on subnet (Resource Manager and Classic)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.
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
