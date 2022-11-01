---
title: Web application firewall rate limiting for Azure Front Door
description: Learn how to use Web Application Firewall (WAF) rate limiting protecting your web applications from malicious attacks.
author: johndowns
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 09/07/2022
ms.author: jodowns
---

# What is rate limiting for Azure Front Door Service?

Rate limiting enables you to detect and block abnormally high levels of traffic from any client IP address. By using the web application firewall (WAF) with Azure Front Door, you can mitigate some types of denial of service attacks. Rate limiting also protects you against clients that have accidentally been misconfigured to send large volumes of requests in a short time period.

Rate limits are applied for each client IP address. If you have multiple clients accessing your Front Door from different IP addresses, they'll each have their own rate limits applied.

## Configure a rate limit policy

Rate limiting is configured by using [custom WAF rules](./waf-front-door-custom-rules.md).

When you configure a rate limit rule, you specify the *threshold*: the number of web requests allowed from each client IP address within a time period of either one minute or five minutes.

You also must specify at least one *match condition*, which tells Front Door when to activate the rate limit. You can configure multiple rate limits that apply to different paths within your application.

If you need to apply a rate limit rule to all of your requests, consider using a match condition like the following example:

:::image type="content" source="../media/waf-front-door-rate-limit/match-condition-match-all.png" alt-text="Screenshot of the Azure portal showing a match condition that applies to all requests. The match condition looks for requests where the Host header size is 0 or greater." :::

The match condition above identifies all requests with a `Host` header of length greater than 0. Because all valid HTTP requests for Front Door contain a `Host` header, this match condition has the effect of matching all HTTP requests.

## Rate limits and Front Door servers

Requests from the same client often arrive at the same Front Door server. In that case, you'll see requests are blocked as soon as the rate limit is reached for each client IP address.

However, it's possible that requests from the same client might arrive at a different Front Door server that hasn't refreshed the rate limit counter yet. For example, the client might open a new TCP connection for each request. If the threshold is low enough, the first request to the new Front Door server could pass the rate limit check. So, for a very low threshold (for example, less than about 50 requests per minute), you might see some requests above the threshold get through.

## Next steps

- [Configure rate limiting on your Front Door WAF](waf-front-door-rate-limit-configure.md)
- Review [Rate limiting best practices](waf-front-door-best-practices.md#rate-limiting-best-practices)
