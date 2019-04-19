---
title: Rewrite HTTP headers in Azure Application Gateway
description: This article provides information on how to rewrite HTTP headers in Azure Application Gateway using Azure PowerShell
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 04/12/2019
ms.author: absha
---
# Rewrite HTTP request and response headers with Azure Application Gateway - Azure PowerShell

This article shows you how to use Azure PowerShell to configure an [Application Gateway v2 SKU](<https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant>)  to rewrite the HTTP headers in the requests and responses.

> [!IMPORTANT]
> The autoscaling and zone-redundant application gateway SKU is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- This tutorial requires that you run Azure PowerShell locally. You must have Az module version 1.0.0 or later installed. Run `Import-Module Az` and then`Get-Module Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps). After you verify the PowerShell version, run `Login-AzAccount` to create a connection with Azure.
- You need to have an Application Gateway v2 SKU  since the header rewrite capability is not supported for the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](https://docs.microsoft.com/azure/application-gateway/tutorial-autoscale-ps>) before you begin.

## What is required to rewrite a header

To configure HTTP header rewrite, you will need to:

1. Create the new objects required to rewrite the http headers:

   - **RequestHeaderConfiguration**: this object is used to specify the request header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.

   - **ResponseHeaderConfiguration**: this object is used to specify the response header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.

   - **ActionSet**: this object contains the configurations of the request and response headers specified above.

   - **Condition**: It is an optional configuration. if a rewrite condition is added, it will evaluate the content of the HTTP(S) requests and responses. The decision to execute the rewrite action associated with the rewrite condition will be based whether the HTTP(S) request or response matched with the rewrite condition. 

     If more than one conditions are associated with an action, then the action will be executed only when all the conditions are met, i.e., a logical AND operation will be performed.

   - **RewriteRule**: contains multiple rewrite action - rewrite condition combinations.

   - **RuleSequence**: This is an optional configuration. It helps determine the order in which the different rewrite rules get executed. This is helpful when there are multiple rewrite rules in a rewrite set. The rewrite rule with lesser rule sequence value gets executed first. If you provide the same rule sequence to two rewrite rules then the order of execution will be non-deterministic.

     If you don't specify the RuleSequence explicitly, a default value of 100 will be set.

   - **RewriteRuleSet**: this object contains multiple rewrite rules which will be associated to a request routing rule.

2. You will be required to attach the rewriteRuleSet with a routing rule. This is because the rewrite configuration is attached to the source listener via the routing rule. When using a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When a path-based routing rule is used, the header rewrite configuration is defined on the URL path map. So, it only applies to the specific path area of a site.

You can create multiple http header rewrite sets and each rewrite set can be applied to multiple listeners. However, you can apply only one rewrite set to a specific listener.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## **Specify your http header rewrite rule configuration**

In this example, we will modify the redirection URL by rewriting the location header in the http response whenever the location header contains a reference to "azurewebsites.net". To do this, we will add a condition to evaluate whether the location header in the response contains azurewebsites.net by using the pattern `(https?):\/\/.*azurewebsites\.net(.*)$`. We will use `{http_resp_Location_1}://contoso.com{http_resp_Location_2}` as the header value. This will replace *azurewebsites.net* with *contoso.com* in the location header.

```azurepowershell
$responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Location" -HeaderValue "{http_resp_Location_1}://contoso.com{http_resp_Location_2}"
$actionSet = New-AzApplicationGatewayRewriteRuleActionSet -RequestHeaderConfiguration $requestHeaderConfiguration -ResponseHeaderConfiguration $responseHeaderConfiguration
$condition = New-AzApplicationGatewayRewriteRuleCondition -Variable "http_resp_Location" -Pattern "(https?):\/\/.*azurewebsites\.net(.*)$" -IgnoreCase
$rewriteRule = New-AzApplicationGatewayRewriteRule -Name LocationHeader -ActionSet $actionSet
$rewriteRuleSet = New-AzApplicationGatewayRewriteRuleSet -Name LocationHeaderRewrite -RewriteRule $rewriteRule
```

## Retrieve configuration of your existing application gateway

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
```

## Retrieve configuration of your existing request routing rule

```azurepowershell
$reqRoutingRule = Get-AzApplicationGatewayRequestRoutingRule -Name rule1 -ApplicationGateway $appgw
```

## Update the application gateway with the configuration for rewriting http headers

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

To learn more about the configuration required to accomplish some of the common use cases, see [common header rewrite scenarios](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers).