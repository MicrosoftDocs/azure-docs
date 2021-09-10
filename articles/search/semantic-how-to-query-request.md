---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/21/2021
---
# Create a query that invokes semantic ranking and returns semantic captions

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and beta SDKs. These features are billable. For more information about, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic search is a premium feature in Azure Cognitive Search that invokes a semantic ranking algorithm over a result set and returns semantic captions (and optionally [semantic answers](semantic-answers.md)), with highlights over the most relevant terms and phrases. Both captions and answers are returned in query requests formulated using the "semantic" query type.

Captions and answers are extracted verbatim from text in the search document. The semantic subsystem determines what part of your content has the characteristics of a caption or answer, but it does not compose new sentences or phrases. For this reason, content that includes explanations or definitions work best for semantic search.

## Prerequisites

+ A Cognitive Search service at a Standard tier (S1, S2, S3), located in one of these regions: North Central US, West US, West US 2, East US 2, North Europe, West Europe. If you have an existing S1 or greater service in one of these regions, you can sign up for the preview without having to create a new service.

+ [Sign up for the preview](https://aka.ms/SemanticSearchPreviewSignup). Expected turnaround is about two business days.

+ An existing search index with content in a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage). Semantic search works best on content that is informational or descriptive.

+ A search client for sending queries.

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that makes REST calls to the preview APIs. You can also use [Search explorer](search-explorer.md) in Azure portal to submit a semantic query. You can also use [Azure.Search.Documents 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2).

+ A [query request](/rest/api/searchservice/preview-api/search-documents) must include `queryType=semantic` and other parameters described in this article.

## What's a semantic query type?

