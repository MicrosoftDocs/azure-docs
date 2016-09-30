<properties
   pageTitle="Configure Always On Availability Group Listeners – Microsoft Azure"
   description="Configure Availability Group Listeners on the Azure Resource Manager model, using an internal load balancer with one or more IP addresses."
   services="virtual-machines"
   documentationCenter="na"
   authors="MikeRayMSFT"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows-sql-server"
   ms.workload="infrastructure-services"
   ms.date="09/22/2016"
   ms.author="MikeRayMSFT"/>

# Configure one or more Always On Availability Group Listeners - Resource Manger 

This topic shows how to do two things:

- Create an internal load balancer for SQL Server availability groups using PowerShell cmdlets.

- Add additional IP addresses to a load balancer to support more than one SQL Server availability group. 

> **Important** The ability to assign multiple IP addresses to an internal load balancer is new to Azure and is only available in Resource Manager model. Support for multiple IP addresses on an internal load balancer is a preview feature and is subject to the preview terms in the license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Preview](http://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In SQL Server an availability group listener is a virtual network name which clients connect to in order to access a database in the primary or secondary replica. On Azure virtual machines, a load balancer holds the IP address for  the listener. The load balancer routes traffic to the instance of SQL Server that is listening on the probe port. In most cases, an availability group uses an internal load balancer. An Azure internal load balancer can host one or many IP addresses. Each IP address uses a specific probe port. This document shows how to use PowerShell to create a new load balancer, or add IP addresses to an existing load balancer for SQL Server availability groups. 

To complete this task, you need to have a SQL Server availability group deployed on Azure virtual machines in Resource Manager model. Both SQL Server virtual machines must belong to the same availability set. You can use the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) to automatically create the availability group in Azure Resource Manager. This template automatically creates the availability group, including the internal load balancer for you. If you prefer, you can [manually configure an AlwaysOn availability group](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md).

This topic requires that your availability groups are already configured.  

Related topics include:

 - [Configure AlwaysOn Availability Groups in Azure VM (GUI)](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md)   
 
 - [Configure a VNet-to-VNet connection by using Azure Resource Manager and PowerShell](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-vm-powershell.md)]

## Configure the Windows Firewall

Configure the Windows Firewall to allow SQL Server access. You will need to configure the firewall to allow TCP connections to the ports use by the SQL Server instance, as well as the port used by the listener probe. For detailed instructions see [Configure a Windows Firewall for Database Engine Access](http://msdn.microsoft.com/library/ms175043.aspx#Anchor_1). Create an inbound rule for the SQL Server port and for the probe port.

## Example Script: Create an internal load balancer with PowerShell

> [AZURE.NOTE] If you created your availability group with the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) the load you do not need to complete this step. 

The following PowerShell script creates an internal load balancer, configures the load balancing rules, and sets an IP address for the load balancer. To run the script, open Windows PowerShell ISE, and paste the script in the Script pane. Use `Login-AzureRMAccount` to login to PowerShell. If you have multiple Azure subscriptions, use `Select-AzureRmSubscription ` to set the subscription. 

```powershell
# Login-AzureRmAccount
# Select-AzureRmSubscription -SubscriptionId <xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>

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

$FrontEndConfigurationName = "FE_SQLAGILB_1" # Object name for the Front End configuration 
$BackEndConfigurationName ="BE_SQLAGILB_1"   # Object name for the Back End configuration

$VNet = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName 

$Subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName 

$FEConfig = New-AzureRMLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.id

$BEConfig = New-AzureRMLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName 

$SQLHealthProbe = New-AzureRmLoadBalancerProbeConfig -Name $LBProbeName -Protocol tcp -Port $ProbePort -IntervalInSeconds 15 -ProbeCount 2

$ILBRule = New-AzureRmLoadBalancerRuleConfig -Name $LBConfigRuleName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -Probe $SQLHealthProbe -Protocol tcp -FrontendPort $ListenerPort -BackendPort $ListenerPort -LoadDistribution Default -EnableFloatingIP 

$ILB= New-AzureRmLoadBalancer -Location $Location -Name $ILBName -ResourceGroupName $ResourceGroupName -FrontendIpConfiguration $FEConfig -BackendAddressPool $BEConfig -LoadBalancingRule $ILBRule -Probe $SQLHealthProbe 

$bepool = Get-AzureRmLoadBalancerBackendAddressPoolConfig -Name $BackEndConfigurationName -LoadBalancer $ILB 

foreach($VMName in $VMNames)
    {
        $VM = Get-AzureRmVM -ResourceGroupName $ResourceGroupName -Name $VMName 
        $NICName = ($VM.NetworkInterfaceIDs[0].Split('/') | select -last 1)
        $NIC = Get-AzureRmNetworkInterface -name $NICName -ResourceGroupName $ResourceGroupName
        $NIC.IpConfigurations[0].LoadBalancerBackendAddressPools = $BEPool
        Set-AzureRmNetworkInterface -NetworkInterface $NIC
        start-AzureRmVM -ResourceGroupName $ResourceGroupName -Name $VM.Name 
    }
```

