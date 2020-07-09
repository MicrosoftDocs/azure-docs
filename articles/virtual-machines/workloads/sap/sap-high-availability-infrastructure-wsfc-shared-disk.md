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
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 05/05/2017
ms.author: radeltch
ms.custom: H1Hack27Feb2017

---

# Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for SAP ASCS/SCS

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[sap-installation-guides]:http://service.sap.com/instguides
[tuning-failover-cluster-network-thresholds]:https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834

[azure-resource-manager/management/azure-subscription-service-limits]:../../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../../azure-resource-manager/management/azure-subscription-service-limits.md

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[ha-guide]:sap-high-availability-guide.md
[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-ha-guide-9.1.1]:high-availability-guide.md#a97ad604-9094-44fe-a364-f89cb39bf097
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

[sap-ha-multi-sid-guide]:sap-high-availability-multi-sid.md (SAP multi-SID high-availability configuration)

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
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../../azure-resource-manager/management/overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines-windows-manage-availability.md


> ![Windows][Logo_Windows] Windows
>

This article describes the steps you take to prepare the Azure infrastructure for installing and configuring a high-availability SAP system on a Windows failover cluster by using a *cluster shared disk* as an option for clustering an SAP ASCS instance.

## Prerequisites

Before you begin the installation, review this article:

* [Architecture guide: Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk][sap-high-availability-guide-wsfc-shared-disk]

## Prepare the infrastructure for Architectural Template 1
Azure Resource Manager templates for SAP help simplify deployment of required resources.

The three-tier templates in Azure Resource Manager also support high-availability scenarios. For example, Architectural Template 1 has two clusters. Each cluster is an SAP single point of failure for SAP ASCS/SCS and DBMS.

Here's where you can get Azure Resource Manager templates for the example scenario we describe in this article:

