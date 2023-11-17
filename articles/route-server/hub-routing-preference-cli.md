---
title: Configure routing preference - Azure CLI
titleSuffix: Azure Route Server
description: Learn how to configure routing preference in Azure Route Server using the Azure CLI to influence its route selection.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 11/15/2023
ms.custom:
  - devx-track-azurecli
  - ignite-2023

#CustomerIntent: As an Azure administrator, I want learn how to use routing preference setting so that I can influence route selection in Azure Route Server by using the Azure CLI.
---

# Configure routing preference to influence route selection using the Azure CLI (Preview)

Learn how to use routing preference setting in Azure Route Server to influence its route learning and selection. For more information, see [Routing preference](hub-routing-preference.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure route server. If you need to create a Route Server, see [Create and configure Azure Route Server](quickstart-configure-route-server-cli.md).
- Azure Cloud Shell or Azure CLI installed locally.

## View routing preference configuration

Use [az network routeserver show](/cli/azure/network/routeserver#az-network-routeserver-show()) to view the current route server configuration including its routing preference setting.

```azurecli-interactive
# Show the Route Server configuration.
az network routeserver show --resource-group 'myResourceGroup' --name 'myRouteServer'
```

In the output, you can see the current routing preference setting in front of **"hubRoutingPreference"**:

```output
{
  "allowBranchToBranchTraffic": false,
  "etag": "W/\"00000000-1111-2222-3333-444444444444\"",
  "hubRoutingPreference": "ExpressRoute",
  "id": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualHubs/myRouteServer",
  "kind": "RouteServer",
  "location": "eastus",
  "name": "myRouteServer",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "routeTable": {
    "routes": []
  },
  "routingState": "Provisioned",
  "sku": "Standard",
  "tags": {},
  "type": "Microsoft.Network/virtualHubs",
  "virtualHubRouteTableV2s": [],
  "virtualRouterAsn": 65515,
  "virtualRouterAutoScaleConfiguration": {
    "minCapacity": 2
  },
  "virtualRouterIps": [
    "10.1.1.5",
    "10.1.1.4"
  ]
}
```

> [!NOTE]
> The default routing preference setting is **ExpressRoute**.

## Configure routing preference

Use [az network routeserver update](/cli/azure/network/routeserver#az-network-routeserver-update()) to update routing preference setting.

```azurecli-interactive
# Change the routing preference to AS Path.
az network routeserver update --name 'myRouteServer' --hub-routing-preference 'ASPath' --resource-group 'myResourceGroup'
```

```azurecli-interactive
# Change the routing preference to VPN Gateway.
az network routeserver update --name 'myRouteServer' --hub-routing-preference 'VpnGateway' --resource-group 'myResourceGroup'
```

```azurecli-interactive
# Change the routing preference to ExpressRoute.
az network routeserver update --name 'myRouteServer' --hub-routing-preference 'ExpressRoute' --resource-group 'myResourceGroup'
```

## Related content

- [Create and configure Route Server](quickstart-configure-route-server-cli.md)
- [Monitor Azure Route Server](monitor-route-server.md)
- [Azure Route Server FAQ](route-server-faq.md)
