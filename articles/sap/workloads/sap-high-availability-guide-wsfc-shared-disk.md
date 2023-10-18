---
title: Cluster SAP ASCS/SCS instance on WSFC using shared disk in Azure | Microsoft Docs
description: Learn how to cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk.
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


# Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk in Azure

> ![Windows OS][Logo_Windows] Windows
>

Windows Server failover clustering is the foundation of a high-availability SAP ASCS/SCS installation and DBMS in Windows.

A failover cluster is a group of 1+n-independent servers (nodes) that work together to increase the availability of applications and services. If a node failure occurs, Windows Server failover clustering calculates the number of failures that can occur and still maintain a healthy cluster to provide applications and services. You can choose from different quorum modes to achieve failover clustering.

## Prerequisites
Before you begin the tasks in this article, review the following article:

* [Azure Virtual Machines high-availability architecture and scenarios for SAP NetWeaver][sap-high-availability-architecture-scenarios]


## Windows Server failover clustering in Azure

Windows Server failover clustering with Azure Virtual Machines requires additional configuration steps. When you build a cluster, you need to set several IP addresses and virtual host names for the SAP ASCS/SCS instance.

### Name resolution in Azure and the cluster virtual host name

The Azure cloud platform doesn't offer the option to configure virtual IP addresses, such as floating IP addresses. You need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud. 

The Azure Load Balancer service provides an *internal load balancer* for Azure. With the internal load balancer, clients reach the cluster over the cluster virtual IP address. 

Deploy the internal load balancer in the resource group that contains the cluster nodes. Then, configure all necessary port forwarding rules by using the probe ports of the internal load balancer. Clients can connect via the virtual host name. The DNS server resolves the cluster IP address, and the internal load balancer handles port forwarding to the active node of the cluster.

