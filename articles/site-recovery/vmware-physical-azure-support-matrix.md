---
title: Support matrix for disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery | Microsoft Docs
description: Summarizes the supported operating systems and components for disaster recovery of VMware VMs and physical server to Azure using Azure Site Recovery.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
services: site-recovery
ms.topic: conceptual
ms.date: 05/10/2019
ms.author: raynew

---
# Support matrix for disaster recovery  of VMware VMs and physical servers to Azure

This article summarizes supported components and settings for disaster recovery of VMware VMs to Azure by using [Azure Site Recovery](site-recovery-overview.md).

To start using Azure Site Recovery with the simplest deployment scenario, visit our [tutorials](tutorial-prepare-azure.md). You can learn more about Azure Site Recovery architecture [here](vmware-azure-architecture.md).

## Deployment scenario

**Scenario** | **Details**
--- | ---
Disaster recovery of VMware VMs | Replication of on-premises VMware VMs to Azure. You can deploy this scenario in the Azure portal or by using [PowerShell](vmware-azure-disaster-recovery-powershell.md).
Disaster recovery of physical servers | Replication of on-premises Windows/Linux physical servers to Azure. You can deploy this scenario in the Azure portal.

## On-premises virtualization servers

**Server** | **Requirements** | **Details**
--- | --- | ---
VMware | vCenter Server 6.7, 6.5, 6.0, or 5.5 or vSphere 6.7, 6.5, 6.0, or 5.5 | We recommend that you use a vCenter server.<br/><br/> We recommend that vSphere hosts and vCenter servers are located in the same network as the process server. By default the process server components runs on the configuration server, so this will be the network in which you set up the configuration server, unless you set up a dedicated process server.
Physical | N/A

## Site Recovery configuration server

The configuration server is an on-premises machine that runs Site Recovery components, including the configuration server, process server, and master target server. For VMware replication you set the configuration server up with all requirements, using an OVF template to create a VMware VM. For physical server replication, you set the configuration server machine up manually.

**Component** | **Requirements**
--- |---
CPU cores | 8
RAM | 16 GB
Number of disks | 3 disks<br/><br/> Disks include the OS disk, process server cache disk, and retention drive for failback.
Disk free space | 600 GB of space required for process server cache.
Disk free space | 600 GB  of space required for retention drive.
Operating system  | Windows Server 2012 R2 or Windows Server 2016 with Desktop experience |
Operating system locale | English (en-us)
PowerCLI | [PowerCLI 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1 "PowerCLI 6.0") is not required for configuration server with versions from [9.14](https://support.microsoft.com/help/4091311/update-rollup-23-for-azure-site-recovery).
Windows Server roles | Don't enable: <br/> - Active Directory Domain Services <br/>- Internet Information Services <br/> - Hyper-V |
Group policies| Don't enable: <br/> - Prevent access to the command prompt. <br/> - Prevent access to registry editing tools. <br/> - Trust logic for file attachments. <br/> - Turn on Script Execution. <br/> [Learn more](https://technet.microsoft.com/library/gg176671(v=ws.10).aspx)|
IIS | Make sure you:<br/><br/> - Don't have a preexisting default website <br/> - Enable  [anonymous authentication](https://technet.microsoft.com/library/cc731244(v=ws.10).aspx) <br/> - Enable [FastCGI](https://technet.microsoft.com/library/cc753077(v=ws.10).aspx) setting  <br/> - Don't have preexisting website/app listening on port 443<br/>
NIC type | VMXNET3 (when deployed as a VMware VM)
IP address type | Static
Ports | 443 used for control channel orchestration)<br/>9443 used for data transport

## Replicated machines

Site Recovery supports replication of any workload running on a supported machine.

