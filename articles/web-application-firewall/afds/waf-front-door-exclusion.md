---
title: Web application firewall exclusion lists in Azure Front Door
description: This article provides information on exclusion list configuration in Azure Front Door.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 03/07/2023
ms.author: victorh
ms.topic: conceptual
---

# Web Application Firewall with Azure Front Door exclusion lists

Sometimes Azure Web Application Firewall in Azure Front Door might block a legitimate request. As part of tuning your web application firewall (WAF), you can configure the WAF to allow the request for your application. WAF exclusion lists allow you to omit specific request attributes from a WAF evaluation. The rest of the request is evaluated as normal.

For example, Azure Active Directory provides tokens that are used for authentication. When these tokens are used in a request header, they can contain special characters that might trigger a false positive detection by one or more WAF rules. You can add the header to an exclusion list, which tells the WAF to ignore the header. The WAF still inspects the rest of the request for suspicious content.

## Exclusion scopes

You can create exclusions at the following scopes:

- **Rule set**: These exclusions apply to all rules within a rule set.
- **Rule group**: These exclusions apply to all the rules of a particular category within a rule set. For example, you can configure an exclusion that applies to all the SQL injection rules.
- **Rule**: These exclusions apply to a single rule.

## Exclusion selectors

Exclusion selectors identify the parts of requests to which the exclusion applies. The WAF ignores any detections that it finds in the specified parts of the request. You can specify multiple exclusion selectors in a single exclusion.

Each exclusion selector specified a match variable, an operator, and a selector.

### Match variables

You can add the following request attributes to an exclusion:

* Request header name
* Request cookie name
* Query string args name
* Request body POST args name
* Request body JSON args name *(supported on DRS 2.0 or greater)*

The values of the fields you use aren't evaluated against WAF rules, but their names are evaluated. The exclusion lists disable inspection of the field's value. However, the field names are still evaluated. For more information, see [Exclude other request attributes](#exclude-other-request-attributes).

### Operators

You can specify an exact request header, body, cookie, or query string attribute to match. Or you can optionally specify partial matches. The following operators are supported for match criteria:

- **Equals**: Match all request fields that exactly match the specified selector value. For example, to select a header named **bearerToken**, use the `Equals` operator with the selector set to **bearerToken**.
- **Starts with**: Match all request fields that start with the specified selector value.
- **Ends with**: Match all request fields that end with the specified selector value.
- **Contains**: Match all request fields that contain the specified selector value.
- **Equals any**: Match all request fields. When you use the `Equals any` operator, the selector value is automatically set to `*`. For example, you can use the `Equals any` operator to configure an exclusion that applies to all request headers.

### Case sensitivity

Header and cookie names are case insensitive. Query strings, POST arguments, and JSON arguments are case sensitive.

### Body contents inspection

Some of the managed rules evaluate the raw payload of the request body before it's parsed into POST arguments or JSON arguments. So in some situations, you might see log entries with a `matchVariableName` value of `InitialBodyContents` or `DecodedInitialBodyContents`.

For example, suppose you create an exclusion with a match variable of `Request body POST args` and a selector to identify and ignore POST arguments named `FOO`. You no longer see any log entries with a `matchVariableName` value of `PostParamValue:FOO`. However, if a POST argument named `FOO` contains text that triggers a rule, the log might show the detection in the initial body contents. You can't currently create exclusions for initial body contents.

## <a name="define-exclusion-based-on-web-application-firewall-logs"></a> Define exclusion rules based on Azure Web Application Firewall logs

You can use logs to view the details of a blocked request, including the parts of the request that triggered the rule. For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).

Sometimes a specific WAF rule produces false positive detections from the values included in a request header, cookie, POST argument, query string argument, or JSON field in a request body. If these false positive detections happen, you can configure the rule to exclude the relevant part of the request from its evaluation.

The following table shows example values from WAF logs and the corresponding exclusion selectors that you could create.

| matchVariableName from WAF logs | Rule exclusion in portal |
|-|-|
| CookieValue:SOME_NAME	| Request cookie name Equals SOME_NAME |
| HeaderValue:SOME_NAME	| Request header name Equals SOME_NAME |
| PostParamValue:SOME_NAME | Request body POST args name Equals SOME_NAME |
| QueryParamValue:SOME_NAME | Query string args name Equals SOME_NAME |
| SOME_NAME | Request body JSON args name Equals SOME_NAME |

### Exclusions for JSON request bodies

From DRS version 2.0, JSON request bodies are inspected by the WAF. For example, consider this JSON request body:

```json
{
  "posts": [
    {
      "id": 1,
      "comment": ""
    },
    {
      "id": 2,
      "comment": "\"1=1\""
    }
  ]
}
```

The request includes a SQL comment character sequence, which the WAF detects as a potential SQL injection attack.

If you determine that the request is legitimate, you could create an exclusion with a match variable of `Request body JSON args name`, an operator of `Equals`, and a selector of `posts.comment`.

## Exclude other request attributes

If your WAF log entry shows a `matchVariableName` value that isn't in the preceding table, you can't create an exclusion. For example, you can't currently create exclusions for cookie names, header names, POST parameter names, or query parameter names.

Instead, consider taking one of the following actions:

- Disable the rules that give false positives.
- Create a custom rule that explicitly allows those requests. The requests bypass all WAF inspection.

In particular, when the `matchVariableName` value is `CookieName`, `HeaderName`, `PostParamName`, or `QueryParamName`, it means the name of the field, rather than its value, has triggered the rule. Rule exclusion has no support for these `matchVariableName` values at this time.

## Next steps

- [Configure exclusion lists on your Azure Front Door WAF](waf-front-door-exclusion-configure.md).
- After you configure your WAF settings, learn how to view your WAF logs. For more information, see [Azure Front Door diagnostics](../afds/waf-front-door-monitor.md).
