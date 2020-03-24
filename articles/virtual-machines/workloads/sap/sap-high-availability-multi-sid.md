---
title: Create an SAP multi-SID configuration in Azure | Microsoft Docs
description: Guide to high-availability SAP NetWeaver multi-SID configuration on Windows virtual machines
services: virtual-machines-windows, virtual-network, storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 0b89b4f8-6d6c-45d7-8d20-fe93430217ca
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 05/05/2017
ms.author: radeltch
ms.custom: H1Hack27Feb2017

---

# Create an SAP NetWeaver multi-SID configuration

[load-balancer-multivip-overview]:../../../load-balancer/load-balancer-multivip-overview.md
[sap-ha-guide]:sap-high-availability-guide.md 
[sap-ha-guide-figure-6001]:./media/virtual-machines-shared-sap-high-availability-guide/6001-sap-multi-sid-ascs-scs-sid1.png
[sap-ha-guide-figure-6002]:./media/virtual-machines-shared-sap-high-availability-guide/6002-sap-multi-sid-ascs-scs.png
[sap-ha-guide-figure-6003]:./media/virtual-machines-shared-sap-high-availability-guide/6003-sap-multi-sid-full-landscape.png
[sap-ha-guide-figure-6004]:./media/virtual-machines-shared-sap-high-availability-guide/6004-sap-multi-sid-dns.png
[sap-ha-guide-figure-6005]:./media/virtual-machines-shared-sap-high-availability-guide/6005-sap-multi-sid-azure-portal.png
[sap-ha-guide-figure-6006]:./media/virtual-machines-shared-sap-high-availability-guide/6006-sap-multi-sid-sios-replication.png
[networking-limits-azure-resource-manager]:../../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits
[sap-ha-guide-9.1.1]:sap-high-availability-guide.md#a97ad604-9094-44fe-a364-f89cb39bf097 
[sap-ha-guide-8.8]:sap-high-availability-guide.md#f19bd997-154d-4583-a46e-7f5a69d0153c
[sap-ha-guide-8.12.3.3]:sap-high-availability-guide.md#d9c1fc8e-8710-4dff-bec2-1f535db7b006 
[sap-ha-guide-9]:sap-high-availability-guide.md#a06f0b49-8a7a-42bf-8b0d-c12026c5746b
[sap-ha-guide-9.1]:sap-high-availability-guide.md#31c6bd4f-51df-4057-9fdf-3fcbc619c170 
[sap-ha-guide-9.1.2]:sap-high-availability-guide.md#eb5af918-b42f-4803-bb50-eff41f84b0b0 
[sap-ha-guide-9.1.3]:sap-high-availability-guide.md#e4caaab2-e90f-4f2c-bc84-2cd2e12a9556 
[sap-ha-guide-9.1.4]:sap-high-availability-guide.md#10822f4f-32e7-4871-b63a-9b86c76ce761 
[sap-ha-guide-9.4]:sap-high-availability-guide.md#094bc895-31d4-4471-91cc-1513b64e406a 
[sap-ha-guide-9.5]:sap-high-availability-guide.md#2477e58f-c5a7-4a5d-9ae3-7b91022cafb5 
[sap-ha-guide-9.6]:sap-high-availability-guide.md#0ba4a6c1-cc37-4bcf-a8dc-025de4263772 
[sap-ha-guide-10]:sap-high-availability-guide.md#18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9

In September 2016, Microsoft released a feature where you can manage multiple virtual IP addresses by using an Azure internal load balancer. This functionality already exists in the Azure external load balancer.

If you have an SAP deployment, you can use an internal load balancer to create a Windows cluster configuration for SAP ASCS/SCS, as documented in the [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide].

This article focuses on how to move from a single ASCS/SCS installation to an SAP multi-SID configuration by installing additional SAP ASCS/SCS clustered instances into an existing Windows Server Failover Clustering (WSFC) cluster. When this process is completed, you will have configured an SAP multi-SID cluster.

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

## Prerequisites
You have already configured a WSFC cluster that is used for one SAP ASCS/SCS instance, as discussed in the [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide] and as shown in this diagram.

