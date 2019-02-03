---
title: SAP workload configurations with Availability Zones  | Microsoft Docs
description: High-availability architecture and scenarios for SAP NetWeaver using availability zones
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: juergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 887caaec-02ba-4711-bd4d-204a7d16b32b
ms.service: virtual-machines-windows
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 02/03/2019
ms.author: msjuergent
ms.custom: H1Hack27Feb2017

---

# SAP workload configurations with Availability Zones

One of the high the functionalities Azure offers to improve the overall availability of SAP workload on Azure is [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). Availability zones are available in different [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/) already. More regions will follow. 

The basic architecture of SAP high availability can be described as displayed in this graphic:

![Standard HA configuration](./media/sap-ha-availability-zones/standard-ha-config.png)

The SAP application layer is deployed across one Azure [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability). For high availability of SAP Central Services, you usually deploy two VMs in a separate availability set and use Windows Failover Cluster Services or Pacemaker (Linux) to deploy a high availability framework that allow automatic failover in case of an infrastructure or software problem. Documentation detailing such deployments list like:

- [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk)
- [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using file share](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-file-share)
- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse)
- [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel)

A similar architecture applies for the DBMS layer of SAP NetWeaver, S/4HANA, or Hybris systems. You deploy the DBMS layer in an active/passive mode with a failover cluster solution, which uses either DBMS specific failover frameworks, Windows Failover Cluster Services, or Pacemaker to initiate failover activities in case of infrastructure or software failure. 

In order to deploy the same architecture using Azure availability zones, some changes to the architecture described need to be made. These changes are described in the different parts of this document.

## Considerations deploying across Availability Zones

Using Availability Zones, there are some things to consider. The considerations list like:

- Azure Availability Zones are not giving any guarantees of certain distance between the different zones within one Azure region
- Azure availability zones are not an ideal DR solution. In times where huge natural disasters are causing wide spread damage in some regions of the world, including heavy damage to power infrastructure, the distance between different zones might be not large enough to qualify as a proper DR solution
- The network latency between different Azure Availability Zones in the different Azure regions is different from Azure region to region. There will be cases, where you as a customer can run the SAP application layer deployed across different zones. Since the network latency from one zone to the active DBMS VM is still acceptable from a business process impact. Whereas there will be customer scenarios where the latency between the active DBMS VM in one zone and an SAP application instance in a VM in another zone can be too intrusive and not acceptable for the SAP business processes. As a result, the deployment architectures need to be different with an active/active architecture for the application or active/passive architecture if latency is too high.
- Make a decision in which form and shape you could use Azure Availability zones, based on the network latency you are measuring between the different zones. the network latency plays an important role in two different areas:
	- Latency between the two DBMS instances that need to have a synchronous replication established. the higher the network latency, the higher the potential to impact scalability of your workload
	- The difference in network latency between a VM that runs an SAP dialog instance in the same zone as the active DBMS instance and a similar VM in another zone. the higher this difference, the higher the impact and difference on runtime of differences, dependent on whether they run in the same zone with the DBMS or in a different zone


As of Azure feature usage, there are some restrictions of functionality that can be used when deploying Azure VMs across zones and establishing failover solutions across different availability zones within the same Azure region. These restrictions list like:

- Using [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) is mandatory for deploying into Azure Availability Zones 
- The mapping of zone enumerations to the physical zones is fixed on an Azure subscription basis. If you are using different subscriptions to deploy your SAP systems, you need to define the ideal zones for each subscription separately
- You can't deploy Azure Availability Sets within an Availability Zone. Choose either an Availability Zone or an Availability Set as deployment frame for a VM.
- You can't use the [Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview#skus) to create failover cluster solutions based on Windows Failover Cluster Services or Linux Pacemaker. Instead you need to use the [Azure Standard Load Balancer SKU](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones)



## Ideal zone combination
In order to decide in how you can leverage availability zones, you need to perform an investigation that gives you:

- The network latency between the three different zones. so, that you can choose the zones that have the least network latency
- The difference between VM-to-VM latency within one of the zones chosen by you and the network latency across the two zones you chose
- A statement whether the VM types that you need to have deployed across the availability zones of choice are available in the two zones of your choice. Especially with M-Series VMs, you are going to encounter situations where the different M-Sieres VM SKUs are going to be available in two of the three zones only

### Network latency between zones and within zone
To find out the what the latency between the different zones is, you need to:

