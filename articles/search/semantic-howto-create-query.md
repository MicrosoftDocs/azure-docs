---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
---
# Create a semantic query in Cognitive Search

> [!IMPORTANT]
> Semantic query type is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, learn how to attach the semantic query subsystems of Azure Cognitive Search to use semantic ranking, semantic captions, and semantic answer. Setting **`queryType`** parameter to **`semantic`** enables these capabilities. This article explains how to structure both query requests and responses.

## Prerequisites

+ A search service at Basic or above

+ An existing search index (the search corpus must be `"en-us"`)

+ REST API version 2020-06-30-Preview

We recommend [Postman](search-get-started-rest.md) or [Visual Studio Code with the Cognitive Search extension](search-get-started-vs-code.md).

There is currently no charge for semantic search while it's in public preview, but as features transition to general availability, the computational cost of running the deep learning models will be passed along as an added charge. This information will eventually be documented in the [pricing page](https://azure.microsoft.com/pricing/details/search/) and in [estimate and manage costs](search-sku-manage-costs.md).

## What's a semantic query?

In Cognitive Search, a query is a parameterized specification of a round-trip **`search`** operation, and a semantic query adds parameters that invoke the semantic query subsystems.


The following request is representative of a semantic query.

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us",  
    "answers": "extractive"   
}
```

The full specification of the REST API can be found at [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents).

Internally, a semantic query is compatible with the simple query type. The operands and grouping used for **`queryType=simple`** will resolve for **`queryType=semantic`** but in general, free form text with no syntax will produce better results. The query syntax for full Lucence is not compatible.

**`searchFields`** specifies the fields over which semantic processing occurs. In contrast with simple and full query types, this parameter is required. Also, the order in which fields are listed determines precedence, with "title" having priority over "url" and so forth, in how results are ranked. If you have a title or a short field that describes your document, we recommend that to be your first field. Follow that by the url (if any), then the body of the document, and then any other relevant fields. 

**`queryLanguage`** must be `"en-us"` at this time.

speller 

Set to “lexicon” if you would like spell correction to occur on the query terms. Otherwise set to “none”. 

**`answers**` governs the semantic response. Valid values are "extractive" if you want the search engine to extract and present a semantic answer as a distinct component of a result, or "none" if you want the default results.

## Understanding a semantic response

A semantic response includes new properties for answers, captions, and scoring. A semantic response is built from the standard response, using an initial set of results returned by the search engine, which are then re-ranked using the semantic ranker, and optionally restructured to include semantic answers or semantic captions.

As with all queries, a response is composed of all fields marked as "retrievable", or just those fields listed in "select".

The following example is representative of a semantic response.

```http
{ 
    "@search.answers": [ 
        { 
            "key": "a1234",                
            "text": "Turing was born in Maida Vale, London, while his father, Julius…", 
            "highlights": " Turing was born in <strong>Maida Vale, London</strong> , while his father, Julius…",", 
            "score": 0.87802511 
        } 
    ], 
    "value": [ 
        { 
            "@search.score": 51.64714, 
            "@search.rerankerScoresemanticScore": 1.9928148165345192, 
            "@search.captions": [ 
                { 
                    "text": " Alan Mathison Turing, (born June 23, 1912,  
                             London, England—died June 7, 1954…", 
                    "highlights": " Alan Mathison Turing, (born June 23, 1912, 
                             <strong/>London, England</strong>—died June…", 
                       } 
            ], 
            "id": "b5678", 
            "body":  "…" 
        }, 
        …   
    ] 
} 
```

## Using semantic search with other features

The following table lists other query features and provides usage recommendations.

| Feature | Recommendation |
|---------|----------------|
| [filter expressions](search-query-odata-filter.md) | Compatible |
| [spell check](speller-howto-add.md) | Compatible |
| [Orderby expressions](search-query-odata-orderby.md) | Avoid. Explicit rankings will override semantic ranking |
| Autocomplete | Avoid|
| Suggestions | Avoid |
| [Scoring profiles]() | Compatible. Recall that semantic responses are built over an initial result set. Any logic that improves the quality of the top responses will carry over to semantic search. |
| top, skip parameters | The default result set is 50 matches. You can experiment with a larger result set, up to 1000, to see if semantic ranking performs better over a larger base of results. |

## Next steps

+ [Add spell check to query inputs](speller-howto-add.md)
+ [Semantic search overview](semantic-search-overview.md)