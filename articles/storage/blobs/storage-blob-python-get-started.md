---
title: Get started with Azure Blob Storage and Python
titleSuffix: Azure Storage
description: Get started developing a Python application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/12/2023
ms.custom: devx-track-python, devguide-python
---

# Get started with Azure Blob Storage and Python

[!INCLUDE [storage-dev-guide-selector-getting-started](../../../includes/storage-dev-guides/storage-dev-guide-selector-getting-started.md)]

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for Python. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference](/python/api/azure-storage-blob) | [Package (PyPi)](https://pypi.org/project/azure-storage-blob/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob) | [Samples](../common/storage-samples-python.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Python](https://www.python.org/downloads/) 3.7+

## Set up your project

This section walks you through preparing a project to work with the Azure Blob Storage client library for Python.

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `pip install` command. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-storage-blob azure-identity
```

Then open your code file and add the necessary import statements. In this example, we add the following to our *.py* file:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
```

Blob client library information:
- [azure.storage.blob](/python/api/azure-storage-blob/azure.storage.blob): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.

## Authorize access and connect to Blob Storage

To connect an application to Blob Storage, create an instance of the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class. This object is your starting point to interact with data resources at the storage account level. You can use it to operate on the storage account and its containers. You can also use the service client to create container clients or blob clients, depending on the resource you need to work with.

To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).

You can authorize a `BlobServiceClient` object by using a Microsoft Entra authorization token, an account access key, or a shared access signature (SAS).

<a name='azure-ad'></a>

## [Microsoft Entra ID](#tab/azure-ad)

To authorize with Microsoft Entra ID, you'll need to use a [security principal](../../active-directory/develop/app-objects-and-service-principals.md). Which type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/azure/developer/python/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/azure/developer/python/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/azure/developer/python/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/azure/developer/python/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object.

The following example creates a `BlobServiceClient` object using `DefaultAzureCredential`:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_DAC":::

## [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, provide the token as a string and initialize a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object. If your account URL includes the SAS token, omit the credential parameter.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_SAS":::

To learn more about generating and managing SAS tokens, see the following articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)
- [Create an account SAS with Python](../common/storage-account-sas-create-python.md)
- [Create a service SAS for a container with Python](sas-service-create-python-container.md)
- [Create a service SAS for a blob with Python](sas-service-create-python.md)
- [Create a user delegation SAS for a container with Python](storage-blob-container-user-delegation-sas-create-python.md)
- [Create a user delegation SAS for a blob with Python](storage-blob-user-delegation-sas-create-python.md)

## [Account key](#tab/account-key)

To use a storage account shared key, provide the key as a string and initialize a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_account_key":::

You can also create a `BlobServiceClient` object using a connection string.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_connection_string":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Build your application

As you build applications to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to work with data resources and perform specific actions using the Azure Storage client library for Python:

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create-python.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete-python.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list-python.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata (containers)](storage-blob-container-properties-metadata-python.md) | Get and set properties and metadata for containers. |
| [Create and manage container leases](storage-blob-container-lease-python.md) | Establish and manage a lock on a container. |
| [Create and manage blob leases](storage-blob-lease-python.md) | Establish and manage a lock on a blob. |
| [Upload blobs](storage-blob-upload-python.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download-python.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy-python.md) | Copy a blob from one location to another. |
| [List blobs](storage-blobs-list-python.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete-python.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags-python.md) | Set and retrieve tags as well as use tags to find blobs. |
| [Manage properties and metadata (blobs)](storage-blob-properties-metadata-python.md) | Get and set properties and metadata for blobs. |
| [Set or change a blob's access tier](storage-blob-use-access-tier-python.md) | Set or change the access tier for a block blob. |
