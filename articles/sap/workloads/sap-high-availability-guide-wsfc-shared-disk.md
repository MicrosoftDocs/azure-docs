---
title: Cluster SAP ASCS/SCS instance on WSFC using shared disk in Azure | Microsoft Docs
description: Learn how to cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a shared disk.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: f6fb85f8-c77a-4af1-bde8-1de7e4425d2e
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017

---


# Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a shared disk in Azure

> ![Windows OS][Logo_Windows] Windows
>

Windows Server Failover Clustering (WSFC) is the foundation of a high-availability (HA) SAP ASCS/SCS installation and database management systems (DBMSs) in Windows.

A failover cluster is a group of 1+n independent servers (nodes) that work together to increase the availability of applications and services. If a node failure occurs, WSFC calculates the number of failures that can occur and still maintain a healthy cluster to provide applications and services. You can choose from various quorum modes to achieve failover clustering.

## Prerequisites

Before you begin the tasks in this article, review the article [High-availability architecture and scenarios for SAP NetWeaver][sap-high-availability-architecture-scenarios].

## Windows Server Failover Clustering in Azure

WSFC with Azure virtual machines (VMs) requires additional configuration steps. When you build a cluster, you need to set several IP addresses and virtual host names for the SAP ASCS/SCS instance.

### Name resolution in Azure and the cluster virtual host name

The Azure cloud platform doesn't offer the option to configure virtual IP addresses, such as floating IP addresses. You need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud.

The Azure Load Balancer service provides an *internal load balancer* for Azure. With the internal load balancer, clients reach the cluster over the cluster's virtual IP address.

Deploy the internal load balancer in the resource group that contains the cluster nodes. Then, configure all necessary port forwarding rules by using the probe ports of the internal load balancer. Clients can connect via the virtual host name. The DNS server resolves the cluster IP address, and the internal load balancer handles port forwarding to the active node of the cluster.

