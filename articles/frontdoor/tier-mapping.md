---
title: Settings mapping between Azure Front Door (classic) and Standard/Premium tier
description: This article explains the differences between settings mapped between an Azure Front Door (classic) and Azure Front Door Standard or Premium profile.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/18/2024
ms.author: duau
---

# Settings mapped between Azure Front Door (classic) and Standard/Premium tier

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]
When migrating from Azure Front Door (classic) to Azure Front Door Standard or Premium, some configurations are changed or relocated for a better management experience. This article explains how routing rules, cache duration, rules engine configuration, WAF policy, and custom domains are mapped in the new Azure Front Door tier.

## Routing rules

| Azure Front Door (classic) settings | Mapping in Azure Front Door Standard and Premium |
|--|--|
| Route status - enable/disable | Changes to **Enable route** with a checkbox. Location remains the same. |
| Accepted protocol | Copied from Azure Front Door (classic) profile. |
| Frontend/domains | Changes to **Domains**. Copied from Azure Front Door (classic) profile. |
| Patterns to match | Copied from Azure Front Door (classic) profile. |
| Rules engine configuration | The rules engine configuration name changes to rule set but retains its association with routes from the Azure Front Door (classic) profile. |
| Route type: *Forwarding* | Backend pool changes to origin group. Forwarding protocol is copied from the Azure Front Door (classic) profile.</br> - If URL rewrite is **disabled**, the origin path in the Standard or Premium profile is *blank*.</br> - If URL rewrite is **enabled**, the *Custom forwarding path* of the Azure Front Door (classic) profile is set as the *origin path*. |
| Route type: Redirect | A URL redirect rule set called *URLRedirectMigratedRuleSet1* is created with a URL redirect rule. |

## Cache duration

In Azure Front Door (classic), the *Minimum cache duration* is configured in the routing rules settings, and the *Use default cache duration* is set in the Rules engine configuration. Azure Front Door Standard and Premium only support changing caching duration in a Rule set rule.

| Azure Front Door (classic) | Mapping in Azure Front Door Standard and Premium |
|--|--|
| Caching is **disabled** and default caching is used. | Caching is set to **disabled**. | 
| Caching is **enabled** and the default caching duration is used. | Caching is set to **enabled**, and the origin caching behavior is honored. |
| Caching is **enabled** and minimum caching duration is set. | Caching is set to **enabled** and the cache behavior is set to **override always** with the minimum cache duration from Azure Front Door (classic). |
| N/A | Caching is set to **enabled**. The caching behavior is set to override if the origin is missing, and the input cache duration is used. |

## Route configuration override in rules engine configuration

In Azure Front Door Standard and Premium, the route configuration override in a rules engine configuration from Azure Front Door (classic) is divided into three separate actions: URL redirect, URL rewrite, and route configuration override.

| Actions in rules engine configuration | Mapping in Azure Front Door Standard and Premium |
|--|--|
| Route type set to **Forward** | 1. If URL rewrite is **disabled**, all settings are copied to the Standard or Premium profile.</br>2. If URL rewrite is **enabled**, two rule actions are created: one for URL rewrite and one for the route configuration override. The *custom forwarding path* in the Azure Front Door (classic) profile is set as the **destination** for the URL rewrite action. |
| Route type set to **Redirect** | URL redirect action settings are copied over. |
| Route configuration override | Backend pool is mapped to an origin group. Caching settings remain the same. Query string is mapped to query string caching behavior, and dynamic compression is mapped to compression. |
| Use default cache duration | For more information, see the [cache duration](#cache-duration) section. |

## Next steps

* Learn more about the [Azure Front Door migration process](tier-migration.md).
* Learn how to migrate from Azure Front Door (classic) to Azure Front Door Standard or Premium using the [Azure portal](migrate-tier.md) or [Azure PowerShell](migrate-tier-powershell.md).
