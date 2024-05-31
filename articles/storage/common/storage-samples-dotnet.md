---
title: Azure Storage samples using .NET
description: View developer guides and sample code for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the .NET storage client libraries.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 05/23/2024
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: sample
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Azure Storage samples using .NET client libraries

This article provides an overview of code sample scenarios found in our developer guides and samples repository. Click on the links to view the corresponding samples, either in our developer guides or in GitHub repositories. 

Developer guides are collections of articles that provide detailed information and code examples for specific scenarios related to Azure Storage services. To learn more about the Blob Storage developer guide for .NET, see [Get started with Azure Blob Storage and .NET](../blobs/storage-blob-dotnet-get-started.md).

> [!NOTE]
> These samples use the latest Azure Storage .NET v12 library. For legacy v11 code, see [Azure Blob Storage Samples for .NET](https://github.com/Azure-Samples/storage-blob-dotnet-getting-started) in the GitHub repository.

## Blob samples

The following table links to Azure Blob Storage developer guides and samples that use .NET client libraries:

| Topic | Developer guide | Samples on GitHub |
|-------|-----------------|----------------------|
| Authentication/authorization | [Authorize access and connect to Blob Storage](../blobs/storage-blob-dotnet-get-started.md#authorize-access-and-connect-to-blob-storage)</br></br>[Create a user delegation SAS for a blob](../blobs/storage-blob-user-delegation-sas-create-dotnet.md)</br></br>[Create a service SAS for a blob](../blobs/sas-service-create-dotnet.md)</br></br>[Create an account SAS](storage-account-sas-create-dotnet.md) | [Authenticate with Azure Identity](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L210)</br></br>[Authenticate using an Active Directory token](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L177)</br></br>[Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L27)</br></br>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L91) |
| Create container | [Create a container](../blobs/storage-blob-container-create.md) | |
| Upload | [Upload a blob](../blobs/storage-blob-upload.md) | [Upload a file to a blob](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01b_HelloWorldAsync.cs#L21) |
| Download | [Download a blob](../blobs/storage-blob-download.md) | [Download a blob to a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01b_HelloWorldAsync.cs#L66)</br></br>[Download an image](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01b_HelloWorldAsync.cs#L109) |
| List | [List containers](../blobs/storage-blob-containers-list.md)</br></br>[List blobs](../blobs/storage-blobs-list.md) | [List all blobs in a container](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01b_HelloWorldAsync.cs#L128) |
| Delete | [Delete containers](../blobs/storage-blob-container-delete.md)</br></br>[Delete blobs](../blobs/storage-blob-delete.md) | |
| Copy | [Overview of copy operations](../blobs/storage-blob-copy.md)</br></br>[Copy a blob from a source object URL](../blobs/storage-blob-copy-url-dotnet.md)</br></br>[Copy a blob with asynchronous scheduling](../blobs/storage-blob-copy-async-dotnet.md) | |
| Lease | [Create and manage container leases](../blobs/storage-blob-container-lease.md)</br></br>[Create and manage blob leases](../blobs/storage-blob-lease.md) | |
| Properties and metadata | [Manage container properties and metadata](../blobs/storage-blob-container-properties-metadata.md)</br></br>[Manage blob properties and metadata](../blobs/storage-blob-properties-metadata.md)| |
| Index tags | [Use blob index tags to manage and find data](../blobs/storage-blob-tags.md) | |
| Snapshots | [Create and manage a blob snapshot](../blobs/snapshots-manage-dotnet.md) | |
| Blob versions | [Create and list blob versions](../blobs/versions-manage-dotnet.md) | |
| Access tiers | [Set or change a block blob's access tier](../blobs/storage-blob-use-access-tier-dotnet.md) | |
| Append blob | [Append data to an append blob](../blobs/storage-blob-append.md) | |
| Batching | | [Delete several blobs in one request](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs.Batch/samples/Sample03b_BatchingAsync.cs#L22)</br></br>[Set several blob access tiers in one request](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/storage/Azure.Storage.Blobs.Batch/samples/Sample03b_BatchingAsync.cs#L56)</br></br>[Fine-grained control in a batch request](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/storage/Azure.Storage.Blobs.Batch/samples/Sample03b_BatchingAsync.cs#L90)</br></br>[Catch errors from a failed sub-operation](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/storage/Azure.Storage.Blobs.Batch/samples/Sample03b_BatchingAsync.cs#L136) |
| Troubleshooting | | [Trigger a recoverable error using a container client](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01b_HelloWorldAsync.cs#L166) |

## Data Lake Storage samples

The following table links to Data Lake Storage samples that use .NET client libraries:

| Topic | Samples on GitHub |
|-------|-------------------|
| Authentication | [Authenticate using an Active Directory token](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample02_Auth.cs#L164)</br>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample02_Auth.cs#L79)</br>[Authenticate using a shared access signature (SAS)](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample02_Auth.cs#L114) |
| File system | [Create a file using a file system client](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L22)</br>[Get properties on a file and a directory](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L560)</br>[Rename a file and a directory](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L511) |
| Directory | [Create a directory](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L93)</br>[Create a file using a directory client](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L55)</br>[List directories](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L275)</br>[Traverse files and directories](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L318) |
| File | [Upload a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L126)</br>[Upload by appending to a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L169)</br>[Download a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L224)</br>[Set and get a file access control list](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L468)</br>[Set and get permissions of a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L426) |
| Troubleshooting | [Trigger a recoverable error](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples/Sample01b_HelloWorldAsync.cs#L389)

## Azure File samples

The following table links to Azure Files samples that use .NET client libraries:

| Topic | Samples on GitHub |
|-------|-------------------|
| Authentication | [Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample02_Auth.cs#L24)</br>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample02_Auth.cs#L52)</br>[Authenticate using a shared access signature (SAS))](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample02_Auth.cs#L86) |
| File shares | [Create a share and upload a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample01b_HelloWorldAsync.cs#L21)</br>[Download a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample01b_HelloWorldAsync.cs#L68)</br>[Traverse files and directories](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample01b_HelloWorldAsync.cs#L107) |
| Troubleshooting | [Authenticate using a shared access signature (SAS))](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples/Sample02_Auth.cs#L86) |

## Queue samples

The following table links to Azure Queues samples that use .NET client libraries:

| Topic | Samples on GitHub |
|-------|-------------------|
| Authentication | [Authenticate using Microsoft Entra ID](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L167)</br>[Authenticate using a connection string](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample02_Auth.cs#L24)</br>[Authenticate using a shared key credential](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample02_Auth.cs#L52)</br>[Authenticate using a shared access signature (SAS))](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample02_Auth.cs#L86)</br>[Authenticate using an Active Directory token](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample02_Auth.cs#L140) |
| Queue | [Create a queue and add a message](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L24) |
| Message | [Receive and process messages](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L61)</br>[Peek at messages](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L90)</br>[Receive messages and update visibility timeout](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L115) |
| Troubleshooting | [Trigger a recoverable error using a queue client](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples/Sample01b_HelloWorldAsync.cs#L188) |

## Table samples

The following list links to Azure Table Storage samples that use .NET client libraries:

- [Authentication](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample0Auth.md)
- [Create and delete tables](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample1CreateDeleteTables.md)
- [Create and delete entities](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample2CreateDeleteEntities.md)
- [Query tables](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample3QueryTables.md)
- [Query entities](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample4QueryEntities.md)
- [Update and upsert table entities](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample5UpdateUpsertEntities.md)
- [Transactional batch operations](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample6TransactionalBatch.md)
- [Customizing serialization](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/tables/Azure.Data.Tables/samples/Sample7Serialization.md)

Samples for deprecated client libraries are available at [Azure Table Storage samples for .NET](https://github.com/Azure-Samples/storage-table-dotnet-getting-started/tree/master/TableStorage).

## Azure code sample libraries

To view the complete .NET sample libraries, go to:

- [Azure blob code samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)
- [Azure Data Lake code samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/samples)
- [Azure Files code samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.Shares/samples)
- [Azure queue code samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples)

You can browse and clone the GitHub repository for each library.

## Getting started guides

See the following articles for instructions on how to install and get started with the Azure Storage client libraries.

- [Quickstart: Azure Blob Storage client library for .NET](../blobs/storage-quickstart-blobs-dotnet.md)
- [Quickstart: Azure Queue Storage client library for .NET](../queues/storage-quickstart-queues-dotnet.md)
- [Getting Started with Azure Table Service in .NET](../../cosmos-db/tutorial-develop-table-dotnet.md)
- [Develop for Azure Files with .NET](../files/storage-dotnet-how-to-use-files.md)

## Next steps

For information on samples for other languages:

- Java: [Azure Storage samples using Java](storage-samples-java.md)
- Python: [Azure Storage samples using Python](storage-samples-python.md)
- JavaScript/Node.js: [Azure Storage samples using JavaScript](storage-samples-javascript.md)
- C++: [Azure Storage samples using C++](storage-samples-c-plus-plus.md)
- All other languages: [Azure Storage samples](storage-samples.md)
