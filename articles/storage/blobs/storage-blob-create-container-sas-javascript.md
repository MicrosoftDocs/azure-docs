---
title: Create container SAS tokens - JavaScript
titleSuffix: Azure Storage
description: Create and use user delegation SAS tokens in a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 07/14/2022
ms.author: normesta
ms.subservice: blobs
ms.custom: template-how-to, devx-track-js
---

# Create a container SAS token with Azure Blob Storage and JavaScript

This article shows you how to create and use container SAS tokens to use the Azure Blob Storage client library v12 for JavaScript. Once connected, your code can operate on an _existing_ container and its blobs.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Container SAS tokens

A **container SAS token** is scoped to a single container. Because anyone with the token can use it to access your _existing_ container, you should define the token with the most restrictive permissions that still allow the token to complete the required tasks.

[Best practices for token](../common/storage-sas-overview.md#best-practices-when-using-sas) creation include limiting permissions:

* Permissions such as create, read, write, update, and delete
* Time limits: 10 minutes is a suggested time limit

## Add required dependencies to your application

Include the required dependencies to create an account SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_Dependencies":::

## Get environment variables

The Blob Storage account name and container name are required to create a container SAS token:

```
// Get environment variables
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
```

## Create a SAS token with managed identity

In order to create a SAS token with managed identity, you need to complete setup tasks before working with managed identity in code:

* Set the appropriate Storage roles for the identity
* Configure your environment to work with your managed identity

When these two tasks are complete, managed identity is provided with the DefaultAzureCredential. This allows all your environments to use the exact same source code without the issue of using secrets in source code, such as connection strings or keys.

With managed identity configured, use the following code to create a SAS token to create a **User-delegated container SAS token**:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_CreateContainerSas" highlight="47-49,54-56,71-75":::

The preceding code creates a flow of values in order to create the container SAS token:

* Create the **BlobServiceClient** with the managed identity, _DefaultAzureCredential_
* Use that client to create a [**UserDelegationKey**](create-user-delegation-sas)
* Use the key to create the **SAS token**


## Use container SAS token

Once the token is created, use the token to list to blobs in the container 

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_Main" highlight="93,97,102-104":::


## See also

- [Types of SAS tokens](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)