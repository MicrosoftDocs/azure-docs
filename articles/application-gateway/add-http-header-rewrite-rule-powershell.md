---
title: Rewrite HTTP headers in Azure Application Gateway
description: This article provides information on how to rewrite HTTP headers in Azure Application Gateway by using Azure PowerShell
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 07/09/2025
ms.author: mbender 
ms.custom: devx-track-azurepowershell
# Customer intent: "As a cloud administrator, I want to configure HTTP header rewrites using Azure PowerShell, so that I can efficiently modify headers in requests and responses for my Application Gateway."
---
# Rewrite HTTP request and response headers with Azure Application Gateway - Azure PowerShell

This article describes how to use Azure PowerShell to configure an [Application Gateway v2 SKU](./application-gateway-autoscaling-zone-redundant.md) instance to rewrite HTTP headers in requests and responses. Header rewriting enables you to add, remove, or update HTTP headers while the request and response packets move between the client and backend pools.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

Before you begin, ensure you have the following requirements:

- **Azure PowerShell**: You need Azure PowerShell installed locally or access to Azure Cloud Shell. The Azure PowerShell Az module version 1.0.0 or later is required. To check your version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). 
- **Azure connection**: After verifying the PowerShell version, run `Connect-AzAccount` to authenticate with Azure.
- **Application Gateway v2**: You need an existing Application Gateway v2 SKU instance. Header rewriting is only supported in the v2 SKU (Standard_v2 or WAF_v2). If you don't have one, create an [Application Gateway v2 SKU](./tutorial-autoscale-ps.md) instance before you begin.
- **Proper permissions**: Ensure you have Contributor or Owner permissions on the Application Gateway resource.

> [!IMPORTANT]
> Header rewrite functionality is only available with Application Gateway v2 SKU. The v1 SKU doesn't support this feature.

## Understanding HTTP header rewrite components

To configure HTTP header rewrite, you need to understand and create the following components in a specific order:

### Core components

1. **RequestHeaderConfiguration**: Specifies the request header fields you want to rewrite and their new values. Use this component to modify headers in client requests before they reach the backend servers.

2. **ResponseHeaderConfiguration**: Specifies the response header fields you want to rewrite and their new values. Use this component to modify headers in server responses before they reach the client.

3. **ActionSet**: Contains the configurations of the request and response headers specified. Each action set represents a collection of header modifications to perform.
   
   - **Condition**: An optional configuration. Rewrite conditions evaluate the content of HTTP(S) requests and responses. The rewrite action occurs if the HTTP(S) request or response matches the rewrite condition.

   > [!NOTE]
   > Multiple conditions associated with an action use logical AND operation - all conditions must be met for the action to execute.

5. **RewriteRule**: Combines multiple rewrite actions and rewrite conditions. Each rule defines when and how to modify headers.

6. **RuleSequence** (Optional): Determines the execution order when you have multiple rewrite rules in a rewrite set. Rules with lower sequence values execute first. If you don't specify a value, the default is 100.

   > [!WARNING]
   > If you assign the same sequence value to multiple rules, the execution order becomes non-deterministic.

7. **RewriteRuleSet**: Contains multiple rewritten rules that are associated with a request routing rule.

### Application scope

The rewrite configuration scope depends on the routing rule type:

- **Basic routing rule**: Header rewrite configuration applies globally to all requests for the associated listener
- **Path-based routing rule**: Header rewrite configuration applies only to requests matching specific URL path patterns defined in the URL path map

> [!IMPORTANT]
> You can create multiple HTTP header rewrite sets and apply each set to multiple listeners, but only one rewrite set can be applied to a specific listener.

## Authenticate with Azure

Before configuring header rewrite rules, authenticate with Azure and select your subscription:

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Specify the HTTP header rewrite rule configuration

In this example, we modify a redirection URL by rewriting the location header in the HTTP response whenever the location header contains a reference to azurewebsite.net. To do this modification, we add a condition to evaluate whether the location header in the response contains azurewebsite.net. We use the pattern `(https?)://.*azurewebsite.net(.*)$`. And we use `{http_resp_Location_1}://contoso.com{http_resp_Location_2}` as the header value. This value replaces *azurewebsite.net* with *contoso.com* in the location header.

```azurepowershell
$responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Location" -HeaderValue "{http_resp_Location_1}://contoso.com{http_resp_Location_2}"
$actionSet = New-AzApplicationGatewayRewriteRuleActionSet -ResponseHeaderConfiguration $responseHeaderConfiguration
$condition = New-AzApplicationGatewayRewriteRuleCondition -Variable "http_resp_Location" -Pattern "(https?):\/\/.*azurewebsite\.net(.*)$" -IgnoreCase
$rewriteRule = New-AzApplicationGatewayRewriteRule -Name LocationHeader -ActionSet $actionSet -Condition $condition
$rewriteRuleSet = New-AzApplicationGatewayRewriteRuleSet -Name LocationHeaderRewrite -RewriteRule $rewriteRule
```

## Retrieve the configuration of your application gateway

```azurepowershell
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"
```

## Retrieve request routing rule configuration

Get the specific request routing rule where you want to apply the header rewrite configuration:

```azurepowershell
$reqRoutingRule = Get-AzApplicationGatewayRequestRoutingRule -Name rule1 -ApplicationGateway $appgw
```

## Update the application gateway with the configuration for rewriting HTTP headers

In this example, the rewrite set would be associated instantly against a basic routing rule. In a path based routing rule, the association wouldn't be enabled by default. The rewrite set can be enabled either via -- checking the paths on which it needs to be applied via portal or by providing a URL path map config specifying the RewriteRuleSet against each path option.  

```azurepowershell
Add-AzApplicationGatewayRewriteRuleSet -ApplicationGateway $appgw -Name $rewriteRuleSet.Name  -RewriteRule $rewriteRuleSet.RewriteRules
Set-AzApplicationGatewayRequestRoutingRule -ApplicationGateway $appgw -Name $reqRoutingRule.Name -RuleType $reqRoutingRule.RuleType -BackendHttpSettingsId $reqRoutingRule.BackendHttpSettings.Id -HttpListenerId $reqRoutingRule.HttpListener.Id -BackendAddressPoolId $reqRoutingRule.BackendAddressPool.Id -RewriteRuleSetId $rewriteRuleSet.Id
Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Remove a rewrite rule (Optional)

If you need to remove a rewrite rule set from your Application Gateway, use the following steps:

```azurepowershell-interactive
# Retrieve the current Application Gateway configuration
$appgw = Get-AzApplicationGateway -Name "AutoscalingAppGw" -ResourceGroupName "<rg name>"

# Remove the rewrite rule set association from the routing rule first
$requestRoutingRule = Get-AzApplicationGatewayRequestRoutingRule -Name "rule1" -ApplicationGateway $appgw

# Clear the rewrite rule set reference
$requestRoutingRule.RewriteRuleSet = $null

# Remove the rewrite rule set from the Application Gateway
Remove-AzApplicationGatewayRewriteRuleSet -Name "LocationHeaderRewrite" -ApplicationGateway $appgw

# Apply the changes
Set-AzApplicationGateway -ApplicationGateway $appgw

Write-Output "Rewrite rule set removed successfully"
```

## Next steps

Now that you learned how to configure HTTP header rewrite rules, explore these related articles:

- **Common scenarios**: Learn about [common header rewrite scenarios](./rewrite-http-headers-url.md) including security headers, custom routing, and backend server integration patterns.

- **Monitoring and troubleshooting**: Set up [Application Gateway diagnostics](./application-gateway-diagnostics.md) to monitor header rewrite operations and troubleshoot issues.
