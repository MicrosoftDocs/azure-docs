---
title: Route network traffic - PowerShell | Microsoft Docs
description: Learn how to route network traffic with a route table using PowerShell.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/05/2018
ms.author: jdial
ms.custom:
---

# Route network traffic with a route table using PowerShell

Azure automatically routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. The ability to create custom routes is helpful if, for example, you want to route traffic between subnets through a firewall. In this article you learn how to:

> [!div class="checklist"]
> * Create a route table
> * Create a route
> * Associate a route table to a virtual network subnet
> * Test routing
> * Troubleshoot routing

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 

## Create a route table

Azure routes traffic between all subnets in a virtual network, by default. To learn more about Azure's default routes, see [System routes](virtual-networks-udr-overview.md). To override Azure's default routing, you create a route table that contains routes, and associate the route table to a virtual network subnet.

Before you can create a route table, create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named *myResourceGroup* for all resources created in this article. 

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

Create a route table with [New-AzureRmRouteTable](/powershell/module/azurerm.network/new-azurermroutetable). The following example creates a route table named *myRouteTablePublic*.

```azurepowershell-interactive
$routeTablePublic = New-AzureRmRouteTable `
  -Name 'myRouteTablePublic' `
  -ResourceGroupName myResourceGroup `
  -location EastUS
```

## Create a route

A route table contains zero or more routes. Create a route by retrieving the route table object with [Get-AzureRmRouteTable](/powershell/module/azurerm.network/get-azurermroutetable), create a route with [Add-AzureRmRouteConfig](/powershell/module/azurerm.network/add-azurermrouteconfig), then write the route configuration to the route table with [Set-AzureRmRouteTable](/powershell/module/azurerm.network/set-azurermroutetable). 

```azurepowershell-interactive
Get-AzureRmRouteTable `
  -ResourceGroupName "myResourceGroup" `
  -Name "myRouteTablePublic" `
  | Add-AzureRmRouteConfig `
  -Name "ToPrivateSubnet" `
  -AddressPrefix 10.0.1.0/24 `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress 10.0.2.4 `
 | Set-AzureRmRouteTable
```

The route will direct all traffic destined to the 10.0.1.0/24 address prefix through a network virtual appliance with the IP address 10.0.2.4. The network virtual appliance and subnet with the specified address prefix are created in later steps. The route overrides Azure's default routing, which routes traffic between subnets directly. Each route specifies a next hop type. The next hop type instructs Azure how to route the traffic. In this example, the next hop type is *VirtualAppliance*. To learn more about all available next hop types in Azure, and when to use them, see [next hop types](virtual-networks-udr-overview.md#custom-routes).

## Associate a route table to a subnet

Before you can associate a route table to a subnet, you have to create a virtual network and subnet. Create a virtual network with [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork). The following example creates a virtual network named *myVirtualNetwork* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$virtualNetwork = New-AzureRmVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/16
```

Create three subnets by creating three subnet configurations with [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig). The following example creates three subnet configurations for *Public*, *Private*, and *DMZ* subnets:

```azurepowershell-interactive
$subnetConfigPublic = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Public `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork

$subnetConfigPrivate = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Private `
  -AddressPrefix 10.0.1.0/24 `
  -VirtualNetwork $virtualNetwork

$subnetConfigDmz = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name DMZ `
  -AddressPrefix 10.0.2.0/24 `
  -VirtualNetwork $virtualNetwork
```

The address prefixes must be within the address prefix defined for the virtual network. The subnet address prefixes cannot overlap with each other.

Write the subnet configurations to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/Set-AzureRmVirtualNetwork), which creates the subnets in the virtual network:

```azurepowershell-interactive
$virtualNetwork | Set-AzureRmVirtualNetwork
```

You can associate a route table to zero or more subnets. A subnet can have zero or one route table associated to it. Outbound traffic from a subnet is routed based upon Azure's default routes, and any custom routes you've added to a route table you associate to a subnet. Associate the *myRouteTablePublic* route table to the *Public* subnet with [Set-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/set-azurermvirtualnetworksubnetconfig) and then write the subnet configuration to the virtual network with [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork).

```azurepowershell-interactive
Set-AzureRmVirtualNetworkSubnetConfig `
  -VirtualNetwork $virtualNetwork `
  -Name 'Public' `
  -AddressPrefix 10.0.0.0/24 `
  -RouteTable $routeTablePublic | `
