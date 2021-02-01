---
title: Changed and deleted blobs
titleSuffix: Azure Cognitive Search
description: After an initial search index build that imports from Azure Blob storage, subsequent indexing can pick up just those blobs that are changed or deleted. This article explains the details.

manager: nitinme
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/25/2020
---

# How to set up change and deletion detection for blobs in Azure Cognitive Search indexing

After an initial search index is created, you might want to configure subsequent indexer jobs to pick up just those documents that have been created or deleted since the initial run. For search content that originates from Azure Blob storage, change detection occurs automatically when you use a schedule to trigger indexing. By default, the service reindexes only the changed blobs, as determined by the blob's `LastModified` timestamp. In contrast with other data sources supported by search indexers, blobs always have a timestamp, which eliminates the need to set up a change detection policy manually.

Although change detection is a given, deletion detection is not. If you want to detect deleted documents, make sure to use a "soft delete" approach. If you delete the blobs outright, corresponding documents will not be removed from the search index.

There are two ways to implement the soft delete approach. Both are described below.

## Native blob soft delete (preview)

> [!IMPORTANT]
> Support for native blob soft delete is in preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [REST API version 2020-06-30-Preview](./search-api-preview.md) provides this feature. There is currently no portal or .NET SDK support.

> [!NOTE]
> When using the native blob soft delete policy the document keys for the documents in your index must either be a blob property or blob metadata.

In this method you will use the [native blob soft delete](../storage/blobs/soft-delete-blob-overview.md) feature offered by Azure Blob storage. If native blob soft delete is enabled on your storage account, your data source has a native soft delete policy set, and the indexer finds a blob that has been transitioned to a soft deleted state, the indexer will remove that document from the index. The native blob soft delete policy is not supported when indexing blobs from Azure Data Lake Storage Gen2.

Use the following steps:

1. Enable [native soft delete for Azure Blob storage](../storage/blobs/soft-delete-blob-overview.md). We recommend setting the retention policy to a value that's much higher than your indexer interval schedule. This way if there's an issue running the indexer or if you have a large number of documents to index, there's plenty of time for the indexer to eventually process the soft deleted blobs. Azure Cognitive Search indexers will only delete a document from the index if it processes the blob while it's in a soft deleted state.

1. Configure a native blob soft deletion detection policy on the data source. An example is shown below. Since this feature is in preview, you must use the preview REST API.

1. Run the indexer or set the indexer to run on a schedule. When the indexer runs and processes the blob the document will be removed from the index.

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

### Reindexing un-deleted blobs (using native soft delete policies)

If you delete a blob from Azure Blob storage with native soft delete enabled on your storage account, the blob will transition to a soft deleted state, giving you the option to un-delete that blob within the retention period. If you reverse a deletion after the indexer processed it, the indexer will not always index the restored blob. This is because the indexer determines which blobs to index based on the blob's `LastModified` timestamp. When a soft deleted blob is un-deleted, its `LastModified` timestamp does not get updated, so if the indexer has already processed blobs with more recent `LastModified` timestamps, it won't reindex the un-deleted blob. 

To make sure that an un-deleted blob is reindexed, you will need to update the blob's `LastModified` timestamp. One way to do this is by resaving the metadata of that blob. You don't need to change the metadata, but resaving the metadata will update the blob's `LastModified` timestamp so that the indexer knows that it needs to reindex this blob.

## Soft delete using custom metadata

In this method you will use a blob's metadata to indicate when a document should be removed from the search index. This method requires two separate actions, deleting the search document from the index, followed by blob deletion in Azure Storage.

Use the following steps:

1. Add a custom metadata key-value pair to the blob to indicate to Azure Cognitive Search that it is logically deleted.

1. Configure a soft deletion column detection policy on the data source. An example is shown below.

1. Once the indexer has processed the blob and deleted the document from the index, you can delete the blob in Azure Blob storage.

For example, the following policy considers a blob to be deleted if it has a metadata property `IsDeleted` with the value `true`:

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

### Reindexing un-deleted blobs (using custom metadata)

After an indexer processes a deleted blob and removes the corresponding search document from the index, it won't revisit that blob if you restore it later if the blob's `LastModified` timestamp is older than the last indexer run.

If you would like to reindex that document, change the `"softDeleteMarkerValue" : "false"` for that blob and rerun the indexer.

## Help us make Azure Cognitive Search better

If you have feature requests or ideas for improvements, provide your input on [UserVoice](https://feedback.azure.com/forums/263029-azure-search/). If you need help using the existing feature, post your question on [Stack Overflow](https://stackoverflow.microsoft.com/questions/tagged/18870).

## Next steps

* [Indexers in Azure Cognitive Search](search-indexer-overview.md)
* [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
* [Blob indexing overview](search-blob-storage-integration.md)