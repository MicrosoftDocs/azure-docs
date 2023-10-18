---
title: Configure semantic ranking
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models of semantic ranking. 

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 09/22/2023
---

# Configure semantic ranking and return captions in search results

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through Azure portal, preview REST APIs, and beta SDKs. This feature is billable. See [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

In this article, learn how to invoke a semantic ranking algorithm over a result set, promoting the most semantically relevant results to the top of the stack. You can also get semantic captions, with highlights over the most relevant terms and phrases, and [semantic answers](semantic-answers.md).

To use semantic ranking:

+ Add a semantic configuration to an index
+ Add parameters to a query request

## Prerequisites

+ A search service on Basic, Standard tier (S1, S2, S3), or Storage Optimized tier (L1, L2), subject to [region availability](https://azure.microsoft.com/global-infrastructure/services/?products=search).

+ Semantic ranking [enabled on your search service](semantic-how-to-enable-disable.md).

+ An existing search index with rich text content in a [supported query language](/rest/api/searchservice/preview-api/search-documents#queryLanguage). Semantic ranking applies to text (non-vector) fields and works best on content that is informational or descriptive.

+ Review [semantic ranking](semantic-search-overview.md) if you need an introduction to the feature.

> [!NOTE]
> Captions and answers are extracted verbatim from text in the search document. The semantic subsystem uses language understanding to recognize content having the characteristics of a caption or answer, but doesn't compose new sentences or phrases. For this reason, content that includes explanations or definitions work best for semantic ranking. If you want chat-style interaction with generated responses, see [Retrieval Augmented Generation (RAG)](retrieval-augmented-generation-overview.md).

## 1 - Choose a client

Choose a search client that supports preview APIs on the query request. Here are some options:

+ [Search explorer](search-explorer.md) in Azure portal, recommended for initial exploration.

+ [Postman app](https://www.postman.com/downloads/) using [Preview REST APIs](/rest/api/searchservice/preview-api/search-documents). See this [Quickstart](search-get-started-rest.md) for help with setting up your requests.

+ [Azure.Search.Documents 11.4.0-beta.5](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.5) in the Azure SDK for .NET.

+ [Azure.Search.Documents 11.3.0b6](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-search-documents/11.3.0b6/azure.search.documents.aio.html) in the Azure SDK for Python.

## 2 - Create a semantic configuration

A *semantic configuration* is a section in your index that establishes field inputs for semantic ranking. You can add or update a semantic configuration at any time, no rebuild necessary. At query time, specify one on a [query request](#4---set-up-the-query). A semantic configuration has a name and the following properties:

| Property | Characteristics |
|----------|-----------------|
| Title field | A short string, ideally under 25 words. This field could be the title of a document, name of a product, or a unique identifier. If you don't have suitable field, leave it blank. | 
| Content fields | Longer chunks of text in natural language form, subject to [maximum token input limits](semantic-search-overview.md#how-inputs-are-prepared) on the machine learning models. Common examples include the body of a document, description of a product, or other free-form text. | 
| Keyword fields | A list of keywords, such as the tags on a document, or a descriptive term, such as the category of an item. | 

You can only specify one title field, but you can specify as many content and keyword fields as you like. For content and keyword fields, list the fields in priority order because lower priority fields may get truncated.

Across all semantic configuration properties, the fields you assign must be:

+ Attributed as `searchable` and `retrievable`.
+ Strings of type `Edm.String`, `Edm.ComplexType`, or `Collection(Edm.String)`.

  String subfields of `Collection(Edm.ComplexType)` fields aren't currently supported in semantic ranking, captions, or answers.

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to a search service that has [semantic search enabled](semantic-how-to-enable-disable.md).

1. Open an index.

1. Select **Semantic Configurations** and then select **Add Semantic Configuration**.

   The **New Semantic Configuration** page opens with options for selecting a title field, content fields, and keyword fields. Make sure to list content fields and keyword fields in priority order.

   :::image type="content" source="./media/semantic-search-overview/create-semantic-config.png" alt-text="Screenshot that shows how to create a semantic configuration in the Azure portal." border="true":::

   Select **OK** to save the changes.

### [**REST API**](#tab/rest)

> [!IMPORTANT]
> A semantic configuration was added and is now required in 2021-04-30-Preview and newer API versions. In the 2020-06-30-Preview REST API, `searchFields` was used for field inputs. This approach only worked in 2020-06-30-Preview and is now obsolete.

1. Formulate a [Create or Update Index (Preview)](/rest/api/searchservice/preview-api/create-or-update-index?branch=main) request.

1. Add a semantic configuration to the index definition, perhaps after `scoringProfiles` or `suggesters`.

    ```json
    "semantic": {
          "configurations": [
            {
              "name": "my-semantic-config",
              "prioritizedFields": {
                "titleField": {
                      "fieldName": "hotelName"
                    },
                "prioritizedContentFields": [
                  {
                    "fieldName": "description"
                  },
                  {
                    "fieldName": "description_fr"
                  }
                ],
                "prioritizedKeywordsFields": [
                  {
                    "fieldName": "tags"
                  },
                  {
                    "fieldName": "category"
                  }
                ]
              }
            }
          ]
        }
    ```

### [**.NET SDK**](#tab/sdk)

Use the [SemanticConfiguration class](/dotnet/api/azure.search.documents.indexes.models.semanticconfiguration?view=azure-dotnet-preview&preserve-view=true) in the Azure SDK for .NET Preview.

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
> To see an example of creating a semantic configuration and using it to issue a semantic query, check out the [semantic search Postman sample](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/semantic-search).

## 3 - Avoid features that bypass relevance scoring

Several query capabilities in Cognitive Search bypass relevance scoring. If your query logic includes the following features, you won't get BM25 relevance scores or semantic ranking on your results:

+ Filters, fuzzy search queries, and regular expressions iterate over untokenized text, scanning for verbatim matches in the content. Search scores for all of the above query forms are a uniform 1.0, and won't provide meaningful input for semantic ranking because there's no way to select the top 50 matches.

+ Sorting (orderBy clauses) on specific fields overrides search scores and a semantic score. Given that the semantic score is supposed to provide the ranking, adding an orderby clause results in an HTTP 400 error if you try to apply semantic ranking over ordered results.

## 4 - Set up the query

Your next step is adding parameters to the query request. To be successful, your query should be full text search (using the `search` parameter to pass in a string), and the index should contain text fields with rich semantic content and a semantic configuration.

### [**Azure portal**](#tab/portal-query)

[Search explorer](search-explorer.md) has been updated to include options for semantic queries. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open your search index and select **Search explorer**.

1. There are two ways to specify the query, JSON or options. Using JSON, you can paste definitions into the query editor:

   :::image type="content" source="./media/semantic-search-overview/semantic-portal-json-query.png" alt-text="Screenshot showing JSON query syntax in the Azure portal." border="true":::

1. Using options, specify that you want to use semantic search and select a query language. If you don't see these options, make sure semantic search is enabled and also refresh your browser.

    :::image type="content" source="./media/semantic-search-overview/search-explorer-semantic-query-options-v2.png" alt-text="Screenshot showing query options in Search explorer." border="true":::

### [**REST API**](#tab/rest-query)

Use the [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents) to formulate the request.

A response includes an `@search.rerankerScore` automatically. If you want captions, spelling correction, or answers in the response, add captions, speller, or answers to the request.

The following example in this section uses the [hotels-sample-index](search-get-started-portal.md) to demonstrate semantic ranking with spell check, semantic answers, and captions.

1. Paste the following request into a web client as a template. Replace the service name and index name with valid values.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2021-04-30-Preview      
    {
        "queryType": "semantic",
        "queryLanguage": "en-us",
        "search": "newer hotel near the water with a great restaurant",
        "semanticConfiguration": "my-semantic-config",
        "searchFields": "",
        "speller": "lexicon",
        "answers": "extractive|count-3",
        "captions": "extractive|highlight-true",
        "highlightPreTag": "<strong>",
        "highlightPostTag": "</strong>",
        "select": "HotelId,HotelName,Description,Category",
        "count": true
    }
    ```

1. Set "queryType" to "semantic".

   In other queries, the "queryType" is used to specify the query parser. In semantic search, it's set to "semantic". For the "search" field, you can specify queries that conform to the [simple syntax](query-simple-syntax.md).

1. Set "queryLanguage" to a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

   The "queryLanguage" must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. For example, you indexed French strings using a French language analyzer (such as "fr.microsoft" or "fr.lucene"), then "queryLanguage" should also be French language variant.

   In a query request, if you're also using [spell correction](speller-how-to-add.md), the "queryLanguage" you set applies equally to speller, answers, and captions. There's no override for individual parts. Spell check supports [fewer languages](speller-how-to-add.md#supported-languages), so if you're using that feature, you must set queryLanguage to one from that list.

   While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

1. Set "search" to a full text search query based on the [simple syntax](query-simple-syntax.md). Semantic search is an extension of full text search, so while this parameter isn't required, you won't get an expected outcome if it's null.

1. Set "semanticConfiguration" to a [predefined semantic configuration](#2---create-a-semantic-configuration) that's embedded in your index, assuming your client supports it. For some clients and API versions, "semanticConfiguration" is required and important for getting the best results from semantic search.

1. Set "searchFields" to a prioritized list of searchable string fields. If you didn't use a semantic configuration, this field provides important hints to the underlying models as to which fields the most important. If you do have a semantic configuration, setting this parameter is still useful because it scopes the query to high-value fields.

   In contrast with other parameters, searchFields isn't new. You might already be using "searchFields" in existing code for simple or full Lucene queries. If so, revisit how the parameter is used so that you can check for field order when switching to a semantic query type.

1. Set "speller" to correct misspelled terms before they reach the search engine. This parameter is optional and not specific to semantic queries. For more information, see [Add spell correction to queries](speller-how-to-add.md).

1. Set "answers" to specify whether [semantic answers](semantic-answers.md) are included in the result. Currently, the only valid value for this parameter is "extractive". Answers can be configured to return a maximum of 10. The default is one. This example shows a count of three answers: `extractive|count-3`.

   Answers are extracted from passages found in fields listed in the semantic configuration. This behavior is why you want to include content-rich fields in the prioritizedContentFields of a semantic configuration, so that you can get the best answers and captions in a response. Answers aren't guaranteed on every request. To get an answer, the query must look like a question and the content must include text that looks like an answer.

1. Set "captions" to specify whether semantic captions are included in the result. If you're using a semantic configuration, you should set this parameter. 

   Currently, the only valid value for this parameter is "extractive". Captions can be configured to return results with or without highlights. The default is for highlights to be returned. This example returns captions without highlights: `extractive|highlight-false`.

   For semantic captions, the fields referenced in the "semanticConfiguration" must have a word limit in the range of 2000-3000 words (or equivalent to 10,000 tokens), otherwise, it misses important caption results. If you anticipate that the fields used by the "semanticConfiguration" word count could be higher than the exposed limit and you need to use captions, consider [Text split cognitive skill]cognitive-search-skill-textsplit.md) as part of your [AI enrichment pipeline](cognitive-search-concept-intro.md) while indexing your data with [built-in pull indexers](search-indexer-overview.md).

1. Set "highlightPreTag" and "highlightPostTag" if you want to override the default highlight formatting that's applied to captions.

   Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

1. Set ["select"](search-query-odata-select.md) to specify which fields are returned in the response, and "count" to return the number of matches in the index. These parameters improve the quality of the request and readability of the response.

1. Send the request to execute the query and return results.

### [**.NET SDK**](#tab/dotnet-query)

Beta versions of the Azure SDKs include support for semantic search. Because the SDKs are beta versions, there's no documentation or samples, but you can refer to the REST API content in the next tab for insights on how the APIs should work.

The following beta versions support semantic configuration:

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package 11.4.0-beta.5](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.5)  |
| Java | [com.azure:azure-search-documents 11.5.0-beta.5](https://search.maven.org/artifact/com.azure/azure-search-documents/11.5.0-beta.5/jar)  |
| JavaScript | [azure/search-documents 11.3.0-beta.5](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.5)|
| Python | [azure-search-documents 11.3.0b6](https://pypi.org/project/azure-search-documents/11.3.0b6/) |

These beta versions use "searchFields" for field prioritization:

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2)  |
| Java | [com.azure:azure-search-documents 11.4.0-beta.2](https://search.maven.org/artifact/com.azure/azure-search-documents/11.4.0-beta.2/jar)  |
| JavaScript | [azure/search-documents 11.2.0-beta.2](https://www.npmjs.com/package/@azure/search-documents/v/11.2.0-beta.2)|
| Python | [azure-search-documents 11.2.0b3](https://pypi.org/project/azure-search-documents/11.2.0b3/) |

---

## 5 - Evaluate the response

Only the top 50 matches from the initial results can be semantically ranked. As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select parameter. A response includes the original relevance score, and might also include a count, or batched results, depending on how you formulated the request.

In semantic search, the response has more elements: a new semantically ranked relevance score, an optional caption in plain text and with highlights, and an optional [answer](semantic-answers.md). If your results don't include these extra elements, then your query might be misconfigured. As a first step towards troubleshooting the problem, check the semantic configuration to ensure it's specified in both the index definition and query.

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

> [!NOTE]
> Starting from July 14, 2023, if the initial search results display matches in multiple languages, the semantic ranker will include these results as a part of the semantic response. This is in contrast to the previous behavior, where the semantic ranker would deprioritize results differing from the language specified by the field analyzer.

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results carry forward to semantic search. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Configure BM25 relevance scoring](index-similarity-and-scoring.md)
+ [Add scoring profiles](index-add-scoring-profiles.md)
+ [Semantic search overview](semantic-search-overview.md)
