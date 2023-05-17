---
title: Create an account SAS with .NET
titleSuffix: Azure Storage
description: Learn how to create an account shared access signature (SAS) using the .NET client library.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 02/02/2023
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

An account SAS is signed with the account access key. Use the [StorageSharedKeyCredential](/dotnet/api/azure.storage.storagesharedkeycredential) class to create the credential that is used to sign the SAS. Next, create a new [AccountSasBuilder](/dotnet/api/azure.storage.sas.accountsasbuilder) object and call the [ToSasQueryParameters](/dotnet/api/azure.storage.sas.accountsasbuilder.tosasqueryparameters) to get the SAS token string.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetAccountSASToken":::

## Use an account SAS from a client

To use the account SAS to access service-level APIs for the Blob service, construct a Blob service client object using the SAS and the Blob storage endpoint for your storage account.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_UseAccountSAS":::

## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)

## Resources

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](../blobs/blob-v11-samples-dotnet.md#create-an-account-sas).
