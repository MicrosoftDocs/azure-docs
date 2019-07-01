---
title: Configure Always On Availability Group Listeners – Microsoft Azure | Microsoft Docs
description: Configure Availability Group Listeners on the Azure Resource Manager model, using an internal load balancer with one or more IP addresses.
services: virtual-machines
documentationcenter: na
author: MikeRayMSFT
manager: craigg
editor: monicar
ms.assetid: 14b39cde-311c-4ddf-98f3-8694e01a7d3b
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/06/2019
ms.author: mikeray

---
# Configure one or more Always On availability group listeners - Resource Manager
This topic shows how to:

* Create an internal load balancer for SQL Server availability groups using PowerShell cmdlets.
* Add additional IP addresses to a load balancer for more than one availability group. 

An availability group listener is a virtual network name that clients connect to for database access. On Azure virtual machines, a load balancer holds the IP address for the listener. The load balancer routes traffic to the instance of SQL Server that is listening on the probe port. Usually, an availability group uses an internal load balancer. An Azure internal load balancer can host one or many IP addresses. Each IP address uses a specific probe port. This document shows how to use PowerShell to create a load balancer, or add IP addresses to an existing load balancer for SQL Server availability groups. 

The ability to assign multiple IP addresses to an internal load balancer is new to Azure and is only available in Resource Manager model. To complete this task, you need to have a SQL Server availability group deployed on Azure virtual machines in Resource Manager model. Both SQL Server virtual machines must belong to the same availability set. You can use the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) to automatically create the availability group in Azure Resource Manager. This template automatically creates the availability group, including the internal load balancer for you. If you prefer, you can [manually configure an Always On availability group](virtual-machines-windows-portal-sql-availability-group-tutorial.md).

This topic requires that your availability groups are already configured.  

Related topics include:

* [Configure AlwaysOn Availability Groups in Azure VM (GUI)](virtual-machines-windows-portal-sql-availability-group-tutorial.md)   
* [Configure a VNet-to-VNet connection by using Azure Resource Manager and PowerShell](../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]

[!INCLUDE [Start your PowerShell session](../../../../includes/sql-vm-powershell.md)]

## Verify PowerShell version

The examples in this article are tested using Azure PowerShell module version 5.4.1.

Verify your PowerShell module is 5.4.1 or later.

