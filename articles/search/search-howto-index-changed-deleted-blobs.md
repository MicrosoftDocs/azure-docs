---
title: Changed and deleted blobs
titleSuffix: Azure AI Search
description: Indexers that index from Azure Storage can pick up new and changed content automatically. This article describes the strategies.
author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/09/2022
---

# Change and delete detection using indexers for Azure Storage in Azure AI Search

After an initial search index is created, you might want subsequent indexer jobs to only pick up new and changed documents. For indexed content that originates from Azure Storage, change detection occurs automatically because indexers keep track of the last update using the built-in timestamps on objects and files in Azure Storage.

Although change detection is a given, deletion detection isn't. An indexer doesn't track object deletion in data sources. To avoid having orphan search documents, you can implement a "soft delete" strategy that results in deleting search documents first, with physical deletion in Azure Storage following as a second step.

There are two ways to implement a soft delete strategy:

+ [Native blob soft delete (preview)](#native-blob-soft-delete-preview), applies to Blob Storage only
+ [Soft delete using custom metadata](#soft-delete-using-custom-metadata)

## Prerequisites

+ Use an Azure Storage indexer for [Blob Storage](search-howto-indexing-azure-blob-storage.md), [Table Storage](search-howto-indexing-azure-tables.md), [File Storage](search-howto-indexing-azure-tables.md), or [Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)

+ Use consistent document keys and file structure. Changing document keys or directory names and paths (applies to ADLS Gen2) breaks the internal tracking information used by indexers to know which content was indexed, and when it was last indexed.

> [!NOTE]
> ADLS Gen2 allows directories to be renamed. When a directory is renamed, the timestamps for the blobs in that directory do not get updated. As a result, the indexer will not re-index those blobs. If you need the blobs in a directory to be reindexed after a directory rename because they now have new URLs, you will need to update the `LastModified` timestamp for all the blobs in the directory so that the indexer knows to re-index them during a future run. The virtual directories in Azure Blob Storage cannot be changed, so they do not have this issue.

## Native blob soft delete (preview)

For this deletion detection approach, Azure AI Search depends on the [native blob soft delete](../storage/blobs/soft-delete-blob-overview.md) feature in Azure Blob Storage to determine whether blobs have transitioned to a soft deleted state. When blobs are detected in this state, a search indexer uses this information to remove the corresponding document from the index.

> [!IMPORTANT]
> Support for native blob soft delete is in preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [REST API version 2020-06-30-Preview](./search-api-preview.md) provides this feature. There's currently no .NET SDK support.

### Requirements for native soft delete

+ Blobs must be in an Azure Blob Storage container. The Azure AI Search native blob soft delete policy isn't supported for blobs in ADLS Gen2.

+ [Enable soft delete for blobs](../storage/blobs/soft-delete-blob-enable.md).

+ Document keys for the documents in your index must be mapped to either be a blob property or blob metadata, such as "metadata_storage_path".

+ You must use the preview REST API (`api-version=2020-06-30-Preview`), or the indexer Data Source configuration in the Azure portal, to configure support for soft delete.

+ [Blob versioning](../storage/blobs/versioning-overview.md) must not be enabled in the storage account. Otherwise, native soft delete isn't supported by design.



### Configure native soft delete

In Blob storage, when enabling soft delete per the requirements, set the retention policy to a value that's much higher than your indexer interval schedule. If there's an issue running the indexer, or if you have a large number of documents to index, there's plenty of time for the indexer to eventually process the soft deleted blobs. Azure AI Search indexers will only delete a document from the index if it processes the blob while it's in a soft deleted state.

In Azure AI Search, set a native blob soft deletion detection policy on the data source. You can do this either from the Azure portal or by using preview REST API (`api-version=2020-06-30-Preview`). The following instructions explain how to set the delete detection policy in Azure portal or through REST APIs.

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the Azure AI Search service Overview page, go to **New Data Source**, a visual editor for specifying a data source definition. 

   The following screenshot shows where you can find this feature in the portal. 

   :::image type="content" source="media/search-indexing-changed-deleted-blobs/new-data-source.png" alt-text="Screenshot of data source configuration in Import Data wizard." border="true":::

1. On the **New Data Source** form, fill out the required fields, select the **Track deletions** checkbox and choose **Native blob soft delete**. Then hit **Save** to enable the feature on Data Source creation.

   :::image type="content" source="media/search-indexing-changed-deleted-blobs/native-soft-delete.png" alt-text="Screenshot of portal data source native soft delete." border="true":::

### [**REST**](#tab/rest-api)

Set the soft deletion detection policy in the data source definition. Specify the preview API version when creating or updating the data source.

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

[Run the indexer](/rest/api/searchservice/run-indexer) or set the indexer to run [on a schedule](search-howto-schedule-indexers.md). When the indexer runs and processes a blob having a soft delete state, the corresponding search document will be removed from the index.

---

### Reindex undeleted blobs using native soft delete policies

If you restore a soft deleted blob in Blob storage, the indexer won't always reindex it. This is because the indexer uses the blob's `LastModified` timestamp to determine whether indexing is needed. When a soft deleted blob is undeleted, its `LastModified` timestamp doesn't get updated, so if the indexer has already processed blobs with more recent `LastModified` timestamps, it won't reindex the undeleted blob. 

To make sure that an undeleted blob is reindexed, you'll need to update the blob's `LastModified` timestamp. One way to do this is by resaving the metadata of that blob. You don't need to change the metadata, but resaving the metadata will update the blob's `LastModified` timestamp so that the indexer knows to pick it up.

<a name="soft-delete-using-custom-metadata"></a>

## Soft delete strategy using custom metadata

This method uses custom metadata to indicate whether a search document should be removed from the index. It requires two separate actions: deleting the search document from the index, followed by file deletion in Azure Storage.

There are steps to follow in both Azure Storage and Azure AI Search, but there are no other feature dependencies. 

1. In Azure Storage, add a custom metadata key-value pair to the file to indicate the file is flagged for deletion. For example, you could name the property "IsDeleted", set to false. When you want to delete the file, change it to true.

1. In Azure AI Search, edit the data source definition to include a "dataDeletionDetectionPolicy" property. For example, the following policy considers a file to be deleted if it has a metadata property `IsDeleted` with the value `true`:

    ```http
    PUT https://[service name].search.windows.net/datasources/file-datasource?api-version=2020-06-30
    {
        "name" : "file-datasource",
        "type" : "azurefile",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-share", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
            "softDeleteColumnName" : "IsDeleted",
            "softDeleteMarkerValue" : "true"
        }
    }
    ```

1. Run the indexer. Once the indexer has processed the file and deleted the document from the search index, you can then delete the physical file in Azure Storage.

## Reindex undeleted blobs and files 

You can reverse a soft-delete if the original source file still physically exists in Azure Storage. 

1. Change the `"softDeleteMarkerValue" : "false"` on the blob or file in Azure Storage.

1. Check the blob or file's `LastModified` timestamp to make it's newer than the last indexer run. You can force an update to the current date and time by resaving the existing metadata.

1. Run the indexer.

## Next steps

+ [Indexers in Azure AI Search](search-indexer-overview.md)
+ [How to configure a blob indexer](search-howto-indexing-azure-blob-storage.md)
+ [Blob indexing overview](search-blob-storage-integration.md)
