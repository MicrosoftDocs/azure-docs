---
title: Get started with Azure Blob Storage and .NET
titleSuffix: Azure Storage
description: Get started developing a .NET application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/12/2023
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Get started with Azure Blob Storage and .NET

[!INCLUDE [storage-dev-guide-selector-getting-started](../../../includes/storage-dev-guides/storage-dev-guide-selector-getting-started.md)]

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for .NET. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[API reference](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

- Azure storage account - [create a storage account](../common/storage-account-create.md)

- Current [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your project

This section walks you through preparing a project to work with the Azure Blob Storage client library for .NET.

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```console
dotnet add package Azure.Storage.Blobs
dotnet add package Azure.Identity
```

Add these `using` statements to the top of your code file.

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;

```

Blob client library information:

- [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.

- [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type, such as block blobs.

- [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types.

## Authorize access and connect to Blob Storage

To connect an application to Blob Storage, create an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class. This object is your starting point to interact with data resources at the storage account level. You can use it to operate on the storage account and its containers. You can also use the service client to create container clients or blob clients, depending on the resource you need to work with.

To learn more about creating and managing client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).

You can authorize a `BlobServiceClient` object by using a Microsoft Entra authorization token, an account access key, or a shared access signature (SAS).

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

<a name='azure-ad'></a>

## [Microsoft Entra ID](#tab/azure-ad)

To authorize with Microsoft Entra ID, you'll need to use a security principal. The type of security principal you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object.

The following example creates a `BlobServiceClient` object authorized using `DefaultAzureCredential`:

```csharp
public BlobServiceClient GetBlobServiceClient(string accountName)
{
    BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());

    return client;
}
```

If you know exactly which credential type you'll use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

## [SAS token](#tab/sas-token)

Create a [Uri](/dotnet/api/system.uri) by using the blob service endpoint and SAS token. Then, create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using the [Uri](/dotnet/api/system.uri).

```csharp
public static void GetBlobServiceClientSAS(ref BlobServiceClient blobServiceClient,
    string accountName, string sasToken)
{
    string blobUri = "https://" + accountName + ".blob.core.windows.net";

    blobServiceClient = new BlobServiceClient
    (new Uri($"{blobUri}?{sasToken}"), null);
}
```

To learn more about generating and managing SAS tokens, see the following articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)
- [Create an account SAS with .NET](../common/storage-account-sas-create-dotnet.md)
- [Create a service SAS for a container with .NET](sas-service-create-dotnet-container.md)
- [Create a service SAS for a blob with .NET](sas-service-create-dotnet.md)
- [Create a user delegation SAS for a container with .NET](storage-blob-container-user-delegation-sas-create-dotnet.md)
- [Create a user delegation SAS for a blob with .NET](storage-blob-user-delegation-sas-create-dotnet.md)

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient).

```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient,
    string accountName, string accountKey)
{
    Azure.Storage.StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

    blobServiceClient = new BlobServiceClient
        (new Uri(blobUri), sharedKeyCredential);
}
```

You can also create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using a connection string. 

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

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