**Component** | **Details**
--- | ---
Machine settings | Machines that replicate to Azure must meet [Azure requirements](#azure-vm-requirements).
Machine workload | Site Recovery supports replication of any workload (say Active Directory, SQL server etc.,) running on a supported machine. [Learn more](https://aka.ms/asr_workload).
Windows operating system | Windows Server 2019 (from [9.22 versions](service-updates-how-to.md#links-to-currently-supported-update-rollups)), 64-bit Windows Server 2016 (Server Core, Server with Desktop Experience), Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2 with at least SP1. </br> From, [9.24 versions](https://support.microsoft.com/en-in/help/4503156), 64-bit Windows 10, 64-bit Windows 8.1, 64-bit Windows 8, 64-bit Windows 7 (Windows 7 RTM is not supported)</br>  [Windows Server 2008 with at least SP2 - 32 bit and 64 bit](migrate-tutorial-windows-server-2008.md) (migration only). </br></br> Windows 2016 Nano Server isn't supported.
Linux operating system architecture | Only 64-bit system is supported. 32-bit system is not supported
Linux operating system | Red Hat Enterprise Linux: 5.2 to 5.11<b>\*\*</b>, 6.1 to 6.10<b>\*\*</b>, 7.0 to 7.6 <br/><br/>CentOS: 5.2 to 5.11<b>\*\*</b>, 6.1 to 6.10<b>\*\*</b>, 7.0 to 7.6 <br/><br/>Ubuntu 14.04 LTS server [(supported kernel versions)](#ubuntu-kernel-versions)<br/><br/>Ubuntu 16.04 LTS server [(supported kernel versions)](#ubuntu-kernel-versions)<br/><br/>Debian 7/Debian 8 [(supported kernel versions)](#debian-kernel-versions)<br/><br/>SUSE Linux Enterprise Server 12 SP1,SP2,SP3,SP4 [(supported kernel versions)](#suse-linux-enterprise-server-12-supported-kernel-versions)<br/><br/>SUSE Linux Enterprise Server 11 SP3<b>\*\*</b>, SUSE Linux Enterprise Server 11 SP4 * </br></br>Oracle Linux 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6 running the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3, 4 & 5 (UEK3, UEK4, UEK5) <br/><br/></br>-Upgrading replicated machines from SUSE Linux Enterprise Server 11 SP3 to SP4 isn't supported. To upgrade, disable replication and enable it again after the upgrade.</br></br> - [Learn more](https://support.microsoft.com/help/2941892/support-for-linux-and-open-source-technology-in-azure) about support for Linux and open source technology in Azure. Site Recovery orchestrates failover to run Linux servers in Azure. However Linux vendors might limit support to only distribution versions that haven't reached end-of-life.<br/><br/> - On Linux distributions, only the stock kernels that are part of the distribution minor version release/update are supported.<br/><br/> - Upgrading protected machines across major Linux distribution versions isn't supported. To upgrade, disable replication, upgrade the operating system, and then enable replication again.<br/><br/> - Servers running Red Hat Enterprise Linux 5.2-5.11 or CentOS 5.2-5.11 should have the [Linux Integration Services (LIS) components](https://www.microsoft.com/download/details.aspx?id=55106) installed for the machines to boot in Azure.


### Ubuntu kernel versions


**Supported release** | **Azure Site Recovery Mobility Service version** | **Kernel version** |
--- | --- | --- |
14.04 LTS | [9.24][9.24 UR] | 3.13.0-24-generic to 3.13.0-167-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-143-generic,<br/>4.15.0-1023-azure to 4.15.0-1040-azure |
14.04 LTS | [9.23][9.23 UR] | 3.13.0-24-generic to 3.13.0-165-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-142-generic,<br/>4.15.0-1023-azure to 4.15.0-1037-azure |
14.04 LTS | [9.22][9.22 UR] | 3.13.0-24-generic to 3.13.0-164-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-140-generic,<br/>4.15.0-1023-azure to 4.15.0-1036-azure |
14.04 LTS | [9.21][9.21 UR] | 3.13.0-24-generic to 3.13.0-163-generic,<br/>3.16.0-25-generic to 3.16.0-77-generic,<br/>3.19.0-18-generic to 3.19.0-80-generic,<br/>4.2.0-18-generic to 4.2.0-42-generic,<br/>4.4.0-21-generic to 4.4.0-140-generic,<br/>4.15.0-1023-azure to 4.15.0-1035-azure |
|||
16.04 LTS | [9.23][9.24 UR] | 4.4.0-21-generic to 4.4.0-143-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-46-generic<br/>4.11.0-1009-azure to 4.11.0-1018-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1040-azure|
16.04 LTS | [9.23][9.23 UR] | 4.4.0-21-generic to 4.4.0-142-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-45-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1037-azure|
16.04 LTS | [9.22][9.22 UR] | 4.4.0-21-generic to 4.4.0-140-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-43-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1036-azure|
16.04 LTS | [9.21][9.21 UR] | 4.4.0-21-generic to 4.4.0-140-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-42-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1035-azure|
16.04 LTS | [9.20][9.20 UR] | 4.4.0-21-generic to 4.4.0-138-generic,<br/>4.8.0-34-generic to 4.8.0-58-generic,<br/>4.10.0-14-generic to 4.10.0-42-generic,<br/>4.11.0-13-generic to 4.11.0-14-generic,<br/>4.13.0-16-generic to 4.13.0-45-generic,<br/>4.15.0-13-generic to 4.15.0-38-generic<br/>4.11.0-1009-azure to 4.11.0-1016-azure,<br/>4.13.0-1005-azure to 4.13.0-1018-azure <br/>4.15.0-1012-azure to 4.15.0-1025-azure|

### Debian kernel versions


**Supported release** | **Azure Site Recovery Mobility Service version** | **Kernel version** |
--- | --- | --- |
Debian 7 | [9.21][9.21 UR], [9.22][9.22 UR],[9.23][9.23 UR], [9.24][9.24 UR]| 3.2.0-4-amd64 to 3.2.0-6-amd64, 3.16.0-0.bpo.4-amd64 |
|||
Debian 8 | [9.21][9.21 UR],[9.22][9.22 UR],[9.23][9.23 UR], [9.24][9.24 UR] | 3.16.0-4-amd64 to 3.16.0-7-amd64, 4.9.0-0.bpo.4-amd64 to 4.9.0-0.bpo.8-amd64 |


### SUSE Linux Enterprise Server 12 supported kernel versions

**Release** | **Mobility service version** | **Kernel version** |
--- | --- | --- |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | [9.24][9.24 UR] | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.107-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.101-default</br></br>SP3 4.4.73-5-default to 4.4.175-94.79-default</br></br>SP4 4.12.14-94.41-default to 4.12.14-95.6-default |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3,SP4) | [9.23][9.23 UR] | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.107-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.101-default</br></br>SP3 4.4.73-5-default to 4.4.162-94.69-default</br></br>SP4  4.12.14-94.41-default to 4.12.14-95.6-default |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3) | [9.22][9.22 UR] | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.107-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.98-default</br></br>SP3 4.4.73-5-default to 4.4.162-94.72-default |
SUSE Linux Enterprise Server 12 (SP1,SP2,SP3) | [9.21][9.21 UR] | SP1 3.12.49-11-default to 3.12.74-60.64.40-default</br></br> SP1(LTSS) 3.12.74-60.64.45-default to 3.12.74-60.64.107-default</br></br> SP2 4.4.21-69-default to 4.4.120-92.70-default</br></br>SP2(LTSS) 4.4.121-92.73-default to 4.4.121-92.98-default</br></br>SP3 4.4.73-5-default to 4.4.156-94.72-default |


## Linux file systems/guest storage

**Component** | **Supported**
--- | ---
File systems | ext3, ext4, XFS
Volume manager | Before [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery), <br/> 1. LVM is supported. <br/> 2. /boot on LVM volume is not supported. <br/> 3. Multiple OS disks are not supported.<br/><br/>From [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery) onwards, /boot on LVM is supported. Multiple OS disks are not supported.
Paravirtualized storage devices | Devices exported by paravirtualized drivers aren't supported.
Multi-queue block IO devices | Not supported.
Physical servers with the HP CCISS storage controller | Not supported.
Device/Mount point naming convention | Device name or mount point name should be unique. Ensure that no two devices/mount points have case sensitive names. </br> Example: Naming two devices of same virtual machine as *device1* and *Device1* is not allowed.
Directories | Before [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery), <br/> 1. The following directories (if set up as separate partitions/file-systems) all must be on the same OS disk on the source server: /(root), /boot, /usr, /usr/local, /var, /etc.</br>2. /boot should be on a disk partition and not be an LVM volume.<br/><br/> From [9.20 version](https://support.microsoft.com/en-in/help/4478871/update-rollup-31-for-azure-site-recovery) onwards, above restrictions are not applicable. /boot on LVM volume across more than one disks is not supported.
Boot directory | Multiple boot disks on a virtual machine is not supported <br/><br/> A machine without boot disk cannot be protected
Free space requirements| 2 GB on the /root partition <br/><br/> 250 MB on the installation folder
XFSv5 | XFSv5 features on XFS file systems, such as metadata checksum, are supported from Mobility Service version 9.10 onward. Use the xfs_info utility to check the XFS superblock for the partition. If `ftype` is set to 1, then XFSv5 features are in use.
BTRFS |From 9.22 version, BTRFS is supported, except for following scenarios</br>If the BTRFS file system sub-volume is changed after enabling protection, BTRFS is not supported. </br>If the BTRFS file system is spread over multiple disks, BTRFS is not supported.</br>If the BTRFS file system supports RAID, BTRFS is not supported.

## VM/Disk management

**Action** | **Details**
--- | ---
Resize disk on replicated VM | Supported.
Add disk on replicated VM | Disable replication for the VM, add the disk, and then reenable replication. Adding a disk on a replicating VM isn't currently supported.

## Network

**Component** | **Supported**
--- | ---
Host network NIC Teaming | Supported for VMware VMs. <br/><br/>Not supported for physical machine replication.
Host network VLAN | Yes.
Host network IPv4 | Yes.
Host network IPv6 | No.
Guest/server network NIC Teaming | No.
Guest/server network IPv4 | Yes.
Guest/server network IPv6 | No.
Guest/server network static IP (Windows) | Yes.
Guest/server network static IP (Linux) | Yes. <br/><br/>VMs are configured to use DHCP on failback.
Guest/server network multiple NICs | Yes.


## Azure VM network (after failover)

**Component** | **Supported**
--- | ---
Azure ExpressRoute | Yes
ILB | Yes
ELB | Yes
Azure Traffic Manager | Yes
Multi-NIC | Yes
Reserved IP address | Yes
IPv4 | Yes
Retain source IP address | Yes
Azure Virtual Network service endpoints<br/> | Yes
Accelerated Networking | No

## Storage
**Component** | **Supported**
--- | ---
Dynamic disk | Operation System disk must be a basic disk. <br/><br/>Data disks can be dynamic disks
Docker disk configuration | No
Host NFS | Yes for VMware<br/><br/> No for physical servers
Host SAN (iSCSI/FC) | Yes
Host vSAN | Yes for VMware<br/><br/> N/A for physical servers
Host multipath (MPIO) | Yes, tested with Microsoft DSM, EMC PowerPath 5.7 SP4, EMC PowerPath DSM for CLARiiON
Host Virtual Volumes (VVols) | Yes for VMware<br/><br/> N/A for physical servers
Guest/server VMDK | Yes
Guest/server shared cluster disk | No
Guest/server encrypted disk | No
Guest/server NFS | No
Guest/server iSCSI | No
Guest/server SMB 3.0 | No
Guest/server RDM | Yes<br/><br/> N/A for physical servers
Guest/server disk > 1 TB | Yes<br/><br/>Up to 4,095 GB<br/><br/> Disk must be larger than 1024 MB.
Guest/server disk with 4K logical and 4k physical sector size | Yes
Guest/server disk with 4K logical and 512 bytes physical sector size | Yes
Guest/server volume with striped disk >4 TB <br/><br/>Logical volume management (LVM)| Yes
Guest/server - Storage Spaces | No
Guest/server hot add/remove disk | No
Guest/server - exclude disk | Yes
Guest/server multipath (MPIO) | No
Guest/server EFI/UEFI boot | Supported when migrating VMware VMs or physical servers running Windows Server 2012 or later to Azure.<br/><br/> You can only replicate VMs for migration. Failback to on-premises isn't supported.<br/><br/> The server shouldn't have more than four partitions on the OS disk.<br/><br/> Requires Mobility Service version 9.13 or later.<br/><br/> Only NTFS is supported.

## Replication channels

|**Type of replication**   |**Supported**  |
|---------|---------|
|Offloaded Data Transfers  (ODX)    |       No  |
|Offline Seeding        |   No      |
| Azure Data Box | No


## Azure storage

**Component** | **Supported**
--- | ---
Locally redundant storage | Yes
Geo-redundant storage | Yes
Read-access geo-redundant storage | Yes
Cool storage | No
Hot storage| No
Block blobs | No
Encryption at rest (Storage Service Encryption)| Yes
Premium storage | Yes
Import/export service | No
Azure Storage firewalls for virtual networks configured on target storage/cache storage account (used to store replication data) | Yes
General purpose v2 storage accounts (both hot and cool tiers) | No

## Azure compute

**Feature** | **Supported**
--- | ---
Availability sets | Yes
Availability zones | No
HUB | Yes
Managed disks | Yes

## Azure VM requirements

On-premises VMs that you replicate to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs a prerequisites check, it will fail if some of the requirements aren't met.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Verify [supported operating systems](#replicated-machines) for replicated machines. | Check fails if unsupported.
Guest operating system architecture | 64-bit. | Check fails if unsupported.
Operating system disk size | Up to 2,048 GB. | Check fails if unsupported.
Operating system disk count | 1 | Check fails if unsupported.
Data disk count | 64 or less. | Check fails if unsupported.
Data disk size | Up to 4,095 GB | Check fails if unsupported.
Network adapters | Multiple adapters are supported. |
Shared VHD | Not supported. | Check fails if unsupported.
FC disk | Not supported. | Check fails if unsupported.
BitLocker | Not supported. | BitLocker must be disabled before you enable replication for a machine. |
VM name | From 1 to 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.

## Azure Site Recovery churn limits

The following table provides the Azure Site Recovery limits. These limits are based on our tests, but they cannot cover all possible application I/O combinations. Actual results can vary based on your application I/O mix. For best results, we strongly recommend to [run deployment planner tool](site-recovery-deployment-planner.md) and perform extensive application testing by issuing a test failover to get the true performance picture of the application.

**Replication storage target** | **Average source disk I/O size** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |	336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB	| 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |20 MB/s | 1684 GB per disk

**Source data churn** | **Maximum Limit**
---|---
Average data churn per VM| 25 MB/s
Peak data churn across all disks on a VM | 54 MB/s
Maximum data churn per day supported by a Process Server | 2 TB

These are average numbers assuming a 30 percent I/O overlap. Site Recovery is capable of handling higher throughput based on overlap ratio, larger write sizes, and actual workload I/O behavior. The preceding numbers assume a typical backlog of approximately five minutes. That is, after data is uploaded, it is processed and a recovery point is created within five minutes.

## Vault tasks

**Action** | **Supported**
--- | ---
Move vault across resource groups<br/><br/> Within and across subscriptions | No
Move storage, network, Azure VMs across resource groups<br/><br/> Within and across subscriptions | No


## Download latest Azure Site Recovery components

**Name** | **Description** | **Latest version download instructions**
--- | --- | ---
Configuration server | Coordinates communications between on-premises VMware servers and Azure <br/><br/> Installed on on-premises VMware servers | For more information, visit our guidance on [fresh installation](vmware-azure-deploy-configuration-server.md) and [upgrade of existing component to latest version](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server).
Process server|Installed by default on the configuration server. It receives replication data; optimizes it with caching, compression, and encryption; and sends it to Azure Storage. As your deployment grows, you can add additional, separate process servers to handle larger volumes of replication traffic.| For more information, visit our guidance on [fresh installation](vmware-azure-set-up-process-server-scale.md) and [upgrade of existing component to latest version](vmware-azure-manage-process-server.md#upgrade-a-process-server).
Mobility Service | Coordinates replication between on-premises VMware servers/physical servers and Azure/secondary site<br/><br/> Installed on VMware VM or physical servers you want to replicate | For more information, visit our guidance on [fresh installation](vmware-azure-install-mobility-service.md) and [upgrade of existing component to latest version](vmware-physical-manage-mobility-service.md#update-mobility-service-from-azure-portal).

To learn more about the latest features, visit [latest release notes](https://aka.ms/ASR_latest_release_notes).


## Next steps
[Learn how](tutorial-prepare-azure.md) to prepare Azure for disaster recovery of VMware VMs.

[9.23 UR]: https://support.microsoft.com/help/4489582/update-rollup-33-for-azure-site-recovery
[9.22 UR]: https://support.microsoft.com/help/4489582/update-rollup-33-for-azure-site-recovery
[9.21 UR]: https://support.microsoft.com/help/4485985/update-rollup-32-for-azure-site-recovery
[9.20 UR]: https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery
[9.19 UR]: https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30
[9.18 UR]: https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery
