---
title: Ingesting satellite data in Azure Data Manager for Agriculture
description: Provides step by step guidance to ingest Satellite data
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# Using satellite imagery in Azure Data Manager for Agriculture 
Satellite imagery makes up a foundational pillar of agriculture data. To support scalable ingestion of geometry-clipped imagery, we've partnered with Sentinel Hub by Sinergise to provide a seamless bring your own license (BYOL) experience. This BYOL experience allows you to manage your own costs while keeping the convenience of storing your field-clipped historical and up to date imagery in the linked context of the relevant fields.

## Prerequisites
*	To search and ingest imagery, you need a user account that has suitable subscription entitlement with Sentinel Hub: https://www.sentinel-hub.com/pricing/
*	Read the Sinergise Sentinel Hub terms of service and privacy policy: https://www.sentinel-hub.com/tos/
*	Have your providerClientId and providerClientSecret ready

## Ingesting geometry-clipped imagery
Using satellite data in Data Manager for Agriculture involves following steps: 

:::image type="content" source="./media/satellite-flow.png" alt-text="Diagram showing satellite data ingestion flow.":::

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Satellite sources supported by Azure Data Manager for Agriculture
In our public preview, we support ingesting data from Sentinel-2 constellation.

### Sentinel-2
[Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) is a satellite constellation launched by 'European Space Agency' (ESA) under the Copernicus mission. This constellation has a pair of satellites and carries a Multi-Spectral Instrument (MSI) payload that samples 13 spectral bands: four bands at 10 m, six bands at 20 m and three bands at 60-m spatial resolution.  

> [!Tip]
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