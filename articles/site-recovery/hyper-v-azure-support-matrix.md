---
title: Support for disaster recovery of Hyper-V VMs to Azure with Azure Site Recovery
description: Summarizes the supported components and requirements for Hyper-V VM disaster recovery to Azure with Azure Site Recovery
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 12/19/2024
author: ankitaduttaMSFT
ms.author: ankitadutta
---


# Support matrix for disaster recovery of on-premises Hyper-V VMs to Azure

This article summarizes the supported components and settings for disaster recovery of on-premises Hyper-V VMs to Azure by using [Azure Site Recovery](site-recovery-overview.md).

>[!NOTE]
> Site Recovery does not move or store customer data out of the target region, in which disaster recovery has been setup for the source machines. Customers may select a Recovery Services Vault from a different region if they so choose. The Recovery Services Vault contains metadata but no actual customer data.

## Supported scenarios

**Scenario** | **Details**
--- | ---
Hyper-V with Virtual Machine Manager <br> <br>| You can perform disaster recovery to Azure for VMs running on Hyper-V hosts that are managed in the System Center Virtual Machine Manager fabric.<br/><br/> You can deploy this scenario in the Azure portal or by using PowerShell.<br/><br/> When Hyper-V hosts are managed by Virtual Machine Manager, you also can perform disaster recovery to a secondary on-premises site. To learn more about this scenario, read [this tutorial](hyper-v-vmm-azure-tutorial.md).
Hyper-V without Virtual Machine Manager | You can perform disaster recovery to Azure for VMs running on Hyper-V hosts that aren't managed by Virtual Machine Manager.<br/><br/> You can deploy this scenario in the Azure portal or by using PowerShell.

> [!NOTE]
> Configuring both Azure Backup and Azure Site Recovery on the same Hyper-V host can cause issue with replication and is not supported.

## On-premises servers

**Server** | **Requirements** | **Details**
--- | --- | ---
Hyper-V (running without Virtual Machine Manager) | Windows Server 2022, Windows Server 2019, Windows Server 2016, Windows Server 2012 R2 with latest updates <br/><br/> **Note:** Server core installations of these operating systems are also supported. | If you have already configured Windows Server 2012 R2 with/or SCVMM 2012 R2 with Azure Site Recovery and plan to upgrade the OS, please follow the guidance [documentation.](upgrade-2012R2-to-2016.md)
Hyper-V (running with Virtual Machine Manager) | Virtual Machine Manager 2022  (Server core not supported), Virtual Machine Manager 2019, Virtual Machine Manager 2016, Virtual Machine Manager 2012 R2 <br/><br/> **Note:** Server core installations of these operating systems are also supported.  | If Virtual Machine Manager is used, Windows Server 2019 hosts should be managed in Virtual Machine Manager 2019. Similarly, Windows Server 2016 hosts should be managed in Virtual Machine Manager 2016.

> [!NOTE]
> Ensure that .NET Framework 4.6.2 or higher is present on the on-premises server.

## Replicated VMs


The following table summarizes VM support. Site Recovery supports any workloads running on a supported operating system.

 **Component** | **Details**
