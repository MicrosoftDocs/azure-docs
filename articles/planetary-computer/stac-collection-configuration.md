---
title: Configure and Visualize STAC Collections
description: "[Article description]."
author: brentharris
ms.author: brentharris
ms.service: azure
ms.topic: concept-article #Don't change.
ms.date: mm/dd/yyyy

#customer intent: As a Microsoft Planetary Computer Pro user I want to understand how to configure my STAC Collection to help visualize my data. 

#customer intent: As a Microsoft Planetary Computer Pro user I want to understand how to configure my collections so I can vizualize data in the Explorer.
---

# Collection configuration in Microsoft Planetary Computer Pro

## Collection configuration

To visualize your data in the Microsoft Planetary Computer Pro Explorer, you must first configure your collection. This configuration enables users to filter and save collection subsets that match desired attribute values, create and display custom visualizations of data in a collection, set desired zoom defaults, and define searchable attributes and valid data types. Collections are configured using json forms in the UI that operate on various parameters described in STAC items. Collection configuration features include Mosaic, Render, Tile Settings, and Queryables. 

### Mosaic

Microsoft Planetary Computer Pro's Explorer allows you to specify one or more mosaic definitions for your collection. These mosaic definitions enable you to instruct Planetary Computer Pro how to filter which items are displayed within the Explorer. For example, one basic render configuration would be to display the most recent image for any given area. More advanced render configurations allow you to render different views such as the least cloudy image for a given location captured in October 2023. To learn how to configure one or more mosaic definitions, see [Quickstart: Mosaic configurations for collections in Microsoft Planetary Computer Pro](./mosaic-configurations-for-collections.md).

### Render

Before your geospatial assets can be viewed within the Explorer you must first define at least one render configuration for your collection, which will allow you to visualize data in different ways. Raster, or imagery, data may contain many different assets that can be combined to create entirely new images of a given area that highlight visible or non-visible phenomena. Render configurations give you the ability to decide which assets you want to visualize, and how you want that visualization to appear in the Explorer. For instance, Sentinel-2 data many different bands that can be combined to form false color images such as color infrared. A properly formatted render config instructs Planetary Computer Pro how to create these images so they can be displayed in the Explorer.  For more information see [Quickstart: Render configuration in Microsoft Planetary Computer Pro](./render-configuration.md).

### Tile Settings

You also have the ability to define Tile Settings based on the unique features of your collection. For example, you can set the 'min-zoom' parameter that defines the minimum zoom level at which the assets within your collection will appear on the Explorer basemap. High resolution imagery should have a high 'min-zoom' value to avoid experiencing latency when using the Explorer. Low resolution imagery can have lower 'min-zoom' levels without issue. For more information see [Quickstart: Tile settings in Microsoft Planetary Computer Pro](./tile-settings.md).

### Queryables

If your collection contains a large number of items, running complex queries may take a long time. To prevent this, Planetary Computer Pro provides the ability to index additional fields within your STAC items to improve your query performance. A queryable is a property from the STAC Item metadata that is promoted to be searchable in the Planetary Computer Data Explorer. For examples and more information on how to use queryables, see [Quickstart: Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md).


## Related content

- [Quickstart: Create and configure collections with the Microsoft Planetary Computer Pro UI](./create-collection-UI.md)
- [STAC in Microsoft Planetary Computer Pro](./stac-overview.md)