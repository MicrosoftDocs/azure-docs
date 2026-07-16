---
title: SAP ASCS/SCS multi-SID high availability with Windows Server Failover Clustering and shared disk on Azure
description:  Learn how to implement multi-SID high availability for an SAP ASCS/SCS instance with Windows Server Failover Clustering and shared disk on Azure.
services: virtual-machines-windows,virtual-network,storage
ms.assetid: cbf18abe-41cb-44f7-bdec-966f32c89325
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.tgt_pltfrm: vm-windows
ms.date: 03/09/2026
ms.author: radeltch
ms.custom: H1Hack27Feb2017, devx-track-azurepowershell
# Customer intent: "As a system administrator, I want to implement a multi-SID high availability setup for SAP ASCS/SCS instances using Windows Server Failover Clustering on Azure, so that I can ensure enhanced reliability and performance for my SAP environment."
---

# SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and shared disk on Azure

![Windows OS][Logo_Windows] Windows

If you have an SAP deployment, you must use an internal load balancer to create a Windows cluster configuration for Advanced Business Application Programming SAP Central Services (ASCS) or SAP Central Services (SCS) instances.

This article focuses on how to move from a single ASCS/SCS installation to an SAP multiple security identifier (SID) configuration. This operation is performed by installing an extra SAP ASCS/SCS clustered instance into an existing Windows Server failover cluster with shared disk. Symantec Internet Operations Solutions (SIOS) is used to simulate a shared disk. When the process is complete, an SAP multi-SID cluster is configured for use.

> [!NOTE]
> This feature is available only in the Azure Resource Manager deployment model. There's a limit on the number of private front-end IPs for each Azure internal load balancer. The maximum number of SAP ASCS/SCS instances in one Windows Server failover cluster is equal to the maximum number of private front-end IPs for each Azure internal load balancer.

For more information about load-balancer limits, see the "Private front-end IP per load balancer" section in [Networking limits: Azure Resource Manager][networking-limits-azure-resource-manager].

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## SAP ASCS/SCS multi-SID architecture with shared disk

The goal is to install multiple SAP ASCS or SAP Java SCS clustered instances in the same Windows Server failover cluster as illustrated:

![A diagram of a Windows Server failover cluster with multiple SAP ASCS/SCS clustered instances in Azure.][sap-ha-guide-figure-6002]

For more information about load-balancer limits, see the "Private front-end IP per load balancer" section in [Networking limits: Azure Resource Manager][networking-limits-azure-resource-manager].

The complete landscape with two high-availability SAP systems would look like this:

![A diagram of a Windows Server failover cluster with SAP high availability multi-SID setup with two SAP system SIDs.][sap-ha-guide-figure-6003]

## Prerequisites

This article assumes you configured a Windows Server failover cluster prior for one SAP ASCS/SCS instance by using a **file share**, as shown in this diagram:

![A diagram of a Windows Server failover cluster with high availability SAP ASCS/SCS instance.][sap-ha-guide-figure-6001]

* The SAP ASCS/SCS instances must share the same Windows Server failover cluster.
* Each database management system (DBMS) SID must have its own dedicated Windows Server failover cluster.
* SAP application servers that belong to one SAP system SID must have their own dedicated virtual machines (VMs).

> [!NOTE]
> A mix of Enqueue Replication Server 1 and Enqueue Replication Server 2 in the same cluster isn't supported.

## Prepare the infrastructure for an SAP multi-SID scenario

To prepare your infrastructure, you can install an extra SAP ASCS/SCS instance with the following parameters:

| Parameter name | Value |
| --- | --- |
| SAP ASCS/SCS SID | pr1-lb-ascs |
| SAP DBMS internal load balancer | PR5 |
| SAP virtual host name | pr5-sap-cl |
| SAP ASCS/SCS virtual host IP address (extra Azure load balancer IP address) | 10.0.0.50 |
| SAP ASCS/SCS instance number | 50 |
| Internal Load Balancer (ILB) probe port for the extra SAP ASCS/SCS instance | 62350 |

