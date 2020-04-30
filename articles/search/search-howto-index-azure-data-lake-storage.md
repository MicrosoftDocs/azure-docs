---
title: Search over Azure Data Lake Storage Gen2 (preview)
titleSuffix: Azure Cognitive Search
description: Learn how to index content and metadata in Azure Data Lake Storage Gen2. This feature is currently in public preview

manager: nitinme
author: markheff
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Indexing documents in Azure Data Lake Storage Gen2

> [!IMPORTANT] 
> Azure Data Lake Storage Gen2 support is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> You can request access to the previews by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is currently no portal or .NET SDK support.


When setting up an Azure storage account, you have the option to enable [hierarchical namespace](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-namespace). This allows the collection of content in an account to be organized into a hierarchy of directories and nested subdirectories. By enabling hierarchical namespace, you enable [Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction).

This article describes how to get started with indexing documents that are in Azure Data Lake Storage Gen2.

## Set up Azure Data Lake Storage Gen2 indexer

There are a few steps you'll need to complete to index content from Data Lake Storage Gen2.

### Step 1: Sign up for the preview

Sign up for the Data Lake Storage Gen2 indexer preview by filling out [this form](https://aka.ms/azure-cognitive-search/indexer-preview). You will receive a confirmation email once you have been accepted into the preview.

### Step 2: Follow the Azure Blob storage indexing setup steps

Once you've received confirmation that your preview sign-up was successful, you're ready to create the indexing pipeline.

You can index content and metadata from Data Lake Storage Gen2 by using the [REST API version 2019-05-06-Preview](search-api-preview.md). There is no portal or .NET SDK support at this time.

Indexing content in Data Lake Storage Gen2 is identical to indexing content in Azure Blob storage. So to understand how to set up the Data Lake Storage Gen2 data source, index, and indexer, refer to [How to index documents in Azure Blob Storage with Azure Cognitive Search](search-howto-indexing-azure-blob-storage.md). The Blob storage article also provides information about what document formats are supported, what blob metadata properties are extracted, incremental indexing, and more. This information will be the same for Data Lake Storage Gen2.

## Access control

Azure Data Lake Storage Gen2 implements an [access control model](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control) that supports both Azure role-based access control (RBAC) and POSIX-like access control lists (ACLs). When indexing content from Data Lake Storage Gen2, Azure Cognitive Search will not extract the RBAC and ACL information from the content. As a result, this information will not be included in your Azure Cognitive Search index.

If maintaining access control on each document in the index is important, it is up to the application developer to implement [security trimming](https://docs.microsoft.com/azure/search/search-security-trimming-for-azure-search).

## Change Detection

The Data Lake Storage Gen2 indexer supports change detection. This means that when the indexer runs it only reindexes the changed blobs as determined by the blob's `LastModified` timestamp.

> [!NOTE] 
> Data Lake Storage Gen2 allows directories to be renamed. When a directory is renamed the timestamps for the blobs in that directory do not get updated. As a result, the indexer will not reindex those blobs. If you need the blobs in a directory to be reindexed after a directory rename because they now have new URLs, you will need to update the `LastModified` timestamp for all the blobs in the directory so that the indexer knows to reindex them during a future run.
