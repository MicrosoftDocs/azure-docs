---
title: Application (Layer 7) DDoS protection
titleSuffix: Azure Web Application Firewall
description: Learn how to use Azure Web Application Firewall with Azure Front Door or Azure Application Gateway to protect web applications against application layer (L7) DDoS attacks.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 08/13/2026
---

# Application (layer 7) DDoS protection

**Applies to:** :heavy_check_mark: Application Gateway V2 :heavy_check_mark: Front Door Premium

Azure Web Application Firewall (WAF) includes several defense mechanisms that help prevent distributed denial of service (DDoS) attacks. DDoS attacks can target both the network layer (L3/L4) and the application layer (L7). Azure DDoS Protection defends you against large network layer volumetric attacks. Azure WAF, operating at layer 7, protects web applications against L7 DDoS attacks such as HTTP floods. Together, these defenses prevent attackers from reaching your application and affecting its availability and performance.

Application layer attacks are cheap to launch and hard to distinguish from legitimate traffic: each request looks valid on its own, and it's only the aggregate rate, distribution, and client mix that reveal the attack. Effective L7 defense therefore relies less on any single control and more on a layered configuration that is already in place *before* an attack starts.

## Choose your defense layers

Use the following model when you plan L7 DDoS protection. Each layer catches traffic the layer above it doesn't.

| Layer | What it does | Where to configure it |
|---|---|---|
| Platform DDoS protection | Absorbs L3/L4 volumetric attacks on the Azure edge and on your origin public IPs | Built in by default on Azure Front Door; requires Azure DDoS Network Protection for Application Gateway public IPs and origin public IPs |
| Automated L7 mitigation | Learns your normal traffic and throttles offending clients during a surge, with no emergency tuning | HTTP DDoS ruleset (preview) on [Azure Front Door Premium](./afds/http-ddos-ruleset.md) and [Application Gateway WAF v2](./ag/ddos-ruleset.md) |
| Client verification | Separates humans and legitimate clients from automated attack traffic before blocking | [Bot Manager ruleset](./afds/waf-front-door-policy-configure-bot-protection.md), [JavaScript challenge](waf-javascript-challenge.md), [CAPTCHA](./afds/captcha-challenge.md) |
| Rate limiting | Caps how many requests any client, geography, or endpoint can send | Rate limit custom rules on Front Door and Application Gateway |
| Targeted custom rules | Blocks a known attack signature during an incident | Match custom rules (geo, IP, ASN, client fingerprint, header, URI) |
| Origin protection | Keeps attack traffic from reaching your compute at all | Caching, origin lock-down, autoscale |

## Baseline configuration checklist

Complete these steps before you're attacked. Adjust them to fit your application requirements.

