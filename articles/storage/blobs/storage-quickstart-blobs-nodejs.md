---
title: Azure Quickstart - Create a blob in object storage using Node.js | Microsoft Docs
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library for Node.js to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: craigshoemaker


ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 04/09/2018
ms.author: cshoe
---

# Quickstart: Upload, download, and list blobs using Node.js

In this quickstart, you learn how to use Node.js to upload, download, and list block blobs in a container using Azure Blob storage.

To complete this quickstart, you need an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-node-quickstart.git)  in this quickstart is a simple Node.js console application. To begin, clone the repository to your machine using the following command:

```bash
git clone https://github.com/Azure-Samples/storage-blobs-node-quickstart.git
```

To open the application, look for the *storage-blobs-node-quickstart* folder and open it in your favorite code editing environment.

[!INCLUDE [storage-copy-connection-string-portal](../../../includes/storage-copy-connection-string-portal.md)]

## Configure your storage connection string

Before running the application, you must provide the connection string for your storage account. The sample repository includes a file named *.env.example*. You can rename this file by removing the *.example* extension, which results in a file named *.env*. Inside the *.env* file, add your connection string value after the *AZURE_STORAGE_CONNECTION_STRING* key.

## Install required packages

In the application directory, run *npm install* to install the required packages for the application.

```bash
npm install
```

## Run the sample
Now that the dependencies are installed, you can run the sample by passing commands to the script. For instance, to create a blob container you run the following command:

```bash
node index.js --command createContainer
```

Commands available include:

| Command | Description |
|---------|---------|
|*createContainer* | Creates a container named *test-container* (succeeds even if container already exists) |
|*upload*          | Uploads the *example.txt* file to the *test-container* container |
|*download*        | Downloads the contents of the *example* blob to *example.downloaded.txt* |
|*delete*          | Deletes the *example* blob |
|*list*            | Lists the contents of *test-container* container to the console |


## Understanding the sample code
This code sample uses a few modules to interface with the file system and the command line. 

```javascript
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const path = require('path');
const args = require('yargs').argv;
const storage = require('azure-storage');
```

The purpose of the modules is as follows: 

- *dotenv* loads environment variables defined in a file named *.env* into the current execution context
- *path* is required in order to determine the absolute file path of the file to upload to blob storage
- *yargs* exposes a simple interface to access command-line arguments
- *azure-storage* is the [Azure Storage SDK](https://docs.microsoft.com/javascript/api/azure-storage) module for Node.js

Next, a series of variables are initialized:

```javascript
const blobService = storage.createBlobService();
const containerName = 'test-container';
const sourceFilePath = path.resolve('./example.txt');
const blobName = path.basename(sourceFilePath, path.extname(sourceFilePath));
```

The variables are set to the following values:

- *blobService* is set to a new instance of the Azure Blob service
- *containerName* is set the name of the container
- *sourceFilePath* is set to the absolute path of the file to upload
- *blobName* is created by taking the file name and removing the file extension

In the following implementation, each of the *blobService* functions is wrapped in a *Promise*, which allows access to JavaScript's *async* function and *await* operator to streamline the callback nature of the [Azure Storage API](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest). When a successful response returns for each function, the promise resolves with relevant data along with a message specific to the action.

### Create a blob container

The *createContainer* function calls [createContainerIfNotExists](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createcontainerifnotexists) and sets the appropriate access level for the blob.

```javascript
const createContainer = () => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};
```

The second parameter (*options*) for **createContainerIfNotExists** accepts a value for [publicAccessLevel](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createcontainerifnotexists). The value *blob* for *publicAccessLevel* specifies that specific blob data is exposed to the public. This setting is in contrast to *container* level access, which grants the ability to list the contents of the container.

The use of **createContainerIfNotExists** allows the application to run the *createContainer* command multiple times without returning errors when the container already exists. In a production environment, you often only call **createContainerIfNotExists** once as the same container is used throughout the application. In these cases, you can create the container ahead of time through the portal or via the Azure CLI.

### Upload a blob to the container

The *upload* function uses the [createBlockBlobFromLocalFile](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createblockblobfromlocalfile) function to upload and write or overwrite a file from the file system into blob storage. 

```javascript
const upload = () => {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Upload of '${blobName}' complete` });
            }
        });
    });
};
```
In context of the sample application, the file named *example.txt* is uploaded to a blob named *example* inside a container named *test-container*. Other approaches available to upload content into blobs include working with [text](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createblockblobfromtext) and [streams](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createblockblobfromstream).

To verify the file is uploaded to your blob storage, you can use the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to view the data in your account.

### List the blobs in a container

The *list* function calls the [listBlobsSegmented](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#listblobssegmented) method to return a list of blob metadata in a container. 

```javascript
const list = () => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Items in container '${containerName}':`, data: data });
            }
        });
    });
};
```

