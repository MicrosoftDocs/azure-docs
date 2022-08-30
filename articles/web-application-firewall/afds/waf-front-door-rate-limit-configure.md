---
title: Configure WAF rate limit rule for Front Door
description: Learn how to configure a rate limit rule for an existing Front Door endpoint.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 03/21/2022
ms.author: victorh 
ms.custom: devx-track-azurepowershell
zone_pivot_groups: web-application-firewall-configuration
---

# Configure a Web Application Firewall rate limit rule

The Azure Web Application Firewall (WAF) rate limit rule for Azure Front Door controls the number of requests allowed from a particular client IP address to the application during a rate limit duration. For more information about rate limiting, see [What is rate limiting for Azure Front Door Service?](waf-front-door-rate-limit.md).

This article shows how to configure a WAF rate limit rule.

> [!NOTE]
> This article describes how to use rate limiting for Azure Front Door Standard/Premium.

## Scenario

Suppose you're responsible for a public website. You've just added a page with information about a promotion your organization is running. You're concerned that, if clients visit that page too often, some of your backend services might not scale quickly and the application might have performance issues.

You decide to create a rate limiting rule that restricts each client IP address to a maximum of 1000 requests per minute. You'll only apply this rule to requests that contain `*/promo*` in the request URL.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

::: zone pivot="powershell"

Before you begin to set up a rate limit policy, set up your PowerShell environment and create a Front Door profile.

### Set up your PowerShell environment

Azure PowerShell provides a set of cmdlets that use the [Azure Resource Manager](../../azure-resource-manager/management/overview.md) model for managing your Azure resources. 

You can install [Azure PowerShell](/powershell/azure/) on your local machine and use it in any PowerShell session. Here you sign in with your Azure credentials and install the Azure PowerShell module for Front Door Standard/Premium.

#### Connect to Azure with an interactive dialog for sign in

Sign in to Azure by running the following command:

```azurepowershell
Connect-AzAccount
```

#### Install PowerShellGet

Ensure that current version of PowerShellGet is installed. Run the following command:

```azurepowershell
Install-Module PowerShellGet -Force -AllowClobber
``` 

Then, restart PowerShell to ensure you use the latest version.

#### Install the Az.FrontDoor module 

Install the *Az.FrontDoor* and *Az.Cdn* PowerShell modules to work with Front Door Standard/Premium from PowerShell:

```azurepowershell
Install-Module -Name Az.FrontDoor
Install-Module -Name Az.Cdn
```

You use the *Az.Cdn* module to work with Front Door Standard/Premium resources, and you use the *Az.FrontDoor* module to work with WAF resources.

### Create a resource group

Use the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group for your Front Door profile and WAF policy. Update the resource group name and location for your own requirements:

```azurepowershell
$resourceGroupName = 'FrontDoorRateLimit'

New-AzResourceGroup -Name $resourceGroupName -Location 'westus'
```

### Create a Front Door profile

Use the [New-AzFrontDoorCdnProfile](/powershell/module/az.cdn/new-azfrontdoorcdnprofile) cmdlet to create a new Front Door profile.

In this example, you create a Front Door standard profile named *MyFrontDoorProfile*:

```azurepowershell
$frontDoorProfile = New-AzFrontDoorCdnProfile `
  -Name 'MyFrontDoorProfile' `
  -ResourceGroupName $resourceGroupName `
  -Location global `
  -SkuName Standard_AzureFrontDoor
```

### Create a Front Door endpoint

Use the [New-AzFrontDoorCdnEndpoint](/powershell/module/az.cdn/new-azfrontdoorcdnendpoint) cmdlet to add an endpoint to your Front Door profile.

Front Door endpoints must have globally unique names, so update the value of the `$frontDoorEndpointName` variable to something unique.

```azurepowershell
$frontDoorEndpointName = '<unique-front-door-endpoint-name>'

$frontDoorEndpoint = New-AzFrontDoorCdnEndpoint `
  -EndpointName $frontDoorEndpointName `
  -ProfileName $frontDoorProfile.Name `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Location $frontDoorProfile.Location
```

## Define a URL match condition

Use the [New-AzFrontDoorWafMatchConditionObject](/powershell/module/az.frontdoor/new-azfrontdoorwafmatchconditionobject) cmdlet to create a match condition, to identify requests that should have the rate limit applied.

The following example matches requests where the *RequestUri* variable contains the string */promo*:

```azurepowershell
$promoMatchCondition = New-AzFrontDoorWafMatchConditionObject `
  -MatchVariable RequestUri `
  -OperatorProperty Contains `
  -MatchValue '/promo'
```

## Create a custom rate limit rule

Use the [New-AzFrontDoorWafCustomRuleObject](/powershell/module/az.frontdoor/new-azfrontdoorwafcustomruleobject) cmdlet to create the rate limit rule, wh ich includes the match condition you defined in the previous step as well as the rate limit request threshold.

The following example sets the limit to 1000:

```azurepowershell
$promoRateLimitRule = New-AzFrontDoorWafCustomRuleObject `
  -Name 'rateLimitRule' `
  -RuleType RateLimitRule `
  -MatchCondition $promoMatchCondition `
  -RateLimitThreshold 1000 `
  -Action Block `
  -Priority 1
```

When any client IP address sends more than 1000 requests within one minute, the WAF blocks subsequent requests until the next minute starts.

## Create a WAF policy

Use the [New-AzFrontDoorWafPolicy](/powershell/module/az.frontdoor/new-azfrontdoorwafpolicy) cmdlet to create a WAF policy, which includes the custom rule you just created:

```azurepowershell
$wafPolicy = New-AzFrontDoorWafPolicy `
  -Name 'MyWafPolicy' `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Sku Standard_AzureFrontDoor `
  -CustomRule $promoRateLimitRule
```

## Configure a security policy to associate your Front Door profile with your WAF policy

Use the [New-AzFrontDoorCdnSecurityPolicy](/powershell/module/az.cdn/new-azfrontdoorcdnsecuritypolicy) cmdlet to create a security policy for your Front Door profile. A security policy associates your WAF policy with domains that you want to be protected by the WAF rule.

In this example, you associate the endpoint's default hostname with your WAF policy:

```azurepowershell
$securityPolicyAssociation = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallAssociationObject `
  -PatternsToMatch @("/*") `
  -Domain @(@{"Id"=$($frontDoorEndpoint.Id)})

$securityPolicyParameters = New-AzFrontDoorCdnSecurityPolicyWebApplicationFirewallParametersObject `
  -Association $securityPolicyAssociation `
  -WafPolicyId $wafPolicy.Id

$frontDoorSecurityPolicy = New-AzFrontDoorCdnSecurityPolicy `
  -Name 'MySecurityPolicy' `
  -ProfileName $frontDoorProfile.Name `
  -ResourceGroupName $frontDoorProfile.ResourceGroupName `
  -Parameter $securityPolicyParameters
```

> [!NOTE]
> Whenever you make changes to your WAF policy, you don't need to recreate the Front Door security policy. WAF policy updates are automatically applied to the Front Door domains.

::: zone-end

::: zone pivot="portal"

<!-- TODO -->

::: zone-end

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
