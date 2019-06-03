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


# Azure Migrate architecture and processes

[Azure Migrate](migrate-services-overview.md) discovers, assesses, and migrates on-premises infrastructure, apps, and workloads to the Microsoft Azure cloud. This article summarizes the assessment and migration architecture and processes for Azure Migrate.

## Assessment and migration process

Azure Migrate assesses and migrates as follows:

- **Prepare for discovery and assessment**: You set up a lightweight appliance on-premises as a VMware VM or Hyper-V VM, and register the appliance with Azure Migrate.
    - For VMware VM migration, the appliance is created from an OVF template file (VMware) downloaded from the Azure portal.
    - For Hyper-V VM migration, the appliance is created from a compressed VM (Hyper-V) that's downloaded from the Azure portal. 
- **Discover**: The Collector app on the appliance runs to discover on-premises VMs. 
    - Nothing needs to be installed on the VMs you're discovering.
    - VM metadata includes information about cores, memory, disks, disk sizes, and network adapters.
    - Performance data includes information about CPU and memory usage, disk IOPS, disk throughput (MBps) , and network output (MBps)
- **Assess machines**: After discovery finishes, in the Azure portal you gather discovered VMs into groups that typically consist of VMs that you'd like to migrate together. You run an assessment on a group. After the assessment finishes, you can view it in the portal, or download it in Excel format. 
- **Migrate machines**: After you've analyze the assessments, you can migrate the machines to Azure.


## VMware assessment and migration


The diagram summarizes how VMware VM assessment works.

![Assessment architecture VMware](./media/migrate-overview/sas-architecture-vmware.png)

The process is as follows:

1. Create the Azure Migrate appliance:
    a. Download the (OVA) template from the Azure portal.
    b. Import it to the vCenter Server machine to create the VM.
    c. Connect to this VM, configure basic settings for it, and register it with Azure Migrate.
2. Initiate discovery:
    a. Connect to the Collector app running on the appliance to initiate discovery.
    b. The appliance is always connected to the Azure Migrate service, and and continually sends metadata and performance-related data from the VMs to Azure.
3. Assess machines:
    a. After discovery finishes, in the Azure portal you gather discovered VMs into groups.  A group typically consists of VMs that you'd like to migrate together.
    b. Run an assessment for each group.
4. Review assessment: After the assessment finishes, you can view it in the portal, or download it in Excel format.
5. Migrate machines: Based on the assessment recommendations, migrate on-premises machines to Azure.


### VMware ports
Azure Migrate uses the following connection ports for VMware:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | vCenter Server | Target-TCP 443 | Connect to vCenter Server for metadata and performance data. 443 is default but can be modified with vCenter listens on a different port. 
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.

### Collected VMware metadata

The appliance sends metadata and performance-related data from the VMs to Azure.

**Action** | **Details**
--- | ---
Environment changes | Environment changes during continuous discovery are captured. For example adding VMs in the discovery scope, or adding VM disks or NICs.
Discovered VMs | Nothing needs to be installed on discovered VMs.
Collected metadata: vCenter VM name; vCenter VM path (host/cluster folder); IP and MAC addresses; operating system; number of cores/disks/NICs; memory and disk size.
Collected performance data: CPU/memory usage; per disk data (disk read/write throughput; disk reads/writers per second), NIC data (network in, network out).<br/><br/> Performance data is collected from the day that the Collector app connects to vCenter Server. It doesn't collect historical data. 

## Hyper-V assessment and migration

The diagram summarizes how Hyper-V assessment works.

![Assessment architecture Hyper-V](./media/migrate-overview/sas-architecture-hyper-v.png)

The process is as follows:

1. Create the Azure Migrate appliance:
    a. Download the VM in compressed format from the Azure portal.
    b. Import it to a Hyper-V host.
    c. Connect to this VM, configure basic settings for it, and register it with Azure Migrate.
2. Initiate discovery:
    a. Connect to the Collector app running on the appliance to initiate discovery.
    b. The appliance is always connected to the Azure Migrate service using CIM sessions, and and continually sends metadata and performance-related data from the VMs to Azure.
3. Assess machines:
    a. After discovery finishes, in the Azure portal you gather discovered VMs into groups.  A group typically consists of VMs that you'd like to migrate together.
    b. Run an assessment for each group.
4. Review assessment: After the assessment finishes, you can view it in the portal, or download it in Excel format.
5. Migrate machines: Based on the assessment recommendations, migrate on-premises machines to Azure.


### Hyper-V ports

Azure Migrate service uses the following connection ports for Hyper-V:

**Source** | **Target** | **Port** | **Details**
--- | --- | --- | ---
Azure Migrate appliance | Azure Migrate service | Target-TCP 443 | Send metadata and performance data to Azure Migrate.
Azure Migrate appliance | Hyper-V host/cluster | Target-Default WinRM ports-HTTP:5985; HTTPS:5986 | Connect to host for metadata and performance data. CIM session used for connection
RDP client | Azure Migrate appliance | Target-TCP3389 | RDP connection to trigger discovery from the appliance.

## Collected Hyper-V VM metadata

**Action** | **Details**
--- | ---
Environment changes | Environment changes during continuous discovery are captured. For example adding VMs in the discovery scope, or adding VM disks or NICs.
Discovered VMs | Nothing needs to be installed on discovered VMs.
Collected metadata: VM name; vCenter VM path (host/cluster folder); IP and MAC addresses; operating system; number of cores/disks/NICs; memory and disk size, disk IOPS, disk throughput (MBps) , and network output (MBps)
Collected performance data: CPU/memory usage; per disk data (disk read/write throughput; disk reads/writers per second), NIC data (network in, network out).<br/><br/> Performance data is collected from the day that the Collector app connects to vCenter Server. It doesn't collect historical data. 


## Next steps

- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- For help from the community, visit the [Azure Migrate MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureMigrate&filter=alltypes&sort=lastpostdesc) or [Stack Overflow](https://stackoverflow.com/search?q=azure+migrate).

