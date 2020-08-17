---
title: Azure Web Application Firewall on Application Gateway - frequently asked questions
description: This article provides answers to frequently asked questions about Web Application Firewall on Application Gateway
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: article
ms.date: 05/05/2020
ms.author: victorh
---

# Frequently asked questions for Azure Web Application Firewall on Application Gateway

This article answers common questions about Azure Web Application Firewall (WAF)  on Application Gateway features and functionality. 

## What is Azure WAF?

Azure WAF is a web application firewall that helps protect your web applications from common threats such as SQL injection, cross-site scripting, and other web exploits. You can define a WAF policy consisting of a combination of custom and managed rules to control access to your web applications.

An Azure WAF policy can be applied to web applications hosted on Application Gateway or Azure Front Doors.

## What features does the WAF SKU support?

The WAF SKU supports all the features available in the Standard SKU.

## How do I monitor WAF?

Monitor WAF through diagnostic logging. For more information, see [Diagnostic logging and metrics for Application Gateway](../../application-gateway/application-gateway-diagnostics.md).

## Does detection mode block traffic?

No. Detection mode only logs traffic that triggers a WAF rule.

## Can I customize WAF rules?

Yes. For more information, see [Customize WAF rule groups and rules](application-gateway-customize-waf-rules-portal.md).

## What rules are currently available for WAF?

WAF currently supports CRS [2.2.9](application-gateway-crs-rulegroups-rules.md#owasp229), [3.0](application-gateway-crs-rulegroups-rules.md#owasp30), and [3.1](application-gateway-crs-rulegroups-rules.md#owasp31). These rules provide baseline security against most of the top-10 vulnerabilities that Open Web Application Security Project (OWASP) identifies: 

* SQL injection protection
* Cross-site scripting protection
* Protection against common web attacks such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion attack
* Protection against HTTP protocol violations
* Protection against HTTP protocol anomalies such as missing host user-agent and accept headers
* Prevention against bots, crawlers, and scanners
* Detection of common application misconfigurations (that is, Apache, IIS, and so on)

For more information, see [OWASP top-10 vulnerabilities](https://owasp.org/www-project-top-ten/).

## Does WAF support DDoS protection?

Yes. You can enable DDoS protection on the virtual network where the application gateway is deployed. This setting ensures that the Azure DDoS Protection service also protects the application gateway virtual IP (VIP).


## Next steps

- Learn about [Azure Web Application Firewall](../overview.md).
- Learn more about [Azure Front Door](../../frontdoor/front-door-overview.md).
