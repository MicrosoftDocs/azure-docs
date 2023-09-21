---
title: Create a user delegation SAS for a blob with .NET
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS for a blob with Azure Active Directory credentials by using the .NET client library for Blob Storage.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 06/22/2023
ms.author: pauljewell
ms.reviewer: dineshm
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Create a user delegation SAS for a blob with .NET

[!INCLUDE [storage-dev-guide-selector-user-delegation-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-user-delegation-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Azure Active Directory (Azure AD) credentials to create a user delegation SAS for a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When an Azure AD security principal attempts to access blob data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to blob data. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

[!INCLUDE [storage-dev-guide-user-delegation-sas-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-user-delegation-sas-dotnet.md)]

## Create a user delegation SAS for a blob

Once you've obtained the user delegation key, you can create a user delegation SAS to delegate limited access to a blob resource. The following code example shows how to create a user delegation SAS for a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateUserDelegationSASBlob":::

## Use a user delegation SAS to authorize a client object

The following code example shows how to use the user delegation SAS to authorize a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseUserDelegationSASBlob":::

## Resources

To learn more about creating a user delegation SAS using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library method for getting a user delegation key uses the following REST API operations:

- [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)
