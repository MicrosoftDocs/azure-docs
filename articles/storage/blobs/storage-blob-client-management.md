---
title: Create and manage clients interacting with blob data resources
titleSuffix: Azure Storage 
description: Learn how to create and manage clients which interact with data resources in Blob Storage.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 02/01/2023
ms.author: pauljewell
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Create and manage clients interacting with blob data resources

The Azure SDKs are collections of libraries built to make it easier to use Azure services from different languages. The SDKs are designed to simplify interactions between your application and Azure resources. Interacting with Azure resources using the SDK begins with a client instance. This article shows how to create a client object to interact with blob data resources, and offers guidance and best practices on how to manage clients in your application.

## Create a client

The Azure Storage Blob client libraries allow you to interact with three types of resources in the storage service:

- Storage account
- Blob container
- Blob

Depending on the needs of your application, you can instantiate a client at any of these three levels. The following table lists and links to these different client classes for each language:

| Language | Package | Service client class | Container client class | Blob client class |
| --- | --- | --- | --- | --- |
| .NET | [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs) | [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) | [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) | [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) |
| Java | [com.azure.storage.blob](/java/api/com.azure.storage.blob) | [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient) | [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) | [BlobClient](/java/api/com.azure.storage.blob.blobclient) |
| JavaScript | [@azure/storage-blob](/javascript/api/overview/azure/storage-blob-readme) | [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | [BlobClient](/javascript/api/@azure/storage-blob/blobclient) |
| Python | [azure.storage.blob](/python/api/azure-storage-blob/azure.storage.blob) | [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) | [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) | [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) |

### Authorize a client object

For an app to access blob resources and interact with them, a client object must be authorized. The code samples in this article use [DefaultAzureCredential]() to authenticate to Azure and obtain an access token. The access token is then passed as a credential when the client is instantiated. The permissions are granted to an Azure AD security principal using Azure role-based access control (Azure RBAC). There are several authorization mechanisms that can be used to grant the appropriate level of access to a client, including Azure AD security principals, SAS tokens, and shared key authorization. To learn more about authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

### Create a BlobServiceClient object

An authorized `BlobServiceClient` object allows your app to interact with resources at the storage account level. The client exposes methods to retrieve and configure account properties, as well as list, create, and delete containers within the storage account. From the service client level, you can perform operations on a specific container or blob resource by calling a method to get a reference to the particular resource, whether it exists or not.

The following example shows how to instantiate a `BlobServiceClient` object:

## [.NET](#tab/dotnet)

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// Provide client configuration options for connecting to Azure Blob storage
BlobClientOptions blobClientOptions = new ()
{
    
};

// TODO: Replace <storage-account-name> with your actual storage account name
var blobServiceClient = new BlobServiceClient(
        new Uri("https://<storage-account-name>.blob.core.windows.net"),
        new DefaultAzureCredential()),
        blobClientOptions;
```

## [Java](#tab/java)

```java

```

## [JavaScript](#tab/javascript)

```javascript

```

## [Python](#tab/python)

```python

```

---

### Create a BlobContainerClient object

 You can use a `BlobServiceClient` object to create a new `BlobContainerClient` object (`ContainerClient` for JavaScript and Python). A `BlobContainerClient` object allows you to interact with a specific container resource. This resource does not need to exist for you to create the client object, as you can create the container resource using the `BlobContainerClient` object. This client provides operations to create, delete, or configure a container, and includes operations to list, upload, and delete the blobs within it. To perform operations on a specific blob within the container, you can create a Blo using the get_blob_client method.

The following example

If your work is narrowly scoped to a single container, you might choose to create a `BlobContainerClient` object directly without using a `BlobServiceClient`. You can still set client options on a container client just like you would on a service client.

The following example shows how to create a container client to interact with a container resource called *sample-container*:

### Instantiate a BlobClient

## Manage clients

A best practice for Azure SDK client management is to treat a client as a singleton, meaning that a class will only have one object at a time. There is no need to keep more than one instance of a client for a given set of constructor parameters or client options. This concept can be implemented in many ways, including the following approaches:

- Create a single client object and pass it as a parameter throughout the application
- Store a client instance in a field
- Register the client object as a singleton in a dependency injection container

For more information on dependency injection in .NET, see [Dependency injection with the Azure SDK for .NET](/dotnet/azure/sdk/dependency-injection).