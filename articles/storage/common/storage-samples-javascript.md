---
title: Azure Storage samples using JavaScript
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the JavaScript/Node.js storage client libraries.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 05/23/2024
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: sample
ms.custom: devx-track-js
ms.devlang: javascript
---

# Azure Storage samples using JavaScript client libraries

This article provides an overview of code sample scenarios found in our developer guides and samples repository. Click on the links to view the corresponding samples, either in our developer guides or in GitHub repositories. 

Developer guides are collections of articles that provide detailed information and code examples for specific scenarios related to Azure Storage services. To learn more about the Blob Storage developer guide for JavaScript, see [Get started with Azure Blob Storage and JavaScript](../blobs/storage-blob-javascript-get-started.md).

> [!NOTE]
> These samples use the latest Azure Storage JavaScript v12 library. For legacy v11 code, see [Getting Started with Azure Blob Service in Node.js](https://github.com/Azure-Samples/storage-blob-node-getting-started) in the GitHub repository.

## Blob samples

The following table links to Azure Blob Storage developer guides and samples that use JavaScript client libraries:

| Topic | Developer guide | Samples on GitHub |
|-------|-----------------|----------------------|
| Authentication/authorization | [Authorize access and connect to Blob Storage](../blobs/storage-blob-javascript-get-started.md#authorize-access-and-connect-to-blob-storage)</br></br>[Create a user delegation SAS for a blob](../blobs/storage-blob-create-user-delegation-sas-javascript.md)</br></br>[Create a service SAS for a blob](../blobs/sas-service-create-javascript.md)</br></br>[Create an account SAS](../blobs/storage-blob-account-delegation-sas-create-javascript.md) | [Authenticate using Microsoft Entra ID](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/azureAdAuth.js)</br></br>[Authenticate using shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/sharedKeyAuth.js)</br></br>[Authenticate using connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/connectionStringAuth.js) |
| Create container | [Create a container](../blobs/storage-blob-container-create-javascript.md) | [Create a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L23) |
| Upload | [Upload a blob](../blobs/storage-blob-upload-javascript.md) | [Upload a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L59)</br></br>[Parallel upload a stream to a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L74) |
| Download | [Download a blob](../blobs/storage-blob-download-javascript.md) | [Download a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L90)</br></br>[Parallel download block blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L99) |
| List | [List containers](../blobs/storage-blob-containers-list-javascript.md)</br></br>[List blobs](../blobs/storage-blobs-list-javascript.md) | [List containers](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L22)</br></br>[List containers using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L28)</br></br>[List containers by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L34)</br></br>[List blobs using an iterator](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsFlat.js#L41)</br></br>[List blobs by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsFlat.js#L47)</br></br>[List blobs by hierarchy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listBlobsByHierarchy.js) |
| Delete | [Delete containers](../blobs/storage-blob-container-delete-javascript.md)</br></br>[Delete blobs](../blobs/storage-blob-delete-javascript.md) | [Delete a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js#L132) |
| Copy | [Overview of copy operations](../blobs/storage-blob-copy-javascript.md)</br></br>[Copy a blob from a source object URL](../blobs/storage-blob-copy-url-javascript.md)</br></br>[Copy a blob with asynchronous scheduling](../blobs/storage-blob-copy-async-javascript.md) | |
| Lease | [Create and manage container leases](../blobs/storage-blob-container-lease-javascript.md)</br></br>[Create and manage blob leases](../blobs/storage-blob-lease-javascript.md) | |
| Properties and metadata | [Manage container properties and metadata](../blobs/storage-blob-container-properties-metadata-javascript.md)</br></br>[Manage blob properties and metadata](../blobs/storage-blob-properties-metadata-javascript.md)| |
| Index tags | [Use blob index tags to manage and find data](../blobs/storage-blob-tags-javascript.md) | |
| Access tiers | [Set or change a block blob's access tier](../blobs/storage-blob-use-access-tier-javascript.md) | [Set the access tier on a blob](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L118) |
| Blob service | | [Create a blob service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/listContainers.js#L23)</br></br>[Create blob service client using a SAS URL](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/advancedRequestOptions.js#L39) |
| Snapshot | | [Create a blob snapshot](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/snapshots.js#L20)</br></br>[Download a blob snapshot](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/snapshots.js#L56) |
| Troubleshooting | | [Trigger a recoverable error using a container client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-blob/samples/v12/javascript/errorsAndResponses.js) |

## Data Lake Storage samples

The following table links to Data Lake Storage samples that use JavaScript client libraries:

| Topic | Samples on GitHub |  
|-------|-------------------|  
| Data Lake service | [Create a Data Lake service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L5) |  
| File system | [Create a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L57)<br/>[List file systems](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L45)<br/>[List paths in a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js)<br/>[Delete a file system](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L93) |  
| File | [Create a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#L66)<br/>[Download a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-datalake/samples/v12/javascript/dataLakeServiceClient.js#) |

## Azure Files samples

The following table links to Azure Files samples that use JavaScript client libraries:

| Topic | Samples on GitHub |  
|-------|-------------------|  
| Authentication | [Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/connectionStringAuth.js)<br/>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/sharedKeyAuth.js)<br/>[Authenticate using AnonymousCredential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/anonymousAuth.js)<br/>[Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/customPipeline.js)<br/>[Connect using a proxy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/proxyAuth.js) |  
| Share | [Create a share](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L41)<br/>[List shares](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listShares.js)<br/>[List shares by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listShares.js#32)<br/>[Delete a share](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L97) |  
| Directory | [Create a directory](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L47)<br/>[List files and directories](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listFilesAndDirectories.js)<br/>[List files and directories by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listFilesAndDirectories.js#L59) |  
| File | [Parallel upload a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L53)<br/>[Parallel upload a readable stream](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L67)<br/>[Parallel download a file](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/advancedRequestOptions.js#L86)<br/>[List file handles](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listHandles.js)<br/>[List file handles by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-file-share/samples/v12/javascript/listHandles.js) |

## Queue samples

The following table links to Azure Queues samples that use JavaScript client libraries:

| Topic | Samples on GitHub |  
|-------|-------------------|  
| Authentication | [Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/connectionStringAuth.js)<br/>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/sharedKeyAuth.js)<br/>[Authenticate using AnonymousCredential](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/anonymousAuth.js)<br/>[Connect using a custom pipeline](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/customPipeline.js)<br/>[Connect using a proxy](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/proxyAuth.js)<br/>[Authenticate using Microsoft Entra ID](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/azureAdAuth.js) |  
| Queue service | [Create a queue service client](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js) |  
| Queue | [Create a new queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L55)<br/>[List queues](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/listQueues.js)<br/>[List queues by page](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/listQueues.js#L32)<br/>[Delete a queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L90) |  
| Message | [Send a message into a queue](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L63)<br/>[Peek at messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L69)<br/><br/>[Receive messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L73)<br/>[Delete messages](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/storage/storage-queue/samples/v12/javascript/queueClient.js#L5) |  

## Table samples

The following table links to Azure Tables samples that use JavaScript client libraries:

- [Authentication methods](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/authenticationMethods.js)
- [Create and delete a table](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/createAndDeleteTable.js)
- [Create and delete table entities](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/createAndDeleteEntities.js)
- [Query tables](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/queryTables.js)
- [Query entities](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/queryEntities.js)
- [Update and upsert entities in a table](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/updateAndUpsertEntities.js)
- [Send transactional batch requests](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/transactionOperations.js)
- [Send transactional batch requests with TableTransaction helper](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/tables/data-tables/samples/v13/javascript/transactionWithHelper.js)

Samples for deprecated client libraries are available at [Azure Table Storage samples for JavaScript](https://github.com/Azure-Samples/storage-table-node-getting-started/tree/master).

## Azure code sample libraries

To view the complete JavaScript sample libraries, go to:

- [Azure Blob code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/javascript)
- [Azure Data Lake code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-datalake/samples/v12/javascript)
- [Azure Files code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-share/samples/v12/javascript)
- [Azure Queue code samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-queue/samples/v12/javascript)

You can browse and clone the GitHub repository for each library.

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage client libraries.

- [Quickstart: Azure Blob Storage client library for JavaScript](../blobs/storage-quickstart-blobs-nodejs.md)
- [Quickstart: Azure Queue client library for JavaScript](../queues/storage-quickstart-queues-nodejs.md)
- [Getting Started with Azure Table Service in JavaScript](../../cosmos-db/table-storage-how-to-use-nodejs.md)

## Next steps

For information on samples for other languages:

- .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
- Java: [Azure Storage samples using Java](storage-samples-java.md)
- Python: [Azure Storage samples using Python](storage-samples-python.md)
- C++: [Azure Storage samples using C++](storage-samples-c-plus-plus.md)
- All other languages: [Azure Storage samples](storage-samples.md)