Set-AzureRmVirtualNetwork
```

Before deploying route tables for production use, it's recommended that you thoroughly familiarize yourself with [routing in Azure](virtual-networks-udr-overview.md) and [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Test routing

To test routing, you'll create a virtual machine that serves as the network virtual appliance that the route you created in a previous step routes through. After creating the network virtual appliance, you'll deploy a virtual machine into the *Public* and *Private* subnets. You'll then route traffic from the *Public* subnet to the *Private* subnet through the network virtual appliance.

### Create a network virtual appliance

A virtual machine running a network application is often referred to as a network virtual appliance. Network virtual appliances typically receive network traffic, perform some action, then forward or drop network traffic based on logic configured in the network application. 

#### Create a network interface

In a previous step, you created a route that specified a network virtual appliance as the next hop type. A virtual machine running a network application is often referred to as a network virtual appliance. In production environments, the network virtual appliance you deploy is often a pre-configured virtual machine. Several network virtual appliances are available from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?search=network%20virtual%20appliance&page=1). In this article, a basic virtual machine is created.

A virtual machine has one or more network interfaces attached to it, that enable the virtual machine to communicate with the network. For a network interface to be able to forward network traffic sent to it, that is not destined for its own IP address, IP forwarding must be enabled for the network interface. Before creating a network interface, you have to retrieve the virtual network Id with [Get-AzureRmVirtualNetwork](/powershell/module/azurerm.network/get-azurermvirtualnetwork), then the subnet Id with [Get-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/get-azurermvirtualnetworksubnetconfig). Create a network interface with [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface) in the *DMZ* subnet with IP forwarding enabled:

```azurepowershell-interactive
# Retrieve the virtual network object into a variable.
$virtualNetwork=Get-AzureRmVirtualNetwork `
  -Name myVirtualNetwork `
  -ResourceGroupName myResourceGroup

# Retrieve the subnet configuration into a variable.
$subnetConfigDmz = Get-AzureRmVirtualNetworkSubnetConfig `
  -Name DMZ `
  -VirtualNetwork $virtualNetwork

# Create the network interface.
$nic = New-AzureRmNetworkInterface `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name 'myVmNva' `
  -SubnetId $subnetConfigDmz.Id `
  -EnableIPForwarding
```

#### Create a virtual machine

To create a virtual machine and attach an existing network interface to it, you must first create a virtual machine configuration with [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvmconfig). The configuration includes the network interface created in the previous step. When prompted for a username and password, select the user name and password you want to log into the virtual machine with. 

```azurepowershell-interactive
# Create a credential object.
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a virtual machine configuration.
$vmConfig = New-AzureRmVMConfig `
  -VMName 'myVmNva' `
  -VMSize Standard_DS2 | `
  Set-AzureRmVMOperatingSystem -Windows `
    -ComputerName 'myVmNva' `
    -Credential $cred | `
  Set-AzureRmVMSourceImage `
    -PublisherName MicrosoftWindowsServer `
    -Offer WindowsServer `
    -Skus 2016-Datacenter `
    -Version latest | `
  Add-AzureRmVMNetworkInterface -Id $nic.Id
```

Create the virtual machine using the virtual machine configuration with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a virtual machine named *myVmNva*. 

```azurepowershell-interactive
$vmNva = New-AzureRmVM `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -VM $vmConfig `
  -AsJob
```

The `-AsJob` option creates the virtual machine in the background, so you can continue to the next step. When prompted, enter the user name and password you want to log in to the virtual machine with. In production environments, the network virtual appliance you deploy is often a pre-configured virtual machine. Several network virtual appliances are available from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?search=network%20virtual%20appliance&page=1).

Azure assigned 10.0.2.4 as the private IP address of the virtual machine, because 10.0.2.4 is the first available IP address in the *DMZ* subnet of *myVirtualNetwork*.

### Create virtual machines

Create two virtual machines in the virtual network so you can validate that traffic from the *Public* subnet is routed to the *Private* subnet through the network virtual appliance in a later step. 

Create a virtual machine in the *Public* subnet with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a virtual machine named *myVmWeb* in the *Public* subnet of the *myVirtualNetwork* virtual network. 

```azurepowershell-interactive
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "Public" `
  -ImageName "Win2016Datacenter" `
  -Name "myVmWeb" `
  -AsJob
```

