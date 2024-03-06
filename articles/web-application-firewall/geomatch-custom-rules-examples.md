---
title: Use Azure WAF geomatch custom rules to enhance network security
description: This article shows you how to use Microsoft Azure Web Application Firewall (WAF) geomatch customer rules to enhance network security.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.custom: devx-track-azurepowershell
ms.date: 02/13/2024
ms.author: victorh
ms.topic: how-to
---

# Use Azure WAF geomatch custom rules to enhance network security

Web application firewalls (WAFs) are an important tool that helps protect web applications from harmful attacks. They can filter, monitor, and stop web traffic using both preset and custom rules. You can make your own rule that the WAF checks for every request it gets. Custom rules have higher priority than the managed rules and are checked first.

One of the most powerful features of Azure Web Application Firewall is geomatch custom rules. These rules let you match web requests to the geographic location of where they come from. You might want to stop requests from certain places known for harmful activity, or you might want to allow requests from places important to your business. Geomatch custom rules can also help you follow data sovereignty and privacy laws by limiting access to your web applications based on the location of the people using them.

Use the priority parameter wisely when using geomatch custom rules to avoid unnecessary processing or conflicts. Azure WAF evaluates rules in the order determined by the priority parameter, a numerical value ranging from 1 to 100, with lower values indicating higher priority. The priority must be unique across all custom rules. Assign higher priority to critical or specific rules for your web application security and lower priority to less essential or general rules. This ensures WAF applies the most appropriate actions to your web traffic. For example, the scenario where you identify an explicit URI path is the most specific and should have a higher priority rule than other types of patterns. This protects a critical path on the application with the highest priority while allowing more generic traffic to be evaluated across other custom rules or managed rulesets.

To make the paragraph easier to understand for a technical audience using present tense and active voice, you can rewrite it as follows:

Always test your rules before applying them to production and regularly monitor their performance and impact. By following these best practices, you can enhance your web application security by using the power of geomatch custom rules.

This article introduces Azure WAF geomatch custom rules and shows you how to create and manage them using the Azure portal, Bicep and Azure PowerShell.

## Geomatch custom rule patterns

Geomatch custom rules enable you to meet diverse security goals, such as blocking requests from high-risk areas and permitting requests from trusted locations. They're particularly effective in mitigating distributed denial-of-service (DDoS) attacks, which seek to inundate your web application with a multitude of requests from various sources. With geomatch custom rules, you can promptly pinpoint and block regions generating the most DDoS traffic, while still granting access to legitimate users. In this article, you learn about various custom rule patterns that you can employ to optimize your Azure WAF using geomatch custom rules.

## Scenario 1 - Block traffic from all countries except "x"

Geomatch custom rules prove useful when you aim to block traffic from all countries, barring one. For instance, if your web application caters exclusively to users in the United States, you can formulate a geomatch custom rule that obstructs all requests not originating from the US. This strategy effectively minimizes your web application’s attack surface and deters unauthorized access from other regions. This specific technique employs a negating condition to facilitate this traffic pattern. For creating a geomatch custom rule that obstructs traffic from all countries except the US, refer to the following portal, Bicep, and PowerShell examples:

### Portal example - Application Gateway

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-application-gateway-1.png" alt-text="Screenshot showing the Application Gateway WAF add custom rule screen.":::

### Portal example - Front Door

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-front-door-1.png" alt-text="Screenshot showing the Front Door WAF add custom rule screen.":::

> [!NOTE]
> Notice on the Azure Front Door WAF, you use `SocketAddr` as the match variable and not `RemoteAddr`. The `RemoteAddr` variable is the original client IP address that's usually sent via the `X-Forwarded-For` request header. The `SocketAddr` variable is the source IP address the WAF sees.

### Bicep example - Application Gateway

