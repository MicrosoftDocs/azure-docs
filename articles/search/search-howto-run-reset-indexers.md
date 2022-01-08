---
title: Run or reset indexers
titleSuffix: Azure Cognitive Search
description: Run indexers in full, or reset an indexer, skills, or individual documents to refresh all or part of a search index or knowledge store.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/07/2022
---

# Run or reset indexers, skills, or documents

Indexers can be invoked in three ways: on demand, on a schedule, or when the [indexer is created](/rest/api/searchservice/create-indexer), assuming it's not created in a disabled state. 

After the initial run, an indexer keeps track of which search documents have been indexed through an internal "high-water mark". The marker is never exposed externally in APIs, but internally the indexer knows where indexing stopped so that it can pick up where it left off on the next run.

You can clear the high-water mark through a reset. Reset APIs are available at decreasing levels in the object hierarchy:

+ [Reset Indexers](#reset-indexers) clears the high-water mark and performs full re-indexing of all documents
+ [Reset Documents (preview)](#reset-docs) reindexes a specific document or list of documents
+ [Reset Skills (preview)](#reset-skills) invokes skill processing for a specific skill

After reset, follow with a Run command to reprocess existing documents and new documents. Reset/run will not remove orphaned search documents in the search index that were created on previous runs. For more information about deletion, see [Add, Update or Delete Documents](/rest/api/searchservice/addupdate-or-delete-documents).

Reset/run operations apply to a search index or a knowledge store, to specific documents or projections, and to cached enrichments if a reset explicitly or implicitly includes skills.

## Indexer execution

Indexing does not run in the background. Instead, the search service will balance all indexing jobs against ongoing queries and object management (such as creating or updating indexes). When running indexers, you should expect to see [some query latency](search-performance-analysis.md#impact-of-indexing-on-queries) if indexing volumes are large.

You can run multiple indexers at one time, but each indexer itself is single-instance. Starting a new instance while the indexer is already in execution produces this error: `"Failed to run indexer "<indexer name>" error: "Another indexer invocation is currently in progress; concurrent invocations are not allowed.""`

For each workload, the following indexer job limits apply.

| Workload | Maximum duration | Maximum jobs | Execution environment <sup>1</sup> |
|----------|------------------|---------------------|-----------------------------|
| Text-based indexing | 24 hours | One per search unit. | Typically runs on the search service. |
| Skills-based indexing | 2 hours | Indeterminate | Typically runs on an internally-managed, multi-tenant cluster. If a skills-based indexing is executed off the search service, the number of concurrent jobs can exceed the maximum of one per search unit. |

<sup>1</sup> To optimize processing, a search service will determine an internal execution environment for the indexer operation. You cannot control or configure the environment, but depending on number and complexity tasks, the search service will either run the job itself, or offload computationally-intensive tasks to an internally-managed cluster, leaving more service-specific resources available for routine operations. The multi-tenant environment used for performing computationally-intensive tasks is managed and secured by Microsoft, at no extra cost to the customer.

> [!NOTE]
> If you are [indexing a large data set](search-howto-large-index.md), you can stretch processing out by putting the indexer on a schedule. For the full list of all indexer-related limits, see [indexer limits](search-limits-quotas-capacity.md#indexer-limits)

## Run without reset

[Run indexer](/rest/api/searchservice/run-indexer) will detect and process only what it necessary to synchronize the search index with changes in the underlying data source. Incremental indexing starts by locating an internal high-water mark to find the last updated search document, which becomes the starting point for indexer execution over new and updated documents in the data source.

Change detection is essential for determining what's new or updated in the data source. If the content is unchanged, Run has no effect. Blob storage has built-in change detection. Other data sources, such as Azure SQL or Cosmos DB, have to be configured for change detection before the indexer can read new and updated rows. 

<a name="reset-indexers"></a>

## How to reset and run an indexer

Reset, followed by run, clears the high-water mark. All documents in the search index will be flagged for full overwrite, without selective updates or merging with existing content.

+ All documents found the underlying source are added or overwritten in the search index. 
+ For indexers with a skillset and [caching](search-howto-incremental-index.md), resetting the index will implicitly reset the skillset. Enriched documents are rebuilt and the enrichment cache, if one is enabled, is refreshed.

As previously noted, reset is a passive operation: you must follow up a Run request to rebuild the index. Reset will not trigger deletion or clean up of orphaned documents in the search index. For more information about deleting documents, see [Add, Update or Delete Documents](/rest/api/searchservice/AddUpdate-or-Delete-Documents).

Once you reset an indexer, you cannot undo the action.

### [**Azure portal**](#tab/reset-indexer-portal)

1. [Sign in to Azure portal](https://portal.azure.com) and open the search service page.
1. On the **Overview** page, select the **Indexers** tab.
1. Select an indexer.
1. Select the **Reset** command, and then select **Yes** to confirm the action.
1. Refresh the page to show the status. You can select the item to view it's details.
1. Select **Run** to start indexer processing, or wait for the next scheduled execution.

   :::image type="content" source="media/search-howto-run-reset-indexers/portal-reset.png" alt-text="Screenshot of indexer execution portal page, with Reset command highlighted." border="true":::

### [**REST**](#tab/reset-indexer-rest)

The following example illustrates [**Reset Indexer**](/rest/api/searchservice/reset-indexer) and [**Run Indexer**](/rest/api/searchservice/run-indexer) REST calls. Use [**Get Indexer Status**](/rest/api/searchservice/get-indexer-status) to check results.

There are no parameters or properties for any of these calls.

```http
POST /indexers/[indexer name]/reset?api-version=[api-version]
```

```http
POST /indexers/[indexer name]/run?api-version=[api-version]
```

```http
GET /indexers/[indexer name]/status?api-version=[api-version]
```

### [**.NET SDK (C#)**](#tab/reset-indexer-csharp)

The following example (from [azure-search-dotnet-samples/multiple-data-sources/](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/multiple-data-sources/v11/src/Program.cs)) illustrates the [**ResetIndexers**](/dotnet/api/azure.search.documents.indexes.searchindexerclient.resetindexer) and [**RunIndexers**](/dotnet/api/azure.search.documents.indexes.searchindexerclient.runindexer) methods in the Azure .NET SDK.

```csharp
// Reset the indexer if it already exists
try
{
    await indexerClient.GetIndexerAsync(blobIndexer.Name);
    //Rest the indexer if it exsits.
    await indexerClient.ResetIndexerAsync(blobIndexer.Name);
}
catch (RequestFailedException ex) when (ex.Status == 404) { }

await indexerClient.CreateOrUpdateIndexerAsync(blobIndexer);

// Run indexer
Console.WriteLine("Running Blob Storage indexer...\n");

try
{
    await indexerClient.RunIndexerAsync(blobIndexer.Name);
}
catch (RequestFailedException ex) when (ex.Status == 429)
{
    Console.WriteLine("Failed to run indexer: {0}", ex.Message);
}
}
```

---

<a name="reset-skills"></a>

## How to reset skills (preview)

For indexers that have skillsets, you can reset individual skills to force processing of just that skill and any downstream skills that depend on its output. The [enrichment cache](search-howto-incremental-index.md), if you enabled it, is also refreshed. 

[Reset Skills](/rest/api/searchservice/preview-api/reset-skills) is currently REST-only, available through **`api-version=2020-06-30-Preview`** or later.

```http
POST /skillsets/[skillset name]/resetskills?api-version=2020-06-30-Preview
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

Remember to follow up with Run Indexer to invoke actual processing.

<a name="reset-docs"></a>

## How to reset docs (preview)

The [Reset documents API](/rest/api/searchservice/preview-api/reset-documents) accepts a list of document keys so that you can refresh specific documents. If specified, the reset parameters become the sole determinant of what gets processed, regardless of other changes in the underlying data. For example, if 20 blobs were added or updated since the last indexer run, but you only reset one document, only that one document will be processed.

On a per-document basis, all fields in that search document are refreshed with values from the data source. You cannot pick and choose which fields to refresh. 

If the document is enriched through a skillset and has cached data, the  skillset is invoked for just the specified documents, and the cached is updated for the reprocessed documents.

When testing this API for the first time, the following APIs will help you validate and test the behaviors:

+ [Get Indexer Status](/rest/api/searchservice/get-indexer-status) with API version **`api-version=2020-06-30-Preview`** or later, to check reset status and execution status. You can find information about the reset request at the end of the status response.
+ [Reset Documents](/rest/api/searchservice/preview-api/reset-documents) with API version **`api-version=2020-06-30-Preview`** or later, to specify which documents to process.
+ [Run Indexer](/rest/api/searchservice/run-indexer) to run the indexer (any API version).
+ [Search Documents](/rest/api/searchservice/search-documents) to check for updated values, and also to return document keys if you are unsure of the value. Use `"select": "<field names>"` if you want to limit which fields appear in the response.

### Formulate and send the reset request

[Reset Documents](/rest/api/searchservice/preview-api/reset-documents) is currently REST-only, available through **`api-version=2020-06-30-Preview`** or later.

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

To check the status of a reset and to see which document keys are queued up for processing, use [Get Indexer Status](/rest/api/searchservice/get-indexer-status) with **`api-version=06-30-2020-Preview`** or later. The preview API will return the **`currentState`** section, which you can find at the end of the Get Indexer Status response.

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
+ [Collect and analyze log data](monitor-azure-cognitive-search.md)
+ [Schedule an indexer](search-howto-schedule-indexers.md)