Calling *listBlobsSegmented* returns blob metadata as an array of [BlobResult](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice.blobresult?view=azure-node-latest) instances. Results are returned in 5,000 increment batches (segments). If there are more than 5,000 blobs in a container, then the results include a value for **continuationToken**. To list subsequent segments from the blob container, you can pass the continuation token back into **listBlobSegmented** as the second argument.

### Download a blob from the container

The *download* function uses [getBlobToLocalFile](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#getblobtolocalfile) to download the contents of the blob to the given absolute file path.

```javascript
const download = () => {
    const dowloadFilePath = sourceFilePath.replace('.txt', '.downloaded.txt');
    return new Promise((resolve, reject) => {
        blobService.getBlobToLocalFile(containerName, blobName, dowloadFilePath, err => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Download of '${blobName}' complete` });
            }
        });
    });
};
```
The implementation shown here changes the source file path to append *.downloaded.txt* to the file name. In real-world contexts, you can change the location as well as the file name when selecting a download destination.

### Delete blobs in the container

The *deleteBlock* function (aliased as the *delete* console command) calls the [deleteBlobIfExists](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#deleteblobifexists) function. As the name implies, this function does not return an error the blob is already deleted.

```javascript
const deleteBlock = () => {
    return new Promise((resolve, reject) => {
        blobService.deleteBlobIfExists(containerName, blobName, err => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};
```

### Upload and list

One of the benefits of using promises is being able to chain commands together. The **uploadAndList** function demonstrates how easy it is to list the contents of a Blob directly after uploading a file.

```javascript
const uploadAndList = () => {
    return _module.upload().then(_module.list);
};
```

### Calling code

To expose the functions implemented to the command line, each of the functions is mapped to an object literal.

```javascript
const _module = {
    "createContainer": createContainer,
    "upload": upload,
    "download": download,
    "delete": deleteBlock,
    "list": list,
    "uploadAndList": uploadAndList
};
```

With *_module* now in place, each of the commands is available from the command line.

```javascript
const commandExists = () => exists = !!_module[args.command];
```

If a given command does not exist, then *_module*'s properties are rendered to the console to as help text to the user. 

The function *executeCommand* is an *async* function, which calls the given command using the *await* operator and logs any messages to data to the console.

```javascript
const executeCommand = async () => {
    const response = await _module[args.command]();

    console.log(response.message);

    if (response.data) {
        response.data.entries.forEach(entry => {
            console.log('Name:', entry.name, ' Type:', entry.blobType)
        });
    }
};
```

Finally, the executing code first calls *commandExists* to verify a known command is passed into the script. If an existing command is selected, then the command is run and any errors are logged to the console.

```javascript
try {
    const cmd = args.command;

    console.log(`Executing '${cmd}'...`);

    if (commandExists()) {
        executeCommand();
    } else {
        console.log(`The '${cmd}' command does not exist. Try one of these:`);
        Object.keys(_module).forEach(key => console.log(` - ${key}`));
    }
} catch (e) {
    console.log(e);
}
```

## Clean up resources
If you do not plan on using the data or accounts created in this article, you may want to delete them in order to avoid any undesired billing. To delete the blob and containers, you can use the [deleteBlobIfExists](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#deleteblobifexists) and [deleteContainerIfExists](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#deletecontainerifexists) methods. You can also delete the storage account [through the portal](../common/storage-create-storage-account.md).

## Resources for developing Node.js applications with blobs

See these additional resources for Node.js development with Blob storage:

### Binaries and source code

- View and install the [Node.js client library source code](https://github.com/Azure/azure-storage-node) for Azure Storage on GitHub.

### Client library reference and samples

- See the [Node.js API reference](https://docs.microsoft.com/javascript/api/overview/azure/storage) for more information about the Node.js client library.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=nodejs&term=blob) written using the Node.js client library.

## Next steps

This quickstart demonstrates how to upload a file between a local disk and Azure Blob storage using Node.js. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-nodejs-how-to-use-blob-storage.md)

For the Node.js reference for Azure Storage, see [azure-storage package](https://docs.microsoft.com/javascript/api/azure-storage).
