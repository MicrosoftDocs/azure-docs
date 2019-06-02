---
title: Azure Migrate support matrix for VMware assessment and migration
description: Provides a summary of support settings and limitations for assessment and migration of VMware VMs to Azure using the Azure Migrate service.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 06/02/2019
ms.author: raynew
---

# Support matrix for VMware assessment and migration

You can use the [Azure Migrate service](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes general support settings and limitations for assessing and migrating on-premises VMware VMs.

## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: This version should be used for all new Azure Migrate projects, assessments, and migrations. [Learn more](whats-new.md#azure-migrate-new-version) about the new features in this version.
- **Previous version**: The previous version of Azure Migrate only provided assessment of on-premises VMware VMs for migration to Azure. You can't create new Azure Migrate projects in this version.


The support information in this article refers to the current Azure Migrate version.

## Supported migration scenarios

The table summarizes supported migration scenarios.

**Deployment** | **Details*** 
--- | --- 
**Assess on-premises VMware VMs** | [Set up](tutorial-prepare-vmware.md) your first assessment.<br/><br/> [Run](scale-vmware-assessment.md) a large-scale assessment.
**Migrate VMware VMs** **| You can migrate using agentless migration, with some limitations, or use an agent-based migration. [Learn more](server-migrate-overview.md)
**Assess and migrate on-premises Hyper-V VMs** | [Set up](tutorial-prepare-hyper-v.md) your first assessment.<br/><br/> [Run](scale-hyper-v-assessment.md) a large-scale assessment.<br/> [Try out](tutorial-migrate-hyper-v.md) migration to Azure.
**Migrate physical servers to Azure** | Migrate on-premises physical servers to Azure
**Migrate AWS** | Migrate AWS Windows instances to Azure
**Migrate databases to Azure** | Migrate databases to Azure using the Database Migration Service (DMS).

    
## Supported regions for migration

Azure Migrate currently supports 30 target regions for migration, including:

- Australia East, Australia Southeast
- Brazil South
- Canada Central, Canada East,
- Central India, South India,
- Central US, East US, East US 2, North Central US, South Central US,
- China East, China North
- East Asia, Southeast Asia
- Germany Central, Germany Northeast
- North Europe,
- Japan East, Japan West
- Korea Central, Korea South
- UK South, UK West 

West US 2 is the default location.



## Azure Migrate project support

**Support** | **Details**
--- | ---
VMware VMs  | Assess up to 35,000 VMs in a single project.

The project can include both VMware VMs and Hyper-V VMs, up to the assessment limit.


## Azure Migrate appliance support

**Support** | **Details**
--- | ---
**ESXi** | The appliance VM must be deployed on an ESXi host running version 5.5 or later.
**Azure Migrate project** | An appliance can be associated with a single project.
**VMware limitations** | An appliance can discover up to 10,000 VMware VMs on a vCenter Server<br/> An appliance can connect to one vCenter Server.
**Migration support** | To start replicating machines, the Migration Gateway service on the appliance must be 1.18.7141.12919 or later. Sign into the appliance web app to check the version.
**VDDK** | If you're running an agentless migration with Azure Migrate Server Migration, the VMware vSphere Virtual Disk Development Kit (VDDK) must be installed on the appliance VM.


## VMware requirements

This table summarizes assessment support and limitations for VMware virtualization servers

**Support** | **Details**
--- | ---
**vCenter server** | For assessment and migration you need one or more vCenter Servers running 5.5, 6.0, 6.5, or 6.7.
**ESXi host** | For assessment and migration, you need one or more ESXi hosts running version 5.5 or higher.

## vCenter account permissions

These tables summarize the vCenter Server account permissions needed for VM discovery, assessment, and migration.


### Discovery and assessment

**Permissions** | **Details**
--- | --- 
Read-only account | 

### Migration (agentless)
**Permissions** | **Details**
--- | --- 
Datastore.Browse | Allow browsing of VM log files to troubleshoot snapshot creation and deletion.
Datastore.LowLevelFileOperations | Allow read/write/delete/rename operations in the datastore browser, to troubleshoot snapshot creation and deletion.
VirtualMachine.Configuration.DiskChangeTracking | Allow enable or disable change tracking of VM disks, to pull changed blocks of data between snapshots
VirtualMachine.Configuration.DiskLease | Allow disk lease operations for a VM, to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).
VirtualMachine.Provisioning.AllowReadOnlyDiskAccess | Allow opening a disk on a VM, to read the disk using the VDDK.
VirtualMachine.Provisioning.AllowVirtualMachineDownload  | Allows read operations on files associated with a VM, to download the logs and troubleshoot if failure occurs. 
VirtualMachine.SnapshotManagement.* | Allow creation and management of VM snapshots for replication. 
Virtual Machine.Interaction.Power Off | Allow the VM to be powered off during migration to Azure.


