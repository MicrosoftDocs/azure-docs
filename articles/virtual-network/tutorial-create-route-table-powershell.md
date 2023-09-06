---
title: Route network traffic Azure PowerShell
description: In this article, learn how to route network traffic with a route table using PowerShell.
services: virtual-network
documentationcenter: virtual-network
author: asudbring
manager: mtillman
tags: azure-resource-manager
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
ms.service: virtual-network
ms.topic: how-to
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/13/2018
ms.author: allensu
ms.custom: devx-track-azurepowershell
---

# Route network traffic with a route table using PowerShell

Azure automatically routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. The ability to create custom routes is helpful if, for example, you want to route traffic between subnets through a network virtual appliance (NVA). In this article, you learn how to:

* Create a route table
* Create a route
* Create a virtual network with multiple subnets
* Associate a route table to a subnet
* Create an NVA that routes traffic
* Deploy virtual machines (VM) into different subnets
* Route traffic from one subnet to another through an NVA

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a route table

Before you can create a route table, create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *myResourceGroup* for all resources created in this article.

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

Create a route table with [New-AzRouteTable](/powershell/module/az.network/new-azroutetable). The following example creates a route table named *myRouteTablePublic*.

```azurepowershell-interactive
$routeTablePublic = New-AzRouteTable `
  -Name 'myRouteTablePublic' `
  -ResourceGroupName myResourceGroup `
  -location EastUS
```

## Create a route

Create a route by retrieving the route table object with [Get-AzRouteTable](/powershell/module/az.network/get-azroutetable), create a route with [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig), then write the route configuration to the route table with [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable).

```azurepowershell-interactive
Get-AzRouteTable `
  -ResourceGroupName "myResourceGroup" `
  -Name "myRouteTablePublic" `
  | Add-AzRouteConfig `
  -Name "ToPrivateSubnet" `
  -AddressPrefix 10.0.1.0/24 `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress 10.0.2.4 `
 | Set-AzRouteTable
```

## Associate a route table to a subnet

Before you can associate a route table to a subnet, you have to create a virtual network and subnet. Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *myVirtualNetwork* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/16
```

Create three subnets by creating three subnet configurations with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). The following example creates three subnet configurations for *Public*, *Private*, and *DMZ* subnets:

```azurepowershell-interactive
$subnetConfigPublic = Add-AzVirtualNetworkSubnetConfig `
  -Name Public `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork

$subnetConfigPrivate = Add-AzVirtualNetworkSubnetConfig `
  -Name Private `
  -AddressPrefix 10.0.1.0/24 `
  -VirtualNetwork $virtualNetwork

$subnetConfigDmz = Add-AzVirtualNetworkSubnetConfig `
  -Name DMZ `
  -AddressPrefix 10.0.2.0/24 `
  -VirtualNetwork $virtualNetwork
```

Write the subnet configurations to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork), which creates the subnets in the virtual network:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

Associate the *myRouteTablePublic* route table to the *Public* subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and then write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork).

```azurepowershell-interactive
Set-AzVirtualNetworkSubnetConfig `
  -VirtualNetwork $virtualNetwork `
  -Name 'Public' `
  -AddressPrefix 10.0.0.0/24 `
  -RouteTable $myRouteTablePublic | `
Set-AzVirtualNetwork
```

## Create an NVA

An NVA is a VM that performs a network function, such as routing, firewalling, or WAN optimization.

Before creating a VM, create a network interface.

### Create a network interface

Before creating a network interface, you have to retrieve the virtual network Id with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork), then the subnet Id with [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig). Create a network interface with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) in the *DMZ* subnet with IP forwarding enabled:

```azurepowershell-interactive
# Retrieve the virtual network object into a variable.
$virtualNetwork=Get-AzVirtualNetwork `
  -Name myVirtualNetwork `
  -ResourceGroupName myResourceGroup

# Retrieve the subnet configuration into a variable.
$subnetConfigDmz = Get-AzVirtualNetworkSubnetConfig `
  -Name DMZ `
  -VirtualNetwork $virtualNetwork

# Create the network interface.
$nic = New-AzNetworkInterface `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -Name 'myVmNva' `
  -SubnetId $subnetConfigDmz.Id `
  -EnableIPForwarding
```

### Create a VM

To create a VM and attach an existing network interface to it, you must first create a VM configuration with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig). The configuration includes the network interface created in the previous step. When prompted for a username and password, select the user name and password you want to log into the VM with.

```azurepowershell-interactive
# Create a credential object.
$cred = Get-Credential -Message "Enter a username and password for the VM."

# Create a VM configuration.
$vmConfig = New-AzVMConfig `
  -VMName 'myVmNva' `
  -VMSize Standard_DS2 | `
  Set-AzVMOperatingSystem -Windows `
    -ComputerName 'myVmNva' `
    -Credential $cred | `
  Set-AzVMSourceImage `
    -PublisherName MicrosoftWindowsServer `
    -Offer WindowsServer `
    -Skus 2016-Datacenter `
    -Version latest | `
  Add-AzVMNetworkInterface -Id $nic.Id
```

Create the VM using the VM configuration with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named *myVmNva*.

```azurepowershell-interactive
$vmNva = New-AzVM `
  -ResourceGroupName myResourceGroup `
  -Location EastUS `
  -VM $vmConfig `
  -AsJob
```

