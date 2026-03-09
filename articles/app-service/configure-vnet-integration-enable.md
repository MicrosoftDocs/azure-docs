---
title: Enable Integration with Azure Virtual Network
description: Enable virtual network integration on an Azure App Service web app in the Azure portal, or use the Azure CLI or Azure PowerShell.
keywords: vnet integration
author: seligj95
ms.author: jordanselig
ms.topic: how-to
ms.date: 03/05/2026
ms.tool: azure-cli, azure-powershell
ms.service: azure-app-service
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - sfi-image-nochange
#customer intent: As a deployment engineer, I want to enable Azure Virtual Network integration for my Azure App Service apps, so I can access private resources from my apps within my Azure virtual network.
---

# Enable virtual network integration in Azure App Service

This article describes how to integrate Azure Virtual Network with [Azure App Service](overview.md). The integration enables you to reach private resources from your App Service app within your Azure virtual network. Procedures are provided for the Azure portal, the Azure CLI, and Azure PowerShell.

## Prerequisites

- An existing app created in a [dedicated Azure App Service compute pricing tier](overview-vnet-integration.md) that supports virtual network integration.

   - If you plan to allow inbound access via private endpoints on a subnet, public access must be disabled for the app. 

- The Azure virtual network and subnet that you specify for the integration must be in the same region.

   - The subnet must be allocated an IPv4 `/28` block (16 addresses). The recommended minimum size is 64 addresses (IPv4 `/26` block), which accommodates future growth and scaling needs.

   - The subnet must be empty, which means no network interface cards (NICs), virtual machines, private endpoints, and so on.

   - The subnet must be delegated to `Microsoft.Web/serverFarms`. If you don't delegate before integration, the provisioning process configures this delegation.

- If the specified virtual network is in different subscription than your app, confirm the virtual network subscription is registered with the `Microsoft.Web` resource provider.

   The resource provider is registered when you create the first web app in a subscription. To explicitly register the provider, see [Azure resource providers and types > Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider).

## Configure virtual network integration

Choose your preferred configuration method for completing the virtual network integration.

# [Azure portal](#tab/portal)

Configure virtual network integration for an app in the Azure portal:

