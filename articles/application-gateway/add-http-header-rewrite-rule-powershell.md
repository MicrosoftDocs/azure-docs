---
title: Rewrite HTTP headers in Azure Application Gateway
description: This article provides information on how to rewrite HTTP headers in Azure Application Gateway by using Azure PowerShell
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 04/12/2019
ms.author: absha
---
# Rewrite HTTP request and response headers with Azure Application Gateway - Azure PowerShell

This article describes how to use Azure PowerShell to configure an [Application Gateway v2 SKU](<https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant>) instance to rewrite the HTTP headers in requests and responses.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

- You need to run Azure PowerShell locally to complete the steps in this article. You also need to have Az module version 1.0.0 or later installed. Run `Import-Module Az` and then `Get-Module Az` to determine the version that you have installed. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps). After you verify the PowerShell version, run `Login-AzAccount` to create a connection with Azure.
- You need to have an Application Gateway v2 SKU instance. Rewriting headers isn't supported in the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](https://docs.microsoft.com/azure/application-gateway/tutorial-autoscale-ps) instance before you begin.

## Create required objects

To configure HTTP header rewrite, you need to complete these steps.

1. Create the objects that are required for HTTP header rewrite:

   - **RequestHeaderConfiguration**: Used to specify the request header fields that you intend to rewrite and the new value for the headers.

   - **ResponseHeaderConfiguration**: Used to specify the response header fields that you intend to rewrite and the new value for the headers.

   - **ActionSet**: Contains the configurations of the request and response headers specified previously.

   - **Condition**: An optional configuration. Rewrite conditions evaluate the content of HTTP(S) requests and responses. The rewrite action will occur if the HTTP(S) request or response matches the rewrite condition.

     If you associate more than one condition with an action, the action occurs only when all the conditions are met. In other words, the operation is a  logical AND operation.

   - **RewriteRule**: Contains multiple rewrite action / rewrite condition combinations.

   - **RuleSequence**: An optional configuration that helps determine the order in which rewrite rules execute. This configuration is helpful when you have multiple rewrite rules in a rewrite set. A rewrite rule that has a lower rule sequence value runs first. If you assign the same rule sequence value to two rewrite rules, the order of execution is non-deterministic.

     If you don't specify the RuleSequence explicitly, a default value of 100 is set.

   - **RewriteRuleSet**: Contains multiple rewrite rules that will be associated to a request routing rule.

2. Attach the RewriteRuleSet to a routing rule. The rewrite configuration is attached to the source listener via the routing rule. When you use a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When you use a path-based routing rule, the header rewrite configuration is defined on the URL path map. In that case, it applies only to the specific path area of a site.

You can create multiple HTTP header rewrite sets and apply each rewrite set to multiple listeners. But you can apply only one rewrite set to a specific listener.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Specify the HTTP header rewrite rule configuration

In this example, we'll modify a redirection URL by rewriting the location header in the HTTP response whenever the location header contains a reference to azurewebsites.net. To do this, we'll add a condition to evaluate whether the location header in the response contains azurewebsites.net. We'll use the pattern `(https?):\/\/.*azurewebsites\.net(.*)$`. And we'll use `{http_resp_Location_1}://contoso.com{http_resp_Location_2}` as the header value. This value will replace *azurewebsites.net* with *contoso.com* in the location header.

```azurepowershell
$responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Location" -HeaderValue "{http_resp_Location_1}://contoso.com{http_resp_Location_2}"
$actionSet = New-AzApplicationGatewayRewriteRuleActionSet -RequestHeaderConfiguration $requestHeaderConfiguration -ResponseHeaderConfiguration $responseHeaderConfiguration
$condition = New-AzApplicationGatewayRewriteRuleCondition -Variable "http_resp_Location" -Pattern "(https?):\/\/.*azurewebsites\.net(.*)$" -IgnoreCase
$rewriteRule = New-AzApplicationGatewayRewriteRule -Name LocationHeader -ActionSet $actionSet
$rewriteRuleSet = New-AzApplicationGatewayRewriteRuleSet -Name LocationHeaderRewrite -RewriteRule $rewriteRule
```

## Retrieve the configuration of your application gateway

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
```

## Retrieve the configuration of your request routing rule

```azurepowershell
$reqRoutingRule = Get-AzApplicationGatewayRequestRoutingRule -Name rule1 -ApplicationGateway $appgw
```

## Update the application gateway with the configuration for rewriting HTTP headers

```azurepowershell
Add-AzApplicationGatewayRewriteRuleSet -ApplicationGateway $appgw -Name LocationHeaderRewrite -RewriteRule $rewriteRuleSet.RewriteRules
Set-AzApplicationGatewayRequestRoutingRule -ApplicationGateway $appgw -Name rule1 -RuleType $reqRoutingRule.RuleType -BackendHttpSettingsId $reqRoutingRule.BackendHttpSettings.Id -HttpListenerId $reqRoutingRule.HttpListener.Id -BackendAddressPoolId $reqRoutingRule.BackendAddressPool.Id -RewriteRuleSetId $rewriteRuleSet.Id
Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Delete a rewrite rule

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
Remove-AzApplicationGatewayRewriteRuleSet -Name "LocationHeaderRewrite" -ApplicationGateway $appgw
$requestroutingrule= Get-AzApplicationGatewayRequestRoutingRule -Name "rule1" -ApplicationGateway $appgw
$requestroutingrule.RewriteRuleSet= $null
set-AzApplicationGateway -ApplicationGateway $appgw
```

## Next steps

To learn more about how to set up some common use cases, see [common header rewrite scenarios](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers).