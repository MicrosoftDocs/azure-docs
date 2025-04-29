---
title: Request a Collection SAS Token
description: See how to retrieve a sas token to access collection-level assets.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: quickstart-article
ms.date: 04/29/2025
#customer intent: help customers setup the mosaic configurations. 
---
# 📄 Request a Collection SAS Token

This example shows how to retrieve a collection-level SAS token that can be used to access secured assets in a managed storage account.

In some applications, you need to pass a **collection-level SAS token** to enable authenticated access to assets stored in a managed storage account.  
For example, when retrieving **collection-level assets** such as Zarr datasets or other metadata, a SAS token provides temporary permissions to access the data directly from blob storage.

This example shows how to request a collection-level SAS token from the `/sas/token/{collection_id}` route.

## 🛠️ Get an Access Token for Authorization

```python
from datetime import datetime, timedelta
import requests
from azure.identity import AzureCliCredential
import json

# Resource ID for Planetary Computer Pro Geocatalog
MPCPRO_APP_ID = "https://geocatalog.spatio.azure.com"

_access_token = None

def getBearerToken():
    global _access_token
    if not _access_token or datetime.fromtimestamp(_access_token.expires_on) < datetime.now() + timedelta(minutes=5):
        credential = AzureCliCredential()
        _access_token = credential.get_token(f"{MPCPRO_APP_ID}/.default")

    return {"Authorization": f"Bearer {_access_token.token}"}

# Helper to raise informative HTTP errors
def raise_for_status(r: requests.Response) -> None:
    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        try:
            print(json.dumps(r.json(), indent=2))
        except Exception:
            print(r.content)
        finally:
            raise
```

## Helper Function to Request the Collection SAS Token

```python
def get_collection_sas_token(collection_id, geocatalog_url):
    """
    Requests a collection-level SAS token from the MPC Pro Geocatalog.

    """
    sas_token_endpoint = f"{geocatalog_url}/sas/token/{collection_id}"

    response = requests.get(
        sas_token_endpoint,
        headers=getBearerToken(),
        params={"api-version": "2025-04-30-preview"}
    )

    sas_token_info = response.json()
    return sas_token_info["token"]
```

## Example Usage of Helper Function

```python
geocatalog_url = "https://geocatalog.pro.spatio.azure.com"
collection_id = "<your-collection-id>"

sas_token = get_collection_sas_token(collection_id, geocatalog_url)

print(f"SAS Token: {sas_token}")
```

The `sas_token` variable contains the token string you can pass into applications that need to retrieve collection-level assets.
