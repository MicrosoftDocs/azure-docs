---
title: Tile settings configuration in Microsoft Planetary Computer Pro
description: This article provides an overview of the tile settings for Microsoft Planetary Computer Pro. It explains how to configure mosaic behavior, such as default location and zoom levels, using JSON settings.
author: 777arc
ms.author: marclichtman
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 04/09/2025
ms.custom:
  - build-2025
---

# Tile settings in Microsoft Planetary Computer Pro

For each collection in Microsoft Planetary Computer Pro, you can configure the tile settings, which determine the default location and minimum zoom level when visualizing mosaics in the Data Explorer.

In this article, see where to find and modify tile settings for Microsoft Planetary Computer Pro.

## Prerequisites

- You have a [STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-collection-web-interface.md)

## Find tile settings

The tile settings are found by going to the Collection page and selecting the Configuration button.

[ ![Screenshot of the tile settings tab in the Microsoft Planetary Computer Pro interface.](media/tile-settings-1.png) ](media/tile-settings-1.png#lightbox)

The settings are in the form of a JSON object.

### Example tile settings

```JSON
{
  "minZoom": 12,
  "maxItemsPerTile": 35,
  "defaultLocation": {
    "zoom": 12,
    "coordinates": [
      8.9637,
      -79.5437
    ]
  }
}
```

### Zoom level

High resolution imagery should have a high min zoom level to avoid experiencing latency when using the explorer. Low resolution imagery can have lower min zoom levels without issue.

> [!NOTE]
> Planetary Computer tile settings zoom must be configured as integers, even though the Explorer interface supports zooming to non-integer levels.
 
### Default location

The `defaultLocation` field lets you specify the zoom level and center coordinates used when your collection first opens in the Data Explorer. For example:

```JSON
{
  "defaultLocation": {
    "zoom": 12,
    "coordinates": [
      8.9637,
      -79.5437
    ]
  }
}
```

> [!NOTE]
> In the list of items, there's a menu item called "Set view as default location".  This isn't currently enabled.

[ ![Screenshot of the save view as default location option in the tile settings interface.](media/tile-settings-save-view-as.png) ](media/tile-settings-save-view-as.png#lightbox)

## Related content

- [Mosaic configurations for collections in Microsoft Planetary Computer Pro](./mosaic-configurations-for-collections.md)
- [Render configuration for Microsoft Planetary Computer Pro](./render-configuration.md)
- [Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md)
