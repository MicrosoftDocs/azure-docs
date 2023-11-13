---
title: Configure semantic ranking
titleSuffix: Azure AI Search
description: Set a semantic query type to attach the deep learning models of semantic ranking. 

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/26/2023
---

# Configure semantic ranking and return captions in search results

In this article, learn how to invoke a semantic ranking over a result set, promoting the most semantically relevant results to the top of the stack. You can also get semantic captions, with highlights over the most relevant terms and phrases, and [semantic answers](semantic-answers.md).

To use semantic ranking:

+ Add a semantic configuration to an index
+ Add parameters to a query request

## Prerequisites

+ A search service on Basic, Standard tier (S1, S2, S3), or Storage Optimized tier (L1, L2), subject to [region availability](https://azure.microsoft.com/global-infrastructure/services/?products=search).

+ Semantic ranking [enabled on your search service](semantic-how-to-enable-disable.md).

+ An existing search index with rich text content. Semantic ranking applies to text (non-vector) fields and works best on content that is informational or descriptive.

+ Review [semantic ranking](semantic-search-overview.md) if you need an introduction to the feature.

> [!NOTE]
> Captions and answers are extracted verbatim from text in the search document. The semantic subsystem uses machine reading comprehension to recognize content having the characteristics of a caption or answer, but doesn't compose new sentences or phrases. For this reason, content that includes explanations or definitions work best for semantic ranking. If you want chat-style interaction with generated responses, see [Retrieval Augmented Generation (RAG)](retrieval-augmented-generation-overview.md).

## 1 - Choose a client

Choose a search client that supports semantic ranking. Here are some options:

+ [Azure portal (Search explorer)](search-explorer.md), recommended for initial exploration.

+ [Postman app](https://www.postman.com/downloads/) using [REST APIs](/rest/api/searchservice/). See this [Quickstart](search-get-started-rest.md) for help with setting up REST calls.

+ [Azure.Search.Documents](https://www.nuget.org/packages/Azure.Search.Documents) in the Azure SDK for .NET.

+ [Azure.Search.Documents](https://pypi.org/project/azure-search-documents) in the Azure SDK for Python.

+ [azure-search-documents](https://central.sonatype.com/artifact/com.azure/azure-search-documents) in the Azure SDK for Java.

+ [@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents) in the Azure SDK for JavaScript.

## 2 - Create a semantic configuration

A *semantic configuration* is a section in your index that establishes field inputs for semantic ranking. You can add or update a semantic configuration at any time, no rebuild necessary. If you create multiple configurations, you can specify a default. At query time, specify a semantic configuration on a [query request](#4---set-up-the-query), or leave it blank to use the default.

A semantic configuration has a name and the following properties:

| Property | Characteristics |
|----------|-----------------|
| Title field | A short string, ideally under 25 words. This field could be the title of a document, name of a product, or a unique identifier. If you don't have suitable field, leave it blank. | 
| Content fields | Longer chunks of text in natural language form, subject to [maximum token input limits](semantic-search-overview.md#how-inputs-are-collected-and-summarized) on the machine learning models. Common examples include the body of a document, description of a product, or other free-form text. | 
| Keyword fields | A list of keywords, such as the tags on a document, or a descriptive term, such as the category of an item. | 

You can only specify one title field, but you can have as many content and keyword fields as you like. For content and keyword fields, list the fields in priority order because lower priority fields might get truncated.

Across all semantic configuration properties, the fields you assign must be:

+ Attributed as `searchable` and `retrievable`
+ Strings of type `Edm.String`, `Collection(Edm.String)`, string subfields of  `Collection(Edm.ComplexType)`

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to a search service that has [semantic ranking enabled](semantic-how-to-enable-disable.md).

1. Open an index.

1. Select **Semantic Configurations** and then select **Add Semantic Configuration**.

   The **New Semantic Configuration** page opens with options for selecting a title field, content fields, and keyword fields. Make sure to list content fields and keyword fields in priority order.

   :::image type="content" source="./media/semantic-search-overview/create-semantic-config.png" alt-text="Screenshot that shows how to create a semantic configuration in the Azure portal." border="true":::

   Select **OK** to save the changes.

### [**REST API**](#tab/rest)

1. Formulate a [Create or Update Index](/rest/api/searchservice/indexes/create-or-update) request.

1. Add a semantic configuration to the index definition, perhaps after `scoringProfiles` or `suggesters`. Specifying a default is optional but useful if you have more than one configuration.

    ```json
    "semantic": {
        "defaultConfiguration": "my-semantic-config-default",
        "configurations": [
            {
                "name": "my-semantic-config-default",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "HotelName"
                    },
                    "prioritizedContentFields": [
                        {
                            "fieldName": "Description"
                        }
                    ],
                    "prioritizedKeywordsFields": [
                        {
                            "fieldName": "Tags"
                        }
                    ]
                }
            },
                        {
                "name": "my-semantic-config-desc-only",
                "prioritizedFields": {
                    "prioritizedContentFields": [
                        {
                            "fieldName": "Description"
                        }
                    ]
                }
            }
        ]
    }
    ```

### [**.NET SDK**](#tab/sdk)

Use the [SemanticConfiguration class](/dotnet/api/azure.search.documents.indexes.models.semanticconfiguration?view=azure-dotnet-preview&preserve-view=true) in the Azure SDK for .NET.

```c#
var definition = new SearchIndex(indexName, searchFields);

SemanticSettings semanticSettings = new SemanticSettings();
semanticSettings.Configurations.Add(new SemanticConfiguration
    (
        "my-semantic-config",
        new PrioritizedFields()
        {
            TitleField = new SemanticField { FieldName = "HotelName" },
            ContentFields = {
            new SemanticField { FieldName = "Description" },
            new SemanticField { FieldName = "Description_fr" }
            },
            KeywordFields = {
            new SemanticField { FieldName = "Tags" },
            new SemanticField { FieldName = "Category" }
            }
        }
    )
);

definition.SemanticSettings = semanticSettings;

adminClient.CreateOrUpdateIndex(definition);
```

---

> [!TIP]
> To see an example of creating a semantic configuration and using it to issue a semantic query, check out the [semantic ranking Postman sample](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/semantic-search).

## 3 - Avoid features that bypass relevance scoring

Several query capabilities in Azure AI Search bypass relevance scoring or are otherwise incompatible with semantic ranking. If your query logic includes the following features, you can't semantically rank your results:

+ A query with `search=*` or an empty search string, such as pure filter-only query, won't work because there is nothing to measure semantic relevance against. The query must provide terms or phrases that can be assessed during processing.

+ A query composed in the [full Lucene syntax](query-lucene-syntax.md) (`queryType=full`) is incompatible with semantic ranking (`queryType=semantic`). The semantic model doesn't support the full Lucene syntax.

+ Sorting (orderBy clauses) on specific fields overrides search scores and a semantic score. Given that the semantic score is supposed to provide the ranking, adding an orderby clause results in an HTTP 400 error if you apply semantic ranking over ordered results.

## 4 - Set up the query

In this step, add parameters to the query request. To be successful, your query should be full text search (using the `search` parameter to pass in a string), and the index should contain text fields with rich semantic content and a semantic configuration.

### [**Azure portal**](#tab/portal-query)

[Search explorer](search-explorer.md) has been updated to include options for semantic ranking. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open your search index and select **Search explorer**.

1. There are two ways to specify the query, JSON or options. Using JSON, you can paste definitions into the query editor:

   :::image type="content" source="./media/semantic-search-overview/semantic-portal-json-query.png" alt-text="Screenshot showing JSON query syntax in the Azure portal." border="true":::

1. Using options, specify that you want to use semantic ranking and to create a configuration. If you don't see these options, make sure semantic ranking is enabled and also refresh your browser.

    :::image type="content" source="./media/semantic-search-overview/search-explorer-semantic-query-options-v2.png" alt-text="Screenshot showing query options in Search explorer." border="true":::

### [**REST API**](#tab/rest-query)

Use [Search Documents](/rest/api/searchservice/documents/search-post) to formulate the request.

A response includes an `@search.rerankerScore` automatically. If you want captions or answers in the response, add captions and answers to the request.

The following example in this section uses the [hotels-sample-index](search-get-started-portal.md) to demonstrate semantic ranking with semantic answers and captions.

1. Paste the following request into a web client as a template. Replace the service name and index name with valid values.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2023-11-01      
    {
        "queryType": "semantic",
        "search": "newer hotel near the water with a great restaurant",
        "semanticConfiguration": "my-semantic-config",
        "answers": "extractive|count-3",
        "captions": "extractive|highlight-true",
        "highlightPreTag": "<strong>",
        "highlightPostTag": "</strong>",
        "select": "HotelId,HotelName,Description,Category",
        "count": true
    }
    ```

1. Set "queryType" to "semantic".

   In other queries, the "queryType" is used to specify the query parser. In semantic ranking, it's set to "semantic". For the "search" field, you can specify queries that conform to the [simple syntax](query-simple-syntax.md).

1. Set "search" to a full text search query based on the [simple syntax](query-simple-syntax.md). Semantic ranking is an extension of full text search, so while this parameter isn't required, you won't get an expected outcome if it's null.

1. Set "semanticConfiguration" to a [predefined semantic configuration](#2---create-a-semantic-configuration) that's embedded in your index.

1. Set "answers" to specify whether [semantic answers](semantic-answers.md) are included in the result. Currently, the only valid value for this parameter is `extractive`. Answers can be configured to return a maximum of 10. The default is one. This example shows a count of three answers: `extractive|count-3`.

   Answers aren't guaranteed on every request. To get an answer, the query must look like a question and the content must include text that looks like an answer.

1. Set "captions" to specify whether semantic captions are included in the result. Currently, the only valid value for this parameter is `extractive`. Captions can be configured to return results with or without highlights. The default is for highlights to be returned. This example returns captions without highlights: `extractive|highlight-false`.

   The basis for captions and answers are the fields referenced in the "semanticConfiguration". These fields are under a combined limit in the range of 2,000 tokens or approximately 20,000 characters. If you anticipate a token count exceeding this limit, consider a [data chunking step](vector-search-how-to-chunk-documents.md) using the [Text split skill](cognitive-search-skill-textsplit.md). This approach introduces a dependency on an [AI enrichment pipeline](cognitive-search-concept-intro.md) and [indexers](search-indexer-overview.md).

1. Set "highlightPreTag" and "highlightPostTag" if you want to override the default highlight formatting that's applied to captions.

   Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

1. Set ["select"](search-query-odata-select.md) to specify which fields are returned in the response, and "count" to return the number of matches in the index. These parameters improve the quality of the request and readability of the response.

1. Send the request to execute the query and return results.

### [**.NET SDK**](#tab/dotnet-query)

Azure SDKs are on independent release cycles and implement search features on their own timeline. Check the change log for each package to verify general availability for semantic ranking.

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents)  |
| Java | [azure-search-documents](https://central.sonatype.com/artifact/com.azure/azure-search-documents)  |
| JavaScript | [azure/search-documents](https://www.npmjs.com/package/@azure/search-documents)|
| Python | [azure-search-document](https://pypi.org/project/azure-search-documents) |

---

## 5 - Evaluate the response

Only the top 50 matches from the initial results can be semantically ranked. As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select parameter. A response includes the original relevance score, and might also include a count, or batched results, depending on how you formulated the request.

In semantic ranking, the response has more elements: a new semantically ranked relevance score, an optional caption in plain text and with highlights, and an optional [answer](semantic-answers.md). If your results don't include these extra elements, then your query might be misconfigured. As a first step towards troubleshooting the problem, check the semantic configuration to ensure it's specified in both the index definition and query.

In a client app, you can structure the search page to include a caption as the description of the match, rather than the entire contents of a specific field. This approach is useful when individual fields are too dense for the search results page.

The response for the above example query returns the following match as the top pick. Captions are returned because the  "captions" property is set, with plain text and highlighted versions. Answers are omitted from the example because one couldn't be determined for this particular query and corpus.

```json
"@odata.count": 35,
"@search.answers": [],
"value": [
    {
        "@search.score": 1.8810667,
        "@search.rerankerScore": 1.1446577133610845,
        "@search.captions": [
            {
                "text": "Oceanside Resort. Luxury. New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
                "highlights": "<strong>Oceanside Resort.</strong> Luxury. New Luxury Hotel. Be the first to stay.<strong> Bay</strong> views from every room, location near the pier, rooftop pool, waterfront dining & more."
            }
        ],
        "HotelName": "Oceanside Resort",
        "Description": "New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
        "Category": "Luxury"
    },
  ...
]
```

## Migrate from preview versions

If your semantic ranking code is using preview APIs, this section explains how to migrate to stable versions. Generally available versions include:

+ [2023-11-01 (REST)](/rest/api/searchservice/)
+ [Azure.Search.Documents (Azure SDK for .NET)](https://www.nuget.org/packages/Azure.Search.Documents/)

**Behavior changes:**

+ As of July 14, 2023, semantic ranking is language agnostic. It can rerank results composed of multilingual content, with no bias towards a specific language. In preview versions, semantic ranking would deprioritize results differing from the language specified by the field analyzer.

+ In 2021-04-30-Preview and all later versions, `semanticConfiguration` (in an index definition) defines which search fields are used in semantic ranking. In the 2020-06-30-Preview REST API, `searchFields` (in a query request) was used for field specification and prioritization. This approach only worked in 2020-06-30-Preview and is obsolete in all other versions.

### Step 1: Remove queryLanguage

The semantic ranking engine is now language agnostic. If `queryLanguage` is specified in your query logic, it's no longer used for semantic ranking, but still applies to [spell correction](speller-how-to-add.md).

+ Use [Search POST](/rest/api/searchservice/documents/search-post) and remove `queryLanguage` for semantic ranking purposes.

### Step 2: Add semanticConfiguration

If your code calls the 2020-06-30-Preview REST API or beta SDK packages targeting that REST API version, you might be using `searchFields` in a query request to specify semantic fields and priorities. This code must now be updated to use `semanticConfiguration` instead.

+ [Create or Update Index](/rest/api/searchservice/indexes/create-or-update) to add `semanticConfiguration`. 

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results carry forward to semantic ranking. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Configure BM25 relevance scoring](index-similarity-and-scoring.md)
+ [Relevance scoring in hybrid search using Reciprocal Rank Fusion (RRF)](hybrid-search-ranking.md)
+ [Add scoring profiles](index-add-scoring-profiles.md)
+ [Semantic ranking overview](semantic-search-overview.md)