In Cognitive Search, a query is a parameterized request that determines query processing and the shape of the response. A *semantic query* [has parameters](#query-using-rest) that invoke the semantic reranking model that can assess the context and meaning of matching results, promote more relevant matches to the top, and return semantic answers and captions.

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

Only the top 50 matches from the initial results can be semantically ranked, and all results include captions in the response. Optionally, you can specify an **`answer`** parameter on the request to extract a potential answer. For more information, see [Semantic answers](semantic-answers.md).

## Query in Azure portal

[Search explorer](search-explorer.md) has been updated to include options for semantic queries. These options become visible in the portal after completing the following steps:

1. Open the portal with this syntax: `https://portal.azure.com/?feature.semanticSearch=true`, on a search service for which the preview is enabled.

1. Click **Search explorer** at the top of the overview page.

1. Choose an index that has content in a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

1. In Search explorer, set query options that enable semantic queries, searchFields, and spell correction. You can also paste the required query parameters into the query string.

:::image type="content" source="./media/semantic-search-overview/search-explorer-semantic-query-options.png" alt-text="Query options in Search explorer" border="true":::

## Query using REST

Use the [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents) to formulate the request programmatically. A response includes captions and highlighting automatically. If you want spelling correction or answers in the response, add **`speller`** or **`answers`** to the request.

The following example uses the [hotels-sample-index](search-get-started-portal.md) to create a semantic query request with spell check, semantic answers, and captions:

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

The following table summarizes the parameters used in a semantic query. For a list of all parameters in a request, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Type | Description |
|-----------|-------|-------------|
| queryType | String | Valid values include simple, full, and semantic. A value of "semantic" is required for semantic queries. |
| queryLanguage | String | Required for semantic queries. The lexicon you specify applies equally to semantic ranking, captions, answers, and spell check. For more information, see [supported languages (REST API reference)](/rest/api/searchservice/preview-api/search-documents#queryLanguage). |
| searchFields | String | A comma-delimited list of searchable fields. Specifies the fields over which semantic ranking occurs, from which captions and answers are extracted. </br></br>In contrast with simple and full query types, the order in which fields are listed determines precedence. For more usage instructions, see [Step 2: Set searchFields](#searchfields). |
| speller | String | Optional parameter, not specific to semantic queries, that corrects misspelled terms before they reach the search engine. For more information, see [Add spell correction to queries](speller-how-to-add.md). |
| answers |String | Optional parameters that specify whether semantic answers are included in the result. Currently, only "extractive" is implemented. Answers can be configured to return a maximum of ten. The default is one. This example shows a count of three answers: `extractive\|count-3`. For more information, see [Return semantic answers](semantic-answers.md).|

### Formulate the request

This section steps through query formulation.

#### Step 1: Set queryType and queryLanguage

Add the following parameters to the rest. Both parameters are required.

```json
"queryType": "semantic",
"queryLanguage": "en-us",
```

The queryLanguage must be a [supported language](/rest/api/searchservice/preview-api/search-documents#queryLanguage) and it must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. For example, you indexed French strings using a French language analyzer (such as "fr.microsoft" or "fr.lucene"), then queryLanguage should also be French language variant.

In a query request, if you are also using [spell correction](speller-how-to-add.md), the queryLanguage you set applies equally to speller, answers, and captions. There is no override for individual parts. Spell check supports [fewer languages](speller-how-to-add.md#supported-languages), so if you are using that feature, you must set queryLanguage to one from that list.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

<a name="searchfields"></a>

#### Step 2: Set searchFields

Add searchFields to the request. It's optional but strongly recommended.

```json
"searchFields": "HotelName,Category,Description",
```

The searchFields parameter is used to identify passages to be evaluated for "semantic similarity" to the query. For the preview, we do not recommend leaving searchFields blank as the model requires a hint as to which fields are the most important to process.

In contrast with other parameters, searchFields is not new. You might already be using searchFields in existing code for simple or full Lucene queries. If so, revisit how the parameter is used so that you can check for field order when switching to a semantic query type.

##### Allowed data types

When setting searchFields, choose only fields of the following [supported data types](/rest/api/searchservice/supported-data-types). If you happen to include an invalid field, there is no error, but those fields won't be used in semantic ranking.

| Data type | Example from hotels-sample-index |
|-----------|----------------------------------|
| Edm.String | HotelName, Category, Description |
| Edm.ComplexType | Address.StreetNumber, Address.City, Address.StateProvince, Address.PostalCode |
| Collection(Edm.String) | Tags (a comma-delimited list of strings) |

##### Order of fields in searchFields

Field order is critical because the semantic ranker limits the amount of content it can process while still delivering a reasonable response time. Content from fields at the start of the list are more likely to be included; content from the end could be truncated if the maximum limit is reached. For more information, see [Pre-processing during semantic ranking](semantic-ranking.md#pre-processing).

+ If you're specifying just one field, choose a descriptive field where the answer to semantic queries might be found, such as the main content of a document. 

+ For two or more fields in searchFields:

  + The first field should always be concise (such as a title or name), ideally a string that is under 25 words.

  + If the index has a URL field that is human readable such as `www.domain.com/name-of-the-document-and-other-details`, (rather than machine focused, such as `www.domain.com/?id=23463&param=eis`), place it second in the list (or first if there is no concise title field).

  + Follow the above fields with other descriptive fields, where the answer to semantic queries may be found, such as the main content of a document.

#### Step 3: Remove or bracket query features that bypass relevance scoring

Several query capabilities in Cognitive Search do not undergo relevance scoring, and some bypass the full text search engine altogether. If your query logic includes the following features, you will not get relevance scores or semantic ranking on your results:

+ Filters, fuzzy search queries, and regular expressions iterate over untokenized text, scanning for verbatim matches in the content. Search scores for all of the above query forms are a uniform 1.0, and won't provide meaningful input for semantic ranking.

+ Sorting (orderBy clauses) on specific fields will also override search scores and semantic score. Given that semantic score is used to order results, including explicit sort logic will case an HTTP 400 error to be returned.

#### Step 4: Add answers

Optionally, add "answers" if you want to include additional processing that provides an answer. For details about this parameter, see [How to specify semantic answers](semantic-answers.md).

```json
"answers": "extractive|count-3",
```

Answers (and captions) are extracted from passages found in fields listed in searchFields. This is why you want to include content-rich fields in searchFields, so that you can get the best answers in a response. Answers are not guaranteed on every request. The query must look like a question, and the content must include text that looks like an answer.

#### Step 5: Add other parameters

Set any other parameters that you want in the request. Parameters such as [speller](speller-how-to-add.md), [select](search-query-odata-select.md), and count improve the quality of the request and readability of the response.

```json
"speller": "lexicon",
"select": "HotelId,HotelName,Description,Category",
"count": true,
"highlightPreTag": "<mark>",
"highlightPostTag": "</mark>",
```

Highlight styling is applied to captions in the response. You can use the default style, or optionally customize the highlight style applied to captions. Captions apply highlight formatting over key passages in the document that summarize the response. The default is `<em>`. If you want to specify the type of formatting (for example, yellow background), you can set the highlightPreTag and highlightPostTag.

## Query using Azure SDKs

Beta versions of the Azure SDKs include support for semantic search. Because the SDKs are beta versions, there is no documentation or samples, but you can refer to the REST API section above for insights on how the APIs should work.

| Azure SDK | Package |
|-----------|---------|
| .NET | [Azure.Search.Documents package 11.3.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.3.0-beta.2)  |
| Java | [com.azure:azure-search-documents 11.4.0-beta.2](https://search.maven.org/artifact/com.azure/azure-search-documents/11.4.0-beta.2/jar)  |
| JavaScript | [azure/search-documents 11.2.0-beta.2](https://www.npmjs.com/package/@azure/search-documents/v/11.2.0-beta.2)|
| Python | [azure-search-documents 11.2.0b3](https://pypi.org/project/azure-search-documents/11.2.0b3/) |

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
