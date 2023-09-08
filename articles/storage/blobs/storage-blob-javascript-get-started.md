---
title: Get started with Azure Blob Storage and JavaScript
titleSuffix: Azure Storage
description: Get started developing a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 11/30/2022
ms.custom: template-how-to, devx-track-js, devguide-js, passwordless-js
---

# Get started with Azure Blob Storage and JavaScript

This article shows you how to connect to Azure Blob Storage by using the Azure Blob Storage client library v12 for JavaScript. Once connected, your code can operate on containers, blobs, and features of the Blob Storage service.

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

[API reference](/javascript/api/preview-docs/@azure/storage-blob) | [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples) | [Give feedback](https://github.com/Azure/azure-sdk-for-js/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure storage account - [create a storage account](../common/storage-account-create.md)
- [Node.js LTS](https://nodejs.org/)
- For client (browser) applications, you need [bundling tools](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Bundling.md).

## Set up your project

1. Open a command prompt and change into your project folder. Change `YOUR-DIRECTORY` to your folder name:

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

1. If you want to use passwordless connections using Azure AD, install the Azure Identity client library for JavaScript:

    ```bash
    npm install @azure/identity
    ```

## Authorize access and connect to Blob Storage

Azure Active Directory (Azure AD) provides the most secure connection by managing the connection identity ([**managed identity**](../../active-directory/managed-identities-azure-resources/overview.md)). This **passwordless** functionality allows you to develop an application that doesn't require any secrets (keys or connection strings) stored in the code.

### Set up identity access to the Azure cloud

To connect to Azure without passwords, you need to set up an Azure identity or use an existing identity. Once the identity is set up, make sure to assign the appropriate roles to the identity.

To authorize passwordless access with Azure AD, you'll need to use an Azure credential. Which type of credential you need depends on where your application runs. Use this table as a guide.

|Environment|Method|
|--|--|
|Developer environment|[Visual Studio Code](/azure/developer/javascript/sdk/authentication/local-development-environment-developer-account?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)|
|Developer environment|[Service principal](/azure/developer/javascript/sdk/authentication/local-development-environment-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)|
|Azure-hosted apps|[Azure-hosted apps setup](/azure/developer/javascript/sdk/authentication/azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)|
|On-premises|[On-premises app setup](/azure/developer/javascript/sdk/authentication/on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)|

### Set up storage account roles

Your storage resource needs to have one or more of the following [Azure RBAC](../../role-based-access-control/built-in-roles.md) roles assigned to the identity resource you plan to connect with. [Setup the Azure Storage roles](assign-azure-role-data-access.md?tabs=portal) for each identity you created in the previous step: Azure cloud, local development, on-premises. 

After you complete the setup, each identity needs at least one of the appropriate roles:

- A [data access](../common/authorize-data-access.md) role - such as:
  - **Storage Blob Data Reader**
  - **Storage Blob Data Contributor**

- A [resource](../common/authorization-resource-provider.md) role - such as:
  - **Reader**
  - **Contributor**

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

## Create a BlobServiceClient object

The [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object is the top object in the SDK. This client allows you to manipulate the service, containers and blobs.

## [Passwordless](#tab/azure-ad)

Once your Azure storage account identity roles and your local environment are set up, create a JavaScript file which includes the [``@azure/identity``](https://www.npmjs.com/package/@azure/identity) package. Create a credential, such as the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential), to implement passwordless connections to Blob Storage. Use that credential to authenticate with a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-default-azure-credential.js" highlight="9-12":::

The `dotenv` package is used to read your storage account name from a `.env` file. This file should not be checked into source control. If you use a local service principal as part of your DefaultAzureCredential set up, any security information for that credential will also go into the `.env` file.

If you plan to deploy the application to servers and clients that run outside of Azure, create one of the [credentials](https://www.npmjs.com/package/@azure/identity#credential-classes) that meets your needs.

## [Account key](#tab/account-key)

Create a [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) from the storage account name and account key. Then pass the StorageSharedKeyCredential to the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class constructor to create a client.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-account-name-and-key.js" highlight="12-15":::

The `dotenv` package is used to read your storage account name and key from a `.env` file. This file should not be checked into source control.

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## [SAS token](#tab/sas-token)

Create a Uri to your resource by using the blob service endpoint and SAS token. Then, create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) with the Uri. The SAS token is a series of name/value pairs in the querystring in the format such as:

```
https://YOUR-RESOURCE-NAME.blob.core.windows.net?YOUR-SAS-TOKEN
```

Depending on which tool you use to generate your SAS token, the querystring `?` may already be added to the SAS token.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-sas-token.js" highlight="13-16":::

The `dotenv` package is used to read your storage account name and sas token from a `.env` file. This file should not be checked into source control.

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create a service SAS for a container or blob](sas-service-create.md)

---

## Create a ContainerClient object

You can create the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object either from the BlobServiceClient, or directly.

### Create ContainerClient object from BlobServiceClient

Create the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) object from the BlobServiceClient.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container-client-with-blob-service-client.js" highlight="19-22, 28-31, 36-38":::

### Create ContainerClient directly

#### [Passwordless](#tab/azure-ad)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container-client-with-default-azure-credential.js" highlight="27-30":::


#### [Account key](#tab/account-key)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container-client-with-account-name-and-key.js" highlight="18-21, 29-32":::


#### [SAS token](#tab/sas-token)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-container-client-with-sas-token.js" highlight="19, 24":::


-----------------

The `dotenv` package is used to read your storage account name from a `.env` file. This file should not be checked into source control.

## Create a BlobClient object

You can create any of the BlobClient objects, listed below, either from a ContainerClient, or directly. 

List of Blob clients: 

* [BlobClient](/javascript/api/@azure/storage-blob/blobclient)
* [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient)
* [AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient)
* [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient)
* [PageBlobClient](/javascript/api/@azure/storage-blob/pageblobclient)

### Create BlobClient object from ContainerClient

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-blob-client-with-container-client.js" highlight="19-22, 29-32, 38, 45":::

### Create BlobClient directly

#### [Passwordless](#tab/azure-ad)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-blob-client-with-default-azure-credential.js" highlight="28-31":::

#### [Account key](#tab/account-key)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-blob-client-with-account-name-and-key.js" highlight="19-22, 34-37":::

#### [SAS token](#tab/sas-token)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/create-blob-client-with-sas-token.js" highlight="17, 36":::

-----------------

The `dotenv` package is used to read your storage account name from a `.env` file. This file should not be checked into source control.

## See also

- [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob)
- [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples)
- [API reference](/javascript/api/@azure/storage-blob/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-js/issues)