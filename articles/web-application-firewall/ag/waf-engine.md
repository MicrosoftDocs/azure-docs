---
title: WAF engine on Azure Application Gateway
titleSuffix: Azure Web Application Firewall
description: This article provides an overview of the Azure WAF engine.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.date: 08/25/2023
ms.author: jodowns
ms.topic: conceptual
---

# WAF engine on Azure Application Gateway

The Azure Web Application Firewall (WAF) engine is the component that inspects traffic and determines whether a request includes a signature that represents a potential attack and takes appropriate action depending on the configuration.

## Next generation of WAF engine

The new WAF engine is a high-performance, scalable Microsoft proprietary engine and has significant improvements over the previous WAF engine.

The new engine, released with CRS 3.2, provides the following benefits:

* **Improved performance:** Significant improvements in WAF latency, including P99 POST and GET latencies. We observed a significant reduction in P99 tail latencies with up to approximately 8x reduction in processing POST requests and approximately 4x reduction in processing GET requests. 
* **Increased scale:** Higher requests per second (RPS), using the same compute power and with the ability to process larger request sizes. Our next-generation engine can scale up to eight times more RPS using the same compute power, and has an ability to process 16 times larger request sizes (up to 2-MB request sizes), which wasn't possible with the previous engine.
* **Better protection:** New redesigned engine with efficient regex processing offers better protection against RegEx denial of service (DOS) attacks while maintaining a consistent latency experience.
* **Richer feature set:** New features and future enhancement are available only through the new engine.

## Support for new features

There are many new features that are only supported in the Azure WAF engine. The features include:

* [CRS 3.2](application-gateway-crs-rulegroups-rules.md#owasp-crs-32)
  * Increased request body size limit to 2 MB
  * Increased file upload limit to 4 GB
* [WAF v2 metrics](application-gateway-waf-metrics.md#application-gateway-waf-v2-metrics)
* [Per rule exclusions](application-gateway-waf-configuration.md#per-rule-exclusions) and support for [exclusion attributes by name](application-gateway-waf-configuration.md#request-attributes-by-keys-and-values).
* [Increased scale limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits)
  * HTTP listeners limit
  * WAF IP address ranges per match condition
  * Exclusions limit
* [Rate-limit Custom Rules](rate-limiting-overview.md)

New WAF features are only released with later versions of CRS on the new WAF engine. 

## Request logging for custom rules

There's a difference between how the previous engine and the new WAF engine log requests when a custom rule defines the action type as *Log*.

When your WAF runs in prevention mode, the previous engine logs the request's action type as *Blocked* even though the request is allowed through by the custom rule. In detection mode, the previous engine logs the same request's action type as *Detected*.

In contrast, the new WAF engine logs the request action type as *Log*, whether the WAF is running in prevention or detection mode.

## Next steps

Learn more about [WAF managed rules](application-gateway-crs-rulegroups-rules.md).
