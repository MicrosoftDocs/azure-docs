---
title: Get started with Azure Blob Storage and JavaScript
titleSuffix: Azure Storage
description: Get started developing a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/30/2022
ms.author: normesta
ms.subservice: blobs
ms.custom: template-how-to
---


# Get started with Azure Blob Storage and JavaScript

This article shows you to connect to Azure Blob Storage by using the Azure Blob Storage client library v12 for JavaScript. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

[Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples) | [API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)

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

1. In your `index.js` file, add the package:

    ```javascript
    const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");    
    ```

Main client:

- [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient): A BlobServiceClient represents a Client to the Azure Storage Blob service allowing you to manipulate blob containers.

Common clients:

- [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient): A BlobServiceClient represents a Client to the Azure Storage Blob service allowing you to manipulate blob containers. 
- [ContainerClient](/javascript/api/@azure/storage-blob/containerclient): A ContainerClient represents a URL to the Azure Storage container allowing you to manipulate its blobs.

Types of Blob:

- [Block](/javascript/api/@azure/storage-blob/blockblobclient): 
- [Append](/javascript/api/@azure/storage-blob/appendblobclient):
- [Page](/javascript/api/@azure/storage-blob/pageblobclient):

## Differences between Node.js and browsers

There are differences between Node.js and browsers runtime. When getting started with this library, pay attention to APIs or classes marked with:

* `ONLY AVAILABLE IN NODE.JS RUNTIME`.
* `ONLY AVAILABLE IN BROWSERS`.

If a blob holds compressed data in **gzip** or **deflate** format and its content encoding is set accordingly, downloading behavior is different between Node.js and browsers:

* In Node.js, storage clients will download the blob in its compressed format
* In browsers, the data will be downloaded in de-compressed format.

## Connect to Blob Storage

To connect to Blob Storage, create an instance of the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class. This object is your starting point. You can use it to operate on the blob service instance and its containers. You can create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) by using:

|Connection type|SDK reference information|
|--|--|
|Storage account access key|[StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential)|
|Storage account connection string|[BlobServiceClient.fromConnectionString()](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-fromconnectionstring)|
|Storage shared access signature (SAS)|Used as part of string for resource URL: `https://${account}.blob.core.windows.net${accountSas}`.|
|Azure Active Directory (Azure AD) authorization token|BlobServiceClient.|

To learn more about each of these authorization mechanisms, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

#### Authorize with an account key

# [Node.js](#tab/nodejs)

Create a [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) by using the storage account name and account key. Then use that object to initialize a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient)).

```javascript
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");  

// Enter your storage account name and account key
const account = process.env.ACCOUNT_NAME || "";
const accountKey = process.env.ACCOUNT_KEY || "";

// Use StorageSharedKeyCredential with storage account and account key
// ONLY AVAILABLE IN NODE.JS RUNTIME
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

// Get Blob service client
const blobServiceClient = new BlobServiceClient(
`https://${account}.blob.core.windows.net`,
sharedKeyCredential
);
```
---

## Authorize with a connection string

You can also create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) by using a connection string. 

```javascript
const { BlobServiceClient } = require("@azure/storage-blob");

const connStr = "<connection string>";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

#### Authorize with a SAS token

Create a [Uri]() by using the blob service endpoint and SAS token. Then, create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) by using the [Uri]().

```javascript
const { BlobServiceClient } = require("@azure/storage-blob");

const account = "<account name>";
const sas = "<service Shared Access Signature Token>";

const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
```

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create an account SAS with JavaScript](../common/storage-account-sas-create-javascript.md)

- [Create a service SAS for a container or blob](sas-service-create.md)

- [Create a user delegation SAS for a container, directory, or blob with JavaScript](storage-blob-user-delegation-sas-create-javascript.md)

#### Authorize with Azure AD

To authorize with Azure AD, you'll need to use a security principal. Which type of security principal you need depends on where your application runs. Use this table as a guide.

| Where the application runs | Security principal | Guidance |
|--|--|---|
| Local machine (developing and testing) | User identity or service principal | [Use the Azure Identity library to get an access token for authorization](../common/identity-library-acquire-token.md) | 
| Azure | Managed identity | [Authorize access to blob data with managed identities for Azure resources](authorize-managed-identity.md) |
| Servers or clients outside of Azure | Service principal | [Authorize access to blob or queue data from a native or web application](../common/storage-auth-aad-app.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json) |

If you're testing on a local machine, or your application will run in Azure virtual machines (VMs), Functions apps, virtual machine scale sets, or in other Azure services, obtain an OAuth token by creating a [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) instance. Use that object to create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

