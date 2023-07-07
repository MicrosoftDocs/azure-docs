---
title: Text normalization for filters, facets, sort
titleSuffix: Azure Cognitive Search
description: Specify normalizers to text fields in an index to customize the strict keyword matching behavior in filtering, faceting and sorting.
author: HeidiSteen
manager: jlembicz
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/14/2022
---

# Text normalization for case-insensitive filtering, faceting and sorting

> [!IMPORTANT] 
> This feature is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [preview REST API](/rest/api/searchservice/index-preview) supports this feature.

In Azure Cognitive Search, a *normalizer* is a component that pre-processes text for keyword matching over fields marked as "filterable", "facetable", or "sortable". In contrast with full text "searchable" fields that are paired with [text analyzers](search-analyzers.md), content that's created for filter-facet-sort operations doesn't undergo analysis or tokenization. Omission of text analysis can produce unexpected results when casing and character differences show up.

By applying a normalizer, you can achieve light text transformations that improve results:

+ Consistent casing (such as all lowercase or uppercase)
+ Normalize accents and diacritics like ö or ê to ASCII equivalent characters "o" and "e"
+ Map characters like `-` and whitespace into a user-specified character

## Benefits of normalizers

Searching and retrieving documents from a search index requires matching the query input to the contents of the document. Matching is either over tokenized content, as is the case when you invoke "search", or over non-tokenized content if the request is a [filter](search-query-odata-filter.md), [facet](search-faceted-navigation.md), or [orderby](search-query-odata-orderby.md) operation.

Because non-tokenized content is also not analyzed, small differences in the content are evaluated as distinctly different values. Consider the following examples:

+ `$filter=City eq 'Las Vegas'` will only return documents that contain the exact text "Las Vegas" and exclude documents with "LAS VEGAS" and "las vegas", which is inadequate when the use-case requires all documents regardless of the casing.

+ `search=*&facet=City,count:5` will return "Las Vegas", "LAS VEGAS" and "las vegas" as distinct values despite being the same city.

+ `search=usa&$orderby=City` will return the cities in lexicographical order: "Las Vegas", "Seattle", "las vegas", even if the intent is to order the same cities together irrespective of the case.

A normalizer, which is invoked during indexing and query execution, adds light transformations that smooth out minor differences in text for filter, facet, and sort scenarios. In the previous examples, the variants of "Las Vegas" would be processed according to the normalizer you select (for example, all text is lower-cased) for more uniform results.

## How to specify a normalizer

Normalizers are specified in an index definition, on a per-field basis, on text fields (`Edm.String` and `Collection(Edm.String)`) that have at least one of "filterable", "sortable", or "facetable" properties set to true. Setting a normalizer is optional and it's null by default. We recommend evaluating predefined normalizers before configuring a custom one.

Normalizers can only be specified when you add a new field to the index, so if possible, try to assess the normalization needs upfront and assign normalizers in the initial stages of development when dropping and recreating indexes is routine. 

1. When creating a field definition in the [index](/rest/api/searchservice/create-index), set the  "normalizer" property to one of the following values: a [predefined normalizer](#predefined-normalizers) such as "lowercase", or a custom normalizer (defined in the same index schema).  
 
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
    }
   ]
   ```

1. Custom normalizers are defined in the "normalizers" section of the index first, and then assigned to the field definition as shown in the previous step. For more information, see [Create Index](/rest/api/searchservice/create-index) and also [Add custom normalizers](#add-custom-normalizers).

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

## Predefined and custom normalizers 

Azure Cognitive Search provides built-in normalizers for common use-cases along with the capability to customize as required.

| Category | Description |
|----------|-------------|
| [Predefined normalizers](#predefined-normalizers) | Provided out-of-the-box and can be used without any configuration. |
|[Custom normalizers](#add-custom-normalizers) <sup>1</sup> | For advanced scenarios. Requires user-defined configuration of a combination of existing elements, consisting of char and token filters.|

<sup>(1)</sup> Custom normalizers don't specify tokenizers since normalizers always produce a single token.

## Normalizers reference

### Predefined normalizers

|**Name**|**Description and Options**|  
|-|-|  
|standard| Lowercases the text followed by asciifolding.|  
|lowercase| Transforms characters to lowercase.|
|uppercase| Transforms characters to uppercase.|
|asciifolding| Transforms characters that aren't in the Basic Latin Unicode block to their ASCII equivalent, if one exists. For example, changing à to a.|
|elision| Removes elision from beginning of the tokens.|

### Supported char filters

Normalizers support two character filters that are identical to their counterparts in [custom analyzer character filters](index-add-custom-analyzers.md#CharFilter):

+ [mapping](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/charfilter/MappingCharFilter.html)
+ [pattern_replace](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/pattern/PatternReplaceCharFilter.html)

### Supported token filters

The list below shows the token filters supported for normalizers and is a subset of the overall [token filters used in custom analyzers](index-add-custom-analyzers.md#TokenFilters).

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

## Add custom normalizers

Custom normalizers are [defined within the index schema](/rest/api/searchservice/create-index). The definition includes a name, a type, one or more character filters and token filters. The character filters and token filters are the building blocks for a custom normalizer and responsible for the processing of the text. These filters are applied from left to right.

 The `token_filter_name_1` is the name of token filter, and `char_filter_name_1` and `char_filter_name_2` are the names of char filters (see [supported token filters](#supported-token-filters) and [supported char filters](#supported-char-filters)tables below for valid values).

```json
"normalizers":(optional)[
   {
      "name":"name of normalizer",
      "@odata.type":"#Microsoft.Azure.Search.CustomNormalizer",
      "charFilters":[
         "char_filter_name_1",
         "char_filter_name_2"
      ],
      "tokenFilters":[
         "token_filter_name_1"
      ]
   }
],
"charFilters":(optional)[
   {
      "name":"char_filter_name_1",
      "@odata.type":"#char_filter_type",
      "option1": "value1",
      "option2": "value2",
      ...
   }
],
"tokenFilters":(optional)[
   {
      "name":"token_filter_name_1",
      "@odata.type":"#token_filter_type",
      "option1": "value1",
      "option2": "value2",
      ...
   }
]
```

Custom normalizers can be added during index creation or later by updating an existing one. Adding a custom normalizer to an existing index requires the "allowIndexDowntime" flag to be specified in [Update Index](/rest/api/searchservice/update-index) and will cause the index to be unavailable for a few seconds.

## Custom normalizer example

The example below illustrates a custom normalizer definition with corresponding character filters and token filters. Custom options for character filters and token filters are specified separately as named constructs, and then referenced in the normalizer definition as illustrated below.

+ A custom normalizer named "my_custom_normalizer" is defined in the "normalizers" section of the index definition.

+ The normalizer is composed of two character filters and three token filters: elision, lowercase,  and customized asciifolding filter "my_asciifolding".

+ The first character filter "map_dash" replaces all dashes with underscores while the second one "remove_whitespace" removes all spaces.

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
           ],
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

+ [Querying concepts in Azure Cognitive Search](search-query-overview.md)

+ [Analyzers for linguistic and text processing](search-analyzers.md)

+ [Search Documents REST API](/rest/api/searchservice/search-documents)
