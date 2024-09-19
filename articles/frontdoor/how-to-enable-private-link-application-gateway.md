---
title: 'Connect Azure Front Door Premium to an application gateway origin with Private Link (preview)'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an application gateway privately.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 09/18/2024
ms.author: duau
zone_pivot_groups: front-door-dev-exp-ps-cli
---

# Connect Azure Front Door Premium to an application gateway with Private Link
This article will guide you through how to configure Azure Front Door Premium tier to connect to your application gateway privately using the Azure Private Link service

::: zone pivot="front-door-cli"

## Prerequisites - CLI

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Have a functioning Azure Front Door Premium profile and an endpoint. For more information on how to create an Azure Front Door profile, see [Create a Front Door - CLI](create-front-door-cli.md).
- Have a functioning Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway - Azure CLI](/articles/application-gateway/quick-create-cli.md)

## Enable Private Link on Application Gateway
1. Follow the steps in [Configure Azure Application Gateway Private Link](/articles/application-gateway/private-link-configure.md). Skip the last step of creating a private endpoint.

## Create origin group and origin on Azure Front Door

1. Run [az afd origin-group create](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group.

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
2. Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to add your application gateway as an origin to your origin group.

```azurecli-interactive
az afd origin create \
    --enabled-state Enabled \
    --resource-group myRGFD \
    --origin-group-name og \
    --origin-name appgwog \
    --profile-name Hari \
    --host-name x.x.x.x \
    --origin-host-header x.x.x.x \
    --http-port 80  \
    --https-port 443 \
    --priority 1 \
    --weight 500 \
    --enable-private-link true \
    --private-link-location centralus \
    --private-link-request-message 'AFD Private Link request.' \
    --private-link-resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway \
    --private-link-sub-resource-type appGwPublicFrontendIp 
```
> [!NOTE]
> 'SharedPrivateLinkResourceGroupId' is the same as the Application Gateway frontend IP configuration. This value may be different for different frontend IP configurations.

## Approve Private Endpoint Connection

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to list the private endpoint connections. Note down the 'Resource ID' of the private endpoint connection available for your application gateway, in the first line of your output.

```azurecli-interactive
    az network private-endpoint-connection list --name myAppGateway --resource-group myRGAG --type Microsoft.Network/applicationgateways

```

2. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection.

```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway/privateEndpointConnections/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

```
## Complete Azure Front Door setup
1. Add a route to map the endpoint that you created earlier to the origin group. This route forwards requests from the endpoint to your origin group. Run [az afd route create](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. 

```azurecli-interactive
az afd route create \
    --resource-group myRGFD \
    --profile-name contosoafd \
    --endpoint-name contosofrontend \
    --forwarding-protocol MatchRequest \
    --route-name route \
    --https-redirect Enabled \
    --origin-group og \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled 
```
Your Front Door profile has become fully functional with the last step.
::: zone-end

::: zone pivot="front-door-ps"

## Prerequisites - PowerShell
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]
- Have a functioning Azure Front Door Premium profile and an endpoint. For more information on how to create an Azure Front Door profile, see [Create a Front Door - PowerShell](create-front-door-powershell.md).
- Have a functioning Azure Application Gateway. For more information on how to create an Application Gateway, see [Direct web traffic with Azure Application Gateway using Azure PowerShell](/articles/application-gateway/quick-create-powershell.md)

## Enable Private Link on Application Gateway
1. Follow the steps in [Configure Azure Application Gateway Private Link](/articles/application-gateway/private-link-configure.md). Skip the last step of creating a private endpoint.

## Create origin group and origin on Azure Front Door
1. Use [New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouphealthprobesettingobject) and [New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouploadbalancingsettingobject) to create  in-memory objects for storing health probe and load balancing settings. Run [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup) to create an origin group that will contain your application gateway.

```azurepowershell-interactive
# Create health probe settings

$HealthProbeSetting = New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject `
    -ProbeIntervalInSecond 60 `
    -ProbePath "/" `
    -ProbeRequestType GET `
    -ProbeProtocol Http

# Create load balancing settings

$LoadBalancingSetting = New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject `
    -AdditionalLatencyInMillisecond 50 `
    -SampleSize 4 `
    -SuccessfulSamplesRequired 3

# Create origin group

$originpool = New-AzFrontDoorCdnOriginGroup `
    -OriginGroupName og `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -HealthProbeSetting $HealthProbeSetting `
    -LoadBalancingSetting $LoadBalancingSetting
```
2. Run [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) to add your application gateway to your origin group.

> [!NOTE]
> 'SharedPrivateLinkResourceGroupId' is the same as the Application Gateway frontend IP configuration. This value may be different for different frontend IP configurations.

```azurepowershell-interactive
New-AzFrontDoorCdnOrigin ` 
    -OriginGroupName og ` 
    -OriginName appgatewayorigin ` 
    -ProfileName contosoAFD ` 
    -ResourceGroupName myRGFD ` 
    -HostName x.x.x.x ` 
    -HttpPort 80 ` 
    -HttpsPort 443 ` 
    -OriginHostHeader x.x.x.x ` 
    -Priority 1 ` 
    -PrivateLinkId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myRGAG/providers/Microsoft.Network/applicationGateways/myAppGateway ` 
    -SharedPrivateLinkResourceGroupId appGwPublicFrontendIp ` 
    -SharedPrivateLinkResourcePrivateLinkLocation CentralUS ` 
    -SharedPrivateLinkResourceRequestMessage 'AFD Private Link request' ` 
    -Weight 1000 `
```
## Approve the private endpoint
1. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to get the connection name of the private endpoint connection to be approved.

```azurepowershell-interactive
Get-AzPrivateEndpointConnection -ResourceGroupName myRGAG -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways

```
2. Run [Get-AzPrivateEndpointConnection](/powershell/module/az.network/get-azprivateendpointconnection) to approve the private endpoint connection. The value for the field 'Name' should be the value you received in the previous step.

```azurepowershell-interactive

Approve-AzPrivateEndpointConnection -Name xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ResourceGroupName myRGAG -ServiceName myAppGateway -PrivateLinkResourceType Microsoft.Network/applicationgateways

```

## Complete Azure Front Door setup
1. Run [New-AzFrontDoorCdnRoute](/powershell/module/az.cdn/new-azfrontdoorcdnroute) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.


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
Your Front Door profile has become fully functional with the last step.

::: zone-end

## Commonly seen mistakes
The following are the commonly seen mistakes while configuring an application gateway origin with private link enabled.
1. Private link configuration was not set in advance to the Front Door creation steps.
2. Adding the application gateway origin with privatelink to an existing origin group with public origins. Front door doesn't allow public and private origins in the same origin group.
3. Wrong Application frontend IP configuration name is passed as the value for GroupId.


## Next steps

Learn about [Private Link service with storage account](../storage/common/storage-private-endpoints.md).