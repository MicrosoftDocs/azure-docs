---
title: What's new in Azure Site Recovery | Microsoft Docs
description: Provides an summary of new features introduced in Azure Site Recovery
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/12/2019
ms.author: raynew
---
# What's new in Site Recovery

The [Azure Site Recovery](site-recovery-overview.md) service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest releases, new features, and new content. This page is updated on a regular basis.

If you have suggestions for Site Recovery features, we'd love to [hear your feedback](https://feedback.azure.com/forums/256299-site-recovery).

## Q1 2019 

### Update rollup 34 (February 2019)

[Update rollup 34](https://support.microsoft.com/help/4490016/update-rollup-34-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)



### Update rollup 33 (February 2019)

[Update rollup 33](https://support.microsoft.com/help/4489582/update-rollup-33-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)
**Network mapping** | For Azure VM disaster recovery, you can now use any available target network when you enable replication. 
**Standard SSD** | You can now set up disaster recovery for Azure VMs using [Standard SSD disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-standard-ssd).
**Storage Spaces Direct** | You can set up disaster recovery for apps running on Azure VM apps by using [Storage Spaces Direct](https://docs.microsoft.com/windows-server/storage/storage-spaces/storage-spaces-direct-overview) for high availability.
**BRTFS file system** | Supported for VMware VMs, in addition to Azure VMs.<br/><br/> Not supported if: The BTRFS file system sub-volume is changed after enabling replication, the file system is spread over multiple disks, or if the BTRFS file system supports RAID.



### Update rollup 32 (January 2019)

[Update rollup 31](https://support.microsoft.com/help/4485985/update-rollup-32-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)
**Disaster recovery for Linux** | **Azure VMs**: RedHat Workstation 6/7; support for new kernel versions for Ubuntu, Debian, and SUSE.<br/><br/> **VMware VMs/physical servers**: Redhat Enterprise Linux 7.6; RedHat Workstation 6/7; Oracle Linux 6.10/7.6; spport for new kernel versions for Ubuntu, Debian, and SUSE.


### Update rollup 31 (January 2019)

[Update rollup 31](https://support.microsoft.com/help/4478871/update-rollup-31-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)
**Disaster recovery for Linux** | **Azure VMs**: Oracle Linux 6.8 and 6.9/7.0; support for UEK5 kernels.<br/><br/> **VMware VMs/physical servers**: Oracle Linux 6.8 and 6.9/7.0; support for UEK5 kernel.
**BRTFS file system** | Supported for Azure VMs.
**LVM** | Support added for LVM and LVM2 volumes.<br/><br/> The /boot directory on a disk partition and on LVM volumes is supported.
**Directories** | Support added for these directories seet up as separate partitions, or file systems that aren't on the same system disk: /(root), /boot, /usr, /usr/local, /var, /etc.
**Windows Server 2008** | Support added for dynamic disks.
**VMware VM failover** | Improved failover time for VMware VMs where storvsc and vsbus aren't boot drivers.
**UEFI support** | Azure VMs don't support boot type UEFI. You can now migrate on-premises physical servers with UEFI to Azure with Site Recovery. Site Recovery migrates the server by converting the boot type to BIOS before migration. Site Recovery previously supported this conversion for VMs only. Support is available for physical servers running Windows Server 2012 or later.
**Azure VMs in availability zones** | You can enable replication to another region for Azure VMs deployed in availability zones. ou can now enable replication for an Azure VM, and set the target for failover to a single VM instance, a VM in an availability set, or a VM in an availability zone. The setting doesn't impact replication. [Read](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region/) the announcement.


## Q4 2018

### Update rollup 30 (October 2018)

[Update rollup 30](https://support.microsoft.com/help/4468181/azure-site-recovery-update-rollup-30) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)
**Region support** | Site Recovery support added for Australia Central 1 and Australia Central 2.
**Support for disk encryption** | Support added for disaster recovery of Azure VMs encrypted with Azure Disk Encryption (ADE) with the Azure AD app. [Learn more](azure-to-azure-how-to-enable-replication-ade-vms.md).
**Disk exclusion** | Unitialized disks are now automatically excluded during Azure VM replication.
**Firewall-enabled storage** | Support added for [firewall-enabled storage accounts](https://docs.microsoft.com/azure/storage/common/storage-network-security).<br/><br/> You can replicate Azure VMs with unmanaged disks on firewall-enabled storage accounts to another Azure region for disaster recovery.<br/><br/> You can use firewall-enabled storage accounts as target storage accounts for unmanaged disks.<br/><br/> Supported using PowerShell only.


### Update rollup 29 (October 2018)

[Update rollup 29](https://support.microsoft.com/help/4466466/update-rollup-29-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Issue fixes** | A number of fixes and improvements (as detailed in the rollup)

### Automatic updates for the Mobility service extension

Site Recovery added an option for automatic updates to the Mobility service extension. The Mobility service extension is installed on each Azure VM replicated by Site Recovery. When you enable replication, you select whether to allow Site Recovery to manage updates to the extension. Updates don't require a VM restart, and don't affect replication. [Learn more](azure-to-azure-autoupdate.md).

### Disaster recovery for VMs using accelerated networking

Accelerated networking enable single root I/O virtualization (SR-IOV) to a VM, improving networking performance. When you enable replication for an Azure VM, Site Recovery detects whether accelerated networking is enabled. If it is, after failover Site Recovery automatically configures accelerated networking on the target replica Azure VM, for both [Windows](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-powershell#enable-accelerated-networking-on-existing-vms) and [Linux](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli#enable-accelerated-networking-on-existing-vms). [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).

### Pricing calculator for Azure VM disaster recovery

Disaster recovery for Azure VMs incurs VM licensing costs, and network and storage costs. Azure provides a [pricing calculator](https://aka.ms/a2a-cost-estimator) to help you figure out these costs. Site Recovery now provides an [example pricing estimate](https://aka.ms/a2a-cost-estimator) that prices a sample deployment based on a three-tier app using six VMs with 12 Standard HDD disks and 6 Premium SSD disks. The sample presume a data change of 10 GB a day for standard, and 20 GB for premium. For your particular deployment, you can change the variables to estimate costs. You can specify the number of VMs, the number and type of managed disks, and the expected total data change rate expected across the VMs. Additionally, you can apply a compression factor to estimate bandwidth costs. [Read](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/) the announcement.



## Q3 2018 


### Update rollup 28 (August 2018)

[Update rollup 28](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Disaster recovery for Linux** | **Azure VMs**: Added supported for RedHat Enterprise Linux 6.10; CentOS 6.10.<br/><br/> **VMware VMs**: RedHat Enterprise Linux 6.10; CentOS 6.10.<br/><br/> Linux-based VMs that use the GUID partition table (GPT) partition style in legacy BIOS compatibility mode are now supported.
**Cloud support** | Supported disaster recovery for Azure VMs in the Germany cloud.
**Cross-subscription disaster recovery** | Support for replicating Azure VMs in one region to another region in a different subscription, within the same Azure Active Directory tenant. [Learn more](https://aka.ms/cross-sub-blog).
**Windows Server 2008** | Support for migrating machines running Windows Server 2008 R2/2008 64-bit and 32-bit.<br/><br/> Migration only (replication and failover). Failback isn't supported.

### Update rollup 27 (July 2018)

[Update rollup 27](https://support.microsoft.com/help/4055712/update-rollup-27-for-azure-site-recovery) provides the following updates.

**Update** | **Details**
--- | ---
**Providers and agents** | An update to Site Recovery agents and providers (as detailed in the rollup)
**Disaster recovery for Linux** | **Azure VMs**: Red Hat Enterprise Linux 7.5<br/><br/> **VMware VMs/physical servers**: Red Hat Enterprise Linux 7.5, SUSE Linux Enterprise Server 12




## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.




 









