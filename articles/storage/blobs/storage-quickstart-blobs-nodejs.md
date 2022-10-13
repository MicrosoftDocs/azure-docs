---
title: "Quickstart: Azure Blob storage library v12 - JavaScript"
description: In this quickstart, you learn how to use the Azure Blob storage blob npm package version 12 for JavaScript to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 09/13/2022
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---

# Quickstart: Manage blobs with JavaScript v12 SDK in Node.js

In this quickstart, you learn to manage blobs by using Node.js. Blobs are objects that can hold large amounts of text or binary data, including images, documents, streaming media, and archive data. 

These [**example code**](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/quickstarts/JavaScript/V12/nodejs) snippets show you how to perform the following with the Azure Blob storage package library for JavaScript:

- [Get the connection string](#get-the-connection-string)
- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)

Additional resources:

[API reference](/javascript/api/@azure/storage-blob) |
[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob) | [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Storage account. [Create a storage account](../common/storage-account-create.md).
- [Node.js LTS](https://nodejs.org/en/download/).
- [Microsoft Visual Studio Code](https://code.visualstudio.com)

## Object model

Azure Blob storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following JavaScript classes to interact with these resources:

- [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [ContainerClient](/javascript/api/@azure/storage-blob/containerclient): The `ContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/javascript/api/@azure/storage-blob/blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

## Create the Node.js project

Create a JavaScript application named *blob-quickstart-v12*.

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir blob-quickstart-v12
    ```

1. Switch to the newly created *blob-quickstart-v12* directory.

    ```console
    cd blob-quickstart-v12
    ```

1. Create a *package.json*. 

    ```console
    npm init -y
    ```

1. Open the project in Visual Studio Code:

    ```console
    code .
    ```

## Install the npm package for blob storage

1. Install the Azure Storage npm package:

    ```console
    npm install @azure/storage-blob
    ```
    
1. Install other dependencies used in this quickstart:

    ```console
    npm install uuid dotenv
    ```

## Create JavaScript file

From the project directory:

1. Create a new file named `index.js`.
1. Copy the following code into the file. More code will be added as you go through this quickstart.

    ```javascript
    const { BlobServiceClient } = require('@azure/storage-blob');
    const { v1: uuidv1} = require('uuid');
    require('dotenv').config()
    
    async function main() {
        console.log('Azure Blob storage v12 - JavaScript quickstart sample');

        // Quick start code goes here

    }

    main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));
    ```

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Get the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `main` function:

:::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_StorageAcctInfo":::

## Create a container

1. Decide on a name for the new container.  Container names must be lowercase. 

    For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

1. Add this code to the end of the `main` function:

    :::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_CreateContainer":::

    The preceding code creates an instance of the [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) class by calling the [fromConnectionString](/javascript/api/@azure/storage-blob/blobserviceclient#fromconnectionstring-string--storagepipelineoptions-) method. Then, call the [getContainerClient](/javascript/api/@azure/storage-blob/blobserviceclient#getcontainerclient-string-) method to get a reference to a container. Finally, call [create](/javascript/api/@azure/storage-blob/containerclient#create-containercreateoptions-) to actually create the container in your storage account.

## Upload blobs to a container

Copy the following code to the end of the `main` function to upload a text string to a blob:

:::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_UploadBlobs":::

The preceding code gets a reference to a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object by calling the [getBlockBlobClient](/javascript/api/@azure/storage-blob/containerclient#getblockblobclient-string-) method on the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) from the [Create a container](#create-a-container) section.
The code uploads the text string data to the blob by calling the [upload](/javascript/api/@azure/storage-blob/blockblobclient#upload-httprequestbody--number--blockblobuploadoptions-) method.

## List the blobs in a container

Add the following code to the end of the `main` function to list the blobs in the container. 

:::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_ListBlobs":::

The preceding code calls the [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listblobsflat-containerlistblobsoptions-) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

## Download blobs

1. Add the following code to the end of the `main` function to download the previously created blob into the app runtime.

    :::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_DownloadBlobs":::

    The preceding code calls the [download](/javascript/api/@azure/storage-blob/blockblobclient#download-undefined---number--undefined---number--blobdownloadoptions-) method. 

2. Copy the following code *after* the `main` function to convert a stream back into a string.

    :::code language="javascript" source="~/azure_storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_ConvertStreamToText":::

## Delete a container

Add this code to the end of the `main` function to delete the container and all its blobs:

:::code language="javascript" source="~/azure_storage-snippets//blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_DeleteContainer":::

The preceding code cleans up the resources the app created by removing the entire container using the [​delete](/javascript/api/@azure/storage-blob/containerclient#delete-containerdeletemethodoptions-) method. You can also delete the local files, if you like.

## Run the code

1. From a Visual Studio Code terminal, run the app.

    ```console
    node index.js
    ```

2. The output of the app is similar to the following example:

    ```output
    Azure Blob storage v12 - JavaScript quickstart sample
    
    Creating container...
             quickstart4a0780c0-fb72-11e9-b7b9-b387d3c488da
    
    Uploading to Azure Storage as blob:
             quickstart4a3128d0-fb72-11e9-b7b9-b387d3c488da.txt
    
    Listing blobs...
             quickstart4a3128d0-fb72-11e9-b7b9-b387d3c488da.txt
    
    Downloaded blob content...
             Hello, World!
    
    Deleting container...
    Done
    ```

Step through the code in your debugger and check your [Azure portal](https://portal.azure.com) throughout the process. Check to see that the container is being created. You can open the blob inside the container and view the contents.

## Use the storage emulator

This quickstart created a container and blob on the Azure cloud. You can also use the Azure Blob storage npm package to create these resources locally on the [Azure Storage emulator](../common/storage-use-emulator.md) for development and testing. 

## Clean up 

1. When you're done with this quickstart, delete the `blob-quickstart-v12` directory.
1. If you're done using your Azure Storage resource, use the [Azure CLI to remove the Storage resource](storage-quickstart-blobs-cli.md#clean-up-resources). 

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using JavaScript.

For tutorials, samples, quickstarts, and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for JavaScript developer center](/azure/developer/javascript/)

- To learn how to deploy a web app that uses Azure Blob storage, see [Tutorial: Upload image data in the cloud with Azure Storage](./storage-upload-process-images.md?preserve-view=true&tabs=javascript)
- To see Blob storage sample apps, continue to [Azure Blob storage package library v12 JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob/samples).
- To learn more, see the [Azure Blob storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob).