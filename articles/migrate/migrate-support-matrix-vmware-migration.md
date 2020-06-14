---
title: Support for VMware migration in Azure Migrate
description: Learn about support for VMware VM migration in Azure Migrate.
ms.topic: conceptual
ms.date: 06/08/2020
---

# Support matrix for VMware migration

This article summarizes support settings and limitations for migrating VMware VMs with [Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) . If you're looking for information about assessing VMware VMs for migration to Azure, review the [assessment support matrix](migrate-support-matrix-vmware.md).


## Migration options

You can migrate VMware VMs in a couple of ways:

- **Using agentless migration**: Migrate VMs without needing to install anything on them. You deploy the [Azure Migrate appliance](migrate-appliance.md) for agentless migration.
- **Using agent-based migration**: Install an agent on the VM for replication. For agent-based migration, you deploy a [replication appliance](migrate-replication-appliance.md).

Review [this article](server-migrate-overview.md) to figure out which method you want to use.

## Migration limitations

- You can select up to 10 VMs at once for replication. If you want to migrate more machines, then replicate in groups of 10.
- For VMware agentless migration, you can run up to 300 replications simultaneously.

## Agentless migration 

This section summarizes requirements for agentless migration.

### VMware requirements (agentless)

The table summarizes VMware hypervisor requirements.

**VMware** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, or 6.7.
**VMware vSphere ESXI host** | Version 5.5, 6.0, 6.5, or 6.7.
**vCenter Server permissions** | Agentless migration uses the [Migrate Appliance](migrate-appliance.md). The appliance needs these permissions in vCenter Server:<br/><br/> - **Datastore.Browse**: Allow browsing of VM log files to troubleshoot snapshot creation and deletion.<br/><br/> - **Datastore.LowLevelFileOperations**: Allow read/write/delete/rename operations in the datastore browser, to troubleshoot snapshot creation and deletion.<br/><br/> - **VirtualMachine.Configuration.DiskChangeTracking**: Allow enable or disable change tracking of VM disks, to pull changed blocks of data between snapshots.<br/><br/> - **VirtualMachine.Configuration.DiskLease**: Allow disk lease operations for a VM, to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).<br/><br/> - **VirtualMachine.Provisioning.AllowDiskAccess**: (specifically for vSphere 6.0 and above) Allow opening a disk on a VM for random read access on the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.AllowReadOnlyDiskAccess**: Allow opening a disk on a VM, to read the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.AllowDiskRandomAccess**: Allow opening a disk on a VM, to read the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.AllowVirtualMachineDownload**: Allows read operations on files associated with a VM, to download the logs and troubleshoot if failure occurs.<br/><br/> - **VirtualMachine.SnapshotManagement.***: Allow creation and management of VM snapshots for replication.<br/><br/> - **Virtual Machine.Interaction.Power Off**: Allow the VM to be powered off during migration to Azure.



### VM requirements (agentless)

The table summarizes agentless migration requirements for VMware VMs.

