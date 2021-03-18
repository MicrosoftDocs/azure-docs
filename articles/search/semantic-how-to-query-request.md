---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/12/2021
---
# Create a semantic query in Cognitive Search

> [!IMPORTANT]
> Semantic query type is in public preview, available through the preview REST API and Azure portal. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

In this article, learn how to formulate a search request that uses semantic ranking. The request will return semantic captions, and optionally [semantic answers](semantic-answers.md), with highlights over the most relevant terms and phrases.

Both captions and answers are extracted verbatim from text in the search document. The semantic subsystem determines what content has the characteristics of a caption or answer, but it does not compose new sentences or phrases. For this reason, content that includes explanations or definitions work best for semantic search.

## Prerequisites

+ A search service at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. If you have an existing S1 or greater service in one of these regions, you can request access without having to create a new service.

+ Access to semantic search preview: [sign up](https://aka.ms/SemanticSearchPreviewSignup)

+ An existing search index, containing English content

+ A search client for sending queries

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that you've modified to make REST calls to the preview APIs. You can also use [Search explorer](search-explorer.md) in Azure portal to submit a semantic query.

+ A [query request](/rest/api/searchservice/preview-api/search-documents) must include the semantic option and other parameters described in this article.

## What's a semantic query?

In Cognitive Search, a query is a parameterized request that determines query processing and the shape of the response. A *semantic query* adds parameters that invoke the semantic reranking model that can assess the context and meaning of matching results, promote more relevant matches to the top, and return semantic answers and captions.

The following request is representative of a minimal semantic query (without answers).

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us"  
}
```

As with all queries in Cognitive Search, the request targets the documents collection of a single index. Furthermore, a semantic query undergoes the same sequence of parsing, analysis, scanning, and scoring as a non-semantic query. 

The difference lies in relevance and scoring. As defined in this preview release, a semantic query is one whose *results* are reranked using a semantic language model, providing a way to surface the matches deemed most relevant by the semantic ranker, rather than the scores assigned by the default similarity ranking algorithm.

Only the top 50 matches from the initial results can be semantically ranked, and all include captions in the response. Optionally, you can specify an **`answer`** parameter on the request to extract a potential answer. For more information, see [Semantic answers](semantic-answers.md).

## Query with Search explorer

[Search explorer](search-explorer.md) has been updated to include options for semantic queries. These options become visible in the portal after you get access to the preview. Query options can enable semantic queries, searchFields, and spell correction.

You can also paste the required query parameters into the query string.

:::image type="content" source="./media/semantic-search-overview/search-explorer-semantic-query-options.png" alt-text="Query options in Search explorer" border="true":::

## Query using REST

Use the [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents) to formulate the request programmatically.

A response includes captions and highlighting automatically. If you want the response to include spelling correction or answers, add an optional **`speller`** or **`answers`** parameter on the request.

The following example uses the hotels-sample-index to create a semantic query request with semantic answers and captions:

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview      
{
    "search": "newer hotel near the water with a great restaurant",
    "queryType": "semantic",
    "queryLanguage": "en-us",
    "searchFields": "HotelName,Category,Description",
    "speller": "lexicon",
    "answers": "extractive|count-3",
    "highlightPreTag": "<strong>",
    "highlightPostTag": "</strong>",
    "select": "HotelId,HotelName,Description,Category",
    "count": true
}
```

