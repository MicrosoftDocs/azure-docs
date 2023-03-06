---
title: Query for a storage service endpoint using the Azure Storage management library
titleSuffix: Azure Storage
description: Query for a storage service endpoint using the Azure Storage management library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/02/2023
ms.subservice: blobs
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Query for a storage service endpoint using the Azure Storage management library

A storage service endpoint forms the base address for all objects within a storage account. When an application connects to a storage service to work with data resources, a URI representing the endpoint is passed to the client constructor. A [standard endpoint](../common/storage-account-overview.md#standard-endpoints) includes the unique storage account name along with a fixed domain name, while an [Azure DNS zone endpoint](../common/storage-account-overview.md#azure-dns-zone-endpoints-preview) dynamically selects an Azure DNS zone and assigns it to the storage account when it's created. 

When creating a client object in your application, you can construct the URI string manually, or you can query for the service endpoint at runtime. In this article, you learn how to query a blob service endpoint using the management library.

## Set up your project 

To work with the code examples in this article, follow these steps to set up your project.

### Install packages

Install the following packages using `dotnet add package`:

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
dotnet add package Azure.Storage.Blobs
```
- [Azure.Identity](/dotnet/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [Azure.ResourceManager.Storage](/dotnet/api/overview/azure/resourcemanager.storage-readme): Supports management of Azure Storage resources, including resource groups and storage accounts.
- [Azure.Storage.Blobs](/dotnet/api/overview/azure/storage.blobs-readme): Contains the primary classes that you can use to work with Blob Storage data resources.

## Query for the service endpoint

To get the properties for a specified storage account, use the following method from a [StorageAccountCollection](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection) object:

- [GetAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection.getasync)

For this example, add the following `using` directives:

```csharp
using Azure.ResourceManager;
using Azure.ResourceManager.Resources;
using Azure.ResourceManager.Storage;
```

The following code sample gets a blob service endpoint for a specified storage account:

:::code language="dotnet" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobQueryEndpoint/QueryEndpoint.cs" id="Snippet_QueryEndpoint" highlight="26,29":::

## Create a client object using the service endpoint

Once you have the blob service endpoint for a storage account, you can instantiate a client object to work with the data resources.

For this example, add the following `using` directives:

```csharp
global using Azure.Core;
using Azure.Identity;
using Azure.Storage.Blobs;
```

The following code sample creates a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object using the endpoint we retrieved in the earlier example:

:::code language="dotnet" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobQueryEndpoint/Program.cs" id="Snippet_CreateClientWithEndpoint" highlight="12":::

## Next steps

- [View the code sample (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/dotnet/BlobQueryEndpoint)
- To learn more about creating client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).



