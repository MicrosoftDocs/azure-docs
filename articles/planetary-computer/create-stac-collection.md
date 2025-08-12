---
title: Create STAC Collections via API in Microsoft Planetary Computer Pro
description: Learn how to add and use STAC collections in Microsoft Planetary Computer Pro GeoCatalog using Python.
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 04/24/2025
#customer intent: As a user of geospatial data, I want to create a STAC collection so that I can organize metadata for geospatial assets for later querying.
ms.custom:
  - build-2025
---

# Quickstart: Create a STAC Collection in Microsoft Planetary Computer Pro GeoCatalog with Python

This quickstart guides you to create a SpatioTemporal Asset Catalog (STAC) collection and add it to a Microsoft Planetary Computer Pro GeoCatalog using Python.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. Use the link [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your environment configured to access Azure, for example with [`az login`](/cli/azure/authenticate-azure-cli).
- Access to a Planetary Computer Pro GeoCatalog. If you don't already have access you can [create a new GeoCatalog](./deploy-geocatalog-resource.md).
- A Python environment with ``requests`` and ``azure-identity`` installed.

```console
python3 -m pip install requests azure-identity
```

## Create a STAC Collection JSON

In order to create a STAC collection you first need a json file that defines the collection properties. Some properties are required when creating STAC Collections as described in the [STAC Collection Overview](./stac-overview.md#stac-collections). Other properties can be added depending on your use case and data type.

For this tutorial, read the *io-lulc-annual-v02* STAC collection from the Planetary Computer Pro's STAC API. If you already this as STAC collection in your GeoCatalog you can skip to the next section.

```python
import requests

collection = requests.get(
    "https://planetarycomputer.microsoft.com/api/stac/v1/collections/io-lulc-annual-v02"
).json()
collection.pop("assets", None)  # remove unused collection-level assets
collection["id"] = "mpc-quickstart"
collection["title"] += " (Planetary Computer Quickstart)"
```

If you're using a different ID for your collection, make sure to replace the `id` field with the correct value.

To visualize the data assets within this collection in the Explorer, the collection metadata should include the [Item Assets](https://github.com/stac-extensions/item-assets) extension and have at least one item asset whose media type can be visualized.

## Get an access token

Accessing a GeoCatalog requires a token to authenticate requests. Use the [Azure-identity](/python/api/overview/azure/identity-readme) client library for Python to retrieve a token:

```python
import azure.identity

credential = azure.identity.DefaultAzureCredential()
token = credential.get_token("https://geocatalog.spatio.azure.com")
headers = {
    "Authorization": f"Bearer {token.token}"
}
```

This credential can be provided as a Bearer token in the `Authorization` header in requests made to your GeoCatalog.

## Add a collection to a GeoCatalog

With the STAC metadata, a token, and the URL to your GeoCatalog, make a request to the STAC API to add the Collection.

```python
# Put the URL to your Planetary Computer Pro GeoCatalog (not including '/stac' or a trailing '/' ) here
geocatalog_url = "<your-geocatalog-url>"

response = requests.post(
    f"{geocatalog_url}/stac/collections",
    json=collection,
    headers=headers,
    params={"api-version": "2025-04-30-preview"},
)
print(response.status_code)
```

A status code of `201` indicates that your Collection was created. A status code of `409` indicates that a collection with that ID already exists. See [Update a collection](#update-a-collection) for how to update an existing collection.

You can now read this collection at the `/stac/collections/{collection_id}` endpoint.

```python
geocatalog_collection = requests.get(
    f"{geocatalog_url}/stac/collections/{collection['id']}",
    headers=headers,
    params={"api-version": "2025-04-30-preview"},
).json()
```

You can also view your GeoCatalog in your browser to see the new collection.

## Configure a collection

Each collection in a GeoCatalog includes some configuration that controls how the STAC items and their data assets is stored, indexed, and visualized. To configure a collection:

1. Define a render configuration for the collection. This render configuration controls how the STAC item assets within the collection are rendered when visualized in the GeoCatalog Explorer. The specific parameters used here depend on the assets in your collection.

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
        f"{geocatalog_url}/stac/collections/{collection['id']}/configurations/render-options",
        json=render_option,
        headers=headers,
        params={"api-version": "2025-04-30-preview"}
    )
    print(response.status_code)
    ```

2. Define a mosaic for the collection. The mosaic configuration controls how items are queried, filtered, and combined to create a single view of the data on the GeoCatalog Explorer. The following sample mosaic configuration doesn't apply any extra query parameters or filters. As a result, when this configuration is selected within the GeoCatalog Explorer, all the items within the collection are shown, with the most recent items displayed first.

    ```python
    mosaic = {
        "id": "most-recent",
        "name": "Most recent available",
        "description": "Show the most recent available data",
        "cql": [],
    }
    response = requests.post(
        f"{geocatalog_url}/stac/collections/{collection['id']}/configurations/mosaics",
        json=mosaic,
        headers=headers,
        params={"api-version": "2025-04-30-preview"}
    )
    print(response.status_code)
    ```

    The `cql` field of the mosaic configuration can be used to filter the items based on their properties. For example, if your STAC items implement the [`eo` extension][eo], you could define a "low cloud" (less than 10% cloudy) filter with

    ```python
    "cql": [{"op": "<=", "args": [{"property": "eo:cloud_cover"}, 10]}]
    ```

3. Define Tile Settings for the collection. This controls the things like the minimum zoom level.

    ```python
    tile_settings = {
      "minZoom": 6,
      "maxItemsPerTile": 35,
    }
    requests.put(
        f"{geocatalog_url}/stac/collections/{collection['id']}/configurations/tile-settings",
        json=tile_settings,
        headers=headers,
        params={"api-version": "2025-04-30-preview"}
    )
    ```

## Update a collection

You can update an existing collection with a `PUT` request to the `/stac/collections/{collection_id}` endpoint.

```python
collection["description"] += " (Updated)"

response = requests.put(
    f"{geocatalog_url}/stac/collections/{collection['id']}",
    headers={"Authorization": f"Bearer {token.token}"},
    json=collection,
    params={"api-version": "2025-04-30-preview"},
)
print(response.status_code)
```

A `200` status code indicates that the collection was successfully updated.

## Clean up resources

You can use a `DELETE` request to remove the collection from your GeoCatalog. Deleting a collection also deletes:

1. All the STAC Items that are children of that collection.
1. All the assets that are children of those items.
1. All the collection-level assets of that collection.

The quickstart, [Add STAC Items to a collection](./add-stac-item-to-collection.md), uses this collection so don't delete it yet if you plan to complete that quickstart.

```python
response = requests.delete(
    f"{geocatalog_url}/stac/collections/{collection['id']}",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2025-04-30-preview"}
)
print(response.status_code)
```

A status code of `204` indicates that your Collection was deleted.

> [!WARNING]
> If you delete a collection, you must wait at least 45 seconds before attempting to create a new collection with an identical name / ID. If you attempt to create a new collection using the same name as the deleted collection, you receive an error. If this error occurs, try to recreate the collection after a 45-second wait.


## Next step

> [!div class="nextstepaction"]
> [Add items to a STAC collection](./add-stac-item-to-collection.md)

## Related content

- [Quickstart: Create a collection with the Microsoft Planetary Computer Pro web interface](./create-collection-web-interface.md)
- [Configure your collection for visualization in the Explorer](./collection-configuration-concept.md)