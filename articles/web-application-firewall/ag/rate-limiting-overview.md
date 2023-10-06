---
title: Azure Web Application Firewall (WAF) rate limiting (preview)
description: This article is an overview of Azure Web Application Firewall (WAF) on Application Gateway rate limiting.
services: web-application-firewall
ms.topic: overview
author: vhorne
ms.service: web-application-firewall
ms.date: 08/16/2023
ms.author: victorh
---

# What is rate limiting for Web Application Firewall on Application Gateway (preview)?

> [!IMPORTANT]
> Rate limiting for Web Application Firewall on Application Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Rate limiting for Web Application Firewall on Application Gateway (preview) allows you to detect and block abnormally high levels of traffic destined for your application. By using rate limiting on Application Gateway WAF_v2, you can mitigate many types of denial-of-service attacks, protect against clients that have accidentally been misconfigured to send large volumes of requests in a short time period, or control traffic rates to your site from specific geographies.

## Rate limiting policies

Rate limiting is configured using custom WAF rules in a policy.

> [!NOTE]
> Rate limit rules are only supported on Web Application Firewalls running the [latest WAF engine](waf-engine.md).  In order to ensure you are using the latest engine, select CRS 3.2 for the default rule set.

When you configure a rate limit rule, you must specify the threshold: the number of requests allowed within the specified time period.  Rate limiting on Application Gateway WAF_v2 uses a sliding window algorithm to determine when traffic has breached the threshold and needs to be dropped. During the first window where the threshold for the rule is breached, any more traffic matching the rate limit rule is dropped.  From the second window onwards, traffic up to the threshold within the window configured is allowed, producing a throttling effect.

You must also specify a match condition, which tells the WAF when to activate the rate limit.  You can configure multiple rate limit rules that match different variables and paths within your policy.

Application Gateway WAF_v2 also introduces a *GroupByUserSession*, which must be configured.  The *GroupByUserSession* specifies how requests are grouped and counted for a matching rate limit rule.  

The following three *GroupByVariables* are currently available:
- *ClientAddr* – This is the default setting and it means that each rate limit threshold and mitigation applies independently to every unique source IP address.
- *GeoLocation* - Traffic is grouped by their geography based on a Geo-Match on the client IP address.  So for a rate limit rule, traffic from the same geography is grouped together.
- *None* - All traffic is grouped together and counted against the threshold of the Rate Limit rule. When the threshold is breached, the action triggers against all traffic matching the rule and doesn't maintain independent counters for each client IP address or geography.  It's recommended to use *None* with specific match conditions such as a sign-in page or a list of suspicious User-Agents.

## Rate limiting details

The configured rate limit thresholds are counted and tracked independently for each endpoint the Web Application Firewall policy is attached to.  For example, a single WAF policy attached to five different listeners maintains independent counters and threshold enforcement for each of the listeners.

The rate limit thresholds aren't always enforced exactly as defined, so it shouldn't be used for fine-grain control of application traffic. Instead, it's recommended for mitigating anomalous rates of traffic and for maintaining application availability.

The  sliding window algorithm blocks all matching traffic for the first window in which the threshold is exceeded, and then throttles traffic in future windows.  Use caution when defining thresholds for configuring wide-matching rules with either *GeoLocation* or *None* as the *GroupByVariables*. Incorrectly configured thresholds could lead to frequent short outages for matching traffic.

## Next step

- [Create rate limiting custom rules for Application Gateway WAF v2 (preview)](rate-limiting-configure.md)
