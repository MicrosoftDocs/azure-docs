---
title: Configure and manage Azure Route Server
description: Learn how to configure and manage Azure Route Server using the Azure portal, PowerShell, or Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: how-to
ms.date: 09/18/2024

---

# Configure and manage Azure Route Server 

In this article, you learn how to configure and manage Azure Route Server using the Azure portal, PowerShell, or Azure CLI.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A route server.


# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A route server.

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.


# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A route server.

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Add a peer

In this section, you learn how to add a BGP peering to your route server to peer with a network virtual appliance (NVA).

# [**Portal**](#tab/portal)

1. Go to the route server that you want to peer with an NVA.

1. under **Settings**, select **Peers**. 

1. Select **+ Add** to add a new peer.

1. On the **Add Peer** page, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | A name to identify the peer. It doesn't have to be the same name of the NVA. |
    | ASN | The Autonomous System Number (ASN) of the NVA. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use) |
    | IPv4 Address | The private IP address of the NVA. |

1. Select **Add** to save the configuration.

    :::image type="content" source="./media/configure-route-server/add-peer.png" alt-text="Screenshot that shows how to add the NVA to the route server as a peer." lightbox="./media/configure-route-server/add-peer.png":::

    Once the peer NVA is successfully added, you can see it in the list of peers with a **Succeeded** provisioning state.

    :::image type="content" source="./media/configure-route-server/peer-list.png" alt-text="Screenshot that shows the route server's peers." lightbox="./media/configure-route-server/peer-list.png":::

    To complete the peering setup, you must configure the NVA to establish a BGP session with the route server's peer IPs and ASN. You can find the route server's Peer IPs and ASN in the **Overview** page:

    :::image type="content" source="./media/configure-route-server/route-server-overview.png" alt-text="Screenshot that shows the Overview page of a route server. " lightbox="./media/configure-route-server/route-server-overview.png":::

    [!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

# [**PowerShell**](#tab/powershell)

Use [Add-AzRouteServerPeer](/powershell/module/az.network/add-azrouteserverpeer) cmdlet to add a new peer to the route server.

```azurepowershell-interactive
Add-AzRouteServerPeer -PeerName 'myNVA' -PeerAsn '65001' -PeerIp '10.0.0.4' -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

| Parameter | Value |
| ----- | ----- |
| `-PeerName` | A name to identify the peer. It doesn't have to be the same name of the NVA. |
| `-PeerAsn` | The Autonomous System Number (ASN) of the NVA. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use) |
| `-PeerIp` | The private IP address of the NVA. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-RouteServerName` | The route server name. This parameter is required when there are more than one route server in the same resource group. |

After you successfully add the peer NVA, you must configure the NVA to establish a BGP session with the route server's peer IPs and ASN. Use [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) cmdlet to find the route server's peer IPs and ASN:

```azurepowershell-interactive
Get-AzRouteServer -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

| Parameter | Value |
| ----- | ----- |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-RouteServerName` | The route server name. You need this parameter when there are more than one route server in the same resource group. |

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

# [**Azure CLI**](#tab/cli)

Use [az network routeserver peering create](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-create) command to add a new peer to the route server.

```azurecli-interactive
az network routeserver peering create --name 'myNVA' --peer-asn '65001' --peer-ip '10.0.0.4' --resource-group 'myResourceGroup' --routeserver 'myRouteServer' 
```

| Parameter | Value |
| ----- | ----- |
| `--name` | A name to identify the peer. It doesn't have to be the same name of the NVA. |
| `--peer-asn` | The Autonomous System Number (ASN) of the NVA. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use) |
| `--peer-ip` | The private IP address of the NVA. |
| `--resource-group` | The resource group name of your route server. |
| `--routeserver` | The route server name. |

After you successfully add the peer NVA, you must configure the NVA to establish a BGP session with the route server's peer IPs and ASN. Use [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show) command to find the route server's peer IPs and ASN:

```azurecli-interactive
az network routeserver show --name 'myRouteServer' --resource-group 'myResourceGroup' 
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The route server name. |
| `--resource-group` | The resource group name of your route server. |

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

---

## Configure route exchange

In this section, you learn how to enable exchanging routes between your route server and the virtual network gateway (ExpressRoute or VPN) that exists in the same virtual network.

[!INCLUDE [VPN gateway note](../../includes/route-server-note-vpn-gateway.md)]

[!INCLUDE [Downtime note](../../includes/route-server-note-vng-downtime.md)]

# [**Portal**](#tab/portal)

1. Go to the route server that you want to configure.

1. Under **Settings**, select **Configuration**.

1. Select **Enabled** for the **Branch-to-branch** setting and then select **Save**.

    :::image type="content" source="./media/configure-route-server/enable-route-exchange.png" alt-text="Screenshot that shows how to enable route exchange in a route server." lightbox="./media/configure-route-server/enable-route-exchange.png":::

# [**PowerShell**](#tab/powershell)

Use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver) cmdlet to enable or disable route exchange between the route server and the virtual network gateway.

```azurepowershell-interactive
Update-AzRouteServer -RouteServerName 'myRouteServer' -ResourceGroupName 'myResourceGroup' -AllowBranchToBranchTraffic 1
```

| Parameter | Value |
| ----- | ----- |
| `-RouteServerName` | The route server name. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-AllowBranchToBranchTraffic` | The route exchange parameter. Accepted values: `1` and `0`. |

