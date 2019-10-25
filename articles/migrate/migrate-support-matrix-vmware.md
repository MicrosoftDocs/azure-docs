---
title: Azure Migrate support matrix for VMware assessment and migration
description: Summarizes support settings and limitations for assessment and migration of VMware VMs to Azure using the Azure Migrate service.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: raynew
---

# Support matrix for VMware assessment and migration

You can use [Azure Migrate](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes support settings and limitations for assessing and migrating on-premises VMware VMs.


## VMware scenarios

The table summarizes supported scenarios for VMware VMs.

**Deployment** | **Details**
--- | ---
**Assess on-premises VMware VMs** | [Set up](tutorial-prepare-vmware.md) your first assessment.<br/><br/> [Run](scale-vmware-assessment.md) a large-scale assessment.
**Migrate VMware VMs** | You can migrate using agentless migration, or use an agent-based migration. [Learn more](server-migrate-overview.md)


## Azure Migrate projects

**Support** | **Details**
--- | ---
**Azure permissions** | You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.
**VMware limitations**  | Assess up to 35,000 VMware VMs in a single project. You can create multiple projects in an Azure subscription. A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.
**Geography** | [Review](migrate-support-matrix.md#supported-geographies) supported geographies.

**Geography** | **Metadata storage location**
--- | ---
Azure Government | US Gov Virginia
Asia Pacific | East Asia or Southeast Asia
Australia | Australia East or Australia Southeast
Brazil | Brazil South
Canada | Canada Central or Canada East
Europe | North Europe or West Europe
France | France Central
India | Central India or South India
Japan |  Japan East or Japan West
Korea | Korea Central or Korea South
United Kingdom | UK South or UK West
United States | Central US or West US 2


 > [!NOTE]
 > Support for Azure Government is currently only available for the [older version](https://docs.microsoft.com/azure/migrate/migrate-services-overview#azure-migrate-versions) of Azure Migrate.


## Application discovery

Azure Migrate: Server Assessment can discover apps, role, and features. Discovering your app inventory allows you to identify and plan a migration path tailored for your on-premises workloads. Azure Migrate: Server Assessment provides agentless discovery, using machine guest credentials, remotely accessing machines using WMI and SSH calls.

**Support** | **Details**
--- | ---
Supported machines | On-premises VMware VMs
Machine operating system | All Windows and Linux versions
Credentials | Currently supports the use of one credential for all Windows servers, and one credential for all Linux servers. You create a guest user account for Windows VMs, and a regular/normal user account (non-sudo access) for all Linux VMs.
Machine limits for app-discovery | 10000 per appliance. 35000 per project

## Assessment-vCenter Server requirements

This table summarizes assessment support and limitations for VMware virtualization servers.

**Support** | **Details**
--- | ---
**vCenter server** | VMware VMs you want to assess must be managed by one or more vCenter Servers running 5.5, 6.0, 6.5, or 6.7.

## Assessment-vCenter Server permissions

For assessment, you need a read-only account for the vCenter Server.

## Assessment-appliance requirements

Azure Migrate runs a lightweight appliance to discover VMware VMs, and send VM metadata and performance data to Azure Migrate. Appliance for VMware is deployed using an OVA template imported into vCenter Server. The following table summarizes the appliance requirements.

**Support** | **Details**
--- | ---
**Appliance deployment** | You deploy the appliance as a VMware VM. You need enough resources on the vCenter Server to allocate a VM with 32 GB RAM, 8 vCPUs, around 80 GB of disk storage, and an external virtual switch.<br/><br/> The appliance requires internet access, either directly or through a proxy.<br/> The appliance VM must be deployed on an ESXi host running version 5.5 or later.
**Azure Migrate project** | An appliance can be associated with a single project. <br/> Any number of appliances can be associated with a single project.<br/> You can assess up to 35,000 VMs in a project.
**Discovery** | An appliance can discover up to 10,000 VMware VMs on a vCenter Server.<br/> An appliance can connect to a single vCenter Server.
**Assessment group** | You can add up to 35,000 machines in a single group.
**Assessment** | You can assess up to 35,000 VMs in a single assessment.


## Assessment-URL access requirements

The Azure Migrate appliance needs connectivity to the internet.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based proxy to connect to the internet, allow access to these URLs, making sure that the proxy resolves any CNAME records received while looking up the URLs.

**URL** | **Details**  
--- | --- |
*.portal.azure.com  | Navigate to the Azure Migrate in the Azure portal.
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com | Log into your Azure subscription.
*.microsoftonline.com <br/> *.microsoftonline-p.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
management.azure.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com <br/> *.migration.windowsazure.com <br/> *.hypervrecoverymanager.windowsazure.com | Connect to Azure Migrate service URLs.
*.blob.core.windows.net | Upload data to storage accounts.
http://aka.ms/latestapplianceservices<br/><br/> https://download.microsoft.com/download | Used for Azure Migrate appliance updates.

## Assessment-port requirements

**Device** | **Connection**
--- | ---
Appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ```https://<appliance-ip-or-name>:44368``` <br/><br/>Outbound connections on port 443, 5671 and 5672 to send discovery and performance metadata to Azure Migrate.
vCenter server | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/><br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.

## Assessment-dependency visualization

Dependency visualization helps you to visualize dependencies across machines that you want to assess and migrate. You typically use dependency mapping when you want to assess machines with higher levels of confidence. For VMware VMs, dependency visualization is supported as follows:

- **Agentless dependency visualization**: This option is currently in preview. It doesn't require you to install any agents on machines.
    - It works by capturing the TCP connection data from machines for which it's enabled. After dependency discovery is started, the appliance gathers data from machines at a polling interval of five minutes.
    - The following data is collected:
        - TCP connections
        - Names of processes that have active connections
        - Names of installed applications that run the above processes
        - No. of connections detected at every polling interval
- **Agent-based dependency visualization**: To use agent-based dependency visualization, you need to download and install the following agents on each on-premises machine that you want to analyze.
    - Microsoft Monitoring agent (MMA) needs to be installed on each machine. [Learn more](how-to-create-group-machine-dependencies.md#install-the-mma) about how to install the MMA agent.
    - The Dependency agent needs to be installed on each machine. [Learn more](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) about how to install the dependency agent.
    - In addition, if you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

## Migration - limitations
You can select up to 10 VMs at once for replication. If you want to migrate more machines, then replicate in groups of 10. For VMware agentless migration, you can run up to 100 replications simultaneously.

## Agentless migration-VMware server requirements

This table summarizes assessment support and limitations for VMware virtualization servers.

**Support** | **Details**
--- | ---
vCenter Server | Version 5.5, 6.0, 6.5, or 6.7.
VMware vSphere | Version 5.5, 6.0, 6.5, or 6.7,

## Agentless migration-vCenter Server permissions

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


## Agentless migration-VMware VM requirements

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


## Agentless migration-appliance requirements


**Support** | **Details**
--- | ---
**ESXi** | The appliance VM must be deployed on an ESXi host running version 5.5 or later.
**Azure Migrate project** | An appliance can be associated with a single project.
**vCenter Server** | An appliance can discover up to 10,000 VMware VMs on a vCenter Server.<br/> An appliance can connect to one vCenter Server.
**VDDK** | If you're running an agentless migration with Azure Migrate Server Migration, the VMware vSphere VDDK must be installed on the appliance VM.

## Agentless migration-URL access requirements

The Azure Migrate appliance needs internet connectivity to the internet.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based proxy, allow access to these URLs, making sure that the proxy resolves any CNAME records received while looking up the URLs.

**URL** | **Details**  
--- | ---
*.portal.azure.com | Navigate to the Azure Migrate in the Azure portal.
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com  | Log into your Azure subscription.
*.microsoftonline.com <br/> *.microsoftonline-p.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
management.azure.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com <br/> *.migration.windowsazure.com <br/> *.hypervrecoverymanager.windowsazure.com | Connect to Azure Migrate service URLs.
*.blob.core.windows.net | Upload data to storage accounts.
http://aka.ms/latestapplianceservices<br/><br/> https://download.microsoft.com/download | Used for Azure Migrate appliance updates.


## Agentless migration-port requirements

**Device** | **Connection**
--- | ---
Appliance | Outbound connections on port 443 to upload replicated data to Azure, and to communicate with Azure Migrate services orchestrating replication and migration.
vCenter server | Inbound connections on port 443 to allow the appliance to orchestrate replication - create snapshots, copy data, release snapshots
vSphere/EXSI host | Inbound on TCP port 902 for the appliance to replicate data from snapshots.


## Agent-based migration-VMware server requirements

This table summarizes assessment support and limitations for VMware virtualization servers.

**Support** | **Details**
--- | ---
vCenter Server | Version 5.5, 6.0, 6.5, or 6.7.
VMware vSphere | Version 5.5, 6.0, 6.5 or 6.7.

### Agent-based migration-vCenter Server permissions

A read-only account for vCenter Server.

## Agent-based migration-Replication appliance requirements

The requirements for the [replication appliance](migrate-replication-appliance.md) used for agent-based migration of VMware VMs and physical servers with Azure Migrate Server Migration are summarized in the table.

> [!NOTE]
> When you set up the replication appliance using the OVA template provided in the Azure Migrate hub, the appliance runs Windows Server 2016 and complies with the support requirements. If you set up the replication appliance manually on a physical server, then make sure that it complies with the requirements.



**Component** | **Requirement**
--- | ---
 | **VMware settings** (VMware VM appliance)
PowerCLI | [PowerCLI version 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1) should be installed if the replication appliance is running on a VMware VM.
NIC type | VMXNET3 (if the appliance is a VMware VM)
 | **Hardware settings**
CPU cores | 8
RAM | 16 GB
Number of disks | Three: The OS disk, process server cache disk, and retention drive.
Free disk space (cache) | 600 GB
Free disk space (retention disk) | 600 GB
**Software settings** |
Operating system | Windows Server 2016 or Windows Server 2012 R2
Operating system locale | English (en-us)
TLS | TLS 1.2 should be enabled.
.NET Framework | .NET Framework 4.6 or later should be installed on the machine (with strong cryptography enabled.
MySQL | MySQL should be installed on the appliance.<br/> MySQL should be installed. You can install manually, or Site Recovery can install it during appliance deployment.
Other apps | Don't run other apps on the replication appliance.
Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V
Group policies | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](https://technet.microsoft.com/library/gg176671(v=ws.10).aspx)
IIS | - No pre-existing default website <br> - No pre-existing website/application listening on port 443 <br>- Enable  [anonymous authentication](https://technet.microsoft.com/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/library/cc753077(v=ws.10).aspx) setting
**Network settings** |
IP address type | Static
Ports | 443 (Control channel orchestration)<br>9443 (Data transport)
NIC type | VMXNET3

### Replication appliance URL access

The replication appliance needs access to these URLs.

**URL** | **Details**
--- | ---
\*.backup.windowsazure.com | Used for replicated data transfer and coordination
\*.store.core.windows.net | Used for replicated data transfer and coordination
\*.blob.core.windows.net | Used to access storage account that stores replicated data
\*.hypervrecoverymanager.windowsazure.com | Used for replication management operations and coordination
https:\//management.azure.com | Used for replication management operations and coordination
*.services.visualstudio.com | Used for telemetry purposes (It is optional)
time.nist.gov | Used to check time synchronization between system and global time.
time.windows.com | Used to check time synchronization between system and global time.
https:\//login.microsoftonline.com <br/> https:\//secure.aadcdn.microsoftonline-p.com <br/> https:\//login.live.com <br/> https:\//graph.windows.net <br/> https:\//login.windows.net <br/> https:\//www.live.com <br/> https:\//www.microsoft.com  | OVF setup needs access to these URLs. They are used for access control and identity management by Azure Active Directory
https:\//dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-5.7.20.0.msi | To complete MySQL download


#### MySQL installation options

MySQL can be installed on the replication appliance using one of these methods.

**Method** | **Details**
--- | ---
Download and install manually | Download MySQL application & place it in the folder C:\Temp\ASRSetup, then install manually.<br/> When you set up the appliance MySQL will show as already installed.
Without online download | Place the MySQL installer application in the folder C:\Temp\ASRSetup. When you install the appliance and click to download and install MySQL, setup will use the installer you added.
Download and install in Azure Migrate | When you install the appliance and are prompted for MySQL, select **Download and install**.



## Agent-based migration-VMware VM requirements

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
iSCSI targets | VMs with iSCSI targets aren't supported for agentless migration.
**Multipath IO** | Not supported.
**Storage vMotion** | Supported
**Teamed NICs** | Not supported.
**IPv6** | Not supported.




## Agent-based migration-URL access requirements

The Mobility service running on VMware VMs needs internet connectivity.

When you deploy the Mobility service, it does a connectivity check to the URLs summarized in the table below.


**URL** | **Details**  
--- | ---
*.portal.azure.com | Navigate to the Azure Migrate in the Azure portal.
*.windows.net | Log into your Azure subscription.
*.microsoftonline.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
management.azure.com | Create Active Directory apps for the appliance to communicate with the Azure Migrate service.
dc.services.visualstudio.com | Upload app logs used for internal monitoring.
*.vault.azure.net | Manage secrets in the Azure Key Vault.
*.servicebus.windows.net | Communication between the appliance and the Azure Migrate service.
*.discoverysrv.windowsazure.com <br/> *.migration.windowsazure.com <br/> *.hypervrecoverymanager.windowsazure.com | Connect to Azure Migrate service URLs.
*.blob.core.windows.net | Upload data to storage accounts.

## Agent-based migration-port requirements

**Device** | **Connection**
--- | ---
VMs | The Mobility service running on VMs communicates with the on-premises replication appliance (configuration server) on port HTTPS 443 inbound, for replication management.<br/><br/> VMs send replication data to the process server (running on the configuration server machine) on port HTTPS 9443 inbound. This port can be modified.
Replication appliance | The replication appliance orchestrates replication with Azure over port HTTPS 443 outbound.
Process server | The process server receives replication data, optimizes, and encrypts it, and sends it to Azure storage over port 443 outbound.<br/> By default the process server runs on the replication appliance.

## Azure VM requirements

All on-premises VMs replicated to Azure must meet the Azure VM requirements summarized in this table. When Site Recovery runs a prerequisites check for replication, the check will fail if some of the requirements aren't met.

**Component** | **Requirements** | **Details**
--- | --- | ---
Guest operating system | Verify supported operating systems for [VMware VMs using agentless replication](#agentless-migration-vmware-vm-requirements), and for [VMware VMs using agent-based replication](#agent-based-migration-vmware-vm-requirements).<br/> You can migrate any workload running on a supported operating system. | Check fails if unsupported.
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

[Prepare for VMware](tutorial-prepare-vmware.md) assessment and migration.
