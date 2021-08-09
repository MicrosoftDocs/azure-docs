---
title: Use .NET to create a user delegation SAS for a container, directory, or blob
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS with Azure Active Directory credentials by using the .NET client library for Azure Storage.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/03/2021
ms.author: tamram
ms.reviewer: dineshm
ms.subservice: blobs
---

# Create a user delegation SAS for a container, directory, or blob with .NET

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Azure Active Directory (Azure AD) credentials to create a user delegation SAS for a container, directory, or blob with the Azure Storage client library for .NET version 12.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When an Azure AD security principal attempts to access blob data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to blob data in Azure Storage. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

[!INCLUDE [storage-install-packages-blob-and-identity-include](../../../includes/storage-install-packages-blob-and-identity-include.md)]

To learn more about how to authenticate with the Azure Identity client library from Azure Storage, see the section titled **Authenticate with the Azure Identity library** in [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](../common/storage-auth-aad-msi.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#authenticate-with-the-azure-identity-library).

## Get an authenticated token credential

To get a token credential that your code can use to authorize requests to Azure Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class.

The following code snippet shows how to get the authenticated token credential and use it to create a service client for Blob storage:

```csharp
// Construct the blob endpoint from the account name.
string blobEndpoint = string.Format("https://{0}.blob.core.windows.net", accountName);

// Create a new Blob service client with Azure AD credentials.
BlobServiceClient blobClient = new BlobServiceClient(new Uri(blobEndpoint),
                                                     new DefaultAzureCredential());
```

## Get the user delegation key

Every SAS is signed with a key. To create a user delegation SAS, you must first request a user delegation key, which is then used to sign the SAS. The user delegation key is analogous to the account key used to sign a service SAS or an account SAS, except that it relies on your Azure AD credentials. When a client requests a user delegation key using an OAuth 2.0 token, Azure Storage returns the user delegation key on behalf of the user.

Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token does not need to be renewed so long as the key is still valid. You can specify that the key is valid for a period of up to 7 days.

Use one of the following methods to request the user delegation key:

- [GetUserDelegationKey](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkey)
- [GetUserDelegationKeyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkeyasync)

The following code snippet gets the user delegation key and writes out its properties:

```csharp
// Get a user delegation key for the Blob service that's valid for seven days.
// You can use the key to generate any number of shared access signatures over the lifetime of the key.
UserDelegationKey key = await blobClient.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow,
                                                                   DateTimeOffset.UtcNow.AddDays(7));

// Read the key's properties.
Console.WriteLine("User delegation key properties:");
Console.WriteLine("Key signed start: {0}", key.SignedStartsOn);
Console.WriteLine("Key signed expiry: {0}", key.SignedExpiresOn);
Console.WriteLine("Key signed object ID: {0}", key.SignedObjectId);
Console.WriteLine("Key signed tenant ID: {0}", key.SignedTenantId);
Console.WriteLine("Key signed service: {0}", key.SignedService);
Console.WriteLine("Key signed version: {0}", key.SignedVersion);
```

## Get a user delegation SAS for a blob

The following code example shows the complete code for authenticating the security principal and creating the user delegation SAS for a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetUserDelegationSasBlob":::

The following example tests the user delegation SAS created in the previous example from a simulated client application. If the SAS is valid, the client application is able to read the contents of the blob. If the SAS is invalid, for example if it has expired, Azure Storage returns error code 403 (Forbidden).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_ReadBlobWithSasAsync":::

## Get a user delegation SAS for a container

The following code example shows how to generate a user delegation SAS for a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetUserDelegationSasContainer":::

The following example tests the user delegation SAS created in the previous example from a simulated client application. If the SAS is valid, the client application is able to read the contents of the blob. If the SAS is invalid, for example if it has expired, Azure Storage returns error code 403 (Forbidden).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_ListBlobsWithSasAsync":::

## Get a user delegation SAS for a directory

The following code example shows how to generate a user delegation SAS for a directory when a hierarchical namespace is enabled for the storage account:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_GetUserDelegationSasDirectory":::

The following example tests the user delegation SAS created in the previous example from a simulated client application. If the SAS is valid, the client application is able to list file paths for this directory. If the SAS is invalid, for example if it has expired, Azure Storage returns error code 403 (Forbidden).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Sas.cs" id="Snippet_ListFilePathsWithDirectorySasAsync":::

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Create a user delegation SAS (REST API)](/rest/api/storageservices/create-user-delegation-sas)
