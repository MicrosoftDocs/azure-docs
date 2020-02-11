---
title: Azure Storage samples using Python | Microsoft Docs
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the Python storage client libraries.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 02/11/2020
ms.service: storage
ms.subservice: common
ms.topic: sample
---

# Azure Storage samples using Python

The following tables provide an overview of our samples repository and the scenarios covered in each sample. Click on the links to view the corresponding sample code in GitHub.

> [!NOTE]
> These samples use the latest Azure Storage .NET v12 library. For legacy v2.1 code, see [Azure Storage: Getting Started with Azure Storage in Python](https://github.com/Azure-Samples/storage-blob-python-getting-started) in the GitHub repository.

## Blob samples

| Authorization | &nbsp; |
|---------------|--------|
| [Blob service client authorization from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L45) | [Container client authorization from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L50) |
| [Blob client authorization from connection string blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L56) | [Create blob service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L66) |
| [Create blob client from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L75) | [Create blob client SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L80) |
| [Create blob service client using ClientSecretCredential](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L88) | [Create SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L110) |
| [Create blob service client using DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L125) | [Create blob snapshot](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L56) |

| Blob service | &nbsp; |
|--------------|--------|
| [Get Blob Service account info](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L30) | [Set Blob Service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L41) |
| [Get Blob Service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L61) | [Get Blob Service stats](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L71) |
| [Create container using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L82) | [List containers](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L90) |
| [Delete container using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L103) | [Get container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L117) |
| [Get blob client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L130) | &nbsp; |

| Container | &nbsp; |
|-----------|--------|
| [Create container client from service](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L35) | [Create container client SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L44) |
| [Create container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L52) | [Get container properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L56) |
| [Delete container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L61) | [Acquire lease on container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L80) |
| [Set container metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L101) | [Set container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L128) |
| [Get container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L141) | [Generate SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L145) |
| [Create container client SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L158) | [Upload blob to container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L182) |
| [List blobs in container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L189) | [Get blob client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L213) |

| Blob | &nbsp; |
|------|--------|
| [Upload a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L68) | [Download a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L74) |
| [Delete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L80) | [Undelete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L100) | [Get blob properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L105) |
| [Delete multiple blobs](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L133) | [Copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L193) |
| [Abort copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L205) | [Acquire lease on blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L167) |

## Data Lake Storage Gen2 samples

<!-- https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/ -->

<!-- new row
| [](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/) | [](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/) |
-->

| Data Lake service | &nbsp; |
|-------------------|--------|
| [Create Data Lake service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L64) | &nbsp; |

| File system | &nbsp; |
|-------------|--------|
| [Create file system client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L74) | [Delete file system](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L81) |

| Directory | &nbsp; |
|-----------|--------|
| [Create directory client](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L14) | [Get directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L19) |
| [Set directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L23) | [Rename directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L19) |
| [Get directory properties](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L25) | [Delete directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L29) |

| File | &nbsp; |
|------|--------|
| [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L13) | [Create file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L45) |
| [Get file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L35) | [Set file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L38) |
| [Append data to file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L18) | [Read data from file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L29) |

## Azure Files samples

| Authorization | &nbsp; |
|---------------|--------|
| [Create share service client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L42) | [Create share service client from account and access key](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L49) |
| [Generate SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L59) | &nbsp; |

| File service | &nbsp; |
|--------------|--------|
| [Set service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L39) | [Get service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L68) |
| [Create shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L77) | [List shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L81) |
| [Delete shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L91) |

| File share | &nbsp; |
|------------|--------|
| [Create share client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L52) | [Get share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L96) |
| [Create share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L39) | [Create share snapshot](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L43) |
| [Delete share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L47) | [Set share quota](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L61) |
| [Set share metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L66) | [Get share properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L47) |

| Directory | &nbsp; |
|-----------|--------|
| [Create directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L45) | [Upload file to directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L49) |
| [Delete file in directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L55) | [Delete directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L60) |
| [Create subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L80) | [List directories and files](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L96) |
| [Delete subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L104) | [Get subdirectory client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L121) |
| [List files in directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L87) | &nbsp; |

| File | &nbsp; |
|------|--------|
| [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L65) | [Create file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L48) |
| [Upload file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L54) | [Download file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L60) |
| [Delete file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L67) | [Copy file from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L101) |

## Queue samples

| Authorization | &nbsp; |
|---------------|--------|
| [Authorization from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L50) | [Create queue service client token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L69) |
| [Create queue client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L35) | [Generate queue client SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L61) |

| Queue service | &nbsp; |
|---------------|--------|
| [Create queue service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L60) | [Set queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L35) |
| [Get queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L67) | [Create queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L76) |
| [Delete queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L94) |

| Queue | &nbsp; |
|-------|--------|
| [Create queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L72) | [Set queue metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L95) |
| [Get queue properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L100) | [Create queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L45) |
| [Delete queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L62) | [List queues](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L81) | [Get queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L103) |


| Message | &nbsp; |
|---------|--------|
 [Send messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L117) | [Receive messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L125) |
| [Peek message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L197) | [Update message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L222) |
| [Delete message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L165) | [Clear messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L173) |
| [Set message access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L47) | &nbsp; |


## Table samples (SDK v2.1)

| &nbsp; | &nbsp; |
|--------|--------|
| [Create Table](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L46) | [Delete Entity/Table](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L79) |
| [Insert/Merge/Replace Entity](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L57) | [Query Entities](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L62) |
| [Query Tables](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py) | [Table ACL/Properties](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_advanced_samples.py#L138) |
| [Update Entity](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L68) | &nbsp; |

## Azure code sample libraries

To view the complete sample libraries, go to:

* [Azure blob code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob/samples)
* [Azure file DataLake code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
* [Azure file share code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-share/samples)
* [Azure queue code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue/samples)

You can browse and clone the GitHub repository for each library.

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage client libraries.

* [Getting Started with Azure Blob Service in Python](../blobs/storage-quickstart-blobs-python.md)
* [Getting Started with Azure Queue Service in Python](../queues/storage-quickstart-queues-python.md)
* [Getting Started with Azure Table Service in Python](../../cosmos-db/table-storage-how-to-use-python.md)
* [Getting Started with Azure File Service in Python](../files/storage-python-how-to-use-file-storage.md)

## Next steps

For information on samples for other languages:

* .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
* Java: [Azure Storage samples using Java](storage-samples-java.md)
* JavaScript/Node.js: [Azure Storage samples using JavaScript](storage-samples-javascript.md)
* All other languages: [Azure Storage samples](storage-samples.md)
