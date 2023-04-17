---
title: Support matrix for moving Azure VMs to another region with Azure Resource Mover
description: Review support for moving Azure VMs between regions with Azure Resource Mover. 
author: ankitaduttaMSFT
manager: evansma
ms.service: resource-mover
ms.topic: how-to
ms.date: 03/21/2023
ms.author: ankitadutta
ms.custom: engagement-fy23, UpdateFrequency.5

---

# Support for moving Azure VMs between Azure regions

This article summarizes support and prerequisites when you move virtual machines and related network resources across Azure regions using Resource Mover.

## Windows VM support

Resource Mover supports Azure VMs running these Windows operating systems.

**Operating system** | **Details**
--- | ---
Windows Server 2019 | Supported for Server Core, Server with Desktop Experience.
Windows Server 2016  | Supported Server Core, Server with Desktop Experience.
Windows Server 2012 R2 | Supported.
Windows Server 2012 | Supported.
Windows Server 2008 R2 with SP1/SP2 | Supported.<br/><br/> For machines running Windows Server 2008 R2 with SP1/SP2, you need to install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419).  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the agent extension won't install/upgrade as expected. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).
Windows 10 (x64) | Supported.
Windows 8.1 (x64) | Supported.
Windows 8 (x64) | Supported.
Windows 7 (x64) with SP1 onwards | Install a Windows [servicing stack update (SSU)](https://support.microsoft.com/help/4490628) and [SHA-2 update](https://support.microsoft.com/help/4474419) on machines running Windows 7 with SP1.  SHA-1 isn't supported from September 2019, and if SHA-2 code signing isn't enabled the 'prepare' step will not succeed. Learn more about [SHA-2 upgrade and requirements](https://aka.ms/SHA-2KB).


## Linux VM support

Resource Move supports Azure VMs running these Linux operating systems.

**Operating system** | **Details**
--- | ---
Red Hat Enterprise Linux | 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6,[7.7](https://support.microsoft.com/help/4528026/update-rollup-41-for-azure-site-recovery), [8.0](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery), 8.1
CentOS | 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.0, 8.1
Ubuntu 14.04 LTS Server | [Supported kernel versions](#supported-ubuntu-kernel-versions)
Ubuntu 16.04 LTS Server | [Supported kernel version](#supported-ubuntu-kernel-versions)<br/><br/> Ubuntu servers using password-based authentication and sign-in, and the cloud-init package to configure cloud VMs, might have password-based sign-in disabled on failover (depending on the cloud-init configuration). Password-based sign-in can be reenabled on the virtual machine by resetting the password from the Support > Troubleshooting > Settings menu (of the failed over VM in the Azure portal.
Ubuntu 18.04 LTS Server | [Supported kernel version](#supported-ubuntu-kernel-versions).
Debian 7 | [Supported kernel versions](#supported-debian-kernel-versions).
Debian 8 | [Supported kernel versions](#supported-debian-kernel-versions).
SUSE Linux Enterprise Server 12 | SP1, SP2, SP3, SP4. [Supported kernel versions](#supported-suse-linux-enterprise-server-12-kernel-versions)
SUSE Linux Enterprise Server 15 | 15 and 15 SP1. [(Supported kernel versions)](#supported-suse-linux-enterprise-server-15-kernel-versions)
SUSE Linux Enterprise Server 11 | SP3
SUSE Linux Enterprise Server 11 | SP4
Oracle Linux | 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, [7.7](https://support.microsoft.com/help/4531426/update-rollup-42-for-azure-site-recovery) <br/><br/> Running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4 & 5 (UEK3, UEK4, UEK5)


### Supported Ubuntu kernel versions

**Release** | **Kernel version** 
--- | --- 
14.04 LTS |  3.13.0-24-generic to 3.13.0-170-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-148-generic,<br/>4.15.0-1023-azure to 4.15.0-1045-azure 
16.04 LTS |  4.4.0-21-generic to 4.4.0-171-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-74-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1066-azure
18.04 LTS | 4.15.0-20-generic to 4.15.0-74-generic </br> 4.18.0-13-generic to 4.18.0-25-generic </br> 5.0.0-15-generic to 5.0.0-37-generic </br> 5.3.0-19-generic to 5.3.0-24-generic </br> 4.15.0-1009-azure to 4.15.0-1037-azure </br> 4.18.0-1006-azure to 4.18.0-1025-azure </br> 5.0.0-1012-azure to 5.0.0-1028-azure </br> 5.3.0-1007-azure to 5.3.0-1009-azure


### Supported Debian kernel versions 

**Release** |  **Kernel version** 
--- |  --- 
Debian 7 |  3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 
Debian 8 |  3.16.0-4-amd64 to 3.16.0-10-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.11-amd64 
Debian 8 |  3.16.0-4-amd64 to 3.16.0-10-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.9-amd64

### Supported SUSE Linux Enterprise Server 12 kernel versions 

**Release** | **Kernel version** 
--- |  --- 
SUSE Linux Enterprise Server 12 (SP1, SP2, SP3, SP4) |  All [stock SUSE 12 SP1,SP2,SP3,SP4 kernels](https://www.suse.com/support/kb/doc/?id=000019587) are supported.</br></br> 4.4.138-4.7-azure to 4.4.180-4.31-azure,</br>4.12.14-6.3-azure to 4.12.14-6.34-azure  


### Supported SUSE Linux Enterprise Server 15 kernel versions

**Release** | **Kernel version** |
--- |  --- |
SUSE Linux Enterprise Server 15 and 15 SP1 |  All stock SUSE 15 and 15 kernels are supported.</br></br> 4.12.14-5.5-azure to 4.12.14-8.22-azure |

## Supported Linux file system/guest storage

* File systems: ext3, ext4, XFS, BTRFS
* Volume manager: LVM2
* Multipath software: Device Mapper


## Supported VM compute settings

**Setting** | **Support** | **Details**
--- | --- | ---
Size | Any Azure VM size with at least two CPU cores and 1-GB RAM | Verify [Azure virtual machine sizes](../virtual-machines/sizes-general.md).
Availability sets | Supported | Supported.
Availability zones | Supported | Supported, depending on target region support.
Azure gallery images (published by Microsoft) | Supported | Supported if the VM runs on a supported operating system.
Azure Gallery images (published by third party)  | Supported | Supported if the VM runs on a supported operating system.
Custom images (published by third party)| Supported | Supported if the VM runs on a supported operating system.
VMs using Site Recovery | Not supported | Move resources across regions for VMs, using Site Recovery on the backend. If you're already using Site Recovery, disable replication, and then start the Prepare process.
Azure RBAC policies | Not supported | Azure role-based access control (Azure RBAC) policies on VMs aren't copied over to the VM in target region.
Extensions | Not supported | Extensions aren't copied over to the  VM in target region. Install them manually after the move is complete.


## Supported VM storage settings

This table summarized support for the Azure VM OS disk, data disk, and temporary disk. It's important to observe the VM disk limits and targets for [managed disks](../virtual-machines/disks-scalability-targets.md) to avoid any performance issues.

> [!NOTE]
> The target VM size should be equal to or larger than the source VM. The parameters used for validation are: Data Disks Count, NICs count, Available CPUs, Memory in GB. If it sn't a error is issued.


**Component** | **Support** | **Details**
--- | --- | ---
OS disk maximum size | 2048 GB | [Learn more](../virtual-machines/managed-disks-overview.md) about VM disks.
Temporary disk | Not supported | The temporary disk is always excluded from the prepare process.<br/><br/> Don't store any persistent data on the temporary disk. [Learn more](../virtual-machines/managed-disks-overview.md#temporary-disk).
Data disk maximum size | 8192 GB for managed disks
Data disk minimum size |  2 GB for managed disks |
Data disk maximum number | Up to 64, in accordance with support for a specific Azure VM size | [Learn more](../virtual-machines/sizes.md) about VM sizes.
Data disk change rate | Maximum of 10 MBps per disk for premium storage. Maximum of 2 MBps per disk for Standard storage. | If the average data change rate on the disk is continuously higher than the maximum, the preparation won't catch up.<br/><br/>  However, if the maximum is exceeded sporadically, preparation can catch up, but you might see slightly delayed recovery points.
Data disk (Standard storage account) | Not supported. | Change the storage type to managed disk, and then try moving the VM.
Data disk (Premium storage account) | Not supported | Change the storage type to managed disk, and then try moving the VM.
Managed disk (Standard) | Supported  |
Managed disk (Premium) | Supported |
Standard SSD | Supported |
Generation 2 (UEFI boot) | Supported
Boot diagnostics storage account | Not supported | Reenable it after moving the VM to the target region.
VMs with Azure disk encryption enabled | Supported | [Learn more](tutorial-move-region-encrypted-virtual-machines.md)
VMs using server-side encryption with customer-managed key | Supported | [Learn more](tutorial-move-region-encrypted-virtual-machines.md)

### Limits and data change rates

The following table summarizes limits that based on our tests. These  don't cover all possible application I/O combinations. Actual results vary based on your application I/O mix. There are two limits to consider, per disk data churn, and per VM data churn.

**Storage target** | **Average source disk I/O** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB    | 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |    336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB    | 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk

## Supported VM networking settings

**Setting** | **Support** | **Details**
--- | --- | ---
NIC | Supported | Specify an existing resource in the target region, or  create a new resource during the Prepare process. 
Internal load balancer | Supported | Specify an existing resource in the target region, or create a new resource during the Prepare process.  
Public load balancer | Supported | Specify an existing resource in the target region, or create a new resource during the Prepare process.  
Public IP address | Supported | Specify an existing resource in the target region, or create a new resource during the Prepare process.<br/><br/> The public IP address is region-specific, and won't be retained in the target region after the move. Keep this in mind when you modify networking settings (including load balancing rules) in the target location.
Network security group | Supported | Specify an existing resource in the target region, or create a new resource during the Prepare process.  
Reserved (static) IP address | Supported | You can't currently configure this. The value defaults to the source value. <br/><br/> If the NIC on the source VM has a static IP address, and the target subnet has the same IP address available, it's assigned to the target VM.<br/><br/> If the target subnet doesn't have the same IP address available, the initiate move for the VM will fail.
Dynamic IP address | Supported | You can't currently configure this. The value defaults to the source value.<br/><br/> If the NIC on the source has dynamic IP addressing, the NIC on the target VM is also dynamic by default.
IP configurations | Supported | You can't currently configure this. The value defaults to the source value.
VNET Peering | Not Retained | The VNET which is moved to the target region will not retain its VNET peering configuration present in the source region. To retain the peering, it needs to do be done again manually in the target region.

## Outbound access requirements

Azure VMs that you want to move need outbound access.


### URL access

 If you're using a URL-based firewall proxy to control outbound connectivity, allow access to these URLs:

**Name** | **Azure public cloud** | **Details** 
--- | --- | --- 
Storage | `*.blob.core.windows.net`  | Allows data to be written from the VM to the cache storage account in the source region. 
Azure Active Directory | `login.microsoftonline.com`  | Provides authorization and authentication to Site Recovery service URLs. 
Replication | `*.hypervrecoverymanager.windowsazure.com` | Allows the VM to communicate with the Site Recovery service. 
Service Bus | `*.servicebus.windows.net` | Allows the VM to write Site Recovery monitoring and diagnostics data. 

## NSG rules
If you're using a network security group (NSG) rules to control outbound connectivity, create these [service tag](../virtual-network/service-tags-overview.md) rules. Each rule should allow outbound access on HTTPS (443).
- Create a Storage tag rule for the source region.
- Create an *AzureSiteRecovery* tag rule, to allow access to the Site Recovery service in any region. This tag has dependencies on these other tags, so you need to create rules for them to:
    - *AzureActiveDirectory*
    - **EventHub*
    - *AzureKeyVault*
    - *GuestAndHybridManagement*
- We recommend you test rules in a non-production environment. [Review some examples](../site-recovery/azure-to-azure-about-networking.md#outbound-connectivity-using-service-tags). 

## Next steps

Try [moving an Azure VM](tutorial-move-region-virtual-machines.md) to another region with Resource Mover.
