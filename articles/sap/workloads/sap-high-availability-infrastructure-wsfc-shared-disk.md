---
title: Azure infrastructure for SAP ASCS/SCS with WSFC&shared disk | Microsoft Docs
description: Learn how to prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: ec976257-396b-42a0-8ea1-01c97f820fa6
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017, devx-track-azurepowershell
---

# Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for SAP ASCS/SCS

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[sap-installation-guides]:http://service.sap.com/instguides
[tuning-failover-cluster-network-thresholds]:https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834

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
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-hana-ha]:sap-hana-high-availability.md
[sap-suse-ascs-ha]:high-availability-guide-suse.md

[planning-guide]:planning-guide.md
[planning-guide-11]:planning-guide.md
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f


[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-infrastructure-wsfc-shared-disk-vpn]:sap-high-availability-infrastructure-wsfc-shared-disk.md#c87a8d3f-b1dc-4d2f-b23c-da4b72977489
[sap-high-availability-infrastructure-wsfc-shared-disk-change-def-ilb]:sap-high-availability-infrastructure-wsfc-shared-disk.md#fe0bd8b5-2b43-45e3-8295-80bee5415716
[sap-high-availability-infrastructure-wsfc-shared-disk-setup-wsfc]:sap-high-availability-infrastructure-wsfc-shared-disk.md#0d67f090-7928-43e0-8772-5ccbf8f59aab
[sap-high-availability-infrastructure-wsfc-shared-disk-collect-cluster-config]:sap-high-availability-infrastructure-wsfc-shared-disk.md#5eecb071-c703-4ccc-ba6d-fe9c6ded9d79
[sap-high-availability-infrastructure-wsfc-shared-disk-install-sios]:sap-high-availability-infrastructure-wsfc-shared-disk.md#5c8e5482-841e-45e1-a89d-a05c0907c868
[sap-high-availability-infrastructure-wsfc-shared-disk-add-dot-net]:sap-high-availability-infrastructure-wsfc-shared-disk.md#1c2788c3-3648-4e82-9e0d-e058e475e2a3
[sap-high-availability-infrastructure-wsfc-shared-disk-install-sios-both-nodes]:sap-high-availability-infrastructure-wsfc-shared-disk.md#dd41d5a2-8083-415b-9878-839652812102
[sap-high-availability-infrastructure-wsfc-shared-disk-setup-sios]:sap-high-availability-infrastructure-wsfc-shared-disk.md#d9c1fc8e-8710-4dff-bec2-1f535db7b006



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

