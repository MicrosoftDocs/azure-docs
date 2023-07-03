---
title: Azure Front Door tier comparison
description: This article provides a comparison between the different Azure Front Door tiers and their features.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 04/04/2023
ms.author: duau
---

# Azure Front Door tier comparison

Azure Front Door offers two different tiers, Standard and Premium. Both Azure Front Door tier combines capabilities of Azure Front Door (classic), Azure CDN Standard from Microsoft (classic), and Azure WAF into a single secure cloud CDN platform with intelligent threat protection.

:::image type="content" source="../media/tier-comparison/architecture.png" alt-text="Diagram of Azure Front Door architecture.":::

> [!NOTE]
> To switch between tiers, you will need to recreate the Azure Front Door profile. Currently in Public Preview, you can use the [**migration capability**](../migrate-tier.md) to move your existing Azure Front Door profile to the new tier. For more information about upgrading from Standard to Premium, see [**upgrade capability**](../tier-upgrade.md).
> 

## Feature comparison between tiers

| Features and optimization | Standard | Premium | Classic |
|--|--|--|--|
| Static file delivery | Yes | Yes | Yes |
| Dynamic site delivery | Yes | Yes | Yes |
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
| Private link connection to origin | No | Yes | No |
| Simplified price (base + usage) | Yes | Yes | No |
| Azure Policy integration | Yes | Yes | No |
| Azure Advisory integration | Yes | Yes | No | 

## Next steps

* Learn how to [create an Azure Front Door](create-front-door-portal.md)
* Learn how about the [Azure Front Door architecture](../front-door-routing-architecture.md)
