---
title: Adding STAC Items to Collections in Microsoft Planetary Computer Pro
description: Learn how to add and use STAC Items in Microsoft Planetary Computer Pro GeoCatalog and Python.
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 04/09/2025

#customer intent: As a user of geospatial data, I want to ingest STAC items so that I can efficiently query and access my geospatial data.
ms.custom:
  - build-2025
---
  
# Quickstart: Ingest a Single STAC Item into a Collection in a Microsoft Planetary Computer Pro GeoCatalog

In this quickstart, you ingest SpatioTemporal Asset Catalog (STAC) items to a collection in Microsoft Planetary Computer Pro GeoCatalog using the single item ingestion API. STAC items are the fundamental building block of STAC that contain properties for querying and links to the data assets.

## Prerequisites

Before starting this quickstart, you should first complete the quickstart to [Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md), or have a GeoCatalog with a STAC collection for the items you intend to ingest.

**Skip the following code snippet if you created the STAC collection within the current terminal/script**, otherwise you must set the geocatalog_url and collection_id using the following Python code:

```python
# Put the URL to your Microsoft Planetary Computer Pro GeoCatalog Explorer (not including '/api') here.
# Make sure there's no trailing '/'
geocatalog_url = "<your-geocatalog-url>"
# collection_id is "spatio-quickstart" if you're following the collection quickstart
collection_id = "<your-collection-id>"
```

## Create item metadata

The STAC item metadata is unique to the assets you're cataloging. It contains all the information required to catalog the data, along with pointers to where the data is stored.

>[!TIP]
> Don't have STAC Items for your data? To accelerate the creation of STAC Items, we have a [detailed tutorial](./create-stac-item.md) and also have an open source tool called [STAC Forge](https://github.com/Azure/microsoft-planetary-computer-pro/tree/main/tools/stacforge-functions).

For this quick start, you use STAC Items and assets from the open Planetary Computer's [10 m Annual Land Use Land Cover](https://planetarycomputer.microsoft.com/dataset/io-lulc-annual-v02) collection. 

```python
import requests

response = requests.get(
    "https://planetarycomputer.microsoft.com/api/stac/v1/search",
    params={"collections": "io-lulc-annual-v02", "ids": "23M-2023,23L-2023,24M-2023,24L-2023"},
)

item_collection = response.json()
```

Use the open Planetary Computer's [SAS API](https://planetarycomputer.microsoft.com/docs/concepts/sas/) to get short-lived SAS tokens for the assets.

```python
sas_token = requests.get(
    "https://planetarycomputer.microsoft.com/api/sas/v1/token/io-lulc-annual-v02"
).json()["token"]

for item in item_collection["features"]:
    for asset in item["assets"].values():
        asset["href"] = "?".join([asset["href"], sas_token])
```

This SAS Token is required to allow your GeoCatalog to copy the data from the open Planetary Computer. See [Ingestion sources](./ingestion-source.md) for more on how Planetary Computer Pro accesses data.

STAC requires that the `collection` property on STAC items match the collection they're in. If necessary, update the items to match the collection ID you're using.

```python
for item in item_collection["features"]:
    item["collection"] = collection_id
```

## Get an access token

Planetary Computer Pro requires an access token to authenticate requests via [Microsoft Entra](/entra/fundamentals/whatis). Use the [Azure-identity](/python/api/overview/azure/identity-readme) client library for Python to get a token.

```python
import azure.identity

credential = azure.identity.AzureCliCredential()
token = credential.get_token("https://geocatalog.spatio.azure.com")
headers = {
    "Authorization": f"Bearer {token.token}"
}
```

## Add items to a collection

Items can be added to a collection by posting an `Item` or `ItemCollection` object to the `/stac/collections/{collection_id}/items` endpoint.

```python
response = requests.post(
    f"{geocatalog_url}/stac/collections/{collection_id}/items?api-version=2025-04-30-preview",
    headers=headers,
    json=item_collection
)
print(response.status_code)
```

A `202` status code indicates that your items were accepted for ingestion. Check the response JSON if you get a 40x status code, for example, `print(response.json())`.

Planetary Computer Pro asynchronously ingests the items into your GeoCatalog. The `location` header includes a URL that you can poll to monitor the status of the ingestion workflow.

```python
import time
import datetime

location = response.headers["location"]

while True:
    response = requests.get(location, headers={"Authorization": f"Bearer {token.token}"})
    status = response.json()["status"]
    print(datetime.datetime.now().isoformat(), status)
    if status not in {"Pending", "Running"}:
        break
    time.sleep(5)
```

Once the items are ingested, use the `/stac/collections/{collection_id}/items` or `/stac/search` endpoints to get a paginated list of items, including your newly ingested items.

```python
items_response = requests.get(
    f"{geocatalog_url}/stac/collections/{collection_id}/items",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2025-04-30-preview"},
)
items_ingested = items_response.json()
print(f"Found {len(items_ingested['features'])} items")
```

Or search:

```python
search_response = requests.get(
    f"{geocatalog_url}/stac/search",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2025-04-30-preview", "collection": collection_id},
)
#print(search_response.json())
```

You can view the items by visiting your [Data Explorer](./use-explorer.md) once the STAC Collection is [configured for visualization](./collection-configuration-concept.md).

## Delete Items from a Collection

Items can be deleted from a collection with a `DELETE` request to the item detail endpoint.

```python
item_id = item_collection["features"][0]["id"]
delete = requests.delete(
    f"{geocatalog_url}/stac/collections/{collection_id}/items/{item_id}",
    headers=headers,
    params={"api-version": "2025-04-30-preview"},
)
print(delete.status_code)
```

## Clean up resources

See [Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md) for steps to
delete an entire Collection and all items and assets underneath it.

## Next steps

Now that you added a few items, you should configure the data for visualization.

> [!div class="nextstepaction"]
> [Collection configuration in Microsoft Planetary Computer Pro](./collection-configuration-concept.md)

## Related Items

- [Ingest data into GeoCatalog with the Bulk Ingestion API](./bulk-ingestion-api.md)
- [Quickstart: Ingest data using the Microsoft Planetary Computer Pro web interface](./ingest-via-web-interface.md)
- [Ingest data into Microsoft Planetary Computer Pro](./ingestion-overview.md)
- [Ingestion source for Microsoft Planetary Computer Pro](./ingestion-source.md)