[sap-templates-3-tier-multisid-xscs-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs%2Fazuredeploy.json
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../azure-resource-manager/management/overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines-windows-manage-availability.md


> ![Windows OS][Logo_Windows] Windows

This article describes the steps you take to prepare the Azure infrastructure for installing and configuring a high-availability SAP ASCS/SCS instance on a Windows failover cluster by using a *cluster shared disk* as an option for clustering an SAP ASCS instance. Two alternatives for *cluster shared disk* are presented in the documentation:

- [Azure shared disks](../../virtual-machines/disks-shared.md)
- Using [SIOS DataKeeper Cluster Edition](https://us.sios.com/products/sios-datakeeper/) to create mirrored storage, that will simulate clustered shared disk 

The documentation doesn't cover the database layer.  

## Prerequisites

Before you begin the installation, review this article:

* [Architecture guide: Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk][sap-high-availability-guide-wsfc-shared-disk]

## Create the ASCS VMs

For SAP ASCS / SCS cluster deploy two VMs in Azure availability set or Azure availability zones based on the type of your deployment. Once the VMs are deployed:

- Create Azure Internal Load Balancer for SAP ASCS /SCS instance.
- Add Windows VMs to the AD domain.

Based on your deployment type, the host names and the IP addresses of the scenario would be like:

**SAP deployment in Azure availability set**

| Host name role                               | Host name   | Static IP address                        | Availability set | Disk SkuName |
| -------------------------------------------- | ----------- | ---------------------------------------- | ---------------- | ------------ |
| 1st cluster node ASCS/SCS cluster            | pr1-ascs-10 | 10.0.0.4                                 | pr1-ascs-avset   | Premium_LRS  |
| 2nd cluster node ASCS/SCS cluster            | pr1-ascs-11 | 10.0.0.5                                 | pr1-ascs-avset   |              |
| Cluster Network Name                         | pr1clust    | 10.0.0.42(**only** for Win 2016 cluster) | n/a              |              |
| ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | n/a              |              |
| ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.44                                | n/a              |              |

**SAP deployment in Azure availability zones**

| Host name role                               | Host name   | Static IP address                        | Availability zone | Disk SkuName |
| -------------------------------------------- | ----------- | ---------------------------------------- | ----------------- | ------------ |
| 1st cluster node ASCS/SCS cluster            | pr1-ascs-10 | 10.0.0.4                                 | AZ01              | Premium_ZRS  |
| 2nd cluster node ASCS/SCS cluster            | pr1-ascs-11 | 10.0.0.5                                 | AZ02              |              |
| Cluster Network Name                         | pr1clust    | 10.0.0.42(**only** for Win 2016 cluster) | n/a               |              |
| ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | n/a               |              |
| ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.44                                | n/a               |              |

The steps mentioned in the document remain same for both deployment type. But if your cluster is running in availability set, you need to deploy LRS for Azure  premium shared disk (Premium_LRS) and if the cluster is running in availability zone deploy ZRS for Azure premium shared disk (Premium_ZRS).

> [!Note]
> [Azure proximity placement group](../../virtual-machines/windows/proximity-placement-groups.md) is not required for Azure shared disk. But for SAP deployment with PPG, follow below guidelines:
> - If you are using PPG for SAP system deployed in a region then all virtual machines sharing a disk must be part of the same PPG.
> -  If you are using PPG for SAP system deployed across zones like described in the document [Proximity placement groups with zonal deployments](proximity-placement-scenarios.md#proximity-placement-groups-with-zonal-deployments), you can attach Premium_ZRS storage to virtual machines sharing a disk.

## <a name="fe0bd8b5-2b43-45e3-8295-80bee5415716"></a> Create Azure internal load balancer

SAP ASCS, SAP SCS, and the new SAP ERS2, use virtual hostname and virtual IP addresses. On Azure a [load balancer](../../load-balancer/load-balancer-overview.md) is required to use a virtual IP address. 
We strongly recommend using [Standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md). 

> [!IMPORTANT]
> Floating IP is not supported on a NIC secondary IP configuration in load-balancing scenarios. For details see [Azure Load balancer Limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need additional IP address for the VM, deploy a second NIC.    

The following list shows the configuration of the (A)SCS/ERS load balancer. The configuration for both SAP ASCS and ERS2 in performed in the same Azure load balancer.  

**(A)SCS**
- Frontend configuration
	- Static ASCS/SCS IP address **10.0.0.43**
- Backend configuration  
	Add all virtual machines that should be part of the (A)SCS/ERS cluster. In this example VMs **pr1-ascs-10** and **pr1-ascs-11**.
- Probe Port
	- Port 620**nr**
	Leave the default option for Protocol (TCP), Interval (5), Unhealthy threshold (2)
- Load-balancing rules
	- If using Standard Load Balancer, select HA ports
	- If using Basic Load Balancer, create Load-balancing rules for the following ports
      	- 32**nr** TCP
		- 36**nr** TCP
		- 39**nr** TCP
		- 81**nr** TCP
		- 5**nr**13 TCP
		- 5**nr**14 TCP
		- 5**nr**16 TCP

	- Make sure that Idle timeout (minutes) is set to max value 30, and that Floating IP (direct server return) is Enabled.

**ERS2**

As Enqueue Replication Server 2 (ERS2) is also clustered, ERS2 virtual IP address must be also configured on Azure ILB in addition to above SAP ASCS/SCS IP. This section only applies, if using Enqueue replication server 2 architecture.  
- 2nd Frontend configuration
	- Static SAP ERS2 IP address **10.0.0.44**

- Backend configuration  
  The VMs were already added to the ILB backend pool.  

- 2nd Probe Port
	- Port 621**nr**  
	Leave the default option for Protocol (TCP), Interval (5), Unhealthy threshold (2)

- 2nd Load-balancing rules
	- If using Standard Load Balancer, select HA ports
	- If using Basic Load Balancer, create Load-balancing rules for the following ports
		- 32**nr** TCP
		- 33**nr** TCP
		- 5**nr**13 TCP
		- 5**nr**14 TCP
		- 5**nr**16 TCP

	- Make sure that Idle timeout (minutes) is set to max value 30, and that Floating IP (direct server return) is Enabled.

> [!TIP]
> With the [Azure Resource Manager Template for WSFC for SAP ASCS/SCS instance with Azure Shared Disk](https://github.com/robotechredmond/301-shared-disk-sap), you can automate the infrastructure preparation, using Azure Shared Disk for one SAP SID with ERS1.  
> The Azure ARM template will create two Windows 2019 or 2016 VMs,  create Azure shared disk and attach to the VMs. Azure Internal Load Balancer will be created and configured as well. 
> For details - see the ARM template. 

## <a name="661035b2-4d0f-4d31-86f8-dc0a50d78158"></a> Add registry entries on both cluster nodes of the ASCS/SCS instance

Azure Load Balancer may close connections, if the connections are idle for a period and exceed the idle timeout. The SAP work processes open connections to the SAP enqueue process as soon as the first enqueue/dequeue request needs to be sent. To avoid interrupting these connections, change the TCP/IP KeepAliveTime and KeepAliveInterval values on both cluster nodes. If using ERS1, it is also necessary to add SAP profile parameters, as described later in this article.
The following registry entries must be changed on both cluster nodes:

- KeepAliveTime
- KeepAliveInterval

| Path| Variable name | Variable type  | Value | Documentation |
| --- | --- | --- |---| ---|
| HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |KeepAliveTime |REG_DWORD (Decimal) |120000 |[KeepAliveTime](/previous-versions/windows/it-pro/windows-2000-server/cc957549(v=technet.10)) |
| HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |KeepAliveInterval |REG_DWORD (Decimal) |120000 |[KeepAliveInterval](/previous-versions/windows/it-pro/windows-2000-server/cc957548(v=technet.10)) |


To apply the changes, restart both cluster nodes.
  
## <a name="e69e9a34-4601-47a3-a41c-d2e11c626c0c"></a> Add the Windows VMs to the domain
After you assign static IP addresses to the virtual machines, add the virtual machines to the domain. 

## <a name="0d67f090-7928-43e0-8772-5ccbf8f59aab"></a> Install and configure  Windows failover cluster 

### Install the Windows failover cluster feature

Run this command on one of the cluster nodes:

```powershell
# Hostnames of the Win cluster for SAP ASCS/SCS
$SAPSID = "PR1"
$ClusterNodes = ("pr1-ascs-10","pr1-ascs-11")
$ClusterName = $SAPSID.ToLower() + "clust"

# Install Windows features.
# After the feature installs, manually reboot both nodes
Invoke-Command $ClusterNodes {Install-WindowsFeature Failover-Clustering, FS-FileServer -IncludeAllSubFeature -IncludeManagementTools }
```

Once the feature installation has completed, reboot both cluster nodes.  

### Test and configure Windows failover cluster 

On Windows 2019, the cluster will automatically recognize that it is running in Azure, and as a default option for cluster management IP, it will use Distributed Network name. Therefore, it will use any of the cluster nodes local IP addresses. As a result, there is no need for a dedicated (virtual) network name for the cluster, and there is no need to configure this IP address on Azure Internal Load Balancer.

For more information, see, [Windows Server 2019 Failover Clustering New features](https://techcommunity.microsoft.com/t5/failover-clustering/windows-server-2019-failover-clustering-new-features/ba-p/544029)
Run this command on one of the cluster nodes:

```powershell
# Hostnames of the Win cluster for SAP ASCS/SCS
$SAPSID = "PR1"
$ClusterNodes = ("pr1-ascs-10","pr1-ascs-11")
$ClusterName = $SAPSID.ToLower() + "clust"

# IP adress for cluster network name is needed ONLY on Windows Server 2016 cluster
$ClusterStaticIPAddress = "10.0.0.42"

# Test cluster
Test-Cluster –Node $ClusterNodes -Verbose

$ComputerInfo = Get-ComputerInfo

$WindowsVersion = $ComputerInfo.WindowsProductName

if($WindowsVersion -eq "Windows Server 2019 Datacenter"){
    write-host "Configuring Windows Failover Cluster on Windows Server 2019 Datacenter..."
    New-Cluster –Name $ClusterName –Node  $ClusterNodes -Verbose
}elseif($WindowsVersion -eq "Windows Server 2016 Datacenter"){
    write-host "Configuring Windows Failover Cluster on Windows Server 2016 Datacenter..."
    New-Cluster –Name $ClusterName –Node  $ClusterNodes –StaticAddress $ClusterStaticIPAddress -Verbose 
}else{
    Write-Error "Not supported Windows version!"
}
```

### Configure cluster cloud quorum
As you use Windows Server 2016 or 2019, we recommended configuring [Azure Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness), as cluster quorum.

Run this command on one of the cluster nodes:

```powershell
$AzureStorageAccountName = "cloudquorumwitness"
Set-ClusterQuorum –CloudWitness –AccountName $AzureStorageAccountName -AccessKey <YourAzureStorageAccessKey> -Verbose
```

### Tuning the Windows failover cluster thresholds
 
After you successfully install the Windows failover cluster, you need to adjust some thresholds, to be suitable for clusters deployed in Azure. The parameters to be changed are documented in [Tuning failover cluster network thresholds](https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834). Assuming that your two VMs that make up the Windows cluster configuration for ASCS/SCS are in the same subnet, change the following parameters to these values:
- SameSubNetDelay = 2000
- SameSubNetThreshold = 15
- RouteHistoryLength = 30

These settings were tested with customers and offer a good compromise. They are resilient enough, but they also provide failover that is fast enough for real error conditions in SAP workloads or VM failure.  

## Configure Azure shared disk
This section is only applicable, if you are using Azure shared disk.

### Create and attach Azure shared disk with PowerShell
Run this command on one of the cluster nodes. You will need to adjust the values for your resource group, Azure region, SAPSID, and so on.  

```powershell
#############################
# Create Azure Shared Disk
#############################

$ResourceGroupName = "MyResourceGroup"
$location = "MyAzureRegion"
$SAPSID = "PR1"

$DiskSizeInGB = 512
$DiskName = "$($SAPSID)ASCSSharedDisk"

# With parameter '-MaxSharesCount', we define the maximum number of cluster nodes to attach the shared disk
$NumberOfWindowsClusterNodes = 2

# For SAP deployment in availability set, use below storage SkuName
$SkuName = "Premium_LRS"
# For SAP deployment in availability zone, use below storage SkuName
$SkuName = "Premium_ZRS"
			
$diskConfig = New-AzDiskConfig -Location $location -SkuName $SkuName  -CreateOption Empty  -DiskSizeGB $DiskSizeInGB -MaxSharesCount $NumberOfWindowsClusterNodes
$dataDisk = New-AzDisk -ResourceGroupName $ResourceGroupName -DiskName $DiskName -Disk $diskConfig

##################################
## Attach the disk to cluster VMs
##################################
# ASCS Cluster VM1
$ASCSClusterVM1 = "$SAPSID-ascs-10"

# ASCS Cluster VM2
$ASCSClusterVM2 = "$SAPSID-ascs-11"

# Add the Azure Shared Disk to Cluster Node 1
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM1 
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose

# Add the Azure Shared Disk to Cluster Node 2
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM2
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose
```

### Format the shared disk with PowerShell
1. Get the disk number. Run these PowerShell commands on one of the cluster nodes:

   ```powershell
	Get-Disk | Where-Object PartitionStyle -Eq "RAW"  | Format-Table -AutoSize 
	# Example output
	# Number Friendly Name     Serial Number HealthStatus OperationalStatus Total Size Partition Style
	# ------ -------------     ------------- ------------ ----------------- ---------- ---------------
	# 2      Msft Virtual Disk               Healthy      Online                512 GB RAW            

   ```
2. Format the disk. In this example, it is disk number 2. 

   ```powershell
	# Format SAP ASCS Disk number '2', with drive letter 'S'
	$SAPSID = "PR1"
	$DiskNumber = 2
	$DriveLetter = "S"
	$DiskLabel = "$SAPSID" + "SAP"
	
	Get-Disk -Number $DiskNumber | Where-Object PartitionStyle -Eq "RAW" | Initialize-Disk -PartitionStyle GPT -PassThru |  New-Partition -DriveLetter $DriveLetter -UseMaximumSize | Format-Volume  -FileSystem ReFS -NewFileSystemLabel $DiskLabel -Force -Verbose
	# Example outout
	# DriveLetter FileSystemLabel FileSystem DriveType HealthStatus OperationalStatus SizeRemaining      Size
	# ----------- --------------- ---------- --------- ------------ ----------------- -------------      ----
	# S           PR1SAP          ReFS       Fixed     Healthy      OK                    504.98 GB 511.81 GB
   ```

3. Verify that the disk is now visible as a cluster disk.
   ```powershell
	# List all disks
	Get-ClusterAvailableDisk -All
	# Example output
	# Cluster    : pr1clust
	# Id         : 88ff1d94-0cf1-4c70-89ae-cbbb2826a484
	# Name       : Cluster Disk 1
	# Number     : 2
	# Size       : 549755813888
	# Partitions : {\\?\GLOBALROOT\Device\Harddisk2\Partition2\}
   ```
4. Register the disk in the cluster.  
   ```powershell
	# Add the disk to cluster 
	Get-ClusterAvailableDisk -All | Add-ClusterDisk
	# Example output	 
	# Name           State  OwnerGroup        ResourceType 
	# ----           -----  ----------        ------------ 
	# Cluster Disk 1 Online Available Storage Physical Disk
   ```

## <a name="5c8e5482-841e-45e1-a89d-a05c0907c868"></a> SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk
This section is only applicable, if you are using the third-party software SIOS DataKeeper Cluster Edition to create a mirrored storage that simulates cluster shared disk.  

Now, you have a working Windows Server failover clustering configuration in Azure. To install an SAP ASCS/SCS instance, you need a shared disk resource. One of the options is to use SIOS DataKeeper Cluster Edition is a third-party solution that you can use to create shared disk resources.  

Installing SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk involves these tasks:
- Add Microsoft .NET Framework, if needed. See the [SIOS documentation](https://us.sios.com/products/sios-datakeeper/) for the most up-to-date .NET framework requirements 
- Install SIOS DataKeeper
- Configure SIOS DataKeeper

### Install SIOS DataKeeper
Install SIOS DataKeeper Cluster Edition on each node in the cluster. To create virtual shared storage with SIOS DataKeeper, create a synced mirror and then simulate cluster shared storage.

Before you install the SIOS software, create the DataKeeperSvc domain user.

> [!NOTE]
> Add the DataKeeperSvc domain user to the Local Administrator group on both cluster nodes.
>

1. Install the SIOS software on both cluster nodes.

   ![SIOS installer][sap-ha-guide-figure-3030]

   ![Figure 31: First page of the SIOS DataKeeper installation][sap-ha-guide-figure-3031]

   _First page of the SIOS DataKeeper installation_

2. In the dialog box, select **Yes**.

   ![Figure 32: DataKeeper informs you that a service will be disabled][sap-ha-guide-figure-3032]

   _DataKeeper informs you that a service will be disabled_

3. In the dialog box, we recommend that you select **Domain or Server account**.

   ![Figure 33: User selection for SIOS DataKeeper][sap-ha-guide-figure-3033]

   _User selection for SIOS DataKeeper_

4. Enter the domain account user name and password that you created for SIOS DataKeeper.

   ![Figure 34: Enter the domain user name and password for the SIOS DataKeeper installation][sap-ha-guide-figure-3034]

   _Enter the domain user name and password for the SIOS DataKeeper installation_

5. Install the license key for your SIOS DataKeeper instance, as shown in Figure 35.

   ![Figure 35: Enter your SIOS DataKeeper license key][sap-ha-guide-figure-3035]

   _Enter your SIOS DataKeeper license key_

6. When prompted, restart the virtual machine.

### Configure SIOS DataKeeper
After you install SIOS DataKeeper on both nodes, start the configuration. The goal of the configuration is to have synchronous data replication between the additional disks that are attached to each of the virtual machines.

1. Start the DataKeeper Management and Configuration tool, and then select **Connect Server**.

   ![Figure 36: SIOS DataKeeper Management and Configuration tool][sap-ha-guide-figure-3036]

   _SIOS DataKeeper Management and Configuration tool_

2. Enter the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and, in a second step, the second node.

   ![Figure 37: Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node][sap-ha-guide-figure-3037]

   _Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node_

3. Create the replication job between the two nodes.

   ![Figure 38: Create a replication job][sap-ha-guide-figure-3038]

   _Create a replication job_

   A wizard guides you through the process of creating a replication job.

4. Define the name of the replication job.

   ![Figure 39: Define the name of the replication job][sap-ha-guide-figure-3039]

   _Define the name of the replication job_

   ![Figure 40: Define the base data for the node, which should be the current source node][sap-ha-guide-figure-3040]

   _Define the base data for the node, which should be the current source node_

5. Define the name, TCP/IP address, and disk volume of the target node.

   ![Figure 41: Define the name, TCP/IP address, and disk volume of the current target node][sap-ha-guide-figure-3041]

   _Define the name, TCP/IP address, and disk volume of the current target node_

6. Define the compression algorithms. In our example, we recommend that you compress the replication stream. Especially in resynchronization situations, the compression of the replication stream dramatically reduces resynchronization time. Compression uses the CPU and RAM resources of a virtual machine. As the compression rate increases, so does the volume of CPU resources that are used. You can adjust this setting later.

7. Another setting you need to check is whether the replication occurs asynchronously or synchronously. When you protect SAP ASCS/SCS configurations, you must use synchronous replication.  

   ![Figure 42: Define replication details][sap-ha-guide-figure-3042]

   _Define replication details_

8. Define whether the volume that is replicated by the replication job should be represented to a Windows Server failover cluster configuration as a shared disk. For the SAP ASCS/SCS configuration, select **Yes** so that the Windows cluster sees the replicated volume as a shared disk that it can use as a cluster volume.

   ![Figure 43: Select Yes to set the replicated volume as a cluster volume][sap-ha-guide-figure-3043]

   _Select **Yes** to set the replicated volume as a cluster volume_

   After the volume is created, the DataKeeper Management and Configuration tool shows that the replication job is active.

   ![Figure 44: DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active][sap-ha-guide-figure-3044]

   _DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active_

   Failover Cluster Manager now shows the disk as a DataKeeper disk, as shown in Figure 45:

   ![Figure 45: Failover Cluster Manager shows the disk that DataKeeper replicated][sap-ha-guide-figure-3045]

   _Failover Cluster Manager shows the disk that DataKeeper replicated_


## Next steps

* [Install SAP NetWeaver HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]
