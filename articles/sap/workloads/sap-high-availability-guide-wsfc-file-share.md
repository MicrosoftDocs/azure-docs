---
title: Cluster SAP ASCS/SCS on WSFC using file share in Azure | Microsoft Docs
description: Learn how to cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017

---

# Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure

> ![Windows logo.][Logo_Windows] Windows
>

Windows Server failover clustering is the foundation of a high-availability SAP ASCS/SCS installation and DBMS in Windows.

A failover cluster is a group of 1+n independent servers (nodes) that work together to increase the availability of applications and services. If a node failure occurs, Windows Server failover clustering calculates the number of failures that can occur and still maintain a healthy cluster to provide applications and services. You can choose from different quorum modes to achieve failover clustering.

## Prerequisites
Before you begin the tasks that are described in this article, review the following articles and SAP notes:

* [Azure Virtual Machines high-availability architecture and scenarios for SAP NetWeaver][sap-high-availability-architecture-scenarios]
* SAP Note [1928533][1928533], which contains:  
  * A list of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows on Microsoft Azure
* SAP Note [2015553][2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632][2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [1999351][1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* SAP Note [2287140](https://launchpad.support.sap.com/#/notes/2287140) lists prerequisites for  SAP-supported CA feature of SMB 3.x protocol.
* SAP Note [2802770](https://launchpad.support.sap.com/#/notes/2802770) has troubleshooting information for the slow running SAP transaction AL11 on Windows 2012 and 2016.
* SAP Note [1911507](https://launchpad.support.sap.com/#/notes/1911507) has information about transparent failover feature for a file share on Windows Server with the SMB 3.0 protocol.
* SAP Note [662452](https://launchpad.support.sap.com/#/notes/662452) has recommendation(deactivating 8.3 name generation) to address Poor file system performance/errors during data accesses.
* [Install SAP NetWeaver high availability on a Windows failover cluster and file share for SAP ASCS/SCS instances on Azure](./sap-high-availability-installation-wsfc-file-share.md)

> [!NOTE]
> Clustering SAP ASCS/SCS instances by using a file share is supported for SAP systems with SAP Kernel 7.22 (and later). For details see SAP note [2698948](https://launchpad.support.sap.com/#/notes/2698948)  



## Windows Server failover clustering in Azure

Compared to bare-metal or private cloud deployments, Azure Virtual Machines requires additional steps to configure Windows Server failover clustering. When you build a cluster, you need to set several IP addresses and virtual host names for the SAP ASCS/SCS instance.

### Name resolution in Azure and the cluster virtual host name

The Azure cloud platform doesn't offer the option to configure virtual IP addresses, such as floating IP addresses. You need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud. 

The Azure Load Balancer service provides an *internal load balancer* for Azure. With the internal load balancer, clients reach the cluster over the cluster virtual IP address. 

Deploy the internal load balancer in the resource group that contains the cluster nodes. Then, configure all necessary port forwarding rules by using the probe ports of the internal load balancer. The clients can connect via the virtual host name. The DNS server resolves the cluster IP address. The internal load balancer handles port forwarding to the active node of the cluster.

![Figure 1: Windows Server Failover Clustering configuration in Azure without a shared disk][sap-ha-guide-figure-1001]

_**Figure 1:** Windows Server failover clustering configuration in Azure without a shared disk_

## SAP ASCS/SCS HA with file share

SAP developed a new approach, and an alternative to cluster shared disks, for clustering an SAP ASCS/SCS instance on a Windows failover cluster. Instead of using cluster shared disks, you can use an SMB file share to deploy SAP global host files.

> [!NOTE]
> An SMB file share is an alternative to using cluster shared disks for clustering SAP ASCS/SCS instances.  
>

This architecture is specific in the following ways:

* SAP central services (with its own file structure and message and enqueue processes) are separate from the SAP global host files.
* SAP central services run under an SAP ASCS/SCS instance.
* SAP ASCS/SCS instance is clustered and is accessible by using the \<ASCS/SCS virtual host name\> virtual host name.
* SAP global files are placed on the SMB file share and are accessed by using the \<SAP global host\> host name:
 \\\\&lt;SAP global host&gt;\sapmnt\\&lt;SID&gt;\SYS\...
* The SAP ASCS/SCS instance is installed on a local disk on both cluster nodes.
* The \<ASCS/SCS virtual host name\> network name is different from &lt;SAP global host&gt;.

![Figure 2: SAP ASCS/SCS HA architecture with SMB file share][sap-ha-guide-figure-8004]

_**Figure 2:** New SAP ASCS/SCS HA architecture with an SMB file share_

Prerequisites for an SMB file share:

* SMB 3.0 (or later) protocol.
* Ability to set Active Directory access control lists (ACLs) for Active Directory user groups and the `computer$` computer object.
* The file share must be HA-enabled:
    * Disks used to store files must not be a single point of failure.
    * Server or VM downtime does not cause downtime on the file share.

The SAP \<SID\> cluster role does not contain cluster shared disks or a generic file share cluster resource.


![Figure 3: SAP \<SID\> cluster role resources for using a file share][sap-ha-guide-figure-8005]

_**Figure 3:** SAP &lt;SID&gt; cluster role resources for using a file share_


## Scale-out file shares with Storage Spaces Direct in Azure as an SAPMNT file share

You can use a scale-out file share to host and protect SAP global host files. A scale-out file share also offers a highly available SAPMNT file share service.

![Figure 4: Scale-out file share used to protect SAP global host files][sap-ha-guide-figure-8006]

_**Figure 4:** A scale-out file share used to protect SAP global host files_

> [!IMPORTANT]
> Scale-out file shares are fully supported in the Microsoft Azure cloud, and in on-premises environments.
>

A scale-out file share offers a highly available and horizontally scalable SAPMNT file share.

Storage Spaces Direct is used as a shared disk for a scale-out file share. You can use Storage Spaces Direct to build highly available and scalable storage using servers with local storage. Shared storage that is used for a scale-out file share, like for SAP global host files, is not a single point of failure.

When choosing Storage Spaces Direct, consider these use cases:

- The virtual machines used to build the Storage Spaces Direct cluster need to be deployed in an Azure availability set.
- For disaster recovery of a Storage Spaces Direct Cluster, you can use [Azure Site Recovery Services](../../site-recovery/azure-to-azure-support-matrix.md#replicated-machines---storage).
- It is not supported to stretch the Storage Space Direct Cluster across different Azure Availability Zones.

### SAP prerequisites for scale-out file shares in Azure

To use a scale-out file share, your system must meet the following requirements:

* At least two cluster nodes for a scale-out file share.
* Each node must have at least two local disks.
* For performance reason, you must use *mirroring resiliency*:
    * Two-way mirroring for a scale-out file share with two cluster nodes.
    * Three-way mirroring for a scale-out file share with three (or more) cluster nodes.
* We recommend three (or more) cluster nodes for a scale-out file share, with three-way mirroring.
    This setup offers more scalability and more storage resiliency than the scale-out file share setup with two cluster nodes and two-way mirroring.
* You must use Azure Premium disks.
* We recommend that you use Azure Managed Disks.
* We recommend that you format volumes by using Resilient File System (ReFS).
    * For more information, see [SAP Note 1869038 - SAP support for ReFS filesystem][1869038] and the [Choosing the file system][planning-volumes-s2d-choosing-filesystem] chapter of the article Planning volumes in Storage Spaces Direct.
    * Be sure that you install [Microsoft KB4025334 cumulative update][kb4025334].
* You can use DS-Series or DSv2-Series Azure VM sizes.
* For good network performance between VMs, which is needed for Storage Spaces Direct disk sync, use a VM type that has at least a “high” network bandwidth.
    For more information, see the [DSv2-Series][dv2-series] and [DS-Series][ds-series] specifications.
* We recommend that you reserve some unallocated capacity in the storage pool. Leaving some unallocated capacity in the storage pool gives volumes space to repair "in place" if a drive fails. This improves data safety and performance.  For more information, see [Choosing volume size][choosing-the-size-of-volumes-s2d].
* You don't need to configure the Azure internal load balancer for the scale-out file share network name, such as for \<SAP global host\>. This is done for the \<ASCS/SCS virtual host name\> of the SAP ASCS/SCS instance or for the DBMS. A scale-out file share scales out the load across all cluster nodes. \<SAP global host\> uses the local IP address for all cluster nodes.

> [!IMPORTANT]
> You cannot rename the SAPMNT file share, which points to \<SAP global host\>. SAP supports only the share name "sapmnt."
>
For more information, see [SAP Note 2492395 - Can the share name sapmnt be changed?][2492395]

### Configure SAP ASCS/SCS instances and a scale-out file share in two clusters

You must deploy the SAP ASCS/SCS instances in a separate cluster, with their own SAP \<SID\> cluster role. In this case, you configure the scale-out file share on another cluster, with another cluster role.


> [!IMPORTANT]
> The setup must meet the following requirement: the SAP ASCS/SCS instances and the SOFS share must be deployed in separate clusters.    
>
> [!IMPORTANT] 
> In this scenario, the SAP ASCS/SCS instance is configured to access the SAP global host by using UNC path \\\\&lt;SAP global host&gt;\sapmnt\\&lt;SID&gt;\SYS\.
>

![Figure 5: SAP ASCS/SCS instance and a scale-out file share deployed in two clusters][sap-ha-guide-figure-8007]

_**Figure 5:** An SAP ASCS/SCS instance and a scale-out file share deployed in two clusters_

## Optional configurations

The following diagrams show multiple SAP instances on Azure VMs running Microsoft Windows Failover Cluster to reduce the total number of VMs.

This can either be local SAP Application Servers on a SAP ASCS/SCS cluster or a SAP ASCS/SCS Cluster Role on Microsoft SQL Server Always On nodes.

> [!IMPORTANT]
> Installing a local SAP Application Server on a SQL Server Always On node is not supported.
>

Both, SAP ASCS/SCS and the Microsoft SQL Server database, are single points of failure (SPOF). To protect these SPOFs in a Windows environment WSFC is used.

While the resource consumption of the SAP ASCS/SCS is fairly small, a reduction of the memory configuration for either SQL Server or the SAP Application Server by 2 GB is recommended.

### <a name="86cb3ee0-2091-4b74-be77-64c2e6424f50"></a>SAP Application Servers on WSFC nodes using Windows SOFS

![Figure 6: Windows Server failover clustering configuration in Azure with Windows SOFS and locally installed SAP Application Server][sap-ha-guide-figure-8007A]

> [!NOTE]
> The picture shows the use of additional local disks. This is optional for customers who will not install application software on the OS drive (C:\)
>
### <a name="db335e0d-09b4-416b-b240-afa18505f503"></a> SAP ASCS/SCS on SQL Server Always On nodes using Windows SOFS

![Figure 7: SAP ASCS/SCS on SQL Server Always On nodes using Windows SOFS][sap-ha-guide-figure-8007B]

> [!NOTE]
> The picture shows the use of additional local disks. This is optional for customers who will not install application software on the OS drive (C:\)
>

> [!IMPORTANT]
> In the Azure cloud, each cluster that is used for SAP and scale-out file shares must be deployed in its own Azure availability set or across Azure Availability Zones. This ensures distributed placement of the cluster VMs across the underlying Azure infrastructure. Availability Zone deployments are supported with this technology.
>

## Generic file share with SIOS DataKeeper as cluster shared disks


A generic file share is another option for achieving a highly available file share.

In this case, you can use a third-party SIOS solution as a cluster shared disk.

## Next steps

* [Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and file share for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-file-share]
* [Install SAP NetWeaver HA on a Windows failover cluster and file share for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]
* [Deploy a two-node Storage Spaces Direct scale-out file server for UPD storage in Azure][deploy-sofs-s2d-in-azure]
* [Storage Spaces Direct in Windows Server 2016][s2d-in-win-2016]
* [Deep dive: Volumes in Storage Spaces Direct][deep-dive-volumes-in-s2d]

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[2492395]:https://launchpad.support.sap.com/#/notes/2492395

[kb4025334]:https://support.microsoft.com/help/4025334/windows-10-update-kb4025334

[dv2-series]:../../virtual-machines/dv2-dsv2-series.md
[ds-series]:/azure/virtual-machines/windows/sizes-general

[sap-installation-guides]:http://service.sap.com/instguides

[azure-resource-manager/management/azure-subscription-service-limits]:../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../azure-resource-manager/management/azure-subscription-service-limits.md

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide-general.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-infrastructure-wsfc-file-share]:sap-high-availability-infrastructure-wsfc-file-share.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-hana-ha]:sap-hana-high-availability.md
[sap-suse-ascs-ha]:high-availability-guide-suse.md

[planning-volumes-s2d-choosing-filesystem]:/windows-server/storage/storage-spaces/plan-volumes#choosing-the-filesystem
[choosing-the-size-of-volumes-s2d]:/windows-server/storage/storage-spaces/plan-volumes#choosing-the-size-of-volumes
[deploy-sofs-s2d-in-azure]:/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment
[s2d-in-win-2016]:/windows-server/storage/storage-spaces/storage-spaces-direct-overview
[deep-dive-volumes-in-s2d]:https://blogs.technet.microsoft.com/filecab/2016/08/29/deep-dive-volumes-in-spaces-direct/

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
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/1002-wsfc-sios-on-azure-ilb.png
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
[sap-ha-guide-figure-8007]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sofs.png
[sap-ha-guide-figure-8007A]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sofs-as.png
[sap-ha-guide-figure-8007B]:./media/virtual-machines-shared-sap-high-availability-guide/ha-sql-ascs-sofs.png
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

[1869038]:https://launchpad.support.sap.com/#/notes/1869038 
