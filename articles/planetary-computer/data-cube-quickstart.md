---
title: Data Cube Quickstart for Microsoft Planetary Computer Pro
description: Learn how to work with data cube data Microsoft Planetary Computer Pro.
author: brentharris
ms.author: brentharris
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 4/24/2025
#customer intent: help customers understand the nuances of ingesting and rendering data cube assets in Microsoft Planetary Computer Pro.
ms.custom:
  - build-2025
---

# Quickstart: Get started with data cubes in Microsoft Planetary Computer Pro

## Prerequisites

* An Azure account with an active subscription; [create an account for free.](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* A [Microsoft Planetary Computer Pro GeoCatalog resource](deploy-geocatalog-resource.md)
* A Blob Storage account [create a Blob Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
* A Blob Storage container with data cube assets (NetCDF, HDF5, GRIB2), STAC Items, and static STAC Catalog. [Learn how to create STAC Items](create-stac-item.md).

## Set up ingestion source

Before you can begin to ingest data cube data, you'll need to set up an Ingestion Source, which will serve as your credentials to access the Blob Storage account where your assets and STAC Items are stored. You can set up an Ingestion Source using [Managed Identity](set-up-ingestion-credentials-managed-identity.md) or [SAS Token](set-up-ingestion-credentials-sas-tokens.md).

## Create a data cube collection

Once your Ingestion Source is set up, you can create a Collection for your data cube assets. Steps to create a collection can be followed in [Create a STAC Collection with Microsoft Planetary Computer Pro using Python](create-stac-collection.md).

## Ingest data cube assets

The initiation of the ingestion process for data cube data, and other data types, can be followed in [Ingestion Overview](./ingestion-overview.md). As described in [Data Cube Overview](./data-cube-overview.md), however, ingestion is the step in Planetary Computer Pro's data handling that differs for these file types. While GRIB2 data and associated STAC Items are ingested just like any other two-dimensional raster file, NetCDF and HDF5 assets undergo further data enrichment. The generation of Kerchunk Manifests is documented in [Data Cube Overview](./data-cube-overview.md), but what is important to note is that Kerchunk assets will be added to your Blob Storage container alongside the original assets, and an additional `cube:variables` field are added to the STAC Item JSON. This is important when rendering these data types in the Planetary Computer Pro Explorer.

### Configure a data cube collection

Configuration of your data cube collection is another step that will look slightly different from that of other data types. You can follow the steps described in [Configure a collection with the Microsoft Planetary Computer Pro web interface](./configure-collection-web-interface.md) to configure your data cube collection, but you'll need to be aware of the following differences when building your Render Configuration:

#### Render configuration for NetCDF and HDF5 assets

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

More information about visualizing NetCDF and HDF5 data can be found in the [Visualizing assets in Microsoft Planetary Computer Pro](visualize-assets.md).

#### Render configuration for GRIB2 assets

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

More information about visualizing GRIB2 data can be found in the [Visualizing assets in Microsoft Planetary Computer Pro](visualize-assets.md).

### Visualize data cube assets in the Explorer

Once your data cube assets are ingested and configured, you can visualize them in the Planetary Computer Pro Explorer. A step-by-step guide for using the Explorer can be followed in [Quickstart: Use the Explorer in Microsoft Planetary Computer Pro](use-explorer.md).

## Related content

- [Access STAC collection data cube assets with a collection-level SAS token](./get-collection-sas-token.md)