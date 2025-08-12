---
title: Microsoft Planetary Computer Pro API Usage Guide
description: "In this tutorial, you'll create and store satellite imagery within a Microsoft Planetary Computer Pro GeoCatalog"
author: TaylorCorbett
ms.author: gecorbet
ms.service: planetary-computer-pro
ms.topic: tutorial
ms.date: 4/25/2025

#customer intent: As a user, I want to create a GeoCatalog collection and populate it with satellite imagery so that I can learn how to repeat the process with my own data.
ms.custom:
  - build-2025
---

# Tutorial: Using the Microsoft Planetary Computer Pro APIs to ingest and visualize data

STAC (SpatioTemporal Asset Catalog) Collections are used within a GeoCatalog to index and store related spatiotemporal assets. In this end-to-end tutorial, you'll create a new STAC collection, ingest Sentinel-2 images into the collection, and query those images via GeoCatalog's APIs.

In this tutorial, you:
* Will create your very own STAC collection within a Planetary Computer Pro GeoCatalog
* Ingest satellite imagery into that collection from the European Space Agency
* Configure the collection so the imagery in the collection can be visualized in the Planetary Computer Pro's web interface
* Query data from within the STAC collection using the Planetary Computer Pro's STAC API

This tutorial shows and explains capabilities through code snippets, for an interactive notebook style experience, [download this tutorial as a Jupyter notebook](https://github.com/Azure/microsoft-planetary-computer-pro/blob/main/notebooks/GeoCatalog_Tutorial.ipynb). 

## Prerequisites

Before running this tutorial, you need a Planetary Computer Pro GeoCatalog deployed in your Azure subscription. You also need an environment to execute this notebook and install the necessary packages. We suggest running this tutorial through an Azure Machine Learning Virtual Machine or Visual Studio Code's notebook integration in a Python virtual environment. However, this notebook should run wherever you can run Jupyter notebooks, provided the following requirements are met:

* Python 3.10 or later
* Azure CLI is installed, and you have run az login to log into your Azure account
* The necessary requirements listed in the Tutorial Options section are installed

## Open a Jupyter notebook in Azure Machine Learning or VS Code

### Log in to Azure with the Azure CLI
The following command logs you into Azure using the Azure CLI. Run the command and follow the instructions to log in.

```python
!az login
```

## Select tutorial options

Before running this tutorial, you need contributor access to an existing GeoCatalog instance. Enter the url of your GeoCatalog instance in the geocatalog_url variable. In this tutorial, you'll create a collection for Sentinel-2 imagery provided by the European Space Agency (ESA) that is currently stored in Microsoft's Planetary Computer Data Catalog.


```python
# URL for your given GeoCatalog
geocatalog_url = (
    "<GEOCATALOG_URL>"
)
geocatalog_url = geocatalog_url.rstrip("/")  # Remove trailing slash if present

api_version = "2025-04-30-preview"

# User selections for demo

# Collection within the Planetary Computer
pc_collection = "sentinel-2-l2a"

# Bounding box for AOI
bbox_aoi = [-22.455626, 63.834083, -22.395201, 63.880750]

# Date range to search for imagery
param_date_range = "2024-02-04/2024-02-11"

# Maximum number of items to ingest
param_max_items = 6
```

### Import the required packages

Before you can create a STAC collection you need to import a few python packages and define helper functions to retrieve the required access token.


```shell
pip install pystac-client azure-identity requests pillow
```


```python
# Import the required packages
import json
import random
import string
import time
from datetime import datetime, timedelta, timezone
from io import BytesIO
from typing import Any, Optional, Dict

import requests
from azure.identity import AzureCliCredential
from IPython.display import Markdown as md
from IPython.display import clear_output
from PIL import Image
from pystac_client import Client

# Function to get a bearer token for the  Planetary Computer Pro API
MPC_APP_ID = "https://geocatalog.spatio.azure.com"

_access_token = None
def getBearerToken():
    global _access_token
    if not _access_token or datetime.fromtimestamp(_access_token.expires_on) < datetime.now() + timedelta(minutes=5):
        credential = AzureCliCredential()
        _access_token = credential.get_token(f"{MPC_APP_ID}/.default")

    return {"Authorization": f"Bearer {_access_token.token}"}

# Method to print error messages when checking response status
def raise_for_status(r: requests.Response) -> None:
    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        try:
            print(json.dumps(r.json(), indent=2))
        except:
            print(r.content)
        finally:
            raise
```
## Create a STAC collection

### Define a STAC Collection JSON
Next, you define a STAC collection as a JSON item.  For this tutorial, use an existing STAC collection JSON for the Sentinel-2-l2a collection within Microsoft's Planetary Computer. Your collection is assigned a random ID and title so as not to conflict with other existing collections.


```python
# Load example STAC collection JSON

response = requests.get(
    f"https://planetarycomputer.microsoft.com/api/stac/v1/collections/{pc_collection}"
)
raise_for_status(response)
stac_collection = response.json()

collection_id = pc_collection + "-tutorial-" + str(random.randint(0, 1000))

# Genereate a unique name for the test collection
stac_collection["id"] = collection_id
stac_collection["title"] = collection_id

# Determine the storage account and container for the assets
pc_storage_account = stac_collection.pop("msft:storage_account")
pc_storage_container = stac_collection.pop("msft:container")
pc_collection_asset_container = (
    f"https://{pc_storage_account}.blob.core.windows.net/{pc_storage_container}"
)

# View your STAC collection JSON
stac_collection
```

When creating a collection within GeoCatalog a collection JSON can't have any collection level assets (such as a collection thumbnail) associated with the collection, so first remove those existing assets (don't worry you add the thumbnail back later).


