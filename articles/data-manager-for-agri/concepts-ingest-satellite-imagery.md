---
title: Ingest satellite data in Azure Data Manager for Agriculture
description: Get step-by-step guidance on how to ingest satellite data.
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 11/17/2023
ms.custom: template-concept
show_latex: true
---

# Ingest satellite imagery in Azure Data Manager for Agriculture

Satellite imagery is a foundational pillar of agriculture data. To support scalable ingestion of geometry-clipped imagery, Microsoft partnered with Sentinel Hub by Sinergise to provide a seamless bring your own license (BYOL) experience for Azure Data Manager for Agriculture. You can use this BYOL experience to manage your own costs. This capability helps you with storing your field-clipped historical and up-to-date imagery in the linked context of the relevant fields.

## Prerequisites

* To search for and ingest imagery, you need a user account that has suitable subscription entitlement with [Sentinel Hub](https://www.sentinel-hub.com/pricing/).
* Read the [Sinergise Sentinel Hub terms of service and privacy policy](https://www.sentinel-hub.com/tos/).
* Have your `providerClientId` and `providerClientSecret` values ready.

## Ingesting geometry-clipped imagery

Using satellite data in Azure Data Manager for Agriculture involves the following steps:

:::image type="content" source="./media/satellite-flow.png" alt-text="Diagram that shows the ingestion flow of satellite data: ingest data, monitor status, retrieve metadata, and download data.":::

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Consumption visibility and logging

Because all ingested data is under a BYOL model, the cost of a job is transparent. Azure Data Manager for Agriculture offers built-in logging to provide transparency on processing unit (PU) consumption for calls to upstream partner Sentinel Hub. The information appears under the `SatelliteLogs` category of the [standard Azure Data Manager logging](how-to-set-up-audit-logs.md).

## STAC search for available imagery

Azure Data Manager for Agriculture supports the industry-standard [SpatioTemporal Asset Catalogs (STAC)](https://stacspec.org/en) search interface to find metadata on imagery in the Sentinel Hub collection before committing to downloading pixels. To do so, the search endpoint accepts a location in the form of a point, polygon, or multipolygon, plus a start and end date/time. Alternatively, if you already have the unique item ID, you can provide it as an array of up to five to retrieve those specific items directly.

> [!IMPORTANT]
> To be consistent with STAC syntax, *feature ID* is renamed to *item ID* from the 2023-11-01-preview API version.
>
> If you provide an item ID, any location and time parameters in the request are ignored.

## Single-tile source control

Published tiles overlap space on the earth to ensure full spatial coverage. If the queried geometry lies in a space where more than one tile matches for a reasonable time frame, the provider automatically mosaics the returned image with selected pixels from the range of candidate tiles. The provider produces the best resulting image.

In some cases, using more than one tile isn't desirable and traceability to a single tile source is preferred. To support this strict source control, Azure Data Manager for Agriculture supports specifying a single item ID in the ingest job.

> [!NOTE]
> This functionality is available only from the 2023-11-01-preview API version.
>
> If the geometry for a provided item ID has partial coverage (for example, the geometry spans more than one tile), the returned images reflect only the pixels that are present in the specified item's tile and result in a partial image.

## Reprojection

> [!IMPORTANT]
> Reprojection functionality has changed from the 2023-11-01-preview API version, but it's immediately applicable to all versions. Older versions used a static conversion of 10 m * 10 m set at the equator. Imagery ingested before this release might have a difference in size from imagery ingested after this release.

Azure Data Manager for Agriculture uses WGS84 (EPSG: 4326), a flat coordinate system. Sentinel-2 imagery is presented in UTM, a ground projection system that approximates the round earth.

Translating between a flat image and a round earth involves an approximation translation. The accuracy of this translation is set to equal at the equator (10 m^2) and increases in error margin as the point in question moves away from the equator to the poles.

For consistency, Azure Data Manager for Agriculture uses the following formula at 10 m^2 base for all Sentinel-2 calls:

$$
Latitude = \frac{10 m}{111320}
$$

$$
Longitude = \frac{10 m}{\frac{111320}{cos(lat)}}
$$

$$
\ Where\ lat = The\ centroid's\ latitude\ from\ the\ provided\ geometry
$$

## Caching

> [!IMPORTANT]
> Caching functionality is available only from the 2023-11-01-preview API version. Item caching is applicable only for retrieval that's based on item ID. For a typical geometry and time search, the returned items aren't cached.

Azure Data Manager for Agriculture optimizes performance and costing of highly repeated calls to the same item. It caches recent STAC items retrieved by item ID for five days in the customer's instance and enables local retrieval.

For the first call to the search endpoint, Azure Data Manager for Agriculture brokers the request and triggers a request to the upstream provider to retrieve the matching or intersecting data items. The request incurs any provider fees.

Any subsequent search first directs to the cache for a match. If there's a match, data is served from the cache directly. This process doesn't result in a call to the upstream provider, so it doesn't incur more provider fees. If there's no match, or if the five-day retention period elapses, a subsequent call for the data is passed to the upstream provider. That call is treated as another first call, so the results are cached.

If an ingestion job is for an identical geometry, referenced by the same resource ID, and with overlapping time to an already retrieved scene, Azure Data Manager for Agriculture uses the locally stored image. The image isn't downloaded again from the upstream provider. There's no expiration for this pixel-level caching.

## Satellite sources that Azure Data Manager for Agriculture supports

While Azure Data Manager for Agriculture is in preview, it supports ingesting data from the Sentinel-2 constellation.

### Sentinel-2

[Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) is a satellite constellation that the European Space Agency (ESA) launched under the Copernicus mission. This constellation has a pair of satellites and carries a multispectral instrument (MSI) payload that samples 13 spectral bands: four bands at 10 m, six bands at 20 m, and three bands at 60-m spatial resolution.  

Sentinel-2 has two products:

* Level 1 data for the top of the atmosphere.
* Level 2 data for the bottom of the atmosphere. This variant is atmospherically corrected.

Azure Data Manager for Agriculture supports ingesting and retrieving Sentinel_2_L2A and Sentinel_2_L1C data from Sentinel 2.

### Image names and resolutions

APIs that you use to ingest and read satellite data (for Sentinel-2) in Azure Data Manager for Agriculture support the following image names and resolutions:

| Category | Image name |  Description |  Native resolution |
|:-----:|:----:|:----:|:----:|
|Raw bands| B01 |  Coastal aerosol | 60 m |
|Raw bands| B02 |  Blue| 10 m |
|Raw bands| B03 |  Green  | 10 m |
|Raw bands| B04 |  Red  | 10 m |
|Raw bands| B05 |  Vegetation red edge | 20 m |
|Raw bands| B06 |  Vegetation red edge  | 20 m |
|Raw bands| B07 |  Vegetation red edge  | 20 m |
|Raw bands| B08 |  Near infrared (NIR)  | 10 m |
|Raw bands| B8A |  Narrow NIR | 20 m |
|Raw bands| B09 |  Water vapor | 60 m |
|Raw bands| B11 |  Short-wave infrared (SWIR) | 20 m |
|Raw bands| B12 |  SWIR | 20 m |
|Sen2Cor processor output| AOT |  Aerosol optical thickness map  | 10 m |
|Sen2Cor processor output| SCL |  Scene classification data  | 20 m |
|Sen2Cor processor output| SNW |  Snow probability| 20 m |
|Sen2Cor processor output| CLD |  Cloud probability| 20 m |
|Derived indices| NDVI |  Normalized difference vegetation index | 10 m/20 m/60 m (user defined) |
|Derived indices| NDWI |  Normalized difference water index | 10 m/20 m/60 m (user defined) |
|Derived indices| EVI | Enhanced vegetation index | 10 m/20 m/60 m (user defined) |
|Derived indices| LAI | Leaf area index | 10 m/20 m/60 m (user defined) |
|Derived indices| LAIMask | Leaf area index mask | 10 m/20 m/60 m (user defined) |
|CLP|  Cloud probability based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector) | Values range from `0` (no clouds) to `255` (clouds). | 10 m/20 m/60 m  (user defined)|
|CLM|  Cloud masks based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector) | Value of `1` represents clouds, `0` represents no clouds, and `255` represents no data. | 10 m/20 m/60 m  (user defined)|
|dataMask  | Binary mask to denote availability of data | Value of `0` represents unavailability of data or pixels lying outside the area of interest. | Not applicable, per pixel value|

## Points to note

Azure Data Manager for Agriculture uses CRS EPSG: 4326 for Sentinel-2 data. The resolutions quoted in the APIs are at the equator.

For the preview:

* A maximum of five satellite jobs can run concurrently, per tenant.
* A satellite job can ingest data for a maximum of one year in a single API call.
* Only TIFs are supported.
* Only 10-m, 20-m, and 60-m images are supported.

## Next steps

* [Test the Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri)
