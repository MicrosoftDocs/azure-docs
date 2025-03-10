---
title: Create a service SAS for a container or blob with Python
titleSuffix: Azure Storage
description: Learn how to create a service shared access signature (SAS) for a container or blob using the Azure Blob Storage client library for Python.
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/06/2024
ms.author: pauljewell
ms.reviewer: nachakra
ms.devlang: python
ms.custom: devx-track-python, devguide-python, engagement-fy23
---

# Create a service SAS for a container or blob with Python

[!INCLUDE [storage-dev-guide-selector-service-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-service-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create a service SAS for a container or blob with the Blob Storage client library for Python.

## About the service SAS

A service SAS is signed with the storage account access key. A service SAS delegates access to a resource in a single Azure Storage service, such as Blob Storage.

You can also use a stored access policy to define the permissions and duration of the SAS. If the name of an existing stored access policy is provided, that policy is associated with the SAS. To learn more about stored access policies, see [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy). If no stored access policy is provided, the code examples in this article show how to define permissions and duration for the SAS.

## Create a service SAS

You can create a service SAS for a container or blob, based on the needs of your app.

### [Container](#tab/container)

You can create a service SAS to delegate limited access to a container resource using the following method:

- [generate_container_sas](/python/api/azure-storage-blob/azure.storage.blob#azure-storage-blob-generate-blob-sas)

The storage account access key used to sign the SAS is passed to the method as the `account_key` argument. Allowed permissions are passed to the method as the `permission` argument, and are defined in the [ContainerSasPermissions](/python/api/azure-storage-blob/azure.storage.blob.containersaspermissions) class.

The following code example shows how to create a service SAS with read permissions for a container resource:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_create_service_sas_container":::

### [Blob](#tab/blob)

You can create a service SAS to delegate limited access to a blob resource using the following method:

- [generate_blob_sas](/python/api/azure-storage-blob/azure.storage.blob#azure-storage-blob-generate-blob-sas)

The storage account access key used to sign the SAS is passed to the method as the `account_key` argument. Allowed permissions are passed to the method as the `permission` argument, and are defined in the [BlobSasPermissions](/python/api/azure-storage-blob/azure.storage.blob.blobsaspermissions) class. 

The following code example shows how to create a service SAS with read permissions for a blob resource:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_create_service_sas_blob":::

---

## Use a service SAS to authorize a client object

You can use a service SAS to authorize a client object to perform operations on a container or blob based on the permissions granted by the SAS.

### [Container](#tab/container)

The following code example shows how to use the service SAS created in the earlier example to authorize a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) object. This client object can be used to perform operations on the container resource based on the permissions granted by the SAS.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_use_service_sas_container":::

### [Blob](#tab/blob)

The following code example shows how to use the service SAS created in the earlier example to authorize a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_use_service_sas_blob":::

---

## Resources

To learn more about using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