```python
# Save the thumbnail url
thumbnail_url = stac_collection['assets']['thumbnail']['href']

# Remove the assets field from the JSON (you'll see how to add this back later)
print("Removed the following items from the STAC Collection JSON:")
stac_collection.pop('assets')
```


```python
# Create a STAC collection by posting to the STAC collections API

collections_endpoint = f"{geocatalog_url}/stac/collections"

response = requests.post(
    collections_endpoint,
    json=stac_collection,
    headers=getBearerToken(),
    params={"api-version": api_version}
)

if response.status_code==201:
    print("STAC Collection created named:",stac_collection['title'])
else:
    raise_for_status(response)
```

Open your GeoCatalog web interface and you should see your new collection listed under the "Collections" tab.

### Access collection thumbnail

Next you want to add a thumbnail to our collection to be displayed along with our collection. For the purposes of this demo, use the thumbnail from the existing Sentinel-2 collection within Microsoft's Planetary Computer.


```python
# Read thumbnail for your collection

thumbnail_response = requests.get(thumbnail_url)
raise_for_status(thumbnail_response)
img = Image.open(BytesIO(thumbnail_response.content))
img
```

### Add thumbnail to your Planetary Computer Pro GeoCatalog

After reading the thumbnail, you can add it to our collection in by posting it to your GeoCatalogs's collection assets API endpoint along with the required asset json.


```python
# Define the GeoCatalog collections API endpoint
collection_assets_endpoint = f"{geocatalog_url}/stac/collections/{collection_id}/assets"

# Read the example thumbnail from this collection from the Planetary Computer
thumbnail = {"file": ("lulc.png", thumbnail_response.content)}

# Define the STAC collection asset type - thumbnail in this case
asset = {
    "data": '{"key": "thumbnail", "href":"", "type": "image/png", '
    '"roles":  ["test_asset"], "title": "test_asset"}'
}

# Post the thumbnail to the GeoCatalog collections asset endpoint
response = requests.post(
    collection_assets_endpoint,
    data=asset,
    files=thumbnail,
    headers=getBearerToken(),
    params={"api-version": api_version}
)

if response.status_code==201:
    print("STAC Collection thumbnail updated for:",stac_collection['title'])
else:
    raise_for_status(response)
```

### Read new collection from within your Planetary Computer Pro GeoCatalog

Refresh your browser and you should be able to see the thumbnail.  You can also retrieve the collection JSON programmatically by making the following call to the collections endpoint:


```python
# Request the collection JSON from your GeoCatalog
collection_endpoint = f"{geocatalog_url}/stac/collections/{stac_collection['id']}"

response = requests.get(
    collection_endpoint,
    json={'collection_id':stac_collection['id']},
    headers=getBearerToken(),
    params={"api-version": api_version}
)

if response.status_code==200:
    print("STAC Collection successfully read:",stac_collection['title'])
else:
    raise_for_status(response)

response.json()
```


```python
print(f"""
You successfully created a new STAC Collection in GeoCatalog named {collection_id}.
You can view your collection by visiting the GeoCatalog Explorer: {geocatalog_url}/collections
""")
```

## Ingest STAC items & assets

After creating this collection, you're ready to ingest new STAC items into your STAC collection using your GeoCatalog's Items API! Accomplish this process by:

