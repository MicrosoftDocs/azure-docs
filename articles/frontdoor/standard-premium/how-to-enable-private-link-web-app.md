---
title: Connect Azure Front Door to an App Service Origin
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a web app or function app privately.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 07/31/2025
zone_pivot_groups: front-door-dev-exp-portal-ps-cli
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
  - build-2025
  - sfi-image-nochange
---

# Connect Azure Front Door Premium to an App Service (Web App or Function App) origin with Private Link

**Applies to:** :heavy_check_mark: Front Door Premium

This article shows you how to configure Azure Front Door Premium to connect to your App Service (Web App or Function App) privately using Azure Private Link.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

::: zone pivot="front-door-portal"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](../create-front-door-portal.md).

- A Private Link. For more information, see [Create a Private Link service](../../private-link/create-private-link-service-portal.md).

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

::: zone-end

::: zone pivot="front-door-ps"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](../create-front-door-powershell.md).

- A Private Link. For more information, see [Create a Private Link service](../../private-link/create-private-link-service-powershell.md).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

::: zone-end

::: zone pivot="front-door-cli"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](../create-front-door-cli.md).

- A Private Link. For more information, see [Create a Private Link service](../../private-link/create-private-link-service-cli.md).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

::: zone-end

> [!NOTE]
> Private endpoints require your App Service plan to meet specific requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md). This feature isn't supported with App Service Slots.

## Enable Private Link to an App Service (Web App or Function App) in Azure Front Door Premium

::: zone pivot="front-door-portal"

In this section, you map the Private Link service to a private endpoint within Azure Front Door's private network.

1. In your Azure Front Door Premium profile, go to *Settings* and select **Origin groups**.

1. Choose the origin group that should contain the App Service (Web App or Function App) origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new origin or select an existing one from the list. Use the following table to configure the settings for the origin:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this origin. |
    | Origin Type | App services |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | Customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Assign different priorities to origins for primary, secondary, and backup purposes. |
    | Weight | 1000 (default). Use weights to distribute traffic among different origins. |
    | Region | Select the region that matches or is closest to your origin. |
    | Target sub resource | Choose *site* as the subresource type for the selected resource. |
    | Request message | Enter a custom message to display while approving the Private Endpoint. |

    :::image type="content" source="../media/how-to-enable-private-link-web-app/private-endpoint-app-service.png" alt-text="Screenshot of enabling private link.":::

1. Select **Add** to save your configuration, then select **Update** to save the origin group settings.

::: zone-end

::: zone pivot="front-door-ps"

1. Use the [Get-AzResource](/powershell/module/az.resources/get-azresource) cmdlet to get the resource ID of the App Service to be used as the origin for Azure Front Door:

    ```azurepowershell-interactive
    Get-AzResource -Name testWebAppAFD `
                   -ResourceGroupName testRG
    ```

1. Use the [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) cmdlet to add your App Service origin to your origin group:

    ```azurepowershell-interactive
    # Add App Service origin to the Azure Front Door profile with Private Link
    $origin1 = New-AzFrontDoorCdnOrigin `
        -OriginGroupName default-origin-group `
        -OriginName test-origin `
        -ProfileName testAFD `
        -ResourceGroupName testRG `
        -HostName testwebapp.canadacentral-01.azurewebsites.net `
        -OriginHostHeader testwebapp.canadacentral-01.azurewebsites.net `
        -HttpPort 80 `
        -HttpsPort 443 `
        -Priority 1 `
        -Weight 1000 `
        -PrivateLinkId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD `
        -SharedPrivateLinkResourceGroupId sites `
        -SharedPrivateLinkResourcePrivateLinkLocation "Central US" `
        -SharedPrivateLinkResourceRequestMessage "testWebAppAFDPL Private Link request"
    ```

::: zone-end

::: zone pivot="front-door-cli"

Use the [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) command to create a new Azure Front Door origin. The `private-link-location` value must be from the [available regions](../private-link.md#region-availability) and the `private-link-sub-resource-type` value is **sites**.    

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group 'myResourceGroup' \
                     --origin-group-name 'og1' \
                     --origin-name 'myapporigin' \
                     --profile-name 'contosoAFD' \
                     --host-name 'example.contoso.com' \
                     --origin-host-header 'example.contoso.com' \
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location 'EastUS' \
                     --private-link-request-message 'AFD app service origin Private Link request.' \
                     --private-link-resource /'subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/webapp1/appServices' \
                     --private-link-sub-resource-type sites
```

::: zone-end

## Approve Azure Front Door Premium private endpoint connection from App Service

::: zone pivot="front-door-portal"

1. Go to the App Service that you configured with Private Link in the previous section. Under **Settings**, select **Networking**.

1. In the **Networking** section, select **Configure your private endpoint connections**.

    :::image type="content" source="../media/how-to-enable-private-link-web-app/app-service-configure-endpoint.png" alt-text="Screenshot of networking settings in App Service.":::

1. Find the *pending* private endpoint request from Azure Front Door Premium and select **Approve**.

::: zone-end

::: zone pivot="front-door-ps"

1. Use the [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) cmdlet to list the private endpoint connections for your App Service. Note the `Name` of the private endpoint connection available in your App Service from the output.

    ```azurepowershell-interactive
    # PrivateLinkResourceId is the resource ID of the WebApp
    Get-AzPrivateEndpointConnection -PrivateLinkResourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD'
    ```

1. Use the [Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection) cmdlet to approve the private endpoint connection.

    ```azurepowershell-interactive
    Approve-AzPrivateEndpointConnection -ResourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/webapp1/privateEndpointConnections/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1'
    ```

1. Use the [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) cmdlet to verify the status of the private endpoint connection.

    ```azurepowershell-interactive
    Get-AzPrivateEndpointConnection -PrivateLinkResourceId '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testRG/providers/Microsoft.Web/sites/testWebAppAFD'
    ```

::: zone-end

::: zone pivot="front-door-cli"

1. Use the [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) command to list the private endpoint connections for your web app. Note the `Resource ID` of the private endpoint connection on the first line of the output.

    ```azurecli-interactive
    az network private-endpoint-connection list --name 'webapp1' --resource-group 'myResourceGroup' --type 'Microsoft.Web/sites'
    ```

1. Use the [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) command to approve the private endpoint connection.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/webapp1/privateEndpointConnections/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1'
    ```

::: zone-end

It can take a few minutes for the connection to fully establish after approval. Once established, you can access your web app or function app through Azure Front Door Premium. Direct access to the app from the public internet is disabled once private endpoint is enabled.

## Common mistakes to avoid

A common mistake when configuring an origin with Azure Private Link enabled is:

- Adding the origin with Azure Private Link enabled to an existing origin group that contains public origins. Azure Front Door doesn't allow mixing public and private origins in the same origin group. 

## Related content

- [Connect Azure Front Door Premium to an Azure Application Gateway with Private Link](../how-to-enable-private-link-application-gateway.md)
- [Use private endpoints for Azure App Service apps](../../app-service/networking/private-endpoint.md)
