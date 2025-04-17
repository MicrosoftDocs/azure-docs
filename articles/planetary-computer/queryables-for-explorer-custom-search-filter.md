---
title: Overview of Queryables | Microsoft Planetary Computer Pro
description: Learn how to configure and use queryables in Microsoft Planetary Computer Pro to create custom search filters for geospatial data in the Data Explorer.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: concept-article
ms.date: 04/09/2025

#customer intent: As a GeoCatalog user I want to understand what a Queryable is, and how I can configure these for my GeoCatalog collection so that I can more effectively use the Data Explorer to visualize my Geospatial Assets.

---

# Queryables for Microsoft Planetary Computer Pro Data Explorer custom search filters

## Overview

In the Microsoft Planetary Computer Pro, a **GeoCatalog** resource organizes datasets into **STAC Collections**. 
Each STAC Collection contains a set of STAC Items, and many of these items have metadata in their `properties`.

**Queryables** allow customers to define which metadata fields should be exposed as custom filters in the Data Explorer for easy search.

## What is a Queryable?

A queryable is a property from the STAC Item metadata that is promoted to be searchable in the Planetary Computer Data Explorer.

For example, from this `properties` block in a STAC Item:

```json
"properties": {
  "gsd": 0.6,
  "datetime": "2022-09-23T16:00:00Z",
  "naip:year": "2022",
  ...
}
```
We can see that "gsd" (ground sample distance; the spatial resolution measured in meters/pixel) and "naip:year" (the year the image was acquired) are searchable properties in this collection.  They can therefore be added as custom filters for ease of search in the Data Explorer.  The "datetime" property is automatically included as a custom filter in the Data Explorer for all collections. 

## Configuring Queryables from the Collection Page

On a collection's landing page, click the ⚙️ **Configuration** button to open the _Edit Collection Config_ pane.

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

Each queryable's `"definition"` field describes the features of the STAC item property and how this property will be displayed in the Data Explorer. It supports the following keys:

- `"type"` (required):  
  The expected data type of the property. Must be one of:
  - `"string"`
  - `"number"`
  - `"boolean"`

- `"enum"` (optional):  
  A list of allowed values. If provided, the enumerated options appear as checkboxes in the Data Explorer for easier selection.

- `"title"` (optional):  
  A user-friendly display name for the filter as shown in the Data Explorer.

## Using Queryables in Advanced Search

After configuring Queryables, they will appear in the **Explorer** under the **Advanced** search interface.

Click **Advanced** to reveal **Custom filters**. By default, the following filters are available:

- **Acquired** (based on the `datetime` range)
- **Item ID**

Any queryables added to the collection's Queryables configuration, for exmaple **Gsd** and **Year** in the previous NAIP example, appear as additional filter options.

You can toggle which filters are visible using the **Select filters** control.

## Defining Queryables in Code

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