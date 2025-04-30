---
title: Mosaic configurations for collections in Microsoft Planetary Computer Pro
description: See examples of how to set up mosaic in Microsoft Planetary Computer Pro collection configuration.
author: tanyamarton
ms.author: tanyamarton
ms.service: azure
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: help customers setup the mosaic configurations. 
---

# Mosaic configurations for collections in Microsoft Planetary Computer Pro

For any STAC (SpatioTemporal Asset Catalog) collection, you can define **multiple mosaic configurations**. Each **mosaic** specifies search criteria that return and visualize STAC items within the Explorer web interface. For example, a mosaic might be configured to only return items that are from a specified date range or have less than a particular percentage cloud cover.

Each mosaic configuration includes:

- `id`: A unique identifier for the mosaic  
- `name`: A human-readable title  
- `description`: Info about the mosaic  
- `cql`: A [CQL2](https://github.com/stac-api-extensions/filter) (Common Query Language) expression that defines the search parameters for STAC items to be found and visualized

The mosaic configuration can be accessed by selecting the **Configuration** button when viewing a STAC collection. 

## Example Mosaic Configurations used in Open Planetary Computer

### 🌍 Sentinel-2 L2A Collection  

[View on Planetary Computer](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a)

These three mosaics illustrate different ways to visualize Sentinel-2 imagery:

### 1. Most recent search results (any cloud cover)

```json
{
  "id": "most_recent",
  "name": "Most recent (any cloud cover)",
  "description": "",
  "cql": []
}
```

### 2. Most recent search results with low cloud cover

```json
{
  "id": "recent_low_cloud",
  "name": "Most recent (low cloud)",
  "description": "Less than 10% cloud cover",
  "cql": [{"op":"<=",
          "args": [{"property": "eo:cloud_cover"}, 10]}]
}
```

### 3. June - August 2022 search results with low cloud cover

```json
{
  "id": "jun_aug2022_low_cloud",
  "name": "Jun - Aug, 2022 (low cloud)",
  "description": "",
  "cql": [{"op":"anyinteracts",
          "args": [ {"property": "datetime"},
                    {"interval": ["2022-06-01", "2022-08-31T23:59:59Z"]} ]},
          {"op": "<=",
          "args": [{"property": "eo:cloud_cover"}, 10]}]
}
```

### 🌍 USDA Cropland Data Layers Collection  

[View on Planetary Computer](https://planetarycomputer.microsoft.com/dataset/usda-cdl)

This mosaic filters for the most recent cropland data. 

```json
{
  "id": "usda_cdl_cropland",
  "name": "Most recent cropland",
  "description": "Most recent cropland data",
  "cql": [{"op":"=",
          "args": [ {"property": "usda_cdl:type"}, "cropland"]}]
}
```

## Related content

- [Render configuration for Microsoft Planetary Computer Pro](./render-configuration.md)
- [Tile settings for Microsoft Planetary Computer Pro](./tile-settings.md)
- [Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md)
