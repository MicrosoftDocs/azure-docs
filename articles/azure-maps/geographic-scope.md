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

Azure Maps has several geographically scoped services and offers a resource provider API that, given an Azure region, creates an instance of Azure Maps data deployed at the geographical level. The mapping from an Azure region to geography happens behind the scenes as described in the table below. For more information on Azure regions and geographies, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies).

## Data locations

For disaster recovery and high availability, Microsoft may replicate customer data to other regions only within the same geographic area. For example, if you use the Azure Maps Europe API geographic endpoint, your requests and input data within the requests will only reside in an Azure datacenter in Europe and not in some other region (i.e.: United States). Regardless, no matter which geography the customer selected, Microsoft doesn’t control or limit the locations from which the customers, or their end users, may access customer data via Azure Maps API.

## Geographic and regional mapping

The following table describes the mapping between geography and supported Azure geographic API endpoint. For example, if you want all of your Azure Maps Search Address requests to be processed and stored within the European Azure geography then all API calls to the Azure Maps Search Address service must be made to eu.atlas.microsoft.com/search/address.

| Azure Geographic areas (geos) | Azure datacenters (regions) | API geographic endpoint   |
|-------------------------------|-----------------------------|---------------------------|
| Europe                        | West Europe, North Europe   | `eu.atlas.microsoft.com`  |
| United States                 | West US 2, East US 2        | `us.atlas.microsoft.com`  |

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
