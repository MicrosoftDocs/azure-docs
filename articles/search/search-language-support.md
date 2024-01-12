---
title: Multi-language indexing for non-English search queries
titleSuffix: Azure AI Search
description: Create an index that supports multi-language content and then create queries scoped to that content.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/11/2024
---

# Create an index for multiple languages in Azure AI Search

If you have strings in multiple languages, you can attach [language analyzers](index-add-language-analyzers.md#supported-language-analyzers) that analyze strings using linguistic rules of a specific language during indexing and query execution. With a language analyzer, you get better handling of character variations, punctuation, and word root forms. 

Azure AI Search supports Microsoft and Lucene analyzers. By default, the search engine uses Standard Lucene, which is language agnostic. If testing indicates that the default analyzer is insufficient, replace it with a language analyzer.

In Azure AI Search, the two patterns for supporting multiple languages include:

+ Create language-specific indexes where all of the alphanumeric content is in the same language, and all searchable string fields are attributed to use the same [language analyzer](index-add-language-analyzers.md).

+ Create a blended index with language-specific versions of each field (for example, description_en, description_fr, description_ko), and then constrain full text search to just those fields at query time. This approach is useful for scenarios where language variants are only needed on a few fields, like a description.

This article focuses on steps and best practices for configuring and querying language-specific fields in a blended index:

> [!div class="checklist"]
> + Define a string field for each language variant.
> + Set a language analyzer on each field.
> + On the query request, set the `searchFields` parameter to specific fields, and then use `select` to return just those fields that have compatible content.

> [!NOTE]
> If you're using large language models in a retrieval augmented generated (RAG) pattern, you can engineer the prompt to return translated strings. That scenario is out of scope for this article.

## Prerequisites

Language analysis applies to fields of type `Edm.String` that are `searchable`, and that contain localized text. If you also need text translation, review the next section to see if AI enrichment meets your needs. 

Non-string fields and non-searchable string fields don't undergo lexical analysis and aren't tokenized. Instead, they're stored and returned verbatim.

## Add text translation

This article assumes translated strings alreach exist. If that's not the case, you can attach Azure AI services to an [enrichment pipeline](cognitive-search-concept-intro.md), invoking text translation during indexing. Text translation takes a dependency on the indexer feature and Azure AI services, but all setup is done within Azure AI Search. 

To add text translation, follow these steps:

1. Verify your content is in a [supported data source](search-indexer-overview.md#supported-data-sources).

1. [Create a data source](search-howto-create-indexers.md#prepare-external-data) that points to your content.

1. [Create a skillset](cognitive-search-defining-skillset.md) that includes the [Text Translation skill](cognitive-search-skill-text-translation.md). 

   The Text Translation skill takes a single string as input. If you have multiple fields, can create a skillset that calls Text Translation multiple times, once for each field. Alternatively, you can use the [Text Merger skill](cognitive-search-skill-textmerger.md) to consolidate the content of multiple fields into one long string.

1. Create an index that includes fields for translated strings. Most of this article covers index design and field definitions for indexing and querying multi-language content.

1. [Attach a multi-region Azure AI services resource](cognitive-search-attach-cognitive-services.md) to your skillset.

1. [Create and run the indexer](search-howto-create-indexers.md), and then apply the guidance in this article to query just the fields of interest.

> [!TIP]
> Text translation is built into the [Import data wizard](cognitive-search-quickstart-blob.md). If you have a [supported data source](search-indexer-overview.md#supported-data-sources) with text you'd like to translate, you can step through the wizard to try out the language detection and translation functionality before writing any code.

## Define fields for content in different languages

In Azure AI Search, queries target a single index. Developers who want to provide language-specific strings in a single search experience typically define dedicated fields to store the values: one field for English strings, one for French, and so on.

The `analyzer` property on a field definition is used to set the [language analyzer](index-add-language-analyzers.md). It's used for both indexing and query execution.

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
    }
  ]
}
```

## Build and load an index

An intermediate step is [building and populating the index](search-get-started-text.md) before formulating a query. We mention this step here for completeness. One way to determine index availability is by checking the indexes list in the [portal](https://portal.azure.com).

## Constrain the query and trim results

Parameters on the query are used to limit search to specific fields and then trim the results of any fields not helpful to your scenario. 

| Parameters | Purpose |
|-----------|--------------|
| `searchFields` | Limits full text search to the list of named fields. |
| `select` | Trims the response to include only the fields you specify. By default, all retrievable fields are returned. The `select` parameter lets you choose which ones to return. |

Given a goal of constraining search to fields containing French strings, you would use `searchFields` to target the query at fields containing strings in that language.

Specifying the analyzer on a query request isn't necessary. A language analyzer on the field definition determines text analysis during query execution. For queries that specify multiple fields, each invoking different language analyzers, the terms or phrases are processed concurrently by the assigned analyzers for each field.

By default, a search returns all fields that are marked as retrievable. As such, you might want to exclude fields that don't conform to the language-specific search experience you want to provide. Specifically, if you limited search to a field with French strings, you probably want to exclude fields with English strings from your results. Using the `select` query parameter gives you control over which fields are returned to the calling application.

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

Sometimes the language of the agent issuing a query isn't known, in which case the query can be issued against all fields simultaneously. IA preference for results in a certain language can be defined using [scoring profiles](index-add-scoring-profiles.md). In the example below, matches found in the description in French are scored higher relative to matches in other languages:

```JSON
  "scoringProfiles": [
    {
      "name": "frenchFirst",
      "text": {
        "weights": { "description_fr": 2 }
      }
    }
  ]
```

You would then include the scoring profile in the search request:

```http
POST /indexes/hotels/docs/search?api-version=2023-11-01
{
  "search": "pets allowed",
  "searchFields": "Tags, Description_fr",
  "select": "HotelName, Tags, Description_fr",
  "scoringProfile": "frenchFirst",
  "count": "true"
}
```

## Next steps

+ [Add a language analyzer](index-add-language-analyzers.md)
+ [How full text search works in Azure AI Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](/rest/api/searchservice/search-documents)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Skillsets overview](cognitive-search-working-with-skillsets.md)
