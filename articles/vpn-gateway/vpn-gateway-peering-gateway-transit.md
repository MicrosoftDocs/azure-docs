---
title: 'Configure VPN gateway transit for virtual network peering'
description: Learn how to configure gateway transit for virtual network peering in order to seamlessly connect two Azure virtual networks into one for connectivity purposes.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/19/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Configure VPN gateway transit for virtual network peering

This article helps you configure gateway transit for virtual network peering. [Virtual network peering](../virtual-network/virtual-network-peering-overview.md) seamlessly connects two Azure virtual networks, merging the two virtual networks into one for connectivity purposes. [Gateway transit](../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity) is a peering property that lets one virtual network use the VPN gateway in the peered virtual network for cross-premises or VNet-to-VNet connectivity. 

The following diagram shows how gateway transit works with virtual network peering. In the diagram, gateway transit allows the peered virtual networks to use the Azure VPN gateway in Hub-RM. Connectivity available on the VPN gateway, including S2S, P2S, and VNet-to-VNet connections, applies to all three virtual networks. 

:::image type="content" source="./media/vpn-gateway-peering-gateway-transit/gatewaytransit.png" alt-text="Diagram of Gateway transit." lightbox="./media/vpn-gateway-peering-gateway-transit/gatewaytransit.png":::

The transit option can be used with all VPN Gateway SKUs except the Basic SKU. 

In hub-and-spoke network architecture, gateway transit allows spoke virtual networks to share the VPN gateway in the hub, instead of deploying VPN gateways in every spoke virtual network. Routes to the gateway-connected virtual networks or on-premises networks propagate to the routing tables for the peered virtual networks using gateway transit. 

You can disable the automatic route propagation from the VPN gateway. Create a routing table with the "**Disable BGP route propagation**" option, and associate the routing table to the subnets to prevent the route distribution to those subnets. For more information, see [Virtual network routing table](../virtual-network/manage-route-table.yml).

>[!NOTE]
> If you make a change to the topology of your network and have Windows VPN clients, the VPN client package for Windows clients must be downloaded and installed again in order for the changes to be applied to the client.
>

## Prerequisites

This article requires the following VNets and permissions.

### <a name="vnet"></a>Virtual networks

| VNet | Configuration steps| Virtual network gateway|
|---|---|---|
| Hub-RM        | [Resource Manager](./tutorial-site-to-site-portal.md)                 | [Yes](tutorial-create-gateway-portal.md) |
| Spoke-RM      | [Resource Manager](./tutorial-site-to-site-portal.md)                 | No                                       |

### <a name="permissions"></a>Permissions

The accounts you use to create a virtual network peering must have the necessary roles or permissions. In the example below, if you were peering the two virtual networks named **Hub-RM** and **Spoke-Classic**, your account must have the following roles or permissions for each virtual network:

|VNet|Deployment model|Role|Permissions|
|---|---|---|---|
|Hub-RM|Resource Manager|[Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write|
|Spoke-RM|Resource Manager|[Network Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor)|Microsoft.Network/virtualNetworks/peer|

Learn more about [built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (Resource Manager only).

## To add a peering and enable transit

1. In the [Azure portal](https://portal.azure.com), create or update the virtual network peering from the Hub-RM. Go to the **Hub-RM** virtual network. Select **Peerings**, then **+ Add** to open **Add peering**.
1. On the **Add peering** page, configure the values for **Remote virtual network summary**.

    * Peering link name: Name the link. Example: **SpokeRMToHubRM**
    * Virtual network deployment model: **Resource Manager**
    * I know my resource ID: Leave blank. You only need to select this if you don't have read access to the virtual network or subscription you want to peer with.
    * Subscription: Select the subscription.
    * Virtual Network: **Spoke-RM**

1. On the **Add peering** page, configure the values for **Remote virtual network peering settings**.

    * Allow 'Spoke-RM' to access 'Hub-RM': **Leave the default of selected**.
    * Allow 'Spoke-RM' to receive forwarded traffic from 'Hub-RM': **Select the checkbox.**
    * Allow gateway or route server in the peered virtual network to forward traffic to 'Hub-RM': **Leave the default of un-selected**.
    * Enable 'SpokeRM' to use 'Hub-RM's' remote gateway or route server: **Select the checkbox.**

     :::image type="content" source="./media/vpn-gateway-peering-gateway-transit/peering-remote.png" alt-text="Screenshot shows add peering." lightbox="./media/vpn-gateway-peering-gateway-transit/peering-remote.png":::

1. On the **Add peering** page, configure the values for **Local virtual network summary**.

    * Peering link name: Name the link. Example: **HubRMToSpokeRM**

1. On the **Add peering** page, configure the values for **Local virtual network peering settings**.

    * Allow 'Hub-RM' to access the peered virtual network: **Leave the default of selected**.
    * Allow 'Hub-RM' to receive forwarded traffic from the peered virtual network: **Select the checkbox.**
    * Allow gateway or route server in 'Hub-RM' to forward traffic to the peered virtual network: **Select the checkbox.**
    * Enable 'Hub-RM' to use the peered virtual network's remote gateway or route server: **Leave the default of un-selected**.

     :::image type="content" source="./media/vpn-gateway-peering-gateway-transit/peering-vnet.png" alt-text="Screenshot shows values for remote virtual network." lightbox="./media/vpn-gateway-peering-gateway-transit/peering-vnet.png":::

1. Select **Add** to create the peering.
1. Verify the peering status as **Connected** on both virtual networks.

### To modify an existing peering for transit

If you have an already existing peering, you can modify the peering for transit.

1. Go to the virtual network. Select **Peerings** and select the peering that you want to modify. For example, on the Spoke-RM VNet, select the SpokeRMtoHubRM peering.

1. Update the VNet peering.

      Enable 'Spoke-RM' to use 'Hub-RM's' remote gateway or route server: **Select the checkbox.**

1. **Save** the peering settings.

### <a name="ps-same"></a>PowerShell sample

You can also use PowerShell to create or update the peering. Replace the variables with the names of your virtual networks and resource groups.

```azurepowershell-interactive
$SpokeRG = "SpokeRG1"
$SpokeRM = "Spoke-RM"
$HubRG   = "HubRG1"
$HubRM   = "Hub-RM"

$spokermvnet = Get-AzVirtualNetwork -Name $SpokeRM -ResourceGroup $SpokeRG
$hubrmvnet   = Get-AzVirtualNetwork -Name $HubRM -ResourceGroup $HubRG

Add-AzVirtualNetworkPeering `
  -Name SpokeRMtoHubRM `
  -VirtualNetwork $spokermvnet `
  -RemoteVirtualNetworkId $hubrmvnet.Id `
  -UseRemoteGateways

Add-AzVirtualNetworkPeering `
  -Name HubRMToSpokeRM `
  -VirtualNetwork $hubrmvnet `
  -RemoteVirtualNetworkId $spokermvnet.Id `
  -AllowGatewayTransit
```

## Next steps

* Learn more about [virtual network peering constraints and behaviors](../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints) and [virtual network peering settings](../virtual-network/virtual-network-manage-peering.md#create-a-peering) before creating a virtual network peering for production use.
* Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with virtual network peering and gateway transit.
* [Create virtual network peering with the same deployment model](../virtual-network/tutorial-connect-virtual-networks-portal.md).
* [Create virtual network peering with different deployment models](../virtual-network/create-peering-different-deployment-models.md).