![High-availability SAP ASCS/SCS instance][sap-ha-guide-figure-6001]

## Target architecture

The goal is to install multiple SAP ABAP ASCS or SAP Java SCS clustered instances in the same WSFC cluster, as illustrated here:

![Multiple SAP ASCS/SCS clustered instances in Azure][sap-ha-guide-figure-6002]

> [!NOTE]
>There is a limit to the number of private front-end IPs for each Azure internal load balancer.
>
>The maximum number of SAP ASCS/SCS instances in one WSFC cluster is equal to the maximum number of private front-end IPs for each Azure internal load balancer.
>

For more information about load-balancer limits, see "Private front end IP per load balancer" in [Networking limits: Azure Resource Manager][networking-limits-azure-resource-manager].

The complete landscape with two high-availability SAP systems would look like this:

![SAP high-availability multi-SID setup with two SAP system SIDs][sap-ha-guide-figure-6003]

> [!IMPORTANT]
> The setup must meet the following conditions:
> - The SAP ASCS/SCS instances must share the same WSFC cluster.
> - Each DBMS SID must have its own dedicated WSFC cluster.
> - SAP application servers that belong to one SAP system SID must have their own dedicated VMs.


## Prepare the infrastructure
To prepare your infrastructure, you can install an additional SAP ASCS/SCS instance with the following parameters:

| Parameter name | Value |
| --- | --- |
| SAP ASCS/SCS SID |pr1-lb-ascs |
| SAP DBMS internal load balancer | PR5 |
| SAP virtual host name | pr5-sap-cl |
| SAP ASCS/SCS virtual host IP address (additional Azure load balancer IP address) | 10.0.0.50 |
| SAP ASCS/SCS instance number | 50 |
| ILB probe port for additional SAP ASCS/SCS instance | 62350 |

> [!NOTE]
> For SAP ASCS/SCS cluster instances, each IP address requires a unique probe port. For example, if one IP address on an Azure internal load balancer uses probe port 62300, no other IP address on that load balancer can use probe port 62300.
>
>For our purposes, because probe port 62300 is already reserved, we are using probe port 62350.

You can install additional SAP ASCS/SCS instances in the existing WSFC cluster with two nodes:

| Virtual machine role | Virtual machine host name | Static IP address |
| --- | --- | --- |
| 1st cluster node for ASCS/SCS instance |pr1-ascs-0 |10.0.0.10 |
| 2nd cluster node for ASCS/SCS instance |pr1-ascs-1 |10.0.0.9 |

### Create a virtual host name for the clustered SAP ASCS/SCS instance on the DNS server

You can create a DNS entry for the virtual host name of the ASCS/SCS instance by using the following parameters:

| New SAP ASCS/SCS virtual host name | Associated IP address |
| --- | --- |
|pr5-sap-cl |10.0.0.50 |

The new host name and IP address are displayed in the DNS Manager, as shown in the following screenshot:

![DNS Manager list highlighting the defined DNS entry for the new SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-6004]

The procedure for creating a DNS entry is also described in detail in the main [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide-9.1.1].

> [!NOTE]
> The new IP address that you assign to the virtual host name of the additional ASCS/SCS instance must be the same as the new IP address that you assigned to the SAP Azure load balancer.
>
>In our scenario, the IP address is 10.0.0.50.

### Add an IP address to an existing Azure internal load balancer by using PowerShell

To create more than one SAP ASCS/SCS instance in the same WSFC cluster, use PowerShell to add an IP address to an existing Azure internal load balancer. Each IP address requires its own load-balancing rules, probe port, front-end IP pool, and back-end pool.

The following script adds a new IP address to an existing load balancer. Update the PowerShell variables for your environment. The script will create all needed load-balancing rules for all SAP ASCS/SCS ports.

