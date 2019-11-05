---
title: Azure web application firewall (WAF) v2 custom rules 
description: This article provides an overview of web application firewall (WAF) v2 custom rules in Azure Application Gateway.
services: application-gateway
ms.topic: article
author: vhorne
ms.service: application-gateway
ms.date: 6/18/2019
ms.author: victorh
---

# Overview: Custom rules for web application firewall v2

Azure Application Gateway web application firewall (WAF) v2 comes with a pre-configured, platform-managed rule set that offers protection from many different types of attacks. These attacks include cross-site scripting, SQL injection, and others. If you're a WAF admin, you might want to write your own rules to augment the core rule set rules. Your rules can either block or allow requested traffic based on matching criteria.

With custom rules, you can create your own rules, which are evaluated for each request that passes through WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. The custom rules contain a rule name, a rule priority, and an array of matching conditions. If these conditions are met, an action is taken to allow or block.

For example, you can create a rule to block all requests from an IP address in the range 192.168.5.4/24. In this rule, the operator is *IPMatch*, *matchValues* is the IP address range (192.168.5.4/24), and *action* is to block the traffic. You also set the rule’s name and priority.

Custom rules support using compounding logic to make more advanced rules that address your security needs. For example, "(Condition 1 *and* Condition 2) *or* Condition 3)" means that if Condition 1 *and* Condition 2 are met, *or* if Condition 3 is met, WAF should take the action that's specified in the custom rule.

Different matching conditions within the same rule are always compounded by using *and*. For example, a rule that uses *and* might specify to block traffic from a certain IP address, and only if a certain browser is being used.

If you want to use *or* for two different conditions, the two conditions must be in different rules. For example, the rule that uses *or* might specify to block traffic from a certain IP address or block traffic if a certain browser is being used.

> [!NOTE]
> The maximum number of WAF custom rules is 100. For more information about Application Gateway limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md#application-gateway-limits).

Regular expressions are also supported in custom rules, just as they are in the core rule sets. For examples of these rules, see "Example 3" and "Example 5" in [Create and use custom web application firewall rules](create-custom-waf-rules.md).

> [!NOTE]
> Custom rules are not available in the v1 SKU WAF.

## Allowing or blocking traffic

Allowing or blocking traffic is simple with custom rules. For example, you can block all traffic that comes from a range of IP addresses. You can make another rule to allow traffic if the request comes from a certain browser.

To allow something, ensure that the `-Action` parameter is set to **Allow**. To block something, ensure that the `-Action` parameter is set to **Block**, as shown in the following code:

```azurepowershell
$AllowRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example1 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Allow

$BlockRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example2 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block
```

The preceding `$BlockRule` maps to the following custom rule in Azure Resource Manager:

```json
"customRules": [
      {
        "name": "blockEvilBot",
        "priority": 2,
        "ruleType": "MatchRule",
        "action": "Block",
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
    ], 
```

This custom rule contains a name, a priority, an action, and an array of matching conditions that must be met for the action to take place. For descriptions of the custom-rule fields, see the following sections. For examples of custom rules, see [Create and use custom web application firewall rules](create-custom-waf-rules.md).

## Custom-rule fields

### Name (optional)

This is the name of the rule. The name appears in the logs.

### Priority (required)

- The priority determines the order in which the rules are evaluated. The lower the value, the earlier the evaluation of the rule. The allowable range is from 1 to 100.
- The priority must be unique among all custom rules. A rule with a priority of 40 is evaluated before a rule with a priority of 80.

### Rule type (required)

Currently, the rule type must be **MatchRule**.

### Match variable (required)

The match variable must be one of the following:

- RemoteAddr: The IP address or hostname of the remote computer connection
- RequestMethod: The HTTP request method (GET, POST, PUT, DELETE, and so on).
- QueryString: The variable in the URI.
- PostArgs: The arguments that are sent in the POST body. Custom rules that use this match variable are applied only if the Content-Type header is set to "application/x-www-form-urlencoded" and "multipart/form-data".
- RequestUri: The URI of the request.
- RequestHeaders: The headers of the request.
- RequestBody: The variable that contains the entire request body as a whole. Custom rules that use this match variable are applied only if the Content-Type header is set to "application/x-www-form-urlencoded". 
- RequestCookies: The cookies of the request.

### Selector (optional)

The selector describes the field of the matchVariable collection. For example, if the matchVariable is "RequestHeaders", the selector could be on the User-Agent header.

### Operator (required)

The operator must be one of the following:

- IPMatch: This operator is used only when the match variable is *RemoteAddr*.
- Equals: The input is the same as the MatchValue.
- Contains
- LessThan
- GreaterThan
- LessThanOrEqual
- GreaterThanOrEqual
- BeginsWith
- EndsWith
- Regex

### Negate condition (optional)

Negates the current condition.

### Transform (optional)

A list of strings with the names of transformations to complete before the match is attempted. The transforms include:

- Lowercase
- Trim
- UrlDecode
- UrlEncode 
- RemoveNulls
- HtmlEntityDecode

### Match values (required)

The matchValues field is a list of values to match against, which can be thought of as being *or*'ed. For example, the values could be IP addresses or other strings. The value format depends on the previous operator.

### Action (required)

The action field offers the following options: 

- Allow: Authorizes the transaction, and skips all subsequent rules. This means that the specified request is added to the Allow list and, after it is matched, the request stops further evaluation and is sent to the back-end pool. Rules that are on the Allow list aren't evaluated for further custom rules or managed rules.

- Block: Blocks the transaction based on *SecDefaultAction* (detection/prevention mode). Like the Allow action, after the request is evaluated and added to the block list, the evaluation is stopped and the request is blocked. Subsequent requests that meet the same conditions aren't evaluated. They're only blocked. 

- Log: Lets the rule write to the log, and lets the rest of the rules run for evaluation. Subsequent custom rules are evaluated in order of priority, followed by the managed rules.

## Next steps

Now that you've learned about custom rules, you can [create your own custom rules](create-custom-waf-rules.md).
