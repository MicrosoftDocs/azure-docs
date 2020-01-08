---
title: Support for VMware migration in Azure Migrate
description: Learn about support for VMware VM migration in Azure Migrate.
ms.topic: conceptual
ms.date: 01/07/2020
---

# Support matrix for VMware migration

This article summarizes support settings and limitations for migrating VMware VMs with [Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) . If you're looking for information about assessing VMware VMs for migration to Azure, review the [assessment support matrix](migrate-support-matrix-vmware.md).


## Migration options

You can migrate VMware VMs in a couple of ways:

- With agentless migration: Migrate VMs without needing to install anything on them. You deploy the [Azure Migrate appliance](migrate-appliance.md) for agentless migration.
- With agent-based migration: Install an agent on the VM for replication. For agent-based migration, you need to deploy a [replication appliance](migrate-replication-appliance.md).

Review [this article](server-migrate-overview.md) to figure out which method you want to use.

## Migration limitations

- You can select up to 10 VMs at once for replication. If you want to migrate more machines, then replicate in groups of 10.
- For VMware agentless migration, you can run up to 100 replications simultaneously.

## Agentless-VMware servers

**VMware** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, or 6.7.
**VMware vSphere ESXI host** | Version 5.5, 6.0, 6.5, or 6.7.
**vCenter Server permissions** | Agentless migration uses the [Migrate Appliance](migrate-appliance.md). The appliance needs these permissions:<br/><br/> - **Datastore.Browse**: Allow browsing of VM log files to troubleshoot snapshot creation and deletion.<br/><br/> **Datastore.LowLevelFileOperations**: Allow read/write/delete/rename operations in the datastore browser, to troubleshoot snapshot creation and deletion.<br/><br/> - **VirtualMachine.Configuration.DiskChangeTracking**: Allow enable or disable change tracking of VM disks, to pull changed blocks of data between snapshots.<br/><br/> - **VirtualMachine.Configuration.DiskLease**: Allow disk lease operations for a VM, to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).<br/><br/> - **VirtualMachine.Provisioning.AllowReadOnlyDiskAccess**: Allow opening a disk on a VM, to read the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.AllowVirtualMachineDownload**: Allows read operations on files associated with a VM, to download the logs and troubleshoot if failure occurs.<br/><br/> - **VirtualMachine.SnapshotManagement.***: Allow creation and management of VM snapshots for replication.<br/><br/> - **Virtual Machine.Interaction.Power Off**: Allow the VM to be powered off during migration to Azure.



## Agentless-VMware VMs

**Support** | **Details**
--- | ---
**Supported operating systems** | [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) operating systems that are supported by Azure can be migrated using agentless migration.
**Required changes for Azure** | Some VMs might require changes so that they can run in Azure. Azure Migrate makes these changes automatically for the following operating systems:<br/> - Red Hat Enterprise Linux 6.5+, 7.0+<br/> - CentOS 6.5+, 7.0+</br> - SUSE Linux Enterprise Server 12 SP1+<br/> - Ubuntu 14.04LTS, 16.04LTS, 18.04LTS<br/> - Debian 7, 8<br/><br/> For other operating systems, you need to make adjustments manually before migration. The relevant articles contain instructions about how to do this.
**Linux boot** | If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br/> If /boot is part of the root (/) partition, then the ‘/’ partition should be on the OS disk, and not span other disks.
**UEFI boot** | VMs with UEFI boot aren't supported for migration.
**Disk size** | 2 TB OS disk; 4 TB for data disks.
**Disk limits** |  Up to 60 disks per VM.
**Encrypted disks/volumes** | VMs with encrypted disks/volumes aren't supported for migration.
**Shared disk cluster** | Not supported.
**Independent disks** | Not supported.
**RDM/passthrough disks** | If VMs have RDM or passthrough disks, these disks won't be replicated to Azure.
**NFS** | NFS volumes mounted as volumes on the VMs won't be replicated.
**iSCSI targets** | VMs with iSCSI targets aren't supported for agentless migration.
**Multipath IO** | Not supported.
**Storage vMotion** | Not supported. Replication won't work if a VM uses storage vMotion.
**Teamed NICs** | Not supported.
**IPv6** | Not supported.
**Target disk** | VMs can only be migrated to managed disks (standard HDD, premium SSD) in Azure.
**Simultaneous replication** | 100 VMs per vCenter Server. If you have more, migrate them in batches of 100.


