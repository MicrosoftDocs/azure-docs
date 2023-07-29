---
title: Azure VMs HA architecture and scenarios for SAP NetWeaver | Microsoft Docs
description: High-availability architecture and scenarios for SAP NetWeaver on Azure Virtual Machines
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/02/2023
ms.author: radeltch
---

# High-availability architecture and scenarios for SAP NetWeaver

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png
[sap-ascs-ha-multi-sid-wsfc-file-share]:sap-ascs-ha-multi-sid-wsfc-file-share.md
[sap-ascs-ha-multi-sid-wsfc-shared-disk]:sap-ascs-ha-multi-sid-wsfc-shared-disk.md
[sap-higher-availability]:sap-higher-availability-architecture-scenarios.md
[sap-ha-partner-information]:https://scn.sap.com/docs/DOC-8541
[azure-sla]:https://azure.microsoft.com/support/legal/sla/
[azure-storage-redundancy]:/azure/storage/common/storage-redundancy
[azure-storage-managed-disks-overview]:../../virtual-machines/managed-disks-overview.md

## Terminology definitions

**High availability**: Refers to a set of technologies that minimize IT disruptions by providing business continuity of IT services through redundant, fault-tolerant, or failover-protected components inside the *same* data center. In our case, the data center resides within one Azure region.

**Disaster recovery**: Also refers to the minimizing of IT services disruption and their recovery, but across *various* data centers that might be hundreds of miles away from one another. In our case, the data centers might reside in various Azure regions within the same geopolitical region or in locations as established by you as a customer.

## Overview of high availability

SAP high availability in Azure can be separated into three types:

* **Azure infrastructure high availability**:
  
  For example, high availability can include compute (VMs), network, or storage and its benefits for increasing the availability of SAP applications.

* **Utilizing Azure infrastructure VM restart to protect SAP applications**:
  
  If you decide not to use functionalities such as Windows Server Failover Clustering (WSFC) or Pacemaker on Linux, Azure VM restart is utilized. It restores functionality in the SAP systems if there are any planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform.

* **SAP application high availability**:

  To achieve full SAP system high availability, you must protect all critical SAP system components. For example:
  
  * Redundant SAP application servers.
  * Unique components. An example might be a single point of failure (SPOF) component, such as an SAP ASCS/SCS instance or a database management system (DBMS).

SAP high availability in Azure differs from SAP high availability in an on-premises physical or virtual environment.

There's no sapinst-integrated SAP high-availability configuration for Linux as there is for Windows. For information about SAP high availability on-premises for Linux, see [High availability partner information][sap-ha-partner-information].

## Azure infrastructure high availability

### SLA for single-instance virtual machines

There's currently a single-VM SLA of 99.9% with premium storage. To get an idea about what the availability of a single VM might be, you can build the product of the various available [Azure Service Level Agreements][azure-sla].

The basis for the calculation is 30 days per month, or 43,200 minutes. For example, a 0.05% downtime corresponds to 21.6 minutes. As usual, the availability of the various services is calculated in the following way:

