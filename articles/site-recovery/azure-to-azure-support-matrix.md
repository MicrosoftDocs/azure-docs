---
title: Azure Site Recovery support matrix for replicating from Azure to Azure | Microsoft Docs
description: Summarizes the supported operating systems and configurations for Azure Site Recovery replication of Azure virtual machines (VMs) from one region to another for disaster recovery (DR) needs.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.date: 09/10/2018
ms.author: sujayt

---
# Support matrix for replicating from one Azure region to another



This article summarizes supported configurations and components when you replicate and recovering Azure virtual machines from one region to another region, using the [Azure Site Recovery](site-recovery-overview.md) service.

## User interface options

**User interface** |  **Supported / Not supported**
--- | ---
**Azure portal** | Supported
**PowerShell** | [Azure to Azure replication with PowerShell](azure-to-azure-powershell.md)
**REST API** | Not currently supported
**CLI** | Not currently supported


## Resource support

**Resource move type** | **Details**
--- | --- | ---
**Move vault across resource groups** | Not supported<br/><br/> You can't move a Recovery services vault across resource groups.
**Move compute/storage/network resources across resource groups** | Not supported.<br/><br/> If you move a VM or associated components such as storage/network after it's replicating, you need to disable replication and reenable replication for the VM.
**Replicate Azure VMs from one subscription to another for disaster recovery** | Supported within the same Azure Active Directory tenant. Not supported for classic VMs.
**Migrate VMs across regions within the supported geographical clusters (within and across subscriptions)** | Supported within the same Azure Active Directory tenant for 'Resource manager deployment model' VMs. Not supported for 'Classic deployment model' VMs.
**Migrate VMs within the same region** | Not supported.


## Support for replicated machine OS versions

The below support is applicable for any workload running on the mentioned OS.

#### Windows

- Windows Server 2016 (Server Core, Server with Desktop Experience)*
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 with at least SP1

>[!NOTE]
>
> \* Windows Server 2016 Nano Server is not supported.

#### Linux

