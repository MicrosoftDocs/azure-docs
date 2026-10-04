---
title: Client Fingerprint Match Condition for Azure Front Door
titleSuffix: Azure Web Application Firewall
description: Learn how to use the client fingerprint (JA4) match condition in Azure Web Application Firewall custom rules to identify and control traffic by TLS client characteristics.
author: halkazwini
ms.author: halkazwini
ms.reviewer: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 09/02/2026
---

# What is client fingerprint matching for Azure Front Door?

**Applies to:** :heavy_check_mark: Front Door Premium

Azure Web Application Firewall (WAF) on Azure Front Door can match requests against the client's TLS fingerprint. A TLS fingerprint describes *how* a client negotiates its TLS connection, which makes it a useful signal for identifying automated traffic that rotates IP addresses or forges request headers.

Azure Front Door WAF uses the **JA4** fingerprinting standard. You use client fingerprint matching in a custom rule by setting the match variable to `JA4` and the operator to `ClientFingerprint`.

Client fingerprint matching is most valuable in scenarios where an attacker changes IP addresses frequently but continues to use the same client software. Because the fingerprint is derived from the TLS handshake rather than from request content, it's harder to spoof than an IP address, a `User-Agent` header, or a cookie.

## How client fingerprint matching works

When a client opens a TLS connection to Azure Front Door, it sends a TLS Client Hello message that advertises the TLS version, cipher suites, extensions, signature algorithms, and negotiated application protocol it supports. The exact combination and ordering of these values is determined by the client's TLS library and configuration, not by the user.

Azure Front Door computes a JA4 fingerprint from the Client Hello and compares it against the values in your custom rule. If the fingerprint matches one of the values you specify, the match condition evaluates to true and the rule's action is applied.

Two clients that use the same TLS stack, version, and configuration produce the same fingerprint. This behavior is what makes fingerprinting effective against distributed automation, and it's also the main thing to account for when you write rules. See [Considerations](#considerations).

### JA4 fingerprint format

A JA4 fingerprint is a 36-character string made up of three underscore-separated parts:

```
t13d0512h2_cfafc68803c7_6bebaf5329ac
```

| Part | Example | Description |
| --- | --- | --- |
| `JA4_a` | `t13d0512h2` | Human-readable prefix. Transport (`t` for TCP, `q` for QUIC), TLS version (`13` for TLS 1.3), whether SNI is a domain (`d`) or an IP address (`i`), the cipher suite count, the extension count, and the first ALPN value (`h2`). |
| `JA4_b` | `cfafc68803c7` | A 12-character truncated hash of the sorted list of cipher suites. |
| `JA4_c` | `6bebaf5329ac` | A 12-character truncated hash of the sorted list of extensions and signature algorithms. |

Because `JA4_a` is human readable, you can read a fingerprint to understand the shape of a client before you decide whether to act on it. A client that advertises very few ciphers and extensions over TLS 1.3, for example, is more likely to be a scripted HTTP client than a browser.

## Configure a client fingerprint match condition

A client fingerprint match condition uses the following settings.

| Setting | Value |
| --- | --- |
| Match variable | `JA4` |
| Operator | `ClientFingerprint` |
| Match value | One or more JA4 fingerprint strings |
| Negate condition | Optional. Set to `true` to match every fingerprint *except* the ones you list. |

Match values are compared as exact strings. Partial fingerprints, wildcards, and regular expressions aren't supported by the `ClientFingerprint` operator. If you want to match on part of a fingerprint, capture the full values you care about and list them individually.

## Find the fingerprints in your traffic

Azure Front Door records the computed JA4 fingerprint for each request in the `clientJA4FingerPrint_s` log field. Use this field to discover which fingerprints are present in your traffic before you write a rule that acts on them.

To get started:

1. Enable WAF logging on your Azure Front Door profile. For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).
1. Query your logs to rank the fingerprints sending traffic to the path you're investigating.
1. Compare the fingerprints driving the abusive traffic against the fingerprints your legitimate users send.
1. Add the abusive fingerprints to a rule with the `Block` action, or add your known-good fingerprints to an `Allow` rule.

The following Kusto query lists the most common fingerprints seen over the past day, along with how many distinct client IP addresses used each one:

