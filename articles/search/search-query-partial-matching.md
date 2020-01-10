---
title: Match patterns and special characters
titleSuffix: Azure Cognitive Search
description: Use wildcard and prefix queries to match on whole or partial terms in an Azure Cognitive Search query request. Hard-to-match patterns that include special characters can be resolved using full query syntax and custom analyzers.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/12/2020
---
# Match on patterns and special characters (dashes)

For queries that include special characters (`-, *, (, ), /, \, =`) or query patterns based on partial terms within a larger term, custom analyzers are typically needed to ensure that the index contains the expected content in the right format. 

By default, a phone number like `"+1 (425) 703-6214"` is tokenized as 
`"1"`, `"425"`, `"703"`, `"6214"`. Searching on `"3-62"`, partial terms that include a dash, will fail because that content doesn't exist like that in the index. 

When you need to search on partial strings or special characters, you can override the default analyzer with a custom analyzer that operates under simpler tokenization rules that keeps terms intact. Taking a step back, the approach looks like this:

+ Choose a predefined analyzer or define a custom analyzer that produces the desired output
+ Assign the analyzer to the field
+ Build the index and test

This article walks you through each step. The approach described here can be used in other scenarios. In particular, wildcard and regular expression queries also need whole terms as the basis for pattern matching. 

## Choosing an analyzer

Azure Cognitive Search uses the Standard Lucene analyzer by default. You can override this analyzer on a per-field basis to get different output in the index. The following analyzers are commonly used when you want to keep terms intact during indexing:

