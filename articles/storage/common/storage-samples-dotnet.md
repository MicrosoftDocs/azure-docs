---
title: Azure Storage samples using .NET | Microsoft Docs
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the .NET storage client libraries.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 09/06/2019
ms.service: storage
ms.subservice: common
ms.topic: sample
---

# Azure Storage samples using .NET

The following table provides an overview of our samples repository and the scenarios covered in each sample. Click on the links to view the corresponding sample code in GitHub.

> [!NOTE]
> These samples use the latest Azure Storage .NET v12 library. For legacy v11 code, see [Azure Blob Storage Samples for .NET](https://github.com/Azure-Samples/storage-blob-dotnet-getting-started) in the GitHub repository.

## Blob samples

| &nbsp; | &nbsp; |
|--------|--------|
| [Upload a file to a blob](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L22) | [Download a blob to a file](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L64) |
| [Download our sample image](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L107) | [List all the blobs in a container](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L127) |
| [Trigger a recoverable error](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L173) | [Authenticate with DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample01a_HelloWorld.cs#L210) |
| [Use a connection string to connect to a Storage account](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L27) | [Anonymously access a public blob](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L55) |
| [Use a shared key to access a Storage Account](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L91) | [Use an Active Directory token to access a Storage account](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample02_Auth.cs#L177) |
| [Delete several blobs in one request](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample03a_Batching.cs#L23) | [Set several blob access tiers in one request](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample03a_Batching.cs#L61) |
| [Exert fine-grained control over individual operations in a batch request](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample03a_Batching.cs#L99) | [Catch any errors from a failed sub-operation](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples/Sample03a_Batching.cs#L147) |

<!-- ## File samples (v11)

| **Scenario** | **Sample Code** |
|--------------|-----------------|
| Create Shares/Directories/Files | [Azure Storage .NET File Storage Sample](https://github.com/Azure/azure-storage-net/blob/master/Samples/GettingStarted/VisualStudioQuickStarts/DataFileStorage/Program.cs) |
| Delete Shares/Directories/Files | [Getting Started with Azure File Service in .NET](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/master/FileStorage/GettingStarted.cs) |
| Directory Properties/Metadata | [Azure Storage .NET File Storage Sample](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/9f12304b2f5f5472a1c87c1e21be4af5661ac043/FileStorage/Advanced.cs) |
| Download Files | [Azure Storage .NET File Storage Sample](https://github.com/Azure/azure-storage-net/blob/master/Samples/GettingStarted/VisualStudioQuickStarts/DataFileStorage/Program.cs) |
| File Properties/Metadata/Metrics | [Azure Storage .NET File Storage Sample](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/9f12304b2f5f5472a1c87c1e21be4af5661ac043/FileStorage/Advanced.cs) |
| File Service Properties | [Azure Storage .NET File Storage Sample](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/9f12304b2f5f5472a1c87c1e21be4af5661ac043/FileStorage/Advanced.cs) |
| List Directories and Files | [Azure Storage .NET File Storage Sample](https://github.com/Azure/azure-storage-net/blob/master/Samples/GettingStarted/VisualStudioQuickStarts/DataFileStorage/Program.cs) |
| List Shares | [Azure Storage .NET File Storage Sample](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/9f12304b2f5f5472a1c87c1e21be4af5661ac043/FileStorage/Advanced.cs) |
| Share Properties/Metadata/Stats | [Azure Storage .NET File Storage Sample](https://github.com/Azure-Samples/storage-file-dotnet-getting-started/blob/9f12304b2f5f5472a1c87c1e21be4af5661ac043/FileStorage/Advanced.cs) | -->

## File samples

| &nbsp; | &nbsp; |
|--------|--------|


## Queue samples (v11)

| **Scenario** | **Sample Code** |
|--------------|-----------------|
| Add Message | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/GettingStarted.cs) |
| Client-Side Encryption | [Azure Storage .NET Queue Client-Side Encryption](https://github.com/Azure/azure-storage-net/blob/master/Samples/GettingStarted/EncryptionSamples/QueueGettingStarted/Program.cs) |
| Create Queues | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/GettingStarted.cs) |
| Delete Message/Queue | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/GettingStarted.cs) |
| Peek Message | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/GettingStarted.cs) |
| Queue ACL/Metadata/Stats | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/Advanced.cs) |
| Queue Service Properties | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/Advanced.cs) |
| Update Message | [Getting Started with Azure Queue Service in .NET](https://github.com/Azure-Samples/storage-queue-dotnet-getting-started/blob/master/QueueStorage/GettingStarted.cs) |

## Table samples (v11)

| **Scenario** | **Sample Code** |
|--------------|-----------------|
| Create Table | [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114/sourcecode?fileId=123913&pathId=50196262) |
| Delete Entity/Table | [Getting Started with Azure Table Storage in .NET](https://github.com/Azure-Samples/storage-table-dotnet-getting-started/blob/master/TableStorage/BasicSamples.cs) |
| Insert/Merge/Replace Entity | [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114/sourcecode?fileId=123913&pathId=50196262) |
| Query Entities | [Getting Started with Azure Table Storage in .NET](https://github.com/Azure-Samples/storage-table-dotnet-getting-started/blob/master/TableStorage/BasicSamples.cs) |
| Query Tables | [Getting Started with Azure Table Storage in .NET](https://github.com/Azure-Samples/storage-table-dotnet-getting-started/blob/master/TableStorage/BasicSamples.cs) |
| Table ACL/Properties | [Getting Started with Azure Table Storage in .NET](https://github.com/Azure-Samples/storage-table-dotnet-getting-started/blob/master/TableStorage/AdvancedSamples.cs) |
| Update Entity | [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114/sourcecode?fileId=123913&pathId=50196262) |

## Azure Code Samples library

To view the complete sample library, go to the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=storage) library, which includes samples for Azure Storage that you can download and run locally. The Code Sample Library provides sample code in .zip format. Alternatively, you can browse and clone the GitHub repository for each sample.

[!INCLUDE [storage-dotnet-samples-include](../../../includes/storage-dotnet-samples-include.md)]

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage Client Libraries.

* [Getting Started with Azure Blob Service in .NET](../blobs/storage-dotnet-how-to-use-blobs.md)
* [Getting Started with Azure Queue Service in .NET](../storage-dotnet-how-to-use-queues.md)
* [Getting Started with Azure Table Service in .NET](../../cosmos-db/table-storage-how-to-use-dotnet.md)
* [Getting Started with Azure File Service in .NET](../storage-dotnet-how-to-use-files.md)

## Next steps

For information on samples for other languages:

* Java: [Azure Storage samples using Java](storage-samples-java.md)
* JavaScript/Node.js: [Azure Storage samples using JavaScript](storage-samples-javascript.md)
* Python: [Azure Storage samples using Python](storage-samples-python.md)
* All other languages: [Azure Storage samples](../storage-samples.md)