> [!NOTE]
> For SAP ASCS/SCS cluster instances, each IP address requires a unique probe port. For example, if one IP address on an Azure internal load balancer uses probe port **62300**, no other IP address on that load balancer can use probe port 62300.
>
> For our purposes, because probe port 62300 is already reserved, we're using probe port **62350**.

You can install extra SAP ASCS/SCS instances in the existing Windows Server failover cluster with two nodes:

| Virtual machine role | Virtual machine host name | Static IP address |
| --- | --- | --- |
| First cluster node for ASCS/SCS instance | pr1-ascs-0 | 10.0.0.10 |
| Second cluster node for ASCS/SCS instance | pr1-ascs-1 | 10.0.0.9 |

### Create a virtual host name for the clustered SAP ASCS/SCS instance on the DNS server

You can create a DNS entry for the virtual host name of the ASCS/SCS instance by using the following parameters:

| New SAP ASCS/SCS virtual host name | Associated IP address |
| --- | --- |
| pr5-sap-cl | 10.0.0.50 |

The new host name and IP address are displayed in DNS Manager, as shown in the following screenshot:

![A screenshot of DNS Manager highlighting the defined DNS entry for the new SAP ASCS/SCS cluster virtual name and TCP/IP address.][sap-ha-guide-figure-6004]

> [!NOTE]
> The new IP address that you assign to the virtual host name of the extra ASCS/SCS instance must be the same as the new IP address that you assigned to the SAP Azure load balancer.
>
> In our scenario, the IP address is **10.0.0.50**.

### Add an IP address to an existing Azure internal load balancer using PowerShell

To create more than one SAP ASCS/SCS instance in the same Windows Server failover cluster, use PowerShell to add an IP address to an existing Azure internal load balancer. Each IP address requires its own load-balancing rules, probe port, front-end IP pool, and back-end pool.

The following script adds a new IP address to an existing load balancer. Update the PowerShell variables for your environment. The script creates all the required load-balancing rules for all SAP ASCS/SCS ports.

```azurepowershell
# Select-AzSubscription -SubscriptionId <xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>
Clear-Host
$ResourceGroupName = "SAP-MULTI-SID-Landscape"      # Existing resource group name
$VNetName = "pr2-vnet"                        # Existing virtual network name
$SubnetName = "Subnet"                        # Existing subnet name
$ILBName = "pr2-lb-ascs"                      # Existing ILB name
$ILBIP = "10.0.0.50"                          # New IP address
$VMNames = "pr2-ascs-0","pr2-ascs-1"          # Existing cluster virtual machine names
$SAPInstanceNumber = 50                       # SAP ASCS/SCS instance number: must be a unique value for each cluster
[int]$ProbePort = "623$SAPInstanceNumber"     # Probe port: must be a unique value for each IP and load balancer

$ILB = Get-AzLoadBalancer -Name $ILBName -ResourceGroupName $ResourceGroupName

$count = $ILB.FrontendIpConfigurations.Count + 1
$FrontEndConfigurationName ="lbFrontendASCS$count"
$LBProbeName = "lbProbeASCS$count"

# Get the Azure virtual network and subnet
$VNet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName
$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName

# Add a second front-end and probe configuration
Write-Host "Adding new front end IP Pool '$FrontEndConfigurationName' ..." -ForegroundColor Green
$ILB | Add-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.Id
$ILB | Add-AzLoadBalancerProbeConfig -Name $LBProbeName  -Protocol Tcp -Port $Probeport -ProbeCount 2 -IntervalInSeconds 10  | Set-AzLoadBalancer

# Get a new updated configuration
$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName

# Get an updated LP FrontendIpConfig
$FEConfig = Get-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -LoadBalancer $ILB
$HealthProbe  = Get-AzLoadBalancerProbeConfig -Name $LBProbeName -LoadBalancer $ILB

# Add a back-end configuration into an existing ILB
$BackEndConfigurationName  = "backendPoolASCS$count"
Write-Host "Adding new backend Pool '$BackEndConfigurationName' ..." -ForegroundColor Green
$BEConfig = Add-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB | Set-AzLoadBalancer

# Get an updated config
$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName

# Assign VM NICs to the back-end pool
$BEPool = Get-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB
foreach($VMName in $VMNames){
        $VM = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName
        $NICName = ($VM.NetworkInterfaceIDs[0].Split('/') | select -last 1)
        $NIC = Get-AzNetworkInterface -name $NICName -ResourceGroupName $ResourceGroupName
        $NIC.IpConfigurations[0].LoadBalancerBackendAddressPools += $BEPool
        Write-Host "Assigning network card '$NICName' of the '$VMName' VM to the backend pool '$BackEndConfigurationName' ..." -ForegroundColor Green
        Set-AzNetworkInterface -NetworkInterface $NIC
        #start-AzVM -ResourceGroupName $ResourceGroupName -Name $VM.Name
}

# Create load-balancing rules
$Ports = "445","32$SAPInstanceNumber","33$SAPInstanceNumber","36$SAPInstanceNumber","39$SAPInstanceNumber","5985","81$SAPInstanceNumber","5$SAPInstanceNumber`13","5$SAPInstanceNumber`14","5$SAPInstanceNumber`16"
$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName
$FEConfig = get-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -LoadBalancer $ILB
$BEConfig = Get-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB
$HealthProbe  = Get-AzLoadBalancerProbeConfig -Name $LBProbeName -LoadBalancer $ILB

