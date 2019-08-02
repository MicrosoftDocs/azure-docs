---
title: Quickstart - Create a blob in Azure Storage by using JavaScript and HTML in the browser
description: Learn to use an instance of BlobService to upload, list, and delete blobs using JavaScript in an HTML page.
services: storage
keywords: storage, javascript, html
author: KarlErickson
ms.custom: mvc
ms.service: storage
ms.author: karler
ms.reviewer: seguler
ms.date: 05/20/2019
ms.topic: quickstart
ms.subservice: blobs
---

<!-- Customer intent: As a web application developer I want to interface with Azure Blob storage entirely on the client so that I can build a SPA application that is able to upload and delete files on blob storage. -->

# Quickstart: Upload, list, and delete blobs using Azure Storage v10 SDK for JavaScript/HTML in the browser

In this quickstart, you'll learn to use the [Azure Storage SDK V10 for JavaScript - Blob](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-blob#readme) library to manage blobs from JavaScript code running entirely in the browser. The approach used here shows how to use required security measures to ensure protected access to your blob storage account.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

The Azure Storage JavaScript client libraries won't work directly from the file system and must be served from a web server. This topic uses [Node.js](https://nodejs.org) to launch a basic server. If you prefer not to install Node, you can use any other means of running a local web server.

To follow the steps on debugging, you'll need [Visual Studio Code](https://code.visualstudio.com) and either the [Debugger for Chrome](vscode:extension/msjsdiag.debugger-for-chrome) or [Debugger for Microsoft Edge](vscode:extension/msjsdiag.debugger-for-edge) extension.

## Setting up storage account CORS rules

