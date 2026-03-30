---
title: Data cubes in Microsoft Planetary Computer Pro overview
description: Learn about data cube concepts and data cube enrichment for STAC assets in Microsoft Planetary Computer Pro. This article explains how to enable and disable data cube enrichment.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 11/5/2025

ms.custom:
  - build-2025
# customer intent: As a GeoCatalog User I want to undertand how Data Cubes are supported in Microsoft Planetary Computer Pro so that I can ingest, manage, and visualize data cube data formats.
---
# Data cubes in Microsoft Planetary Computer Pro

As mentioned in [Supported Data Types](./supported-data-types.md), Microsoft Planetary Computer Pro supports ingestion, cloud optimization, and visualization of data cube files in NetCDF, HDF5, Zarr, and GRIB2 formats. Though complex and historically cumbersome on local storage, these assets are optimized for cloud environments with Planetary Computer Pro, further empowering them as efficient tools to structure and store multidimensional data like satellite imagery and climate models.

## Ingestion of data cubes

Data cube files can be ingested into Planetary Computer Pro in the same way as other raster data types. As with other date formats, assets and associated Spatio Temporal Asset Catalog (STAC) Items must first be stored in Azure Blob Storage. Unlike other two-dimensional raster assets, however, more cloud optimization steps occur upon ingestion of certain data cube formats (NetCDF and HDF5).

> [!NOTE]
> GRIB2 data is ingested in the same way as other two-dimensional raster data (with no other cloud optimization steps), as they're essentially a collection of 2D rasters with an associated index file that references the data efficiently in cloud environments. Similarly, Zarr is already a cloud-native format, so no optimization takes place upon ingestion. 

## Cloud optimization of data cubes

When a STAC Item containing NetCDF or HDF5 assets is ingested, the assets are cloud optimized, not by transforming the data itself, but rather by generation of reference files that enable more efficient data access.

### Cloud optimization via Kerchunk manifests  

Unlike 2D raster data that is transformed into Cloud Optimized Geotiffs (COGs) when ingested into Planetary Computer Pro, data cube assets are optimized by generation of reference files, or Kerchunk manifests. [Kerchunk](https://fsspec.github.io/kerchunk/) is an open-source Python library that creates these chunk manifests, or JSON files that describe the structure of the data cube and its chunks using Zarr-style chunk keys that map to the byte ranges in the original file where those chunks reside. Once generated, the Kerchunk files are stored in blob storage alongside the assets, and the STAC items are enriched to include references to these manifests, optimizing data access for cloud environments.

### STAC item properties that trigger cloud optimization

Within the collection's STAC items, the following conditions must be true for a data cube asset to be cloud optimized:

* The asset format is one of the following types:
    - `application/netcdf`
    - `application/x-netcdf`
    - `application/x-hdf5`
* The asset has a `roles` field that includes either `data` or `visual` within its list of roles. 

If these conditions are met, a Kerchunk manifest (`assetid-kerchunk.json`) is generated in blob storage alongside the asset. 

> [!NOTE]
> The asset format type`application/x-hdf` often corresponds to HDF4 assets. GeoCatalog ingestion doesn't currently support creating virtual kerchunk manifests for HDF4 due to its added complexity and multiple variants.

### STAC item enrichment 

For each optimized asset within the STAC item, the following fields are added:  

- `msft:datacube_converted: true` – Indicates that enrichment was applied. 
- `cube:dimensions` – A dictionary listing dataset dimensions and their properties. 
- `cube:variables` – A dictionary describing dataset variables and their properties. 

These variables should be used for render configurations to ensure that your visualization of data cube assets in the Explorer is reading and rendering your data most efficiently. 

### Benefits of cloud optimized data cubes 

Data cube cloud optimization improves data access performance, especially for visualization workflows. When a Kerchunk manifest is present, it allows faster access compared to loading the entire dataset file. 

The Microsoft Planetary Computer Pro Explorer and tiling APIs preferentially use the Kerchunk manifest for data read operations if one exists in the same blob storage directory as the original asset.

Reading data using a chunked, reference-based approach is faster because it avoids reading the entire file into memory.

### Disabling data cube cloud optimization

If you decide you don't want to work with cloud optimized data cube assets, disable cloud optimization by removing `data` and `visual` from the asset’s `roles` list in the STAC item JSON before ingestion.

## Zarr ingestion and data updates

As previously mentioned, Zarr is inherently a cloud-native format, so no extra optimization occurs when ingested and no modification of its STAC items is necessary. However, if you plan to dynamically update your Zarr assets and reingest STAC items to work with the latest version, you need to be aware of two update methods: **Append** and **Sync**. 

### Append

If you add new data to a locally stored Zarr store, but want to update the version stored in Planetary Computer Pro, you need to reingest the STAC item. When that item is reingested, the default behavior is to review the assets for any new data, and add it to the data stored in the cloud. No modification to the STAC item is necessary prior to reingestion. 

### Sync

If you remove data from a locally stored Zarr store, reingesting the same STAC item won't allow the cloud-based version to match the version on your machine, as the **append** functionality looks for new data, but not adjust according to any missing data. That's where **sync** comes into play. By modifying the STAC item to include a parameter that indicates you want to sync, the existing data with the new, and reingesting that modified STAC item, only the most up-to-date data from the Zarr store are available in Planetary Computer Pro. The modification to the STAC item should appear as follows:

```json
{
    ...
    "assets": {
        "pr": {
            "href": "https://managedstorage.azure.com/collection-container/somestuff/pr.zarr",
            "msft:ingestion": {
              "directory": "sync"
            }
        }
    }
}
```

## Related content

- [Access STAC collection data cube assets with a collection-level SAS token](./get-collection-sas-token.md)

  
