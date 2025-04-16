---
title: "Concept: Supported Data Types in Microsoft Planetary Computer Pro"
description: "Description of data types supported by Microsoft Planetary Computer Pro"
author: "brentharris"
ms.author: "brentharris"
ms.service: mpcpro
ms.topic: concept
ms.date: 4/9/2025

#customer intent: help customers understand the kind of geospatial assets they can manage and visualize in MPC Pro. 

---

## Supported Data Types in Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro allows for ingestion and storage of all kinds of data, but only certain file types will enable you to take advantage of the full suite of MPC Pro features. The following file formats are supported, and will be cloud optimized, indexed, and made available for visualization:

### Raster Data Formats

* GeoTIFF  
* TIFF  
* COG  
* JPEG  
* JPEG2000  
* PNG  

### Datacube Formats

* NetCDF  
* HDF5  
* GRIB2  
* Zarr (Coming soon)

### Future Data Types

* Vector Data (Coming soon)
* Hyperspectral Data  
* 3D/Point Cloud Data  
* Drone Video & Imagery  

**Note:** In order to ingest any of the supported data types, each asset must have an accompanying STAC Item in JSON format. [Learn more about STAC in Microsoft Planetary Computer Pro here](microsoft-planetary-computer-pro-overview.md). Learn more about visualizing these assets in [Visualize Assets](visualize-assets.md).