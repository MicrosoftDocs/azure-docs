---
title: Migrate between content delivery network providers
titleSuffix: Azure Content Delivery Network
description: Best practices of migrating between content delivery network providers
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Migrate between content delivery network providers

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

Content Delivery Network services can provide resiliency and add benefits for different types of workloads. Switching between content delivery network providers is a common practice when your web delivery requirements changes or when a different service is better suited for your business needs.

The purpose of this article is to share best practices when migrating from one content delivery network service to another. In this article we talk about the different Azure Content Delivery Network services, how to compare these products and best practices to consider when performing the migration.

<a name='overview-of-azure-cdn-profiles'></a>

## Overview of Azure Content Delivery Network profiles

**Azure Front Door:** release two new tiers (Standard and Premium) on March 29, 2022, which is the next generation Azure Front Door. It combines the capabilities of Azure Front Door (classic), Microsoft content delivery network (classic), and Web Application Firewall. With features such as private link integration, enhancements to rules engine, diagnostics, and a one-stop secure application acceleration for Azure customers. For more information about Azure Front Door, see [Azure Front Door overview](../frontdoor/front-door-overview.md).

## Pricing comparison

Switching between content delivery network profiles might introduce changes to your content delivery overall cost. For more information about service pricing, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) and [Azure content delivery network pricing](https://azure.microsoft.com/pricing/details/cdn/).

<a name='compare-azure-cdn-profiles-and-features'></a>

## Compare Azure Content Delivery Network profiles and features

For a features comparison between the different Azure Content Delivery Network services, see [Compare Azure Content Delivery Network product features](cdn-features.md).

<a name='guidance-for-migrating-between-cdn-providers'></a>

## Guidance for migrating between content delivery network providers

The following guidance is consideration for scoping and tracking your content delivery network migration plans:

### Prepare

Review your existing content delivery network utilizations and network architecture. Including the following guidance:

- Create an inventory of each endpoint, custom domains and their use cases.
- Review your existing endpoint configurations and capture caching, compression rules and other applicable settings, such caching rule and their scenarios.

### Proof of concept

Create a small-scale proof of concept testing environment with your potential replacement content delivery network profile.

- Define success criteria:
    - Cost - does the new content delivery network profile meet your cost requirements?
    - Performance - does the new content delivery network profile meet the performance requirements of your workload?
- Create a new profile.
- Configure your new profile with similar configuration settings as your existing profile.
- Fine tune caching and compression configuration settings to meet your requirements.

### Implement

Once you've completed your proof of concept testing, you can begin the migration process.

- Set up the new content delivery network profile for production by performing validation before the change over.
    - **Staging environment testing:**
        - Test your workload and DNS configuration to see whether it's working properly.
        - Ensure caching is configured correctly. For example, account pages.
    - **A/B environment validation (if allowed):**
        - Configure Traffic Manager to route traffic to the new content delivery network profile and compare performance and caching behavior.
- **CDN service change over:** configure DNS change to point to the new content delivery network CNAME.
- **Post change monitoring:** monitor the content delivery network cache hit rate, origin traffic volume, any abnormal status codes, and top URLs.

> [!TIP]
> Items to verify prior to migrating production workloads
> 1. Verify configuration settings such as cache objects, TTLs and other potential custom settings at the content delivery network profile level are being accommodated.
> 2. Origin application customizations are adjusted:
>    - Update Access Control List (ACL) if one is being used to allow content delivery network egress ranges.
>    - Traffic management tools such as a load balancer have the correct policies and rules for the content delivery network.
> 3. Validate origin workloads and content delivery network caching performance.
>     - Changing between content delivery networks can increase traffic to origin for a period of time until the new provider caches the content.

## Improve migration with Azure Traffic Manager

If you have multiple Azure Content Delivery Network profiles, you can improve availability and performance using Azure Traffic Manager. You can use Traffic Manager to load balance among multiple Azure Content Delivery Network endpoints for failover and geo-load balancing.

In a typical failover scenario, all client requests are directed to the primary content delivery network profile. If the profile is unavailable, requests are sent to the secondary profile. Requests resume to your primary profile when it becomes available again. Using Azure Traffic Manager in this manner ensures your web application is always available.

For more information, see [Failover content delivery network endpoints with Traffic Manager](cdn-traffic-manager.md).

## Next Steps

- Create an [Azure Front Door](../frontdoor/create-front-door-portal.md) profile.