See [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

## Configure the Windows Firewall

Configure the Windows Firewall to allow SQL Server access. The firewall rules allow TCP connections to the ports use by the SQL Server instance, and the listener probe. For detailed instructions, see [Configure a Windows Firewall for Database Engine Access](https://msdn.microsoft.com/library/ms175043.aspx#Anchor_1). Create an inbound rule for the SQL Server port and for the probe port.

If you are restricting access with an Azure Network Security Group, ensure that the allow rules include the backend SQL Server VM IP addresses, and the load balancer floating IP addresses for the AG listener and the cluster core IP address, if applicable.

## Determine the load balancer SKU required

[Azure load balancer](../../../load-balancer/load-balancer-overview.md) is available in 2 SKUs: Basic & Standard. The standard load balancer is recommended. If the virtual machines are in an availability set, basic load balancer is permitted. Standard load balancer requires that all VM IP addresses use standard IP addresses.

The current [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) for an availability group uses a basic load balancer with basic IP addresses.

The examples in this article specify a standard load balancer. In the examples, the script includes `-sku Standard`.

```powershell
$ILB= New-AzLoadBalancer -Location $Location -Name $ILBName -ResourceGroupName $ResourceGroupName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -LoadBalancingRule $ILBRule -Probe $SQLHealthProbe -sku Standard
```

To create a basic load balancer, remove `-sku Standard` from the line that creates the load balancer. For example:

```powershell
$ILB= New-AzLoadBalancer -Location $Location -Name $ILBName -ResourceGroupName $ResourceGroupName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -LoadBalancingRule $ILBRule -Probe $SQLHealthProbe
```

## Example Script: Create an internal load balancer with PowerShell

> [!NOTE]
> If you created your availability group with the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md), the internal load balancer was already created.

The following PowerShell script creates an internal load balancer, configures the load balancing rules, and sets an IP address for the load balancer. To run the script, open Windows PowerShell ISE, and paste the script in the Script pane. Use `Connect-AzAccount` to log in to PowerShell. If you have multiple Azure subscriptions, use `Select-AzSubscription` to set the subscription. 

```powershell
# Connect-AzAccount
# Select-AzSubscription -SubscriptionId <xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>

$ResourceGroupName = "<Resource Group Name>" # Resource group name
$VNetName = "<Virtual Network Name>"         # Virtual network name
$SubnetName = "<Subnet Name>"                # Subnet name
$ILBName = "<Load Balancer Name>"            # ILB name
$Location = "<Azure Region>"                 # Azure location
$VMNames = "<VM1>","<VM2>"                   # Virtual machine names

$ILBIP = "<n.n.n.n>"                         # IP address
[int]$ListenerPort = "<nnnn>"                # AG listener port
[int]$ProbePort = "<nnnn>"                   # Probe port

$LBProbeName ="ILBPROBE_$ListenerPort"       # The Load balancer Probe Object Name              
$LBConfigRuleName = "ILBCR_$ListenerPort"    # The Load Balancer Rule Object Name

$FrontEndConfigurationName = "FE_SQLAGILB_1" # Object name for the front-end configuration 
$BackEndConfigurationName ="BE_SQLAGILB_1"   # Object name for the back-end configuration

$VNet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName 

$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName 

$FEConfig = New-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.id

$BEConfig = New-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName 

$SQLHealthProbe = New-AzLoadBalancerProbeConfig -Name $LBProbeName -Protocol tcp -Port $ProbePort -IntervalInSeconds 15 -ProbeCount 2

$ILBRule = New-AzLoadBalancerRuleConfig -Name $LBConfigRuleName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -Probe $SQLHealthProbe -Protocol tcp -FrontendPort $ListenerPort -BackendPort $ListenerPort -LoadDistribution Default -EnableFloatingIP 

$ILB= New-AzLoadBalancer -Location $Location -Name $ILBName -ResourceGroupName $ResourceGroupName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -LoadBalancingRule $ILBRule -Probe $SQLHealthProbe 

$bepool = Get-AzLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB 

foreach($VMName in $VMNames)
    {
        $VM = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $VMName 
        $NICName = ($vm.NetworkProfile.NetworkInterfaces.Id.split('/') | select -last 1)
        $NIC = Get-AzNetworkInterface -name $NICName -ResourceGroupName $ResourceGroupName
        $NIC.IpConfigurations[0].LoadBalancerBackendAddressPools = $BEPool
        Set-AzNetworkInterface -NetworkInterface $NIC
        start-AzVM -ResourceGroupName $ResourceGroupName -Name $VM.Name 
    }
```

## <a name="Add-IP"></a> Example script: Add an IP address to an existing load balancer with PowerShell
To use more than one availability group, add an additional IP address to the load balancer. Each IP address requires its own load balancing rule, probe port, and front port.

The front-end port is the port that applications use to connect to the SQL Server instance. IP addresses for different availability groups can use the same front-end port.

> [!NOTE]
> For SQL Server availability groups, each IP address requires a specific probe port. For example, if one IP address on a load balancer uses probe port 59999, no other IP addresses on that load balancer can use probe port 59999.

* For information about load balancer limits, see **Private front end IP per load balancer** under [Networking Limits - Azure Resource Manager](../../../azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).
* For information about availability group limits, see [Restrictions (Availability Groups)](https://msdn.microsoft.com/library/ff878487.aspx#RestrictionsAG).

The following script adds a new IP address to an existing load balancer. The ILB uses the listener port for the load balancing front-end port. This port can be the port that SQL Server is listening on. For default instances of SQL Server, the port is 1433. The load balancing rule for an availability group requires a floating IP (direct server return) so the back-end port is the same as the front-end port. Update the variables for your environment. 

```powershell
# Connect-AzAccount
# Select-AzSubscription -SubscriptionId <xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>

$ResourceGroupName = "<ResourceGroup>"          # Resource group name
$VNetName = "<VirtualNetwork>"                  # Virtual network name
$SubnetName = "<Subnet>"                        # Subnet name
$ILBName = "<ILBName>"                          # ILB name                      

$ILBIP = "<n.n.n.n>"                            # IP address
[int]$ListenerPort = "<nnnn>"                   # AG listener port
[int]$ProbePort = "<nnnnn>"                     # Probe port 

$ILB = Get-AzLoadBalancer -Name $ILBName -ResourceGroupName $ResourceGroupName 

$count = $ILB.FrontendIpConfigurations.Count+1
$FrontEndConfigurationName ="FE_SQLAGILB_$count"  

$LBProbeName = "ILBPROBE_$count"
$LBConfigrulename = "ILBCR_$count"

$VNet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName 
$Subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName

$ILB | Add-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.Id 

$ILB | Add-AzLoadBalancerProbeConfig -Name $LBProbeName  -Protocol Tcp -Port $Probeport -ProbeCount 2 -IntervalInSeconds 15  | Set-AzLoadBalancer 

$ILB = Get-AzLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName

$FEConfig = get-AzLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -LoadBalancer $ILB

$SQLHealthProbe  = Get-AzLoadBalancerProbeConfig -Name $LBProbeName -LoadBalancer $ILB

$BEConfig = Get-AzLoadBalancerBackendAddressPoolConfig -Name $ILB.BackendAddressPools[0].Name -LoadBalancer $ILB 

$ILB | Add-AzLoadBalancerRuleConfig -Name $LBConfigRuleName -FrontendIpConfiguration $FEConfig  -BackendAddressPool $BEConfig -Probe $SQLHealthProbe -Protocol tcp -FrontendPort  $ListenerPort -BackendPort $ListenerPort -LoadDistribution Default -EnableFloatingIP | Set-AzLoadBalancer   
```

## Configure the listener

[!INCLUDE [ag-listener-configure](../../../../includes/virtual-machines-ag-listener-configure.md)]

## Set the listener port in SQL Server Management Studio

1. Launch SQL Server Management Studio and connect to the primary replica.

1. Navigate to **AlwaysOn High Availability** | **Availability Groups** | **Availability Group Listeners**. 

1. You should now see the listener name that you created in Failover Cluster Manager. Right-click the listener name and click **Properties**.

1. In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort you used earlier (1433 was the default), then click **OK**.

## Test the connection to the listener

To test the connection:

1. RDP to a SQL Server that is in the same virtual network, but does not own the replica. This can be the other SQL Server in the cluster.

1. Use **sqlcmd** utility to test the connection. For example, the following script establishes a **sqlcmd** connection to the primary replica through the listener with Windows authentication:
   
    ```
    sqlcmd -S <listenerName> -E
    ```
   
    If the listener is using a port other than the default port (1433), specify the port in the connection string. For example, the following sqlcmd command connects to a listener at port 1435: 
   
    ```
    sqlcmd -S <listenerName>,1435 -E
    ```

The SQLCMD connection automatically connects to whichever instance of SQL Server hosts the primary replica. 

> [!NOTE]
> Make sure that the port you specify is open on the firewall of both SQL Servers. Both servers require an inbound rule for the TCP port that you use. See [Add or Edit Firewall Rule](https://technet.microsoft.com/library/cc753558.aspx) for more information. 
> 
> 

## Guidelines and limitations
Note the following guidelines on availability group listener in Azure using internal load balancer:

* With an internal load balancer, you only access the listener from within the same virtual network.

* If you are restricting access with an Azure Network Security Group, ensure that the allow rules include the backend SQL Server VM IP addresses, and the load balancer floating IP addresses for the AG listener and the cluster core IP address, if applicable.

## For more information
For more information, see [Configure Always On availability group in Azure VM manually](virtual-machines-windows-portal-sql-availability-group-tutorial.md).

## PowerShell cmdlets
Use the following PowerShell cmdlets to create an internal load balancer for Azure virtual machines.

* [New-AzLoadBalancer](https://msdn.microsoft.com/library/mt619450.aspx) creates a load balancer. 
* [New-AzLoadBalancerFrontendIpConfig](https://msdn.microsoft.com/library/mt603510.aspx) creates a front-end IP configuration for a load balancer. 
* [New-AzLoadBalancerRuleConfig](https://msdn.microsoft.com/library/mt619391.aspx) creates a rule configuration for a load balancer. 
* [New-AzLoadBalancerBackendAddressPoolConfig](https://msdn.microsoft.com/library/mt603791.aspx) creates a backend address pool configuration for a load balancer. 
* [New-AzLoadBalancerProbeConfig](https://msdn.microsoft.com/library/mt603847.aspx) creates a probe configuration for a load balancer.
* [Remove-AzLoadBalancer](https://msdn.microsoft.com/library/mt603862.aspx) removes a load balancer from an Azure resource group.
