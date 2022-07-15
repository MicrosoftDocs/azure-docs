---
title: Create user delegation SAS tokens - JavaScript
titleSuffix: Azure Storage
description: Create and use user delegation SAS tokens in a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 07/15/2022
ms.author: normesta
ms.subservice: blobs
ms.custom: template-how-to, devx-track-js
---

# Create a user delegation SAS token with Azure Blob Storage and JavaScript

This article shows you how to create a user delegation SAS token in the Azure Blob Storage client library v12 for JavaScript. A [user delegation SAS](/rest/api/storageservices/delegate-access-with-shared-access-signature#types-of-shared-access-signatures), introduced with version 2018-11-09, is secured with Azure AD credentials and is supported for the Blob service only to:

* Grant access to an existing **container**.
* Grant access to create, use, and delete **blobs**.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Best practices for user delegation SAS tokens

Because anyone with the SAS token can use it to access the container and blobs, you should define the SAS token with the most restrictive permissions that still allow the token to complete the required tasks.

[Best practices for SAS tokens](../common/storage-sas-overview.md#best-practices-when-using-sas) include:

* Identity creating SAS token
    * [Managed identity](/azure/active-directory/managed-identities-azure-resources/overview): managed identity allows your development, pipeline, and production environments to access Azure without relying on secrets used in code.
    * Identity for each task: Because a user delegation SAS token is directly tied to Active Directory credentials, those credentials should also be the most restrictive possible for the tokens it creates. This may mean you need multiple credentials if you intend to have different scopes of permissions for your user delegation SAS tokens.
* SAS token
    * Most limited SAS token permission necessary such as create, read, write, update, and delete
    * Time limits: 10 minutes is a suggested time limit

## Set up managed identity

To authenticate to Azure, _without secrets_, set up managed identity:

* Create a managed identity
* Set the appropriate [Storage roles](/rest/api/storageservices/create-user-delegation-sas#assign-permissions-with-rbac) for the identity
* Configure your environment to work with your managed identity

When these two tasks are complete, use the DefaultAzureCredential as the _managed identity_ instead of a connection string or account key. This allows all your environments to use the exact same source code without the issue of using secrets in source code.

## Container: add required dependencies to your application

Include the required dependencies to create a container SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_Dependencies":::

## Container: get environment variables 

The Blob Storage account name and container name are the minimum required values to create a container SAS token:

```
// Get environment variables for managed identity
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
```

## Container: create SAS token with managed identity

With managed identity configured, use the following code to create **User delegation SAS token** for an existing account and container:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_CreateContainerSas" highlight="14, 21, 36":::

The preceding code creates a flow of values in order to create the container SAS token:

* Create the [**BlobServiceClient**](/javascript/api/@azure/storage-blob/blobserviceclient) with the managed identity, [_DefaultAzureCredential_](/javascript/api/@azure/identity/defaultazurecredential)
* Use that client to create a [**UserDelegationKey**](/rest/api/storageservices/create-user-delegation-sas)
* Use the key to create the [**SAS token**](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#sas-token) string

## Container: use SAS token

Once the container SAS token is created, use the token. As an example of using the SAS token, you:

* Construct a full URL including container name and query string. The query string is the SAS token.
* Create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-constructor-2) with the container URL.
* Use the client: in this example, list blobs in the container with [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsflat).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_ListBlobs" highlight="11,15, 20":::

## Blob: add required dependencies to your application

Include the required dependencies to create n blob SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_Dependencies":::

## Blob: get environment variables 

The Blob Storage account name and container name are the minimum required values to create a blob SAS token:

```
// Get environment variables for managed identity
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
```

When you need to create a blob SAS token, you need to have the blob name to create the SAS token. That will be predetermined such as a random blob name, a user-submitted blob name, or a name generated from your application. 

```javascript
// Create random blob name for text file
const blobName = `${(0|Math.random()*9e6).toString(36)}.txt`;
```

## Blob: create SAS token with managed identity

With managed identity configured, use the following code to create **User delegation SAS token** for an existing account and container:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_CreateBlobSas" highlight="18, 25, 43":::

The preceding code creates a flow of values in order to create the container SAS token:

* Create the [**BlobServiceClient**](/javascript/api/@azure/storage-blob/blobserviceclient) with the managed identity, [_DefaultAzureCredential_](/javascript/api/@azure/identity/defaultazurecredential)
* Use that client to create a [**UserDelegationKey**](/rest/api/storageservices/create-user-delegation-sas)
* Use the key to create the [**SAS token**](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#sas-token) string. If the blob name wasn't specified in the options, the SAS token is a container token.

## Blob: use SAS token

Once the blob SAS token is created, use the token. As an example of using the SAS token, you:

* Construct a full URL including container name, blob name and query string. The query string is the SAS token.
* Create a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) with the container URL.
* Use the client: in this example, upload blob with [upload](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-upload).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_UploadToBlob" highlight="13, 16":::


## See also

- [Types of SAS tokens](../common/storage-sas-overview.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)