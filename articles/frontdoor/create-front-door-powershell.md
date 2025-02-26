---
title: 'Quickstart: Create an Azure Front Door using Azure PowerShell'
description: Learn how to create an Azure Front Door using Azure PowerShell. Use Azure Front Door to deliver content to your global user base and protect your web apps against vulnerabilities.
services: front-door
author: duongau
ms.author: duau
ms.date: 11/18/2024
ms.topic: quickstart
ms.service: azure-frontdoor
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Front Door using Azure PowerShell

In this quickstart, you learn how to create an Azure Front Door profile using Azure PowerShell. You use two Web Apps as your origin and verify connectivity through the Azure Front Door endpoint hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Azure Front Door deployment environment using the Azure PowerShell." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Create a resource group

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name myRGFD -Location centralus
```

## Create two web app instances

Create two web app instances in different Azure regions using [New-AzWebApp](/powershell/module/az.websites/new-azwebapp):

```azurepowershell-interactive
# Create first web app in Central US region.
$webapp1 = New-AzWebApp `
    -Name "WebAppContoso-01" `
    -Location centralus `
    -ResourceGroupName myRGFD `
    -AppServicePlan myAppServicePlanCentralUS

# Create second web app in East US region.
$webapp2 = New-AzWebApp `
    -Name "WebAppContoso-02" `
    -Location EastUS `
    -ResourceGroupName myRGFD `
    -AppServicePlan myAppServicePlanEastUS
```

## Create an Azure Front Door

### Create an Azure Front Door profile

Run [New-AzFrontDoorCdnProfile](/powershell/module/az.cdn/new-azfrontdoorcdnprofile) to create an Azure Front Door profile:

```azurepowershell-interactive
$fdprofile = New-AzFrontDoorCdnProfile `
    -ResourceGroupName myRGFD `
    -Name contosoAFD `
    -SkuName Premium_AzureFrontDoor `
    -Location Global
```

### Add an endpoint

Run [New-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/new-azfrontdoorcdnendpoint) to create an endpoint in your profile:

```azurepowershell-interactive
$FDendpoint = New-AzFrontDoorCdnEndpoint `
    -EndpointName contosofrontend `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -Location Global
```

### Create an origin group

Create health probe and load balancing settings, then create an origin group using [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup):

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

### Add origins to the group

Add your Web App origins to the origin group using [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin):

```azurepowershell-interactive
# Add first web app origin to origin group.
$origin1 = New-AzFrontDoorCdnOrigin `
    -OriginGroupName og `
    -OriginName contoso1 `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -HostName webappcontoso-01.azurewebsites.net `
    -OriginHostHeader webappcontoso-01.azurewebsites.net `
    -HttpPort 80 `
    -HttpsPort 443 `
    -Priority 1 `
    -Weight 1000

# Add second web app origin to origin group.
$origin2 = New-AzFrontDoorCdnOrigin `
    -OriginGroupName og `
    -OriginName contoso2 `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -HostName webappcontoso-02.azurewebsites.net `
    -OriginHostHeader webappcontoso-02.azurewebsites.net `
    -HttpPort 80 `
    -HttpsPort 443 `
    -Priority 1 `
    -Weight 1000
```

### Add a route

Map your endpoint to the origin group using [New-AzFrontDoorCdnRoute](/powershell/module/az.cdn/new-azfrontdoorcdnroute):

```azurepowershell-interactive
$Route = New-AzFrontDoorCdnRoute `
    -EndpointName contosofrontend `
    -Name defaultroute `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -ForwardingProtocol MatchRequest `
    -HttpsRedirect Enabled `
    -LinkToDefaultDomain Enabled `
    -OriginGroupId $originpool.Id `
    -SupportedProtocol Http,Https
```

## Test the Azure Front Door

After you create the Azure Front Door profile, it takes a few minutes for the configuration to be deployed globally. Once completed, access the frontend host you created.

Run [Get-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/get-azfrontdoorcdnendpoint) to get the hostname of the Azure Front Door endpoint:

```azurepowershell-interactive
$fd = Get-AzFrontDoorCdnEndpoint `
    -EndpointName contosofrontend `
    -ProfileName contosoafd `
    -ResourceGroupName myRGFD

$fd.hostname
```

In a browser, go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`. Your request is routed to the web app with the lowest latency in the origin group.

:::image type="content" source="./media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

To test instant global failover:

1. Open a browser and go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`.

1. Stop one of the Web Apps by running [Stop-AzWebApp](/powershell/module/az.websites/stop-azwebapp):

    ```azurepowershell-interactive
    Stop-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-01"
    ```

1. Refresh your browser. You should see the same information page.

1. Stop the other web app:

    ```azurepowershell-interactive
    Stop-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-02"
    ```

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped.":::

1. Restart one of the Web Apps by running [Start-AzWebApp](/powershell/module/az.websites/start-azwebapp). Refresh your browser and the page go back to normal:

    ```azurepowershell-interactive
    Start-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-01"
    ```

## Clean up resources

When you no longer need the resources created with the Azure Front Door, delete the resource group. This action deletes the Azure Front Door and all its related resources. Run [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive
Remove-AzResourceGroup -Name myRGFD
```

## Next steps

To learn how to add a custom domain to your Azure Front Door, continue to the Azure Front Door tutorials.

> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
