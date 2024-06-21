---
title: Get started with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Get started developing a .NET application to manage a storage account by using the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/12/2024
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Get started with Azure Storage management library for .NET

This article shows you how to manage a storage account by using the Azure Storage management library for .NET.

[API reference](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-net/issues)

[!INCLUDE [storage-dev-guide-prereqs-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-dotnet.md)]

## Set up your project

This section walks you through preparing a project to work with the Azure Blob Storage client library for .NET.

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```console
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
```

Add these `using` directives to the top of your code file:

```csharp
using Azure.Identity;
using Azure.ResourceManager;
```

Management library information:

- [Azure.ResourceManager.Storage](/dotnet/api/azure.resourcemanager.storage): Contains the primary classes representing the collections, resources, and data for managing storage accounts.
- [Azure.ResourceManager.Storage.Models](/dotnet/api/azure.resourcemanager.storage.models): Contains the classes representing the data model and features for storage accounts.

## Authorize access and create a client

To connect an application and manage storage account resources, create an instance of the [ArmClient](/dotnet/api/azure.resourcemanager.armclient) class. This client object is the entry point for all ARM clients. Since all management APIs go through the same endpoint, you only need to create one top-level `ArmClient` to interact with resources. You can use it to operate on the storage account and its containers.

You can authorize an `ArmClient` object by using a Microsoft Entra authorization token. In this example, we use `DefaultAzureCredential` to authorize the client object. The `DefaultAzureCredential` object tries different credential types to authenticate the client object. To learn more, see [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential).

#### Authorize access using DefaultAzureCredential

To authorize with Microsoft Entra ID, you need to use a security principal. The type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object.

The following example creates an `ArmClient` object authorized using `DefaultAzureCredential`:

```csharp
ArmClient armClient = new ArmClient(new DefaultAzureCredential());
```

If you know exactly which credential type you'll use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## Build your application

As you build applications to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to work with data resources and perform specific actions using the Azure Storage client library for .NET:

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata](storage-blob-container-properties-metadata.md) | Get and set properties and metadata for containers. |
| [Create and manage container leases](storage-blob-container-lease.md) | Establish and manage a lock on a container. |
| [Create and manage blob leases](storage-blob-lease.md) | Establish and manage a lock on a blob. |
| [Append data to blobs](storage-blob-append.md) | Learn how to create an append blob and then append data to that blob. |
| [Upload blobs](storage-blob-upload.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy.md) | Copy a blob from one location to another. |
| [List blobs](storage-blobs-list.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags.md) | Set and retrieve tags, and use tags to find blobs. |
| [Manage properties and metadata](storage-blob-properties-metadata.md) | Get and set properties and metadata for blobs. |
| [Set or change a blob's access tier](storage-blob-use-access-tier-dotnet.md) | Set or change the access tier for a block blob. |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples)
- [API reference](/dotnet/api/azure.storage.blobs)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)
