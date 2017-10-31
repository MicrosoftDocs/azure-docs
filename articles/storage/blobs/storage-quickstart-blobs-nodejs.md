---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using Node.js| Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using Node.js
services: storage
documentationcenter: storage
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 10/30/2017
ms.author: gwallace
---

# Transfer objects to/from Azure Blob storage using Node.js

In this quickstart, you learn how to use Node.js to upload, download, and list block blobs in a container in Azure Blob storage.

## Prerequisites

To complete this quickstart:

* Install [Node.js](https://nodejs.org/en/)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a storage account using the Azure portal

First, create a new general-purpose storage account to use for this quickstart. 

1. Go to the [Azure portal](https://portal.azure.com) and log in using your Azure account. 
2. On the Hub menu, select **New** > **Storage** > **Storage account - blob, file, table, queue**. 
3. Enter a name for your storage account. The name must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. It must also be unique.
4. Set `Deployment model` to **Resource Manager**.
5. Set `Account kind` to **General purpose**.
6. Set `Performance` to **Standard**. 
7. Set `Replication` to **Locally Redundant storage (LRS)**.
8. Set `Storage service encryption` to **Disabled**.
9. Set `Secure transfer required` to **Disabled**.
10. Select your subscription. 
11. For `resource group`, create a new one and give it a unique name. 
12. Select the `Location` to use for your storage account.
13. Check **Pin to dashboard** and click **Create** to create your storage account. 

After your storage account is created, it is pinned to the dashboard. Click on it to open it. Under SETTINGS, click **Access keys**. Select a key and copy the CONNECTION STRING to the clipboard, then paste it into a text editor for later use.

## Download the sample application

The sample application used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-node-quickstart.git
```

This command clones the repository to your local git folder. To open the application look for the storage-blobs-node-quickstart folder, open it, and double-click on index.js.

## Configure your storage connection string

In the application, you must provide the connection string for your storage account. Open the `index.js` file, find the `connectionString` variable. Replace `AzureStorageConnectionString` with the entire value of the connection string with the one you saved from the Azure portal. Your storageConnectionString should look similar to the following:

```node
// Create a blob client for interacting with the blob service from connection string
// How to create a storage connection string - http://msdn.microsoft.com/library/azure/ee758697.aspx
var connectionString = '<connectionStringHere>';
var blobService = storage.createBlobService(connectionString);
```

## Install required packages

In the application directory run `npm install` to install any required packages listed in the `package.json` file.

```node
npm install
```

## Run the sample

This sample creates a test file in My Documents, uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files.

Run the sample by typing `node index.js`. It shows output in a console window that is similar to the example:

```
Azure Storage Node.js Client Library Blobs Quick Start

1. Creating a Container with Public Access: quickstartblobs-89d2ca50-bd91-11e7-9bf8-e1c25be7cd46

2. Creating a file in Documents to test the upload and download

Local File: C:\Users\administrator\Documents\HelloWorld-89d2ca51-bd91-11e7-9bf8-e1c25be7cd46.txt

3. Uploading BlockBlob:  demoblockblob-HelloWorld-89d2ca51-bd91-11e7-9bf8-e1c25be7cd46.txt

Uploaded blob URL: https://mystorageaccount.blob.core.windows.net/quickstartblobs-89d2ca50-bd91-11e7-9bf8-e1c25be7cd46/demoblockblob-HelloWorld-89d2ca51-bd91-11e7-9bf8-e1c25be7cd46.txt

4. Listing Blobs in Container

   Completed listing. There is(are) 1 blob(s).
   - demoblockblob-HelloWorld-89d2ca51-bd91-11e7-9bf8-e1c25be7cd46.txt (type: BlockBlob)


5. Downloading Blob

Downloaded File: C:\Users\administrator\Documents\HelloWorld-89d2ca51-bd91-11e7-9bf8-e1c25be7cd46_DOWNLOADED.txt

6. Creating a read-only snapshot of the blob

snapshotId: 2017-10-30T16:44:07.0522028Z

Sample finished running. When you hit <ENTER> key, the temporary files will be deleted and the sample application will exit.


7. Deleting block Blob and all of its snapshots

8. Deleting Container

Press <ENTER> key to exit.
```

Before you continue, check MyDocuments for the two files. You can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the index.js file to look at the code. 

## Get references to the storage objects

The first thing to do is create the reference to the `BlobService` used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Create an instance of the **[BlobService](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService__ctor)** object, which points to the Blob service in your storage account. 

In this section, you create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container is called **quickstartblobs**.

This example uses CreateIfNotExists because we want to create a new container each time the sample is run. In a production environment where you use the same container throughout an application, it's better practice to only call CreateIfNotExists once. Alternatively, you can create the container ahead of time so you don't need to create it in the code.

```node
// Create a container for organizing blobs within the storage account.
console.log('1. Creating a Container with Public Access:', blockBlobContainerName, '\n');
blobService.createContainerIfNotExists(blockBlobContainerName, { 'publicAccessLevel': 'blob' }, function (error) {
    if (error) return callback(error);
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart.

To upload a file to a blob, you use the[createBlockBlobFromLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromLocalFile) method. This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **localPath** and the name of the blob in **localFileToUpload**. The following example uploads the file to your container called **quickstartblobs**.

```node
// Create a file in ~/Documents to test the upload and download
console.log('2. Creating a file in Documents to test the upload and download\n');
var localPath = path.join(DOCUMENT_FOLDER, localFileToUpload);

console.log('Local File:', localPath, '\n');
fs.writeFileSync(localPath, 'Greetings from Microsoft!');

// Upload a BlockBlob to the newly created container
console.log('3. Uploading BlockBlob: ', blockBlobName, '\n');
blobService.createBlockBlobFromLocalFile(blockBlobContainerName, blockBlobName, localPath, function (error) {
    if (error) return callback(error);
    console.log('Uploaded blob URL:', blobService.getUrl(blockBlobContainerName, blockBlobName), '\n');

```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the [createBlockBlobFromStream](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromStream) method rather than [createBlockBlobFromLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromLocalFile).

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

## List the blobs in a container

Get a list of files in the container using [listBlobsSegmented](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_listBlobsSegmented). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

If you have 5,000 or fewer blobs in the container, all of the blob names are retrieved in one call to [listBlobsSegmented](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_listBlobsSegmented). If you have more than 5,000 blobs in the container, the service retrieves the list in sets of 5,000 until all of the blob names have been retrieved. So the first time this API is called, it returns the first 5,000 blob names and a continuation token. The second time, you provide the token, and the service retrieves the next set of blob names, and so on, until the continuation token is null, which indicates that all of the blob names have been retrieved.

```node
console.log('4. Listing Blobs in Container\n');
listBlobs(blobService, blockBlobContainerName, null, null, null, function (error, results) {
    if (error) return callback(error);

    for (var i = 0; i < results.length; i++) {
        console.log(util.format('   - %s (type: %s)'), results[i].name, results[i].blobType);
    }
    console.log('\n');

function listBlobs(blobService, container, token, options, blobs, callback) {
    blobs = blobs || [];

    blobService.listBlobsSegmented(container, token, options, function (error, result) {
        if (error) return callback(error);

        blobs.push.apply(blobs, result.entries);
        var token = result.continuationToken;
        if (token) {
            console.log('   Received a segment of results. There are(is) ' + result.entries.length + ' blob(s) on this segment.');
            listBlobs(blobService, container, token, options, blobs, callback);
        } else {
            console.log('   Completed listing. There is(are) ' + blobs.length + ' blob(s).');
            callback(null, blobs);
        }
    });
}
```

## Download blobs

Download blobs to your local disk using [getBlobToLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_getBlobToLocalFile).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```node
// Download a blob to your file system
console.log('5. Downloading Blob\n');

var downloadPath = path.join(DOCUMENT_FOLDER, downloadedFileName);
console.log('Downloaded File:', downloadPath, '\n');

blobService.getBlobToLocalFile(blockBlobContainerName, blockBlobName, downloadPath, function (error) {
    if (error) return callback(error);
```

## Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [deleteBlob](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_deleteBlob). Also delete the files created if they are no longer needed.

```node
// Clean up after the demo. Deleting blobs are not necessary if you also delete the container. The code below simply shows how to do that.
console.log('7. Deleting block Blob and all of its snapshots\n');
var deleteOption = { deleteSnapshots: storage.BlobUtilities.SnapshotDeleteOptions.BLOB_AND_SNAPSHOTS };
blobService.deleteBlob(blockBlobContainerName, blockBlobName, deleteOption, function (error) {
    try { fs.unlinkSync(downloadedImageName); } catch (e) { }
    if (error) return callback(error);

    // Delete the container
    console.log('8. Deleting Container\n');
    blobService.deleteContainerIfExists(blockBlobContainerName, function (error) {
        if (error) return callback(error);

        // Delete local files
        fs.unlinkSync(localPath);
        fs.unlinkSync(downloadPath);

        console.log('Press <ENTER> key to exit.');
        process.stdin.end();
    });
});
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Node.js. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-nodejs-how-to-use-blob-storage.md)

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
