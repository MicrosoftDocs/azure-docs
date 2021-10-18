---
title: App Service Networking. How to configure application routing.
description: This how-to article will walk you through configure app routing on a regional VNet Integration.
author: madsd
ms.author: madsd
ms.topic: how-to
ms.date: 10/20/2021
---

# Manage Virtual Network Integration routing

When configuring application routing, you can either route all traffic or only private traffic (also known as [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918#section-3) traffic) into your VNet. You configure this behavior through the Route All setting. If Route All is disabled, your app only routes private traffic into your VNet. Should you want to route all of your outbound traffic into your VNet, make sure that Route All is enabled.

This how-to article will describe how to configure application routing.

## Prerequisites

Your app is already be integrated using the Regional VNet Integration feature.

## Configure Application Routing in the Azure portal

You can use the following steps to disable Route All in your app through the portal: 

:::image type="content" source="./media/configure-vnet-integration-routing/vnetint-route-all-enabled.png" alt-text="Route All enabled":::

1. Go to the **VNet Integration** UI in your app portal.
1. Set **Route All** to Disabled.
    
    :::image type="content" source="./media/configure-vnet-integration-routing/vnetint-route-all-disabling.png" alt-text="Disable Route All":::

1. Select **Yes**.

## Configure Application Routing using Azure CLI

You can also configure Route All using Azure CLI (*Note*: minimum `az version` required is 2.27.0):

```azurecli-interactive
az webapp config set --resource-group myRG --name myWebApp --vnet-route-all-enabled [true|false]
```

## Next steps

- [Enable VNet Integration](./configure-vnet-integration-enable.md)
- [General Networking overview](./networking-features.md)