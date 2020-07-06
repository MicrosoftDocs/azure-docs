---
title: "Quickstart: Azure Blob storage library v12 - JavaScript in a browser"
description: In this quickstart, you learn how to use the Azure Blob storage client library version 12 for JavaScript in a browser. You create a container and an object in Blob storage. Next, you learn how to list all of the blobs in a container. Finally, you learn how to delete blobs and delete a container.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 04/18/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

<!-- Customer intent: As a web application developer I want to interface with Azure Blob storage entirely on the client so that I can build a SPA application that is able to upload and delete files on blob storage. -->

# Quickstart: Manage blobs with JavaScript v12 SDK in a browser

Azure Blob storage is optimized for storing large amounts of unstructured data. Blobs are objects that can hold text or binary data, including images, documents, streaming media, and archive data. In this quickstart, you learn to manage blobs by using JavaScript in a browser. You'll upload and list blobs, and you'll create and delete containers.

[API reference documentation](/javascript/api/@azure/storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob) | [Package (npm)](https://www.npmjs.com/package/@azure/storage-blob) | [Samples](https://docs.microsoft.com/azure/storage/common/storage-samples-javascript?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)

> [!NOTE]
> To get started with the previous SDK version, see [Quickstart: Manage blobs with JavaScript v10 SDK in Node.js](storage-quickstart-blobs-nodejs-legacy.md).

## Prerequisites

* [An Azure account with an active subscription](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* [An Azure Storage account](../common/storage-account-create.md)
* [Node.js](https://nodejs.org)
* [Microsoft Visual Studio Code](https://code.visualstudio.com)
* A Visual Studio Code extension for browser debugging, such as:
    * [Debugger for Microsoft Edge](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-edge)
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
    * [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug)


[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Object model

Blob storage offers three types of resources:

* The storage account
* A container in the storage account
* A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

In this quickstart, you'll use the following JavaScript classes to interact with these resources:

* [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
* [ContainerClient](/javascript/api/@azure/storage-blob/containerclient): The `ContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
* [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient): The `BlockBlobClient` class allows you to manipulate Azure Storage blobs.

## Setting up

This section walks you through preparing a project to work with the Azure Blob storage client library v12 for JavaScript.

### Create a CORS rule

Before your web application can access blob storage from the client, you must configure your account to enable [cross-origin resource sharing](https://docs.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services), or CORS.

In the Azure portal, select your storage account. To define a new CORS rule, navigate to the **Settings** section and select **CORS**. For this quickstart, you create an open CORS rule:

![Azure Blob Storage Account CORS settings](media/quickstart-blobs-javascript-browser/azure-blob-storage-cors-settings.png)

The following table describes each CORS setting and explains the values used to define the rule.

|Setting  |Value  | Description |
|---------|---------|---------|
| **ALLOWED ORIGINS** | **\*** | Accepts a comma-delimited list of domains set as acceptable origins. Setting the value to `*` allows all domains access to the storage account. |
| **ALLOWED METHODS** | **DELETE**, **GET**, **HEAD**, **MERGE**, **POST**, **OPTIONS**, and **PUT** | Lists the HTTP verbs allowed to execute against the storage account. For the purposes of this quickstart, select all available options. |
| **ALLOWED HEADERS** | **\*** | Defines a list of request headers (including prefixed headers) allowed by the storage account. Setting the value to `*` allows all headers access. |
| **EXPOSED HEADERS** | **\*** | Lists the allowed response headers by the account. Setting the value to `*` allows the account to send any header. |
| **MAX AGE** | **86400** | The maximum amount of time the browser caches the preflight OPTIONS request in seconds. A value of *86400* allows the cache to remain for a full day. |

After you fill in the fields with the values from this table, click the **Save** button.

> [!IMPORTANT]
> Ensure any settings you use in production expose the minimum amount of access necessary to your storage account to maintain secure access. The CORS settings described here are appropriate for a quickstart as it defines a lenient security policy. These settings, however, are not recommended for a real-world context.

### Create a shared access signature

The shared access signature (SAS) is used by code running in the browser to authorize Azure Blob storage requests. By using the SAS, the client can authorize access to storage resources without the account access key or connection string. For more information on SAS, see [Using shared access signatures (SAS)](../common/storage-sas-overview.md).

Follow these steps to get the Blob service SAS URL:

1. In the Azure portal, select your storage account.
2. Navigate to the **Settings** section and select **Shared access signature**.
3. Scroll down and click the **Generate SAS and connection string** button.
4. Scroll down further and locate the **Blob service SAS URL** field
5. Click the **Copy to clipboard** button at the far-right end of the **Blob service SAS URL** field.
6. Save the copied URL somewhere for use in an upcoming step.

### Add the Azure Blob storage client library

On your local computer, create a new folder called *azure-blobs-js-browser* and open it in Visual Studio Code.

Select **View > Terminal** to open a console window inside Visual Studio Code. Run the following Node.js Package Manager (npm) command in the terminal window to create a [package.json](https://docs.npmjs.com/files/package.json) file.

```console
npm init -y
```

The Azure SDK is composed of many separate packages. You can choose which packages you need based on the services you intend to use. Run following `npm` command in the terminal window to install the `@azure/storage-blob` package.

```console
npm install --save @azure/storage-blob
```

#### Bundle the Azure Blob storage client library

To use Azure SDK libraries on a website, convert your code to work inside the browser. You do this using a tool called a bundler. Bundling takes JavaScript code written using [Node.js](https://nodejs.org) conventions and converts it into a format that's understood by browsers. This quickstart article uses the [Parcel](https://parceljs.org/) bundler.

Install Parcel by running the following `npm` command in the terminal window:

```console
npm install -g parcel-bundler
```

In Visual Studio Code, open the *package.json* file and add a `browserlist` between the `license` and `dependencies` entries. This `browserlist` targets the latest version of three popular browsers. The full *package.json* file should now look like this:

:::code language="json" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/package.json" highlight="12-16":::

Save the *package.json* file.

### Import the Azure Blob storage client library

To use Azure SDK libraries inside JavaScript, import the `@azure/storage-blob` package. Create a new file in Visual Studio Code containing the following JavaScript code.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_ImportLibrary":::

Save the file as *index.js* in the *azure-blobs-js-browser* directory.

### Implement the HTML page

Create a new file in Visual Studio Code and add the following HTML code.

:::code language="html" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.html":::

Save the file as *index.html* in the *azure-blobs-js-browser* folder.

## Code examples

The example code shows you how to accomplish the following tasks with the Azure Blob storage client library for JavaScript:

* [Declare fields for UI elements](#declare-fields-for-ui-elements)
* [Add your storage account info](#add-your-storage-account-info)
* [Create client objects](#create-client-objects)
* [Create and delete a storage container](#create-and-delete-a-storage-container)
* [List blobs](#list-blobs)
* [Upload blobs](#upload-blobs)
* [Delete blobs](#delete-blobs)

You'll run the code after you add all the snippets to the *index.js* file.

### Declare fields for UI elements

Add the following code to the end of the *index.js* file.

:::code language="JavaScript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_DeclareVariables":::

Save the *index.js* file.

This code declares fields for each HTML element and implements a `reportStatus` function to display output.

In the following sections, add each new block of JavaScript code after the previous block.

### Add your storage account info

Add code to access your storage account. Replace the placeholder with your Blob service SAS URL that you generated earlier. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_StorageAcctInfo":::

Save the *index.js* file.

### Create client objects

Create [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) and [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) objects for interacting with the Azure Blob storage service. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_CreateClientObjects":::

Save the *index.js* file.

### Create and delete a storage container

Create and delete the storage container when you click the corresponding button on the web page. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_CreateDeleteContainer":::

Save the *index.js* file.

### List blobs

List the contents of the storage container when you click the **List files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_ListBlobs":::

Save the *index.js* file.

This code calls the [ContainerClient.listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listblobsflat-containerlistblobsoptions-) function, then uses an iterator to retrieve the name of each [BlobItem](/javascript/api/@azure/storage-blob/blobitem) returned. For each `BlobItem`, it updates the **Files** list with the [name](/javascript/api/@azure/storage-blob/blobitem#name) property value.

### Upload blobs

Upload files to the storage container when you click the **Select and upload files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_UploadBlobs":::

Save the *index.js* file.

This code connects the **Select and upload files** button to the hidden `file-input` element. The button `click` event triggers the file input `click` event and displays the file picker. After you select files and close the dialog box, the `input` event occurs and the `uploadFiles` function is called. This function creates a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) object, then calls the browser-only [uploadBrowserData](/javascript/api/@azure/storage-blob/blockblobclient#uploadbrowserdata-blob---arraybuffer---arraybufferview--blockblobparalleluploadoptions-) function for each file you selected. Each call returns a `Promise`. Each `Promise` is added to a list so that they can all be awaited together, causing the files to upload in parallel.

### Delete blobs

Delete files from the storage container when you click the **Delete selected files** button. Add the following code to the end of the *index.js* file.

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/index.js" id="snippet_DeleteBlobs":::

Save the *index.js* file.

This code calls the [ContainerClient.deleteBlob](/javascript/api/@azure/storage-blob/containerclient#deleteblob-string--blobdeleteoptions-) function to remove each file selected in the list. It then calls the `listFiles` function shown earlier to refresh the contents of the **Files** list.

## Run the code

To run the code inside the Visual Studio Code debugger, configure the *launch.json* file for your browser.

### Configure the debugger

To set up the debugger extension in Visual Studio Code:

1. Select **Run > Add Configuration**
2. Select **Edge**, **Chrome**, or **Firefox**, depending on which extension you installed in the [Prerequisites](#prerequisites) section earlier.

Adding a new configuration creates a *launch.json* file and opens it in the editor. Modify the *launch.json* file so that the `url` value is `http://localhost:1234/index.html`, as shown here:

:::code language="json" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/azure-blobs-js-browser/.vscode/launch.json" highlight="11":::

After updating, save the *launch.json* file. This configuration tells Visual Studio Code which browser to open and which URL to load.

### Launch the web server

To launch the local development web server, select **View > Terminal** to open a console window inside Visual Studio Code, then enter the following command.

```console
parcel index.html
```

Parcel bundles your code and starts a local development server for your page at `http://localhost:1234/index.html`. Changes you make to *index.js* will automatically be built and reflected on the development server whenever you save the file.

If you receive a message that says **configured port 1234 could not be used**, you can change the port by running the command `parcel -p <port#> index.html`. In the *launch.json* file, update the port in the URL path to match.

### Start debugging

Run the page in the debugger and get a feel for how blob storage works. If any errors occur, the **Status** pane on the web page will display the error message received.

To open *index.html* in the browser with the Visual Studio Code debugger attached, select **Run > Start Debugging** or press F5 in Visual Studio Code.

### Use the web app

In the [Azure portal](https://portal.azure.com), you can verify the results of the API calls as you follow the steps below.

#### Step 1 - Create a container

1. In the web app, select **Create container**. The status indicates that a container was created.
2. To verify in the Azure portal, select your storage account. Under **Blob service**, select **Containers**. Verify that the new container appears. (You may need to select **Refresh**.)

#### Step 2 - Upload a blob to the container

1. On your local computer, create and save a test file, such as *test.txt*.
2. In the web app, click **Select and upload files**.
3. Browse to your test file, and then select **Open**. The status indicates that the file was uploaded, and the file list was retrieved.
4. In the Azure portal, select the name of the new container that you created earlier. Verify that the test file appears.

#### Step 3 - Delete the blob

1. In the web app, under **Files**, select the test file.
2. Select **Delete selected files**. The status indicates that the file was deleted and that the container contains no files.
3. In the Azure portal, select **Refresh**. Verify that you see **No blobs found**.

#### Step 4 - Delete the container

1. In the web app, select **Delete container**. The status indicates that the container was deleted.
2. In the Azure portal, select the **\<account-name\> | Containers** link at the top-left of the portal pane.
3. Select **Refresh**. The new container disappears.
4. Close the web app.

### Clean up resources

Click on the **Terminal** console in Visual Studio Code and press CTRL+C to stop the web server.

To clean up the resources created during this quickstart, go to the [Azure portal](https://portal.azure.com) and delete the resource group you created in the [Prerequisites](#prerequisites) section.

## Next steps

In this quickstart, you learned how to upload, list, and delete blobs using JavaScript. You also learned how to create and delete a blob storage container.

For tutorials, samples, quickstarts, and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for JavaScript documentation](/azure/developer/javascript/)

* To learn more, see the [Azure Blob storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob).
* To see Blob storage sample apps, continue to [Azure Blob storage client library v12 JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob/samples).
