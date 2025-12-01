---
title: HTTP DDoS Ruleset (Preview) - Application Gateway WAF
description: Learn about HTTP DDoS Ruleset in Application Gateway Azure Web Application Firewall (WAF).
author: joeolerich
ms.author: joeolerich
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 11/18/2025
---

# HTTP DDoS Ruleset in Azure Application Gateway WAF (preview)

> [!IMPORTANT]
> The Microsoft HTTP DDoS Ruleset in the Azure Application Gateway Web Application Firewall (WAF) v2 is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

HTTP‑layer floods remain the most frequent driver of application availability incidents, and static controls (IP/geo filters, fixed rate limits) often can't keep pace with distributed botnets. The new HTTP DDoS ruleset is Azure Web Application Firewall's (WAF) first automated layer 7 protection model that learns, detects, and defends with minimal user configuration. Once assigned, the ruleset continuously baselines normal traffic for each application gateway and when surges indicate an attack, selectively blocks offending clients with no emergency tuning required.

## How the HTTP DDoS ruleset works

Once the HTTP DDoS ruleset is applied to a policy that's attached to a gateway, traffic baselines are learned for a minimum of 24 hours. The ruleset doesn't detect or block attacks until the 24-hour learning phase is completed.

Request thresholds are learned at the global gateway level. If a single WAF policy configured with the HTTP DDoS ruleset is assigned to multiple gateways, the traffic thresholds are computed separately for each gateway to which the policy is attached.

The HTTP DDoS ruleset learns both a global gateway threshold and individual IP-based thresholds. IP-based thresholds are only enforced when the global gateway threshold for requests is exceeded. Once the gateway threshold is breached, any IP address that exceeds its learned baseline is placed in the penalty box. This design prevents the ruleset from blocking spikes from individual IP addresses when the total request rate to the gateway doesn't cross the threshold.

Each rule in the HTTP DDoS ruleset offers three sensitivity levels, each corresponding to a different threshold. A higher sensitivity setting applies a lower threshold for that rule, while a lower sensitivity setting applies a higher threshold. Medium sensitivity is the default and recommended setting.

The HTTP DDoS ruleset is the first ruleset evaluated by the Azure WAF, even before custom rules.

> [!IMPORTANT]
> Any custom rules configured with *Allow* action won't bypass the HTTP DDoS ruleset, but will bypass all other WAF inspections.

## Ruleset rules

The HTTP DDoS ruleset currently has two rules, and each can be configured with different sensitivity and action settings. Each rule maintains different traffic baselines for traffic that matches the rule criteria.

- **Rule 500100: Anomaly detected on high rate of client requests:** This rule tracks and establishes a baseline for all traffic on the Application Gateway a policy is attached to. When a client exceeds the established threshold, it's placed in the penalty box and blocked for the defined time (15 minutes).

- **Rule 501100: Suspected bots sending high rates of requests:** This rule tracks and establishes a baseline for traffic that's coming from suspected bots based on Microsoft Threat Intelligence. Generally, the thresholds for this traffic are much stricter than the thresholds for traffic in rule 500100. When bot's requests exceed the established threshold, it's placed in the penalty box and blocked for the defined time (15 minutes). Bots classified as high risk are blocked immediately by this rule when the global gateway threshold is breached.

## The penalty box

Once traffic from a client exceeds the threshold for one of the rules in the HTTP DDoS ruleset, they're placed in a penalty box for a period of time (15 minutes), and during that time the client IP is blocked by the WAF. Once the penalty box time is up, the IP will be allowed to access the site unless it exceeds the threshold again, which then will result in going back into the penalty box.

When an IP address exceeds a threshold, a rule hit for the HTTP DDoS ruleset is logged, and the IP is placed in the penalty box. Additional blocks while that IP is in the penalty box aren't logged.

## Monitoring the HTTP DDoS ruleset

- When an IP address breaches a threshold, a log entry is recorded with a *Block* action for the HTTP DDoS ruleset, and the WAF Managed Rule Match metric is incremented by one. Each subsequent blocked request from an IP in the Penalty Box is logged and increments the WAF Managed Rule Match metric.
- Two new metrics have also been introduced for Azure monitor, Penalty box size and Penalty box blocks.  These metrics track the number of IPs currently in the penalty box as well as the number of blocks that occur due to IPs in the penalty box.

## Accessing the preview

To configure the ruleset, use the [preview portal](https://preview.portal.azure.com). You can also use PowerShell, Azure CLI, ARM template, and Bicep deployments to configure the ruleset.

> [!IMPORTANT]
> The HTTP DDoS ruleset will be removed from the configuration if you make any changes to a managed ruleset using the production portal after assigning the HTTP DDoS ruleset.

## Limitations

The following limitations apply to the HTTP DDoS ruleset during the preview:

- No ability for traffic from specific IP addresses to bypass the DDoS ruleset or penalty box 

- Once HTTP DDoS ruleset is assigned to a Web Application Firewall policy, any changes made to other managed rulesets using the production portal will remove the HTTP DDoS ruleset from the WAF Policy.


## Related content

- [Azure Application Gateway WAF policy](/azure/web-application-firewall/ag/policy-overview)
- [Managed rules for Application Gateway WAF](/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules)
- [Custom rules for Application Gateway WAF](/azure/web-application-firewall/ag/custom-waf-rules-overview)

