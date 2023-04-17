---
title: Azure Front Door profile mapping between Classic and Standard/Premium tier
description: This article explains the differences and settings mapping between an Azure Front Door (classic) and Standard/Premium profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 11/03/2022
ms.author: duau
---

# Mapping between Azure Front Door (classic) and Standard/Premium tier

As you migrate from Azure Front Door (classic) to Front Door Standard or Premium, you'll notice some configurations have been changed, or moved to a new location to provide a better experience when managing the Front Door profile. In this article you'll learn how routing rules, cache duration, rules engine configuration, WAF policy and custom domains gets mapped to new Front Door tiers.

## Routing rules

| Front Door (classic) settings | Mapping in Standard and Premium |
|--|--|
| Route status - Enable/disable | Same as Front Door (classic) profile. |
| Accepted protocol | Copied from Front Door (classic) profile. |
| Frontend/domains | Copied from Front Door (classic) profile. |
| Patterns to match | Copied from Front Door (classic) profile. |
| Rules engine configuration | Rules engine changes to Rule Set and will retain route association from Front Door (classic) profile. |
| Route type: Forwarding | Backend pool changes to Origin group. Forwarding protocol is copied from Front Door (classic) profile. </br> - If URL rewrite is set to `disabled`, the origin path in Standard and Premium profile is set to empty. </br> - If URL rewrite is set to `enabled`, the origin path is copied from *Custom forwarding path* of the Front Door (classic) profile. |
| Route type: Redirect | URL redirect rule gets created in Rule set. The Rule set name is called *URLRedirectMigratedRuleSet2*. |

## Cache duration

In Azure Front Door (classic), the *Minimum cache duration* is located in the routing settings and the *Use default cache duration* is located in the Rules engine. Azure Front Door Standard and Premium tier only support caching in a Rule set.

| Front Door (classic) | Front Door Standard and Premium |
|--|--|
| When caching is *disabled* and the default caching is used. | Caching is *disabled*. | 
| When caching is *enabled* and the default caching duration is used. | Caching is *enabled*, the origin caching behavior is honored. |
| Caching is *enabled*. | Caching is *enabled*.  |
| When use default cache duration is set to *No*, the input cache duration is used. | Cache behavior is set to override always and the input cache duration is used. | 
| N/A | Caching is *enabled*, the caching behavior is set to override if origin is missing, and the input cache duration is used. |

## Route configuration override in Rule engine actions

The route configuration override in Front Door (classic) is split into three different actions in rules engine for Standard and Premium profile. Those three actions are URL Redirect, URL Rewrite and Route Configuration Override.

| Actions | Mapping in Standard and Premium |
|--|--|
| Route type set to forward | 1. Forward with URL rewrites disabled. All configurations are copied to the Standard or Premium profile.</br>2. Forward with URL rewrites enabled. There will be two rule actions, one for URL rewrite and one for the route configuration override in the Standard or Premium profile.</br> For URL rewrites - </br>- Custom forwarding path in Classic profile is the same as source pattern in Standard or Premium profile.</br>- Destination from Classic profile is copied over to Standard or Premium profile. |
| Route type set to redirect | Mapping is 1:1 in the Standard or Premium profile. |
| Route configuration override | 1. Backend pool is 1:1 mapping for origin group in Standard or Premium profile.</br>2. Caching</br>- Enabling and disabling caching is 1:1 mapping in the Standard or Premium profile.</br>- Query string is 1:1 mapping in Standard or Premium profile.</br>3. Dynamic compression is 1:1 mapping in the Standard or Premium profile.
| Use default cache duration | Same as mentioned in the [Cache duration](#cache-duration) section. |

## Other configurations

| Front Door (classic) configuration | Mapping in Standard and Premium |
|--|--|
| Request and response header | Request and response header in Rules engine actions is copied over to Rule set in Standard/Premium profile. |
| Enforce certificate name check | Enforce certificate name check is supported at the profile level of Azure Front Door (classic). In a Front Door Standard or Premium profile this setting can be found in the origin settings. This configuration will apply to all origins in the migrated Standard or Premium profile. |
| Origin response time | Origin response time is copied over to the migrated Standard or Premium profile. |
| Web Application Firewall (WAF) | If the Azure Front Door (classic) profile has WAF policies associated, the migration will create a copy of WAF policies with a default name for the Standard or Premium profile. The names for each WAF policy can be changed during setup from the default names. You can also select an existing Standard or Premium WAF policy that matches the migrated Front Door profile. |
| Custom domain | This section will use `www.contoso.com` as an example to show a domain going through the migration. The custom domain `www.contoso.com` points to `contoso.azurefd.net` in Front Door (classic) for the CNAME record. </br></br>When the custom domain `www.contoso.com` gets moved to the new Front Door profile:</br>- The association for the custom domain shows the new Front Door endpoint as `contoso-hashvalue.z01.azurefd.net`. The CNAME of the custom domain will automatically point to the new endpoint name with the hash value in the backend. At this point, you can change the CNAME record with your DNS provider to point to the new endpoint name with the hash value.</br>- The classic endpoint `contoso.azurefd.net` will show as a custom domain in the migrated Front Door profile under the *Migrated domain* tab of the **Domains* page. This domain will be associated to the default migrated route. This default route can only be removed once the domain is disassociated from it. The domain properties can't be updated, for the exception of associating and removing the association from a route. The domain can only be deleted after you've changed the CNAME to the new endpoint name.</br>- The certificate state and DNS state for `www.contoso.com` is the same as the Front Door (classic) profile.</br></br> There are no changes to the managed certificate auto rotation settings. |

## Next steps

* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
* Learn how to [migrate from Classic to Standard/Premium tier](migrate-tier.md) using the Azure portal.
