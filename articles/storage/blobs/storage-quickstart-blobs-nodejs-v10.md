---
title: Upload, download, list, and delete blobs using Azure Storage v10 SDK for JavaScript (preview)
description: Create, upload, and delete blobs and containers in Node.js with Azure Storage
services: storage
author: craigshoemaker
ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: cshoe
---

# Quickstart: Upload, download, list, and delete blobs using Azure Storage v10 SDK for JavaScript (preview)

In this quickstart, you learn to use the [Azure Storage v10 SDK for JavaScript](https://github.com/Azure/azure-storage-js) in Node.js to upload, download, list, and delete blobs and manage containers.

To complete this quickstart, you need an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

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

The output from the app will be similar to the following:

```bash
Containers:
 - container-one
 - container-two
Container "demo" is created
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
If you're using a new storage account for this quickstart, then you may not see container names listed under the label "*Containers*".

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
    require('dotenv').load();
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
Requests made by the API can be set to time-out after a given interval. The *Aborter* class is responsible for managing how requests are timed-out and the following constant is used to define timeouts used in this sample.
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

Account credentials are used to create a pipeline, which are responsible for managing how requests are sent to the REST API. Pipelines are thread-safe and specify logic for retry policies, logging, HTTP response deserialization rules, and more.

```javascript
const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(credentials);
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);
```
The following classes are used in this block of code:

- The *SharedKeyCredential* class is responsible for wrapping storage account credentials to provide them to a request pipeline.

- The *StorageURL* class is responsible for creating a new pipeline.

- The *ServiceURL* models a URL used in the REST API. Instances of this class allow you to perform actions like list containers and provide context information to generate container URLs.

The instance of *ServiceURL* is used with the *ContainerURL* and *BlockBlobURL* instances to manage containers and blobs in your storage account.

```javascript
const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
```
The *containerURL* and *blockBlobURL* variables are re-used throughout the sample to act on the storage account. 

At this point the container does not exist in the storage account. The instance of *ContainerURL* represents a URL that you can act upon. By using this instance, you can create and delete the container. The location of this container equates to a location such as this:

```bash
https://<ACCOUNT_NAME>.blob.core.windows.net/demo
```

The *blockBlobURL* is used to manage individual blobs, allowing you to upload, download, and delete blob content. The URL represented here is similar to this location:

```bash
https://<ACCOUNT_NAME>.blob.core.windows.net/demo/quickstart.txt
```
Just as with the container, the block blob does not exist yet, but the *blockBlobURL* variable is used later on to upload, download, and delete blob content.

#### Using the Aborter class

Requests made by the API can be set to time out after a given interval. The *Aborter* class is responsible for managing how requests are timed out. The following code creates a context where a set of requests are given 30 minutes to execute.

```javascript
const aborter = Aborter.timeout(30 * ONE_MINUTE);
```
As each request is sent to the server, the method *aborter.withTimeout(ONE_MINUTE)* is used to define the timeout duration defined for an individual request. 

> [!NOTE]
> A one minute timeout may be too short when uploading large files. Make sure to set the timeout value to an appropriate value to support your needs in production. To avoid your requests from timing out all together, use the *Aborter.None* static member.

#### Show container names
Accounts can store a vast amount of containers. The following code demonstrates how to list containers in a segmented fashion, which allows you to cycle through a large amount of containers. The *showContainerNames* function is passed instances of *ServiceURL* and *Aborter*.

```javascript
console.log("Containers:");
await showContainerNames(serviceURL, aborter);
```
The *showContainerNames* function uses the *listContainersSegment* method to request batches of container names from the storage account.
```javascript
async function showContainerNames(serviceURL, aborter) {
    let response;
    let marker;

    do {
        response = await serviceURL.listContainersSegment(aborter.withTimeout(ONE_MINUTE), marker);
        marker = response.marker;
        response.containerItems.forEach(container => console.log(' - ' + container.name));
    } while (marker);
}
```
Each individual request for a segment is given one minute to respond (by using *aborter.withTimeout(ONE_MINUTE)*). When the response is returned then the *containerItems* are iterated to log the name to the console. 

#### Create a container

To create a container, the *ContainerURL*'s *create* method is used.

```javascript
await containerURL.create(aborter.withTimeout(ONE_MINUTE));
console.log(`Container: "${containerName}" is created`);
```
As the name of the container is defined when calling *ContainerURL.fromServiceURL(serviceURL, containerName)*, calling the *create* method is all that is required to create the container. Just as with the request to list containers, here the request is given one minute to complete.

#### Upload text
To upload text to the a blob, use the *upload* method.
```javascript
await blockBlobURL.upload(aborter.withTimeout(ONE_MINUTE), content, content.length);
console.log(`Blob "${blobName}" is uploaded`);
```
Here the text and it's length are passed into the method.
#### Upload a local file
To upload a local file to the container, you need a container URL and the path to the file.
```javascript
await uploadLocalFile(containerURL, localFilePath, aborter);
console.log(`Local file "${localFilePath}" is uploaded`);
```
The *uploadLocalFile* function calls the *uploadFileToBlockBlob* function which takes the file path and an instance of the destination of the block blob as arguments.
```javascript
async function uploadLocalFile(containerURL, filePath, aborter) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath);
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    return await uploadFileToBlockBlob(aborter.withTimeout(ONE_MINUTE), filePath, blockBlobURL);
}
```
#### Upload a stream
Uploading streams is also supported. This sample opens a local file as a stream to pass to the upload method.
```javascript
await uploadStream(containerURL, localFilePath, aborter);
console.log(`Local file "${localFilePath}" is uploaded as a stream`);
```
The *uploadStream* function calls *uploadStreamToBlockBlob* to upload the stream to the storage container.
```javascript
async function uploadStream(containerURL, filePath, aborter) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath).replace('.md', '-stream.md');
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };

    return await uploadStreamToBlockBlob(
                    aborter.withTimeout(ONE_MINUTE), 
                    stream, 
                    blockBlobURL, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers);
}
```
During an upload, *uploadStreamToBlockBlob* allocates buffers to cache data from the stream in case a retry is necessary. The *maxBuffers* value designates at most how many buffers are used as each buffer creates a separate upload request. Ideally, more buffers equate to higher speeds, but at the cost of higher memory usage. The upload speed plateaus when the number of buffers is high enough that the bottleneck transitions to the network or disk instead of the client.

#### Show blob names
Just as accounts can contain many containers, each container can potentially contain a vast amount of blobs. Access to each blob in a container are available via an instance of the *ContainerURL* class. 
```javascript
console.log(`Blobs in "${containerName}" container:`);
await showBlobNames(containerURL, aborter);
```
The function *showBlobNames* calls *listBlobFlatSegment* to request batches of blobs from the container.
```javascript
async function showBlobNames(containerURL, aborter) {

    let response;
    let marker;

    do {
        response = await containerURL.listBlobFlatSegment(aborter.withTimeout(ONE_MINUTE));
        marker = response.marker;
        response.segment.blobItems.forEach(blob => console.log(' - ' + blob.name));
    } while (marker);
}
```
#### Download a blob
Once a blob is created, you can download the contents by using the *download* method.
```javascript
const downloadResponse = await blockBlobURL.download(aborter.withTimeout(ONE_MINUTE), 0);
const downloadedContent = downloadResponse.readableStreamBody.read(content.length).toString();
console.log(`Downloaded blob content: "${downloadedContent}"`);
```
The response is returned as a stream. In this example the stream is converted to a string in order to log to the console.
#### Delete a blob
The *delete* method from a *BlockBlobURL* instance deletes a blob from the container.
```javascript
await blockBlobURL.delete(aborter.withTimeout(ONE_MINUTE))
console.log(`Block blob "${blobName}" is deleted`);
```
#### Delete a container
The *delete* method from a *ContainerURL* instance deletes a container from the storage account.
```javascript
await containerURL.delete(aborter.withTimeout(ONE_MINUTE));
console.log(`Container "${containerName}" is deleted`);
```
## Clean up resources
All data written to the storage account is automatically deleted at the end of the code sample. 

## Next steps

This quickstart demonstrates how to manage blobs and containers in Azure Blob storage using Node.js. To learn more about working with this SDK, refer to the GitHub repository.

> [!div class="nextstepaction"]
> [Azure Storage v10 SDK for JavaScript repository](https://github.com/Azure/azure-storage-js)