---
title: Support matrix for Azure VM disaster recovery with Azure Site Recovery
description: Summarizes support for Azure VMs disaster recovery to a secondary region with Azure Site Recovery.
ms.topic: article
ms.date: 06/03/2020
ms.author: raynew
---

# Support matrix for Azure VM disaster recovery between Azure regions

This article summarizes support and prerequisites for disaster recovery of Azure VMs from one Azure region to another, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Deployment method support

**Deployment** |  **Support**
--- | ---
**Azure portal** | Supported.
**PowerShell** | Supported. [Learn more](azure-to-azure-powershell.md)
**REST API** | Supported.
**CLI** | Not currently supported


## Resource support

**Resource action** | **Details**
--- | ---
**Move vaults across resource groups** | Not supported
**Move compute/storage/network resources across resource groups** | Not supported.<br/><br/> If you move a VM or associated components such as storage/network after the VM is replicating, you need to disable and then re-enable replication for the VM.
**Replicate Azure VMs from one subscription to another for disaster recovery** | Supported within the same Azure Active Directory tenant.
**Migrate VMs across regions within supported geographical clusters (within and across subscriptions)** | Supported within the same Azure Active Directory tenant.
**Migrate VMs within the same region** | Not supported.

## Region support

You can replicate and recover VMs between any two regions within the same geographic cluster. Geographic clusters are defined keeping data latency and sovereignty in mind.


**Geographic cluster** | **Azure regions**
-- | --
America | Canada East, Canada Central, South Central US, West Central US, East US, East US 2, West US, West US 2, Central US, North Central US
Europe | UK West, UK South, North Europe, West Europe, South Africa West, South Africa North, Norway East, Norway West
Asia | South India, Central India, West India, Southeast Asia, East Asia, Japan East, Japan West, Korea Central, Korea South
Australia    | Australia East, Australia Southeast, Australia Central, Australia Central 2
Azure Government    | US GOV Virginia, US GOV Iowa, US GOV Arizona, US GOV Texas, US DOD East, US DOD Central
Germany    | Germany Central, Germany Northeast
China | China East, China North, China North2, China East2
Restricted Regions reserved for in-country disaster recovery |Germany North reserved for Germany West Central, Switzerland West reserved for Switzerland North, France South reserved for France Central, UAE Central restricted for UAE North customers

>[!NOTE]
>
> - For **Brazil South**, you can replicate and fail over to these regions: South Central US, West Central US, East US, East US 2, West US, West US 2, and North Central US.
> - Brazil South can only be used as a source region from which VMs can replicate using Site Recovery. It can't act as a target region. This is because of latency issues due to geographical distances. Note that if you fail over from Brazil South as a source region to a target, failback to Brazil South from the target region is supported.
> - You can work within regions for which you have appropriate access.
> - If the region in which you want to create a vault doesn't show, make sure your subscription has access to create resources in that region.
> - If you can't see a region within a geographic cluster when you enable replication, make sure your subscription has permissions to create VMs in that region.



## Cache storage

This table summarizes support for the cache storage account used by Site Recovery during replication.

**Setting** | **Support** | **Details**
--- | --- | ---
General purpose V2 storage accounts (Hot and Cool tier) | Supported | Usage of GPv2 is not recommended because transaction costs for V2 are substantially higher than V1 storage accounts.
Premium storage | Not supported | Standard storage accounts are used for cache storage, to help optimize costs.
Azure Storage firewalls for virtual networks  | Supported | If you are using firewall enabled cache storage account or target storage account, ensure you ['Allow trusted Microsoft services'](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions).<br></br>Also, ensure that you allow access to at least one subnet of source Vnet.


## Replicated machine operating systems

Site Recovery supports replication of Azure VMs running the operating systems listed in this section. Please note that if an already replicating machine is subsequently upgraded (or downgraded) to a different major kernel, you need to disable replication and re-enable replication after the upgrade.

### Windows


**Operating system** | **Details**
--- | ---
Windows Server 2019 | Supported for Server Core, Server with Desktop Experience.
Windows Server 2016  | Supported Server Core, Server with Desktop Experience.
Windows Server 2012 R2 | Supported.
Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1/SP2 | Supported.<br/><br/> From version [9.30](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows Server 2008 R2 SP1/SP2.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).
Windows 10 (x64) | Supported.
Windows 8.1 (x64) | Supported.
Windows 8 (x64) | Supported.
Windows 7 (x64) with SP1 onwards | From version [9.30](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery) of the Mobility service extension for Azure VMs, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows 7 with SP1.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected.. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).



