---
title: Add spell check
titleSuffix: Azure Cognitive Search
description: Attach a spell check to query parsing, checking and correcting for common misspellings and typos on query inputs before executing the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
---
# Add spell check to queries in Cognitive Search

> [!IMPORTANT]
> Spell correction is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can improve recall by spell-correcting individual search query terms before they are parsed. The **speller** parameter is supported for all query types: [simple](query-simple-syntax.md), [full](query-lucene-syntax.md), and the new [semantic](semantic-how-to-query-request.md) option currently in public preview.

## Prerequisites

+ An existing search index, containing English content

+ A search client for sending queries

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that you've modified to make REST calls to the preview APIs.

+ [A query request](/rest/api/searchservice/preview-api/search-documents) that uses spell correction has "api-version=2020-06-30-Preview", "speller=lexicon", and "queryLanguage=en-us"

> [!Note]
> The speller parameter is available on all tiers, in all regions that provide Azure Cognitive Search.

## Spell correction with simple search

The following example uses the built-in hotels-sample index to demonstrate spell correction on a simple free form text query. Without spell correction, the query returns zero results. With correction, the query returns one result for Johnson's family-oriented resort.

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview
{
    "search": "famly acitvites",
    "speller": "lexicon",
    "queryLanguage": "en-us",
    "queryType": "simple",
    "select": "HotelId,HotelName,Description,Category,Tags",
    "count": true
}
```

## Spell correction with full Lucene

Spelling correction occurs just prior to text analysis. As such, you can use the speller parameter with any full Lucene queries that undergo text analysis.

+ Incompatible query forms include: wildcard, regex, fuzzy
+ Compatible query forms include: fielded search, proximity, term boosting

This example uses fielded search over the Category field, with full Lucene syntax, and a misspelled query string. Without speller, there are no matches on Suite.

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview
{
    "search": "Category:(Resort and Spa) OR Category:Suiite",
    "queryType": "full",
    "speller": "lexicon",
    "queryLanguage": "en-us",
    "select": "Category",
    "count": true
}
```

## Spell correction with semantic search

This query, with typos in every term except one, undergoes spelling corrections to return relevant results using simple syntax (no fuzzy search).

In a semantic query, the order of fields in the `searchFields` parameter informs search rank. To learn more, see [Create a semantic query](semantic-how-to-query-request.md).

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30     
{
    "search": "hisotoric hotell wiht great restrant nad wiifi",
    "queryType": "semantic",
    "speller": "lexicon",
    "queryLanguage": "en-us",
    "searchFields": "HotelName,Tags,Description,Tags",
    "select": "HotelId,HotelName,Description,Category,Tags",
    "count": true
}
```

## Language considerations

The queryLanguage parameter used for spell check is independent of the field-level language properties associated with analyzers in the index schema, but it is co-dependent with other properties used in a semantic search query. Neither simple queries or full-syntax queries have a queryLanguage property, but both "answers" and "captions" require it, and the value specified on the request must work for all of the properties it serves.

The speller applies to query terms the same way for all fields in the index, regardless of which lexical analyzer is configured on those fields. While content in a search index can be composed in multiple languages, the query input is most likely in one. It’s up to you to scope the query to the fields it applies to based on the language when the speller is enabled to avoid producing incorrect results. 

## Next steps

+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)
+ [Semantic search overview](semantic-search-overview.md)