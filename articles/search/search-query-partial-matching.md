---
title: Match on special characters in whole or partial terms using RegEx
titleSuffix: Azure Cognitive Search
description: Use regular expressions (RegEx) queries to query on whole or partial terms in an Azure Cognitive Search query request, where terms include special characters or follow a specific pattern.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# Query with regular expressions to match on patterns in whole or partial search terms 

In Azure Cognitive Search, you can use regular expressions (RegEx) to match on specific character sequences placed anywhere within a term, including terms that have spaces and symbols. 

In full text search, query patterns that include spaces or characters (like dashes, slashes, quotes, commas, and periods) are problematic because [query analyzers](index-add-custom-analyzers.md) strip out those characters or use them to break up and tokenize terms into individual parts during indexing. The following Microsoft phone number, 800-642-7676, would be tokenized into 3 separate components, which makes finding an exact match on the whole term less likely.

To support matching on specific characters, whether in whole or partial terms, you want to think about how terms are tokenized in the index, and how to create the query that defines the pattern of interest. This is especially true for fields that are **Edm.String**. Fields with numeric data types are never analyzed during indexing and are thus tokenized as whole terms.

## When to use RegEx queries

Implementing support for regular expressions and partial term matching is more complicated than straight full text search, but its useful when the following conditions exist:

+ Field type is Edm.String
+ Values include spaces, characters, or meaningful combinations of upper and lower case text
+ Queries are composed of whole or partial terms that include any of the above elements (spaces, special characters, case-sensitive values)

The following table includes examples that indicate a need for a RegEx search:

| String | Explanation |
|--------|-------------|
| `800-642-7676` | Phone numbers follow specific patterns and include delimiters that are part of the value. |
| `support@microsoft.com`  | Email addresses with `@` are candidates for RegEx search.  |
| `Bravern-2` | Alphanumeric content, with some form of delimiter, is often found in addresses, SKUs, product or model identifiers, account numbers, student IDs, and so forth. Search strings that include delimiters are typically constructed using a RegEx query that includes the special character. |
| `"ASGA.23PT1111/Meas/5min"` | Composite terms like this one often need to be matched using partial term queries built from combinations of each part (for example, `1111/Meas/5min'). This type of query is virtually impossible to do unless you are using un-analyzed text and a RegEx query. |

## Use a whole-term tokenizer

By default, indexing uses the standard Lucene analyzer on string fields to reduce terms to root forms, remove non-essential words, break composite words into component parts, and lower case any upper cases words. As you might expect, this amount of processing can remove context and information necessary for pattern matching. As such, your first task is to override the default analyzer with a custom analyzer that preserves the integrity of field contents.

We recommend using keyword tokenizer because it creates a single token for the entire contents of a field. You can also apply a token filter to lower-case text for consistency. 

In Azure Cognitive Search, analyzer overrides are specified in the [index definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in an `analyzer` section, and then referenced on specific fields so that can accommodate varying analytical requirements.Adding an analyzer to an existing field typically requires an index rebuild.

The following example is an illustration of a custom analyzer that provides the keyword tokenizer with a token filter that lower cases any upper case letters.

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

[Regular expression (RegEx) queries](search-query-lucene-examples.md#example-6-regex) are used to find patterns on content that is expressed as full tokens in an index. 

1. On the query expression, add `querytype=full` to specify the full Lucene query syntax. This is the syntax that provides regular expressions.

2. Add wildcard characters around your pattern or term, such as `/.*800-642.*/`


> [!NOTE]
> You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match, assuming your index is also set up as described in this article.

## Next steps

This article explains how analyzers both contribute to query problems and solve query problems. As a next step, take a closer look at how analyzers are used to modulate indexing and query operations.

+ [Language analyzers](search-language-support.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)


<!-- ORIGINAL INTRO

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
 -->