```
properties: {
    customRules: [
      {
        name: 'GeoRule1'
        priority: 10
        ruleType: 'MatchRule'
        action: 'Block'
        matchConditions: [
          {
            matchVariables: [
              {
                variableName: 'RemoteAddr'
              }
            ]
            operator: 'GeoMatch'
            negationConditon: true
            matchValues: [
              'US'
            ]
            transforms: []
          }
        ]
        state: 'Enabled'
      }
```
### Bicep example - Front Door

```
properties: {
    customRules: {
      rules: [
        {
          name: 'GeoRule1'
          enabledState: 'Enabled'
          priority: 10
          ruleType: 'MatchRule'
          matchConditions: [
            {
              matchVariable: 'SocketAddr'
              operator: 'GeoMatch'
              negateCondition: true
              matchValue: [
                'US'
              ]
              transforms: []
            }
          ]
          action: 'Block'
        }
```

### Azure PowerShell example - Application Gateway

```azurepowershell
$RGname = "rg-waf "
$policyName = "waf-pol"
$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator GeoMatch -MatchValue "US" -NegationCondition $true
$rule = New-AzApplicationGatewayFirewallCustomRule -Name GeoRule1 -Priority 10 -RuleType MatchRule -MatchCondition $condition -Action Block
$policy = Get-AzApplicationGatewayFirewallPolicy -Name $policyName -ResourceGroupName $RGname
$policy.CustomRules.Add($rule)
Set-AzApplicationGatewayFirewallPolicy -InputObject $policy
```

### Azure PowerShell example - Front Door

```azurepowershell
$RGname = "rg-waf"
$policyName = "wafafdpol"
$matchCondition = New-AzFrontDoorWafMatchConditionObject -MatchVariable SocketAddr -OperatorProperty GeoMatch -MatchValue "US" -NegateCondition $true
$customRuleObject = New-AzFrontDoorWafCustomRuleObject -Name "GeoRule1" -RuleType MatchRule -MatchCondition $matchCondition -Action Block -Priority 10
$afdWAFPolicy= Get-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $RGname
Update-AzFrontDoorWafPolicy -InputObject $afdWAFPolicy -Customrule $customRuleObject
```
## Scenario 2 - Block traffic from all countries except "x" and "y" that target the URI "foo" or "bar"

Consider a scenario where you need to use geomatch custom rules to block traffic from all countries, except for two or more specific ones, targeting a specific URI. Suppose your web application has specific URI paths intended only for users in the US and Canada. In this case, you create a geomatch custom rule that blocks all requests not originating from these countries.

This pattern processes request payloads from the US and Canada through the managed rulesets, catching any malicious attacks, while blocking requests from all other countries. This approach ensures that only your target audience can access your web application, avoiding unwanted traffic from other regions.

To minimize potential false positives, include the country code **ZZ** in the list to capture IP addresses not yet mapped to a country in Azure’s dataset. This technique uses a negate condition for the Geolocation type and a non-negate condition for the URI match.

To create a geomatch custom rule that blocks traffic from all countries except the US and Canada to a specified URI, refer to the portal, Bicep, and Azure PowerShell examples provided.

### Portal example - Application Gateway

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-application-gateway-2.png" alt-text="Screenshot showing add custom rule for Application Gateway." lightbox="media/geomatch-custom-rules/add-custom-rule-application-gateway-2.png":::

### Portal example - Front Door

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-front-door-2.png" alt-text="Screenshot showing add custom rule for Front Door." lightbox="media/geomatch-custom-rules/add-custom-rule-front-door-2.png":::

### Bicep example - Application Gateway

```
properties: {
    customRules: [
      {
        name: 'GeoRule2'
        priority: 11
        ruleType: 'MatchRule'
        action: 'Block'
        matchConditions: [
          {
            matchVariables: [
              {
                variableName: 'RemoteAddr'
              }
            ]
            operator: 'GeoMatch'
            negationConditon: true
            matchValues: [
              'US'
              'CA'
            ]
            transforms: []
          }
          {
            matchVariables: [
              {
                variableName: 'RequestUri'
              }
            ]
            operator: 'Contains'
            negationConditon: false
            matchValues: [
              '/foo'
              '/bar'
            ]
            transforms: []
          }
        ]
        state: 'Enabled'
      }
```

