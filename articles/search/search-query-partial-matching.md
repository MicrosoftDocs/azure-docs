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

For queries that include special characters (`-, /, \, =`) or patterns based on partial terms within a larger term, custom analyzers are typically needed to ensure that characters or terms remain whole during indexing. 

By default, a phone number like "+1 (425) 703-6214" is tokenized as 
"1", "425", "703", "6214". Searching on "3-62", partial terms with the dash, will fail because that content doesn't exist as such in the index. 

When you need to search on partial strings or special characters, you can override the default analyzer with a custom analyzer that operates under different tokenization rules that keeps terms intact. Taking a step back, the approach looks like this:

+ Choose an analyzer that produces the output you want
+ Optionally, define a custom analyzer in the index if you need deeper customization
+ Assign the analyzer to the field
+ Build the index and test

This article walks you through each step. The approach you learn here can be used in other scenarios. Wildcard and regular expression queries also need whole terms as the basis for pattern matching. 

## Choosing an analyzer

Azure Cognitive Search uses the Standard Lucene analyzer by default. You can override this analyzer on a per-field basis to get different output in the index. The following analyzers are commonly used when you want terms to remain intact during indexing:

| Analyzer | Behaviors |
|----------|-----------|
| [keyword]() | Content of the entire field is tokenized as a single term. |
| [whitespace]() | Separates on white spaces only. Terms that include dashes or other characters are treated as a single token. |
| [custom analyzer]() | (recommended) Add a new analyzer definition to an index that uses a tokenizer and token filter you provide. A recommended combination is the keyword tokenizer with a lower-case token filter. When used by itself, the built-in keyword analyzer does not lower-case any upper-case text, which can result in false negative query results. Creating a custom analyzer give you a mechanism for adding the filter. |

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

<!-- 
## How to approach pattern matching

For pattern matching on partial terms or on strings that contain special characters, adopt an indexing strategy that preserves or creates necessary information:

+ Use a keyword analyzer to preserve the whole term, including special characters that are part of the query string.

+ Use prefix and suffix token filters to generate new combinations of partial strings.

Both approaches require a custom analyzer as replacement for the default text analyzer. However, the first approach introduces requirements for queries that match on patterns, and those take longer to process. The second approach is typically faster to query, but expands index size with additional character combinations.

You can implement either approach, both, or [design alternative solutions](#design-a-custom-solution) once you understand the role of analyzers in indexing and query parsing.

> [!NOTE]
> Exceptions to the conditions and approaches described in this article include $filters and specific query types. $filter expressions are not evaluated against the inverted indexes, and thus tokenization behaviors are not applicable. Similarly, RegEx queries, wildcard (*) queries, and fuzzy matching queries are lower-cased by the query parser, but are not otherwise stemmed or lemmatized during query parsing. As such, tokenization is less of a concern. -->

## Set up analyzers

Gaining control over tokenization starts with switching out the default Standard Lucene analyzer for a built-in or  [custom analyzer](index-add-custom-analyzers.md) that delivers minimal processing (typical when using advanced wildcard queries), or additional processing that generates more tokens.

### Use built-in analyzers

The following analyzers can be referenced by name on an `analyzer` property of a field definition, with no additional configuration required:

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
  "name": "phoneNumber",
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
  "name": "featureCode",
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

## Test analyzer output

The service provides an API that returns tokenized terms for a specific string. The following screenshot shows the request and response to [Test Analyzer REST API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer). The equivalent API in .NET is the [AnalyzerResult class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzeresult?view=azure-dotnet).

   ![Postman session input is as-35-sd-f output is 4 tokens](./media/search-query-partial-matching/postman-test-analyzer-rest-api.png "Postman session input is as-35-sd-f output is 4 tokens")

## Query for patterns

Once you have an index that articulates the terms that you expect, you can proceed with a query construct designed for pattern matching.

[Wildcard](search-query-lucene-examples.md#example-7-wildcard-search) and [Regular expression (RegEx)](search-query-lucene-examples.md#example-6-regex) queries are often used to find patterns on content that is expressed as full tokens in an index. 

1. On the query request, add `querytype=full` to specify the full Lucene query syntax used for wildcard and RegEx queries.

2. In the query string:

   + For wildcard search, embed `*` or `?` wildcard characters
   + For RegEx queries, enclose your pattern or term with `/`, such as `fieldCode:/SQL*Java-Ext/`

> [!NOTE]
> You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match.

## Design a custom solution

The two approaches described in this article are common design patterns, but if they don't produce expected results, you can experiment with alternatives. The following guidance might help focus your investigation.

Recall that when search terms include special characters or combinations of partial strings, address the following challenges:

+ Control the tokenization process to ensure your index actually contains complete information. Instead of segmented terms, you want *intact* terms so that partial and pattern matching can succeed. You can override default analyzer with a specific analyzer as a control mechanism. You can also add token filters for additional modifications.

+ Create queries that do the best job of setting up the matching criteria when the criteria in question contains characters or specific patterns. Wildcard queries are a common approach. Remember that if you are using wildcards and the full Lucene syntax (queryType=full) you need to formulate the string within a regular expression.

### Consider dedicated analyzers for indexing and query execution

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
  "analyzer": ""
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

This article explains how analyzers both contribute to query problems and solve query problems. As a next step, take a closer look at how analyzers are used to modulate indexing and query operations. In particular, consider using the Analyze Text API to return tokenized output so that you can see exactly what an analyzer is creating for your index.

+ [Language analyzers](search-language-support.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)
+ [Analyze Text (REST)](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) 


<!-- ORIGINAL INTRO

Finding an exact match to an input query string can be challenging in unexpected ways. During indexing, linguistic analyzers will break terms into root forms to get the broadest possible matches, with the downside of potentially losing information or context that you would otherwise expect to retain. If you find yourself wondering why a query isn't returning an expected match, this article might help you understand the causes and how to structure your index and queries to get right results.

This article is focused on exact matches of numeric content and the impact of special characters on query logic.

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

