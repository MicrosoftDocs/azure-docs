---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: storage
ms.topic: include
ms.date: 06/05/2023
ms.author: pauljewell
ms.custom: include file
---

## Set up your project

To work with the code examples in this article, follow these steps to set up your project.

### Install packages

Install the following packages using `pip install`:

```console
pip install azure-storage-blob azure-identity
```

### Set up the app code

Add the following `import` directives:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
```

## Get an authenticated token credential

To get a token credential that your code can use to authorize requests to Blob Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. For more information about using the DefaultAzureCredential class to authorize a managed identity to access Blob Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme?toc=/azure/storage/blobs/toc.json).

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

Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token doesn't need to be renewed if the key is still valid. You can specify the length of time that the key remains valid, up to a maximum of seven days.

Use one of the following methods to request the user delegation key:

- [get_user_delegation_key](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient?view=azure-python#azure-storage-blob-blobserviceclient-get-user-delegation-key)

The following code example shows how to request the user delegation key:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_RequestUserDelegationKey":::