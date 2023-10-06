---
title: Support for VMware vSphere migration in Azure Migrate
description: Learn about support for VMware vSphere VM migration in Azure Migrate.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 09/29/2023
ms.custom: engagement-fy23
---

# Support matrix for VMware vSphere migration

This article summarizes support settings and limitations for migrating VMware vSphere VMs with [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) . If you're looking for information about assessing VMware vSphere VMs for migration to Azure, review the [assessment support matrix](migrate-support-matrix-vmware.md).


## Migration options

You can migrate VMware vSphere VMs in a couple of ways:

- **Using agentless migration**: Migrate VMs without needing to install anything on them. You deploy the [Azure Migrate appliance](migrate-appliance.md) for agentless migration.
- **Using agent-based migration**: Install an agent on the VM for replication. For agent-based migration, you deploy a [replication appliance](migrate-replication-appliance.md).

Review [this article](server-migrate-overview.md) to figure out which method you want to use.

## Agentless migration

This section summarizes requirements for agentless VMware vSphere VM migration to Azure.

### VMware vSphere requirements (agentless)

The table summarizes VMware vSphere hypervisor requirements.

**VMware** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, 6.7, 7.0, 8.0.
**VMware vSphere ESXi host** | Version 5.5, 6.0, 6.5, 6.7, 7.0, 8.0.
**vCenter Server permissions** | Agentless migration uses the [Migrate Appliance](migrate-appliance.md). The appliance needs these permissions in vCenter Server:<br/><br/> - **Datastore.Browse** (Datastore -> Browse datastore): Allow browsing of VM log files to troubleshoot snapshot creation and deletion.<br/><br/> - **Datastore.FileManagement** (Datastore -> Low level file operations): Allow read/write/delete/rename operations in the datastore browser, to troubleshoot snapshot creation and deletion.<br/><br/> - **VirtualMachine.Config.ChangeTracking** (Virtual machine -> Disk change tracking): Allow enable or disable change tracking of VM disks, to pull changed blocks of data between snapshots.<br/><br/> - **VirtualMachine.Config.DiskLease** (Virtual machine -> Disk lease): Allow disk lease operations for a VM, to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).<br/><br/> - **VirtualMachine.Provisioning.DiskRandomRead** (Virtual machine -> Provisioning -> Allow read-only disk access): Allow opening a disk on a VM, to read the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.DiskRandomAccess** (Virtual machine -> Provisioning -> Allow disk access): Allow opening a disk on a VM, to read the disk using the VDDK.<br/><br/> - **VirtualMachine.Provisioning.GetVmFiles** (Virtual machine -> Provisioning -> Allow virtual machine download): Allows read operations on files associated with a VM, to download the logs and troubleshoot if failure occurs.<br/><br/> - **VirtualMachine.State.\*** (Virtual machine -> Snapshot management): Allow creation and management of VM snapshots for replication.<br/><br/> - **VirtualMachine.GuestOperations.\*** (Virtual machine -> Guest operations): Allow Discovery, Software Inventory, and Dependency Mapping on VMs.<br/><br/> -**VirtualMachine.Interact.PowerOff** (Virtual machine > Interaction > Power off): Allow the VM to be powered off during migration to Azure.
**Multiple vCenter Servers** | A single appliance can connect to up to 10 vCenter Servers.


### VM requirements (agentless)

The table summarizes agentless migration requirements for VMware vSphere VMs.

