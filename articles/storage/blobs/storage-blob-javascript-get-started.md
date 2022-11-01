---
title: Get started with Azure Blob Storage and JavaScript
titleSuffix: Azure Storage
description: Get started developing a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 07/06/2022

ms.subservice: blobs
ms.custom: template-how-to
---


# Get started with Azure Blob Storage and JavaScript

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library v12 for JavaScript. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## SDK Objects for service, container, and blob

The [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object is the top object in the SDK. This client allows you to manipulate the service, containers and blobs. From the BlobServiceClient, you can get to the ContainerClient. The [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object allows you to interact with a container and its blobs. The [BlobClient](/javascript/api/@azure/storage-blob/blobclient) allows you to manipulate blobs. 

| Client | Allows access to | Accessed |
|--|--|--|
|Account: [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient)|Controls your service resource, provides access to container and blobs.|Directly from SDK via require statement.|
|Container: [ContainerClient](/javascript/api/@azure/storage-blob/containerclient)| Controls a specific container, provides access to blobs.|Directly from SDK via require statement or from [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).|
|Blob: [BlobClient](/javascript/api/@azure/storage-blob/blobclient)|Access to a blob of any kind: [block](/javascript/api/@azure/storage-blob/blockblobclient), [append](/javascript/api/@azure/storage-blob/appendblobclient), [page](/javascript/api/@azure/storage-blob/pageblobclient).|Directly from SDK via require statement or from [ContainerClient](/javascript/api/@azure/storage-blob/containerclient).|

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Node.js LTS](https://nodejs.org/)
- Optionally, you need [bundling tools](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Bundling.md) if you're developing for a web client.

## Set up your project

1. Open a command prompt and change into your project folder:

    ```bash
    cd YOUR-DIRECTORY
    ```

1. If you don't have a `package.json` file already in your directory, initialize the project to create the file:

    ```bash
    npm init -y
    ```

1. Install the Azure Blob Storage client library for JavaScript:

    ```bash
    npm install @azure/storage-blob
    ```

1. If you want to connect with managed identity, install the Azure Identity client library for JavaScript:

    ```bash
    npm install @azure/identity
    ```

1. In your `index.js` file, add the package:

    ```javascript
    const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');    

    // optional but recommended - connect with managed identity (Azure AD)
    const { DefaultAzureCredential } = require('@azure/identity');
    ```

## Connect with Azure AD

Azure Active Directory (Azure AD) provides the most secure connection by managing the connection identity ([**managed identity**](../../active-directory/managed-identities-azure-resources/overview.md)). This functionality allows you to develop code that doesn't require any secrets (keys or connection strings) stored in the code or environment. Managed identity requires [**setup**](assign-azure-role-data-access.md?tabs=portal) for any identities such as developer (personal) or cloud (hosting) environments. You need to complete the setup before using the code in this section. 

After you complete the setup, your Storage resource needs to have one or more of the following roles assigned to the identity resource you plan to connect with:

* A [data access](../common/authorize-data-access.md) role - such as: 
    * **Storage Blob Data Reader**
    * **Storage Blob Data Contributor**
* A [resource](../common/authorization-resource-provider.md) role - such as:
    * **Reader** 
    * **Contributor**

To authorize with Azure AD, you'll need to use an Azure credential. Which type of credential you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
|--|--|---|
| Local machine (developing and testing) | User identity or service principal | [Use the Azure Identity library to get an access token for authorization](../common/identity-library-acquire-token.md) | 
| Azure | Managed identity | [Authorize access to blob data with managed identities for Azure resources](authorize-managed-identity.md) |
| Servers or clients outside of Azure | Service principal | [Authorize access to blob or queue data from a native or web application](../common/storage-auth-aad-app.md?toc=/azure/storage/blobs/toc.json) |

Create a [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) instance. Use that object to create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

async function main(){

  // this call requires Reader role on the identity
  const serviceGetPropertiesResponse = await blobServiceClient.getProperties();
  console.log(`${JSON.stringify(serviceGetPropertiesResponse)}`);

}

main()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(`error: ${ex.message}`));
```

If you plan to deploy the application to servers and clients that run outside of Azure, you can obtain an OAuth token by using other classes in the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme) which derive from the [TokenCredential](/javascript/api/@azure/core-auth/tokencredential) class.

## Connect with an account name and key

Create a [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) by using the storage account name and account key. Then use the StorageSharedKeyCredential to initialize a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

```javascript
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
if (!accountName) throw Error('Azure Storage accountName not found');
if (!accountKey) throw Error('Azure Storage accountKey not found');

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function main(){
  const serviceGetPropertiesResponse = await blobServiceClient.getProperties();
  console.log(`${JSON.stringify(serviceGetPropertiesResponse)}`);
}

main()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(ex.message));
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## Connect with a connection string

