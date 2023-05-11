---
title: Create an account SAS with .NET
titleSuffix: Azure Storage
description: Learn how to create an account shared access signature (SAS) using the .NET client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 05/11/2023
ms.author: pauljewell
ms.reviewer: dineshm
ms.subservice: common
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Create an account SAS with .NET

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use the storage account key to create an account SAS with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

## Create an account SAS

An account SAS is signed with the account access key. You can use the [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) class to create the credential that is used to sign the SAS. 

The following code example shows how to create a new [AccountSasBuilder](/dotnet/api/azure.storage.sas.accountsasbuilder) object and call the [ToSasQueryParameters](/dotnet/api/azure.storage.sas.accountsasbuilder.tosasqueryparameters) method to get the account SAS token string.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_GetAccountSASToken":::

## Create a client object authorized by an account SAS

To use the account SAS to access service-level APIs for the Blob service, create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object using the account SAS and the Blob Storage endpoint for your storage account.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseAccountSAS":::

## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)

## Resources

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](../blobs/blob-v11-samples-dotnet.md#create-an-account-sas).