To disable route exchange, set the `-AllowBranchToBranchTraffic` parameter to `0`.

Use [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) cmdlet to verify the configuration.

# [**Azure CLI**](#tab/cli)

Use [az network routeserver update](/cli/azure/network/routeserver#az-network-routeserver-update) command to enable or disable route exchange between the route server and the virtual network gateway.

```azurecli-interactive
az network routeserver peering show --name 'myRouteServer' --resource-group 'myResourceGroup' --allow-b2b-traffic true
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The route server name. |
| `--resource-group` | The resource group name of your route server. |
| `--allow-b2b-traffic` | The route exchange parameter. Accepted values: `true` and `false`. |

To disable route exchange, set the `--allow-b2b-traffic` parameter to `false`.

Use [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show) command to verify the configuration.

---

## Configure routing preference

In this section, you learn how to configure route preference to influence the route learning and selection of your route server.

# [**Portal**](#tab/portal)

1. Go to the route server that you want to configure.

1. Under **Settings**, select **Configuration**.

1. Select the routing preference that you want. Available options: **ExpressRoute** (default), **VPN**, and **ASPath**.

1. Select **Save**

    :::image type="content" source="./media/configure-route-server/configure-routing-preference.png" alt-text="Screenshot that shows how to configure routing preference in a route server." lightbox="./media/configure-route-server/configure-routing-preference.png":::

# [**PowerShell**](#tab/powershell)

Use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver) cmdlet to configure the routing preference setting of your route server.

```azurepowershell-interactive
Update-AzRouteServer -RouteServerName 'myRouteServer' -ResourceGroupName 'myResourceGroup' -HubRoutingPreference 'ASPath'
```

| Parameter | Value |
| ----- | ----- |
| `-RouteServerName` | The route server name. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-HubRoutingPreference` | The routing preference. Accepted values: `ExpressRoute` (default), `VpnGateway`, and `ASPath`. |

Use [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) cmdlet to verify the configuration.

# [**Azure CLI**](#tab/cli)

Use [az network routeserver update](/cli/azure/network/routeserver#az-network-routeserver-update) command to configure the routing preference setting of your route server.

```azurecli-interactive
az network routeserver peering show --name 'myRouteServer' --resource-group 'myResourceGroup' --hub-routing-preference 'ASPath'
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The route server name. |
| `--resource-group` | The resource group name of your route server. |
| `--hub-routing-preference` | The routing preference. Accepted values: `ExpressRoute` (default), `VpnGateway`, and `ASPath`. |

Use [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show) command to verify the configuration.

---


## View a peer

In this section, you learn how to view the details of a peer.

# [**Portal**](#tab/portal)

1. Go to the route server that you want to peer with an NVA.

1. under **Settings**, select **Peers**. 

1. In the list of peers, you can see the name, ASN, IP address, and provisioning state of any of the configured peers.

    :::image type="content" source="./media/configure-route-server/peer-list.png" alt-text="Screenshot that shows the configuration of a route server's peer." lightbox="./media/configure-route-server/peer-list.png":::


# [**PowerShell**](#tab/powershell)

Use [Get-AzRouteServerPeer](/powershell/module/az.network/get-azrouteserverpeer) cmdlet to view a route server peering.

```azurepowershell-interactive
Get-AzRouteServerPeer -PeerName 'myNVA' -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

| Parameter | Value |
| ----- | ----- |
| `-PeerName` | The peer name. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-RouteServerName` | The route server name. |


# [**Azure CLI**](#tab/cli)

Use [az network routeserver peering show](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-show) command to view a route server peering.

```azurecli-interactive
az network routeserver peering show --name 'myNVA' --resource-group 'myResourceGroup' --routeserver 'myRouteServer' 
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The peer name. |
| `--resource-group` | The resource group name of your route server. |
| `--routeserver` | The route server name. |


---


## View advertised and learned routes

In this section, you learn how to view the route server's advertised and learned routes.

# [**Portal**](#tab/portal)

Use [PowerShell](?tabs=powershell#view-advertised-and-learned-routes) or [Azure CLI](?tabs=cli#view-advertised-and-learned-routes) to view the advertised and learned routes.

# [**PowerShell**](#tab/powershell)

Use the [Get-AzRouteServerPeerAdvertisedRoute](/powershell/module/az.network/get-azrouteserverpeeradvertisedroute) cmdlet to view routes advertised by a route server.

```azurepowershell-interactive
Get-AzRouteServerPeerAdvertisedRoute -PeerName 'myNVA' -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

Use the [Get-AzRouteServerPeerLearnedRoute](/powershell/module/az.network/get-azrouteserverpeerlearnedroute) cmdlet to view routes learned by a route server.

```azurepowershell-interactive
Get-AzRouteServerPeerLearnedRoute -PeerName 'myNVA' -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

| Parameter | Value |
| ----- | ----- |
| `-PeerName` | The peer name. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-RouteServerName` | The route server name. |


# [**Azure CLI**](#tab/cli)

Use the [az network routeserver peering list-advertised-routes](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-list-advertised-routes) command to view routes advertised by a route server.


```azurecli-interactive
az network routeserver peering list-advertised-routes --name 'myNVA' --resource-group 'myResourceGroup' --routeserver 'myRouteServer' 
```

Use the [az network routeserver peering list-learned-routes](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-list-learned-routes) command to view routes learned by a route server.

```azurecli-interactive
az network routeserver peering list-learned-routes --name 'myNVA' --resource-group 'myResourceGroup' --routeserver 'myRouteServer' 
```

| Parameter | Value |
| ----- | ----- |
|` --name` | The peer name. |
| `--resource-group` | The resource group name of your route server. |
| `--routeserver` | The route server name. |

---

## Delete a peer

In this section, you learn how to delete an existing peering with a network virtual appliance (NVA).

# [**Portal**](#tab/portal)

1. Go to the route server that you want to delete its NVA peering.

1. under **Settings**, select **Peers**. 

1. Select the ellipses **...** next to the peer that you want to delete, and then select **Delete**.

    :::image type="content" source="./media/configure-route-server/delete-peer.png" alt-text="Screenshot that shows how to delete a route server's peer." lightbox="./media/configure-route-server/delete-peer.png":::

# [**PowerShell**](#tab/powershell)

Use [Remove-AzRouteServerPeer](/powershell/module/az.network/remove-azrouteserverpeer) cmdlet to delete a route server peering.

```azurepowershell-interactive
Get-AzRouteServerPeer -PeerName 'myNVA' -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

| Parameter | Value |
| ----- | ----- |
| `-PeerName` | The peer name. |
| `-ResourceGroupName` | The resource group name of your route server. |
| `-RouteServerName` | The route server name. |

# [**Azure CLI**](#tab/cli)

Use [az network routeserver peering delete](/cli/azure/network/routeserver/peering#az-network-routeserver-peering-delete) command to delete a route server peering.

```azurecli-interactive
az network routeserver peering delete --name 'myNVA' --resource-group 'myResourceGroup' --routeserver 'myRouteServer' 
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The peer name. |
| `--resource-group` | The resource group name of your route server. |
| `--routeserver` | The route server name. |

---

## Delete a route server

In this section, you learn how to delete an existing route server.

# [**Portal**](#tab/portal)

1. Go to the route server that you want to delete.

1. Select **Delete** from the **Overview** page.

1. Select **Confirm** to delete the route server.

    :::image type="content" source="./media/configure-route-server/delete-route-server.png" alt-text="Screenshot that shows how to delete a route server." lightbox="./media/configure-route-server/delete-route-server.png":::

# [**PowerShell**](#tab/powershell)

Use [Remove-AzRouteServer](/powershell/module/az.network/remove-azrouteserver) cmdlet to delete a route server.

```azurepowershell-interactive
Remove-AzRouteServer -RouteServerName 'myRouteServer' -ResourceGroupName 'myResourceGroup'
```

| Parameter | Value |
| ----- | ----- |
| `-RouteServerName` | The route server name. |
| `-ResourceGroupName` | The resource group name of your route server. |

# [**Azure CLI**](#tab/cli)

Use [az network routeserver delete](/cli/azure/network/routeserver#az-network-routeserver-delete) command to delete a route server.

```azurecli-interactive
az network routeserver delete --name 'myRouteServer' --resource-group 'myResourceGroup'
```

| Parameter | Value |
| ----- | ----- |
| `--name` | The route server name. |
| `--resource-group` | The resource group name of your route server. |

---

## Related content

- [Create a route server using the Azure portal](quickstart-configure-route-server-portal.md)
- [Configure BGP peering between a route server and (NVA)](peer-route-server-with-virtual-appliance.md)
- [Monitor Azure Route Server](monitor-route-server.md)
