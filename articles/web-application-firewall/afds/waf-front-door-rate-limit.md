---
title: Web application firewall rate limiting for Azure Front Door
description: Learn how to use web application firewall rate limiting to protect your web applications from malicious attacks.
author: johndowns
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 04/20/2023
ms.author: jodowns
---

# What is rate limiting for Azure Front Door?

Rate limiting enables you to detect and block abnormally high levels of traffic from any socket IP address.
By using Azure Web Application Firewall in Azure Front Door, you can mitigate some types of denial-of-service attacks. Rate limiting also protects you against clients that have accidentally been misconfigured to send large volumes of requests in a short time period.

The socket IP address is the address of the client that initiated the TCP connection to Azure Front Door. Typically, the socket IP address is the IP address of the user, but it might also be the IP address of a proxy server or another device that sits between the user and Azure Front Door.

You can define rate limits at the socket IP address level or the remote address level. If you have multiple clients that access Azure Front Door from different socket IP addresses, they each have their own rate limits applied. The socket IP address is the source IP address the web application firewall (WAF) sees. If your user is behind a proxy, the socket IP address is often the proxy server address. The remote address is the original client IP that's usually sent via the `X-Forwarded-For` request header.

## Configure a rate limit policy

Rate limiting is configured by using [custom WAF rules](./waf-front-door-custom-rules.md).

When you configure a rate limit rule, you specify the *threshold*. The threshold is the number of web requests that are allowed from each socket IP address within a time period of either one minute or five minutes.

You also must specify at least one *match condition*, which tells Azure Front Door when to activate the rate limit. You can configure multiple rate limits that apply to different paths within your application.

If you need to apply a rate limit rule to all your requests, consider using a match condition like the following example:

:::image type="content" source="../media/waf-front-door-rate-limit/match-condition-match-all.png" alt-text="Screenshot that shows the Azure portal showing a match condition that applies to all requests. The match condition looks for requests where the Host header size is zero or greater." :::

The preceding match condition identifies all requests with a `Host` header of a length greater than `0`. Because all valid HTTP requests for Azure Front Door contain a `Host` header, this match condition has the effect of matching all HTTP requests.

## Rate limits and Azure Front Door servers

Requests from the same client often arrive at the same Azure Front Door server. In that case, you see requests are blocked as soon as the rate limit is reached for each of the client IP addresses.

It's possible that requests from the same client might arrive at a different Azure Front Door server that hasn't refreshed the rate limit counters yet. For example, the client might open a new TCP connection for each request, and each TCP connection could be routed to a different Azure Front Door server.

If the threshold is low enough, the first request to the new Azure Front Door server could pass the rate limit check. So, for a low threshold (for example, less than about 200 requests per minute), you might see some requests above the threshold get through.

A few considerations to keep in mind while you determine threshold values and time windows for rate limiting:

- Larger window size and smaller thresholds are most effective in preventing against DDoS attacks.
- Setting larger time window sizes (for example, five minutes over one minute) and larger threshold values (for example, 200 over 100) tend to be more accurate in enforcing close to rate limits thresholds than using the shorter time window sizes and lower threshold values.

## Next steps

- Configure [rate limiting on your Azure Front Door WAF](waf-front-door-rate-limit-configure.md).
- Review [rate limiting best practices](waf-front-door-best-practices.md#rate-limiting-best-practices).
