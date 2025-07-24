---
title: Supported data types in Microsoft Planetary Computer Pro
description: Discover the supported data types in Microsoft Planetary Computer Pro including raster and data cubes.
author: beharris
ms.author: brentharris
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 4/9/2025
#customer intent: As a user of an Microsoft Planetary Computer Pro GeoCatalog, I want to understand which geospatial data formats are supported so that I can understand the capabilities of Planetary Computer Pro.
ms.custom:
  - build-2025
---

# Supported data types in Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro allows for ingestion and storage of all kinds of data, but only certain file types enable you to take advantage of the full suite of Microsoft Planetary Computer Pro features. The following file formats are supported, and automatically cloud optimized, indexed, and made available for visualization upon ingestion:

## Use cases

It's important to understand which geospatial data formats are supported in Planetary Computer Pro when performing the following actions:
- Creating STAC (SpatioTemporal Asset Catalog) Collections and Ingesting STAC Items
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

### Other file formats and metadata files
Beyond this list of supported data types, you may ingest STAC items that point to other data types as assets. For example, it's common for STAC items to list other metadata files as assets in json, xml, csv, and other formats. When ingesting STAC items that include these other file types as assets the Planetary Computer Pro stores these files, but doesn't attempt to convert them to cloud optimized formats. After ingest, you'll be able to access these nonsupported asset types using the Planetary Computer Pro's STAC API, but you won't be able to visualize them within Planetary Computer Pro's Explorer.

## Related Content

- Learn more about STAC collections and items: [STAC Overview](./stac-overview.md)
- Learn more about visualizing these assets: [Visualize data cube Assets](./visualize-assets.md)
- Get started ingesting GeoTIFF STAC Items [Add STAC items to a Collection](./add-stac-item-to-collection.md)
- Get started with Data Cubes: [Data Cube Quickstart](./data-cube-quickstart.md)
