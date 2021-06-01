---
title: Text normalization for filters, facets, sort
titleSuffix: Azure Cognitive Search
description: Specify normalizers to text fields in an index to customize the strict keyword matching behavior in filtering, faceting and sorting.

author: IshanSrivastava
manager: jlembicz
ms.author: ishansri
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/23/2021
---

# Text normalization for case-insensitive filtering, faceting and sorting

 > [!IMPORTANT]
 > Normalizer is in public preview, available through the **2020-06-30-preview REST API**. Preview features are offered as-is, under Supplemental Terms of Use.

Searching and retrieving documents from an Azure Cognitive Search index requires matching the query to the contents of the document. The content can be analyzed to produce tokens for matching as is the case when `search` parameter is used, or can be used as-is for strict keyword matching as seen with `$filter`, `facets`, and `$orderby`. This all-or-nothing approach covers most scenarios but falls short where simple pre-processing like casing, accent removal, asciifolding and so forth is required without undergoing through the entire analysis chain.

Consider the following examples:

+ `$filter=City eq 'Las Vegas'` will only return documents that contain the exact text "Las Vegas" and exclude documents with "LAS VEGAS" and "las vegas" which is inadequate when the use-case requires all documents regardless of the casing.

+ `search=*&facet=City,count:5` will return "Las Vegas", "LAS VEGAS" and "las vegas" as distinct values despite being the same city.

+ `search=usa&$orderby=City` will return the cities in lexicographical order: "Las Vegas", "Seattle", "las vegas", even if the intent is to order the same cities together irrespective of the case. 

## Normalizers

An *normalizer* is a component of the search engine responsible for pre-processing text for keyword matching. Normalizers are similar to analyzers except they do not tokenize the query. Some of the transformations that can be achieved using normalizers are:

+ Convert to lowercase or upper-case.
+ Normalize accents and diacritics like ö or ê to ASCII equivalent characters "o" and "e".
+ Map characters like `-` and whitespace into a user-specified character.

Normalizers can be specified on text fields in the index and is applied both at indexing and query execution.

## Predefined and custom normalizers 

Azure Cognitive Search supports predefined normalizers for common use-cases along with the capability to customize as required.

