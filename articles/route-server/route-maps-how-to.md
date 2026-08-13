---
title: Configure route maps for Azure Route Server
description: Learn how to create and configure route maps for Azure Route Server by using the Azure portal or Azure PowerShell to control route advertisements.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 07/17/2026

#CustomerIntent: As an Azure administrator, I want to configure route maps on Azure Route Server so that I can filter routes, aggregate prefixes, and modify BGP attributes for my BGP peerings and gateway connections.
---

# Configure route maps for Azure Route Server

> [!IMPORTANT]
> Route maps for Azure Route Server is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article shows you how to create, configure, and apply route maps on Azure Route Server by using the Azure portal or Azure PowerShell. For more information about route maps, see [About route maps for Azure Route Server](route-maps-about.md).

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network. If you need to create one, see [Create a Route Server - Portal](quickstart-create-route-server-portal.md).
- At least one of the following resources configured in the same virtual network as the route server:
    - A BGP peering with a network virtual appliance (NVA)
    - An ExpressRoute gateway connection
    - A VPN gateway connection

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Route Server deployed in a virtual network.
- Azure Cloud Shell or Azure PowerShell.
- Az.Network module version 8.0.0 or later.

---

Review [About route maps](route-maps-about.md#considerations-and-limitations) for considerations and limitations before proceeding.

## Configuration workflow

Follow these high-level steps to configure route maps:

1. Create or use an existing Azure Route Server.
1. Configure BGP peerings to your NVAs, and deploy any ExpressRoute or VPN gateways needed.
1. Verify that incoming and outgoing routes work as expected by using the **Effective Routes** view on your Azure Route Server.
1. Configure a route map and route-map rules, then save. For more information about route-map rules, see [About route maps](route-maps-about.md).
1. Apply the route map to the desired BGP peerings or gateway connections.
1. Verify the route map is working as expected using the **Effective Routes** view.

> [!NOTE]
> The first time you create a route map on an Azure Route Server, the route server undergoes an upgrade that takes approximately 30 minutes. After the upgrade completes, subsequent route map operations don't require another upgrade.

## Create a route map

# [**Portal**](#tab/portal)

To create a route map in the Azure portal:

1. In the Azure portal, go to your **Azure Route Server** resource.

1. In the left menu under **Settings**, select **route maps**.

1. On the **route maps** page, select **+ Add Route Map** to create a new route map.

1. On the **Create Route Map** page, enter a **Name** for the route map.

1. Select **+ Add rule** to create rules in the route map.

1. On the **Create Route Map rule** page, configure the following settings:

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

1. Repeat steps 6 and 7 to add more rules as needed.

1. On the **Create Route Map** page, verify that the rules are in the correct order. To adjust the order, hover over a row, then drag it up or down by using the three dots icon.

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

## Apply a route map to BGP peerings and gateway connections

After you save the route map, you can apply it to BGP peerings and gateway connections.

# [**Portal**](#tab/portal)

1. On **route maps**, select **Apply route maps**.

1. On **Apply route maps**, configure the following settings:

    - Under **Inbound Route Map**, select the route map you want to apply in the ingress direction.
    - Under **Outbound Route Map**, select the route map you want to apply in the egress direction.
    - The table at the bottom lists all BGP peerings and gateway connections. Select one or more connections to apply the route maps to.

1. Select **Save** to apply the route maps.

# [**PowerShell**](#tab/powershell)

To apply a route map when creating or updating it, specify the connection resource IDs by using the `-InboundConnection` and `-OutboundConnection` parameters with [New-AzRouteMap](/powershell/module/az.network/new-azroutemap) or [Update-AzRouteMap](/powershell/module/az.network/update-azroutemap):

```azurepowershell
New-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap" -RouteMapRule @($rule) -InboundConnection @("<connection-resource-id>")
```

---

1. Verify the changes by opening **Apply route maps** again from **route maps**.

1. Use the **Route Map dashboard** on the Route Server to verify that routes, AS-Path, and BGP communities are being modified as expected.

## Modify or remove a route map

# [**Portal**](#tab/portal)

1. Go to the **route maps** page on your Azure Route Server resource.
1. On the row for the route map you want to modify or remove, select **... > Edit** or **... > Delete**.

# [**PowerShell**](#tab/powershell)

To update an existing route map, use [Update-AzRouteMap](/powershell/module/az.network/update-azroutemap).

```azurepowershell
Update-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap" -RouteMapRule @($updatedRule)
```

To delete a route map, use [Remove-AzRouteMap](/powershell/module/az.network/remove-azroutemap).

```azurepowershell
Remove-AzRouteMap -ResourceGroupName "myResourceGroup" -VirtualHubName "myRouteServer" -Name "myRouteMap"
```

---

## Remove a route map from a connection

1. On **route maps**, select **Apply route maps**.
1. Select the checkbox for the connection you want to modify.
1. Change the **Inbound Route Map** or **Outbound Route Map** dropdowns to **None** for the connections you want to remove the route map from.
1. Select **Save**.

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

### AS-PATH modifications aren't applied

If AS-PATH changes don't take effect:

1. Verify that you're not using reserved ASNs (8074, 8075, 12076, 65515, 65517, 65518, 65519, 65520).
1. Confirm that the match conditions correctly identify the target routes.
1. Check the **Effective Routes** view to verify the AS-PATH values.

### Route map changes aren't taking effect

If a newly created or updated route map doesn't appear to affect routing:

1. If this route map is the first route map on the Route Server, wait for the one-time upgrade to complete (approximately 30 minutes). Check the **Provisioning state** on the route maps page.
1. Verify that the route map is applied to the correct connection in the correct direction (inbound or outbound).
1. Check the **Route Map dashboard** to confirm the route map is processing routes.

### Route map is matching more routes than expected

If a route map affects routes you didn't intend to modify:

1. Check whether the route-map rule has match conditions configured. A rule without match conditions matches all routes from the applied connection.
1. Verify that the match condition criterion is correct. **Equals** matches only the exact prefixes specified, while **Contains** matches the specified prefixes and all more-specific prefixes underneath them.
1. Review the rule order. Rules are evaluated sequentially, and a rule set to **Terminate** stops processing for matched routes.

## Related content

- [About route maps for Azure Route Server](route-maps-about.md)
- [Prepend routes by using route maps](route-maps-scenario-prepend-routes.md)
- [Tag routes with BGP communities by using route maps](route-maps-scenario-tag-bgp-communities.md)
- [What is Azure Route Server?](overview.md)
- [Configure and manage Azure Route Server](configure-route-server.md)
- [Azure Route Server FAQ](route-server-faq.md)