```powershell

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

# Get the Azure VNet and subnet
$VNet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName
$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName

# Add second front-end and probe configuration
Write-Host "Adding new front end IP Pool '$FrontEndConfigurationName' ..." -ForegroundColor Green
$ILB | Add-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.Id
$ILB | Add-AzLoadBalancerProbeConfig -Name $LBProbeName  -Protocol Tcp -Port $Probeport -ProbeCount 2 -IntervalInSeconds 10  | Set-AzLoadBalancer

# Get new updated configuration
$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName
# Get new updated LP FrontendIP COnfig
$FEConfig = Get-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -LoadBalancer $ILB
$HealthProbe  = Get-AzLoadBalancerProbeConfig -Name $LBProbeName -LoadBalancer $ILB

# Add new back-end configuration into existing ILB
$BackEndConfigurationName  = "backendPoolASCS$count"
Write-Host "Adding new backend Pool '$BackEndConfigurationName' ..." -ForegroundColor Green
$BEConfig = Add-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB | Set-AzLoadBalancer

# Get new updated config
$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName

# Assign VM NICs to backend pool
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
After the script has run, the results are displayed in the Azure portal, as shown in the following screenshot:

![New front-end IP pool in the Azure portal][sap-ha-guide-figure-6005]

### Add disks to cluster machines, and configure the SIOS cluster share disk

You must add a new cluster share disk for each additional SAP ASCS/SCS instance. For Windows Server 2012 R2, the WSFC cluster share disk currently in use is the SIOS DataKeeper software solution.

Do the following:
1. Add an additional disk or disks of the same size (which you need to stripe) to each of the cluster nodes, and format them.
2. Configure storage replication with SIOS DataKeeper.

This procedure assumes that you have already installed SIOS DataKeeper on the WSFC cluster machines. If you have installed it, you must now configure replication between the machines. The process is described in detail in the main [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide-8.12.3.3].  

![DataKeeper synchronous mirroring for the new SAP ASCS/SCS share disk][sap-ha-guide-figure-6006]

### Deploy VMs for SAP application servers and DBMS cluster

To complete the infrastructure preparation for the second SAP system, do the following:

1. Deploy dedicated VMs for SAP application servers and put them in their own dedicated availability group.
2. Deploy dedicated VMs for DBMS cluster and put them in their own dedicated availability group.


## Install the second SAP SID2 NetWeaver system

The complete process of installing a second SAP SID2 system is described in the main [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide-9].

The high-level procedure is as follows:

1. [Install the SAP first cluster node][sap-ha-guide-9.1.2].  
 In this step, you are installing SAP with a high-availability ASCS/SCS instance on the **EXISTING WSFC cluster node 1**.

2. [Modify the SAP profile of the ASCS/SCS instance][sap-ha-guide-9.1.3].

3. [Configure a probe port][sap-ha-guide-9.1.4].  
 In this step, you are configuring an SAP cluster resource SAP-SID2-IP probe port by using PowerShell. Execute this configuration on one of the SAP ASCS/SCS cluster nodes.

4. [Install the database instance][sap-ha-guide-9.2].  
 In this step, you are installing DBMS on a dedicated WSFC cluster.

5. [Install the second cluster node][sap-ha-guide-9.3].  
 In this step, you are installing SAP with a high-availability ASCS/SCS instance on the existing WSFC cluster node 2.

6. Open Windows Firewall ports for the SAP ASCS/SCS instance and ProbePort.  
 On both cluster nodes that are used for SAP ASCS/SCS instances, you are opening all Windows Firewall ports that are used by SAP ASCS/SCS. These ports are listed in the [guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide-8.8].  
 Also open the Azure internal load balancer probe port, which is 62350 in our scenario.

7. [Change the start type of the SAP ERS Windows service instance][sap-ha-guide-9.4].

8. [Install the SAP primary application server][sap-ha-guide-9.5] on the new dedicated VM.

9. [Install the SAP additional application server][sap-ha-guide-9.6] on the new dedicated VM.

10. [Test the SAP ASCS/SCS instance failover and SIOS replication][sap-ha-guide-10].

## Next steps

- [Networking limits: Azure Resource Manager][networking-limits-azure-resource-manager]
- [Multiple VIPs for Azure Load Balancer][load-balancer-multivip-overview]
- [Guide for high-availability SAP NetWeaver on Windows VMs][sap-ha-guide]
