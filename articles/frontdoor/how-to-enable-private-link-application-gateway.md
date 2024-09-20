---
title: 'Connect Azure Front Door Premium to an Azure Application Gateway origin with Private Link (Preview)'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an application gateway privately.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 09/20/2024
ms.author: duau
zone_pivot_groups: front-door-dev-exp-ps-cli
---

# Connect Azure Front Door Premium to an Azure Application Gateway with Private Link (Preview)

This article guides you through the steps to configure an Azure Front Door Premium to connect privately to your Azure Application Gateway using Azure Private Link.

::: zone pivot="front-door-cli"

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Prerequisites:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A functioning Azure Front Door Premium profile and endpoint. See [Create a Front Door - CLI](create-front-door-cli.md).
- A functioning Azure Application Gateway. See [Direct web traffic with Azure Application Gateway - Azure CLI](../application-gateway/quick-create-cli.md).

## Enable private connectivity to Azure Application Gateway

Follow the steps in [Configure Azure Application Gateway Private Link](../application-gateway/private-link-configure.md), skipping the last step of creating a private endpoint.

## Create an origin group and add the application gateway as an origin

1. Create an origin group:

    ```azurecli-interactive
    az afd origin-group create \
        --resource-group myRGFD \
        --origin-group-name og \
        --profile-name contosoafd \
        --probe-request-type GET \
        --probe-protocol Http \
        --probe-interval-in-seconds 60 \
        --probe-path / \
        --sample-size 4 \
        --successful-samples-required 3 \
        --additional-latency-in-milliseconds 50
    ```

1. Add your application gateway as an origin:

    ```azurecli-interactive
    az afd origin create \
        --enabled-state Enabled \
        --resource-group myRGFD \
        --origin-group-name og \
        --origin-name appgwog \
        --profile-name contosoafd \
        --host-name 10.0.0.4 \
        --origin-host-header 10.0.0.4 \
        --http-port 80  \
        --https-port 443 \
        --priority 1 \
        --weight 500 \
        --enable-private-link true \
        --private-link-location centralus \
        --private-link-request-message 'AFD Private Link request.' \
        --private-link-resource /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway \
        --private-link-sub-resource-type appGwPublicFrontendIp 
    ```

> [!NOTE]
> `SharedPrivateLinkResourceGroupId` is the same as the Application Gateway frontend IP configuration. This value may vary for different frontend IP configurations.

## Approve the private endpoint connection

1. Retrieve the list of private endpoint connections:

    ```azurecli-interactive
    az network private-endpoint-connection list --name myAppGateway --resource-group myRGAG --type Microsoft.Network/applicationgateways
    ```

1. Approve the private endpoint connection:


    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway/privateEndpointConnections/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb.bbbbbbbb-1111-2222-3333-cccccccccccc
    ```

1. Add a route to map the endpoint to the origin group:

    ```azurecli-interactive
    az afd route create \
        --resource-group myRGFD \
        --profile-name contosoafd \
        --endpoint-name contosofrontend \
        --forwarding-protocol MatchRequest \
        --route-name route \
        --route-name route \
        --https-redirect Enabled \
        --origin-group og \
        --supported-protocols Http Https \
        --link-to-default-domain Enabled
    ```

Your Azure Front Door profile is now fully functional after completing the final step.

::: zone-end

::: zone pivot="front-door-ps"

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]
- - Have a functioning Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure PowerShell](../application-gateway/quick-create-powershell.md)


Add a route to map the endpoint to the origin group:

- Have a functioning Azure Front Door Premium profile and an endpoint. For more information on how to create an Azure Front Door profile, see [Create a Front Door - PowerShell](create-front-door-powershell.md).
- Have a functioning Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure PowerShell](../application-gateway/quick-create-powershell.md)

## Enable private connectivity to Azure Application Gateway

1. Follow the instructions in [Configure Azure Application Gateway Private Link](../application-gateway/private-link-configure.md), but don't complete the final step of creating a private endpoint.

## Create an origin group and add the application gateway as an origin

1. Use [New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouphealthprobesettingobject) to create an in-memory object for storing the health probe settings.

    ```azurepowershell-interactive
    # Create health probe settings
    
    $HealthProbeSetting = New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject `
        -ProbeIntervalInSecond 60 `
        -ProbePath "/" `
        -ProbeRequestType GET `
        -ProbeProtocol Http
    ```

1. Use [New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouploadbalancingsettingobject) to create an in-memory object for storing load balancing settings.

    ```azurepowershell-interactive
    # Create load balancing settings
    
    $LoadBalancingSetting = New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject `
        -AdditionalLatencyInMillisecond 50 `
        -SampleSize 4 `
        -SuccessfulSamplesRequired 3
    ```

