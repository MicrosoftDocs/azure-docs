---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 02/01/2023
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
| `stv2` | Single-tenant v2 | Azure-allocated compute infrastructure that supports availability zones, private endpoints | Developer, Basic, Standard, Premium<sup>1</sup> |
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

## How do I migrate to the `stv2` platform? 

> [!IMPORTANT]
> Support for API Management instances hosted on the `stv1` platform will be [retired by 31 August 2024](breaking-changes/stv1-platform-retirement-august-2024.md). To ensure proper operation of your API Management instance, you should migrate any instance hosted on the `stv1` platform to `stv2` before that date.

Migration steps depend on features enabled in your API Management instance. For details, see the [migration guidance](migrate-stv1-to-stv2.md):

* **Non-VNet-injected API Management instance** - Use the [Migrate to stv2](/rest/api/apimanagement/current-preview/api-management-service/migratetostv2) REST API

* **VNet-injected API Management instance** - Update the VNet connection, or enable zone redundancy

## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about enabling [availability zones](../reliability/migrate-api-mgt.md).