| Analyzer | Behaviors |
|----------|-----------|
| [keyword](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/KeywordAnalyzer.html) | Content of the entire field is tokenized as a single term. |
| [whitespace](https://lucene.apache.org/core/6_6_1/analyzers-common/org/apache/lucene/analysis/core/WhitespaceAnalyzer.html) | Separates on white spaces only. Terms that include dashes or other characters are treated as a single token. |
| [custom analyzer](index-add-custom-analyzers.md) | (recommended) Create a custom analyzer so that you can specify both the tokenizer and token filter. A recommended combination is the keyword tokenizer with a lower-case token filter. When used by itself, the built-in keyword analyzer does not lower-case any upper-case text, which can cause queries to fail. Creating a custom analyzer give you a mechanism for adding the token filter. |

To help you choose an analyzer, test each one to view the tokens it emits. Using a web API test tool like Postman, create a request that calls the [Test Analyzer REST API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer), passing in the analyzer and term.  An existing service and index is required for this test.

1. Start with the Standard analyzer to understand the default behavior.

   ```json
   {
   "text": "SVP10-NOR-00",
   "analyzer": "standard"
   }
    ```

1. Evaluate the response to see how the text is tokenized within the index. 

    ```json
    {
        "tokens": [
            {
                "token": "svp10",
                "startOffset": 0,
                "endOffset": 5,
                "position": 0
            },
            {
                "token": "nor",
                "startOffset": 6,
                "endOffset": 9,
                "position": 1
            },
            {
                "token": "00",
                "startOffset": 10,
                "endOffset": 12,
                "position": 2
            }
        ]
    }
    ```
1. Modify the request to use the `whitespace` or `keyword` analyzer:

    ```json
    {
    "text": "SVP10-NOR-00",
    "analyzer": "keyword"
    }
    ```

1. Now the response consists of a single token, with dashes preserved as a part of the string. If you need to search on a pattern or a partial term, the query engine now has the basis for finding a match.

    ```json
    {

        "tokens": [
            {
                "token": "SVP10-NOR-00",
                "startOffset": 0,
                "endOffset": 12,
                "position": 0
            }
        ]
    }
    ```


## Set up analyzers

Gaining control over tokenization starts with switching out the default Standard Lucene analyzer for a built-in or  [custom analyzer](index-add-custom-analyzers.md) that delivers minimal processing (typical when using advanced wildcard queries), or additional processing that generates more tokens.

### Use built-in analyzers

If you're using a built-in analyzer, you can reference it by name on an `analyzer` property of a field definition, with no additional configuration required:

+ `keyword`
+ `whitespace`
+ `pattern`

```json
    {
      "name": "phoneNumber",
      "type": "Edm.String",
      "key": false,
      "retrievable": true,
      "searchable": true,
      "analyzer": "keyword"
    }
```
For more information about all available built-in analyzers, see [Predefined analyzers list](https://docs.microsoft.com/azure/search/index-add-custom-analyzers#predefined-analyzers-reference). 

### Use custom analyzers

A custom analyzer is a user-defined combination of tokenizer, tokenfilter, and possible configuration settings, giving you more control over the indexing process. The definition of a custom analyzer is specified in the index, and then referenced on a field definition.

When the objective is whole-term tokenization, a custom analyzer that consists of a **keyword tokenizer** and **lower-case token filter** is recommended.

+ The keyword tokenizer creates a single token for the entire contents of a field.
+ The lowercase token filter transforms upper-case letters into lower-case text. Query parsers typically lowercase any uppercase text inputs. Lowercasing homogenizes the inputs with the tokenized terms.

The following example illustrates a custom analyzer that provides the keyword tokenizer and a lowercase token filter.

```json
{
"fields": [
  {
  "name": "accountNumber",
  "analyzer":"myCustomAnalyzer",
  "type": "Edm.String",
  "searchable": true,
  "filterable": true,
  "retrievable": true,
  "sortable": false,
  "facetable": false
  }
]

"analyzers": [
  {
  "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
  "name":"myCustomAnalyzer",
  "charFilters":[],
  "tokenizer":"keyword_v2",
  "tokenFilters":["lowercase"]
  }
],
"tokenizers":[],
"charFilters": [],
"tokenFilters": []
```

> [!NOTE]
> The keyword_v2 tokenizer and lowercase token filter are known to the system and using their default configurations, which is why you can reference them by name without having to define them first.

### Add prefix and suffix token filters to generate partial strings

A token filter adds additional processing over existing tokens in your index. The following example adds an EdgeNGramTokenFilter to make prefix matches faster. Additional tokens are generated for in 2-25 character combinations: (not only MS, MSF, MSFT, MSFT/, but also embedded/internal partial strings like SQL, SQL., SQL.2)

```json
{
"fields": [
  {
  "name": "accountNumber",
  "analyzer":"myCustomAnalyzer",
  "type": "Edm.String",
  "searchable": true,
  "filterable": true,
  "retrievable": true,
  "sortable": false,
  "facetable": false
  }
]

"analyzers": [
  {
  "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
  "name":"myCustomAnalyzer",
  "charFilters":[],
  "tokenizer":"keyword_v2",
  "tokenFilters":["lowercase", "my_edgeNGram"]
  }
],
"tokenizers":[],
"charFilters": [],
"tokenFilters": [
  {
  "@odata.type":"#Microsoft.Azure.Search.EdgeNGramTokenFilterV2",
  "name":"my_edgeNGram",
  "minGram": 2,
  "maxGram": 25,
  "side": "front"
  }
]
```

## Build and test the index

Once the index definition with analyzer configuration is done, your next step is to run [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) on the service, and then import data. Index names must be unique. If the index already exists, you can either rename the index or delete and recreate it.

## Query for patterns

Once you have an index that contains terms in the correct format, you can specify patterns to find matching documents.

[Wildcard](search-query-lucene-examples.md#example-7-wildcard-search) and [Regular expression (RegEx)](search-query-lucene-examples.md#example-6-regex) queries are often used to find patterns on content that is expressed as full tokens in an index. 

1. On the query request, add `querytype=full` to specify the full Lucene query syntax used for wildcard and RegEx queries.

2. In the query string:

   + For wildcard search, embed `*` or `?` wildcard characters
   + For RegEx queries, enclose your pattern or term with `/`, such as `fieldCode:/SQL*Java-Ext/`

> [!NOTE]
> You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match.

## Additional customizations

If changing the `analyzer` property doesn't produce expected results, explore these additional mechanisms.

### Use different analyzers for indexing and query processing

Analyzers are called during indexing and during query execution. It's common to use the same analyzer for both but you can configure custom analyzers for each workload. Analyzer overrides are specified in the [index definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in an `analyzers` section, and then referenced on specific fields. 

When custom analysis is only required during indexing, you can apply the custom analyzer to just indexing and continue to use the standard Lucene analyzer (or another analyzer) for queries.

To specify role-specific analysis, you can set properties on the field for each one, setting `indexAnalyzer` and `searchAnalyzer` instead of the default `analyzer` property.

```json
"name": "featureCode",
"indexAnalyzer":"my_customanalyzer",
"searchAnalyzer":"standard",
```

### Consider duplicating fields for query optimization

Another option leverages the per-field analyzer assignment to optimize for different scenarios. Specifically, you might define "featureCode" and "featureCodeRegex" to support regular full text search on the first, and advanced pattern matching on the second.

```json
{
  "name": "featureCode",
  "type": "Edm.String",
  "retrievable": true,
  "searchable": true,
  "analyzer": null
},
{
  "name": "featureCodeRegex",
  "type": "Edm.String",
  "retrievable": true,
  "searchable": true,
  "analyzer": "my_customanalyzer"
},
```

## Next steps

This article explains how analyzers both contribute to query problems and solve query problems. As a next step, take a closer look at how analyzers are used to modulate indexing and query processing. In particular, consider using the Analyze Text API to return tokenized output so that you can see exactly what an analyzer is creating for your index.

+ [Language analyzers](search-language-support.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)
+ [Analyze Text (REST)](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) 