Before your web application can access a blob storage from the client, you must configure your account to enable [cross-origin resource sharing](https://docs.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services), or CORS.

Return to the Azure portal and select your storage account. To define a new CORS rule, navigate to the **Settings** section and click on the **CORS** link. Next, click the **Add** button to open the **Add CORS rule** window. For this quickstart, you create an open CORS rule:

![Azure Blob Storage Account CORS settings](media/storage-quickstart-blobs-javascript-client-libraries/azure-blob-storage-cors-settings.png)

The following table describes each CORS setting and explains the values used to define the rule.

|Setting  |Value  | Description |
|---------|---------|---------|
| Allowed origins | * | Accepts a comma-delimited list of domains set as acceptable origins. Setting the value to `*` allows all domains access to the storage account. |
| Allowed verbs     | delete, get, head, merge, post, options, and put | Lists the HTTP verbs allowed to execute against the storage account. For the purposes of this quickstart, select all available options. |
| Allowed headers | * | Defines a list of request headers (including prefixed headers) allowed by the storage account. Setting the value to `*` allows all headers access. |
| Exposed headers | * | Lists the allowed response headers by the account. Setting the value to `*` allows the account to send any header.  |
| Maximum age (seconds) | 86400 | The maximum amount of time the browser caches the preflight OPTIONS request. A value of *86400* allows the cache to remain for a full day. |

> [!IMPORTANT]
> Ensure any settings you use in production expose the minimum amount of access necessary to your storage account to maintain secure access. The CORS settings described here are appropriate for a quickstart as it defines a lenient security policy. These settings, however, are not recommended for a real-world context.

Next, you use the Azure cloud shell to create a security token.

[!INCLUDE [Open the Azure cloud shell](../../../includes/cloud-shell-try-it.md)]

## Create a shared access signature

The shared access signature (SAS) is used by the code running in the browser to authorize requests to Blob storage. By using the SAS, the client can authorize access to storage resources without the account access key or connection string. For more information on SAS, see [Using shared access signatures (SAS)](../common/storage-dotnet-shared-access-signature-part-1.md).

You can create a SAS using the Azure CLI through the Azure cloud shell, or with the Azure portal or Azure Storage Explorer. The following table describes the parameters you need to provide values for to generate a SAS with the CLI.

| Parameter      |Description  | Placeholder |
|----------------|-------------|-------------|
| *expiry*       | The expiration date of the access token in YYYY-MM-DD format. Enter tomorrow's date for use with this quickstart. | *FUTURE_DATE* |
| *account-name* | The storage account name. Use the name set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_NAME* |
| *account-key*  | The storage account key. Use the key set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_KEY* |

Use the following CLI command, with actual values for each placeholder, to generate a SAS that you can use in your JavaScript code.

```azurecli-interactive
az storage account generate-sas \
  --permissions racwdl \
  --resource-types sco \
  --services b \
  --expiry FUTURE_DATE \
  --account-name YOUR_STORAGE_ACCOUNT_NAME \
  --account-key YOUR_STORAGE_ACCOUNT_KEY
```

You may find the series of values after each parameter a bit cryptic. These parameter values are taken from the first letter of their respective permission. The following table explains where the values come from:

| Parameter        | Value   | Description  |
|------------------|---------|---------|
| *permissions*    | racwdl  | This SAS allows *read*, *append*, *create*, *write*, *delete*, and *list* capabilities. |
| *resource-types* | sco     | The resources affected by the SAS are *service*, *container*, and *object*. |
| *services*       | b       | The service affected by the SAS is the *blob* service. |

Now that the SAS is generated, copy the return value and save it somewhere for use in an upcoming step. If you generated your SAS using a method other than the Azure CLI, you will need to remove the initial `?` if it is present. This character is a URL separator that is already provided in the URL template later in this topic where the SAS is used.

> [!IMPORTANT]
> In production, always pass SAS tokens using SSL. Also, SAS tokens should be generated on the server and sent to the HTML page in order pass back to Azure Blob Storage. One approach you may consider is to use a serverless function to generate SAS tokens. The Azure Portal includes function templates that feature the ability to generate a SAS with a JavaScript function.

## Implement the HTML page

In this section, you'll create a basic web page and configure VS Code to launch and debug the page. Before you can launch, however, you'll need to use Node.js to start a local web server and serve the page when your browser requests it. Next, you'll add JavaScript code to call various blob storage APIs and display the results in the page. You can also see the results of these calls in the [Azure portal](https://portal.azure.com), [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer), and the [Azure Storage extension](vscode:extension/ms-azuretools.vscode-azurestorage) for VS Code.

### Set up the web application

First, create a new folder named *azure-blobs-javascript* and open it in VS Code. Then create a new file in VS Code, add the following HTML, and save it as *index.html* in the *azure-blobs-javascript* folder.

```html
<!DOCTYPE html>
<html>

<body>
    <button id="create-container-button">Create container</button>
    <button id="delete-container-button">Delete container</button>
    <button id="select-button">Select and upload files</button>
    <input type="file" id="file-input" multiple style="display: none;" />
    <button id="list-button">List files</button>
    <button id="delete-button">Delete selected files</button>
    <p><b>Status:</b></p>
    <p id="status" style="height:160px; width: 593px; overflow: scroll;" />
    <p><b>Files:</b></p>
    <select id="file-list" multiple style="height:222px; width: 593px; overflow: scroll;" />
</body>

<!-- You'll add code here later in this quickstart. -->

</html>
```

### Configure the debugger

To set up the debugger extension in VS Code, select **Debug > Add Configuration...**, then select **Chrome** or **Edge**, depending on which extension you installed in the Prerequisites section earlier. This action creates a *launch.json* file and opens it in the editor.

Next, modify the *launch.json* file so that the `url` value includes `/index.html` as shown:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080/index.html",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

This configuration tells VS Code which browser to launch and which URL to load.

### Launch the web server

To launch the local Node.js web server, select **View > Terminal** to open a console window inside VS Code, then enter the following command.

```console
npx http-server
```

This command will install the *http-server* package and launch the server, making the current folder available through default URLs including the one indicated in the previous step.

### Start debugging

To launch *index.html* in the browser with the VS Code debugger attached, select **Debug > Start Debugging** or press F5 in VS Code.

The UI displayed doesn't do anything yet, but you'll add JavaScript code in the following section to implement each function shown. You can then set breakpoints and interact with the debugger when it's paused on your code.

When you make changes to *index.html*, be sure to reload the page to see the changes in the browser. In VS Code, you can also select **Debug > Restart Debugging** or press CTRL + SHIFT + F5.

### Add the blob storage client library

To enable calls to the blob storage API, first [Download the Azure Storage SDK for JavaScript - Blob client library](https://aka.ms/downloadazurestoragejsblob), extract the contents of the zip, and place the *azure-storage.blob.js* file in the *azure-blobs-javascript* folder.

Next, paste the following HTML into *index.html* after the `</body>` closing tag, replacing the placeholder comment.

```html
<script src="azure-storage.blob.js" charset="utf-8"></script>

<script>
// You'll add code here in the following sections.
</script>
```

This code adds a reference to the script file and provides a place for your own JavaScript code. For the purposes of this quickstart, we're using the *azure-storage.blob.js* script file so that you can open it in VS Code, read its contents, and set breakpoints. In production, you should use the more compact *azure-storage.blob.min.js* file that is also provided in the zip file.

You can find out more about each blob storage function in the [reference documentation](https://docs.microsoft.com/javascript/api/%40azure/storage-blob/index). Note that some of the functions in the SDK are only available in Node.js or only available in the browser.

The code in *azure-storage.blob.js* exports a global variable called `azblob`, which you'll use in your JavaScript code to access the blob storage APIs.

### Add the initial JavaScript code

Next, paste the following code into the `<script>` element shown in the previous code block, replacing the placeholder comment.

```javascript
const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}
```

This code creates fields for each HTML element that the following code will use, and implements a `reportStatus` function to display output.

In the following sections, add each new block of JavaScript code after the previous block.

### Add your storage account info

Next, add code to access your storage account, replacing the placeholders with your account name and the SAS you generated in a previous step.

```javascript
const accountName = "<Add your storage account name>";
const sasString = "<Add the SAS you generated earlier>";
const containerName = "testcontainer";
const containerURL = new azblob.ContainerURL(
    `https://${accountName}.blob.core.windows.net/${containerName}?${sasString}`,
    azblob.StorageURL.newPipeline(new azblob.AnonymousCredential));
```

This code uses your account info and SAS to create a [ContainerURL](https://docs.microsoft.com/javascript/api/@azure/storage-blob/ContainerURL) instance, which is useful for creating and manipulating a storage container.

### Create and delete a storage container

Next, add code to create and delete the storage container when you press the corresponding button.

```javascript
const createContainer = async () => {
    try {
        reportStatus(`Creating container "${containerName}"...`);
        await containerURL.create(azblob.Aborter.none);
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.body.message);
    }
};

const deleteContainer = async () => {
    try {
        reportStatus(`Deleting container "${containerName}"...`);
        await containerURL.delete(azblob.Aborter.none);
        reportStatus(`Done.`);
    } catch (error) {
        reportStatus(error.body.message);
    }
};

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);
```

This code calls the ContainerURL [create](https://docs.microsoft.com/javascript/api/@azure/storage-blob/ContainerURL#create-aborter--icontainercreateoptions-) and [delete](https://docs.microsoft.com/javascript/api/@azure/storage-blob/ContainerURL#delete-aborter--icontainerdeletemethodoptions-) functions without using an [Aborter](https://docs.microsoft.com/javascript/api/@azure/storage-blob/aborter) instance. To keep things simple for this quickstart, this code assumes that your storage account has been created and is enabled. In production code, use an Aborter instance to add timeout functionality.

### List blobs

Next, add code to list the contents of the storage container when you press the **List files** button.

```javascript
const listFiles = async () => {
    fileList.size = 0;
    fileList.innerHTML = "";
    try {
        reportStatus("Retrieving file list...");
        let marker = undefined;
        do {
            const listBlobsResponse = await containerURL.listBlobFlatSegment(
                azblob.Aborter.none, marker);
            marker = listBlobsResponse.nextMarker;
            const items = listBlobsResponse.segment.blobItems;
            for (const blob of items) {
                fileList.size += 1;
                fileList.innerHTML += `<option>${blob.name}</option>`;
            }
        } while (marker);
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.body.message);
    }
};

