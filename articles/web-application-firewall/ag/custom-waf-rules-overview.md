---
title: Azure Web Application Firewall (WAF) v2 Custom Rules on Application Gateway  
description: This article provides an overview of Web Application Firewall (WAF) v2 custom rules on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 04/30/2026
ms.custom: devx-track-azurepowershell

# Customer intent: As a WAF administrator, I want to create and manage custom rules for the Web Application Firewall on the Application Gateway, so that I can enhance security by controlling traffic based on specific conditions and actions.
---

# Custom rules for Web Application Firewall v2 on Azure Application Gateway

**Applies to:** :heavy_check_mark: Application Gateway V2

The Azure Application Gateway Web Application Firewall (WAF) v2 includes a preconfigured, platform-managed ruleset that protects against many different types of attacks. These attacks include cross-site scripting, SQL injection, and others. If you're a WAF admin, you might want to write your own rules to augment the core rule set (CRS) rules. Your custom rules can block, allow, or log requested traffic based on matching criteria. If you set the WAF policy to detection mode and a custom block rule triggers, the request is logged and no blocking action is taken.

Use custom rules to create your own rules that the WAF evaluates for each request. These rules have a higher priority than the rest of the rules in the managed rule sets. The custom rules contain a rule name, rule priority, and an array of matching conditions. If these conditions are met, the WAF takes an action to allow, block, or log. If a custom rule triggers and the WAF takes an allow or block action, the WAF doesn't take any further actions from custom or managed rules. In the event of a custom rule triggering an allow or block action, you might still see some log events for rule matches from configured ruleset (Core Rule Set/Default Rule Set) but those rules aren't enforced. The log events show merely due to the optimization enforced by the WAF engine for parallel rule processing and can be safely ignored. You can enable or disable custom rules on demand.

For example, you can block all requests from an IP address in the range 192.168.5.0/24. In this rule, the operator is *IPMatch*, the matchValues is the IP address range (192.168.5.0/24), and the action is to block the traffic. You also set the rule's name, priority, and enabled or disabled state.

Custom rules support using compounding logic to make more advanced rules that address your security needs. For example, you  can use two custom rules to create the following logic ((rule1:Condition 1 **and** rule1:Condition 2) **or** rule2:Condition 3). This logic means that if Condition 1 **and** Condition 2 are met, **or** if Condition 3 is met, the WAF should take the action specified in the custom rules. 

Different matching conditions within the same rule are always compounded using **and**. For example, block traffic from a specific IP address, and only if they're using a certain browser.

If you want to use **or** between two different conditions, then the two conditions must be in different rules. For example, block traffic from a specific IP address or block traffic if they're using a specific browser.

Custom rules also support regular expressions, just like in the CRS rulesets. For examples, see Examples 3 and 5 in [Create and use custom web application firewall rules](create-custom-waf-rules.md).

> [!NOTE]
> You can create up to 100 WAF custom rules. For more information about Application Gateway limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-application-gateway-limits).

> [!CAUTION]
> Any redirect rules you apply at the application gateway level bypass WAF custom rules. For more information, see [Application Gateway redirect overview](../../application-gateway/redirect-overview.md).

## Allowing vs. blocking

You can easily allow or block traffic by using custom rules. For example, you can block all traffic from a range of IP addresses. You can create another rule to allow traffic if the request comes from a specific browser.

To allow something, set the `-Action` parameter to **Allow**. To block something, set the `-Action` parameter to **Block**.

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

> [!NOTE]
> WAF custom rules don't support allowing or blocking requests based on filenames or file types.

## Fields for custom rules

### Name [optional]

The name of the rule. It appears in the logs.

### Enable rule [optional]

Turn this rule on or off. Custom rules are enabled by default.

### Priority [required]

- Determines the rule valuation order. The lower the value, the earlier the evaluation of the rule. The allowable range is from 1 to 100.  
- Must be unique across all custom rules. A rule with priority 40 is evaluated before a rule with priority 80.

