---
title: Azure Front Door tier comparison
description: This article provides an overview of Azure Front Door tiers and feature differences between them.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 03/20/2022
ms.author: duau
---

# Overview of Azure Front Door tier


Azure Front Door is offered in 2 different tiers, Azure Front Door Standard and Azure Front Door Premium. Azure Front Door Standard and Premium tier combines capabilities of Azure Front Door (classic), Azure CDN Standard from Microsoft (classic), and Azure WAF into a single secure cloud CDN platform with intelligent threat protection.

:::image type="content" source="../media/tier-comparison/architecture.png" alt-text="Diagram of Azure Front Door architecture.":::

> [!NOTE]
> In order to switch between tiers, you will need to recreate the Azure Front Door profile.
> 

## Feature comparison between tiers

| Features and optimization | Standard | Premium | Classic |
|--|--|--|--|
| Static file delivery | Yes | Yes | Yes |
| Dynamic site deliver | Yes | Yes | Yes |
| Custom domains | Yes - DNS TXT record based domain validation | Yes - DNS TXT record based domain validation | Yes - CNAME based validation |
| Cache manage (purge, rules, and compression) | Yes | Yes | Yes |
| Origin load balancing | Yes | Yes | Yes |
| Path based routing | Yes | Yes | Yes |
| Rules engine | Yes | Yes | Yes |
| Server variable | Yes | Yes | No |
| Regular expression in rules engine | Yes | Yes | No |
| Expanded metrics | Yes | Yes | No |
| Advanced analytics/built-in reports | Yes | Yes - includes WAF report | No |
| Raw logs - access logs and WAF logs | Yes | Yes | Yes |
| Health probe log | Yes | Yes | No |
| Custom Web Application Firewall (WAF) rules | Yes | Yes | Yes |
| Microsoft managed rule set | No | Yes | Yes - Only default rule set 1.1 or below |
| Bot protection | No | Yes | Yes - Only bot manager rule set 1.0  |
| Private link support | No | Yes | No |
| Simplified price (base + usage) | Yes | Yes | No |
| Azure Policy integration | Yes | Yes | No |
| Azure Advisory integration | Yes | Yes | No | 

## Next steps

* Learn how to [create an Azure Front Door](create-front-door-portal.md)
* Learn how about the [Azure Front Door architecture](../front-door-routing-architecture.md)
