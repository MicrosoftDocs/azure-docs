---
title: Multi-language indexing for non-English search queries
titleSuffix: Azure Cognitive Search
description: Create an index that supports multi-language content and then create queries scoped to that content.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/22/2021
---

# How to create an index for multiple languages in Azure Cognitive Search

A key requirement in a multilingual search application is the ability to search over and retrieve results in the user's own language. In Azure Cognitive Search, one way to meet the language requirements of a multilingual app is to create dedicated fields for storing strings in a specific language, and then constrain full text search to just those fields at query time.

+ On field definitions, set a language analyzer that invokes the linguistic rules of the target language. To view the full list of supported analyzers, see [Add language analyzers](index-add-language-analyzers.md).

+ On the query request, set parameters to scope full text search to specific fields, and then trim the results of any fields that don't provide content compatible with the search experience you want to deliver.

The success of this technique hinges on the integrity of field contents. Azure Cognitive Search does not translate strings or perform language detection as part of query execution. It is up to you to make sure that fields contain the strings you expect.

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

An intermediate (and perhaps obvious) step is that you have to [build and populate the index](search-get-started-dotnet.md) before formulating a query. We mention this step here for completeness. One way to determine index availability is by checking the indexes list in the [portal](https://portal.azure.com).

> [!TIP]
> Language detection and text translation are supported during data ingestion through [AI enrichment](cognitive-search-concept-intro.md) and [skillsets](cognitive-search-working-with-skillsets.md). If you have an Azure data source with mixed language content, you can try out the language detection and translation features using the [Import data wizard](cognitive-search-quickstart-blob.md).

## Constrain the query and trim results

Parameters on the query are used to limit search to specific fields and then trim the results of any fields not helpful to your scenario. 

| Parameters | Purpose |
|-----------|--------------|
| **searchFields** | Limits full text search to the list of named fields. |
| **$select** | Trims the response to include only the fields you specify. By default, all retrievable fields are returned. The **$select** parameter lets you choose which ones to return. |

Given a goal of constraining search to fields containing French strings, you would use **searchFields** to target the query at fields containing strings in that language.

Specifying the analyzer on a query request is not necessary. A language analyzer on the field definition will always be used during query processing. For queries that specify multiple fields invoking different language analyzers, the terms or phrases will be processed independently by the assigned analyzers for each field.

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

Sometimes the language of the agent issuing a query is not known, in which case the query can be issued against all fields simultaneously. IA preference for results in a certain language can be defined using [scoring profiles](index-add-scoring-profiles.md). In the example below, matches found in the description in English will be scored higher relative to matches in other languages:

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

+ [Language analyzers](index-add-language-analyzers.md)
+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)
+ [Search Documents REST API](/rest/api/searchservice/search-documents)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Skillsets overview](cognitive-search-working-with-skillsets.md)