| Category | Description |
|----------|-------------|
| [Predefined normalizers](#predefined-normalizers) | Provided out-of-the-box and can be used without any configuration. |
|[Custom normalizers](#add-custom-normalizers) | For advanced scenarios. Requires user-defined configuration of a combination of existing elements, consisting of char and token filters.<sup>1</sup>|

<sup>(1)</sup> Custom normalizers do not specify tokenizers since normalizers always produce a single token.

## How to specify normalizers

Normalizers can be specified per-field on text fields (`Edm.String` and `Collection(Edm.String)`) that have at least one of `filterable`, `sortable`, or `facetable` properties set to true. Setting a normalizer is optional and it's `null` by default. We recommended evaluating predefined normalizers before configuring a custom one for ease of use. Try a different normalizer if results are not expected.

Normalizers can only be specified when a new field is added to the index. It's encouraged to assess the normalization needs upfront and assign normalizers in the initial stages of development when dropping and recreating indexes is routine. Normalizers cannot be specified on a field that has already been created.

1. When creating a field definition in the [index](/rest/api/searchservice/create-index), set the  **normalizer** property to one of the following: a [predefined normalizer](#predefined-normalizers) such as `lowercase`, or a custom normalizer (defined in the same index schema).  
 
   ```json
   "fields": [
    {
      "name": "Description",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "filterable": true,
      "analyzer": "en.microsoft",
      "normalizer": "lowercase"
      ...
    },
   ```

2. Custom normalizers have to be defined in the **[normalizers]** section of the index first, and then be assigned to the field definition as shown in the previous step. For more information, see [Create Index](/rest/api/searchservice/create-index) and also [Add custom normalizers](#add-custom-normalizers).


   ```json
   "fields": [
    {
      "name": "Description",
      "type": "Edm.String",
      "retrievable": true,
      "searchable": true,
      "analyzer": null,
      "normalizer": "my_custom_normalizer"
    },
   ```

 
> [!NOTE]
> To change the normalizer of an existing field, you'll have to rebuild the index entirely (you cannot rebuild individual fields).

A good workaround for production indexes, where rebuilding indexes is costly, is to create a new field identical to the old one but with the new normalizer, and use it in place of the old one. Use [Update Index](/rest/api/searchservice/update-index) to incorporate the new field and [mergeOrUpload](/rest/api/searchservice/addupdate-or-delete-documents) to populate it. Later, as part of planned index servicing, you can clean up the index to remove obsolete fields.

## Add custom normalizers

Custom normalizers are defined within the index schema and can be specified using the field property. The definition of custom normalizer includes a name, a type, one or more char filters and token filters. The char filters and token filters are the building blocks for a custom normalizer and responsible for the processing of the text.These filters are applied from left to right.

 The `token_filter_name_1` is the name of token filter, and `char_filter_name_1` and `char_filter_name_2` are the names of char filters (see [Supported token filters](#supported-token-filters) and Char filters tables below for valid values).

The normalizer definition is a part of the larger index. See [Create Index API](/rest/api/searchservice/create-index) for information about the rest of the index.

```
"normalizers":(optional)[
   {
      "name":"name of normalizer",
      "@odata.type":"#Microsoft.Azure.Search.CustomNormalizer",
      "charFilters":[
         "char_filter_name_1",
         "char_filter_name_2"
      ],
      "tokenFilters":[
         "token_filter_name_1
      ]
   }
],
"charFilters":(optional)[
   {
      "name":"char_filter_name_1",
      "@odata.type":"#char_filter_type",
      "option1":value1,
      "option2":value2,
      ...
   }
],
"tokenFilters":(optional)[
   {
      "name":"token_filter_name_1",
      "@odata.type":"#token_filter_type",
      "option1":value1,
      "option2":value2,
      ...
   }
]
```

Custom normalizers can be added during index creation or later by updating an existing one. Adding a custom normalizer to an existing index requires the **allowIndexDowntime** flag to be specified in [Update Index](/rest/api/searchservice/update-index) and will cause the index to be unavailable for a few seconds.

## Normalizers reference

### Predefined normalizers
|**Name**|**Description and Options**|  
|-|-|  
|standard| Lowercases the text followed by asciifolding.|  
|lowercase| Transforms characters to lowercase.|
|uppercase| Transforms characters to uppercase.|
|asciifolding| Transforms characters that are not in the Basic Latin Unicode block to their ASCII equivalent, if one exists. For example, changing à to a.|
|elision| Removes elision from beginning of the tokens.|

### Supported char filters
For more details on the char filters, refer to [Char Filters Reference](index-add-custom-analyzers.md#CharFilter).
+ [mapping](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/charfilter/MappingCharFilter.html)  
+ [pattern_replace](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/pattern/PatternReplaceCharFilter.html)

### Supported token filters
The list below shows the token filters supported for normalizers and is a subset of the overall token filters involved in the lexical analysis. For more details on the filters, refer to [Token Filters Reference](index-add-custom-analyzers.md#TokenFilters).

+ [arabic_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/ar/ArabicNormalizationFilter.html)
+ [asciifolding](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/miscellaneous/ASCIIFoldingFilter.html)
+ [cjk_width](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/cjk/CJKWidthFilter.html)  
+ [elision](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/util/ElisionFilter.html)  
+ [german_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/de/GermanNormalizationFilter.html)
+ [hindi_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/hi/HindiNormalizationFilter.html)  
+ [indic_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/in/IndicNormalizationFilter.html)
+ [persian_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/fa/PersianNormalizationFilter.html)
+ [scandinavian_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianNormalizationFilter.html)  
+ [scandinavian_folding](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianFoldingFilter.html)
+ [sorani_normalization](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/ckb/SoraniNormalizationFilter.html)  
+ [lowercase](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/LowerCaseFilter.html)
+ [uppercase](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/UpperCaseFilter.html)


## Custom normalizer example

The example below illustrates a custom normalizer definition with corresponding char filters and token filters. Custom options for char filters and token filters are specified separately as named constructs, and then referenced in the normalizer definition as illustrated below.

* A custom normalizer "my_custom_normalizer" is defined in the `normalizers` section of the index definition.
* The normalizer is composed of two char filters and three token filters: elision, lowercase,  and customized asciifolding filter "my_asciifolding".
* The first char filter "map_dash" replaces all dashes with underscores while the second one "remove_whitespace" removes all spaces.

```json
  {
     "name":"myindex",
     "fields":[
        {
           "name":"id",
           "type":"Edm.String",
           "key":true,
           "searchable":false,
        },
        {
           "name":"city",
           "type":"Edm.String",
           "filterable": true,
           "facetable": true,
           "normalizer": "my_custom_normalizer"
        }
     ],
     "normalizers":[
        {
           "name":"my_custom_normalizer",
           "@odata.type":"#Microsoft.Azure.Search.CustomNormalizer",
           "charFilters":[
              "map_dash",
              "remove_whitespace"
           ],,
           "tokenFilters":[              
              "my_asciifolding",
              "elision",
              "lowercase",
           ]
        }
     ],
     "charFilters":[
        {
           "name":"map_dash",
           "@odata.type":"#Microsoft.Azure.Search.MappingCharFilter",
           "mappings":["-=>_"]
        },
        {
           "name":"remove_whitespace",
           "@odata.type":"#Microsoft.Azure.Search.MappingCharFilter",
           "mappings":["\\u0020=>"]
        }
     ],
     "tokenFilters":[
        {
           "name":"my_asciifolding",
           "@odata.type":"#Microsoft.Azure.Search.AsciiFoldingTokenFilter",
           "preserveOriginal":true
        }
     ]
  }
```

## See also
+ [Analyzers for linguistic and text processing](search-analyzers.md)

+ [Search Documents REST API](/rest/api/searchservice/search-documents) 
