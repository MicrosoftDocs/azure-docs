---
title: 'Connect Azure Front Door Premium to an Azure Application Gateway origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an Azure Application Gateway privately.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 09/24/2024
ms.custom: ai-usage
zone_pivot_groups: front-door-dev-exp-portal-ps-cli
---

# Connect Azure Front Door Premium to an Azure Application Gateway with Private Link

**Applies to:** :heavy_check_mark: Front Door Premium

This article guides you through the steps to configure an Azure Front Door Premium to connect privately to your Azure Application Gateway using Azure Private Link.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

::: zone pivot="front-door-portal"

- An Azure Front Door Premium profile and an endpoint. For more information, see [Create an Azure Front Door](create-front-door-portal.md).

- An Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure portal](../application-gateway/quick-create-portal.md)

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

::: zone-end

::: zone pivot="front-door-ps"

- An Azure Front Door Premium profile and an endpoint. For more information, see [Create an Azure Front Door](create-front-door-powershell.md).

- An Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure PowerShell](../application-gateway/quick-create-powershell.md)

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

::: zone-end

::: zone pivot="front-door-cli"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](create-front-door-cli.md).

- An Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure CLI](../application-gateway/quick-create-cli.md).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

::: zone-end

> [!NOTE]
> While configuring via Azure portal, the region chosen in Azure Front Door origin configuration must be the same region where the Application Gateway is located in. If you want the Azure Front Door origin region and the Application Gateway region to be different, use CLI/PowerShell. This will be needed in cases where the Application Gateway is located in a region where Azure Front Door doesn't support Private Link.

::: zone pivot="front-door-portal"

## Enable private connectivity to Azure Application Gateway

1. Follow the instructions in [Configure Azure Application Gateway Private Link](../application-gateway/private-link-configure.md), but don't complete the final step of creating a private endpoint.

1. Go to your Application Gateway's **Overview** tab, note down the Resource group name, Application Gateway name and Subscription ID.

1. Under **Settings**, select **Private Link**. Note down the name of the private link service seen under the **Name** column in **Private link configurations** tab

1. Construct the resource ID of the private link service using the values from previous steps. The format is `/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/privateLinkServices/_e41f87a2_{applicationGatewayName}_{privateLinkResource.Name}`. This resource ID is used while configuring the Front Door origin.

## Create an origin group and add the application gateway as an origin

1. In your Azure Front Door Premium profile, go to *Settings* and select **Origin groups**.

1. Select on **Add**

1. Enter a name for the origin group

1. Select **+ Add an origin** 

1. Use the following table to configure the settings for the origin:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this origin. |
    | Origin Type | Custom |
    | Host name | Enter the hostname of the listener of your Application Gateway |
    | Origin host header | Enter the hostname of the listener of your Application Gateway |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Assign different priorities to origins for primary, secondary, and backup purposes. |
    | Weight | 1000 (default). Use weights to distribute traffic among different origins. |
    | Private link | Enable private link service |
    | Select a private link | By ID or alias |
    | ID/alias | Enter the private link service resource ID obtained while configuring the Application Gateway. |
    | Region | Select the region where Application Gateway is located. |
    | Request message | Enter a custom message to display while approving the Private Endpoint.  |

   :::image type="content" source="media/private-link/application-gateway-private-link.png" alt-text="Screenshot of origin settings for configuring Application Gateway as a private origin.":::    

1. Select **Add** to save your origin settings

1. Select **Add** to save the origin group settings.

## Approve the private endpoint

1. Navigate to the Application Gateway you configured with Private Link in the previous section. Under **Settings**, select **Private link**.

1. Select **Private endpoint connections** tab.

1. Find the *pending* private endpoint request from Azure Front Door Premium and select **Approve**.

1. After approval, the connection status will update. It can take a few minutes for the connection to fully establish. Once established, you can access your Application Gateway through Front Door. Direct access to the Application Gateway from the public internet is disabled once private endpoint is enabled.
:::image type="content" source="media/private-link/application-gateway-private-endpoint-connections.png" alt-text="Screenshot of private endpoint connections tab in Application Gateway portal.":::
    
::: zone-end

::: zone pivot="front-door-ps"

## Enable private connectivity to Azure Application Gateway

