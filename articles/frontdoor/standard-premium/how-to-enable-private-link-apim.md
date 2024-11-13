---
title: 'Connect Azure Front Door Premium to an Azure API Management origin with Private Link (Preview)'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an Azure API Management privately.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 09/26/2024
ms.author: duau
zone_pivot_groups: front-door-dev-exp-ps-cli
ms.custom: ai-usage
---

# Connect Azure Front Door Premium to an Azure API Management with Private Link (Preview)

This article guides you through the steps to configure an Azure Front Door Premium to connect privately to your Azure API Management origin using Azure Private Link.

::: zone pivot="front-door-ps"

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure PowerShell installed locally or Azure Cloud Shell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

- Have a functioning Azure API Management instance. For more information on how to create an API Management instance, see [Create a new Azure API Management instance by using PowerShell](../../api-management/powershell-create-service-instance.md)

- Have a functioning Azure Front Door Premium profile and an endpoint. For more information on how to create an Azure Front Door profile, see [Create a Front Door - PowerShell](../create-front-door-powershell.md)

## Create an origin group and add the API Management instance as an origin

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

1. Run [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup) to create an origin group that contains your API Management instance.

    ```azurepowershell-interactive
    $origingroup = New-AzFrontDoorCdnOriginGroup `
        -OriginGroupName myOriginGroup `
        -ProfileName myFrontDoorProfile `
        -ResourceGroupName myResourceGroup `
        -HealthProbeSetting $healthProbeSetting `
        -LoadBalancingSetting $loadBalancingSetting
    ```

1. Use the [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) command to add your API Management instance to the origin group.

    ```azurepowershell-interactive
    New-AzFrontDoorCdnOrigin ` 
        -OriginGroupName myOriginGroup ` 
        -OriginName myAPIMOrigin ` 
        -ProfileName myFrontDoorProfile ` 
        -ResourceGroupName myResourceGroup ` 
        -HostName myapim.azure-api.net ` 
        -HttpPort 80 ` 
        -HttpsPort 443 ` 
        -OriginHostHeader myapim.azure-api.net ` 
        -Priority 1 ` 
        -PrivateLinkId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.ApiManagement/service/myAPIM ` 
        -SharedPrivateLinkResourceGroupId Gateway ` 
        -SharedPrivateLinkResourcePrivateLinkLocation CentralUS ` 
        -SharedPrivateLinkResourceRequestMessage 'Azure Front Door private connectivity request' ` 
        -Weight 1000 `
    ```

## Approve the private endpoint

1. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to retrieve the connection name of the private endpoint connection that needs approval.

    ```azurepowershell-interactive
    $PrivateEndpoint = Get-AzPrivateEndpointConnection -ResourceGroupName myResourceGroup -ServiceName myAPIM -PrivateLinkResourceType Microsoft.ApiManagement/service
    ```

2. Run [Approve-AzPrivateEndpointConnection](/powershell/module/az.network/approve-azprivateendpointconnection) to approve the private endpoint connection details. Use the *Name* value from the output in the previous step for approving the connection.

    ```azurepowershell-interactive
    Get-AzPrivateEndpointConnection -Name $PrivateEndpoint.Name -ResourceGroupName myResourceGroup -ServiceName myAPIM -PrivateLinkResourceType Microsoft.ApiManagement/service
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

[!INCLUDE[azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A functioning Azure Front Door Premium profile and endpoint. See [Create a Front Door - CLI](../create-front-door-cli.md).

- A functioning Azure API Management instance. See [Create a new Azure API Management instance by using the Azure CLI](../../api-management/get-started-create-service-instance-cli.md)

## Create an origin group and add the API Management instance as an origin

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

1. Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add the API Management instance as an origin to the origin group.

    ```azurecli-interactive
    az afd origin create \
        --enabled-state Enabled \
        --resource-group myResourceGroup \
        --origin-group-name myOriginGroup \
        --origin-name myAPIMOrigin \
        --profile-name myFrontDoorProfile \
        --host-name myapim.azure-api.net \
        --origin-host-header myapim.azure-api.net \
        --http-port 80  \
        --https-port 443 \
        --priority 1 \
        --weight 500 \
        --enable-private-link true \
        --private-link-location centralus \
        --private-link-request-message 'Azure Front Door private connectivity request.' \
        --private-link-resource /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.ApiManagement/service/myAPIM \
        --private-link-sub-resource-type Gateway
    ```


## Approve the private endpoint connection

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to get the **name** of the private endpoint connection that needs approval.

    ```azurecli-interactive
    az network private-endpoint-connection list --name myAPIM --resource-group myResourceGroup --type Microsoft.ApiManagement/service
    ```

1. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection using the **name** from the previous step.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.ApiManagement/service/myAPIM/privateEndpointConnections/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
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

## Next steps

Learn about [Private Link service with storage account](../../storage/common/storage-private-endpoints.md).