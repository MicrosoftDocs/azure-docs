---
title: HTTP DDoS Ruleset - Front Door WAF
description: Learn about the HTTP DDoS ruleset in Azure Front Door Web Application Firewall (WAF), including how it baselines traffic by client IP address, bot classification, and country.
author: joeolerich
ms.author: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 10/15/2026
---

# HTTP DDoS ruleset in Azure Front Door WAF

**Applies to:** ✔️ Front Door Premium

HTTP-layer floods remain the most frequent driver of application availability incidents, and static controls such as IP and geo filters or fixed rate limits often can't keep pace with distributed botnets. The HTTP DDoS ruleset is Azure Web Application Firewall's (WAF) automated layer 7 protection model that learns, detects, and defends with minimal user configuration. Once assigned, the ruleset continuously baselines normal traffic for each Azure Front Door profile and, when surges indicate an attack, selectively mitigates offending traffic with no emergency tuning required.

## How the HTTP DDoS ruleset works

Once the HTTP DDoS ruleset is applied to a policy attached to an Azure Front Door Premium profile, traffic baselines are calculated using a rolling window. For profiles that have received traffic for at least 50% of the past seven days, the ruleset calculates baselines and begins detecting spikes within 24 to 36 hours. If the Front Door profile hasn't received sufficient traffic (less than 50% of the past seven days), the ruleset won't detect or mitigate attacks until enough traffic is present to establish reliable baselines.

Request thresholds are learned at the global profile level. If a single WAF policy configured with the HTTP DDoS ruleset is assigned to multiple Azure Front Door profiles, traffic thresholds are computed separately for each profile to which the policy is attached.