The `-AsJob` option creates the VM in the background, so you can continue to the next step.

## Create virtual machines

Create two VMs in the virtual network so you can validate that traffic from the *Public* subnet is routed to the *Private* subnet through the network virtual appliance in a later step.

Create a VM in the *Public* subnet with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named *myVmPublic* in the *Public* subnet of the *myVirtualNetwork* virtual network.

```azurepowershell-interactive
New-AzVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "Public" `
  -ImageName "Win2016Datacenter" `
  -Name "myVmPublic" `
  -AsJob
```

Create a VM in the *Private* subnet.

```azurepowershell-interactive
New-AzVm `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -VirtualNetworkName "myVirtualNetwork" `
  -SubnetName "Private" `
  -ImageName "Win2016Datacenter" `
  -Name "myVmPrivate"
```

The VM takes a few minutes to create. Don't continue with the next step until the VM is created and Azure returns output to PowerShell.

## Route traffic through an NVA

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to return the public IP address of the *myVmPrivate* VM. The following example returns the public IP address of the *myVmPrivate* VM:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name myVmPrivate `
  -ResourceGroupName myResourceGroup `
  | Select IpAddress
```

Use the following command to create a remote desktop session with the *myVmPrivate* VM from your local computer. Replace `<publicIpAddress>` with the IP address returned from the previous command.

```
mstsc /v:<publicIpAddress>
```

Open the downloaded RDP file. If prompted, select **Connect**.

Enter the user name and password you specified when creating the VM (you may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM), then select **OK**. You may receive a certificate warning during the sign-in process. Select **Yes** to proceed with the connection.

In a later step, the `tracert.exe` command is used to test routing. Tracert uses the Internet Control Message Protocol (ICMP), which is denied through the Windows Firewall. Enable ICMP through the Windows firewall by entering the following command from PowerShell on the *myVmPrivate* VM:

```powershell
New-NetFirewallRule -DisplayName "Allow ICMPv4-In" -Protocol ICMPv4
```

Though trace route is used to test routing in this article, allowing ICMP through the Windows Firewall for production deployments is not recommended.

You enabled IP forwarding within Azure for the VM's network interface in Enable IP forwarding. Within the VM, the operating system, or an application running within the VM, must also be able to forward network traffic. Enable IP forwarding within the operating system of the *myVmNva*.

From a command prompt on the *myVmPrivate* VM, remote desktop to the *myVmNva*:

``` 
mstsc /v:myvmnva
```

To enable IP forwarding within the operating system, enter the following command in PowerShell from the *myVmNva* VM:

```powershell
Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters -Name IpEnableRouter -Value 1
```

Restart the *myVmNva* VM, which also disconnects the remote desktop session.

While still connected to the *myVmPrivate* VM, create a remote desktop session to the *myVmPublic* VM, after the *myVmNva* VM restarts:

``` 
mstsc /v:myVmPublic
```

Enable ICMP through the Windows firewall by entering the following command from PowerShell on the *myVmPublic* VM:

```powershell
New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
```

To test routing of network traffic to the *myVmPrivate* VM  from the *myVmPublic* VM, enter the following command from PowerShell on the *myVmPublic* VM:

```
tracert myVmPrivate
```

The response is similar to the following example:

```
Tracing route to myVmPrivate.vpgub4nqnocezhjgurw44dnxrc.bx.internal.cloudapp.net [10.0.1.4]
over a maximum of 30 hops:

1    <1 ms     *        1 ms  10.0.2.4
2     1 ms     1 ms     1 ms  10.0.1.4

Trace complete.
```

You can see that the first hop is 10.0.2.4, which is the NVA's private IP address. The second hop is 10.0.1.4, the private IP address of the *myVmPrivate* VM. The route added to the *myRouteTablePublic* route table and associated to the *Public* subnet caused Azure to route the traffic through the NVA, rather than directly to the *Private* subnet.

Close the remote desktop session to the *myVmPublic* VM, which leaves you still connected to the *myVmPrivate* VM.

To test routing of network traffic to the *myVmPublic* VM from the *myVmPrivate* VM, enter the following command from a command prompt on the *myVmPrivate* VM:

```
tracert myVmPublic
```

The response is similar to the following example:

```
Tracing route to myVmPublic.vpgub4nqnocezhjgurw44dnxrc.bx.internal.cloudapp.net [10.0.0.4]
over a maximum of 30 hops:

1     1 ms     1 ms     1 ms  10.0.0.4

Trace complete.
```

You can see that traffic is routed directly from the *myVmPrivate* VM to the *myVmPublic* VM. By default, Azure routes traffic directly between subnets.

Close the remote desktop session to the *myVmPrivate* VM.

## Clean up resources

When no longer needed, use [Remove-AzResourcegroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this article, you created a route table and associated it to a subnet. You created a simple network virtual appliance that routed traffic from a public subnet to a private subnet. Deploy a variety of pre-configured network virtual appliances that perform network functions such as firewall and WAN optimization from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking). To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.md).

While you can deploy many Azure resources within a virtual network, resources for some Azure PaaS services cannot be deployed into a virtual network. You can still restrict access to the resources of some Azure PaaS services to traffic only from a virtual network subnet though. To learn how, see [Restrict network access to PaaS resources](tutorial-restrict-network-access-to-resources-powershell.md).