Follow the instructions in [Configure Azure Application Gateway Private Link](../application-gateway/private-link-configure.md), but don't complete the final step of creating a private endpoint.

## Create an origin group and add the application gateway as an origin

1. Use [New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouphealthprobesettingobject) to create an in-memory object for storing the health probe settings.

    ```azurepowershell-interactive
    $healthProbeSetting = New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject `
        -ProbeIntervalInSecond 60 `
        -ProbePath "/" `
        -ProbeRequestType GET `
        -ProbeProtocol Http
    ```

1. Use [New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouploadbalancingsettingobject) to create an in-memory object for storing load balancing settings.

    ```azurepowershell-interactive
    $loadBalancingSetting = New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject `
        -AdditionalLatencyInMillisecond 50 `
        -SampleSize 4 `
        -SuccessfulSamplesRequired 3
    ```

1. Run [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup) to create an origin group that contains your application gateway.

    ```azurepowershell-interactive
    $origingroup = New-AzFrontDoorCdnOriginGroup `
        -OriginGroupName myOriginGroup `
        -ProfileName myFrontDoorProfile `
        -ResourceGroupName myResourceGroup `
        -HealthProbeSetting $healthProbeSetting `
        -LoadBalancingSetting $loadBalancingSetting
    ```

1. Get the frontend IP configuration name of the Application Gateway with the [Get-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/get-azapplicationgatewayfrontendipconfig) command.

    ```azurepowershell-interactive
    $AppGw = Get-AzApplicationGateway -Name myAppGateway -ResourceGroupName myResourceGroup
    $FrontEndIPs= Get-AzApplicationGatewayFrontendIPConfig  -ApplicationGateway $AppGw
    $FrontEndIPs.name
    ```

1. Use the [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) command to add your application gateway to the origin group.

    ```azurepowershell-interactive
    New-AzFrontDoorCdnOrigin ` 
        -OriginGroupName myOriginGroup ` 
        -OriginName myAppGatewayOrigin ` 
        -ProfileName myFrontDoorProfile ` 
        -ResourceGroupName myResourceGroup ` 
        -HostName www.contoso.com ` 
        -HttpPort 80 ` 
        -HttpsPort 443 ` 
        -OriginHostHeader www.contoso.com ` 
        -Priority 1 ` 
        -PrivateLinkId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/myAppGateway ` 
        -SharedPrivateLinkResourceGroupId $FrontEndIPs.name ` 
        -SharedPrivateLinkResourcePrivateLinkLocation CentralUS ` 
        -SharedPrivateLinkResourceRequestMessage 'Azure Front Door private connectivity request' ` 
        -Weight 1000 `
    ```

    > [!NOTE]
    > `SharedPrivateLinkResourceGroupId` is the name of the Azure Application Gateway frontend IP configuration.

## Approve the private endpoint

1. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to retrieve the connection name of the private endpoint connection that needs approval.

    ```azurepowershell-interactive
    Get-AzPrivateEndpointConnection -ResourceGroupName myResourceGroup -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways
    ```

2. Run [Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection) to approve the private endpoint connection details. Use the *Name* value from the output in the previous step for approving the connection.

    ```azurepowershell-interactive
    Get-AzPrivateEndpointConnection -Name aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb.bbbbbbbb-1111-2222-3333-cccccccccccc -ResourceGroupName myResourceGroup -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways
    ```

## Complete Azure Front Door setup

Use the [New-AzFrontDoorCdnRoute](/powershell/module/az.cdn/new-azfrontdoorcdnroute) command to create a route that maps your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurepowershell-interactive
# Create a route to map the endpoint to the origin group

$Route = New-AzFrontDoorCdnRoute `
    -EndpointName myFrontDoorEndpoint `
    -Name myRoute `
    -ProfileName myFrontDoorProfile `
    -ResourceGroupName myResourceGroup `
    -ForwardingProtocol MatchRequest `
    -HttpsRedirect Enabled `
    -LinkToDefaultDomain Enabled `
    -OriginGroupId $origingroup.Id `
    -SupportedProtocol Http,Https
