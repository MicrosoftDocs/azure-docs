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

### Enable managed rules

TODO

### Enable bot management rules

TODO

### Use the latest ruleset versions

TODO

## Geo-filtering best practices

### Geo-filter traffic

TODO

### Specify the unknown (ZZ) location

TODO

## Logging

### Send logs to Microsoft Sentinel

TODO or another SIEM
