---
title: Azure Storage samples using Python
titleSuffix: Azure Storage
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the Python storage client libraries.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 12/21/2022
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: sample
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---

# Azure Storage samples using v12 Python client libraries

The following tables provide an overview of our samples repository and the scenarios covered in each sample. Select the links to view the corresponding sample code in GitHub.

> [!NOTE]
> These samples use the latest [Azure Storage .NET v12 library](/python/api/overview/azure/storage). For legacy v2.1 code, see [Azure Storage: Getting Started with Azure Storage in Python](https://github.com/Azure-Samples/storage-blob-python-getting-started) in the GitHub repository.

## Blob samples

### Authentication

:::row:::
   :::column span="":::
      [Create blob service client using a connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L45)
   :::column-end:::
   :::column span="":::
      [Create container client using a connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L50)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create blob client using a connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L56)
   :::column-end:::
   :::column span="":::
      [Create blob service client using a shared access key](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L66)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create blob client from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L75)
   :::column-end:::
   :::column span="":::
      [Create blob client SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L80)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create blob service client using ClientSecretCredential](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L88)
   :::column-end:::
   :::column span="":::
      [Create SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L110)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create blob service client using Azure Identity](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_authentication.py#L125)
   :::column-end:::
   :::column span="":::
      [Create blob snapshot](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L56)
   :::column-end:::
:::row-end:::

### Blob service

:::row:::
   :::column span="":::
      [Get blob service account info](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L30)
   :::column-end:::
   :::column span="":::
      [Set blob service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L41)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get blob service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L61)
   :::column-end:::
   :::column span="":::
      [Get blob service stats](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L71)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create container using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L82)
   :::column-end:::
   :::column span="":::
      [List containers](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L90)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete container using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L103)
   :::column-end:::
   :::column span="":::
      [Get container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L117)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Get blob client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_service.py#L130)
   :::column-end:::
:::row-end:::

### Container

:::row:::
   :::column span="":::
      [Create container client from service](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L36)
   :::column-end:::
   :::column span="":::
      [Create container client using SAS URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L45)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L53)
   :::column-end:::
   :::column span="":::
      [Get container properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L57)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete container using container client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L62)
   :::column-end:::
   :::column span="":::
      [Acquire lease on container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L81)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Set container metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L102)
   :::column-end:::
   :::column span="":::
      [Set container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L129)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get container access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L142)
   :::column-end:::
   :::column span="":::
      [Generate SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L146)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create container client using SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L158)
   :::column-end:::
   :::column span="":::
      [Upload blob to container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L183)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [List blobs in container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L190)
   :::column-end:::
   :::column span="":::
      [Get blob client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_containers.py#L214)
   :::column-end:::
:::row-end:::

### Blob

:::row:::
   :::column span="":::
      [Upload a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L69)
   :::column-end:::
   :::column span="":::
      [Download a blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L75)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_hello_world.py#L81)
   :::column-end:::
   :::column span="":::
      [Undelete blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L100)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get blob properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L105)
   :::column-end:::
   :::column span="":::
      [Delete multiple blobs](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L133)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L193)
   :::column-end:::
   :::column span="":::
      [Abort copy blob from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L205)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Acquire lease on blob](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-blob/samples/blob_samples_common.py#L167)
   :::column-end:::
:::row-end:::

## Data Lake Storage Gen2 samples

### Data Lake service

:::row:::
   :::column span="2":::
      [Create Data Lake service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L84)
   :::column-end:::
:::row-end:::

### File system

:::row:::
   :::column span="":::
      [Create file system client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L94)
   :::column-end:::
   :::column span="":::
      [Delete file system](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L101)
   :::column-end:::
:::row-end:::

### Directory

:::row:::
   :::column span="":::
      [Create directory client](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L33)
   :::column-end:::
   :::column span="":::
      [Get directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L38)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Set directory permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L42)
   :::column-end:::
   :::column span="":::
      [Rename directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L52)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get directory properties](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L60)
   :::column-end:::
   :::column span="":::
      [Delete directory](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_directory.py#L67)
   :::column-end:::
:::row-end:::

### File

:::row:::
   :::column span="":::
      [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L39)
   :::column-end:::
   :::column span="":::
      [Create file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L72)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L38)
   :::column-end:::
   :::column span="":::
      [Set file permissions](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control.py#L58)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Append data to file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L52)
   :::column-end:::
   :::column span="":::
      [Read data from file](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_upload_download.py#L67)
   :::column-end:::
:::row-end:::

## Azure Files samples

### Authentication

:::row:::
   :::column span="":::
      [Create share service client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L42)
   :::column-end:::
   :::column span="":::
      [Create share service client from account and access key](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L49)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Generate SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_authentication.py#L59)
   :::column-end:::
:::row-end:::

### File service

:::row:::
   :::column span="":::
      [Set service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L39)
   :::column-end:::
   :::column span="":::
      [Get service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L68)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L77)
   :::column-end:::
   :::column span="":::
      [List shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L81)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Delete shares using file service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L91)
   :::column-end:::