1. Obtaining a SAS token from Microsoft's Planetary Computer
2. Register that token as an Ingestion Source within GeoCatalog
3. Post STAC Items from that collection to GeoCatalog's Item API
4. Verify the Items were ingested successfully



```python
ingestion_sources_endpoint = f"{geocatalog_url}/inma/ingestion-sources"
ingestion_source_endpoint = lambda id: f"{geocatalog_url}/inma/ingestion-sources/{id}"


def find_ingestion_source(container_url: str) -> Optional[Dict[str, Any]]:

    response = requests.get(
        ingestion_sources_endpoint,
        headers=getBearerToken(),
        params={"api-version": api_version},
    )

    for source in response.json()["value"]:
        ingestion_source_id = source["id"]

        response = requests.get(
            ingestion_source_endpoint(ingestion_source_id),
            headers=getBearerToken(),
            params={"api-version": api_version},
        )
        raise_for_status(response)

        response = response.json()

        if response["connectionInfo"]["containerUrl"] == container_url:
            return response


def create_ingestion_source(container_url: str, sas_token: str):
    response = requests.post(
        ingestion_sources_endpoint,
        json={
            "kind": "SasToken",
            "connectionInfo": {
                "containerUrl": container_url,
                "sasToken": sas_token,
            },
        },
        headers=getBearerToken(),
        params={"api-version": api_version},
    )
    raise_for_status(response)


def remove_ingestion_source(ingestion_source_id: str):
    response = requests.delete(
        ingestion_source_endpoint(ingestion_source_id),
        headers=getBearerToken(),
        params={"api-version": api_version},
    )
    raise_for_status(response)
```

### Query the Planetary Computer
First you need to query the Planetary Computer to search for Sentinel-2 images that match our specific requirements. In this case, you're looking for Sentinel-2 imagery in the Planetary Computer that matches the following criteria:

* Collection - Imagery from the Sentinel-2-l2a collection
* Time range - Collected between February 4 and February 11 2024
* Area of interest - Imagery collected over southern Iceland (defined as a bounding box)

By performing this search, you can see the matching STAC items are found within the Planetary Computer.


```python
# Search criteria
print("Using the below parameters to search the Planetary Computer:\n")
print("Collection:", pc_collection)
print("Bounding box for area of interest:",bbox_aoi)
print("Date range:",param_date_range)
print("Max number of items:",param_max_items)
```


```python
# Query the Planetary Computer

# Connect to the Planetary Computer
catalog = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")

search = catalog.search(collections=[pc_collection], bbox=bbox_aoi, datetime=param_date_range)
total_items = search.item_collection()

items = total_items[:param_max_items]
print("Total number of matching items:",len(total_items))
print("Total number of items for ingest base on user selected parameter:",len(items))

if total_items==0:
    print("No items matched your user specified parameters used at the top of this demo. Update these parameters")
```


```python
# Print an example STAC item returned by the Planetary Computer
items[0]
```

### Register an ingestion source
Before you can ingest these STAC items and their related assets (images) into a GeoCatalog collection you need to determine if you need to register a new ingestion source. Ingestion Sources are used by GeoCatalog to track which storage locations (Azure Blob Storage containers) it has access to. 

Registering an ingestion source is accomplished by providing GeoCatalog the location of the storage container and a SAS token with read permissions to access the container. If STAC items or their related assets are located in a storage container your GeoCatalog hasn't been given access to the ingest will fail.

To start this process, you first request a SAS token from the Planetary Computer that grants us read access to the container where the Sentinel-2 images reside.


```python
# Request API token from the Planetary Computer

pc_token = requests.get("https://planetarycomputer.microsoft.com/api/sas/v1/token/{}".format(pc_collection)).json()
print(f"Planetary Computer API Token will expire {pc_token['msft:expiry']}")
```

Next attempt to register this Azure Blob Storage container and associated SAS token as an ingestion source with GeoCatalog. There's the potential that an ingestion source already exists for this storage container. If so, find the ID of the existing ingestion source.

> [!Warning]
> If a duplicate ingestion source is found with a token that expires in the next 15 minutes, it's deleted and replaced. Deleting an ingestion source that is in use by currently running ingestions may break those ingestions.


