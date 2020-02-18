---
title: Azure Storage samples using JavaScript | Microsoft Docs
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the JavaScript/Node.js storage client libraries.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 02/19/2020
ms.service: storage
ms.subservice: common
ms.topic: sample
---

# Azure Storage samples using v12 JavaScript client libraries

The following tables provide an overview of our samples repository and the scenarios covered in each sample. Click on the links to view the corresponding sample code in GitHub.

> [!NOTE]
> These samples use the latest Azure Storage JavaScript v12 library. For legacy v11 code, see [Getting Started with Azure Blob Service in Node.js](https://github.com/Azure-Samples/storage-blob-node-getting-started) in the GitHub repository.


<!--
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::
-->

## Blob samples

### Authorization

:::row:::
   :::column span="":::
      [Connection string authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/withConnString.js#L14)
   :::column-end:::
   :::column span="":::
      [SAS connection string authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/withConnString.js#L14)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [SharedKeyCredential authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/sharedKeyCred.js#L5)
   :::column-end:::
   :::column span="":::
      [AnonymousCredential authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/anonymousCred.js#L18)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [DefaultAzureCredential authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/azureAdAuth.js#L47)
   :::column-end:::
   :::column span="":::
      [Proxy authorization](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/proxyAuth.js#L28)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/customPipeline.js#L26)
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::

### Blob service

:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::

### Container

:::row:::
   :::column span="":::
      [Create a container](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L53)
   :::column-end:::
   :::column span="":::
      [List containers](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L48)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete a container](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L82)
   :::column-end:::
   :::column span="":::
      [List containers using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-containers.js#L28)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List containers by page](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-containers.js#L53)
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::

### Blob

:::row:::
   :::column span="":::
      [Create a blob](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L60)
   :::column-end:::
   :::column span="":::
      [List blobs](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L67)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Download a blob](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/basic.js#L73)
   :::column-end:::
   :::column span="":::
      [List blobs using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-blobs.js#L41)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List blobs by page](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-blobs.js#L66)
   :::column-end:::
   :::column span="":::
      [List blobs by hierarchy](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-blobs-hierarchy.js#L70)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Listing blobs without using await](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/storage/storage-blob/samples/javascript/iterators-without-await.js#L42)
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::

## Data Lake Storage Gen2 samples

### Data Lake service

:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::


<!-- ## File samples (v10)

| **Scenario** | **Sample Code** |
|--------------|-----------------|
| Create Shares/Directories/Files | [Getting Started with Azure File Service in JavaScript](https://github.com/Azure-Samples/storage-file-node-getting-started/blob/master/fileSample.js#L97) |
| Delete Shares/Directories/Files | [Getting Started with Azure File Service in JavaScript](https://github.com/Azure-Samples/storage-file-node-getting-started/blob/master/fileSample.js#L135) |
| Download Files | [Getting Started with Azure File Service in JavaScript](https://github.com/Azure-Samples/storage-file-node-getting-started/blob/master/fileSample.js#L128) |
| List Directories and Files | [Getting Started with Azure File Service in JavaScript](https://github.com/Azure-Samples/storage-file-node-getting-started/blob/master/fileSample.js#L115) |
| List Shares | [Getting Started with Azure File Service in JavaScript](https://github.com/Azure-Samples/storage-file-node-getting-started/blob/master/fileSample.js#L187) | -->

## Azure Files samples

:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::

<!-- ## Queue samples (v10)

| **Scenario** | **Sample Code** |
|--------------|-----------------|
| Add Message | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L142) |
| Client-Side Encryption | [Managing storage account keys in Azure Key Vault with JavaScript](https://github.com/Azure-Samples/key-vault-node-storage-accounts) |
| Create Queues | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L57) |
| Delete Message | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L164) |
| Delete Queue | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L203) |
| List Queues | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L111) |
| Peek Message | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L170) |
| Queue ACL | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/advanced.js#L192) |
| Queue Cors rules | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/advanced.js#L55) |
| Queue Metadata | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/advanced.js#L161) |
| Queue Service Properties | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/advanced.js#L94) |
| Queue Stats | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/advanced.js#L149) |
| Update Message | [Getting Started with Azure Queue Service in JavaScript](https://github.com/Azure-Samples/storage-queue-node-getting-started/blob/master/basic.js#L176) | -->

## Queues samples

:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      []()
   :::column-end:::
   :::column span="":::
      []()
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      []()
   :::column-end:::
:::row-end:::

## Table samples (v11)

:::row:::
   :::column span="":::
      [Batch Entities](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L87)
   :::column-end:::
   :::column span="":::
      [Create Table](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L41)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete Entity/Table](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L67)
   :::column-end:::
   :::column span="":::
      [Insert/Merge/Replace Entity](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L49)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List Tables](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L63)
   :::column-end:::
   :::column span="":::
      [Query Entities](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L59)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Query Tables](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L140)
   :::column-end:::
   :::column span="":::
      [Range Query](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L102)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Shared Access Signature](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L87)
   :::column-end:::
   :::column span="":::
      [Table ACL](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L255)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Table CORS Rules](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L149)
   :::column-end:::
   :::column span="":::
      [Table Properties](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L188)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Table Stats](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/advanced.js#L243)
   :::column-end:::
   :::column span="":::
      [Update Entity](https://github.com/Azure-Samples/storage-table-node-getting-started/blob/master/basic.js#L49)
   :::column-end:::
:::row-end:::



## Azure Code Samples library

To view the complete sample library, go to the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=storage) library, which includes samples for Azure Storage that you can download and run locally. The Code Sample Library provides sample code in .zip format. Alternatively, you can browse and clone the GitHub repository for each sample.

[!INCLUDE [storage-node-samples-include](../../../includes/storage-node-samples-include.md)]

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage Client Libraries.

* [Getting Started with Azure Blob Service in JavaScript](../blobs/storage-quickstart-blobs-nodejs.md)
* [Getting Started with Azure Queue Service in JavaScript](../queues/storage-nodejs-how-to-use-queues.md)
* [Getting Started with Azure Table Service in JavaScript](../../cosmos-db/table-storage-how-to-use-nodejs.md)

## Next steps

For information on samples for other languages:

* .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
* Java: [Azure Storage samples using Java](storage-samples-java.md)
* Python: [Azure Storage samples using Python](storage-samples-python.md)
* All other languages: [Azure Storage samples](storage-samples.md)
