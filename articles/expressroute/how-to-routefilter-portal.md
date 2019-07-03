---
title: 'Configure route filters for Microsoft peering: Azure ExpressRoute - Portal | Microsoft Docs'
description: This article describes how to configure route filters for Microsoft peering using the Azure portal.
services: expressroute
author: ganesr

ms.service: expressroute
ms.topic: article
ms.date: 07/01/2019
ms.author: ganesr
ms.custom: seodec18

---
# Configure route filters for Microsoft peering: Azure portal
> [!div class="op_single_selector"]
> * [Azure Portal](how-to-routefilter-portal.md)
> * [Azure PowerShell](how-to-routefilter-powershell.md)
> * [Azure CLI](how-to-routefilter-cli.md)
> 

Route filters are a way to consume a subset of supported services through Microsoft peering. The steps in this article help you configure and manage route filters for ExpressRoute circuits.

Dynamics 365 services, and Office 365 services such as Exchange Online, SharePoint Online, and Skype for Business, and Azure services such as storage and SQL DB are accessible through Microsoft peering. When Microsoft peering is configured in an ExpressRoute circuit, all prefixes related to these services are advertised through the BGP sessions that are established. A BGP community value is attached to every prefix to identify the service that is offered through the prefix. For a list of the BGP community values and the services they  map to, see [BGP communities](expressroute-routing.md#bgp).

If you require connectivity to all services, a large number of prefixes are advertised through BGP. This significantly increases the size of the route tables maintained by routers within your network. If you plan to consume only a subset of services offered through Microsoft peering, you can reduce the size of your route tables in two ways. You can:

- Filter out unwanted prefixes by applying route filters on BGP communities. This is a standard networking practice and is used commonly within many networks.

- Define route filters and apply them to your ExpressRoute circuit. A route filter is a new resource that lets you select the list of services you plan to consume through Microsoft peering. ExpressRoute routers only send the list of prefixes that belong to the services identified in the route filter.

### <a name="about"></a>About route filters

When Microsoft peering is configured on your ExpressRoute circuit, the Microsoft edge routers establish a pair of BGP sessions with the edge routers (yours or your connectivity provider's). No routes are advertised to your network. To enable route advertisements to your network, you must associate a route filter.

A route filter lets you identify services you want to consume through your ExpressRoute circuit's Microsoft peering. It is essentially a list of all the BGP community values you want to allow. Once a route filter resource is defined and attached to an ExpressRoute circuit, all prefixes that map to the BGP community values are advertised to your network.

To be able to attach route filters with Office 365 services on them, you must have authorization to consume Office 365 services through ExpressRoute. If you are not authorized to consume Office 365 services through ExpressRoute, the operation to attach route filters fails. For more information about the authorization process, see [Azure ExpressRoute for Office 365](https://support.office.com/article/Azure-ExpressRoute-for-Office-365-6d2534a2-c19c-4a99-be5e-33a0cee5d3bd). Connectivity to Dynamics 365 services does NOT require any prior authorization.

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit.
> 
> 

### <a name="workflow"></a>Workflow

To be able to successfully connect to services through Microsoft peering, you must complete the following configuration steps:

- You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  - [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state.
  - [Create Microsoft peering](expressroute-howto-routing-portal-resource-manager.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.

-  You must create and configure a route filter.
    - Identify the services you with to consume through Microsoft peering
    - Identify the list of BGP community values associated with the services
    - Create a rule to allow the prefix list matching the BGP community values

-  You must attach the route filter to the ExpressRoute circuit.

## Before you begin

Before you begin configuration, make sure you meet the following criteria:

 - Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

 - You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state.

 - You must have an active Microsoft peering. Follow instructions at [Create and modifying peering configuration](expressroute-howto-routing-portal-resource-manager.md)


## <a name="prefixes"></a>Step 1: Get a list of prefixes and BGP community values

### 1. Get a list of BGP community values

BGP community values associated with services accessible through Microsoft peering is available in the [ExpressRoute routing requirements](expressroute-routing.md) page.

### 2. Make a list of the values that you want to use

Make a list of [BGP community values](expressroute-routing.md#bgp) you want to use in the route filter. 

## <a name="filter"></a>Step 2: Create a route filter and a filter rule

A route filter can have only one rule, and the rule must be of type 'Allow'. This rule can have a list of BGP community values associated with it.

### 1. Create a route filter
You can create a route filter by selecting the option to create a new resource. Click **Create a resource** > **Networking** > **RouteFilter**, as shown in the following image:

![Create a route filter](./media/how-to-routefilter-portal/CreateRouteFilter1.png)

You must place the route filter in a resource group. 

![Create a route filter](./media/how-to-routefilter-portal/CreateRouteFilter.png)

### 2. Create a filter rule

You can add and update rules by selecting the manage rule tab for your route filter.

![Create a route filter](./media/how-to-routefilter-portal/ManageRouteFilter.png)


You can select the services you want to connect to from the drop-down list and save the rule when done.

![Create a route filter](./media/how-to-routefilter-portal/AddRouteFilterRule.png)


## <a name="attach"></a>Step 3: Attach the route filter to an ExpressRoute circuit

You can attach the route filter to a circuit by selecting the "add Circuit" button and selecting the ExpressRoute circuit from the drop-down list.

![Create a route filter](./media/how-to-routefilter-portal/AddCktToRouteFilter.png)

If the connectivity provider configures peering for your ExpressRoute circuit refresh the circuit from the ExpressRoute circuit blade before you select the "add Circuit" button.

![Create a route filter](./media/how-to-routefilter-portal/RefreshExpressRouteCircuit.png)

## <a name="tasks"></a>Common tasks

### <a name="getproperties"></a>To get the properties of a route filter

You can view properties of a route filter when you open the resource in the portal.

![Create a route filter](./media/how-to-routefilter-portal/ViewRouteFilter.png)


### <a name="updateproperties"></a>To update the properties of a route filter

You can update the list of BGP community values attached to a circuit by selecting the "Manage rule" button.


![Create a route filter](./media/how-to-routefilter-portal/ManageRouteFilter.png)

![Create a route filter](./media/how-to-routefilter-portal/AddRouteFilterRule.png) 


### <a name="detach"></a>To detach a route filter from an ExpressRoute circuit

To detach a circuit from the route filter, right-click on the circuit and click on "disassociate".

![Create a route filter](./media/how-to-routefilter-portal/DetachRouteFilter.png) 


### <a name="delete"></a>To delete a route filter

You can delete a route filter by selecting the delete button. 

![Create a route filter](./media/how-to-routefilter-portal/DeleteRouteFilter.png) 

## Next Steps

* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).

* For information about router configuration samples, see [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md). 
