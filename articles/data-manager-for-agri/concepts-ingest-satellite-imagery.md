---
title: Ingesting satellite data in Azure Data Manager for Agriculture
description: Provides step by step guidance to ingest Satellite data
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 11/17/2023
ms.custom: template-concept
---

# Using satellite imagery in Azure Data Manager for Agriculture 
Satellite imagery makes up a foundational pillar of agriculture data. To support scalable ingestion of geometry-clipped imagery, we partnered with Sentinel Hub by Sinergise to provide a seamless bring your own license (BYOL) experience. This BYOL experience allows you to manage your own costs. This capability helps you with storing your field-clipped historical and up to date imagery in the linked context of the relevant fields.

## Prerequisites
*	To search and ingest imagery, you need a user account that has suitable subscription entitlement with Sentinel Hub: https://www.sentinel-hub.com/pricing/
*	Read the Sinergise Sentinel Hub terms of service and privacy policy: https://www.sentinel-hub.com/tos/
*	Have your providerClientId and providerClientSecret ready

## Ingesting geometry-clipped imagery
Using satellite data in Data Manager for Agriculture involves following steps: 

:::image type="content" source="./media/satellite-flow.png" alt-text="Diagram showing satellite data ingestion flow.":::

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Consumption visibility and logging
As all ingest data is under a BYOL model, transparency into the cost of a given job is needed. Our data manager offers built-in logging to provide transparency on PU consumption for calls to our upstream partner Sentinel Hub. The information appears under the “SatelliteLogs” Category of the standard data manager Logging found [here](how-to-set-up-audit-logs.md). 

