---
title: Settings mapping between Azure Front Door (classic) and Standard/Premium tier
description: This article explains the differences between settings mapped between an Azure Front Door (classic) and Azure Front Door Standard or Premium profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/24/2023
ms.author: duau
---

# Settings mapped between Azure Front Door (classic) and Standard/Premium tier

When you migrate your Azure Front Door (classic) to Azure Front Door Standard or Premium, you'll notice some configurations have been either changed, or relocated to provide a better experience when managing your Front Door profile. In this article you'll learn how routing rules, cache duration, rules engine configuration, WAF policy and custom domains are mapped in the new Front Door tier.

## Routing rules

| Front Door (classic) settings | Mapping in Front Door Standard and Premium |
|--|--|
| Route status - enable/disable | Changes to **Enable route** with checkbox. Location remains the same. |
| Accepted protocol | Copied from Front Door (classic) profile. |
| Frontend/domains | Changes to **Domains**. Copied from Front Door (classic) profile. |
| Patterns to match | Copied from Front Door (classic) profile. |
| Rules engine configuration | The rules engine configuration name changes to rule set but will retain its association to routes from the Front Door (classic) profile. |
| Route type: *Forwarding* | Backend pool changes to origin group. Forwarding protocol is copied from the Front Door (classic) profile. </br> - If URL rewrite is set to **disabled**, the origin path in Standard or Premium profile is *blank*. </br> - If URL rewrite is set to **enabled**, the *Custom forwarding path* of the Front Door (classic) profile is set as the *origin path*. |
| Route type: Redirect | A URL redirect rule set gets created called *URLRedirectMigratedRuleSet1* with a URL redirect rule. |

## Cache duration

In Azure Front Door (classic), the *Minimum cache duration* is configured in the routing rules settings and the *Use default cache duration* is set in the Rules engine configuration. Azure Front Door Standard and Premium only supports changing caching duration in a Rule set rule.

| Front Door (classic) | Mapping in Front Door Standard and Premium |
|--|--|
| Caching is **disabled** and default caching is used. | Caching is set to **disabled**. | 
| Caching is **enabled** and the default caching duration is used. | Caching is set  to **enabled**, the origin caching behavior is honored. |
| Caching is **enabled** and minimum caching duration is set. | Caching is set to **enabled** and the cache behavior is set to **override always** with the minimum cache duration from Front Door (classic).  |
| N/A | Caching is set to **enabled**. The caching behavior is set to override if the origin is missing, and the input cache duration gets used. |

## Route configuration override in rules engine configuration

The route configuration override in a rules engine configuration action for Front Door (classic) is split into three different actions in a Rule set rule for Azure Front Door Standard and Premium. Those three actions are URL redirect, URL rewrite and route configuration override.

| Actions in rules engine configuration | Mapping in Front Door Standard and Premium |
|--|--|
| Route type set to **Forward** | 1. If URL rewrite is **disabled**, all settings are copied over to the Standard or Premium profile.</br>2. If URL rewrite is **enabled**, two rule actions will be created. One for URL rewrite and one for the route configuration override setting. For the URL rewrite action, the *custom forwarding path* in Front Door (classic) profile is set to the **destination**. |
| Route type set to **Redirect** | URL redirect action settings are copied over. |
| Route configuration override | Backend pool is mapped to an origin group. Enabling caching remains the same. Query string is mapped to query string caching behavior, dynamic compression is mapped to compression.
| Use default cache duration | For more information, see [cache duration](#cache-duration) section. |

## Other configurations

| Front Door (classic) configuration | Mapping in Front Door Standard and Premium |
|--|--|
| Request and response header | Request and response header in Rules engine actions is copied over to Rule set. |
| Enforce certificate name check | Enforce certificate name check is supported at the profile level of an Azure Front Door (classic). In Azure Front Door Standard or Premium profile this setting can be found in the origin settings. This configuration gets applied to all origins in the migrated profile. |
| Origin response time | Origin response time gets copied over to the migrated profile. |
| Web Application Firewall (WAF) | If the Azure Front Door (classic) profile has WAF policies associated, the migration will create a copy of each WAF policy for the respective tier migrating to. Names for each WAF policy can be changed during prepare phase of the migration. You can also select an existing Front Door Standard or Premium WAF policy that matches the migrated Front Door profile. |
| Custom domain | This section will use `www.contoso.com` as an example to show what happens to a domain going through the migration. The custom domain `www.contoso.com` points to `contoso.azurefd.net` in the Front Door (classic) as a CNAME record. </br></br>When `www.contoso.com` gets moved to the new Front Door profile:</br>- The association for the custom domain shows the new Front Door endpoint as `contoso-<hashvalue>.z01.azurefd.net`. The CNAME of the custom domain will automatically point to the new endpoint name with the hash value in the backend. At this point, you can change the CNAME record with your DNS provider to point to the new endpoint name with the hash value.</br>- The classic endpoint `contoso.azurefd.net` will show as a custom domain in the migrated Front Door profile under the *Migrated domain* tab of the **Domains* page. This domain will be associated to the default migrated route. This default route can only be removed once the domain is disassociated from it. The domain properties can't be updated, except for when associating and removing the association from a route. The domain can only be deleted after you've changed the CNAME to the new endpoint name.</br>- The certificate state and DNS state for `www.contoso.com` will be consistent as the Front Door (classic) profile.</br></br> No changes are made the managed certificate auto rotation settings. |

## Next steps

* Learn more about the [Azure Front Door migration process](tier-migration.md).
* Learn how to [migrate from Azure Front Door (classic) to Azure Front Door Standard or Premium](migrate-tier.md) using the Azure portal.
* Learn how to [migrate from Azure Front Door (classic) to Azure Front Door Standard or Premium](migrate-tier-powershell.md) using the Azure PowerShell.
