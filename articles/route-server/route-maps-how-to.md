---
title: Configure route maps for Azure Route Server
description: Learn how to create and configure route maps for Azure Route Server by using the Azure portal or Azure PowerShell to control route advertisements.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 10/27/2026

#CustomerIntent: As an Azure administrator, I want to configure route maps on Azure Route Server so that I can filter routes, aggregate prefixes, and modify BGP attributes for my BGP peerings and gateway connections.
---

# Configure route maps for Azure Route Server

> [!NOTE]
> Route maps for Azure Route Server are generally available in the Azure public cloud.

This article shows you how to create route maps on Azure Route Server and apply them to connections. You can create route maps and apply them to BGP peerings by using the Azure portal or Azure PowerShell. To apply route maps to gateway and virtual network connections, use the Azure portal. For more information about route maps, see [About route maps for Azure Route Server](route-maps-about.md).

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network. If you need to create one, see [Create a Route Server - Portal](quickstart-create-route-server-portal.md).
- At least one of the following connections:
    - A BGP peering with a network virtual appliance (NVA)
    - An ExpressRoute gateway connection in the same virtual network
    - A VPN gateway connection in the same virtual network
    - A virtual network connection for a peered spoke. Create a route map first, then create the connection as described in [Create a virtual network connection for a spoke](#create-a-virtual-network-connection-for-a-spoke).

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network. If you need to create one, see [Create a Route Server - PowerShell](quickstart-create-route-server-powershell.md).
- At least one BGP peering to apply the route map to. To apply route maps to ExpressRoute gateway, VPN gateway, or spoke virtual network connections, use the Azure portal.
- Azure Cloud Shell or Azure PowerShell.
- Az.Network module version 8.2.0 or later.

---

Review [About route maps](route-maps-about.md#considerations-and-limitations) for considerations and limitations before proceeding.

## Configuration workflow

Follow these high-level steps to configure route maps:

1. Create or use an existing Azure Route Server.
1. Configure the BGP peers, gateways, or spoke virtual network peerings needed for your scenario.
1. Record the expected routes before applying a policy. See [View effective routes](view-route-server-effective-routes.md).
1. Configure a route map and route-map rules, then save. For more information about route-map rules, see [About route maps](route-maps-about.md).
1. If the policy targets a peered spoke, create a virtual network connection after the route map exists. Apply the route map to the intended connection.
1. Compare the **Connections Dashboard** and **Effective Routes** views with the expected policy results. For spoke routes, also verify propagation at the receiving BGP peer.

> [!NOTE]
> The first time you create a route map on an Azure Route Server, the route server undergoes an upgrade that can take up to 30 minutes. After the upgrade completes, subsequent route map operations don't require another upgrade.

## Create a route map

# [**Portal**](#tab/portal)

To create a route map in the Azure portal:

1. In the Azure portal, go to your **Azure Route Server** resource.

1. In the left menu under **Routing**, select **Route Maps**.

1. On the **Route Maps** page, select **+ Add Route-map** to create a new route map.

1. On the **Create Route-map** page, enter a **Name** for the route map.

1. Select **+ Add rule** to create rules in the route map.

1. On the **Create Route-map rule** page, configure the following settings:

    - **Name**: Enter a name for the route-map rule.
    - **Next step**: Select **Continue** if routes matching this rule should be processed by subsequent rules. Select **Terminate** to stop processing after this rule.
    - **Match conditions**: Configure one or more match conditions for the rule. Each match condition requires a **Property**, **Criterion**, and **Value**.
        - To add a match condition, select the empty row in the table.
        - To delete a match condition, select the delete icon at the end of the row.
        - Use a comma (,) as a delimiter to add multiple values. For supported match conditions, see [About route maps](route-maps-about.md#match-conditions).
    - **Actions > Action on matched routes**: Select **Drop** to deny the matched routes, or **Modify** to permit and modify the matched routes.
    - **Actions > Route modifications**: Configure one or more route modifications. Each modification requires a **Property**, **Action**, and **Value**.
        - To add a modification, select the empty row in the table.
        - To delete a modification, select the delete icon at the end of the row.
        - Use a comma (,) as a delimiter to add multiple values. For supported actions, see [About route maps](route-maps-about.md#route-modifications).

1. Select **Add** to save the rule. This step stores the rule temporarily in the portal but doesn't save it to the route map yet.

1. Repeat steps 5 through 7 to add more rules as needed.

1. On the **Create Route-map** page, verify that the rules are in the correct order. To adjust the order, hover over a row, then drag it up or down by using the three dots icon.

1. Select **Save** to save all the rules to the route map.

    It takes a few minutes to save the route map and the route-map rules. After the save completes, the **Provisioning state** shows **Succeeded**.

# [**PowerShell**](#tab/powershell)

> [!NOTE]
> Azure Route Server uses the virtual hub API. In the following commands, use your Route Server name for the `-VirtualHubName` parameter.

1. Create the match criterion and action for a route-map rule by using [New-AzRouteMapRuleCriterion](/powershell/module/az.network/new-azroutemaprulecriterion), [New-AzRouteMapRuleActionParameter](/powershell/module/az.network/new-azroutemapruleactionparameter), and [New-AzRouteMapRuleAction](/powershell/module/az.network/new-azroutemapruleaction):

    ```azurepowershell
    $criterion = New-AzRouteMapRuleCriterion -MatchCondition "Contains" -RoutePrefix @("10.0.0.0/16")

    $actionParam = New-AzRouteMapRuleActionParameter -AsPath @("64511")

    $action = New-AzRouteMapRuleAction -Type "Add" -Parameter @($actionParam)
    ```

1. Create a route-map rule by using [New-AzRouteMapRule](/powershell/module/az.network/new-azroutemaprule):

    ```azurepowershell
    $rule = New-AzRouteMapRule -Name "myRule" -MatchCriteria @($criterion) -RouteMapRuleAction @($action) -NextStepIfMatched "Continue"
    ```

1. Create the route map on your Route Server (virtual hub) with the rule by using [New-AzRouteMap](/powershell/module/az.network/new-azroutemap):

    ```azurepowershell
    New-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap" -RouteMapRule @($rule)
    ```

1. Verify the route map was created by using [Get-AzRouteMap](/powershell/module/az.network/get-azroutemap):

    ```azurepowershell
    Get-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap"
    ```

---

## Create a virtual network connection for a spoke

Use this procedure when Route Server is in a hub virtual network and you need to apply a route map to routes exchanged with a peered spoke, including routes advertised by an NVA in that spoke. Create a virtual network connection for the spoke as the route-map association point. For an NVA in the same virtual network as Route Server, apply the map to its existing BGP peering instead.

For a worked example, see [Apply route maps to an NVA in a spoke virtual network](route-maps-scenario-spoke-network-virtual-appliance.md).

1. Configure virtual network peering between the hub and spoke first. On the hub-to-spoke peering, enable **allowGatewayTransit**; on the spoke-to-hub peering, enable **useRemoteGateways**. Review the [route map restrictions](#route-map-restrictions).
1. Create at least one route map by using the preceding procedure. Creating the virtual network connection before a route map exists fails.
1. On Route Server, under **Connectivity**, select **Virtual network connections**, and then **Add connection**.
1. Select the resource group and the peered spoke virtual network that contains the NVA or prefixes you want the policy to affect. Select the spoke, not the hub. You can select maps in **Inbound Route Map** and **Outbound Route Map** on this page, or leave them set to **None** and apply the maps later as described in the next section. Then select **Create**.
1. After deployment completes, select **Refresh**. Confirm that **Connection Provisioning Status** is **Succeeded** and **Peering status** is **Connected** before applying the route map.

The connection doesn't create or replace virtual network peering or BGP peering. Resolve a failed connection or disconnected peering before continuing.

## Apply a route map to BGP peerings and gateway connections

After you save the route map, you can apply it to BGP peerings, gateway connections, or a virtual network connection created in the preceding section. Inbound applies as Route Server receives routes through the connection; outbound applies as Route Server advertises routes through it.

# [**Portal**](#tab/portal)

1. On **Route Maps**, select **Apply Route-maps to connections**.

1. On **Apply Route-maps to connections**, configure the following settings:

    - Under **Inbound Route-map**, select the route map you want to apply in the ingress direction.
    - Under **Outbound Route-map**, select the route map you want to apply in the egress direction.
    - Use the connection type and name to identify the intended BGP peering, gateway connection, or virtual network connection. Select only the connections to which the policy should apply.

    For an NVA in a peered spoke, select the virtual network connection for that spoke. For an NVA in the same virtual network as Route Server, select the existing BGP peering. Don't substitute one association point for the other.

1. Select **Save** to apply the route maps.

# [**PowerShell**](#tab/powershell)

To apply a route map to a BGP peering, use [Update-AzRouteServerPeer](/powershell/module/az.network/update-azrouteserverpeer) with the `-RoutingConfiguration` parameter. This parameter requires Az.Network module version 8.2.0 or later. To apply route maps to gateway connections and virtual network connections, use the **Portal** tab.

`Update-AzRouteServerPeer` replaces the peering's entire routing configuration. Start from the peering's current routing configuration so you keep any route maps that are already applied. If you run `Update-AzRouteServerPeer` without `-RoutingConfiguration`, it removes the route maps from the peering.

```azurepowershell
$routeMap = Get-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap"
$peer = Get-AzRouteServerPeer -ResourceGroupName "myResourceGroup" -RouteServerName "myRouteServer" -PeerName "myBgpPeer"

$routingConfig = $peer.RoutingConfiguration
$routingConfig.InboundRouteMap = New-Object Microsoft.Azure.Commands.Network.Models.PSResourceId -Property @{ Id = $routeMap.Id }
# To apply the route map in the outbound direction, set $routingConfig.OutboundRouteMap instead.

Update-AzRouteServerPeer -ResourceGroupName "myResourceGroup" -RouteServerName "myRouteServer" `
    -PeerName $peer.Name -PeerIp $peer.PeerIp -PeerAsn $peer.PeerAsn `
    -RoutingConfiguration $routingConfig
```

To confirm the association, check the peering's routing configuration:

```azurepowershell
(Get-AzRouteServerPeer -ResourceGroupName "myResourceGroup" -RouteServerName "myRouteServer" -PeerName "myBgpPeer").RoutingConfiguration.InboundRouteMap
```

---

Verify the association and its effect in the Azure portal:

1. Verify the association by opening **Apply Route-maps to connections** again from **Route Maps**.

1. Under **Routing**, select **Route Maps**, and then open **Connections Dashboard**. Select the connection and route-map direction, and compare the routes with your expected policy results. Use [Effective Routes](view-route-server-effective-routes.md) to inspect the resulting routes in Route Server. A successful resource association alone doesn't verify the policy's effect.

To verify an inbound route map on a virtual network connection:

1. In **Connections Dashboard**, select **Virtual Networks**, the connection, and **In the inbound direction**. Confirm that **Route-map applied** shows the intended map.
1. Review **Total Prefix Count** and the route list. For this connection and direction, they show the routes remaining after inbound route-map processing. Confirm that a prefix matched by a **Drop** rule is absent and an unmatched control prefix remains.
1. Check **Effective Routes**. A dropped spoke prefix can still appear as **On-link** because the spoke's local route remains. That entry alone doesn't show whether the prefix was propagated.
1. Verify propagation at the receiving BGP peer. Confirm that the dropped prefix is absent and the expected remaining prefixes are present. Route propagation doesn't verify packet delivery.

## Modify or remove a route map

# [**Portal**](#tab/portal)

1. Go to the **Route Maps** page on your Azure Route Server resource.
1. On the row for the route map you want to modify or remove, select **... > Edit** or **... > Delete**.

# [**PowerShell**](#tab/powershell)

To update an existing route map, create the rules by using [New-AzRouteMapRule](/powershell/module/az.network/new-azroutemaprule) as shown earlier, and then use [Update-AzRouteMap](/powershell/module/az.network/update-azroutemap).

```azurepowershell
Update-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap" -RouteMapRule @($updatedRule)
```

To delete a route map, use [Remove-AzRouteMap](/powershell/module/az.network/remove-azroutemap).

```azurepowershell
Remove-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap"
```

---

## Remove a route map from a connection

# [**Portal**](#tab/portal)

1. On **Route Maps**, select **Apply Route-maps to connections**.
1. Select the checkbox for the connection you want to modify.
1. Change the **Inbound Route-map** or **Outbound Route-map** dropdowns to **None** for the connections you want to remove the route map from.
1. Select **Save**.

# [**PowerShell**](#tab/powershell)

To remove a route map from a BGP peering, set the route map in the peering's routing configuration to `$null`, and then update the peering:

```azurepowershell
$peer = Get-AzRouteServerPeer -ResourceGroupName "myResourceGroup" -RouteServerName "myRouteServer" -PeerName "myBgpPeer"
$routingConfig = $peer.RoutingConfiguration
$routingConfig.InboundRouteMap = $null

Update-AzRouteServerPeer -ResourceGroupName "myResourceGroup" -RouteServerName "myRouteServer" `
    -PeerName $peer.Name -PeerIp $peer.PeerIp -PeerAsn $peer.PeerAsn `
    -RoutingConfiguration $routingConfig
```

---

## Route map restrictions

- Route maps aren't supported for VPN VNet-to-VNet connections.
- You can apply a route map to a virtual network connection only if the spoke virtual network is peered with the hub virtual network. On the hub-to-spoke peering, enable **allowGatewayTransit**. On the spoke-to-hub peering, enable **useRemoteGateways**.
- Route maps aren't supported on a virtual network connection between two hub virtual networks when Azure Route Server is deployed in both hubs.

## Troubleshoot route maps

### Route map is in a failed state

If a route map fails to provision:

1. Verify that the route-map rules are configured correctly and don't contain invalid values.
1. Check that you're not using reserved ASNs or attempting to remove Azure BGP communities. For more information, see [Considerations and limitations](route-maps-about.md#considerations-and-limitations).
1. Delete the failed route map and create a new one.
1. If the issue persists, open a support case.

### Routes aren't being summarized

If route summarization doesn't work as expected:

1. Verify the match conditions are configured to match the correct prefixes.
1. Ensure the route modification action is set to **Replace** with the correct summary prefix.
1. Check the **Effective Routes** view on the route server to verify the routes before and after the route map is applied.

### AS path modifications aren't applied

If AS path changes don't take effect:

1. Verify that you're not using reserved ASNs (8074, 8075, 12076, 65515, 65517, 65518, 65519, 65520).
1. Confirm that the match conditions correctly identify the target routes.
1. Check the **Effective Routes** view to verify the AS path values.

### Azure CLI or Azure PowerShell commands fail after you create a route map

After you create a route map on a route server, some Azure CLI and Azure PowerShell commands fail on that route server, even if you later delete the route map:

- `az network routeserver peering create` fails with the error `ApiVersionDoesNotSupportConnectionsForRouteServer`. To add a BGP peer, use the Azure portal or [Add-AzRouteServerPeer](/powershell/module/az.network/add-azrouteserverpeer).
- `az network routeserver delete` and `Remove-AzRouteServer` fail with the error `RouteServerHasAssociatedHubIPConfigurationCannotBeDeleted`. To delete the route server, send a delete request to the Azure Resource Manager REST API:

  ```azurecli-interactive
  az rest --method delete --url "https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/virtualHubs/<route-server-name>?api-version=2026-05-01"
  ```

  The deletion can take up to 40 minutes. To check progress, run the same URL with `--method get` until the request returns a `ResourceNotFound` error.

### Route map changes aren't taking effect

If a newly created or updated route map doesn't appear to affect routing:

1. If this route map is the first route map on the route server, wait for the one-time upgrade to complete (up to 30 minutes). Check the **Provisioning state** on the **Route Maps** page.
1. Verify that the route map is applied to the correct connection in the correct direction (inbound or outbound).
1. Check **Connections Dashboard** for the connection and direction to confirm the route map is processing routes.
1. For an inbound map on a virtual network connection, compare the dashboard's remaining routes with those received by the BGP peer. A spoke prefix that remains **On-link** in **Effective Routes** doesn't by itself mean that the map failed to drop it.

### Route map is matching more routes than expected

If a route map affects routes you didn't intend to modify:

1. Check whether the route-map rule has match conditions configured. A rule without match conditions matches all routes from the applied connection.
1. Verify that the match condition criterion is correct. **Equals** matches only the exact prefixes specified, while **Contains** matches the specified prefixes and all more-specific prefixes underneath them.
1. Review the rule order. Rules are evaluated sequentially, and a rule set to **Terminate** stops processing for matched routes.

## Related content

- [Configure dual-stack route maps by using the Azure portal](route-maps-dual-stack-portal.md)
- [View effective routes](view-route-server-effective-routes.md)
- [About route maps for Azure Route Server](route-maps-about.md)
- [Prepend routes by using route maps](route-maps-scenario-prepend-routes.md)
- [Tag routes with BGP communities by using route maps](route-maps-scenario-tag-bgp-communities.md)
- [Drop inbound routes by using route maps](route-maps-scenario-drop-inbound-routes.md)
- [Apply route maps to an NVA in a spoke virtual network](route-maps-scenario-spoke-network-virtual-appliance.md)
- [What is Azure Route Server?](overview.md)
- [Configure and manage Azure Route Server](configure-route-server.md)
- [Azure Route Server FAQ](route-server-faq.md)
