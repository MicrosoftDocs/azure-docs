---
title: Create rate limiting custom rules for Application Gateway WAF v2
titleSuffix: Azure Web Application Firewall
description: Learn how to configure rate limit custom rules for Application Gateway WAF v2.
services: web-application-firewall
author: joeolerich
ms.service: web-application-firewall
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 11/01/2023
ms.author: victorh
ms.topic: how-to 
---

# Create rate limiting custom rules for Application Gateway WAF v2

Rate limiting enables you to detect and block abnormally high levels of traffic destined for your application. Rate Limiting works by counting all traffic that matches the configured Rate Limit rule and performing the configured action for traffic matching that rule which exceeds the configured threshold. For more information, see [Rate limiting overview](rate-limiting-overview.md).

## Configure Rate Limit Custom Rules

Use the following information to configure Rate Limit Rules for Application Gateway WAFv2. 

**Scenario One** -  Create rule to rate-limit traffic by Client IP that exceed the configured threshold, matching all traffic. 

#### [Portal](#tab/browser)

1. Open an existing Application Gateway WAF Policy 
1. Select Custom Rules 
1. Add Custom Rule 
1. Add Name for the Custom Rule 
1. Select the Rate limit Rule Type radio button 
1. Enter a Priority for the rule 
1. Choose 1 minute for Rate limit duration 
1. Enter 200 for Rate limit threshold (requests) 
1. Select Client address for Group rate limit traffic by
1. Under Conditions, choose IP address for Match Type
1. For Operation, select the Does not contain radio button
1. For match condition, under IP address or range, enter 255.255.255.255/32
1. Leave action setting to Deny traffic  
1. Select Add to add the custom rule to the policy 
1. Select Save to save the configuration and make the custom rule active for the WAF policy. 

#### [PowerShell](#tab/powershell)

```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr 
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator IPMatch -MatchValue 255.255.255.255/32 -NegationCondition $True      
$groupByVariable = New-AzApplicationGatewayFirewallCustomRuleGroupByVariable -VariableName ClientAddr      
$groupByUserSession = New-AzApplicationGatewayFirewallCustomRuleGroupByUserSession -GroupByVariable $groupByVariable
$ratelimitrule = New-AzApplicationGatewayFirewallCustomRule -Name ClientIPRateLimitRule -Priority 90 -RateLimitDuration OneMin -RateLimitThreshold 100 -RuleType RateLimitRule -MatchCondition $condition -GroupByUserSession $groupByUserSession -Action Block -State Enabled 
```
#### [CLI](#tab/cli)
```azurecli
az network application-gateway waf-policy custom-rule create --policy-name ExamplePolicy --resource-group ExampleRG --action Block --name ClientIPRateLimitRule --priority 90 --rule-type RateLimitRule --rate-limit-threshold 100 --group-by-user-session '[{'"groupByVariables"':[{'"variableName"':'"ClientAddr"'}]}]'
az network application-gateway waf-policy custom-rule match-condition add --match-variables RemoteAddr --operator IPMatch --policy-name ExamplePolicy --name ClientIPRateLimitRule --resource-group ExampleRG --value 255.255.255.255/32 --negate true
```
* * *

**Scenario Two** - Create Rate Limit Custom Rule to match all traffic except for traffic originating from the United States.  Traffic will be grouped, counted and rate limited based on the GeoLocation of the Client Source IP address 

#### [Portal](#tab/browser)

1. Open an existing Application Gateway WAF Policy 
1. Select Custom Rules 
1. Add Custom Rule 
1. Add Name for the Custom Rule 
1. Select the Rate limit Rule Type radio button 
1. Enter a Priority for the rule 
1. Choose 1 minute for Rate limit duration 
1. Enter 500 for Rate limit threshold (requests) 
1. Select Geo location for Group rate limit traffic by 
1. Under Conditions, choose Geo location for Match Type 
1. In the Match variables section, select RemoteAddr for Match variable 
1. Select the Is not radio button for operation 
1. Select United States for Country/Region 
1. Leave action setting to Deny traffic  
1. Select Add to add the custom rule to the policy 
1. Select Save to save the configuration and make the custom rule active for the WAF policy. 

