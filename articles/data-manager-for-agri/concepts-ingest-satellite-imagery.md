---
title: Ingesting Satellite Data
description: Provides step by step guidance to ingest Satellite data
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Using satellite imagery in Azure Data Manager for Agriculture 
Our Data Manager  supports geospatial and temporal data. Remote sensing satellite imagery (which is geospatial and temporal) has huge applications in the field of agriculture. Farmers, agronomists and data scientists use of satellite imagery extensively to generate insights. Using satellite data in FarmBeats involves following steps.

> [!NOTE]
> Microsoft Azure Data Manager for Agriculture is currently in preview. For legal terms that apply to features that are in beta, in preview, or otherwise not yet released into general availability, see the [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).
> Microsoft Azure Data Manager for Agriculture requires registration and is available to only approved customers and partners during the preview period. To request access to Microsoft Data Manager for Agriculture during the preview period, use this [**form**](https://forms.office.com/r/SDR0m3yjeS).

![satellite_flow](./media/satellite_flow.png)

## Satellite sources supported by Azure Data Manager for Agriculture
In our public preview we support ingesting data from Sentinel-2 constellation.

## Sentinel-2
[Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) is a satellite constellation launched by 'European Space Agency' (ESA) under the Copernicus mission. This constellation has a pair of satellites and carries a Multi-Spectral Instrument (MSI) payload that samples 13 spectral bands: four bands xat 10 m, six bands at 20 m and three bands at 60 m spatial resolution.  

>Tip
> Sentinel-2 has two products: Level 1 (top of the atmosphere) data and its atmospherically corrected variant Level 2 (bottom of the atmosphere) data. We support ingesting and retrieving Level 1 and Level 2 data from Sentinel 2.

## Image names and resolutions
Below are image names and resolutions that are supported by APIs used to ingest and read satellite data (for Sentinel-2) in FarmBeats.

| Category | Image Name |	Description |	Native resolution |
|:-----:|:----:|:----:|:----:|
|Raw bands| B01 |	Coastal aerosol | 60m |
|Raw bands| B02 |	Blue| 10m |
|Raw bands| B03 |	Green	| 10m |
|Raw bands| B04 |	Red	| 10m |
|Raw bands| B05 |	Vegetation red edge | 20m |
|Raw bands| B06 |	Vegetation red edge	| 20m |
|Raw bands| B07 |	Vegetation red edge	| 20m |
|Raw bands| B08 |	NIR	| 10m |
|Raw bands| B8A |	Narrow NIR | 20m |
|Raw bands| B09 |	Water vapour | 60m |
|Raw bands| B11 |	SWIR | 20m |
|Raw bands| B12 |	SWIR | 20m |
|Sen2Cor processor output| AOT |	Aerosol optical thickness map	| 10m |
|Sen2Cor processor output| SCL |	Scene classification data	| 20m |
|Sen2Cor processor output| SNW |	Snow probability| 20m |
|Sen2Cor processor output| CLD |	Cloud probability| 20m |
|Derived Indices| NDVI |	Normalized difference vegetation index | 10m/20m/60m (user defined) |
|Derived Indices| NDWI |	Normalized difference water index | 10m/20m/60m (user defined) |
|Derived Indices| EVI | Enhanced vegetation index | 10m/20m/60m (user defined) |
|Derived Indices| LAI | Leaf Area Index | 10m/20m/60m (user defined) |
|Derived Indices| LAIMask | Leaf Area Index Mask | 10m/20m/60m (user defined) |
|CLP|	Cloud probability, based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector). | Values range from 0 (no clouds) to 255 (clouds). | 10m/20m/60m  (user defined)|
|CLM|	Cloud masks based on [s2cloudless](https://github.com/sentinel-hub/sentinel2-cloud-detector) | Value of 1 represents clouds, 0 represents no clouds and 255 represents no data. | 10m/20m/60m  (user defined)|
|dataMask	| Binary mask to denote availability of data | 0 represents non availability of data OR pixels lying outside the 'Area of interest' | Not applicable, per pixel value|

## Points to note
* We use CRS EPSG:4326 for Sentinel-2 data. The resolutions quoted in the APIs are at the equator.
* For preview:
    * A maximum of five satellite jobs can be run concurrently, per tenant.
    * A satellite job can ingest data for a maximum of one year in a single API call.
    * Only TIFs are supported.
    * Only 10m, 20m and 60m images are supported.

