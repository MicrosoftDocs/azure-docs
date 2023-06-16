---
title: Application DDoS protection
titleSuffix: Azure Web Application Firewall
description:
author: duongau
ms.author: duau
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 06/16/2023
---

# Application DDoS protection

The frequency of DDoS attacks is increasing, especially layer 7 (L7) DDoS attacks that target a weakness in the processing code of a website’s origin servers.  Azure WAF has several defense mechanisms that can help to prevent distributed denial of service (DDoS) attacks at L7. These defenses can prevent attackers from reaching your application and affecting your application's availability and performance.

## How can you protect your services?

These attacks can be mitigated through hardening the service layer or Web Application Firewall (WAF) or placing DDoS in front of the service to filter out bad requests. The following steps are focused on immediate actions that your team should take to harden your security posture and defend against attacks to your services hosted on Azure. These steps are a generalized list and need to be adjusted to fit your service.

* Deploy [Azure Web Application Firewall (WAF)](../overview.md) with Azure Front Door Premium or Application Gateway WAF v2 SKU to protect against L7 application layer attacks.  
* Scale up your origin instance count so that there's sufficient spare capacity by following safe deployment guidelines.
* Enable [Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md) on the origin virtual network to protect your public IPs against layer 3(L3) and layer 4(L4) DDoS attacks. Azure’s DDoS offerings can automatically protect most sites from L3 and L4 volumetric attacks that send large numbers of packets towards a website. We also offer infrastructure level protection to all sites hosted on Azure by default.

## Azure WAF with Azure Front Door

Azure WAF has many features that can be used to mitigate many different types of attacks, including DDoS:

* Using the bot protection managed rule set provides protection against known bad bots. For more information, see [Configuring bot protection](../afds/waf-front-door-policy-configure-bot-protection.md).

* Rate limiting can be applied to prevent IP addresses from calling your service too frequently. For more information, see [Rate limiting](../afds/waf-front-door-rate-limit.md).

* IP addresses and ranges that you identify as malicious can be blocked. For more information, see [IP restrictions](../afds/waf-front-door-configure-ip-restriction.md).

* Traffic from outside a defined geographic region, or within a defined region, can be blocked or redirected to a static webpage. For more information, see [Geo-filtering](../afds/waf-front-door-geo-filtering.md).

* You can create [custom WAF rules](../afds/waf-front-door-custom-rules.md) to automatically block and rate limit HTTP or HTTPS attacks that have known signatures.

* Using the managed rule set provides protection against many other common attacks. For more information, see [Managed rules](../afds/waf-front-door-drs.md) to learn more about various attacks types that these rules can help protect against.

Beyond WAF, Azure Front Door also offers default Azure Infrastructure DDoS protection to protect against L3/4 DDoS attacks. Enabling caching on AFD can help absorb sudden peak traffic volume at edge and protect backend origins from attack as well. 

For more information on features and DDoS protection on Azure Front Door, see [DDoS protection on Azure Front Door](../frontdoor/front-door-ddos.md).

# Azure WAF with Azure Application Gateway

It's recommended to use Application Gateway WAF v2 SKU that comes with latest features, including DDoS mitigation features, to defend against DDoS attacks.  

Application Gateway WAF SKUs can be used to mitigate many L7 DDoS attacks:

* Using the bot protection managed rule set provides protection against known bad bots. For more information, see [Configuring bot protection](../ag/bot-protection.md).

* IP addresses and ranges that you identify as malicious can be blocked. For more information, see examples at  [Create and use v2 custom rules](../ag/create-custom-waf-rules.md).

* Traffic from outside a defined geographic region, or within a defined region, can be blocked or redirected to a static webpage. For more information, examples at  [Create and use v2 custom rules](../ag/create-custom-waf-rules.md).

* You can create [custom WAF rules](../ag/configure-waf-custom-rules.md) to automatically block and rate limit HTTP or HTTPS attacks that have known signatures.

* Using the managed rule set provides protection against many other common attacks. For more information, see [Managed rules](../ag/application-gateway-crs-rulegroups-rules.md) to learn more about various attacks types that these rules can help protect against.

## Other considerations

Switch WAF policy to prevention mode. Deploying the policy in detection mode operates in the log only mode, doesn't block traffic. After you verified and tested your WAF policy with production traffic and tuned to reduce any false positives, you should turn policy to Prevention mode (block/defend mode). 

Monitor traffic using Azure WAF logs for any anomalies. You can create custom rules to block any offending traffic – suspected IPs sending unusually high number of requests, unusual user-agent string, anomalous query string patterns etc.

You can bypass the WAF for known legitimate traffic by creating Match Custom Rules with the action of Allow to reduce false positive. These rules should be configured with a high priority (lower numeric value) than other block and rate limit rules.

Depending on your traffic pattern, create a preventive rate limit rule (only applies to Azure Front Door). For example, you can configure a rate limit rule to not allow any single *Client IP address* to send more than XXX traffic per window to your site. Azure Front Door supports two fixed windows for tracking requests, 1 and 5 minutes. It's recommended to use the 5-minute window for better mitigation of HTTP Flood attacks. For example, **Configure a Rate Limit Rule**, which blocks any *Source IP* that exceeds 100 requests in a 5-minute window. This rule should be the lowest priority rule (Priority is ordered with 1 being the highest priority), so that more specific Rate Limit rules or Match rules can be created to match before this rule.

The following Log Analytics query can be helpful in determining the threshold you should use for the above rule.

```
AzureDiagnostics
| where Category == "FrontdoorAccessLog"
| summarize count() by bin(TimeGenerated, 5m), clientIp_s
| summarize max(count_), percentile(count_, 99), percentile(count_, 95)
```

## Monitor attacks through WAF logs

You can analyze WAF logs in Log Analytics with the following query:

### Azure Front Door

```
AzureDiagnostics
| where Category == "FrontdoorWebApplicationFirewallLog"
```

For more information, see [Azure WAF with Azure Front Door](../afds/waf-front-door-monitor.md).

### Azure Application Gateway

```
AzureDiagnostics
| where Category == "ApplicationGatewayFirewallLog"
```

For more information, see [Azure WAF with Azure Application Gateway](../ag/application-gateway-waf-logs.md).

## Next steps

* [Create a WAF policy](../afds/waf-front-door-create-portal.md) for Azure Front Door.
* [Create an Application Gateway](../ag/application-gateway-web-application-firewall-portal.md) with a Web Application Firewall.

* Learn how Azure Front Door can help [protect against DDoS attacks](../frontdoor/front-door-ddos.md).
* Protect your application gateway with [Azure DDoS Network Protection](../application-gateway/tutorial-protect-application-gateway-ddos.md).
* Learn more about the [Types of attacks Azure DDoS Protection mitigates](../ddos-protection/types-of-attacks.md).