Write-Host "Creating load balancing rules for the ports: '$Ports' ... " -ForegroundColor Green

foreach ($Port in $Ports) {

        $LBConfigrulename = "lbrule$Port" + "_$count"
        Write-Host "Creating load balancing rule '$LBConfigrulename' for the port '$Port' ..." -ForegroundColor Green

        $ILB | Add-AzLoadBalancerRuleConfig -Name $LBConfigRuleName -FrontendIpConfiguration $FEConfig  -BackendAddressPool $BEConfig -Probe $HealthProbe -Protocol tcp -FrontendPort  $Port -BackendPort $Port -IdleTimeoutInMinutes 30 -LoadDistribution Default -EnableFloatingIP
}

$ILB | Set-AzLoadBalancer

Write-Host "Successfully added new IP '$ILBIP' to the internal load balancer '$ILBName'!" -ForegroundColor Green
```

Once the script completes, the results are displayed in the Azure portal, as shown in the following screenshot:

![A screenshot of the new front-end IP address pool in the Azure portal.][sap-ha-guide-figure-6005]

### Add disks to cluster machines and configure SIOS cluster-share disk


You must add a new cluster-share disk for each extra SAP ASCS/SCS instance. For Windows Server 2012 R2, the Windows Server failover cluster share disk currently in use is the SIOS DataKeeper software solution.

Perform the following actions:

1. Add an extra disk or disks of the same size (which you need to stripe) to each of the cluster nodes, and format them.
1. Configure storage replication with SIOS DataKeeper.

This procedure assumes that you already installed SIOS DataKeeper on the Windows Server failover cluster machines. If you installed it, you must now configure replication between the machines. The process is described in detail in [Install SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk][sap-high-availability-infrastructure-wsfc-shared-disk-install-sios].

![A screenshot of DataKeeper performing synchronous mirroring for the new SAP ASCS/SCS share disk.][sap-ha-guide-figure-6006]

### Deploy VMs for SAP application servers and DBMS cluster

To complete the infrastructure preparation for the second SAP system, perform the following actions:

1. Deploy dedicated VMs for the SAP application servers, and put each in its own dedicated availability group.
1. Deploy dedicated VMs for the DBMS cluster, and put each in its own dedicated availability group.

## Install an SAP NetWeaver multi-SID system

For a description of the complete process of installing a second SAP SID2 system, see [SAP NetWeaver HA installation on Windows Failover Cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk].

The high-level procedure is as follows:

1. [Install SAP with a high-availability ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk-install-ascs].

   In this step, you're installing SAP with a high-availability ASCS/SCS instance on the existing Windows Server failover cluster node 1.

1. [Modify the SAP profile of the ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk-modify-ascs-profile].

1. [Configure a probe port][sap-high-availability-installation-wsfc-shared-disk-add-probe-port].

   In this step, you're configuring an SAP cluster resource SAP-SID2-IP probe port by using PowerShell. Execute this configuration on one of the SAP ASCS/SCS cluster nodes.

1. Install the database instance.

   To install the second cluster, follow the steps in the SAP installation guide.

1. Install the second cluster node.

   In this step, you're installing SAP with a high-availability ASCS/SCS instance on the existing Windows Server failover cluster node 2. To install the second cluster, follow the steps in the SAP installation guide.

1. Open Windows Firewall ports for the SAP ASCS/SCS instance and probe port.

   On both cluster nodes that are used for SAP ASCS/SCS instances, you're opening all Windows Firewall ports that are used by SAP ASCS/SCS. These SAP ASCS/SCS instance ports are listed in the chapter [SAP ASCS / SCS Ports][sap-net-weaver-ports-ascs-scs-ports]. For a list of all other SAP ports, see [TCP/IP ports of all SAP products][sap-net-weaver-ports].

   Also open the Azure internal load balancer probe port, which is **62350** in our scenario, as described in [Open the Windows Firewall probe port][sap-high-availability-installation-wsfc-shared-disk-win-firewall-probe-port].

1. Install the SAP primary application server on the new dedicated VM, as described in the SAP installation guide.

1. Install another SAP application server on the new dedicated VM, as described in the SAP installation guide.

1. [Test the SAP ASCS/SCS instance failover and SIOS replication][sap-high-availability-installation-wsfc-shared-disk-test-ascs-failover-and-sios-repl].

## Next steps

* [Networking limits: Azure Resource Manager][networking-limits-azure-resource-manager]
* [Multiple VIPs for Azure Load Balancer][load-balancer-multivip-overview]

[networking-limits-azure-resource-manager]:../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits
[load-balancer-multivip-overview]:../../load-balancer/load-balancer-multivip-overview.md

[sap-net-weaver-ports]:https://help.sap.com/viewer/ports
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-net-weaver-ports-ascs-scs-ports]:sap-high-availability-infrastructure-wsfc-shared-disk.md#create-azure-internal-load-balancer

[sap-high-availability-installation-wsfc-shared-disk-install-ascs]:sap-high-availability-installation-wsfc-shared-disk.md#install-sap-with-a-high-availability-ascsscs-instance
[sap-high-availability-installation-wsfc-shared-disk-modify-ascs-profile]:sap-high-availability-installation-wsfc-shared-disk.md#modify-the-sap-profile-of-the-ascsscs-instance
[sap-high-availability-installation-wsfc-shared-disk-add-probe-port]:sap-high-availability-installation-wsfc-shared-disk.md#add-a-probe-port
[sap-high-availability-installation-wsfc-shared-disk-win-firewall-probe-port]:sap-high-availability-installation-wsfc-shared-disk.md#open-the-windows-firewall-probe-port
[sap-high-availability-installation-wsfc-shared-disk-test-ascs-failover-and-sios-repl]:sap-high-availability-installation-wsfc-shared-disk.md#test-the-sap-ascsscs-instance-failover

[sap-high-availability-infrastructure-wsfc-shared-disk-install-sios]:sap-high-availability-infrastructure-wsfc-shared-disk.md#sios-datakeeper-cluster-edition-for-the-sap-ascsscs-cluster-share-disk

[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[sap-ha-guide-figure-6001]:media/virtual-machines-shared-sap-high-availability-guide/6001-sap-multi-sid-ascs-scs-sid1.png
[sap-ha-guide-figure-6002]:media/virtual-machines-shared-sap-high-availability-guide/6002-sap-multi-sid-ascs-scs.png
[sap-ha-guide-figure-6003]:media/virtual-machines-shared-sap-high-availability-guide/6003-sap-multi-sid-full-landscape.png
[sap-ha-guide-figure-6004]:media/virtual-machines-shared-sap-high-availability-guide/6004-sap-multi-sid-dns.png
[sap-ha-guide-figure-6005]:media/virtual-machines-shared-sap-high-availability-guide/6005-sap-multi-sid-azure-portal.png
[sap-ha-guide-figure-6006]:media/virtual-machines-shared-sap-high-availability-guide/6006-sap-multi-sid-sios-replication.png