--- | ---
VM configuration | VMs that replicate to Azure must meet [Azure requirements](#azure-vm-requirements).
Guest operating system | Any guest OS [supported for Azure](https://learn.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc794868%28v=ws.10%29#supported-guest-operating-systems). <br/><br/> Windows Server 2016 Nano Server isn't supported.


## VM/Disk management

**Action** | **Details**
--- | ---
Resize disk on replicated Hyper-V VM | Not supported. Disable replication, make the change, and then re-enable replication for the VM.
Add disk on replicated Hyper-V VM | Not supported. Disable replication, make the change, and then re-enable replication for the VM.
Change disk ID on replication Hyper-V VM | Not supported. If you change the disk ID, it impacts the replication and will show the disk as "Not Protected".

## Hyper-V network configuration

**Component** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
Host network: NIC Teaming | Yes | Yes
Host network: VLAN | Yes | Yes
Host network: IPv4 | Yes | Yes
Host network: IPv6 | No | No
Guest VM network: NIC Teaming | No | No
Guest VM network: IPv4 | Yes | Yes
Guest VM network: IPv6 | No | Yes
Guest VM network: Static IP (Windows) | Yes | Yes
Guest VM network: Static IP (Linux) | Yes | Yes
Guest VM network: Multi-NIC | Yes | Yes
Https Proxy | No | No
Automatic Private IP Addressing (APIPA) | No | No
Private link access to Site Recovery service | Yes. [Learn more](hybrid-how-to-enable-replication-private-endpoints.md). | Yes. [Learn more](hybrid-how-to-enable-replication-private-endpoints.md).

> [!NOTE]
> For Guest VM network, static IP (Linux), Static IP from source OS's NIC is not used on Azure. The vNIC on Azure VM is configured with a new Azure IP of selected virtual network. 


## Azure VM network configuration (after failover)

**Component** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
Azure ExpressRoute | Yes | Yes
ILB | Yes | Yes
ELB | Yes | Yes
Azure Traffic Manager | Yes | Yes
Multi-NIC | Yes | Yes
Reserved IP | Yes | Yes
IPv4 | Yes | Yes
Retain source IP address | Yes | Yes
Azure Virtual Network service endpoints<br/> (without Azure Storage firewalls) | Yes | Yes
Accelerated Networking | No | No


## Hyper-V host storage

**Storage** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
NFS | NA | NA
SMB 3.0 | Yes | Yes
SAN (ISCSI) | Yes | Yes
Multi-path (MPIO). Tested with:<br></br> Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON | Yes | Yes

## Hyper-V VM guest storage

**Storage** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
VMDK | NA | NA
VHD/VHDX | Yes | Yes
Generation 2 VM | Yes | Yes
EFI/UEFI<br></br>The migrated VM in Azure will be automatically converted to a BIOS boot VM. The VM should be running Windows Server 2012 and later only. The OS disk should have up to five partitions or fewer and the size of OS disk should be less than 2 TB.| Yes | Yes
Shared cluster disk | No | No
Encrypted disk | No | No
NFS | NA | NA
SMB 3.0 | No | No
RDM | NA | NA
Disk >1 TB | Yes, up to 32 TB <br></br> You will need to upgrade the replication provider on the Hyper-V host to any version after 2.0.9214.0 to replicate large disks up to 32 TB. For large disks, replication will happen to managed disks only.| Yes, up to 32 TB <br></br> You will need to upgrade the replication provider on the Hyper-V host to any version after 2.0.9214.0 to replicate large disks up to 32 TB. For large disks, replication will happen to managed disks only.
Disk: 4K logical and physical sector | Not supported: Gen 1/Gen 2 | Not supported: Gen 1/Gen 2
Disk: 4K logical and 512-bytes physical sector | Yes |  Yes
Logical volume management (LVM). LVM is supported on data disks only. Azure provides only a single OS disk. | Yes | Yes
Volume with striped disk >1 TB | Yes | Yes
Storage Spaces/ Storage Spaces Direct (S2D) | No | No
Hot add/remove disk | No | No
Exclude disk | Yes | Yes
Multi-path (MPIO) | Yes | Yes

## Azure Storage

**Component** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
Locally redundant storage | Yes | Yes
Geo-redundant storage | Yes | Yes
Read-access geo-redundant storage | Yes | Yes
Zone-redundant storage | No | No
Cool storage | No | No
Hot storage| No | No
Block blobs | No | No
Encryption at host | No | No
Encryption at rest (SSE)| Yes | Yes
Encryption at rest (CMK) <br></br> (Only for failover to managed disks)| Yes (via PowerShell Az 3.3.0 module onwards) | Yes (via PowerShell Az 3.3.0 module onwards)
Double Encryption at rest <br></br> (Only for failover to managed disks) <br></br> Learn more on supported regions for [Windows](/azure/virtual-machines/disk-encryption) and [Linux](/azure/virtual-machines/disk-encryption) | Yes (via PowerShell Az 3.3.0 module onwards) | Yes (via PowerShell Az 3.3.0 module onwards)
Premium storage | Yes | Yes
Standard storage | Yes | Yes
Import/Export service | No | No
Azure Storage accounts with firewall enabled | Yes. For target storage and cache. | Yes. For target storage and cache.
Modify storage account | No. The target Azure Storage account can't be modified after enabling replication. To modify, disable and then re-enable disaster recovery. | No
Secure transfer option | Yes | Yes
UEFI Secure boot | No | No

> [!NOTE]
> Striped volumes and dynamic disks are not supported for app-consistent snapshots. Ensure that the frequency for app-consistent snapshot is set to zero in the selected replication policy. 

## Azure compute features

**Feature** | **Hyper-V with Virtual Machine Manager** | **Hyper-V without Virtual Machine Manager**
--- | --- | ---
Availability sets | Yes | Yes
Availability zones | No | No
HUB | Yes | Yes
Managed disks | Yes, for both failover and failback. | Yes, both failover and failback.

## Azure VM requirements

On-premises VMs that you replicate to Azure must meet the Azure VM requirements summarized in this table.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Site Recovery supports all operating systems that are [supported by Azure](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc794868(v=ws.10)).  | Prerequisites check fails if unsupported.
Guest operating system architecture | 32-bit (Windows Server 2008)/64-bit | Prerequisites check fails if unsupported.
Operating system disk size | Up to 2 TB for generation 1 VMs.<br/><br/> Up to 4 TB for generation 2 VMs. <br/><br/> You will need to upgrade the replication provider on the Hyper-V host to any version after 2.0.9214.0 to replicate large OS disks. For large disks, replication will happen to managed disks only. | Prerequisites check fails if unsupported.
Operating system disk count | 1 | Prerequisites check fails if unsupported.
Data disk count | 16 or less  | Prerequisites check fails if unsupported.
Data disk VHD size | Up to 32 TB <br/><br/> You will need to upgrade the replication provider on the Hyper-V host to any version after 2.0.9214.0 to replicate large disks. For large disks, replication will happen to managed disks only. | Prerequisites check fails if unsupported.
Network adapters | Multiple adapters are supported |
Shared VHD | Not supported | Prerequisites check fails if unsupported.
FC disk | Not supported | Prerequisites check fails if unsupported.
Hard disk format | VHD <br/><br/> VHDX | Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises, the virtual machines continue to use the VHDX format.
BitLocker | Not supported | BitLocker must be disabled before you enable replication for a VM.
VM name | Between 1 and 63 characters. Restricted to letters, numbers, and hyphens. The VM name must start and end with a letter or number. | Update the value in the VM properties in Site Recovery.
VM type | Generation 1<br/><br/> Generation 2 | Generation 2 VMs with an OS disk type of basic (which includes one or two data volumes formatted as VHDX) and less than 2 TB of disk space are supported. |

## Recovery Services vault actions

**Action** |  **Hyper-V with VMM** | **Hyper-V without VMM**
--- | --- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No | No

> [!NOTE]
> When replicating Hyper-VMs  from on-premises to Azure, you can replicate to only one AD tenant from one specific environment - Hyper-V site or Hyper-V with VMM as applicable.

## Provider and agent

To make sure your deployment is compatible with settings in this article, make sure you're running the latest provider and agent versions.

**Name** | **Description** | **Details**
--- | --- | ---
Azure Site Recovery provider | Coordinates communications between on-premises servers and Azure <br/><br/> Hyper-V with Virtual Machine Manager: Installed on Virtual Machine Manager servers<br/><br/> Hyper-V without Virtual Machine Manager: Installed on Hyper-V hosts| [Latest features and fixes](./site-recovery-whats-new.md)
Microsoft Azure Recovery Services agent | Coordinates replication between Hyper-V VMs and Azure<br/><br/> Installed on on-premises Hyper-V servers (with or without Virtual Machine Manager) | Latest agent available from the portal

## Next steps

Learn how to [prepare Azure](tutorial-prepare-azure-for-hyperv.md) for disaster recovery of on-premises Hyper-V VMs.
