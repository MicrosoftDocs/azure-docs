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

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-node-quickstart.git)  used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/storage-blobs-node-quickstart.git
```

This command clones the repository to your local git folder. To open the application look for the storage-blobs-node-quickstart folder, open it, and double-click on index.js.

## Configure your storage connection string

In the application, you must provide the connection string for your storage account. Open the `index.js` file, find the `connectionString` variable. Replace its value with the entire value of the connection string with the one you saved from the Azure portal. Your storage connection string should look similar to the following:

```javascript
// Create a blob client for interacting with the blob service from connection string
// How to create a storage connection string - http://msdn.microsoft.com/library/azure/ee758697.aspx
var connectionString = '<Your connection string here>';
var blobService = storage.createBlobService(connectionString);
```

## Install required packages

In the application directory run `npm install` to install any required packages listed in the `package.json` file.

```javascript
npm install
```

## Run the sample

This sample creates a test file in My Documents, uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files.

Run the sample by typing `node index.js`. The following output is from a Windows system.  A similar output with appropriate file paths can be expected if using Linux.

```
Azure Storage Node.js Client Library Blobs Quick Start

1. Creating a container with public access: quickstartcontainer-79a3eea0-bec9-11e7-9a36-614cd00ca63d

2. Creating a file in ~/Documents folder to test the upload and download

   Local File: C:\Users\admin\Documents\HelloWorld-79a3c790-bec9-11e7-9a36-614cd00ca63d.txt

3. Uploading BlockBlob: quickstartblob-HelloWorld-79a3c790-bec9-11e7-9a36-614cd00ca63d.txt

   Uploaded Blob URL: https://mystorageaccount.blob.core.windows.net/quickstartcontainer-79a3eea0-bec9-11e7-9a36-614cd00ca63d/quickstartblob-HelloWorld-79a3c790-bec9-11e7-9a36-614cd00ca63d.txt

4. Listing blobs in container

   - quickstartblob-HelloWorld-79a3c790-bec9-11e7-9a36-614cd00ca63d.txt (type: BlockBlob)


5. Downloading blob

   Downloaded File: C:\Users\admin\Documents\HelloWorld-79a3c790-bec9-11e7-9a36-614cd00ca63d_DOWNLOADED.txt

Sample finished running. When you hit <ENTER> key, the temporary files will be deleted and the sample application will exit.
```

Before you continue, check MyDocuments for the two files. You can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the index.js file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects

The first thing to do is create the reference to the `BlobService` used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Create an instance of the **[BlobService](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService__ctor)** object, which points to the Blob service in your storage account.

* Create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container starts with **quickstartcontainer-**.

This example uses [createContainerCreateIfNotExists](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_createContainerIfNotExists) because we want to create a new container each time the sample is run. In a production environment where you use the same container throughout an application, it's better practice to only call CreateIfNotExists once. Alternatively, you can create the container ahead of time so you don't need to create it in the code.

```javascript
// Create a container for organizing blobs within the storage account.
console.log('1. Creating a Container with Public Access:', blockBlobContainerName, '\n');
blobService.createContainerIfNotExists(blockBlobContainerName, { 'publicAccessLevel': 'blob' }, function (error) {
    if (error) return callback(error);
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used. They are ideal for storing text and binary data, which is the reason they are used in this quickstart.

To upload a file to a blob, you use the [createBlockBlobFromLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromLocalFile) method. This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **localPath** and the name of the blob in **localFileToUpload**. The following example uploads the file to your container that start with **quickstartcontainer-**.

```javascript
console.log('2. Creating a file in ~/Documents folder to test the upload and download\n');
console.log('   Local File:', LOCAL_FILE_PATH, '\n');
fs.writeFileSync(LOCAL_FILE_PATH, 'Greetings from Microsoft!');

console.log('3. Uploading BlockBlob:', BLOCK_BLOB_NAME, '\n');
blobService.createBlockBlobFromLocalFile(CONTAINER_NAME, BLOCK_BLOB_NAME, LOCAL_FILE_PATH, function (error) {
handleError(error);
console.log('   Uploaded Blob URL:', blobService.getUrl(CONTAINER_NAME, BLOCK_BLOB_NAME), '\n');
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the [createBlockBlobFromStream](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromStream) method rather than [createBlockBlobFromLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_createBlockBlobFromLocalFile).

### List the blobs in a container

Next, the application gets a list of files in the container using [listBlobsSegmented](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_listBlobsSegmented). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

If you have 5,000 or fewer blobs in the container, all of the blob names are retrieved in one call to [listBlobsSegmented](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_listBlobsSegmented). If you have more than 5,000 blobs in the container, the service retrieves the list in sets of 5,000 until all of the blob names have been retrieved. So the first time this API is called, it returns the first 5,000 blob names and a continuation token. The second time, you provide the token, and the service retrieves the next set of blob names, and so on, until the continuation token is null, which indicates that all of the blob names have been retrieved.

```javascript
console.log('4. Listing blobs in container\n');
blobService.listBlobsSegmented(CONTAINER_NAME, null, function (error, data) {
    handleError(error);

    for (var i = 0; i < data.entries.length; i++) {
    console.log(util.format('   - %s (type: %s)'), data.entries[i].name, data.entries[i].blobType);
    }
    console.log('\n');
```

### Download blobs

Download blobs to your local disk using [getBlobToLocalFile](/nodejs/api/azure-storage/blobservice?view=azure-node-2.2.0#azure_storage_BlobService_getBlobToLocalFile).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```javascript
console.log('5. Downloading blob\n');
blobService.getBlobToLocalFile(CONTAINER_NAME, BLOCK_BLOB_NAME, DOWNLOADED_FILE_PATH, function (error) {
handleError(error);
console.log('   Downloaded File:', DOWNLOADED_FILE_PATH, '\n');
```

### Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [deleteBlobIfExists](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_deleteBlobIfExists) and [deleteContainerIfExists](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_deleteContainerIfExists). Also delete the files created if they are no longer needed. This is taken care of in the application when you press enter to exit the application.

```javascript
console.log('6. Deleting block Blob\n');
    blobService.deleteBlobIfExists(CONTAINER_NAME, BLOCK_BLOB_NAME, function (error) {
        handleError(error);

    console.log('7. Deleting container\n');
    blobService.deleteContainerIfExists(CONTAINER_NAME, function (error) {
        handleError(error);
            
        fs.unlinkSync(LOCAL_FILE_PATH);
        fs.unlinkSync(DOWNLOADED_FILE_PATH);
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Node.js. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-nodejs-how-to-use-blob-storage.md)

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
