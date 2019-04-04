---
title: Web application firewall custom rule for Azure Front Door
description: Learn how to use web application firewall (WAF) custom rules protecting your web applications from malicious attacks.
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/27/2019
ms.author: kumud;tyao

---

#  Web application firewall custom rules for Azure Front Door
Azure Web application firewall with Front Door service provides you capability to customize application protection policy. A custom WAF rule consists of a priority number, a rule type, match conditions, and an action. You may disable a custom rule to prevent it from being evaluated, but still keep the configuration. There are two types of custom rules, match rules and rate limit rules. In this article, we discuss match rules that are based on http parameters. Rate limit, IP restriction, and geo-filtering custom rules are discussed in other articles.

## Priority, match conditions, and action types

**Priority** is an Integer that describes the order  of the rule. Rules with a lower value will be evaluated before rules with a higher value.

**Action** defines how to route a request if a  WAF rule is matched. You can choose one of the below actions to apply when a request matches a custom rule.

- *Allow* - WAF forwards the quest to the back-end and logs an entry in WAF logs
- *Block* - request is blocked, WAF sends response to client without forwarding the request to the back-end. WAF logs an entry in WAF logs
- *Monitor* - WAF forwards the request to the back-end and logs an entry in WAF logs
- *Redirect* - WAF redirects request to a specified Url

**Match condition** defines a match variable, an operator, and match value. Each rule may contain multiple match conditions. A match condition may be based on the below *match variables*: 

```
# http match variables
RemoteAddr: client IP
RequestMethod
QueryString
PostArgs
RequestUri
RequestHeader
RequestBody
```

The *Operator* list includes the following:

```
# http operators
Any: is often used to define default action. Any is a match all operator
IPMatch: define IP restriction for RemoteAddr variable
GeoMatch: define geo filtering for RemoteAddr variable
Equal
Contains
LessThan: size constraint
GreaterThan: size constraint
LessThanOrEqual: size constraint
GreaterThanOrEqual: size constraint
BeginsWith
EndsWith
```

You can set *negate* condition to be true if the result of this condition should be negated.

*Match value* defines the list of possible match values.

## Examples

### WAF custom rules example based on http parameters

Here is an example that shows the configuration of a custom rule with two match conditions. Requests are from a specified site as defined by referrer, and query string does not contain "password".

```
# http rules example
"name": “AllowFromTrustedSites",
"priority": 1,
"ruleType": "MatchRule",
"matchConditions": [
{
"matchVariable": "RequestHeader",
"selector": “Referer",
"operator": “Equal",
"negateCondition": false,
"matchValue": [
“www.mytrustedsites.com/referpage.html"
]
},
{
 "matchVariable": "QueryString",
  "operator": "Contains",
  "matchValue": ["password"],
  "negateCondition":true
}
],
"action": “Allow",
"transforms": []
},

```

### WAF custom rules based on Http request methods

You can configure a custom rule using *RequestMethod* to block requests using request methods that are not supported for your web applications.

The *Http request methods* list includes the following:

```
# http request methods
GET
POST
PUT
HEAD
DELETE
LOCK
UNLOCK
PROFILE
OPTIONS
PROPFIND
PROPPATCH
MKCOL
COPY
MOVE

```

An example configuration for blocking "PUT" method is shown as below:

``` 
# http Request Method custom rules
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
"name": "URLOver50",
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
- Learn how to [create a Front Door](quickstart-create-front-door.md).

