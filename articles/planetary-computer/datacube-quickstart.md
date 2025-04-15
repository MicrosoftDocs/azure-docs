---
title: "Quickstart: Get Started with Data Cubes in Microsoft Planetary Computer Pro"
description: "Description of how to work with data cube data MPC Pro "
author: "brentharris"
ms.author: "brentharris"
ms.service: mpcpro
ms.topic: quickstart
ms.date: 4/9/2025

#customer intent: help customers understand the nuances of ingesting and rendering data cube assets in MPC Pro. 

---

# Quickstart: Get Started with Data Cubes in Microsoft Planetary Computer Pro

## Prerequisites

* An Azure account with an active subscription; [create an account for free.](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* An [Azure MPC Pro GeoCatalog](../Deployment.md)
* A Blob Storage account [create a Blob Storage account](https://learn.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal).
* A Blob Storage container with data cube assets (NetCDF, HDF5, GRIB2), STAC Items, and static STAC Catalog. [Learn how to create STAC Items](create-stac-items.md).

## Set Up Ingestion Source

Before you can begin to ingest data cube data, you'll need to set up an Ingestion Source, which will serve as your credentials to access the Blob Storage account where your assets and STAC Items are stored. You can set up an Ingestion Source using [Managed Identity](link to MI quickstart) or [SAS Token](link to SAS quickstart).

## Create a Data Cube Collection

Once your Ingestion Source is set up, you can create a Collection for your data cube assets. Steps to create a collection can be followed in [MPC Pro Tutorial](Link to tutorial).

## Ingest Data Cube Assets

The initiation of the ingestion process for data cube data, and other data types, can be followed in [Ingestion Overview](link to ingestion overview). As described in [Data Cube Overview](link to data cube overview), however, ingestion is the step in MPC Pro's data handling that differs for these file types. While GRIB2 data and associated STAC Items are ingested just like any other two-dimensional raster file, NetCDF and HDF5 assets undergo further data enrichment. The generation of Kerchunk Manifests is well documented in [Data Cube Overview](link to data cube overview), but what is important to note is that Kerchunk assets will be added to your Blob Storage container alongside the original assets, and an additional `cube:variables` field are added to the STAC Item JSON. This is important when rendering these data types in the MPC Pro Explorer.

### Configure a Data Cube Collection

Configuration of your data cube collection is another step that will look slightly different from that of other data types. You can follow the steps described in [Mosaic Quickstart](link to mosaic quickstart), [Queryables Quickstart](link to queryables quickstart), [Tile Settings Quickstart](link to tile settings quickstart), and [Render Configuration Quickstart](link to render configuration quickstart) to configure your data cube collection, but you'll need to be aware of the following differences when building your Render Configuration:

#### Render Configuration for NetCDF and HDF5 Assets

Remembering that a standard Render Configuration argument in JSON format looks like this:

```json
[
  {
    "id": "prK1950-06-30",
    "name": "prK1950-06-30",
    "type": "raster-tile",
    "options": "assets=pr-kerchunk&subdataset_name=pr&rescale=0,0.01&colormap_name=viridis&datetime=1950-06-30",
    "minZoom": 1
  }
]
```

The `options` field is where you'll want to utilize the cloud optimized, Kerchunk asset, as opposed to the original asset listed in the STAC Item. You'll also need to include the `subdataset_name` argument, which is the name of the variable you want to render.

More information about visualizing NetCDF and HDF5 data can be found in the [Visualizing Assets Quickstart](link to visualizing assets quickstart).

#### Render Configuration for GRIB2 Assets

The `options` field for the Render Configuration of GRIB2 assets look similar to the previous example, but you won't need to include the `subdataset_name` argument. This is because GRIB2 data is already optimally structured and referenced via their Index files. The `assets` argument, in this case, represents the band, or 2D raster layer, you want to render. Below is an example of a GRIB2 Render Configuration:

```json
[
  {
    "id": "render-config-1",
    "name": "Mean Zero-Crossing Wave Period",
    "description": "A sample render configuration. Update `options` below.",
    "type": "raster-tile",
    "options": "assets=data&subdataset_bands=1&colormap_name=winter&rescale=0,10",
    "minZoom": 1
  }
]
```

More information about visualizing GRIB2 data can be found in the [Visualizing Assets Quickstart](link to visualizing assets quickstart).

### Visualize Data Cube Assets in MPC Pro Explorer

Once your data cube assets are ingested and configured, you can visualize them in the MPC Pro Explorer. A step-by-step guide for using the Explorer can be followed in [MPC Pro Explorer Quickstart](link to explorer quickstart).
