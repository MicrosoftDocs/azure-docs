---
title: Configure routing preference - PowerShell
titleSuffix: Azure Route Server
description: Learn how to configure routing preference (preview) in Azure Route Server using Azure PowerShell to influence its route selection.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 10/12/2023
ms.custom: devx-track-azurepowershell

#CustomerIntent: As an Azure administrator, I want learn how to use routing preference setting so that I can influence route selection in Azure Route Server by using Azure PowerShell.
---

# Configure routing preference to influence route selection using PowerShell

Learn how to use routing preference setting in Azure Route Server to influence its route learning and selection. For more information, see [Routing preference (preview)](hub-routing-preference.md).

> [!IMPORTANT]
> Routing preference is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure route server. If you need to create a Route Server, see [Create and configure Azure Route Server](quickstart-configure-route-server-powershell.md).
- Azure Cloud Shell or Azure PowerShell installed locally.

## View routing preference configuration

Use [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) to view the current routing preference configuration.

```azurepowershell-interactive
# Get the Route Server.
Get-AzRouteServer -ResourceGroupName 'myResourceGroup'
```

In the output, you can see the current routing preference setting under **HubRoutingPreference**:

```output
ResourceGroupName Name          Location RouteServerAsn RouteServerIps       ProvisioningState HubRoutingPreference
----------------- ----          -------- -------------- --------------       ----------------- --------------------
myResourceGroup   myRouteServer eastus   65515          {10.1.1.5, 10.1.1.4} Succeeded         ExpressRoute
```

The default routing preference setting is **ExpressRoute**.

## Configure routing preference

To configure routing preference, use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver).

```azurepowershell-interactive
# Change the routing preference to AS Path.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ASPath' -ResourceGroupName 'myResourceGroup'
```

```azurepowershell-interactive
# Change the routing preference to VPN Gateway.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'VpnGateway' -ResourceGroupName 'myResourceGroup'
```

```azurepowershell-interactive
# Change the routing preference to ExpressRoute.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ExpressRoute' -ResourceGroupName 'myResourceGroup'
```

## Related content

- [Create and configure Route Server](quickstart-configure-route-server-powershell.md)
- [Monitor Azure Route Server](monitor-route-server.md)
- [Azure Route Server FAQ](route-server-faq.md)