### Bicep example - Front Door

```
properties: {
    customRules: {
      rules: [
        {
          name: 'GeoRule2'
          enabledState: 'Enabled'
          priority: 11
          ruleType: 'MatchRule'
          matchConditions: [
            {
              matchVariable: 'SocketAddr'
              operator: 'GeoMatch'
              negateCondition: true
              matchValue: [
                'US'
                'CA'
              ]
              transforms: []
            }
            {
              matchVariable: 'RequestUri'
              operator: 'Contains'
              negateCondition: false
              matchValue: [
                '/foo'
                '/bar'
              ]
              transforms: []
            }
          ]
          action: 'Block'
        }
```

### Azure PowerShell example - Application Gateway

```azurepowershell
$RGname = "rg-waf "
$policyName = "waf-pol"
$variable1a = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr
$condition1a = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable1a -Operator GeoMatch -MatchValue @(“US”, “CA”) -NegationCondition $true
$variable1b = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition1b = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable1b -Operator Contains -MatchValue @(“/foo”, “/bar”) -NegationCondition $false
$rule1 = New-AzApplicationGatewayFirewallCustomRule -Name GeoRule2 -Priority 11 -RuleType MatchRule -MatchCondition $condition1a, $condition1b -Action Block
$policy = Get-AzApplicationGatewayFirewallPolicy -Name $policyName -ResourceGroupName $RGname
$policy.CustomRules.Add($rule1)
Set-AzApplicationGatewayFirewallPolicy -InputObject $policy
```

### Azure PowerShell example - Front Door

```azurepowershell
$RGname = "rg-waf"
$policyName = "wafafdpol"
$matchCondition1a = New-AzFrontDoorWafMatchConditionObject -MatchVariable SocketAddr -OperatorProperty GeoMatch -MatchValue @(“US”, "CA") -NegateCondition $true
$matchCondition1b = New-AzFrontDoorWafMatchConditionObject -MatchVariable RequestUri -OperatorProperty Contains -MatchValue @(“/foo”, “/bar”) -NegateCondition $false
$customRuleObject1 = New-AzFrontDoorWafCustomRuleObject -Name "GeoRule2" -RuleType MatchRule -MatchCondition $matchCondition1a, $matchCondition1b -Action Block -Priority 11
$afdWAFPolicy= Get-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $RGname
Update-AzFrontDoorWafPolicy -InputObject $afdWAFPolicy -Customrule $customRuleObject1
```

## Scenario 3 - Block traffic specifically from country "x"

You can use geomatch custom rules to block traffic from specific countries. For instance, if your web application receives many malicious requests from country "x", create a geomatch custom rule to block all requests from that country. This protects your web application from potential attacks and reduces resource load. Apply this pattern to block multiple malicious or hostile countries. This technique requires a match condition for the traffic pattern. To block traffic from country "x", see the following portal, Bicep, and Azure PowerShell examples.

### Portal example - Application Gateway

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-application-gateway-3.png" alt-text="Screenshot showing the application gateway add custom rule screen.":::

### Portal example - Front Door

:::image type="content" source="media/geomatch-custom-rules/add-custom-rule-front-door-3.png" alt-text="Screenshot showing the front door add custom rule screen.":::

### Bicep example - Application Gateway

```
properties: {
    customRules: [
      {
        name: 'GeoRule3'
        priority: 12
        ruleType: 'MatchRule'
        action: 'Block'
        matchConditions: [
          {
            matchVariables: [
              {
                variableName: 'RemoteAddr'
              }
            ]
            operator: 'GeoMatch'
            negationConditon: false
            matchValues: [
              'US'
            ]
            transforms: []
          }
        ]
        state: 'Enabled'
      }
```