- Red Hat Enterprise Linux 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5   
- CentOS 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3,7.4, 7.5
- Ubuntu 14.04 LTS Server [ (supported kernel versions)](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
- Ubuntu 16.04 LTS Server [ (supported kernel versions)](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
- Debian 7 [ (supported kernel versions)](#supported-debian-kernel-versions-for-azure-virtual-machines)
- Debian 8 [ (supported kernel versions)](#supported-debian-kernel-versions-for-azure-virtual-machines)
- SUSE Linux Enterprise Server 12 SP1,SP2,SP3 [ (supported kernel versions)](#supported-suse-linux-enterprise-server-12-kernel-versions-for-azure-virtual-machines)
- SUSE Linux Enterprise Server 11 SP3
- SUSE Linux Enterprise Server 11 SP4
- Oracle Enterprise Linux 6.4, 6.5, 6.6, 6.7 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3)

(Upgrade of replicating machines from SLES 11 SP3 to SLES 11 SP4 is not supported. If a replicated machine has been upgraded from SLES 11SP3 to SLES 11 SP4, you need to disable replication and protect the machine again post the upgrade.)

>[!NOTE]
>
> Ubuntu servers using password-based authentication and login, and using the cloud-init package to configure cloud virtual machines, may have password-based login disabled upon failover (depending on the cloudinit configuration.) Password-based login can be re-enabled on the virtual machine by resetting the password from the settings menu (under the SUPPORT + TROUBLESHOOTING section) of the failed over virtual machine on the Azure portal.

### Supported Ubuntu kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | 9.19 | 3.13.0-24-generic to 3.13.0-153-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-131-generic |
14.04 LTS | 9.18 | 3.13.0-24-generic to 3.13.0-151-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-128-generic |
14.04 LTS | 9.17 | 3.13.0-24-generic to 3.13.0-147-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-124-generic |
14.04 LTS | 9.16 | 3.13.0-24-generic to 3.13.0-144-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-119-generic |
|||
16.04 LTS | 9.19 | 4.4.0-21-generic to 4.4.0-131-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-30-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1019-azure|
16.04 LTS | 9.18 | 4.4.0-21-generic to 4.4.0-128-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure |
16.04 LTS | 9.17 | 4.4.0-21-generic to 4.4.0-124-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-41-generic,<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1016-azure |
16.04 LTS | 9.16 | 4.4.0-21-generic to 4.4.0-119-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-38-generic,<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1012-azure |


### Supported Debian kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | 9.17,9.18,9.19 | 3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 |
Debian 7 | 9.16 | 3.2.0-4-amd64 to 3.2.0-5-amd64, 3.16.0-0.bpo.4-amd64 |
|||
Debian 8 | 9.19 | 3.16.0-4-amd64 to 3.16.0-6-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.7-amd64 |
Debian 8 | 9.17, 9.18 | 3.16.0-4-amd64 to 3.16.0-6-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.6-amd64 |
Debian 8 | 9.16 | 3.16.0-4-amd64 to 3.16.0-5-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.5-amd64 |

### Supported SUSE Linux Enterprise Server 12 kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3) | 9.19 | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.93-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.80-default</br></br>SP3 4.4.73-5-default to 4.4.140-94.42-default |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3) | 9.18 | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.93-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.80-default</br></br>SP3 4.4.73-5-default to 4.4.138-94.39-default |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3) | 9.17 | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.88-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default</br></br>SP3 4.4.73-5-default to 4.4.126-94.22-default |

## Supported file systems and guest storage configurations on Azure virtual machines running Linux OS

* File systems: ext3, ext4, ReiserFS (Suse Linux Enterprise Server only), XFS
* Volume manager: LVM2
* Multipath software: Device Mapper

## Region support

You can replicate and recover VMs between any two regions within the same geographic cluster.

**Geographic cluster** | **Azure regions**
-- | --
America | Canada East, Canada Central, South Central US, West Central US, East US, East US 2, West US, West US 2, Central US, North Central US
Europe | UK West, UK South, North Europe, West Europe, France Central, France South
Asia | South India, Central India, Southeast Asia, East Asia, Japan East, Japan West, Korea Central, Korea South
Australia	| Australia East, Australia Southeast, Australia Central, Australia Central 2
Azure Government	| US GOV Virginia, US GOV Iowa, US GOV Arizona, US GOV Texas, US DOD East, US DOD Central
Germany	| Germany Central, Germany Northeast
China | China East, China North

>[!NOTE]
>
> For Brazil South region, you can only replicate and fail over to one of South Central US, West Central US, East US, East US 2, West US, West US 2,and North Central US regions and fail back.

## Support for VM/disk management

**Action** | **Details**
-- | ---
Resize disk on replicated VM | Supported
Add disk to replicated VM | Not supported. You need to disable replication for the VM, add the disk, and then enable replication again.


## Support for Compute configuration

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Size | Any Azure VM size with at least 2 CPU cores and 1-GB RAM | Refer to [Azure virtual machine sizes](../virtual-machines/windows/sizes.md)
Availability sets | Supported | If you use the default option during 'Enable replication' step in portal, the availability set is auto created based on source region configuration. You can change the target availability set in 'Replicated item > Settings > Compute and Network > Availability set' any time.
Availability zones | Not supported | VMs deployed in Availability zones are currently not supported.
Hybrid Use Benefit (HUB) VMs | Supported | If the source VM has HUB license enabled, the Test failover or Failover VM also uses the HUB license.
Virtual machine scale sets | Not supported |
Azure Gallery Images - Microsoft published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery
Azure Gallery images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery.
Custom images - Third party  published | Supported | Supported as long as the VM runs on a supported operating system by Site Recovery.
VMs migrated using Site Recovery | Supported | If it is a VMware/Physical machine migrated to Azure using Site Recovery, you need to uninstall the older version of mobility service and restart the machine before replicating it to another Azure region.

## Support for Storage configuration

**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Maximum OS disk size | 2048 GB | Refer to [Disks used by VMs.](../virtual-machines/windows/about-disks-and-vhds.md#disks-used-by-vms)
Maximum data disk size | 4095 GB | Refer to [Disks used by VMs.](../virtual-machines/windows/about-disks-and-vhds.md#disks-used-by-vms)
Number of data disks | Up to 64 as supported by a specific Azure VM size | Refer to [Azure virtual machine sizes](../virtual-machines/windows/sizes.md)
Temporary disk | Always excluded from replication | Temporary disk is excluded from replication always. You should not put any persistent data on temporary disk as per Azure guidance. Refer to [Temporary disk on Azure VMs](../virtual-machines/windows/about-disks-and-vhds.md#temporary-disk) for more details.
Data change rate on the disk | Maximum of 10 MBps per disk for Premium storage and 2 MBps per disk for Standard storage | If the average data change rate on the disk is beyond 10 MBps (for Premium) and 2 MBps (for Standard) continuously, replication will not catch up. However, if it is an occasional data burst and the data change rate is greater than 10 MBps (for Premium) and 2 MBps (for Standard)  for some time and comes down, replication will catch up. In this case, you might see slightly delayed recovery points.
Disks on standard storage accounts | Supported |
Disks on premium storage accounts | Supported | If a VM has disks spread across premium and standard storage accounts, you can select a different target storage account for each disk to ensure you have the same storage configuration in target region
Standard Managed disks | Supported in Azure regions in which Azure Site Recovery is supported. |  
Premium Managed disks | Supported in Azure regions in which Azure Site Recovery is supported. |
Storage spaces | Supported |   	 	 
Encryption at rest (SSE) | Supported | SSE is the default setting on storage accounts.	 
Azure Disk Encryption (ADE) for Windows OS | VMs enabled for [encryption with Azure AD app](https://aka.ms/ade-aad-app) are supported |
Azure Disk Encryption (ADE) for Linux OS | Not supported |
Hot add/remove disk	| Not supported | If you add or remove data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Not supported|	Temporary disk is excluded by default.
Storage Spaces Direct  | Not supported|
Scale-out File Server  | Not supported|
LRS | Supported |
GRS | Supported |
RA-GRS | Supported |
ZRS | Not supported |  
Cool and Hot Storage | Not supported | Virtual machine disks are not supported on cool and hot storage
Azure Storage firewalls for Virtual networks  | No | Allowing access to specific Azure virtual networks on cache storage accounts used to store replicated data is not supported.
General purpose V2 storage accounts (Both Hot and Cool tier) | No | Transaction costs increase substantially compared to General purpose V1 storage accounts

>[!IMPORTANT]
> Ensure that you observe the VM disk scalability and performance targets for [Linux](../virtual-machines/linux/disk-scalability-targets.md) or [Windows](../virtual-machines/windows/disk-scalability-targets.md) virtual machines to avoid any performance issues. If you follow the default settings, Site Recovery will create the required disks and storage accounts based on the source configuration. If you customize and select your own settings, ensure that you follow the disk scalability and performance targets for your source VMs.

## Support for Network configuration
**Configuration** | **Supported/Not supported** | **Remarks**
--- | --- | ---
Network interface (NIC) | Up to maximum number of NICs supported by a specific Azure VM size | NICs are created when the VM is created as part of Test failover or Failover operation. The number of NICs on the failover VM depends on the number of NICs the source VM has at the time of enabling replication. If you add/remove NIC after enabling replication, it does not impact NIC count on the failover VM.
Internet Load Balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Internal Load balancer | Supported | You need to associate the pre-configured load balancer using an azure automation script in a recovery plan.
Public IP| Supported | You need to associate an already existing public IP to the NIC or create one and associate to the NIC using an azure automation script in a recovery plan.
NSG on NIC (Resource Manager)| Supported | You need to associate the NSG to the NIC using an azure automation script in a recovery plan.  
NSG on subnet (Resource Manager and Classic)| Supported | You need to associate the NSG to the subnet using an azure automation script in a recovery plan.
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
Virtual Network Service Endpoints | Supported | Azure Storage firewalls for virtual networks are not supported. Allowing access to specific Azure virtual networks on cache storage accounts used to store replicated data is not supported.
Accelerated Networking | Supported | Accelerated Networking must be enabled on source VM. [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).


## Next steps
- Learn more about [networking guidance for replicating Azure VMs](site-recovery-azure-to-azure-networking-guidance.md)
- Start protecting your workloads by [replicating Azure VMs](site-recovery-azure-to-azure.md)
