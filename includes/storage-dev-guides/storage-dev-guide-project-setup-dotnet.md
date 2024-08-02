---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 06/03/2024
ms.author: pauljewell
ms.custom: include file
---

If you don't have an existing project, this section shows you how to set up a project to work with the Azure Blob Storage client library for .NET. The steps include package installation, adding `using` directives, and creating an authorized client object. For details, see [Get started with Azure Blob Storage and .NET](../../articles/storage/blobs/storage-blob-dotnet-get-started.md).

#### Install packages

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```dotnetcli
dotnet add package Azure.Storage.Blobs
dotnet add package Azure.Identity
```

#### Add `using` directives

Add these `using` directives to the top of your code file:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
```

Some code examples in this article might require additional `using` directives.

#### Create a client object

To connect an app to Blob Storage, create an instance of [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient). The following example shows how to create a client object using `DefaultAzureCredential` for authorization:

```csharp
public BlobServiceClient GetBlobServiceClient(string accountName)
{
    BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());

    return client;
}
```

You can register a service client for [dependency injection](/dotnet/azure/sdk/dependency-injection) in a .NET app.

You can also create client objects for specific [containers](../../articles/storage/blobs/storage-blob-client-management.md#create-a-blobcontainerclient-object) or [blobs](../../articles/storage/blobs/storage-blob-client-management.md#create-a-blobclient-object). To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](../../articles/storage/blobs/storage-blob-client-management.md).