The following table summarizes the query parameters used in a semantic query so that you can see them holistically. For a list of all parameters, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Type | Description |
|-----------|-------|-------------|
| queryType | String | Valid values include simple, full, and semantic. A value of "semantic" is required for semantic queries. |
| queryLanguage | String | Required for semantic queries. Currently, only "en-us" is implemented. |
| searchFields | String | A comma-delimited list of searchable fields. Optional but recommended. Specifies the fields over which semantic ranking occurs. </br></br>In contrast with simple and full query types, the order in which fields are listed determines precedence. For more usage instructions, see [Step 2: Set searchFields](#searchfields). |
| speller | String | Optional parameter, not specific to semantic queries, that corrects misspelled terms before they reach the search engine. For more information, see [Add spell correction to queries](speller-how-to-add.md). |
| answers |String | Optional parameters that specify whether semantic answers are included in the result. Currently, only "extractive" is implemented. Answers can be configured to return a maximum of five. The default is one. This example shows a count of three answers: "extractive\|count3"`. For more information, see [Return semantic answers](semantic-answers.md).|

### Formulate the request

This section steps through the query parameters necessary for semantic search.

#### Step 1: Set queryType and queryLanguage

Add the following parameters to the rest. Both parameters are required.

```json
"queryType": "semantic",
"queryLanguage": "en-us",
```

The queryLanguage must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. If queryLanguage is "en-us", then any language analyzers must also be an English variant ("en.microsoft" or "en.lucene"). Any language-agnostic analyzers, such as keyword or simple, have no conflict with queryLanguage values.

In a query request, if you are also using [spelling correction](speller-how-to-add.md), the queryLanguage you set applies equally to speller, answers, and captions. There is no override for individual parts. 

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

<a name="searchfields"></a>

#### Step 2: Set searchFields

This parameter is optional in that there is no error if you leave it out, but providing an ordered list of fields is strongly recommended for both captions and answers.

The searchFields parameter is used to identify passages to be evaluated for "semantic similarity" to the query. For the preview, we do not recommend leaving searchFields blank as the model requires a hint as to what fields are the most important to process.

The order of the searchFields is critical. If you already use searchFields in existing simple or full Lucene queries, be sure that you revisit this parameter to check for field order when switching to a semantic query type.

Follow these guidelines to ensure optimum results when two or more searchFields are specified:

+ Include only string fields and top-level string fields in collections. If you happen to include non-string fields or lower-level fields in a collection, there is no error, but those fields won't be used in semantic ranking.

+ First field should always be concise (such as a title or name), ideally under 25 words.

+ If the index has a URL field that is textual (human readable such as `www.domain.com/name-of-the-document-and-other-details`, and not machine focused such as `www.domain.com/?id=23463&param=eis`), place it second in the list (or first if there is no concise title field).

+ Follow those fields by descriptive fields where the answer to semantic queries may be found, such as the main content of a document.

If only one field specified, use a descriptive field where the answer to semantic queries may be found, such as the main content of a document. Choose a field that provides sufficient content. To ensure timely processing, only about 8,000 tokens of the aggregate contents of searchFields undergo semantic evaluation and ranking.

#### Step 3: Remove orderBy clauses

Remove any orderBy clauses, if they exist in an existing request. The semantic score is used to order results, and if you include explicit sort logic, an HTTP 400 error is returned.

#### Step 4: Add answers

Optionally, add "answers" if you want to include additional processing that provides an answer. Answers (and captions) are extracted from passages found in fields listed in searchFields. Be sure to include content-rich fields in searchFields to get the best answers in a response. For more information, see [How to return semantic answers](semantic-answers.md).

#### Step 5: Add other parameters

Set any other parameters that you want in the request. Parameters such as [speller](speller-how-to-add.md), [select](search-query-odata-select.md), and count improve the quality of the request and readability of the response.

Optionally, you can customize the highlight style applied to captions. Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

## Evaluate the response

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select parameter. It includes the original relevance score, and might also include a count, or batched results, depending on how you formulated the request.

In a semantic query, the response has additional elements: a new semantically ranked relevance score, captions in plain text and with highlights, and optionally an answer.

In a client app, you can structure the search page to include a caption as the description of the match, rather than the entire contents of a specific field. This is useful when individual fields are too dense for the search results page.

The response for the above example query returns the following match as the top pick. Captions are returned automatically, with plain text and highlighted versions. Answers are omitted from the example because one could not be determined for this particular query and corpus.

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
```

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results will carry forward to semantic search. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Similarity ranking algorithm](index-similarity-and-scoring.md)
+ [Scoring profiles](index-add-scoring-profiles.md)
+ [Semantic search overview](semantic-search-overview.md)
+ [Semantic ranking algorithm](semantic-ranking.md)