> [!IMPORTANT]
> Floating IP is not supported on a NIC secondary IP configuration in load-balancing scenarios. For details see [Azure Load balancer Limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need additional IP address for the VM, deploy a second NIC.  

![Figure 1: Windows failover clustering configuration in Azure without a shared disk][sap-ha-guide-figure-1001]

_Windows Server failover clustering configuration in Azure without a shared disk_

### SAP ASCS/SCS HA with cluster shared disks
In Windows, an SAP ASCS/SCS instance contains SAP central services, the SAP message server, enqueue server processes, and SAP global host files. SAP global host files store central files for the entire SAP system.

An SAP ASCS/SCS instance has the following components:

* SAP central services:
    * Two processes, a message and enqueue server, and an \<ASCS/SCS virtual host name>, which is used to access these two processes.
    * File structure: S:\usr\sap\\&lt;SID&gt;\ASCS/SCS\<instance number\>


* SAP global host files:
  * File structure: S:\usr\sap\\&lt;SID&gt;\SYS\...
  * The sapmnt file share, which enables access to these global S:\usr\sap\\&lt;SID&gt;\SYS\... files by using the following UNC path:

    \\\\<ASCS/SCS virtual host name\>\sapmnt\\&lt;SID&gt;\SYS\...


![Figure 2: Processes, file structure, and global host sapmnt file share of an SAP ASCS/SCS instance][sap-ha-guide-figure-8001]

_Processes, file structure, and global host sapmnt file share of an SAP ASCS/SCS instance_

In a high-availability setting, you cluster SAP ASCS/SCS instances. We use *clustered shared disks* (drive S, in our example), to place the SAP ASCS/SCS and SAP global host files.

![Figure 3: SAP ASCS/SCS HA architecture with shared disk][sap-ha-guide-figure-8002]

_SAP ASCS/SCS HA architecture with shared disk_


With Enqueue server replication 1 architecture:
* The same \<ASCS/SCS virtual host name> is used to access the SAP message and enqueue server processes, and the SAP global host files via the sapmnt file share.
* The same cluster shared disk drive S is shared between them.  

With Enqueue server replication 2 architecture: 
* The same \<ASCS/SCS virtual host name> is used to access the SAP message server process, and the SAP global host files via the sapmnt file share.
* The same cluster shared disk drive S is shared between them.
* There is separate \<ERS virtual host name> to access the enqueue server process  

![Figure 4: SAP ASCS/SCS HA architecture with shared disk][sap-ha-guide-figure-8003]

_SAP ASCS/SCS HA architecture with shared disk_

#### Shared Disk and Enqueue Replication Server 

1. Shared disk is supported with Enqueue server replication 1 architecture, where Enqueue Replication Server (ERS) instance:   

   - is not clustered
   - uses `localhost` name
   - is deployed on local disks on each of the cluster nodes

2. Shared disk is also supported with Enqueue server replication 2 architecture, where the Enqueue Replication Server 2 (ERS2) instance:  

   - is clustered
   - uses dedicated virtual/network host name
   - needs the IP address of ERS virtual hostname to be configured on Azure Internal Load Balancer, in addition to the (A)SCS IP address
   - is deployed on **local disks** on each of the clustered nodes, therefore there is no need for shared disk

   > [!TIP]
   > You can find more information about Enqueue Replication Server  1 and 2 (ERS1 and ERS2) here:  
   > [Enqueue Replication Server in a Microsoft Failover Cluster](https://help.sap.com/viewer/3741bfe0345f4892ae190ee7cfc53d4c/CURRENT_VERSION_SWPM20/en-US/8abd4b52902d4b17a105c2fabdf5c0cf.html)  
   > [New Enqueue Replicator in Failover Cluster environments](https://blogs.sap.com/2019/03/19/new-enqueue-replicator-in-failover-cluster-environments/)  

#### Options for shared disk in Azure for SAP workloads

There are two options for shared disk in a windows failover cluster in Azure:

- [Azure shared disks](../../virtual-machines/disks-shared.md) - feature, that allows to attach Azure managed disk to multiple VMs simultaneously. 
- Using 3rd-party software [SIOS DataKeeper Cluster Edition](https://us.sios.com/products/sios-datakeeper/) to create a mirrored storage that simulates cluster shared storage. 

When selecting the technology for shared disk, keep in mind the following considerations:

**Azure shared disk for SAP workloads**

- Allows you to attach Azure managed disk to multiple VMs simultaneously without the need for additional software to maintain and operate.
- [Azure shared disk](../../virtual-machines/disks-shared.md) with [Premium SSD](../../virtual-machines/disks-types.md#premium-ssds) disks is supported for SAP deployment in availability set and availability zones.
- [Azure Ultra disk](../../virtual-machines/disks-types.md#ultra-disks) and [Azure Standard disks](../../virtual-machines/disks-types.md#standard-ssds) is not supported as Azure shared disk for SAP workloads.
- Make sure to provision Azure Premium disk with a minimum disk size as specified in [Premium SSD ranges](../../virtual-machines/disks-shared.md#disk-sizes) to be able to attach to the required number of VMs simultaneously (typically 2 for SAP ASCS Windows Failover cluster).
 
**SIOS**
- The SIOS solution provides real-time synchronous data replication between two disks
- With the SIOS solution you operate with two managed disks, and if using either Availability sets or Availability zones, the managed disks will land on different storage clusters. 
- Deployment in Availability zones is supported
- Requires installing and operating third-party software, which you will need to purchase additionally

### Shared Disk using Azure shared disk

Microsoft is offering [Azure shared disks](../../virtual-machines/disks-shared.md), which can be used to implement SAP ASCS/SCS High Availability with a shared disk option.

#### Prerequisites and limitations

Currently you can use Azure Premium SSD disks as an Azure shared disk for the SAP ASCS/SCS instance. The following limitations are currently in place:

-  [Azure Ultra disk](../../virtual-machines/disks-types.md#ultra-disks) and [Standard SSD disks](../../virtual-machines/disks-types.md#standard-ssds) is not supported as Azure Shared Disk for SAP workloads.
-  [Azure Shared disk](../../virtual-machines/disks-shared.md) with [Premium SSD disks](../../virtual-machines/disks-types.md#premium-ssds) is supported for SAP deployment in availability set and availability zones.
-  Azure shared disk with Premium SSD disks comes with two storage SKUs.
   - Locally redundant storage (LRS) for premium shared disk (skuName - Premium_LRS) is supported with deployment in Azure availability set.
   - Zone-redundant storage (ZRS) for premium shared disk (skuName - Premium_ZRS) is supported with deployment in Azure availability zones.
-  Azure shared disk value [maxShares](../../virtual-machines/disks-shared-enable.md?tabs=azure-cli#disk-sizes) determines how many cluster nodes can use the shared disk. Typically for SAP ASCS/SCS instance you will configure two nodes in Windows Failover Cluster, therefore the value for `maxShares` must be set to two.
-  [Azure proximity placement group](../../virtual-machines/windows/proximity-placement-groups.md) is not required for Azure shared disk. But for SAP deployment with PPG, follow below guidelines:
   -  If you are using PPG for SAP system deployed in a region then all virtual machines sharing a disk must be part of the same PPG.
   -  If you are using PPG for SAP system deployed across zones like described in the document [Proximity placement groups with zonal deployments](proximity-placement-scenarios.md#proximity-placement-groups-with-zonal-deployments), you can attach Premium_ZRS storage to virtual machines sharing a disk.

For further details on limitations for Azure shared disk, please review carefully the [limitations](../../virtual-machines/disks-shared.md#limitations) section of Azure Shared Disk documentation.

#### Important consideration for Premium shared disk

Following are some of the important points to consider for Azure Premium shared disk:

- LRS for Premium shared disk
  - SAP deployment with LRS for Premium shared disk will be operating with a single Azure shared disk on one storage cluster. Your SAP ASCS/SCS instance would be impacted, in case of issues with the storage cluster, where the Azure shared disk is deployed.

- ZRS for Premium shared disk
  - Write latency for ZRS is higher than that of LRS due to cross-zonal copy of data.
  - The distance between availability zones in different region varies and with that ZRS disk latency across availability zones as well. [Benchmark your disks](../../virtual-machines/disks-benchmarks.md) to identify the latency of ZRS disk in your region.
  - ZRS for Premium shared disk synchronously replicates data across three availability zones in the region. In case of any issue in one of the storage clusters, your SAP ASCS/SCS will continue to run as storage failover is transparent to the application layer.
  - Review the [limitations](../../virtual-machines/disks-redundancy.md#limitations) section of ZRS for managed disks for more details.

> [!TIP]
> Review the [SAP Netweaver on Azure planning guide](./planning-guide.md) and the [Azure Storage guide for SAP workloads](./planning-guide-storage.md) for important considerations, when planning your SAP deployment.

### Supported OS versions

Windows Servers 2016, 2019 and higher are supported (use the latest data center images).

We strongly recommend using at least **Windows Server 2019 Datacenter**, as:
- Windows 2019 Failover Cluster Service is Azure aware
- There is added integration and awareness of Azure Host Maintenance and improved experience by monitoring for Azure schedule events.
- It is possible to use Distributed network name(it is the default option). Therefore, there is no need to have a dedicated IP address for the cluster network name. Also, there is no need to configure this IP address on Azure Internal Load Balancer. 

### Shared disks in Azure with SIOS DataKeeper

Another option for shared disk is to use third-party software SIOS DataKeeper Cluster Edition to create a mirrored storage that simulates cluster shared storage. The SIOS solution provides real-time synchronous data replication.

To create a shared disk resource for a cluster:

1. Attach an additional disk to each of the virtual machines in a Windows cluster configuration.
2. Run SIOS DataKeeper Cluster Edition on both virtual machine nodes.
3. Configure SIOS DataKeeper Cluster Edition so that it mirrors the content of the additional disk attached volume from the source virtual machine to the additional disk attached volume of the target virtual machine. SIOS DataKeeper abstracts the source and target local volumes, and then presents them to Windows Server failover clustering as one shared disk.

Get more information about [SIOS DataKeeper](https://us.sios.com/products/sios-datakeeper/).

![Figure 5: Windows Server failover clustering configuration in Azure with SIOS DataKeeper][sap-ha-guide-figure-1002]

_Windows failover clustering configuration in Azure with SIOS DataKeeper_

> [!NOTE]
> You don't need shared disks for high availability with some DBMS products, like SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In this case, the Windows cluster configuration doesn't need a shared disk.
>
## Optional configurations

The following diagrams show multiple SAP instances on Azure VMs running Microsoft Windows Failover Cluster to reduce the total number of VMs.

This can either be local SAP Application Servers on a SAP ASCS/SCS cluster or a SAP ASCS/SCS Cluster Role on Microsoft SQL Server Always On nodes.

> [!IMPORTANT]
> Installing a local SAP Application Server on a SQL Server Always On node is not supported.
>

Both, SAP ASCS/SCS and the Microsoft SQL Server database, are single points of failure (SPOF). To protect these SPOFs in a Windows environment WSFC is used.

While the resource consumption of the SAP ASCS/SCS is fairly small, a reduction of the memory configuration for either SQL Server or the SAP Application Server by 2 GB is recommended.

### SAP Application Servers on WSFC nodes using SIOS DataKeeper

![Figure 6: Windows Server failover clustering configuration in Azure with SIOS DataKeeper and locally installed SAP Application Server][sap-ha-guide-figure-1003]

> [!NOTE]
> Since the SAP Application Servers are installed locally, there is no need for setting up any synchronization as the picture shows.
>
### SAP ASCS/SCS on SQL Server Always On nodes using SIOS DataKeeper

![Figure 7: SAP ASCS/SCS on SQL Server Always On nodes using SIOS DataKeeper][sap-ha-guide-figure-1005]

[Optional configuration for SAP Application Servers on WSFC nodes using Windows SOFS][optional-fileshare]

[Optional configuration for SAP Application Servers on WSFC nodes using NetApp Files SMB][optional-smb]

[Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Windows SOFS][optional-fileshare-sql]

[Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using NetApp Files SMB][optional-smb-sql]

## Next steps

* [Prepare the Azure infrastructure for SAP HA by using a Windows  failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk]

* [Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]


[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[sap-installation-guides]:http://service.sap.com/instguides

[azure-resource-manager/management/azure-subscription-service-limits]:../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../azure-resource-manager/management/azure-subscription-service-limits.md

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide-general.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md

[planning-guide]:planning-guide.md
[planning-guide-11]:planning-guide.md
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f


[sap-ha-guide-2]:#42b8f600-7ba3-4606-b8a5-53c4f026da08
[sap-ha-guide-4]:#8ecf3ba0-67c0-4495-9c14-feec1a2255b7
[sap-ha-guide-8]:#78092dbe-165b-454c-92f5-4972bdbef9bf
[sap-ha-guide-8.1]:#c87a8d3f-b1dc-4d2f-b23c-da4b72977489
[sap-ha-guide-8.9]:#fe0bd8b5-2b43-45e3-8295-80bee5415716
[sap-ha-guide-8.11]:#661035b2-4d0f-4d31-86f8-dc0a50d78158
[sap-ha-guide-8.12]:#0d67f090-7928-43e0-8772-5ccbf8f59aab
[sap-ha-guide-8.12.1]:#5eecb071-c703-4ccc-ba6d-fe9c6ded9d79
[sap-ha-guide-8.12.3]:#5c8e5482-841e-45e1-a89d-a05c0907c868
[sap-ha-guide-8.12.3.1]:#1c2788c3-3648-4e82-9e0d-e058e475e2a3
[sap-ha-guide-8.12.3.2]:#dd41d5a2-8083-415b-9878-839652812102
[sap-ha-guide-8.12.3.3]:#d9c1fc8e-8710-4dff-bec2-1f535db7b006
[sap-ha-guide-9]:#a06f0b49-8a7a-42bf-8b0d-c12026c5746b
[sap-ha-guide-9.1]:#31c6bd4f-51df-4057-9fdf-3fcbc619c170
[sap-ha-guide-9.1.1]:#a97ad604-9094-44fe-a364-f89cb39bf097



[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[sap-ha-guide-figure-1000]:./media/virtual-machines-shared-sap-high-availability-guide/1000-wsfc-for-sap-ascs-on-azure.png
[sap-ha-guide-figure-1001]:./media/virtual-machines-shared-sap-high-availability-guide/1001-wsfc-on-azure-ilb.png
[sap-ha-guide-figure-1003]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sios-as.png
[sap-ha-guide-figure-1005]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sql-ascs-sios.png
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sios.png
[sap-ha-guide-figure-2000]:./media/virtual-machines-shared-sap-high-availability-guide/2000-wsfc-sap-as-ha-on-azure.png
[sap-ha-guide-figure-2001]:./media/virtual-machines-shared-sap-high-availability-guide/2001-wsfc-sap-ascs-ha-on-azure.png
[sap-ha-guide-figure-2003]:./media/virtual-machines-shared-sap-high-availability-guide/2003-wsfc-sap-dbms-ha-on-azure.png
[sap-ha-guide-figure-2004]:./media/virtual-machines-shared-sap-high-availability-guide/2004-wsfc-sap-ha-e2e-archit-template1-on-azure.png
[sap-ha-guide-figure-2005]:./media/virtual-machines-shared-sap-high-availability-guide/2005-wsfc-sap-ha-e2e-arch-template2-on-azure.png

[sap-ha-guide-figure-3000]:./media/virtual-machines-shared-sap-high-availability-guide/3000-template-parameters-sap-ha-arm-on-azure.png
[sap-ha-guide-figure-3001]:./media/virtual-machines-shared-sap-high-availability-guide/3001-configuring-dns-servers-for-Azure-vnet.png
[sap-ha-guide-figure-3002]:./media/virtual-machines-shared-sap-high-availability-guide/3002-configuring-static-IP-address-for-network-card-of-each-vm.png
[sap-ha-guide-figure-3003]:./media/virtual-machines-shared-sap-high-availability-guide/3003-setup-static-ip-address-ilb-for-ascs-instance.png
[sap-ha-guide-figure-3004]:./media/virtual-machines-shared-sap-high-availability-guide/3004-default-ascs-scs-ilb-balancing-rules-for-azure-ilb.png
[sap-ha-guide-figure-3005]:./media/virtual-machines-shared-sap-high-availability-guide/3005-changing-ascs-scs-default-ilb-rules-for-azure-ilb.png
[sap-ha-guide-figure-3006]:./media/virtual-machines-shared-sap-high-availability-guide/3006-adding-vm-to-domain.png
[sap-ha-guide-figure-3007]:./media/virtual-machines-shared-sap-high-availability-guide/3007-config-wsfc-1.png
[sap-ha-guide-figure-3008]:./media/virtual-machines-shared-sap-high-availability-guide/3008-config-wsfc-2.png
[sap-ha-guide-figure-3009]:./media/virtual-machines-shared-sap-high-availability-guide/3009-config-wsfc-3.png
[sap-ha-guide-figure-3010]:./media/virtual-machines-shared-sap-high-availability-guide/3010-config-wsfc-4.png
[sap-ha-guide-figure-3011]:./media/virtual-machines-shared-sap-high-availability-guide/3011-config-wsfc-5.png
[sap-ha-guide-figure-3012]:./media/virtual-machines-shared-sap-high-availability-guide/3012-config-wsfc-6.png
[sap-ha-guide-figure-3013]:./media/virtual-machines-shared-sap-high-availability-guide/3013-config-wsfc-7.png
[sap-ha-guide-figure-3014]:./media/virtual-machines-shared-sap-high-availability-guide/3014-config-wsfc-8.png
[sap-ha-guide-figure-3015]:./media/virtual-machines-shared-sap-high-availability-guide/3015-config-wsfc-9.png
[sap-ha-guide-figure-3016]:./media/virtual-machines-shared-sap-high-availability-guide/3016-config-wsfc-10.png
[sap-ha-guide-figure-3017]:./media/virtual-machines-shared-sap-high-availability-guide/3017-config-wsfc-11.png
[sap-ha-guide-figure-3018]:./media/virtual-machines-shared-sap-high-availability-guide/3018-config-wsfc-12.png
[sap-ha-guide-figure-3019]:./media/virtual-machines-shared-sap-high-availability-guide/3019-assign-permissions-on-share-for-cluster-name-object.png
[sap-ha-guide-figure-3020]:./media/virtual-machines-shared-sap-high-availability-guide/3020-change-object-type-include-computer-objects.png
[sap-ha-guide-figure-3021]:./media/virtual-machines-shared-sap-high-availability-guide/3021-check-box-for-computer-objects.png
[sap-ha-guide-figure-3022]:./media/virtual-machines-shared-sap-high-availability-guide/3022-set-security-attributes-for-cluster-name-object-on-file-share-quorum.png
[sap-ha-guide-figure-3023]:./media/virtual-machines-shared-sap-high-availability-guide/3023-call-configure-cluster-quorum-setting-wizard.png
[sap-ha-guide-figure-3024]:./media/virtual-machines-shared-sap-high-availability-guide/3024-selection-screen-different-quorum-configurations.png
[sap-ha-guide-figure-3025]:./media/virtual-machines-shared-sap-high-availability-guide/3025-selection-screen-file-share-witness.png
[sap-ha-guide-figure-3026]:./media/virtual-machines-shared-sap-high-availability-guide/3026-define-file-share-location-for-witness-share.png
[sap-ha-guide-figure-3027]:./media/virtual-machines-shared-sap-high-availability-guide/3027-successful-reconfiguration-cluster-file-share-witness.png
[sap-ha-guide-figure-3028]:./media/virtual-machines-shared-sap-high-availability-guide/3028-install-dot-net-framework-35.png
[sap-ha-guide-figure-3029]:./media/virtual-machines-shared-sap-high-availability-guide/3029-install-dot-net-framework-35-progress.png
[sap-ha-guide-figure-3030]:./media/virtual-machines-shared-sap-high-availability-guide/3030-sios-installer.png
[sap-ha-guide-figure-3031]:./media/virtual-machines-shared-sap-high-availability-guide/3031-first-screen-sios-data-keeper-installation.png
[sap-ha-guide-figure-3032]:./media/virtual-machines-shared-sap-high-availability-guide/3032-data-keeper-informs-service-be-disabled.png
[sap-ha-guide-figure-3033]:./media/virtual-machines-shared-sap-high-availability-guide/3033-user-selection-sios-data-keeper.png
[sap-ha-guide-figure-3034]:./media/virtual-machines-shared-sap-high-availability-guide/3034-domain-user-sios-data-keeper.png
[sap-ha-guide-figure-3035]:./media/virtual-machines-shared-sap-high-availability-guide/3035-provide-sios-data-keeper-license.png
[sap-ha-guide-figure-3036]:./media/virtual-machines-shared-sap-high-availability-guide/3036-data-keeper-management-config-tool.png
[sap-ha-guide-figure-3037]:./media/virtual-machines-shared-sap-high-availability-guide/3037-tcp-ip-address-first-node-data-keeper.png
[sap-ha-guide-figure-3038]:./media/virtual-machines-shared-sap-high-availability-guide/3038-create-replication-sios-job.png
[sap-ha-guide-figure-3039]:./media/virtual-machines-shared-sap-high-availability-guide/3039-define-sios-replication-job-name.png
[sap-ha-guide-figure-3040]:./media/virtual-machines-shared-sap-high-availability-guide/3040-define-sios-source-node.png
[sap-ha-guide-figure-3041]:./media/virtual-machines-shared-sap-high-availability-guide/3041-define-sios-target-node.png
[sap-ha-guide-figure-3042]:./media/virtual-machines-shared-sap-high-availability-guide/3042-define-sios-synchronous-replication.png
[sap-ha-guide-figure-3043]:./media/virtual-machines-shared-sap-high-availability-guide/3043-enable-sios-replicated-volume-as-cluster-volume.png
[sap-ha-guide-figure-3044]:./media/virtual-machines-shared-sap-high-availability-guide/3044-data-keeper-synchronous-mirroring-for-SAP-gui.png
[sap-ha-guide-figure-3045]:./media/virtual-machines-shared-sap-high-availability-guide/3045-replicated-disk-by-data-keeper-in-wsfc.png
[sap-ha-guide-figure-3046]:./media/virtual-machines-shared-sap-high-availability-guide/3046-dns-entry-sap-ascs-virtual-name-ip.png
[sap-ha-guide-figure-3047]:./media/virtual-machines-shared-sap-high-availability-guide/3047-dns-manager.png
[sap-ha-guide-figure-3048]:./media/virtual-machines-shared-sap-high-availability-guide/3048-default-cluster-probe-port.png
[sap-ha-guide-figure-3049]:./media/virtual-machines-shared-sap-high-availability-guide/3049-cluster-probe-port-after.png
[sap-ha-guide-figure-3050]:./media/virtual-machines-shared-sap-high-availability-guide/3050-service-type-ers-delayed-automatic.png
[sap-ha-guide-figure-5000]:./media/virtual-machines-shared-sap-high-availability-guide/5000-wsfc-sap-sid-node-a.png
[sap-ha-guide-figure-5001]:./media/virtual-machines-shared-sap-high-availability-guide/5001-sios-replicating-local-volume.png
[sap-ha-guide-figure-5002]:./media/virtual-machines-shared-sap-high-availability-guide/5002-wsfc-sap-sid-node-b.png
[sap-ha-guide-figure-5003]:./media/virtual-machines-shared-sap-high-availability-guide/5003-sios-replicating-local-volume-b-to-a.png

[sap-ha-guide-figure-6003]:./media/virtual-machines-shared-sap-high-availability-guide/6003-sap-multi-sid-full-landscape.png


[sap-ha-guide-figure-8001]:./media/virtual-machines-shared-sap-high-availability-guide/8001.png
[sap-ha-guide-figure-8002]:./media/virtual-machines-shared-sap-high-availability-guide/8002.png
[sap-ha-guide-figure-8003]:./media/virtual-machines-shared-sap-high-availability-guide/8003.png
[sap-ha-guide-figure-8004]:./media/virtual-machines-shared-sap-high-availability-guide/8004.png
[sap-ha-guide-figure-8005]:./media/virtual-machines-shared-sap-high-availability-guide/8005.png
[sap-ha-guide-figure-8006]:./media/virtual-machines-shared-sap-high-availability-guide/8006.png
[sap-ha-guide-figure-8007]:./media/virtual-machines-shared-sap-high-availability-guide/8007.png
[sap-ha-guide-figure-8008]:./media/virtual-machines-shared-sap-high-availability-guide/8008.png
[sap-ha-guide-figure-8009]:./media/virtual-machines-shared-sap-high-availability-guide/8009.png
[sap-ha-guide-figure-8010]:./media/virtual-machines-shared-sap-high-availability-guide/8010.png
[sap-ha-guide-figure-8011]:./media/virtual-machines-shared-sap-high-availability-guide/8011.png
[sap-ha-guide-figure-8012]:./media/virtual-machines-shared-sap-high-availability-guide/8012.png
[sap-ha-guide-figure-8013]:./media/virtual-machines-shared-sap-high-availability-guide/8013.png
[sap-ha-guide-figure-8014]:./media/virtual-machines-shared-sap-high-availability-guide/8014.png
[sap-ha-guide-figure-8015]:./media/virtual-machines-shared-sap-high-availability-guide/8015.png
[sap-ha-guide-figure-8016]:./media/virtual-machines-shared-sap-high-availability-guide/8016.png
[sap-ha-guide-figure-8017]:./media/virtual-machines-shared-sap-high-availability-guide/8017.png
[sap-ha-guide-figure-8018]:./media/virtual-machines-shared-sap-high-availability-guide/8018.png
[sap-ha-guide-figure-8019]:./media/virtual-machines-shared-sap-high-availability-guide/8019.png
[sap-ha-guide-figure-8020]:./media/virtual-machines-shared-sap-high-availability-guide/8020.png
[sap-ha-guide-figure-8021]:./media/virtual-machines-shared-sap-high-availability-guide/8021.png
[sap-ha-guide-figure-8022]:./media/virtual-machines-shared-sap-high-availability-guide/8022.png
[sap-ha-guide-figure-8023]:./media/virtual-machines-shared-sap-high-availability-guide/8023.png
[sap-ha-guide-figure-8024]:./media/virtual-machines-shared-sap-high-availability-guide/8024.png
[sap-ha-guide-figure-8025]:./media/virtual-machines-shared-sap-high-availability-guide/8025.png


[sap-templates-3-tier-multisid-xscs-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs%2Fazuredeploy.json
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../azure-resource-manager/management/overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines-windows-manage-availability.md
[optional-smb]:high-availability-guide-windows-netapp-files-smb.md#5121771a-7618-4f36-ae14-ccf9ee5f2031 (Optional configuration for SAP Application Servers on WSFC nodes using NetApp Files SMB)
[optional-fileshare]:sap-high-availability-guide-wsfc-file-share.md#86cb3ee0-2091-4b74-be77-64c2e6424f50 (Optional configuration for SAP Application Servers on WSFC nodes using Windows SOFS)
[optional-smb-sql]:high-availability-guide-windows-netapp-files-smb.md#01541cf2-0a03-48e3-971e-e03575fa7b4f (Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using NetApp Files SMB)
[optional-fileshare-sql]:sap-high-availability-guide-wsfc-file-share.md#db335e0d-09b4-416b-b240-afa18505f503 (Optional configuration for SAP ASCS/SCS on SQL Server Always On nodes using Windows SOFS)
