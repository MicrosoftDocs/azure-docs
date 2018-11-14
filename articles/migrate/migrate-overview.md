---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 11/06/2018
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

Azure Migrate services discover, assess, and migrate on-premises machines and workloads to the Microsoft Azure cloud.

There are currently two versions of Azure Migrate available:

- **Azure Migrate in public preview**:
    - **Azure Migrate Server Assessment** discovers and assesses on-premises VMware VMs and Hyper-V - VMs to check whether they're suitable for migration to Azure.
    - **Azure Migrate Server Migration** migrates on-premises VMware VMs to Azure.
- **Azure Migrate in General Availability (GA)** discovers and assessment on-premises VMware VMs for migration to Azure.


## Which version of the service should I use?

- If you want to assess Hyper-V VMs this functionality is only available in the public preview.
- If you're assessing VMware VMs, we recommend that you don't deploy the public preview in a production environment.
- Review the features and limitations for each service version below.



## Azure Migrate services public preview

The public preview provides a number of new features.

### Assessment

- **Hyper-V VM assessment**: Use Azure Migrate Server Assessment to discover and assess Hyper-V VMs.
- **VMware VM assessment**: Get an enhanced experience for discovering and assessment VMware VMs, including:
    - **Continuous discovery**: Discovery of on-premises VMs with the Azure Migrate appliance is now continuous. You no longer need to trigger discovery when something changes on-premises. The appliance is aware of on-premises vCenter Server changes.
    - **Improved performance-based assessment**: You no longer need to modify the vCenter Server statistics level to run performance-based assessment. The Azure Migrate appliance now measures performance data of the VMs.
    - **Improved user experience**: The deployment flow in the Azure portal is improved and streamlined.

### Migration
- **Migrate VMware VMs to Azure**: Use Azure Migrate Server Migration to migrate VMware VMs. With this new functionality, you can use Azure Migrate for the entire discovery, assessment, and migration process for VMware. Assessment information helps you to automatically configure compute and storage for migrated machines.
- **Agentless migration**: You can migrate VMware VMs without installing anything on the VM.
- **Unified Azure Migrate appliance**: A single appliance running on a VMware VM handles discovery, assessment, and migration. You don't need any additional Azure Migrate components.


### Limitations

- You can discover up to 1500 VMs using a single Azure Migrate appliance.
- Dependency visualization during assessment isn't currently available.
- A number of functionalities that are available in the earlier GA version of Azure Migrate aren't yet available in this public preview. For example, reserved instanced and VM-series filter.
- Only managed disks are supported.




### VMware architecture

![Assessment architecture VMware](./media/migrate-overview/sas-architecture-vmware.png)

The process is as follows:

1. You create an Azure Migrate appliance running as a VMware VM. To create the VM, you download an OVF template from Azure portal, and import it to vCenter Server.
2. You connect to this VM, and run the Collector app that's installed on it.
3. The Collector app discovers VM information from vCenter Server.
4. The appliance is always connected to the Server Assessment service, and continually sends metadata and performance-related data from the VMs to Azure.
    - Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps).
5. After discovery finishes, in the Azure portal you gather discovered VMs into groups.and run an assessment on each group. A group typically consists of VMs that you'd like to migrate together.
6. After the assessment finishes, you can view it in the portal, or download it in Excel format.

The Server Assessment service uses the following connection ports for VMware:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | vCenter Server | Target-TCP 443 | Connect to vCenter Server for metadata and performance data. 443 is default but can be modified with vCenter listens on a different port. 
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.

### Hyper-V architecture

![Assessment architecture Hyper-V](./media/migrate-overview/sas-architecture-hyper-v.png)

The process is as follows:


1. You create an Azure Migrate appliance running as a Hyper-V VM. To do this, you download the VM in a compressed format and import it onto a Hyper-V host.
2. You connect to this VM, and run the Collector app that's installed on it.
3. You specify a list of Hyper-V hosts/clusters running the VMs you want to discover.
4. The appliance is always connected to the Server Assessment service, and continually sends metadata and performance-related data from the VMs to Azure. The appliance uses CIM sessions to connect and collect VM information.
    - Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps).
5. After discovery finishes, in the Azure portal you gather discovered VMs into groups.and run an assessment on each group. A group typically consists of VMs that you'd like to migrate together.
6. After the assessment finishes, you can view it in the portal, or download it in Excel format.

The Server Assessment service uses the following connection ports for Hyper-V:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | Hyper-V host/cluster | Target-Default WinRM ports-HTTP:5985; HTTPS:5986 | Connect to host for metadata and performance data. CIM session used for connection
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.

## Azure Migrate GA version

The GA version of Azure Migrate provides the following:

- **VMware VM assessment**: Discover and assess on-premises VMware VMs as follows:
    - **Assess Azure readiness**: Assess whether your on-premises machines are suitable for running in Azure.
    - **Get size recommendations**: Get size recommendations for Azure VMs based on the performance history of on-premises VMs.
    - **Estimate monthly costs**: Get estimated costs for running on-premises machines in Azure.  
    - **Assess with higher confidence**: Visualize dependencies of on-premises machines to create groups of machines that you will assess and migrate together.
