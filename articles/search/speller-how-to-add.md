---
title: Add spell check to queries
titleSuffix: Azure Cognitive Search
description: Attach spelling correction to the query pipeline, to fix typos on query terms before executing the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/28/2023

---

# Add spell check to queries in Cognitive Search

> [!IMPORTANT]
> Spell correction is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal and preview REST API only.

You can improve recall by spell-correcting individual search query terms before they reach the search engine. The **speller** parameter is supported for all query types: [simple](query-simple-syntax.md), [full](query-lucene-syntax.md), and the [semantic](semantic-how-to-query-request.md) option currently in public preview.

Speller was released in tandem with the [semantic search preview](semantic-search-overview.md) and shares the "queryLanguage" parameter, but is otherwise an independent feature with its own prerequisites. There's no sign-up or extra charges for using this feature.

## Prerequisites

To use spell check, you'll need the following:

+ A search service at Basic tier or above, in any region.

+ An existing search index with content in a [supported language](#supported-languages).

+ [A query request](/rest/api/searchservice/preview-api/search-documents) that has "speller=lexicon", and "queryLanguage" set to a [supported language](#supported-languages). Spell check works on strings passed in the "search" parameter. It's not supported for filters.

Use a search client that supports preview APIs on the query request. For REST, you can use [Postman](search-get-started-rest.md), another web client, or code that you've modified to make REST calls to the preview APIs. You can also use beta releases of the Azure SDKs.

| Client library | Versions |
|----------|----------|
| REST API | [2021-04-30-Preview](/rest/api/searchservice/index-preview) or 2020-06-30-Preview |
| Azure SDK for .NET | [version 11.5.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.5.0-beta.2) | 
| Azure SDK for Java |  [version 11.6.0-beta.5](https://repo1.maven.org/maven2/com/azure/azure-search-documents/11.6.0-beta.5/azure-search-documents-11.6.0-beta.5.jar) 
| Azure SDK for JavaScript | [version 11.3.0-beta.8](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.8) |
| Azure SDK for Python | [version 11.4.0b3](https://pypi.org/project/azure-search-documents/11.4.0b3/) |

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

## Spell correction with semantic search

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

Valid values for queryLanguage can be found in the following table, copied from the list of [supported languages (REST API reference)](/rest/api/searchservice/preview-api/search-documents#queryLanguage).

| Language | queryLanguage |
|----------|---------------|
| English [EN] | EN, EN-US (default) |
| Spanish [ES] | ES, ES-ES (default)|
| French [FR] | FR, FR-FR (default) |
| German [DE] | DE, DE-DE (default) |
| Dutch [NL] | NL, NL-BE, NL-NL (default) |

### queryLanguage considerations

As noted elsewhere, a query request can only have one queryLanguage parameter, but that parameter is shared by multiple features, each of which supports a different cohort of languages. If you're just using spell check, the list of supported languages in the above table is the complete list. 

### Language analyzer considerations

Indexes that contain non-English content often use [language analyzers](index-add-language-analyzers.md) on non-English fields to apply the linguistic rules of the native language.

If you're now adding spell check to content that also undergoes language analysis, you'll achieve better results if you use the same language at every step of indexing and query processing. For example, if a field's content was indexed using the "fr.microsoft" language analyzer, then queries, spell check, semantic captions, and semantic answers should all use a French lexicon or language library of some form.

To recap how language libraries are used in Cognitive Search:

+ Language analyzers can be invoked during indexing and query execution, and are either Apache Lucene (for example, "de.lucene") or Microsoft ("de.microsoft).

+ Language lexicons invoked during spell check are specified using one of the language codes in the table above.

In a query request, the value assigned to queryLanguage applies equally to speller, [answers](semantic-answers.md), and captions. 

> [!NOTE]
> Language consistency across various property values is only a concern if you are using language analyzers. If you are using language-agnostic analyzers (such as keyword, simple, standard, stop, whitespace, or `standardasciifolding.lucene`), then the queryLanguage value can be whatever you want.

While content in a search index can be composed in multiple languages, the query input is most likely in one. The search engine doesn't check for compatibility of queryLanguage, language analyzer, and the language in which content is composed, so be sure to scope queries accordingly to avoid producing incorrect results.

## Next steps

+ [Invoke semantic ranking and captions](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)
+ [Use full Lucene query syntax](query-Lucene-syntax.md)
+ [Use simple query syntax](query-simple-syntax.md)
+ [Semantic search overview](semantic-search-overview.md)