1. Deploy Azure WAF with **Azure Front Door Premium** or **Application Gateway WAF v2** to protect against L7 application layer attacks.
2. Switch the WAF policy to **prevention mode**. A policy in detection mode logs only and doesn't block traffic. Verify and tune the policy against production traffic first to reduce false positives, then turn on prevention.
3. Assign the **HTTP DDoS ruleset** (available on both Azure Front Door Premium and Application Gateway WAF v2) so automated mitigation is learning your traffic baseline before you need it.
4. Enable the **Bot Manager managed ruleset** to identify and act on known bad bots.
5. Configure at least one **catch-all rate limit rule** (see [Rate limiting](#rate-limiting)).
6. **Scale up your origin** instance count so there's sufficient spare capacity, and set Application Gateway to autoscale without enforcing a low maximum instance count.
7. **Enable caching** on Azure Front Door so sudden peak traffic is absorbed at the edge instead of at your origin.
8. **Cover your L3/L4 exposure**, which differs by platform. See [Platform DDoS protection differs by platform](#platform-ddos-protection-differs-by-platform). Lock down your origin so it accepts traffic only from Azure Front Door or Application Gateway.
9. **Turn on diagnostic logging** to Log Analytics, and build the queries in [Analyze WAF and access logs](#analyze-waf-and-access-logs) *before* an incident.

## Platform DDoS protection differs by platform

L7 defenses only matter if the underlying public IP addresses survive a volumetric attack, and the two Azure WAF platforms don't start from the same place.

**Azure Front Door has platform DDoS protection by default.** Azure Front Door is a globally distributed edge service, and its edge is protected by Azure's infrastructure DDoS protection at no extra cost and with no configuration. Traffic terminates at the Front Door edge rather than at an IP address you own, so there's no public IP of yours for an attacker to target at L3/L4. That protection is inherent to the platform, so you don't purchase or enable anything to get it.

**Application Gateway needs Azure DDoS Network Protection.** An application gateway is a regional resource with a **public IP address in your own virtual network**. Azure's default infrastructure-level protection guards the Azure platform itself, but it doesn't give you tuned, per-resource mitigation, telemetry, or attack reporting for that IP. To protect the gateway's public IP against L3/L4 volumetric attacks, enable **Azure DDoS Network Protection** on the virtual network that contains it. This is a paid, separately purchased service.

Practical consequences when you choose or design a deployment:

- If you're behind Azure Front Door, budget for L7 controls; the L3/L4 edge protection is already there.
- If you're using Application Gateway and haven't enabled DDoS Network Protection, your WAF rules can be perfectly tuned and still be bypassed by a volumetric attack on the gateway's public IP. Enable it.
- In either case, **origin public IPs** you expose still need Azure DDoS Network Protection, plus lock-down so only the WAF service can reach them. A protected front end in front of an unprotected, publicly reachable origin isn't protected.

For more information, see [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md) and [Protect your application gateway with Azure DDoS Network Protection](../ddos-protection/ddos-protection-reference-architectures.md).

## Automated protection with the HTTP DDoS ruleset (preview)

Static controls such as IP filters, geo-filters, and fixed rate limits often can't keep pace with distributed botnets: the thresholds are guesses, they're always on, and you must retune them as traffic patterns evolve. The HTTP DDoS ruleset is Azure WAF's first automated layer 7 protection model that learns, detects, and defends with minimal user configuration. It's available in preview on **both** Azure Front Door Premium and Application Gateway WAF v2. Once assigned, it continuously baselines normal traffic and, when surges indicate an attack, selectively blocks offending clients with no emergency tuning required.

The design is the same on both platforms in the ways that matter most:

- **Two thresholds, evaluated together.** The ruleset learns both a global threshold (per Front Door profile, or per application gateway) and individual IP-based thresholds. IP-based thresholds are enforced only after the global threshold is breached. This design prevents the ruleset from acting on spikes from a few IP addresses unless they actually push total traffic past the norm.
- **Scoped per resource.** Thresholds are learned at the global resource level. If you assign one WAF policy with the ruleset to multiple Front Door profiles or multiple gateways, the service computes thresholds separately for each one.
- **Sensitivity.** Each rule offers three sensitivity levels. Higher sensitivity applies a lower threshold; lower sensitivity applies a higher threshold. Medium is the default and recommended setting.
- **Evaluation order.** The WAF evaluates the HTTP DDoS ruleset first, even before custom rules. A custom rule with an **Allow** action bypasses all other WAF inspection, but it doesn't bypass the HTTP DDoS ruleset.
- **Bypassing the ruleset for trusted traffic.** A custom rule with an **Allow** action doesn't help here - it bypasses every other ruleset but not the HTTP DDoS ruleset. Use **WAF exceptions** instead, which you can scope to a specific rule, rule group, or an entire managed ruleset, including the HTTP DDoS ruleset. See [Exempt trusted traffic with exceptions](#exempt-trusted-traffic-with-exceptions).
- **Requires sustained traffic.** The ruleset can only act once it learns reliable baselines. If a resource doesn't receive enough traffic during the learning phase, the ruleset won't detect or protect until it does. See the platform table for the specific requirement.

### Platform differences

| Characteristic | Azure Front Door Premium | Application Gateway WAF v2 |
|---|---|---|
| Learning phase | Baselines are calculated over a rolling window; detection begins within 24–36 hours for profiles that received traffic for at least 50% of the past seven days | Baselines are learned for a minimum of 24 hours; the ruleset doesn't detect or block until the 24-hour learning phase completes |
| Insufficient traffic | If a profile received traffic for less than 50% of the past seven days, the ruleset won't detect or block until enough traffic exists for reliable baselines | If the gateway doesn't receive enough traffic during the 24-hour learning phase to establish reliable baselines, the ruleset won't detect or block attacks until it does |
| Mitigation | Offending IP addresses are placed in a **penalty box** and blocked for the penalty box duration | Offending IP addresses are placed in a **penalty box** and blocked for 15 minutes |
| Rule IDs | 500100 (client request rate), 500110 (suspected bots) | 500100 (client request rate), 500110 (suspected bots) |
| Additional metrics | Web Application Firewall HTTPDDoSRuleset Is Active | Penalty box size, Penalty box blocks |

### Ruleset rules

The ruleset currently contains two rules. Each rule maintains its own traffic baselines and is configurable with its own sensitivity and action:

| Rule | Description |
|---|---|
| **500100**: Anomaly detected on high rate of client requests | Baselines all traffic on the Front Door profile or application gateway the policy is attached to. When a client exceeds the learned threshold, the configured action triggers and the offending IP address is placed in the penalty box. |
| **500110**: Suspected bots sending high rates of requests | Maintains separate, generally much stricter baselines for traffic classified as bots by Microsoft Threat Intelligence. Bots classified as high risk are blocked immediately once the global threshold is breached. |

### The penalty box

Both platforms mitigate through a **penalty box**. When traffic from a client exceeds the threshold for one of the ruleset's rules, that client IP address is placed in the penalty box and blocked by the WAF for the penalty box duration, which is 15 minutes on Application Gateway. When the period ends, the IP address regains access unless it breaches the threshold again, which returns it to the penalty box.

This design matters for how you read your telemetry: only the initial rule hit is logged. Additional blocked requests while the IP address is already in the penalty box aren't logged on Front Door, so log-based counts understate the number of blocked requests. On Application Gateway, use the **Penalty box blocks** metric for the true block count and **Penalty box size** for how many IP addresses are currently penalized.

### Monitoring during preview

When an IP address breaches a threshold, a log entry is recorded with a **Block** action for the HTTP DDoS ruleset and the WAF **Managed Rule Match** metric increments.

- **Front Door:** use the **Web Application Firewall Request count** metric filtered by rule name to count blocks, and the **Web Application Firewall HTTPDDoSRuleset Is Active** metric, which reports `1` once learning is complete and the ruleset is ready to act on traffic that breaches the learned thresholds.
- **Application Gateway:** each subsequent blocked request from a penalized IP address increments the Managed Rule Match metric, and the **Penalty box size** and **Penalty box blocks** metrics track the penalty box directly.

### Exempt trusted traffic with exceptions

Health probes, synthetic monitoring, load tests, partner integrations, and internal batch jobs all generate traffic that looks like a flood but isn't. Historically, there's no way to exempt them from the DDoS ruleset, because a custom **Allow** rule bypasses the Default Rule Set, Core Rule Set, and Bot Protection ruleset but deliberately doesn't bypass the HTTP DDoS ruleset.

**WAF exceptions** close that gap. An exception bypasses WAF inspection for requests matching specific attributes, scoped to a single rule, a rule group, or an entire managed ruleset. You can apply exceptions to the HTTP DDoS ruleset as well as to DRS, CRS, and Bot Protection.

Exceptions match on:

- **Remote IP address** (Equals or IP Match), which is the usual choice for exempting known monitoring, load-testing, or partner source ranges from the DDoS ruleset
- **Request URI**
- **Request header name and value**, matched with Equals, Starts with, Ends with, or Contains

Guidance for using exceptions with the DDoS ruleset:

- **Scope as narrowly as possible.** Prefer a per-rule exception over exempting the whole ruleset. A broad exception hands an attacker a documented path around your automated mitigation. If a load generator only needs relief from rule 500100, don't exempt it from 500110 too.
- **Exempt sources, not paths.** An IP-based exception for a known test harness is bounded. A URI-based exception on a public endpoint is an open door for anyone who finds it.
- **Review them on a schedule.** Exceptions added for a one-time load test might still be in place a year later.
- **Mind the limits.** Each WAF policy supports up to 60 exceptions, and each Front Door supports 60 in total across all associated policies. A single exception can contain up to 600 IP addresses, 10 URIs, or 10 request headers.
- Exceptions require the next-generation WAF engine and managed ruleset version **DRS 2.1 or later**.

Use the right tool for the job: **exclusions** skip inspection of one element of a request (a noisy cookie or header) while still inspecting the rest; **exceptions** skip specific rules or rulesets for matching requests; a **custom Allow rule** bypasses everything except the HTTP DDoS ruleset.

> [!IMPORTANT]
> WAF exceptions and the HTTP DDoS ruleset are in preview on both Azure Front Door and Application Gateway WAF v2. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Challenge before you block

Blocking is a blunt instrument during an L7 attack: attack traffic frequently arrives from IP addresses and geographies that also carry real users. Challenges let you separate automation from humans without the collateral damage of an outright block, and they're the single biggest change in how Azure WAF handles L7 floods compared to a block-only rate limit strategy.

- **JavaScript challenge** is an invisible challenge that requires no human interaction. If the browser computes the challenge successfully, WAF validates the client as a nonbot and continues evaluating the remaining rules; requests that fail are blocked. Use it as the default challenge for general web traffic. Requests to the challenge endpoint aren't forwarded to your backend and don't count toward rate limiting.
- **CAPTCHA** is an interactive challenge that requires user participation, best reserved for high-value flows such as sign-in, sign-up, and checkout, where automated abuse is expensive and a few seconds of user friction is acceptable. The challenge cookie validity is configurable in policy settings between 5 and 1,440 minutes, with a default of 30 minutes. CAPTCHA incurs additional usage-based charges.

Plan around the limitations of both features before you deploy them:

- AJAX and API calls aren't supported. Don't place challenges in front of API routes. Use rate limiting and match rules there instead.
- Challenges are designed for HTML resources, not for embedded images, CSS, or JavaScript files.
- On the first request that triggers a challenge, the POST body is limited to 64 KB on Azure Front Door and 128 KB on Application Gateway.
- Neither feature supports Internet Explorer; both support current versions of Microsoft Edge, Chrome, Firefox, and Safari.
- JavaScript challenge is reissued when a client's IP address changes and for cross-origin (CORS) requests.
- On Application Gateway, JavaScript challenge is in preview and isn't supported for rate limit custom rules. Application Gateway for Containers WAF doesn't support it.

## Rate limiting

At a minimum, create a rate limit rule that blocks a high rate of requests from any single client. Set this rule as your **lowest priority** (highest numeric value) rate limit rule, so that more specific rate limit or match rules are evaluated first.


### Azure Front Door

- Rate limits apply per **socket IP address**, which is the address of the client that opens the TCP connection to Azure Front Door and might be a proxy rather than the end user.
- Thresholds are evaluated over a **fixed window** of one or five minutes. Once the threshold is breached, Azure Front Door blocks all traffic that matches the rule for the remainder of the window. Use the **five-minute window** for HTTP flood mitigation: an attacker blocked in the first minute stays blocked for the remaining four.
- Larger windows with the smallest acceptable threshold are the most effective anti-DDoS configuration. Larger windows and larger threshold values also enforce closer to the configured threshold. At very low thresholds (under roughly 200 requests per minute), some requests above the threshold can get through, because requests from one client can land on Front Door servers whose counters aren't refreshed yet.
- Rate limit rules support only **Log** and **Block** actions; **Allow** isn't supported.
- Apply a rule to all traffic by matching on a `Host` header with a length greater than 0 because every valid request to Azure Front Door has one.


### Application Gateway WAF v2

- Rate limiting uses a **sliding window** algorithm. All matching traffic is dropped during the first window in which the threshold is breached. From the second window onward, traffic up to the threshold is allowed, producing a throttling effect rather than a full outage for matching clients.
- Rules require a **GroupByUserSession**, which controls how requests are counted. This feature lets you rate limit by something other than client IP:

  | GroupByVariable | Use it when |
  |---|---|
  | `ClientAddr` (default) | Normal case with independent counters per source IP |
  | `ClientAddrXFFHeader` | Your gateway sits behind a CDN or proxy and the real client IP is in `X-Forwarded-For` |
  | `GeoLocation` | You want to cap traffic per country/region during a geographically concentrated flood |
  | `GeoLocationXFFHeader` | Same as above, using the IP address in `X-Forwarded-For` |
  | `None` | A single shared counter for a narrowly matched pattern, such as a sign-in page or a list of suspicious user agents |

- Rate limit rules require the latest WAF engine (select CRS 3.2 or later for the default rule set) and aren't supported in air-gapped clouds.
- Application Gateway counts thresholds independently for **each endpoint** the policy is attached to. A single policy on five listeners maintains five sets of counters.
- Thresholds aren't enforced exactly, so don't use rate limiting for fine-grained traffic control. Use it to mitigate anomalous rates and maintain availability. Use particular caution with wide-matching rules that use `GeoLocation` or `None`; a badly chosen threshold can cause frequent short outages for legitimate traffic.

### Set geography-aware thresholds

A single global threshold has to be generous enough for your busiest country, which makes it far too generous everywhere else. Most applications have a strongly skewed geographic profile in peace time - a handful of countries or regions produce nearly all legitimate traffic, and the rest produce a trickle. Attack traffic rarely respects that distribution. Sizing thresholds per geography turns that asymmetry into both a detection signal and a mitigation control.

Start by measuring your peace-time distribution over at least a full week, so weekday, weekend, and time-zone effects are represented:

- On Azure Front Door, split the **Request count** metric by the **ClientCountry** dimension.
- In Log Analytics, derive the country from the client IP address in the access log:

  ```kusto
  AzureDiagnostics
  | where Category == "FrontdoorAccessLog"
  | where TimeGenerated > ago(7d)
  | extend Country = tostring(geo_info_from_ip_address(clientIp_s).country)
  | summarize Requests = count(), Clients = dcount(clientIp_s) by Country
  | extend ShareOfTraffic = round(100.0 * Requests / toscalar(
        AzureDiagnostics
        | where Category == "FrontdoorAccessLog" and TimeGenerated > ago(7d)
        | count), 2)
  | order by Requests desc
  ```

Then group the results into tiers and set a threshold for each:

| Tier | Peace-time share | Recommended treatment |
|---|---|---|
| Primary markets | The countries producing the bulk of your traffic | Generous per-client threshold, sized from that country's own p99 so real users are never affected |
| Secondary markets | Meaningful but modest traffic | Tighter per-client threshold, sized from that country's p99 rather than the global one |
| Long-tail geographies | A trickle of legitimate traffic | Aggressive threshold, or a challenge action instead of a block |
| Geographies you don't serve | Effectively zero | Block outright, or redirect to a static page |

How you implement the tiers depends on the platform:

- **Application Gateway WAF v2** - use `GroupByVariable: GeoLocation` (or `GeoLocationXFFHeader` behind a CDN or proxy) so all traffic from one geography shares a counter, and create one rate limit rule per tier with its own threshold. Because a breach acts against every client in that geography, size these thresholds conservatively and validate them in Log action first: an incorrectly configured wide-matching geo rule can cause frequent short outages for legitimate traffic.
- **Azure Front Door** - counters are per socket IP address, so build the tiers with **geo-match conditions** instead: one rate limit rule per tier, matched on the relevant countries, each with its own threshold. Every client in a long-tail geography then gets a much lower ceiling than clients in your primary markets, without one client's behavior affecting the others.

A few practices that keep this maintainable:

- Order the rules from most specific to least: primary-market rules at higher priority (lower numeric value), then secondary, then long-tail, with the global catch-all as your lowest priority rate limit rule.
- Prefer a **challenge** action over a block for long-tail geographies. Traffic from a country with little legitimate volume is suspicious in aggregate but still contains real users - travelers, VPN users, and remote employees.
- Re-measure after marketing launches, regional expansions, and major product events. A geography-aware configuration is only as good as the baseline it was sized from.
- Watch for the inverse signal during an incident: a country that normally contributes 1% of traffic suddenly contributing 40% is one of the fastest ways to confirm you're seeing an attack rather than organic growth.

### Choose a threshold from your own traffic

Use the following Log Analytics query to size the catch-all rule. For Application Gateway, replace `FrontdoorAccessLog` with `ApplicationGatewayAccessLog`.

```kusto
AzureDiagnostics
| where Category == "FrontdoorAccessLog"
| summarize count() by bin(TimeGenerated, 5m), clientIp_s
| summarize max(count_), percentile(count_, 99), percentile(count_, 95)
```

To size the per-geography thresholds described earlier, add the country to the same query:

```kusto
AzureDiagnostics
| where Category == "FrontdoorAccessLog"
| extend Country = tostring(geo_info_from_ip_address(clientIp_s).country)
| summarize count() by bin(TimeGenerated, 5m), clientIp_s, Country
| summarize max(count_), percentile(count_, 99), percentile(count_, 95) by Country
| order by percentile_count__99 desc
```

Set the threshold above the 99th percentile of peace-time traffic, not at the maximum. The maximum is usually a crawler or a misconfigured client, and sizing to it leaves the rule too generous to help during an attack.

## Custom rules for targeted mitigation

Create custom WAF rules to block or rate limit HTTP and HTTPS attacks that have identifiable signatures, such as a specific user agent, header, cookie, query string pattern, URI, or a combination of them. Beyond string matching, Azure Front Door WAF custom rules can match on:

- **Geo-location**: Block traffic from outside your service region, or redirect it to a static page.
- **Client IP address (CIDR)** and **IP restriction** lists for addresses and ranges you identified as malicious.
- **AS Number (ASN)**: Mitigate floods sourced from a hosting provider or transit network that your legitimate users don't originate from, without enumerating IP ranges.
- **Client fingerprint (JA4)**: Match on the **JA4 fingerprint**, a hash derived from the client's TLS handshake and HTTP characteristics. Because attack tooling and botnet clients produce a consistent fingerprint regardless of the IP address they send from, JA4 is one of the most durable signatures available during a distributed attack: rotating through thousands of source IP addresses doesn't change the fingerprint, and blocking or rate limiting on it takes out the whole botnet with one rule. Verify the fingerprint against your peace-time logs before you enforce on it. Popular browsers and common SDKs share fingerprints across enormous numbers of legitimate users, so an unvalidated JA4 block can be extremely broad. Deploy in **Log** action first, confirm the fingerprint appears only in attack traffic, then switch to Block or a rate limit rule.
- **Combine JA4 with other conditions** for surgical mitigation during an incident. For example, rate limit rather than block a specific JA4 fingerprint *and* an ASN you don't serve users from, or a JA4 fingerprint *and* a request URI.
- **Service tag** and **size constraints** on request components.

Two practices that matter during an incident:

- Create **Allow** match rules for known legitimate traffic to reduce false positives, and give them a higher priority (lower numeric value) than your block and rate limit rules. Remember that an Allow rule bypasses other WAF inspection but does **not** bypass the HTTP DDoS ruleset.
- Rule evaluation stops on any action except **Log**, and priority numbers must be unique. Reserve a block of low priority numbers for emergency rules so you can insert one during an attack without renumbering.

Managed rules aren't targeted at DDoS defense, but they protect against other common attacks and should stay enabled. See [Managed rules (Azure Front Door)](./afds/waf-front-door-drs.md) or [Managed rules (Application Gateway)](./ag/application-gateway-crs-rulegroups-rules.md).

## Protect the origin

- Lock down access to public IPs on the origin and restrict inbound traffic so only Azure Front Door or Application Gateway can reach it. Follow the guidance on [securing traffic to Azure Front Door origins](../frontdoor/origin-security.md).
- Ensure there are no publicly exposed IP addresses in the Application Gateway's virtual network.
- Enable caching on Azure Front Door. Cached responses absorb peak volume at the edge and reduce the request rate that reaches your origin, which is often the difference between degraded performance and an outage.
- Scale origins with headroom. Automated and manual mitigations take time to engage; spare capacity covers that gap.

## Respond to an active attack

1. **Confirm it's an attack, not organic growth.** Check the WAF and access logs for a sudden change in request rate, client IP count, geography mix, user agent distribution, and requested URIs.
2. **Check what's already mitigating.** Confirm the HTTP DDoS ruleset is active and review its blocks by rule name. On Application Gateway, check the **Penalty box size** and **Penalty box blocks** metrics as well, since only the first block per IP address appears in the logs. Review rate limit rule matches.
3. **Compare the geography mix to your baseline.** A country that normally contributes a small share of traffic suddenly dominating it is a fast, high-confidence attack signal. It also tells you which tier of rate limit rules to tighten first.
4. **Raise sensitivity before writing new rules.** Increasing HTTP DDoS ruleset sensitivity or lowering an existing rate limit threshold is faster and safer than authoring a new rule under pressure.
5. **Challenge rather than block** where the traffic is mixed. Apply JavaScript challenge to affected HTML routes, and CAPTCHA to sensitive flows.
6. **Write a targeted rule** only once you've identified a durable signature: ASN, client fingerprint, header combination, geography, or URI pattern. Deploy it in Log action first if the pattern also matches real users.
7. **Keep the origin protected** while you tune: verify caching is on, confirm origin lock-down, and scale out.
8. **After the incident,** re-baseline your rate limit thresholds against the new traffic data and keep the emergency rules that proved accurate in Log mode if you don't want them enforcing continuously.

## Analyze WAF and access logs

Monitor traffic using Azure WAF logs for anomalies, and use them to identify suspect IP addresses that send unusually high numbers of requests, unusual user agent strings, or anomalous query string patterns.


**Azure Front Door**

```kusto
AzureDiagnostics
| where Category == "FrontdoorWebApplicationFirewallLog"
```

**Azure Application Gateway**

```kusto
AzureDiagnostics
| where Category == "ApplicationGatewayFirewallLog"
```

Top talkers and top user agents over the attack window (Azure Front Door shown; substitute `ApplicationGatewayAccessLog` for Application Gateway):


```kusto
AzureDiagnostics
| where Category == "FrontdoorAccessLog"
| where TimeGenerated > ago(1h)
| summarize Requests = count() by clientIp_s
| top 20 by Requests desc
```

```kusto
AzureDiagnostics
| where Category == "FrontdoorAccessLog"
| where TimeGenerated > ago(1h)
| summarize Requests = count() by userAgent_s, requestUri_s
| top 20 by Requests desc
```

For more information, see [Azure WAF with Azure Front Door](./afds/waf-front-door-monitor.md) and [Azure WAF with Azure Application Gateway](./ag/web-application-firewall-logs.md).

## Related content

- HTTP DDoS ruleset: [Azure Front Door WAF](./afds/http-ddos-ruleset.md) | [Application Gateway WAF](./ag/ddos-ruleset.md)
- WAF exceptions list: [Azure Front Door WAF](./afds/front-door-exceptions.md) | [Application Gateway WAF](./ag/application-gateway-exceptions.md)
- Rate limiting: [Azure Front Door WAF](./afds/waf-front-door-rate-limit.md) | [Application Gateway WAF](./ag/rate-limiting-overview.md)
- WAF setup: [Azure Front Door](./afds/waf-front-door-create-portal.md) | [Application Gateway](./ag/application-gateway-web-application-firewall-portal.md)
- [Azure WAF JavaScript challenge](waf-javascript-challenge.md)
- [Azure Front Door WAF CAPTCHA](./afds/captcha-challenge.md)
- [DDoS protection on Azure Front Door](../frontdoor/front-door-ddos.md)
- [Azure DDoS Protection reference architectures](../ddos-protection/ddos-protection-reference-architectures.md)
- [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md)