### Rule type [required]

Currently, must be **MatchRule**.

### Match variable [required]

Must be one of the variables:

- RemoteAddr – IPv4 address or range of the remote computer connection
- RequestMethod – HTTP request method
- QueryString – Variable in the URI
- PostArgs – Arguments sent in the POST body. Custom rules that use this match variable apply only if the 'Content-Type' header is set to 'application/x-www-form-urlencoded' or 'multipart/form-data.' CRS version 3.2 or greater supports an additional content type of `application/json`, along with bot protection rule set and geo-match custom rules. 
- RequestUri – URI of the request
- RequestHeaders – Headers of the request
- RequestBody – This variable contains the entire request body as a whole. Custom rules that use this match variable apply only if the 'Content-Type' header is set to `application/x-www-form-urlencoded` media type. CRS version 3.2 or greater supports additional content types of `application/soap+xml, application/xml, text/xml`, along with bot protection rule set and geo-match custom rules.
- RequestCookies – Cookies of the request

### Selector [optional]

Describes the field of the matchVariable collection. For example, if the matchVariable is RequestHeaders, the selector could be on the *User-Agent* header.

### Operator [required]

Use one of the following operators:

- `IPMatch` - Use only when the Match Variable is *RemoteAddr* and it supports only IPv4.
- `Equal` - Use when the input is the same as the MatchValue.
- `Any` - Use when there's no MatchValue. It's recommended for Match Variable with a valid Selector.
- `Contains` - Use when MatchValue is an explicit value only. Wildcard and regex aren't supported.
- `LessThan`
- `GreaterThan`
- LessThanOrEqual
- GreaterThanOrEqual
- BeginsWith
- `EndsWith`
- `Regex`
- `Geomatch`

### Negate condition [optional]

Negates the current condition.

### Transform [optional]

A list of string values that specify transformations to apply before attempting a match. The available transformations include:

- Lowercase
- Uppercase
- Trim
- UrlDecode
- UrlEncode 
- RemoveNulls
- HtmlEntityDecode

### Match values [required]

A list of values to match against, which you can think of as being *OR*'ed. For example, the list could contain IP addresses or other strings. The value format depends on the previous operator.

> [!NOTE]
> If your WAF is running Core Rule Set (CRS) 3.1, or any other earlier CRS version, the match value only accepts letters, numbers, and punctuation marks. Quotation marks `"`, `'`, and spaces aren't supported.

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
- Block - Blocks or logs the transaction based on SecDefaultAction (detection or prevention mode).
      - Prevention mode - Blocks the transaction based on SecDefaultAction. Just like the `Allow` action, once the request is evaluated and added to the blocklist, evaluation stops and the request is blocked. Any request after that meets the same conditions isn't evaluated and is blocked.
   - Detection mode - Logs the transaction based on SecDefaultAction after which evaluation stops. Any request after that meets the same conditions isn't evaluated and is logged.
- Log – Lets the rule write to the log, but lets the rest of the rules run for evaluation. The other custom rules are evaluated in order of priority, followed by the managed rules.

## Copying and duplicating custom rules

You can duplicate custom rules within a given policy. When you duplicate a rule, you need to specify a unique name for the rule and a unique priority value. Additionally, you can copy custom rules from one Application Gateway WAF policy to another as long as the policies are both in the same subscription. When you copy a rule from one policy to another, you need to select the Application Gateway WAF policy you wish to copy the rule into. Once you select the WAF policy, you need to give the rule a unique name, and assign a priority rank.

## Geomatch custom rules

Custom rules let you create tailored rules to suit the exact needs of your applications and security policies. You can restrict access to your web applications by country or region. For more information, see [Geomatch custom rules](geomatch-custom-rules.md).

## Next step

> [!div class="nextstepaction"]
> [Create your own custom rules](create-custom-waf-rules.md)
