---
title: Load an index
titleSuffix: Azure AI Search
description: Import and refresh data in a search index using the portal, REST APIs, or an Azure SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist

ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/01/2024
---

# Load data into a search index in Azure AI Search

This article explains how to import documents into a predefined search index. In Azure AI Search, a [search index is created first](search-how-to-create-search-index.md) with [data import](search-what-is-data-import.md) following as a second step. The exception is [Import wizards](search-import-data-portal.md) in the portal and indexer pipelines, which create and load an index in one workflow.

## How data import works

A search service accepts JSON documents that conform to the index schema. A search service imports and indexes plain text and vectors in JSON, used in full text search, vector search, hybrid search, and knowledge mining scenarios. 

+ Plain text content is obtainable from alphanumeric fields in the external data source, metadata that's useful in search scenarios, or enriched content created by a [skillset](cognitive-search-working-with-skillsets.md) (skills can extract or infer textual descriptions from images and unstructured content). 

+ Vector content is vectorized using an [external embedding model](vector-search-how-to-generate-embeddings.md) or [integrated vectorization](vector-search-integrated-vectorization.md) using Azure AI Search features that integrate with applied AI.

You can prepare these documents yourself, but if content resides in a [supported data source](search-indexer-overview.md#supported-data-sources), running an [indexer](search-indexer-overview.md) or using an Import wizard can automate document retrieval, JSON serialization, and indexing.

Once data is indexed, the physical data structures of the index are locked in. For guidance on what can and can't be changed, see [Update and rebuild an index](search-howto-reindex.md).

Indexing isn't a background process. A search service will balance indexing and query workloads, but if [query latency is too high](search-performance-analysis.md#impact-of-indexing-on-queries), you can either [add capacity](search-capacity-planning.md#adjust-capacity) or identify periods of low query activity for loading an index.

For more information, see [Data import strategies](search-what-is-data-import.md).

## Use the Azure portal

In the Azure portal, use the [import wizards](search-import-data-portal.md) to create and load indexes in a seamless workflow. If you want to load an existing index, choose an alternative approach.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. On the Overview page, select **Import data** or **Import and vectorize data** on the command bar to create and populate a search index. 

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

    You can follow these links to review the workflow: [Quickstart: Create an Azure AI Search index](search-get-started-portal.md) and [Quickstart: Integrated vectorization](search-get-started-portal-import-vectors.md).

1. After the wizard is finished, use [Search Explorer](search-explorer.md) to check for results.

> [!TIP]
> The import wizards create and run indexers. If indexers are already defined, you can [reset and run an indexer](search-howto-run-reset-indexers.md) from the Azure portal, which is useful if you're adding fields incrementally. Reset forces the indexer to start over, picking up all fields from all source documents.

## Use the REST APIs

[Documents - Index](/rest/api/searchservice/documents) is the REST API for importing data into a search index. REST APIs are useful for initial proof-of-concept testing, where you can test indexing workflows without having to write much code. The `@search.action` parameter determines whether documents are added in full, or partially in terms of new or replacement values for specific fields.

[**Quickstart: Text search using REST**](search-get-started-rest.md) explains the steps. The following example is a modified version of the example. It's been trimmed for brevity and the first HotelId value has been altered to avoid overwriting an existing document.

1. Formulate a POST call specifying the index name, the "docs/index" endpoint, and a request body that includes the `@search.action` parameter.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/index?api-version=2024-07-01
    Content-Type: application/json   
    api-key: [admin key] 
    {
        "value": [
        {
        "@search.action": "upload",
        "HotelId": "1111",
        "HotelName": "Secret Point Motel",
        "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
        "Category": "Boutique",
        "Tags": [ "pool", "air conditioning", "concierge" ]
        },
        {
        "@search.action": "mergeOrUpload",
        "HotelId": "2",
        "HotelName": "Twin Dome Motel",
        "Description": "This is description is replacing the original one for this hotel. New and changed values overwrite the previous ones. In a comma-delimited list like Tags, be sure to provide the full list because there is no merging of values within the field itself.",
        "Category": "Boutique",
        "Tags": [ "pool", "free wifi", "concierge", "my first new tag", "my second new tag" ]
        }
      ]
    }
    ```

1. Set the `@search.action` parameter to `upload` to create or overwrite a document. Set it to `merge` or `uploadOrMerge` if you're targeting updates to specific fields within the document. The previous example shows both actions.

   | Action | Effect |
   |--------|--------|
   | merge | Updates a document that already exists, and fails a document that can't be found. Merge replaces existing values. For this reason, be sure to check for collection fields that contain multiple values, such as fields of type `Collection(Edm.String)`. For example, if a `tags` field starts with a value of `["budget"]` and you execute a merge with `["economy", "pool"]`, the final value of the `tags` field is `["economy", "pool"]`. It won't be `["budget", "economy", "pool"]`. |
   | mergeOrUpload | Behaves like merge if the document exists, and upload if the document is new. This is the most common action for incremental updates. |
   | upload | Similar to an "upsert" where the document is inserted if it's new, and updated or replaced if it exists. If the document is missing values that the index requires, the document field's value is set to null. |

1. Send the request.

1. [Look up the documents](/rest/api/searchservice/documents/get) you just added as a validation step:

    ```http
    GET https://[service name].search.windows.net/indexes/hotel-sample-index/docs/1111?api-version=2024-07-01
    ```

When the document key or ID is new, **null** becomes the value for any field that is unspecified in the document. For actions on an existing document, updated values replace the previous values. Any fields that weren't specified in a "merge" or "mergeUpload" are left intact in the search index.

## Use the Azure SDKs

Programmability is provided in the following Azure SDKs.

### [**.NET**](#tab/sdk-dotnet)

The Azure SDK for .NET provides the following APIs for simple and bulk document uploads into an index:

+ [IndexDocumentsAsync](/dotnet/api/azure.search.documents.searchclient.indexdocumentsasync)
+ [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1)

There are several samples that illustrate indexing in context of simple and large-scale indexing:

+ [**"Load an index"**](search-howto-dotnet-sdk.md#load-an-index) explains basic steps.

+ [**Azure.Search.Documents Samples - Indexing Documents**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample05_IndexingDocuments.md) from the Azure SDK team adds [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1).

+ [**Tutorial: Index any data**](tutorial-optimize-indexing-push-api.md) couples batch indexing with testing strategies for determining an optimum size.

+ Be sure to check the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repo for code examples showing how to index vector fields.

### [**Python**](#tab/sdk-python)

The Azure SDK for Python provides the following APIs for simple and bulk document uploads into an index:

+ [IndexDocumentsBatch](/python/api/azure-search-documents/azure.search.documents.indexdocumentsbatch)
+ [SearchIndexingBufferedSender](/python/api/azure-search-documents/azure.search.documents.searchindexingbufferedsender)

Code samples include:

+ [sample_crud_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/search/azure-search-documents/samples/sample_crud_operations.py)

+ Be sure to check the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repo for code examples showing how to index vector fields.

### [**JavaScript**](#tab/sdk-javascript)

The Azure SDK for JavaScript/TypeScript provides the following APIs for simple and bulk document uploads into an index:

+ [IndexDocumentsBath](/javascript/api/%40azure/search-documents/indexdocumentsbatch)
+ [SearchIndexingBufferedSender](/javascript/api/%40azure/search-documents/searchindexingbufferedsender)

Code samples include:

+ See this quickstart for basic steps: [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md?tabs=javascript)

+ Be sure to check the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repo for code examples showing how to index vector fields.

### [**Java**](#tab/sdk-java)

The Azure SDK for Java provides the following APIs for simple and bulk document uploads into an index:

+ [indexactiontype enumerator](/java/api/com.azure.search.documents.models.indexactiontype)
+ [SearchIndexingBufferedSender](/java/api/com.azure.search.documents.searchclientbuilder.searchindexingbufferedsenderbuilder)

Code samples include:

+ [IndexContentManagementExample.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/IndexContentManagementExample.java)

+ Be sure to check the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repo for code examples showing how to index vector fields.

---

## See also

+ [Search indexes overview](search-what-is-an-index.md)
+ [Data import overview](search-what-is-data-import.md)
+ [Import data wizard overview](search-import-data-portal.md)
+ [Indexers overview](search-indexer-overview.md)
