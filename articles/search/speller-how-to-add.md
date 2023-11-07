---
title: Add spell check to queries
titleSuffix: Azure AI Search
description: Attach spelling correction to the query pipeline, to fix typos on query terms before executing the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/20/2023

---

# Add spell check to queries in Azure AI Search

> [!IMPORTANT]
> Spell correction is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST APIs, and beta versions of Azure SDK libraries.

You can improve recall by spell-correcting words in a query before they reach the search engine. The `speller` parameter is supported for all text (non-vector) query types.

## Prerequisites

+ A search service at the Basic tier or higher, in any region.

+ An existing search index with content in a [supported language](#supported-languages).

+ [A query request](/rest/api/searchservice/preview-api/search-documents) that has `speller=lexicon` and `queryLanguage` set to a [supported language](#supported-languages). Spell check works on strings passed in the `search` parameter. It's not supported for filters, fuzzy search, wildcard search, regular expressions, or vector queries.

Use a search client that supports preview APIs on the query request. For REST, you can use [Postman](search-get-started-rest.md), another web client, or code that you've modified to make REST calls to the preview APIs. You can also use beta releases of the Azure SDKs.

| Client library | Versions |
|----------|----------|
| REST API | Versions 2020-06-30-Preview and later. The current version is [2023-10-01-Preview](/rest/api/searchservice/documents/search-post?view=rest-searchservice-2023-10-01-preview&preserve-view=true)|
| Azure SDK for .NET | [version 11.5.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.5.0-beta.2) | 
| Azure SDK for Java |  [version 11.6.0-beta.5](https://central.sonatype.com/artifact/com.azure/azure-search-documents) |
| Azure SDK for JavaScript | [version 11.3.0-beta.8](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.8) |
| Azure SDK for Python | [version 11.4.0b3](https://pypi.org/project/azure-search-documents/11.4.0b3/) |

## Spell correction with simple search

The following example uses the built-in hotels-sample index to demonstrate spell correction on a simple text query. Without spell correction, the query returns zero results. With correction, the query returns one result for Johnson's family-oriented resort.

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

Spelling correction occurs on individual query terms that undergo text analysis, which is why you can use the speller parameter with some Lucene queries, but not others.

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

## Spell correction with semantic ranking

This query, with typos in every term except one, undergoes spelling corrections to return relevant results. To learn more, see [Configure semantic ranking](semantic-how-to-query-request.md).

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

Valid values for `queryLanguage` can be found in the following table, copied from the list of [supported languages (REST API reference)](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

| Language | queryLanguage |
|----------|---------------|
| English [EN] | EN, EN-US (default) |
| Spanish [ES] | ES, ES-ES (default)|
| French [FR] | FR, FR-FR (default) |
| German [DE] | DE, DE-DE (default) |
| Dutch [NL] | NL, NL-BE, NL-NL (default) |

> [!NOTE]
> Previously, while semantic ranking was in public preview, the `queryLanguage` parameter was also used for semantic ranking. Semantic ranking is now language-agnostic.

### Language analyzer considerations

Indexes that contain non-English content often use [language analyzers](index-add-language-analyzers.md) on non-English fields to apply the linguistic rules of the native language.

When adding spell check to content that also undergoes language analysis, you can achieve better results using the same language for each indexing and query processing step. For example, if a field's content was indexed using the "fr.microsoft" language analyzer, then queries and spell check should all use a French lexicon or language library of some form.

To recap how language libraries are used in Azure AI Search:

+ Language analyzers can be invoked during indexing and query execution, and are either Apache Lucene (for example, "de.lucene") or Microsoft ("de.microsoft).

+ Language lexicons invoked during spell check are specified using one of the language codes in the [supported language](#supported-languages) table.

In a query request, the value assigned to `queryLanguage` applies to `speller`. 

> [!NOTE]
> Language consistency across various property values is only a concern if you are using language analyzers. If you are using language-agnostic analyzers (such as keyword, simple, standard, stop, whitespace, or `standardasciifolding.lucene`), then the `queryLanguage` value can be whatever you want.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of `queryLanguage`, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

## Next steps

+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)