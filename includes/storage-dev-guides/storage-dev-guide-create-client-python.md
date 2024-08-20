---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 08/19/2024
ms.author: pauljewell
ms.custom: include file
---

#### Create a client object

To connect an app to Blob Storage, create an instance of [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient). The following example shows how to create a client object using `DefaultAzureCredential` for authorization:

```python
# TODO: Replace <storage-account-name> with your actual storage account name
account_url = "https://<storage-account-name>.blob.core.windows.net"
credential = DefaultAzureCredential()

# Create the BlobServiceClient object
blob_service_client = BlobServiceClient(account_url, credential=credential)
```

You can also create client objects for specific [containers](../../articles/storage/blobs/storage-blob-client-management.md?tabs=python#create-a-blobcontainerclient-object) or [blobs](../../articles/storage/blobs/storage-blob-client-management.md?tabs=python#create-a-blobclient-object). To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](../../articles/storage/blobs/storage-blob-client-management.md).