1. Run [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup) to create an origin group that contains your application gateway.

    ```azurepowershell-interactive
    # Create origin group
    
    $originpool = New-AzFrontDoorCdnOriginGroup `
        -OriginGroupName og `
        -ProfileName contosoAFD `
        -ResourceGroupName myRGFD `
        -HealthProbeSetting $HealthProbeSetting `
        -LoadBalancingSetting $LoadBalancingSetting
    ```

1. Use the [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) command to add your application gateway to the origin group.

    > [!NOTE]
    > 'SharedPrivateLinkResourceGroupId' is the same as the Application Gateway frontend IP configuration. This value may be different for different frontend IP configurations.

    ```azurepowershell-interactive
    New-AzFrontDoorCdnOrigin ` 
        -OriginGroupName og ` 
        -OriginName appgatewayorigin ` 
        -ProfileName contosoAFD ` 
        -ResourceGroupName myRGFD ` 
        -HostName 10.0.0.4 ` 
        -HttpPort 80 ` 
        -HttpsPort 443 ` 
        -OriginHostHeader 10.0.0.4 ` 
        -Priority 1 ` 
        -PrivateLinkId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway ` 
        -SharedPrivateLinkResourceGroupId appGwPublicFrontendIp ` 
        -SharedPrivateLinkResourcePrivateLinkLocation CentralUS ` 
        -SharedPrivateLinkResourceRequestMessage 'AFD Private Link request' ` 
        -Weight 1000 `
    ```

## Approve the private endpoint

1. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to retrieve the connection name of the private endpoint connection that needs approval.

    ```azurepowershell-interactive
    Get-AzPrivateEndpointConnection -ResourceGroupName myRGAG -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways
    ```

2. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to retrieve the private endpoint connection details. Use the *Name* value from the output in the next step for approving the connection.

    ```azurepowershell-interactive
    Approve-AzPrivateEndpointConnection -Name aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb.bbbbbbbb-1111-2222-3333-cccccccccccc -ResourceGroupName myRGAG -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways
    ```

## Complete Azure Front Door setup

1. Use the [New-AzFrontDoorCdnRoute](/powershell/module/az.cdn/new-azfrontdoorcdnroute) command to create a route that maps your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

    ```azurepowershell-interactive
    # Create a route to map the endpoint to the origin group
    
    $Route = New-AzFrontDoorCdnRoute `
        -EndpointName contosofrontend `
        -Name defaultroute `
        -ProfileName contosoAFD `
        -ResourceGroupName myRGFD `
        -ForwardingProtocol MatchRequest `
        -HttpsRedirect Enabled `
        -LinkToDefaultDomain Enabled `
        -OriginGroupId og `
        -SupportedProtocol Http,Https
    ```
    Your Azure Front Door profile is now fully functional after completing the final step.

::: zone-end

## Common mistakes to avoid

The following are common mistakes when configuring an application gateway origin with Private Link enabled:

1. Not configuring Private Link before starting the Azure Front Door creation steps.

1. Adding the Azure Application Gateway origin with Private Link to an existing origin group that contains public origins. Front Door doesn't allow mixing public and private origins in the same origin group.

1. Providing an incorrect Azure Application Gateway frontend IP configuration name as the value for `GroupId`.

## Next steps

Learn about [Private Link service with storage account](../storage/common/storage-private-endpoints.md).