> [!IMPORTANT]
> Floating IP addresses are not supported on a secondary IP configuration for a network adapter (NIC) in load-balancing scenarios. For details, see [Azure Load Balancer limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need an additional IP address for the VM, deploy a second NIC.  

![Diagram of a Windows Server Failover Clustering configuration in Azure without a shared disk.][sap-ha-guide-figure-1001]

### SAP ASCS/SCS HA with cluster shared disks

In Windows, an SAP ASCS/SCS instance contains SAP central services, the SAP message server, enqueue server processes, and SAP global host files. SAP global host files store central files for the entire SAP system.

An SAP ASCS/SCS instance has the following components:

- SAP central services:
  - Two processes (for a message server and an enqueue server) and an ASCS/SCS virtual host name that's used to access the two processes
  - File structure: *S:\usr\sap\\&lt;SID&gt;\ASCS/SCS\<instance number\>*

- SAP global host files:
  - File structure: *S:\usr\sap\\&lt;SID&gt;\SYS\...*
  - The *sapmnt* file share, which enables access to these global *S:\usr\sap\\&lt;SID&gt;\SYS\...* files by using the following UNC path:

    *\\\\<ASCS/SCS virtual host name\>\sapmnt\\&lt;SID&gt;\SYS\...*

![Diagram of processes, file structure, and global host file share of an SAP ASCS/SCS instance.][sap-ha-guide-figure-8001]

In a high-availability setting, you cluster SAP ASCS/SCS instances. You use cluster shared disks (drive S in this article's example) to place the SAP ASCS/SCS and SAP global host files.

![Diagram that shows an SAP ASCS/SCS high-availability architecture with shared disks.][sap-ha-guide-figure-8002]

With an Enqueue Replication Server 1 (ERS1) architecture:

- The same ASCS/SCS virtual host name is used to access the SAP message server and enqueue server processes, in addition to the SAP global host files via the *sapmnt* file share.
- The same cluster shared disk (drive S) is shared between them.  

With Enqueue Replication Server 2 (ERS2) architecture:

- The same ASCS/SCS virtual host name is used to access the SAP message server process, in addition to the SAP global host files via the *sapmnt* file share.
- The same cluster shared disk (drive S) is shared between them.
- There's a separate ERS virtual host name to access the enqueue server process.  

![Diagram of an SAP ASCS/SCS high-availability architecture with a shared disk.][sap-ha-guide-figure-8003]

#### Shared disks and Enqueue Replication Server

Shared disks are supported with an ERS1 architecture, where the ERS1 instance:

- Is not clustered.
- Uses a `localhost` name.
- Is deployed on local disks on each of the cluster nodes.

Shared disks are also supported with an ERS2 architecture, where the ERS2 instance:  

- Is clustered.
- Uses a dedicated virtual or network host name.
- Needs the IP address of ERS virtual host name to be configured on an Azure internal load balancer, in addition to the (A)SCS IP address.
- Is deployed on local disks on each of the clustered nodes, so there's no need for a shared disk.

For more information about ERS1 and ERS2, see [Enqueue Replication Server in a Microsoft Failover Cluster](https://help.sap.com/viewer/3741bfe0345f4892ae190ee7cfc53d4c/CURRENT_VERSION_SWPM20/en-US/8abd4b52902d4b17a105c2fabdf5c0cf.html) and [New Enqueue Replicator in Failover Cluster environments](https://blogs.sap.com/2019/03/19/new-enqueue-replicator-in-failover-cluster-environments/) on the SAP website.

#### Options for shared disks in Azure for SAP workloads

There are two options for shared disks in a Windows failover cluster in Azure:

- Use [Azure shared disks](../../virtual-machines/disks-shared.md) to attach Azure managed disks to multiple VMs simultaneously.
- Use [SIOS DataKeeper Cluster Edition](https://us.sios.com/products/sios-datakeeper/) to create a mirrored storage that simulates cluster shared storage.

When you're selecting the technology for shared disks, keep in mind the following considerations about Azure shared disks for SAP workloads:

- Use of Azure shared disks with [Azure Premium SSD](../../virtual-machines/disks-types.md#premium-ssds) disks is supported for SAP deployment in availability sets and availability zones.
- [Azure Ultra Disk Storage disks](../../virtual-machines/disks-types.md#ultra-disks) and [Azure Standard SSD disks](../../virtual-machines/disks-types.md#standard-ssds) are not supported as Azure shared disks for SAP workloads.
- Be sure to provision Azure Premium SSD disks with a minimum disk size, as specified in [Premium SSD ranges](../../virtual-machines/disks-shared.md#disk-sizes), to be able to attach to the required number of VMs simultaneously. You typically need two VMs for SAP ASCS Windows failover clusters.

Keep in mind the following considerations about SIOS:

- The SIOS solution provides real-time synchronous data replication between two disks.
- With the SIOS solution, you operate with two managed disks. If you're using either availability sets or availability zones, the managed disks will be on different storage clusters.
- Deployment in availability zones is supported.
- The SIOS solution requires installing and operating third-party software, which you need to purchase separately.

### Azure shared disks

You can implement SAP ASCS/SCS HA with [Azure shared disks](../../virtual-machines/disks-shared.md).

#### Prerequisites and limitations

Currently, you can use Azure Premium SSD disks as Azure shared disks for the SAP ASCS/SCS instance. The following limitations are currently in place:

- [Azure Ultra Disk Storage disks](../../virtual-machines/disks-types.md#ultra-disks) and [Standard SSD disks](../../virtual-machines/disks-types.md#standard-ssds) are not supported as Azure shared disks for SAP workloads.
- [Azure Shared disks](../../virtual-machines/disks-shared.md) with [Premium SSD disks](../../virtual-machines/disks-types.md#premium-ssds) are supported for SAP deployment in availability sets and availability zones.
- Azure shared disks with Premium SSD disks come with two storage options:
  - Locally redundant storage (LRS) for Premium SSD shared disks (`skuName` value of `Premium_LRS`) is supported with deployment in availability sets.
  - Zone-redundant storage (ZRS) for Premium SSD shared disks (`skuName` value of `Premium_ZRS`) is supported with deployment in availability zones.
- The Azure shared disk value [maxShares](../../virtual-machines/disks-shared-enable.md?tabs=azure-cli#disk-sizes) determines how many cluster nodes can use the shared disk. For an SAP ASCS/SCS instance, you typically configure two nodes in WSFC. You then set the value for `maxShares` to `2`.
- An [Azure proximity placement group (PPG)](../../virtual-machines/windows/proximity-placement-groups.md) is not required for Azure shared disks. But for SAP deployment with PPGs, follow these guidelines:
  - If you're using PPGs for an SAP system deployed in a region, all virtual machines that share a disk must be part of the same PPG.
  - If you're using PPGs for an SAP system deployed across zones, as described in [Proximity placement groups with zonal deployments](proximity-placement-scenarios.md#proximity-placement-groups-with-zonal-deployments), you can attach `Premium_ZRS` storage to virtual machines that share a disk.

For more information, review the [Limitations](../../virtual-machines/disks-shared.md#limitations) section of the documentation for Azure shared disks.

#### Important considerations for Premium SSD shared disks

Consider these important points about Azure Premium SSD shared disks:

- LRS for Premium SSD shared disks:
  - SAP deployment with LRS for Premium SSD shared disks operates with a single Azure shared disk on one storage cluster. If there's a problem with the storage cluster where the Azure shared disk is deployed, it affects your SAP ASCS/SCS instance.

- ZRS for Premium SSD shared disks:
  - Write latency for ZRS is higher than that of LRS because of cross-zonal copying of data.
  - The distance between availability zones in different regions varies, and so does ZRS disk latency across availability zones. [Benchmark your disks](../../virtual-machines/disks-benchmarks.md) to identify the latency of ZRS disks in your region.
  - ZRS for Premium SSD shared disks synchronously replicates data across three availability zones in the region. If there's a problem in one of the storage clusters, your SAP ASCS/SCS instance continues to run because storage failover is transparent to the application layer.
  - For more information, review the [Limitations](../../virtual-machines/disks-redundancy.md#limitations) section of the documentation about ZRS for managed disks.

For other important considerations about planning your SAP deployment, review [Plan and implement an SAP deployment on Azure](./planning-guide.md) and [Azure Storage types for SAP workloads](./planning-guide-storage.md).

### Supported OS versions

Windows Server 2016, 2019, and later are supported. Use the latest datacenter images.

We strongly recommend using at least Windows Server 2019 Datacenter, for these reasons:

- WSFC in Windows Server 2019 is Azure aware.
- Windows Server 2019 Datacenter includes integration and awareness of Azure host maintenance and improved experience by monitoring for Azure scheduled events.
- You can use distributed network names. (It's the default option.) There's no need to have a dedicated IP address for the cluster network name. Also, you don't need to configure an IP address on an Azure internal load balancer.

### Shared disks in Azure with SIOS DataKeeper

Another option for shared disks is to use [SIOS DataKeeper](https://us.sios.com/products/sios-datakeeper/) Cluster Edition to create a mirrored storage that simulates cluster shared storage. The SIOS solution provides real-time synchronous data replication.

To create a shared disk resource for a cluster:

1. Attach an additional disk to each of the virtual machines in a Windows cluster configuration.
2. Run SIOS DataKeeper Cluster Edition on both virtual machine nodes.
3. Configure SIOS DataKeeper Cluster Edition so that it mirrors the content of the additional disk-attached volume from the source virtual machine to the additional disk-attached volume of the target virtual machine. SIOS DataKeeper abstracts the source and target local volumes, and then presents them to WSFC as one shared disk.

![Diagram of a Windows Server Failover Clustering configuration in Azure with SIOS DataKeeper.][sap-ha-guide-figure-1002]

> [!NOTE]
> You don't need shared disks for high availability with some DBMS products, like SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In this case, the Windows cluster configuration doesn't need a shared disk.

## Optional configurations

The following diagrams show multiple SAP instances on Azure VMs running Windows Server Failover Clustering to reduce the total number of VMs.

This configuration can be either local SAP application servers on an SAP ASCS/SCS cluster or an SAP ASCS/SCS cluster role on Microsoft SQL Server Always On nodes.

> [!IMPORTANT]
> Installing a local SAP application server on a SQL Server Always On node is not supported.

Both SAP ASCS/SCS and the Microsoft SQL Server database are single points of failure (SPOFs). WSFC helps protect these SPOFs in a Windows environment.

Although the resource consumption of the SAP ASCS/SCS is fairly small, we recommend a reduction of the memory configuration for either SQL Server or the SAP application server by 2 GB.

This diagram illustrates SAP application servers on WSFC nodes with the use of SIOS DataKeeper:

![Diagram of a Windows Server Failover Clustering configuration in Azure with SIOS DataKeeper and locally installed SAP application servers.][sap-ha-guide-figure-1003]

Because the SAP application servers are installed locally, there's no need to set up any synchronization.

This diagram illustrates SAP ASCS/SCS on SQL Server Always On nodes with the use of SIOS DataKeeper:

![Diagram of SAP ASCS/SCS on SQL Server Always On nodes with SIOS DataKeeper.][sap-ha-guide-figure-1005]

For information about other configurations, see the following resources:

- [Optional configuration for SAP application servers on WSFC nodes using Windows Scale-Out File Server][optional-fileshare]

- [Optional configuration for SAP application servers on WSFC nodes using Server Message Block in Azure NetApp Files][optional-smb]

- [Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Windows Scale-Out File Server][optional-fileshare-sql]

- [Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Server Message Block in Azure NetApp Files][optional-smb-sql]

## Next steps

- [Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk]

- [Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]

[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md

[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[sap-ha-guide-figure-1001]:./media/virtual-machines-shared-sap-high-availability-guide/1001-wsfc-on-azure-ilb.png
[sap-ha-guide-figure-1003]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sios-as.png
[sap-ha-guide-figure-1005]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sql-ascs-sios.png
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sios.png

[sap-ha-guide-figure-8001]:./media/virtual-machines-shared-sap-high-availability-guide/8001.png
[sap-ha-guide-figure-8002]:./media/virtual-machines-shared-sap-high-availability-guide/8002.png
[sap-ha-guide-figure-8003]:./media/virtual-machines-shared-sap-high-availability-guide/8003.png

[optional-smb]:high-availability-guide-windows-netapp-files-smb.md#5121771a-7618-4f36-ae14-ccf9ee5f2031 (Optional configuration for SAP Application Servers on WSFC nodes using Server Message Block in Azure NetApp Files)
[optional-fileshare]:sap-high-availability-guide-wsfc-file-share.md#86cb3ee0-2091-4b74-be77-64c2e6424f50 (Optional configuration for SAP Application Servers on WSFC nodes using Windows Scale-Out File Server)
[optional-smb-sql]:high-availability-guide-windows-netapp-files-smb.md#01541cf2-0a03-48e3-971e-e03575fa7b4f (Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Server Message Block in Azure NetApp Files)
[optional-fileshare-sql]:sap-high-availability-guide-wsfc-file-share.md#db335e0d-09b4-416b-b240-afa18505f503 (Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Windows Scale-Out File Server)
