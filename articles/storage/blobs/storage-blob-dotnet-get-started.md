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
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp
---

# Get started with Azure Blob Storage and .NET

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library v12 for .NET. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs) | [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [API reference](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

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

## Authorize access and connect to Blob Storage

To connect to Blob Storage, create an instance of the [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and its containers. You can authorize access and create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object by using an Azure Active Directory (Azure AD) authorization token, an account access key, or a shared access signature (SAS).

## [Azure AD](#tab/azure-ad)

To authorize with Azure AD, you'll need to use a security principal. The type of security principal you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | In this method, dedicated **application service principal** objects are set up using the App registration process for use during local development. The identity of the service principal is then stored as environment variables to be accessed by the app when it's run in local development.<br><br>This method allows you to assign the specific resource permissions needed by the app to the service principal objects used by developers during local development. This approach ensures the application only has access to the specific resources it needs and replicates the permissions the app will have in production.<br><br>The downside of this approach is the need to create separate service principal objects for each developer that works on an application.<br><br>[Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | In this method, a developer must be signed-in to Azure from either Visual Studio, the Azure Tools extension for VS Code, the Azure CLI, or Azure PowerShell on their local workstation. The application then can access the developer's credentials from the credential store and use those credentials to access Azure resources from the app.<br><br>This method has the advantage of easier setup since a developer only needs to sign in to their Azure account from Visual Studio, VS Code or the Azure CLI. The disadvantage of this approach is that the developer's account likely has more permissions than required by the application, therefore not properly replicating the permissions the app will run with in production.<br><br>[Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Hosted in Azure | Managed identity | Apps hosted in Azure should use a **managed identity service principal**. Managed identities are designed to represent the identity of an app hosted in Azure and can only be used with Azure hosted apps.<br><br>For example, a .NET web app hosted in Azure App Service would be assigned a managed identity. The managed identity assigned to the app would then be used to authenticate the app to other Azure services.<br><br>[Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | Apps hosted outside of Azure (for example on-premises apps) that need to connect to Azure services should use an **application service principal**. An application service principal represents the identity of the app in Azure and is created through the application registration process.<br><br>For example, consider a .NET web app hosted on-premises that makes use of Azure Blob Storage. You would create an application service principal for the app using the App registration process. The `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` would all be stored as environment variables to be read by the application at runtime and allow the app to authenticate to Azure using the application service principal.<br><br>[Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

The easiest way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object.

```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient, string accountName)
{
    TokenCredential credential = new DefaultAzureCredential();

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

    blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);          
}
```

If you know exactly which credential type you'll use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

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

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create an account SAS with .NET](../common/storage-account-sas-create-dotnet.md)

- [Create a service SAS for a container or blob](sas-service-create.md)

- [Create a user delegation SAS for a container, directory, or blob with .NET](storage-blob-user-delegation-sas-create-dotnet.md)

---

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.

- Containers, which organize the blob data in your storage account.

- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated .NET classes. This table lists the basic classes with a brief description:

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
| [Find blobs using tags](storage-blob-tags.md) | Set and retrieve tags, and use tags to find blobs. |
| [Manage properties and metadata](storage-blob-properties-metadata.md) | Get and set properties and metadata for blobs. |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](../common/storage-samples-dotnet.md?toc=/azure/storage/blobs/toc.json#blob-samples)
- [API reference](/dotnet/api/azure.storage.blobs)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)
