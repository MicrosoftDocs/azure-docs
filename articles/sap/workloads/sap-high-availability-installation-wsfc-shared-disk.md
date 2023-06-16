---
title: Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance in Azure | Microsoft Docs
description: Learn how to install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: 6209bcb3-5b20-4845-aa10-1475c576659f
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017

---

# Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance in Azure

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
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md


[sap-hana-ha]:sap-hana-high-availability.md
[sap-suse-ascs-ha]:high-availability-guide-suse.md

[planning-guide]:planning-guide.md
[planning-guide-11]:planning-guide.md
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f

[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md

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
[sap-ha-guide-figure-3046-ers2]:./media/virtual-machines-shared-sap-high-availability-guide/3046-dns-entry-sap-ers2-virtual-name-ip.png
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

This article describes how to install and configure a high-availability SAP system in Azure by using a Windows Server failover cluster and cluster shared disk for clustering an SAP ASCS/SCS instance. 
As described in [Architecture guide: Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk][sap-high-availability-guide-wsfc-shared-disk], there are two alternatives for *cluster shared disk*:

- [Azure shared disks](../../virtual-machines/disks-shared.md)
- Using [SIOS DataKeeper Cluster Edition](https://us.sios.com/products/sios-datakeeper/) to create mirrored storage, that will simulate clustered shared disk 

## Prerequisites

Before you begin the installation, review these documents:

* [Architecture guide: Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk][sap-high-availability-guide-wsfc-shared-disk]

* [Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk]

We don't describe the DBMS setup in this article because setups vary depending on the DBMS system you use. We assume that high-availability concerns with the DBMS are addressed with the functionalities that different DBMS vendors support for Azure. Examples are Always On or database mirroring for SQL Server and Oracle Data Guard for Oracle databases. The high availability scenarios for the DBMS are not covered in this article.

There are no special considerations when different DBMS services interact with a clustered SAP ASCS or SCS configuration in Azure.

> [!NOTE]
> The installation procedures of SAP NetWeaver ABAP systems, Java systems, and ABAP+Java systems are almost identical. The most significant difference is that an SAP ABAP system has one ASCS instance. The SAP Java system has one SCS instance. The SAP ABAP+Java system has one ASCS instance and one SCS instance running in the same Microsoft failover cluster group. Any installation differences for each SAP NetWeaver installation stack are explicitly mentioned. You can assume that the rest of the steps are the same.  

## <a name="31c6bd4f-51df-4057-9fdf-3fcbc619c170"></a>Install SAP with a high-availability ASCS/SCS instance

> [!IMPORTANT]
> If you use SIOS to present shared disk, don't place your page file on the SIOS DataKeeper mirrored volumes. You can leave your page file on the temporary drive D of an Azure virtual machine, which is the default. If it's not already there, move the Windows page file to drive D of your Azure virtual machine.  

Installing SAP with a high-availability ASCS/SCS instance involves these tasks:

* Create a virtual host name for the clustered SAP ASCS/SCS instance.
* Install SAP on the first cluster node.
* Modify the SAP profile of the ASCS/SCS instance.
* Add a probe port.
* Open the Windows firewall probe port.

### <a name="a97ad604-9094-44fe-a364-f89cb39bf097"></a>Create a virtual host name for the clustered SAP ASCS/SCS instance

1. In the Windows DNS manager, create a DNS entry for the virtual host name of the ASCS/SCS instance.

   > [!IMPORTANT]
   > The IP address that you assign to the virtual host name of the ASCS/SCS instance must be the same as the IP address that you assigned to Azure Load Balancer.  

   ![Figure 1: Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-3046]

   _Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address_

2. If are using the new SAP Enqueue Replication Server 2, which is also clustered instance, then you need to reserve in DNS a virtual host name for ERS2 as well. 

   > [!IMPORTANT]
   > The IP address that you assign to the virtual host name of the ERS2 instance must be the second the IP address that you assigned to Azure Load Balancer.    

   ![Figure 1A: Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-3046-ers2]

   _Define the DNS entry for the SAP ERS2 cluster virtual name and TCP/IP address_

3. To define the IP address that's assigned to the virtual host name, select **DNS Manager** > **Domain**.

   ![Figure 2: New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration][sap-ha-guide-figure-3047]

   _New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration_

### <a name="eb5af918-b42f-4803-bb50-eff41f84b0b0"></a> Install the SAP first cluster node

1. Execute the first cluster node option on cluster node A. Select:

   * **ABAP system**: **ASCS** instance number **00**
   * **Java system**: **SCS** instance number **01**
   * **ABAP+Java system**: **ASCS** instance number **00** and **SCS** instance number **01**

   > [!IMPORTANT]
   > Keep in mind that the configuration in the Azure internal load balancer load balancing rules(if using Basic SKU)  and the selected SAP instance numbers must match.

2. Follow the SAP described installation procedure. Make sure in the start installation option “First Cluster Node”, to choose “Cluster Shared Disk” as configuration option.

> [!TIP]
> The SAP installation documentation describes how to install the first ASCS/SCS cluster node.

### <a name="e4caaab2-e90f-4f2c-bc84-2cd2e12a9556"></a> Modify the SAP profile of the ASCS/SCS instance

If you have Enqueue Replication Server 1, add  SAP profile parameter `enque/encni/set_so_keepalive` as described below. The profile parameter prevents connections between SAP work processes and the enqueue server from closing when they are idle for too long. The SAP parameter  is not required for ERS2. 

1. Add this profile parameter to the SAP ASCS/SCS instance profile, if using ERS1.

   ```
   enque/encni/set_so_keepalive = true
   ```

   For both ERS1 and ERS2, make sure that the `keepalive` OS parameters are set as described in SAP note [1410736](https://launchpad.support.sap.com/#/notes/1410736).   

2. To apply the SAP profile parameter changes, restart the SAP ASCS/SCS instance.

### <a name="10822f4f-32e7-4871-b63a-9b86c76ce761"></a> Add a probe port

Use the internal load balancer's probe functionality to make the entire cluster configuration work with Azure Load Balancer. The Azure internal load balancer usually distributes the incoming workload equally between participating virtual machines.

However, this won't work in some cluster configurations because only one instance is active. The other instance is passive and can’t accept any of the workload. A probe functionality helps when the Azure internal load balancer detect which instance is active, and only target the active instance.  

> [!IMPORTANT]
> In this example configuration, the **ProbePort** is set to 620**Nr**. For SAP ASCS instance with number **00** it is 620**00**. You will need to adjust the configuration to match your SAP instance numbers and your SAP SID.

To add a probe port run this PowerShell Module on one of the cluster VMs:

- In the case of SAP ASC/SCS Instance 
   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID SID -ProbePort 62000
   ```

- If using ERS2, which is clustered. There is no need to configure probe port for ERS1, as it is not clustered.  
   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID SID -ProbePort 62001 -IsSAPERSClusteredInstance $True
   ```

 The code for function `Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource` would look like:
   ```powershell
    function Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource {

    <#
    .SYNOPSIS 
    Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer Health Probe Port on 'SAP $SAPSID IP' cluster resource.

    .DESCRIPTION
    Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer Health Probe Port on 'SAP $SAPSID IP' cluster resource.
    It will also restart SAP Cluster group (default behavior), to activate the changes. 

    You need to run it on one of the SAP ASCS/SCS Windows cluster nodes.

    Expectation is that SAP group is installed with official SWPM installation tool, which will set default expected naming convention for:
    - SAP Cluster Group:               'SAP $SAPSID'
    - SAP Cluster IP Address Resource: 'SAP $SAPSID IP' 

    .PARAMETER SAPSID 
    SAP SID - 3 characters staring with letter.

    .PARAMETER ProbePort 
    Azure Load Balancer Health Check Probe Port.

    .PARAMETER RestartSAPClusterGroup 
    Optional parameter. Default value is '$True', so SAP cluster group will be restarted to activate the changes.

    .PARAMETER IsSAPERSClusteredInstance 
    Optional parameter.Default value is '$False'.
    If set to $True , then handle clsutered new SAP ERS2 instance.

    .EXAMPLE 
    # Set probe port to 62000, on SAP cluster resource 'SAP AB1 IP', and restart the SAP cluster group 'SAP AB1', to activate the changes.
    Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 

    .EXAMPLE 
    # Set probe port to 62000, on SAP cluster resource 'SAP AB1 IP'. SAP cluster group 'SAP AB1' IS NOT restarted, therefore changes are NOT active.
    # To activate the changes you need to manualy restart 'SAP AB1' cluster group.
    Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 -RestartSAPClusterGroup $False

    .EXAMPLE 
    # Set probe port to 62001, on SAP cluster resource 'SAP AB1 ERS IP'. SAP cluster group 'SAP AB1 ERS' IS restarted, to activate the changes.
    Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 -IsSAPERSClusteredInstance $True

    #> 

        [CmdletBinding()]
        param(

            [Parameter(Mandatory=$True)]
            [ValidateNotNullOrEmpty()]  
            [ValidateLength(3,3)]      
            [string]$SAPSID,

            [Parameter(Mandatory=$True)]
            [ValidateNotNullOrEmpty()]        
            [int] $ProbePort,

            [Parameter(Mandatory=$False)] 
            [bool] $RestartSAPClusterGroup = $True,

            [Parameter(Mandatory=$False)] 
            [bool] $IsSAPERSClusteredInstance = $False
        )

        BEGIN{}

        PROCESS{
            try{                                      

                if($IsSAPERSClusteredInstance){
                    #Handle clustered SAP ERS Instance
                    $SAPClusterRoleName = "SAP $SAPSID ERS"
                    $SAPIPresourceName = "SAP $SAPSID ERS IP"            
                }else{
                    #Handle clustered SAP ASCS/SCS Instance
                    $SAPClusterRoleName = "SAP $SAPSID"
                    $SAPIPresourceName = "SAP $SAPSID IP"
                }

                $SAPIPResourceClusterParameters =  Get-ClusterResource $SAPIPresourceName | Get-ClusterParameter
                $IPAddress = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Address" }).Value
                $NetworkName = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Network" }).Value
                $SubnetMask = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "SubnetMask" }).Value
                $OverrideAddressMatch = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "OverrideAddressMatch" }).Value
                $EnableDhcp = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "EnableDhcp" }).Value
                $OldProbePort = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "ProbePort" }).Value

                $var = Get-ClusterResource | Where-Object {  $_.name -eq $SAPIPresourceName  }
                Write-Output "Current configuration parameters for SAP IP cluster resource '$SAPIPresourceName' are:" 

                Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter

                Write-Output " "
                Write-Output "Current probe port property of the SAP cluster resource '$SAPIPresourceName' is '$OldProbePort'." 
                Write-Output " "
                Write-Output "Setting the new probe port property of the SAP cluster resource '$SAPIPresourceName' to '$ProbePort' ..." 
                Write-Output " "

                $var | Set-ClusterParameter -Multiple @{"Address"=$IPAddress;"ProbePort"=$ProbePort;"Subnetmask"=$SubnetMask;"Network"=$NetworkName;"OverrideAddressMatch"=$OverrideAddressMatch;"EnableDhcp"=$EnableDhcp}

                Write-Output " "

                if($RestartSAPClusterGroup){
                    Write-Output ""
                    Write-Output "Activating changes..." 

                    Write-Output " "
                    Write-Output "Taking SAP cluster IP resource '$SAPIPresourceName' offline ..."
                    Stop-ClusterResource -Name $SAPIPresourceName
                    sleep 5

                    Write-Output "Starting SAP cluster role '$SAPClusterRoleName' ..."
                    Start-ClusterGroup -Name $SAPClusterRoleName

                    Write-Output "New ProbePort parameter is active." 
                    Write-Output " "

                    Write-Output "New configuration parameters for SAP IP cluster resource '$SAPIPresourceName':" 
                    Write-Output " " 
                    Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter
                }else
                {
                    Write-Output "SAP cluster role '$SAPClusterRoleName' is not restarted, therefore changes are not activated."
                }
            }
            catch{
               Write-Error  $_.Exception.Message
           }
        }
        END {}
    }

   ```

### <a name="4498c707-86c0-4cde-9c69-058a7ab8c3ac"></a> Open the Windows firewall probe port

Open a Windows firewall probe port on both cluster nodes. Use the following script to open a Windows firewall probe port. Update the PowerShell variables for your environment.  
If using ERS2, you will also need to open the firewall port for the ERS2 probe port.  

  ```powershell
    $ProbePort = 62000   # ProbePort of the Azure internal load balancer
    New-NetFirewallRule -Name AzureProbePort -DisplayName "Rule for Azure Probe Port" -Direction Inbound -Action Allow -Protocol TCP -LocalPort $ProbePort
  ```

## <a name="85d78414-b21d-4097-92b6-34d8bcb724b7"></a> Install the database instance

To install the database instance, follow the process that's described in the SAP installation documentation.

## <a name="8a276e16-f507-4071-b829-cdc0a4d36748"></a> Install the second cluster node

To install the second cluster, follow the steps that are described in the SAP installation guide.

## <a name="2477e58f-c5a7-4a5d-9ae3-7b91022cafb5"></a> Install the SAP Primary Application Server

Install the Primary Application Server (PAS) instance \<SID\>-di-0 on the virtual machine that you've designated to host the PAS. There are no dependencies on Azure. If using SIOS, there are no DataKeeper-specific settings.

## <a name="0ba4a6c1-cc37-4bcf-a8dc-025de4263772"></a> Install the SAP Additional Application Server

Install an SAP Additional Application Server (AAS) on all the virtual machines that you've designated to host an SAP Application Server instance. 

## <a name="18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9"></a> Test the SAP ASCS/SCS instance failover

For the outlined failover tests, we assume that SAP ASCS is active on node A.  

1. Verify that the SAP system can successfully failover from node A to node B
   Choose one of these options to initiate a failover of the SAP \<SID\> cluster group from cluster node A to cluster node B:
    - Failover Cluster Manager  
    - Failover Cluster PowerShell

    ```powershell
    $SAPSID = "PR1"     # SAP <SID>

    $SAPClusterGroup = "SAP $SAPSID"
    Move-ClusterGroup -Name $SAPClusterGroup

    ```

2. Restart cluster node A within the Windows guest operating system. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
3. Restart cluster node A from the Azure portal. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
4. Restart cluster node A by using Azure PowerShell. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.

5. Verification
   - After failover, verify that the the SAP \<SID\> cluster group is running on cluster node B. 

      ![Figure 8: In Failover Cluster Manager, the SAP \<SID\> cluster group is running on cluster node B][sap-ha-guide-figure-5002]

      _In Failover Cluster Manager, the SAP \<SID\> cluster group is running on cluster node B_

   - After failover, verify shared disk is now mounted on cluster node B. 
   - After failover, if using SIOS, verify that SIOS DataKeeper is replicating data from source volume drive S on cluster node B to target volume drive S on cluster node A. 

      ![Figure 9: SIOS DataKeeper replicates the local volume from cluster node B to cluster node A][sap-ha-guide-figure-5003]

      _SIOS DataKeeper replicates the local volume from cluster node B to cluster node A_