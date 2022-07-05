---
title: Create Account SAS tokens - JavaScript
titleSuffix: Azure Storage
description: Create and use Account SAS tokens in a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 07/05/2022
ms.author: normesta
ms.subservice: blobs
ms.custom: template-how-to, devx-track-js
---

# Create and use Account SAS tokens with Azure Blob Storage and JavaScript

This article shows you how to create and use Account SAS tokens to use the Azure Blob Storage client library v12 for JavaScript. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Account SAS tokens

An **Account SAS token** is one [type of SAS token](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#types-of-shared-access-signatures) for access delegation provided by Azure Storage. An Account SAS token provides access to Azure Storage. The token is only as restrictive as your define it when creating it. Because anyone with the token can use it to access your Storage account, you should define the token with the most restrictive permissions that still allows the token to complete the required tasks.

[Best practices for token](../common/storage-sas-overview#best-practices-when-using-sas) creation include limiting permissions:

* Start and end time for the token - a 10 minute interval or shorter is recommended
* Services: blob, file, queue, table
* Resource types: service, container, or object
* Permissions such as create, read, write, update, and delete

## Add required dependencies to your application

Include the required dependencies in your code.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-account-sas.js" id="Snippet_Dependencies":::

## Get environment variables to create shared key credential

## Create an Account SAS token

Create a [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) by using the storage account name and account key. Then use the StorageSharedKeyCredential to initialize a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

:::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_StorageAcctInfo":::
azure_storage-snippets

## Create a client with SAS token


## Use Blob service with SAS token

## See also

- [Types of SAS tokens](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json)
- [How a shared access signature works](../common/storage-sas-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#how-a-shared-access-signature-works)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)