---
title: Datacube enrichment for Microsoft Planetary Computer Pro
description: Learn about datacube enrichment for STAC assets in Microsoft Planetary Computer Pro. This article explains how to enable, and disable datacube enrichment.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: concept-article
ms.date: 04/09/2025
---

# Datacube enrichment of STAC assets for Microsoft Planetary Computer Pro

When a STAC item containing NetCDF or HDF5 assets is ingested, those assets can be enriched with datacube functionality. When datacube functionality is enabled, a Kerchunk manifest is generated and stored in blob storage alongside the asset, enabling more efficient data access.

## Supported file types for ingestion

Planetary Computer supports ingestion of a variety of geospatial data formats. The file type of each asset is determined using the STAC `type` property. The ingestable file types include:

- **Raster data**  
  - GeoTIFF  
  - TIFF  
  - COG  
  - JPEG  
  - JPEG2000  
  - PNG  

- **Datacube formats**  
  - NetCDF  
  - HDF5  
  - GRIB2  
  - Zarr  

- **Vector data**  
  - Geoparquet  
  - GeoJSON  
  - GeoPackage  

- **Other formats**  
  - Hyperspectral Data  
  - 3D/Point Cloud Data  
  - Drone Video & Imagery  

These formats determine how an asset is processed during ingestion and whether additional enrichment steps, such as **Kerchunk manifest generation**, are applied.

## Datacube enrichment and Kerchunk manifests  

For STAC assets in **NetCDF** or **HDF5** formats, Planetary Computer can apply **Datacube enrichment** during ingestion. This process generates a **Kerchunk manifest**, which is stored in blob storage alongside the asset. The Kerchunk manifest enables efficient access to chunked dataset formats.  

### Enable datacube enrichment  

Datacube enrichment is **enabled** for applicable assets in the STAC item JSON. For each asset, enrichment is triggered if both of the following conditions are met:  

1. The asset format is one of: `hdf5`, `application/netcdf`, or `application/x-netcdf`.  
1. The asset has a `roles` field that includes either `data` or `visual` within its list of roles.  

If these conditions are met, a **Kerchunk manifest** (`assetid-kerchunk.json`) is generated in blob storage alongside the asset.  

### Datacube enrichment modifies the STAC item JSON  

For each enriched asset within the **STAC item JSON**, the following fields are added:  

- `msft:datacube_converted: true` – Indicates that enrichment was applied.  
- `cube:dimensions` – A dictionary listing dataset dimensions and their properties.  
- `cube:variables` – A dictionary describing dataset variables and their properties.  


### Disable datacube enrichment  

To **disable enrichment** for an asset, remove `data` and `visual` from the asset’s `roles` list in the STAC item JSON before ingestion.   

### Handling enrichment failures  

If Datacube enrichment fails, the asset can be **re-ingested** with enrichment disabled by updating the STAC item JSON to exclude the `data` or `visual` role before retrying ingestion.  

## Why enable datacube enrichment?  

Enabling Datacube enrichment improves **data access performance**, especially for visualization workflows. When a Kerchunk manifest is present, it allows **faster access** compared to loading the entire dataset file.  

### Faster dataset access for data APIs and visualization with Kerchunk  

When accessing a dataset, Planetary Computer **uses the Kerchunk manifest (`.json`)** if one exists in the same blob storage directory as the original asset. Instead of opening the full `.nc` file, we use a **Zarr with reference files** to access only the necessary data.  

Because it avoids reading the entire file into memory, using a chunked, reference-based approach is **much faster** than directly loading the entire dataset with `xarray` and reduces resource usage. 
  