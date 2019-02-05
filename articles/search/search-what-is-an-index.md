---
title: Create an index definition and concepts - Azure Search
description: Introduction to index terms and concepts in Azure Search, including component parts and physical structure.
author: HeidiSteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.topic: conceptual
ms.date: 02/01/2019
ms.custom: seodec2018
---
# Create a basic index in Azure Search

In Azure Search, an *index* is a persistent store of *documents* and other constructs used for filtered and full text search on an Azure Search service. Conceptually, a document is a single unit of searchable data in your index. For example, an e-commerce retailer might have a document for each item they sell, a news organization might have a document for each article, and so forth. Mapping these concepts to more familiar database equivalents: an *index* is conceptually similar to a *table*, and *documents* are roughly equivalent to *rows* in a table.

When you add or upload an index, Azure Search creates physical structures based on the schema you provide. For example, if a field in your index is marked as searchable, an inverted index is created for that field. Later, when you add or upload documents, or submit search queries to Azure Search, you are sending requests to a specific index in your search service. Loading fields with document values is called *indexing* or data ingestion.

You can create an index in the portal, [REST API](search-create-index-rest-api.md), or [.NET SDK](search-create-index-dotnet.md).

## Components of an index

Schematically, an Azure Search index is composed of the following elements. 

The [*fields collection*](#fields-collection) is typically the largest part of an index, where each field is named, typed, and attributed with allowable behaviors that determine how it is used. Other elements include [suggesters](#suggesters), [scoring profiles](#scoring-profiles), [analyzers](#analyzers) with component parts to support customization, and [CORS](#cors) options.

```json
{  
  "name": (optional on PUT; required on POST) "name_of_index",  
  "fields": [  
    {  
      "name": "name_of_field",  
      "type": "Edm.String | Collection(Edm.String) | Edm.Int32 | Edm.Int64 | Edm.Double | Edm.Boolean | Edm.DateTimeOffset | Edm.GeographyPoint",  
      "searchable": true (default where applicable) | false (only Edm.String and Collection(Edm.String) fields can be searchable),  
      "filterable": true (default) | false,  
      "sortable": true (default where applicable) | false (Collection(Edm.String) fields cannot be sortable),  
      "facetable": true (default where applicable) | false (Edm.GeographyPoint fields cannot be facetable),  
      "key": true | false (default, only Edm.String fields can be keys),  
      "retrievable": true (default) | false,  
      "analyzer": "name_of_analyzer_for_search_and_indexing", (only if 'searchAnalyzer' and 'indexAnalyzer' are not set)
      "searchAnalyzer": "name_of_search_analyzer", (only if 'indexAnalyzer' is set and 'analyzer' is not set)
      "indexAnalyzer": "name_of_indexing_analyzer", (only if 'searchAnalyzer' is set and 'analyzer' is not set)
      "synonymMaps": [ "name_of_synonym_map" ] (optional, only one synonym map per field is currently supported)
    }  
  ],  
  "suggesters": [  
    {  
      "name": "name of suggester",  
      "searchMode": "analyzingInfixMatching" (other modes may be added in the future),  
      "sourceFields": ["field1", "field2", ...]  
    }  
  ],  
  "scoringProfiles": [  
    {  
      "name": "name of scoring profile",  
      "text": (optional, only applies to searchable fields) {  
        "weights": {  
          "searchable_field_name": relative_weight_value (positive #'s),  
          ...  
        }  
      },  
      "functions": (optional) [  
        {  
          "type": "magnitude | freshness | distance | tag",  
          "boost": # (positive number used as multiplier for raw score != 1),  
          "fieldName": "...",  
          "interpolation": "constant | linear (default) | quadratic | logarithmic",  
          "magnitude": {  
            "boostingRangeStart": #,  
            "boostingRangeEnd": #,  
            "constantBoostBeyondRange": true | false (default)  
          },  
          "freshness": {  
            "boostingDuration": "..." (value representing timespan leading to now over which boosting occurs)  
          },  
          "distance": {  
            "referencePointParameter": "...", (parameter to be passed in queries to use as reference location)  
            "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends)  
          },  
          "tag": {  
            "tagsParameter": "..." (parameter to be passed in queries to specify a list of tags to compare against target fields)  
          }  
        }  
      ],  
      "functionAggregation": (optional, applies only when functions are specified)   
        "sum (default) | average | minimum | maximum | firstMatching"  
    }  
  ],  
  "analyzers":(optional)[ ... ],
  "charFilters":(optional)[ ... ],
  "tokenizers":(optional)[ ... ],
  "tokenFilters":(optional)[ ... ],
  "defaultScoringProfile": (optional) "...",  
  "corsOptions": (optional) {  
    "allowedOrigins": ["*"] | ["origin_1", "origin_2", ...],  
    "maxAgeInSeconds": (optional) max_age_in_seconds (non-negative integer)  
  }  
}
```

## Fields collection and attribution
As you define your schema, you must specify the name, type, and attributes of each field in your index. The field type classifies the data that is stored in that field. Attributes are set on individual fields to specify how the field is used. The following tables enumerate the types and attributes you can specify.

### Data types
| Type | Description |
| --- | --- |
| *Edm.String* |Text that can optionally be tokenized for full-text search (word-breaking, stemming, etc). |
| *Collection(Edm.String)* |A list of strings that can optionally be tokenized for full-text search. There is no theoretical upper limit on the number of items in a collection, but the 16 MB upper limit on payload size applies to collections. |
| *Edm.Boolean* |Contains true/false values. |
| *Edm.Int32* |32-bit integer values. |
| *Edm.Int64* |64-bit integer values. |
| *Edm.Double* |Double-precision numeric data. |
| *Edm.DateTimeOffset* |Date time values represented in the OData V4 format (e.g. `yyyy-MM-ddTHH:mm:ss.fffZ` or `yyyy-MM-ddTHH:mm:ss.fff[+/-]HH:mm`). |
| *Edm.GeographyPoint* |A point representing a geographic location on the globe. |

You can find more detailed information about Azure Search's [supported data types here](https://docs.microsoft.com/rest/api/searchservice/Supported-data-types).

### Index attributes
| Attribute | Description |
| --- | --- |
| *Key* |A string that provides the unique ID of each document, used for document look up. Every index must have one key. Only one field can be the key, and its type must be set to Edm.String. |
| *Retrievable* |Specifies whether a field can be returned in a search result. |
| *Filterable* |Allows the field to be used in filter queries. |
| *Sortable* |Allows a query to sort search results using this field. |
| *Facetable* |Allows a field to be used in a [faceted navigation](search-faceted-navigation.md) structure for user self-directed filtering. Typically fields containing repetitive values that you can use to group multiple documents together (for example, multiple documents that fall under a single brand or service category) work best as facets. |
| *Searchable* |Marks the field as full-text searchable. |

You can find more detailed information about Azure Search's [index attributes here](https://docs.microsoft.com/rest/api/searchservice/Create-Index).

## Suggesters
A suggester is a section of the schema that defines which fields in an index are used to support auto-complete or type-ahead queries in searches. Typically partial search strings are sent to the Suggestions (Azure Search Service REST API) while the user is typing a search query, and the API returns a set of suggested phrases. A suggester that you define in the index determines which fields are used to build the type-ahead search terms. For more information, see [Add suggesters](how-to-suggesters.md) for configuration details.

## Scoring profiles

A scoring profile is a section of the schema that defines custom scoring behaviors that let you influence which items appear higher in the search results. Scoring profiles are made up of field weights and functions. To use them, you specify a profile by name on the query string.

A default scoring profile operates behind the scenes to compute a search score for every item in a result set. You can use the internal, unnamed scoring profile. Alternatively, set defaultScoringProfile to use a custom profile as the default, invoked whenever a custom profile is not specified on the query string.

For more information, see [Add scoring profiles](how-to-add-scoring-profiles-to-a-search-index.md).

## Analyzers

The analyzers element sets the name of the language analyzer to use for the field. For the allowed set of values, see [Language analyzers in Azure Search](how-to-language-support.md). This option can be used only with searchable fields and it can't be set together with either **searchAnalyzer** or **indexAnalyzer**. Once the analyzer is chosen, it cannot be changed for the field.

## CORS

Client-side JavaScript cannot call any APIs by default since the browser will prevent all cross-origin requests. To allow cross-origin queries to your index, enable CORS (Cross-Origin Resource Sharing) by setting the **corsOptions** attribute. For security reasons, only query APIs support CORS. 

The following options can be set for CORS:

+ **allowedOrigins** (required): This is a list of origins that will be granted access to your index. This means that any JavaScript code served from those origins will be allowed to query your index (assuming it provides the correct api-key). Each origin is typically of the form `protocol://<fully-qualified-domain-name>:<port>` although `<port>` is often omitted. See [Cross-origin resource sharing (Wikipedia)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for more details.

  If you want to allow access to all origins, include `*` as a single item in the **allowedOrigins** array. *This is not recommended practice for production search services* but it is often useful for development and debugging.

+ **maxAgeInSeconds** (optional): Browsers use this value to determine the duration (in seconds) to cache CORS preflight responses. This must be a non-negative integer. The larger this value is, the better performance will be, but the longer it will take for CORS policy changes to take effect. If it is not set, a default duration of 5 minutes will be used.

## Next steps

With an understanding of index composition, you can continue in the portal to create your first index.

> [!div class="nextstepaction"]
> [Add an index (portal)](search-create-index-portal.md)