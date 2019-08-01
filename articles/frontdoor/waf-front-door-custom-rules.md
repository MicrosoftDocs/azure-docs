---
title: Web application firewall custom rule for Azure Front Door
description: Learn how to use web application firewall (WAF) custom rules protecting your web applications from malicious attacks.
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/07/2019
ms.author: kumud
ms.reviewer: tyao

---

#  Custom rules for web application firewall with Azure Front Door
Azure web application firewall (WAF) with Front Door service allows you to control access to your web applications based on the conditions you define. A custom WAF rule consists of a priority number, a rule type, match conditions, and an action. There are two types of custom rules: match rules and rate limit rules. A match rule controls access based on matching conditions while a rate limit rule controls access based on matching conditions and the rates of incoming requests. You may disable a custom rule to prevent it from being evaluated, but still keep the configuration. This article discusses match rules that are based on http parameters.

## Priority, match conditions, and action types
You can control access with a custom WAf rule that defines a priority number, a rule type, match conditions, and an action. 

- **Priority:** is an unique integer that describes the order of evaluation of WAF rules. Rules with lower values are evaluated before rules with higher values

- **Action:** defines how to route a request if a  WAF rule is matched. You can choose one of the below actions to apply when a request matches a custom rule.

    - *Allow* - WAF forwards the quest to the back-end, logs an entry in WAF logs and exits.
    - *Block* - Request is blocked, WAF sends response to client without forwarding the request to the back-end. WAF logs an entry in WAF logs.
    - *Log* - WAF logs an entry in WAF logs and continues evaluate the next rule.
    - *Redirect* - WAF redirects request to a specified URI, logs an entry in WAF logs, and exits.

- **Match condition:** defines a match variable, an operator, and match value. Each rule may contain multiple match conditions. A match condition may be based on the below *match variables*:
    - RemoteAddr (client IP)
    - RequestMethod
    - QueryString
    - PostArgs
    - RequestUri
    - RequestHeader
    - RequestBody

- **Operator:** list includes the following:
    - Any: is often used to define default action if no rules are matched. Any is a match all operator.
    - IPMatch: define IP restriction for RemoteAddr variable
    - GeoMatch: define geo filtering for RemoteAddr variable
    - Equal
    - Contains
    - LessThan: size constraint
    - GreaterThan: size constraint
    - LessThanOrEqual: size constraint
    - GreaterThanOrEqual: size constraint
    - BeginsWith
     - EndsWith

You can set *negate* condition to be true if the result of a condition should be negated.

*Match value* defines the list of possible match values.
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

Here is an example that shows the configuration of a custom rule with two match conditions. Requests are from a specified site as defined by referrer, and query string does not contain "password".

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
- Learn about [web application firewall](waf-overview.md)
- Learn how to [create a Front Door](quickstart-create-front-door.md).

