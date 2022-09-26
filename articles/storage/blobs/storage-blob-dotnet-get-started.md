---
title: Get started with Azure Blob Storage and .NET
titleSuffix: Azure Storage
description: Get started developing a .NET application that works with Azure Blob Storage. This article helps you set up a project and authorize access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022

ms.subservice: blobs
ms.custom: template-how-to
---

# Get started with Azure Blob Storage and .NET

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library v12 for .NET. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

- Azure storage account - [create a storage account](../common/storage-account-create.md)

- Current [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system. Be sure to get the SDK and not the runtime.


## Set up your project

Open a command prompt and change directory (`cd`) into your project folder. Then, install the Azure Blob Storage client library for .NET package by using the `dotnet add package` command. 

```console
cd myProject
dotnet add package Azure.Storage.Blobs
```

Add these `using` statements to the top of your code file.

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;

```

- [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs): Contains the primary classes (_client objects_) that you can use to operate on the service, containers, and blobs.

- [Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized): Contains classes that you can use to perform operations specific to a blob type (For example: append blobs).

- [Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models): All other utility classes, structures, and enumeration types.

## Connect to Blob Storage

To connect to Blob Storage, create an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and it's containers. You can create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) by using an account access key, a shared access signature (SAS), or by using an Azure Active Directory (Azure AD) authorization token. 

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

#### Authorize with an account key

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

#### Authorize with a SAS token

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

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create an account SAS with .NET](../common/storage-account-sas-create-dotnet.md)

- [Create a service SAS for a container or blob](sas-service-create.md)

- [Create a user delegation SAS for a container, directory, or blob with .NET](storage-blob-user-delegation-sas-create-dotnet.md)

#### Authorize with Azure AD

To authorize with Azure AD, you'll need to use a security principal. Which type of security principal you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
|--|--|---|
| Local machine (developing and testing) | User identity or service principal | [Use the Azure Identity library to get an access token for authorization](../common/identity-library-acquire-token.md) | 
| Azure | Managed identity | [Authorize access to blob data with managed identities for Azure resources](authorize-managed-identity.md) |
| Servers or clients outside of Azure | Service principal | [Authorize access to blob or queue data from a native or web application](../common/storage-auth-aad-app.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json) |

If you're testing on a local machine, or your application will run in Azure virtual machines (VMs), function apps, virtual machine scale sets, or in other Azure services, obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. Use that object to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient).

```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient, string accountName)
{
    TokenCredential credential = new DefaultAzureCredential();

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

        blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);          
}
```

If you plan to deploy the application to servers and clients that run outside of Azure, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme) which derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

This example creates a [ClientSecretCredential](/dotnet/api/azure.identity.clientsecretcredential) instance by using the client ID, client secret, and tenant ID. You can obtain these values when you create an app registration and service principal.

```csharp
public static void GetBlobServiceClientAzureAD(ref BlobServiceClient blobServiceClient,
    string accountName, string clientID, string clientSecret, string tenantID)
{

    TokenCredential credential = new ClientSecretCredential(
        tenantID, clientID, clientSecret, new TokenCredentialOptions());

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

    blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
}

```

#### Connect anonymously

If you explicitly enable anonymous access, then your code can create connect to Blob Storage without authorize your request. You can create a new service client object for anonymous access by providing the Blob storage endpoint for the account. However, you must also know the name of a container in that account that's available for anonymous access. To learn how to enable anonymous access, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

```csharp
public static void CreateAnonymousBlobClient()
{
    // Create the client object using the Blob storage endpoint for your account.
    BlobServiceClient blobServiceClient = new BlobServiceClient
        (new Uri(@"https://storagesamples.blob.core.windows.net/"));

    // Get a reference to a container that's available for anonymous access.
    BlobContainerClient container = blobServiceClient.GetBlobContainerClient("sample-container");

    // Read the container's properties. 
    // Note this is only possible when the container supports full public read access.          
    Console.WriteLine(container.GetProperties().Value.LastModified);
    Console.WriteLine(container.GetProperties().Value.ETag);
}
```

Alternatively, if you have the URL to a container that is anonymously available, you can use it to reference the container directly.

```csharp
public static void ListBlobsAnonymously()
{
    // Get a reference to a container that's available for anonymous access.
    BlobContainerClient container = new BlobContainerClient
        (new Uri(@"https://storagesamples.blob.core.windows.net/sample-container"));

    // List blobs in the container.
    // Note this is only possible when the container supports full public read access.
    foreach (BlobItem blobItem in container.GetBlobs())
    {
        Console.WriteLine(container.GetBlockBlobClient(blobItem.Name).Uri);
    }
}
```

## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.

- Containers, which organize the blob data in your storage account.

- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated .NET classes. These are the basic classes:

| Class | Description |
|---|---|
| [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) | Allows you to manipulate Azure Storage blobs.|
| [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient) | Allows you to perform operations specific to append blobs such as periodically appending log data.|
| [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data.|

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata](storage-blob-container-properties-metadata.md) | Get and set properties and metadata for containers. |
| [Create and manage leases](storage-blob-container-lease.md) | Establish and manage a lock on a container or the blobs in a container. |
| [Append data to blobs](storage-blob-append.md) | Learn how to create an append blob and then append data to that blob. |
| [Upload blobs](storage-blob-upload.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy.md) | Copy a blob from one account to another account. |
| [List blobs](storage-blobs-list.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags.md) | Set and retrieve tags as well as use tags to find blobs. |
| [Manage properties and metadata](storage-blob-properties-metadata.md) | Get and set properties and metadata for blobs. |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](../common/storage-samples-dotnet.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)
- [API reference](/dotnet/api/azure.storage.blobs)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)