// Enter your storage account name
const account = "<account>";
const defaultAzureCredential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);
```

If you plan to deploy the application to servers and clients that run outside of Azure, you can obtain an OAuth token by using other classes in the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme) which derive from the [TokenCredential](/javascript/api/@azure/core-auth/tokencredential) class.

This example creates a [ClientSecretCredential](/javascript/api/@azure/identity/clientsecretcredential) instance by using the client ID, client secret, and tenant ID. You can obtain these values when you create an app registration and service principal.

```javascript
const {
  ClientSecretCredential,
  DefaultAzureCredential,
} = require("@azure/identity");
const { SubscriptionClient } = require("@azure/arm-subscriptions");
require("dotenv").config();

let credentials = null;

const tenantId = process.env["AZURE_TENANT_ID"];
const clientId = process.env["AZURE_CLIENT_ID"];
const secret = process.env["AZURE_CLIENT_SECRET"];

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  if (tenantId && clientId && secret) {
    console.log("development");
    credentials = new ClientSecretCredential(tenantId, clientId, secret);
  } else {
    credentials = new DefaultAzureCredential();
  }
}
```

#### Connect anonymously

If you explicitly enable anonymous access, then your code can create connect to Blob Storage without authorize your request. You can create a new service client object for anonymous access by providing the Blob storage endpoint for the account. However, you must also know the name of a container in that account that's available for anonymous access. To learn how to enable anonymous access, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

```javascript
const { BlobServiceClient, AnonymousCredential } = require("@azure/storage-blob");

// Enter your storage account name and SAS
const account = process.env.ACCOUNT_NAME || "<account name>";
const accountSas = process.env.ACCOUNT_SAS || "<account SAS>";

// List containers
const blobServiceClient = new BlobServiceClient(
// When using AnonymousCredential, following url should include a valid SAS or support public access
`https://${account}.blob.core.windows.net${accountSas}`,
new AnonymousCredential()
);
```

Alternatively, if you have the URL to a container that is anonymously available, you can use it to reference the container directly.

```javascript
const { ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

// Enter your storage account name and shared key
const account = process.env.ACCOUNT_NAME || "";
const accountKey = process.env.ACCOUNT_KEY || "";

// Use StorageSharedKeyCredential with storage account and account key
// ONLY AVAILABLE IN NODE.JS RUNTIME
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

// Create a container
const containerName = `newcontainer${new Date().getTime()}`;
const containerClient = new ContainerClient(
  `https://${account}.blob.core.windows.net/${containerName}`,
  sharedKeyCredential
);

const createContainerResponse = await containerClient.create();
```


## Build your application

As you build your application, your code will primarily interact with three types of resources:

- The storage account, which is the unique top-level namespace for your Azure Storage data.

- Containers, which organize the blob data in your storage account.

- Blobs, which store unstructured data like text and binary data.

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Each type of resource is represented by one or more associated JavaScript clients:

| Class | Description |
|---|---|
| [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | Represents the Blob Storage endpoint for your storage account. |
| [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | Allows you to manipulate Azure Storage containers and their blobs. |
| [BlobClient](/javascript/api/@azure/storage-blob/blobclient) | Allows you to manipulate Azure Storage blobs.|
| [AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient) | Allows you to perform operations specific to append blobs such as periodically appending log data.|
| [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient)| Allows you to perform operations specific to block blobs such as staging and then committing blocks of data.|

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a container](storage-blob-container-create.md) | Create containers. |
| [Delete and restore containers](storage-blob-container-delete.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata](storage-blob-container-properties-metadata.md) | Get and set properties and metadata for containers. |
| [Create and manage leases](storage-blob-container-lease.md) | Establish and manage a lock on a container or the blobs in a container. |
| [Append data to blobs](storage-blob-append.md) | Learn how to create an append blob and then append data to that blob. |
| [Upload blobs](storage-blob-upload.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Download blobs](storage-blob-download.md) | Download blobs by using strings, streams, and file paths. |
| [Copy blobs](storage-blob-copy.md) | Copy a blob from one account to another account. |
| [List blobs](storage-blobs-list.md) | List blobs in different ways. |
| [Delete and restore](storage-blob-delete.md) | Delete blobs, and if soft-delete is enabled, restore deleted blobs.  |
| [Find blobs using tags](storage-blob-tags.md) | Set and retrieve tags then use tags to find blobs. |
| [Manage properties and metadata](storage-blob-properties-metadata.md) | Get and set properties and metadata for blobs. |

## See also

- [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob)
- [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)