---
title: "Quickstart: Azure Blob storage client library v10 for JavaScript"
description: Create, upload, and delete blobs and containers in Node.js with the Azure Storage client library v10 for JavaScript
author: mhopkins-msft

ms.author: mhopkins
ms.date: 01/24/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
---

# Quickstart: Manage blobs with JavaScript v10 SDK in Node.js

In this quickstart, you learn to manage blobs by using Node.js. Blobs are objects that can hold large amounts of text or binary data, including images, documents, streaming media, and archive data. You'll upload, download, list, and delete blobs, and you'll manage containers.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Storage account. [Create a storage account](../common/storage-account-create.md).
- [Node.js](https://nodejs.org/en/download/).

## Download the sample application

The [sample application](https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git)  in this quickstart is a simple Node.js console application. To begin, clone the repository to your machine using the following command:

```bash
git clone https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git
```

Next, change folders for the application:

```bash
cd azure-storage-js-v10-quickstart
```

Now, open the folder in your favorite code editing environment.

## Configure your storage credentials

Before running the application, you must provide the security credentials for your storage account. The sample repository includes a file named *.env.example*. Rename this file by removing the *.example* extension, which results in a file named *.env*. Inside the *.env* file, add your account name and access key values after the *AZURE_STORAGE_ACCOUNT_NAME* and *AZURE_STORAGE_ACCOUNT_ACCESS_KEY* keys.

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

The output from the app will be similar to the following example:

```bash
Container "demo" is created
Containers:
 - container-one
 - container-two
 - demo
Blob "quickstart.txt" is uploaded
Local file "./readme.md" is uploaded
Blobs in "demo" container:
 - quickstart.txt
 - readme-stream.md
 - readme.md
Blob downloaded blob content: "hello!"
Blob "quickstart.txt" is deleted
Container "demo" is deleted
Done
```

If you're using a new storage account for this quickstart, then you may only see the *demo* container listed under the label "*Containers:*".

## Understanding the code

The sample begins by importing a number of classes and functions from the Azure Blob storage namespace. Each of the imported items is discussed in context as they're used in the sample.

```javascript
const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadStreamToBlockBlob
} = require('@azure/storage-blob');
```

Credentials are read from environment variables based on the appropriate context.

```javascript
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
```

The *dotenv* module loads environment variables when running the app locally for debugging. Values are defined in a file named *.env* and loaded into the current execution context. In production, the server configuration provides these values, which is why this code only runs when the script is *not* running under a "production" environment.

The next block of modules is imported to help interface with the file system.

```javascript
const fs = require('fs');
const path = require('path');
```

The purpose of these modules is as follows: 

- *fs* is the native Node.js module used to work with the file system

- *path* is required to determine the absolute path of the file, which is used when uploading a file to Blob storage

Next, environment variable values are read and set aside in constants.

```javascript
const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
```
The next set of constants helps to reveal the intent of file size calculations during upload operations.

```javascript
const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
```

Requests made by the API can be set to time out after a given interval. The [Aborter](/javascript/api/%40azure/storage-blob/aborter?view=azure-node-legacy) class is responsible for managing how requests are timed-out and the following constant is used to define timeouts used in this sample.

```javascript
const ONE_MINUTE = 60 * 1000;
```

### Calling code

To support JavaScript's *async/await* syntax, all the calling code is wrapped in a function named *execute*. Then *execute* is called and handled as a promise.

```javascript
async function execute() {
	// commands... 
}

execute().then(() => console.log("Done")).catch((e) => console.log(e));
```

All of the following code runs inside the execute function where the `// commands...` comment is placed.

First, the relevant variables are declared to assign names, sample content and to point to the local file to upload to Blob storage.

```javascript
const containerName = "demo";
const blobName = "quickstart.txt";
const content = "hello!";
const localFilePath = "./readme.md";
```

Account credentials are used to create a pipeline, which is responsible for managing how requests are sent to the REST API. Pipelines are thread-safe and specify logic for retry policies, logging, HTTP response deserialization rules, and more.

```javascript
const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(credentials);
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
```

The following classes are used in this block of code:

- The [SharedKeyCredential](/javascript/api/%40azure/storage-blob/sharedkeycredential?view=azure-node-legacy) class is responsible for wrapping storage account credentials to provide them to a request pipeline.

- The [StorageURL](/javascript/api/%40azure/storage-blob/storageurl?view=azure-node-legacy) class is responsible for creating a new pipeline.

- The [ServiceURL](/javascript/api/%40azure/storage-blob/serviceurl?view=azure-node-legacy) models a URL used in the REST API. Instances of this class allow you to perform actions like list containers and provide context information to generate container URLs.

The instance of *ServiceURL* is used with the [ContainerURL](/javascript/api/%40azure/storage-blob/containerurl?view=azure-node-legacy) and [BlockBlobURL](/javascript/api/%40azure/storage-blob/blockbloburl?view=azure-node-legacy) instances to manage containers and blobs in your storage account.

```javascript
const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
```

The *containerURL* and *blockBlobURL* variables are reused throughout the sample to act on the storage account. 

At this point, the container doesn't exist in the storage account. The instance of *ContainerURL* represents a URL that you can act upon. By using this instance, you can create and delete the container. The location of this container equates to a location such as this:

```bash
https://<ACCOUNT_NAME>.blob.core.windows.net/demo
```

The *blockBlobURL* is used to manage individual blobs, allowing you to upload, download, and delete blob content. The URL represented here is similar to this location:

```bash
https://<ACCOUNT_NAME>.blob.core.windows.net/demo/quickstart.txt
```

As with the container, the block blob doesn't exist yet. The *blockBlobURL* variable is used later to create the blob by uploading content.

### Using the Aborter class

Requests made by the API can be set to time out after a given interval. The *Aborter* class is responsible for managing how requests are timed out. The following code creates a context where a set of requests is given 30 minutes to execute.

```javascript
const aborter = Aborter.timeout(30 * ONE_MINUTE);
```

Aborters give you control over requests by allowing you to:

- designate the amount of time given for a batch of requests
- designate how long an individual request has to execute in the batch
- allow you to cancel requests
- use the *Aborter.none* static member to stop your requests from timing out all together

### Create a container

To create a container, the *ContainerURL*'s *create* method is used.

```javascript
await containerURL.create(aborter);
console.log(`Container: "${containerName}" is created`);
```

As the name of the container is defined when calling *ContainerURL.fromServiceURL(serviceURL, containerName)*, calling the *create* method is all that's required to create the container.

### Show container names

Accounts can store a vast number of containers. The following code demonstrates how to list containers in a segmented fashion, which allows you to cycle through a large number of containers. The *showContainerNames* function is passed instances of *ServiceURL* and *Aborter*.

```javascript
console.log("Containers:");
await showContainerNames(serviceURL, aborter);
```

The *showContainerNames* function uses the *listContainersSegment* method to request batches of container names from the storage account.

```javascript
async function showContainerNames(aborter, serviceURL) {
    let marker = undefined;

    do {
        const listContainersResponse = await serviceURL.listContainersSegment(aborter, marker);
        marker = listContainersResponse.nextMarker;
        for(let container of listContainersResponse.containerItems) {
            console.log(` - ${ container.name }`);
        }
    } while (marker);
}
```

When the response is returned, then the *containerItems* are iterated to log the name to the console. 

### Upload text

To upload text to the blob, use the *upload* method.

```javascript
await blockBlobURL.upload(aborter, content, content.length);
console.log(`Blob "${blobName}" is uploaded`);
```

Here the text and its length are passed into the method.

### Upload a local file

To upload a local file to the container, you need a container URL and the path to the file.

```javascript
await uploadLocalFile(aborter, containerURL, localFilePath);
console.log(`Local file "${localFilePath}" is uploaded`);
```

The *uploadLocalFile* function calls the *uploadFileToBlockBlob* function, which takes the file path and an instance of the destination of the block blob as arguments.

```javascript
async function uploadLocalFile(aborter, containerURL, filePath) {

    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    return await uploadFileToBlockBlob(aborter, filePath, blockBlobURL);
}
```

### Upload a stream

Uploading streams is also supported. This sample opens a local file as a stream to pass to the upload method.

```javascript
await uploadStream(containerURL, localFilePath, aborter);
console.log(`Local file "${localFilePath}" is uploaded as a stream`);
```

The *uploadStream* function calls *uploadStreamToBlockBlob* to upload the stream to the storage container.

```javascript
async function uploadStream(aborter, containerURL, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath).replace('.md', '-stream.md');
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };

    return await uploadStreamToBlockBlob(
                    aborter, 
                    stream, 
                    blockBlobURL, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers);
}
```

During an upload, *uploadStreamToBlockBlob* allocates buffers to cache data from the stream in case a retry is necessary. The *maxBuffers* value designates at most how many buffers are used as each buffer creates a separate upload request. Ideally, more buffers equate to higher speeds, but at the cost of higher memory usage. The upload speed plateaus when the number of buffers is high enough that the bottleneck transitions to the network or disk instead of the client.

### Show blob names

Just as accounts can contain many containers, each container can potentially contain a vast amount of blobs. Access to each blob in a container are available via an instance of the *ContainerURL* class.

```javascript
console.log(`Blobs in "${containerName}" container:`);
await showBlobNames(aborter, containerURL);
```

The function *showBlobNames* calls *listBlobFlatSegment* to request batches of blobs from the container.

```javascript
async function showBlobNames(aborter, containerURL) {
    let marker = undefined;

    do {
        const listBlobsResponse = await containerURL.listBlobFlatSegment(Aborter.none, marker);
        marker = listBlobsResponse.nextMarker;
        for (const blob of listBlobsResponse.segment.blobItems) {
            console.log(` - ${ blob.name }`);
        }
    } while (marker);
}
```

### Download a blob

Once a blob is created, you can download the contents by using the *download* method.

```javascript
const downloadResponse = await blockBlobURL.download(aborter, 0);
const downloadedContent = await streamToString(downloadResponse.readableStreamBody);
console.log(`Downloaded blob content: "${downloadedContent}"`);
```

The response is returned as a stream. In this example, the stream is converted to a string by using the following *streamToString* helper function.

```javascript
// A helper method used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", data => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
}
```

### Delete a blob

The *delete* method from a *BlockBlobURL* instance deletes a blob from the container.

```javascript
await blockBlobURL.delete(aborter)
console.log(`Block blob "${blobName}" is deleted`);
```

### Delete a container

The *delete* method from a *ContainerURL* instance deletes a container from the storage account.

```javascript
await containerURL.delete(aborter);
console.log(`Container "${containerName}" is deleted`);
```

## Clean up resources

All data written to the storage account is automatically deleted at the end of the code sample. 

## Next steps

This quickstart demonstrates how to manage blobs and containers in Azure Blob storage using Node.js. To learn more about working with this SDK, refer to the GitHub repository.

> [!div class="nextstepaction"]
> [Azure Storage v10 SDK for JavaScript repository](https://github.com/Azure/azure-storage-js)
> [Azure Storage JavaScript API Reference](/javascript/api/overview/azure/storage-overview)
