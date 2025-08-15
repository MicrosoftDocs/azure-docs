---
title: Diagnose an Azure virtual machine routing problem
description: Learn how to diagnose a virtual machine routing problem by viewing the effective routes for a virtual machine.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: troubleshooting
ms.date: 04/02/2025
ms.author: allensu
ms.custom: devx-track-azurecli
ms.devlang: azurecli
# Customer intent: "As a network engineer, I want to diagnose effective routing for a virtual machine's network interface, so that I can identify and resolve communication failures effectively."
---

# Diagnose a virtual machine routing problem

In this article, you learn how to diagnose routing problems by viewing the effective routes for a network interface in a virtual machine (VM). Azure automatically creates default routes for each virtual network subnet. You can override these default routes by defining custom routes in a route table and associating the table with a subnet. The effective routes for a network interface are a combination of Azure's default routes, custom routes you define, and any routes propagated from your on-premises network through an Azure VPN gateway using the border gateway protocol (BGP). If you're new to virtual networks, network interfaces, or routing, see [Virtual network overview](virtual-networks-overview.md), [Network interface](virtual-network-network-interface.md), and [Routing overview](virtual-networks-udr-overview.md).

## Scenario

You attempt to connect to a VM, but the connection fails. To determine why you can't connect to the VM, you can view the effective routes for a network interface using the Azure [portal](#diagnose-using-azure-portal), [PowerShell](#diagnose-using-powershell), or the [Azure CLI](#diagnose-using-azure-cli).

The steps that follow assume you have an existing VM to view the effective routes for. If you don't have an existing VM, first deploy a [Linux](/azure/virtual-machines/linux/quick-create-portal?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](/azure/virtual-machines/windows/quick-create-portal?toc=%2fazure%2fvirtual-network%2ftoc.json) VM to complete the tasks in this article with. The examples in this article are for a VM named *vm-1* with a network interface named *vm-1445*. The VM and network interface are in a resource group named *test-rg*, and are in the *East US* region. Change the values in the steps, as appropriate, for the VM you're diagnosing the problem for.

## Diagnose using Azure portal

