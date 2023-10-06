---
title: Azure Maps service geographic scope
titleSuffix: Microsoft Azure Maps
description: Learn about Azure Maps service's geographic mappings
author: eriklindeman
ms.author: eriklind
ms.date: 04/18/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, references_regions
---

# Azure Maps service geographic scope

Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are stored exclusively in the specified geographic area. For more information on Azure regions and geographies, see [Azure geographies].

## Data locations

For disaster recovery and high availability, Microsoft may replicate customer data to other regions within the same geographic area. For example, if you use the Azure Maps Europe API geographic endpoint, your requests (including input data) are kept in an Azure datacenter in Europe. The only impact is where request data is saved, it doesn't limit the locations from which the customers, or their end users, may access customer data via Azure Maps API.

## Geographic API endpoint mapping

The following table describes the mapping between geography and supported Azure geographic API endpoint. For example, if you want all Azure Maps Search Address requests to be processed and stored within the European Azure geography, use the `eu.atlas.microsoft.com` endpoint.

| Azure Geographic areas (geos) | API geographic endpoint   |
|-------------------------------|---------------------------|
| Europe                        | `eu.atlas.microsoft.com`  |
| United States                 | `us.atlas.microsoft.com`  |

> [!TIP]
> When using the Azure Government cloud, use the `atlas.azure.us` endpoint. For more information, see [Azure Government cloud support].

### URL example for geographic mapping

The following code snippet is an example of the [Search - Get Search Address] request:

```http
GET https://{geography}.atlas.microsoft.com/search/address/{format}?api-version=1.0&query={query}
```

In the previous URL, to ensure data residency remains in Europe for the Azure Maps API calls (and input data) replace {geography} with `eu`:

```http
GET https://eu.atlas.microsoft.com/search/address/{format}?api-version=1.0&query={query}
```

## Additional information

For information on limiting what regions a SAS token can use in, see [Authentication with Azure Maps].

- [Azure geographies]
- [Azure Government cloud support]

[Authentication with Azure Maps]: azure-maps-authentication.md#create-sas-tokens
[Azure geographies]: https://azure.microsoft.com/global-infrastructure/geographies
[Azure Government cloud support]: how-to-use-map-control.md#azure-government-cloud-support
[Search - Get Search Address]: /rest/api/maps/search/get-search-address
