---
title: Use Python with Azure Data Lake Storage Gen2
description: Use the Azure Storage Client Library to interact with Azure Blob storage accounts that have a hierarchical namespace
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use Python with Azure Data Lake Storage Gen2

This guide shows you how to use Python to interact with objects, manage directories, and set directory-level access permissions (access-control lists) in storage accounts that have a hierarchical namespace. 

To use the snippets presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The snippets featured in this article use terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. This article refers to other articles that contain snippets for common tasks. Because those articles apply to all blob storage accounts regardless of whether hierarchical namespaces have been enabled, they'll use the terms *container* and *blob*. To avoid confusion, this article does the same.

## Install Python and the Azure SDK for Python

See these resources:

* [Python](https://www.python.org/downloads/)

* [Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python)

## Add Python modules

Add these import statements to your code file.

```python
import os, uuid, sys
from azure.storage.blob import BlockBlobService, PublicAccess
```

### Modules featured in this snippet

> [!div class="checklist"]
> * [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice?view=azure-python) module
> * [PublicAccess](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.models.publicaccess?view=azure-python) module

## Perform common blob tasks 

You can use the same set of APIs to interact with your data objects regardless of whether the account has a hierarchical namespace. To find snippets that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Upload, download, and list blobs with Python](storage-quickstart-blobs-python.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace. 

## Add directory to a container

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Rename or move a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Delete a directory from a container

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Get the ACL for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.

## Set the ACL for a directory

Intro text here

```cs
Snippet here
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
> * [Type](url) method.
## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
