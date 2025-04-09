---
title: "Quickstart: Add a STAC collection to GeoCatalog using Python"
description: Learn how to add and use STAC collections in Microsoft Planetary Computer GeoCatalog using Python.
author: TomAugspurger
ms.author: taugspurger
ms.service: mpcpro
ms.topic: quickstart
ms.date: 04/08/2025
#customer intent: As a user of geospatial data, I want to create a STAC collection so that I can organize metadata for geospatial assets for later querying.
---

# Quickstart: Create a STAC collection with Microsoft Planetary Computer GeoCatalog using Python
 
In this quickstart, you learn how to create a SpatioTemporal Asset Catalog (STAC) collection and add it to the Microsoft Planetary Computer GeoCatalog using Python. By following this guide, you'll set up the necessary prerequisites, create collection metadata, authenticate with the GeoCatalog, and configure your collection for optimal use. This quickstart is ideal for users of geospatial data who want to streamline their workflows and enhance data accessibility.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. Use the link [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your environment configured to access Azure, for example with [`az login`](/cli/azure/authenticate-azure-cli).
- Completion of [Create a GeoCatalog](./deploy-geocatalog-resource.md).
- A Python environment with ``requests`` and ``azure-identity``.

```console
python3 -m pip install requests azure-identity
```

## Create collection metadata

Fist, get the metadata for the STAC collection you want to create. This example gets the collection metadata from the Microsoft Planetary Computer's STAC API. If you already have a STAC collection, you can skip to the next section.

```python
import requests

collection = requests.get(
    "https://planetarycomputer.microsoft.com/api/stac/v1/collections/io-lulc-annual-v02"
).json()
collection.pop("assets", None)  # remove unused collection-level assets
collection["id"] = "spatio-quickstart"
collection["title"] += " (Spatio Quickstart)"
```

If you're using a different ID for your collection, make sure to replace the `id` field with the correct value.

To visualize the data assets in the Explorer, the collection metadata should include the [Item Assets](https://github.com/stac-extensions/item-assets) extension and have at least one item asset whose media type can be visualized.

## Get an access token

Microsoft Planetary Computer GeoCatalog requires an access token to authenticate requests. Using the
[azure-identity](/python/api/overview/azure/identity-readme) client library for Python.

```python
import azure.identity

credential = azure.identity.DefaultAzureCredential()
token = credential.get_token("https://geocatalog.spatio.azure.com")
headers = {
    "Authorization": f"Bearer {token.token}"
}
```

This can be provided as a Bearer token in the `Authorization` header in requests made to the service.

## Add a collection to a GeoCatalog

With the STAC metadata, a token, and the URL to your GeoCatalog, make a request to the STAC API to add the Collection.

```python
# Put the URL to your Microsoft Planetary Computer GeoCatalog (not including '/api' or a trailing '/' ) here
geocatalog_url = "<your-geocatalog-url>"

response = requests.post(
    f"{geocatalog_url}/api/collections",
    json=collection,
    headers=headers,
    params={"api-version": "2024-01-31-preview"},
)
print(response.status_code)
```

A status code of `201` indicates that your Collection was created. A status code of `409` indicates that a collection with that ID already exists. See [Update a collection](#update-a-collection) for how to update an existing collection.

You can now get this collection at the `/api/collections/{collection_id}` endpoint.

```python
geocatalog_collection = requests.get(
    f"{geocatalog_url}/api/collections/{collection['id']}",
    headers=headers,
    params={"api-version": "2024-01-31-preview"},
).json()
```

You can also visit your GeoCatalog in your Explorer to see the new collection.

## Configure a collection

Each collection in a GeoCatalog includes some configuration that controls how the Item metadata is stored, indexed, and visualized.

1. Define a render configuration for the collection. This controls how the assets are rendered when visualized in the Explorer. The appropriate values to use here depend on the assets in your collection.

    ```python
    import json
    import urllib.parse
    
    colormap = {
        0: (0, 0, 0, 0),
        1: (65, 155, 223, 255),
        2: (57, 125, 73, 255),
        3: (136, 176, 83, 0),
        4: (122, 135, 198, 255),
        5: (228, 150, 53, 255),
        6: (223, 195, 90, 0),
        7: (196, 40, 27, 255),
        8: (165, 155, 143, 255),
        9: (168, 235, 255, 255),
        10: (97, 97, 97, 255),
        11: (227, 226, 195, 255),
    }
    colormap = urllib.parse.urlencode({"colormap": json.dumps(colormap)})
    render_option = {
        "id": "default",
        "name": "Default",
        "description": "Land cover classification using 9 class custom colormap",
        "type": "raster-tile",
        "options": f"assets=data&exitwhenfull=False&skipcovered=False&{colormap}",
        "minZoom": 6,
    }
    
    response = requests.post(
        f"{geocatalog_url}/api/collections/{collection['id']}/config/render-options",
        json=render_option,
        headers=headers,
        params={"api-version": "2024-01-31-preview"}
    )
    print(response.status_code)
    ```

1. Define a mosaic for the collection. This controls how items are queried and combined to create a single view of the data on a map. The mosaic displays the most recent items.

    ```python
    mosaic = {
        "id": "most-recent",
        "name": "Most recent available",
        "description": "Show the most recent available data",
        "cql": [],
    }
    response = requests.post(
        f"{geocatalog_url}/api/collections/{collection['id']}/config/mosaics",
        json=mosaic,
        headers=headers,
        params={"api-version": "2024-01-31-preview"}
    )
    print(response.status_code)
    ```

    The `cql` field of the mosaic configuration can be used to filter the items based on their properties. For example, if your STAC items implement the [`eo` extension][eo], you could define a "low cloud" (less than 10% cloudy) filter with

    ```python
    "cql": [{"op": "<=", "args": [{"property": "eo:cloud_cover"}, 10]}]
    ```

1. Define Tile Settings for the collection. This controls the things like the minimum zoom level.

    ```python
    tile_settings = {
      "minZoom": 6,
      "maxItemsPerTile": 35,
    }
    requests.put(
        f"{geocatalog_url}/api/collections/{collection['id']}/config/tile-settings",
        json=tile_settings,
        headers=headers,
        params={"api-version": "2024-01-31-preview"}
    )
    ```

## Update a collection

You can update an existing collection with a `PUT` request to the `/api/collections/{collection_id}` endpoint.

```python
collection["description"] += " (Updated)"

response = requests.put(
    f"{geocatalog_url}/api/collections/{collection['id']}",
    headers={"Authorization": f"Bearer {token.token}"},
    json=collection,
    params={"api-version": "2024-01-31-preview"},
)
print(response.status_code)
```

A `200` status code indicates that the collection was successfully updated.

## Clean up resources

You can use a `DELETE` request to remove the collection from your GeoCatalog. Deleting a collection also deletes:

1. All the STAC Items that are children of that collection.
1. All the assets that are children of those items.
1. All the collection-level assets of that collection.

The quickstart, [Add STAC Items to a collection](items-api-python.md), uses this collection so don't delete it yet if you plan to complete that quickstart.

```python
response = requests.delete(
    f"{geocatalog_url}/api/collections/{collection['id']}",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2024-01-31-preview"}
)
print(response.status_code)
```

A status code of `204` indicates that your Collection was deleted.

> [!WARNING]
> If you delete a collection, you must wait at least 45 seconds before attempting to create a new collection with an identical name/id. If you attempt to create a new collection using the same name as the deleted collection you'll receive an error. If this error occurs, please try to recreate the collection after a 45 second wait.


## Next step

[Add items to a STAC collection](./items-api-python.md)