```kusto
AzureDiagnostics
| where Category == "FrontdoorWebApplicationFirewallLog"
| where TimeGenerated > ago(1d)
| summarize
    Requests = count(),
    DistinctClientIPs = dcount(clientIP_s)
    by clientJA4FingerPrint_s
| order by Requests desc
```

A fingerprint that accounts for a high request volume from a large number of distinct IP addresses is a strong candidate for investigation. That pattern is characteristic of distributed automation that rotates addresses while reusing one client stack.

Always confirm that a fingerprint isn't shared with a meaningful share of your legitimate users before you block it. If you're unsure, deploy the rule with the `Log` action first and review what it would have matched.

## Examples

### Block a known bot fingerprint

Suppose you identified a single JA4 fingerprint responsible for a burst of scripted traffic. The following custom rule blocks it:

```json
{
  "name": "BlockKnownBotFingerprint",
  "priority": 10,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "JA4",
      "operator": "ClientFingerprint",
      "negateCondition": false,
      "matchValue": [
        "t13d0512h2_cfafc68803c7_6bebaf5329ac"
      ]
    }
  ],
  "action": "Block"
}
```

### Protect a sensitive path with an allow list

Instead of blocking known-bad fingerprints, you can allow only known-good ones on a sensitive path. The following rule blocks any request to `/api/checkout` whose fingerprint isn't in the approved list. The `negateCondition` property inverts the fingerprint match, and both conditions must be true for the rule to match.

```json
{
  "name": "RestrictCheckoutToApprovedClients",
  "priority": 20,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "RequestUri",
      "operator": "Contains",
      "negateCondition": false,
      "matchValue": [
        "/api/checkout"
      ]
    },
    {
      "matchVariable": "JA4",
      "operator": "ClientFingerprint",
      "negateCondition": true,
      "matchValue": [
        "t13d1516h2_8daaf6152771_02713d6af862",
        "t13d1517h2_8daaf6152771_b0da82dd1658"
      ]
    }
  ],
  "action": "Block"
}
```

Use this pattern carefully. An allow list blocks every client stack you didn't anticipate, including new browser versions that ship a changed TLS configuration. Run the rule with the `Log` action first and review what it would have blocked.

### Challenge a suspicious fingerprint instead of blocking it

If you aren't confident enough to block a fingerprint outright, you can issue a JavaScript challenge instead. Legitimate browsers solve the challenge transparently, while most scripted clients fail it.

```json
{
  "name": "ChallengeSuspiciousFingerprint",
  "priority": 30,
  "ruleType": "MatchRule",
  "matchConditions": [
    {
      "matchVariable": "JA4",
      "operator": "ClientFingerprint",
      "negateCondition": false,
      "matchValue": [
        "t13d0512h2_cfafc68803c7_6bebaf5329ac"
      ]
    }
  ],
  "action": "JSChallenge"
}
```

## Considerations

Keep the following in mind when you build rules on client fingerprints:

- **A fingerprint identifies a client stack, not a user.** Every user running the same browser build on the same platform shares a fingerprint. Blocking a common browser fingerprint blocks a large number of legitimate users. Fingerprints are best used to identify unusual or purpose-built clients.
- **Fingerprints change when clients change.** Browser updates, TLS library updates, and configuration changes all produce new fingerprints. Treat fingerprint rules as something you revisit, and monitor for traffic shifting to a new fingerprint after you block one.
- **Attackers can change their fingerprint.** Fingerprinting raises the cost of automation, but a determined attacker can modify their TLS client. Use fingerprint rules as one layer alongside rate limiting, managed rule sets, and bot protection rather than as your only control.
- **Start in detection mode.** Deploy a new fingerprint rule with the `Log` action, or set the WAF policy to Detection mode, and review the logs before you switch to `Block`.
- **Combine conditions to reduce blast radius.** Pairing a fingerprint condition with a URI path, host, or request method condition limits the rule to the traffic you intend to affect.

## Related content

- [Custom rules for Azure Web Application Firewall on Azure Front Door](waf-front-door-custom-rules.md)
- [What is AS number matching for Azure Front Door?](asn-match-condition.md)
- [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md)
- [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md)
- [Best practices for Azure Web Application Firewall on Azure Front Door](waf-front-door-best-practices.md)