Azure assigned 10.0.0.4 as the private IP address of the virtual machine, because 10.0.1.4 is the first available IP address in the *Public* subnet of *myVirtualNetwork*.

Create a virtual machine in the *Private* subnet.

```azurepowershell-interactive
New-AzureRmVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "Private" `
  -ImageName "Win2016Datacenter" `
  -Name "myVmMgmt"
```

The virtual machine takes a few minutes to create. Azure assigned 10.0.1.4 as the private IP address of the virtual machine, because 10.0.1.4 is the first available IP address in the *Private* subnet of *myVirtualNetwork*. 

Don't continue with the next step until the virtual machine is created and Azure returns output to PowerShell.

### Route traffic through a network virtual appliance

Use [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) to enable ICMP inbound to the *myVmWeb* and *myVmMgmt* virtual machines through the Windows firewall for using tracert to test communication between the virtual machines in a later step:

```powershell-interactive
Set-AzureRmVMExtension `
  -ResourceGroupName myResourceGroup `
  -VMName myVmWeb `
  -ExtensionName AllowICMP `
  -Publisher Microsoft.Compute `
  -ExtensionType CustomScriptExtension `
  -TypeHandlerVersion 1.8 `
  -SettingString '{"commandToExecute": "netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow"}' `
  -Location EastUS

Set-AzureRmVMExtension `
  -ResourceGroupName myResourceGroup `
  -VMName myVmMgmt `
  -ExtensionName AllowICMP `
  -Publisher Microsoft.Compute `
  -ExtensionType CustomScriptExtension `
  -TypeHandlerVersion 1.8 `
  -SettingString '{"commandToExecute": "netsh advfirewall firewall add rule name=Allow-ping protocol=icmpv4 dir=in action=allow"}' `
  -Location EastUS
```

The previous commands may take a few minutes to complete. Do not continue with the next step until the commands complete and output is returned to PowerShell. Though tracert is used to test routing in this article, allowing ICMP through the Windows Firewall for production deployments is not recommended.

You connect to a virtual machine's public IP address from the Internet. Use [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) to return the public IP address of a virtual machine. The following example returns the public IP address of the *myVmMgmt* virtual machine:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
  -Name myVmMgmt `
  -ResourceGroupName myResourceGroup `
  | Select IpAddress
```

Use the following command to create a remote desktop session with the *myVmMgmt* virtual machine from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

A Remote Desktop Protocol (.rdp) file is created, downloaded to your computer, and opened. Enter the user name and password you specified when creating the virtual machine (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the virtual machine), and then select **OK**. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to proceed with the connection. 

You enabled IP forwarding within Azure for the virtual machine's network interface in [Enable IP fowarding](#enable-ip-forwarding). Within the virtual machine, the operating system, or an application running within the virtual machine, must also be able to forward network traffic. When you deploy a network virtual appliance in a production environment, the appliance typically filters, logs, or performs some other function before forwarding traffic. In this article however, the operating system simply forwards all traffic it receives. Enable IP forwarding within the operating system of the *myVmNva*:

From a command prompt on the *myVmMgmt* virtual machine, remote desktop to the *myVmNva* virtual machine:

``` 
mstsc /v:myVmNva
```
    
To enable IP forwarding within the operating system of the *myVmNva* virtual machine, enter the following command in PowerShell on the *myVmNva* virtual machine:

```powershell
Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters -Name IpEnableRouter -Value 1
```
    
Restart the *myVmNva* virtual machine, which will also disconnect the remote desktop session, leaving you within the remote desktop session you opened to the *myVmMgmt* virtual machine.

After the *myVmNva* virtual machine restarts, use the following command to test routing for network traffic to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine.

```
tracert myvmweb
```

The response is similar to the following example:

```
Tracing route to myvmweb.vpgub4nqnocezhjgurw44dnxrc.bx.internal.cloudapp.net [10.0.0.4]
over a maximum of 30 hops:
    
1     1 ms     1 ms     1 ms  10.0.0.4
  