- Deploy the VM SKU you want to use for your DBMS instance in all three zones. Make sure that that [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled when performing this measurement
- As you find the two zones with the least network latency, deploy another three VMs of the VM SKU you want to use as application layer VM across the three availability zones. Measure the network latency against the two 'DBMS VMs' in the two different 'DBMS' zones of your choice. 
- As a tool to measure, use niping. a tool from SAP, which works as described in the SAP support notes [#500235](https://launchpad.support.sap.com/#/notes/500235) and [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E). note the commands SAP documented for latency measurements. Using 'ping' is not recommended since 'ping' does not work through the Azure accelerated network code paths.

Based on the measurements and the availability of your VM SKUs in the different zones, you need to make the decisions:

- Define ideal zone for the DBMS layer
- Answer the question whether, based on differences of network latency within a zone or across zone, you could distribute your active SAP application layer across one, two or all three different zones
- Answer the question whether you want to deploy an active/passive or an active/active configuration from an application point of view (see later)

Making these decisions, also keep SAP's network latency recommendations as documented in SAP note [#1100926](https://launchpad.support.sap.com/#/notes/1100926/E) in mind.

> [!IMPORTANT]
> The measurements and decisions you make, are valid for the Azure subscription you used for making these measurements. Using another Azure subscription you need to repeat the measurements since the mapping of your subscription dependent enumeration of zones can change with a different subscription


> [!IMPORTANT]
> It is expected that the measurements as performed above are showing different results in every Azure region that supports [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview). Even with your requirements on network latency not changing, you might need to adapt different deployment strategies in different Azure regions since the network latency between zones can be different. It is expected that in some Azure regions, network latency between the three different zones can be vastly different. whereas in other regions, the network latency between the three different zones are more uniform. The claim that there **always** is a network latency across zones for 1ms to 2ms is **wrong**. The network latency across availability zones in Azure regions can't be generalized.


## Active/Active deployment
This deployment architecture is called active/active, because you deploy your active SAP dialog instances across two or three zones. The SAP Central Services using enqueue replication is going to be deployed between two zones. the same is true for the DBMS layer, which is usually deployed across the same zones as the SAP Central Service.

To contemplate such a configuration, you need to find the two availability zones in your region that offer cross zone network latency that is acceptable for your workload and for your synchronous DBMS replication. Additionally you want the delta between network latency within the zones you selected and the across zone network latency not too large. Reason for the latter, is that you don't want to large variations in run times of your business processes or batch processes dependent on whether a job runs in-zone with the DBMS server or across-zone. Some variations are acceptable, but not factors of difference.

A simplified schema of an active/active deployment across two zones could look like:

![active_active_xone_deployment](./media/sap-ha-availability-zones/active_active_zones_deployment.png)

The following considerations apply for this configuration:

- You treat the Azure availability zones as fault and update domains for all the VMs since Availability Sets can't be deployed in Azure availability zones
- The Azure load balancers you use for the failover clusters of the SAP Central Services as well as DBMS layer, need to be the [Standard SKU load balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones). The basic load balancer will not work across zones
- The Azure virtual network and its subnets you deployed to host the SAP system are stretched across zones. You **don't need** separate virtual networks for each zone
- For all virtual machines you deploy, use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). Unmanaged disks are not supported for zonal deployments
- Azure Premium storage or [Ultra SSD storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-ultra-ssd) are not supporting any type of storage replication. As a result it is responsibility of the application (DBMS or SAP Central Services) to replicate important data
- Same is true for the shared sapmnt directory, which either is a shared disk (Windows) or a CIFS share (Windows) or NFS share (Linux). You need to use a technology which replicates such a shared disk or share between the zones. At the moment the following technologies are supported:
	- For Windows, a cluster solution that uses SIOS Datakeeper as documented in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk) is supported to be used across zones
	- For SUSE Linux an NFS share built as documented in [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs) is supported
	- At this point in time the solution using Windows scale-out file services (SOFS) as documented in [Prepare Azure infrastructure for SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-infrastructure-wsfc-file-share) **is not supported to be deployed across zones**
- The third zone is used to host the SBD device in case you build a [SUSE Linux pacemaker cluster](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker#create-azure-fence-agent-stonith-device) or additional application instances
- To achieve run time consistency for some critical business transactions and/or jobs. You can try to direct certain batch jobs and users directly to specific application instances that are in zone with the active DBMS instance by using SAP Batch Server groups, Logon groups or RFC Groups. However, in case of a zonal failover, you need to manually move these groups to dialog instances which are in the remaining zone(s) 
- You need to decide whether you want to deploy some dormant dialog instances in each of the zones to be able to immediately get to the former resource capacity in case a zone you deployed part of your application instances in, is out of service


## Active/passive deployment
In cases where you are not finding an acceptable delta between the network latency within one zone and cross network latency, the architecture you can deploy has an active/passive character from the SAP application layer point of view. You define an 'active' zone, which is the zone you deploy the complete application layer into and where you attempt to run the active DBMS instance and the active SAP Central Services instance. With such a setup you make sure that you don't have extreme run time difference in business transactions and batch jobs, dependent on whether a job runs in the same zone with the active DBMS instance or not.

The basic layout of such an architecture looks like:

![active_active_xone_deployment](./media/sap-ha-availability-zones/active_active_zones_deployment.png)

The following considerations apply for this configuration:

- Availability Sets can't be deployed in Azure availability zones. Hence, in this case, you are ending up with one update and fault domain for your application layer. Reason is that it is only deployed in one zone. This is a disadvantage compared to the reference architecture that foresees that you deploy the application layer in an Azure availability set.
- Operating such an architecture, you need to monitor closely and try to keep the active DBMS and SAP Central services instances in the same zone as your deployed application layer. In case of a failover of SAP Central Service or the DBMS instance, you want to make sure that you can manually fail back into the zone with the SAP application layer deployed as early as possible
- The Azure load balancers you use for the failover clusters of the SAP Central Services as well as DBMS layer, need to be the [Standard SKU load balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones). The basic load balancer will not work across zones
- The Azure virtual network and its subnets you deployed to host the SAP system are stretched across zones. You **don't need** separate virtual networks for each zone
- For all virtual machines you deploy, you need to use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). Unmanaged disks are not supported for zonal deployments
- Azure Premium storage or [Ultra SSD storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-ultra-ssd) are not supporting any type of storage replication. As a result it is responsibility of the application (DBMS or SAP Central Services) to replicate important data
- Same is true for the shared sapmnt directory which either is a shared disk (Windows) or a CIFS share (Windows) or NFS share (Linux). You need to use a technology which replicates such a shared disk or share between the zones. At the moment the following technologies are supported:
	- For Windows, a cluster solution that uses SIOS Datakeeper as documented in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk) is supported to be used across zones
	- For SUSE Linux an NFS share built as documented in [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs) is supported
	- At this point in time the solution using Windows scale-out file services (SOFS) as documented in [Prepare Azure infrastructure for SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-infrastructure-wsfc-file-share) **is not supported to be deployed across zones**