(Availability Service #1/100) x (Availability Service #2/100) x (Availability Service #3/100) \*…

For example:

(99.95/100) x (99.9/100) x (99.9/100) = 0.9975 or an overall availability of 99.75%.

### Multiple instances of virtual machines in the same availability set

For all virtual machines that have two or more instances deployed in the same *availability set*, we guarantee that you have virtual machine connectivity to at least one instance at least 99.95% of the time.

When two or more VMs are part of the same availability set, each virtual machine in the availability set is assigned an *update domain* and a *fault domain* by the underlying Azure platform.

* **Update domains** guarantee that multiple VMs aren't rebooted at the same time during the planned maintenance of an Azure infrastructure. Only one VM is rebooted at a time.
* **Fault domains** guarantee that VMs are deployed on hardware components that don't share a common power source and network switch. When servers, a network switch, or a power source undergo an unplanned downtime, only one VM is affected.

For more information, see [manage the availability of virtual machines in Azure using availability set](../../virtual-machines/availability-set-overview.md).

### Azure Availability Zones

Azure is in process of rolling out a concept of [Azure Availability Zones](../../availability-zones/az-overview.md) throughout different [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/). In Azure regions where Availability Zones are offered, the Azure regions have multiple data centers, which are independent in supply of power source, cooling, and network. Reason for offering different zones within a single Azure region is to enable you to deploy applications across two or three Availability Zones offered. Assuming that issues in power sources and/or network would affect one Availability Zone infrastructure only, your application deployment within an Azure region is still fully functional. Eventually with some reduced capacity since some VMs in one zone might be lost. But VMs in the other two zones are still up and running. The Azure regions that offer zones are listed in [Azure Availability Zones](../../availability-zones/az-overview.md).

On using Availability Zones, there are some things to consider. The considerations list like:

* You can't deploy Azure Availability Sets within an Availability Zone. Only possibility to combine Availability sets and Availability Zones is with [proximity placement groups](../../virtual-machines/co-location.md). For more information, see article [Combine availability sets and availability zones with proximity placement groups](./proximity-placement-scenarios.md#combine-availability-sets-and-availability-zones-with-proximity-placement-groups).
* You can't use the [Basic Load Balancer](../../load-balancer/load-balancer-overview.md) to create failover cluster solutions based on Windows Failover Cluster Services or Linux Pacemaker. Instead you need to use the [Azure Standard Load Balancer SKU](../../load-balancer/load-balancer-standard-availability-zones.md).
* Azure Availability Zones aren't giving any guarantees of certain distance between the different zones within one region.
* The network latency between different Azure Availability Zones within the different Azure regions might be different from Azure region to region. There would be cases, where you as a customer can reasonably run the SAP application layer deployed across different zones since the network latency from one zone to the active DBMS VM is still acceptable from a business process impact. Whereas there could be customer scenarios where the latency between the active DBMS VM in one zone and an SAP application instance in a VM in another zone can be too intrusive and not acceptable for the SAP business processes. As a result, the deployment architectures need to be different with an active/active architecture for the application or active/passive architecture if latency is too high.
* Using [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) is mandatory for deploying into Azure Availability Zones.

### Virtual Machine Scale Set with Flexible Orchestration

In Azure, Virtual Machine Scale Sets with Flexible orchestration offers a means of achieving high availability for SAP workloads, much like other deployment frameworks such as availability sets and availability zones. With flexible scale set, VMs can be distributed across various availability zones and fault domains, making it a suitable option for deploying highly available SAP workloads.

Virtual machine scale set with flexible orchestration offers the flexibility to create the scale set within a region or span it across availability zones. On creating, the flexible scale set within a region with platformFaultDomainCount>1 (FD>1), the VMs deployed in the scale set would be distributed across specified number of fault domains in the same region. On the other hand, creating the flexible scale set across availability zones with platformFaultDomainCount=1 (FD=1) would distribute the VMs across different zones and the scale set would also [distribute VMs across different fault domains within each zone on a best effort basis](../../virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains.md). **For SAP workload only flexible scale set with FD=1 is supported.**

The advantage of using flexible scale sets with FD=1 for cross zonal deployment, instead of traditional availability zone deployment is that the VMs deployed with the scale set would be distributed across different fault domains within the zone in a best-effort manner. To avoid the limitations associated with utilizing [proximity placement group](./proximity-placement-scenarios.md#combine-availability-sets-and-availability-zones-with-proximity-placement-groups) for ensuring VMs availability across all Azure datacenters or under each network spine, it's advised to deploy SAP workload across availability zones using flexible scale set with FD=1. This deployment strategy ensures that VMs deployed in each zone aren't restricted to a single datacenter or network spine, and all SAP system components, such as databases, ASCS/ERS, and application tier are scoped at zonal level.

So, for new SAP workload deployment across availability zones, we advise to use flexible scale set with FD=1. For more information, see [virtual machine scale set for SAP workload](./virtual-machine-scale-set-sap-deployment-guide.md) document.

### Planned and unplanned maintenance of virtual machines

Two types of Azure platform events can affect the availability of your virtual machines:

* **Planned maintenance** events are periodic updates made by Microsoft to the underlying Azure platform. The updates improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on.
* **Unplanned maintenance** events occur when the hardware or physical infrastructure underlying your virtual machine has failed in some way. It might include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform automatically migrates your virtual machine from the unhealthy physical server that hosts your virtual machine to a healthy physical server. Such events are rare, but they might also cause your virtual machine to reboot.

For more information, see [maintenance of virtual machines in Azure](../../virtual-machines/maintenance-and-updates.md).

### Azure Storage redundancy

The data in your storage account is always replicated to ensure durability and high availability, meeting the Azure Storage SLA even in the face of transient hardware failures.

Because Azure Storage keeps three images of the data by default, the use of RAID 5 or RAID 1 across multiple Azure disks is unnecessary.

For more information, see [Azure Storage replication][azure-storage-redundancy].

### Azure Managed Disks

Managed Disks is a resource type in Azure Resource Manager, is a recommended storage option instead of virtual hard disks (VHDs) that are stored in Azure storage accounts. Managed disks automatically align with an Azure availability set of the virtual machine they're attached to. They increase the availability of your virtual machine and the services that are running on it.

For more information, see  [Azure Managed Disks overview][azure-storage-managed-disks-overview].

We recommend that you use managed disks because they simplify the deployment and management of your virtual machines.

## Comparison of different deployment types for SAP workload

Here's a quick summary of the various deployment types that are available for SAP workloads.

| Features | Virtual Machine Scale Set with Flexible Orchestration (FD=1) | Availability Zone | Availability Set |
|--|--|--|--|
| Deployment behavior | Instances land across 1, 2 or 3 availability zones and distributed across different racks within each zone on best effort basis | Instances land across 1, 2 or 3 availability zones | Instances land within region and distributed across different fault/update domain |
| Assign VM and managed disks to specific Availability zone | Yes | Yes | No |
| Fault domain - Max spreading (Azure will maximally spread instances) | Yes | No | Yes, based on the number of fault domains defined during creation. |
| Compute to storage fault domain alignment | No | No | Yes |
| Capacity Reservation | Yes (assign capacity reservation at VM level) | Yes | No |

> [!NOTE]
>
> * Update domains have been deprecated in Flexible Orchestration mode. For more information, see [Migrate deployments and resources to Virtual Machine Scale Sets in Flexible orchestration](../../virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-migration-resources.md)
> * For more information on compute to storage fault domain alignment, see [Choosing the right number of fault domains for Virtual Machine Scale Set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains.md) and [How do availability sets work?](../../virtual-machines/availability-set-overview.md#how-do-availability-sets-work).
> * To enable capacity reservation, it is important to check the capacity reservation's [limitations and restrictions](../../virtual-machines/capacity-reservation-overview.md#limitations-and-restrictions).

## High availability deployment options for SAP workload

When deploying a high availability SAP workload on Azure, it's important to take into account the various deployment types available, and how they can be applied across different Azure regions (such as across zones, in a single zone, or in a region with no zones). Following table illustrates several high availability options for SAP systems in Azure regions.

| System type                  | Across different zones in a region                           | In a singe zone of a region                                  | In a region with no zones                                    |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| High Availability SAP system | [Flexible scale set with FD=1](./virtual-machine-scale-set-sap-deployment-guide.md) | [Availability Sets with Proximity Placement Groups](./proximity-placement-scenarios.md#proximity-placement-groups-with-availability-set-deployments) | [Availability Sets](./sap-high-availability-architecture-scenarios.md#multiple-instances-of-virtual-machines-in-the-same-availability-set) |
|                              | [Availability Sets and Availability Zones with Proximity Placement Groups](./proximity-placement-scenarios.md#combine-availability-sets-and-availability-zones-with-proximity-placement-groups) | [Flexible scale set with FD=1](./virtual-machine-scale-set-sap-deployment-guide.md) (select only one zone) | [Flexible scale set with FD=1](./virtual-machine-scale-set-sap-deployment-guide.md) (no zones are defined) |
|                              | [Availability Zones](./high-availability-zones.md)           | [Availability Sets](./sap-high-availability-architecture-scenarios.md#multiple-instances-of-virtual-machines-in-the-same-availability-set) |                                                              |

* **Deployment across different zones in a region:** For the highest availability, SAP systems should be deployed across different zones in a region. This ensures that if one zone is unavailable, the SAP system continues to be available in another zone. If you're deploying new SAP workload across availability zones, it's advised to use flexible virtual machine scales set with FD=1 deployment option. It allows you to deploy multiple VMs across different zones in a region without worrying about capacity constraints or placement groups. The scale set framework makes sure that the VMs deployed with the scale set would be distributed across different fault domains within the zone in a best effort manner. All the high available SAP components like SAP ASCS/ERS, SAP databases are distributed across different zones, whereas multiple application servers in each zone are distributed across different fault domain on best effort basis.
* **Deployment in a single zone of a region:** To deploy your high-availability SAP system regionally in a location with multiple availability zones, and if it's essential for all components of the system to be in a single zone, then it's advised to use Availability Sets with Proximity Placement Groups deployment option. This approach allows you to group all SAP system components in a single availability zone, ensuring that the virtual machines within the availability set are spread across different fault and update domains. While this deployment aligns compute to storage fault domains, proximity isn't guaranteed. However, as this deployment option is regional, it doesn't support Azure Site Recovery for zone-to-zone disaster recovery. Moreover, this option restricts the entire SAP deployment to one data center, which may lead to capacity limitations if you need to change the SKU size or scale-out application instances.
* **Deployment in a region with no zones:** If you're deploying your SAP system in a region that doesn't have any zones, it's advised to use Availability sets. This option provides redundancy and fault tolerance by placing VMs in different fault domains and update domains.

> [!IMPORTANT]
>
> It should be noted that the deployment options for Azure regions are only suggestions. The most suitable deployment strategy for your SAP system will depend on your particular requirements and environment.

## Utilizing Azure infrastructure high availability to protect SAP applications

If you decide not to use functionalities such as WSFC or Pacemaker on Linux (supported for SUSE Linux Enterprise Server 12 and later, and Red Hat Enterprise Linux 7 and later), Azure VM restart is utilized. It restores functionality in the SAP systems if there are any planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform.

For more information about the approach, see [Utilize Azure infrastructure VM restart to achieve higher availability of the SAP system][sap-higher-availability].

## High availability of SAP applications on Azure IaaS

To achieve full SAP system high availability, you must protect all critical SAP system components. For example:

* Redundant SAP application servers.
* Unique components. An example might be a single point of failure (SPOF) component, such as an SAP ASCS/SCS instance or a database management system (DBMS).

The next sections discuss how to achieve high availability for all three critical SAP system components.

### High-availability architecture for SAP application servers

> ![Windows logo.][Logo_Windows] Windows and ![Linux logo.][Logo_Linux] Linux

You usually don't need a specific high-availability solution for the SAP application server and dialog instances. You achieve high availability by redundancy, and you configure multiple dialog instances in various instances of Azure virtual machines. You should have at least two SAP application instances installed in two instances of Azure virtual machines.

Depending on the deployment type (flexible scale set with FD=1, availability zone or availability set), you must distribute your SAP application server instances accordingly to achieve redundancy.

* **Flexible scale set with platformFaultDomainCount=1 (FD=1):** SAP application servers deployed with flexible scale set (FD=1) distribute the virtual machines across different availability zones and the scales set would also distribute VMs across different fault domains within each zone on a best effort basis. This ensures that if one zone is unavailable, the SAP application servers deployed in another zone continues to be available.
* **Availability zone:** SAP application servers deployed across availability zones ensure that VMs are span across different zones to achieve redundancy. This ensures that if one zone is unavailable, the SAP application servers deployed in another zone continues to be available.  For more information, see [SAP workload configurations with Azure Availability Zones](./high-availability-zones.md)
* **Availability set:** SAP application servers deployed in availability set ensure that VMs are distributed across different [fault domains](./planning-guide.md#fault-domains) and [update domains](./planning-guide.md#update-domains). On placing VMs across different update domains, ensure that VMs aren't updated at the same time during planned maintenance downtime. Whereas, placing VMs in different fault domain ensures that VM is protected from hardware failures or power interruptions within a data center. But the number of fault and update domains that you can use in Azure availability set within an Azure scale unit is finite. If you keep adding VMs to a single availability set, two or more VMs would eventually end up in the same fault or update domain. For more information, see the [Azure availability sets](./planning-guide.md#availability-sets) section of the Azure virtual machines planning and implementation for SAP NetWeaver document.

**Unmanaged disks only:** When using unmanaged disks with availability set, it's important to recognize that the Azure storage account becomes a single point of failure. Therefore, it's imperative to posses a minimum of two Azure storage accounts, in which at least two virtual machines are distributed. In an ideal setup, the disks of each virtual machine that is running an SAP dialog instance would be deployed in a different storage account.

> [!IMPORTANT]
> We strongly recommend that you use Azure managed disks for your SAP high-availability installations. Because managed disks automatically align with the availability set of the virtual machine they are attached to, they increase the availability of your virtual machine and the services that are running on it.  

### High-availability architecture for an SAP ASCS/SCS instance on Windows

> ![Windows logo.][Logo_Windows] Windows

You can use a WSFC solution to protect the SAP ASCS/SCS instance. Based on the type of cluster share configuration (file share or shared disk), you can refer to appropriate solution based on your storage type.

* **Cluster share - File share**
  
  * [High Availability of SAP ASCS/SCS instance using SMB on Azure Files](./high-availability-guide-windows-azure-files-smb.md).
  * [High Availability of SAP ASCS/SCS instance using SMB on Azure NetApp Files](./high-availability-guide-windows-netapp-files-smb.md).
  * [High Availability of SAP ASCS/SCS instance using Scale Out File Server (SOFS)](./sap-high-availability-guide-wsfc-file-share.md).

* **Cluster share - Shared disk**
  
  * [High availability of SAP ASCS/SCS instance using Azure shared disk](./sap-high-availability-guide-wsfc-shared-disk.md).
  * [High availability of SAP ASCS/SCS instance using SIOS](./sap-high-availability-guide-wsfc-shared-disk.md).

### High-availability architecture for an SAP ASCS/SCS instance on Linux

> ![Linux logo.][Logo_Linux] Linux

On Linux, the configuration of SAP ASCS/SCS instance clustering depends on the operating system distribution and the type of storage being used. It's recommended to implement the suitable solution according to your specific OS cluster framework.

* **SUSE Linux Enterprise Server (SLES)**
  
  * [High Availability of SAP ASCS/SCS instance using NFS with simple mount](./high-availability-guide-suse-nfs-simple-mount.md).
  * [High Availability of SAP ASCS/SCS instance using NFS on Azure Files](./high-availability-guide-suse-nfs-azure-files.md).
  * [High Availability of SAP ASCS/SCS instance using NFS on Azure NetApp Files](./high-availability-guide-suse-netapp-files.md).
  * [High Availability of SAP ASCS/SCS instance using NFS Server](./high-availability-guide-suse-nfs.md).

* **Red Hat Enterprise Linux (RHEL)**
  
  * [High Availability of SAP ASCS/SCS instance using NFS on Azure Files](./high-availability-guide-rhel-nfs-azure-files.md).
  * [High Availability of SAP ASCS/SCS instance using NFS on Azure NetApp Files](./high-availability-guide-rhel-netapp-files.md).

### SAP NetWeaver multi-SID configuration for a clustered SAP ASCS/SCS instance

> ![Windows logo.][Logo_Windows] Window

Multi-SID is supported with WSFC, using file share and shared disk. For more information about multi-SID high-availability architecture on Windows, see:

* File share: [SAP ASCS/SCS instance multi-SID high availability for Windows Server Failover Clustering and file share][sap-ascs-ha-multi-sid-wsfc-file-share].
* Shared disk: [SAP ASCS/SCS instance multi-SID high availability for Windows Server Failover Clustering and shared disk][sap-ascs-ha-multi-sid-wsfc-shared-disk].

> ![Linux logo.][Logo_Linux] Linux

Multi-SID clustering is supported on Linux Pacemaker clusters for SAP ASCS/ERS, limited to **five** SAP SIDs on the same cluster. For more information about multi-SID high-availability architecture on Linux, see:

* SUSE Linux Enterprise Server (SLES): [HA for SAP NW on Azure VMs on SLES for SAP applications multi-SID guide](./high-availability-guide-suse-multi-sid.md).
* Red Hat Linux Enterprise (RHEL): [HA for SAP NW on Azure VMs on RHEL for SAP applications multi-SID guide](./high-availability-guide-rhel-multi-sid.md).

### High-availability of DBMS instance

In an SAP system, the DBMS servers as the single point of failure as well. So, it's important to protect the database by implementing high-availability solution. The high availability solution of DBMS varies based on the database used for SAP system. Based on your database, follow the guidelines to achieve high availability on your database.

| Database      | DR recommendation                                            |
| ------------- | ------------------------------------------------------------ |
| SAP HANA      | [HANA System Replication (HSR)](sap-hana-availability-across-regions.md) |
| Oracle        | [Oracle Data Guard](../../virtual-machines/workloads/oracle/oracle-reference-architecture.md#disaster-recovery-for-oracle-databases) |
| IBM DB2       | [High availability disaster recovery (HADR)](dbms-guide-ha-ibm.md) |
| Microsoft SQL | [Microsoft SQL Always On](dbms-guide-sqlserver.md#sql-server-always-on) |
| SAP ASE       | [ASE HADR Always On](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/installation-procedure-for-sybase-16-3-patch-level-3-always-on/ba-p/368199) |