### Bicep example - Front Door

```
properties: {
    customRules: {
      rules: [
        {
          name: 'GeoRule3'
          enabledState: 'Enabled'
          priority: 12
          ruleType: 'MatchRule'
          matchConditions: [
            {
              matchVariable: 'SocketAddr'
              operator: 'GeoMatch'
              negateCondition: false
              matchValue: [
                'US'
              ]
              transforms: []
            }
          ]
          action: 'Block'
        }
```

### Azure PowerShell example - Application Gateway

```azurepowershell
$RGname = "rg-waf "
$policyName = "waf-pol"
$variable2 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RemoteAddr
$condition2 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable2 -Operator GeoMatch -MatchValue "US" -NegationCondition $false
$rule2 = New-AzApplicationGatewayFirewallCustomRule -Name GeoRule3 -Priority 12 -RuleType MatchRule -MatchCondition $condition2 -Action Block
$policy = Get-AzApplicationGatewayFirewallPolicy -Name $policyName -ResourceGroupName $RGname
$policy.CustomRules.Add($rule2)
Set-AzApplicationGatewayFirewallPolicy -InputObject $policy
```

### Azure PowerShell example - Front Door

```azurepowershell
$RGname = "rg-waf"
$policyName = "wafafdpol"
$matchCondition2 = New-AzFrontDoorWafMatchConditionObject -MatchVariable SocketAddr -OperatorProperty GeoMatch -MatchValue "US" -NegateCondition $false
$customRuleObject2 = New-AzFrontDoorWafCustomRuleObject -Name "GeoRule3" -RuleType MatchRule -MatchCondition $matchCondition2 -Action Block -Priority 12
$afdWAFPolicy= Get-AzFrontDoorWafPolicy -Name $policyName -ResourceGroupName $RGname
Update-AzFrontDoorWafPolicy -InputObject $afdWAFPolicy -Customrule $customRuleObject2
```

## Geomatch custom rule anti-patterns

Avoid anti-patterns when using geomatch custom rules, such as setting the custom rule action to `allow` instead of `block`. This can have unintended consequences, like allowing traffic to bypass the WAF and potentially exposing your web application to other threats. 

Instead of using an `allow` action, use a `block` action with a negate condition, as shown in previous patterns. This ensures only traffic from desired countries is allowed and the WAF blocks all other traffic.

### Scenario 4 - allow traffic from country "x"

Avoid setting the geomatch custom rule to allow traffic from a specific country. For example, if you want to allow traffic from the United States because of a large customer base, creating a custom rule with the action `allow` and the value `United States` might seem like the solution. However, this rule allows all traffic from the United States, regardless of whether it has a malicious payload or not, as the `allow` action bypasses further rule processing of managed rulesets. Additionally, the WAF still processes traffic from all other countries, consuming resources. This exposes your web application to malicious requests from the United States that the WAF would otherwise block.


### Scenario 5 - Allow traffic from all counties except "x"

Avoid setting the rule action to `allow` and specifying a list of countries to exclude when using geomatch custom rules. For example, if you want to allow traffic from all countries except the United States, where you suspect malicious activity, this approach can have unintended consequences. It might allow traffic from unverified or unsafe countries or countries with low or no security standards, exposing your web application to potential vulnerabilities or attacks. Using the `allow` action for all countries except the US indicates to the WAF to stop processing request payloads against managed rulesets. All rule evaluation ceases once the custom rule with `allow` is processed, exposing the application to unwanted malicious attacks.

Instead, use a more restrictive and specific rule action, such as block, and specify a list of countries to allow with a negate condition. This ensures only traffic from trusted and verified sources can access your web application while blocking any suspicious or unwanted traffic.


## Next steps

- [Geomatch custom rules](ag/geomatch-custom-rules.md)
- [Create and use Web Application Firewall v2 custom rules on Application Gateway](ag/create-custom-waf-rules.md)