The ruleset uses a two-stage design. It learns a global profile threshold, plus narrower thresholds for individual client IP addresses and, with the [geo rules](#geo-rules-preview), for countries. Until the profile threshold for requests is breached, the narrower thresholds aren't enforced. This approach prevents the ruleset from acting on traffic spikes from a few clients unless they cause the total request rate across the profile to exceed the threshold.

Each rule in the HTTP DDoS ruleset offers three sensitivity levels, each corresponding to a different threshold. A higher sensitivity setting applies a lower threshold for that rule, while a lower sensitivity setting applies a higher threshold. The default and recommended setting is medium sensitivity.

When you assign the ruleset, its rules are enabled with the **Log** action and medium sensitivity by default. Review the logs, and then set each rule's action to suit your application.

The HTTP DDoS ruleset is the first ruleset evaluated by the Azure WAF, even before the custom rules.

> [!IMPORTANT]
> Any custom rules configured with Allow action won't bypass the HTTP DDoS ruleset, but will bypass all other WAF inspections. To exempt trusted traffic from the HTTP DDoS ruleset, use [exceptions](#exempt-trusted-traffic-from-the-ruleset).

### The penalty box

Once the profile threshold is breached, any client IP address that exceeds its threshold for rule 500100 or 500110 is placed in a penalty box. While the IP address is in the penalty box, the WAF applies the rule's configured action to its requests. When the penalty box period ends, the IP address is evaluated normally again, and it returns to the penalty box if it exceeds its threshold again.

## Ruleset rules

The HTTP DDoS ruleset appears as **Microsoft_HTTPDDoSRuleSet_1.0** in the managed rules of your WAF policy and has four rules. Each rule maintains separate traffic baselines for the traffic that matches its criteria, and each is configurable with its own sensitivity and action.

| Rule ID | Rule | What it baselines | Status |
|---|---|---|---|
| 500100 | Anomaly detected on high rate of client requests | Requests from each client IP address | Generally available |
| 500110 | Suspected bots sending high rate of requests | Requests from IP addresses that Microsoft Threat Intelligence classifies as bots | Generally available |
| 500310 | Anomaly detected on high rate of requests from high-volume source geos | Requests from each of the countries that send most of your traffic | Preview |
| 500320 | Anomaly detected on high rate of requests from low-volume source geos | Combined requests from all other countries | Preview |

**Rule 500100: Anomaly detected on high rate of client requests**: This rule tracks and establishes a baseline for all traffic on the profile to which a policy is attached. When a client exceeds the established threshold, the corresponding configured action is triggered.

**Rule 500110: Suspected bots sending high rate of requests**: This rule allows you to set different sensitivity levels based on traffic classified as bots by Microsoft Threat Intelligence. For suspected bots, the default threshold is stricter than the default threshold for all other IP addresses. Bots classified as high risk are blocked immediately by this rule when the global profile threshold is breached.

Rules 500310 and 500320 are the geo rules, described in the next section.

## Geo rules (preview)

> [!IMPORTANT]
> The geo rules in the HTTP DDoS ruleset, rules 500310 and 500320, are currently in PREVIEW. The rest of the HTTP DDoS ruleset is generally available. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Per-IP thresholds work well against attacks in which each client sends a large volume of requests. They're less effective against highly distributed attacks, in which a botnet spreads its traffic across so many IP addresses that each one stays under its own threshold. The geo rules add a second layer of defense that baselines traffic by country instead of by client.

### How the geo rules work

Most applications receive the large majority of their legitimate traffic from a small number of countries. The geo rules use that pattern:

- **Rule 500310** learns a separate threshold for each high-volume country, meaning each of the countries that send most of your traffic.
- **Rule 500320** learns one combined threshold for all low-volume countries. Requests from every country outside your high-volume countries count together toward this single threshold.

For example, suppose most of a profile's traffic comes from the United States, Australia, and France. Rule 500310 learns a threshold for each of those three countries, and rule 500320 learns one threshold for the combined traffic from everywhere else. During an attack, a surge from the United States is measured against the US threshold, while an attack spread across many smaller countries is measured against the combined threshold.

The geo rules follow the same two-stage design as the rest of the ruleset: they act only after the profile's overall request rate exceeds its learned threshold. When that happens and a high-volume country's request rate exceeds its threshold, rule 500310 applies its action to requests from that country. When the combined request rate of the low-volume countries exceeds its threshold, rule 500320 applies its action to requests from any of those countries.

Keep the following behaviors in mind:

- Geo baselines are learned from approximately the past seven days of traffic and are recalculated periodically, so they follow changes in your traffic over time.
- Thresholds reflect your peak traffic rather than your average, so normal daily peaks stay below them.
- Requests from IP addresses that can't be mapped to a country are grouped as an unknown country (ZZ) and baselined like any other country.
- If a profile doesn't have enough traffic history to learn reliable country baselines, the geo rules don't take action for that profile.
- The geo rules are evaluated after rule 500100. Clients that exceed their own per-IP thresholds are handled by the per-IP rule first, and the geo rules then act on distributed traffic that stays under per-IP thresholds.

### Choose actions and sensitivity for the geo rules

A geo rule acts on a country's traffic as a whole, not on individual clients. When a geo rule matches, its action applies to legitimate users in that country as well as to attack traffic. Plan for that before you change the default action:

- **Start with the Log action.** The geo rules are enabled with the Log action by default. Review the logs across normal traffic and any spikes before you enforce them.
- **Prefer a challenge to a block.** A [JavaScript challenge](../waf-javascript-challenge.md) lets legitimate browsers through while stopping most scripted clients, which limits the effect on real users in a matched country.
- **Lower the sensitivity for expected regional spikes.** If you expect a legitimate surge from a particular country, such as a regional campaign or product launch, lower the sensitivity of the affected rule before the event.

## Exempt trusted traffic from the ruleset

A custom rule with an Allow action doesn't bypass the HTTP DDoS ruleset. To let known-good traffic such as health probes, synthetic monitoring, load tests, or partner integrations bypass the ruleset, use [WAF exceptions](front-door-exceptions.md). You can scope an exception to a specific rule in the HTTP DDoS ruleset or to the entire ruleset, and match on the remote IP address, request URI, or a request header.

Scope exceptions as narrowly as possible. For example, if a load-testing tool only needs relief from rule 500100, don't exempt it from the other rules in the ruleset.

## Monitoring the HTTP DDoS ruleset

The following monitoring options are available for the HTTP DDoS ruleset:

- When an IP address first breaches a threshold for rule 500100 or 500110, a log entry is recorded for that IP address with the rule's action, and the WAF managed rule Match metric is incremented.
- You can monitor rule matches by using the **Web Application Firewall Request count** metric and filtering by rule name. Geo rule matches are recorded under rule IDs 500310 and 500320.
- The **Web Application Firewall HTTPDDoSRuleset Is Active** metric has a value of `1` once the ruleset has completed learning and is ready to act on traffic that breaches the learned thresholds.

## Related content

- [Application (layer 7) DDoS protection](../application-ddos-protection.md)
- [Azure Front Door WAF exceptions list](front-door-exceptions.md)
- [Policy settings for Azure Front Door WAF](waf-front-door-policy-settings.md)
- [Managed rules for Azure Front Door WAF](waf-front-door-drs.md)
- [Custom rules for Azure Front Door WAF](waf-front-door-custom-rules.md)
- [Azure Web Application Firewall JavaScript challenge](../waf-javascript-challenge.md)