1. Sign into the [Azure portal](https://portal.azure.com) and go to the **Overview** page for your App Service app.

1. In the left menu, select **Settings** > **Networking**. The **Networking** page opens.

1. Scroll to the **Outbound traffic configuration** section, locate the **Virtual network integration** option, and select the **Not configured** link.

   :::image type="content" source="./media/configure-vnet-integration-enable/integration-not-configured.png" border="false" alt-text="Screenshot that shows how to select the 'not configured' link for virtual network integration in the Azure portal.":::

   The **Virtual Network Integration** page opens.

1. Select **Add virtual network integration**.

   :::image type="content" source="./media/configure-vnet-integration-enable/add-virtual-network-integration.png" alt-text="Screenshot that shows how to select the 'add virtual network integration' action in the Azure portal.":::

   The **Add virtual network integration** page opens.

1. Select the **App Service Plan** connection to use for the integration.

   - If your subscription has an existing plan that satisfies the integration configuration requirements, the portal displays the available `<virtual-network>/<subnet>` connection targets.
   
      - To use an existing connection, select the `<virtual-network>/<subnet>` target, and then select **Connect**.
      
      The procedure is complete.

   - To create a new plan for the integration, select **New connection**.

      The page refreshes to show the **Subscription**, **Virtual Network**, and **Subnet** options.

      Configure the options to create a new connection:

      1. Select a **Subscription** and a **Virtual Network** by using the dropdown lists.

      1. Select a **Subnet** from the dropdown list, and then select **Connect**.
      
         The dropdown list shows all the virtual networks (and subnets) in the selected subscription and in the same region. The list identifies subnets available for integration, and indicates whether they're currently in use.

      :::image type="content" source="./media/configure-vnet-integration-enable/add-subnet-connection.png" alt-text="Screenshot that shows how to select the subscription, virtual network, and subnet to create a new connection in the Azure portal.":::

During the integration, your app restarts. When integration completes, the **Virtual Network Integration** page refreshes to show the details about the connection between the virtual network and your app.

:::image type="content" source="./media/configure-vnet-integration-enable/virtual-network-connection.png" alt-text="Screenshot of the virtual network integration to an app in the Azure portal.":::


# [Azure CLI](#tab/azure-cli)

Configure virtual network integration for an app by using the Azure CLI. The following commands assume the app and virtual network are in the same subscription.

1. Run the following command to configure virtual network integration.

   Replace the `<app-name>`, `<app-resource-group>`, `<virtual-network>`, and `<subnet>` values with your resource information.

   ```azurecli-interactive
   az webapp vnet-integration add \
     --resource-group "<app-resource-group>" \
     --name "<app-name>" \
     --vnet "<virtual-network>" \
     --subnet "<subnet>"
   ```

1. After the integration is complete, you can update the app configuration to route all outbound traffic through the virtual network integration:

   Replace the `<app-resource-group>` and `<app-name>` values with your resource information.

   ```azurecli-interactive
   az resource update \
     --resource-group "<app-resource-group>" \
     --name "<app-name>" \
     --resource-type "Microsoft.Web/sites" \
     --set properties.outboundVnetRouting.allTraffic=true
   ```

Review the following considerations:

- If the virtual network is in a different subscription than the app, you can use the global `--subscription "<subscription-ID>"` parameter to set the current subscription context. Set the current subscription context to the subscription where the virtual network is deployed.

- The command checks if the subnet is delegated to `Microsoft.Web/serverFarms`. If the subnet doesn't have this configuration, the command applies the necessary delegation.

- If the subnet is configured but you don't have permissions to check it, or if the virtual network is in a different subscription from your app, you can use the `--skip-delegation-check` parameter to bypass the validation.

For more information, see the [az webapp vnet-integration add](/cli/azure/webapp/vnet-integration#az-webapp-vnet-integration-add) reference.


# [Azure PowerShell](#tab/azure-powershell)

Configure virtual network integration for an app by using Azure PowerShell. 

1. Prepare parameters for the procedure commands.

   Replace the `<subscription-GUID>`, `<app-name>`, `<app-resource-group>`, `<network-resource-group>`, `<virtual-network>`, and `<subnet>` values with your resource information.

   ```azurepowershell
   # Set parameters for the procedure
   $siteName = '<app-name>'
   $vNetResourceGroupName = '<network-resource-group>'
   $webAppResourceGroupName = '<app-resource-group>'
   $vNetName = '<virtual-network>'
   $integrationSubnetName = '<subnet>'
   $vNetSubscriptionId = '<subscription-GUID>'
   ```

   > [!NOTE]
   > If the virtual network is in a different subscription than the web app, you can use the `Set-AzContext -Subscription "<subscription-ID>"` command to set the current subscription context. Set the current subscription context to the subscription where the **virtual network** is deployed.

1. Check if the subnet is delegated to `Microsoft.Web/serverFarms`:

   ```azurepowershell
   # Set the virtual network for the subnet to check
   $vnet = Get-AzVirtualNetwork -Name $vNetName -ResourceGroupName $vNetResourceGroupName

   # Get the subnet
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name $integrationSubnetName -VirtualNetwork $vnet

   # Check the delegation
   Get-AzDelegation -Subnet $subnet
   ```

1. If your subnet isn't delegated to `Microsoft.Web/serverFarms`, add the delegation:

   ```azurepowershell
   # Get the subnet
   $subnet = Add-AzDelegation -Name "myDelegation" -ServiceName "Microsoft.Web/serverFarms" -Subnet $subnet

   # Set the delegation
   Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```

1. Configure virtual network integration, and route all traffic through the connection:

   ```azurepowershell
   # Set the subnet resource ID
   $subnetResourceId = "/subscriptions/$vNetSubscriptionId/resourceGroups/$vNetResourceGroupName/providers/Microsoft.Network/virtualNetworks/$vNetName/subnets/$integrationSubnetName"

   # Get the web app configuration
   $webApp = Get-AzResource -ResourceType "Microsoft.Web/sites" -ResourceGroupName $webAppResourceGroupName -ResourceName $siteName

   # Set the subnet ID
   $webApp.Properties | Add-Member -NotePropertyName "virtualNetworkSubnetId" -NotePropertyValue $subnetResourceId -Force

   # Set routing to all traffic
   $webApp.Properties | Add-Member -NotePropertyName "vnetRouteAllEnabled" -NotePropertyValue $true -Force

   # Complete the integration
   $webApp | Set-AzResource -Force
   ```

   > [!NOTE]
   > If the virtual network is in a different subscription than the web app, you can use the `Set-AzContext -Subscription "<subscription-ID>"` command to set the current subscription context. Set the current subscription context to the subscription where the **web app** is deployed.

---

## Related content

- [Manage Azure App Service virtual network integration routing](configure-vnet-integration-routing.md)
- [Overview of App Service networking features](networking-features.md)
