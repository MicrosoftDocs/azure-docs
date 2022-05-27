---
title: Enable integration with an Azure virtual network
description: This how-to article walks you through enabling virtual network integration on an Azure App Service web app.
keywords: vnet integration
author: madsd
ms.author: madsd
ms.topic: how-to
ms.date: 10/20/2021
ms.tool: azure-cli, azure-powershell
---

# Enable virtual network integration in Azure App Service

Through integrating with an Azure virtual network (VNet) from your [Azure App Service app](./overview.md), you can reach private resources from your app within the virtual network. The VNet integration feature has two variations:

* **Regional virtual network integration**: Connect to Azure virtual networks in the same region. You must have a dedicated subnet in the virtual network you're integrating with.
* **Gateway-required virtual network integration**: When you connect directly to a virtual network in other regions or to a classic virtual network in the same region, you must use gateway-required virtual network integration.

This article describes how to set up regional virtual network integration.

## Prerequisites

The VNet integration feature requires:

- An App Service pricing tier [that supports virtual network integration](./overview-vnet-integration.md).
- A virtual network in the same region with an empty subnet.

The subnet must be delegated to Microsoft.Web/serverFarms. If the delegation isn't done before integration, the provisioning process will configure this delegation. The subnet must be allocated an IPv4 `/28` block (16 addresses). We recommend that you have a minimum of 64 addresses (IPv4 `/26` block) to allow for maximum horizontal scale.

## Configure in the Azure portal

1. Go to **Networking** in the App Service portal. Under **Outbound Traffic**, select **VNet integration**.

1. Select **Add VNet**.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-app.png" alt-text="Screenshot that shows selecting VNet integration.":::

1. The dropdown list contains all the virtual networks in your subscription in the same region. Select an empty preexisting subnet or create a new subnet.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-add-vnet.png" alt-text="Screenshot that shows selecting the virtual network.":::

During the integration, your app is restarted. When integration is finished, you'll see details on the virtual network you're integrated with.

## Configure with the Azure CLI

You can also configure virtual network integration by using the Azure CLI:

```azurecli-interactive
az webapp vnet-integration add --resource-group <group-name> --name <app-name> --vnet <vnet-name> --subnet <subnet-name>
```

> [!NOTE]
> The command checks if the subnet is delegated to Microsoft.Web/serverFarms and applies the necessary delegation if it isn't configured. If the subnet was configured, and you don't have permissions to check it, or if the virtual network is in another subscription, you can use the *--skip-delegation-check* parameter to bypass the validation.

## Configure with Azure PowerShell

```azurepowershell
# Parameters
$siteName = '<app-name>'
$resourceGroupName = '<group-name>'
$vNetName = '<vnet-name>'
$integrationSubnetName = '<subnet-name>'
$subscriptionId = '<subscription-guid>'

# Configure VNet Integration
$subnetResourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Network/virtualNetworks/$vNetName/subnets/$integrationSubnetName"
$webApp = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName $resourceGroupName -ResourceName $siteName
$webApp.Properties.virtualNetworkSubnetId = $subnetResourceId
$webApp | Set-AzResource -Force
```

## Next steps

- [Configure virtual network integration routing](./configure-vnet-integration-routing.md)
- [General networking overview](./networking-features.md)