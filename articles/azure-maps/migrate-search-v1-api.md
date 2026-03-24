---
title: Migrate Azure Maps Search 1.0 APIs
titleSuffix: Microsoft Azure Maps
description: Learn how to migrate from Azure Maps Search service version 1 to the latest version.
author: farazgis
ms.author: fsiddiqui
ms.date: 03/28/2026
ms.topic: upgrade-and-migration-article
ms.service: azure-maps
ms.subservice: search
---

# Migrate Azure Maps Search 1.0 APIs

[Search][Search v1] API version 1.0 is superseded by the [Search][Search v2026-01-01] 2026‑01‑01 API. The newer version introduces task‑specific endpoints, clearer intent, and improved scalability. This article explains how to migrate existing Search v1 integrations.

> [!IMPORTANT]
> Azure Maps [Search API version 1.0][Search v1] has been superseded by [Search API version 2026‑01‑01][Search v2026-01-01]. While Search v1 continues to function, new development should use the latest Search API to access task‑specific endpoints, improved performance, and long‑term support. To avoid future service disruptions, migrate existing Search v1 integrations to Search 2026‑01‑01.

## API equivalency mapping

| Purpose            | Search v1 API                   | Search 2026‑01‑01 API         |
|--------------------|---------------------------------|-------------------------------|
| Forward geocoding  | [Get Search Address]            | [Get Geocoding]               |
| Address/POI search | [Get Search Fuzzy] (final)      | [Get Geocoding]               |
| Autocomplete       | [Get Search Fuzzy] (type‑ahead) | [Get Geocode Autocomplete]    |
| Batch geocoding    | [Get Search Address Batch]      | [Get Geocoding Batch]         |
| Reverse geocoding  | [Get Search Address Reverse]    | [Get Reverse Geocoding]       |
| Batch reverse      |[Get Search Address Reverse Batch]|[Get Reverse Geocoding Batch] |
| Boundaries         | [Get Search Polygon]            | [Get Polygon]                 |

## Request and response example comparison

The following examples show how common Azure Maps Search v1 requests map to their equivalents in Search API 2026‑01‑01. Each example focuses on the same user intent, highlighting the shift from multi‑purpose v1 endpoints to intent‑specific APIs.

### Forward geocoding (address → coordinates)

In [Search API v1][Search v1], forward geocoding was commonly performed using the Search Address or Search Fuzzy endpoints. In [Search API 2026‑01‑01][Search v2026-01-01], this capability is provided by the [Get Geocoding] API, which resolves structured or unstructured address input into geographic coordinates using a dedicated, intent‑specific endpoint.

#### Search v1 – Search Address

```rest
GET https://atlas.microsoft.com/search/address/json
  ?api-version=1.0
  &query=1%20Microsoft%20Way%2C%20Redmond%20WA
```

#### Search 2026‑01‑01 – Get Geocoding

```rest
GET https://atlas.microsoft.com/geocode
  ?api-version=2026-01-01
  &query=1%20Microsoft%20Way%2C%20Redmond%20WA
```

### Fuzzy address or place search (final result)

[Search API v1][Search v1] exposed fuzzy address and place resolution through a single Search Fuzzy endpoint. In [Search API 2026‑01‑01][Search v2026-01-01], this behavior is replaced by [Get Geocoding], which handles free‑form address and place queries while separating autocomplete and suggestion scenarios into distinct APIs.

#### Search v1 – Search Fuzzy

```rest
GET https://atlas.microsoft.com/search/fuzzy/json
  ?api-version=1.0
  &query=Space%20Needle
```

#### Search 2026‑01‑01 – Get Geocoding

```rest
GET https://atlas.microsoft.com/geocode
  ?api-version=2026-01-01
  &query=Space%20Needle
```

### Autocomplete / type‑ahead suggestions

In [Search API v1][Search v1], type‑ahead behavior was enabled by setting `typeahead=true` on the [Search Fuzzy] endpoint. In [Search API 2026‑01‑01][Search v2026-01-01], autocomplete scenarios are handled explicitly by the [Get Geocode Autocomplete] API, which is optimized for interactive user input and real‑time suggestions.

#### Search v1 – Search Fuzzy (type‑ahead usage)

```rest
GET https://atlas.microsoft.com/search/fuzzy/json
  ?api-version=1.0
  &query=1%20Mic
  &typeahead=true
```

