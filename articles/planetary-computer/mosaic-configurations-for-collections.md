---
title: Mosaic configurations for collections in Microsoft Planetary Computer
description: See examples of how to setup mosaic in Microsoft Planetary Computer collection configuration.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: help customers setup the mosaic configurations. 
---

# Mosaic configurations for collections in Microsoft Planetary Computer

For any STAC collection, you can define **multiple mosaic configurations**. A **mosaic** returns and visualizes within the Explorer a set of STAC items based on some specific search criteria — for example, filtering by datetime or cloud cover.

Each mosaic configuration includes:

- `id`: A unique identifier for the mosaic  
- `name`: A human-readable title  
- `description`: Additional info about the mosaic  
- `cql`: A [CQL2](https://github.com/stac-api-extensions/filter) (Common Query Language) expression that defines the search parameters for STAC items to be found and visualized

The mosaic configuration can be accessed by selecting the **Configuration** button when viewing a STAC collection. 

## Example Mosaic Configurations used in Open Planetary Computer

### 🌍 Sentinel-2 L2A Collection  

[View on Planetary Computer](https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a)

These three mosaics illustrate different ways to visualize Sentinel-2 imagery:

### 1. Most recent results (any cloud cover)

```json
{
  "id": "most_recent",
  "name": "Most recent (any cloud cover)",
  "description": "",
  "cql": []
}
```

### 2. Most recent results with low cloud cover

```json
{
  "id": "recent_low_cloud",
  "name": "Most recent (low cloud)",
  "description": "Less than 10% cloud cover",
  "cql": [{"op":"<=",
          "args": [{"property": "eo:cloud_cover"}, 10]}]
}
```

### 3. Summer 2022 results with low cloud cover

```json
{
  "id": "summer2022_low_cloud",
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