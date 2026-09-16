---
title: AS Number Match Condition for Azure Front Door
titleSuffix: Azure Web Application Firewall
description: Learn how to use the AS number (ASN) match condition in Azure Web Application Firewall custom rules to allow or block traffic by the network that originates it.
author: halkazwini
ms.author: halkazwini
ms.reviewer: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 09/02/2026
---

# What is AS number matching for Azure Front Door?

**Applies to:** :heavy_check_mark: Front Door Premium

Azure Web Application Firewall (WAF) on Azure Front Door can match requests against the Autonomous System Number (ASN) of the client that sent them. An ASN identifies a network operated by a single organization, such as an internet service provider, a hosting or cloud provider, a university, or a large enterprise.

AS number matching lets you allow or block traffic from an entire network without maintaining lists of individual IP addresses or prefixes. You use it in a custom rule by setting the operator to `AsnMatch`.

Because ASN-to-organization assignments change far less often than the IP ranges inside them, ASN rules tend to be more stable and require less maintenance than equivalent IP-based rules.

## How AS number matching works

Azure Front Door resolves the client's IP address to the autonomous system that announces it, then compares that ASN against the values in your custom rule. If the ASN matches one of the values you specify, the match condition evaluates to true and the rule's action is applied.

The match variable you choose determines which IP address the WAF uses:

| Match variable | IP address used |
| --- | --- |
| `RemoteAddr` | The original client IP address, taken from the `X-Forwarded-For` request header. |
| `SocketAddr` | The source IP address that the WAF sees on the TCP connection. If the client is behind a proxy, this is the proxy's address. |

This is the same distinction that applies to [geo-filtering](waf-front-door-geo-filtering.md). Use `SocketAddr` when you want to act on the network that actually connected to Azure Front Door, and `RemoteAddr` when you want to act on the network of the originating client as reported by upstream proxies. `SocketAddr` is the more reliable choice when the header could be attacker-controlled.

## Configure an AS number match condition

An AS number match condition uses the following settings.

| Setting | Value |
| --- | --- |
| Match variable | `RemoteAddr` or `SocketAddr` |
| Operator | `AsnMatch` |
| Match value | One or more AS numbers, expressed as strings |
| Negate condition | Optional. Set to `true` to match every AS number *except* the ones you list. |

AS numbers are 32-bit values, so valid AS numbers range from 0 to 4294967295. Specify each AS number as a decimal string without an `AS` prefix. For example, use `"13335"`, not `"AS13335"`.

## Examples

### Block traffic from specific hosting providers

Abusive automation frequently originates from a small number of hosting and VPS providers. The following rule blocks requests from two AS numbers:

```json
{
  "name": "BlockAbusiveHostingProviders",
  "priority": 10,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "AsnMatch",
      "negateCondition": false,
      "matchValue": [
        "64496",
        "64500"
      ]
    }
  ],
  "action": "Block"
}
```

### Restrict an administrative path to a partner network

The following rule blocks any request to `/admin` that doesn't come from an approved partner network. Both conditions must be true for the rule to match, and `negateCondition` inverts the ASN check.

```json
{
  "name": "RestrictAdminToPartnerNetwork",
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
      "operator": "AsnMatch",
      "negateCondition": true,
      "matchValue": [
        "64496"
      ]
    }
  ],
  "action": "Block"
}
```

### Rate limit traffic from a network more aggressively

You can combine an ASN condition with a rate limit rule to apply a tighter threshold to networks you don't fully trust, without blocking them outright. The following rule allows 100 requests per minute from the listed AS numbers and blocks the rest of that traffic for the remainder of the window.

```json
{
  "name": "RateLimitUntrustedNetworks",
  "priority": 30,
  "ruleType": "RateLimitRule",
  "rateLimitDurationInMinutes": 1,
  "rateLimitThreshold": 100,
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "AsnMatch",
      "negateCondition": false,
      "matchValue": [
        "64496",
        "64500"
      ]
    }
  ],
  "action": "Block"
}
```

For more information about thresholds and time windows, see [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md)

### Challenge traffic from a network instead of blocking it

If a network sends a mix of legitimate and abusive traffic, a JavaScript challenge is often a better fit than an outright block:

```json
{
  "name": "ChallengeTrafficFromNetwork",
  "priority": 40,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "SocketAddr",
      "operator": "AsnMatch",
      "negateCondition": false,
      "matchValue": [
        "64496"
      ]
    }
  ],
  "action": "JSChallenge"
}
```

## Considerations

Keep the following in mind when you build rules on AS numbers:

- **Scope varies enormously between networks.** A single ASN can represent a handful of servers or millions of consumer broadband subscribers. Blocking a large consumer ISP blocks a large number of legitimate users. Check what a network actually covers before you act on it.
- **Hosting providers are the strongest candidates.** Traffic that reaches a public web application from a hosting, VPS, or cloud ASN is more likely to be automated than traffic from a consumer ISP. Those networks are usually where ASN blocking delivers the most value with the least risk.
- **Choose your match variable deliberately.** `RemoteAddr` relies on the `X-Forwarded-For` header, which a client can set. Use `SocketAddr` when the decision needs to be based on the network that actually connected.
- **Not every IP address maps to an AS number.** Requests whose client IP address can't be resolved to an ASN don't match an `AsnMatch` condition. Take this into account when you build allow list-style rules with `negateCondition`.
- **Start in detection mode.** Deploy a new ASN rule with the `Log` action, or set the WAF policy to Detection mode, and review the logs before you switch to `Block`.
- **Network ownership changes.** AS numbers are reassigned and the address space they announce changes over time. Review ASN rules periodically to confirm they still describe the traffic you intended.

## Related content

- [Custom rules for Azure Web Application Firewall on Azure Front Door](waf-front-door-custom-rules.md)
- [What is client fingerprint matching for Azure Front Door?](client-fingerprint-match-condition.md)
- [What is geo-filtering on a domain for Azure Front Door?](waf-front-door-geo-filtering.md)
- [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md)
- [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md)