---
title: Azure WAF Engine on Azure Application Gateway
titleSuffix: Azure Web Application Firewall
description: This article provides an overview of the Azure WAF Engine.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.date: 04/03/2022
ms.author: jodowns
ms.topic: conceptual
---

# Azure WAF Engine on Azure Application Gateway

The Azure web application firewall (WAF) engine is the component that inspects traffic and determines whether a request includes a signature that represents a potential attack.

## ModSecurity and the Azure WAF Engine

Previously, the WAF functionality in Azure Application Gateway was implemented by using [ModSecurity](https://github.com/SpiderLabs/ModSecurity). ModSecurity provides support for its [core ruleset (CRS)](https://github.com/SpiderLabs/owasp-modsecurity-crs), which is an industry standard that has been existent for the past two decades and is mandated for protecting against the top ten OWASP attacks by many organizations. However, ModSecurity has number of drawbacks including performance issues and platform instability.

The Azure WAF Engine, released with CRS 3.2, provides significant improvements over ModSecurity:

- Improved WAF performance with significant reduction in WAF latency, ~5x improvement in the tail 99th percentile latencies
- Increased reliability with decoupling of WAF processing from Application Gateway data path

## Support for new features

There are many new features that are only supported in the Azure WAF engine.  

- [CRS 3.2](application-gateway-crs-rulegroups-rules.md#owasp-crs-32)
  - Increased request body size limit to 2MB
  - Increased file upload limit to 4GB
- WAF v2 metrics
- Per-rule exclusions
- New exclusion match variables for key and values
- Any operator in custom rules

New WAF features will only be released on the new engine.

## Performance

Below charts show some performance comparisons. Comparison is done between ModSecurity, New Engine (AzWAF), and Standard SKU (without WAF). During the test, WAF was configured in Prevention Mode. Each gateway was configured with two instances.

### Latency

The following chart shows the latency for POST requests with different payload sizes.

![TODO](../media/azure-waf-engine/latency-payload-sizes.png)

Below are two charts that show how the existing WAF engine vs new WAF engine perform against ReDOS attacks.

![TODO](../media/azure-waf-engine/latency-redos-tiny.png)

![TODO](../media/azure-waf-engine/latency-redos-giant.png)

### Requests per second

Chart below shows RPS for POST requests with different payload sizes.

![TODO](../media/azure-waf-engine/requests-per-second.png)

## Next steps

Learn more about [WAF managed rules](application-gateway-crs-rulegroups-rules.md).
