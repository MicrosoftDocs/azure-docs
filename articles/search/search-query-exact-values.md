---
title: Exact matches on full or partial terms
titleSuffix: Azure Cognitive Search
description: Learn query logic for matching on exact values and how linguistic analysis can get in the way of finding an expected match.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# Find exact matches in Azure Cognitive Search queries

Finding an exact match to an input query string can be challenging in unexpected ways. During indexing, linguistic analyzers will break terms into root forms to get the broadest possible matches, with the downside of potentially losing information or context that you would otherwise expect to retain. If you find yourself wondering why a query isn't returning an expected match, this article might help you understand the causes and how to structure your index and queries to get right results.

This article is focused on exact matches of numeric content and the impact of special characters on query logic.

For more information about the query engine architecture, we recommend [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md). For other exact-match information, such as filters that match on verbatim strings, see [Filters in Azure Cognitive Search](search-filters.md).

## Matching on numeric data or special characters

For numeric fields that include spaces, hyphens, or other special characters, the processing performed by analyzers can sometimes segment a value into component parts rather than leaving it whole. If a multi-part value is deconstructed, the query engine can fail to find a match, even if you take precautions to escape any special characters. If a character doesn't exist (because it was stripped out prior to tokenization), then escaping it won't help.

As an example, consider the following documents, where `phone` is Edm.string that is searchable, filterable, and retrievable. 

```json
{
  "id": "1",
  "company": "Microsoft",
  "phone": "1-800-642-7676"
},
{
  "id": "2",
  "company": "LinkedIn",
  "phone": "(650) 687-3600"
}
```

To work around any unwanted side-effects of tokenization, you can implement a two-part solution:

+ During indexing, use the keyword tokenizer to index the contents of a field as a single token, including any characters embedded in the string.

+ In queries, use a regular expression query to submit complex matching criteria. A prerequisite for using regular expressions is to *not* tokenize the field into component parts, so we'll start with the tokenizer first.

### Add a keyword tokenizer to the index definition

By default, both indexing and query engines use the standard Lucene analyzer for all Edm.String fields. For strings consisting of numbers or special characters, you can override the default analyzer, replacing it with one that keeps the entire value intact during processing.

We recommend the keyword tokenizer because it creates a single token for the entire contents of a field. You can also apply a token filter to lower-case text for consistency. 

The following example is an illustration of a custom analyzer that overrides the default. Custom analyzers are specified in the schema's analyzer section and then referenced on specific fields. Adding an analyzer to an existing field typically requires an index rebuild.

```json
{
    "fields": [
      . . . 

        {
           "name": "phone",
            "analyzer":"myCustomAnalyzer",
            "type": "Edm.String",
            "searchable": true,
            "filterable": true,
            "retrievable": true,
            "sortable": false,
            "facetable": false
        }
    . .  
    ],
   "analyzers":[
        {
           "name":"myCustomAnalyzer",
           "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
           "charFilters":[],
           "tokenizer":"keyword_v2",
           "tokenFilters":[
              "lowercase"
           ]
        }
     ]
}
```

### Create a RegEx query

[Regular expression (RegEx) queries](search-query-lucene-examples.md#example-6-regex) search on full tokens in an index. 

1. On the query expression, add `querytype=full` to specify the full Lucene query syntax. This is the syntax that provides regular expressions.

2. Add wildcard characters around your term, such as `/.*800-642.*/`

You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match, assuming your index is also set up as described in this article.

## Next steps

This article explains how analyzers both contribute to query problems and solve query problems. As a next step, take a closer look at how analyzers are used to modulate indexing and query operations.

+ [Language analyzers](search-language-support.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)