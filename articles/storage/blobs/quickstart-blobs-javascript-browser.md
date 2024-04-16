---
title: "Quickstart: Azure Blob storage library v12 - JS Browser"
titleSuffix: Azure Storage
description: In this quickstart, you learn how to use the Azure Blob storage npm client library version 12 for JavaScript in a browser. You create a container and an object in Blob storage. Next, you learn how to list all of the blobs in a container. Finally, you learn how to delete blobs and delete a container.
author: normesta

ms.author: normesta
ms.date: 02/25/2022
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
#Customer intent: As a web application developer I want to interface with Azure Blob storage entirely on the client so that I can build a SPA application that is able to upload and delete files on blob storage.
---

# Quickstart: Manage blobs with JavaScript v12 SDK in a browser

Azure Blob storage is optimized for storing large amounts of unstructured data. Blobs are objects that can hold text or binary data, including images, documents, streaming media, and archive data. In this quickstart, you learn to manage blobs by using JavaScript in a browser. You'll upload and list blobs, and you'll create and delete containers.

The [**example code**](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser) shows you how to accomplish the following tasks with the Azure Blob storage client library for JavaScript:

- [Declare fields for UI elements](#declare-fields-for-ui-elements)
- [Add your storage account info](#add-your-storage-account-info)
- [Create client objects](#create-client-objects)
- [Create and delete a storage container](#create-and-delete-a-storage-container)
- [List blobs](#list-blobs)
- [Upload blobs](#upload-blobs-to-a-container)
- [Delete blobs](#delete-blobs)

Additional resources:

[API reference](/javascript/api/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob) | [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](../common/storage-samples-javascript.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- [An Azure account with an active subscription](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- [An Azure Storage account](../common/storage-account-create.md)
- [Node.js LTS](https://nodejs.org/en/download/)
- [Microsoft Visual Studio Code](https://code.visualstudio.com)


## Object model

Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

In this quickstart, you'll use the following JavaScript classes to interact with these resources:

- [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [ContainerClient](/javascript/api/@azure/storage-blob/containerclient): The `ContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient): The `BlockBlobClient` class allows you to manipulate Azure Storage blobs.

## Configure storage account for browser access

To programmatically access your storage account from a web browser, you need to configure CORS access and create an SAS connection string.

### Create a CORS rule

Before your web application can access blob storage from the client, you must configure your account to enable [cross-origin resource sharing](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services), or CORS.

In the Azure portal, select your storage account. To define a new CORS rule, navigate to the **Settings** section and select **CORS**. For this quickstart, you create a fully-open CORS rule:

![Azure Blob Storage Account CORS settings](media/quickstart-blobs-javascript-browser/azure-blob-storage-cors-settings.png)

The following table describes each CORS setting and explains the values used to define the rule.

|Setting  |Value  | Description |
|---------|---------|---------|
| **ALLOWED ORIGINS** | * | Accepts a comma-delimited list of domains set as acceptable origins. Setting the value to `*` allows all domains access to the storage account. |
| **ALLOWED METHODS** | **DELETE**, **GET**, **HEAD**, **MERGE**, **POST**, **OPTIONS**, and **PUT** | Lists the HTTP verbs allowed to execute against the storage account. For the purposes of this quickstart, select all available options. |
| **ALLOWED HEADERS** | * | Defines a list of request headers (including prefixed headers) allowed by the storage account. Setting the value to `*` allows all headers access. |
| **EXPOSED HEADERS** | * | Lists the allowed response headers by the account. Setting the value to `*` allows the account to send any header. |
| **MAX AGE** | **86400** | The maximum amount of time the browser caches the preflight OPTIONS request in seconds. A value of *86400* allows the cache to remain for a full day. |

After you fill in the fields with the values from this table, select the **Save** button.

> [!IMPORTANT]
> Ensure any settings you use in production expose the minimum amount of access necessary to your storage account to maintain secure access. The CORS settings described here are appropriate for a quickstart as it defines a lenient security policy. These settings, however, are not recommended for a real-world context.

### Create a SAS connection string

The shared access signature (SAS) is used by code running in the browser to authorize Azure Blob storage requests. By using the SAS, the client can authorize access to storage resources without the account access key or connection string. For more information on SAS, see [Using shared access signatures (SAS)](../common/storage-sas-overview.md).

Follow these steps to get the Blob service SAS URL:

1. In the Azure portal, select your storage account.
1. Navigate to the **Security + networking** section and select **Shared access signature**.
1. Review the **Allowed services** to understand the SAS token will have access to all of your storage account services:
    * Blob
    * File
    * Queue
    * Table 
1. Select the **Allowed resources types** to include:
    * Service
    * Container
    * Object
1. Review the **Start and expiry date/time** to understand the SAS token has a limited lifetime by default. 
1. Scroll down and select the **Generate SAS and connection string** button.
1. Scroll down further and locate the **Blob service SAS URL** field
1. Select the **Copy to clipboard** button at the far-right end of the **Blob service SAS URL** field.
1. Save the copied URL somewhere for use in an upcoming step.

> [!NOTE]
> The SAS token returned by the portal does not include the delimiter character ('?') for the URL query string. If you are appending the SAS token to a resource URL, remember to append the delimiter character to the resource URL before appending the SAS token.

## Create the JavaScript project

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

1. In a Visual Studio Code terminal, install the Azure Storage npm package:

    ```console
    npm install @azure/storage-blob
    ```

1. Install a bundler package to bundle the files and package for the browser:

    ```console
    npm install parcel
    ```

    If you plan to use a different bundler, learn more about [bundling the Azure SDK](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Bundling.md).

## Configure browser bundling


1. In Visual Studio Code, open the *package.json* file and add a `browserlist`. This `browserlist` targets the latest version of popular browsers. The full *package.json* file should now look like this:

    :::code language="json" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/package.json" range="13-19":::

1. Add a **start** script to bundle the website:

    :::code language="json" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/package.json" range="9-11":::

## Create the HTML file

1. Create `index.html` and add the following HTML code:

    :::code language="html" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.html":::

## Create the JavaScript file

From the project directory:

1. Create a new file named `index.js`.
1. Add the Azure Storage npm package. 

    :::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" range="19":::

## Declare fields for UI elements

Add DOM elements for user interaction:

  :::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_DeclareVariables":::

  This code declares fields for each HTML element and implements a `reportStatus` function to display output.


## Add your storage account info

Add the following code at the end of the *index.js* file to access your storage account. Replace the `<placeholder>` with your Blob service SAS URL that you generated earlier. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_StorageAcctInfo":::

## Create client objects

Create [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) and [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) objects to connect to your storage account. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_CreateClientObjects":::

## Create and delete a storage container

Create and delete the storage container when you select the corresponding button on the web page. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_CreateDeleteContainer":::

## List blobs

List the contents of the storage container when you select the **List files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_ListBlobs":::

This code calls the [ContainerClient.listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listblobsflat-containerlistblobsoptions-) function, then uses an iterator to retrieve the name of each [BlobItem](/javascript/api/@azure/storage-blob/blobitem) returned. For each `BlobItem`, it updates the **Files** list with the [name](/javascript/api/@azure/storage-blob/blobitem#name) property value.

## Upload blobs to a container

Upload files to the storage container when you select the **Select and upload files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_UploadBlobs":::

This code connects the **Select and upload files** button to the hidden `file-input` element. The button `click` event triggers the file input `click` event and displays the file picker. After you select files and close the dialog box, the `input` event occurs and the `uploadFiles` function is called. This function creates a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object, then calls the browser-only [uploadBrowserData](/javascript/api/@azure/storage-blob/blockblobclient#uploadbrowserdata-blob---arraybuffer---arraybufferview--blockblobparalleluploadoptions-) function for each file you selected. Each call returns a `Promise`. Each `Promise` is added to a list so that they can all be awaited together, causing the files to upload in parallel.

## Delete blobs

Delete files from the storage container when you select the **Delete selected files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_DeleteBlobs":::

This code calls the [ContainerClient.deleteBlob](/javascript/api/@azure/storage-blob/containerclient#deleteblob-string--blobdeleteoptions-) function to remove each file selected in the list. It then calls the `listFiles` function shown earlier to refresh the contents of the **Files** list.

## Run the code

1. From a Visual Studio Code terminal, run the app.

    ```console
    npm start
    ```

    This process bundles the files and starts a web server.

1. Access the web site with a browser using the following URL:

    ```HTTP
    http://localhost:1234
    ```

## Step 1: Create a container

1. In the web app, select **Create container**. The status indicates that a container was created.
2. In the Azure portal, verify your container was created. Select your storage account. Under **Blob service**, select **Containers**. Verify that the new container appears. (You may need to select **Refresh**.)

## Step 2: Upload a blob to the container

1. On your local computer, create and save a test file, such as *test.txt*.
2. In the web app, select **Select and upload files**.
3. Browse to your test file, and then select **Open**. The status indicates that the file was uploaded, and the file list was retrieved.
4. In the Azure portal, select the name of the new container that you created earlier. Verify that the test file appears.

## Step 3: Delete the blob

1. In the web app, under **Files**, select the test file.
2. Select **Delete selected files**. The status indicates that the file was deleted and that the container contains no files.
3. In the Azure portal, select **Refresh**. Verify that you see **No blobs found**.

## Step 4: Delete the container

1. In the web app, select **Delete container**. The status indicates that the container was deleted.
2. In the Azure portal, select the **\<account-name\> | Containers** link at the top-left of the portal pane.
3. Select **Refresh**. The new container disappears.
4. Close the web app.

## Use the storage emulator

This quickstart created a container and blob on the Azure cloud. You can also use the Azure Blob storage npm package to create these resources locally on the [Azure Storage emulator](../common/storage-use-emulator.md) for development and testing. 

## Clean up resources

1. When you're done with this quickstart, delete the `blob-quickstart-v12` directory.
1. If you're done using your Azure Storage resource, remove your resource group using either method:
    * Use the [Azure CLI to remove the Storage resource](storage-quickstart-blobs-cli.md#clean-up-resources)
    * Use the [Azure portal to remove the resource](storage-quickstart-blobs-portal.md#clean-up-resources). 

## Next steps

In this quickstart, you learned how to upload, list, and delete blobs using JavaScript. You also learned how to create and delete a blob storage container.

For tutorials, samples, quickstarts, and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for JavaScript documentation](/azure/developer/javascript/)

- To learn more, see the [Azure Blob storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob).
- To see Blob storage sample apps, continue to [Azure Blob storage client library v12 JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob/samples).
