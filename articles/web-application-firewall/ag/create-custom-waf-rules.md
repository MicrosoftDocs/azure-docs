---
title: Create and use v2 custom rules
titleSuffix: Azure Web Application Firewall
description: This article provides information on how to create Web Application Firewall (WAF) v2 custom rules in Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 04/06/2023
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Create and use Web Application Firewall v2 custom rules on Application Gateway

The Web Application Firewall (WAF) v2 on Azure Application Gateway provides protection for web applications. This protection is provided by the Open Web Application Security Project (OWASP) Core Rule Set (CRS). In some cases, you may need to create your own custom rules to meet your specific needs. For more information about WAF custom rules, see [Custom web application firewall rules overview](custom-waf-rules-overview.md).

This article shows you some example custom rules that you can create and use with your v2 WAF. To learn how to deploy a WAF with a custom rule using Azure PowerShell, see [Configure Web Application Firewall custom rules using Azure PowerShell](configure-waf-custom-rules.md).

The JSON snippets shown in this article are derived from a [ApplicationGatewayWebApplicationFirewallPolicies](/azure/templates/microsoft.network/applicationgatewaywebapplicationfirewallpolicies) resource.

>[!NOTE]
> If your application gateway is not using the WAF tier, the option to upgrade the application gateway to the WAF tier appears in the right pane.

![Enable WAF][fig1]

## Example 1

You know there's a bot named *evilbot* that you want to block from crawling your website. In this case, you block on the User-Agent *evilbot* in the request headers.

Logic: p

```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector User-Agent

$condition = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable `
   -Operator Contains `
   -MatchValue "evilbot" `
   -Transform Lowercase `
   -NegationCondition $False

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name blockEvilBot `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

