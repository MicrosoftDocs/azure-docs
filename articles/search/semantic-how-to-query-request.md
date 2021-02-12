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
> Semantic query type is in public preview, available through the preview REST API and Azure portal. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, learn how to attach the semantic query subsystems of Azure Cognitive Search to use semantic ranking, semantic captions, and semantic answer. Setting **`queryType`** parameter to **`semantic`** enables these capabilities. This article explains how to structure both query requests and responses.

## Prerequisites

+ A search service at Basic or above

+ An existing search index (the search corpus must be `"en-us"`)

+ REST API version 2020-06-30-Preview

We recommend [Postman](search-get-started-rest.md) or [Visual Studio Code with the Cognitive Search extension](search-get-started-vs-code.md). You can also use [Search explorer](search-explorer.md) in Azure portal to submit a semantic query.

There is currently no charge for semantic search while it's in public preview, but as features transition to general availability, the computational cost of running the deep learning models will be passed along as an added charge. This information will eventually be documented in the [pricing page](https://azure.microsoft.com/pricing/details/search/) and in [estimate and manage costs](search-sku-manage-costs.md).

## What's a semantic query?

In Cognitive Search, a query is a parameterized specification of a round trip **`search`** operation, and a semantic query adds parameters that invoke the semantic query subsystems.

The following request is representative of a semantic query.

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us",  
}
```

The full specification of the REST API can be found at [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents). Internally, a semantic query is compatible with the simple query type. The operands and grouping used for **`queryType=simple`** will resolve for **`queryType=semantic`** but in general, free form text with no syntax will produce better results. The query syntax for full Lucence is not compatible.

All of the parameters in the request above are required for a semantic query.

| Parameter | Description |
|----------|-------------|
| **`queryType=semantic`** | Required for semantic queries. Invokes the semantic ranking algorithm. |
| **`queryLanguage=en-us`** | Required for semantic queries. Currently, only `"en-us"` is implemented. |
| **`searchFields=<fields>`** | Required for semantic queries. Specifies the fields over which semantic ranking occurs. In contrast with simple and full query types, when used in a semantic query, this parameter is required. </br></br>The order in which fields are listed determines precedence, with "title" having priority over "url" and so forth, in how results are ranked. If you have a title or a short field that describes your document, we recommend that to be your first field. Follow that by the url (if any), then the body of the document, and then any other relevant fields. |

## Using semantic search with other features

The following table lists other query features and provides usage recommendations.

| Feature | Recommendation |
|---------|----------------|
| [filter expressions](search-query-odata-filter.md) | Compatible |
| [spell check](speller-how-to-add.md) | Compatible |
| [Orderby expressions](search-query-odata-orderby.md) | Avoid. Explicit rankings will override semantic ranking |
| Autocomplete | Avoid|
| Suggestions | Avoid |
| [Scoring profiles](index-add-scoring-profiles.md) | Compatible. Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results will carry over to semantic search. |
| top, skip parameters | The default result set is 50 matches. You can experiment with a larger result set, up to 1000 matches, to see if semantic ranking performs better over a larger base. |

## Example queries

The following query targets the built-in Hotels sample index, using API version 2020-06-30-Preview, and will run in Search explorer. The `$select` clause limits the results to just a few fields, making it easier to scan in Search explorer.

### With queryType=semantic

```json
search=I want a nice hotel on the water with a great restaurant&$select=HotelId,HotelName,Description,Tags&queryType=semantic&queryLanguage=english&searchFields=Description,Tags
```

The first few results are as follows.

```json
{
    "@search.score": 0.38330218,
    "@search.semanticScore": 0.9754053303040564,
    "HotelId": "18",
    "HotelName": "Oceanside Resort",
    "Description": "New Luxury Hotel.  Be the first to stay. Bay views from every room, location near the piper, rooftop pool, waterfront dining & more.",
    "Tags": [
        "view",
        "laundry service",
        "air conditioning"
    ]
},
{
    "@search.score": 1.8920634,
    "@search.semanticScore": 0.8829904259182513,
    "HotelId": "36",
    "HotelName": "Pelham Hotel",
    "Description": "Stunning Downtown Hotel with indoor Pool.  Ideally located close to theatres, museums and the convention center. Indoor Pool and Sauna and fitness centre.  Popular Bar & Restaurant",
    "Tags": [
        "view",
        "pool",
        "24-hour front desk service"
    ]
},
{
    "@search.score": 0.95706713,
    "@search.semanticScore": 0.8538530203513801,
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

For comparison, run the same query as above, removing `&queryType=semantic&queryLanguage=english&searchFields=Description,Tags`. Notice that there is no `"@search.semanticScore"` in these results.

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

+ [Semantic search overview](semantic-search-overview.md)
+ [Add spell check to query inputs](speller-how-to-add.md)
+ [Structure a semantic response](semantic-how-to-query-response.md)
+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)