---
title: Get started with Azure Blob Storage and Python
titleSuffix: Azure Storage
description: Get started developing a Python application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 01/04/2023
ms.subservice: blobs
ms.custom: devx-track-python, devguide-python
---

# Get started with Azure Blob Storage and Python

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for Python. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference documentation](/python/api/azure-storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob) | [Package (PyPi)](https://pypi.org/project/azure-storage-blob/) | [Samples](../common/storage-samples-python.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Python](https://www.python.org/downloads/) 3.6+

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

To connect to Blob Storage, create an instance of the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and its containers. You can create a `BlobServiceClient` object by using an Azure Active Directory (Azure AD) authorization token, an account access key, or a shared access signature (SAS).

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## [Azure AD](#tab/azure-ad)

To authorize with Azure AD, you'll need to use a [security principal](/azure/active-directory/develop/app-objects-and-service-principals). Which type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | In this method, dedicated **application service principal** objects are set up using the App registration process for use during local development. The identity of the service principal is then stored as environment variables to be accessed by the app when it's run in local development.<br><br>This method allows you to assign the specific resource permissions needed by the app to the service principal objects used by developers during local development. This approach ensures the application only has access to the specific resources it needs and replicates the permissions the app will have in production.<br><br>The downside of this approach is the need to create separate service principal objects for each developer that works on an application.<br><br>To learn how to register the app, set up an Azure AD group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/azure/developer/python/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). | 
| Local machine (developing and testing) | User identity | In this method, a developer must be signed in to Azure from the Azure CLI or Azure PowerShell on their local workstation. The application then can access the developer's credentials from the credential store and use those credentials to access Azure resources from the app.<br><br>This method has the advantage of easier setup because a developer only needs to sign in to their Azure account in the Azure CLI. The disadvantage of this approach is that the developer's account likely has more permissions than required by the application. As a result, the application doesn't accurately replicate the permissions it will run with in production.<br><br>To learn how to set up an Azure AD group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/azure/developer/python/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). | 
| Hosted in Azure | Managed identity | Apps hosted in Azure should use a **managed identity service principal**. Managed identities are designed to represent the identity of an app hosted in Azure and can only be used with Azure hosted apps.<br><br>For example, a Python web app hosted in Azure App Service would be assigned a managed identity. The managed identity assigned to the app would then be used to authenticate the app to other Azure services.<br><br>To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/azure/developer/python/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | Apps hosted outside of Azure (for example on-premises apps) that need to connect to Azure services should use an **application service principal**. An application service principal represents the identity of the app in Azure and is created through the application registration process.<br><br>For example, consider a Python web app hosted on-premises that makes use of Azure Blob Storage. You would create an application service principal for the app using the App registration process. The `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` would all be stored as environment variables to be read by the application at runtime and allow the app to authenticate to Azure using the application service principal.<br><br>To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/azure/developer/python/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json). To authorize access and connect to Blob Storage using `DefaultAzureCredential`, see the code example in the [next section](#authorize-access-using-defaultazurecredential). |

#### Authorize access using DefaultAzureCredential

The easiest way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_DAC":::

## [Account key](#tab/account-key)

To use a storage account shared key, provide the key as a string and initialize a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_account_key":::

You can also create a `BlobServiceClient` object using a connection string.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_connection_string":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, provide the token as a string and initialize a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object. If your account URL includes the SAS token, omit the credential parameter.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-auth.py" id="Snippet_get_service_client_SAS":::

To generate and manage SAS tokens, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json).

---

## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.
- Containers, which organize the blob data in your storage account.
- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture.](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated Python classes. These are the basic classes:

| Class | Description |
|---|---|
| [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) | Allows you to manipulate Azure Storage blobs.|

The following guides show you how to use each of these classes to build your application.

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