```python
existing_ingestion_source: Optional[Dict[str, Any]] = find_ingestion_source(pc_collection_asset_container)

if existing_ingestion_source:
    connection_info = existing_ingestion_source["connectionInfo"]
    expiration = datetime.fromisoformat(connection_info["expiration"].split('.')[0]) # works in all Python 3.X versions
    expiration = expiration.replace(tzinfo=timezone.utc) # set timezone to UTC
    if expiration < datetime.now(tz=timezone.utc) + timedelta(minutes=15):
        print(f"Recreating existing ingestion source for {pc_collection_asset_container}")
        remove_ingestion_source(existing_ingestion_source["id"])
        create_ingestion_source(pc_collection_asset_container, pc_token["token"])
    else:
        print(f"Using existing ingestion source for {pc_collection_asset_container} with expiration {expiration}")
else:
    print(f"Creating ingestion source for {pc_collection_asset_container}")
    create_ingestion_source(pc_collection_asset_container, pc_token["token"])

```

### Ingest STAC items using GeoCatalog's Items API
Now that you registered an ingestion source or validated that a source exists you'll ingest the STAC items you found within the Planetary Computer using GeoCatalog's Items API. Accomplish this by posting each item to the Items API which creates a new ingestion operation within GeoCatalog.


```python
# Ingest items

items_endpoint = f"{geocatalog_url}/stac/collections/{collection_id}/items"

operation_ids = []

for item in items:

    item_json = item.to_dict()
    item_json['collection'] = collection_id

    # Remove non-static assets
    del(item_json['assets']['rendered_preview'])
    del(item_json['assets']['preview'])
    del(item_json['assets']['tilejson'])

    response = requests.post(
        items_endpoint,
        json=item_json,
        headers=getBearerToken(),
        params={"api-version": api_version}
    )

    operation_ids.append(response.json()['id'])
    print(f"Ingesting item {item_json['id']} with operation id {response.json()['id']}")

```

Given that Sentinel-2 item ingestion can take a little time, you can run this code to check the status of your ingestion operations using GeoCatalog's Operations API.


```python
# Check the status of the operations
operations_endpoint = f"{geocatalog_url}/inma/operations"
# Loop through all the operations ids until the status of each operation ids is "Finished"
pending=True

start = time.time()

while pending:
    # Count the number of operation ids that are finished vs unfinished
    num_running = 0
    num_finished = 0
    num_failed = 0
    clear_output(wait=True)
    for operation_id in operation_ids:
        response = requests.get(
            f"{operations_endpoint}/{operation_id}",
            headers=getBearerToken(),
            params={"api-version": api_version},
        )
        raise_for_status(response)
        status = response.json()["status"]
        print(f"Operation id {operation_id} status: {status}")
        if status == "Running":
            num_running+=1
        elif status == "Failed":
            num_failed+=1
        elif status == "Succeeded":
            num_finished+=1
    
    num_running
    stop=time.time()
    # Print the sumary of num finished, num running and num failed
    
    print("Ingesting Imagery:")
    print(f"\tFinished: {num_finished}\n\tRunning: {num_running}\n\tFailed: {num_failed}")
    print("Time Elapsed (seconds):",str(stop-start))
    
    if num_running == 0:
        pending=False
        print(f"Ingestion Complete!\n\t{num_finished} items ingested.\n\t{num_failed} items failed.")

    else:
        print(f"Waiting for {num_running} operations to finish")
        time.sleep(5)
```

You should be able to refresh your web browser and click on the Items tab to see these newly uploaded items.

## Collection management

Now that you ingested these STAC items and their associated assets (images) into the STAC collection, you need to provide you GeoCatalog with some other configuration files before you can visualize these items in the GeoCatalog web interface.

### Collection render config
First download a render configuration file for this collection from the Planetary Computer. This config file can be read by GeoCatalog to render images in different ways within the Explorer. This is because STAC items may contain many different assets (images) that can be combined to create entirely new images of a given area that highlight visible or nonvisible features. For instance, Sentinel-2 STAC items have over 12 different images from different portions of the electromagnetic spectrum. This render config instructs GeoCatalog on how to combine these images so it can display images in Natural Color or False Color (Color Infrared).


```python
# Read render JSON from Planetary Computer

render_json = requests.get("https://planetarycomputer.microsoft.com/api/data/v1/mosaic/info?collection={}".format(pc_collection)).json()
render_json['renderOptions']
```

After reading this render options config from the Planetary Computer, you can enable these render options for the collection by posting this config to the render-options endpoint.


```python
# Post render options config to GeoCatalog render-options API

render_config_endpoint = f"{geocatalog_url}/stac/collections/{collection_id}/configurations/render-options"

for render_option in render_json['renderOptions']:

    # Rename render configs such that they can be stored by GeoCatalog
    render_option['id'] = render_option['name'].translate(str.maketrans('', '', string.punctuation)).lower().replace(" ","-")[:30]

    # Post render definition
    response = requests.post(
        render_config_endpoint,
        json=render_option,
        headers=getBearerToken(),
        params={"api-version": api_version}
    )
```

