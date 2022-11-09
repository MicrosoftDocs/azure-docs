---
title: Get started with Azure Blob Storage and JavaScript
titleSuffix: Azure Storage
description: Get started developing a JavaScript application that works with Azure Blob Storage. This article helps you set up a project and authorizes access to an Azure Blob Storage endpoint.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 09/19/2022

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

1. If you want to connect with managed identity, install the Azure Identity client library for JavaScript:

    ```bash
    npm install @azure/identity
    ```

## Authenticate to Azure with passwordless credential

Azure Active Directory (Azure AD) provides the most secure connection by managing the connection identity ([**managed identity**](../../active-directory/managed-identities-azure-resources/overview.md)). This **passwordless** functionality allows you to develop an application that doesn't require any secrets (keys or connection strings) stored in the code. 

### Set up identity access to the Azure cloud

To connect to Azure without passwords, you need to set up an Azure identity or use an existing identity. Once the identity is set up, make sure to assign the appropriate roles to the identity. 

To authorize passwordless access with Azure AD, you'll need to use an Azure credential. Which type of credential you need depends on where your application runs. Use this table as a guide.

|Environment|Method|
|--|--|
|Developer environment|[Visual Studio Code](/azure/developer/javascript/sdk/authentication/local-development-environment-developer-account?tabs=azure-portal%2Csign-in-vscode)|
|Developer environment|[Service principal](../common/identity-library-acquire-token.md)|
|Azure-hosted apps|[Azure-hosted apps setup](./authorize-managed-identity.md)|
|On-premises|[On-premises app setup](../common/storage-auth-aad-app.md?tabs=dotnet&toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|

### Set up storage account roles

Your storage resource needs to have one or more of the following [Azure RBAC](../../role-based-access-control/built-in-roles.md) roles assigned to the identity resource you plan to connect with. [Setup the Azure Storage roles](assign-azure-role-data-access.md?tabs=portal) for each identity you created in the previous step: Azure cloud, local development, on-premises. 

After you complete the setup, each identity needs at least one of the appropriate roles: 
    
* A [data access](../common/authorize-data-access.md) role - such as: 
    * **Storage Blob Data Reader**
    * **Storage Blob Data Contributor**
* A [resource](../common/authorization-resource-provider.md) role - such as:
    * **Reader** 
    * **Contributor**


### Connect with passwordless authentication to Azure 

Once your Azure storage account identity roles and your local environment are set up, create a JavaScript file which includes the [``@azure/identity``](https://www.npmjs.com/package/@azure/identity) package. Using the `DefaultAzureCredential` class provided by the Azure.Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code, including Blob Storage.

Create a [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) instance. Use that object to create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-default-azure-credential.js":::

The `dotenv` package is used to read your storage account name from a `.env` file. This file should not be checked into source control. If you use a local service principal as part of your DefaultAzureCredential set up, any security information for that credential will also go into the `.env` file. 

If you plan to deploy the application to servers and clients that run outside of Azure, you can obtain an OAuth token by using other classes in the [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme) which derive from the [TokenCredential](/javascript/api/@azure/core-auth/tokencredential) class.

## Connect with an account name and key

Create a [StorageSharedKeyCredential](/javascript/api/@azure/storage-blob/storagesharedkeycredential) by using the storage account name and account key. Then use the StorageSharedKeyCredential to initialize a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-account-name-and-key.js":::

The `dotenv` package is used to read your storage account name and key from a `.env` file. This file should not be checked into source control. 

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## Connect with a connection string

Create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) by using a connection string. 

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-connection-string.js":::

The `dotenv` package is used to read your storage account connection string from a `.env` file. This file should not be checked into source control. 

For information about how to obtain account keys and best practice guidelines for properly managing and safeguarding your keys, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

## Connect with a SAS token

Create a Uri to your resource by using the blob service endpoint and SAS token. Then, create a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) with the Uri.

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-sas-token.js":::

The `dotenv` package is used to read your storage account name and sas token from a `.env` file. This file should not be checked into source control.

To generate and manage SAS tokens, see any of these articles:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

- [Create a service SAS for a container or blob](sas-service-create.md)

## Connect anonymously

If you explicitly enable anonymous access, then you can connect to Blob Storage without authorization for your request. You can create a new BlobServiceClient object for anonymous access by providing the Blob storage endpoint for the account. This requires you to know the account and container names. To learn how to enable anonymous access, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-anonymous-credential.js":::

The `dotenv` package is used to read your storage account name from a `.env` file. This file should not be checked into source control.

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
| [Get container's URL](storage-blob-get-url-javascript.md) | Get URL of container. |
| [Delete and restore containers](storage-blob-container-delete-javascript.md) | Delete containers, and if soft-delete is enabled, restore deleted containers.  |
| [List containers](storage-blob-containers-list-javascript.md) | List containers in an account and the various options available to customize a listing. |
| [Manage properties and metadata](storage-blob-container-properties-metadata-javascript.md) | Get and set properties and metadata for containers. |
| [Upload blobs](storage-blob-upload-javascript.md) | Learn how to upload blobs by using strings, streams, file paths, and other methods. |
| [Get blob's URL](storage-blob-get-url-javascript.md) | Get URL of blob. |
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