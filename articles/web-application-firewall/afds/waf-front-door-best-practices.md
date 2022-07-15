---
title: Best practices for Web Application Firewall on Azure Front Door
description: In this article, you learn about the best practices for using the web application firewall with Azure Front Door.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 07/11/2022
ms.author: jodowns

---

# Best practices for Web Application Firewall (WAF) on Azure Front Door

This article summarizes best practices for using the web application firewall (WAF) on Azure Front Door.

## General best practices

### Enable the WAF

For internet-facing applications, we recommend you enable a web application firewall (WAF) and configure it to use managed rules. By using a WAF and Microsoft-managed rules, your application is protected from a range of attacks.

### Tune your WAF

The rules in your WAF should be tuned for your workload. If you don't tune your WAF, it might accidentally block requests that should be allowed.

While you tune your WAF, consider using [detection mode](waf-front-door-policy-settings.md#waf-mode), which logs requests and the actions the WAF would normally take, but doesn't actually block any traffic.

For more information, see [Tuning Web Application Firewall (WAF) for Azure Front Door](waf-front-door-tuning.md).

### Use prevention mode

After you've tuned your WAF, you should configure it to [run in prevention mode](waf-front-door-policy-settings.md#waf-mode). By running in prevention mode, you ensure the WAF actually blocks requests that it detects are malicious. Running in detection mode is useful while you tune and configure your WAF, but provides no protection.

## Managed ruleset best practices

### Enable default rule sets

Microsoft's default rule sets are designed to protect your application by detecting and blocking common attacks. The rules are based on a variety of sources including the OWASP top 10 attack types and information from Microsoft Threat Intelligence.

For more information, see [Azure-managed rule sets](afds-overview.md#azure-managed-rule-sets).

### Enable bot management rules

Bots are responsible for a significant proportion of traffic to web applications. The WAF's bot protection rule set categorizes bots based on whether they are good, bad, or unknown. Bad bots can then be blocked, while good bots like search engine crawlers are allowed through to your application.

For more information, see [Bot protection rule set](afds-overview.md#bot-protection-rule-set).

### Use the latest ruleset versions

Microsoft regularly updates the managed rules to take account of the current thread landscape. Ensure that you regularly check for updates to Azure-managed rule sets.

For more information, see [Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md).

## Geo-filtering best practices

### Geo-filter traffic

Many web applications are designed to be used by users within a specific geographic region. If this applies to your application, consider implementing geo-filtering to block requests that come from outside of the countries you expect to receive traffic from.

For more information, see [What is geo-filtering on a domain for Azure Front Door Service?](waf-front-door-tutorial-geo-filtering.md).

### Specify the unknown (ZZ) location

Some IP addresses aren't mapped to locations in our dataset. When an IP address can't be mapped to a location, the WAF assigns the traffic to the unknown (ZZ) country. To avoid blocking valid requests from these IP addresses, consider allowing the unknown (ZZ) country through your geo-filter.

For more information, see [What is geo-filtering on a domain for Azure Front Door Service?](waf-front-door-tutorial-geo-filtering.md).

## Logging

### Save WAF logs

Front Door's WAF integrates with Azure Monitor. It's important to save the WAF logs to a destination like Log Analytics. You should review the WAF logs regularly to understand whether you need to [tune your WAF policies to reduce false-positive detections](#tune-your-waf), and to understand whether your application has been the subject of attacks.

For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).

### Send logs to Microsoft Sentinel

Microsoft Sentinel is a security information and event management (SIEM) system, which imports logs and data from a variety of sources to understand the threat landscape for your web application and overall Azure environment. The Front Door WAF logs should be imported into Microsoft Sentinel or another SIEM so that your internet-facing properties are included in its analysis.

For more information, see [Using Microsoft Sentinel with Azure Web Application Firewall](../waf-sentinel.md).

## Next steps

Learn how to [create a Front Door WAF policy](waf-front-door-create-portal.md).
