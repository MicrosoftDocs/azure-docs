---
title: 'ExpressRoute: Route filters - Microsoft peering:Azure CLI'
description: This article describes how to configure route filters for Microsoft Peering using Azure CLI
services: expressroute
author: anzaman

ms.service: expressroute
ms.topic: how-to
ms.date: 12/07/2018
ms.author: anzaman

---
# Configure route filters for Microsoft peering: Azure CLI

> [!div class="op_single_selector"]
> * [Azure Portal](how-to-routefilter-portal.md)
> * [Azure PowerShell](how-to-routefilter-powershell.md)
> * [Azure CLI](how-to-routefilter-cli.md)
> 

Route filters are a way to consume a subset of supported services through Microsoft peering. The steps in this article help you configure and manage route filters for ExpressRoute circuits.

Office 365 services such as Exchange Online, SharePoint Online, and Skype for Business, are accessible through the Microsoft peering. When Microsoft peering is configured in an ExpressRoute circuit, all prefixes related to these services are advertised through the BGP sessions that are established. A BGP community value is attached to every prefix to identify the service that is offered through the prefix. For a list of the BGP community values and the services they  map to, see [BGP communities](expressroute-routing.md#bgp).

If you require connectivity to all services, a large number of prefixes are advertised through BGP. This significantly increases the size of the route tables maintained by routers within your network. If you plan to consume only a subset of services offered through Microsoft peering, you can reduce the size of your route tables in two ways. You can:

* Filter out unwanted prefixes by applying route filters on BGP communities. This is a standard networking practice and is used commonly within many networks.

* Define route filters and apply them to your ExpressRoute circuit. A route filter is a new resource that lets you select the list of services you plan to consume through Microsoft peering. ExpressRoute routers only send the list of prefixes that belong to the services identified in the route filter.

### <a name="about"></a>About route filters

When Microsoft peering is configured on your ExpressRoute circuit, the Microsoft edge routers establish a pair of BGP sessions with the edge routers (yours or your connectivity provider's). No routes are advertised to your network. To enable route advertisements to your network, you must associate a route filter.

A route filter lets you identify services you want to consume through your ExpressRoute circuit's Microsoft peering. It is essentially a white list of all the BGP community values. Once a route filter resource is defined and attached to an ExpressRoute circuit, all prefixes that map to the BGP community values are advertised to your network.

To be able to attach route filters with Office 365 services on them, you must have authorization to consume Office 365 services through ExpressRoute. If you are not authorized to consume Office 365 services through ExpressRoute, the operation to attach route filters fails. For more information about the authorization process, see [Azure ExpressRoute for Office 365](https://support.office.com/article/Azure-ExpressRoute-for-Office-365-6d2534a2-c19c-4a99-be5e-33a0cee5d3bd).

> [!IMPORTANT]
> Microsoft peering of ExpressRoute circuits that were configured prior to August 1, 2017 will have all service prefixes advertised through Microsoft peering, even if route filters are not defined. Microsoft peering of ExpressRoute circuits that are configured on or after August 1, 2017 will not have any prefixes advertised until a route filter is attached to the circuit.
> 
> 

### <a name="workflow"></a>Workflow

To be able to successfully connect to services through Microsoft peering, you must complete the following configuration steps:

* You must have an active ExpressRoute circuit that has Microsoft peering provisioned. You can use the following instructions to accomplish these tasks:
  * [Create an ExpressRoute circuit](howto-circuit-cli.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state.
  * [Create Microsoft peering](howto-routing-cli.md) if you manage the BGP session directly. Or, have your connectivity provider provision Microsoft peering for your circuit.

* You must create and configure a route filter.
  * Identify the services you with to consume through Microsoft peering
  * Identify the list of BGP community values associated with the services
  * Create a rule to allow the prefix list matching the BGP community values

* You must attach the route filter to the ExpressRoute circuit.

## Before you begin

Before beginning, install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

* You must have an active ExpressRoute circuit. Follow the instructions to [Create an ExpressRoute circuit](howto-circuit-cli.md) and have the circuit enabled by your connectivity provider before you proceed. The ExpressRoute circuit must be in a provisioned and enabled state.

* You must have an active Microsoft peering. Follow instructions at [Create and modifying peering configuration](howto-routing-cli.md)

### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you are using the "Try It", you are signed in automatically and can skip the login step. Use the following examples to help you connect:

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

## <a name="prefixes"></a>Step 1: Get a list of prefixes and BGP community values

### 1. Get a list of BGP community values

Use the following cmdlet to get the list of BGP community values associated with services accessible through Microsoft peering, and the list of prefixes associated with them:

```azurecli-interactive
az network route-filter rule list-service-communities
```
### 2. Make a list of the values that you want to use

Make a list of BGP community values you want to use in the route filter.

## <a name="filter"></a>Step 2: Create a route filter and a filter rule

A route filter can have only one rule, and the rule must be of type 'Allow'. This rule can have a list of BGP community values associated with it.

### 1. Create a route filter

First, create the route filter. The command `az network route-filter create` only creates a route filter resource. After you create the resource, you must then create a rule and attach it to the route filter object. Run the following command to create a route filter resource:

```azurecli-interactive
az network route-filter create -n MyRouteFilter -g MyResourceGroup
```

### 2. Create a filter rule

Run the following command to create a new rule:
 
```azurecli-interactive
az network route-filter rule create --filter-name MyRouteFilter -n CRM --communities 12076:5040 --access Allow -g MyResourceGroup
```

## <a name="attach"></a>Step 3: Attach the route filter to an ExpressRoute circuit

Run the following command to attach the route filter to the ExpressRoute circuit:

```azurecli-interactive
az network express-route peering update --circuit-name MyCircuit -g ExpressRouteResourceGroupName --name MicrosoftPeering --route-filter MyRouteFilter
```

## <a name="tasks"></a>Common tasks

### <a name="getproperties"></a>To get the properties of a route filter

To get the properties of a route filter, use the following command:

```azurecli-interactive
az network route-filter show -g ExpressRouteResourceGroupName --name MyRouteFilter 
```

### <a name="updateproperties"></a>To update the properties of a route filter

If the route filter is already attached to a circuit, updates to the BGP community list automatically propagate appropriate prefix advertisement changes through the established BGP sessions. You can update the BGP community list of your route filter using the following command:

```azurecli-interactive
az network route-filter rule update --filter-name MyRouteFilter -n CRM -g ExpressRouteResourceGroupName --add communities '12076:5040' --add communities '12076:5010'
```

### <a name="detach"></a>To detach a route filter from an ExpressRoute circuit

Once a route filter is detached from the ExpressRoute circuit, no prefixes are advertised through the BGP session. You can detach a route filter from an ExpressRoute circuit using the following command:

```azurecli-interactive
az network express-route peering update --circuit-name MyCircuit -g ExpressRouteResourceGroupName --name MicrosoftPeering --remove routeFilter
```

### <a name="delete"></a>To delete a route filter

You can only delete a route filter if it is not attached to any circuit. Ensure that the route filter is not attached to any circuit before attempting to delete it. You can delete a route filter using the following command:

```azurecli-interactive
az network route-filter delete -n MyRouteFilter -g MyResourceGroup
```

## Next Steps

For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
