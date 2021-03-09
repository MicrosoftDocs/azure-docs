---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/05/2021
---
# Create a semantic query in Cognitive Search

> [!IMPORTANT]
> Semantic query type is in public preview, available through the preview REST API and Azure portal. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During the initial preview launch, there is no charge for semantic search. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

In this article, learn how to formulate a search request that uses semantic ranking, and produces semantic captions and answers.

Semantic queries tend to work best on search indexes that are built off of text-heavy content, such as PDFs or documents with large chunks of text.

## Prerequisites

+ A search service at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. If you have an existing S1 or greater service in one of these regions, you can request access without having to create a new service.

+ Access to semantic search preview: [sign up](https://aka.ms/SemanticSearchPreviewSignup)

+ An existing search index, containing English content

+ A search client for sending queries

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that you've modified to make REST calls to the preview APIs. You can also use [Search explorer](search-explorer.md) in Azure portal to submit a semantic query.

+ A [Search Documents](/rest/api/searchservice/preview-api/search-documents) request with the semantic option and other parameters described in this article.

## What's a semantic query?

In Cognitive Search, a query is a parameterized request that determines query processing and the shape of the response. A *semantic query* adds parameters that invoke the semantic reranking model that can assess the context and meaning of matching results, promote more relevant matches to the top, and return semantic answers and captions.

The following request is representative of a basic semantic query (without answers).

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us"  
}
```

As with all queries in Cognitive Search, the request targets the documents collection of a single index. Furthermore, a semantic query undergoes the same sequence of parsing, analysis, and scanning as a non-semantic query. The difference lies in how relevance is computed. As defined in this preview release, a semantic query is one whose *results* are re-processed using advanced algorithms, providing a way to surface the matches deemed most relevant by the semantic ranker, rather than the scores assigned by the default similarity ranking algorithm. 

Only the top 50 matches from the initial results can be semantically ranked, and all include captions in the response. Optionally, you can specify an **`answer`** parameter on the request to extract a potential answer. This model formulates up to five potential answers to the query, which you can choose to render at the top of search page.

## Query using REST APIs

The full specification of the REST API can be found at [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents).

Semantic queries provide captions and highlighting automatically. If you want the response to include answers, you can add an  optional **`answer`** parameter on the request. This parameter, plus the construction of the query string itself, will produce an answer in the response.

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

The order of the searchFields is critical. If you already use searchFields in existing simple or full Lucene queries, be sure that you revisit this parameter when switching to a semantic query type.

Follow these guidelines to ensure optimum results when two or more searchFields are specified:

+ Include only string fields and top-level string fields in collections. If you happen to include non-string fields or lower-level fields in a collection, there is no error, but those fields won't be used in semantic ranking.

+ First field should always be concise (such as a title or name), ideally under 25 words.

+ If the index has a URL field that is textual (human readable such as `www.domain.com/name-of-the-document-and-other-details` and not machine focused such as `www.domain.com/?id=23463&param=eis`), place it second in the list (or first if there is no concise title field).

+ Follow those fields by descriptive fields where the answer to semantic queries may be found, such as the main content of a document.

If only one field specified, use a descriptive fields where the answer to semantic queries may be found, such as the main content of a document. Choose a field that provides sufficient content.

#### Step 3: Remove orderBy clauses

Remove any orderBy clauses, if they exist in an existing request. The semantic score is used to order results, and if you include explicit sort logic, an HTTP 400 error is returned.

#### Step 4: add answers

Optionally, add "answers" if you want to include additional processing that provides an answer. Answers (and captions) are formulated from passages found in fields listed in searchFields. Be sure to include content-rich fields in searchFields to get the best answers and captions in a response.

There are explicit and implicit conditions that produce answers. 

+ Explicit conditions include adding "answers=extractive". Additionally, to specify the number of answers returned in the overall response, add "count" followed by a number: `"answers=extractive|count=3"`.  The default is one. Maximum is five.

+ Implicit conditions include a query string construction that lends itself to an answer. A query composed of 'what hotel has the green room' is more likely to be "answered" than a query composed of a statement like 'hotel with fancy interior'. As you might expect, the query cannot be unspecified or null.

The important point to take away is that if the query doesn't look like a question, answer processing is skipped, even if the "answers" parameter is set.

#### Step 5: Add other parameters

Set any other parameters that you want in the request. Parameters such as [speller](speller-how-to-add.md), [select](search-query-odata-select.md), and count improve the quality of the request and readability of the response.

Optionally, you can customize the highlight style applied to captions. Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

### Review the response

Response for the above query returns the following match as the top pick. Captions are returned automatically, with plain text and highlighted versions. For more information about semantic responses, see [Semantic ranking and responses](semantic-how-to-query-response.md).

```json
"@odata.count": 29,
"value": [
    {
        "@search.score": 1.8920634,
        "@search.rerankerScore": 1.1091284966096282,
        "@search.captions": [
            {
                "text": "Oceanside Resort. Budget. New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
                "highlights": "<strong>Oceanside Resort.</strong> Budget. New Luxury Hotel. Be the first to stay.<strong> Bay views</strong> from every room, location near the pier, rooftop pool, waterfront dining & more."
            }
        ],
        "HotelId": "18",
        "HotelName": "Oceanside Resort",
        "Description": "New Luxury Hotel.  Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
        "Category": "Budget"
    },
```

### Parameters used in a semantic query

The following table summarizes the query parameters used in a semantic query so that you can see them holistically. For a list of all parameters, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Type | Description |
|-----------|-------|-------------|
| queryType | String | Valid values include simple, full, and semantic. A value of "semantic" is required for semantic queries. |
| queryLanguage | String | Required for semantic queries. Currently, only "en-us" is implemented. |
| searchFields | String | A comma-delimited list of searchable fields. Optional but recommended. Specifies the fields over which semantic ranking occurs. </br></br>In contrast with simple and full query types, the order in which fields are listed determines precedence.|
| answers |String | Optional field to specify whether semantic answers are included in the result. Currently, only "extractive" is implemented. Answers can be configured to return a maximum of five. The default is one. This example shows a count of three answers: "extractive\|count3"`. |

## Query with Search explorer

The following query targets the built-in Hotels sample index, using API version 2020-06-30-Preview, and runs in Search explorer. The `$select` clause limits the results to just a few fields, making it easier to scan in the verbose JSON in Search explorer.

### With queryType=semantic

```json
search=nice hotel on water with a great restaurant&$select=HotelId,HotelName,Description,Tags&queryType=semantic&queryLanguage=english&searchFields=Description,Tags
```

The first few results are as follows.

```json
{
    "@search.score": 0.38330218,
    "@search.rerankerScore": 0.9754053303040564,
    "HotelId": "18",
    "HotelName": "Oceanside Resort",
    "Description": "New Luxury Hotel. Be the first to stay. Bay views from every room, location near the pier, rooftop pool, waterfront dining & more.",
    "Tags": [
        "view",
        "laundry service",
        "air conditioning"
    ]
},
{
    "@search.score": 1.8920634,
    "@search.rerankerScore": 0.8829904259182513,
    "HotelId": "36",
    "HotelName": "Pelham Hotel",
    "Description": "Stunning Downtown Hotel with indoor Pool. Ideally located close to theatres, museums and the convention center. Indoor Pool and Sauna and fitness centre. Popular Bar & Restaurant",
    "Tags": [
        "view",
        "pool",
        "24-hour front desk service"
    ]
},
{
    "@search.score": 0.95706713,
    "@search.rerankerScore": 0.8538530203513801,
    "HotelId": "22",
    "HotelName": "Stone Lion Inn",
    "Description": "Full breakfast buffet for 2 for only $1.  Excited to show off our room upgrades, faster high speed WiFi, updated corridors & meeting space. Come relax and enjoy your stay.",
    "Tags": [
        "laundry service",
        "air conditioning",
        "restaurant"
    ]
},
```

### With queryType (default)

For comparison, run the same query as above, removing `&queryType=semantic&queryLanguage=english&searchFields=Description,Tags`. Notice that there is no `"@search.rerankerScore"` in these results, and that different hotels appear in the top three positions.

```json
{
    "@search.score": 8.633856,
    "HotelId": "3",
    "HotelName": "Triple Landscape Hotel",
    "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
    "Tags": [
        "air conditioning",
        "bar",
        "continental breakfast"
    ]
},
{
    "@search.score": 6.407289,
    "HotelId": "40",
    "HotelName": "Trails End Motel",
    "Description": "Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport.",
    "Tags": [
        "continental breakfast",
        "view",
        "view"
    ]
},
{
    "@search.score": 5.843788,
    "HotelId": "14",
    "HotelName": "Twin Vertex Hotel",
    "Description": "New experience in the Making.  Be the first to experience the luxury of the Twin Vertex. Reserve one of our newly-renovated guest rooms today.",
    "Tags": [
        "bar",
        "restaurant",
        "air conditioning"
    ]
},
```

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results will carry forward to semantic search. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Similarity and scoring in Cognitive Search](index-similarity-and-scoring.md)
+ [Add scoring profiles](index-add-scoring-profiles.md)
+ [Semantic search overview](semantic-search-overview.md)
+ [Add spell check to query terms](speller-how-to-add.md)