#### [PowerShell](#tab/powershell)
```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr 
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator GeoMatch -MatchValue "US" -NegationCondition $True
$groupByVariable = New-AzApplicationGatewayFirewallCustomRuleGroupByVariablde -VariableName GeoLocation 
$groupByUserSession = New-AzApplicationGatewayFirewallCustomRuleGroupByUserSession -GroupByVariable $groupByVariable 
$ratelimitrule = New-AzApplicationGatewayFirewallCustomRule -Name GeoRateLimitRule -Priority 95 -RateLimitDuration OneMin -RateLimitThreshold 500 -RuleType RateLimitRule -MatchCondition $condition -GroupByUserSession $groupByUserSession -Action Block -State Enabled  
```
#### [CLI](#tab/cli)
```azurecli
az network application-gateway waf-policy custom-rule create --policy-name ExamplePolicy --resource-group ExampleRG --action Block --name GeoRateLimitRule --priority 95 --rule-type RateLimitRule --rate-limit-threshold 500 --group-by-user-session '[{'"groupByVariables"':[{'"variableName"':'"GeoLocation"'}]}]'
az network application-gateway waf-policy custom-rule match-condition add --match-variables RemoteAddr --operator GeoMatch --policy-name ExamplePolicy --name GeoRateLimitRule --resource-group ExampleRG --value US --negate true
```
* * *

**Scenario Three** - Create Rate Limit Custom Rule matching all traffic for the login page, and using the GroupBy None variable.  This will group and count all traffic which matches the rule as one, and apply the action across all traffic matching the rule (/login).

#### [Portal](#tab/browser)

1. Open an existing Application Gateway WAF Policy 
1. Select Custom Rules 
1. Add Custom Rule 
1. Add Name for the Custom Rule 
1. Select the Rate limit Rule Type radio button 
1. Enter a Priority for the rule 
1. Choose 1 minute for Rate limit duration 
1. Enter 100 for Rate limit threshold (requests) 
1. Select None for Group rate limit traffic by 
1. Under Conditions, choose String for Match Type 
1. In the Match variables section, select RequestUri for Match variable 
1. Select the Is not radio button for operation 
1. For Operator select contains 
1. Enter Login page path for match Value.  In this example we use /login 
1. Leave action setting to Deny traffic  
1. Select Add to add the custom rule to the policy 
1. Select Save to save the configuration and make the custom rule active for the WAF policy. 

#### [PowerShell](#tab/powershell)
```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri  
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator Contains -MatchValue "/login" -NegationCondition $True  
$groupByVariable = New-AzApplicationGatewayFirewallCustomRuleGroupByVariable -VariableName None       
$groupByUserSession = New-AzApplicationGatewayFirewallCustomRuleGroupByUserSession -GroupByVariable $groupByVariable 
$ratelimitrule = New-AzApplicationGatewayFirewallCustomRule -Name LoginRateLimitRule -Priority 99 -RateLimitDuration OneMin -RateLimitThreshold 100 -RuleType RateLimitRule -MatchCondition $condition -GroupByUserSession $groupByUserSession -Action Block -State Enabled 
```
#### [CLI](#tab/cli)
```azurecli
az network application-gateway waf-policy custom-rule create --policy-name ExamplePolicy --resource-group ExampleRG --action Block --name LoginRateLimitRule --priority 99 --rule-type RateLimitRule --rate-limit-threshold 100 --group-by-user-session '[{'"groupByVariables"':[{'"variableName"':'"None"'}]}]'
az network application-gateway waf-policy custom-rule match-condition add --match-variables RequestUri --operator Contains --policy-name ExamplePolicy --name LoginRateLimitRule --resource-group ExampleRG --value '/login'
```
* * *

## Next steps

[Customize web application firewall rules](application-gateway-customize-waf-rules-portal.md)
