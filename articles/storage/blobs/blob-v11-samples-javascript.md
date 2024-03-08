---
title: Azure Blob Storage code samples using JavaScript version 11.x client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure Blob Storage client library for JavaScript version 11.x.
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.custom: devx-track-js
ms.topic: how-to
ms.date: 04/03/2023
ms.author: pauljewell
---

# Azure Blob Storage code samples using JavaScript version 11.x client libraries

This article shows code samples that use version 11.x of the Azure Blob Storage client library for JavaScript.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

## Build a highly available app with Blob Storage

Related article: [Tutorial: Build a highly available application with Blob storage](storage-create-geo-redundant-storage.md)

### Download the sample

[Download the sample project](https://github.com/Azure-Samples/storage-node-v10-ha-ra-grs) and unzip the file. You can also use [git](https://git-scm.com/) to download a copy of the application to your development environment. The sample project contains a basic Node.js application.

```bash
git clone https://github.com/Azure-Samples/storage-node-v10-ha-ra-grs.git
```

### Configure the sample

To run this sample, you must add your storage account credentials to the `.env.example` file and then rename it to `.env`.

```
AZURE_STORAGE_ACCOUNT_NAME=<replace with your storage account name>
AZURE_STORAGE_ACCOUNT_ACCESS_KEY=<replace with your storage account access key>
```

You can find this information in the Azure portal by navigating to your storage account and selecting **Access keys** in the **Settings** section.

Install the required dependencies by opening a command prompt, navigating to the sample folder, then entering `npm install`.

### Run the console application

To run the sample, open a command prompt, navigate to the sample folder, then enter `node index.js`.

The sample creates a container in your Blob storage account, uploads **HelloWorld.png** into the container, then repeatedly checks whether the container and image have replicated to the secondary region. After replication, it prompts you to enter **D** or **Q** (followed by ENTER) to download or quit. Your output should look similar to the following example:

```
Created container successfully: newcontainer1550799840726
Uploaded blob: HelloWorld.png
Checking to see if container and blob have replicated to secondary region.
[0] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
[1] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
...
[31] Container has not replicated to secondary region yet: newcontainer1550799840726 : ContainerNotFound
[32] Container found, but blob has not replicated to secondary region yet.
...
[67] Container found, but blob has not replicated to secondary region yet.
[68] Blob has replicated to secondary region.
Ready for blob download. Enter (D) to download or (Q) to quit, followed by ENTER.
> D
Attempting to download blob...
Blob downloaded from primary endpoint.
> Q
Exiting...
Deleted container newcontainer1550799840726
```

### Understand the code sample

With the Node.js V10 SDK, callback handlers are unnecessary. Instead, the sample creates a pipeline configured with retry options and a secondary endpoint. This configuration allows the application to automatically switch to the secondary pipeline if it fails to reach your data through the primary pipeline.

```javascript
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const storageAccessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const sharedKeyCredential = new SharedKeyCredential(accountName, storageAccessKey);

const primaryAccountURL = `https://${accountName}.blob.core.windows.net`;
const secondaryAccountURL = `https://${accountName}-secondary.blob.core.windows.net`;

const pipeline = StorageURL.newPipeline(sharedKeyCredential, {
  retryOptions: {
    maxTries: 3,
    tryTimeoutInMs: 10000,
    retryDelayInMs: 500,
    maxRetryDelayInMs: 1000,
    secondaryHost: secondaryAccountURL
  }
});
```