## Agentless-Azure Migrate appliance 
Agentless migration uses the Azure Migrate appliance, deployed on a VMware VM.

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- Learn about [URLs](migrate-appliance.md#url-access) the appliance needs to access.

## Agentless-ports

**Device** | **Connection**
--- | ---
Appliance | Outbound connections on port 443 to upload replicated data to Azure, and to communicate with Azure Migrate services orchestrating replication and migration.
vCenter server | Inbound connections on port 443 to allow the appliance to orchestrate replication - create snapshots, copy data, release snapshots
vSphere/EXSI host | Inbound on TCP port 902 for the appliance to replicate data from snapshots.


## Agent-based-VMware servers
This table summarizes assessment support and limitations for VMware virtualization servers.

**VMware requirements** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, or 6.7.
**VMware vSphere ESXI host** | Version 5.5, 6.0, 6.5, or 6.7.
**vCenter Server permissions** | A read-only account for vCenter Server.

## Agent-based-VMware VMs

The table summarizes VMware VM support for VMware VMs you want to migrate using agent-based migration.

**Support** | **Details**
--- | ---
**Machine workload** | Azure Migrate supports migration of any workload (say Active Directory, SQL server, etc.) running on a supported machine.
**Operating systems** | For the latest information, review the [operating system support](../site-recovery/vmware-physical-azure-support-matrix.md#replicated-machines) for Site Recovery. Azure Migrate provides identical VM operating system support.
**Linux file system/guest storage** | For the latest information, review the [Linux file system support](../site-recovery/vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) for Site Recovery. Azure Migrate has identical Linux file system support.
**Network/Storage** | For the latest information, review the [network](../site-recovery/vmware-physical-azure-support-matrix.md#network) and [storage](../site-recovery/vmware-physical-azure-support-matrix.md#storage) prerequisites for Site Recovery. Azure Migrate provides identical network/storage requirements.
**Azure requirements** | For the latest information, review the [Azure network](../site-recovery/vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](../site-recovery/vmware-physical-azure-support-matrix.md#azure-storage), and [compute](../site-recovery/vmware-physical-azure-support-matrix.md#azure-compute) requirements for Site Recovery. Azure Migrate has identical requirements for VMware migration.
**Mobility service** | The Mobility service agent must be installed on each VM you want to migrate.
**UEFI boot** | The migrated VM in Azure will be automatically converted to a BIOS boot VM.<br/><br/> The OS disk should have up to four partitions, and volumes should be formatted with NTFS.
**Target disk** | VMs can only be migrated to managed disks (standard HDD, premium SSD) in Azure.
**Disk size** | 2 TB OS disk; 8 TB for data disks.
**Disk limits** |  Up to 63 disks per VM.
**Encrypted disks/volumes** | VMs with encrypted disks/volumes aren't supported for migration.
**Shared disk cluster** | Not supported.
**Independent disks** | Supported.
**Passthrough disks** | Supported.
**NFS** | NFS volumes mounted as volumes on the VMs won't be replicated.
**iSCSI targets** | VMs with iSCSI targets aren't supported for agentless migration.
**Multipath IO** | Not supported.
**Storage vMotion** | Supported
**Teamed NICs** | Not supported.
**IPv6** | Not supported.




## Agent-based-replication appliance 

When you set up the replication appliance using the OVA template provided in the Azure Migrate hub, the appliance runs Windows Server 2016 and complies with the support requirements. If you set up the replication appliance manually on a physical server, then make sure that it complies with the requirements.

- Learn about [replication appliance requirements](migrate-replication-appliance.md#appliance-requirements) for VMware.
- MySQL must be installed on the appliance. Learn about [installation options](migrate-replication-appliance.md#mysql-installation).
- Learn about [URLs](migrate-replication-appliance.md#url-access) the replication appliance needs to access.

## Azure VM requirements

All on-premises VMs replicated to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs a prerequisites check for replication, the check will fail if some of the requirements aren't met.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Verifies supported VMware VM operating systems for migration.<br/> You can migrate any workload running on a supported operating system. | Check fails if unsupported.
Guest operating system architecture | 64-bit. | Check fails if unsupported.
Operating system disk size | Up to 2,048 GB. | Check fails if unsupported.
Operating system disk count | 1 | Check fails if unsupported.
Data disk count | 64 or less. | Check fails if unsupported.
Data disk size | Up to 4,095 GB | Check fails if unsupported.
Network adapters | Multiple adapters are supported. |
Shared VHD | Not supported. | Check fails if unsupported.
FC disk | Not supported. | Check fails if unsupported.
BitLocker | Not supported. | BitLocker must be disabled before you enable replication for a machine.
VM name | From 1 to 63 characters.<br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. |  Update the value in the machine properties in Site Recovery.
Connect after migration-Windows | To connect to Azure VMs running Windows after migration:<br/> - Before migration enables RDP on the on-premises VM. Make sure that TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps**, for all profiles.<br/> For site-to-site VPN access, enable RDP and allow RDP in **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks. In addition, check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](prepare-for-migration.md). |
Connect after migration-Linux | To connect to Azure VMs after migration using SSH:<br/> Before migration, on the on-premises machine, check that the Secure Shell service is set to Start, and that firewall rules allow an SSH connection.<br/> After failover, on the Azure VM, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected. In addition, add a public IP address for the VM. |  


## Next steps

[Select](server-migrate-overview.md) a VMware migration option.
