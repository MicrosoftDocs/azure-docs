---
title: 'Quickstart: Upload, download, and list blobs using Node.js - Azure Storage'
description: Create a storage account and a container in object (Blob) storage. Then you use the storage client library for Node.js to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: craigshoemaker

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 09/20/2018
ms.author: cshoe
---

# Quickstart: Upload, download, and list blobs using Node.js

In this quickstart, you learn how to use Node.js to upload, download, and list blobs and manage containers with Azure Blob storage.

To complete this quickstart, you need an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

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
Now that the dependencies are installed, you can run the sample by issuing the following command:

```bash
npm start
```

The output from the script will be similar to the following:

```bash
Containers:
 - container-one
 - container-two
Container "demo" is created
Blob "quickstart.txt" is uploaded
Local file "./readme.md" is uploaded
Blobs in "demo" container:
 - quickstart.txt
 - readme.md
Blob downloaded blob content: "hello Blob SDK"
Blob "quickstart.txt" is deleted
Container "demo" is deleted
Done
```

Note that if you are using a new storage account for this quickstart, then you may not see container names listed under the label "*Containers*".

## Understanding the code
The first expression is used to load values into environment variables.

```javascript
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
```

The *dotenv* module loads environment variables when running the app locally for debugging. Values are defined in a file named *.env* and loaded into the current execution context. In production contexts, the server configuration provides these values and that is why this code is only run when the script is not running under a "production" context.

```javascript
const path = require('path');
const storage = require('azure-storage');
```

The purpose of the modules is as follows: 

file named *.env* into the current execution context
- *path* is required in order to determine the absolute file path of the file to upload to blob storage
- *azure-storage* is the [Azure Storage SDK](https://docs.microsoft.com/javascript/api/azure-storage) module for Node.js

Next, the **blobService** variable is initialized as a new instance of the Azure Blob service.

```javascript
const blobService = storage.createBlobService();
```

In the following implementation, each of the *blobService* functions is wrapped in a *Promise*, which allows access to JavaScript's *async* function and *await* operator to streamline the callback nature of the [Azure Storage API](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest). When a successful response returns for each function, the promise resolves with relevant data along with a message specific to the action.

### List containers

The *listContainers* function calls [listContainersSegmented](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#listcontainerssegmented) which returns collections of containers in groups.

```javascript
const listContainers = async () => {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} containers`, containers: data.entries });
            }
        });
    });
};
```

The size of the groups is configurable via [ListContainersOptions](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice.listcontaineroptions?view=azure-node-latest). Calling *listContainersSegmented* returns blob metadata as an array of [ContainerResult](/nodejs/api/azure-storage/blobresult) instances. Results are returned in 5,000 increment batches (segments). If there are more than 5,000 blobs in a container, then the results include a value for *continuationToken*. To list subsequent segments from the blob container, you can pass the continuation token back into *listContainersSegment* as the second argument.

### Create a container

The *createContainer* function calls [createContainerIfNotExists](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createcontainerifnotexists) and sets the appropriate access level for the blob.

```javascript
const createContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
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

### Upload text

The *uploadString* function calls [createBlockBlobFromText](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#createblockblobfromtext) to write (or overwrite) an arbitrary string to the blob container.

```javascript
const uploadString = async (containerName, blobName, text) => {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, text, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Text "${text}" is written to blob storage` });
            }
        });
    });
};
```
### Upload a local file

The *uploadLocalFile* function uses [createBlockBlobFromLocalFile](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_createBlockBlobFromLocalFile) to upload and write (or overwrite) a file from the file system into blob storage. 

```javascript
const uploadLocalFile = async (containerName, filePath) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = path.basename(filePath);
        blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Local file "${filePath}" is uploaded` });
            }
        });
    });
};
```
Other approaches available to upload content into blobs include working with [text](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_createBlockBlobFromText) and [streams](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_createBlockBlobFromStream). To verify the file is uploaded to your blob storage, you can use the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to view the data in your account.

### List the blobs

The *listBlobs* function calls the [listBlobsSegmented](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_createBlockBlobFromText) method to return a list of blob metadata in a container. 

