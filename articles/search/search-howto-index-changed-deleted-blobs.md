---
title: Changed and deleted blobs
titleSuffix: Azure Cognitive Search
description: After an initial search index build that imports from Azure Blob Storage, subsequent indexing can pick up just those blobs that are changed or deleted. This article explains the details.

manager: nitinme
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/29/2021
---

# Change and deletion detection in blob indexing (Azure Cognitive Search)

After an initial search index is created, you might want subsequent indexer jobs to only pick up new and changed documents. For search content that originates from Azure Blob Storage or Azure Data Lake Storage Gen2, change detection occurs automatically when you use a schedule to trigger indexing. By default, the service reindexes only the changed blobs, as determined by the blob's `LastModified` timestamp. In contrast with other data sources supported by search indexers, blobs always have a timestamp, which eliminates the need to set up a change detection policy manually.

Although change detection is a given, deletion detection is not. If you want to detect deleted documents, make sure to use a "soft delete" approach. If you delete the blobs outright, corresponding documents will not be removed from the search index.

There are two ways to implement the soft delete approach:

+ Native blob soft delete (preview), described next
+ [Soft delete using custom metadata](#soft-delete-using-custom-metadata)

> [!NOTE] 
> Azure Data Lake Storage Gen2 allows directories to be renamed. When a directory is renamed the timestamps for the blobs in that directory do not get updated. As a result, the indexer will not reindex those blobs. If you need the blobs in a directory to be reindexed after a directory rename because they now have new URLs, you will need to update the `LastModified` timestamp for all the blobs in the directory so that the indexer knows to reindex them during a future run. The virtual directories in Azure Blob Storage cannot be changed so they do not have this issue.

## Native blob soft delete (preview)

For this deletion detection approach, Cognitive Search depends on the [native blob soft delete](../storage/blobs/soft-delete-blob-overview.md) feature in Azure Blob Storage to determine whether blobs have transitioned to a soft deleted state. When blobs are detected in this state, a search indexer uses this information to remove the corresponding document from the index.

> [!IMPORTANT]
> Support for native blob soft delete is in preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [REST API version 2020-06-30-Preview](./search-api-preview.md) provides this feature. There is currently no portal or .NET SDK support.

### Prerequisites

+ [Enable soft delete for blobs](../storage/blobs/soft-delete-blob-enable.md).
+ Blobs must be in an Azure Blob Storage container. The Cognitive Search native blob soft delete policy is not supported for blobs from Azure Data Lake Storage Gen2.
+ Document keys for the documents in your index must be mapped to either be a blob property or blob metadata.
+ You must use the preview REST API (`api-version=2020-06-30-Preview`) to configure support for soft delete.

### How to configure deletion detection using native soft delete

1. In Blob storage, when enabling soft delete, set the retention policy to a value that's much higher than your indexer interval schedule. This way if there's an issue running the indexer or if you have a large number of documents to index, there's plenty of time for the indexer to eventually process the soft deleted blobs. Azure Cognitive Search indexers will only delete a document from the index if it processes the blob while it's in a soft deleted state.

1. In Cognitive Search, set a native blob soft deletion detection policy on the data source. An example is shown below. Because this feature is in preview, you must use the preview REST API.

    ```http
    PUT https://[service name].search.windows.net/datasources/blob-datasource?api-version=2020-06-30-Preview
    Content-Type: application/json
    api-key: [admin key]
    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.NativeBlobSoftDeleteDeletionDetectionPolicy"
        }
    }
    ```

1. [Run the indexer](/rest/api/searchservice/run-indexer) or set the indexer to run [on a schedule](search-howto-schedule-indexers.md). When the indexer runs and processes a blob having a soft delete state, the corresponding search document will be removed from the index.

### Reindexing undeleted blobs (using native soft delete policies)

If you restore a soft deleted blob in Blob storage, the indexer will not always reindex it. This is because the indexer uses the blob's `LastModified` timestamp to determine whether indexing is needed. When a soft deleted blob is undeleted, its `LastModified` timestamp does not get updated, so if the indexer has already processed blobs with more recent `LastModified` timestamps, it won't reindex the undeleted blob. 

To make sure that an undeleted blob is reindexed, you will need to update the blob's `LastModified` timestamp. One way to do this is by resaving the metadata of that blob. You don't need to change the metadata, but resaving the metadata will update the blob's `LastModified` timestamp so that the indexer knows to pick it up.

## Soft delete using custom metadata

This method uses a blob's metadata to determine whether a search document should be removed from the index. This method requires two separate actions, deleting the search document from the index, followed by blob deletion in Azure Storage.

There are steps to follow in both Blob storage and Cognitive Search, but there are no other feature dependencies. This capability is supported in generally available APIs.

1. Add a custom metadata key-value pair to the blob to indicate to Azure Cognitive Search that it is logically deleted.

1. Configure a soft deletion column detection policy on the data source. For example, the following policy considers a blob to be deleted if it has a metadata property `IsDeleted` with the value `true`:

    ```http
    PUT https://[service name].search.windows.net/datasources/blob-datasource?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
            "softDeleteColumnName" : "IsDeleted",
            "softDeleteMarkerValue" : "true"
        }
    }
    ```

1. Once the indexer has processed the blob and deleted the document from the index, you can delete the blob in Azure Blob Storage.

### Reindexing undeleted blobs (using custom metadata)

After an indexer processes a deleted blob and removes the corresponding search document from the index, it won't revisit that blob if you restore it later if the blob's `LastModified` timestamp is older than the last indexer run.

If you would like to reindex that document, change the `"softDeleteMarkerValue" : "false"` for that blob and rerun the indexer.

## Next steps

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Blob indexing overview](search-blob-storage-integration.md)