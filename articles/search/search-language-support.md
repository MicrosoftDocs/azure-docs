---
title: Multi-language indexing for non-English search queries
titleSuffix: Azure Cognitive Search
description: Create an index that supports multi-language content and then create queries scoped to that content.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/03/2022
---

# Create an index for multiple languages in Azure Cognitive Search

A multilingual search application supports searching over and retrieving results in the user's own language. In Azure Cognitive Search, one way to meet the language requirements of a multilingual app is to create dedicated fields for storing strings in a specific language, and then constrain full text search to just those fields at query time.

+ On field definitions, [specify a language analyzer](index-add-language-analyzers.md) that invokes the linguistic rules of the target language. 

+ On the query request, set the `searchFields` parameter to scope full text search to specific fields, and then use `select` to return just those fields that have compatible content.

The success of this technique hinges on the integrity of field content. By itself, Azure Cognitive Search doesn't translate strings or perform language detection as part of query execution. It's up to you to make sure that fields contain the strings you expect.

## Need text translation?

This article assumes you have translated strings in place. If that's not the case, you can attach Cognitive Services to an [enrichment pipeline](cognitive-search-concept-intro.md), invoking text translation during data ingestion. Text translation takes a dependency on the indexer feature and Cognitive Services, but all setup is done within Azure Cognitive Search. 

To add text translation, follow these steps:

1. Verify your content is in a [supported data source](search-indexer-overview.md#supported-data-sources).

1. [Create a data source](search-howto-create-indexers.md#prepare-external-data) that points to your content.

1. [Create a skillset](cognitive-search-defining-skillset.md) that includes the [Text Translation skill](cognitive-search-skill-text-translation.md). 

   The Text Translation skill takes a single string as input. If you have multiple fields, can create a skillset that calls Text Translation multiple times, once for each field. Alternatively, you can use the [Text Merger skill](cognitive-search-skill-textmerger.md) to consolidate the content of multiple fields into one long string.

1. Create an index that includes fields for translated strings. Most of this article covers index design and field definitions for indexing and querying multi-language content.

1. [Attach a multi-region Cognitive Services resource](cognitive-search-attach-cognitive-services.md) to your skillset.

1. [Create and run the indexer](search-howto-create-indexers.md), and then apply the guidance in this article to query just the fields of interest.

> [!TIP]
> Text translation is built into the [Import data wizard](cognitive-search-quickstart-blob.md). If you have a [supported data source](search-indexer-overview.md#supported-data-sources) with text you'd like to translate, you can step through the wizard to try out the language detection and translation functionality before writing any code.

## Define fields for content in different languages

In Azure Cognitive Search, queries target a single index. Developers who want to provide language-specific strings in a single search experience typically define dedicated fields to store the values: one field for English strings, one for French, and so on.

The "analyzer" property on a field definition is used to set the [language analyzer](index-add-language-analyzers.md). It will be used for both indexing and query execution.

```JSON
{
  "name": "hotels-sample-index",
  "fields": [
    {
      "name": "Description",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": "en.microsoft"
    },
    {
      "name": "Description_fr",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": "fr.microsoft"
    },
```

## Build and load an index

An intermediate step is [building and populating the index](search-get-started-dotnet.md) before formulating a query. We mention this step here for completeness. One way to determine index availability is by checking the indexes list in the [portal](https://portal.azure.com).

## Constrain the query and trim results

Parameters on the query are used to limit search to specific fields and then trim the results of any fields not helpful to your scenario. 

| Parameters | Purpose |
|-----------|--------------|
| **searchFields** | Limits full text search to the list of named fields. |
| **$select** | Trims the response to include only the fields you specify. By default, all retrievable fields are returned. The **$select** parameter lets you choose which ones to return. |

Given a goal of constraining search to fields containing French strings, you would use **searchFields** to target the query at fields containing strings in that language.

Specifying the analyzer on a query request isn't necessary. A language analyzer on the field definition will always be used during query processing. For queries that specify multiple fields invoking different language analyzers, the terms or phrases will be processed independently by the assigned analyzers for each field.

By default, a search returns all fields that are marked as retrievable. As such, you might want to exclude fields that don't conform to the language-specific search experience you want to provide. Specifically, if you limited search to a field with French strings, you probably want to exclude fields with English strings from your results. Using the **$select** query parameter gives you control over which fields are returned to the calling application.

#### Example in REST

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30
{
    "search": "animaux acceptés",
    "searchFields": "Tags, Description_fr",
    "select": "HotelName, Description_fr, Address/City, Address/StateProvince, Tags",
    "count": "true"
}
```

#### Example in C#

```csharp
private static void RunQueries(SearchClient srchclient)
{
    SearchOptions options;
    SearchResults<Hotel> response;

    options = new SearchOptions()
    {
        IncludeTotalCount = true,
        Filter = "",
        OrderBy = { "" }
    };

    options.Select.Add("HotelId");
    options.Select.Add("HotelName");
    options.Select.Add("Description_fr");
    options.SearchFields.Add("Tags");
    options.SearchFields.Add("Description_fr");

    response = srchclient.Search<Hotel>("*", options);
    WriteDocuments(response);
}
```

## Boost language-specific fields

Sometimes the language of the agent issuing a query isn't known, in which case the query can be issued against all fields simultaneously. IA preference for results in a certain language can be defined using [scoring profiles](index-add-scoring-profiles.md). In the example below, matches found in the description in English will be scored higher relative to matches in other languages:

```JSON
  "scoringProfiles": [
    {
      "name": "englishFirst",
      "text": {
        "weights": { "description": 2 }
      }
    }
  ]
```

You would then include the scoring profile in the search request:

```http
POST /indexes/hotels/docs/search?api-version=2020-06-30
{
  "search": "pets allowed",
  "searchFields": "Tags, Description",
  "select": "HotelName, Tags, Description",
  "scoringProfile": "englishFirst",
  "count": "true"
}
```

## Next steps

+ [Add a language analyzer](index-add-language-analyzers.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](/rest/api/searchservice/search-documents)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Skillsets overview](cognitive-search-working-with-skillsets.md)