## STAC Search for available imagery  
Our data manager supports the industry standard [STAC](https://stacspec.org/en) search interface to find metadata on imagery in the sentinel collection prior to committing to downloading pixels. To do so, the search endpoint accepts a location in the form of a point, polygon or multipolygon plus a start and end date time. Alternatively, if you already have the unique "Item ID," it can be provided as an array, of up 5, to retrieve those specific items directly

> [!IMPORTANT]
> To be consistent with STAC syntax “Feature ID” is renamed to “Item ID” from the 2023-11-01-preview API version.
> If an "Item ID" is provided, any location and time parameters in the request will be ignored. 

## Single tile source control
Published tiles overlap space on the earth to ensure full spatial coverage. If the queried geometry lies in a space where more than one tile matches for a reasonable time frame, the provider automatically mosaics the returned image with selected pixels from the range of candidate tiles. The provider produces the “best” resulting image.

In some cases, it isn't desirable and traceability to a single tile source is preferred. To support this strict source control, our data manager supports specifying a single item ID in the ingest-job. 

> [!NOTE]
> This functionality is only available from the 2023-11-01-preview API version.
> If an "Item ID" is provided for which the geometry only has partial coverage (eg the geometry spans more than one tile), the returned images will only reflect the pixels that are present in the specified item’s tile and will result in a partial image.

## Reprojection
> [!IMPORTANT] 
> This functionality has been changed from the 2023-11-01-preview API version, however it will be immediately applicable to all versions. Older versions used a static conversion of 10m*10m set at the equator, so imagery ingested prior to this release may have a difference in size to those ingested after this release .

Data Manager for Agriculture uses the WSG84 (EPSG: 4326), a flat coordinate system, whereas Sentinel-2 imagery is presented in UTM, a ground projection system that approximates the round earth.

Translating between a flat image and a round earth involves an approximation translation. The accuracy of this translation is set to equal at the equator (10 m^2) and increases in error margin as the point in question moves away from the equator to the poles. 
For consistency, our data manager uses the following formula at 10-m base for all Sentinel-2 calls: 

$$
Latitude = \frac{10 m}{111320}
$$

$$
Longitude = \frac{10 m}{\frac{111320}{cos(lat)}}
$$

$$
\ Where\: lat = The\: centroid's\: latitude\: from\: the\: provided\: geometry
$$

## Caching
> [!IMPORTANT]
> This functionality is only available from the 2023-11-01-preview api version. Item caching is only applicable for "Item ID" based retrieval. For a typical geometry and time search, the returned items will not be cached.

Our data manager optimizes performance and costing of highly repeated calls to the same item. It caches recent STAC items when retrieved by "Item ID" for five days in the customer’s instance and enables local retrieval. 

For the first call to the search endpoint, our data manager brokers the request and triggers a request to the upstream provider to retrieve the matching or intersecting data items, incurring any provider fees. Any subsequent search first directs to the cache for a match. If found, data is served from the cache directly and doesn't result in a call to the upstream provider, thus saving any more provider fees. If no match is found, or if it after the five day retention period, then a subsequent call for the data will be passed to the upstream provider. And treated as another first call with the results being cached.

If an ingestion job is for an identical geometry, referenced by the same resource ID, and with overlapping time to an already retrieved scene, then the locally stored image is used. It isn't redownloaded from the upstream provider. There's no expiration for this pixel-level caching.

## Satellite sources supported by Azure Data Manager for Agriculture
In our public preview, we support ingesting data from Sentinel-2 constellation.

### Sentinel-2
[Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) is a satellite constellation launched by 'European Space Agency' (ESA) under the Copernicus mission. This constellation has a pair of satellites and carries a Multi-Spectral Instrument (MSI) payload that samples 13 spectral bands: four bands at 10 m, six bands at 20 m and three bands at 60-m spatial resolution.  

> [!TIP]
> Sentinel-2 has two products: Level 1 (top of the atmosphere) data and its atmospherically corrected variant Level 2 (bottom of the atmosphere) data. We support ingesting and retrieving Sentinel_2_L2A and Sentinel_2_L1C data from Sentinel 2.

### Image names and resolutions
The image names and resolutions supported by APIs used to ingest and read satellite data (for Sentinel-2) in our service:

| Category | Image Name |	Description |	Native resolution |
|:-----:|:----:|:----:|:----:|
|Raw bands| B01 |	Coastal aerosol | 60 m |
|Raw bands| B02 |	Blue| 10 m |
|Raw bands| B03 |	Green	| 10 m |
|Raw bands| B04 |	Red	| 10 m |
|Raw bands| B05 |	Vegetation red edge | 20 m |
|Raw bands| B06 |	Vegetation red edge	| 20 m |
|Raw bands| B07 |	Vegetation red edge	| 20 m |
|Raw bands| B08 |	NIR	| 10 m |
|Raw bands| B8A |	Narrow NIR | 20 m |
|Raw bands| B09 |	Water vapor | 60 m |
|Raw bands| B11 |	SWIR | 20 m |
|Raw bands| B12 |	SWIR | 20 m |
|Sen2Cor processor output| AOT |	Aerosol optical thickness map	| 10 m |
|Sen2Cor processor output| SCL |	Scene classification data	| 20 m |
|Sen2Cor processor output| SNW |	Snow probability| 20 m |
|Sen2Cor processor output| CLD |	Cloud probability| 20 m |
|Derived Indices| NDVI |	Normalized difference vegetation index | 10 m/20 m/60 m (user defined) |
|Derived Indices| NDWI |	Normalized difference water index | 10 m/20 m/60 m (user defined) |
|Derived Indices| EVI | Enhanced vegetation index | 10 m/20 m/60 m (user defined) |
|Derived Indices| LAI | Leaf Area Index | 10 m/20 m/60 m (user defined) |
|Derived Indices| LAIMask | Leaf Area Index Mask | 10 m/20 m/60 m (user defined) |
|CLP|	Cloud probability, based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector). | Values range from 0 (no clouds) to 255 (clouds). | 10 m/20 m/60 m  (user defined)|
|CLM|	Cloud masks based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector) | Value of 1 represents clouds, 0 represents no clouds and 255 represents no data. | 10 m/20 m/60 m  (user defined)|
|dataMask	| Binary mask to denote availability of data | 0 represents non availability of data OR pixels lying outside the 'Area of interest' | Not applicable, per pixel value|

## Points to note
* We use CRS EPSG: 4326 for Sentinel-2 data. The resolutions quoted in the APIs are at the equator.
* For preview:
    * A maximum of five satellite jobs can be run concurrently, per tenant.
    * A satellite job can ingest data for a maximum of one year in a single API call.
    * Only TIFs are supported.
    * Only 10 m, 20 m and 60-m images are supported.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).