#### Linux

**Operating system** | **Details**
--- | ---
Red Hat Enterprise Linux | 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6,[7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [7.8](https://support.microsoft.com/help/4564347/), [8.0](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1
CentOS | 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, [7.8](https://support.microsoft.com/help/4564347/), 8.0, 8.1
Ubuntu 14.04 LTS Server | [Supported kernel versions](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
Ubuntu 16.04 LTS Server | [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)<br/><br/> Ubuntu servers using password-based authentication and sign in, and the cloud-init package to configure cloud VMs, might have password-based sign in disabled on failover (depending on the cloudinit configuration). Password-based sign in can be re-enabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu (of the failed over VM in the Azure portal.
Ubuntu 18.04 LTS Server | [Supported kernel version](#supported-ubuntu-kernel-versions-for-azure-virtual-machines)
Debian 7 | Includes support for all 7. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
Debian 8 | Includes support for all 8. *x* versions [Supported kernel versions](#supported-debian-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 12 | SP1, SP2, SP3, SP4, SP5  [(Supported kernel versions)](#supported-suse-linux-enterprise-server-12-kernel-versions-for-azure-virtual-machines) </br> (**SP5 is available through latest patch of 9.33 for Azure to Azure DR scenario).
SUSE Linux Enterprise Server 15 | 15 and 15 SP1. [(Supported kernel versions)](#supported-suse-linux-enterprise-server-15-kernel-versions-for-azure-virtual-machines)
SUSE Linux Enterprise Server 11 | SP3<br/><br/> Upgrade of replicating machines from SP3 to SP4 isn't supported. If a replicated machine has been upgraded, you need to disable replication and re-enable replication after the upgrade.
SUSE Linux Enterprise Server 11 | SP4
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/en-us/help/4531426/update-rollup-42-for-azure-site-recovery) <br/><br/> Running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4 & 5 (UEK3, UEK4, UEK5)

**Note: To support latest Linux kernels within 30 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

#### Supported Ubuntu kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | 9.32, [9.33](https://support.microsoft.com/help/4564347/)| 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
14.04 LTS | 9.31 | 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
14.04 LTS | 9.30 | 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
14.04 LTS | 9.29 | 3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure |
|||
16.04 LTS | [9.33](https://support.microsoft.com/help/4564347/) | 4.4.0-21-generic to 4.4.0-178-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-99-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1082-azure </br> 4.15.0-101-generic & 4.4.0-179-generic through 9.33 hot fix patch**|
16.04 LTS | 9.32 | 4.4.0-21-generic to 4.4.0-171-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-74-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1066-azure|
16.04 LTS | 9.31 | 4.4.0-21-generic to 4.4.0-170-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-72-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1063-azure|
16.04 LTS | [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) | 4.4.0-21-generic to 4.4.0-166-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-66-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1061-azure|
16.04 LTS | 9.29 | 4.4.0-21-generic to 4.4.0-164-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-64-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1059-azure|
|||
18.04 LTS | [9.33](https://support.microsoft.com/help/4564347/) | 4.15.0-20-generic to 4.15.0-99-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-47-generic </br> 5.3.0-19-generic to 5.3.0-51-generic </br> 4.15.0-1009-azure to 4.15.0-1082-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1036-azure </br> 5.3.0-1007-azure to 5.3.0-1020-azure </br> 4.15.0-101-generic, 5.0.0-48-generic, 5.3.0-1022-azure & 5.3.0-53-generic through 9.33 hot fix patch**|
18.04 LTS | 9.32| 4.15.0-20-generic to 4.15.0-74-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-37-generic </br> 5.3.0-19-generic to 5.3.0-24-generic </br> 4.15.0-1009-azure to 4.15.0-1037-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1028-azure </br> 5.3.0-1007-azure to 5.3.0-1009-azure|
18.04 LTS | 9.31| 4.15.0-20-generic to 4.15.0-72-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-37-generic </br> 5.3.0-19-generic to 5.3.0-24-generic </br> 4.15.0-1009-azure to 4.15.0-1037-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1025-azure </br> 5.3.0-1007-azure|
18.04 LTS | [9.30](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) | 4.15.0-20-generic to 4.15.0-66-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-32-generic </br> 4.15.0-1009-azure to 4.15.0-1037-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1023-azure|
18.04 LTS | [9.29](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery) | 4.15.0-20-generic to 4.15.0-64-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-29-generic </br> 4.15.0-1009-azure to 4.15.0-1037-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1020-azure|

**Note: To support latest Linux kernels within 30 days of release, Azure Site Recovery rolls out hot fix patch on top of latest mobility agent version. This fix is rolled out in between two major version releases. To update to latest version of mobility agent (including hot fix patch) follow steps mentioned in [this article](service-updates-how-to.md#azure-vm-disaster-recovery-to-azure). This patch is currently rolled out for mobility agents used in Azure to Azure DR scenario.

#### Supported Debian kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | 9.28,9.29,9.30,9.31, 9.32, [9.33](https://support.microsoft.com/help/4564347/) | 3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 |
|||
Debian 8 | 9.29,9.30,9.31, 9.32, [9.33](https://support.microsoft.com/help/4564347/) | 3.16.0-4-amd64 to 3.16.0-10-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.11-amd64 |
Debian 8 | 9.28 | 3.16.0-4-amd64 to 3.16.0-10-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.9-amd64 |

#### Supported SUSE Linux Enterprise Server 12 kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | 9.32, [9.33](https://support.microsoft.com/help/4564347/) | All stock SUSE 12 SP1,SP2,SP3,SP4 kernels are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.34-azure  |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4, SP5) | 9.33 hot fix patch | All stock SUSE 12 SP1,SP2,SP3,SP4 kernels are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.34-azure </br> 4.12.14-16.10-azure to 4.12.14-16.7-azure  |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | 9.31 | All stock SUSE 12 SP1,SP2,SP3,SP4 kernels are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.29-azure  |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | 9.30 | All stock SUSE 12 SP1,SP2,SP3,SP4 kernels are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.29-azure  |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | 9.29 | All stock SUSE 12 SP1,SP2,SP3,SP4 kernels are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.23-azure  |

#### Supported SUSE Linux Enterprise Server 15 kernel versions for Azure virtual machines

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 15 and 15 SP1 | [9.33](https://support.microsoft.com/help/4564347/) | By default, all [stock SUSE 15 and 15 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-5.47-azure </br></br> 4.12.14-8.5-azure to 4.12.14-8.30-azure |
SUSE Linux Enterprise Server 15 and 15 SP1 | 9.32 | By default, all [stock SUSE 15 and 15 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-8.22-azure |


## Replicated machines - Linux file system/guest storage

* File systems: ext3, ext4, XFS, BTRFS
* Volume manager: LVM2
* Multipath software: Device Mapper


## Replicated machines - compute settings

**Setting** | **Support** | **Details**
--- | --- | ---
Size | Any Azure VM size with at least 2 CPU cores and 1-GB RAM | Verify [Azure virtual machine sizes](../virtual-machines/windows/sizes.md).
Availability sets | Supported | If you enable replication for an Azure VM with the default options, an availability set is created automatically, based on the source region settings. You can modify these settings.
Availability zones | Supported |
Hybrid Use Benefit (HUB) | Supported | If the source VM has a HUB license enabled, a test failover or failed over VM also uses the HUB license.
Virtual machine scale sets | Not supported |
Azure gallery images - Microsoft published | Supported | Supported if the VM runs on a supported operating system.
Azure Gallery images - Third party published | Supported | Supported if the VM runs on a supported operating system.
Custom images - Third party published | Supported | Supported if the VM runs on a supported operating system.
VMs migrated using Site Recovery | Supported | If a VMware VM or physical machine was migrated to Azure using Site Recovery, you need to uninstall the older version of Mobility service running on the machine, and restart the machine before replicating it to another Azure region.
RBAC policies | Not supported | Role based Access control (RBAC) policies on VMs are not replicated to the failover VM in target region.
Extensions | Not supported | Extensions are not replicated to the failover VM in target region. It needs to be installed manually after failover.
Proximity Placement Groups | Not supported | Virtual machines located inside a Proximity Placement Group cannot be protected using Site Recovery.


## Replicated machines - disk actions

**Action** | **Details**
-- | ---
Resize disk on replicated VM | Supported on the source VM before failover. No need to disable/re-enable replication.<br/><br/> If you change the source VM after failover, the changes aren't captured.<br/><br/> If you change the disk size on the Azure VM after failover, changes aren't captured by Site Recovery, and failback will be to the original VM size.
Add a disk to a replicated VM | Supported

## Replicated machines - storage

This table summarized support for the Azure VM OS disk, data disk, and temporary disk.

- It's important to observe the VM disk limits and targets for [Linux](../virtual-machines/linux/disk-scalability-targets.md) and [Windows](../virtual-machines/windows/disk-scalability-targets.md) VMs to avoid any performance issues.
- If you deploy with the default settings, Site Recovery automatically creates disks and storage accounts based on the source settings.
- If you customize, ensure you follow the guidelines.

**Component** | **Support** | **Details**
--- | --- | ---
OS disk maximum size | 2048 GB | [Learn more](../virtual-machines/windows/managed-disks-overview.md) about VM disks.
Temporary disk | Not supported | The temporary disk is always excluded from replication.<br/><br/> Don't store any persistent data on the temporary disk. [Learn more](../virtual-machines/windows/managed-disks-overview.md).
Data disk maximum size | 8192 GB for managed disks<br></br>4095 GB for unmanaged disks|
Data disk minimum size | No restriction for unmanaged disks. 2 GB for managed disks |
Data disk maximum number | Up to 64, in accordance with support for a specific Azure VM size | [Learn more](../virtual-machines/windows/sizes.md) about VM sizes.
Data disk change rate | Maximum of 10 MBps per disk for premium storage. Maximum of 2 MBps per disk for Standard storage. | If the average data change rate on the disk is continuously higher than the maximum, replication won't catch up.<br/><br/>  However, if the maximum is exceeded sporadically, replication can catch up, but you might see slightly delayed recovery points.
Data disk - standard storage account | Supported |
Data disk - premium storage account | Supported | If a VM has disks spread across premium and standard storage accounts, you can select a different target storage account for each disk, to ensure you have the same storage configuration in the target region.
Managed disk - standard | Supported in Azure regions in which Azure Site Recovery is supported. |
Managed disk - premium | Supported in Azure regions in which Azure Site Recovery is supported. |
Standard SSD | Supported |
Redundancy | LRS and GRS are supported.<br/><br/> ZRS isn't supported.
Cool and hot storage | Not supported | VM disks aren't supported on cool and hot storage
Storage Spaces | Supported |
Encryption at rest (SSE) | Supported | SSE is the default setting on storage accounts.
Encryption at rest (CMK) | Supported | Both Software and HSM keys are supported for managed disks
Azure Disk Encryption (ADE) for Windows OS | Supported for VMs with managed disks. | VMs using unmanaged disks are not supported. <br/><br/> HSM-protected keys are not supported. <br/><br/> Encryption of individual volumes on a single disk is not supported. |
Azure Disk Encryption (ADE) for Linux OS | Supported for VMs with managed disks. | VMs using unmanaged disks are not supported. <br/><br/> HSM-protected keys are not supported. <br/><br/> Encryption of individual volumes on a single disk is not supported. |
Hot add    | Supported | Enabling replication for a data disk that you add to a replicated Azure VM is supported for VMs that use managed disks. <br/><br/> Only one disk can be hot added to an Azure VM at a time. Parallel addition of multiple disks is not supported. |
Hot remove disk    | Not supported | If you  remove data disk on the VM, you need to disable replication and enable replication again for the VM.
Exclude disk | Support. You must use [PowerShell](azure-to-azure-exclude-disks.md) to configure. |    Temporary disks are excluded by default.
Storage Spaces Direct  | Supported for crash consistent recovery points. Application consistent recovery points are not supported. |
Scale-out File Server  | Supported for crash consistent recovery points. Application consistent recovery points are not supported. |
DRBD | Disks that are part of a DRBD setup are not supported. |
LRS | Supported |
GRS | Supported |
RA-GRS | Supported |
ZRS | Not supported |
Cool and Hot Storage | Not supported | Virtual machine disks are not supported on cool and hot storage
Azure Storage firewalls for virtual networks  | Supported | If restrict virtual network access to storage accounts, enable [Allow trusted Microsoft services](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions).
General purpose V2 storage accounts (Both Hot and Cool tier) | Supported | Transaction costs increase substantially compared to General purpose V1 storage accounts
Generation 2 (UEFI boot) | Supported
NVMe disks | Not supported

>[!IMPORTANT]
> To avoid performance issues, make sure that you follow VM disk scalability and performance targets for [Linux](../virtual-machines/linux/disk-scalability-targets.md) or [Windows](../virtual-machines/windows/disk-scalability-targets.md) VMs. If you use default settings, Site Recovery creates the required disks and storage accounts, based on the source configuration. If you customize and select your own settings,follow the disk scalability and performance targets for your source VMs.

## Limits and data change rates

The following table summarizes Site Recovery limits.

- These limits are based on our tests, but obviously don't cover all possible application I/O combinations.
- Actual results can vary based on you app I/O mix.
- There are two limits to consider, per disk data churn and per virtual machine data churn.

**Storage target** | **Average source disk I/O** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |    336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB    | 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk

## Replicated machines - networking
**Setting** | **Support** | **Details**
--- | --- | ---
NIC | Maximum number supported for a specific Azure VM size | NICs are created when the VM is created during failover.<br/><br/> The number of NICs on the failover VM depends on the number of NICs on the source VM when replication was enabled. If you add or remove a NIC after enabling replication, it doesn't impact the number of NICs on the replicated VM after failover. <br/><br/> The order of NICs after failover is not guaranteed to be the same as the original order. <br/><br/> You can rename NICs in the target region based on your organization's naming conventions.
Internet Load Balancer | Supported | Associate the preconfigured load balancer using an Azure Automation script in a recovery plan.
Internal Load balancer | Supported | Associate the preconfigured load balancer using an Azure Automation script in a recovery plan.
Public IP address | Supported | Associate an existing public IP address with the NIC. Or, create a public IP address and associate it with the NIC using an Azure Automation script in a recovery plan.
NSG on NIC | Supported | Associate the NSG with the NIC using an Azure Automation script in a recovery plan.
NSG on subnet | Supported | Associate the NSG with the subnet using an Azure Automation script in a recovery plan.
Reserved (static) IP address | Supported | If the NIC on the source VM has a static IP address, and the target subnet has the same IP address available, it's assigned to the failed over VM.<br/><br/> If the target subnet doesn't have the same IP address available, one of the available IP addresses in the subnet is reserved for the VM.<br/><br/> You can also specify a fixed IP address and subnet in **Replicated items** > **Settings** > **Compute and Network** > **Network interfaces**.
Dynamic IP address | Supported | If the NIC on the source has dynamic IP addressing, the NIC on the failed over VM is also dynamic by default.<br/><br/> You can modify this to a fixed IP address if required.
Multiple IP addresses | Not supported | When you fail over a VM that has a NIC with multiple IP addresses, only the primary IP address of the NIC in the source region is kept. To assign multiple IP addresses, you can add VMs to a [recovery plan](recovery-plan-overview.md) and attach a script to assign additional IP addresses to the plan, or you can make the change manually or with a script after failover.
Traffic Manager     | Supported | You can preconfigure Traffic Manager so that traffic is routed to the endpoint in the source region on a regular basis, and to the endpoint in the target region in case of failover.
Azure DNS | Supported |
Custom DNS    | Supported |
Unauthenticated proxy | Supported | [Learn more](site-recovery-azure-to-azure-networking-guidance.md)
Authenticated Proxy | Not supported | If the VM is using an authenticated proxy for outbound connectivity, it cannot be replicated using Azure Site Recovery.
VPN site-to-site connection to on-premises<br/><br/>(with or without ExpressRoute)| Supported | Ensure that the UDRs and NSGs are configured in such a way that the Site Recovery traffic is not routed to on-premises. [Learn more](site-recovery-azure-to-azure-networking-guidance.md)
VNET to VNET connection    | Supported | [Learn more](site-recovery-azure-to-azure-networking-guidance.md)
Virtual Network Service Endpoints | Supported | If you are restricting the virtual network access to storage accounts, ensure that the trusted Microsoft services are allowed access to the storage account.
Accelerated networking | Supported | Accelerated networking must be enabled on source VM. [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).
Palo Alto Network Appliance | Not supported | With third party appliances, there are often restrictions imposed by the provider inside the Virtual Machine. Azure Site Recovery needs agent, extensions and outbound connectivity to be available. But the appliance does not let any outbound activity to be configured inside the Virtual Machine.
IPv6  | Not supported | Mixed configurations that include both IPv4 and IPv6 are also not supported. Please free up the subnet of the IPv6 range before any Site Recovery operation.



## Next steps
- Read [networking guidance](site-recovery-azure-to-azure-networking-guidance.md)  for replicating Azure VMs.
- Deploy disaster recovery by [replicating Azure VMs](site-recovery-azure-to-azure.md).
