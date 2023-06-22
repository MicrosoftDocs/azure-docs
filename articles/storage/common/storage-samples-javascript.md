---
title: Azure Storage samples using JavaScript
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the JavaScript/Node.js storage client libraries.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 10/01/2020
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: sample
ms.custom: devx-track-js
ms.devlang: javascript
---

# Azure Storage samples using v12 JavaScript client libraries

The following tables provide an overview of our samples repository and the scenarios covered in each sample. Click on the links to view the corresponding sample code in GitHub.

> [!NOTE]
> These samples use the latest Azure Storage JavaScript v12 library. For legacy v11 code, see [Getting Started with Azure Blob Service in Node.js](https://github.com/Azure-Samples/storage-blob-node-getting-started) in the GitHub repository.

## Blob samples

### Authentication

:::row:::
   :::column span="":::
      [Authenticate using connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/connectionStringAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using SAS connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/connectionStringAuth.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Authenticate using shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/sharedKeyAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using AnonymousCredential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/anonymousAuth.js#L18)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Authenticate using Azure Active Directory](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/azureAdAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using a proxy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/proxyAuth.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/customPipeline.js)
   :::column-end:::
:::row-end:::

### Blob service

:::row:::
   :::column span="2":::
      [Create blob service client using a SAS URL](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L39)
   :::column-end:::
:::row-end:::

### Container

:::row:::
   :::column span="":::
      [Create a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L23)
   :::column-end:::
   :::column span="":::
      [Create a container using a shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/snapshots.js#L23)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List containers](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L22)
   :::column-end:::
   :::column span="":::
      [List containers using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L28)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List containers by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L34)
   :::column-end:::
   :::column span="":::
      [Delete a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L132)
   :::column-end:::
:::row-end:::

### Blob

:::row:::
   :::column span="":::
      [Create a blob service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L23)
   :::column-end:::
   :::column span="":::
      [Upload a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L59)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Download a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L90)
   :::column-end:::
   :::column span="":::
      [List blobs using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsFlat.js#L41)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List blobs by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsFlat.js#L47)
   :::column-end:::
   :::column span="":::
      [List blobs by hierarchy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsByHierarchy.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Listing blobs without using await](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsFlat.js#L41)
   :::column-end:::
   :::column span="":::
      [Create a blob snapshot](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/snapshots.js#L20)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Download a blob snapshot](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/snapshots.js#L56)
   :::column-end:::
   :::column span="":::
      [Parallel upload a stream to a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L74)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Parallel download block blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L99)
   :::column-end:::
   :::column span="":::
      [Set the access tier on a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L118)
   :::column-end:::
:::row-end:::

### Troubleshooting

:::row:::
   :::column span="2":::
      [Trigger a recoverable error using a container client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js)
   :::column-end:::
:::row-end:::

## Data Lake Storage Gen2 samples

:::row:::
   :::column span="":::
      [Create a Data Lake service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L5)
   :::column-end:::
   :::column span="":::
      [Create a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L57)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List file systems](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L45)
   :::column-end:::
   :::column span="":::
      [Create a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L66)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List paths in a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js)
   :::column-end:::
   :::column span="":::
      [Download a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Delete a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L93)
   :::column-end:::
:::row-end:::

## Azure Files samples

### Authentication

:::row:::
   :::column span="":::
      [Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/connectionStringAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/sharedKeyAuth.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Authenticate using AnonymousCredential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/anonymousAuth.js)
   :::column-end:::
   :::column span="":::
      [Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/customPipeline.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Connect using a proxy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/proxyAuth.js)
   :::column-end:::
:::row-end:::

### Share

:::row:::
   :::column span="":::
      [Create a share](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L41)
   :::column-end:::
   :::column span="":::
      [List shares](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listShares.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List shares by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listShares.js#32)
   :::column-end:::
   :::column span="":::
      [Delete a share](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L97)
   :::column-end:::
:::row-end:::

### Directory

:::row:::
   :::column span="":::
      [Create a directory](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L47)
   :::column-end:::
   :::column span="":::
      [List files and directories](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listFilesAndDirectories.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [List files and directories by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listFilesAndDirectories.js#L59)
   :::column-end:::
:::row-end:::

### File

:::row:::
   :::column span="":::
      [Parallel upload a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L53)
   :::column-end:::
   :::column span="":::
      [Parallel upload a readable stream](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L67)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Parallel download a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L86)
   :::column-end:::
   :::column span="":::
      [List file handles](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listHandles.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [List file handles by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listHandles.js)
   :::column-end:::
:::row-end:::

## Queue samples

### Authentication

:::row:::
   :::column span="":::
      [Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/connectionStringAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/sharedKeyAuth.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Authenticate using AnonymousCredential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/anonymousAuth.js)
   :::column-end:::
   :::column span="":::
      [Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/customPipeline.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Connect using a proxy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/proxyAuth.js)
   :::column-end:::
   :::column span="":::
      [Authenticate using Azure Active Directory](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/azureAdAuth.js)
   :::column-end:::
:::row-end:::

### Queue service

:::row:::
   :::column span="2":::
      [Create a queue service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js)
   :::column-end:::
:::row-end:::

### Queue

:::row:::
   :::column span="":::
      [Create a new queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L55)
   :::column-end:::
   :::column span="":::
      [List queues](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/listQueues.js)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List queues by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/listQueues.js#L32)
   :::column-end:::
   :::column span="":::
      [Delete a queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L90)
   :::column-end:::
:::row-end:::

### Message

:::row:::
   :::column span="":::
      [Send a message into a queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L63)
   :::column-end:::
   :::column span="":::
      [Peek at messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L69)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Receive messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L73)
   :::column-end:::
   :::column span="":::
      [Delete messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L5)
   :::column-end:::
:::row-end:::

## Table samples (v11)

:::row:::
   :::column span="":::
      [Batch entities](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L87)
   :::column-end:::
   :::column span="":::
      [Create table](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L41)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete entity/table](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L67)
   :::column-end:::
   :::column span="":::
      [Insert/merge/replace entity](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L49)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List tables](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L63)
   :::column-end:::
   :::column span="":::
      [Query entities](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L59)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Query tables](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L140)
   :::column-end:::
   :::column span="":::
      [Range query](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L102)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Shared Access Signature (SAS)](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L87)
   :::column-end:::
   :::column span="":::
      [Table ACL](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L255)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Table Cross-Origin Resource Sharing (CORS) rules](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L149)
   :::column-end:::
   :::column span="":::
      [Table properties](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L188)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Table stats](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L243)
   :::column-end:::
   :::column span="":::
      [Update entity](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L49)
   :::column-end:::
:::row-end:::

## Azure code sample libraries

To view the complete JavaScript sample libraries, go to:

- [Azure Blob code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/javascript)
- [Azure Data Lake code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-datalake/samples/v12/javascript)
- [Azure Files code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-share/samples/v12/javascript)
- [Azure Queue code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-queue/samples/v12/javascript)

You can browse and clone the GitHub repository for each library.

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage Client Libraries.

- [Getting Started with Azure Blob Service in JavaScript](../blobs/storage-quickstart-blobs-nodejs.md)
- [Getting Started with Azure Queue Service in JavaScript](../queues/storage-quickstart-queues-nodejs.md)
- [Getting Started with Azure Table Service in JavaScript](../../cosmos-db/table-storage-how-to-use-nodejs.md)

## Next steps

For information on samples for other languages:

- .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
- Java: [Azure Storage samples using Java](storage-samples-java.md)
- Python: [Azure Storage samples using Python](storage-samples-python.md)
- C++: [Azure Storage samples using C++](storage-samples-c-plus-plus.md)
- All other languages: [Azure Storage samples](storage-samples.md)
