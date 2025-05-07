---
title: Create a user delegation SAS for a container or blob with Python
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS for a container or blob with Microsoft Entra credentials by using the Python client library for Blob Storage.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/06/2024
ms.reviewer: dineshm
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create a user delegation SAS for a container or blob with Python

[!INCLUDE [storage-dev-guide-selector-user-delegation-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-user-delegation-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Microsoft Entra credentials to create a user delegation SAS for a container or blob using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When a Microsoft Entra security principal attempts to access data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or a Microsoft Entra user account running code in the development environment, the security principal must be assigned an Azure role that grants access to data. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

[!INCLUDE [storage-dev-guide-user-delegation-sas-python](../../../includes/storage-dev-guides/storage-dev-guide-user-delegation-sas-python.md)]

## Create a user delegation SAS

You can create a user delegation SAS for a container or blob, based on the needs of your app.

### [Container](#tab/container)

Once you've obtained the user delegation key, you can create a user delegation SAS. You can create a user delegation SAS to delegate limited access to a container resource using the following method:

- [generate_container_sas](/python/api/azure-storage-blob/azure.storage.blob#azure-storage-blob-generate-container-sas)

The user delegation key to sign the SAS is passed to the method as the `user_delegation_key` argument. Allowed permissions are passed to the method as the `permission` argument, and are defined in the [ContainerSasPermissions](/python/api/azure-storage-blob/azure.storage.blob.containersaspermissions) class.

The following code example shows how to create a user delegation SAS for a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_create_user_delegation_sas_container":::

### [Blob](#tab/blob)

Once you've obtained the user delegation key, you can create a user delegation SAS. You can create a user delegation SAS to delegate limited access to a blob resource using the following method:

- [generate_blob_sas](/python/api/azure-storage-blob/azure.storage.blob#azure-storage-blob-generate-blob-sas)

The user delegation key to sign the SAS is passed to the method as the `user_delegation_key` argument. Allowed permissions are passed to the method as the `permission` argument, and are defined in the [BlobSasPermissions](/python/api/azure-storage-blob/azure.storage.blob.blobsaspermissions) class.

The following code example shows how to create a user delegation SAS for a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_create_user_delegation_sas_blob":::

---

## Use a user delegation SAS to authorize a client object

You can use a user delegation SAS to authorize a client object to perform operations on a container or blob based on the permissions granted by the SAS.

### [Container](#tab/container)

The following code example shows how to use the user delegation SAS created in the earlier example to authorize a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) object. This client object can be used to perform operations on the container resource based on the permissions granted by the SAS.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_use_user_delegation_sas_container":::

### [Blob](#tab/blob)

The following code example shows how to use the user delegation SAS created in the earlier example to authorize a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py" id="Snippet_use_user_delegation_sas_blob":::

---

## Resources

To learn more about creating a user delegation SAS using the Azure Blob Storage client library for Python, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob_devguide_create_sas.py)

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library method for getting a user delegation key uses the following REST API operations:

- [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key) (REST API)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)

[!INCLUDE [storage-dev-guide-next-steps-python](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-python.md)]