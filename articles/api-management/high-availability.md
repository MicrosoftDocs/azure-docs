---
title: Ensure reliability of your Azure API Management instance
titleSuffix: Azure API Management
description: Learn about features including availability zones and multiregion deployments to make your Azure API Management instance resilient to cloud failures.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 08/14/2024
ms.author: danlep
ms.custom: engagement-fy23, build-2024
---

# Ensure API Management availability and reliability

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

This article is an overview of service capabilities to ensure that your API Management instance continues to serve API requests if Azure outages occur. 

API Management offers the following capabilities for [reliable and resilient](../reliability/overview.md) Azure solutions. Use them individually or together to enhance availability:

* **Availability zones**: Resilience to datacenter-level outages

* **Multi-region deployment**: Resilience to regional outages

> [!NOTE]
> * Availability zones and multi-region deployment are supported in the **Premium** tier.
> * For configuration, see [Migrate API Management to availability zone support](/azure/reliability/migrate-api-mgt?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json) and [Deploy API Management in multiple regions](api-management-howto-deploy-multi-region.md).


## Availability zones

Azure availability zones are physically separate locations within an Azure region that are tolerant to datacenter-level failures. Each zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. To ensure resiliency, a minimum of 3 separate availability zones are present in all availability zone-enabled regions. [Learn more](../reliability/availability-zones-overview.md)

Enabling [zone redundancy](../reliability/migrate-api-mgt.md) for an API Management instance in a supported region provides redundancy for all [service components](api-management-key-concepts.md#api-management-components): gateway, management plane, and developer portal. Azure automatically replicates all service components across the zones that you select.

When you enable zone redundancy in a region, consider the number of API Management scale [units](upgrade-and-scale.md) that need to be distributed. Minimally, configure the same number of units as the number of availability zones, or a multiple so that the units are distributed evenly across the zones. For example, if you select 3 availability zones in a region, you could have 3 units so that each zone hosts one unit.

[!INCLUDE [api-management-az-notes](../../includes/api-management-az-notes.md)]

## Multi-region deployment

With [multi-region deployment](api-management-howto-deploy-multi-region.md), you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline. 

[!INCLUDE [api-management-multi-region-concepts](../../includes/api-management-multi-region-concepts.md)]

## Combine availability zones and multi-region deployment

The combination of availability zones for redundancy within a region, and multi-region deployments to improve the gateway availability if there's a regional outage, helps enhance both the reliability and performance of your API Management instance.

Examples:

* Use availability zones to improve the resilience of the primary region in a multi-region deployment

* Distribute scale units across availability zones and regions to enhance regional gateway performance


## SLA considerations

API Management provides an SLA of 99.99% when you deploy at least one unit in two or more availability zones or regions. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/api-management/).

> [!NOTE]
> While Azure continually strives for highest possible resiliency in SLA for the cloud platform, you must define your own target SLAs for other components of your solution.

## Backend availability

Depending on where and how your backend services are hosted, you may need to set up redundant backends in different regions to meet your requirements for service availability. You can also configure backend properties to improve the resilience and availability of your backend services.

### Regional backends

You can manage regional backends and handle failover through API Management to maintain availability. For example:  

* In multi-region deployments, use [policies to route requests](api-management-howto-deploy-multi-region.md#-route-api-calls-to-regional-backend-services) through regional gateways to regional backends. 

* Configure policies to route requests conditionally to different backends if there's backend failure in a particular region.

* Use caching to reduce failing calls.

For details, see the blog post [Back-end API redundancy with Azure API Manager](https://devblogs.microsoft.com/premier-developer/back-end-api-redundancy-with-azure-api-manager/).

### Configure backend properties for availability

API Management [backend](backends.md) entities allow you to manage and apply backend properties to improve the availability of backends. For example:

* Distribute and load-balance traffic to a [pool of URLs](backends.md#load-balanced-pool)
* Configure [circuit breaker rules](backends.md#circuit-breaker) to apply the circuit breaker pattern to protect the backend from too many requests

## Next steps

* Learn more about [reliability in Azure](../reliability/overview.md)
* Learn more about [designing reliable Azure applications](/azure/architecture/framework/resiliency/app-design)
* Read [API Management and reliability](/azure/architecture/framework/services/networking/api-management/reliability) in the Azure Well-Architected Framework
