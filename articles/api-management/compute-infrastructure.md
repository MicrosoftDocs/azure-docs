---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: danlep
ms.custom: 
---
# Compute platform for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about its underlying resources.

To enhance service capabilities, we're upgrading the API Management compute platform version - the Azure compute resources that host the service - for instances in several [service tiers](api-management-features.md). This article gives you context about the upgrade and the major versions of API Management's compute platform: `stv1` and `stv2`.

Most new instances created in service tiers other than the Consumption tier are hosted on the `stv2` platform. However, for existing instances hosted on the `stv1` platform, you have options to migrate to the `stv2` platform.

## What are the compute platforms for API Management?

The following table summarizes the compute platforms currently used for instances in the different API Management service tiers. 

| Version | Description | Architecture | Tiers |
| -------| ----------| ----------- | ---- |
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints, increased unit performance (see [What are the benefits of the `stv2` platform](#what-are-the-benefits-of-the-stv2-platform)) | Developer, Basic, Standard, Premium<sup>1</sup> |
| `stv1` |  Single-tenant v1 | Azure-allocated compute infrastructure |  Developer, Basic, Standard, Premium | 
| `mtv1` | Multi-tenant v1 |  Shared infrastructure that supports native autoscaling and scaling down to zero in times of no traffic |  Consumption |

<sup>1</sup> Newly created instances in these tiers and some existing instances in Developer and Premium tiers configured with virtual networks or availability zones.

> [!NOTE]
> Currently, the `stv2` platform isn't available in the US Government cloud or in the following Azure regions: China East, China East 2, China North, China North 2.

## How do I know which platform hosts my API Management instance?

Starting with API version `2021-04-01-preview`, the API Management instance exposes a read-only `platformVersion` property with this platform information. 

You can find the platform version of your instance using the portal, the API Management [REST API](/rest/api/apimanagement/current-ga/api-management-service/get), or other Azure tools.

To find the platform version in the portal:

1. Go to your API Management instance.
1. On the **Overview** page, the **Platform Version** is displayed.

    :::image type="content" source="media/compute-infrastructure/platformversion-property.png" alt-text="Screenshot of the API Management platform version in the portal.":::

## What are the benefits of the `stv2` platform?

The `stv2` platform infrastructure supports several resiliency and security features of API Management that aren't available on the `stv1` platform, including:

* [Availability zones](zone-redundancy.md)
* [Private endpoints](private-endpoint.md)
* [Protection with Azure DDoS](protect-with-ddos-protection.md)

### Improved compute infrastructure (`stv2.1`)

API Management instances hosted on the `stv2` platform are eligible for transparent migration to updated API Management hosting infrastructure with improved CPU and memory resources. Starting in March 2023, API Management instances on the `stv2` platform will be automatically updated, with zero downtime, to the higher performing `stv2.1` infrastructure over time, subject to available platform capacity in the Azure regions. 

This update will provide several benefits to API Management customers:

* Increased performance per API Management scale unit, at no additional cost
* Increased unit capacity, as measured by the capacity metric
* Reduced times to provision and scale out instances

The update from `stv2` to `stv2.1` is managed entirely by the API Management service and requires no customer action. Instances that are updated will show a `platformVersion` value of `stv2.1`.    

## How do I migrate to the `stv2` platform? 

> [!IMPORTANT]
> Support for API Management instances hosted on the `stv1` platform will be [retired by 31 August 2024](breaking-changes/stv1-platform-retirement-august-2024.md). To ensure proper operation of your API Management instance, you should migrate any instance hosted on the `stv1` platform to `stv2` before that date.

Migration steps depend on features enabled in your API Management instance. For details, see the [migration guidance](migrate-stv1-to-stv2.md):

* **Non-VNet-injected API Management instance** - Use the [Migrate to stv2](/rest/api/apimanagement/current-preview/api-management-service/migratetostv2) REST API

* **VNet-injected API Management instance** - Update the VNet connection, or enable zone redundancy

## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about enabling [availability zones](../reliability/migrate-api-mgt.md).