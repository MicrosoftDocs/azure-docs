---
title: Web application firewall custom rule for Azure Front Door
description: Learn how to use web application firewall (WAF) custom rules to protect your web applications from malicious attacks.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 11/01/2022
ms.author: victorh
---

# Custom rules for Azure Web Application Firewall on Azure Front Door

Azure Web Application Firewall on Azure Front Door allows you to control access to your web applications based on the conditions you define. A custom web application firewall (WAF) rule consists of a priority number, rule type, match conditions, and an action.

There are two types of custom rules: match rules and rate limit rules. A match rule controls access based on a set of matching conditions. A rate limit rule controls access based on matching conditions and the rates of incoming requests. You can disable a custom rule to prevent it from being evaluated but still keep the configuration.

For more information on rate limiting, see [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md).

## Priority, action types, and match conditions

You can control access with a custom WAF rule that defines a priority number, a rule type, an array of match conditions, and an action.

- **Priority**

    A unique integer that describes the order of evaluation of WAF rules. Rules with lower-priority values are evaluated before rules with higher values. The rule evaluation stops on any rule action except for *Log*. Priority numbers must be unique among all custom rules.

- **Action**

  Defines how to route a request if a WAF rule is matched. You can choose one of the following actions to apply when a request matches a custom rule.

    - **Allow**: The WAF allows the request to process, logs an entry in WAF logs, and exits.
    - **Block**: Request is blocked. The WAF sends a response to a client without forwarding the request further. The WAF logs an entry in WAF logs and exits.
    - **Log**: The WAF logs an entry in WAF logs and continues to evaluate the next rule in the priority order.
    - **Redirect**: The WAF redirects the request to a specified URI, logs an entry in WAF logs, and exits.

- **Match condition**

  Defines a match variable, an operator, and a match value. Each rule can contain multiple match conditions. A match condition might be based on geo-location, client IP addresses (CIDR), size, or string match. String match can be against a list of match variables.
  - **Match variable**
    - RequestMethod
    - QueryString
    - PostArgs
    - RequestUri
    - RequestHeader
    - RequestBody
    - Cookies
  - **Operator**
    - Any: Often used to define default action if no rules are matched. Any is a match all operator.
    - Equal
    - Contains
    - LessThan: Size constraint
    - GreaterThan: Size constraint
    - LessThanOrEqual: Size constraint
    - GreaterThanOrEqual: Size constraint
    - BeginsWith
    - EndsWith
    - Regex
  
  - **Regex**

    Doesn't support the following operations:

    - Backreferences and capturing subexpressions
    - Arbitrary zero-width assertions
    - Subroutine references and recursive patterns
    - Conditional patterns
    - Backtracking control verbs
    - The \C single-byte directive
    - The \R newline match directive
    - The \K start of match reset directive
    - Callouts and embedded code
    - Atomic grouping and possessive quantifiers

  - **Negate [optional]**

    You can set the `negate` condition to *true* if the result of a condition should be negated.
      
  - **Transform [optional]**

    A list of strings with names of transformations to do before the match is attempted. These can be the following transformations:
     - Uppercase
     - Lowercase
     - Trim
     - RemoveNulls
     - UrlDecode
     - UrlEncode
     
   - **Match value**
   
     Supported HTTP request method values include:
     - GET
     - POST
     - PUT
     - HEAD
     - DELETE
     - LOCK
     - UNLOCK
     - PROFILE
     - OPTIONS
     - PROPFIND
     - PROPPATCH
     - MKCOL
     - COPY
     - MOVE
     - PATCH
     - CONNECT

## Examples

Consider the following examples.

### Match based on HTTP request parameters

Suppose you need to configure a custom rule to allow requests that match the following two conditions:
- The `Referer` header's value is equal to a known value.
- The query string doesn't contain the word `password`.

Here's an example JSON description of the custom rule:

```json
{
  "name": "AllowFromTrustedSites",
  "priority": 1,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "RequestHeader",
      "selector": "Referer",
      "operator": "Equal",
      "negateCondition": false,
      "matchValue": [
        "www.mytrustedsites.com/referpage.html"
      ]
    },
    {
      "matchVariable": "QueryString",
      "operator": "Contains",
      "matchValue": [
        "password"
      ],
      "negateCondition": true
    }
  ],
  "action": "Allow"
}
```

### Block HTTP PUT requests

Suppose you need to block any request that uses the HTTP PUT method.

Here's an example JSON description of the custom rule:

``` json
{
  "name": "BlockPUT",
  "priority": 2,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "RequestMethod",
      "selector": null,
      "operator": "Equal",
      "negateCondition": false,
      "matchValue": [
        "PUT"
      ]
    }
  ],
  "action": "Block"
}
```

### Size constraint

An Azure Front Door WAF enables you to build custom rules that apply a length or size constraint on a part of an incoming request. This size constraint is measured in bytes.

Suppose you need to block requests where the URL is longer than 100 characters.

Here's an example JSON description of the custom rule:

```json
{
  "name": "URLOver100",
  "priority": 5,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "RequestUri",
      "selector": null,
      "operator": "GreaterThanOrEqual",
      "negateCondition": false,
      "matchValue": [
        "100"
      ]
    }
  ],
  "action": "Block"
}
```

## Next steps
- [Configure a WAF policy by using Azure PowerShell](waf-front-door-custom-rules-powershell.md).
- Learn about [Azure Web Application Firewall on Azure Front Door](afds-overview.md).
- Learn how to [create an Azure Front Door instance](../../frontdoor/quickstart-create-front-door.md).