### Mosaic definitions

Similar to the Render Config discussed above, GeoCatalog's Explorer allows us to specify one or more mosaic definitions for the collection. These mosaic definitions enable us to instruct GeoCatalog's Explorer on how to filter which items are displayed within the Explorer. For example, one basic render configuration (shown in the next cell) instructs GeoCatalog to display the most recent image for any given area. More advanced render configurations allow us to render different views such as the least cloudy image for a given location captured in October 2023.


```python
# Post mosaic definition

mosiacs_config_endpoint = f"{geocatalog_url}/stac/collections/{collection_id}/configurations/mosaics"

response = requests.post(
    mosiacs_config_endpoint,
    json={"id": "mos1",
          "name": "Most recent available",
          "description": "Most recent available imagery in this collection",
          "cql": []
    },
    headers=getBearerToken(),
    params={"api-version": api_version}
)
```

### Open GeoCatalog web interface

Congrats! You created a collection, added STAC items and assets, and updated your collection to include the required configuration files so it can be viewed through the Explorer within the GeoCatalog web interface.

**Navigate back to the GeoCatalog Explorer in the web interface to view your collection!**

## Query collection via STAC API

Now that viewed your collection in the GeoCatalog Explorer, you'll walk through how to use GeoCatalog's STAC APIs to search for and retrieve STAC items and assets for further analysis.

This process starts by posting a search to your GeoCatalog's STAC API. Specifically, you'll search for imagery within your collection that falls within the original bounding box you used to extract imagery from the Planetary Computer.

Unsurprisingly this query returns all the STAC items you previously placed within your collection.


```python
stac_search_endpoint = f"{geocatalog_url}/stac/search"

response = requests.post(
    stac_search_endpoint,
    json={"collections":[collection_id],
          "bbox":bbox_aoi
    },
    headers=getBearerToken(),
    params={"api-version": api_version, "sign": "true"}
)

matching_items = response.json()['features']
print(len(matching_items))
```

In your prior query, you also provided another parameter: **sign:true**. This instructs GeoCatalog to return a signed href (item href + SAS token) which allows you to read the given assets from Azure Blob Storage.


```python
# Download one of the assets bands, band 09
asset_href = matching_items[0]['assets']['B09']['href']
print(asset_href)

response = requests.get(asset_href)
img = Image.open(BytesIO(response.content))
img
```
## Clean up resources
### Delete items

At this point, you have created a GeoCatalog Collection, added items and assets to the collection, and retrieved those items and assets using GeoCatalog's STAC API. For the final phase of this tutorial, you're going to remove these items and delete your collection.


```python
# Delete all items

for item in matching_items:
    response = requests.delete(
        f"{items_endpoint}/{item['id']}",
        headers=getBearerToken(),
        params={"api-version": api_version}
    )
```

You can confirm all of your items were deleted by running the next command. Note it may take a minute or two to fully delete items and their associated assets.


```python
# Confirm that all the items have been deleted
response = requests.post(
    stac_search_endpoint,
    json={"collections":[stac_collection['id']],
          "bbox": bbox_aoi
    },
    headers=getBearerToken(),
    params={"api-version": api_version, "sign": "true"}
)

matching_items = response.json()['features']
print(len(matching_items))
```

### Delete collection

Now as a final step, you may want to fully delete your collection from your GeoCatalog instance.


```python
# Delete the collection
response = requests.delete(
    f"{collections_endpoint}/{collection_id}",
    headers=getBearerToken(),
    params={"api-version": api_version}
)

raise_for_status(response)
print(f"STAC Collection deleted: {collection_id}")
```

## Next steps

> [!div class="nextstepaction"]
> [Create a STAC Collection through the web interface](./create-collection-web-interface.md)

## Related content
In this end-to-end tutorial, you walked through the process of creating a new STAC collection, ingesting Sentinel-2 images into the collection, and querying those images via GeoCatalog's APIs. If you would like to learn more about each of these topics, explore these other materials:

* [Create a GeoCatalog](./deploy-geocatalog-resource.md)
* [Create a collection](./create-stac-collection.md)
* [Ingest STAC items](./ingestion-source.md)
* [Create a Render Configuration](./render-configuration.md)
* [Configure collection Tile Settings](./tile-settings.md)
* [Mosaic Configuration](./mosaic-configurations-for-collections.md)
* [Queryables Configuration](./queryables-for-explorer-custom-search-filter.md)
