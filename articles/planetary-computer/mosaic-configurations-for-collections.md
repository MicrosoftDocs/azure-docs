---
title: Mosaic Configuration Options in Microsoft Planetary Computer Pro
description: See examples of how to set up a mosaic configuration in Microsoft Planetary Computer Pro collection configuration.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: help customers set up the mosaic configurations.
ms.custom:
  - build-2025
---

# Mosaic configurations for collections in Microsoft Planetary Computer Pro

For any STAC (SpatioTemporal Asset Catalog) collection, you can define a configuration of multiple mosaics. Each **mosaic** specifies search criteria that return and visualize STAC items within the Explorer web interface. For example, a mosaic might be configured to only return items that are from a specified date range or have less than a particular percentage cloud cover.

## Components in a Mosaic

A STAC collection's mosaic configuration is a list of individual specific search criteria, each called a mosaic. Each individual mosaic includes:

- `id`: A unique identifier for the mosaic  
- `name`: A human-readable title  
- `description`: Info about the mosaic  
- `cql`: A [CQL2](https://github.com/stac-api-extensions/filter) (Common Query Language) expression that defines the search parameters for STAC items to be found and visualized

## Configuring Mosaics from the Collection Page

On a collection's landing page, select the **Configuration** button to open the _Edit Collection Config_ pane.

Inside this pane, navigate to the **Mosaics** tab.

List individual mosaics to create a mosaic configuration. All items returned from a search are sorted such that most recent items appear first. For this reason, mosaics that don't specify a `datetime` range are best named 'most recent.'

## Example Mosaic Configurations used in Open Planetary Computer

### From Sentinel-2 L2A Collection [View on Planetary Computer](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a)

A mosaic configuration with these mosaics from the Sentinel-2 L2A colleciton would enable three different ways to visualize Sentinel-2 imagery in the Explorer interface: 1. most recent search results (any cloud cover), 2. most recent search results with low cloud cover, and 3. June - August 2022 search results with low cloud cover.

```python
[
  {
    "id": "most_recent",
    "name": "Most recent (any cloud cover)",
    "description": "",
    "cql": []
  },
  {
    "id": "recent_low_cloud",
    "name": "Most recent (low cloud)",
    "description": "Less than 10% cloud cover",
    "cql": [{"op":"<=",
            "args": [{"property": "eo:cloud_cover"}, 10]}]
  },
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
]
```

### USDA Cropland Data Layers Collection [View on Planetary Computer](https://planetarycomputer.microsoft.com/dataset/usda-cdl)

Each collection may have its own set of properties that can be used in the `cql` for a specific search criteria. This mosaic configuration has a mosaic with `cql` that selects items based on their `usda_cdl` property. In this case, the mosaic specifies a search filtering for cropland data. By default, the items returned from the search are sorted by recency. 

```python
[
  {
    "id": "usda_cdl_cropland",
    "name": "Most recent cropland",
    "description": "Most recent cropland data",
    "cql": [{"op":"=",
          "args": [ {"property": "usda_cdl:type"}, "cropland"]}]
  }
]
```

## Related content

- [Render configuration for Microsoft Planetary Computer Pro](./render-configuration.md)
- [Tile settings for Microsoft Planetary Computer Pro](./tile-settings.md)
- [Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters](./queryables-for-explorer-custom-search-filter.md)