### Migration: agent-based

**Permissions** | **Details**
--- | --- 
Datastore.AllocateSpace | Allow space allocation on a datastore for a VM, snapshot, clone, or virtual disk. 
Datastore.Browse | Allow browsing of VM log files to troubleshoot snapshot creation and deletion.
Datastore.LowLevelFileOperations | Allow read, write, delete, and rename operations in the datastore browser to troubleshoot snapshot creation/deletion.
Datastore.UpdateVirtualMachineFiles | Allow updating paths to VM files on a datastore after the datastore has been resignatured.
Network.AssignNetwork | Allow assigning a network to a VM Resource.
AssignVirtualMachineToResourcePool | Allow assignment of a VM to a resource pool.
Resource.MigratePoweredOffVirtualMachine | Allow migration of a powered off VM to a different resource pool or host.
Resource.MigratePoweredOnVirtualMachine | Allow migration using vMotion, of a powered-on VM to a different resource pool or host.
Tasks.CreateTask | Allow an extension to create a user-defined task.
Tasks.UpdateTask | Allow an extension to update a user-defined task.
VirtualMachine.Configuration. | Allow configuring VM options and devices.
Virtual Machine.Interaction.AnswerQuestion | Allow resolution of issues with VM state transitions or runtime errors.
Virtual Machine.Interaction.DeviceConnection | Allow changing the connected state of a VM's disconnectable virtual devices.
Virtual Machine.Interaction.ConfigureCDMedia | Allow configuration of a virtual DVD or CD-ROM device.
Virtual Machine.Interaction.ConfigureFloppyMedia | Allow configuration of a virtual floppy device.
Virtual Machine.Interaction.PowerOff | Allows for the VM to be powered off during migration to Azure.
Virtual Machine.Interaction.PowerOn | Allow powering on a powered-off VM, and resuming a suspended VM.
Virtual Machine.Interaction.VMwareToolsInstall | Allow mounting and unmounting the VMware Tools CD installer as a CD-ROM for the guest operating system. VirtualMachine.Inventory.CreateNew | Allow creation of a VM and allocation of required resources.
VirtualMachine.Inventory.Register | Allow adding an existing VM to a vCenter Server or host inventory.
VirtualMachine.Inventory.Unregister | Allow unregistering a VMe from a vCenter Server or host inventory.
VirtualMachine.Provisioning.AllowVirtualMachineFilesUpload | Allow write operations on files associated with a VM, including vmx, disks, logs, and nvram.
VirtualMachine.Provisioning.AllowVirtualMachineDownload | Allow read operations on files associated with a VM, to download the logs for troubleshooting.
VirtualMachine.SnapshotManagement.RemoveSnapshot | Allow removal of a snapshot from the snapshot history.


## VMware VM agentless migration

**Support** | **Details**
--- | ---
**Supported operating system** | ll [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) operating systems that are supported by Azure can be migrated using agentless migration.
**Required changes for Azure** | Some VMs might require changes so that they can run in Azure. Azure Migrate makes these changes automatically for the following operating systems:<br/> - Red Hat Enterprise Linux 6.5+, 7.0+<br/> - CentOS 6.5+, 7.0+</br> - SUSE Linux Enterprise Server 12 SP1+<br/> - Ubuntu 14.04LTS, 16.04LTS, 18.04LTS<br/> - Debian 7,8<br/><br/> For other operating systems, you need to make adjustments manually before migration. The relevant articles contain instructions about how to do this.
**Linux boot** | If /boot is on a dedicated partition, it should reside on the OS disk, and not be spread across multiple disks.<br/> If /boot is part of the root (/) partition, then the ‘/’ partition should be on the OS disk, and not span other disks.
**UEFI boot** | VMs with UEFI boot aren't supported for migration.
**Encrypted disks/volumes** | VMs with encrypted disks/volumes aren't supported for migration.
**RDM/passthrough disks** | If VMs have RDM or passthrough disks, these disks won't be replicated to Azure.
**NFS** | NFS volumes mounted as volumes on the VMs won't be replicated.
**Target disk** | You can migrate to Azure VMs with managed disks only.

