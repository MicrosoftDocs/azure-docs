---
title: HTTP DDoS Ruleset (Preview) - Front Door WAF
description: Learn about HTTP DDoS ruleset in Azure Front Door Web Application Firewall (WAF).
author: joeolerich
ms.author: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 11/18/2025
---

# HTTP DDoS Ruleset in Azure Front Door WAF (preview)

> [!IMPORTANT]
> The Microsoft HTTP DDoS Ruleset in the Azure Front Door Web Application Firewall (WAF) is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

HTTP‑layer floods remain the most frequent driver of application availability incidents, and static controls (IP/geo filters, fixed rate limits) often can’t keep pace with distributed botnets. The new HTTP DDoS ruleset is Azure Web Application Firewall's (WAF) first automated layer 7 protection model that learns, detects, and defends with minimal user configuration. Once assigned, the ruleset continuously baselines normal traffic for each Azure Front Door profile and when surges indicate an attack, selectively blocks offending clients with no emergency tuning required.

## How the HTTP DDoS ruleset works

Once the DDoS ruleset is applied to a policy attached to an Azure Front Door Premium profile, traffic baselines are calculated using a rolling window. For profiles that have received traffic for at least 50% of the past seven days, the ruleset will calculate baselines and begins detecting spikes within 24 to 36 hours. If the Front Door profile hasn't received sufficient traffic (less than 50% of the past seven days), the ruleset won't detect or block attacks until enough traffic is present to establish reliable baselines.

Request thresholds are learned at the global profile level. If a single WAF policy configured with the HTTP DDoS ruleset is assigned to multiple Azure Front Door profiles, traffic thresholds are computed separately for each profile to which the policy is attached.

The HTTP DDoS ruleset learns both a global profile threshold and a per-IP address threshold. Until the profile threshold for requests is breached, IP-based thresholds won't trigger. Once the profile threshold is breached, IP thresholds are enforced, and any IP address that exceeds its baseline is throttled at the learned baseline rate. This approach prevents the ruleset from blocking traffic spikes from a few IP addresses unless they cause the total request rate across the profile to exceed the threshold.

Each rule in the HTTP DDoS ruleset offers three sensitivity levels, each corresponding to a different threshold. A higher sensitivity setting applies a lower threshold for that rule, while a lower sensitivity setting applies a higher threshold. The default and recommended setting is medium sensitivity.

The HTTP DDoS ruleset is the first ruleset evaluated by the Azure WAF, even before the custom rules.

> [!IMPORTANT]
> Any custom rules configured with *Allow* action won't bypass the HTTP DDoS ruleset, but will bypass all other WAF inspections.

## Ruleset rules

The HTTP DDoS ruleset currently has two rules, each configurable with different sensitivity and action settings. Each rule maintains separate traffic baselines for traffic that matches its criteria.

- **Rule 500100: Anomaly detected on high rate of client requests:** This rule tracks and establishes a baseline for all traffic on the profile to which a policy is attached. When a client exceeds the established threshold, the corresponding configured action is triggered.

- **Rule 500110: Suspected bots sending high rates of requests:** This rule allows you to set different sensitivity levels based on traffic classified as bots by Microsoft Threat Intelligence. For suspected bots, the default threshold is stricter than the default threshold for all other IP addresses. Bots classified as high risk are blocked immediately by this rule when the global profile threshold is breached.

## Monitoring the HTTP DDoS ruleset

Some monitoring capabilities are limited during the preview. The following monitoring options are currently available for the HTTP DDoS ruleset:

- When an IP address first breaches a threshold, a log entry is recorded for that IP address as a *Block* action for the HTTP DDoS ruleset, and the WAF managed rule *Match* metric is incremented.

- You can monitor the number of blocks using the Web Application Firewall *Request count* metric and filter by *Rule name*.

## Accessing the preview

Currently, the HTTP DDoS Ruleset on Azure Front Door is in limited preview. To participate in the preview, fill out the [signup form](https://go.microsoft.com/fwlink/?linkid=2338493). After you submit the form, a member of the product team will contact you with further instructions.

## Limitations

The following limitations apply to the HTTP DDoS ruleset during the preview:

- There's no ability to allow traffic from specific IP addresses to bypass the DDoS ruleset or penalty box.

- After the HTTP DDoS ruleset is assigned to a WAF policy, any changes made to other managed rulesets using the production portal will remove the HTTP DDoS ruleset from the WAF policy.

## Related content

- [Policy settings for Azure Front Door WAF](/azure/web-application-firewall/afds/waf-front-door-policy-settings)
- [Managed rules for Azure Front Door WAF](/azure/web-application-firewall/afds/waf-front-door-drs)
- [Custom rules for Azure Front Door WAF](/azure/web-application-firewall/afds/waf-front-door-custom-rules)