## Example script: Add an IP address to an existing load balancer with PowerShell

To use more than one availability group, use PowerShell to add an additional IP address to an existing load balancer. Each IP address requires its own load balancing rule, probe port, and front port.

The front end port is the port that applications use to connect to the SQL Server instance. IP addresses for different availability groups can use the same front end port.

>[AZURE.NOTE] For SQL Server availability groups, each IP address requires a specific probe port. For example, if one IP address on a load balancer uses probe port 59999, no other IP addresses on that load balancer can use probe port 59999. 

- For information about load balancer limits see **Private front end IP per load balancer** under [Networking Limits - Azure Resource Manager](../azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).

- For information about availability group limits see [Restrictions (Availability Groups)](http://msdn.microsoft.com/library/ff878487.aspx#RestrictionsAG).

The following script adds a new IP address to an existing load balancer. Update the variables for your environment. The ILB uses the listener port for the load balancing front end port. This port can be the port that SQL Server is listening on. For default instances of SQL Server, this is port 1433. The load balancing rule for an availability group requires a floating IP (direct server return) so the back end port is the same as the front end port.

```powershell
# Login-AzureRmAccount
# Select-AzureRmSubscription -SubscriptionId <xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>

$ResourceGroupName = "<ResourceGroup>"          # Resource group name
$VNetName = "<VirtualNetwork>"                  # Virtual network name
$SubnetName = "<Subnet>"                        # Subnet name
$ILBName = "<ILBName>"                          # ILB name                      

$ILBIP = "<n.n.n.n>"                            # IP address
[int]$ListenerPort = "<nnnn>"                   # AG listener port
[int]$ProbePort = "<nnnnn>"                     # Probe port 

$ILB = Get-AzureRmLoadBalancer -Name $ILBName -ResourceGroupName $ResourceGroupName 

$count = $ILB.FrontendIpConfigurations.Count+1
$FrontEndConfigurationName ="FE_SQLAGILB_$count"  

$LBProbeName = "ILBPROBE_$count"
$LBConfigrulename = "ILBCR_$count"

$VNet = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $ResourceGroupName 
$Subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $VNet -Name $SubnetName

$ILB | Add-AzureRmLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -PrivateIpAddress $ILBIP -SubnetId $Subnet.Id 

$ILB | Add-AzureRmLoadBalancerProbeConfig -Name $LBProbeName  -Protocol Tcp -Port $Probeport -ProbeCount 2 -IntervalInSeconds 15  | Set-AzureRmLoadBalancer 

$ILB = Get-AzureRmLoadBalancer -Name $ILBname -ResourceGroupName $ResourceGroupName

$FEConfig = get-AzureRMLoadBalancerFrontendIpConfig -Name $FrontEndConfigurationName -LoadBalancer $ILB

$SQLHealthProbe  = Get-AzureRmLoadBalancerProbeConfig -Name $LBProbeName -LoadBalancer $ILB

$BEConfig = Get-AzureRmLoadBalancerBackendAddressPoolConfig -Name $ILB.BackendAddressPools[0].Name -LoadBalancer $ILB 

$ILB | Add-AzureRmLoadBalancerRuleConfig -Name $LBConfigRuleName -FrontendIpConfiguration $FEConfig  -BackendAddressPool $BEConfig -Probe $SQLHealthProbe -Protocol tcp -FrontendPort  $ListenerPort -BackendPort $ListenerPort -LoadDistribution Default -EnableFloatingIP | Set-AzureRmLoadBalancer   
``` 



## Configure the cluster to use the load balancer IP address 

The next step is to configure the listener on the cluster, and bring the listener online. To accomplish this, do the following: 

1. Create the availabilitygroup listener on the failover cluster 

1. Bring the listener online

## 1. Create the availability group listener on the failover cluster

In this step, you add a client access point to the failover cluster with Failover Cluster Manager, and then use PowerShell to configure the cluster resource to listen on the probe port. 

- Use RDP to connect to the Azure virtual machine that hosts the primary replica. 

- Open Failover Cluster Manager.

- Select the **Networks** node, and note the cluster network name. Use this name in the `$ClusterNetworkName` variable in the PowerShell script.

- Expand the cluster name, and then click **Roles**.

- In the **Roles** pane, right-click the availability group name and then select **Add Resource** > **Client Access Point**.

- In the **Name** box, create a name for this new listener, then click **Next** twice, and then click **Finish**. Do not bring the listener or resource online at this point.

 >[AZURE.NOTE] The name for the new listener is the network name that applications will use to connect to databases in the SQL Server availability group.

- Click the **Resources** tab, then expand the Client Access Point you just created. Right-click the IP resource and click properties. Note the name of the IP address. You will use this name in the `$IPResourceName` variable in the PowerShell script.

- Under **IP Address** click **Static IP Address** and set the static IP address to the same address that you used when you set the load balancer IP address on the Azure portal. 

- Disable NetBIOS for this address and click **OK**. Repeat this step for each IP resource if your solution spans multiple Azure VNets. 

- Make the SQL Server Availability Group resource dependent on the IP address. Right click on the resource in cluster manager, this is on the **Resources** tab under **Other Resources**. 

- On the cluster node that currently hosts the primary replica, open an elevated PowerShell ISE and paste the following commands into a new script. On the **Dependencies** tab, click the name of the listener. 
        
    ```powershell
    $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
    $IPResourceName = "<IPResourceName>" # the IP Address resource name
    $ILBIP = “<n.n.n.n>” # the IP Address of the Internal Load Balancer (ILB). This is the static IP address for the load balancer you configured in the Azure portal.
    [int]$ProbePort = <nnnnn>

    Import-Module FailoverClusters
    
    Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
    ```

- Update the variables and run the PowerShell script to configure the IP address and port for the new listener.

 >[AZURE.NOTE] If your SQL Servers are in separate regions, you need to run the PowerShell script twice. The first time use the cluster network name, cluster IP resource name, and load balancer IP address from the first resource group. The second time use the cluster network name, cluster IP resource name, and load balancer IP address from the second resource group.

Now the cluster has an availability group listener resource.

## 2. Bring the listener online

With the availability group listener resource configured, you can bring the listener online so that applications can connect to databases in the availability group with the listener.

- Navigate back to Failover Cluster Manager. Expand **Roles** and then highlight your Availability Group. On the **Resources** tab, right-click the listener name and click **Properties**.

- Click the **Dependencies** tab. If there are multiple resources listed, verify that the IP addresses have OR, not AND, dependencies. Click **OK**.

- Right-click the listener name and click **Bring Online**.


- Once the listener is online, from the **Resources** tab, right-click the availability group and click **Properties**.

- Create a dependency on the listener name resource (not the IP address resources name). Click **OK**.


- Launch SQL Server Management Studio and connect to the primary replica.


- Navigate to **AlwaysOn High Availability** | **Availability Groups** | **Availability Group Listeners**. 


- You should now see the listener name that you created in Failover Cluster Manager. Right-click the listener name and click **Properties**.


- In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort you used earlier (1433 was the default), then click **OK**.

You now have a SQL Server availability group in Azure virtual machines running in Resource Manager mode. 

## Test the connection to the listener

To test the connection:

1. RDP to a SQL Server that is in the same virtual network, but does not own the replica. This can be the other SQL Server in the cluster.

1. Use **sqlcmd** utility to test the connection. For example, the following script establishes a **sqlcmd** connection to the primary replica through the listener with Windows authentication:

        sqlmd -S <listenerName> -E

    If the listener is using a port other than the default port (1433), specify the port in the connection string. For example, the following sqlcmd command connects to a listener at port 1435: 
    
        sqlcmd -S <listenerName>,1435 -E

The SQLCMD connection automatically connects to whichever instance of SQL Server hosts the primary replica. 

>[AZURE.NOTE] Make sure that the port you specify is open on the firewall of both SQL Servers. Both servers require an inbound rule for the TCP port that you use. See [Add or Edit Firewall Rule](http://technet.microsoft.com/library/cc753558.aspx) for more information. 

## Guidelines and limitations

Note the following guidelines on availabilitygroup listener in Azure using internal load balancer:

- With an internal load balancer you only access the listener from within the same virtual network.

## For more information

For more information see [Configure Always On availability group in Azure VM manually](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md).

### PowerShell cmdlets

Use the following PowerShell cmdlets to create an internal load balancer for Azure virtual machines.

- `New-AzureRmLoadBalancer` creates a load balancer. See [New-AzureRmLoadBalancer](http://msdn.microsoft.com/library/mt619450.aspx) for more information. 

- `New-AzureRMLoadBalancerFrontendIpConfig` creates a front-end IP configuration for a load balancer. See [New-AzureRMLoadBalancerFrontendIpConfig](http://msdn.microsoft.com/library/mt603510.aspx) for more information.

- `New-AzureRmLoadBalancerRuleConfig` creates a rule configuration for a load balancer. See [New-AzureRmLoadBalancerRuleConfig](http://msdn.microsoft.com/library/mt619391.aspx) for more information. 

- `New-AzureRMLoadBalancerBackendAddressPoolConfig` creates a backend address pool configuration for a load balancer. See [New-AzureRmLoadBalancerBackendAddressPoolConfig](http://msdn.microsoft.com/library/mt603791.aspx) for more information. 

- `New-AzureRmLoadBalancerProbeConfig` creates a probe configuration for a load balancer. See [New-AzureRmLoadBalancerProbeConfig](http://msdn.microsoft.com/library/mt603847.aspx) for more information.

If you need to remove a load balancer from an Azure resource group, use `Remove-AzureRmLoadBalancer`. For more information, see [Remove-AzureRmLoadBalancer](http://msdn.microsoft.com/library/mt603862.aspx).
