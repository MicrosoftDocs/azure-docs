---
title: Service Tag Match Condition for Azure Front Door
titleSuffix: Azure Web Application Firewall
description: Learn how to use the service tag match condition in Azure Web Application Firewall custom rules to control traffic from Azure services without managing IP address lists.
author: joeolerich
ms.author: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 10/02/2026
---

# What is service tag matching for Azure Front Door?

**Applies to:** :heavy_check_mark: Front Door Premium

Azure Web Application Firewall (WAF) on Azure Front Door can match requests against the service tag that a client's IP address belongs to. A service tag represents a group of IP address prefixes for a given Azure service. Microsoft manages the prefixes in each service tag and updates them automatically as addresses change.

You use service tag matching in a custom rule by setting the match variable to `SocketAddr` or `RemoteAddr` and the operator to `ServiceTagMatch`.

Service tag matching is most useful when you want to write an access control rule against an Azure service rather than against a list of addresses. Allowing a monitoring service through to your application, or blocking traffic from a service your application never legitimately receives requests from, are both easier to express as a tag than as a set of prefixes that you have to maintain.

## How service tag matching works

Each service tag corresponds to a set of IP address prefixes published by Microsoft. When a request reaches Azure Front Door, the WAF resolves the client address to the service tags that contain it, and compares those tags against the values in your custom rule. If the address falls within a tag you specified, the match condition evaluates to true and the rule's action is applied.

Because Microsoft maintains the prefixes behind each tag, a rule written against a service tag keeps working when the underlying addresses change. You don't need to update the rule when a service adds or retires address ranges.

An IP address can belong to more than one service tag. Broad tags such as `AzureCloud` contain the ranges covered by many narrower tags, so a request from an Azure service matches both the specific tag for that service and the broader tag that contains it. Write rules against the narrowest tag that expresses your intent.

### Why service tags are useful on Azure Front Door

Network security groups also support service tags, but they aren't always an option for an application behind Azure Front Door:

- Azure Front Door terminates the client connection and forwards the request to your origin, so the address a network security group evaluates at the origin is an Azure Front Door address rather than the original client's address. Rules written at the origin can't act on the original client.
- An origin hosted outside Azure has no network security group at all.

Evaluating the service tag at the WAF, where the original client connection arrives, gives you the control that a network security group would provide closer to the client.

## Choose the right match variable

Service tag matching supports two match variables, and the difference between them matters:

| Match variable | What it evaluates |
| --- | --- |
| `SocketAddr` | The IP address of the TCP connection that reached Azure Front Door. This is the address of whatever actually opened the connection, which might be a proxy or another service rather than the end user. |
| `RemoteAddr` | The original client IP address, taken from the `X-Forwarded-For` header when one is present. |

Use `SocketAddr` when you want to act on the service that actually connected to Azure Front Door, which is the common case for service tag rules. The address you care about, the Azure service sending the request, is the one that opened the connection.

Use `RemoteAddr` when your traffic passes through an intermediary and you need to evaluate the client it's forwarding for. Keep in mind that `X-Forwarded-For` is supplied by the caller and can be set by anyone, so a rule that allows traffic based on `RemoteAddr` is easier to spoof than one based on `SocketAddr`.

No other match variables are valid with the `ServiceTagMatch` operator.

## Configure a service tag match condition

A service tag match condition uses the following settings.

| Setting | Value |
| --- | --- |
| Match variable | `SocketAddr` or `RemoteAddr` |
| Operator | `ServiceTagMatch` |
| Match value | One or more service tag names |
| Negate condition | Optional. Set to `true` to match every address that *isn't* in the tags you list. |

In the Azure portal, the match value is a searchable list of the available service tags rather than a free-text field. Select the tags you want the rule to match. You can select more than one tag in a single condition; the condition matches if the address falls within any of them.

Service tag names are matched exactly. Wildcards, partial names, and regular expressions aren't supported by the `ServiceTagMatch` operator.

For the full list of service tags and a description of what each one covers, see [Azure service tags overview](../../virtual-network/service-tags-overview.md).

## Examples

### Allow traffic from a trusted Azure service

Suppose a monitoring or health-checking service needs to reach an endpoint that your WAF would otherwise block. The following rule allows traffic from that service:

