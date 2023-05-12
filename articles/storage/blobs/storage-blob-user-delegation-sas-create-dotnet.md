---
title: Use .NET to create a user delegation SAS for a container or blob
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS with Azure Active Directory credentials by using the .NET client library for Blob Storage.
services: storage
author: pauljewellmsft

ms.service: storage
ms.topic: how-to
ms.date: 05/11/2023
ms.author: pauljewell
ms.reviewer: dineshm
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Create a user delegation SAS for a container, directory, or blob with .NET

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Azure Active Directory (Azure AD) credentials to create a user delegation SAS for a container or blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When an Azure AD security principal attempts to access blob data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to blob data. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

## Set up your project

To work with the code examples in this article, follow these steps to set up your project.

### Install packages

For the [blob](#get-a-user-delegation-sas-for-a-blob) and [container](#get-a-user-delegation-sas-for-a-container) code examples, add the following packages:

### [.NET CLI](#tab/packages-dotnetcli)

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.Storage.Blobs
```

### [PowerShell](#tab/packages-powershell)

```powershell
Install-Package Azure.Identity
Install-Package Azure.Storage.Blobs
```
---

### Set up the app code

For the [blob](#get-a-user-delegation-sas-for-a-blob) and [container](#get-a-user-delegation-sas-for-a-container) code examples, add the following `using` directives:

```csharp
using Azure;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
```

## Get an authenticated token credential

To get a token credential that your code can use to authorize requests to Blob Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. For more information about using the DefaultAzureCredential class to authorize a managed identity to access Blob Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

The following code snippet shows how to get the authenticated token credential and use it to create a service client for Blob storage:

```csharp
// Construct the blob endpoint from the account name.
string endpoint = $"https://{accountName}.blob.core.windows.net";

// Create a blob service client object using DefaultAzureCredential
BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri(endpoint),
    new DefaultAzureCredential());
```

To learn more about authorizing access to Blob Storage from your applications with the .NET SDK, see [How to authenticate .NET applications with Azure services](/dotnet/azure/sdk/authentication).

## Get the user delegation key

Every SAS is signed with a key. To create a user delegation SAS, you must first request a user delegation key, which is then used to sign the SAS. The user delegation key is analogous to the account key used to sign a service SAS or an account SAS, except that it relies on your Azure AD credentials. When a client requests a user delegation key using an OAuth 2.0 token, Blob Storage returns the user delegation key on behalf of the user.

Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token does not need to be renewed so long as the key is still valid. You can specify that the key is valid for a period of up to 7 days.

Use one of the following methods to request the user delegation key:

- [GetUserDelegationKey](/dotnet/api/azure.storage.blobs.blobserviceclient.getuserdelegationkey)
- [GetUserDelegationKeyAsync](/dotnet/api/azure.storage.blobs.blobserviceclient.getuserdelegationkeyasync)

The following code example shows how to request the user delegation key:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_RequestUserDelegationKey":::

## Create a user delegation SAS for a blob

Once you've obtained the user delegation key, you can create a user delegation SAS. The following code example shows how to create a user delegation SAS for a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateUserDelegationSASBlob":::

The following code example shows how to use the user delegation SAS to authorize a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseUserDelegationSASBlob":::

## Create a user delegation SAS for a container

You can also create a user delegation SAS to delegate limited access to a container resource. The following code example shows how to create a user delegation SAS for a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateUserDelegationSASContainer":::

The following code example shows how to use the user delegation SAS to authorize a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) object. This client object can be used to perform operations on the container resource based on the permissions granted by the SAS.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseUserDelegationSASContainer":::

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Create a user delegation SAS (REST API)](/rest/api/storageservices/create-user-delegation-sas)