- **Migration**: Azure Migrate doesn't perform the migration. After the assessment, you can use services such as [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview) and [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview), to migrate the machines to Azure.

[Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.


## Limitations

**Action** | **Details**
--- | --- 
**Azure Migrate deployment** | Azure Migrate supports up to 20 projects per subscription.<br/><br/> You can only create an Azure Migrate project in the United States geography. Note that:<br/><br/> - You can plan a migration to any target Azure location.<br/><br/> - Only metadata discovered from the on-premises environment is stored in the migration project region.<br/><br/>  - Metadata is stored in one of the regions in the geography: West Central US/East US.<br/><br/> If you use dependency visualization with a Log Analytics workspace, it's created in the same region as the project.<br/><br/> There are limited built-in monitoring and troubleshooting capabilities.
**Discovery and assessment** | You can assess on-premises Hyper-V VMs and VMware VMs.<br/><br/> You can discover up to 1500 VMs in a single discovery and up to 1500 VMs in a single project.<br/><br/> You can assess up to 1500 VMs in a single assessment. If you want to discover a larger environment, split the discovery and create multiple projects. [Learn more](how-to-scale-assessment.md).<br/><br/> Azure Migrate only supports managed disks for assessment.<br/><br/> The VMware VMs must be managed by vCenter Server (version 5.5, 6.0, or 6.5).
**Replication and migration** | You can only migrate on-premises VMware VMs with Azure Migrate.<br/><br/> You can simultaneously migrate up to five VMs. Performance might be impacted over this limit.<br/><br/> A single VM is limited to 16 disks.<br/><br/> The combined maximum of five VMs can have a a total of 20 or less disks. If you have more, migrate VMs in batches.<br/><br/> During migration, each VM disk can have an average data change rate (write bytes/sec) of up to 5 MBps. Higher rates are supported, but performance will vary depending on available upload throughput, overlapping writes etc.<br/><br/> VMs can only be migrated to managed disks (standard HHD, premium SSD) in Azure.<br/><br/>
VM settings | Supported Windows operating systems for VMware VMs: Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008 (64-bit, 32-bit), Windows Server 2003 R2 (64-bit, 32-bit), Windows Server 2003<br/><br/> Supported Linux operating systems for VMware VMs: Red Hat Enterprise Linux 7.0+/6.5+, CentOS 7.0+/6.5+, SUSE Linux Enterprise Server 12 SP1+, Ubuntu 14.04/16.04/18.04LTS, Debian 7/8 <br/><br/> VMs will UEFI boot can't be migrated.<br/><br/> Encrypted disks and volumes (Bitlocker, cryptfs) can't be migrated.<br/><br/> RDM devices/passthrough disks can't be replicated.<br/><br/> NFS volumes on VMs can't be replicated.


## How does it work?

1. You create an Azure Migrate appliance running as a VMware VM. The appliance is created from an OVF template.
2. You connect to this VM, and run the Collector app that's installed on it.
3. You run the Collector app and trigger VM discovery. The appliance sends VM metadata and performance-related data from the VMs to Azure. Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps).
4. After discovery finishes, in the Azure portal you gather discovered VMs into groups and run an assessment on each group. A group typically consists of VMs that you'd like to migrate together. For more precise groups you can use the dependency visualization feature to view dependencies for a specific VM, or for all VMs in a group.
5. After the assessment finishes, you can view it in the portal, or download it in Excel format.


  ![Azure Migrate v1 architecture](./media/migrate-overview/migratev1-architecture.png)

The following connection ports are used.


**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Collector  | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Collector | vCenter Server | Target-TCP 443 | Connect to vCenter Server for metadata and performance data. 443 is default but can be modified with vCenter listens on a different port. 
On-premises VM | Log Analytics Workspace | [TCP 443] | [The Microsoft Monitoring Agent (MMA)](../log-analytics/log-analytics-windows-agent.md) uses TCP port 443 to connect to Log Analytics. You only need this port if you're using dependency visualization, that requires the MMA agent.


### What happens after assessment?

After you've assessed on-premises machines, you can use a couple of tools to perform the migration:

- **Azure Site Recovery**: You can use Azure Site Recovery to migrate to Azure. To do this, you [prepare the Azure components](../site-recovery/tutorial-prepare-azure.md) you need, including a storage account and virtual network. On-premises, you [prepare your VMware environment](../site-recovery/vmware-azure-tutorial-prepare-on-premises.md). When everything's prepared, you set up and enable replication to Azure, and migrate the VMs. [Learn more](../site-recovery/vmware-azure-tutorial.md).
- **Azure Database Migration**: If on-premises machines are running a database such as SQL Server, MySQL, or Oracle, you can use the [Azure Database Migration Service](../dms/dms-overview.md) to migrate them to Azure.


## Next steps

- [Follow the tutorial](tutorial-assessment-vmware.md) to create an assessment for an on-premises VMware VM.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
