---
title: 'Quickstart: Create an Azure Front Door Standard/Premium - Azure PowerShell'
description: Learn how to create an Azure Front Door Standard/Premium using Azure PowerShell. Use Azure Front Door to deliver content to your global user base and protect your web apps against vulnerabilities.
services: front-door
author: duongau
ms.author: duau
manager: KumudD
ms.date: 06/28/2022
ms.topic: quickstart
ms.service: frontdoor
ms.workload: infrastructure-services
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Front Door Standard/Premium - Azure PowerShell

In this quickstart, you'll learn how to create an Azure Front Door Standard/Premium profile using Azure PowerShell. You'll create this profile using two Web Apps as your origin. You can then verify connectivity to your Web Apps using the Azure Front Door endpoint hostname.

:::image type="content" source="media/quickstart-create-front-door/environment-diagram.png" alt-text="Diagram of Front Door deployment environment using the Azure PowerShell." border="false":::

[!INCLUDE [ddos-waf-recommendation](../../includes/ddos-waf-recommendation.md)]
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name myRGFD -Location centralus
```

## Create two instances of a web app

This quickstart requires two instances of a web application that run in different Azure regions. Both the web application instances run in Active/Active mode, so either one can take traffic. This configuration differs from an Active/Stand-By configuration, where one acts as a failover.

If you don't already have a web app, use [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) to set up two example web apps.

```azurepowershell-interactive
# Create first web app in Central US region.

$webapp1 = New-AzWebApp `
    -Name "WebAppContoso-01" `
    -Location centralus `
    -ResourceGroupName myRGFD `
    -AppServicePlan myAppServicePlanCentralUS

# Create second web app in South Central US region.

$webapp2 = New-AzWebApp `
    -Name "WebAppContoso-02" `
    -Location EastUS `
    -ResourceGroupName myRGFD `
    -AppServicePlan myAppServicePlanEastUS
```

## Create a Front Door

This section details how you can create and configure the components of a Front Door.

### Create a Front Door profile

Run [New-AzFrontDoorCdnProfile](/powershell/module/az.cdn/new-azfrontdoorcdnprofile) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium substitute the value of the sku parameter with `Standard_AzureFrontDoor`. You won't be able to deploy managed rules with WAF Policy, if you choose Standard SKU. For detailed comparison, view [Azure Front Door tier comparison](standard-premium/tier-comparison.md).

```azurepowershell-interactive
#Create the profile

$fdprofile = New-AzFrontDoorCdnProfile `
    -ResourceGroupName myRGFD `
    -Name contosoAFD `
    -SkuName Premium_AzureFrontDoor `
    -Location Global
```
### Add an endpoint

Run [New-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/new-azfrontdoorcdnendpoint) to create an endpoint in your profile. You can create multiple endpoints in your profile after finishing the create experience.

```azurepowershell-interactive
#Create the endpoint

$FDendpoint = New-AzFrontDoorCdnEndpoint `
    -EndpointName contosofrontend `
    -ProfileName contosoAFD `
    -ResourceGroupName myRGFD `
    -Location Global
```

### Create an origin group

Use [New-AzFrontDoorCdnOriginGroupHealthProbeSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouphealthprobesettingobject) and [New-AzFrontDoorCdnOriginGroupLoadBalancingSettingObject](/powershell/module/az.cdn/new-azfrontdoorcdnorigingrouploadbalancingsettingobject) to create  in-memory objects for storing health probe and load balancing settings.

Run [New-AzFrontDoorCdnOriginGroup](/powershell/module/az.cdn/new-azfrontdoorcdnorigingroup) to create an origin group that will contain your two web apps.

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
    
### Add an origin to the group

Run [New-AzFrontDoorCdnOrigin](/powershell/module/az.cdn/new-azfrontdoorcdnorigin) to add your Web App origins to your origin group.

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

Run [New-AzFrontDoorCdnRoute](/powershell/module/az.cdn/new-azfrontdoorcdnroute) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.


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
    -OriginGroupId $originpool.Id `
    -SupportedProtocol Http,Https
```
Your Front Door profile has become fully functional with the last step.

## Test the Front Door
When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [Get-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/get-azfrontdoorcdnendpoint) to get the hostname of the Front Door endpoint.

```azurepowershell-interactive
$fd = Get-AzFrontDoorCdnEndpoint `
    -EndpointName contosofrontend `
    -ProfileName contosoafd `
    -ResourceGroupName myRGFD

$fd.hostname
```
In a browser, go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`. Your request will automatically get routed to the web app with the lowest latency in the origin group.

:::image type="content" source="./media/create-front-door-portal/front-door-web-app-origin-success.png" alt-text="Screenshot of the message: Your web app is running and waiting for your content.":::

To test instant global failover, we'll use the following steps:

1. Open a browser, as described above, and go to the endpoint hostname: `contosofrontend-<hash>.z01.azurefd.net`.

1. Stop one of the Web Apps by running [Stop-AzWebApp](/powershell/module/az.websites/stop-azwebapp)

    ```azurepowershell-interactive
    Stop-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-01"
    ```

1. Refresh your browser. You should see the same information page.

   > [!TIP]
   > There is a little bit of delay for these actions. You might need to refresh again.

1. Find the other web app, and stop it as well.

    ```azurepowershell-interactive
    Stop-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-02"
    ```

1. Refresh your browser. This time, you should see an error message.

    :::image type="content" source="./media/create-front-door-portal/web-app-stopped-message.png" alt-text="Screenshot of the message: Both instances of the web app stopped.":::


1. Restart one of the Web Apps by running [Start-AzWebApp](/powershell/module/az.websites/start-azwebapp). Refresh your browser and the page will go back to normal.

    ```azurepowershell-interactive
    Start-AzWebApp -ResourceGroupName myRGFD -Name "WebAppContoso-01"
    ```

## Clean up resources

When you no longer need the resources that you created with the Front Door, delete the resource group. When you delete the resource group, you also delete the Front Door and all its related resources. 

To delete the resource group, Run [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup):

```azurepowershell-interactive
Remove-AzResourceGroup -Name myRGFD
```

## Next steps

To learn how to add a custom domain to your Front Door, continue to the Front Door tutorials.

> [!div class="nextstepaction"]
> [Add a custom domain](front-door-custom-domain.md)
