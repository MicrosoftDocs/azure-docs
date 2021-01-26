---
title: Web application firewall custom rule for Azure Front Door
description: Learn how to use Web Application Firewall (WAF) custom rules protecting your web applications from malicious attacks.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 09/05/2019
ms.author: victorh
---

#  Custom rules for Web Application Firewall with Azure Front Door

Azure Web Application Firewall (WAF) with Front Door allows you to control access to your web applications based on the conditions you define. A custom WAF rule consists of a priority number, rule type, match conditions, and an action. There are two types of custom rules: match rules and rate limit rules. A match rule controls access based on a set of matching conditions while a rate limit rule controls access based on matching conditions and the rates of incoming requests. You may disable a custom rule to prevent it from being evaluated, but still keep the configuration. 

## Priority, match conditions, and action types

You can control access with a custom WAf rule that defines a priority number, a rule type, an array of match conditions, and an action. 

- **Priority:** is a unique integer that describes the order of evaluation of WAF rules. Rules with lower priority values are evaluated before rules with higher values. Priority numbers must be unique among all custom rules.

- **Action:** defines how to route a request if a  WAF rule is matched. You can choose one of the below actions to apply when a request matches a custom rule.

    - *Allow* - WAF forwards the quest to the back-end, logs an entry in WAF logs and exits.
    - *Block* - Request is blocked, WAF sends response to client without forwarding the request to the back-end. WAF logs an entry in WAF logs.
    - *Log* - WAF logs an entry in WAF logs and continues to evaluate the next rule.
    - *Redirect* - WAF redirects request to a specified URI, logs an entry in WAF logs, and exits.

- **Match condition:** defines a match variable, an operator, and match value. Each rule may contain multiple match conditions. A match condition may be based on geo location, client IP addresses (CIDR), size, or string match. String match can be against a list of match variables.
  - **Match variable:**
    - RequestMethod
    - QueryString
    - PostArgs
    - RequestUri
    - RequestHeader
    - RequestBody
    - Cookies
  - **Operator:**
    - Any: is often used to define default action if no rules are matched. Any is a match all operator.
    - Equal
    - Contains
    - LessThan: size constraint
    - GreaterThan: size constraint
    - LessThanOrEqual: size constraint
    - GreaterThanOrEqual: size constraint
    - BeginsWith
    - EndsWith
    - Regex
  
  - **Regex** does not support the following operations: 
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

  - **Negate [optional]:**
    You can set the *negate* condition to true if the result of a condition should be negated.
      
  - **Transform [optional]:**
    A list of strings with names of transformations to do before the match is attempted. These can be the following transformations:
     - Uppercase 
     - Lowercase
     - Trim
     - RemoveNulls
     - UrlDecode
     - UrlEncode
     
   - **Match value:**
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

## Examples

### WAF custom rules example based on http parameters

Here is an example that shows the configuration of a custom rule with two match conditions. Requests are from a specified site as defined by referrer, and query string doesn't contain "password".

```
# http rules example
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
  "action": "Allow",
  "transforms": []
}

```
An example configuration for blocking "PUT" method is shown as below:

``` 
# http Request Method custom rules
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
  "action": "Block",
  "transforms": []
}
```

### Size constraint

You may build a custom rule that specifies size constraint on part of an incoming request. For example, below rule blocks a Url that is longer than 100 characters.

```
# http parameters size constraint
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
  "action": "Block",
  "transforms": []
}
```

## Next steps
- [Configure a Web Application Firewall policy using Azure PowerShell](waf-front-door-custom-rules-powershell.md) 
- Learn about [web Application Firewall with Front Door](afds-overview.md)
- Learn how to [create a Front Door](../../frontdoor/quickstart-create-front-door.md).

