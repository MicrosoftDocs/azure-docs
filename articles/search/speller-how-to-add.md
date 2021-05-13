---
title: Add spell check
titleSuffix: Azure Cognitive Search
description: Attach spelling correction to the query pipeline, to fix typos on query terms before executing the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/19/2021
ms.custom: references_regions
---
# Add spell check to queries in Cognitive Search

> [!IMPORTANT]
> Spell correction is in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During the initial preview launch, there is no charge for speller. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

You can improve recall by spell-correcting individual search query terms before they reach the search engine. The **speller** parameter is supported for all query types: [simple](query-simple-syntax.md), [full](query-lucene-syntax.md), and the new [semantic](semantic-how-to-query-request.md) option currently in public preview.

## Prerequisites

+ An existing search index, with content in a [supported language](#supported-language). Currently, spell correction does not work with [synonyms](search-synonyms.md). Avoid using it on indexes that specify a synonym map in any field definition.

+ A search client for sending queries

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that you've modified to make REST calls to the preview APIs.

+ [A query request](/rest/api/searchservice/preview-api/search-documents) that invokes spell correction must have "api-version=2020-06-30-Preview", "speller=lexicon", and "queryLanguage" set to a [supported language](#supported-languages).

> [!Note]
> The speller parameter is available on all tiers, in the same regions that provide semantic search. Sign up is required but there is no change and no tier restrictions. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

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

Spelling correction occurs on individual query terms that undergo analysis, which is why you can use the speller parameter with some Lucene queries, but not others.

+ Incompatible query forms that bypass text analysis include: wildcard, regex, fuzzy
+ Compatible query forms include: fielded search, proximity, term boosting

This example uses fielded search over the Category field, with full Lucene syntax, and a misspelled query term. By including speller, the typo in "Suiite" is corrected and the query succeeds.

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

This query, with typos in every term except one, undergoes spelling corrections to return relevant results. To learn more, see [Create a semantic query](semantic-how-to-query-request.md).

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview     
{
    "search": "hisotoric hotell wiht great restrant nad wiifi",
    "queryType": "semantic",
    "speller": "lexicon",
    "queryLanguage": "en-us",
    "searchFields": "HotelName,Tags,Description",
    "select": "HotelId,HotelName,Description,Category,Tags",
    "count": true
}
```

## Supported languages

| Language | queryLanguage |
|----------|---------------|
| English [EN] | EN, EN-US (default), EN-GB, EN-IN, EN-CA, EN-AU |
| Spanish [ES] | ES, ES-ES (default), ES-MX |
| French [FR] | FR, FR-FR (default), FR-CA |
| German [DE] | DE, DE-DE (default) |

## Language considerations

The queryLanguage parameter required for speller must be consistent with any [language analyzers](index-add-language-analyzers.md) assigned to field definitions in the index schema. For example, if a field's content was indexed using the "fr.microsoft" language analyzer, then queries, spell check, semantic ranking, and semantic answers should all use a French language library of some form.

+ Language analyzers invoked during indexing and queries can be either full Lucene (for example, "de.lucene") or Microsoft ("de.microsoft).

+ Lexicons invoked during spell check are specified using one of the language codes listed above.

In a query request, the queryLanguage applies equally to speller, [answers](semantic-answers.md), and captions. There is no override for individual parts of a semantic response. Currently, the list of supported languages is smaller for spell check than it is for semantic ranking, captions, and answers. A table that shows language availability across features can be found in the [REST API reference](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

> [!NOTE]
> Language consistency across various property values is only a concern if you are using language analyzers. If you are using language-agnostic analyzers (such as keyword, simple, standard, stop, whitespace, or `standardasciifolding.lucene`), then the queryLanguage value can be whatever you want.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't explicitly check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

## Next steps

+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)
+ [Semantic search overview](semantic-search-overview.md)