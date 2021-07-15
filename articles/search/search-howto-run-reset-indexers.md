---
title: Run or reset indexers
titleSuffix: Azure Cognitive Search
description: Reset an indexer, skills, or individual documents to refresh all or part of and index or knowledge store.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/09/2021
---

# How to run or reset indexers, skills, or documents

Indexer execution can occur when you first create the [indexer](search-indexer-overview.md), when running an indexer on demand, or when setting an indexer on a schedule. After the initial run, an indexer keeps track of which search documents have been indexed through an internal "high water mark". The marker is never exposed in the API, but internally the indexer knows where indexing stopped so that it can pick up where it left off on the next run.

You can clear the high water mark by resetting the indexer if you want to reprocess from scratch. Reset APIs are available at decreasing levels in the object hierarchy:

+ The entire search corpus (use [Reset Indexers](#reset-indexers))
+ A specific document or list of documents (use [Reset Documents - preview](#reset-docs))
+ A specific skill or enrichment in a document (use [Reset Skills - preview](#reset-skills))

The Reset APIs are used to refresh cached content (applicable in [AI enrichment](cognitive-search-concept-intro.md) scenarios), or to clear the high water mark and rebuild the index.

Reset, followed by run, can reprocess existing documents and new documents, but does not remove orphaned search documents in the search index that were created on previous runs. For more information about deletion, see [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents).

## Run indexers

[Create Indexer](/rest/api/searchservice/create-indexer) creates and runs the indexer unless you create it in a disabled state ("disabled": true). The first run takes a bit longer because its covering object creation as well.

[Run indexer](/rest/api/searchservice/run-indexer) will detect and process only what it necessary to synchronize the search index with the data source. Blob storage has built-in change detection. Other data sources, such as Azure SQL or Cosmos DB, have to be configured for change detection before the indexer can read just the new and updated rows.

You can run an indexer using any of these approaches:

+ Azure portal, using the **Run** command on the indexer page
+ [Run Indexer (REST)](/rest/api/searchservice/run-indexer)
+ [RunIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.runindexer) in the Azure .NET SDK (or using the equivalent RunIndexer method in another SDK)

Indexer execution is subject to the following limits:

+ Maximum number of indexer jobs is 1 per replica  No concurrent jobs.

  If indexer execution is already at capacity,  you will get this notification: "Failed to run indexer '<indexer-name>', error: "Another indexer invocation is currently in progress; concurrent invocations are not allowed."

+ Maximum running time is 2 hours if using a skillset, and 24 hours without. 

  You can stretch out processing by putting the indexer on a schedule. The Free tier has lower run time limits. For the full list, see [indexer limits](search-limits-quotas-capacity.md#indexer-limits)

<a name="reset-indexers"></a>

## Reset an indexer

Resetting an indexer is all encompassing. Within the search index, any search document that was originally populated by the indexer is marked for full processing. Any new documents found the underlying source will be added to the index as search documents. If the indexer is configured to use a skillset and [caching](search-howto-incremental-index.md), the skillset is rerun and the cache is refreshed.

You can reset an indexer using any of these approaches, followed by an indexer run using one of the methods discussed above.

+ Azure portal, using the **Reset** command on the indexer page
+ [Reset Indexer (REST)](/rest/api/searchservice/reset-indexer)
+ [ResetIndexers method](/dotnet/api/azure.search.documents.indexes.searchindexerclient.resetindexer) in the Azure .NET SDK (or using the equivalent RunIndexer method in another SDK)

A reset flag is cleared after the run is finished. Any regular change detection logic that is operative for your data source will resume on the next run, picking up any other new or updated values in the rest of the data set.

> [!NOTE]
> A reset request determines what is reprocessed (indexer, skill, or document), but does not otherwise affect indexer runtime behavior. If the indexer has run time parameters, field mappings, caching, batch options, and so forth, those settings are all in effect when you run an indexer after having reset it.

<a name="reset-skills"></a>

## Reset skills (preview)

> [!IMPORTANT] 
> [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [preview REST API](/rest/api/searchservice/index-preview) supports this feature.

For indexers that have skillsets, you can reset specific skills to force processing of that skill and any downstream skills that depend on its output. [Cached enrichments](search-howto-incremental-index.md) are also refreshed. Resetting skills invalidates the cached skill results, which is useful when a new version of a skill is deployed and you want the indexer to rerun that skill for all documents. 

[Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is available through REST **`api-version=2020-06-30-Preview`**.

```http
POST https://[service name].search.windows.net/skillsets/[skillset name]/resetskills?api-version=2020-06-30-Preview
{
    "skillNames" : [
        "#1",
        "#5",
        "#6"
    ]
}
```

You can specify individual skills, as indicated in the example above, but if any of those skills require output from unlisted skills (#2 through #4), unlisted skills will run unless the cache can provide the necessary information. In order for this to be true, cached enrichments for skills #2 through #4 must not have dependency on #1 (listed for reset).

If no skills are specified, the entire skillset is executed and if caching is enabled, the cache is also refreshed.

<a name="reset-docs"></a>

## Reset docs (preview)

> [!IMPORTANT] 
> [Reset Documents](/rest/api/searchservice/preview-api/reset-documents) is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The [Reset documents API](/rest/api/searchservice/preview-api/reset-documents) accepts a list of document keys so that you can refresh specific documents. If specified, the reset parameters become the sole determinant of what gets processed, regardless of other changes in the underlying data. For example, if 20 blobs were added or updated since the last indexer run, but you only reset one document, only that one document will be processed.

On a per-document basis, all fields in that search document are refreshed with values from the data source. You cannot pick and choose which fields to refresh. 

If the document is enriched through a skillset and has cached data, the  skillset is invoked for just the specified documents, and the cached is updated for the reprocessed documents.

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

The document keys provided in the request are values from the search index, which can be different from the corresponding fields in the data source. If you are unsure of the key value, [send a query](search-query-create.md) to return the value.You can use `select` to return just the document key field.

For blobs that are parsed into multiple search documents (for example, if you used [jsonLines or jsonArrays](search-howto-index-json-blobs.md), or [delimitedText](search-howto-index-csv-blobs.md)) as a parsing mode, the document key is generated by the indexer and might be unknown to you. In this situation, a query for the document key will be instrumental in providing the correct value.

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

## Check reset status

To check the status of a reset and to see which document keys are queued up for processing, use [Get Indexer Status](/rest/api/searchservice/get-indexer-status) with **`api-version=06-30-2020-Preview`**. The preview API will return the **`currentState`** section, which you can find at the end of the Get Indexer Status response.

The "mode" will be **`indexingAllDocs`** for Reset Skills (because potentially all documents are affected, for the fields that are populated through AI enrichment).

For Reset Documents, the mode is set to **`indexingResetDocs`**. The indexer retains this status until all the document keys provided in the reset documents call are processed and no other indexer jobs will execute while the operation is progressing. Finding all of the documents in the document keys list requires cracking each document to locate and match on the key, and this can take a while if the data set is large. If a blob container contains hundreds of blobs, and the docs you want to reset are at the end, the indexer won't find the matching blobs until all of the others have been checked first.

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

After the documents are reprocessed, the indexer returns to the **`indexingAllDocs`** mode and will process any other new or updated documents on the next run.

## Next steps

Reset APIs are used to inform the scope of the next indexer run. For actual processing, you'll need to invoke an on-demand indexer run or allow a scheduled job to complete the work. After the run is finished, the indexer returns to normal processing, whether that is on a schedule or on-demand processing.

After you reset and rerun indexer jobs, you can monitor status from the search service, or obtain detailed information through diagnostic logging.

+ [Indexer operations (REST)](/rest/api/searchservice/indexer-operations)
+ [Monitor search indexer status](search-howto-monitor-indexers.md)
+ [Collect and analyze log data](search-monitor-logs.md)
+ [Schedule an indexer](search-howto-schedule-indexers.md)