---
title: Get started with Azure Blob Storage and JavaScript or TypeScript
titleSuffix: Azure Storage
description: Get started developing a JavaScript or TypeScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024
ms.custom: template-how-to, devx-track-js, devguide-js, passwordless-js, devx-track-ts, devguide-ts
---

# Get started with Azure Blob Storage and JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-getting-started](../../../includes/storage-dev-guides/storage-dev-guide-selector-getting-started.md)]

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library for JavaScript. Once connected, use the [developer guides](#build-your-app) to learn how your code can operate on containers, blobs, and features of the Blob Storage service.

If you're looking to start with a complete example, see the client library quickstart for [JavaScript](storage-quickstart-blobs-nodejs.md) or [TypeScript](storage-quickstart-blobs-nodejs-typescript.md).

[API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Node.js LTS](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/download), if applicable
- For client (browser) applications, you need [bundling tools](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Bundling.md).
- 

## Set up your project

This section walks you through preparing a project to work with the Azure Blob Storage client library for JavaScript.

Open a command prompt and navigate to your project folder. Change `<project-directory>` to your folder name:

```bash
cd <project-directory>
```

If you don't have a `package.json` file already in your directory, initialize the project to create the file:

```bash
npm init -y
```

From your project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `npm install` or `yarn add` commands. The **@azure/identity** package is needed for passwordless connections to Azure services.

### [JavaScript](#tab/javascript)

```bash
npm install @azure/storage-blob @azure/identity
```

### [TypeScript](#tab/typescript)

```bash
npm install typescript @azure/storage-blob @azure/identity
```

---

## Authorize access and connect to Blob Storage

To connect an app to Blob Storage, create an instance of the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class. This object is your starting point to interact with data resources at the storage account level. You can use it to operate on the storage account and its containers. You can also use the service client to create container clients or blob clients, depending on the resource you need to work with.

To learn more about creating and managing client objects, including best practices, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).

You can authorize a `BlobServiceClient` object by using a Microsoft Entra authorization token, an account access key, or a shared access signature (SAS). For optimal security, Microsoft recommends using Microsoft Entra ID with managed identities to authorize requests against blob data. For more information, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

## [Microsoft Entra ID (recommended)](#tab/azure-ad)

To authorize with Microsoft Entra ID, you need to use a [security principal](../../active-directory/develop/app-objects-and-service-principals.md). Which type of security principal you need depends on where your app runs. Use the following table as a guide:

| Where the app runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/azure/developer/javascript/sdk/authentication/local-development-environment-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/azure/developer/javascript/sdk/authentication/local-development-environment-developer-account?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/azure/developer/javascript/sdk/authentication/azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/azure/developer/javascript/sdk/authentication/on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

#### Authorize access using DefaultAzureCredential

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) instance. You can then use that credential to create a `BlobServiceClient` object.

The following example creates a `BlobServiceClient` object using `DefaultAzureCredential`:


```javascript
const accountName = "<account-name>";
const accountURL = `https://${accountName}.blob.core.windows.net`;
const blobServiceClient = new BlobServiceClient(
  accountURL,
  new DefaultAzureCredential()
);
```

This code example can be used for JavaScript or TypeScript projects.

## [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, append the token to the account URL string separated by a `?` delimiter. Then, create a `BlobServiceClient` object with the URL.

```javascript
const accountName = "<account-name>";
const sasToken = "<sas-token>";
const accountURL = `https://${accountName}.blob.core.windows.net?${sasToken}`;
const blobServiceClient = new BlobServiceClient(accountURL);
```

This code example can be used for JavaScript or TypeScript projects.

To learn more about generating and managing SAS tokens, see the following articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)
- [Create an account SAS with JavaScript](storage-blob-account-delegation-sas-create-javascript.md)
- [Create a service SAS with JavaScript](sas-service-create-javascript.md)
- [Create a user delegation SAS with JavaScript](storage-blob-create-user-delegation-sas-javascript.md)

> [!NOTE]
> For scenarios where shared access signatures (SAS) are used, Microsoft recommends using a user delegation SAS. A user delegation SAS is secured with Microsoft Entra credentials instead of the account key. 

## [Account key](#tab/account-key)

To use a storage account shared key, provide the key as a string and initialize a `BlobServiceClient` object.

```javascript
const credential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);
```

This code example can be used for JavaScript or TypeScript projects.

You can also create a `BlobServiceClient` object using a connection string.

```javascript
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
```

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Build your app

As you build apps to work with data resources in Azure Blob Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to access data and perform specific actions using the Azure Storage client library for JavaScript:

| Guide | Description |
| --- | --- |
| [Configure a retry policy](storage-retry-policy-javascript.md) | Implement retry policies for client operations. |
| [Copy blobs](storage-blob-copy-javascript.md) | Copy a blob from one location to another. |
| [Create a container](storage-blob-container-create-javascript.md) | Create blob containers. |
| [Create a user delegation SAS](storage-blob-create-user-delegation-sas-javascript.md) | Create a user delegation SAS for a container or blob. |
| [Create and manage blob leases](storage-blob-lease-javascript.md) | Establish and manage a lock on a blob. |
| [Create and manage container leases](storage-blob-container-lease-javascript.md) | Establish and manage a lock on a container. |
| [Delete and restore](storage-blob-delete-javascript.md) | Delete blobs and restore soft-deleted blobs.  |
| [Delete and restore containers](storage-blob-container-delete-javascript.md) | Delete containers and restore soft-deleted containers.  |
| [Download blobs](storage-blob-download-javascript.md) | Download blobs by using strings, streams, and file paths. |
| [Find blobs using tags](storage-blob-tags-javascript.md) | Set and retrieve tags, and use tags to find blobs. |
| [List blobs](storage-blobs-list-javascript.md) | List blobs in different ways. |
| [List containers](storage-blob-containers-list-javascript.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata (blobs)](storage-blob-properties-metadata-javascript.md) | Get and set properties and metadata for blobs. |
| [Manage properties and metadata (containers)](storage-blob-container-properties-metadata-javascript.md) | Get and set properties and metadata for containers. |
| [Performance tuning for data transfers](storage-blobs-tune-upload-download-javascript.md) | Optimize performance for data transfer operations. |
| [Set or change a blob's access tier](storage-blob-use-access-tier-javascript.md) | Set or change the access tier for a block blob. |
| [Upload blobs](storage-blob-upload-javascript.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |