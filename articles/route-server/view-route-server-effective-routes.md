---
title: View effective routes in Azure Route Server
description: Learn how to inspect the routes that Azure Route Server learns by using the Azure portal, Azure PowerShell, or the Azure CLI.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ms.date: 11/02/2026
ai-usage: ai-assisted
#CustomerIntent: As an Azure network administrator, I want to view routes learned by Route Server so that I can verify the expected prefixes.
---

# View effective routes in Azure Route Server

To check the prefixes that Azure Route Server learns and their next hops, view its effective routes.

Effective routes show routing information, not packet delivery. Azure Route Server exchanges routes but doesn't forward data traffic.

## Prerequisites

- An Azure Route Server deployment. To inspect routes learned from peers or gateways, configure those connections first.
- For Azure PowerShell, [sign in to Azure](/powershell/azure/authenticate-azureps) and use the Az.Network module. For Azure CLI, [sign in to Azure](/cli/azure/authenticate-azure-cli) and use Azure CLI 2.55.0 or later with the `virtual-wan` extension. If the extension isn't installed, Azure CLI prompts you to install it the first time you run the command.

## View routes in the Azure portal

1. In the [Azure portal](https://portal.azure.com), open your Azure Route Server resource.
1. Under **Routing**, select **Effective Routes**.
1. Check the **Prefix**, **Next hop type**, **Next hop**, **Origin**, and **AS Path** columns for the routes you expect to learn.

## View routes with Azure PowerShell

Azure Route Server uses the virtual hub API. Use [Get-AzVHubEffectiveRoute](/powershell/module/az.network/get-azvhubeffectiveroute) with your Route Server's name as the virtual hub name:

```azurepowershell
(Get-AzVHubEffectiveRoute -ResourceGroupName 'myResourceGroup' -VirtualHubName 'myRouteServer').Value |
    Format-Table AddressPrefixes, NextHopType, NextHops, RouteOrigin, AsPath -AutoSize
```

## View routes with Azure CLI

Use [az network vhub get-effective-routes](/cli/azure/network/vhub#az-network-vhub-get-effective-routes) with your Route Server's name as the virtual hub name:

```azurecli
az network vhub get-effective-routes --resource-group 'myResourceGroup' --name 'myRouteServer' --output json
```

## Interpret the route information

| Property | Meaning |
| --- | --- |
| Prefix | Address prefix learned by Route Server. |
| Next hop type | Type of connection through which Route Server learned the prefix, such as `HubBgpConnection`, `VPN`, `ExpressRoute`, or `Virtual Network Connection`. |
| Next hop | IP address of the next hop; routes from a virtual network connection can show `On-link`. |
| Origin | Azure resource that originated the route; this value can be empty for virtual network connections. |
| AS Path | Sequence of autonomous system numbers associated with the address prefix. |

The effective routes table shows the route prefixes that Route Server learns from connected resources. When you apply an inbound route map to an NVA's BGP peering, compare the effective routes with the NVA's advertisements to check the resulting prefixes and BGP attributes.

An inbound map on a spoke virtual network connection can stop Route Server from advertising a spoke prefix to a BGP peer. The prefix can still appear as **On-link** in Effective Routes. That local entry alone doesn't verify propagation. Check the selected connection and direction in the [Connections dashboard](route-maps-how-to.md#apply-a-route-map-to-bgp-peerings-and-gateway-connections), and verify the routes that the intended BGP peer receives.

If an expected route or attribute is missing, follow [Configure route maps](route-maps-how-to.md#apply-a-route-map-to-bgp-peerings-and-gateway-connections) to check the connection, direction, and match conditions. For peer-specific commands, see [View routes that Route Server learns](configure-route-server.md#view-routes-that-route-server-learns).

## Related content

- [Configure and manage Azure Route Server](configure-route-server.md)
- [Configure route maps](route-maps-how-to.md)
