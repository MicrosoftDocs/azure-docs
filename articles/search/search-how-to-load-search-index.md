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

+ Vector content is vectorized using an [external embedding model](vector-search-how-to-generate-embeddings.md) or [integrated vectorization (preview)](vector-search-integrated-vectorization.md) using Azure AI Search features that integrate with applied AI.

You can prepare these documents yourself, but if content resides in a [supported data source](search-indexer-overview.md#supported-data-sources), running an [indexer](search-indexer-overview.md) or using an Import wizard can automate document retrieval, JSON serialization, and indexing.

Once data is indexed, the physical data structures of the index are locked in. For guidance on what can and can't be changed, see [Update and rebuild an index](search-howto-reindex.md).

Indexing isn't a background process. A search service will balance indexing and query workloads, but if [query latency is too high](search-performance-analysis.md#impact-of-indexing-on-queries), you can either [add capacity](search-capacity-planning.md#adjust-capacity) or identify periods of low query activity for loading an index.

For more information, see [Data import strategies](search-what-is-data-import.md).

## Load documents using the Azure portal

In the Azure portal, use the Import wizards to create and load indexes in a seamless workflow. If you want to load an existing index, choose an alternative approach.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, select **Import data** or **Import and vectorize data** on the command bar to create and populate a search index. You can follow these links to review the workflow: [Quickstart: Create an Azure AI Search index](search-get-started-portal.md) and [Quickstart: Integrated vectorization (preview)](search-get-started-portal-import-vectors.md).

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

If indexers are already defined, you can [reset and run an indexer](search-howto-run-reset-indexers.md) from the Azure portal, which is useful if you're adding fields incrementally. Reset forces the indexer to start over, picking up all fields from all source documents.

## Load documents using the REST APIs

[Documents - Index (REST)](/rest/api/searchservice/documents) is the means by which you can import data into a search index through the REST APIs. The `@search.action` parameter determines whether documents are added in full, or partially in terms of new or replacement values for specific fields.

[**Quickstart: Text search using REST**](search-get-started-rest.md) explains the steps. The following example is a modified version of the example. It's been trimmed for brevity and the first HotelId value has been altered to avoid overwriting an existing document.

1. Formulate a POST call specifying the index name, the "docs/index" endpoint, and a request body that includes the `@search.action` parameter.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/index?api-version=2023-11-01
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

1. [Look up the documents](/rest/api/searchservice/documents/get) you just added as a validation step:

    ```http
    GET https://[service name].search.windows.net/indexes/hotel-sample-index/docs/1111?api-version=2023-11-01
    ```

When the document key or ID is new, **null** becomes the value for any field that is unspecified in the document. For actions on an existing document, updated values replace the previous values. Any fields that weren't specified in a "merge" or "mergeUpload" are left intact in the search index.

## Load documents using the Azure SDKs

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

+ [indexactiontype enumerator](/java/api/com.azure.search.documents.models.indexactiontype?view=azure-java-stable)
+ [SearchIndexingBufferedSender](/java/api/com.azure.search.documents.searchclientbuilder.searchindexingbufferedsenderbuilder)

Code samples include:

+ [IndexContentManagementExample.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/IndexContentManagementExample.java)

+ Be sure to check the [azure-search-vector-samples](https://github.com/Azure/azure-search-vector-samples) repo for code examples showing how to index vector fields.

---

Internally during indexing, each vector field is populated with embeddings in an internal vector index, and each nonvector field's inverted index is populated with all of the unique, tokenized words from each document. Each field is associated with a document key that determines the logical structure of the document. For example, when indexing a hotels data set, an inverted index created for a City field might contain terms for Seattle, Portland, and so forth. Documents that include Seattle or Portland in the City field would have their document ID listed alongside the term. On any [Documents - Index](/rest/api/searchservice/documents) operation, the terms and document ID list are updated accordingly. For more information about inverted indexes, see [Full text search in Azure AI Search](search-lucene-query-architecture.md).


## See also

+ [Search indexes overview](search-what-is-an-index.md)
+ [Data import overview](search-what-is-data-import.md)
+ [Import data wizard overview](search-import-data-portal.md)
+ [Indexers overview](search-indexer-overview.md)
