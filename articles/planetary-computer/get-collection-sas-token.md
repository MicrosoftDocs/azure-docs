---
title: SAS token Generation in Microsoft Planetary Computer Pro
description: See how to retrieve a sas token to access collection-level assets.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 04/29/2025
#customer intent: help customers get a sas token for a collection.
ms.custom:
  - build-2025
---
# Quickstart: Request a STAC collection SAS token

In this quickstart, you will retrieve a collection-level SAS token that can be used by other applications to access STAC collection assets in a managed storage account within a Microsoft Planetary Computer Pro GeoCatalog resource.

In some applications, you need to pass a **collection-level SAS token** to enable authenticated access to assets stored in a managed storage account.  

For example, when retrieving **collection-level assets** such as Zarr data, a SAS token provides temporary permissions to access the data directly from blob storage.

This example shows how to request a collection-level SAS token from the `/sas/token/{collection_id}` route.

## 1. Get Access Token for Authorization to a GeoCatalog

```python
from datetime import datetime, timedelta
import requests
from azure.identity import AzureCliCredential

# Resource ID for Planetary Computer Pro Geocatalog
MPCPRO_APP_ID = "https://geocatalog.spatio.azure.com"

_access_token = None

def getBearerToken():
    global _access_token
    if not _access_token or datetime.fromtimestamp(_access_token.expires_on) < datetime.now() + timedelta(minutes=5):
        credential = AzureCliCredential()
        _access_token = credential.get_token(f"{MPCPRO_APP_ID}/.default")

    return {"Authorization": f"Bearer {_access_token.token}"}
```

## 2. Request a SAS Token for a STAC Collection

Access the endpoint that returns your temporary STAC collection-level SAS token.

```python
geocatalog_url = "<your-geocatalog-url>"
collection_id = "<your-collection-id>"

response = requests.get(
        f"{geocatalog_url}/sas/token/{collection_id}",
        headers=getBearerToken(),
        params={"api-version": "2025-04-30-preview"}
    )

sas_token = response.json()["token"]

print(f"SAS Token: {sas_token}")
```

The `sas_token` variable contains the token string you can pass into applications that need to retrieve collection-level assets.
