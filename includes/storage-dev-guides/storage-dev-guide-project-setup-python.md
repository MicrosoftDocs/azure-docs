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

If you don't have an existing project, this section shows you how to set up a project to work with the Azure Blob Storage client library for Python. The steps include package installation, adding `import` statements, and creating an authorized client object. For details, see [Get started with Azure Blob Storage and Python](../../articles/storage/blobs/storage-blob-python-get-started.md).

#### Install packages

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `pip install` command. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-storage-blob azure-identity
```

#### Add `import` statements

Add these `import` statements to your code file:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
```

Some code examples in this article might require additional `import` statements.

#### Create a client object

To connect an app to Blob Storage, create an instance of [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient). The following example shows how to create a client object using `DefaultAzureCredential` for authorization:

```python
def get_blob_service_client_token_credential(self):
    # TODO: Replace <storage-account-name> with your actual storage account name
    account_url = "https://<storage-account-name>.blob.core.windows.net"
    credential = DefaultAzureCredential()

    # Create the BlobServiceClient object
    blob_service_client = BlobServiceClient(account_url, credential=credential)

    return blob_service_client
```

You can also create client objects for specific [containers](../../articles/storage/blobs/storage-blob-client-management.md#create-a-blobcontainerclient-object) or [blobs](../../articles/storage/blobs/storage-blob-client-management.md#create-a-blobclient-object). To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](../../articles/storage/blobs/storage-blob-client-management.md).

