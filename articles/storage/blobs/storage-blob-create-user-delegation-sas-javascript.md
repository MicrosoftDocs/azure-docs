---
title: Create a user delegation SAS with JavaScript
titleSuffix: Azure Storage
description: Create and use user delegation SAS tokens in a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/15/2022

ms.custom: template-how-to, devx-track-js, devguide-js

---

# Create a user delegation SAS token with Azure Blob Storage and JavaScript

This article shows you how to create a user delegation SAS token in the Azure Blob Storage client library v12 for JavaScript. A [user delegation SAS](/rest/api/storageservices/delegate-access-with-shared-access-signature#types-of-shared-access-signatures), introduced with version 2018-11-09, is secured with Microsoft Entra credentials and is supported for the Blob service only to:

* Grant access to an existing **container**.
* Grant access to create, use, and delete **blobs**.

To create a user delegation SAS, a client must have permissions to call the [blobServiceClient.getUserDelegationKey](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-getuserdelegationkey) operation. The key returned by this operation is used to sign the user delegation SAS. The security principal that calls this operation must be assigned an RBAC role that includes the Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action.

The permissions granted to a client who possesses the SAS are the intersection of the permissions that were granted to the security principal that requested the user delegation key and the permissions that were granted to the resource on the SAS token in the signed [permissions](/rest/api/storageservices/create-user-delegation-sas#specify-permissions) (sp) field. If a permission that's granted to the security principal via RBAC isn't also granted on the SAS token, that permission isn't granted to the client who attempts to use the SAS to access the resource.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Best practices for user delegation SAS tokens

Because anyone with the SAS token can use it to access the container and blobs, you should define the SAS token with the most restrictive permissions that still allow the token to complete the required tasks.

[Best practices for SAS tokens](../common/storage-sas-overview.md#best-practices-when-using-sas) 

## Use the DefaultAzureCredential in Azure Cloud

To authenticate to Azure, _without secrets_, set up **managed identity**. This allows your code to use [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential). 

To set up managed identity for the Azure cloud:

* Create a managed identity
* Set the appropriate [Storage roles](/rest/api/storageservices/create-user-delegation-sas#assign-permissions-with-rbac) for the identity
* Configure your Azure environment to work with your managed identity

When these two tasks are complete, use the DefaultAzureCredential instead of a connection string or account key. This allows all your environments to use the _exact same source code_ without the issue of using secrets in source code.

## Use the DefaultAzureCredential in local development

In your local development environment, your Azure identity (your personal or development account you use to sign in to [Azure portal](https://portal.azure.com)) needs to [authenticate to Azure](/javascript/api/overview/azure/identity-readme#authenticate-the-client-in-development-environment) to use the same code in local and cloud runtimes.

## Container: add required dependencies to your application

Include the required dependencies to create a container SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_Dependencies":::

## Container: get environment variables 

The Blob Storage account name and container name are the minimum required values to create a container SAS token:

```
// Get environment variables for DefaultAzureCredential
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
```

## Create a SAS with DefaultAzureCredential

The following conceptual steps are required to create a SAS token with DefaultAzureCredential:

* Set up DefaultAzureCredential
    * Local development - use personal identity and set roles for storage
    * Azure cloud - create managed identity
* Use DefaultAzureCredential to get the user delegation key with [UserDelegationKey](/rest/api/storageservices/create-user-delegation-sas)
* Use the user delegation key to construct the SAS token with the appropriate fields with [generateBlobSASQueryParameters](/javascript/api/@azure/storage-blob#@azure-storage-blob-generateblobsasqueryparameters)

## Container: create SAS token with DefaultAzureCredential

With identity configured, use the following code to create **User delegation SAS token** for an existing account and container:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_CreateContainerSas" highlight="18, 25, 42":::

The preceding server code creates a flow of values in order to create the container SAS token:

* Create the [**BlobServiceClient**](/javascript/api/@azure/storage-blob/blobserviceclient) with the [_DefaultAzureCredential_](/javascript/api/@azure/identity/defaultazurecredential)
* Use the [blobServiceClient.getUserDelegationKey](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-getuserdelegationkey) operation to create a [**UserDelegationKey**](/rest/api/storageservices/create-user-delegation-sas)
* Use the key to create the [**SAS token**](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json#sas-token) string with [generateBlobSASQueryParameters](/javascript/api/@azure/storage-blob#@azure-storage-blob-generateblobsasqueryparameters)

Once you're created the container SAS token, you can provide it to the client that will consume the token. The client can then use it to list the blobs in a container. A [client code example](#container-use-sas-token) shows how to test the SAS as a consumer.

## Container: use SAS token

Once the container SAS token is created, use the token. As an example of using the SAS token, you:

* Construct a full URL including container name and query string. The query string is the SAS token.
* Create a [ContainerClient](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-constructor-2) with the container URL.
* Use the client: in this example, list blobs in the container with [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-listblobsflat).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/list-blobs-from-container-sas-token.js" id="Snippet_ListBlobs" highlight="10, 14, 19":::

## Blob: add required dependencies to your application

Include the required dependencies to create n blob SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_Dependencies":::

## Blob: get environment variables 

The Blob Storage account name and container name are the minimum required values to create a blob SAS token:

```
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_BLOB_CONTAINER_NAME;
```

When you need to create a blob SAS token, you need to have the blob name to create the SAS token. That will be predetermined such as a random blob name, a user-submitted blob name, or a name generated from your application. 

```javascript
// Create random blob name for text file
const blobName = `${(0|Math.random()*9e6).toString(36)}.txt`;
```

## Blob: create SAS token with DefaultAzureCredential

With identity configured, use the following code to create **User delegation SAS token** for an existing account and container:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_CreateBlobSas" highlight="18, 25, 43":::

The preceding code creates a flow of values in order to create the container SAS token:

* Create the [**BlobServiceClient**](/javascript/api/@azure/storage-blob/blobserviceclient) with [_DefaultAzureCredential_](/javascript/api/@azure/identity/defaultazurecredential)
* Use the [blobServiceClient.getUserDelegationKey](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-getuserdelegationkey) operation to create a [**UserDelegationKey**](/rest/api/storageservices/create-user-delegation-sas)
* Use the key to create the [**SAS token**](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json#sas-token) string. If the blob name wasn't specified in the options, the SAS token is a container token.

Once you're created the blob SAS token, you can provide it to the client that will consume the token. The client can then use it to upload a blob. A [client code example](#blob-use-sas-token) shows how to test the SAS as a consumer.

## Blob: use SAS token

Once the blob SAS token is created, use the token. As an example of using the SAS token, you:

* Construct a full URL including container name, blob name and query string. The query string is the SAS token.
* Create a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) with the container URL.
* Use the client: in this example, upload blob with [upload](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-upload).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-blob-sas-token.js" id="Snippet_UploadToBlob" highlight="9, 13, 16":::


## See also

- [Types of SAS tokens](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)