Create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) by using a connection string. 

```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config()

const connString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connString) throw Error('Azure Storage Connection string not found');

const blobServiceClient = BlobServiceClient.fromConnectionString(connString);

async function main(){
  const serviceGetPropertiesResponse = await blobServiceClient.getProperties();
  console.log(`${JSON.stringify(serviceGetPropertiesResponse)}`);
}

main()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(ex.message));
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## Object Authorization with a SAS token

Create a Uri to your resource by using the blob service endpoint and SAS token. Then, create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) with the Uri.

```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
if (!accountName) throw Error('Azure Storage accountName not found');
if (!sasToken) throw Error('Azure Storage accountKey not found');

const blobServiceUri = `https://${accountName}.blob.core.windows.net`;

const blobServiceClient = new BlobServiceClient(
  `${blobServiceUri}${sasToken}`,
  null
);

async function main(){
  const serviceGetPropertiesResponse = await blobServiceClient.getProperties();
  console.log(`${JSON.stringify(serviceGetPropertiesResponse)}`);
}

main()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(`error: ${ex.message}`));
```

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create a service SAS for a container or blob](sas-service-create.md)




## Connect anonymously

If you explicitly enable anonymous access, then you can connect to Blob Storage without authorization for your request. You can create a new BlobServiceClient object for anonymous access by providing the Blob storage endpoint for the account. This requires you to know the account and container names. To learn how to enable anonymous access, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

```javascript
const { BlobServiceClient, AnonymousCredential } = require('@azure/storage-blob');
require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceUri = `https://${accountName}.blob.core.windows.net`;

const blobServiceClient = new BlobServiceClient(
  blobServiceUri,
  new AnonymousCredential()
);

async function getContainerProperties(){

  // Access level: 'container'
  const containerName = `blob-storage-dev-guide-1`;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const containerProperties = await containerClient.getProperties();
  console.log(JSON.stringify(containerProperties));

}

getContainerProperties()
  .then(() => console.log(`done`))
  .catch((ex) => console.log(`error: ${ex.message}`));
```

Each type of resource is represented by one or more associated JavaScript clients:

| Class | Description |
|---|---|
| [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/javascript/api/@azure/storage-blob/blobclient) | Allows you to manipulate Azure Storage blobs.|

The following guides show you how to use each of these clients to build your application. The [sample code](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) shown is this guide is available on GitHub.

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create-javascript.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete-javascript.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list-javascript.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata](storage-blob-container-properties-metadata-javascript.md) | Get and set properties and metadata for containers. |
| [Upload blobs](storage-blob-upload-javascript.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download-javascript.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy-javascript.md) | Copy a blob from one account to another account. |
| [List blobs](storage-blobs-list-javascript.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete-javascript.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags-javascript.md) | Set and retrieve indexed tags then use tags to find blobs. |
| [Manage properties and metadata](storage-blob-properties-metadata-javascript.md) | Get all system properties and set HTTP properties and metadata for blobs. |

## See also

- [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob)
- [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)