<!--For a fully functional sample of Fuzzy Search, see [Fuzzy Search with Services Module](https://samples.azuremaps.com/services-module/fuzzy-search-using-services-module).-->

#### Search 2026‑01‑01 – Get Geocode Autocomplete

```rest
GET https://atlas.microsoft.com/geocode:autocomplete
  ?api-version=2026-01-01
  &query=1%20Mic
  &coordinates=-122.129,47.639
```

For more information, see [Introducing the Azure Maps Geocode Autocomplete API](https://techcommunity.microsoft.com/blog/azuremapsblog/announcing-the-general-availability-of-the-azure-maps-geocode-autocomplete-api/4499242).

<!--For fully functional samples of autocomplete, see [Autocomplete] (https://samples.azuremaps.com/rest-services/autocomplete) and [Fill Address Form with Autocomplete](https://samples.azuremaps.com/rest-services/fill-address-form-with-autocomplete)-->

### Batch forward geocoding

[Search API v1][Search v1] supported batch address resolution through the Search Address Batch endpoint. In [Search API 2026‑01‑01][Search v2026-01-01], this functionality is provided by [Get Geocoding Batch], allowing multiple address queries to be submitted and processed in a single request for large‑scale or background workloads.

#### Search v1 – Search Address Batch

```rest
POST https://atlas.microsoft.com/search/address/batch/json
  ?api-version=1.0
```

#### Search 2026‑01‑01 – Get Geocoding Batch

```rest
POST https://atlas.microsoft.com/geocode:batch
  ?api-version=2026-01-01
```

### Reverse geocoding (coordinates → address)

Reverse geocoding in [Search API v1][Search v1] was performed using the Search Address Reverse endpoint. In [Search API 2026‑01‑01][Search v2026-01-01], this capability is available through [Get Reverse Geocoding], which converts longitude and latitude coordinates into a human‑readable address using a dedicated reverse‑lookup API.

#### Search v1 – Search Address Reverse

```rest
GET https://atlas.microsoft.com/search/address/reverse/json
  ?api-version=1.0
  &position=47.639,-122.129
```

#### Search 2026‑01‑01 – Get Reverse Geocoding

```rest
GET https://atlas.microsoft.com/reverseGeocode
  ?api-version=2026-01-01
  &coordinates=-122.129,47.639
```

### Batch reverse geocoding

[Search API v1][Search v1] enabled batch reverse lookups through [Get Search Address Reverse Batch]. In [Search API 2026‑01‑01][Search v2026-01-01], this scenario is supported by [Get Reverse Geocoding Batch], allowing multiple coordinate pairs to be resolved to addresses in a single request for telemetry, tracking, or enrichment pipelines.

#### Search v1 – Search Address Reverse Batch

```rest
POST https://atlas.microsoft.com/search/address/reverse/batch/json
  ?api-version=1.0
```

#### Search 2026‑01‑01 – Get Reverse Geocoding Batch

```rest
POST https://atlas.microsoft.com/reverseGeocode:batch
  ?api-version=2026-01-01
```

### Administrative boundary retrieval

In [Search API v1][Search v1], administrative boundary geometry was retrieved using [Get Search Polygon]. In [Search API 2026‑01‑01][Search v2026-01-01], this functionality is provided by the [Get Polygon] API, which returns boundary geometry for supported administrative entities such as countries/regions, and cities.

#### Search v1 – Get Search Polygon

```rest
GET https://atlas.microsoft.com/search/polygon/json
  ?api-version=1.0
  &entityId=US-WA
```

#### Search 2026‑01‑01 – Get Polygon

```rest
GET https://atlas.microsoft.com/polygon
  ?api-version=2026-01-01
  &entityId=US-WA
```

## Migration checklist

> [!div class="checklist"]
>
> * Inventory all Search v1 endpoints in use
> * Identify intent (autocomplete vs final geocode)
> * Replace v1 endpoints with 2026‑01‑01 equivalents
> * Update query parameters
> * Validate response parsing
> * Introduce batch APIs where applicable
> * Update documentation and samples

## Next steps

> [!div class="nextstepaction"]
> [Best practices for Azure Maps Search service](how-to-use-best-practices-for-search.md)

[Search v1]: /rest/api/maps/search?view=rest-maps-1.0&preserve-view=true
[Get Search Address]: /rest/api/maps/search/get-search-address
[Get Search Address Batch]: /rest/api/maps/search/get-search-address-batch?view=rest-maps-1.0&tabs=HTTP
[Get Search Address Reverse Batch]: /rest/api/maps/search/get-search-address-reverse-batch?view=rest-maps-1.0&tabs=HTTP
[Get Search Address Reverse]: /rest/api/maps/search/get-search-address-reverse?view=rest-maps-1.0&tabs=HTTP
[Get Search Polygon]: /rest/api/maps/search/get-search-polygon?view=rest-maps-1.0&tabs=HTTP
[Get Search Fuzzy]: /rest/api/maps/search/get-search-fuzzy

[Search v2026-01-01]:  /rest/api/maps/search
[Get Geocoding]: /rest/api/maps/search/get-geocoding
[Get Geocode Autocomplete]: /rest/api/maps/search/get-geocode-autocomplete
[Get Geocoding Batch]: /rest/api/maps/search/get-geocoding-batch
[Get Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[Get Reverse Geocoding Batch]: /rest/api/maps/search/get-reverse-geocoding-batch
[Get Polygon]: /rest/api/maps/search/get-polygon
