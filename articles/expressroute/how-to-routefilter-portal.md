---
title: 'Configure route filters for Microsoft peering - Azure portal'
description: This article shows you how to configure route filters for Microsoft peering using the Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 01/31/2025
ms.author: duau
ms.custom: template-tutorial
---
# Configure route filters for Microsoft peering using the Azure portal

> [!div class="op_single_selector"]
> * [Azure Portal](how-to-routefilter-portal.md)
> * [Azure PowerShell](how-to-routefilter-powershell.md)
> * [Azure CLI](how-to-routefilter-cli.md)
> 

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

- Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before starting the configuration.

- Ensure you have an active ExpressRoute circuit with Microsoft peering configured. For instructions, see:
    - [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and provisioned by your connectivity provider. The circuit must be in a provisioned and enabled state.
    - [Create Microsoft peering](expressroute-howto-routing-portal-resource-manager.md) if you manage the BGP session directly, or have your connectivity provider create Microsoft peering for your circuit.

## Get a list of prefixes and BGP community values

### Get a list of BGP community values

Find the BGP community values associated with services accessible through Microsoft peering on the [ExpressRoute routing requirements](expressroute-routing.md) page.

### Make a list of the values you want to use

List the [BGP community values](expressroute-routing.md#bgp) you want to use in the route filter.

## Create a route filter and a filter rule

A route filter can have only one rule, which must be of type *Allow*. This rule can include a list of BGP community values.

1. Select **Create a resource** and search for *Route filter*:

    :::image type="content" source="./media/how-to-routefilter-portal/create-route-filter.png" alt-text="Screenshot showing the Route filter page.":::

1. Place the route filter in a resource group. Ensure the location matches the ExpressRoute circuit. Select **Review + create** and then **Create**.

    :::image type="content" source="./media/how-to-routefilter-portal/create-route-filter-basic.png" alt-text="Screenshot showing the Create route filter page with example values.":::

### Create a filter rule

1. To add and update rules, select the managed rule tab for your route filter.

    :::image type="content" source="./media/how-to-routefilter-portal/manage-route-filter.png" alt-text="Screenshot showing the Overview page with the Manage rule action highlighted.":::

1. Then select the services you want to connect to from the drop-down list and save the rule.

    :::image type="content" source="./media/how-to-routefilter-portal/add-route-filter-rule.png" alt-text="Screenshot showing the Manage rule window with services selected in the Allowed service communities drop-down list.":::

## Attach the route filter to an ExpressRoute circuit

Attach the route filter to a circuit by selecting the **+ Add Circuit** button and choosing the ExpressRoute circuit from the drop-down list.

:::image type="content" source="./media/how-to-routefilter-portal/add-circuit-to-route-filter.png" alt-text="Screenshot showing the Overview page with the Add circuit action selected.":::

If your connectivity provider configures peering for your ExpressRoute circuit, refresh the circuit from the ExpressRoute circuit page before selecting the **+ Add Circuit** button.

:::image type="content" source="./media/how-to-routefilter-portal/refresh-express-route-circuit.png" alt-text="Screenshot showing the Overview page with the Refresh action selected.":::

## Common tasks

### To get the properties of a route filter

View the properties of a route filter by opening the resource in the portal.

:::image type="content" source="./media/how-to-routefilter-portal/view-route-filter.png" alt-text="Screenshot showing the Overview page.":::

### To update the properties of a route filter

1. Update the list of BGP community values attached to a circuit by selecting the **Manage rule** button.

    :::image type="content" source="./media/how-to-routefilter-portal/update-route-filter.png" alt-text="Screenshot showing how to update Route filters with the Manage rule action.":::

1. Select the service communities you want and then select **Save**.

    :::image type="content" source="./media/how-to-routefilter-portal/add-route-filter-rule.png" alt-text="Screenshot showing the Manage rule window with services selected.":::

### To detach a route filter from an ExpressRoute circuit

Detach a circuit from the route filter by right-clicking on the circuit and selecting **Dissociate**.

:::image type="content" source="./media/how-to-routefilter-portal/detach-route-filter.png" alt-text="Screenshot showing the Overview page with the Dissociate action highlighted.":::

## Clean up resources

Delete a route filter by selecting the **Delete** button. Ensure the route filter isn't associated with any circuit before doing so.

:::image type="content" source="./media/how-to-routefilter-portal/delete-route-filter.png" alt-text="Screenshot showing how to delete a route filter.":::

## Next Steps

For information about router configuration samples, see:

> [!div class="nextstepaction"]
> [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md)