```json
{
  "name": "AllowAzureMonitor",
  "priority": 10,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "ServiceTagMatch",
      "negateCondition": false,
      "matchValue": [
        "AzureMonitor"
      ]
    }
  ],
  "action": "Allow"
}
```

Give allow rules a high priority (a low numeric value) so they're evaluated before the block and rate limit rules they're meant to bypass. Be aware that an **Allow** action stops evaluation of the Default Rule Set and the Bot Protection rule set for that request, so scope allow rules as narrowly as you can.

### Block traffic from a service tag

If your application never legitimately receives requests from a particular Azure service, you can block it outright:

```json
{
  "name": "BlockUnexpectedServiceTraffic",
  "priority": 100,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "ServiceTagMatch",
      "negateCondition": false,
      "matchValue": [
        "AzureCloud"
      ]
    }
  ],
  "action": "Block"
}
```

Use broad tags such as `AzureCloud` with care. `AzureCloud` covers the public IP ranges used across Azure, including addresses used by other customers, so a rule written against it affects far more traffic than a rule written against a specific service.

### Restrict a management path to a specific service

Combining a service tag condition with a URI condition limits the rule to the traffic you intend to affect. The following rule blocks any request to `/admin` that doesn't come from the address range you expect. The `negateCondition` property inverts the service tag match, and both conditions must be true for the rule to match.

```json
{
  "name": "RestrictAdminPath",
  "priority": 20,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "RequestUri",
      "operator": "Contains",
      "negateCondition": false,
      "matchValue": [
        "/admin"
      ]
    },
    {
      "matchVariable": "SocketAddr",
      "operator": "ServiceTagMatch",
      "negateCondition": true,
      "matchValue": [
        "AzureCloud.eastus"
      ]
    }
  ],
  "action": "Block"
}
```

### Rate limit traffic from a service tag

A service tag condition can also be used in a rate limit rule, which caps how many requests the matching clients can send rather than blocking them outright:

```json
{
  "name": "RateLimitServiceTraffic",
  "priority": 50,
  "ruleType": "RateLimitRule",
  "rateLimitDurationInMinutes": 5,
  "rateLimitThreshold": 1000,
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "ServiceTagMatch",
      "negateCondition": false,
      "matchValue": [
        "AzureCloud"
      ]
    }
  ],
  "action": "Block"
}
```

## Considerations

Keep the following in mind when you build rules on service tags:

- **A service tag identifies a service, not a tenant.** A tag covers every IP address that Azure service uses, across all customers of that service. Allowing a tag allows anyone who can send traffic through that service, so treat a service tag as a coarse filter rather than as an identity check.
- **Service tags alone aren't sufficient to secure traffic.** Understand what traffic a service generates before you write a rule that allows it, and keep your other protections in place alongside the rule. For more information, see [Azure service tags overview](../../virtual-network/service-tags-overview.md).
- **Prefer the narrowest tag.** A rule written against a specific service is easier to reason about, and far less likely to have unintended reach, than one written against a broad tag such as `AzureCloud`.
- **Tag contents change.** Microsoft updates the prefixes behind a tag as services add and retire addresses. This update makes service tag rules durable, but it also means the set of addresses your rule matches today isn't fixed. Changes propagate automatically; you don't need to update the rule.
- **Start in detection mode.** Deploy a new service tag rule with the **Log** action, or set the WAF policy to **Detection** mode, and review the logs before you switch to **Block**. This step is especially important for allow rules, where a mistake silently weakens your protection rather than breaking traffic in an obvious way.
- **Combine conditions to reduce blast radius.** Pairing a service tag condition with a URI path, host, or request method condition limits the rule to the traffic you intend to affect.

## Related content

- [Custom rules for Azure Web Application Firewall on Azure Front Door](waf-front-door-custom-rules.md)
- [What is AS number matching for Azure Front Door?](asn-match-condition.md)
- [What is client fingerprint matching for Azure Front Door?](client-fingerprint-match-condition.md)
- [Azure service tags overview](../../virtual-network/service-tags-overview.md)
- [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md)
- [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md)
- [Best practices for Azure Web Application Firewall on Azure Front Door](waf-front-door-best-practices.md)
