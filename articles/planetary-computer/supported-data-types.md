---
title: "Supported Data Types | Microsoft Planetary Computer Pro"
description: "Discover the supported data types in Microsoft Planetary Computer Pro, including raster, data cubes, and future formats like Zarr and 3D data."
author: "beharris"
ms.author: "brentharris"
ms.service: planetary-computer
ms.topic: feature
ms.date: 4/9/2025

#customer intent: As a user of an Microsoft Planetary Computer (MPC) Pro GeoCatalog, I want to understand which geospatial data formats are supported so that I can understand the capabilities of MPC Pro. 

---

# Supported data types in Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro allows for ingestion and storage of all kinds of data, but only certain file types enable you to take advantage of the full suite of Microsoft Planetary Computer (MPC) Pro features. The following file formats are supported, and will be cloud optimized, indexed, and made available for visualization:

## Use cases

It is important to understand which geospatial data formats are supported by MPC Pro when performing the following actions:
- Creating STAC Collections and Ingesting STAC Items
- Visualizing STAC Items in the Data Explorer UI

## Supported geospatial data types
### Raster data formats

* GeoTIFF  
* TIFF  
* COG  
* JPEG  
* JPEG2000  
* PNG  

### Data cube formats

* NetCDF  
* HDF5  
* GRIB2  
* Zarr (coming soon)

### Vector Data Formats

* GeoJSON (coming soon)
* GeoParquet (coming soon)

### Future data types

* Hyperspectral Data  
* 3D/Point Cloud Data  
* Drone Video & Imagery  

## Related Content

- Learn more about STAC collections and items: [STAC Overview](./stac-overview.md)
- Learn more about visualizing these assets: [Visualize Assets](visualize-assets.md)
- Get started ingesting GeoTIFF STAC Items [Add STAC items to a Collection](./add-stac-item-to-collection.md)
- Get started with Data Cubes: [Data Cube Quickstart](./datacube-quickstart.md)