:::row-end:::

### File share

:::row:::
   :::column span="":::
      [Create share client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L54)
   :::column-end:::
   :::column span="":::
      [Get share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_service.py#L96)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L40)
   :::column-end:::
   :::column span="":::
      [Create share snapshot](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L45)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete share using file share client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L49)
   :::column-end:::
   :::column span="":::
      [Set share quota](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L63)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Set share metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L68)
   :::column-end:::
   :::column span="":::
      [Get share properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L47)
   :::column-end:::
:::row-end:::

### Directory

:::row:::
   :::column span="":::
      [Create directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L45)
   :::column-end:::
   :::column span="":::
      [Upload file to directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L49)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete file from directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L55)
   :::column-end:::
   :::column span="":::
      [Delete directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L60)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L80)
   :::column-end:::
   :::column span="":::
      [List directories and files](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L96)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete subdirectory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L104)
   :::column-end:::
   :::column span="":::
      [Get subdirectory client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_directory.py#L121)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [List files in directory](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_share.py#L127)
   :::column-end:::
:::row-end:::

### File

:::row:::
   :::column span="":::
      [Create file client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_hello_world.py#L65)
   :::column-end:::
   :::column span="":::
      [Create file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L48)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Upload file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L54)
   :::column-end:::
   :::column span="":::
      [Download file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L60)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L67)
   :::column-end:::
   :::column span="":::
      [Copy file from URL](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-share/samples/file_samples_client.py#L101)
   :::column-end:::
:::row-end:::

## Queue samples

### Authentication

:::row:::
   :::column span="":::
      [Authenticate using connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L50)
   :::column-end:::
   :::column span="":::
      [Create queue service client token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L69)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Create queue client from connection string](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L35)
   :::column-end:::
   :::column span="":::
      [Generate queue client SAS token](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L61)
   :::column-end:::
:::row-end:::

### Queue service

:::row:::
   :::column span="":::
      [Create queue service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_authentication.py#L60)
   :::column-end:::
   :::column span="":::
      [Set queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L35)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get queue service properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L67)
   :::column-end:::
   :::column span="":::
      [Create queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L76)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Delete queue using service client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L94)
   :::column-end:::
:::row-end:::

### Queue

:::row:::
   :::column span="":::
      [Create queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L72)
   :::column-end:::
   :::column span="":::
      [Set queue metadata](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L95)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Get queue properties](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L100)
   :::column-end:::
   :::column span="":::
      [Create queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L45)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete queue using queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_hello_world.py#L62)
   :::column-end:::
   :::column span="":::
      [List queues](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L81)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Get queue client](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_service.py#L103)
   :::column-end:::
:::row-end:::

### Message

:::row:::
   :::column span="":::
      [Send messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L117)
   :::column-end:::
   :::column span="":::
      [Receive messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L125)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Peek message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L258)
   :::column-end:::
   :::column span="":::
      [Update message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L283)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Delete message](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L226)
   :::column-end:::
   :::column span="":::
      [Clear messages](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L234)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Set message access policy](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-queue/samples/queue_samples_message.py#L47)
   :::column-end:::
:::row-end:::

## Table samples (SDK v2.1)

:::row:::
   :::column span="":::
      [Create table](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L46)
   :::column-end:::
   :::column span="":::
      [Delete entity/table](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L79)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Insert/merge/replace entity](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L57)
   :::column-end:::
   :::column span="":::
      [Query entities](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L62)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [Query tables](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py)
   :::column-end:::
   :::column span="":::
      [Table ACL/properties](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_advanced_samples.py#L138)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="2":::
      [Update entity](https://github.com/Azure-Samples/storage-table-python-getting-started/blob/master/table_basic_samples.py#L68)
   :::column-end:::
:::row-end:::

## Azure code sample libraries

To view the complete Python sample libraries, go to:

- [Azure Blob code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob/samples)
- [Azure Data Lake code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Azure Files code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-share/samples)
- [Azure Queue code samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue/samples)

You can browse and clone the GitHub repository for each library.

## Getting started guides

Check out the following guides if you're looking for instructions on how to install and get started with the Azure Storage client libraries.

- [Getting Started with Azure Blob Service in Python](../blobs/storage-quickstart-blobs-python.md)
- [Getting Started with Azure File Service in Python](../files/storage-python-how-to-use-file-storage.md)
- [Getting Started with Azure Queue Service in Python](../queues/storage-quickstart-queues-python.md)
- [Getting Started with Azure Table Service in Python](../../cosmos-db/table-storage-how-to-use-python.md)

## Next steps

For information on samples for other languages:

- .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
- Java: [Azure Storage samples using Java](storage-samples-java.md)
- JavaScript/Node.js: [Azure Storage samples using JavaScript](storage-samples-javascript.md)
- C++: [Azure Storage samples using C++](storage-samples-c-plus-plus.md)
- All other languages: [Azure Storage samples](storage-samples.md)
