---
title: Enable integration with an Azure virtual network
description: This how-to article walks you through enabling virtual network integration on an Azure App Service web app.
keywords: vnet integration
author: madsd
ms.author: madsd
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 02/13/2023
ms.tool: azure-cli, azure-powershell
---

# Enable virtual network integration in Azure App Service

Through integrating with an Azure virtual network from your [Azure App Service app](./overview.md), you can reach private resources from your app within the virtual network.

## Prerequisites

The virtual network integration feature requires:

- An App Service pricing tier [that supports virtual network integration](./overview-vnet-integration.md).
- A virtual network in the same region with an empty subnet.

The subnet must be delegated to Microsoft.Web/serverFarms. If the delegation isn't done before integration, the provisioning process configures this delegation. The subnet must be allocated an IPv4 `/28` block (16 addresses). We recommend that you have a minimum of 64 addresses (IPv4 `/26` block) to allow for maximum horizontal scale.

If the virtual network is in a different subscription than the app, you must ensure that the subscription with the virtual network is registered for the `Microsoft.Web` resource provider. You can explicitly register the provider [by following this documentation](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider), but it's automatically registered when creating the first web app in a subscription.

## Configure in the Azure portal

1. Go to **Networking** in the App Service portal. Under **Outbound traffic configuration**, select **Virtual network integration**.

1. Select **Add virtual network integration**.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-app.png" alt-text="Screenshot that shows selecting Virtual network integration.":::

1. The dropdown list contains all the virtual networks in your subscription in the same region. Select an empty pre-existing subnet or create a new subnet.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-add-vnet.png" alt-text="Screenshot that shows selecting the virtual network.":::

During the integration, your app is restarted. When integration is finished, you see details on the virtual network you're integrated with.

## Configure with the Azure CLI

You can also configure virtual network integration by using the Azure CLI:

```azurecli-interactive
az webapp vnet-integration add --resource-group <group-name> --name <app-name> --vnet <vnet-name> --subnet <subnet-name>
```

> [!NOTE]
> The command checks if the subnet is delegated to Microsoft.Web/serverFarms and applies the necessary delegation if it isn't configured. If the subnet was configured, and you don't have permissions to check it, or if the virtual network is in another subscription, you can use the `--skip-delegation-check` parameter to bypass the validation.

## Configure with Azure PowerShell

Prepare parameters.

```azurepowershell
$siteName = '<app-name>'
$vNetResourceGroupName = '<group-name>'
$webAppResourceGroupName = '<group-name>'
$vNetName = '<vnet-name>'
$integrationSubnetName = '<subnet-name>'
$vNetSubscriptionId = '<subscription-guid>'
```

> [!NOTE]
> If the virtual network is in another subscription than webapp, you can use the *Set-AzContext -Subscription "xxxx-xxxx-xxxx-xxxx"* command to set the current subscription context. Set the current subscription context to the subscription where the virtual network was deployed.

Check if the subnet is delegated to Microsoft.Web/serverFarms.

```azurepowershell
$vnet = Get-AzVirtualNetwork -Name $vNetName -ResourceGroupName $vNetResourceGroupName
$subnet = Get-AzVirtualNetworkSubnetConfig -Name $integrationSubnetName -VirtualNetwork $vnet
Get-AzDelegation -Subnet $subnet
```

If your subnet isn't delegated to Microsoft.Web/serverFarms, add delegation using below commands.

```azurepowershell
$subnet = Add-AzDelegation -Name "myDelegation" -ServiceName "Microsoft.Web/serverFarms" -Subnet $subnet
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

Configure virtual network integration.

> [!NOTE]
> If the webapp is in another subscription than virtual network, you can use the *Set-AzContext -Subscription "xxxx-xxxx-xxxx-xxxx"* command to set the current subscription context. Set the current subscription context to the subscription where the web app was deployed.

```azurepowershell
$subnetResourceId = "/subscriptions/$vNetSubscriptionId/resourceGroups/$vNetResourceGroupName/providers/Microsoft.Network/virtualNetworks/$vNetName/subnets/$integrationSubnetName"
$webApp = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName $webAppResourceGroupName -ResourceName $siteName
$webApp.Properties.virtualNetworkSubnetId = $subnetResourceId
$webApp.Properties.vnetRouteAllEnabled = 'true'
$webApp | Set-AzResource -Force
```

## Next steps

- [Configure virtual network integration routing](./configure-vnet-integration-routing.md)
- [General networking overview](./networking-features.md)