**Support** | **Details**
--- | ---
**Supported operating systems** | You can migrate [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](../virtual-machines/linux/endorsed-distros.md) operating systems supported by Azure.
**Windows VMs in Azure** | You might need to [make some changes](prepare-for-migration.md#verify-required-changes-before-migrating) on VMs before migration.
**Linux VMs in Azure** | Some VMs might require changes so that they can run in Azure.<br/><br/> For Linux, Azure Migrate makes the changes automatically for these operating systems:<br/> - Red Hat Enterprise Linux 9.x, 8.x, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.0, 6.x<br> - CentOS  9.x (Release and Stream), 8.x (Release and Stream), 7.9, 7.7, 7.6, 7.5, 7.4, 6.x</br> - SUSE Linux Enterprise Server 15 SP4, 15 SP3, 15 SP2, 15 SP1, 15 SP0, 12, 11 SP4, 11 SP3 <br>- Ubuntu 22.04, 21.04, 20.04, 19.04, 19.10, 18.04LTS, 16.04LTS, 14.04LTS<br> - Debian 11, 10, 9, 8, 7<br> - Oracle Linux 9, 8, 7.7-CI, 7.7, 6<br> - Kali Linux (2016, 2017, 2018, 2019, 2020, 2021, 2022) <br> For other operating systems, you make the [required changes](prepare-for-migration.md#verify-required-changes-before-migrating) manually.<br/> The `SELinux Enforced` setting is currently not fully supported. It causes Dynamic IP setup and Microsoft Azure Linux Guest agent (waagent/WALinuxAgent) installation to fail. You can still migrate and use the VM.
**Boot requirements** | **Windows VMs:**<br/>OS Drive (C:\\) and System Reserved Partition (EFI System Partition for UEFI VMs) should reside on the same disk.<br/>If `/boot` is on a dedicated partition, it should reside on the OS disk and not be spread across multiple disks. <br/> If `/boot` is part of the root (/) partition, then the '/' partition should be on the OS disk and not span other disks. <br/><br/> **Linux VMs:**<br/> If `/boot` is on a dedicated partition, it should reside on the OS disk and not be spread across multiple disks.<br/> If `/boot` is part of the root (/) partition, then the '/' partition should be on the OS disk and not span other disks.
**UEFI boot** | Supported. UEFI-based VMs will be migrated to Azure generation 2 VMs.
**Disk size** | Up to 2-TB OS disk for gen 1 VM and gen 2 VMs; 32 TB for data disks. Changing the size of the source disk after initiating replication is supported and will not impact ongoing replication cycle.
**Dynamic disk** | - An OS disk as a dynamic disk is not supported. <br/> - If a VM with OS disk as dynamic disk is replicating, convert the disk type from dynamic to basic and allow the new cycle to complete, before triggering test migration or migration. Note that you will need help from OS support for conversion of dynamic to basic disk type.
**Encrypted disks/volumes** | VMs with encrypted disks/volumes aren't supported for migration.
**Shared disk cluster** | Not supported.
**Independent disks** | Not supported.
**RDM/passthrough disks** | If VMs have RDM or passthrough disks, these disks won't be replicated to Azure.
**NFS** | NFS volumes mounted as volumes on the VMs won't be replicated.
**ReiserFS** | Not supported.
**iSCSI targets** | VMs with iSCSI targets aren't supported for agentless migration.
**Multipath IO** | Not supported.
**Storage vMotion** | Supported. 
**Teamed NICs** | Not supported.
**IPv6** | Not supported.
**Target disk** | VMs can be migrated only to managed disks (standard HDD, standard SSD, premium SSD) in Azure.
**Simultaneous replication** | Up to 300 simultaneously replicating VMs per vCenter Server with one appliance. Up to 500 simultaneously replicating VMs per vCenter Server when an additional [scale-out appliance](./how-to-scale-out-for-migration.md) is deployed.
**Automatic installation of Azure VM agent (Windows and Linux Agent)** | Supported for Windows Server 2008 R2 onwards. Supported for RHEL 6, RHEL 7, CentOS 7, Ubuntu 14.04, Ubuntu 16.04, Ubuntu 18.04, Ubuntu 19.04, Ubuntu 19.10, Ubuntu 20.04

> [!NOTE]
> Ensure that the following special characters are not passed in any credentials as they are not supported for SSO passwords:
>  - Non-ASCII characters. [Learn more](https://en.wikipedia.org/wiki/ASCII).
>  - Ampersand (&)
>  - Semicolon (;)
>  - Double quotation mark (")
>  - Single quotation mark (')
>  - Circumflex (^)
>  - Backslash (\\)
>  - Percentage (%)
>  - Angle brackets (<,>)
>  - Pound (£)

> [!Note]
> In addition to the Internet connectivity, for Linux VMs, ensure that the following packages are installed for successful installation of Microsoft Azure Linux agent (waagent):
>  - Python 2.6+
>  - OpenSSL 1.0+
>  - OpenSSH 5.3+
>  - Filesystem utilities: sfdisk, fdisk, mkfs, parted
>  - Password tools: chpasswd, sudo
>  - Text processing tools: sed, grep
>  - Network tools: ip-route

> [!TIP]
>  Using the Azure portal you'll  be able to select up to 10 VMs at a time to configure replication. To replicate more VMs you can use the portal and add the VMs to be replicated in multiple batches of 10 VMs, or use the Azure Migrate PowerShell interface to configure replication. Ensure that you don't configure simultaneous replication on more than the maximum supported number of VMs for simultaneous replications.

### Appliance requirements (agentless)

Agentless migration uses the [Azure Migrate appliance](migrate-appliance.md). You can deploy the appliance as a VMware vSphere VM using an OVA template, imported into vCenter Server, or using a [PowerShell script](deploy-appliance-script.md).

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware vSphere.
- Learn about URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
- In Azure Government, you must deploy the appliance [using the script](deploy-appliance-script-government.md).

### Port requirements (agentless)

**Device** | **Connection**
--- | ---
Appliance | Outbound connections on port 443 to upload replicated data to Azure, and to communicate with Azure Migrate services orchestrating replication and migration.
vCenter Server | Inbound connections on port 443 to allow the appliance to orchestrate replication - create snapshots, copy data, release snapshots.
vSphere ESXi host | Inbound on TCP port 902 for the appliance to replicate data from snapshots. Outbound port 902 from ESXi host.

## Agent-based migration


This section summarizes requirements for agent-based migration.


### VMware vSphere requirements (agent-based)

This table summarizes assessment support and limitations for VMware vSphere virtualization servers.

**VMware vSphere requirements** | **Details**
--- | ---
**VMware vCenter Server** | Version 5.5, 6.0, 6.5, or 6.7.
**VMware vSphere ESXi host** | Version 5.5, 6.0, 6.5, 6.7 or 7.0.
**vCenter Server permissions** | **VM discovery**: At least a read-only user<br/><br/> Data Center object –> Propagate to Child Object, role=Read-only.<br/><br/> **Replication**: Create a role (Azure Site Recovery) with the required permissions, and then assign the role to a VMware vSphere user or group<br/><br/> Data Center object –> Propagate to Child Object, role=Azure Site Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots.<br/><br/><br/>**Note**:<br/>User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs, and networks).

### VM requirements (agent-based)

The table summarizes VMware vSphere VM support for VMware vSphere VMs you want to migrate using agent-based migration.

**Support** | **Details**
--- | ---
**Machine workload** | Azure Migrate supports migration of any workload (say Active Directory, SQL server, etc.) running on a supported machine.
**Operating systems** | For the latest information, review the [operating system support](../site-recovery/vmware-physical-azure-support-matrix.md#replicated-machines) for Site Recovery. Azure Migrate provides identical VM operating system support.
**Linux file system/guest storage** | For the latest information, review the [Linux file system support](../site-recovery/vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) for Site Recovery. Azure Migrate has identical Linux file system support.
**Network/Storage** | For the latest information, review the [network](../site-recovery/vmware-physical-azure-support-matrix.md#network) and [storage](../site-recovery/vmware-physical-azure-support-matrix.md#storage) prerequisites for Site Recovery. Azure Migrate provides identical network/storage requirements.
**Azure requirements** | For the latest information, review the [Azure network](../site-recovery/vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](../site-recovery/vmware-physical-azure-support-matrix.md#azure-storage), and [compute](../site-recovery/vmware-physical-azure-support-matrix.md#azure-compute) requirements for Site Recovery. Azure Migrate has identical requirements for VMware migration.
**Mobility service** | The Mobility service agent must be installed on each VM you want to migrate.
**UEFI boot** | Supported. UEFI-based VMs will be migrated to Azure generation 2 VMs.
**UEFI - Secure boot**         | Not supported for migration.
**Target disk** | VMs can only be migrated to managed disks (standard HDD, standard SSD, premium SSD) in Azure.
**Disk size** | up to 2-TB OS disk for gen 1 VM; up to 4-TB OS disk for gen 2 VM; 32 TB for data disks.
**Disk limits** |  Up to 63 disks per VM.
**Encrypted disks/volumes** | VMs with encrypted disks/volumes aren't supported for migration.
**Shared disk cluster** | Not supported.
**Independent disks** | Supported.
**Passthrough disks** | Supported.
**NFS** | NFS volumes mounted as volumes on the VMs won't be replicated.
**ReiserFS** | Not supported.
**iSCSI targets** | Supported.
**Multipath IO** | Not supported.
**Storage vMotion** | Supported
**Teamed NICs** | Not supported.
**IPv6** | Not supported.




### Appliance requirements (agent-based)

When you set up the replication appliance using the OVA template provided in the Azure Migrate hub, the appliance runs Windows Server 2022 and complies with the support requirements. If you set up the replication appliance manually on a physical server, then make sure that it complies with the requirements.

- Learn about [replication appliance requirements](migrate-replication-appliance.md#appliance-requirements) for VMware vSphere.
- Install MySQL on the appliance. Learn about [installation options](migrate-replication-appliance.md#mysql-installation).
- Learn about URLs that the replication appliance needs to access in [public](migrate-replication-appliance.md#url-access) and [government](migrate-replication-appliance.md#azure-government-url-access) clouds.
- Review the [ports](migrate-replication-appliance.md#port-access) the replication appliance needs to access.

### Port requirements (agent-based)

**Device** | **Connection**
--- | ---
VMs | The Mobility service running on VMs communicates with the on-premises replication appliance (configuration server) on port HTTPS 443 inbound, for replication management.<br/><br/> VMs send replication data to the process server (running on the configuration server machine) on port HTTPS 9443 inbound. This port can be modified.
Replication appliance | The replication appliance orchestrates replication with Azure over port HTTPS 443 outbound.
Process server | The process server receives replication data, optimizes, and encrypts it, and sends it to Azure storage over port 443 outbound.<br/> By default the process server runs on the replication appliance.

## Azure VM requirements

All on-premises VMs replicated to Azure (with agentless or agent-based migration) must meet the Azure VM requirements summarized in this table.

**Component** | **Requirements**
--- | --- | ---
Guest operating system | Verifies supported VMware VM operating systems for migration.<br/> You can migrate any workload running on a supported operating system.
Guest operating system architecture | 64-bit.
Operating system disk size | Up to 2,048 GB.
Operating system disk count | 1
Data disk count | 64 or less.
Data disk size | Up to 32 TB
Network adapters | Multiple adapters are supported.
Shared VHD | Not supported.
FC disk | Not supported.
BitLocker | Not supported.<br/><br/> BitLocker must be disabled before you migrate the machine.
VM name | From 1 to 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens.<br/><br/> The machine name must start and end with a letter or number.
Connect after migration-Windows | To connect to Azure VMs running Windows after migration:<br/><br/> - Before migration, enable RDP on the on-premises VM.<br/><br/> Make sure that TCP and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.<br/><br/> For site-to-site VPN access, enable RDP and allow RDP in **Windows Firewall** > **Allowed apps and features** for **Domain and Private** networks.<br/><br/> In addition, check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](prepare-for-migration.md).
Connect after migration-Linux | To connect to Azure VMs after migration using SSH:<br/><br/> Before migration, on the on-premises machine, check that the Secure Shell service is set to Start, and that firewall rules allow an SSH connection.<br/><br/> After failover, on the Azure VM, allow incoming connections to the SSH port for the network security group rules on the failed over VM, and for the Azure subnet to which it's connected.<br/><br/> In addition, add a public IP address for the VM.  


## Next steps

[Select](server-migrate-overview.md) a VMware vSphere migration option.
