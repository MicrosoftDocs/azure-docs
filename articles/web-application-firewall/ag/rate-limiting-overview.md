---
title: Rate Limiting on Application Gateway
titleSuffix: Azure Web Application Firewall
description: Learn how Azure Web Application Firewall (WAF) rate limiting works on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 08/19/2026

# Customer intent: As a security analyst, I want to understand how rate limiting works in Azure Web Application Firewall on Application Gateway so that I can configure effective rules to mitigate anomalous traffic and maintain application availability.
---

# Rate limiting for Azure Web Application Firewall on Azure Application Gateway

**Applies to:** :heavy_check_mark: Application Gateway V2

Rate limiting for Web Application Firewall on Application Gateway helps you detect and block abnormally high levels of traffic destined for your application. By using rate limiting on Application Gateway WAF v2, you can mitigate many types of denial-of-service attacks, protect against clients that are misconfigured to send large volumes of requests in a short time period, or control traffic rates to your site from specific geographies.

## Rate limiting policies

Configure rate limiting by using custom WAF rules in a policy.

> [!NOTE]
> Rate limit rules are only supported on Web Application Firewalls running the [latest WAF engine](waf-engine.md). To ensure you're using the latest engine, select CRS 3.2 for the default rule set. Also, rate limit rules aren't supported in air-gapped clouds.

When you configure a rate limit rule, specify the threshold: the number of requests allowed within the specified time period. Rate limiting on Application Gateway WAF v2 uses a sliding window algorithm to determine when traffic breaches the threshold and needs to be dropped. During the first window where the threshold for the rule is breached, any more traffic matching the rate limit rule is dropped. From the second window onwards, traffic up to the threshold within the window configured is allowed, producing a throttling effect.

You must also specify a match condition, which tells the WAF when to activate the rate limit. You can configure multiple rate limit rules that match different variables and paths within your policy.

Application Gateway WAF v2 also introduces a *GroupByUserSession*, which you must configure. The *GroupByUserSession* specifies how requests are grouped and counted for a matching rate limit rule.

The following three *GroupByVariables* are currently available:
- ***ClientAddr*** – This is the default setting and it means that each rate limit threshold and mitigation applies independently to every unique source IP address.
- ***GeoLocation*** - Traffic is grouped by their geography based on a Geo-Match on the client IP address. For a rate limit rule, traffic from the same geography is grouped together.
- ***None*** - All traffic is grouped together and counted against the threshold of the Rate Limit rule. When the threshold is breached, the action triggers against all traffic matching the rule and doesn't maintain independent counters for each client IP address or geography. Use *None* with specific match conditions such as a sign-in page or a list of suspicious User-Agents.
- ***ClientAddrXFFHeader*** - Each rate limit threshold and mitigation applies independently based on the IP Address found in the X-Forwarded-For header of the HTTP Request
- ***GeoLocationXFFHeader*** - Traffic is grouped by their geography based on a Geo-Match on the IP address found in the X-Forwarded-For header of the HTTP Request. For a rate limit rule, traffic from the same geography is grouped together.

## Rate limiting details

The Web Application Firewall policy counts and tracks the configured rate limit thresholds independently for each endpoint it's attached to. For example, a single WAF policy attached to five different listeners maintains independent counters and threshold enforcement for each of the listeners.

The rate limit thresholds aren't always enforced exactly as defined, so don't use rate limiting for fine-grain control of application traffic. Instead, use it to mitigate anomalous rates of traffic and to maintain application availability.

The sliding window algorithm blocks all matching traffic for the first window in which the threshold is exceeded, and then throttles traffic in future windows. Use caution when defining thresholds when configuring wide-matching rules with either *GeoLocation* or *None* as the *GroupByVariables*. Incorrectly configured thresholds could lead to frequent short outages for matching traffic.

> [!NOTE]
> Each Application Gateway v2 instance maintains its own rate-limit counter. When multiple instances are active, they distribute incoming requests among themselves, and the rate-limit threshold applies independently to each instance.
>
> For example, consider a threshold of 400 requests per client IP per minute. If two instances receive 270 and 230 requests from the same client IP, neither instance reaches the threshold. The WAF allows the requests even though the combined request count exceeds 400. Therefore, when multiple instances are active, don't treat the configured threshold as a strict gateway-wide limit.

## Next step

> [!div class="nextstepaction"]
> [Create rate limiting custom rules for Application Gateway WAF v2](rate-limiting-configure.md)