1. Sign-in the Azure [portal](https://portal.azure.com) with an Azure account that has the [necessary permissions](virtual-network-network-interface.md#permissions).

1. At the top of the Azure portal, enter the name of a VM that is in the running state, in the search box. When the name of the VM appears in the search results, select it.

1. Expand the **Networking** section and select **Network settings**.

1. To select the interface, select its name.

    :::image type="content" source="./media/diagnose-network-routing-problem/view-nics.png" alt-text="Screenshot of network interface in VM settings." lightbox="./media/diagnose-network-routing-problem/view-nics.png":::

1. In the network interface, expand **Help**. Select **Effective routes**.

    :::image type="content" source="./media/diagnose-network-routing-problem/view-effective-routes.png" alt-text="Screenshot of network interface effective routes." lightbox="./media/diagnose-network-routing-problem/view-effective-routes.png":::

      Select the desired network interface to view its effective routes. Each interface might belong to a different subnet, resulting in unique routes.
      The example in the image shows default routes created by Azure for each subnet. Your list includes the default routes and might also include extra routes. The routes could be from features like virtual network peering or connections to on-premises networks via an Azure VPN gateway. For details about the routes, see [Virtual network traffic routing](virtual-networks-udr-overview.md). If there are many routes, use the **Download** option to save them as a .csv file for easier review.

Though effective routes were viewed through the VM in the previous steps, you can also view effective routes through an:

- **Individual network interface**: Learn how to [view a network interface](virtual-network-network-interface.md#view-network-interface-settings).

- **Individual route table**: Learn how to [view a route table](manage-route-table.yml#view-details-of-a-route-table).

## Diagnose using PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

You can run the commands that follow in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell. It has common Azure tools preinstalled and configured to use with your account. If you run PowerShell from your computer, you need the Azure PowerShell module, version 1.0.0 or later. Run `Get-Module -ListAvailable Az` on your computer, to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to log into Azure with an account that has the [necessary permissions](virtual-network-network-interface.md#permissions).

Get the effective routes for a network interface with [Get-AzEffectiveRouteTable](/powershell/module/az.network/get-azeffectiveroutetable). The following example gets the effective routes for a network interface named *vm-1445* in a resource group named *test-rg*:

```azurepowershell-interactive
$Params = @{
  NetworkInterfaceName = "vm-1445"
  ResourceGroupName    = "test-rg"
}
Get-AzEffectiveRouteTable @Params | Format-Table
```

To understand the information returned in the output, see [Routing overview](virtual-networks-udr-overview.md). Output is only returned if the VM is in the running state. If there are multiple network interfaces attached to the VM, you can review the effective routes for each network interface. Since each network interface can be in a different subnet, each network interface can have different effective routes. If you're still having a communication problem, see [more diagnoses](#more-diagnoses) and [considerations](#considerations).

If you know the VM name but not the network interface name, use the following commands to return the ID of all network interfaces attached to the VM:

```azurepowershell-interactive
$Params = @{
  Name              = "vm-1"
  ResourceGroupName = "test-rg"
}
$VM = Get-AzVM @Params
$VM.NetworkProfile
```

You receive output similar to the following example:

```output
NetworkInterfaces
-----------------
{/subscriptions/<ID>/resourceGroups/test-rg/providers/Microsoft.Network/networkInterfaces/vm-1445
```

In the previous output, the network interface name is *vm-1445*.

## Diagnose using Azure CLI

You can run the commands that follow in the  [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This article requires the Azure CLI version 2.0.32 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you're running the Azure CLI locally, you also need to run `az login` and log into Azure with an account that has the [necessary permissions](virtual-network-network-interface.md#permissions).

Get the effective routes for a network interface with [az network nic show-effective-route-table](/cli/azure/network/nic#az-network-nic-show-effective-route-table). The following command gets the effective routes for a network interface named *vm-1445* that is in a resource group named *test-rg*:

```azurecli-interactive
az network nic show-effective-route-table \
  --name vm-1445 \
  --resource-group test-rg
```

To understand the information returned in the output, see [Routing overview](virtual-networks-udr-overview.md). Output is only returned if the VM is in the running state. If there are multiple network interfaces attached to the VM, you can review the effective routes for each network interface. Since each network interface can be in a different subnet, each network interface can have different effective routes. If you're still having a communication problem, see [more diagnoses](#more-diagnoses) and [considerations](#considerations).

If you know the VM name but not the network interface name, use the following commands to return the ID of all network interfaces attached to the VM:

```azurecli-interactive
az vm show \
  --name vm-1 \
  --resource-group test-rg
```

## Resolve a problem

Resolving routing problems typically consists of the following procedures:

- Addition of a custom route to override one of Azure's default routes. Learn how to [add a custom route](manage-route-table.yml#create-a-route).

- Changed or removed a custom route that might cause routing to an undesired location. Learn how to [change](manage-route-table.yml#change-a-route) or [delete](manage-route-table.yml#delete-a-route) a custom route.

- Ensure that the route table that contains any custom routes defined is associated to the subnet the network interface is in. Learn how to [associate a route table to a subnet](manage-route-table.yml#associate-a-route-table-to-a-subnet).

- Ensure that devices such as Azure VPN gateway or network virtual appliances deployed are operable. Use the [VPN diagnostics](../network-watcher/diagnose-communication-problem-between-networks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) capability of Network Watcher to determine any problems with an Azure VPN gateway.

If you're still having communication problems, see [Considerations](#considerations) and more diagnoses.

## Considerations

Consider the following points when troubleshooting communication problems:

- Routing uses the longest prefix match (LPM) to determine the best route from system routes, BGP, and custom routes. If multiple routes share the same LPM match, Azure selects one based on the priority order in [Routing overview](virtual-networks-udr-overview.md#how-azure-selects-a-route). Effective routes show only the LPM-matched routes, making it easier to identify and troubleshoot routes affecting VM communication.

- If custom routes direct traffic to a network virtual appliance (NVA) with *Virtual Appliance* as the next hop type, ensure the NVA's IP forwarding is enabled; otherwise, packets are dropped. Learn how to [enable IP forwarding for a network interface](virtual-network-network-interface.md#enable-or-disable-ip-forwarding) and configure the NVA's operating system or application to forward traffic.

- If a route to 0.0.0.0/0 is created, all outbound internet traffic is routed to the next hop you specified, such as to an NVA or VPN gateway. Creating such a route is often referred to as forced tunneling. Remote connections using the RDP or SSH protocols from the internet to your VM might not work with this route, depending on how the next hop handles the traffic. Forced-tunneling can be enabled:

    - When using site-to-site VPN, by creating a route with a next hop type of *VPN Gateway*. Learn more about [configuring forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
    - If a 0.0.0.0/0 (default route) is advertised over BGP through a virtual network gateway when using a site-to-site VPN, or ExpressRoute circuit. Learn more about using BGP with a [site-to-site VPN](../vpn-gateway/vpn-gateway-bgp-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [ExpressRoute](../expressroute/expressroute-routing.md?toc=%2fazure%2fvirtual-network%2ftoc.json#ip-addresses-used-for-azure-private-peering).

- For virtual network peering traffic to work correctly, a system route with a next hop type of *VNet Peering* must exist for the peered virtual network's prefix range. If such a route doesn't exist, and the virtual network peering link is **Connected**:

    - Wait a few seconds, and retry. If it's a newly established peering link, it occasionally takes longer to propagate routes to all the network interfaces in a subnet. To learn more about virtual network peering, see [Virtual network peering overview](virtual-network-peering-overview.md) and [manage virtual network peering](virtual-network-manage-peering.md).

    - Network security group rules might be impacting communication. For more information, see [Diagnose a virtual machine network traffic filter problem](diagnose-network-traffic-filter-problem.md).

- Though Azure assigns default routes to each Azure network interface, if you have multiple network interfaces attached to the VM, only the primary network interface is assigned a default route (0.0.0.0/0), or gateway, within the VM's operating system. Learn how to create a default route for secondary network interfaces attached to a [Windows](/azure/virtual-machines/windows/multiple-nics?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) or [Linux](/azure/virtual-machines/linux/multiple-nics?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) VM. Learn more about [primary and secondary network  interfaces](virtual-network-network-interface-vm.yml#constraints).

## More diagnoses

* To run a quick test to determine the next hop type for traffic destined to a location, use the [Next hop](../network-watcher/diagnose-vm-network-routing-problem.md?toc=%2fazure%2fvirtual-network%2ftoc.json) capability of Azure Network Watcher. Next hop tells you what the next hop type is for traffic destined to a specified location.

* If there are no routes causing a VM network communication to fail, the problem might be due to firewall software running within the VM's operating system

* If you're [force tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md?toc=%2fazure%2fvirtual-network%2ftoc.json) traffic to an on-premises device through a VPN gateway, or NVA, you might not be able to connect to a VM from the internet, depending on how routing is configured for the devices. Confirm that the routing configured for the device routes traffic to either a public or private IP address for the VM.

* Use the [connection troubleshoot](../network-watcher/network-watcher-connectivity-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) capability of Network Watcher to determine routing, filtering, and in-OS causes of outbound communication problems.

## Next steps

- Learn about all tasks, properties, and settings for a [route table and routes](manage-route-table.yml).

- Learn about all [next hop types, system routes, and how Azure selects a route](virtual-networks-udr-overview.md).