```javascript
const listBlobs = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} blobs in '${containerName}'`, blobs: data.entries });
            }
        });
    });
};
```

Calling *listBlobsSegmented* returns blob metadata as an array of [BlobResult](https://docs.microsoft.com/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice.blobresult?view=azure-node-latest) instances. Results are returned in 5,000 increment batches (segments). If there are more than 5,000 blobs in a container, then the results include a value for **continuationToken**. To list subsequent segments from the blob container, you can pass the continuation token back into **listBlobSegmented** as the second argument.

### Download a blob

The *downloadBlob* function uses [getBlobToText](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#getblobtotext) to download the contents of the blob to the given absolute file path.

```javascript
const downloadBlob = async (containerName, blobName) => {
    const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'));
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, blobName, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Blob downloaded "${data}"`, text: data });
            }
        });
    });
};
```
The implementation shown here changes the source returns the contents of the blob as a string. You can also download the blob as a [stream](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#getblobtostream) as well as directly to a [local file](/javascript/api/azure-storage/azurestorage.services.blob.blobservice.blobservice?view=azure-node-latest#getblobtolocalfile).

### Delete a blob

The *deleteBlob* function calls the [deleteBlobIfExists](/nodejs/api/azure-storage/blobservice#azure_storage_BlobService_deleteBlobIfExists) function. As the name implies, this function does not return an error if the blob is already deleted.

```javascript
const deleteBlob = async (containerName, blobName) => {
    return new Promise((resolve, reject) => {
        blobService.deleteBlobIfExists(containerName, blobName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};
```

### Delete a container

Containers are deleted by calling the *deleteContainer* method off the blob service and passing in the container name.

```javascript
const deleteContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.deleteContainer(containerName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' deleted` });
            }
        });
    });
};
```

### Calling code

In order to support JavaScript's *async/await* syntax, all the calling code is wrapped in a function named *execute*. Then execute is called and handled as a promise.

```javascript
async function execute() {
	// commands 
}

execute().then(() => console.log("Done")).catch((e) => console.log(e));
```
All of the following code runs inside the execute function where the `// commands` comment is placed.

First, the relevant variables are declared to assign names, sample content and to point to the local file to upload to Blob storage.

```javascript
const containerName = "demo";
const blobName = "quickstart.txt";
const content = "hello Node SDK";
const localFilePath = "./readme.md";
let response;
```

To list the containers in the storage account, the listContainers function is called and the returned list of containers is logged to the output window.

```javascript
console.log("Containers:");
response = await listContainers();
response.containers.forEach((container) => console.log(` -  ${container.name}`));
```

Once the list of containers is available, then you can use the Array *findIndex* method to see if the container you want to create already exists. If the container does not exist then the container is created.

```javascript
const containerDoesNotExist = response.containers.findIndex((container) => container.name === containerName) === -1;

if (containerDoesNotExist) {
    await createContainer(containerName);
    console.log(`Container "${containerName}" is created`);
}
```
Next, a string and a local file is uploaded to Blob storage.

```javascript
await uploadString(containerName, blobName, content);
console.log(`Blob "${blobName}" is uploaded`);

response = await uploadLocalFile(containerName, localFilePath);
console.log(response.message);
```
The process to list blobs is the same as listing containers. The call to *listBlobs* returns an array of blobs in the container and are logged to the output window.

```javascript
console.log(`Blobs in "${containerName}" container:`);
response = await listBlobs(containerName);
response.blobs.forEach((blob) => console.log(` - ${blob.name}`));
```

To download a blob, the response is captured and used to access the value of the blob. From the response readableStreamBody is converted to a string and logged out to the output window.

```javascript
response = await downloadBlob(containerName, blobName);
console.log(`Downloaded blob content: "${response.text}"`);
```

Finally, the blob and container are deleted from the storage account.

```javascript
await deleteBlob(containerName, blobName);
console.log(`Blob "${blobName}" is deleted`);

await deleteContainer(containerName);
console.log(`Container "${containerName}" is deleted`);
```

## Clean up resources
All data written to the storage account is automatically deleted at the end of the code sample. 

## Resources for developing Node.js applications with blobs

See these additional resources for Node.js development with Blob storage:

### Binaries and source code

- View and install the [Node.js client library source code](https://github.com/Azure/azure-storage-node) for Azure Storage on GitHub.

### Client library reference and samples

- See the [Node.js API reference](https://docs.microsoft.com/javascript/api/overview/azure/storage) for more information about the Node.js client library.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=nodejs&term=blob) written using the Node.js client library.

## Next steps

This quickstart demonstrates how to upload a file between a local disk and Azure Blob storage using Node.js. To learn more about working with Blob storage, continue to the GitHub repository.

> [!div class="nextstepaction"]
> [Azure Storage SDK for JavaScript repository](https://github.com/Azure/azure-storage-node)