---
title: Azure Virtual Machines high availability for SAP NetWeaver | Microsoft Docs
description: High-availability guide for SAP NetWeaver on Azure Virtual Machines
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: goraco
manager: gwallace
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: virtual-machines-windows
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 05/05/2017
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# Azure Virtual Machines high availability for SAP NetWeaver

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[sap-installation-guides]:http://service.sap.com/instguides

[azure-subscription-service-limits]:../../../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../../../azure-subscription-service-limits.md

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[ha-guide]:sap-high-availability-guide.md

[planning-guide]:planning-guide.md
[planning-guide-11]:planning-guide.md
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f

[sap-ha-guide]:sap-high-availability-guide.md
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

[sap-ha-multi-sid-guide]:sap-high-availability-multi-sid.md (SAP multi-SID high-availability configuration)


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

[sap-templates-3-tier-multisid-xscs-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs%2Fazuredeploy.json
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../../azure-resource-manager/resource-group-overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines-windows-manage-availability.md



Azure Virtual Machines is the solution for organizations that need compute, storage, and network resources, in minimal time, and without lengthy procurement cycles. You can use Azure Virtual Machines to deploy classic applications like SAP NetWeaver-based ABAP, Java, and an ABAP+Java stack. Extend reliability and availability without additional on-premises resources. Azure Virtual Machines supports cross-premises connectivity, so you can integrate Azure Virtual Machines into your organization's on-premises domains, private clouds, and SAP system landscape.

In this article, we cover the steps that you can take to deploy high-availability SAP systems in Azure by using the Azure Resource Manager deployment model. We walk you through these major tasks:

* Find the right SAP Notes and installation guides, listed in the [Resources][sap-ha-guide-2] section. This article complements SAP installation documentation and SAP Notes, which are the primary resources that can help you install and deploy SAP software on specific platforms.
* Learn the differences between the Azure Resource Manager deployment model and the Azure classic deployment model.
* Learn about Windows Server Failover Clustering quorum modes, so you can select the model that is right for your Azure deployment.
* Learn about Windows Server Failover Clustering shared storage in Azure services.
* Learn how to help protect single-point-of-failure components like Advanced Business Application Programming (ABAP) SAP Central Services (ASCS)/SAP Central Services (SCS) and database management systems (DBMS), and redundant components like SAP Application Server, in Azure.
* Follow a step-by-step example of an installation and configuration of a high-availability SAP system in a Windows Server Failover Clustering cluster in Azure by using Azure Resource Manager.
* Learn about additional steps required to use Windows Server Failover Clustering in Azure, but which are not needed in an on-premises deployment.

To simplify deployment and configuration, in this article, we use the SAP three-tier high-availability Resource Manager templates. The templates automate deployment of the entire infrastructure that you need for a high-availability SAP system. The infrastructure also supports SAP Application Performance Standard (SAPS) sizing of your SAP system.

## <a name="217c5479-5595-4cd8-870d-15ab00d4f84c"></a> Prerequisites
Before you start, make sure that you meet the prerequisites that are described in the following sections. Also, be sure to check all resources listed in the [Resources][sap-ha-guide-2] section.

In this article, we use Azure Resource Manager templates for [three-tier SAP NetWeaver using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-md/). For a helpful overview of templates, see [SAP Azure Resource Manager templates](https://blogs.msdn.microsoft.com/saponsqlserver/2016/05/16/azure-quickstart-templates-for-sap/).

## <a name="42b8f600-7ba3-4606-b8a5-53c4f026da08"></a> Resources
These articles cover SAP deployments in Azure:

* [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]
* [Azure Virtual Machines deployment for SAP NetWeaver][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]
* [Azure Virtual Machines high availability for SAP NetWeaver (this guide)][sap-ha-guide]

> [!NOTE]
> Whenever possible, we give you a link to the referring SAP installation guide (see the [SAP installation guides][sap-installation-guides]). For prerequisites and information about the installation process, it's a good idea to read the SAP NetWeaver installation guides carefully. This article covers only specific tasks for SAP NetWeaver-based systems that you can use with Azure Virtual Machines.
>
>

These SAP Notes are related to the topic of SAP in Azure:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Sizing |
| [2015553] |SAP on Microsoft Azure: Support Prerequisites |
| [1999351] |Enhanced Azure Monitoring for SAP |
| [2178632] |Key Monitoring Metrics for SAP on Microsoft Azure |
| [1999351] |Virtualization on Windows: Enhanced Monitoring |
| [2243692] |Use of Azure Premium SSD Storage for SAP DBMS Instance |

Learn more about the [limitations of Azure subscriptions][azure-subscription-service-limits-subscription], including general default limitations and maximum limitations.

## <a name="42156640c6-01cf-45a9-b225-4baa678b24f1"></a>High-availability SAP with Azure Resource Manager vs. the Azure classic deployment model
The Azure Resource Manager and Azure classic deployment models are different in the following areas:

- Resource groups
- Azure internal load balancer dependency on the Azure resource group
- Support for SAP multi-SID scenarios

### <a name="f76af273-1993-4d83-b12d-65deeae23686"></a> Resource groups
In Azure Resource Manager, you can use resource groups to manage all the application resources in your Azure subscription. An integrated approach, in a resource group, all resources have the same life cycle. For example, all resources are created at the same time and they are deleted at the same time. Learn more about [resource groups](../../../azure-resource-manager/resource-group-overview.md#resource-groups).

### <a name="3e85fbe0-84b1-4892-87af-d9b65ff91860"></a> Azure internal load balancer dependency on the Azure resource group

In the Azure classic deployment model, there is a dependency between the Azure internal load balancer (Azure Load Balancer service) and the cloud service. Every internal load balancer needs one cloud service.

In Azure Resource Manager, every Azure resource needs to be placed into an Azure resource group, and this is valid for Azure Load Balancer as well. However, there is no need to have one Azure resource group per Azure load balancer, e.g. one Azure resource group can contain multiple Azure Load Balancers. The environment is simpler and more flexible. 

### Support for SAP multi-SID scenarios

In Azure Resource Manager, you can install multiple SAP system identifier (SID) ASCS/SCS instances in one cluster. Multi-SID instances are possible because of support for multiple IP addresses for each Azure internal load balancer.

To use the Azure classic deployment model, follow the procedures described in [SAP NetWeaver in Azure: Clustering SAP ASCS/SCS instances by using Windows Server Failover Clustering in Azure with SIOS DataKeeper](https://go.microsoft.com/fwlink/?LinkId=613056).

> [!IMPORTANT]
> We strongly recommend that you use the Azure Resource Manager deployment model for your SAP installations. It offers many benefits that are not available in the classic deployment model. Learn more about Azure [deployment models][virtual-machines-azure-resource-manager-architecture-benefits-arm].   
>
>

## <a name="8ecf3ba0-67c0-4495-9c14-feec1a2255b7"></a> Windows Server Failover Clustering
Windows Server Failover Clustering is the foundation of a high-availability SAP ASCS/SCS installation and DBMS in Windows.

A failover cluster is a group of 1+n independent servers (nodes) that work together to increase the availability of applications and services. If a node failure occurs, Windows Server Failover Clustering calculates the number of failures that can occur while maintaining a healthy cluster to provide applications and services. You can choose from different quorum modes to achieve failover clustering.

### <a name="1a3c5408-b168-46d6-99f5-4219ad1b1ff2"></a> Quorum modes
You can choose from four quorum modes when you use Windows Server Failover Clustering:

* **Node Majority**. Each node of the cluster can vote. The cluster functions only with a majority of votes, that is, with more than half the votes. We recommend this option for clusters that have an uneven number of nodes. For example, three nodes in a seven-node cluster can fail, and the cluster stills achieves a majority and continues to run.  
* **Node and Disk Majority**. Each node and a designated disk (a disk witness) in the cluster storage can vote when they are available and in communication. The cluster functions only with a majority of the votes, that is, with more than half the votes. This mode makes sense in a cluster environment with an even number of nodes. If half the nodes and the disk are online, the cluster remains in a healthy state.
* **Node and File Share Majority**. Each node plus a designated file share (a file share witness) that the administrator creates can vote, regardless of whether the nodes and file share are available and in communication. The cluster functions only with a majority of the votes, that is, with more than half the votes. This mode makes sense in a cluster environment with an even number of nodes. It's similar to the Node and Disk Majority mode, but it uses a witness file share instead of a witness disk. This mode is easy to implement, but if the file share itself is not highly available, it might become a single point of failure.
* **No Majority: Disk Only**. The cluster has a quorum if one node is available and in communication with a specific disk in the cluster storage. Only the nodes that also are in communication with that disk can join the cluster. We recommend that you do not use this mode.
 

## <a name="fdfee875-6e66-483a-a343-14bbaee33275"></a> Windows Server Failover Clustering on-premises
Figure 1 shows a cluster of two nodes. If the network connection between the nodes fails and both nodes stay up and running, a quorum disk or file share determines which node will continue to provide the cluster's applications and services. The node that has access to the quorum disk or file share is the node that ensures that services continue.

Because this example uses a two-node cluster, we use the Node and File Share Majority quorum mode. The Node and Disk Majority also is a valid option. In a production environment, we recommend that you use a quorum disk. You can use network and storage system technology to make it highly available.

![Figure 1: Example of a Windows Server Failover Clustering configuration for SAP ASCS/SCS in Azure][sap-ha-guide-figure-1000]

_**Figure 1:** Example of a Windows Server Failover Clustering configuration for SAP ASCS/SCS in Azure_

### <a name="be21cf3e-fb01-402b-9955-54fbecf66592"></a> Shared storage
Figure 1 also shows a two-node shared storage cluster. In an on-premises shared storage cluster, all nodes in the cluster detect shared storage. A locking mechanism protects the data from corruption. All nodes can detect if another node fails. If one node fails, the remaining node takes ownership of the storage resources and ensures the availability of services.

> [!NOTE]
> You don't need shared disks for high availability with some DBMS applications, like with SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In that case, the Windows cluster configuration doesn't need a shared disk.
>
>

### <a name="ff7a9a06-2bc5-4b20-860a-46cdb44669cd"></a> Networking and name resolution
Client computers reach the cluster over a virtual IP address and a virtual host name that the DNS server provides. The on-premises nodes and the DNS server can handle multiple IP addresses.

In a typical setup, you use two or more network connections:

* A dedicated connection to the storage
* A cluster-internal network connection for the heartbeat
* A public network that clients use to connect to the cluster

## <a name="2ddba413-a7f5-4e4e-9a51-87908879c10a"></a> Windows Server Failover Clustering in Azure
Compared to bare metal or private cloud deployments, Azure Virtual Machines requires additional steps to configure Windows Server Failover Clustering. When you build a shared cluster disk, you need to set several IP addresses and virtual host names for the SAP ASCS/SCS instance.

In this article, we discuss key concepts and the additional steps required to build an SAP high-availability central services cluster in Azure. We show you how to set up the third-party tool SIOS DataKeeper, and how to configure the Azure internal load balancer. You can use these tools to create a Windows failover cluster with a file share witness in Azure.

![Figure 2: Windows Server Failover Clustering configuration in Azure without a shared disk][sap-ha-guide-figure-1001]

_**Figure 2:** Windows Server Failover Clustering configuration in Azure without a shared disk_

### <a name="1a464091-922b-48d7-9d08-7cecf757f341"></a> Shared disk in Azure with SIOS DataKeeper
You need cluster shared storage for a high-availability SAP ASCS/SCS instance. As of September 2016, Azure doesn't offer shared storage that you can use to create a shared storage cluster. You can use third-party software SIOS DataKeeper Cluster Edition to create a mirrored storage that simulates cluster shared storage. The SIOS solution provides real-time synchronous data replication. This is how you can create a shared disk resource for a cluster:

1. Attach an additional disk to each of the virtual machines (VMs) in a Windows cluster configuration.
2. Run SIOS DataKeeper Cluster Edition on both virtual machine nodes.
3. Configure SIOS DataKeeper Cluster Edition so that it mirrors the content of the additional disk attached volume from the source virtual machine to the additional disk attached volume of the target virtual machine. SIOS DataKeeper abstracts the source and target local volumes, and then presents them to Windows Server Failover Clustering as one shared disk.

Get more information about [SIOS DataKeeper](https://us.sios.com/products/datakeeper-cluster/).

![Figure 3: Windows Server Failover Clustering configuration in Azure with SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 3:** Windows Server Failover Clustering configuration in Azure with SIOS DataKeeper_

> [!NOTE]
> You don't need shared disks for high availability with some DBMS products, like SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In this case, the Windows cluster configuration doesn't need a shared disk.
>
>

### <a name="44641e18-a94e-431f-95ff-303ab65e0bcb"></a> Name resolution in Azure
The Azure cloud platform doesn't offer the option to configure virtual IP addresses, such as floating IP addresses. You need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud.
Azure has an internal load balancer in the Azure Load Balancer service. With the internal load balancer, clients reach the cluster over the cluster virtual IP address.
You need to deploy the internal load balancer in the resource group that contains the cluster nodes. Then, configure all necessary port forwarding rules with the probe ports of the internal load balancer.
The clients can connect via the virtual host name. The DNS server resolves the cluster IP address, and the internal load balancer handles port forwarding to the active node of the cluster.

## <a name="2e3fec50-241e-441b-8708-0b1864f66dfa"></a> SAP NetWeaver high availability in Azure Infrastructure-as-a-Service (IaaS)
To achieve SAP application high availability, such as for SAP software components, you need to protect the following components:

* SAP Application Server instance
* SAP ASCS/SCS instance
* DBMS server

For more information about protecting SAP components in high-availability scenarios, see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide-11].

### <a name="93faa747-907e-440a-b00a-1ae0a89b1c0e"></a> High-availability SAP Application Server
You usually don't need a specific high-availability solution for the SAP Application Server and dialog instances. You achieve high availability by redundancy, and you'll configure multiple dialog instances in different instances of Azure Virtual Machines. You should have at least two SAP application instances installed in two instances of Azure Virtual Machines.

![Figure 4: High-availability SAP Application Server][sap-ha-guide-figure-2000]

_**Figure 4:** High-availability SAP Application Server_

You must place all virtual machines that host SAP Application Server instances in the same Azure availability set. An Azure availability set ensures that:

* All virtual machines are part of the same upgrade domain. An upgrade domain, for example, makes sure that the virtual machines aren't updated at the same time during planned maintenance downtime.
* All virtual machines are part of the same fault domain. A fault domain, for example, makes sure that virtual machines are deployed so that no single point of failure affects the availability of all virtual machines.

Learn more about how to [manage the availability of virtual machines][virtual-machines-manage-availability].

Unmanaged disk only: Because the Azure storage account is a potential single point of failure, it's important to have at least two Azure storage accounts, in which at least two virtual machines are distributed. In an ideal setup, the disks of each virtual machine that is running an SAP dialog instance would be deployed in a different storage account.

### <a name="f559c285-ee68-4eec-add1-f60fe7b978db"></a> High-availability SAP ASCS/SCS instance
Figure 5 is an example of a high-availability SAP ASCS/SCS instance.

![Figure 5: High-availability SAP ASCS/SCS instance][sap-ha-guide-figure-2001]

_**Figure 5:** High-availability SAP ASCS/SCS instance_

#### <a name="b5b1fd0b-1db4-4d49-9162-de07a0132a51"></a> SAP ASCS/SCS instance high availability with Windows Server Failover Clustering in Azure
Compared to bare metal or private cloud deployments, Azure Virtual Machines requires additional steps to configure Windows Server Failover Clustering. To build a Windows failover cluster, you need a shared cluster disk, several IP addresses, several virtual host names, and an Azure internal load balancer for clustering an SAP ASCS/SCS instance. We discuss this in more detail later in the article.

![Figure 6: Windows Server Failover Clustering for an SAP ASCS/SCS configuration in Azure by using SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 6:** Windows Server Failover Clustering for an SAP ASCS/SCS configuration in Azure with SIOS DataKeeper_

### <a name="ddd878a0-9c2f-4b8e-8968-26ce60be1027"></a>High-availability DBMS instance
The DBMS also is a single point of contact in an SAP system. You need to protect it by using a high-availability solution. Figure 7 shows a SQL Server Always On high-availability solution in Azure, with Windows Server Failover Clustering and the Azure internal load balancer. SQL Server Always On replicates DBMS data and log files by using its own DBMS replication. In this case, you don't need cluster shared disks, which simplifies the entire setup.

![Figure 7: Example of a high-availability SAP DBMS, with SQL Server Always On][sap-ha-guide-figure-2003]

_**Figure 7:** Example of a high-availability SAP DBMS, with SQL Server Always On_

For more information about clustering SQL Server in Azure by using the Azure Resource Manager deployment model, see these articles:

* [Configure Always On availability group in Azure Virtual Machines manually by using Resource Manager][virtual-machines-windows-portal-sql-alwayson-availability-groups-manual]
* [Configure an Azure internal load balancer for an Always On availability group in Azure][virtual-machines-windows-portal-sql-alwayson-int-listener]

## <a name="045252ed-0277-4fc8-8f46-c5a29694a816"></a> End-to-end high-availability deployment scenarios

### Deployment scenario using Architectural Template 1

Figure 8 shows an example of an SAP NetWeaver high-availability architecture in Azure for **one** SAP system. This scenario is set up as follows:

- One dedicated cluster is used for the SAP ASCS/SCS instance.
- One dedicated cluster is used for the DBMS instance.
- SAP Application Server instances are deployed in their own dedicated VMs.

![Figure 8: SAP high-availability Architectural Template 1, with dedicated cluster for ASCS/SCS and DBMS][sap-ha-guide-figure-2004]

_**Figure 8:** SAP high-availability Architectural Template 1, dedicated clusters for ASCS/SCS and DBMS_

### Deployment scenario using Architectural Template 2

Figure 9 shows an example of an SAP NetWeaver high-availability architecture in Azure for **one** SAP system. This scenario is set up as follows:

- One dedicated cluster is used for **both** the SAP ASCS/SCS instance and the DBMS.
- SAP Application Server instances are deployed in own dedicated VMs.

![Figure 9: SAP high-availability Architectural Template 2, with a dedicated cluster for ASCS/SCS and a dedicated cluster for DBMS][sap-ha-guide-figure-2005]

_**Figure 9:** SAP high-availability Architectural Template 2, with a dedicated cluster for ASCS/SCS and a dedicated cluster for DBMS_

### Deployment scenario using Architectural Template 3

Figure 10 shows an example of an SAP NetWeaver high-availability architecture in Azure for **two** SAP systems, with &lt;SID1&gt; and &lt;SID2&gt;. This scenario is set up as follows:

- One dedicated cluster is used for **both** the SAP ASCS/SCS SID1 instance *and* the SAP ASCS/SCS SID2 instance (one cluster).
- One dedicated cluster is used for DBMS SID1, and another dedicated cluster is used for DBMS SID2 (two clusters).
- SAP Application Server instances for the SAP system SID1 have their own dedicated VMs.
- SAP Application Server instances for the SAP system SID2 have their own dedicated VMs.

![Figure 10: SAP high-availability Architectural Template 3, with a dedicated cluster for different ASCS/SCS instances][sap-ha-guide-figure-6003]

_**Figure 10:** SAP high-availability Architectural Template 3, with a dedicated cluster for different ASCS/SCS instances_

## <a name="78092dbe-165b-454c-92f5-4972bdbef9bf"></a> Prepare the infrastructure

### Prepare the infrastructure for Architectural Template 1
Azure Resource Manager templates for SAP help simplify deployment of required resources.

The three-tier templates in Azure Resource Manager also support high-availability scenarios, such as in Architectural Template 1, which has two clusters. Each cluster is an SAP single point of failure for SAP ASCS/SCS and DBMS.

Here's where you can get Azure Resource Manager templates for the example scenario we describe in this article:

* [Azure Marketplace image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image)  
* [Azure Marketplace image using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-md)  
* [Custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image)
* [Custom image using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image-md)

To prepare the infrastructure for Architectural Template 1:

- In the Azure portal, on the **Parameters** blade, in the **SYSTEMAVAILABILITY** box, select **HA**.

  ![Figure 11: Set SAP high-availability Azure Resource Manager parameters][sap-ha-guide-figure-3000]

_**Figure 11:** Set SAP high-availability Azure Resource Manager parameters_


  The templates create:

  * **Virtual machines**:
    * SAP Application Server virtual machines: <*SAPSystemSID*>-di-<*Number*>
    * ASCS/SCS cluster virtual machines: <*SAPSystemSID*>-ascs-<*Number*>
    * DBMS cluster: <*SAPSystemSID*>-db-<*Number*>

  * **Network cards for all virtual machines, with associated IP addresses**:
    * <*SAPSystemSID*>-nic-di-<*Number*>
    * <*SAPSystemSID*>-nic-ascs-<*Number*>
    * <*SAPSystemSID*>-nic-db-<*Number*>

  * **Azure storage accounts (unmanaged disks only)**

  * **Availability groups** for:
    * SAP Application Server virtual machines: <*SAPSystemSID*>-avset-di
    * SAP ASCS/SCS cluster virtual machines: <*SAPSystemSID*>-avset-ascs
    * DBMS cluster virtual machines: <*SAPSystemSID*>-avset-db

  * **Azure internal load balancer**:
    * With all ports for the ASCS/SCS instance and IP address <*SAPSystemSID*>-lb-ascs
    * With all ports for the SQL Server DBMS and IP address <*SAPSystemSID*>-lb-db

  * **Network security group**: <*SAPSystemSID*>-nsg-ascs-0  
    * With an open external Remote Desktop Protocol (RDP) port to the <*SAPSystemSID*>-ascs-0 virtual machine

> [!NOTE]
> All IP addresses of the network cards and Azure internal load balancers are **dynamic** by default. Change them to **static** IP addresses. We describe how to do this later in the article.
>
>

### <a name="c87a8d3f-b1dc-4d2f-b23c-da4b72977489"></a> Deploy virtual machines with corporate network connectivity (cross-premises) to use in production
For production SAP systems, deploy Azure virtual machines with [corporate network connectivity (cross-premises)][planning-guide-2.2] by using Azure Site-to-Site VPN or Azure ExpressRoute.

> [!NOTE]
> You can use your Azure Virtual Network instance. The virtual network and subnet have already been created and prepared.
>
>

1. In the Azure portal, on the **Parameters** blade, in the **NEWOREXISTINGSUBNET** box, select **existing**.
2. In the **SUBNETID** box, add the full string of your prepared Azure network SubnetID where you plan to deploy your Azure virtual machines.
3. To get a list of all Azure network subnets, run this PowerShell command:

   ```powershell
   (Get-AzVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets
   ```

   The **ID** field shows the **SUBNETID**.
4. To get a list of all **SUBNETID** values, run this PowerShell command:

   ```powershell
   (Get-AzVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets.Id
   ```

   The **SUBNETID** looks like this:

   ```
   /subscriptions/<SubscriptionId>/resourceGroups/<VPNName>/providers/Microsoft.Network/virtualNetworks/azureVnet/subnets/<SubnetName>
   ```

### <a name="7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310"></a> Deploy cloud-only SAP instances for test and demo
You can deploy your high-availability SAP system in a cloud-only deployment model. This kind of deployment primarily is useful for demo and test use cases. It's not suited for production use cases.

- In the Azure portal, on the **Parameters** blade, in the **NEWOREXISTINGSUBNET** box, select **new**. Leave the **SUBNETID** field empty.

  The SAP Azure Resource Manager template automatically creates the Azure virtual network and subnet.

> [!NOTE]
> You also need to deploy at least one dedicated virtual machine for Active Directory and DNS in the same Azure Virtual Network instance. The template doesn't create these virtual machines.
>
>


### Prepare the infrastructure for Architectural Template 2

You can use this Azure Resource Manager template for SAP to help simplify deployment of required infrastructure resources for SAP Architectural Template 2.

Here's where you can get Azure Resource Manager templates for this deployment scenario:

* [Azure Marketplace image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-converged)  
* [Azure Marketplace image using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-converged-md)  
* [Custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image-converged)
* [Custom image using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image-converged-md)


### Prepare the infrastructure for Architectural Template 3

You can prepare the infrastructure and configure SAP for **multi-SID**. For example, you can add an additional SAP ASCS/SCS instance into an *existing* cluster configuration. For more information, see [Configure an additional SAP ASCS/SCS instance into an existing cluster configuration to create an SAP multi-SID configuration in Azure Resource Manager][sap-ha-multi-sid-guide].

If you want to create a new multi-SID cluster, you can use the multi-SID [quickstart templates on GitHub](https://github.com/Azure/azure-quickstart-templates).
To create a new multi-SID cluster, you need to deploy the following three templates:

* [ASCS/SCS template](#ASCS-SCS-template)
* [Database template](#database-template)
* [Application servers template](#application-servers-template)

The following sections have more details about the templates and the parameters you need to provide in the templates.

#### <a name="ASCS-SCS-template"></a> ASCS/SCS template

The ASCS/SCS template deploys two virtual machines that you can use to create a Windows Server failover cluster that hosts multiple ASCS/SCS instances.

To set up the ASCS/SCS multi-SID template, in the [ASCS/SCS multi-SID template][sap-templates-3-tier-multisid-xscs-marketplace-image] or [ASCS/SCS multi-SID template using Managed Disks][sap-templates-3-tier-multisid-xscs-marketplace-image-md], enter values for the following parameters:

  - **Resource Prefix**.  Set the resource prefix, which is used to prefix all resources that are created during the deployment. Because the resources do not belong to only one SAP system, the prefix of the resource is not the SID of one SAP system.  The prefix must be between **three and six characters**.
  - **Stack Type**. Select the stack type of the SAP system. Depending on the stack type, Azure Load Balancer has one (ABAP or Java only) or two (ABAP+Java) private IP addresses per SAP system.
  -  **OS Type**. Select the operating system of the virtual machines.
  -  **SAP System Count**. Select the number of SAP systems you want to install in this cluster.
  -  **System Availability**. Select **HA**.
  -  **Admin Username and Admin Password**. Create a new user that can be used to sign in to the machine.
  -  **New Or Existing Subnet**. Set whether a new virtual network and subnet should be created, or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select **existing**.
  -  **Subnet Id**. If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
   /subscriptions/<*subscription id*>/resourceGroups/<*resource group name*>/providers/Microsoft.Network/virtualNetworks/<*virtual network name*>/subnets/<*subnet name*>

The template deploys one Azure Load Balancer instance, which supports multiple SAP systems.

- The ASCS instances are configured for instance number 00, 10, 20...
- The SCS instances are configured for instance number 01, 11, 21...
- The ASCS Enqueue Replication Server (ERS) (Linux only) instances are configured for instance number 02, 12, 22...
- The SCS ERS (Linux only) instances are configured for instance number 03, 13, 23...

The load balancer contains 1 (2 for Linux) VIP(s), 1x VIP for ASCS/SCS and 1x VIP for ERS (Linux only).

The following list contains all load balancing rules (where x is the number of the SAP system, for example, 1, 2, 3...):
- Windows-specific ports for every SAP system: 445, 5985
- ASCS ports (instance number x0): 32x0, 36x0, 39x0, 81x0, 5x013, 5x014, 5x016
- SCS ports (instance number x1): 32x1, 33x1, 39x1, 81x1, 5x113, 5x114, 5x116
- ASCS ERS ports on Linux (instance number x2): 33x2, 5x213, 5x214, 5x216
- SCS ERS ports on Linux (instance number x3): 33x3, 5x313, 5x314, 5x316

The load balancer is configured to use the following probe ports (where x is the number of the SAP system, for example, 1, 2, 3...):
- ASCS/SCS internal load balancer probe port: 620x0
- ERS internal load balancer probe port (Linux only): 621x2

#### <a name="database-template"></a> Database template

The database template deploys one or two virtual machines that you can use to install the relational database management system (RDBMS) for one SAP system. For example, if you deploy an ASCS/SCS template for five SAP systems, you need to deploy this template five times.

To set up the database multi-SID template, in the [database multi-SID template][sap-templates-3-tier-multisid-db-marketplace-image] or [database multi-SID template using Managed Disks][sap-templates-3-tier-multisid-db-marketplace-image-md], enter values for the following parameters:

- **Sap System Id**. Enter the SAP system ID of the SAP system you want to install. The ID will be used as a prefix for the resources that are deployed.
- **Os Type**. Select the operating system of the virtual machines.
- **Dbtype**. Select the type of the database you want to install on the cluster. Select **SQL** if you want to install Microsoft SQL Server. Select **HANA** if you plan to install SAP HANA on the virtual machines. Make sure to select the correct operating system type: select **Windows** for SQL, and select a Linux distribution for HANA. The Azure Load Balancer that is connected to the virtual machines will be configured to support the selected database type:
  * **SQL**. The load balancer will load-balance port 1433. Make sure to use this port for your SQL Server Always On setup.
  * **HANA**. The load balancer will load-balance ports 35015 and 35017. Make sure to install SAP HANA with instance number **50**.
  The load balancer will use probe port 62550.
- **Sap System Size**. Set the number of SAPS the new system will provide. If you are not sure how many SAPS the system will require, ask your SAP Technology Partner or System Integrator.
- **System Availability**. Select **HA**.
- **Admin Username and Admin Password**. Create a new user that can be used to sign in to the machine.
- **Subnet Id**. Enter the ID of the subnet that you used during the deployment of the ASCS/SCS template, or the ID of the subnet that was created as part of the ASCS/SCS template deployment.

#### <a name="application-servers-template"></a> Application servers template

The application servers template deploys two or more virtual machines that can be used as SAP Application Server instances for one SAP system. For example, if you deploy an ASCS/SCS template for five SAP systems, you need to deploy this template five times.

To set up the application servers multi-SID template, in the [application servers multi-SID template][sap-templates-3-tier-multisid-apps-marketplace-image] or [application servers multi-SID template using Managed Disks][sap-templates-3-tier-multisid-apps-marketplace-image-md], enter values for the following parameters:

  -  **Sap System Id**. Enter the SAP system ID of the SAP system you want to install. The ID will be used as a prefix for the resources that are deployed.
  -  **Os Type**. Select the operating system of the virtual machines.
  -  **Sap System Size**. The number of SAPS the new system will provide. If you are not sure how many SAPS the system will require, ask your SAP Technology Partner or System Integrator.
  -  **System Availability**. Select **HA**.
  -  **Admin Username and Admin Password**. Create a new user that can be used to sign in to the machine.
  -  **Subnet Id**. Enter the ID of the subnet that you used during the deployment of the ASCS/SCS template, or the ID of the subnet that was created as part of the ASCS/SCS template deployment.


### <a name="47d5300a-a830-41d4-83dd-1a0d1ffdbe6a"></a> Azure virtual network
In our example, the address space of the Azure virtual network is 10.0.0.0/16. There is one subnet called **Subnet**, with an address range of 10.0.0.0/24. All virtual machines and internal load balancers are deployed in this virtual network.

> [!IMPORTANT]
> Don't make any changes to the network settings inside the guest operating system. This includes IP addresses, DNS servers, and subnet. Configure all your network settings in Azure. The Dynamic Host Configuration Protocol (DHCP) service propagates your settings.
>
>

### <a name="b22d7b3b-4343-40ff-a319-097e13f62f9e"></a> DNS IP addresses

To set the required DNS IP addresses, do the following steps.

1. In the Azure portal, on the **DNS servers** blade, make sure that your virtual network **DNS servers** option is set to **Custom DNS**.
2. Select your settings based on the type of network you have. For more information, see the following resources:
   * [Corporate network connectivity (cross-premises)][planning-guide-2.2]: Add the IP addresses of the on-premises DNS servers.  
   You can extend on-premises DNS servers to the virtual machines that are running in Azure. In that scenario, you can add the IP addresses of the Azure virtual machines on which you run the DNS service.
   * For VM deployments isolated in Azure: Deploy an additional virtual machine in the same Virtual Network instance that serves as a DNS server. Add the IP addresses of the Azure virtual machines that you've set up to run DNS service.

   ![Figure 12: Configure DNS servers for Azure Virtual Network][sap-ha-guide-figure-3001]

   _**Figure 12:** Configure DNS servers for Azure Virtual Network_

   > [!NOTE]
   > If you change the IP addresses of the DNS servers, you need to restart the Azure virtual machines to apply the change and propagate the new DNS servers.
   >
   >

In our example, the DNS service is installed and configured on these Windows virtual machines:

| Virtual machine role | Virtual machine host name | Network card name | Static IP address |
| --- | --- | --- | --- |
| First DNS server |domcontr-0 |pr1-nic-domcontr-0 |10.0.0.10 |
| Second DNS server |domcontr-1 |pr1-nic-domcontr-1 |10.0.0.11 |

### <a name="9fbd43c0-5850-4965-9726-2a921d85d73f"></a> Host names and static IP addresses for the SAP ASCS/SCS clustered instance and DBMS clustered instance

For on-premises deployment, you need these reserved host names and IP addresses:

| Virtual host name role | Virtual host name | Virtual static IP address |
| --- | --- | --- |
| SAP ASCS/SCS first cluster virtual host name (for cluster management) |pr1-ascs-vir |10.0.0.42 |
| SAP ASCS/SCS instance virtual host name |pr1-ascs-sap |10.0.0.43 |
| SAP DBMS second cluster virtual host name (cluster management) |pr1-dbms-vir |10.0.0.32 |

When you create the cluster, create the virtual host names **pr1-ascs-vir** and **pr1-dbms-vir** and the associated IP addresses that manage the cluster itself. For information about how to do this, see [Collect cluster nodes in a cluster configuration][sap-ha-guide-8.12.1].

You can manually create the other two virtual host names, **pr1-ascs-sap** and **pr1-dbms-sap**, and the associated IP addresses, on the DNS server. The clustered SAP ASCS/SCS instance and the clustered DBMS instance use these resources. For information about how to do this, see [Create a virtual host name for a clustered SAP ASCS/SCS instance][sap-ha-guide-9.1.1].

### <a name="84c019fe-8c58-4dac-9e54-173efd4b2c30"></a> Set static IP addresses for the SAP virtual machines
After you deploy the virtual machines to use in your cluster, you need to set static IP addresses for all virtual machines. Do this in the Azure Virtual Network configuration, and not in the guest operating system.

1. In the Azure portal, select **Resource Group** > **Network Card** > **Settings** > **IP Address**.
2. On the **IP addresses** blade, under **Assignment**, select **Static**. In the **IP address** box, enter the IP address that you want to use.

   > [!NOTE]
   > If you change the IP address of the network card, you need to restart the Azure virtual machines to apply the change.  
   >
   >

   ![Figure 13: Set static IP addresses for the network card of each virtual machine][sap-ha-guide-figure-3002]

   _**Figure 13:** Set static IP addresses for the network card of each virtual machine_

   Repeat this step for all network interfaces, that is, for all virtual machines, including virtual machines that you want to use for your Active Directory/DNS service.

In our example, we have these virtual machines and static IP addresses:

| Virtual machine role | Virtual machine host name | Network card name | Static IP address |
| --- | --- | --- | --- |
| First SAP Application Server instance |pr1-di-0 |pr1-nic-di-0 |10.0.0.50 |
| Second SAP Application Server instance |pr1-di-1 |pr1-nic-di-1 |10.0.0.51 |
| ... |... |... |... |
| Last SAP Application Server instance |pr1-di-5 |pr1-nic-di-5 |10.0.0.55 |
| First cluster node for ASCS/SCS instance |pr1-ascs-0 |pr1-nic-ascs-0 |10.0.0.40 |
| Second cluster node for ASCS/SCS instance |pr1-ascs-1 |pr1-nic-ascs-1 |10.0.0.41 |
| First cluster node for DBMS instance |pr1-db-0 |pr1-nic-db-0 |10.0.0.30 |
| Second cluster node for DBMS instance |pr1-db-1 |pr1-nic-db-1 |10.0.0.31 |

### <a name="7a8f3e9b-0624-4051-9e41-b73fff816a9e"></a> Set a static IP address for the Azure internal load balancer

The SAP Azure Resource Manager template creates an Azure internal load balancer that is used for the SAP ASCS/SCS instance cluster and the DBMS cluster.

> [!IMPORTANT]
> The IP address of the virtual host name of the SAP ASCS/SCS is the same as the IP address of the SAP ASCS/SCS internal load balancer: **pr1-lb-ascs**.
> The IP address of the virtual name of the DBMS is the same as the IP address of the DBMS internal load balancer: **pr1-lb-dbms**.
>
>

To set a static IP address for the Azure internal load balancer:

1. The initial deployment sets the internal load balancer IP address to **Dynamic**. In the Azure portal, on the **IP addresses** blade, under **Assignment**, select **Static**.
2. Set the IP address of the internal load balancer **pr1-lb-ascs** to the IP address of the virtual host name of the SAP ASCS/SCS instance.
3. Set the IP address of the internal load balancer **pr1-lb-dbms** to the IP address of the virtual host name of the DBMS instance.

   ![Figure 14: Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance][sap-ha-guide-figure-3003]

   _**Figure 14:** Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance_

In our example, we have two Azure internal load balancers that have these static IP addresses:

| Azure internal load balancer role | Azure internal load balancer name | Static IP address |
| --- | --- | --- |
| SAP ASCS/SCS instance internal load balancer |pr1-lb-ascs |10.0.0.43 |
| SAP DBMS internal load balancer |pr1-lb-dbms |10.0.0.33 |


### <a name="f19bd997-154d-4583-a46e-7f5a69d0153c"></a> Default ASCS/SCS load balancing rules for the Azure internal load balancer

The SAP Azure Resource Manager template creates the ports you need:
* An ABAP ASCS instance, with the default instance number **00**
* A Java SCS instance, with the default instance number **01**

When you install your SAP ASCS/SCS instance, you must use the default instance number **00** for your ABAP ASCS instance and the default instance number **01** for your Java SCS instance.

Next, create required internal load balancing endpoints for the SAP NetWeaver ports.

To create required internal load balancing endpoints, first, create these load balancing endpoints for the SAP NetWeaver ABAP ASCS ports:

| Service/load balancing rule name | Default port numbers | Concrete ports for (ASCS instance with instance number 00) (ERS with 10) |
| --- | --- | --- |
| Enqueue Server / *lbrule3200* |32<*InstanceNumber*> |3200 |
| ABAP Message Server / *lbrule3600* |36<*InstanceNumber*> |3600 |
| Internal ABAP Message / *lbrule3900* |39<*InstanceNumber*> |3900 |
| Message Server HTTP / *Lbrule8100* |81<*InstanceNumber*> |8100 |
| SAP Start Service ASCS HTTP / *Lbrule50013* |5<*InstanceNumber*>13 |50013 |
| SAP Start Service ASCS HTTPS / *Lbrule50014* |5<*InstanceNumber*>14 |50014 |
| Enqueue Replication / *Lbrule50016* |5<*InstanceNumber*>16 |50016 |
| SAP Start Service ERS HTTP *Lbrule51013* |5<*InstanceNumber*>13 |51013 |
| SAP Start Service ERS HTTP *Lbrule51014* |5<*InstanceNumber*>14 |51014 |
| Win RM *Lbrule5985* | |5985 |
| File Share *Lbrule445* | |445 |

_**Table 1:** Port numbers of the SAP NetWeaver ABAP ASCS instances_

Then, create these load balancing endpoints for the SAP NetWeaver Java SCS ports:

| Service/load balancing rule name | Default port numbers | Concrete ports for (SCS instance with instance number 01) (ERS with 11) |
| --- | --- | --- |
| Enqueue Server / *lbrule3201* |32<*InstanceNumber*> |3201 |
| Gateway Server / *lbrule3301* |33<*InstanceNumber*> |3301 |
| Java Message Server / *lbrule3900* |39<*InstanceNumber*> |3901 |
| Message Server HTTP / *Lbrule8101* |81<*InstanceNumber*> |8101 |
| SAP Start Service SCS HTTP / *Lbrule50113* |5<*InstanceNumber*>13 |50113 |
| SAP Start Service SCS HTTPS / *Lbrule50114* |5<*InstanceNumber*>14 |50114 |
| Enqueue Replication / *Lbrule50116* |5<*InstanceNumber*>16 |50116 |
| SAP Start Service ERS HTTP *Lbrule51113* |5<*InstanceNumber*>13 |51113 |
| SAP Start Service ERS HTTP *Lbrule51114* |5<*InstanceNumber*>14 |51114 |
| Win RM *Lbrule5985* | |5985 |
| File Share *Lbrule445* | |445 |

_**Table 2:** Port numbers of the SAP NetWeaver Java SCS instances_

![Figure 15: Default ASCS/SCS load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3004]

_**Figure 15:** Default ASCS/SCS load balancing rules for the Azure internal load balancer_

Set the IP address of the load balancer **pr1-lb-dbms** to the IP address of the virtual host name of the DBMS instance.

### <a name="fe0bd8b5-2b43-45e3-8295-80bee5415716"></a> Change the ASCS/SCS default load balancing rules for the Azure internal load balancer

If you want to use different numbers for the SAP ASCS or SCS instances, you must change the names and values of their ports from default values.

1. In the Azure portal, select **<*SID*>-lb-ascs load balancer** > **Load Balancing Rules**.
2. For all load balancing rules that belong to the SAP ASCS or SCS instance, change these values:

   * Name
   * Port
   * Back-end port

   For example, if you want to change the default ASCS instance number from 00 to 31, you need to make the changes for all ports listed in Table 1.

   Here's an example of an update for port *lbrule3200*.

   ![Figure 16: Change the ASCS/SCS default load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3005]

   _**Figure 16:** Change the ASCS/SCS default load balancing rules for the Azure internal load balancer_

### <a name="e69e9a34-4601-47a3-a41c-d2e11c626c0c"></a> Add Windows virtual machines to the domain

After you assign a static IP address to the virtual machines, add the virtual machines to the domain.

![Figure 17: Add a virtual machine to a domain][sap-ha-guide-figure-3006]

_**Figure 17:** Add a virtual machine to a domain_

### <a name="661035b2-4d0f-4d31-86f8-dc0a50d78158"></a> Add registry entries on both cluster nodes of the SAP ASCS/SCS instance

Azure Load Balancer has an internal load balancer that closes connections when the connections are idle for a set period of time (an idle timeout). SAP work processes in dialog instances open connections to the SAP enqueue process as soon as the first enqueue/dequeue request needs to be sent. These connections usually remain established until the work process or the enqueue process restarts. However, if the connection is idle for a set period of time, the Azure internal load balancer closes the connections. This isn't a problem because the SAP work process reestablishes the connection to the enqueue process if it no longer exists. These activities are documented in the developer traces of SAP processes, but they create a large amount of extra content in those traces. It's a good idea to change the TCP/IP `KeepAliveTime` and `KeepAliveInterval` on both cluster nodes. Combine these changes in the TCP/IP parameters with SAP profile parameters, described later in the article.

To add registry entries on both cluster nodes of the SAP ASCS/SCS instance, first, add these Windows registry entries on both Windows cluster nodes for SAP ASCS/SCS:

| Path | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |
| --- | --- |
| Variable name |`KeepAliveTime` |
| Variable type |REG_DWORD (Decimal) |
| Value |120000 |
| Link to documentation |[https://technet.microsoft.com/library/cc957549.aspx](https://technet.microsoft.com/library/cc957549.aspx) |

_**Table 3:** Change the first TCP/IP parameter_

Then, add this Windows registry entries on both Windows cluster nodes for SAP ASCS/SCS:

| Path | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |
| --- | --- |
| Variable name |`KeepAliveInterval` |
| Variable type |REG_DWORD (Decimal) |
| Value |120000 |
| Link to documentation |[https://technet.microsoft.com/library/cc957548.aspx](https://technet.microsoft.com/library/cc957548.aspx) |

_**Table 4:** Change the second TCP/IP parameter_

**To apply the changes, restart both cluster nodes**.

### <a name="0d67f090-7928-43e0-8772-5ccbf8f59aab"></a> Set up a Windows Server Failover Clustering cluster for an SAP ASCS/SCS instance

Setting up a Windows Server Failover Clustering cluster for an SAP ASCS/SCS instance involves these tasks:

- Collecting the cluster nodes in a cluster configuration
- Configuring a cluster file share witness

#### <a name="5eecb071-c703-4ccc-ba6d-fe9c6ded9d79"></a> Collect the cluster nodes in a cluster configuration

1. In the Add Role and Features Wizard, add failover clustering to both cluster nodes.
2. Set up the failover cluster by using Failover Cluster Manager. In Failover Cluster Manager, select **Create Cluster**, and then add only the name of the first cluster, node A. Do not add the second node yet; you'll add the second node in a later step.

   ![Figure 18: Add the server or virtual machine name of the first cluster node][sap-ha-guide-figure-3007]

   _**Figure 18:** Add the server or virtual machine name of the first cluster node_

3. Enter the network name (virtual host name) of the cluster.

   ![Figure 19: Enter the cluster name][sap-ha-guide-figure-3008]

   _**Figure 19:** Enter the cluster name_

4. After you've created the cluster, run a cluster validation test.

   ![Figure 20: Run the cluster validation check][sap-ha-guide-figure-3009]

   _**Figure 20:** Run the cluster validation check_

   You can ignore any warnings about disks at this point in the process. You'll add a file share witness and the SIOS shared disks later. At this stage, you don't need to worry about having a quorum.

   ![Figure 21: No quorum disk is found][sap-ha-guide-figure-3010]

   _**Figure 21:** No quorum disk is found_

   ![Figure 22: Core cluster resource needs a new IP address][sap-ha-guide-figure-3011]

   _**Figure 22:** Core cluster resource needs a new IP address_

5. Change the IP address of the core cluster service. The cluster can't start until you change the IP address of the core cluster service, because the IP address of the server points to one of the virtual machine nodes. Do this on the **Properties** page of the core cluster service's IP resource.

   For example, we need to assign an IP address (in our example, **10.0.0.42**) for the cluster virtual host name **pr1-ascs-vir**.

   ![Figure 23: In the Properties dialog box, change the IP address][sap-ha-guide-figure-3012]

   _**Figure 23:** In the **Properties** dialog box, change the IP address_

   ![Figure 24: Assign the IP address that is reserved for the cluster][sap-ha-guide-figure-3013]

   _**Figure 24:** Assign the IP address that is reserved for the cluster_

6. Bring the cluster virtual host name online.

   ![Figure 25: Cluster core service is up and running, and with the correct IP address][sap-ha-guide-figure-3014]

   _**Figure 25:** Cluster core service is up and running, and with the correct IP address_

7. Add the second cluster node.

   Now that the core cluster service is up and running, you can add the second cluster node.

   ![Figure 26: Add the second cluster node][sap-ha-guide-figure-3015]

   _**Figure 26:** Add the second cluster node_

8. Enter a name for the second cluster node host.

   ![Figure 27: Enter the second cluster node host name][sap-ha-guide-figure-3016]

   _**Figure 27:** Enter the second cluster node host name_

   > [!IMPORTANT]
   > Be sure that the **Add all eligible storage to the cluster** check box is **NOT** selected.  
   >
   >

   ![Figure 28: Do not select the check box][sap-ha-guide-figure-3017]

   _**Figure 28:** Do **not** select the check box_

   You can ignore warnings about quorum and disks. You'll set the quorum and share the disk later, as described in [Installing SIOS DataKeeper Cluster Edition for SAP ASCS/SCS cluster share disk][sap-ha-guide-8.12.3].

   ![Figure 29: Ignore warnings about the disk quorum][sap-ha-guide-figure-3018]

   _**Figure 29:** Ignore warnings about the disk quorum_


#### <a name="e49a4529-50c9-4dcf-bde7-15a0c21d21ca"></a> Configure a cluster file share witness

Configuring a cluster file share witness involves these tasks:

- Creating a file share
- Setting the file share witness quorum in Failover Cluster Manager

##### <a name="06260b30-d697-4c4d-b1c9-d22c0bd64855"></a> Create a file share

1. Select a file share witness instead of a quorum disk. SIOS DataKeeper supports this option.

   In the examples in this article, the file share witness is on the Active Directory/DNS server that is running in Azure. The file share witness is called **domcontr-0**. Because you would have configured a VPN connection to Azure (via Site-to-Site VPN or Azure ExpressRoute), your Active Directory/DNS service is on-premises and isn't suitable to run a file share witness.

   > [!NOTE]
   > If your Active Directory/DNS service runs only on-premises, don't configure your file share witness on the Active Directory/DNS Windows operating system that is running on-premises. Network latency between cluster nodes running in Azure and Active Directory/DNS on-premises might be too large and cause connectivity issues. Be sure to configure the file share witness on an Azure virtual machine that is running close to the cluster node.  
   >
   >

   The quorum drive needs at least 1,024 MB of free space. We recommend 2,048 MB of free space for the quorum drive.

2. Add the cluster name object.

   ![Figure 30: Assign the permissions on the share for the cluster name object][sap-ha-guide-figure-3019]

   _**Figure 30:** Assign the permissions on the share for the cluster name object_

   Be sure that the permissions include the authority to change data in the share for the cluster name object (in our example, **pr1-ascs-vir$**).

3. To add the cluster name object to the list, select **Add**. Change the filter to check for computer objects, in addition to those shown in Figure 31.

   ![Figure 31: Change the Object Types to include computers][sap-ha-guide-figure-3020]

   _**Figure 31:** Change the Object Types to include computers_

   ![Figure 32: Select the Computers check box][sap-ha-guide-figure-3021]

   _**Figure 32:** Select the **Computers** check box_

4. Enter the cluster name object as shown in Figure 31. Because the record has already been created, you can change the permissions, as shown in Figure 30.

5. Select the **Security** tab of the share, and then set more detailed permissions for the cluster name object.

   ![Figure 33: Set the security attributes for the cluster name object on the file share quorum][sap-ha-guide-figure-3022]

   _**Figure 33:** Set the security attributes for the cluster name object on the file share quorum_

##### <a name="4c08c387-78a0-46b1-9d27-b497b08cac3d"></a> Set the file share witness quorum in Failover Cluster Manager

1. Open the Configure Quorum Setting Wizard.

   ![Figure 34: Start the Configure Cluster Quorum Setting Wizard][sap-ha-guide-figure-3023]

   _**Figure 34:** Start the Configure Cluster Quorum Setting Wizard_

2. On the **Select Quorum Configuration** page, select **Select the quorum witness**.

   ![Figure 35: Quorum configurations you can choose from][sap-ha-guide-figure-3024]

   _**Figure 35:** Quorum configurations you can choose from_

3. On the **Select Quorum Witness** page, select **Configure a file share witness**.

   ![Figure 36: Select the file share witness][sap-ha-guide-figure-3025]

   _**Figure 36:** Select the file share witness_

4. Enter the UNC path to the file share (in our example, \\domcontr-0\FSW). To see a list of the changes you can make, select **Next**.

   ![Figure 37: Define the file share location for the witness share][sap-ha-guide-figure-3026]

   _**Figure 37:** Define the file share location for the witness share_

5. Select the changes you want, and then select **Next**. You need to successfully reconfigure the cluster configuration as shown in Figure 38.  

   ![Figure 38: Confirmation that you've reconfigured the cluster][sap-ha-guide-figure-3027]

   _**Figure 38:** Confirmation that you've reconfigured the cluster_

After installing the Windows Failover Cluster successfully, changes need to be made to some thresholds to adapt failover detection to conditions in Azure. The parameters to be changed are documented in this blog: https://blogs.msdn.microsoft.com/clustering/2012/11/21/tuning-failover-cluster-network-thresholds/ . Assuming that your two VMs that build the Windows Cluster Configuration for ASCS/SCS are in the same SubNet, the following parameters need to be changed to these values:
- SameSubNetDelay = 2
- SameSubNetThreshold = 15

These settings were tested with customers and provided a good compromise to be resilient enough on the one side. On the other hand those settings were providing fast enough failover in real error conditions on SAP software or node/VM failure. 

### <a name="5c8e5482-841e-45e1-a89d-a05c0907c868"></a> Install SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk

You now have a working Windows Server Failover Clustering configuration in Azure. But, to install an SAP ASCS/SCS instance, you need a shared disk resource. You cannot create the shared disk resources you need in Azure. SIOS DataKeeper Cluster Edition is a third-party solution you can use to create shared disk resources.

Installing SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk involves these tasks:

- Adding the .NET Framework 3.5
- Installing SIOS DataKeeper
- Setting up SIOS DataKeeper

#### <a name="1c2788c3-3648-4e82-9e0d-e058e475e2a3"></a> Add the .NET Framework 3.5
The Microsoft .NET Framework 3.5 isn't automatically activated or installed on Windows Server 2012 R2. Because SIOS DataKeeper requires the .NET Framework to be on all nodes that you install DataKeeper on, you must install the .NET Framework 3.5 on the guest operating system of all virtual machines in the cluster.

There are two ways to add the .NET Framework 3.5:

- Use the Add Roles and Features Wizard in Windows as shown in Figure 39.

  ![Figure 39: Install the .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3028]

  _**Figure 39:** Install the .NET Framework 3.5 by using the Add Roles and Features Wizard_

  ![Figure 40: Installation progress bar when you install the .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3029]

  _**Figure 40:** Installation progress bar when you install the .NET Framework 3.5 by using the Add Roles and Features Wizard_

- Use the command-line tool dism.exe. For this type of installation, you need to access the SxS directory on the Windows installation media. At an elevated command prompt, type:

  ```
  Dism /online /enable-feature /featurename:NetFx3 /All /Source:installation_media_drive:\sources\sxs /LimitAccess
  ```

#### <a name="dd41d5a2-8083-415b-9878-839652812102"></a> Install SIOS DataKeeper

Install SIOS DataKeeper Cluster Edition on each node in the cluster. To create virtual shared storage with SIOS DataKeeper, create a synced mirror and then simulate cluster shared storage.

Before you install the SIOS software, create the domain user **DataKeeperSvc**.

> [!NOTE]
> Add the **DataKeeperSvc** user to the **Local Administrator** group on both cluster nodes.
>
>

To install SIOS DataKeeper:

1. Install the SIOS software on both cluster nodes.

   ![SIOS installer][sap-ha-guide-figure-3030]

   ![Figure 41: First page of the SIOS DataKeeper installation][sap-ha-guide-figure-3031]

   _**Figure 41:** First page of the SIOS DataKeeper installation_

2. In the dialog box shown in Figure 42, select **Yes**.

   ![Figure 42: DataKeeper informs you that a service will be disabled][sap-ha-guide-figure-3032]

   _**Figure 42:** DataKeeper informs you that a service will be disabled_

3. In the dialog box shown in Figure 43, we recommend that you select **Domain or Server account**.

   ![Figure 43: User selection for SIOS DataKeeper][sap-ha-guide-figure-3033]

   _**Figure 43:** User selection for SIOS DataKeeper_

4. Enter the domain account user name and passwords that you created for SIOS DataKeeper.

   ![Figure 44: Enter the domain user name and password for the SIOS DataKeeper installation][sap-ha-guide-figure-3034]

   _**Figure 44:** Enter the domain user name and password for the SIOS DataKeeper installation_

5. Install the license key for your SIOS DataKeeper instance as shown in Figure 45.

   ![Figure 45: Enter your SIOS DataKeeper license key][sap-ha-guide-figure-3035]

   _**Figure 45:** Enter your SIOS DataKeeper license key_

6. When prompted, restart the virtual machine.

#### <a name="d9c1fc8e-8710-4dff-bec2-1f535db7b006"></a> Set up SIOS DataKeeper

After you install SIOS DataKeeper on both nodes, you need to start the configuration. The goal of the configuration is to have synchronous data replication between the additional disks attached to each of the virtual machines.

1. Start the DataKeeper Management and Configuration tool, and then select **Connect Server**. (In Figure 46, this option is circled in red.)

   ![Figure 46: SIOS DataKeeper Management and Configuration tool][sap-ha-guide-figure-3036]

   _**Figure 46:** SIOS DataKeeper Management and Configuration tool_

2. Enter the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and, in a second step, the second node.

   ![Figure 47: Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node][sap-ha-guide-figure-3037]

   _**Figure 47:** Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node_

3. Create the replication job between the two nodes.

   ![Figure 48: Create a replication job][sap-ha-guide-figure-3038]

   _**Figure 48:** Create a replication job_

   A wizard guides you through the process of creating a replication job.
4. Define the name, TCP/IP address, and disk volume of the source node.

   ![Figure 49: Define the name of the replication job][sap-ha-guide-figure-3039]

   _**Figure 49:** Define the name of the replication job_

   ![Figure 50: Define the base data for the node, which should be the current source node][sap-ha-guide-figure-3040]

   _**Figure 50:** Define the base data for the node, which should be the current source node_

5. Define the name, TCP/IP address, and disk volume of the target node.

   ![Figure 51: Define the base data for the node, which should be the current target node][sap-ha-guide-figure-3041]

   _**Figure 51:** Define the base data for the node, which should be the current target node_

6. Define the compression algorithms. In our example, we recommend that you compress the replication stream. Especially in resynchronization situations, the compression of the replication stream dramatically reduces resynchronization time. Note that compression uses the CPU and RAM resources of a virtual machine. As the compression rate increases, so does the volume of CPU resources used. You also can adjust this setting later.

7. Another setting you need to check is whether the replication occurs asynchronously or synchronously. *When you protect SAP ASCS/SCS configurations, you must use synchronous replication*.  

   ![Figure 52: Define replication details][sap-ha-guide-figure-3042]

   _**Figure 52:** Define replication details_

8. Define whether the volume that is replicated by the replication job should be represented to a Windows Server Failover Clustering cluster configuration as a shared disk. For the SAP ASCS/SCS configuration, select **Yes** so that the Windows cluster sees the replicated volume as a shared disk that it can use as a cluster volume.

   ![Figure 53: Select Yes to set the replicated volume as a cluster volume][sap-ha-guide-figure-3043]

   _**Figure 53:** Select **Yes** to set the replicated volume as a cluster volume_

   After the volume is created, the DataKeeper Management and Configuration tool shows that the replication job is active.

   ![Figure 54: DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active][sap-ha-guide-figure-3044]

   _**Figure 54:** DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active_

   Failover Cluster Manager now shows the disk as a DataKeeper disk, as shown in Figure 55.

   ![Figure 55: Failover Cluster Manager shows the disk that DataKeeper replicated][sap-ha-guide-figure-3045]

   _**Figure 55:** Failover Cluster Manager shows the disk that DataKeeper replicated_

## <a name="a06f0b49-8a7a-42bf-8b0d-c12026c5746b"></a> Install the SAP NetWeaver system

We won’t describe the DBMS setup because setups vary depending on the DBMS system you use. However, we assume that high-availability concerns with the DBMS are addressed with the functionalities the different DBMS vendors support for Azure. For example, Always On or database mirroring for SQL Server, and Oracle Data Guard for Oracle databases. In the scenario we use in this article, we didn't add more protection to the DBMS.

There are no special considerations when different DBMS services interact with this kind of clustered SAP ASCS/SCS configuration in Azure.

> [!NOTE]
> The installation procedures of SAP NetWeaver ABAP systems, Java systems, and ABAP+Java systems are almost identical. The most significant difference is that an SAP ABAP system has one ASCS instance. The SAP Java system has one SCS instance. The SAP ABAP+Java system has one ASCS instance and one SCS instance running in the same Microsoft failover cluster group. Any installation differences for each SAP NetWeaver installation stack are explicitly mentioned. You can assume that all other parts are the same.  
>
>

### <a name="31c6bd4f-51df-4057-9fdf-3fcbc619c170"></a> Install SAP with a high-availability ASCS/SCS instance

> [!IMPORTANT]
> Be sure not to place your page file on DataKeeper mirrored volumes. DataKeeper does not support mirrored volumes. You can leave your page file on the temporary drive D of an Azure virtual machine, which is the default. If it's not already there, move the Windows page file to drive D: of your Azure virtual machine.
>
>

Installing SAP with a high-availability ASCS/SCS instance involves these tasks:

- Creating a virtual host name for the clustered SAP ASCS/SCS instance
- Installing the SAP first cluster node
- Modifying the SAP profile of the ASCS/SCS instance
- Adding a probe port
- Opening the Windows firewall probe port

#### <a name="a97ad604-9094-44fe-a364-f89cb39bf097"></a> Create a virtual host name for the clustered SAP ASCS/SCS instance

1. In the Windows DNS manager, create a DNS entry for the virtual host name of the ASCS/SCS instance.

   > [!IMPORTANT]
   > The IP address that you assign to the virtual host name of the ASCS/SCS instance must be the same as the IP address that you assigned to Azure Load Balancer (**<*SID*>-lb-ascs**).  
   >
   >

   The IP address of the virtual SAP ASCS/SCS host name (**pr1-ascs-sap**) is the same as the IP address of Azure Load Balancer (**pr1-lb-ascs**).

   ![Figure 56: Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-3046]

   _**Figure 56:** Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address_

2. To define the IP address assigned to the virtual host name, select **DNS Manager** > **Domain**.

   ![Figure 57: New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration][sap-ha-guide-figure-3047]

   _**Figure 57:** New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration_

#### <a name="eb5af918-b42f-4803-bb50-eff41f84b0b0"></a> Install the SAP first cluster node

1. Execute the first cluster node option on cluster node A. For example, on the **pr1-ascs-0** host.
2. To keep the default ports for the Azure internal load balancer, select:

   * **ABAP system**: **ASCS** instance number **00**
   * **Java system**: **SCS** instance number **01**
   * **ABAP+Java system**: **ASCS** instance number **00** and **SCS** instance number **01**

   To use instance numbers other than 00 for the ABAP ASCS instance and 01 for the Java SCS instance, first you need to change the Azure internal load balancer default load balancing rules, described in [Change the ASCS/SCS default load balancing rules for the Azure internal load balancer][sap-ha-guide-8.9].

The next few tasks aren't described in the standard SAP installation documentation.

> [!NOTE]
> The SAP installation documentation describes how to install the first ASCS/SCS cluster node.
>
>

#### <a name="e4caaab2-e90f-4f2c-bc84-2cd2e12a9556"></a> Modify the SAP profile of the ASCS/SCS instance

You need to add a new profile parameter. The profile parameter prevents connections between SAP work processes and the enqueue server from closing when they are idle for too long. We mentioned the problem scenario in [Add registry entries on both cluster nodes of the SAP ASCS/SCS instance][sap-ha-guide-8.11]. In that section, we also introduced two changes to some basic TCP/IP connection parameters. In a second step, you need to set the enqueue server to send a `keep_alive` signal so that the connections don't hit the Azure internal load balancer's idle threshold.

To modify the SAP profile of the ASCS/SCS instance:

1. Add this profile parameter to the SAP ASCS/SCS instance profile:

   ```
   enque/encni/set_so_keepalive = true
   ```
   In our example, the path is:

   `<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_ASCS00_pr1-ascs-sap`

   For example, to the SAP SCS instance profile and corresponding path:

   `<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_SCS01_pr1-ascs-sap`

2. To apply the changes, restart the SAP ASCS /SCS instance.

#### <a name="10822f4f-32e7-4871-b63a-9b86c76ce761"></a> Add a probe port

Use the internal load balancer's probe functionality to make the entire cluster configuration work with Azure Load Balancer. The Azure internal load balancer usually distributes the incoming workload equally between participating virtual machines. However, this won't work in some cluster configurations because only one instance is active. The other instance is passive and can’t accept any of the workload. A probe functionality helps when the Azure internal load balancer assigns work only to an active instance. With the probe functionality, the internal load balancer can detect which instances are active, and then target only the instance with the workload.

To add a probe port:

1. Check the current **ProbePort** setting by running the following PowerShell command. Execute it from within one of the virtual machines in the cluster configuration.

   ```powershell
   $SAPSID = "PR1"     # SAP <SID>

   $SAPNetworkIPClusterName = "SAP $SAPSID IP"
   Get-ClusterResource $SAPNetworkIPClusterName | Get-ClusterParameter
   ```

2. Define a probe port. The default probe port number is **0**. In our example, we use probe port **62000**.

   ![Figure 58: The cluster configuration probe port is 0 by default][sap-ha-guide-figure-3048]

   _**Figure 58:** The default cluster configuration probe port is 0_

   The port number is defined in SAP Azure Resource Manager templates. You can assign the port number in PowerShell.

   To set a new ProbePort value for the **SAP <*SID*> IP** cluster resource, run the following PowerShell script. Update the PowerShell variables for your environment. After the script runs, you'll be prompted to restart the SAP cluster group to activate the changes.

   ```powershell
   $SAPSID = "PR1"      # SAP <SID>
   $ProbePort = 62000   # ProbePort of the Azure Internal Load Balancer

   Clear-Host
   $SAPClusterRoleName = "SAP $SAPSID"
   $SAPIPresourceName = "SAP $SAPSID IP"
   $SAPIPResourceClusterParameters =  Get-ClusterResource $SAPIPresourceName | Get-ClusterParameter
   $IPAddress = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Address" }).Value
   $NetworkName = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Network" }).Value
   $SubnetMask = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "SubnetMask" }).Value
   $OverrideAddressMatch = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "OverrideAddressMatch" }).Value
   $EnableDhcp = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "EnableDhcp" }).Value
   $OldProbePort = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "ProbePort" }).Value

   $var = Get-ClusterResource | Where-Object {  $_.name -eq $SAPIPresourceName  }

   Write-Host "Current configuration parameters for SAP IP cluster resource '$SAPIPresourceName' are:" -ForegroundColor Cyan
   Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter

   Write-Host
   Write-Host "Current probe port property of the SAP cluster resource '$SAPIPresourceName' is '$OldProbePort'." -ForegroundColor Cyan
   Write-Host
   Write-Host "Setting the new probe port property of the SAP cluster resource '$SAPIPresourceName' to '$ProbePort' ..." -ForegroundColor Cyan
   Write-Host

   $var | Set-ClusterParameter -Multiple @{"Address"=$IPAddress;"ProbePort"=$ProbePort;"Subnetmask"=$SubnetMask;"Network"=$NetworkName;"OverrideAddressMatch"=$OverrideAddressMatch;"EnableDhcp"=$EnableDhcp}

   Write-Host

   $ActivateChanges = Read-Host "Do you want to take restart SAP cluster role '$SAPClusterRoleName', to activate the changes (yes/no)?"

   if($ActivateChanges -eq "yes"){
   Write-Host
   Write-Host "Activating changes..." -ForegroundColor Cyan

   Write-Host
   write-host "Taking SAP cluster IP resource '$SAPIPresourceName' offline ..." -ForegroundColor Cyan
   Stop-ClusterResource -Name $SAPIPresourceName
   sleep 5

   Write-Host "Starting SAP cluster role '$SAPClusterRoleName' ..." -ForegroundColor Cyan
   Start-ClusterGroup -Name $SAPClusterRoleName

   Write-Host "New ProbePort parameter is active." -ForegroundColor Green
   Write-Host

   Write-Host "New configuration parameters for SAP IP cluster resource '$SAPIPresourceName':" -ForegroundColor Cyan
   Write-Host
   Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter
   }else
   {
   Write-Host "Changes are not activated."
   }
   ```

   After you bring the **SAP <*SID*>** cluster role online, verify that **ProbePort** is set to the new value.

   ```powershell
   $SAPSID = "PR1"     # SAP <SID>

   $SAPNetworkIPClusterName = "SAP $SAPSID IP"
   Get-ClusterResource $SAPNetworkIPClusterName | Get-ClusterParameter

   ```

   ![Figure 59: Probe the cluster port after you set the new value][sap-ha-guide-figure-3049]

   _**Figure 59:** Probe the cluster port after you set the new value_

#### <a name="4498c707-86c0-4cde-9c69-058a7ab8c3ac"></a> Open the Windows firewall probe port

You need to open a Windows firewall probe port on both cluster nodes. Use the following script to open a Windows firewall probe port. Update the PowerShell variables for your environment.

  ```powershell
  $ProbePort = 62000   # ProbePort of the Azure Internal Load Balancer

  New-NetFirewallRule -Name AzureProbePort -DisplayName "Rule for Azure Probe Port" -Direction Inbound -Action Allow -Protocol TCP -LocalPort $ProbePort
  ```

The **ProbePort** is set to **62000**. Now you can access the file share **\\\ascsha-clsap\sapmnt** from other hosts, such as from **ascsha-dbas**.

### <a name="85d78414-b21d-4097-92b6-34d8bcb724b7"></a> Install the database instance

To install the database instance, follow the process described in the SAP installation documentation.

### <a name="8a276e16-f507-4071-b829-cdc0a4d36748"></a> Install the second cluster node

To install the second cluster, follow the steps in the SAP installation guide.

### <a name="094bc895-31d4-4471-91cc-1513b64e406a"></a> Change the start type of the SAP ERS Windows service instance

Change the start type of the SAP ERS Windows service to **Automatic (Delayed Start)** on both cluster nodes.

![Figure 60: Change the service type for the SAP ERS instance to delayed automatic][sap-ha-guide-figure-3050]

_**Figure 60:** Change the service type for the SAP ERS instance to delayed automatic_

### <a name="2477e58f-c5a7-4a5d-9ae3-7b91022cafb5"></a> Install the SAP Primary Application Server

Install the Primary Application Server (PAS) instance <*SID*>-di-0 on the virtual machine that you've designated to host the PAS. There are no dependencies on Azure or DataKeeper-specific settings.

### <a name="0ba4a6c1-cc37-4bcf-a8dc-025de4263772"></a> Install the SAP Additional Application Server

Install an SAP Additional Application Server (AAS) on all the virtual machines that you've designated to host an SAP Application Server instance. For example, on <*SID*>-di-1 to <*SID*>-di-&lt;n&gt;.

> [!NOTE]
> This finishes the installation of a high-availability SAP NetWeaver system. Next, proceed with failover testing.
>


## <a name="18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9"></a> Test the SAP ASCS/SCS instance failover and SIOS replication
It's easy to test and monitor an SAP ASCS/SCS instance failover and SIOS disk replication by using Failover Cluster Manager and the SIOS DataKeeper Management and Configuration tool.

### <a name="65fdef0f-9f94-41f9-b314-ea45bbfea445"></a> SAP ASCS/SCS instance is running on cluster node A

The **SAP PR1** cluster group is running on cluster node A. For example, on **pr1-ascs-0**. Assign the shared disk drive S, which is part of the **SAP PR1** cluster group, and which the ASCS/SCS instance uses, to cluster node A.

![Figure 61: Failover Cluster Manager: The SAP <SID> cluster group is running on cluster node A][sap-ha-guide-figure-5000]

_**Figure 61:** Failover Cluster Manager: The SAP <*SID*> cluster group is running on cluster node A_

In the SIOS DataKeeper Management and Configuration tool, you can see that the shared disk data is synchronously replicated from the source volume drive S on cluster node A to the target volume drive S on cluster node B. For example, it's replicated from **pr1-ascs-0 [10.0.0.40]** to **pr1-ascs-1 [10.0.0.41]**.

![Figure 62: In SIOS DataKeeper, replicate the local volume from cluster node A to cluster node B][sap-ha-guide-figure-5001]

_**Figure 62:** In SIOS DataKeeper, replicate the local volume from cluster node A to cluster node B_

### <a name="5e959fa9-8fcd-49e5-a12c-37f6ba07b916"></a> Failover from node A to node B

1. Choose one of these options to initiate a failover of the SAP <*SID*> cluster group from cluster node A to cluster node B:
   - Use Failover Cluster Manager  
   - Use Failover Cluster PowerShell

   ```powershell
   $SAPSID = "PR1"     # SAP <SID>

   $SAPClusterGroup = "SAP $SAPSID"
   Move-ClusterGroup -Name $SAPClusterGroup

   ```
2. Restart cluster node A within the Windows guest operating system (this initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B).  
3. Restart cluster node A from the Azure portal (this initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B).  
4. Restart cluster node A by using Azure PowerShell (this initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B).

   After failover, the SAP <*SID*> cluster group is running on cluster node B. For example, it's running on **pr1-ascs-1**.

   ![Figure 63: In Failover Cluster Manager, the SAP <SID> cluster group is running on cluster node B][sap-ha-guide-figure-5002]

   _**Figure 63**: In Failover Cluster Manager, the SAP <*SID*> cluster group is running on cluster node B_

   The shared disk is now mounted on cluster node B. SIOS DataKeeper is replicating data from source volume drive S on cluster node B to target volume drive S on cluster node A. For example, it's replicating from **pr1-ascs-1 [10.0.0.41]** to **pr1-ascs-0 [10.0.0.40]**.

   ![Figure 64: SIOS DataKeeper replicates the local volume from cluster node B to cluster node A][sap-ha-guide-figure-5003]

   _**Figure 64:** SIOS DataKeeper replicates the local volume from cluster node B to cluster node A_
