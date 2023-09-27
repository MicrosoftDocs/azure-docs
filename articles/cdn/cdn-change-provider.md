---
title: Migrate between CDN providers
titleSuffix: Azure Content Delivery Network
description: Best practices of migrating between CDN providers
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/27/2023
ms.author: duau
---

# Migrate between CDN providers

Content Delivery Network (CDN) services can provide resiliency and add benefits for different types of workloads. Switching between CDN providers is a common practice when your web delivery requirements changes or when a different service is better suited for your business needs.

The purpose of this article is to share best practices when migrating from one CDN service to another. In this article we talk about the different Azure CDN services, how to compare these products and best practices to consider when performing the migration.

## Overview of Azure CDN profiles

**Azure Front Door:** release two new tiers (Standard and Premium) on March 29, 2022, which is the next generation Front Door service. It combines the capabilities of Azure Front Door (classic), Microsoft CDN (classic), and Web Application Firewall. With features such as private link integration, enhancements to rules engine, diagnostics, and a one-stop secure application acceleration for Azure customers. For more information about Azure Front Door, see [Front Door overview](../frontdoor/front-door-overview.md).

**Azure CDN Standard/Premium from Edgio:** is an alternative to Azure Front Door for your general CDN and media solutions. Azure CDN from Edgio is optimized for large media streaming workloads. It has unique CDN features such as cache warmup, log delivery services, and reporting features.  

**Azure CDN Standard from Akamai (Retiring October 31, 2023)**: In May of 2016, Azure partnered with Akamai Technologies Inc to offer Azure CDN Standard from Akamai. Recently, Azure and Akamai Technologies Inc have decided not to renew this partnership. As a result, starting October 31, 2023, Azure CDN Standard from Akamai will no longer be supported.

You'll still be able to manage your existing profiles until October 31. After October 31, you'll no longer be able to create a new Azure CDN Standard from Akamai profiles or modify previously created profiles.

If you don't migrate your workloads by October 31, we'll migrate your Azure CDN Standard from Akamai profile to another Azure CDN service with similar features and pricing starting November 1, 2023.

## Pricing comparison

Switching between CDN profiles may introduce changes to your content delivery overall cost. For more information about service pricing, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) and [Azure CDN pricing](https://azure.microsoft.com/pricing/details/cdn/).

## Compare Azure CDN profiles and features

For a features comparison between the different Azure CDN services, see [Compare Azure CDN product features](cdn-features.md).

## Guidance for migrating between CDN providers

The following guidance is consideration for scoping and tracking your CDN migration plans:

### Prepare

Review your existing CDN utilizations and network architecture. Including the following guidance:

*  Create an inventory of each endpoint, custom domains and their use cases.
*  Review your existing endpoint configurations and capture caching, compression rules and other applicable settings, such caching rule and their scenarios.

### Proof of concept

Create a small-scale proof of concept testing environment with your potential replacement CDN profile.

* Define success criteria:
    * Cost - does the new CDN profile meet your cost requirements?
    * Performance - does the new CDN profile meet the performance requirements of your workload?
* Create a new profile - for example, Azure CDN with Edgio.
* Configure your new profile with similar configuration settings as your existing profile.
* Fine tune caching and compression configuration settings to meet your requirements.

### Implement

Once you've completed your proof of concept testing, you can begin the migration process.

* Set up the new CDN profile for production by performing validation before the change over.
    * **Staging environment testing:** 
        * Test your workload and DNS configuration to see if it's working properly. 
        * Ensure caching is configured correctly. For example, account pages.
    * **A/B environment validation (if allowed):** 
        * Configure Traffic Manager to route traffic to the new CDN profile and compare performance and caching behavior.
* **CDN service change over:** configure DNS change to point to the new CDN CNAME. 
* **Post change monitoring:** monitor the CDN cache hit rate, origin traffic volume, any abnormal status codes, and top URLs.

> [!TIP]
> Items to verify prior to migrating production workloads
> 1. Verify configuration settings such as cache objects, TTLs and other potential custom settings at the CDN profile level are being accommodated. 
> 2. Origin application customizations are adjusted:
>    * Update Access Control List (ACL) if one is being used to allow CDN egress ranges. 
>    * Traffic management tools such as a load balancer has the correct policies and rules for the CDN.
> 3. Validate origin workloads and CDN caching performance. 
>     * Changing between CDNs can increase traffic to origin for a period of time until the new provider caches the content.

## Improve migration with Azure Traffic Manager

If you have multiple Azure CDN profiles, you can improve availability and performance using Azure Traffic Manager. You can use Traffic Manager to load balance among multiple Azure CDN endpoints for failover and geo-load balancing.

In a typical failover scenario, all client requests are directed to the primary CDN profile. If the profile is unavailable, requests are sent to the secondary profile. Requests resume to your primary profile when it becomes available again. Using Azure Traffic Manager in this manner ensures your web application is always available. 

For more information, see [Failover CDN endpoints with Traffic Manager](cdn-traffic-manager.md).

## Next Steps

* Create an [Azure Front Door](../frontdoor/create-front-door-portal.md) profile.
* Create an [Azure CDN from Edgio](cdn-create-endpoint-how-to.md) profile.
