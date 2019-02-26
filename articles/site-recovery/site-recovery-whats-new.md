---
title: What's new in Azure Site Recovery | Microsoft Docs
description: Provides an summary of new features introduced in Azure Site Recovery
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: conceptual
ms.date: 01/28/2019
ms.author: raynew
---
# What's new in Site Recovery

The [Azure Site Recovery](site-recovery-overview.md) service is updated and improved on an ongoing basis. To help you stay up-to-date, this article provides you with information about the latest releases, new features, and new content. This page is updated on a regular basis.

If you have suggestions for Site Recovery features, we'd love to [hear your feedback](https://feedback.azure.com/forums/256299-site-recovery).

## Q1 2019

### Linux support

[Update rollup 32](https://support.microsoft.com/help/4485985/update-rollup-32-for-azure-site-recovery) provides an update to Site Recovery agents and providers. The updates adds support for Linux as follows:

- **Disaster recovery of Azure VMs**: RedHat Workstation 6/7; new kernel versions for Ubuntu, Debian, and SUSE.
- **Disaster recovery of VMware VMs/physical servers to Azure**: RedHat Enterprise Linux 7.6; RedHat Workstation 6/7; Oracle Linux 6.10/7.6
New kernel versions Ubuntu, Debian, and SUSE.



## Q4 2018

## Pricing calculator for Azure VM disaster recovery

Disaster recovery for Azure VMs incurs VM licensing costs, and network and storage costs. Azure provides a [pricing calculator](https://aka.ms/a2a-cost-estimator) to help you figure out these costs. Site Recovery now provides an [example pricing estimate](https://aka.ms/a2a-cost-estimator) that prices a sample deployment based on a three-tier app using six VMs with 12 Standard HDD disks and 6 Premium SSD disks. The sample presume a data change of 10 GB a day for standard, and 20 GB for premium. For your particular deployment, you can change the variables to estimate costs. You can specify the number of VMs, the number and type of managed disks, and the expected total data change rate expected across the VMs. Additionally, you can apply a compression factor to estimate bandwidth costs. [Read](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/) the announcement.

### Support for Azure VMs in zones

Azure availability zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. You can now enable replication for an Azure VM, and set the target for failover to a single VM instance, a VM in an availability set, or a VM in an availability zone. The setting doesn't impact replication. [Read](https://azure.microsoft.com/blog/disaster-recovery-of-zone-pinned-azure-virtual-machines-to-another-region/) the announcement.
 
### Disaster recovery for encrypted VMs

Site Recovery supports Azure VMs encrypted with Azure Disk Encryption (ADE) with the Azure AD app. [Learn more](azure-to-azure-how-to-enable-replication-ade-vms.md).

### Disaster recovery for VMs using accelerated networking

Accelerated networking enable single root I/O virtualization (SR-IOV) to a VM, improving networking performance. When you enable replication for an Azure VM, Site Recovery detects whether accelerated networking is enabled. If it is, after failover Site Recovery automatically configures accelerated networking on the target replica Azure VM, for both [Windows](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-powershell#enable-accelerated-networking-on-existing-vms) and [Linux](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli#enable-accelerated-networking-on-existing-vms). [Learn more](azure-vm-disaster-recovery-with-accelerated-networking.md).

### Automatic updates for the Mobility service extension

Site Recovery added an option for automatic updates to the Mobility service extension. The Mobility service extension is installed on each Azure VM replicated by Site Recovery. When you enable replication, you select whether to allow Site Recovery to manage updates to the extension. Updates don't require a VM restart, and don't affect replication. [Learn more](azure-to-azure-autoupdate.md).

### Support for standard SSD disks

Azure introduced [Standard Solid State Drives (SSD)](https://docs.microsoft.com/azure/virtual-machines/windows/disks-standard-ssd) disks to  provide a cost-effective storage solution for apps such as web servers that need consistent performance, but don't have high disk IOPS. They combine elements of premium SSD and standard HDD disks. Site Recovery provides disaster recovery for Azure VMs using Standard SSD disk. By default, the disk type is preserved after failover to the target region.

### Support for Azure storage firewall

You can secure Azure storage accounts to a specific set of networks by turning on firewall rules for the account. You configure storage accounts to deny traffic from internal networks and the internet by default, then grant access to traffic from specific VNets. Site Recovery supports replication for VMs with unmanaged disks on firewall-enabled storage accounts to a secondary region. In the target region, for unmanaged disks, you can select storage accounts with firewalls enabled. You can also restrict access to the cache storage account by restricting network access to only network in which the source VMs are located. Note that you must [allow access](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) for trusted Microsoft services.

## Q3 2018 

### Linux support

#### Update rollup 28

[Update rollup 28](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery) provides an update to Site Recovery agents and providers. The updates adds support for Linux as follows:

- **Disaster recovery of Azure VMs**: RedHat Enterprise Linux 6.10; CentOS 6.10; Linux-based VMs that use the GUID partition table (GPT) partition style in legacy BIOS compatibility mode are now supported.
- **Disaster recovery of VMware VMs/physical servers to Azure**: RedHat Enterprise Linux 6.10; CentOS 6.10; Linux-based VMs that use the GUID partition table (GPT) partition style in legacy BIOS compatibility mode are now supported.

#### Update rollup 27

[Update rollup 28](https://support.microsoft.com/help/4460079/update-rollup-28-for-azure-site-recovery) provides an update to Site Recovery agents and providers. The updates adds support for Linux as follows:

- **Disaster recovery of Azure VMs**: Red Hat Enterprise Linux 7.5
- **Disaster recovery of VMware VMs/physical servers to Azure**: SUSE Linux Enterprise Server 12, Red Hat Enterprise Linux 7.5

### Support for Azure VMs running on Windows Server 2016

Azure VMs running on Windows Server 2016 can be replicated across Azure regions with Azure Site Recovery.

### Support for Azure VMs running Storage Spaces Direct

[Storage Spaces Direct](https://docs.microsoft.com/windows-server/storage/storage-spaces/storage-spaces-direct-overview) (available from Windows Server 2016 onwards) groups drives together into a storage pool, and then uses capacity from the pool to create storage spaces. Storage spaces can be used on a standalone VM, on a [guest cluster of Azure VMs](https://docs.microsoft.com/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm) using local storage on each cluster node, or shared storage across the cluster.

## Next steps

Keep up-to-date with our updates on the [Azure Updates](https://azure.microsoft.com/updates/?product=site-recovery) page.


