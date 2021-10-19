---
title: Enable integration with Azure virtual network.
description: This how-to article will walk you through enabling virtual network integration on an App Service Web App
keywords: vnet integration
author: madsd
ms.author: madsd
ms.topic: how-to
ms.date: 10/20/2021
---

# Enable virtual network integration in Azure App Service

Through integrating with an Azure virtual network (VNet) from your [App Service app](./overview.md), you can reach private resources from your app within the virtual network. The VNet Integration feature has two variations:

Regional VNet integration: Connect to Azure virtual networks in the same region. You must have a dedicated subnet in the VNet you're integrating with.
Gateway-required VNet integration: When you connect directly to VNet in other regions or to a Classic virtual network in the same region, you must use the gateway-required VNet integration.

This how-to article will describe how to set up regional VNet integration.

## Prerequisites

The VNet Integration requires:
- An App Service pricing tier [supporting VNet integration](./overview-vnet-integration.md).
- A virtual network in the same region with an empty subnet.

The subnet must be delegated to Microsoft.Web/serverFarms. If the delegation isn't done before integration, the provisioning process will configure this delegation. The subnet must be allocated an IPv4 `/28` block (16 addresses). It is actually recommended to have a minimum of 64 addresses (IPv4 `/26` block) to allow for maximum horizontal scale.

## Configure in the Azure portal

1. Go to the **Networking** UI in the App Service portal. Under **Outbound Traffic**, select **VNet integration**.

1. Select **Add VNet**.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-app.png" alt-text="Select VNet Integration":::

1. The drop-down list contains all of the virtual networks in your subscription in the same region.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-add-vnet.png" alt-text="Select the VNet":::

    * Select an empty pre-existing subnet or create a new subnet.

During the integration, your app is restarted. When integration is finished, you'll see details on the VNet you're integrated with.

## Configure with Azure CLI

You can also configure VNet integration using Azure CLI:

```azurecli-interactive
az webapp vnet-integration add --resource-group <group-name> --name <app-name> --vnet <vnet-name> --subnet <subnet-name>
```

> [!NOTE]
> The command will check if subnet is delegated to Microsoft.Web/serverFarms and apply the necessary delegation if this is not configured. If this has already been configured, and you do not have permissions to check this, or the virtual network is in another subscription, you can use the `--skip-delegation-check` parameter to bypass the validation.

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

- [Configure VNet integration routing](./configure-vnet-integration-routing.md)
- [General Networking overview](./networking-features.md)