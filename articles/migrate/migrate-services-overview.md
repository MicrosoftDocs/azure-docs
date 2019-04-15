---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 04/15/2019
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

Azure Migrate discovers, assesses, and migrates machines and workloads to the Microsoft Azure cloud. It helps you to 

- Assess Azure readiness: Assess whether your on-premises machines are suitable for running in Azure.
- Get size recommendations: Get size recommendations for Azure VMs based on the performance history of on-premises VMs.
- Estimate monthly costs: Get estimated costs for running on-premises machines in Azure.
- Migrate with high confidence: Visualize dependencies of on-premises machines to create groups of machines that you will assess and migrate together.

There are currently two versions of Azure Migrate:

- **Current version**: Using the current version of Azure Migrate, you can assess on-premises VMware VMs and Hyper-V VMs for migration to Azure, and migrate VMware VMs.
- **Previous version**: Using the previous version of Azure Migrate, you can continue to run assessments on VMs that have been discovered, but in discover new VMs, you need to run the new version.

This article provides an overview of the current version.

## Azure Migrate services 

The current version of Azure Migrate services provides a number of new features.

**Appliance**: A lightweight, easily-deployed appliance for discovery and assessment of on-premises VMware VMs and Hyper-V VMs.
**Improved user experience**: The deployment flow in the Azure portal is improved and streamlined.
**Continuous discovery of VMs**: There's no longer a need to trigger discovery when something changes on-premises.
**Improved performance data**: You no longer need to modify the vCenter Server statistics level to run performance-based assessment. The Azure Migrate appliance now measures performance data of the VMs.
**Migrate VMware VMs**:  Use Azure Migrate for the entire discovery, assessment, and migration process for VMware VMs. 
    - **Agentless migration**: You can migrate VMware VMs without installing anything on the VM.
    - **Unified appliance**: A single appliance nows handles discovery, assessment, and migration for VMware VMs. You don't need additional Azure Migrate components or agents.

## How does VMware assessment work?


The diagram summarizes how VMware VM assessment works.

![Assessment architecture VMware](./media/migrate-overview/sas-architecture-vmware.png)

The process is as follows:

1. You create an Azure Migrate appliance running as a VMware VM. You download a template file (OVA) from the Azure portal, and import it to vCenter Server to create the VM.
2. You connect to this VM, configure basic settings for it, and register it with Azure Migrate.
3. You connect to the Collector app running on the appliance to initiate discovery. 
4. After discovery finishes, in the Azure portal you gather discovered VMs into groups.  A group typically consists of VMs that you'd like to migrate together.
5. You run an assessment for each group.
1. After the assessment finishes, you can view it in the portal, or download it in Excel format.


### Discovery

The appliance is always connected to the Azure Migrate service, and continually sends metadata and performance-related data from the VMs to Azure.

- Environment changes during discovery are captured. For example adding VMs in the discovery scope, or adding VM disks or NICs.
- Nothing needs to be installed on discovered VMs.
- Collected metadata: vCenter VM name; vCenter VM path (host/cluster folder); IP and MAC addresses; operating system; number of cores/disks/NICs; memory and disk size.
- Collected performance data: CPU/memory usage; per disk data (disk read/write throughput; disk reads/writers per second), NIC data (network in, network out).
- Performance data is collected from the day that the Collector app connects to vCenter Server. It doesn't collect historical data. 


### VMware ports
Azure Migrate uses the following connection ports for VMware:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | vCenter Server | Target-TCP 443 | Connect to vCenter Server for metadata and performance data. 443 is default but can be modified with vCenter listens on a different port. 
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.

## How does Hyper-V assessment work?

The diagram summarizes how Hyper-V assessment works.

![Assessment architecture Hyper-V](./media/migrate-overview/sas-architecture-hyper-v.png)

The process is as follows:

1. You create an Azure Migrate appliance running as a Hyper-V VM. To do this, you download the VM in a compressed format and import it onto a Hyper-V host.
2. You connect to this VM, and run the Collector app that's installed on it.
3. You specify a list of Hyper-V hosts/clusters running the VMs you want to discover.
4. The appliance is always connected to the Azure Migrate service, and continually sends metadata and performance-related data from the VMs to Azure. The appliance uses CIM sessions to connect and collect VM information.
    - Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps)
5. After discovery finishes, in the Azure portal you gather discovered VMs into groups.and run an assessment on each group. A group typically consists of VMs that you'd like to migrate together.
6. After the assessment finishes, you can view it in the portal, or download it in Excel format.

### Hyper-V ports

Azure Migrate service uses the following connection ports for Hyper-V:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | Hyper-V host/cluster | Target-Default WinRM ports-HTTP:5985; HTTPS:5986 | Connect to host for metadata and performance data. CIM session used for connection
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.


## What happens after assessment?

After you've assessed on-premises machines, you can use a number of tools for migration:

- **Azure Migrate**: Use Azure Migrate to migrate lVMware VMs to Azure.
- **Azure Site Recovery**: Use Site Recovery to migrate Hyper-V VMs to Azure.
- **Database Migration Service**: If on-premises machines are running a database such as SQL Server, MySQL, or Oracle, you can use the [Azure Database Migration Service](../dms/dms-overview.md) to migrate them to Azure.



## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review](migrate-support-matrix.md) support requirements and limitations for discovery, assessment, and migration.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- For help from the community, visit the [Azure Migrate MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureMigrate&filter=alltypes&sort=lastpostdesc) or [Stack Overflow](https://stackoverflow.com/search?q=azure+migrate).

