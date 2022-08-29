---
title: Web application firewall rate limiting for Azure Front Door
description: Learn how to use Web Application Firewall (WAF) rate limiting protecting your web applications from malicious attacks.
author: johndowns
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 08/28/2022
ms.author: jodowns
---

# What is rate limiting for Azure Front Door Service?

Rate limiting enables you to detect and block abnormally high levels of traffic from any client IP address. By using the web application firewall (WAF) with Azure Front Door, you can mitigate some types of denial of service attacks. Rate limiting also protects you against clients that have accidentally been misconfigured to send large volumes of requests in a short time period.

Rate limits are applied for each client IP address. If you have multiple clients accessing your Front Door from different IP addresses, they will each have their own rate limits applied.

## Configure a rate limit policy

Rate limiting is configured by using [custom WAF rules](./waf-front-door-custom-rules.md).

When you configure a rate limit rule, you specify the *threshold*: the number of web requests allowed from each client IP address within a one-minute duration.

> [!TIP]
> It's usually a good practice to set your rate limit threshold to be quite high. For example, if you know that a single client IP address might send around 10 requests to your server each minute, consider specifying a threshold of 20 requests per minute.
> 
> High rate limit thresholds avoid blocking legitimate traffic, while still providing protection against extremely high numbers of requests that might overwhelm your infrastructure. 

You also must specify at least one *match condition*, which tells Front Door when to activate the rate limit. You can configure multiple rate limits that apply to different paths within your application.

> [!TIP]
> If you need to apply a rate limit rule to all of your requests, consider using a match condition like the following:
> 
> If *Match type*: Size
> *Match variable*: RequestHeader
> *Header name*: Host
> *Operation*: Is
> *Operator*: Greater than
> *Match values:* 0
>
> The match condition above identifies all requests with a `Host` header of length greater than 0. Because all valid HTTP requests for Front Door contain a `Host` header, this match condition has the effect of matching all HTTP requests.

## Rate limiting and Front Door servers

Requests from the same client often arrive at the same Front Door server. In that case, you'll see requests are blocked as soon as the rate limit is reached for each client IP address.

However, it's possible that requests from the same client might arrive at a different Front Door server that has not refreshed the rate limit counter yet. For example, the client might open a new TCP connection for each request. If the threshold is low enough, the first request to the new Front Door server could pass the rate limit check. So, for a very low threshold (for example, less than about 50 requests per minute), you might see additional requests above the threshold get through.

## Next steps

- [Configure rate limiting on your Front Door WAF](waf-front-door-rate-limit-powershell.md)
