---
title: Azure Web Application Firewall (WAF) v2 custom rules on Application Gateway  
description: This article provides an overview of Web Application Firewall (WAF) v2 custom rules on Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 11/02/2022
ms.author: victorh 
ms.custom: devx-track-azurepowershell
---

# Custom rules for Web Application Firewall v2 on Azure Application Gateway

The Azure Application Gateway Web Application Firewall (WAF) v2 comes with a preconfigured, platform-managed ruleset that offers protection from many different types of attacks. These attacks include cross site scripting, SQL injection, and others. If you're a WAF admin, you may want to write your own rules to augment the core rule set (CRS) rules. Your custom rules can either block, allow, or log requested traffic based on matching criteria. If the WAF policy is set to detection mode, and a custom block rule is triggered, the request is logged and no blocking action is taken.

Custom rules allow you to create your own rules that are evaluated for each request that passes through the WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. The custom rules contain a rule name, rule priority, and an array of matching conditions. If these conditions are met, an action is taken (to allow, block, or log). If a custom rule is triggered, and an allow or block action is taken, no further custom or managed rules are evaluated. Custom rules can be enabled/disabled on demand.

For example, you can block all requests from an IP address in the range 192.168.5.0/24. In this rule, the operator is *IPMatch*, the matchValues is the IP address range (192.168.5.0/24), and the action is to block the traffic. You also set the rule's name, priority and enabled/disabled state.

Custom rules support using compounding logic to make more advanced rules that address your security needs. For example, you  can use two custom rules to create the following logic ((rule1:Condition 1 **and** rule1:Condition 2) **or** rule2:Condition 3). This logic means that if Condition 1 **and** Condition 2 are met, **or** if Condition 3 is met, the WAF should take the action specified in the custom rules. 

Different matching conditions within the same rule are always compounded using **and**. For example, block traffic from a specific IP address, and only if they're using a certain browser.

If you want to use **or** between two different conditions,then the two conditions must be in different rules. For example, block traffic from a specific IP address or block traffic if they're using a specific browser.

Regular expressions are also supported in custom rules, just like in the CRS rulesets. For examples, see Examples 3 and 5 in [Create and use custom web application firewall rules](create-custom-waf-rules.md).

> [!NOTE]
> The maximum number of WAF custom rules is 100. For more information about Application Gateway limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits).

> [!CAUTION]
> Any redirect rules applied at the application gateway level will bypass WAF custom rules. See [Application Gateway redirect overview](../../application-gateway/redirect-overview.md) for more information about redirect rules.

## Allowing vs. blocking

Allowing and blocking traffic is simple with custom rules. For example, you can block all traffic coming from a range of IP addresses. You can make another rule to allow traffic if the request comes from a specific browser.

To allow something, ensure that the `-Action` parameter is set to **Allow**. To block something, ensure that the `-Action` parameter is set to **Block**.

```azurepowershell
$AllowRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example1 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Allow `
   -State Enabled

$BlockRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example2 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block `
   -State Enabled
```

The previous `$BlockRule` maps to the following custom rule in Azure Resource Manager:

```json
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
            "negationCondition": false,
            "matchValues": [
              "evilbot"
            ],
            "transforms": [
              "Lowercase"
            ]
          }
        ]
      }
    ], 
```

This custom rule contains a name, priority, an action, and the array of matching conditions that must be met for the action to take place. For further explanation of these fields, see the following field descriptions. For example custom rules, see [Create and use custom web application firewall rules](create-custom-waf-rules.md).

## Fields for custom rules

### Name [optional]

The name of the rule.  It appears in the logs.

### Enable rule [optional]

Turn this rule on/off. Custom rules are enabled by default.

### Priority [required]

- Determines the rule valuation order. The lower the value, the earlier the evaluation of the rule. The allowable range is from 1-100. 
- Must be unique across all custom rules. A rule with priority 40 is evaluated before a rule with priority 80.

### Rule type [required]

Currently, must be **MatchRule**.

