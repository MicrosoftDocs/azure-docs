---
title: "Quickstart: Add STAC Items to a Collection with Microsoft Planetary Computer Pro GeoCatalog using Python"
description: Learn how to add and use STAC Items in Microsoft Planetary Computer Pro GeoCatalog and Python.
author: TomAugspurger
ms.author: taugspurger
ms.service: planetary-computer
ms.topic: quickstart
ms.date: 04/09/2025

#customer intent: As a user of geospatial data, I want to ingest STAC items so that I can efficiently query and access my geospatial data.
---
  
# Quickstart: Add STAC items to a collection with Microsoft Planetary Computer Pro GeoCatalog using Python

In this quickstart, you ingest SpatioTemporal Asset Catalog (STAC) items to a collection in Microsoft Planetary Computer Pro (MPC Pro) GeoCatalog. STAC items are the fundamental building block of STAC and contain properties for querying and links to the data assets.

## Prerequisites

To complete this quickstart, you should:

- Have completed the quickstart to [Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md), or have a GeoCatalog with a STAC collection for the items you intend to ingest.

**Skip the following code snippet if you created the STAC collection within the current terminal/script**, otherwise you must set the geocatalog_url and collection_id using the following Python code:

```python
# Put the URL to your Microsoft Planetary Computer Pro GeoCatalog Explorer (not including '/api') here.
# Make sure there's no trailing '/'
geocatalog_url = "<your-geocatalog-url>"
# collection_id is "spatio-quickstart" if you're following the collection quickstart
collection_id = "<your-collection-id>"
```

## Create item metadata

The item metadata is unique to the assets you're cataloging. Use items and assets from the Planetary Computer's [10m Annual Land Use Land Cover](https://planetarycomputer.microsoft.com/dataset/io-lulc-annual-v02) collection.

```python
import requests

response = requests.get(
    "https://planetarycomputer.microsoft.com/api/stac/v1/search",
    params={"collections": "io-lulc-annual-v02", "ids": "23M-2023,23L-2023,24M-2023,24L-2023"},
)

item_collection = response.json()
```

MPC Pro GeoCatalog copies the assets into its Blob Storage Container. Use the Planetary Computer's `sas` API to get short-lived SAS tokens for the assets.

```python
sas_token = requests.get(
    "https://planetarycomputer.microsoft.com/api/sas/v1/token/io-lulc-annual-v02"
).json()["token"]

for item in item_collection["features"]:
    for asset in item["assets"].values():
        asset["href"] = "?".join([asset["href"], sas_token])
```

See [Ingestion sources](./ingestion-sources.md) for more on how MPC Pro accesses data.

STAC requires that the `collection` property on STAC items match the collection they're in. If necessary, update the items to match the collection ID you're using.

```python
for item in item_collection["features"]:
    item["collection"] = collection_id
```

## Get an access token

MPC Pro GeoCatalog requires an access token to authenticate requests. Use the [azure-identity](/python/api/overview/azure/identity-readme) client library for Python to get a token.

```python
import azure.identity

credential = azure.identity.DefaultAzureCredential()
token = credential.get_token("https://geocatalog.spatio.azure.com")
headers = {
    "Authorization": f"Bearer {token.token}"
}
```

## Add items to a collection

Items can be added to a collection by posting an `Item` or `ItemCollection` object to the `/collections/{collection_id}/items` endpoint.

```python
response = requests.post(
    f"{geocatalog_url}/api/collections/{collection_id}/items?api-version=2024-01-31-preview",
    headers=headers,
    json=item_collection
)
print(response.status_code)
```

A `202` status code indicates that your items were accepted for ingestion. Check the response JSON if you get a 40x status code, e.g., `print(response.json())`.

MPC Pro asynchronously ingests the items into your GeoCatalog. The `location` header includes a URL that you can poll to monitor the status of the ingest.

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

A status of `Success` indicates that the import completed successfully. A status of `Failed` indicates that one of more of the items couldn't be imported. Use the `logs` endpoint to get more information on the failure.

```python
operation_id = response.json()["operationId"]
logs_response = requests.get(
    f"{geocatalog_url}/api/collections/{collection_id}/operations/{operation_id}/logs",
    params={"api-version": "2024-01-31-preview"},
    headers=headers
)
print(logs_response.text)
```

Once the items are ingested, use the `/api/collections/{collection_id}/items` or `/api/search` endpoints to get a paginated list of items, including your newly ingested items.

```python
items_response = requests.get(
    f"{geocatalog_url}/api/collections/{collection_id}/items",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2024-01-31-preview"},
)
items_ingested = items_response.json()
print(f"Found {len(items_ingested['features'])} items")
```

Or search:

```python
search_response = requests.get(
    f"{geocatalog_url}/api/collections/{collection_id}/items",
    headers={"Authorization": f"Bearer {token.token}"},
    params={"api-version": "2024-01-31-preview", "collection": collection_id},
)
#print(search_response.json())
```

Visit your GeoCatalog Explorer to view the items.

## Delete Items from a Collection

Items can be deleted from a collection with a `DELETE` request to the item detail endpoint.

```python
item_id = item_collection["features"][0]["id"]
delete = requests.delete(
    f"{geocatalog_url}/api/collections/{collection_id}/items/{item_id}",
    headers=headers,
    params={"api-version": "2024-01-31-preview"},
)
print(delete.status_code)
```

## Clean up resources

See [Create a STAC collection with Microsoft Planetary Computer Pro GeoCatalog](./create-stac-collection.md) for steps to
delete an entire Collection and all items and assets underneath it.