And here's the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "blockEvilBot",
      "priority": 2,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Contains",
          "negationConditon": false,
          "matchValues": [
            "evilbot"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

To see a WAF deployed using this custom rule, see [Configure a Web Application Firewall custom rule using Azure PowerShell](configure-waf-custom-rules.md).

### Example 1a

You can accomplish the same thing using a regular expression:

```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector User-Agent

$condition = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable `
   -Operator Regex `
   -MatchValue "evilbot" `
   -Transform Lowercase `
   -NegationCondition $False

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name blockEvilBot `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

And the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "blockEvilBot",
      "priority": 2,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Regex",
          "negationConditon": false,
          "matchValues": [
            "evilbot"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

## Example 2

You want to allow traffic only from the United States using the GeoMatch operator and still have the managed rules apply:

```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RemoteAddr `

$condition = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable `
   -Operator GeoMatch `
   -MatchValue "US" `
   -Transform Lowercase `
   -NegationCondition $True

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name "allowUS" `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

And the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "allowUS",
      "priority": 2,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "GeoMatch",
          "negationConditon": true,
          "matchValues": [
            "US"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

## Example 3

You want to block all requests from IP addresses in the range 198.168.5.0/24.

In this example, you block all traffic that comes from an IP addresses range. The name of the rule is *myrule1* and the priority is set to 10.

Logic: p

```azurepowershell
$variable1 = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RemoteAddr

$condition1 = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable1 `
   -Operator IPMatch `
   -MatchValue "192.168.5.0/24" `
   -NegationCondition $False

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name myrule1 `
   -Priority 10 `
   -RuleType MatchRule `
   -MatchCondition $condition1 `
   -Action Block `
   -State Enabled
```

Here's the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "myrule1",
      "priority": 10,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "IPMatch",
          "negationConditon": false,
          "matchValues": [
            "192.168.5.0/24"
          ],
          "transforms": []
        }
      ]
    }
  ]
}
```

Corresponding CRS rule:
  `SecRule REMOTE_ADDR "@ipMatch 192.168.5.0/24" "id:7001,deny"`

## Example 4

For this example, you want to block User-Agent *evilbot*, and traffic in the range 192.168.5.0/24. To accomplish this action, you can create two separate match conditions, and put them both in the same rule. This configuration ensures that if both *evilbot* in the User-Agent header **and** IP addresses from the range 192.168.5.0/24 are matched, then the request is blocked.

Logic: p **and** q

```azurepowershell
$variable1 = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RemoteAddr

 $variable2 = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector User-Agent

$condition1 = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable1 `
   -Operator IPMatch `
   -MatchValue "192.168.5.0/24" `
   -NegationCondition $False

$condition2 = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable2 `
   -Operator Contains `
   -MatchValue "evilbot" `
   -Transform Lowercase `
   -NegationCondition $False

 $rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name myrule `
   -Priority 10 `
   -RuleType MatchRule `
   -MatchCondition $condition1, $condition2 `
   -Action Block `
   -State Enabled
```

Here's the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "myrule",
      "priority": 10,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "IPMatch",
          "negationConditon": false,
          "matchValues": [
            "192.168.5.0/24"
          ],
          "transforms": []
        },
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Contains",
          "negationConditon": false,
          "matchValues": [
            "evilbot"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

## Example 5

For this example, you want to block if the request is either outside of the IP address range *192.168.5.0/24*, or the user agent string isn't *chrome* (meaning the user isn’t using the Chrome browser). Since this logic uses **or**, the two conditions are in separate rules as seen in the following example. *myrule1* and *myrule2* both need to match to block the traffic.

Logic: **not** (p **and** q) = **not** p **or not** q.

```azurepowershell
$variable1 = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RemoteAddr

$variable2 = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector User-Agent

$condition1 = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable1 `
   -Operator IPMatch `
   -MatchValue "192.168.5.0/24" `
   -NegationCondition $True

$condition2 = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable2 `
   -Operator Contains `
   -MatchValue "chrome" `
   -Transform Lowercase `
   -NegationCondition $True

$rule1 = New-AzApplicationGatewayFirewallCustomRule `
   -Name myrule1 `
   -Priority 10 `
   -RuleType MatchRule `
   -MatchCondition $condition1 `
   -Action Block `
   -State Enabled

$rule2 = New-AzApplicationGatewayFirewallCustomRule `
   -Name myrule2 `
   -Priority 20 `
   -RuleType MatchRule `
   -MatchCondition $condition2 `
   -Action Block `
   -State Enabled
```

And the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "myrule1",
      "priority": 10,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RemoteAddr"
            }
          ],
          "operator": "IPMatch",
          "negationConditon": true,
          "matchValues": [
            "192.168.5.0/24"
          ],
          "transforms": []
        }
      ]
    },
    {
      "name": "myrule2",
      "priority": 20,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Contains",
          "negationConditon": true,
          "matchValues": [
            "chrome"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

## Example 6

You want to only allow requests from specific known user agents.

Because the logic used here is **or**, and all the values are in the *User-Agent* header, all of the *MatchValues* can be in a comma-separated list.

Logic: p **or** q **or** r

```azurepowershell
$variable = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector User-Agent
$condition = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable `
   -Operator Equal `
   -MatchValue @('user1', 'user2') `
   -NegationCondition $True

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name BlockUnknownUserAgents `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

Corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "BlockUnknownUserAgents",
      "priority": 2,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "User-Agent"
            }
          ],
          "operator": "Equal",
          "negationConditon": true,
          "matchValues": [
            "user1",
            "user2"
          ],
          "transforms": []
        }
      ]
    }
  ]
}
```

## Example 7

It isn't uncommon to see Azure Front Door deployed in front of Application Gateway. In order to make sure the traffic received by Application Gateway comes from the Front Door deployment, the best practice is to check if the `X-Azure-FDID` header contains the expected unique value.  For more information on securing access to your application using Azure Front Door, see [How to lock down the access to my backend to only Azure Front Door](../../frontdoor/front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-)

Logic: **not** p

```azurepowershell
$expectedFDID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$variable = New-AzApplicationGatewayFirewallMatchVariable `
   -VariableName RequestHeaders `
   -Selector X-Azure-FDID

$condition = New-AzApplicationGatewayFirewallCondition `
   -MatchVariable $variable `
   -Operator Equal `
   -MatchValue $expectedFDID `
   -Transform Lowercase `
   -NegationCondition $True

$rule = New-AzApplicationGatewayFirewallCustomRule `
   -Name blockNonAFDTraffic `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

And here's the corresponding JSON:

```json
{
  "customRules": [
    {
      "name": "blockNonAFDTraffic",
      "priority": 2,
      "ruleType": "MatchRule",
      "action": "Block",
      "state": "Enabled",
      "matchConditions": [
        {
          "matchVariables": [
            {
              "variableName": "RequestHeaders",
              "selector": "X-Azure-FDID"
            }
          ],
          "operator": "Equal",
          "negationConditon": true,
          "matchValues": [
            "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          ],
          "transforms": [
            "Lowercase"
          ]
        }
      ]
    }
  ]
}
```

## Next steps

After you create your custom rules, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).

[fig1]: ../media/create-custom-waf-rules/1.png
