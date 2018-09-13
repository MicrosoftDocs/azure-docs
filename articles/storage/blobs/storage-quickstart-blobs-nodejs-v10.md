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

In this quickstart, you learn to use Azure Storage v10 SDK for JavaScript in Node.js to upload, download, list, and delete blobs and manage containers using the Azure Blob storage [Azure Storage v10 SDK for JavaScript](https://github.com/Azure/azure-storage-js).

To complete this quickstart, you need an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git)  in this quickstart is a simple Node.js console application. To begin, clone the repository to your machine using the following command:

```bash
git clone https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git
```

To open the application, look for the *azure-storage-js-v10-quickstart* folder and open it in your favorite code editing environment.

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