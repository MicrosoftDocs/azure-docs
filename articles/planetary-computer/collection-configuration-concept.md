---
title: Collection configuration guide for Microsoft Planetary Computer Pro
description: "This article describes collection configuration in Microsoft Planetary Computer Pro."
author: beharris
ms.author: brentharris
ms.service: planetary-computer-pro
ms.topic: concept-article #Don't change.
ms.date: 04/24/2025

#customer intent: As a Microsoft Planetary Computer Pro user I want to understand collection configuration so I can vizualize data in the Explorer.
ms.custom:
  - build-2025
---

# Collection configuration in Microsoft Planetary Computer Pro

To visualize your data in the Microsoft Planetary Computer Pro Explorer, you must first configure your collection. This configuration allows users to filter and save collection subsets that match specific attribute values, create and display of custom visualizations of data within a collection, set default zoom levels for better navigation, and define searchable attributes and valid data types for improved data management.

## Collection configuration

Collections are configured using json forms in the UI that operate on various parameters described in [SpatioTemporal Asset Catalog (STAC) items](./stac-overview.md#introduction-to-stac-items). Collection configuration features include Mosaic, Render, Tile Settings, and Queryables. 

### Mosaic

Microsoft Planetary Computer Pro's Explorer allows you to specify one or more mosaic definitions for your collection. These mosaic definitions enable you to instruct Planetary Computer Pro how to filter which items are displayed within the Explorer. For example, one basic render configuration would be to display the most recent image for any given area. More advanced render configurations allow you to render different views such as the least cloudy image for a given location captured in October 2023. 

To learn how to configure one or more mosaic definitions, see [Quickstart: Mosaic configurations for collections in Microsoft Planetary Computer Pro](./mosaic-configurations-for-collections.md).

### Render

Before your geospatial assets can be viewed within the Explorer you must first define at least one render configuration for your collection, which allows you to visualize data in different ways. Raster, or imagery, data can contain many different assets that can be combined to create entirely new images of a given area that highlight visible or nonvisible phenomena. Render configurations give you the ability to decide which assets you want to visualize, and how you want that visualization to appear in the Explorer. For instance, Sentinel-2 data many different bands that can be combined to form false color images such as color infrared. A properly formatted render config instructs Planetary Computer Pro how to create these images so they can be displayed in the Explorer. 

For more information, see [Quickstart: Render configuration in Microsoft Planetary Computer Pro](./render-configuration.md).

### Tile Settings

You also have the ability to define Tile Settings based on the unique features of your collection. For example, you can set the 'min-zoom' parameter that defines the minimum zoom level at which the assets within your collection appears on the Explorer basemap. High resolution imagery should have a high 'min-zoom' value to avoid experiencing latency when using the Explorer. Low resolution imagery can have lower 'min-zoom' levels without issue. 

For more information, see [Quickstart: Tile settings in Microsoft Planetary Computer Pro](./tile-settings.md).

### Queryables

If your collection contains a large number of items, running complex queries can take a long time. To prevent this, Planetary Computer Pro allows you to index other fields within your STAC items to improve your query performance. A queryable is a property from the STAC Item metadata that is promoted to be searchable in the Planetary Computer Data Explorer. 

For examples and more information on how to use queryables, see [Quickstart: Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md).

## Next steps

Here's a quickstart guide to configuring collections:

> [!div class="nextstepaction"]
> [Quickstart: Configure a collection with the Microsoft Planetary Computer Pro web interface](./configure-collection-web-interface.md)


## Related content

- [Quickstart: Create collections with the Microsoft Planetary Computer Pro web interface](./create-collection-web-interface.md)
- [STAC in Microsoft Planetary Computer Pro](./stac-overview.md)
