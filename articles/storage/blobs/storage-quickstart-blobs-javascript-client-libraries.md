---
title: Upload, list, and delete blobs in Azure Storage using JavaScript client libraries
description: 
services: storage
keywords: 
author: craigshoemaker
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.author: cshoe
ms.date: 03/26/2018
ms.topic: quickstart
---

<!-- 

    CUSTOMER INTENT:

    As a web application developer I want to interface with Azure Blob storage 
    entirely on the client so that I can build a SPA application that is able
    to upload and delete files on blob storage.

    OUTLINE
    - Create a blob storage account
    - Setting storage account CORS rules
    - Create a Shared Access Signature (SAS)
    - Get the client scripts
    - Add script reference to the page
    - Create a blob service
    - Create a blob container
    - Upload a blob
    - List blobs
    - Clean up resources
    - Next steps
    
-->


# Quickstart: Upload, list, and delete blobs in Azure Storage using JavaScript client libraries
<!-- TODO -->

To complete this quickstart, you need an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

Once your storage account is created, you need a few security-related values in order to create a security token. Select the storage account in the portal and open the **Settings** section. Under Settings, select **Access keys** and copy the **Storage account name** and the **Key** value under **key1** and paste them into text editor.

## Setting storage account CORS rules 
Before your web application can access a blob storage from the client, the account must be configured to enable [cross-origin resource sharing](https://docs.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services), or CORS. 

Return to the Azure portal and select your storage account. To define a new CORS rule, click **Settings > CORS** and click the **Add** button to open the **Add CORS rule** window. For this quickstart, you create an open CORS rule:

![Azure Blob Storage Account CORS settings](media/storage-quickstart-blobs-javascript-client-libraries/azure-blob-storage-cors-settings.png)

|Setting  |Value  | Description |
|---------|---------|---------|
| Allowed origins | * | Accepts a comma-delimited list of domains set as acceptable origins. Setting the value to `*` allows all domains access to the storage account. |
| Allowed verbs     | delete, get, head, merge, post, options, and put | Lists the HTTP verbs allowed to execute against the storage account. For the purposes of this quickstart, select all available options. |
| Allowed headers | * | Defines a list of request headers (including prefixed headers) allowed by the storage account. Setting the value to `*` allows all headers access. |
| Exposed headers | * | Lists the allowed response headers by the account. Setting the value to `*` allows the account to send any header.  |
| Maximum age (seconds) | 86400 | The maximum amount of time the browser caches the preflight OPTIONS request. A value of *86400* allows the cache to remain for a full day. |

The CORS settings described here are appropriate for a quickstart as it defines a lenient security policy. These settings, however, are not recommended for a real-world context. 

> [!IMPORTANT]
> Ensure any settings you use in production expose the minimum amount of access necessary to your storage account in order to maintain secure access.

Next, you use the Azure cloud shell to create a security token.

[!INCLUDE [Open the Azure cloud shell](../../../includes/cloud-shell-try-it.md)]

## Create a Shared Access Signature
A shared access signature (SAS) allows code running in the browser to connect to blob storage without having to know anything about security credentials. You can create a SAS using the Azure CLI through the Azure cloud shell. The following table describes the parameters you need to provide values for in order to generate a SAS.

| Parameter      |Description  | Placeholder |
|----------------|-------------|-------------|
| *expiry*       | The expiration date of the access token in YYYY-MM-DD format. Enter tomorrow's date for use with this quickstart. | *FUTURE_DATE* |
| *account-name* | The storage account name. Use the name set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_NAME* |
| *account-key*  | The storage account key. Use the key set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_KEY* |

The following code listing used the Azure CLI to create a SAS that you can pass to a JavaScript blob service.

> [!NOTE]
> For best results remove the exta spaces between parameters before pasting the command into the Azure cloud shell.

```bash
az storage account generate-sas
                    --permissions racwdl
                    --resource-types sco
                    --services b
                    --expiry FUTURE_DATE
                    --account-name YOUR_STORAGE_ACCOUNT_NAME
                    --account-key YOUR_STORAGE_ACCOUNT_KEY
```
You may find the series of values after each parameter a bit cryptic. These parameter values are taken from the first letter of their respective permission. The following table explains where the values come from: 

| Parameter        | Value   | Description  |
|------------------|---------|---------|
| *permissions*    | racwdl  | This SAS allows *read*, *append*, *create*, *write*, *delete*, and *list* capabilities. |
| *resource-types* | sco     | The resources affected by the SAS are *service*, *container*, and *object*. |
| *services*       | b       | The service affected by the SAS is the *blob* service. |

Now that the SAS is generated, copy the value returned in the console into a text editor for use in an upcoming step.

## Get the blob storage client scripts
Create a folder for your new project and name it *azure-blobs-javascript*. Next, [download the JavaScript client libraries](https://aka.ms/downloadazurestoragejs), extract the contents of the zip, and place the script files in a folder named *scripts*.

## Add the client script reference to the page
Add a reference to `scripts/azure-storage.blob.js` to your HTML page.

```html
<script src="scripts/azure-storage.blob.js"></script>
```

## Create a blob service 
A blob service provides an interface to Azure Blob Storage. To create an instance of the blob service you need to provide the storage account name and the SAS generated in a previous step.

```javascript
var account = {
    name: YOUR_STORAGE_ACCOUNT_NAME,
    sas:  YOUR_SAS
};

var blobUri = 'https://' + account.name + '.blob.core.windows.net';
var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);
```

## Create a blob container
With the blob service created you can now create a new container to hold an uploaded blob. The [createContainerIfNotExists](https://azure.github.io/azure-storage-node/BlobService.html#createContainerIfNotExists__anchor) method creates a new container and does not return an error if the container already exists.

```javascript
blobService.createContainerIfNotExists('mycontainer', function (error, container) {
    if (error) {
        // Handle create container error
    } else {
        console.log(container.name);
    }
});
```

## Upload a blob
To upload a blob from an HTML form, you first get reference to the selected file via the `files` array of an *INPUT* element that has the *type* set to *file*.

```html
<form>
    <input type="file" id="fileinput" name="fileinput" />
</form>
```
Then from script you can reference the HTML element and pass the selected file to the blob service.

```javascript
var file = document.getElementById('fileinput').files[0];

blobService.createBlockBlobFromBrowserFile('mycontainer', 
                                            file.name, 
                                            file, 
                                            function (error, result) {
                                                if(error) {
                                                    // Handle blob error
                                                } else {
                                                    // Upload is successful
                                                }
                                            });
```

The method [createBlockBlobFromBrowserFile](https://azure.github.io/azure-storage-node/BlobService.html#createBlockBlobFromBrowserFile__anchor) uses the browser file directly to upload to a blob container.

> [!NOTE]
> The code in this quickstart presumes you are uploading a relatively small file. See the sample for ways to allow the blob service to handle files larger than 4MB.


## List blobs
Once you have uploaded a file into the blob container, you access a list of blobs in the container using the [listBlobsSegmented](https://azure.github.io/azure-storage-node/BlobService.html#listBlobsSegmented__anchor) method.

```javascript
blobService.listBlobsSegmented('mycontainer', null, function (error, results) {
    if (error) {
        // Handle list blobs error
    } else {
        results.entries.forEach(blob => {
            console.log(blob.name);
        });
    }
});
```

## Delete blobs
You can delete the blob you just uploaded by calling [deleteBlobIfExists](https://azure.github.io/azure-storage-node/BlobService.html#deleteBlobIfExists__anchor).

```javascript
var blobName = YOUR_BLOB_NAME;
blobService.deleteBlobIfExists('mycontainer', blobName, function(error, result) {
    if (error) {
        // Handle delete blob error
    } else {
        // Blob deleted successfully
    }
});
```

In order for this code listing to work, you need to provide the name of the blob you want to delete by providing a value for `blobName`;

## Clean up resources
To clean up the resouces created during this quickstart, return to the [Azure portal](https://portal.azure.com) and select your storage account. Once selected, you can delete the storage account by going to:  **Overview > Delete storage account**.

<!-- TODO -->
## Next steps
Downloading blobs using the JavaScript client libraries requires the server to issue a SAS that is passed back to the storage API in order to enable a blob to be downloaded. 

> [!div class="nextstepaction"]
> [Using blob storage Client Libraries to download blobs](storage-blobs-download-javascript-client-libraries.md)