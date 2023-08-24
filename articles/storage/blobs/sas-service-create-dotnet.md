---
title: Create a service SAS for a blob with .NET
titleSuffix: Azure Storage
description: Learn how to create a service shared access signature (SAS) for a blob using the Azure Blob Storage client library for .NET.
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 06/22/2023
ms.author: pauljewell
ms.reviewer: nachakra
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, engagement-fy23, devx-track-dotnet
---

# Create a service SAS for a blob with .NET

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create a service SAS for a blob with the Azure Blob Storage client library for .NET.

## About the service SAS

A service SAS is signed with the account access key. You can use the [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) class to create the credential that is used to sign the service SAS.

You can also use a stored access policy to define the permissions and duration of the SAS. If the name of an existing stored access policy is provided, that policy is associated with the SAS. To learn more about stored access policies, see [Define a stored access policy](#define-a-stored-access-policy). If no stored access policy is provided, the code examples in this article show how to define permissions and duration for the SAS.

## Create a service SAS for a blob

The following code example shows how to create a service SAS for a blob resource. First, the code verifies that the [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object is authorized with a shared key credential by checking the [CanGenerateSasUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.cangeneratesasuri#azure-storage-blobs-specialized-blobbaseclient-cangeneratesasuri) property. Then, it generates the service SAS via the [BlobSasBuilder](/dotnet/api/azure.storage.sas.blobsasbuilder) class, and calls [GenerateSasUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.generatesasuri#azure-storage-blobs-specialized-blobbaseclient-generatesasuri(azure-storage-sas-blobsasbuilder)) to create a service SAS URI based on the client and builder objects. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateServiceSASBlob":::

## Use a service SAS to authorize a client object

The following code example shows how to use the service SAS to authorize a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

First, create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object signed with the account access key:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateServiceClientSharedKey":::

Then, generate the service SAS as shown in the earlier example and use the SAS to authorize a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseServiceSASBlob":::

[!INCLUDE [storage-dev-guide-stored-access-policy](../../../includes/storage-dev-guides/storage-dev-guide-stored-access-policy.md)]

## Resources

To learn more about creating a service SAS using the Azure Blob Storage client library for .NET, see the following resources.

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
- For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](blob-v11-samples-dotnet.md#create-a-service-sas-for-a-blob-container).
