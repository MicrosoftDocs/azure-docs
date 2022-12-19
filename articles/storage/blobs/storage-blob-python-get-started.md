---
title: Get started with Azure Blob Storage and Python
titleSuffix: Azure Storage
description: Get started developing a Python application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.subservice: blobs
ms.custom: devx-track-python, devguide-python
---

# Get started with Azure Blob Storage and Python

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library Python. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference documentation](/java/api/overview/azure/storage-blob-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-storage-blob) | [Samples](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)

## Set up your project

## Authorize access and connect to Blob Storage

To connect to Blob Storage, create an instance of the [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and its containers. You can create a `BlobServiceClient` object by using an Azure Active Directory (Azure AD) authorization token, an account access key, or a shared access signature (SAS).

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## [Azure AD](#tab/azure-ad)

To authorize with Azure AD, you'll need to use a security principal. Which type of security principal you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
|---|---|---|
| Local machine (development and testing) | User identity or service principal | [Use the Azure Identity library to get an access token for authorization](../common/identity-library-acquire-token.md) | 
| Azure | Managed identity | [Authorize access to blob data with managed identities for Azure resources](authorize-managed-identity.md) |
| Servers or clients outside of Azure | Service principal | [Authorize access to blob or queue data from a native or web application](../common/storage-auth-aad-app.md?toc=/azure/storage/blobs/toc.json) |

If you're testing on a local machine, or your application will run in Azure virtual machines (VMs), function apps, virtual machine scale sets, or in other Azure services, obtain an OAuth token by creating a [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) instance. Use that credential to create a `BlobServiceClient` object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-main.py" id="Snippet_GetServiceClientAzureAD":::

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/java/api/com.azure.storage.common.storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-main.py" id="Snippet_GetServiceClientAccountKey":::

You can also create a `BlobServiceClient` object using a connection string.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-main.py" id="Snippet_GetServiceClientConnectionString":::

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## [SAS token](#tab/sas-token)

Use [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) to build a [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) object using a SAS token:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-main.py" id="Snippet_GetServiceClientSAS":::

To generate and manage SAS tokens, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json).

---

## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.
- Containers, which organize the blob data in your storage account.
- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated Python classes. These are the basic classes:

| Class | Description |
|---|---|
| [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/java/api/com.azure.storage.blob.blobclient) | Allows you to manipulate Azure Storage blobs.|
| [AppendBlobClient](/java/api/com.azure.storage.blob.specialized.appendblobclient) | Allows you to perform operations specific to append blobs such as periodically appending log data.|
| [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data.|
