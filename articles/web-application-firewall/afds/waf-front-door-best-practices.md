---
title: Best practices for Azure Web Application Firewall in Azure Front Door
description: In this article, you learn about the best practices for using Azure Web Application Firewall in Azure Front Door.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 09/06/2022
ms.author: jodowns

---

# Best practices for Azure Web Application Firewall in Azure Front Door

This article summarizes best practices for using Azure Web Application Firewall in Azure Front Door.

## General best practices

This section discusses general best practices.

### Enable the WAF

For internet-facing applications, we recommend that you enable a web application firewall (WAF) and configure it to use managed rules. When you use a WAF and Microsoft-managed rules, your application is protected from a range of attacks.

### Tune your WAF

The rules in your WAF should be tuned for your workload. If you don't tune your WAF, it might accidentally block requests that should be allowed. Tuning might involve creating [rule exclusions](waf-front-door-exclusion.md) to reduce false positive detections.

While you tune your WAF, consider using [detection mode](waf-front-door-policy-settings.md#waf-mode). This mode logs requests and the actions the WAF would normally take, but it doesn't actually block any traffic.

For more information, see [Tune Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

### Use prevention mode

After you tune your WAF, configure it to [run in prevention mode](waf-front-door-policy-settings.md#waf-mode). By running in prevention mode, you ensure that the WAF blocks requests that it detects are malicious. Running in detection mode is useful while you tune and configure your WAF, but it provides no protection.

### Define your WAF configuration as code

When you tune your WAF for your application workload, you typically create a set of rule exclusions to reduce false positive detections. If you manually configure these exclusions by using the Azure portal, when you upgrade your WAF to use a newer rule-set version, you need to reconfigure the same exceptions against the new rule-set version. This process can be time consuming and error prone.

Instead, consider defining your WAF rule exclusions and other configuration as code, such as by using the Azure CLI, Azure PowerShell, Bicep, or Terraform. When you need to update your WAF rule-set version, you can easily reuse the same exclusions.

## Managed rule-set best practices

This section discusses best practices for rule sets.

### Enable default rule sets

Microsoft's default rule sets are designed to protect your application by detecting and blocking common attacks. The rules are based on various sources, including the OWASP top-10 attack types and information from Microsoft Threat Intelligence.

For more information, see [Azure-managed rule sets](afds-overview.md#azure-managed-rule-sets).

### Enable bot management rules

Bots are responsible for a significant proportion of traffic to web applications. The WAF's bot protection rule set categorizes bots based on whether they're good, bad, or unknown. Bad bots can then be blocked, while good bots like search engine crawlers are allowed through to your application.

For more information, see [Bot protection rule set](afds-overview.md#bot-protection-rule-set).

### Use the latest rule set versions

Microsoft regularly updates the managed rules to take account of the current threat landscape. Ensure that you regularly check for updates to Azure-managed rule sets.

For more information, see [Azure Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md).

## Rate limiting best practices

This section discusses best practices for rate limiting.

### Add rate limiting

The Azure Front Door WAF enables you to control the number of requests allowed from each client's IP address over a period of time. It's a good practice to add rate limiting to reduce the effect of clients accidentally or intentionally sending large amounts of traffic to your service, such as during a [retry storm](/azure/architecture/antipatterns/retry-storm/).

For more information, see the following resources:

- [What is rate limiting for Azure Front Door?](waf-front-door-rate-limit.md).
- [Configure an Azure Web Application Firewall rate limit rule by using Azure PowerShell](waf-front-door-rate-limit-configure.md).
- [Why do additional requests above the threshold configured for my rate limit rule get passed to my back-end server?](waf-faq.yml#why-do-additional-requests-above-the-threshold-configured-for-my-rate-limit-rule-get-passed-to-my-backend-server-)

### Use a high threshold for rate limits

Usually it's good practice to set your rate limit threshold to be quite high. For example, if you know that a single client IP address might send around 10 requests to your server each minute, consider specifying a threshold of 20 requests per minute.

High rate-limit thresholds avoid blocking legitimate traffic. These thresholds still provide protection against extremely high numbers of requests that might overwhelm your infrastructure.

## Geo-filtering best practices

This section discusses best practices for geo-filtering.

### Geo-filter traffic

Many web applications are designed for users within a specific geographic region. If this situation applies to your application, consider implementing geo-filtering to block requests that come from outside of the countries or regions from which you expect to receive traffic.

For more information, see [What is geo-filtering on a domain for Azure Front Door?](waf-front-door-tutorial-geo-filtering.md).

### Specify the unknown (ZZ) location

Some IP addresses aren't mapped to locations in our dataset. When an IP address can't be mapped to a location, the WAF assigns the traffic to the unknown (ZZ) country or region. To avoid blocking valid requests from these IP addresses, consider allowing the unknown (ZZ) country or region through your geo-filter.

For more information, see [What is geo-filtering on a domain for Azure Front Door?](waf-front-door-tutorial-geo-filtering.md).

## Logging

This section discusses logging.

### Add diagnostic settings to save your WAF's logs

The Azure Front Door WAF integrates with Azure Monitor. It's important to save the WAF logs to a destination like Log Analytics. You should review the WAF logs regularly. Reviewing logs helps you to [tune your WAF policies to reduce false-positive detections](#tune-your-waf) and to understand whether your application has been the subject of attacks.

For more information, see [Azure Web Application Firewall monitoring and logging](waf-front-door-monitor.md).

### Send logs to Microsoft Sentinel

Microsoft Sentinel is a security information and event management (SIEM) system, which imports logs and data from multiple sources to understand the threat landscape for your web application and overall Azure environment. Azure Front Door WAF logs should be imported into Microsoft Sentinel or another SIEM so that your internet-facing properties are included in its analysis. For Microsoft Sentinel, use the Azure WAF connector to easily import your WAF logs.

For more information, see [Use Microsoft Sentinel with Azure Web Application Firewall](../waf-sentinel.md).

## Next steps

Learn how to [create an Azure Front Door WAF policy](waf-front-door-create-portal.md).