## VMware VM agent-based migration

**Support** | **Details**
--- | ---
**Machine workload** | Azure Migrate supports migration of any workload (say Active Directory, SQL server etc) running on a supported machine.
**Operating systems** | For the latest information, review the [operating system support](../site-recovery/vmware-physical-azure-support-matrix.md#replicated-machines) for Site Recovery. Azure Migrate provides identical VM operating system support.
**Linux file system/guest storage** | For the latest information, review the [Linux file system support](../site-recovery/vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) for Site Recovery. Azure Migrate has identical Linux file system support.
**Network/Storage** | For the latest information, review the [network](../site-recovery/vmware-physical-azure-support-matrix.md#network) and [storage](../site-recovery/vmware-physical-azure-support-matrix.md#storage) prerequisites for Site Recovery. Azure Migrate provides identical network/storage requirements.
**Azure requirements** | For the latest information, review the [Azure network](../site-recovery/vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](../site-recovery/vmware-physical-azure-support-matrix.md#azure-storage), and [compute](../site-recovery/vmware-physical-azure-support-matrix.md#azure-compute) requirements for Site Recovery. Azure Migrate has identical requirements for VMware migration.
**Mobility service** | The Mobility service agent must be installed on each VM you want to migrate.





## Collected data

The Azure Migrate appliance collects machine metadata and performance data, as summarized in the table.

**Data** | **Details**
--- | ---
**Metadata** | VM display name on vCenter Server; VM inventory path (host/cluster/folder) in vCenter Server; IP address, MAC address, operating system, number of cores/disks/NICs; memory/disk sizes; VM power status
**Performance data** | CPU usage; memory usage; per disk information (Disk read/write throughput/Disk read/write operations per second); per NIC information (network in/out).

- Performance data is collected every 20 seconds for each metric. These 20-second datapoints are rolled up to create a single datapoint every five minutes, and sent to Azure for assessment calculation.
- Based on the percentile specified in the assessment, the appropriate value is selected from the five-minute datapoints for assessment computation.
  
## Disk support

**Support** | **Details**
--- | ---
Migrated disks | VMs can only be migrated to managed disks (standard HHD, premium SSD) in Azure.
   

## URL access requirements

The Azure Migrate appliance needs internet connectivity to the internet.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based firewall.proxy, allow access to these URLs, making sure that the proxy resolves any CNAME records received while looking up the URLs.

**URL** | **Details**  
--- | --- 
*.portal.azure.com | Navigate to the Azure Migrate in the Azure portal.
*.windows.net | Log into your Azure subscription.
*.microsoftonline.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service. 
management.azure.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com | 
*.migration.windowsazure.com | *.hypervrecoverymanager.windowsazure.com | Connect to Azure Migrate service URLs.
*.blob.core.windows.net | Upload data to storage accounts.

## Required ports

### Assessment ports

**Device** | **Connection**
--- | --- 
Appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: https://<appliance-ip-or-name>:44368 <br/>Outbound connections on port 443 to send discovery and performance metadata to Azure Migrate.
vCenter server | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.


## Agentless migration

**Device** | **Connection**
--- | --- 
Appliance | Outbound connections on port 443 to upload replicated data to the Azure storage account, and to communicate with Azure Migrate services for replication and migration.
vCenter server | Inbound connections on TCP port 443 to allow the appliance to orchestrate replication, create snapshots, copy data, release snapshots.
vSphere/EXSi hosts | Inbound connections on TCP port 902 for the appliance to replicate data from snapshots.

## Agent-based migration

**Device** | **Connection**
--- | --- 
VMs | VMs communicate with the on-premises configuration server on port HTTPS 443 inbound, for replication management.<br/> VMs send replication data to the process server (running on the configuration server machine) on port HTTPS 9443 inbound. This port can be modified.
Configuration server | The configuration server orchestrates replication with Azure over port HTTPS 443 outbound.
Process server | The process server receives replication data, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.



## Next steps

[Prepare for VMware](tutorial-prepare-vmware.md) assessment and migration.