listButton.addEventListener("click", listFiles);
```

This code calls the [ContainerURL.listBlobFlatSegment](https://docs.microsoft.com/javascript/api/@azure/storage-blob/ContainerURL#listblobflatsegment-aborter--string--icontainerlistblobssegmentoptions-) function in a loop to ensure that all segments are retrieved. For each segment, it loops over the list of blob items it contains and updates the **Files** list.

### Upload blobs

Next, add code to upload files to the storage container when you press the **Select and upload files** button.

```javascript
const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, file.name);
            promises.push(azblob.uploadBrowserDataToBlockBlob(
                azblob.Aborter.none, file, blockBlobURL));
        }
        await Promise.all(promises);
        reportStatus("Done.");
        listFiles();
    } catch (error) {
        reportStatus(error.body.message);
    }
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);
```

This code connects the **Select and upload files** button to the hidden `file-input` element. In this way, the button `click` event triggers the file input `click` event and displays the file picker. After you select files and close the dialog box, the `input` event occurs and the `uploadFiles` function is called. This function calls the browser-only [uploadBrowserDataToBlockBlob](https://docs.microsoft.com/javascript/api/@azure/storage-blob/#uploadbrowserdatatoblockblob-aborter--blob---arraybuffer---arraybufferview--blockbloburl--iuploadtoblockbloboptions-) function for each file you selected. Each call returns a Promise, which is added to a list so that they can all be awaited at once, causing the files to upload in parallel.

### Delete blobs

Next, add code to delete files from the storage container when you press the **Delete selected files** button.

```javascript
const deleteFiles = async () => {
    try {
        if (fileList.selectedOptions.length > 0) {
            reportStatus("Deleting files...");
            for (const option of fileList.selectedOptions) {
                const blobURL = azblob.BlobURL.fromContainerURL(containerURL, option.text);
                await blobURL.delete(azblob.Aborter.none);
            }
            reportStatus("Done.");
            listFiles();
        } else {
            reportStatus("No files selected.");
        }
    } catch (error) {
        reportStatus(error.body.message);
    }
};

deleteButton.addEventListener("click", deleteFiles);
```

This code calls the [BlobURL.delete](https://docs.microsoft.com/javascript/api/@azure/storage-blob/BlobURL#delete-aborter--iblobdeleteoptions-) function to remove  each file selected in the list. It then calls the `listFiles` function shown earlier to refresh the contents of the **Files** list.

### Run and test the web application

At this point, you can launch the page and experiment to get a feel for how blob storage works. If any errors occur (for example, when you try to list files before you've created the container), the **Status** pane will display the error message received. You can also set breakpoints in the JavaScript code to examine the values returned by the storage APIs.

## Clean up resources

To clean up the resources created during this quickstart, go to the [Azure portal](https://portal.azure.com) and delete the resource group you created in the Prerequisites section.

## Next steps

In this quickstart, you've created a simple website that accesses blob storage from browser-based JavaScript. To learn how you can host a website itself on blob storage, continue to the following tutorial:

> [!div class="nextstepaction"]
> [Host a static website on Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website-host)
