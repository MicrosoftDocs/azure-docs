---
title: Queryables for Microsoft Planetary Computer Pro data explorer custom search filters
description: Get an overview of queryables and see how to configure, define, and use queryables in Microsoft Planetary Computer Pro data explorer.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: concept-article
ms.date: 04/09/2025
#customer intent: help customers setup the mosaic configurations. 
---

# Queryables for Microsoft Planetary Computer Pro data explorer custom search filters

## Overview

In the Microsoft Planetary Computer Pro, a **GeoCatalog** resource organizes datasets into **STAC Collections**. 
Each STAC Collection contains a set of STAC Items, and many of these items have metadata in their `properties`.

**Queryables** allow customers to define which metadata fields should be exposed as custom filters in the Explorer UI for easy search.

## What can be a queryable?

A queryable is a property from the STAC Item metadata that is promoted to be searchable in the Microsoft Planetary Computer Pro data explorer.

For example, from this `properties` block in a STAC Item:

```json
"properties": {
  "gsd": 0.6,
  "datetime": "2022-09-23T16:00:00Z",
  "naip:year": "2022",
  "proj:bbox": [
      762984,
      3841950,
      769308,
      3849450
    ],
  "proj:epsg": 26917
  ...
}
```
We can see that proj:shape, gsd, and naip:year are searchable properties in this collection.

## Configure queryables from the collection page

On a collection's landing page, select the ⚙️ **Configuration** button to open the _Edit Collection Config_ pane.

Inside this pane, navigate to the **Queryables** tab.

Here, you can add a list of queryable property configurations. Each entry must include:

- `"name"` — the name of the property in the STAC item's `properties` field.
- `"definition"` — a JSON schema defining the property's data type and, optionally, allowed values and display title.

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

Each queryable's `"definition"` field describes how the property can be filtered in the Explorer. It supports the following keys:

- `"type"` (required):  
  The expected data type of the property. Must be one of:
  - `"string"`
  - `"number"`
  - `"boolean"`

- `"enum"` (optional):  
  A list of allowed values. If provided, these will appear as checkboxes in the Explorer UI for easier selection.

- `"title"` (optional):  
  A user-friendly display name for the filter as shown in the Explorer.

## Use Queryables in Advanced Search

After configuring Queryables, they appear in the **Explorer** under the **Advanced** search interface.

Select **Advanced** to reveal **Custom filters**. By default, the following filters are available:

- **Acquired** (based on the `datetime` range)
- **Item ID**

Any additional queryables configured in the collection — such as **Gsd** and **Year** — appear as additional filter options.

You can toggle which filters are visible using the **Select filters** control.

## Define Queryables in Code

Alternatively, customers can use `GeocatalogClient` to define queryables.
```python
import geocatalog

geocatalog_client = GeocatalogClient(
    url=GEOCATALOG_URL,
    credential=CREDENTIAL
)

geocatalog_client.create_queryables(
    collection_id=collection.id,
    queryables=[
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
)