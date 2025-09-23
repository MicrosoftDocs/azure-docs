---
title: 'Configure route filters for Microsoft peering'
description: This article shows you how to configure route filters for Microsoft peering.
services: expressroute
author: duau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 07/10/2025
ms.author: duau
ms.custom:
  - template-tutorial
  - sfi-image-nochange
# Customer intent: As a network administrator, I want to configure route filters for Microsoft peering in my ExpressRoute circuit, so that I can selectively manage and reduce the size of advertised prefixes for services, optimizing network performance.
---
# Configure route filters for Microsoft peering

Route filters allow you to consume a subset of supported services through Microsoft peering. This article guides you through configuring and managing route filters for ExpressRoute circuits.

Microsoft 365 services, such as Exchange Online, SharePoint Online, and Skype for Business, are accessible through Microsoft peering. When Microsoft peering is configured in an ExpressRoute circuit, all prefixes related to these services are advertised through the BGP sessions. Each prefix has a BGP community value to identify the service it offers. For a list of BGP community values and their corresponding services, see [BGP communities](expressroute-routing.md#bgp).

Connecting to all Azure and Microsoft 365 services can result in a large number of prefixes getting advertised through BGP, significantly increasing the size of your route tables. If you only need a subset of services offered through Microsoft peering, you can reduce your route table size by:

* Filtering out unwanted prefixes using route filters on BGP communities, a common networking practice.
* Defining route filters and applying them to your ExpressRoute circuit. A route filter is a resource that lets you select the services you plan to consume through Microsoft peering. ExpressRoute routers only send prefixes for the services identified in the route filter.

:::image type="content" source="./media/how-to-routefilter-portal/route-filter-diagram.png" alt-text="Diagram of a route filter applied to the ExpressRoute circuit to allow only certain prefixes to be broadcast to the on-premises network." lightbox="./media/how-to-routefilter-portal/route-filter-diagram.png":::

### About route filters

When Microsoft peering is configured on your ExpressRoute circuit, Microsoft edge routers establish BGP sessions with your edge routers through your connectivity provider. No routes are advertised to your network until you associate a route filter.

A route filter lets you specify the services you want to consume through your ExpressRoute circuit's Microsoft peering. It acts as an allowed list of BGP community values. Once a route filter is defined and attached to an ExpressRoute circuit, all prefixes that map to the BGP community values are advertised to your network.

To attach route filters with Microsoft 365 services, you must be authorized to consume Microsoft 365 services through ExpressRoute. If you aren't authorized, the operation to attach route filters fail. For more information about the authorization process, see [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute).

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits configured before August 1, 2017, will have all Microsoft Office service prefixes advertised through Microsoft peering, even without route filters. For circuits configured on or after August 1, 2017, no prefixes will be advertised until a route filter is attached to the circuit.

## Prerequisites

Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before starting the configuration.

# [**Portal**](#tab/portal)

- Ensure you have an active ExpressRoute circuit with Microsoft peering configured. For instructions, see:
    - [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and provisioned by your connectivity provider. The circuit must be in a provisioned and enabled state.
    - [Create Microsoft peering](expressroute-howto-routing-portal-resource-manager.md) if you manage the BGP session directly, or have your connectivity provider create Microsoft peering for your circuit.

# [**PowerShell**](#tab/powershell)

- You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  - [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state.
  - [Create Microsoft peering](expressroute-circuit-peerings.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.
  
[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

- Sign in to your Azure account and select your subscription

[!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

# [**Azure CLI**](#tab/cli)

To successfully connect to services through Microsoft peering, you must complete the following configuration steps:

* You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  * [Create an ExpressRoute circuit](howto-circuit-cli.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state.
  * [Create Microsoft peering](howto-routing-cli.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)] 

If you choose to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you're using the "Try It", you're signed in automatically and can skip the sign in step. Use the following examples to help you connect:

```azurecli
az login
```

Check the subscriptions for the account.

```azurecli-interactive
az account list
```

Select the subscription for which you want to create an ExpressRoute circuit.

```azurecli-interactive
az account set --subscription "<subscription ID>"
```

---

## Get a list of prefixes and BGP community values

# [**Portal**](#tab/portal)

Get a list of BGP community values. Find the BGP community values associated with services accessible through Microsoft peering on the [ExpressRoute routing requirements](expressroute-routing.md) page.

# [**PowerShell**](#tab/powershell)

Use the following cmdlet to get the list of BGP community values and prefixes associated with services accessible through Microsoft peering:

```azurepowershell-interactive
Get-AzBgpServiceCommunity
```

# [**Azure CLI**](#tab/cli)

Use the following cmdlet to get the list of BGP community values and prefixes associated with services accessible through Microsoft peering:

```azurecli-interactive
az network route-filter rule list-service-communities
```

---

## Make a list of the values you want to use

List the [BGP community values](expressroute-routing.md#bgp) you want to use in the route filter.

## Create a route filter and a filter rule

# [**Portal**](#tab/portal)

A route filter can have only one rule, which must be of type *Allow*. This rule can include a list of BGP community values.

1. Select **Create a resource** and search for *Route filter*:

1. Place the route filter in a resource group. Ensure the location matches the ExpressRoute circuit. Select **Review + create** and then **Create**.

    :::image type="content" source="./media/how-to-routefilter-portal/create-route-filter-basic.png" alt-text="Screenshot showing the Create route filter page with example values.":::

### Create a filter rule

1. To add and update rules, select the managed rule tab for your route filter.

    :::image type="content" source="./media/how-to-routefilter-portal/manage-route-filter.png" alt-text="Screenshot showing the Overview page with the Manage rule action highlighted.":::

1. Then select the services you want to connect to from the drop-down list and save the rule.

# [**PowerShell**](#tab/powershell)

A route filter can have only one rule, and the rule must be of type `Allow`. This rule can have a list of BGP community values associated with it. The command `az network route-filter create` only creates a route filter resource. After you create the resource, you must then create a rule and attach it to the route filter object.

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

# [**Azure CLI**](#tab/cli)

A route filter can have only one rule, and the rule must be of type 'Allow'. This rule can have a list of BGP community values associated with it. The command `az network route-filter create` only creates a route filter resource. After you create the resource, you must then create a rule and attach it to the route filter object.

1. To create a route filter resource, run the following command:

    ```azurecli-interactive
    az network route-filter create -n MyRouteFilter -g MyResourceGroup
    ```

1. To create a route filter rule, run the following command:
 
    ```azurecli-interactive
    az network route-filter rule create --filter-name MyRouteFilter -n CRM --communities 12076:5040 --access Allow -g MyResourceGroup
    ```

---

## Attach the route filter to an ExpressRoute circuit

# [**Portal**](#tab/portal)

Attach the route filter to a circuit by selecting the **+ Add Circuit** button and choosing the ExpressRoute circuit from the drop-down list.

:::image type="content" source="./media/how-to-routefilter-portal/add-circuit-to-route-filter.png" alt-text="Screenshot showing the Overview page with the Add circuit action selected.":::

If your connectivity provider configures peering for your ExpressRoute circuit, refresh the circuit from the ExpressRoute circuit page before selecting the **+ Add Circuit** button.

:::image type="content" source="./media/how-to-routefilter-portal/refresh-express-route-circuit.png" alt-text="Screenshot showing the Overview page with the Refresh action selected.":::

# [**PowerShell**](#tab/powershell)

Run the following command to attach the route filter to the ExpressRoute circuit, assuming you have only Microsoft peering:

```azurepowershell-interactive
$ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "MyResourceGroup"
$index = [array]::IndexOf(@($ckt.Peerings.PeeringType), "MicrosoftPeering")
$ckt.Peerings[$index].RouteFilter = $routefilter
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

# [**Azure CLI**](#tab/cli)

Run the following command to attach the route filter to the ExpressRoute circuit:

```azurecli-interactive
az network express-route peering update --circuit-name MyCircuit -g ExpressRouteResourceGroupName --name MicrosoftPeering --route-filter MyRouteFilter
```

---

## Common tasks

### To get the properties of a route filter

# [**Portal**](#tab/portal)

View the properties of a route filter by opening the resource in the portal.

:::image type="content" source="./media/how-to-routefilter-portal/view-route-filter.png" alt-text="Screenshot showing the Overview page.":::

# [**PowerShell**](#tab/powershell)

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

# [**Azure CLI**](#tab/cli)

To get the properties of a route filter, use the following command:

```azurecli-interactive
az network route-filter show -g ExpressRouteResourceGroupName --name MyRouteFilter 
```

---

### To update the properties of a route filter

# [**Portal**](#tab/portal)

1. Update the list of BGP community values attached to a circuit by selecting the **Manage rule** button.

    :::image type="content" source="./media/how-to-routefilter-portal/update-route-filter.png" alt-text="Screenshot showing how to update Route filters with the Manage rule action.":::

1. Select the service communities you want and then select **Save**.

# [**PowerShell**](#tab/powershell)

If the route filter is already attached to a circuit, updates to the BGP community list automatically propagate prefix advertisement changes through the BGP session established. You can update the BGP community list of your route filter using the following command:

```azurepowershell-interactive
$routefilter = Get-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
$routefilter.rules[0].Communities = "12076:5030", "12076:5040"
Set-AzRouteFilter -RouteFilter $routefilter
```

# [**Azure CLI**](#tab/cli)

If the route filter is already attached to a circuit, updates to the BGP community list automatically propagate prefix advertisement changes through the BGP session established. You can update the BGP community list of your route filter using the following command:

```azurecli-interactive
az network route-filter rule update --filter-name MyRouteFilter -n CRM -g ExpressRouteResourceGroupName --add communities '12076:5040' --add communities '12076:5010'
```

---

### To detach a route filter from an ExpressRoute circuit

# [**Portal**](#tab/portal)

Detach a circuit from the route filter by right-clicking on the circuit and selecting **Dissociate**.

:::image type="content" source="./media/how-to-routefilter-portal/detach-route-filter.png" alt-text="Screenshot showing the Overview page with the Dissociate action highlighted.":::

# [**PowerShell**](#tab/powershell)

Once a route filter is detached from the ExpressRoute circuit, no prefixes are advertised through the BGP session. You can detach a route filter from an ExpressRoute circuit using the following command:
  
```azurepowershell-interactive
$ckt.Peerings[0].RouteFilter = $null
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

# [**Azure CLI**](#tab/cli)

Once a route filter is detached from the ExpressRoute circuit, no prefixes are advertised through the BGP session. You can detach a route filter from an ExpressRoute circuit using the following command:

```azurecli-interactive
az network express-route peering update --circuit-name MyCircuit -g ExpressRouteResourceGroupName --name MicrosoftPeering --remove routeFilter
```

---

## Clean up resources

# [**Portal**](#tab/portal)

Delete a route filter by selecting the **Delete** button. Ensure the route filter isn't associated with any circuit before doing so.

:::image type="content" source="./media/how-to-routefilter-portal/delete-route-filter.png" alt-text="Screenshot showing how to delete a route filter.":::

# [**PowerShell**](#tab/powershell)

You can only delete a route filter if it isn't attached to any circuit. Ensure that the route filter isn't attached to any circuit before attempting to delete it. You can delete a route filter using the following command:

```azurepowershell-interactive
Remove-AzRouteFilter -Name "MyRouteFilter" -ResourceGroupName "MyResourceGroup"
```

# [**Azure CLI**](#tab/cli)

You can only delete a route filter if it isn't attached to any circuit. Ensure that the route filter isn't attached to any circuit before attempting to delete it. You can delete a route filter using the following command:

```azurecli-interactive
az network route-filter delete -n MyRouteFilter -g MyResourceGroup
```

---

## Next Steps

For information about router configuration samples, see:

> [!div class="nextstepaction"]
> [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md)