Trace complete.
```

You can see that traffic is routed directly from the *myVmMgmt* virtual machine to the *myVmWeb* virtual machine. Azure's default routes, route traffic directly between subnets.

Use the following command to remote desktop to the *myVmWeb* virtual machine from the *myVmMgmt* virtual machine:

``` 
mstsc /v:myVmWeb
```

To test routing for network traffic to the *myVmMgmt* virtual machine from the *myVmWeb* virtual machine, enter the following command, from a command prompt:

```
tracert myvmmgmt
```

The response is similar to the following example:

```
Tracing route to myvmmgmt.vpgub4nqnocezhjgurw44dnxrc.bx.internal.cloudapp.net [10.0.1.4]
over a maximum of 30 hops:
        
1    <1 ms     *        1 ms  10.0.2.4
2     1 ms     1 ms     1 ms  10.0.1.4
        
Trace complete.
```

You can see that the first hop is 10.0.2.4, which is the network virtual appliance's private IP address. The second hop is 10.0.1.4, the private IP address of the *myVmMgmt* virtual machine. The route added to the *myRouteTablePublic* route table and associated to the *Public* subnet caused Azure to route the traffic through the NVA, rather than directly to the *Private* subnet.

Close the remote desktop sessions to both the *myVmWeb* and *myVmMgmt* virtual machines.

## Troubleshoot routing

As you learned in previous steps, Azure applies default routes, that you can, optionally, override with your own routes. Sometimes, traffic may not be routed as you expect it to be. Use [New-AzureRmNetworkWatcher](/powershell/module/azurerm.network/new-azurermnetworkwatcher) to enable a Network Watcher in the EastUS region, if you don't already have a Network Watcher in that region:

```azurepowershell-interactive
# Enable network watcher for east region, if you don't already have a network watcher enabled for the region:
$nw = New-AzureRmNetworkWatcher `
 -Location eastus `
 -Name myNetworkWatcher_eastus `
 -ResourceGroupName myResourceGroup
```

Use [Get-AzureRmNetworkWatcherNextHop](/powershell/module/azurerm.network/get-azurermnetworkwatchernexthop) to determine how traffic is routed between two virtual machines. For example, the following command tests traffic routing from the *myVmWeb* (10.0.0.4) virtual machine to the *myVmMgmt* (10.0.1.4) virtual machine:

```azurepowershell-interactive
$vmWeb = Get-AzureRmVM `
  -Name myVmWeb `
  -ResourceGroupName myResourceGroup

Get-AzureRmNetworkWatcherNextHop `
  -DestinationIPAddress 10.0.1.4 `
  -NetworkWatcherName myNetworkWatcher_eastus `
  -ResourceGroupName myResourceGroup `
  -SourceIPAddress 10.0.0.4 `
  -TargetVirtualMachineId $vmWeb.Id
```
The following output is returned after a short wait:

```azurepowershell
NextHopIpAddress    NextHopType       RouteTableId
------------------  ---------------- ---------------------------------------------------------------------------------------------------------------------------
10.0.2.4            VirtualAppliance  /subscriptions/<Subscription-Id>/resourceGroups/myResourceGroup/providers/Microsoft.Network/routeTables/myRouteTablePublic
```

The output informs you that the next hop IP address for traffic from *myVmWeb* to *myVmMgmt* is 10.0.2.4 (the *myVmNva* virtual machine), that the next hop type is *VirtualAppliance*, and that the route table that causes the routing is *myRouteTablePublic*.

The effective routes for each network interface are a combination of Azure's default routes and any routes you define. To see all routes effective for a network interface in a virtual machine with [Get-AzureRmEffectiveRouteTable](/powershell/module/azurerm.network/get-azurermeffectiveroutetable). For example, to show the effective routes for the *myVmWeb* network interface in the *myVmWeb* virtual machine, enter the following command:

```azurepowershell-interactive
Get-AzureRmEffectiveRouteTable `
  -NetworkInterfaceName myVmWeb `
  -ResourceGroupName myResourceGroup `
  | Format-Table
```

All default routes, and the route you added in a previous step, are returned.

## Clean up resources

When no longer needed, use [Remove-AzureRmResourcegroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this article, you created a route table and associated it to a subnet. You created a network virtual appliance that routed traffic from a public subnet to a private subnet. While you can deploy many Azure resources within a virtual network, resources for some Azure PaaS services cannot be deployed into a virtual network. You can still restrict access to the resources of some Azure PaaS services to traffic only from a virtual network subnet though. Advance to the next article to learn how to restrict network access to Azure PaaS resources.

> [!div class="nextstepaction"]
> [Restrict network access to PaaS resources](virtual-network-service-endpoints-configure.md#azure-powershell)