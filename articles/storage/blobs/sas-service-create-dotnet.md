---
title: Create a service SAS for a container or blob with .NET
titleSuffix: Azure Storage
description: Learn how to create a service shared access signature (SAS) for a container or blob using the Azure Blob Storage client library for .NET.
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 01/19/2023
ms.author: pauljewell
ms.reviewer: nachakra
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, engagement-fy23
---

# Create a service SAS for a container or blob with .NET

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create a service SAS for a container or blob with the Blob Storage client library for .NET.

## Create a service SAS for a blob container

The following code example creates a SAS for a container. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad hoc SAS on the container.

A service SAS is signed with the account access key. Use the [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) class to create the credential that is used to sign the SAS.

In the following example, populate the constants with your account name, account key, and container name:

```csharp
const string AccountName = "<account-name>";
const string AccountKey = "<account-key>";
const string ContainerName = "<container-name>";

Uri blobContainerUri = new(string.Format("https://{0}.blob.core.windows.net/{1}", 
    AccountName, ContainerName));

StorageSharedKeyCredential storageSharedKeyCredential = 
    new(AccountName, AccountKey);

BlobContainerClient blobContainerClient = 
    new(blobContainerUri, storageSharedKeyCredential);
```

Next, create a new [BlobSasBuilder](/dotnet/api/azure.storage.sas.blobsasbuilder) object and call the [ToSasQueryParameters](/dotnet/api/azure.storage.sas.blobsasbuilder.tosasqueryparameters) to get the SAS token string.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetServiceSasUriForContainer":::

## Create a service SAS for a blob

The following code example creates a SAS on a blob. If the name of an existing stored access policy is provided, that policy is associated with the SAS. If no stored access policy is provided, then the code creates an ad hoc SAS on the blob.

A service SAS is signed with the account access key. Use the [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) class to create the credential that is used to sign the SAS. 

In the following example, populate the constants with your account name, account key, and container name:

```csharp
const string AccountName = "<account-name>";
const string AccountKey = "<account-key>";
const string ContainerName = "<container-name>";

Uri blobContainerUri = new(string.Format("https://{0}.blob.core.windows.net/{1}", 
    AccountName, ContainerName));

StorageSharedKeyCredential storageSharedKeyCredential = 
    new(AccountName, AccountKey);

BlobContainerClient blobContainerClient = 
    new(blobContainerUri, storageSharedKeyCredential);
```

Next, create a new [BlobSasBuilder](/dotnet/api/azure.storage.sas.blobsasbuilder) object and call the [ToSasQueryParameters](/dotnet/api/azure.storage.sas.blobsasbuilder.tosasqueryparameters) to get the SAS token string.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetServiceSasUriForBlob":::

## Create a service SAS for a directory

In a storage account with a hierarchical namespace enabled, you can create a service SAS for a directory. To create the service SAS, make sure you have installed version 12.5.0 or later of the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) package.

The following example shows how to create a service SAS for a directory:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetServiceSasUriForDirectory":::

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)

## Resources

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](blob-v11-samples-dotnet.md#create-a-service-sas-for-a-blob-container).