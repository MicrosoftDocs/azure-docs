---
title: Queryables for Custom Search in Microsoft Planetary Computer Pro
description: Learn how to configure and use queryables in Microsoft Planetary Computer Pro to create custom search filters for geospatial data in the Data Explorer.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer-pro
ms.topic: concept-article
ms.date: 04/09/2025

#customer intent: As a GeoCatalog user I want to understand what a Queryable is, and how I can configure these for my GeoCatalog collection so that I can more effectively use the Data Explorer to visualize my Geospatial Assets.
ms.custom:
  - build-2025
---

# Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters

## Overview

In the Microsoft Planetary Computer Pro, a **GeoCatalog** resource organizes datasets into **STAC Collections**. 
Each SpatioTemporal Asset Catalog (STAC) Collection contains a set of STAC Items, and many of these items have metadata in their `properties`.

**Queryables** allow customers to define which metadata fields or `properties` should be appear as custom filters.  Custom filters are selectable in the Data Explorer and enable specifying values for `properties` during search.

## Prerequisites

- You have a [STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-collection-web-interface.md)

## What is a Queryable?

A queryable is a property from the STAC Item metadata that is promoted in the Planetary Computer Data Explorer interface to be easily searchable.  **Queryables** appear under 'Custom filters,' which are accessible by clicking 'Advanced' in the 'Explore datasets' pane. 

For example, from this `properties` block in a STAC Item:

```json
"properties": {
  "gsd": 0.6,
  "datetime": "2022-09-23T16:00:00Z",
  "naip:year": "2022",
  ...
}
```
`Gsd` (ground sample distance; the spatial resolution measured in meters/pixel) and `naip:year` (the year the image was acquired) are searchable properties in this collection. They can therefore be added as custom filters for ease of search in the Data Explorer. The `datetime` property is automatically included as a custom filter in the Data Explorer for all collections. 

## Configuring Queryables from the Collection Page

On a collection's landing page, select the **Configuration** button to open the _Edit Collection Config_ pane.

Inside this pane, navigate to the **Queryables** tab.

Here, you can add a list of queryable property configurations. Each entry must include:

- `"name"` : the name of the property in the STAC item's `properties` field.
- `"definition"` : a JSON schema defining the property's data type and, optionally, allowed values and display title.

Example configuration:

```json
[
  {
    "name": "gsd",
    "definition": {
      "type": "number"
    }
  },
  {
    "name": "naip:year",
    "definition": {
      "enum": [
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025"
      ],
      "type": "string",
      "title": "Year"
    }
  }
]
```

Each queryable's `"definition"` field describes the features of the STAC item property and how this property is displayed in the Data Explorer. It supports the following keys:

- `"type"` (required):  
  The expected data type of the property. Must be one of:
  - `"string"`
  - `"number"`
  - `"boolean"`

- `"enum"` (optional):  
  A list of allowed values. If provided, the enumerated options appear as checkboxes in the Data Explorer for easier selection.

- `"title"` (optional):  
  A user-friendly display name for the filter as shown in the Explorer. If a title isn't specified, by default, the name of the queryable is used as the title.

## Using Queryables in Advanced Search

User configured Queryables appear in the **Explorer** under the **Advanced** search interface.

Select **Advanced** to reveal **Custom filters**. By default, the following filters are available:

- **Acquired** (based on the `datetime` range)
- **Item ID**

Any queryables added to the collection's Queryables configuration, like **Gsd** and **Year** in the previous example, appear as other filter options.

You can toggle which filters are visible using the **Select filters** control.

## Related content

- [Mosaic configurations for collections in Microsoft Planetary Computer Pro](./mosaic-configurations-for-collections.md)
- [Render configuration for Microsoft Planetary Computer Pro](./render-configuration.md)
- [Tile settings for Microsoft Planetary Computer Pro](./tile-settings.md)
