---
title: Azure CDN Standard from Akamai retirement FAQ
titleSuffix: Azure Content Delivery Network
description: Common questions about the retirement of Azure CDN Standard from Akamai.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Azure CDN Standard from Akamai retirement FAQ

Azure CDN Standard from Akamai was a product of a partnership between Azure and Akamai Technologies Inc. that began in May 2016. This partnership ended in 2023, and Azure CDN Standard from Akamai was no longer supported on October 31, 2023.

To reduce customer inconvenience, Azure CDN product engineering started an automigration process for active Azure CDN Standard from Akamai profiles to Azure CDN Standard from Edgio on November 1, 2023. Inactive Azure CDN Standard from Akamai profiles will be retained until March 31, 2024, but their endpoints will stop resolving to a CDN node after December 31, 2023.

## Frequently asked questions

### What is considered an active CDN profile?

An active CDN profile is one that has CDN endpoints with traffic records in the last 90 days. CDN endpoints that have no traffic records for more than 90 days are considered inactive and unused.

### How can I tell if my profile was migrated?

You can identify migrated profiles by the informational portal banner that says this profile was moved to Azure CDN Standard from Edgio. The provider field of the profile also displays Edgio instead of Akamai. Profiles that didn't migrate have a different informational portal banner that says Azure CDN from Akamai is no longer supported. The provider field of the profile still shows Akamai.

### What are the consequences of not taking any actions on my Azure CDN from Akamai resource before December 31, 2023?

Profiles that remain with Akamai are preserved but their endpoints stop resolving. The endpoint names will be reserved for the profile for possible future reuse. Preserved profiles will be deleted after March 31, 2024.

### I no longer need the Azure CDN from Akamai profile, what should I do?

Only deletion is allowed for inactive Akamai profiles. Other changes aren't permitted.

### Where can I find more migration support resources?

For further assistance, submit a support ticket. Our support team is happy to help. The automigration process can only transfer Azure CDN from Akamai profiles to Azure CDN Standard from Edgio, as they have the same pricing and features. To migrate to Azure Front Door, you need to do it manually. Automigration might not work for complex workloads that involve multi-CDN and a cloud load balancer. You might need engineering support for such cases.

### How do I troubleshoot my new CDN profile?

Contact support for any issues or assistance with Azure CDN from Edgio.

For Azure Traffic Manager users with Multi-CDN:

- If you registered an Edgio profile for your custom domain, you can delete your Akamai profile as your migration is complete.
- Else, you need an extra TXT token validation to enable HTTPS with managed certificate. Contact support for further assistance.

> [!TIP]
> Items to validate related migration:
> - HTTPS with Managed Certificate. To provision a managed certificate, you must CNAME your custom domain to an `azureedge.net` endpoint. If you have changed the CNAME of your custom domain, check your HTTPS status and wait for the provisioning to complete.
> - Azure CDN Standard from Edgio offers enhanced reporting and origin configuration options. You can access them by selecting the **Managed** button.

## Next steps

- Create an [Azure Front Door](../frontdoor/create-front-door-portal.md) profile.
- Create an [Azure CDN from Edgio](cdn-create-endpoint-how-to.md) profile.
