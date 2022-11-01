---
title: Configure virtual network integration with application and configuration routing.
description: This how-to article walks you through configuring routing on a regional virtual network integration.
author: madsd
ms.author: madsd
ms.topic: how-to
ms.date: 10/20/2021
---

# Manage Azure App Service virtual network integration routing

Through application routing or configuration routing options, you can configure what traffic will be sent through the virtual network integration. See the [overview section](./overview-vnet-integration.md#routes) for more details.

## Prerequisites

Your app is already integrated using the regional virtual network integration feature.

## Configure application routing

Application routing defines what traffic is routed from your app and into the virtual network. We recommend that you use the **Route All** site setting to enable routing of all traffic. Using the configuration setting allows you to audit the behavior with [a built-in policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F33228571-70a4-4fa1-8ca1-26d0aba8d6ef). The existing `WEBSITE_VNET_ROUTE_ALL` app setting can still be used, and you can enable all traffic routing with either setting.

### Configure in the Azure portal

Follow these steps to disable **Route All** in your app through the portal.

:::image type="content" source="./media/configure-vnet-integration-routing/vnetint-route-all-enabled.png" alt-text="Screenshot that shows enabling Route All.":::

1. Go to **Networking** > **VNet integration** in your app portal.
1. Set **Route All** to **Disabled**.
    
    :::image type="content" source="./media/configure-vnet-integration-routing/vnetint-route-all-disabling.png" alt-text="Screenshot that shows disabling Route All.":::

1. Select **Yes** to confirm.

### Configure with the Azure CLI

You can also configure **Route All** by using the Azure CLI.

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --properties.vnetRouteAllEnabled [true|false]
```

## Configure configuration routing

When you're using virtual network integration, you can configure how parts of the configuration traffic are managed. By default, configuration traffic will go directly over the public route, but for the mentioned individual components, you can actively configure it to be routed through the virtual network integration.

### Container image pull

Routing Container image pull over virtual network integration can be configured using the Azure CLI.

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --properties.vnetImagePullEnabled [true|false]
```

We recommend that you use the site property to enable routing image pull traffic through the virtual network integration. Using the configuration setting allows you to audit the behavior with Azure Policy. The existing `WEBSITE_PULL_IMAGE_OVER_VNET` app setting with the value `true` can still be used, and you can enable routing through the virtual network with either setting.

### Content storage

Routing content storage over virtual network integration can be configured using the Azure CLI. In addition to enabling the feature, you must also ensure that any firewall or Network Security Group configured on traffic from the subnet allow traffic to port 443 and 445.

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --properties.vnetContentStorageEnabled [true|false]
```

We recommend that you use the site property to enable content storage traffic through the virtual network integration. Using the configuration setting allows you to audit the behavior with Azure Policy. The existing `WEBSITE_CONTENTOVERVNET` app setting with the value `1` can still be used, and you can enable routing through the virtual network with either setting.

## Next steps

- [Enable virtual network integration](./configure-vnet-integration-enable.md)
- [General networking overview](./networking-features.md)