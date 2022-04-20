---
title: Azure Maps service geographic scope
description: Learn about Azure Maps service's geographic mappings
author: stevemunk
ms.author: v-munksteve
ms.date: 04/18/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, references_regions
---

# Azure Maps service geographic scope

Azure Maps is a geographically scoped service. Azure Maps requests are limited to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are stored exclusively in the specified geographic area. For more information on Azure regions and geographies, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies).

## Data locations

For disaster recovery and high availability, Microsoft may replicate customer data to other regions within the same geographic area. For example, if you use the Azure Maps Europe API geographic endpoint, your requests (including input data) are kept in an Azure datacenter in Europe. This only impacts where request data is saved, it doesn't limit the locations from which the customers, or their end users, may access customer data via Azure Maps API.

## Geographic and regional mapping

The table below describes the mapping between geography and supported Azure geographic API endpoint. For example, if you want all Azure Maps Search Address requests to be processed and stored within the European Azure geography, use the `eu.atlas.microsoft.com` endpoint.

| Azure Geographic areas (geos) | API geographic endpoint   |
|-------------------------------|---------------------------|
| Europe                        | `eu.atlas.microsoft.com`  |
| United States                 | `us.atlas.microsoft.com`  |

>[TIP]
> When using the Azure Government cloud, use the `atlas.azure.us` endpoint. For more information, see [Azure Government cloud support](how-to-use-map-control.md#azure-government-cloud-support).

### URL example for geographic mapping

The following is the [Data V2 - List](/rest/api/maps/data-v2/list) command:

```http
GET https://{geography}.atlas.microsoft.com/mapData?api-version=2.0
```

In the previous URl, for an Azure Maps account provisioned in the West US replace {geography} with `us`:

```http
GET https://us.atlas.microsoft.com/mapData?api-version=2.0
```

## Additional information

- [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies)
- [Azure Government cloud support](how-to-use-map-control.md#azure-government-cloud-support)
