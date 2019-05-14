---
title: Azure custom web application firewall (WAF) rules overview
description: This article provides an overview of web application firewall (WAF) custom rules in Azure Application Gateway.
services: application-gateway
ms.topic: article
author: vhorne
ms.service: application-gateway
ms.date: 5/15/2019
ms.author: victorh
---

# Custom web application firewall rules overview

> [!IMPORTANT]
> Azure Application Gateway WAF custom rules is currently a public preview. **Custom rules are available only for the WAF_v2 SKU**.
> This public preview is provided without a service-level agreement and shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Azure Application Gateway web application firewall (WAF) comes with a pre-configured, platform managed ruleset that offers protection from many different types of attacks. These attacks include cross site scripting, SQL injection, and others. If you are a WAF admin, you might may want to write you own rules to augment the CRS rules. Your rules can either block or allow requested traffic based on matching criteria.

Custom rules allow you to create your own rules that are evaluated for each request that passes through the WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. The custom rules have an action (to allow or block), a match condition, and an operator to allow full customization.

For example, you can block all requests from an IP address in the range 192.168.5.4/24. In this rule, the operator is *IPMatch*, the matchValues is the IP address range (192.168.5.4/24), and the action is to block the traffic You also set the rule’s name and priority.

You can use compounding logic, for example **(i and j) or k)** to make more advanced rules that address your security needs. An important distinction is that if you want to **and** two different conditions (for example, block traffic from a specific IP address, and only if they’re using a certain browser), those conditions must be in the same rule. If you want to **or** two different conditions (for example, block traffic from a specific IP address or block traffic if they’re using a specific browser), the two conditions must be in different rules. Regular expressions are also supported in custom rules, just like in the CRS rulesets.

## Allowing vs. Blocking

Allowing and blocking traffic is simple with custom rules. For example, you can block all traffic coming from a range of IP addresses. You can make another rule to allow traffic if the request comes from a specific browser.

To allow something, ensure that the `-Action` parameter is set to **Allow**. To block something, ensure that the `-Action` parameter is set to **Block**.

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

For example custom rules, see [Create and use custom web application firewall rules](create-custom-waf-rules.md).

## Fields for custom rules

### Name [optional]

This is the name of the rule. This name appears in the logs.

### Priority [required]

- Determines the order that rules are evaluated in. The lower the value, the earlier the evaluation of the rule.
-Must be unique amongst all custom rules. A rule with priority 100 will be evaluated before a rule with priority 200.

### Rule type [required]

Currently, must be **MatchRule**.

### Match variable [required]

Must be one of the following:

- RemoteAddr – IP Address/hostname of the remote computer connection
- RequestMethod – HTTP Request method (GET, POST, PUT, DELETE, etc.)
- QueryString – Variable in the URI
- PostArgs – Arguments sent in the POST body
- RequestUri – URI of the request
- RequestHeaders – Headers of the request
- RequestBody – Body of the request
- RequestCookies – Cookies of the request

### Selector [optional]

Describes the field of the matchVariable collection. For example, if the matchVariable is RequestHeaders, the selector could be on the *User-Agent* header.

### Operator [required]

Must be one of the following:

- IPMatch - only used when Match Variable is *RemoteAddr*
- Equals – input is the same as the MatchValue
- Contains
- LessThan
- GreaterThan
- LessThanOrEqual
- GreaterThanOrEqual
- BeginsWith
- EndsWith
- Regex

### Negate condition [optional]

Negates the current condition.

### Transform [optional]

A list of strings with names of transformations to do before the match is attempted. These can be the following:

- Lowercase
- Trim
- UrlDecode
- UrlEncode 
- RemoveNulls
- HtmlEntityDecode

### Match values [required]

List of values to match against, which can be thought of as being *OR*'ed. For example, it could be IP addresses or other strings. The value format depends on the previous operator.

### Action [required]

- Allow – Authorizes the transaction, skipping all subsequent rules
- Block – Blocks the transaction based on *SecDefaultAction* (detection/prevention mode)
- Log – lets the rule write to the log, but lets the rest of the rules execute

## Next steps

After you learn about custom rules, [create your own custom rules](create-custom-waf-rules.md).

