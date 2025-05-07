---
title: Tile settings configuration in Microsoft Planetary Computer Pro
description: This article provides an overview of the tile settings for Microsoft Planetary Computer Pro. It explains how to configure mosaic behavior, such as default location and zoom levels, using JSON settings.
author: 777arc
ms.author: marclichtman
ms.service: azure
ms.topic: concept-article
ms.date: 04/09/2025
---

# Tile settings in Microsoft Planetary Computer Pro

For each collection in Microsoft Planetary Computer Pro, you can configure the tile settings, which determine mosaic behavior such as the default location and minimum zoom level.

In this article, see where to find and modify tile settings for Microsoft Planetary Computer Pro.

## Prerequisites

- You have a [STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-collection-web-interface.md)

## Find tile settings

The tile settings are found by going to the Collection page and selecting the Configuration button.

:::image type="content" source="media/tile-settings-1.png" alt-text="Screenshot of the tile settings tab in the Microsoft Planetary Computer Pro interface.":::

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

The `defaultLocation` field allows specifying the default zoom level and coordinates. For example:

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

:::image type="content" source="media/tile-settings-save-view-as.png" alt-text="Screenshot of the save view as default location option in the tile settings interface.":::

## Related content

- [Mosaic configurations for collections in Microsoft Planetary Computer Pro](./mosaic-configurations-for-collections.md)
- [Render configuration for Microsoft Planetary Computer Pro](./render-configuration.md)
- [Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md)
