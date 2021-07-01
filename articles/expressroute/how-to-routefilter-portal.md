---
title: 'Tutorial: Configure route filters for Microsoft peering - Azure portal'
description: This tutorial describes how to configure route filters for Microsoft peering using the Azure portal.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: tutorial
ms.date: 10/15/2020
ms.author: duau
ms.custom: seodec18

---
# Tutorial: Configure route filters for Microsoft peering using the Azure portal

> [!div class="op_single_selector"]
> * [Azure Portal](how-to-routefilter-portal.md)
> * [Azure PowerShell](how-to-routefilter-powershell.md)
> * [Azure CLI](how-to-routefilter-cli.md)
> 

Route filters are a way to consume a subset of supported services through Microsoft peering. The steps in this article help you configure and manage route filters for ExpressRoute circuits.

Microsoft 365 services such as Exchange Online, SharePoint Online, and Skype for Business, are accessible through the Microsoft peering. When Microsoft peering gets configured in an ExpressRoute circuit, all prefixes related to these services gets advertised through the BGP sessions that are established. A BGP community value is attached to every prefix to identify the service that is offered through the prefix. For a list of the BGP community values and the services they  map to, see [BGP communities](expressroute-routing.md#bgp).

Connectivity to all Azure and Microsoft 365 services causes a large number of prefixes gets advertised through BGP. The large number of prefixes significantly increases the size of the route tables maintained by routers within your network. If you plan to consume only a subset of services offered through Microsoft peering, you can reduce the size of your route tables in two ways. You can:

* Filter out unwanted prefixes by applying route filters on BGP communities. Route filtering is a standard networking practice and is used commonly within many networks.

* Define route filters and apply them to your ExpressRoute circuit. A route filter is a new resource that lets you select the list of services you plan to consume through Microsoft peering. ExpressRoute routers only send the list of prefixes that belong to the services identified in the route filter.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Get BGP community values.
> - Create route filter and filter rule.
> - Associate route filter to an ExpressRoute circuit.

### <a name="about"></a>About route filters

When Microsoft peering gets configured on your ExpressRoute circuit, the Microsoft edge routers establish a pair of BGP sessions with your edge routers through your connectivity provider. No routes are advertised to your network. To enable route advertisements to your network, you must associate a route filter.

A route filter lets you identify services you want to consume through your ExpressRoute circuit's Microsoft peering. It's essentially an allowed list of all the BGP community values. Once a route filter resource gets defined and attached to an ExpressRoute circuit, all prefixes that map to the BGP community values gets advertised to your network.

To attach route filters with Microsoft 365 services, you must have authorization to consume Microsoft 365 services through ExpressRoute. If you aren't authorized to consume Microsoft 365 services through ExpressRoute, the operation to attach route filters fails. For more information about the authorization process, see [Azure ExpressRoute for Microsoft 365](/microsoft-365/enterprise/azure-expressroute).

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all Microsoft Office service prefixes advertised through Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit.
> 

## Prerequisites

- Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

- You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  - [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider before you continue. The ExpressRoute circuit must be in a provisioned and enabled state.
  - [Create Microsoft peering](expressroute-howto-routing-portal-resource-manager.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.

## <a name="prefixes"></a>Get a list of prefixes and BGP community values

### Get a list of BGP community values

BGP community values associated with services accessible through Microsoft peering is available in the [ExpressRoute routing requirements](expressroute-routing.md) page.

### Make a list of the values that you want to use

Make a list of [BGP community values](expressroute-routing.md#bgp) you want to use in the route filter. 

## <a name="filter"></a>Create a route filter and a filter rule

A route filter can have only one rule, and the rule must be of type 'Allow'. This rule can have a list of BGP community values associated with it.

1. Select **Create a resource** then search for *Route filter* as shown in the following image:

    :::image type="content" source="./media/how-to-routefilter-portal/create-route-filter.png" alt-text="Screenshot that shows the Route filter page":::

1. Place the route filter in a resource group. Ensure the location is the same as the ExpressRoute circuit. Select **Review + create** and then **Create**.

    :::image type="content" source="./media/how-to-routefilter-portal/create-route-filter-basic.png" alt-text="Screenshot that shows the Create route filter page with example values entered":::

### Create a filter rule

1. To add and update rules, select the manage rule tab for your route filter.

    :::image type="content" source="./media/how-to-routefilter-portal/manage-route-filter.png" alt-text="Screenshot that shows the Overview page with the Manage rule action highlighted":::

1. Select the services you want to connect to from the drop-down list and save the rule when done.

    :::image type="content" source="./media/how-to-routefilter-portal/add-route-filter-rule.png" alt-text="Screenshot that shows the Manage rule window with services selected in the Allowed service communities drop-down list":::

## <a name="attach"></a>Attach the route filter to an ExpressRoute circuit

Attach the route filter to a circuit by selecting the **+ Add Circuit** button and selecting the ExpressRoute circuit from the drop-down list.

:::image type="content" source="./media/how-to-routefilter-portal/add-circuit-to-route-filter.png" alt-text="Screenshot that shows the Overview page with the Add circuit action selected":::

If the connectivity provider configures peering for your ExpressRoute circuit, refresh the circuit from the ExpressRoute circuit page before you select the **+ Add Circuit** button.

:::image type="content" source="./media/how-to-routefilter-portal/refresh-express-route-circuit.png" alt-text="Screenshot that shows the Overview page with the Refresh action selected.":::

## <a name="tasks"></a>Common tasks

### <a name="getproperties"></a>To get the properties of a route filter

You can view properties of a route filter when you open the resource in the portal.

:::image type="content" source="./media/how-to-routefilter-portal/view-route-filter.png" alt-text="Screenshot that shows the Overview page":::

### <a name="updateproperties"></a>To update the properties of a route filter

1. You can update the list of BGP community values attached to a circuit by selecting the **Manage rule** button.

    :::image type="content" source="./media/how-to-routefilter-portal/update-route-filter.png" alt-text="Update Route filters with the Manage rule action":::

1. Select the service communities you want and then select **Save**.

    :::image type="content" source="./media/how-to-routefilter-portal/add-route-filter-rule.png" alt-text="Screenshot that shows the Manage rule window with services selected":::

### <a name="detach"></a>To detach a route filter from an ExpressRoute circuit

To detach a circuit from the route filter, right-click on the circuit and select **Disassociate**.

:::image type="content" source="./media/how-to-routefilter-portal/detach-route-filter.png" alt-text="Screenshot that shows the Overview page with the Dissociate action highlighted":::


## Clean up resources

You can delete a route filter by selecting the **Delete** button. Ensure the Route filter is not associate to any circuits before doing so.

:::image type="content" source="./media/how-to-routefilter-portal/delete-route-filter.png" alt-text="Delete a route filter":::

## Next Steps

For information about router configuration samples, see:

> [!div class="nextstepaction"]
> [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md)
