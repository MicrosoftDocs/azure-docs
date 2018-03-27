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

Once your storage account is created, you need a few security-related values in order to create a security token. Open the storage account and open the **Settings** section. Under Settings, select **Access keys** and copy the **Storage account name** and the **Key** value under **key1** and paste them into text editor.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

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

The CORS settings described here are appropriate for a quickstart as it defines a lienient security policy. These settings, however, are not recommended for a real-world context. 

> [!IMPORTANT]
> Ensure any settings you use in production expose the minimum amount of access to your storage account in order to maintain secure access.

Next, you use the Azure cloud shell to create a security token.

[!INCLUDE [Open the Azure cloud shell](../../../includes/cloud-shell-try-it.md)]

## Create a Shared Access Signature
<!-- TODO -->
A shared access signature (SAS) allows code running in the browser to connect to blob storage without having to have knowledge of security credentials. You can create a SAS using the Azure CLI through the Azure cloud shell. The following table describes the parameters you need to provide values for in order to generate a SAS.

| Parameter      |Description  | Placeholder |
|----------------|-------------|-------------|
| *expiry*       | The expiration date of the access token in YYYY-MM-DD format. Enter tomorrow's date for use with this quickstart. | *FUTURE_DATE* |
| *account-name* | The storage account name. Use the name set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_NAME* |
| *account-key*  | The storage account key. Use the key set aside in an earlier step. | *YOUR_STORAGE_ACCOUNT_KEY* |

The following code listing used the Azure CLI to create a SAS that you can pass to a JavaScript blob service. Copy the following code listing 

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
You may find the series of values after each parameter a bit cryptic. Parameter values are made up from the first letter of their resepective values. The following table explains the remaining parameters and their associate values. 

| Parameter        | Value   | Description  |
|------------------|---------|---------|
| *permissions*    | racwdl  | This SAS allows read, append, create, write, delete, and list capabilities. |
| *resource-types* | sco     | The resources affected by the SAS are service, container, and object. |
| *services*       | b       | The service affected by the SAS is the blob service. |




## Get the blob storage client scripts
<!-- TODO -->
The JavaScript client-side scripts are based off the Node.js implementation so you must build 

## Add the client script reference to the page
<!-- TODO -->
```html
Add a a reference to `azure-storage.blob.js` to your HTML page.

<script src="azure-storage.blob.js"></script>
```

## Create a blob service 
A blob service provides 

```javascript
var account = {
    name: YOUR_STORAGE_ACCOUNT_NAME,
    sas: YOUR_SAS
};

var blobUri = 'https://' + account.name + '.blob.core.windows.net';
var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);
```

## Create a blob container

```javascript
blobService.createContainerIfNotExists('mycontainer', function (error, result) {
    if (error) {
        // Handle create container error
    } else {
        console.log(result.name);
    }
});
```

## Upload a blob

```javascript
var file = document.getElementById('fileinput').files[0];

var maxUploadSize = 1024 * 1024 * 32; // 32MB

var blockSize = {
    large: 1024 * 1024 * 4, // 4MB
    small: 1024 * 512 // 512KB
};

var uploadBlockSize = file.size > maxUploadSize ?  blockSize.large : blockSize.small;
blobService.singleBlobPutThresholdInBytes = uploadBlockSize;

var createBlockHandler = function (error, result, response) {
    if (error) {
        // Handle blob upload error
    } else {
        // Upload is successfull
    }
};

var speedSummary = blobService.createBlockBlobFromBrowserFile('mycontainer', 
                                                                file.name, 
                                                                file, 
                                                                { blockSize : uploadBlockSize }, 
                                                                createBlockHandler);
```
## List blobs

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
## Clean up resources
Add the steps to avoid additional costs

<!-- TODO -->
## Next steps
Downloading blobs using the JavaScript client libraries requires the server to issue a SAS that is passed back to the storage API in order to enable a blob to be downloaded. 

> [!div class="nextstepaction"]
> [Using blob storage Client Libraries to download blobs](storage-blobs-download-javascript-client-libraries.md)