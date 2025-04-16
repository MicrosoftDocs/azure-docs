---
title: Tile settings for Microsoft Planetary Computer Pro
description: This article provides an overview of the tile settings for Microsoft Planetary Computer Pro. It explains how to configure mosaic behavior, such as default location and zoom levels, using JSON settings.
author: MarcLichtman
ms.author: marclichtman
ms.service: planetary-computer
ms.topic: concept-article
ms.date: 04/09/2025
---

# Tile settings for Microsoft Planetary Computer Pro

For each collection in Microsoft Planetary Computer Pro, you can configure the tile settings, which determine mosaic behavior such as the default location, and minimum zoom level.

In this article, see where to find and modify tile settings for Microsoft Planetary Computer Pro.

## Prerequisites

- You have a [STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md)

## Find tile settings

The tile settings are found by going to the Collection page and selecting the Configuration button.

![Screenshot of the tile settings tab in the Microsoft Planetary Computer Pro interface](media/tilesettings1.png)

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
> Currently, zoom needs to be an integer, even though the UX supports zoom levels between integers.
 
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

![Screenshot of the save view as default location option in the tile settings interface](media/tilesettings_save_view_as.png)