```

Your Azure Front Door profile is now fully functional after completing the final step.

::: zone-end

::: zone pivot="front-door-cli"

## Enable private connectivity to Azure Application Gateway

Follow the steps in [Configure Azure Application Gateway Private Link](../application-gateway/private-link-configure.md), skipping the last step of creating a private endpoint.

## Create an origin group and add the application gateway as an origin

1. Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group.

    ```azurecli-interactive
    az afd origin-group create \
        --resource-group myResourceGroup \
        --origin-group-name myOriginGroup \
        --profile-name myFrontDoorProfile \
        --probe-request-type GET \
        --probe-protocol Http \
        --probe-interval-in-seconds 60 \
        --probe-path / \
        --sample-size 4 \
        --successful-samples-required 3 \
        --additional-latency-in-milliseconds 50
    ```

1. Run [az network application-gateway frontend-ip list](/cli/azure/network/application-gateway/frontend-ip#az-network-application-gateway-frontend-ip-list) to get the frontend IP configuration name of the Application Gateway.

    ```azurecli-interactive
    az network application-gateway frontend-ip list --gateway-name myAppGateway --resource-group myResourceGroup
    ```

1. Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add an application gateway as an origin to the origin group.

    ```azurecli-interactive
    az afd origin create \
        --enabled-state Enabled \
        --resource-group myResourceGroup \
        --origin-group-name myOriginGroup \
        --origin-name myAppGatewayOrigin \
        --profile-name myFrontDoorProfile \
        --host-name www.contoso.com \
        --origin-host-header www.contoso.com \
        --http-port 80  \
        --https-port 443 \
        --priority 1 \
        --weight 500 \
        --enable-private-link true \
        --private-link-location centralus \
        --private-link-request-message 'Azure Front Door private connectivity request.' \
        --private-link-resource /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway \
        --private-link-sub-resource-type myAppGatewayFrontendIPName
    ```

    > [!NOTE]
    > `private-link-sub-resource-type` is the Azure Application Gateway frontend IP configuration name.

## Approve the private endpoint connection

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to get the **id** of the private endpoint connection that needs approval.

    ```azurecli-interactive
    az network private-endpoint-connection list --name myAppGateway --resource-group myResourceGroup --type Microsoft.Network/applicationgateways
    ```

1. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection using the **id** from the previous step.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/myAppGateway/privateEndpointConnections/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb.bbbbbbbb-1111-2222-3333-cccccccccccc
    ```

## Complete Azure Front Door setup

Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to create a route that maps your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurecli-interactive
az afd route create \
    --resource-group myResourceGroup \
    --profile-name myFrontDoorProfile \
    --endpoint-name myFrontDoorEndpoint \
    --forwarding-protocol MatchRequest \
    --route-name myRoute \
    --https-redirect Enabled \
    --origin-group myOriginGroup \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled
```

Your Azure Front Door profile is now fully functional after completing the final step.

::: zone-end

## Common mistakes to avoid

The following are common mistakes when configuring an Azure Application Gateway origin with Azure Private Link enabled:

1. Configuring Azure Front Door origin before configuring Azure Private Link on the Azure Application Gateway.
2. Adding the Azure Application Gateway origin with Azure Private Link to an existing origin group that contains public origins. Azure Front Door doesn't allow mixing public and private origins in the same origin group.
3. The combined length of the Application Gateway name and Private Link configuration name must not exceed 70 characters to avoid deployment failures.
4. Not associating the Application Gateway frontend IP with a listener.

::: zone pivot="front-door-portal"
5. Configuring the origin with origin type as 'Application Gateway' instead of 'Custom'. When you choose the origin type as 'Application Gateway', the origin hostname is autopopulated with the IP address of the Application Gateway. This can lead to 'CertificateNameValidation' error. This issue can be avoided in public origins by disabling certificate subject name validation. But for private link enabled origins, certificate subject name validation is mandatory.
::: zone-end

::: zone pivot="front-door-ps"
5. Providing an incorrect Azure Application Gateway frontend IP configuration name as the value for `SharedPrivateLinkResourceGroupId`.
::: zone-end

::: zone pivot="front-door-cli"
5. Providing an incorrect Azure Application Gateway frontend IP configuration name as the value for `private-link-sub-resource-type`.
::: zone-end


## Next step

> [!div class="nextstepaction"]
> [Private Link service with storage account](../storage/common/storage-private-endpoints.md)
