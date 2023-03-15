---
title: Create elevation data & services using open data
titeSuffix: Microsoft Azure Maps
description: a guide to help developers migrate from Azure Maps elevation services to alternate solutions.
author: FarazGIS
ms.author: fsiddiqui
ms.date: 3/23/2023
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
---

# Create elevation data & services

This guide describes how to use USGS worldwide DEM data from their SRTM mission with 30m accuracy to build an Elevation service on the [Microsoft Azure Cloud].

This article describes how to:

- Create Contour line vector tiles and RGB-encoded DEM tiles.
- Create Elevation API using Azure Function and RGB-encoded DEM tiles from Azure Blob Storage.
- Create Contour line vector tile service using Azure Function and PostgreSQL.

## Prerequisites

This guide requires the use of the following third-party data and software:

- USGS Data. DEM data can be downloaded as GeoTiff with 1 arc second coverage per tile through the [USGS EarthExplorer]. This requires an EarthExplorer account, but the data can be downloaded for free.
- The [QGIS] desktop GIS application is used to process and smoothen the Raster tiles. QGIS is free to download and use. This guide uses QGIS version 3.26.2-Buenos Aires.
- The [rio-rgbify] Python package, developed by MapBox, is used to encode the GeoTIFF as RGB.
- [PostgreSQL] database with the [PostGIS] spatial extension.

## Create Contour line vector tiles and RGB-encoded DEM tiles

This guide uses the 36 tiles covering the state of Washington, available from [USGS EarthExplorer].

1. Add raster tiles to QGIS. This can be done by dragging the files to the
    **QGIS layer** tab or selecting **Add Layer** in the **Layer** menu.

    :::image type="content" source="./media/elevation-services/add-raster-tiles-qgis.png" alt-text="A screenshot showing how to add raster tiles in QGIS." lightbox="./media/elevation-services/image1.png":::

2. When the raster layers are loaded into QGIS, you will notice
   different shades of tiles. Fix this by merging the raster
   layers, which results in a single smooth raster image in GeoTIFF
   format. To do this, select **Miscellaneous >** from the **Raster** menu, then **Merge...**

    :::image type="content" source="./media/elevation-services/merge-raster-layers.png" alt-text="A screenshot showing how the merge raster layers menu in QGIS.":::

3. Reproject the merged raster layer to EPSG:3857 (WGS84 / Pseudo-Mercator).
   EPSG:3857 is required to use it with [Azure Maps Web SDK].

    :::image type="content" source="./media/elevation-services/save-raster-layer.png" alt-text="A screenshot showing how the merge raster layers menu in QGIS.":::

4. If you only want to create contour line vector tiles, you can skip the following steps and go to
   [Create Contour line vector tile service using Azure Function and PostgreSQL].

5. To create an Elevation API, the next step is to RGB-Encode the GeoTIFF. This can be done using
    [rio-rgbify], developed by MapBox. There are some challenges running this tool directly in
    Windows, so it is easier to run from WSL. Below are the steps in Ubuntu on WSL:

    ```Ubuntu
    sudo apt get update
    sudo apt get upgrade
    sudo apt install python3-pip
    pip install rio-rgbify
    PATH="$PATH:/home/<user>/.local/bin"
    ```

    The following steps are only necessary when mounting an external hard drive or USB flash drive:

    ```Ubuntu
    sudo mkdir /mnt/f
    sudo mount -t drvfs D: /mnt/f
    rio rgbify -b -10000 -i 0.1 wa_1arc_v3_merged_3857.tif wa_1arc_v3_merged_3857_rgb.tif
    ```

    :::image type="content" source="./media/elevation-services/rgb-encoded-geotiff.png" alt-text="A screenshot showing the RGB-encoded GeoTIFF in QGIS.":::

    The RGB-encoded GeoTIFF will allow you to retrieve R, G and B values
    for a pixel and calculate the elevation from these values:

    `elevation (m) = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)`

6. Next, create a tile set to use with the map control and/or use it to get Elevation for any
   geographic coordinates within the map extent of the tile set. The tile set can be created
   in QGIS using the **Generate XYZ tiles (Directory)** tool.

    :::image type="content" source="./media/elevation-services/generate-xyz-tiles-tool.png" alt-text="A screenshot showing the Generate XYZ tiles (Directory) tool in QGIS.":::

7. Save the location of the tile set, you will use it in the next Section.

## Create Elevation API using Azure Function and RGB-encoded DEM tiles from Azure Blob Storage

The RGB encoded DEM Tiles needs to be uploaded to a database storage
before it can be used with the Azure Functions to create an API.

1. Upload the tiles to Azure Blob Storage. [Azure Storage Explorer] is a useful tool for this purpose.

    :::image type="content" source="./media/elevation-services/azure-storage-explorer.png" alt-text="A screenshot showing the Microsoft Azure Storage Explorer.":::


## Create Contour line vector tile service using Azure Function and PostgreSQL

[Microsoft Azure Cloud]: https://azure.microsoft.com/free/cloud-services
[USGS EarthExplorer]: https://earthexplorer.usgs.gov/
[QGIS]: https://www.qgis.org/en/site/forusers/download.html
[rio-rgbify]: https://pypi.org/project/rio-rgbify/
[PostgreSQL]: https://www.postgresql.org/download/
[PostGIS]: https://postgis.net/install/
[Azure Maps Web SDK]: about-azure-maps#web-sdk
[Create Contour line vector tile service using Azure Function and PostgreSQL]: #create-contour-line-vector-tile-service-using-azure-function-and-postgresql
[Azure Storage Explorer]: https://azure.microsoft.com/en-us/products/storage/storage-explorer/