- The third zone is used to host the SBD device in case you build a [SUSE Linux pacemaker cluster](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker#create-azure-fence-agent-stonith-device) or additional application instances
- You need to deploy dormant VMs in the passive zone (from a DBMS point of view) to be able to start the application resources in case of a zone failure
	- In order to do so, you can't use [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) to replicate active VMs to dormant VMs between zones. At this point in time, Azure Site Recovery is not able to fulfill such a function
- You should invest into automation that allows you, in case of a zone failure, to automatically start the SAP application layer in the second zone

## Combined high availability and disaster recovery configuration
Despite the fact that Microsoft is not giving any information on geographical distance between the facilities that host different Azure availability zones in a certain Azure region, some customers are leveraging zones for a combined HA and DR configuration that promises a Recovery Point objective (RPO) of zero. Which means, you should not lose any committed database transactions even in the disaster recovery. 

> [!NOTE]
> A configuration like this is recommended for specific circumstances only. For example, cases where data can't leave the Azure region due to security and compliance reasons. 

An example how such a configuration could look like is demonstrated in this graphic:

![combined_ha_dr_in_zones](./media/sap-ha-availability-zones/combined_ha_dr_in_zones.png)

The following considerations apply for this configuration:

- You are either assuming that there is a significant distance between the facilities hosting an availability zone. Or you are forced to stay with a certain Azure region. Availability Sets can't be deployed in Azure availability zones. Hence, in this case, you are ending up with one update and fault domain for your application layer. Reason is that it is only deployed in one zone. This is a disadvantage compared to the reference architecture that foresees that you deploy the application layer in an Azure availability set.
- Operating such an architecture, you need to monitor closely and try to keep the active DBMS and SAP Central services instances in the same zone as your deployed application layer. In case of a failover of SAP Central Service or the DBMS instance, you want to make sure that you can manually fail back into the zone with the SAP application layer deployed as early as possible
- You have production application instances pre-installed in the VMs that run the QA application instances.
- In case of a zonal failure, you shut down the QA application instances and start the production instances instead. keep in mind that you need to work with virtual names for the application instances to make this work
- The Azure load balancers you use for the failover clusters of the SAP Central Services as well as DBMS layer, need to be the [Standard SKU load balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones). The basic load balancer will not work across zones
- The Azure virtual network and its subnets you deployed to host the SAP system are stretched across zones. You **don't need** separate virtual networks for each zone
- For all virtual machines you deploy, you need to use [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). Unmanaged disks are not supported for zonal deployments
- Azure Premium storage or [Ultra SSD storage](https://docs.microsoft.com/azure/virtual-machines/windows/disks-ultra-ssd) are not supporting any type of storage replication. As a result it is responsibility of the application (DBMS or SAP Central Services) to replicate important data
- Same is true for the shared sapmnt directory which either is a shared disk (Windows) or a CIFS share (Windows) or NFS share (Linux). You need to use a technology which replicates such a shared disk or share between the zones. At the moment the following technologies are supported:
	- For Windows, a cluster solution that uses SIOS Datakeeper as documented in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk) is supported to be used across zones
	- For SUSE Linux an NFS share built as documented in [High availability for NFS on Azure VMs on SUSE Linux Enterprise Server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs) is supported
	- At this point in time the solution using Windows scale-out file services (SOFS) as documented in [Prepare Azure infrastructure for SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-infrastructure-wsfc-file-share) **is not supported to be deployed across zones**
- The third zone is used to host the SBD device in case you build a [SUSE Linux pacemaker cluster](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-pacemaker#create-azure-fence-agent-stonith-device) or additional application instances





## Next Steps
Check the next steps to deploy across Azure availability zones:

- [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk in Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk)
- [Prepare Azure infrastructure for SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-infrastructure-wsfc-file-share)






