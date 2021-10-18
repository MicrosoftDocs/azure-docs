---
title: App Service Networking. How to enable virtual network integration.
description: This how-to article will walk you through enabling virtual network integration on an App Service Web App
author: madsd
ms.author: madsd
ms.topic: how-to
ms.date: 10/20/2021
---

# Enable Virtual Network Integration

Through integrating with an Azure virtual network (VNet), you can reach private resources from your app within the virtual network. The VNet Integration feature has two variations:

Regional VNet Integration: Connect to Azure Resource Manager virtual networks in the same region. You must have a dedicated subnet in the VNet you're integrating with.
Gateway-required VNet Integration: When you connect directly to VNet in other regions or to a classic virtual network in the same region, you must use the Gateway-required VNet Integration.

This how-to article will describe how to set up regional VNet Integration.

## Prerequisites

The VNet Integration requires:
- A Standard, Premium, PremiumV2, PremiumV3, or Elastic Premium pricing plan.
- A virtual network in the same region with an empty subnet.

The subnet must be delegated to Microsoft.Web/serverFarms. If the delegation isn't done before integration, the provisioning process will configure this delegation. The subnet must be at least of size /28, however we recommend at least /26 to allow for maximum horizontal scale.

## Configure Virtual Network Integration in the Azure portal

1. Go to the **Networking** UI in the App Service portal. Under **VNet Integration**, select **Click here to configure**.

1. Select **Add VNet**.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-app.png" alt-text="Select VNet Integration":::

1. The drop-down list contains all of the Azure Resource Manager virtual networks in your subscription in the same region. Underneath that is a list of the Resource Manager virtual networks in all other regions. Select the VNet you want to integrate with.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-add-vnet.png" alt-text="Select the VNet":::

    * If the VNet is in the same region, either create a new subnet or select an empty pre-existing subnet.
    * To select a VNet in another region, you must have a VNet gateway provisioned with point to site enabled.
    * To integrate with a classic VNet, instead of selecting the **Virtual Network** drop-down list, select **Click here to connect to a Classic VNet**. Select the classic virtual network you want. The target VNet must already have a Virtual Network gateway provisioned with point-to-site enabled.

    :::image type="content" source="./media/configure-vnet-integration-enable/vnetint-classic.png" alt-text="Select Classic VNet":::

During the integration, your app is restarted. When integration is finished, you'll see details on the VNet you're integrated with.

## Configure Virtual Network Integration using Azure CLI

You can also configure VNet Integration using Azure CLI:

```azurecli-interactive
az webapp vnet-integration add --resource-group myRG --name myWebApp --vnet [name or resource id of VNet] --subnet [name or resource id of subnet]
```

> [!NOTE]
> The command will check if subnet is delegated to Microsoft.Web/serverFarms and apply the necessary delegation if this is not configured. If this has already been configured, and you do not have permissions to check this, or the virtual network is in another subscription, you can use the `--skip-delegation-check` parameter to bypass the validation.

## Configure Virtual Network Integration using Azure PowerShell

```azurepowershell
# Parameters
$siteName = 'myWebApp'
$resourceGroupName = 'myRG'
$vNetName = 'myVNet'
$integrationSubnetName = 'myIntegrationSubnet'
$subscriptionId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

# Configure VNet Integration
$subnetResourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Network/virtualNetworks/$vNetName/subnets/$integrationSubnetName"
$webApp = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName $resourceGroupName -ResourceName $siteName
$webApp.Properties.virtualNetworkSubnetId = $subnetResourceId
$webApp | Set-AzResource -Force
```

## Next steps

- [Configure VNet Integration routing](./configure-vnet-integration-routing.md)
- [General Networking overview](./networking-features.md)