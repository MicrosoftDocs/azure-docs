---
title: Create an account SAS with Python
titleSuffix: Azure Storage
description: Learn how to create an account shared access signature (SAS) using the Python client library.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 09/21/2023
ms.author: pauljewell
ms.reviewer: dineshm
ms.subservice: storage-common-concepts
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create an account SAS with Python

[!INCLUDE [storage-dev-guide-selector-account-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-account-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create an account SAS with the [Azure Storage client library for Python](/python/api/overview/azure/storage).

## About the account SAS

An account SAS is created at the level of the storage account. By creating an account SAS, you can:

- Delegate access to service-level operations that aren't currently available with a service-specific SAS, such as [Get Blob Service Properties](/rest/api/storageservices/get-blob-service-properties), [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties) and [Get Blob Service Stats](/rest/api/storageservices/get-blob-service-stats).
- Delegate access to more than one service in a storage account at a time. For example, you can delegate access to resources in both Azure Blob Storage and Azure Files by using an account SAS.

Stored access policies aren't supported for an account SAS.

## Create an account SAS

An account SAS is signed with the account access key. The following code example shows how to call the [generate_account_sas](/python/api/azure-storage-blob/azure.storage.blob#azure-storage-blob-generate-account-sas) method to get the account SAS token string. 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-create-sas.py" id="Snippet_create_account_sas":::

Valid parameters for the [ResourceTypes](/python/api/azure-storage-blob/azure.storage.blob.resourcetypes) constructor are:

- **service**: default is `False`; set to `True` to grant access to service-level APIs.
- **container**: default is `False`; set to `True` to grant access to container-level APIs.
- **object**: default is `False`; set to `True` to grant access to object-level APIs for blobs, queue messages, and files.

For available permissions, see [AccountSasPermissions](/python/api/azure-storage-blob/azure.storage.blob.accountsaspermissions).

## Use an account SAS from a client

To use the account SAS to access service-level APIs for the Blob service, create a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object using the account SAS and the Blob Storage endpoint for your storage account.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-create-sas.py" id="Snippet_use_account_sas":::

You can also use an account SAS to authorize and work with a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) object or [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object, if those resource types are granted access as part of the signature values.

## Resources

To learn more about creating an account SAS using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-create-sas.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)