### Match variable [required]

Must be one of the variables:

- RemoteAddr – IPv4 Address/Range of the remote computer connection
- RequestMethod – HTTP Request method
- QueryString – Variable in the URI
- PostArgs – Arguments sent in the POST body. Custom Rules using this match variable are only applied if the 'Content-Type' header is set to 'application/x-www-form-urlencoded' and 'multipart/form-data.' Additional content type of  `application/json` is supported with CRS version 3.2 or greater, bot protection rule set, and geo-match custom rules. 
- RequestUri – URI of the request
- RequestHeaders – Headers of the request
- RequestBody – This variable contains the entire request body as a whole. Custom rules using this match variable are only applied if the 'Content-Type' header is set to `application/x-www-form-urlencoded` media type. Additional content types of  `application/soap+xml, application/xml, text/xml` are supported with CRS version 3.2 or greater, bot protection rule set, and geo-match custom rules.
- RequestCookies – Cookies of the request

### Selector [optional]

Describes the field of the matchVariable collection. For example, if the matchVariable is RequestHeaders, the selector could be on the *User-Agent* header.

### Operator [required]

Must be one of the following operators:

- IPMatch - only used when Match Variable is *RemoteAddr,* and only supports IPv4
- Equal – input is the same as the MatchValue
- Any – It shouldn't have a MatchValue. It's recommended for Match Variable with a valid Selector.
- Contains
- LessThan
- GreaterThan
- LessThanOrEqual
- GreaterThanOrEqual
- BeginsWith
- EndsWith
- Regex
- Geomatch

### Negate condition [optional]

Negates the current condition.

### Transform [optional]

A list of strings with names of transformations to do before the match is attempted. These can be the following transformations:

- Lowercase
- Uppercase
- Trim
- UrlDecode
- UrlEncode 
- RemoveNulls
- HtmlEntityDecode

### Match values [required]

List of values to match against, which can be thought of as being *OR*'ed. For example, it could be IP addresses or other strings. The value format depends on the previous operator.

Supported HTTP request method values include:
- GET
- HEAD
- POST
- OPTIONS
- PUT
- DELETE
- PATCH

### Action [required]

In WAF policy detection mode, if a custom rule is triggered, the action is always logged regardless of the action value set on the custom rule.

- Allow – Authorizes the transaction, skipping all other rules. The specified request is added to the allowlist and once matched, the request stops further evaluation and is sent to the backend pool. Rules that are on the allowlist aren't evaluated for any further custom rules or managed rules.
- Block - Blocks or logs the transaction based on SecDefaultAction (detection/prevention mode).
   - Prevention mode - Blocks the transaction based on SecDefaultAction. Just like the Allow action, once the request is evaluated and added to the blocklist, evaluation is stopped and the request is blocked. Any request after that meets the same conditions won't be evaluated and will just be blocked.
   - Detection mode - Logs the transaction based on SecDefaultAction after which evaluation is stopped. Any request after that meets the same conditions won't be evaluated and will just be logged.
- Log – Lets the rule write to the log, but lets the rest of the rules run for evaluation. The other custom rules are evaluated in order of priority, followed by the managed rules.

## Copying and duplicating custom rules

Custom rules can be duplicated within a given policy. When duplicating a rule, you need to specify a unique name for the rule and a unique priority value. Additionally, custom rules can be copied from one Application Gateway WAF policy to another as long as the policies are both in the same subscription. When copying a rule from one policy to another you need to select the Application Gateway WAF policy you wish to copy the rule into. Once you select the WAF policy you need to give the rule a unique name, and assign a priority rank.

## Geomatch custom rules

Custom rules let you create tailored rules to suit the exact needs of your applications and security policies. You can restrict access to your web applications by country/region. For more information, see [Geomatch custom rules](geomatch-custom-rules.md).

## Next steps

- [Create your own custom rules](create-custom-waf-rules.md)
- [Learn more about Azure network security](../../networking/security/index.yml)
