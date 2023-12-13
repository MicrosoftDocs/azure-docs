---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance. Instances in the dedicated service tiers of API Management are hosted on the stv1 or stv2 compute platform.
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: danlep
ms.custom:
---

# Compute platform for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about its underlying resources.

To enhance service capabilities, we're upgrading the API Management compute platform version - the Azure compute resources that host the service - for instances in several [service tiers](api-management-features.md). This article gives you context about the upgrade and the major versions of API Management's compute platform: `stv1` and `stv2`.

Most new instances created in service tiers other than the Consumption tier are hosted on the `stv2` platform. However, for existing instances hosted on the `stv1` platform, you have options to migrate to the `stv2` platform.

## What are the compute platforms for API Management?

The following table summarizes the compute platforms currently used in the **Consumption**, **Developer**, **Basic**, **Standard**, and **Premium** tiers of API Management.  

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` or `stv2.1`<sup>1</sup>| Single-tenant v2 | Azure-allocated compute infrastructure that supports added resiliency and security features. See [What are the benefits of the `stv2` platform?](#what-are-the-benefits-of-the-stv2-platform) in this article. | Developer, Basic, Standard, Premium<sup>2</sup> |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium |
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

<sup>1</sup> `stv2.1` infrastructure provides higher performing CPU, increased RAM, and greater API Management capacity. Instances hosted on `stv2` platform may migrate automatically to `stv2.1` based on regional infrastructure availability. Customers cannot initiate migration from `stv2` to `stv2.1`.<br/>
<sup>2</sup> Newly created instances in these tiers and some existing instances in Developer and Premium tiers configured with virtual networks or availability zones.

> [!NOTE]
> Currently, the `stv2` platform isn't available in the following Azure regions: China East, China East 2, China North, China North 2.
> 
> Also, as Qatar Central is a recently established Azure region, only the `stv2` platform is supported for API Management services deployed in this region.

## How do I know which platform hosts my API Management instance?

Starting with API version `2021-04-01-preview`, the API Management instance exposes a read-only `platformVersion` property with this platform information. 

You can find the platform version of your instance using the portal, the API Management [REST API](/rest/api/apimanagement/current-ga/api-management-service/get), or other Azure tools.

To find the platform version in the portal:

1. Sign in to the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the **Overview** page, under **Essentials**, the **Platform Version** is displayed.

    :::image type="content" source="media/compute-infrastructure/platformversion-property.png" alt-text="Screenshot of the API Management platform version in the portal.":::

## What are the benefits of the `stv2` platform?

The `stv2` platform infrastructure supports several resiliency and security features of API Management that aren't available on the `stv1` platform, including:

* [Availability zones](zone-redundancy.md)
* [Private endpoints](private-endpoint.md)
* [Protection with Azure DDoS](protect-with-ddos-protection.md)


## How do I migrate to the `stv2` platform? 

> [!IMPORTANT]
> Support for API Management instances hosted on the `stv1` platform will be [retired by 31 August 2024](breaking-changes/stv1-platform-retirement-august-2024.md). To ensure proper operation of your API Management instance, you should migrate any instance hosted on the `stv1` platform to `stv2` before that date.

Migration steps depend on features enabled in your API Management instance. If the instance isn't injected in a VNet, you can use a migration API. For instances that are VNet-injected, follow manual steps. For details, see the [migration guide](migrate-stv1-to-stv2.md).

## What about the v2 pricing tiers?

The v2 pricing tiers are a new set of tiers for API Management currently in preview. Hosted on a new, highly scalable and available Azure infrastructure that's different from the `stv1` and `stv2` compute platforms, the v2 tiers aren't affected by the retirement of the `stv1` platform.

The v2 tiers are designed to make API Management accessible to a broader set of customers and offer flexible options for a wider variety of scenarios. For more information, see [v2 tiers overview](v2-service-tiers-overview.md).

## Next steps

* [Migrate an API Management instance to the stv2 platform](migrate-stv1-to-stv2.md).
* Learn more about [upcoming breaking changes](breaking-changes/overview.md) in API Management.

