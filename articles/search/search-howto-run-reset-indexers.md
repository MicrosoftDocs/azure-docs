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

Reset APIs apply to [indexers](search-indexer-overview.md) and are used to set the scope of the next indexer job, triggering a full reprocessing of data, almost as if it was the initial run. A reset becomes operative when you run the indexer on demand, or on the next scheduled run if it's on a schedule.

The Reset APIs are primarily used to refresh cached content (applicable in [AI enrichment](cognitive-search-concept-intro.md) scenarios). A secondary reason might be to force data synchronization between the underlying data source and search index, if somehow the documents appear to be mismatched. Reset, followed by run, can reprocess existing documents and new documents, but does not remove orphaned search documents in the search index. For more information about deletion, see [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents).

Reset APIs are available for the following objects:

+ [indexers](#reset-indexers)
+ [skills (preview)](#reset-skills)
+ [documents (preview)](#reset-docs)

If specified, the reset parameters become the sole determinant of what gets processed, regardless of other changes in the underlying data. For example, if 20 blobs were added or updated since the last indexer run, but you only reset one document, only that one document will be processed.

A reset flag is cleared after the run is finished. Change detection logic will resume on the next run, picking up any other new or updated values in the rest of the data set.

> [!NOTE]
> A reset request determines what is reprocessed (indexer, skill, or document), but does not otherwise affect indexer runtime behavior. If the indexer has run time parameters, field mappings, caching, batch options, and so forth, those settings are all in effect when you run an indexer after having reset it.

<a name="reset-indexers"></a>

## Reset an indexer

Resetting an indexer is all encompassing. Any document that is populated by an indexer is marked for full processing. All fields, in all documents, are reindexed using the current content in the data source. Any new documents in the underlying source are added to the index as search documents. If you previously [cached enriched documents](search-howto-incremental-index.md), all cached content is replaced.

You can use the portal, [Reset Indexer (REST)](/rest/api/searchservice/reset-indexer), or an [ResetIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.resetindexer) on an Azure SDK to reset an indexer.

<a name="reset-skills"></a>

## Reset individual skills (preview)

> [!IMPORTANT] 
> [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For indexers that have skillsets, you can reset specific skills to force processing of that skill and any downstream skills that depend on its output. [Cached enrichments](search-howto-incremental-index.md) pertaining to the affected skills are also refreshed.

[Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is available through REST **`api-version=2020-06-30-Preview`**.

<a name="reset-docs"></a>

## Reset individual documents (preview)

> [!IMPORTANT] 
> [Reset Documents](/rest/api/searchservice/preview-api/reset-documents) is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The [Reset documents API](https://docs.microsoft.com/rest/api/searchservice/preview-api/reset-documents) accepts a list of document keys so that you can refresh specific documents. 

All fields in the search document are refreshed from corresponding fields in the data source. If the document is enriched through a skillset and has cached data, the cached parts are also refreshed. The skillset is invoked for just the specified documents.

When testing this API for the first time, the following APIs will help you validate and test the behaviors:

+ [Get Indexer Status](/rest/api/searchservice/get-indexer-status) with API version `2020-06-30-Preview`, to check reset status and execution status. You can find information about the reset request at the end of the status response.
+ [Reset Documents](/rest/api/searchservice/preview-api/reset-documents) with API version `2020-06-30-Preview`, to specify which documents to process.
+ [Run Indexer](/rest/api/searchservice/run-indexer) to run the indexer (any API version).
+ [Search Documents](/rest/api/searchservice/search-documents) to check for updated values, and also to return document keys if you are unsure of the value. Use `"select": "<field names>"` if you want to limit which fields appear in the response.

### Formulate and send the reset request

```http
POST https://[service name].search.windows.net/indexers/[indexer name]/resetdocs?api-version=2020-06-30-Preview
{
    "documentKeys" : [
        "1001",
        "4452"
    ]
}
```

The document keys provided in the request are the values from the search index, which can be different from the corresponding fields in the data source. If you are unsure of the key value, [send a query](search-query-create.md) to return the value.

For blobs that are parsed into multiple search documents (for example if you are using [jsonLines or jsonArrays](search-howto-index-json-blobs.md), or [delimitedText](search-howto-index-csv-blobs.md)), the document key is generated by the indexer. When search documents originate from a single blob parent, query the documents you want reprocess to get the correct key. The Reset Documents API cannot infer the field mapping for a generated key.

Calling the API multiple times with different keys appends the new keys to the list of document keys reset. Calling the API with the **`overwrite`** parameter set to true will overwrite the current list of document keys to be reset with the request's payload:

```http
POST https://[service name].search.windows.net/indexers/[indexer name]/resetdocs?api-version=2020-06-30-Preview
{
    "documentKeys" : [
        "200",
        "630"
    ],
    "overwrite": true
}
```

### Check the status of the request

To check the status of an indexer and to see which document keys are queued up for processing, use [Get Indexer Status](/rest/api/searchservice/get-indexer-status) with **`api-version=06-30-2020-Preview`**. The preview API will return the **`currentState`** section shown below.

```json
"currentState": {
    "mode": "indexingResetDocs",
    "allDocsInitialTrackingState": "{\"LastFullEnumerationStartTime\":\"2021-02-06T19:02:07.0323764+00:00\",\"LastAttemptedEnumerationStartTime\":\"2021-02-06T19:02:07.0323764+00:00\",\"NameHighWaterMark\":null}",
    "allDocsFinalTrackingState": "{\"LastFullEnumerationStartTime\":\"2021-02-06T19:02:07.0323764+00:00\",\"LastAttemptedEnumerationStartTime\":\"2021-02-06T19:02:07.0323764+00:00\",\"NameHighWaterMark\":null}",
    "resetDocsInitialTrackingState": null,
    "resetDocsFinalTrackingState": null,
    "resetDocumentKeys": [
        "200",
        "630"
    ]
}
```

The indexer state is set to **`indexingResetDocs`** until all the document keys provided in the reset documents call are processed. While in this mode, only those documents are indexed. 

After the documents are reprocessed, the indexer returns to the **`indexingAllDocs`** mode and will process any other new or updated documents on the next run.

## Run an indexer job

**Run** invokes indexer processing over all search index content marked by reset. Once the job is finished, any subsequent indexer run operates normally, refreshing search documents based on whether the content has changed, rather than being flagged by reset.

Reset and rerun are independent tasks. After a reset, you will need to run the indexer using one of these approaches:

+ Azure portal, using the **Run** command on the indexer page
+ [Run Indexer (REST)](/rest/api/searchservice/run-indexer)
+ [RunIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.runindexer) in the Azure .NET SDK (or other SDKs)

## Next steps

Reset APIs are used to inform the scope of the next indexer run. For actual processing, you'll need to invoke an on-demand indexer run or allow a scheduled job to complete the work. After the run is finished, the indexer returns to normal processing, whether that is on a schedule or on-demand processing.

After you reset and rerun indexer jobs, you can monitor status from the search service, or obtain detailed information through diagnostic logging.

+ [Indexer operations (REST)](/rest/api/searchservice/indexer-operations)
+ [Monitor search indexer status](search-howto-monitor-indexers.md)
+ [Collect and analyze log data](search-monitor-logs.md)
+ [Schedule an indexer](search-howto-schedule-indexers.md)