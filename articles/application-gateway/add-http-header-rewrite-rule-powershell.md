---
title: Rewrite HTTP headers in an existing Azure Application Gateway
description: This article provides information on how to rewrite HTTP headers in an existing Azure Application Gateway using Azure PowerShell
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 12/20/2018
ms.author: absha
---
# Rewrite HTTP headers in an existing Application gateway

You can use Azure PowerShell to
configure [rules to rewrite HTTP request and response headers](rewrite-http-headers.md) in an existing [autoscaling and zone-redundant application gateway SKU](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant)

> [!IMPORTANT]
> The autoscaling and zone-redundant application gateway SKU is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Retrieve configuration of an existing application gateway
> * Specify your http header rewrite rule configuration
> * Update the application gateway with the above configuration for rewriting http headers

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This tutorial requires that you run Azure PowerShell locally. You must have Az module version 1.0.0 or later installed. Run `Import-Module Az` and then`Get-Module Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps). After you verify the PowerShell version, run `Login-AzAccount` to create a connection with Azure.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## **Specify your http header rewrite rule configuration**

Configure the new objects required to rewrite the http headers:

- **RequestHeaderConfiguration**: this object is used to specify the request header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
- **ResponseHeaderConfiguration**: this object is used to specify the response header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
- **ActionSet**: this object contains the configurations of the request and response headers specified above.
- **RewriteRule**: this object contains all the *actionSets* specified above.
- **RewriteRuleSet**- this object contains all the *rewriteRules* and will need to be attached to a request routing rule - basic or path-based.

```azurepowershell
$requestHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-isThroughProxy" -HeaderValue "True"
$responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Strict-Transport-Security" -HeaderValue "max-age=31536000"
$actionSet = New-AzApplicationGatewayRewriteRuleActionSet -RequestHeaderConfiguration $requestHeaderConfiguration -ResponseHeaderConfiguration $responseHeaderConfiguration
$rewriteRule = New-AzApplicationGatewayRewriteRule -Name rewriteRule1 -ActionSet $actionSet
$rewriteRuleSet = New-AzApplicationGatewayRewriteRuleSet -Name rewriteRuleSet1 -RewriteRule $rewriteRule
```

## Retrieve configuration of your existing application gateway

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
```

## Retrieve configuration of your existing request routing rule

```azurepowershell
$reqRoutingRule = Get-AzApplicationGatewayRequestRoutingRule -Name Rule1 -ApplicationGateway $appgw
```

## Update the application gateway with the configuration for rewriting http headers

```azurepowershell
Add-AzApplicationGatewayRewriteRuleSet -ApplicationGateway $appgw -Name rewriteRuleSet1 -RewriteRule $rewriteRuleSet.RewriteRules
Set-AzApplicationGatewayRequestRoutingRule -ApplicationGateway $appgw -Name rule1 -RuleType $reqRoutingRule.RuleType -BackendHttpSettingsId $reqRoutingRule.BackendHttpSettings.Id -HttpListenerId $reqRoutingRule.HttpListener.Id -BackendAddressPoolId $reqRoutingRule.BackendAddressPool.Id -RewriteRuleSetId $rewriteRuleSet.Id
Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Delete a rewrite rule

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
Remove-AzApplicationGatewayRewriteRuleSet -Name "rewriteRuleSet1" -ApplicationGateway $appgw
$requestroutingrule= Get-AzApplicationGatewayRequestRoutingRule -Name "rule1" -ApplicationGateway $appgw
$requestroutingrule.RewriteRuleSet= $null
set-AzApplicationGateway -ApplicationGateway $appgw
```

## Next steps

> [!div class="nextstepaction"]
> [Create an application gateway with URL path-based routing rules](./tutorial-url-route-powershell.md)