**Support** | **Details**
--- | ---
**Supported operating systems** | You can migrate [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) operating systems that are supported by Azure.
**Windows VMs in Azure** | You might need to [make some changes](prepare-for-migration.md#verify-required-changes-before-migrating) on VMs before migration. 
**Linux VMs in Azure** | Some VMs might require changes so that they can run in Azure.<br/><br/> For Linux, Azure Migrate makes the changes automatically for these operating systems:<br/> - Red Hat Enterprise Linux 6.5+, 7.0+<br/> - CentOS 6.5+, 7.0+</br> - SUSE Linux Enterprise Server 12 SP1+<br/> - Ubuntu 14.04LTS, 16.04LTS, 18.04LTS<br/> - Debian 7, 8. For other operating systems you make the [required changes](prepare-for-migration.md#verify-required-changes-before-migrating) manually.
**Linux boot** | If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br/> If /boot is part of the root (/) partition, then the '/' partition should be on the OS disk, and not span other disks.
**UEFI boot** | VMs with UEFI boot aren't supported for migration.
**Disk size** | 2 TB OS disk; 8 TB for data disks.
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
**Simultaneous replication** | 300 VMs per vCenter Server. If you have more, migrate them in batches of 300.


### Appliance requirements (agentless)

Agentless migration uses the [Azure Migrate appliance](migrate-appliance.md). You can deploy the appliance as a VMWare VM using an OVA template, imported into vCenter Server, or using a [PowerShell script](deploy-appliance-script.md).

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- Learn about URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
- In Azure Government, you must deploy the appliance [using the script](deploy-appliance-script-government.md).

### Port requirements (agentless)

**Device** | **Connection**
--- | ---
Appliance | Outbound connections on port 443 to upload replicated data to Azure, and to communicate with Azure Migrate services orchestrating replication and migration.
vCenter server | Inbound connections on port 443 to allow the appliance to orchestrate replication - create snapshots, copy data, release snapshots
vSphere/EXSI host | Inbound on TCP port 902 for the appliance to replicate data from snapshots.

## Agent-based migration 


This section summarizes requirements for agent-based migration.


### VMware requirements (agent-based)

This table summarizes assessment support and limitations for VMware virtualization servers.

**VMware requirements** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, or 6.7.
**VMware vSphere ESXI host** | Version 5.5, 6.0, 6.5, or 6.7.
**vCenter Server permissions** | A read-only account for vCenter Server.

### VM requirements (agent-based)

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




### Appliance requirements (agent-based)

When you set up the replication appliance using the OVA template provided in the Azure Migrate hub, the appliance runs Windows Server 2016 and complies with the support requirements. If you set up the replication appliance manually on a physical server, then make sure that it complies with the requirements.

- Learn about [replication appliance requirements](migrate-replication-appliance.md#appliance-requirements) for VMware.
- MySQL must be installed on the appliance. Learn about [installation options](migrate-replication-appliance.md#mysql-installation).
- Learn about URLs that the replication appliance needs to access in [public](migrate-replication-appliance.md#url-access) and [government](migrate-replication-appliance.md#azure-government-url-access) clouds.
- Review the [ports](migrate-replication-appliance.md#port-access) the replication appliance needs to access.

### Port requirements (agent-based)

**Device** | **Connection**
--- | ---
VMs | The Mobility service running on VMs communicates with the on-premises replication appliance (configuration server) on port HTTPS 443 inbound, for replication management.<br/><br/> VMs send replication data to the process server (running on the configuration server machine) on port HTTPS 9443 inbound. This port can be modified.
Replication appliance | The replication appliance orchestrates replication with Azure over port HTTPS 443 outbound.
Process server | The process server receives replication data, optimizes, and encrypts it, and sends it to Azure storage over port 443 outbound.<br/> By default the process server runs on the replication appliance.

## Azure VM requirements

All on-premises VMs replicated to Azure, with agentless or agent-based migration) must meet the Azure VM requirements summarized in this table. 

**Component** | **Requirements** 
--- | --- | ---
Guest operating system | Verifies supported VMware VM operating systems for migration.<br/> You can migrate any workload running on a supported operating system. 
Guest operating system architecture | 64-bit. 
Operating system disk size | Up to 2,048 GB. 
Operating system disk count | 1 
Data disk count | 64 or less. 
Data disk size | Up to 4,095 GB 
Network adapters | Multiple adapters are supported.
Shared VHD | Not supported. 
FC disk | Not supported. 
BitLocker | Not supported.<br/><br/> BitLocker must be disabled before you migrate the machine.
VM name | From 1 to 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number. 
Connect after migration-Windows | To connect to Azure VMs running Windows after migration:<br/><br/> - Before migration, enable RDP on the on-premises VM.<br/><br/> Make sure that TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps**, for all profiles.<br/><br/> For site-to-site VPN access, enable RDP and allow RDP in **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks.<br/><br/> In addition, check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](prepare-for-migration.md).
Connect after migration-Linux | To connect to Azure VMs after migration using SSH:<br/><br/> Before migration, on the on-premises machine, check that the Secure Shell service is set to Start, and that firewall rules allow an SSH connection.<br/><br/> After failover, on the Azure VM, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected.<br/><br/> In addition, add a public IP address for the VM.  


## Next steps

[Select](server-migrate-overview.md) a VMware migration option.
