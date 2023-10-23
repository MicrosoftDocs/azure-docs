---
title: 'Tutorial: Configure route filters for Microsoft peering - Azure PowerShell'
description: This tutorial describes how to configure route filters for Microsoft Peering using PowerShell.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: tutorial
ms.date: 07/20/2022
ms.author: duau
ms.custom: seodec18, devx-track-azurepowershell, template-tutorial
---
# Tutorial: Configure route filters for Microsoft peering using PowerShell

> [!div class="op_single_selector"]
> * [Azure Portal](how-to-routefilter-portal.md)
> * [Azure PowerShell](how-to-routefilter-powershell.md)
> * [Azure CLI](how-to-routefilter-cli.md)
> 

Route filters are a way to consume a subset of supported services through Microsoft peering. The steps in this article help you configure and manage route filters for ExpressRoute circuits.

Microsoft 365 services such as Exchange Online, SharePoint Online, and Skype for Business, and Azure public services, such as storage and SQL DB are accessible through Microsoft peering. Azure public services are selectable on a per region basis and can't be defined per public service.

When Microsoft peering gets configured in an ExpressRoute circuit, all prefixes related to these services gets advertised through the BGP sessions that are established. A BGP community value is attached to every prefix to identify the service that is offered through the prefix. For a list of the BGP community values and the services they  map to, see [BGP communities](expressroute-routing.md#bgp).

Connectivity to all Azure and Microsoft 365 services causes a large number of prefixes gets advertised through BGP. The large number of prefixes significantly increases the size of the route tables maintained by routers within your network. If you plan to consume only a subset of services offered through Microsoft peering, you can reduce the size of your route tables in two ways. You can:

* Filter out unwanted prefixes by applying route filters on BGP communities. Route filtering is a standard networking practice and is used commonly within many networks.

* Define route filters and apply them to your ExpressRoute circuit. A route filter is a new resource that lets you select the list of services you plan to consume through Microsoft peering. ExpressRoute routers only send the list of prefixes that belong to the services identified in the route filter.

:::image type="content" source="./media/how-to-routefilter-portal/route-filter-diagram.png" alt-text="Diagram of a route filter applied to the ExpressRoute circuit to allow only certain prefixes to be broadcast to the on-premises network.":::

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Get BGP community values.
> - Create route filter and filter rule.
> - Associate route filter to an ExpressRoute circuit.

### <a name="about"></a>About route filters

When Microsoft peering gets configured on your ExpressRoute circuit, the Microsoft Edge routers establish a pair of BGP sessions with your Edge routers through your connectivity provider. No routes are advertised to your network. To enable route advertisements to your network, you must associate a route filter.

A route filter lets you identify services you want to consume through your ExpressRoute circuit's Microsoft peering. It's essentially an allowed list of all the BGP community values. Once a route filter resource gets defined and attached to an ExpressRoute circuit, all prefixes that map to the BGP community values gets advertised to your network.

To attach route filters with Microsoft 365 services, you must have authorization to consume Microsoft 365 services through ExpressRoute. If you aren't authorized to consume Microsoft 365 services through ExpressRoute, the operation to attach route filters fails. For more information about the authorization process, see [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute).

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all Microsoft Office service prefixes advertised through Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit.
> 
## Prerequisites

- Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

- You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  - [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state.
  - [Create Microsoft peering](expressroute-circuit-peerings.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.
  
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

### Sign in to your Azure account and select your subscription

[!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

## <a name="prefixes"></a> Get a list of prefixes and BGP community values

1. Use the following cmdlet to get the list of BGP community values and prefixes associated with services accessible through Microsoft peering:

    ```azurepowershell-interactive
    Get-AzBgpServiceCommunity
    ```

1. Make a list of BGP community values you want to use in the route filter.

## <a name="filter"></a>Create a route filter and a filter rule

A route filter can have only one rule, and the rule must be of type 'Allow'. This rule can have a list of BGP community values associated with it. The command `az network route-filter create` only creates a route filter resource. After you create the resource, you must then create a rule and attach it to the route filter object.

1. To create a route filter resource, run the following command:

    ```azurepowershell-interactive
    New-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup" -Location "West US"
    ```

1. To create a route filter rule, run the following command:
 
    ```azurepowershell-interactive
    $rule = New-AzRouteFilterRuleConfig -Name "Allow-EXO-D365" -Access Allow -RouteFilterRuleType Community -CommunityList 12076:5010,12076:5040
    ```

1. Run the following command to add the filter rule to the route filter:
 
    ```azurepowershell-interactive
    $routefilter = Get-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
    $routefilter.Rules.Add($rule)
    Set-AzRouteFilter -RouteFilter $routefilter
    ```

## <a name="attach"></a>Attach the route filter to an ExpressRoute circuit

Run the following command to attach the route filter to the ExpressRoute circuit, assuming you have only Microsoft peering:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "MyResourceGroup"
$ckt.Peerings[0].RouteFilter = $routefilter 
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## <a name="tasks"></a>Common tasks

### <a name="getproperties"></a>To get the properties of a route filter

To get the properties of a route filter, use the following steps:

1. Run the following command to get the route filter resource:

   ```azurepowershell-interactive
   $routefilter = Get-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
   ```
2. Get the route filter rules for the route-filter resource by running the following command:

   ```azurepowershell-interactive
   $routefilter = Get-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
   $rule = $routefilter.Rules[0]
   ```

### <a name="updateproperties"></a>To update the properties of a route filter

If the route filter is already attached to a circuit, updates to the BGP community list automatically propagate prefix advertisement changes through the BGP session established. You can update the BGP community list of your route filter using the following command:

```azurepowershell-interactive
$routefilter = Get-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
$routefilter.rules[0].Communities = "12076:5030", "12076:5040"
Set-AzRouteFilter -RouteFilter $routefilter
```

### <a name="detach"></a>To detach a route filter from an ExpressRoute circuit

Once a route filter is detached from the ExpressRoute circuit, no prefixes are advertised through the BGP session. You can detach a route filter from an ExpressRoute circuit using the following command:
  
```azurepowershell-interactive
$ckt.Peerings[0].RouteFilter = $null
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

## Clean up resources

You can only delete a route filter if it isn't attached to any circuit. Ensure that the route filter isn't attached to any circuit before attempting to delete it. You can delete a route filter using the following command:

```azurepowershell-interactive
Remove-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
```

## Next Steps

For information about router configuration samples, see:

> [!div class="nextstepaction"]
> [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md)
