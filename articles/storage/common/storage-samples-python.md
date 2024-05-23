---
title: Azure Storage samples using Python
titleSuffix: Azure Storage
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the Python storage client libraries.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/23/2024
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: sample
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---

# Azure Storage samples using Python client libraries

This article provides an overview of code sample scenarios found in our developer guides and samples repository. Click on the links to view the corresponding samples, either in our developer guides or in GitHub repositories. 

Developer guides are collections of articles that provide detailed information and code examples for specific scenarios related to Azure Storage services. To learn more about the Blob Storage developer guide for Python, see [Get started with Azure Blob Storage and Python](../blobs/storage-blob-python-get-started.md).

> [!NOTE]
> These samples use the latest [Azure Storage Python v12 library](/python/api/overview/azure/storage). For legacy v2.1 code, see [Azure Storage: Getting Started with Azure Storage in Python](https://github.com/Azure-Samples/storage-blob-python-getting-started) in the GitHub repository.

## Blob samples

The following table links to Azure Blob Storage developer guides and samples that use Python client libraries:

| Topic | Developer guide | Samples on GitHub |
|-------|-----------------|----------------------|
| Authentication/authorization | [Authorize access and connect to Blob Storage](../blobs/storage-blob-python-get-started.md#authorize-access-and-connect-to-blob-storage)</br></br>[Create a user delegation SAS for a blob](../blobs/storage-blob-user-delegation-sas-create-python.md)</br></br>[Create a service SAS for a blob](../blobs/sas-service-create-python.md)</br></br>[Create an account SAS](storage-account-sas-create-python.md) | [Create blob service client using Azure Identity](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L125)</br></br>[Create blob service client using a connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L45)</br></br>[Create blob service client using a shared access key](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L66)</br></br>[Create blob client from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L75)</br></br>[Create blob client SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L80)</br></br>[Create blob service client using ClientSecretCredential](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L88)</br></br>[Create SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L110) |
| Create container | [Create a container](../blobs/storage-blob-container-create-python.md) | [Create container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L82)</br></br>[Create container client using SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L45)</br></br>[Create container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L53) |
| Upload | [Upload a blob](../blobs/storage-blob-upload-python.md) | [Upload a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L69)</br></br>[Upload blob to container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L183) |
| Download | [Download a blob](../blobs/storage-blob-download-python.md) | [Download a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L75) |
| List | [List containers](../blobs/storage-blob-containers-list-python.md)</br></br>[List blobs](../blobs/storage-blobs-list-python.md) | [List containers](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L90)</br></br>[List blobs in container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L190) |
| Delete | [Delete containers](../blobs/storage-blob-container-delete-python.md)</br></br>[Delete blobs](../blobs/storage-blob-delete-python.md) | [Delete container using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L103)</br></br>[Delete container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L62)</br></br>[Delete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L81)</br></br>[Delete multiple blobs](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L133)</br></br>[Undelete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L100) |
| Copy | [Overview of copy operations](../blobs/storage-blob-copy-python.md)</br></br>[Copy a blob from a source object URL](../blobs/storage-blob-copy-url-python.md)</br></br>[Copy a blob with asynchronous scheduling](../blobs/storage-blob-copy-async-python.md) | [Copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L193)</br></br>[Abort copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L205) |
| Lease | [Create and manage container leases](../blobs/storage-blob-container-lease-python.md)</br></br>[Create and manage blob leases](../blobs/storage-blob-lease-python.md) | [Acquire lease on container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L81)</br></br>[Acquire lease on blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L167) |
| Properties and metadata | [Manage container properties and metadata](../blobs/storage-blob-container-properties-metadata-python.md)</br></br>[Manage blob properties and metadata](../blobs/storage-blob-properties-metadata-python.md)| [Get container properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L57)</br></br>[Set container metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L102)</br></br>[Get blob properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L105) |
| Index tags | [Use blob index tags to manage and find data](../blobs/storage-blob-tags-python.md) | |
| Access tiers | [Set or change a block blob's access tier](../blobs/storage-blob-use-access-tier-python.md) | |
| Blob service | | [Get blob service account info](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L30)</br></br>[Set blob service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L41)</br></br>[Get blob service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L61)</br></br>[Get blob service stats](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L71) |
| Access policy | | [Set container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L129)</br></br>[Get container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L142) |

## Data Lake Storage samples

The following table links to Azure Data Lake Storage samples that use Python client libraries:

| Topic | Samples on GitHub |  
|---|---|  
| Data Lake service | [Create Data Lake service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L84) |  
| File system | [Create file system client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L94)<br>[Delete file system](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L101) |  
| Directory | [Create directory client](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L33)<br>[Get directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L38)<br>[Set directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L42)<br>[Rename directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L52)<br>[Get directory properties](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L60)<br>[Delete directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L67) |  
| File | [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L39)<br>[Create file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L72)<br>[Get file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L38)<br>[Set file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L58)<br>[Append data to file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L52)<br>[Read data from file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L67) | 

## Azure File samples

The following table links to Azure File samples that use Python client libraries:

| Topic | Samples on GitHub |  
| --- | --- |  
| Authentication | [Create share service client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L42)<br>[Create share service client from account and access key](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L49)<br>[Generate SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L59) |  
| File service | [Set service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L39)<br>[Get service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L68)<br>[Create shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L77)<br>[List shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L81)<br>[Delete shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L91) |  
| File share | [Create share client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L54)<br>[Get share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L96)<br>[Create share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L40)<br>[Create share snapshot](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L45)<br>[Delete share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L49)<br>[Set share quota](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L63)<br>[Set share metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L68)<br>[Get share properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L47) |  
| Directory | [Create directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L45)<br>[Upload file to directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L49)<br>[Delete file from directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L55)<br>[Delete directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L60)<br>[Create subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L80)<br>[List directories and files](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L96)<br>[Delete subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L104)<br>[Get subdirectory client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L121)<br>[List files in directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L127) |  
| File | [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L65)<br>[Create file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L48)<br>[Upload file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L54)<br>[Download file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L60)<br>[Delete file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L67)<br>[Copy file from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L101) |  

## Queue samples

The following table links to Azure Queues samples that use Python client libraries:

| Topic | Samples on GitHub |  
|-------|---------------------|  
| Authentication | [Authenticate using connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L50)<br>[Create queue service client token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L69)<br>[Create queue client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L35)<br>[Generate queue client SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L61) |  
| Queue service | [Create queue service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L60)<br>[Set queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L35)<br>[Get queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L67)<br>[Create queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L76)<br>[Delete queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L94) |  
| Queue | [Create queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L72)<br>[Set queue metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L95)<br>[Get queue properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L100)<br>[Create queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L45)<br>[Delete queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L62)<br>[List queues](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L81)<br>[Get queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L103) |  
| Message | [Send messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L117)<br>[Receive messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L125)<br>[Peek message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L258)<br>[Update message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L283)<br>[Delete message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L226)<br>[Clear messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L234)<br>[Set message access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L47) |  

## Table samples

The following list links to Azure Table samples that use Python client libraries:

- [Instantiate a table client](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_create_client.py)
- [Creating and deleting a table in a storage account](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_create_delete_table.py)
- [Inserting and deleting individual entities in a table](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_insert_delete_entities.py)
- [Querying tables in a storage account](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_query_tables.py)
- [Updating, upserting, and merging entities](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_update_upsert_merge_entities.py)
- [Committing many requests in a single batch](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_batching.py)
- [Copying a table between Tables Storage and Blob Storage](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_copy_table.py)
- [Getting an entity's Etag and timestamp](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/tables/azure-data-tables/samples/sample_get_entity_etag_and_timestamp.py)

Samples for deprecated client libraries are available at [Azure Table Storage samples for Python](https://github.com/Azure-Samples/storage-table-python-getting-started/tree/master).

## Azure code sample libraries

To view the complete Python sample libraries, go to:

- [Azure Blob code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob/samples)
- [Azure Data Lake code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Azure Files code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-share/samples)
- [Azure Queue code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue/samples)

You can browse and clone the GitHub repository for each library.

## Getting started guides

Check out the following guides if you're looking for instructions on how to install and get started with the Azure Storage client libraries.

- [Quickstart: Azure Blob Storage client library for Python](../blobs/storage-quickstart-blobs-python.md)
- [Quickstart: Azure Queue Storage client library for Python](../queues/storage-quickstart-queues-python.md)
- [Getting Started with Azure Table Service in Python](../../cosmos-db/table-storage-how-to-use-python.md)
- [Develop for Azure Files with Python](../files/storage-python-how-to-use-file-storage.md)

## Next steps

For information on samples for other languages:

- .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
- Java: [Azure Storage samples using Java](storage-samples-java.md)
- JavaScript/Node.js: [Azure Storage samples using JavaScript](storage-samples-javascript.md)
- C++: [Azure Storage samples using C++](storage-samples-c-plus-plus.md)
- All other languages: [Azure Storage samples](storage-samples.md)