* [Azure Marketplace image](https://github.com/Azure/azure-quickstart-templates/)  
* [Azure Marketplace image by using Azure Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-md)  
* [Custom image](https://github.com/Azure/azure-quickstart-templates/)
* [Custom image by using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image-md)

To prepare the infrastructure for Architectural Template 1:

- In the Azure portal, in the **Parameters** pane, in the **SYSTEMAVAILABILITY** box, select **HA**.

  ![Figure 1: Set SAP high-availability Azure Resource Manager parameters][sap-ha-guide-figure-3000]

_**Figure 1:** Set SAP high-availability Azure Resource Manager parameters_


  The templates create:

  * **Virtual machines**:
    * SAP Application Server virtual machines: \<SAPSystemSID\>-di-\<Number\>
    * ASCS/SCS cluster virtual machines: \<SAPSystemSID\>-ascs-\<Number\>
    * DBMS cluster: \<SAPSystemSID\>-db-\<Number\>

  * **Network cards for all virtual machines, with associated IP addresses**:
    * \<SAPSystemSID\>-nic-di-\<Number\>
    * \<SAPSystemSID\>-nic-ascs-\<Number\>
    * \<SAPSystemSID\>-nic-db-\<Number\>

  * **Azure storage accounts (unmanaged disks only)**:

  * **Availability groups** for:
    * SAP Application Server virtual machines: \<SAPSystemSID\>-avset-di
    * SAP ASCS/SCS cluster virtual machines: \<SAPSystemSID\>-avset-ascs
    * DBMS cluster virtual machines: \<SAPSystemSID\>-avset-db

  * **Azure internal load balancer**:
    * With all ports for the ASCS/SCS instance and IP address \<SAPSystemSID\>-lb-ascs
    * With all ports for the SQL Server DBMS and IP address \<SAPSystemSID\>-lb-db

  * **Network security group**: \<SAPSystemSID\>-nsg-ascs-0  
    * With an open external Remote Desktop Protocol (RDP) port to the \<SAPSystemSID\>-ascs-0 virtual machine

> [!NOTE]
> All IP addresses of the network cards and Azure internal load balancers are dynamic by default. Change them to static IP addresses. We describe how to do this later in the article.
>
>

## <a name="c87a8d3f-b1dc-4d2f-b23c-da4b72977489"></a> Deploy virtual machines with corporate network connectivity (cross-premises) to use in production
For production SAP systems, deploy Azure virtual machines with corporate network connectivity by using Azure VPN Gateway or Azure ExpressRoute.

> [!NOTE]
> You can use your Azure Virtual Network instance. The virtual network and subnet have already been created and prepared.
>
>

1. In the Azure portal, in the **Parameters** pane, in the **NEWOREXISTINGSUBNET** box, select **existing**.
2. In the **SUBNETID** box, add the full string of your prepared Azure network subnet ID where you plan to deploy your Azure virtual machines.
3. To get a list of all Azure network subnets, run this PowerShell command:

   ```powershell
   (Get-AzVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets
   ```

   The **ID** field shows the value for the subnet ID.
4. To get a list of all subnet ID values, run this PowerShell command:

   ```powershell
   (Get-AzVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets.Id
   ```

   The subnet ID looks like this:

   ```
   /subscriptions/<subscription ID>/resourceGroups/<VPN name>/providers/Microsoft.Network/virtualNetworks/azureVnet/subnets/<subnet name>
   ```

## <a name="7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310"></a> Deploy cloud-only SAP instances for test and demo
You can deploy your high-availability SAP system in a cloud-only deployment model. This kind of deployment primarily is useful for demo and test use cases. It's not suited for production use cases.

- In the Azure portal, in the **Parameters** pane, in the **NEWOREXISTINGSUBNET** box, select **new**. Leave the **SUBNETID** field empty.

  The SAP Azure Resource Manager template automatically creates the Azure virtual network and subnet.

> [!NOTE]
> You also need to deploy at least one dedicated virtual machine for Active Directory and DNS service in the same Azure Virtual Network instance. The template doesn't create these virtual machines.
>
>


## Prepare the infrastructure for Architectural Template 2

You can use this Azure Resource Manager template for SAP to help simplify the deployment of required infrastructure resources for SAP Architectural Template 2.

Here's where you can get Azure Resource Manager templates for this deployment scenario:

* [Azure Marketplace image](https://github.com/Azure/azure-quickstart-templates/)  
* [Azure Marketplace image by using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image-converged-md)  
* [Custom image](https://github.com/Azure/azure-quickstart-templates/)
* [Custom image by using Managed Disks](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image-converged-md)


## Prepare the infrastructure for Architectural Template 3

You can prepare the infrastructure and configure SAP for multi-SID. For example, you can add an additional SAP ASCS/SCS instance into an *existing* cluster configuration. For more information, see [Configure an additional SAP ASCS/SCS instance for an existing cluster configuration to create an SAP multi-SID configuration in Azure Resource Manager][sap-ha-multi-sid-guide].

If you want to create a new multi-SID cluster, you can use the multi-SID [quickstart templates on GitHub](https://github.com/Azure/azure-quickstart-templates).

To create a new multi-SID cluster, you must deploy the following three templates:

* [ASCS/SCS template](#ASCS-SCS-template)
* [Database template](#database-template)
* [Application servers template](#application-servers-template)

The following sections have more details about the templates and parameters that you need to provide in the templates.

### <a name="ASCS-SCS-template"></a> ASCS/SCS template

The ASCS/SCS template deploys two virtual machines that you can use to create a Windows Server failover cluster that hosts multiple ASCS/SCS instances.

To set up the ASCS/SCS multi-SID template, in the [ASCS/SCS multi-SID template][sap-templates-3-tier-multisid-xscs-marketplace-image] or [ASCS/SCS multi-SID template by using Managed Disks][sap-templates-3-tier-multisid-xscs-marketplace-image-md], enter values for the following parameters:

- **Resource Prefix**:  Set the resource prefix, which is used to prefix all resources that are created during the deployment. Because the resources do not belong to only one SAP system, the prefix of the resource is not the SID of one SAP system.  The prefix must be between three and six characters.
- **Stack Type**: Select the stack type of the SAP system. Depending on the stack type, Azure Load Balancer has one (ABAP or Java only) or two (ABAP+Java) private IP addresses per SAP system.
- **OS Type**: Select the operating system of the virtual machines.
- **SAP System Count**: Select the number of SAP systems that you want to install in this cluster.
- **System Availability**: Select **HA**.
- **Admin Username and Admin Password**: Create a new user that can be used to sign in to the machine.
- **New Or Existing Subnet**: Set whether to create a new virtual network and subnet or use an existing subnet. If you already have a virtual network that is connected to your on-premises network, select **existing**.
- **Subnet Id**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:

  /subscriptions/\<subscription id\>/resourceGroups/\<resource group name\>/providers/Microsoft.Network/virtualNetworks/\<virtual network name\>/subnets/\<subnet name\>

The template deploys one Azure Load Balancer instance, which supports multiple SAP systems:

- The ASCS instances are configured for instance number 00, 10, 20...
- The SCS instances are configured for instance number 01, 11, 21...
- The ASCS Enqueue Replication Server (ERS) (Linux only) instances are configured for instance number 02, 12, 22...
- The SCS ERS (Linux only) instances are configured for instance number 03, 13, 23...

The load balancer contains 1 VIP(s) (2 for Linux), 1x VIP for ASCS/SCS, and 1x VIP for ERS (Linux only).

#### <a name="0f3ee255-b31e-4b8a-a95a-d9ed6200468b"></a> SAP ASCS/SCS ports
The following list contains all load balancing rules (where x is the number of the SAP system, for example, 1, 2, 3...):
- Windows-specific ports for every SAP system: 445, 5985
- ASCS ports (instance number x0): 32x0, 36x0, 39x0, 81x0, 5x013, 5x014, 5x016
- SCS ports (instance number x1): 32x1, 33x1, 39x1, 81x1, 5x113, 5x114, 5x116
- ASCS ERS ports on Linux (instance number x2): 33x2, 5x213, 5x214, 5x216
- SCS ERS ports on Linux (instance number x3): 33x3, 5x313, 5x314, 5x316

The load balancer is configured to use the following probe ports (where x is the number of the SAP system, for example, 1, 2, 3...):
- ASCS/SCS internal load balancer probe port: 620x0
- ERS internal load balancer probe port (Linux only): 621x2

### <a name="database-template"></a> Database template

The database template deploys one or two virtual machines that you can use to install the relational database management system (RDBMS) for one SAP system. For example, if you deploy an ASCS/SCS template for five SAP systems, you need to deploy this template five times.

To set up the database multi-SID template, in the [database multi-SID template][sap-templates-3-tier-multisid-db-marketplace-image] or [database multi-SID template by using Managed Disks][sap-templates-3-tier-multisid-db-marketplace-image-md], enter values for the following parameters:

- **Sap System Id**: Enter the SAP system ID of the SAP system that you want to install. The ID is used as a prefix for the resources that are deployed.
- **Os Type**: Select the operating system of the virtual machines.
- **Dbtype**: Select the type of database that you want to install on the cluster. Select **SQL** if you want to install Microsoft SQL Server. Select **HANA** if you plan to install SAP HANA on the virtual machines. Make sure that you select the correct operating system type. Select **Windows** for SQL, and select a Linux distribution for HANA. Azure Load Balancer that is connected to the virtual machines is configured to support the selected database type:
  * **SQL**: The load balancer load-balance port 1433. Make sure to use this port for your SQL Server AlwaysOn setup.
  * **HANA**: The load balancer load-balance ports 35015 and 35017. Make sure to install SAP HANA with instance number **50**.
  The load balancer uses probe port 62550.
- **Sap System Size**: Set the number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
- **System Availability**: Select **HA**.
- **Admin Username and Admin Password**: Create a new user that can be used to sign in to the machine.
- **Subnet Id**: Enter the ID of the subnet that you used during the deployment of the ASCS/SCS template, or the ID of the subnet that was created as part of the ASCS/SCS template deployment.

### <a name="application-servers-template"></a> Application servers template

The application servers template deploys two or more virtual machines that can be used as SAP Application Server instances for one SAP system. For example, if you deploy an ASCS/SCS template for five SAP systems, you need to deploy this template five times.

To set up the application servers multi-SID template, in the [application servers multi-SID template][sap-templates-3-tier-multisid-apps-marketplace-image] or [application servers multi-SID template  by using Managed Disks][sap-templates-3-tier-multisid-apps-marketplace-image-md], enter values for the following parameters:

  -  **Sap System Id**: Enter the SAP system ID of the SAP system that you want to install. The ID is used as a prefix for the resources that are deployed.
  -  **Os Type**: Select the operating system of the virtual machines.
  -  **Sap System Size**: The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
  -  **System Availability**: Select **HA**.
  -  **Admin Username and Admin Password**: Create a new user that can be used to sign in to the machine.
  -  **Subnet Id**: Enter the ID of the subnet that you used during the deployment of the ASCS/SCS template, or the ID of the subnet that was created as part of the ASCS/SCS template deployment.


## <a name="47d5300a-a830-41d4-83dd-1a0d1ffdbe6a"></a> Azure Virtual Network
In our example, the address space of the Azure Virtual Network instance is 10.0.0.0/16. There is one subnet called Subnet, with an address range of 10.0.0.0/24. All virtual machines and internal load balancers are deployed in this virtual network.

> [!IMPORTANT]
> Don't make any changes to the network settings inside the guest operating system. This includes IP addresses, DNS servers, and subnet. Configure all your network settings in Azure. The Dynamic Host Configuration Protocol (DHCP) service propagates your settings.
>
>

## <a name="b22d7b3b-4343-40ff-a319-097e13f62f9e"></a> DNS IP addresses

To set the required DNS IP addresses, complete the following steps:

1. In the Azure portal, in the **DNS servers** pane, make sure that your virtual network **DNS servers** option is set to **Custom DNS**.
2. Select your settings based on the type of network you have. For more information, see the following resources:
   * Add the IP addresses of the on-premises DNS servers.  
   You can extend on-premises DNS servers to the virtual machines that are running in Azure. In that scenario, you can add the IP addresses of the Azure virtual machines on which you run the DNS service.
   * For VM deployments which are isolated in Azure: Deploy an additional virtual machine in the same Virtual Network instance that serves as a DNS server. Add the IP addresses of the Azure virtual machines that you've set up to run the DNS service.

   ![Figure 2: Configure DNS servers for Azure Virtual Network][sap-ha-guide-figure-3001]

   _**Figure 2:** Configure DNS servers for Azure Virtual Network_

   > [!NOTE]
   > If you change the IP addresses of the DNS servers, you need to restart the Azure virtual machines to apply the change and propagate the new DNS servers.
   >
   >

In our example, the DNS service is installed and configured on these Windows virtual machines:

| Virtual machine role | Virtual machine host name | Network card name | Static IP address |
| --- | --- | --- | --- |
| First DNS server |domcontr-0 |pr1-nic-domcontr-0 |10.0.0.10 |
| Second DNS server |domcontr-1 |pr1-nic-domcontr-1 |10.0.0.11 |

## <a name="9fbd43c0-5850-4965-9726-2a921d85d73f"></a> Host names and static IP addresses for the SAP ASCS/SCS clustered instance and DBMS clustered instance

For on-premises deployment, you need these reserved host names and IP addresses:

| Virtual host name role | Virtual host name | Virtual static IP address |
| --- | --- | --- |
| SAP ASCS/SCS first cluster virtual host name (for cluster management) |pr1-ascs-vir |10.0.0.42 |
| SAP ASCS/SCS instance virtual host name |pr1-ascs-sap |10.0.0.43 |
| SAP DBMS second cluster virtual host name (cluster management) |pr1-dbms-vir |10.0.0.32 |

When you create the cluster, create the virtual host names pr1-ascs-vir and pr1-dbms-vir and the associated IP addresses that manage the cluster itself. For information about how to do this, see [Collect cluster nodes in a cluster configuration][sap-high-availability-infrastructure-wsfc-shared-disk-collect-cluster-config].

You can manually create the other two virtual host names, pr1-ascs-sap and pr1-dbms-sap, and the associated IP addresses, on the DNS server. The clustered SAP ASCS/SCS instance and the clustered DBMS instance use these resources. For information about how to do this, see [Create a virtual host name for a clustered SAP ASCS/SCS instance][sap-ha-guide-9.1.1].

## <a name="84c019fe-8c58-4dac-9e54-173efd4b2c30"></a> Set static IP addresses for the SAP virtual machines
After you deploy the virtual machines to use in your cluster, you need to set static IP addresses for all virtual machines. Do this in the Azure Virtual Network configuration, and not in the guest operating system.

1. In the Azure portal, select **Resource Group** > **Network Card** > **Settings** > **IP Address**.
2. In the **IP addresses** pane, under **Assignment**, select **Static**. In the **IP address** box, enter the IP address that you want to use.

   > [!NOTE]
   > If you change the IP address of the network card, you need to restart the Azure virtual machines to apply the change.  
   >
   >

   ![Figure 3: Set static IP addresses for the network card of each virtual machine][sap-ha-guide-figure-3002]

   _**Figure 3:** Set static IP addresses for the network card of each virtual machine_

   Repeat this step for all network interfaces, that is, for all virtual machines, including virtual machines that you want to use for your Active Directory or DNS service.

In our example, we have these virtual machines and static IP addresses:

| Virtual machine role | Virtual machine host name | Network card name | Static IP address |
| --- | --- | --- | --- |
| First SAP application server instance |pr1-di-0 |pr1-nic-di-0 |10.0.0.50 |
| Second SAP Application Server instance |pr1-di-1 |pr1-nic-di-1 |10.0.0.51 |
| ... |... |... |... |
| Last SAP application server instance |pr1-di-5 |pr1-nic-di-5 |10.0.0.55 |
| First cluster node for ASCS/SCS instance |pr1-ascs-0 |pr1-nic-ascs-0 |10.0.0.40 |
| Second cluster node for ASCS/SCS instance |pr1-ascs-1 |pr1-nic-ascs-1 |10.0.0.41 |
| First cluster node for DBMS instance |pr1-db-0 |pr1-nic-db-0 |10.0.0.30 |
| Second cluster node for DBMS instance |pr1-db-1 |pr1-nic-db-1 |10.0.0.31 |

## <a name="7a8f3e9b-0624-4051-9e41-b73fff816a9e"></a> Set a static IP address for the Azure internal load balancer

The SAP Azure Resource Manager template creates an Azure internal load balancer that is used for the SAP ASCS/SCS instance cluster and the DBMS cluster.

> [!IMPORTANT]
> The IP address of the virtual host name of the SAP ASCS/SCS is the same as the IP address of the SAP ASCS/SCS internal load balancer: pr1-lb-ascs.
> The IP address of the virtual name of the DBMS is the same as the IP address of the DBMS internal load balancer: pr1-lb-dbms.
>
>

To set a static IP address for the Azure internal load balancer:

1. The initial deployment sets the internal load balancer IP address to **Dynamic**. In the Azure portal, on the **IP addresses** pane, under **Assignment**, select **Static**.
2. Set the IP address of the internal load balancer **pr1-lb-ascs** to the IP address of the virtual host name of the SAP ASCS/SCS instance.
3. Set the IP address of the internal load balancer **pr1-lb-dbms** to the IP address of the virtual host name of the DBMS instance.

   ![Figure 4: Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance][sap-ha-guide-figure-3003]

   _**Figure 4:** Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance_

In our example, we have two Azure internal load balancers that have these static IP addresses:

| Azure internal load balancer role | Azure internal load balancer name | Static IP address |
| --- | --- | --- |
| SAP ASCS/SCS instance internal load balancer |pr1-lb-ascs |10.0.0.43 |
| SAP DBMS internal load balancer |pr1-lb-dbms |10.0.0.33 |


## <a name="f19bd997-154d-4583-a46e-7f5a69d0153c"></a> Default ASCS/SCS load balancing rules for the Azure internal load balancer

The SAP Azure Resource Manager template creates the ports you need:
* An ABAP ASCS instance, with the default instance number 00
* A Java SCS instance, with the default instance number 01

When you install your SAP ASCS/SCS instance, you must use the default instance number 00 for your ABAP ASCS instance and the default instance number 01 for your Java SCS instance.

Next, create the required internal load balancing endpoints for the SAP NetWeaver ports.

To create required internal load balancing endpoints, first, create these load balancing endpoints for the SAP NetWeaver ABAP ASCS ports:

| Service/load balancing rule name | Default port numbers | Concrete ports for (ASCS instance with instance number 00) (ERS with 10) |
| --- | --- | --- |
| Enqueue server / *lbrule3200* |32\<InstanceNumber\> |3200 |
| ABAP message server / *lbrule3600* |36\<InstanceNumber\> |3600 |
| Internal ABAP message / *lbrule3900* |39\<InstanceNumber\> |3900 |
| Message server HTTP / *Lbrule8100* |81\<InstanceNumber\> |8100 |
| SAP start service ASCS HTTP / *Lbrule50013* |5\<InstanceNumber\>13 |50013 |
| SAP start service ASCS HTTPS / *Lbrule50014* |5\<InstanceNumber\>14 |50014 |
| Enqueue replication / *Lbrule50016* |5\<InstanceNumber\>16 |50016 |
| SAP start service ERS HTTP *Lbrule51013* |5\<InstanceNumber\>13 |51013 |
| SAP start service ERS HTTP *Lbrule51014* |5\<InstanceNumber\>14 |51014 |
| Windows Remote Management (WinRM) *Lbrule5985* | |5985 |
| File share *Lbrule445* | |445 |

**Table 1:** Port numbers of the SAP NetWeaver ABAP ASCS instances

Then, create these load balancing endpoints for the SAP NetWeaver Java SCS ports:

| Service/load balancing rule name | Default port numbers | Concrete ports for (SCS instance with instance number 01) (ERS with 11) |
| --- | --- | --- |
| Enqueue server / *lbrule3201* |32\<InstanceNumber\> |3201 |
| Gateway server / *lbrule3301* |33\<InstanceNumber\> |3301 |
| Java message server / *lbrule3900* |39\<InstanceNumber\> |3901 |
| Message server HTTP / *Lbrule8101* |81\<InstanceNumber\> |8101 |
| SAP start service SCS HTTP / *Lbrule50113* |5\<InstanceNumber\>13 |50113 |
| SAP start service SCS HTTPS / *Lbrule50114* |5\<InstanceNumber\>14 |50114 |
| Enqueue replication / *Lbrule50116* |5\<InstanceNumber\>16 |50116 |
| SAP start service ERS HTTP *Lbrule51113* |5\<InstanceNumber\>13 |51113 |
| SAP start service ERS HTTP *Lbrule51114* |5\<InstanceNumber\>14 |51114 |
| WinRM *Lbrule5985* | |5985 |
| File share *Lbrule445* | |445 |

**Table 2:** Port numbers of the SAP NetWeaver Java SCS instances

![Figure 5: Default ASCS/SCS load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3004]

_**Figure 5:** Default ASCS/SCS load balancing rules for the Azure internal load balancer_

Set the IP address of the load balancer pr1-lb-dbms to the IP address of the virtual host name of the DBMS instance.

### <a name="fe0bd8b5-2b43-45e3-8295-80bee5415716"></a> Change the ASCS/SCS default load balancing rules for the Azure internal load balancer

If you want to use different numbers for the SAP ASCS or SCS instances, you must change the names and values of their ports from default values.

1. In the Azure portal, select **\<SID\>-lb-ascs load balancer** > **Load Balancing Rules**.
2. For all load balancing rules that belong to the SAP ASCS or SCS instance, change these values:

   * Name
   * Port
   * Back-end port

   For example, if you want to change the default ASCS instance number from 00 to 31, you need to make the changes for all ports listed in Table 1.

   Here's an example of an update for port *lbrule3200*.

   ![Figure 6: Change the ASCS/SCS default load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3005]

   _**Figure 6:** Change the ASCS/SCS default load balancing rules for the Azure internal load balancer_

## <a name="e69e9a34-4601-47a3-a41c-d2e11c626c0c"></a> Add Windows virtual machines to the domain

After you assign a static IP address to the virtual machines, add the virtual machines to the domain.

![Figure 7: Add a virtual machine to a domain][sap-ha-guide-figure-3006]

_**Figure 7:** Add a virtual machine to a domain_

## <a name="661035b2-4d0f-4d31-86f8-dc0a50d78158"></a> Add registry entries on both cluster nodes of the SAP ASCS/SCS instance

Azure Load Balancer has an internal load balancer that closes connections when the connections are idle for a set period of time (an idle timeout). SAP work processes in dialog instances open connections to the SAP enqueue process as soon as the first enqueue/dequeue request needs to be sent. These connections usually remain established until the work process or the enqueue process restarts. However, if the connection is idle for a set period of time, the Azure internal load balancer closes the connections. This isn't a problem because the SAP work process reestablishes the connection to the enqueue process if it no longer exists. These activities are documented in the developer traces of SAP processes, but they create a large amount of extra content in those traces. It's a good idea to change the TCP/IP `KeepAliveTime` and `KeepAliveInterval` on both cluster nodes. Combine these changes in the TCP/IP parameters with SAP profile parameters, described later in the article.

To add registry entries on both cluster nodes of the SAP ASCS/SCS instance, first, add these Windows registry entries on both Windows cluster nodes for SAP ASCS/SCS:

| Path | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |
| --- | --- |
| Variable name |`KeepAliveTime` |
| Variable type |REG_DWORD (Decimal) |
| Value |120000 |
| Link to documentation |[https://technet.microsoft.com/library/cc957549.aspx](https://technet.microsoft.com/library/cc957549.aspx) |

**Table 3:** Change the first TCP/IP parameter

Then, add this Windows registry entry on both Windows cluster nodes for SAP ASCS/SCS:

| Path | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters |
| --- | --- |
| Variable name |`KeepAliveInterval` |
| Variable type |REG_DWORD (Decimal) |
| Value |120000 |
| Link to documentation |[https://technet.microsoft.com/library/cc957548.aspx](https://technet.microsoft.com/library/cc957548.aspx) |

**Table 4:** Change the second TCP/IP parameter

To apply the changes, restart both cluster nodes.

## <a name="0d67f090-7928-43e0-8772-5ccbf8f59aab"></a> Set up a Windows Server failover cluster for an SAP ASCS/SCS instance

Setting up a Windows Server failover cluster for an SAP ASCS/SCS instance involves these tasks:

- Collect the cluster nodes in a cluster configuration.
- Configure a cluster file share witness.

### <a name="5eecb071-c703-4ccc-ba6d-fe9c6ded9d79"></a> Collect the cluster nodes in a cluster configuration

1. In the Add Role and Features Wizard, add failover clustering to both cluster nodes.
2. Set up the failover cluster by using Failover Cluster Manager. In Failover Cluster Manager, select **Create Cluster**, and then add only the name of the first cluster (node A). Do not add the second node yet; you add the second node in a later step.

   ![Figure 8: Add the server or virtual machine name of the first cluster node][sap-ha-guide-figure-3007]

   _**Figure 8:** Add the server or virtual machine name of the first cluster node_

3. Enter the network name (virtual host name) of the cluster.

   ![Figure 9: Enter the cluster name][sap-ha-guide-figure-3008]

   _**Figure 9:** Enter the cluster name_

4. After you've created the cluster, run a cluster validation test.

   ![Figure 10: Run the cluster validation check][sap-ha-guide-figure-3009]

   _**Figure 10:** Run the cluster validation check_

   You can ignore any warnings about disks at this point in the process. You'll add a file share witness and the SIOS shared disks later. At this stage, you don't need to worry about having a quorum.

   ![Figure 11: No quorum disk is found][sap-ha-guide-figure-3010]

   _**Figure 11:** No quorum disk is found_

   ![Figure 12: A core cluster resource needs a new IP address][sap-ha-guide-figure-3011]

   _**Figure 12:** A core cluster resource needs a new IP address_

5. Change the IP address of the core cluster service. The cluster can't start until you change the IP address of the core cluster service, because the IP address of the server points to one of the virtual machine nodes. Do this on the **Properties** page of the core cluster service's IP resource.

   For example, we need to assign an IP address (in our example, 10.0.0.42) for the cluster virtual host name pr1-ascs-vir.

   ![Figure 13: In the Properties dialog box, change the IP address][sap-ha-guide-figure-3012]

   _**Figure 13:** In the **Properties** dialog box, change the IP address_

   ![Figure 14: Assign the IP address that is reserved for the cluster][sap-ha-guide-figure-3013]

   _**Figure 14:** Assign the IP address that is reserved for the cluster_

6. Bring the cluster virtual host name online.

   ![Figure 15: The cluster core service is up and running, with the correct IP address][sap-ha-guide-figure-3014]

   _**Figure 15:** The cluster core service is up and running, with the correct IP address_

7. Add the second cluster node.

   Now that the core cluster service is up and running, you can add the second cluster node.

   ![Figure 16 Add the second cluster node][sap-ha-guide-figure-3015]

   _**Figure 16:** Add the second cluster node_

8. Enter a name for the second cluster node host.

   ![Figure 17: Enter the second cluster node host name][sap-ha-guide-figure-3016]

   _**Figure 17:** Enter the second cluster node host name_

   > [!IMPORTANT]
   > Be sure that the **Add all eligible storage to the cluster** check box is *not* selected.  
   >
   >

   ![Figure 18: Do not select the check box][sap-ha-guide-figure-3017]

   _**Figure 18:** Do *not* select the check box_

   You can ignore warnings about quorum and disks. You'll set the quorum and share the disk later, as described in [Install SIOS DataKeeper Cluster Edition for an SAP ASCS/SCS cluster share disk][sap-high-availability-infrastructure-wsfc-shared-disk-install-sios].

   ![Figure 19: Ignore warnings about the disk quorum][sap-ha-guide-figure-3018]

   _**Figure 19:** Ignore warnings about the disk quorum_


#### <a name="e49a4529-50c9-4dcf-bde7-15a0c21d21ca"></a> Configure a cluster file share witness

Configuring a cluster file share witness involves these tasks:

- Create a file share.
- Set the file share witness quorum in Failover Cluster Manager.

#### <a name="06260b30-d697-4c4d-b1c9-d22c0bd64855"></a> Create a file share

1. Select a file share witness instead of a quorum disk. SIOS DataKeeper supports this option.

   In the examples in this article, the file share witness is on the Active Directory or DNS server that is running in Azure. The file share witness is called domcontr-0. Because you would have configured a VPN connection to Azure (via VPN Gateway or Azure ExpressRoute), your Active Directory or DNS service is on-premises and isn't suitable to run a file share witness.

   > [!NOTE]
   > If your Active Directory or DNS service runs only on-premises, don't configure your file share witness on the Active Directory or DNS Windows operating system that is running on-premises. Network latency between cluster nodes running in Azure and Active Directory or DNS on-premises might be too large and cause connectivity issues. Be sure to configure the file share witness on an Azure virtual machine that is running close to the cluster node.  
   >
   >

   The quorum drive needs at least 1,024 MB of free space. We recommend 2,048 MB of free space for the quorum drive.

2. Add the cluster name object.

   ![Figure 20: Assign the permissions on the share for the cluster name object][sap-ha-guide-figure-3019]

   _**Figure 20:** Assign the permissions on the share for the cluster name object_

   Be sure that the permissions include the authority to change data in the share for the cluster name object (in our example, pr1-ascs-vir$).

3. To add the cluster name object to the list, select **Add**. Change the filter to check for computer objects, in addition to those shown in Figure 22.

   ![Figure 21: Change Object Types to include computers][sap-ha-guide-figure-3020]

   _**Figure 21:** Change **Object Types** to include computers_

   ![Figure 22: Select the Computers check box][sap-ha-guide-figure-3021]

   _**Figure 22:** Select the **Computers** check box_

4. Enter the cluster name object as shown in Figure 21. Because the record has already been created, you can change the permissions, as shown in Figure 20.

5. Select the **Security** tab of the share, and then set more detailed permissions for the cluster name object.

   ![Figure 23: Set the security attributes for the cluster name object on the file share quorum][sap-ha-guide-figure-3022]

   _**Figure 23:** Set the security attributes for the cluster name object on the file share quorum_

#### <a name="4c08c387-78a0-46b1-9d27-b497b08cac3d"></a> Set the file share witness quorum in Failover Cluster Manager

1. Open the Configure Quorum Setting Wizard.

   ![Figure 24: Start the Configure Cluster Quorum Setting Wizard][sap-ha-guide-figure-3023]

   _**Figure 24:** Start the Configure Cluster Quorum Setting Wizard_

2. On the **Select Quorum Configuration Option** page, select **Select the quorum witness**.

   ![Figure 25: Quorum configurations you can choose from][sap-ha-guide-figure-3024]

   _**Figure 25:** Quorum configurations you can choose from_

3. On the **Select Quorum Witness** page, select **Configure a file share witness**.

   ![Figure 26: Select the file share witness][sap-ha-guide-figure-3025]

   _**Figure 26:** Select the file share witness_

4. Enter the UNC path to the file share (in our example, \\domcontr-0\FSW). To see a list of the changes you can make, select **Next**.

   ![Figure 27: Define the file share location for the witness share][sap-ha-guide-figure-3026]

   _**Figure 27:** Define the file share location for the witness share_

5. Select the changes you want, and then select **Next**. You need to successfully reconfigure the cluster configuration as shown in Figure 28:  

   ![Figure 28: Confirmation that you've reconfigured the cluster][sap-ha-guide-figure-3027]

   _**Figure 28:** Confirmation that you've reconfigured the cluster_

After you successfully install the Windows failover cluster, you need to change some thresholds so they adapt failover detection to conditions in Azure. The parameters to be changed are documented in [Tuning failover cluster network thresholds][tuning-failover-cluster-network-thresholds]. Assuming that your two VMs that make up the Windows cluster configuration for ASCS/SCS are in the same subnet, change the following parameters to these values:

- SameSubNetDelay = 2000
- SameSubNetThreshold = 15
- RoutingHistoryLength = 30

These settings were tested with customers, and offer a good compromise. They are resilient enough, but they also provide failover that is fast enough in real error conditions on an SAP software or in a node or VM failure.

### <a name="5c8e5482-841e-45e1-a89d-a05c0907c868"></a> Install SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk

You now have a working Windows Server failover clustering configuration in Azure. To install an SAP ASCS/SCS instance, you need a shared disk resource. You cannot create the shared disk resources you need in Azure. SIOS DataKeeper Cluster Edition is a third-party solution that you can use to create shared disk resources.

Installing SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk involves these tasks:

- Add Microsoft .NET Framework 3.5.
- Install SIOS DataKeeper.
- Set up SIOS DataKeeper.

### <a name="1c2788c3-3648-4e82-9e0d-e058e475e2a3"></a> Add .NET Framework 3.5
.NET Framework 3.5 isn't automatically activated or installed on Windows Server 2012 R2. Because SIOS DataKeeper requires .NET to be on all nodes where you install DataKeeper, you must install .NET Framework 3.5 on the guest operating system of all virtual machines in the cluster.

There are two ways to add .NET Framework 3.5:

- Use the Add Roles and Features Wizard in Windows, as shown in Figure 29:

  ![Figure 29: Install .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3028]

  _**Figure 29:** Install .NET Framework 3.5 by using the Add Roles and Features Wizard_

  ![Figure 30: Installation progress bar when you install .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3029]

  _**Figure 30:** Installation progress bar when you install .NET Framework 3.5 by using the Add Roles and Features Wizard_

- Use the dism.exe command-line tool. For this type of installation, you need to access the SxS directory on the Windows installation media. At an elevated command prompt, enter this command:

  ```
  Dism /online /enable-feature /featurename:NetFx3 /All /Source:installation_media_drive:\sources\sxs /LimitAccess
  ```

### <a name="dd41d5a2-8083-415b-9878-839652812102"></a> Install SIOS DataKeeper

Install SIOS DataKeeper Cluster Edition on each node in the cluster. To create virtual shared storage with SIOS DataKeeper, create a synced mirror and then simulate cluster shared storage.

Before you install the SIOS software, create the DataKeeperSvc domain user.

> [!NOTE]
> Add the DataKeeperSvc domain user to the Local Administrator group on both cluster nodes.
>
>

To install SIOS DataKeeper:

1. Install the SIOS software on both cluster nodes.

   ![SIOS installer][sap-ha-guide-figure-3030]

   ![Figure 31: First page of the SIOS DataKeeper installation][sap-ha-guide-figure-3031]

   _**Figure 31:** First page of the SIOS DataKeeper installation_

2. In the dialog box, select **Yes**.

   ![Figure 32: DataKeeper informs you that a service will be disabled][sap-ha-guide-figure-3032]

   _**Figure 32:** DataKeeper informs you that a service will be disabled_

3. In the dialog box, we recommend that you select **Domain or Server account**.

   ![Figure 33: User selection for SIOS DataKeeper][sap-ha-guide-figure-3033]

   _**Figure 33:** User selection for SIOS DataKeeper_

4. Enter the domain account user name and password that you created for SIOS DataKeeper.

   ![Figure 34: Enter the domain user name and password for the SIOS DataKeeper installation][sap-ha-guide-figure-3034]

   _**Figure 34:** Enter the domain user name and password for the SIOS DataKeeper installation_

5. Install the license key for your SIOS DataKeeper instance, as shown in Figure 35.

   ![Figure 35: Enter your SIOS DataKeeper license key][sap-ha-guide-figure-3035]

   _**Figure 35:** Enter your SIOS DataKeeper license key_

6. When prompted, restart the virtual machine.

### <a name="d9c1fc8e-8710-4dff-bec2-1f535db7b006"></a> Set up SIOS DataKeeper

After you install SIOS DataKeeper on both nodes, start the configuration. The goal of the configuration is to have synchronous data replication between the additional disks that are attached to each of the virtual machines.

1. Start the DataKeeper Management and Configuration tool, and then select **Connect Server**.

   ![Figure 36: SIOS DataKeeper Management and Configuration tool][sap-ha-guide-figure-3036]

   _**Figure 36:** SIOS DataKeeper Management and Configuration tool_

2. Enter the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and, in a second step, the second node.

   ![Figure 37: Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node][sap-ha-guide-figure-3037]

   _**Figure 37:** Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node_

3. Create the replication job between the two nodes.

   ![Figure 38: Create a replication job][sap-ha-guide-figure-3038]

   _**Figure 38:** Create a replication job_

   A wizard guides you through the process of creating a replication job.

4. Define the name of the replication job.

   ![Figure 39: Define the name of the replication job][sap-ha-guide-figure-3039]

   _**Figure 39:** Define the name of the replication job_

   ![Figure 40: Define the base data for the node, which should be the current source node][sap-ha-guide-figure-3040]

   _**Figure 40:** Define the base data for the node, which should be the current source node_

5. Define the name, TCP/IP address, and disk volume of the target node.

   ![Figure 41: Define the name, TCP/IP address, and disk volume of the current target node][sap-ha-guide-figure-3041]

   _**Figure 41:** Define the name, TCP/IP address, and disk volume of the current target node_

6. Define the compression algorithms. In our example, we recommend that you compress the replication stream. Especially in resynchronization situations, the compression of the replication stream dramatically reduces resynchronization time. Compression uses the CPU and RAM resources of a virtual machine. As the compression rate increases, so does the volume of CPU resources that are used. You can adjust this setting later.

7. Another setting you need to check is whether the replication occurs asynchronously or synchronously. When you protect SAP ASCS/SCS configurations, you must use synchronous replication.  

   ![Figure 42: Define replication details][sap-ha-guide-figure-3042]

   _**Figure 42:** Define replication details_

8. Define whether the volume that is replicated by the replication job should be represented to a Windows Server failover cluster configuration as a shared disk. For the SAP ASCS/SCS configuration, select **Yes** so that the Windows cluster sees the replicated volume as a shared disk that it can use as a cluster volume.

   ![Figure 43: Select Yes to set the replicated volume as a cluster volume][sap-ha-guide-figure-3043]

   _**Figure 43:** Select **Yes** to set the replicated volume as a cluster volume_

   After the volume is created, the DataKeeper Management and Configuration tool shows that the replication job is active.

   ![Figure 44: DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active][sap-ha-guide-figure-3044]

   _**Figure 44:** DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active_

   Failover Cluster Manager now shows the disk as a DataKeeper disk, as shown in Figure 45:

   ![Figure 45: Failover Cluster Manager shows the disk that DataKeeper replicated][sap-ha-guide-figure-3045]

   _**Figure 45:** Failover Cluster Manager shows the disk that DataKeeper replicated_

## Next steps

* [Install SAP NetWeaver HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]
