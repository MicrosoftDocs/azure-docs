---
title: Ensure reliability of your Azure API Management instance
titleSuffix: Azure API Management
description: Learn how to use Azure reliability features including availability zones and multiregion deployments to make your Azure API Management service instance resilient to cloud failures.
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 07/20/2022
ms.author: danlep
---

# Ensure API Management availability and reliability


This article introduces service capabilities and considerations to ensure that your API Management instance continues to serve API requests if Azure outages occur. 

API Management supports the following key service capabilities that are recommended for [reliable](../availability-zones/overview.md) Azure solutions. Use them individually, or together, to improve the availability of your API Management solution:

* Availability zones, to provide resilience to datacenter-level outages
* Multiregion deployment, to provide resilience to regional outages.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]


## Availability zones

Azure [availability zones](../availability-zones/az-overview.md) are physically separate locations within an Azure region that are tolerant to datacenter-level failures. To ensure resiliency, a minimum of three separate availability zones are present in all availability zone-enabled regions.


When enabling [zone redundancy](../availability-zones/migrate-api-mgt.md) for an API Management instance in a supported region, consider the number of [units] you want. Minimally, select the same number of units as the number of availability zones you want to enable, or a multiple so that the units are distributed evenly across the zones. For example, if you selected 3 units, select 3 zones so that each zone hosts one unit.

> [!NOTE]
> Use the [capacity](api-management-capacity.md) metric and your own testing to decide on the number of service units that will provide the required gateway performance. Learn more about [scaling and upgrading](upgrade-and-scale.md) your service instance.

## Multiregion deployment

With [multiregion deployment](api-management-howto-deploy-multi-regions.md), API publishers can add gateways to their API Management instance in any number of supported Azure regions. The service instance's management plane and developer portal remain hosted only in the *primary* region, the region originally used for the service deployment. Gateway configurations such as APIs and policy definitions are regularly synchronized between the gateways in the primary and secondary regions.


* Multiregion deployment ensures the availability of the API gateway in more than one region, providing service availability if one region goes offline

* API Management routes API requests to regional gateways based on lowest latency, which can reduce latency experienced by geographically distributed API consumers

* If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

* If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. 

## Availability zones

Optionally enable [zone redundancy](../availability-zones/migrate-api-mgt.md) to improve the availability and resiliency of the Primary or Secondary regions.

## SLA considerations

API Management provides an SLA of 99.99% when you deploy at least one unit in two or more availability zones or regions.

> [!NOTE]
> While Azure continually strives for highest possible resiliency in SLA for the cloud platform, you must define your own target SLAs for other components of your solution, such as backend APIs.



API Management routes the requests to a regional _gateway_ based on [the lowest latency](../traffic-manager/traffic-manager-routing-methods.md#performance). Although it is not possible to override this setting in API Management, you can use your own Traffic Manager with custom routing rules.

## Next steps

* Learn more about [resiliency in Azure](../availability-zones/overview.md)
* Learn more about [designing reliable Azure applications](/azure/architecture/framework/resiliency/app-design)