---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 06/12/2023
ms.author: pauljewell
ms.custom: include file
---

## Set up your project

To work with the code examples in this article, add the following import directives:

```java
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.blob.sas.*;
```

## Get an authenticated token credential

To get a token credential that your code can use to authorize requests to Blob Storage, create an instance of the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) class. For more information about using the DefaultAzureCredential class to authorize a managed identity to access Blob Storage, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme).

The following code snippet shows how to get the authenticated token credential and use it to create a service client for Blob storage:

```java
BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint("https://<storage-account-name>.blob.core.windows.net/")
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildClient();
```

To learn more about authorizing access to Blob Storage from your applications with the Java SDK, see [Azure authentication with Java and Azure Identity](/azure/developer/java/sdk/identity).

## Get the user delegation key

Every SAS is signed with a key. To create a user delegation SAS, you must first request a user delegation key, which is then used to sign the SAS. The user delegation key is analogous to the account key used to sign a service SAS or an account SAS, except that it relies on your Microsoft Entra credentials. When a client requests a user delegation key using an OAuth 2.0 token, Blob Storage returns the user delegation key on behalf of the user.

Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token doesn't need to be renewed if the key is still valid. You can specify the length of time that the key remains valid, up to a maximum of seven days.

Use one of the following methods to request the user delegation key:

- [getUserDelegationKey](/java/api/com.azure.storage.blob.specialized.blobclientbase#method-details)

The following code example shows how to request the user delegation key:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobSAS.java" id="Snippet_RequestUserDelegationKey":::
