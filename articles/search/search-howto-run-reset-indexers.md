---
title: Reset and run indexers
titleSuffix: Azure Cognitive Search
description: Reset an indexer, skills, or individual documents to refresh all or part of and index or knowledge store.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/08/2021
---

# How to reset and run indexers, skills, or documents

Reset APIs are used to reset [an indexer](search-indexer-overview.md), triggering a full reprocessing of data, almost as if it was the initial run. Reset APIs set the status and scope of the next indexer run, which could be either on demand invocation, or the next scheduled run.

Reset is necessary because over time, certain indexers will selectively process just the changes in the underlying data. Whether the indexer does this will vary by data source. For example, Blob storage stamps objects with datetime information, which the blob indexer uses to pick up changed documents in the container. If you wanted to reindex a blob container, you would need a Reset API to force a full process.

Reset APIs are available for the following objects:

+ [indexers](#reset-indexers)
+ [skills (preview)](#reset-skills)
+ [documents (preview)](#reset-docs)

If specified, the reset parameters become the sole determinant of what gets processed, regardless of other changes in the underlying data. For example, if 20 blobs were added or updated since the last indexer run, but you only reset one document, only that one document will be processed.

A reset flag is cleared after the run is finished. Change detection logic will resume on the next run, picking up any other new or updated values in the rest of the data set. In the blob example

> [!NOTE]
> Reset cannot be used to synchronize deleted content. If the index contains an orphaned search document, a reset will not cause the removal of that document from the index. For more information about deletion, see [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents).

<a name="reset-indexer"></a>

## Reset an indexer

On an indexer, refresh is all encompassing. Any document that is populated and refreshed by an indexer is marked for refresh. All fields, in all documents, are refreshed using the current content in the data source. Any new documents in the underlying source are added to the index as search documents.

You can use the portal, [Reset Indexer (REST)](/rest/api/searchservice/reset-indexer), or an [ResetIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.resetindexer) on an Azure SDK to reset an indexer.

<a name="reset-skill"></a>

## Reset individual skills (preview)

> [!IMPORTANT] 
> [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For indexers that have skillsets, you can reset specific skills to force processing of that skill and any downstream skills that depend on its output. Any [cached enrichments](search-howto-incremental-index.md) pertaining to the affected skills are also refreshed.

[Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is available through REST **`api-version=2020-06-30-Preview`**.

<a name="reset-docs"></a>

## Reset individual documents (preview)

> [!IMPORTANT] 
> [Reset Documents](/rest/api/searchservice/preview-api/reset-documents) is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

On documents, refresh is just over the documents you've specified, using the document key.

After reset, status says "reset"
After reset, do I have to RUN? Yes. After run, is status is "running"
If you run again, other changes are picked up.

Suppose 20 documents changed in Blob storage, but you only run RESET on one of them. RUN only updates that document.

RUN again picks up the other 19 changes.




You can only validate processing at the indexer level, by inspecting the XX property. Individual documents do not have a datetime stamp. The best way to verify is by querying a field that is supposed to have updated content, and verifying that the value is indeed updated.

Change detection works with scheduled indexing, and reset works with on-demand Run.

Is Change Detection ignored on RUN then??

data source, index, indexer
data source (use blob if you want built-in change detection) with initial values - 1, 2, 3 documents
data source with changes documents: 1 (no change), 2 (change value but don't reset), 3 (change value and reset)


RESET with 1 (it might get updated, but no one knows)
RESET with 3 (you should see the change, but 2 should be stet)

[Reset documents](https://docs.microsoft.com/rest/api/searchservice/preview-api/reset-documents) resets specific documents to selectively reprocess in full the documents from the data source. The indexer state is set to `indexingResetDocs` until all the document keys provided in the reset documents call are processed. While in this mode, only those documents are indexed. After the 


Once the documents are reset, the indexer returns to the `indexingAllDocs` mode and will process new or updated documents on the next run.

All fields in the search document are refreshed from corresponding fields in the data source. If the document is enriched through a skillset and has cached data, the cached parts are also refreshed. The skillset is invoked for the specific documents.

Then it will return to indexing all documents and pick up where it left off.


In scenarios where only a few search documents need to be reprocessed, and the data source cannot be updated, use [Reset Documents](https://docs.microsoft.com/rest/api/searchservice/preview-api/reset-documents) to force reprocessing of the specific documents. When a document is reset, the indexer invalidates the cache for that document and the document is reprocessed by reading it from the data source. Indexers prioritize processing of reset documents over any other changes in the data source. 

When resetting a document, the request payload contains a list of document keys as read from the index. Calling the API multiple times with different keys appends the new keys to the list of document keys reset. Calling the API with the `overwrite` query string parameter set to true will overwrite the current list of document keys to be reset with the request's payload.

Calling the API only results in the document keys being added to the queue of work the indexer performs. When the indexer is next invoked, either as scheduled or on demand, it will prioritize processing the reset document keys before any changes from the data source.

```http
POST https://[service name].search.windows.net/indexers/[indexer name]/resetdocs?api-version=2020-06-30-Preview
```

[Reset Documents](/rest/api/searchservice/preview-api/reset-documents), using **`api-version=2020-06-30-Preview`**.

<!-- 
The Reset Documents API allows you to selectively reprocess documents from your data source. The API accepts document keys as input, and prioritizes the processing of those documents ahead of other documents from the same data source. This API works for all indexers (with or without a skillset). If the call succeeds, customers will always get a 204 NoContent response.

+ For indexers without a skillset, Reset Documents will simply read the source document from the data source and update/insert the contents into the index.

+ For indexers with a skillset and incremental enrichment enabled, Reset Documents will clear the cache and re-run the full skillset.

Recall that Reset Documents takes document keys as input. If the indexer contains a field mapping that associates the document key field to a different field in the data source, Reset Documents will use the field mapping to find the correct field in the data source. -->




## Run an indexer job

**Run** invokes indexer processing over all search index content marked by reset. Once the job is finished, any subsequent indexer run operates normally, refreshing search documents based on whether the content has changed, rather than being flagged by reset.

Reset and re-run are independent tasks. After a reset, you will need to run the indexer using one of these approaches:

+ Azure portal, using the **Run** command on the indexer page
+ [Run Indexer (REST)](/rest/api/searchservice/run-indexer)
+ [RunIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.runindexer) in the Azure .NET SDK (or other SDKs)

## Next steps

After you reset and re-run indexer jobs, you can monitor status from the search service, or obtain detailed information through diagnostic logging.

+ [Monitor search indexer status](search-howto-monitor-indexers.md)
+ [Collect and analyze log data](search-monitor-logs.md)
+ [Schedule an indexer](search-howto-schedule-indexers.md)