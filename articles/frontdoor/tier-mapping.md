---
title: Azure Front Door profile mapping between Classic and Standard/Premium tier
description: This article explains the differences and settings mapping between an Azure Front Door (classic) and Standard/Premium profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 10/17/2022
ms.author: duau
---

# Mapping between Azure Front Door (classic) and Standard/Premium tier

## Routing rules

| Setting in Classic | Mapping in Standard and Premium |
|--|--|
| Route status - Enable/disable | Same as Classic profile. |
| Accepted protocol | Copied from Classic profile. |
| Frontend/domains | Copied from Classic profile. |
| Patterns to match | Copied from Classic profile. |
| Rules engine configuration | Changes to Rule Set and will retain association from Classic profile. |
| Route type: Forwarding | Backend pool is changed to Origin group. Forwarding protocol is copied from Classic profile. </br> - If Classic profile has URL rewrite is set to `disabled`, origin path in Standard and Premium profile is set to empty. </br> If Classic profile has URL rewrite is set to `enabled`, origin path is copied from *Custom forwarding path* from Classic profile. |
| Route type: Redirect | Created as a URL redirect rule in Rule Set. The Rule Set name is called **URLRedirectMigratedRuleSet2**. |

## Cache duration

In Azure Front Door (classic), the *Minimum cache duration* and *Use default cache duration* exist in a route and Rules engine. Azure Front Door Standard/Premium tier only supports caching in a Rule set.

| Standard and Premium | Classic |
|--|--|
| Caching = disabled</br>Caching behavior = N/A</br>Caching duration = N/A | Caching = disabled</br>Use default cache</br>Minimum cache duration = N/A |
| Caching = enable</br>Caching behavior = honor origin</br>Caching duration = N/A | Caching = enabled</br>Use default cache duration = Yes |
| Caching = enabled | Caching = enabled |
| Cache behavior = Override always</br>Cache duration = input duration | Use default cache duration = No</br>Cache duration = input duration |
| Caching = enabled</br>Caching behavior = override if origin is missing</br>Cache duration = input duration | N/A |

## Route configuration override in Rule engine actions

The route configuration override in Azure Front Door (classic) is split into three different actions in the Standard and Premium profile rules engine. Those three actions are URL Redirect, URL Rewrite and Route Configuration Override.

| Actions | Mapping in Standard and Premium |
|--|--|
| Route type set to forward | 1. Forward with URL rewrites disabled. All configurations are copied to the Standard/Premium profile.</br>2. Forward with URL rewrites enabled. There will be two rule actions, one for URL rewrite and one for Route configuration override in the Standard/Premium profile. URL rewrites -</br>a. Custom forwarding path in Classic profile is the same as source pattern in Standard/Premium profile.</br> b. Destination from Classic profile is copied over to Standard/Premium profile. |
| Route type set to redirect | Mapping is 1:1 in the Standard/Premium profile. |
| Route configuration override | - Backend pool: 
| Use default cache duration | Same as mentioned in [Cache duration](tier-mapping.md#cache-duration) section. |

## Request and Response header

Request and response header in rules engine action is copied over to rule set in Standard/Premium profile.

## Enforce certificate name check

Enforce certificate name check is supported at the profile level of Azure Front Door (classic), in a Standard/Premium profile this setting can be found in the origin settings. This configuration will apply to all origins in the migrated Standard/Premium profile.

## Origin response timeout

Origin response timeout is copied over to the migrated Standard/Premium profile.

## Web Application Firewall (WAF)

If the Azure Front Door (classic) profile have WAF policies associated, the migration will create a copy of WAF policies with default names for the Standard/Premium profile. The names for WAF policies can be changed from the default names. You can also select an existing Standard or Premium WAF policy that matches the migrated Front Door profile.

## Custom domain

This section will use `www.contoso.com` as an example to show a domain going through the migration. The custom domain `www.contoso.com` points to `contoso.azurefd.net` in Front Door (classic) for the CNAME record.

When the custom domain `www.contoso.com` gets moved to the new Front Door profile:
* The association for the custom domain shows the new Front Door endpoint as `contoso-hashvalue.z01.azurefd.net`. The CNAME of the custom domain will automatically point to the new endpoint name with the hash value in the backend. At this point, you can change the CNAME record with your DNS provider to point to the new endpoint name with the hash value.
* The classic endpoint `contoso.azurefd.net` will show as a custom domain in the migrated Front Door profile under the *Migrated domain* tab of the **Domains* page. This domain will be associated to the default migrated route. This default route can only be removed once the domain is disassociated from it. The domain properties can't be updated, for the exception of associating and removing the association from a route. The domain can only be deleted after you've changed the CNAME to the new endpoint name.
* The certificate state and DNS state for `www.contoso.com` is the same as the Front Door (classic) profile.

There are no changes to the managed certificate auto rotation settings.

## Next steps

* Learn more about the [Azure Front Door tier migration process](tier-migration.md).
* Learn how to [migrate from Classic to Standard/Premium tier](migrate-tier.md) using the Azure portal.
