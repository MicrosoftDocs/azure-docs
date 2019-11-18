---
title: Match on patterns and special characters using whole or partial terms
titleSuffix: Azure Cognitive Search
description: Use regular expressions (RegEx), wildcard, and prefix queries to match on whole or partial terms in an Azure Cognitive Search query request. Hard-to-match patterns that include special characters introduce can be resolved using full query syntax and custom analyzers.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# Match on patterns and special characters using whole or partial terms

When string composition includes upper and lowercase text with special characters, additional work is sometimes necessary before queries can return matching documents in your index. 

Analyzers, which tokenize terms for full text search scenarios, produce output that is sometimes quite different from the original input value. Common transformations include lower-casing any upper-case text, removing non-essential words, and breaking down composite terms into smaller parts when characters like dashes, periods, and slashes are encountered. If you find that queries fail to return expected results, especially queries that are searching on patterns or special characters, it could be that the index doesn't contain the expected strings.

For example, assume the default standard Lucene analyzer and the following fictitious feature code: `"MSFT/SQL.2019/Linux&Java-Ext"`. The analyzer would tokenize this  into smaller parts: `msft`, `sql`, `2019`, `linux`, `java`, `ext`. Given these transformations, you can imagine how searching on a pattern like `"MSFT*2019"` becomes problematic when the index contains only segments of the term, and not the extended pattern that you expect.

To enable pattern matching over complex strings, you need to address the following challenges:

+ Control the tokenization process to ensure your index actually contains the required information. Instead of segmented terms, you want *intact* terms so that partial and pattern matching can succeed. You can override default analyzer with a specific analyzer as a control mechanism. You can also add token filters for additional modifications.

+ Create queries that do the best job of setting up the matching criteria when the criteria in question contains characters or specific patterns. Wildcard queries are a common approach, but you could also incorporate regular expressions for advanced scenarios.

> [!NOTE]
> Exceptions to the conditions and approaches described in this aritcle include filters and specific query types. $filter expressions do not go against the inverted indexes, and thus tokenization is not applicable. RegEx queries, Wilcard (*) queries, and fuzzy matching queries are not analyzed.

## Set up analyzers

Gaining control over tokenization starts with switching out the default Standard Lucene analyzer for a [custom analyzer](index-add-custom-analyzers.md) that delivers minimal processing (typical for this scenario).

Tokenized terms are the output of analyzers, and for the best experience in matching patterns, you need output consisting of whole terms. You can override the default rules by creating a custom analyzer, which you can set on a field-by-field basis.

Analyzers are called during indexing and during query execution. It's common to use the same analyzer for both but you can configure custom analyzers for each workload. Analyzer overrides are specified in the [index definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in an `analyzers` section, and then referenced on specific fields. 

### Use the Keyword tokenizer with additional token filters

To preserve whole terms in the token, we recommend using keyword tokenizer because it creates a single token for the entire contents of a field. The following example is an illustration of a custom analyzer that provides the keyword tokenizer. This custom analyzer is referenced on the 'featureCode' field definition, but defined further down in the index schema.

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
```

A token filter adds additional processing over existing tokens in your index. The following example includes a lower-case filter in anticipation of wildcard and regular expression queries, both of which lower-case any upper-case characters found during query parsing. It also includes an EdgeNGramTokenFilter to make prefix matches easier and faster.

```json
"analyzers": [
      {
         "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
           "name":"myCustomAnalyzer",
           "charFilters":[],
           "tokenizer":"keyword_v2",
           "tokenFilters":[
              "lowercase",
              "my_edgeNGram"
            ]
      }
    ],

"charfilters": [],

"tokenFilters": [
      {
         "@odata.type":"#Microsoft.Azure.Search.EdgeNGramTokenFilterV2",
           "name":"my_edgeNGram",
           "minGram": 2,
           "maxGram": 25,
           "side": "front"
      }
    ],
```

### Use dedicated analyzers for indexing and query execution

If custom analysis is only required during indexing, you can apply the custom analyzer to just indexing and continue to use the standard Lucene analyzer (or another analyzer) for queries.

To specify role-specific analysis, you can set properties on the field for each one:

```json
"name": "featureCode",
"indexAnalyzer":"myCustomAnalyzer",
"searchAnalyzer":"standard",
```

> [!Tip]
> You can also define separate fields if you want to vary field definition (for example, `featureCodeIndexing` to support the search behaviors you want over that field, and a separate `featureCode` field for other search scenarios.

<!-- In full text search, query patterns that include spaces or characters (like dashes, slashes, quotes, commas, and periods) are problematic because [analyzers](search-lucene-query-architecture.md#stage-1-query-parsing) both strip out those characters at query time, and use them during indexing to break up and tokenize terms into smaller searchable parts. For example, using the default analyzer, this Microsoft phone number, 800-642-7676, would be tokenized into 3 separate components, which makes finding an exact match on the whole term less likely.

A more realistic scenario is a complex term, such as the following fictitious example that combines upper and lower case text with special characters: `"MSFT/SQL.2019/Linux&Java-Ext"`. If you used the default analyzer on such a term, the index would have tokens for individual parts, but not the term as a whole. As such, queries like `MSFT/SQL*` or `"Linux&Java"` would return zero results.

In Azure Cognitive Search, you can make complex patterns more matchable using a combination of query and indexing capabilities. 

+ Query techniques include using regular expressions (RegEx) and wildcards to match on specific character sequences placed anywhere within a term, including terms that have spaces and symbols. 

+ Indexing techniques include analyzers that tokenize on whole terms to preserve the integrity of the string, as well as anlayzers that generate tokens based on prefix or suffix sequences.  -->

<!-- ## Query techniques for matching on patterns

Suppose you have three documents with the following fictitious feature codes, and your goal is to design various queries that match on partial strings:

+ `featureCode: MSFT/SQL.2017/Linux`
+ `featureCode: MSFT/SQL.2019/Linux&Java-Ext`
+ `featureCode: MSFT/SQL.2019/Win&Java-Ext`

Some example queries might be `"MSFT/SQL*"` (a wildcard prefix query), `"*Java"` (a wildcard suffix query), `"2019/Linux"` (partial string query), `"SQL.201?` (single character wildcard), or any regular expression query that provides advanced pattern matching.

+ Wildcard queries
+ Regular expression queries

Within your index, the following tokens are necessary to support these queries:

Whole-term tokens to support regular expression queries
Prefix terms (optional but recommended for performance)
Suffix terms (optional but recommended for performance)


You can also include prefix and suffix analyzers for similar use cases that call for pattern matching. -->

<!-- Transition phrase from query to indexing section?

To support matching on specific patterns, whether in whole or partial terms, you want to control how terms are tokenized during indexing, as well as build a query that defines the pattern of interest.  -->


<!-- ## Techniques for pattern matching

The following techniques are useful for searching on patterns, including those that contain special characters.

| Type   | Explanation |
|--------|-------------| 
| Wildcard | A type of query available when you use the Full Lucene syntax option.  |
| RegEx    | A type of query available when you use the Full Lucene syntax option.  |
| Prefix analyzer  | Used during indexing and queries to ... |
| Suffix analyzer  | Used during indexing and queries to ... |

Both Wildcard and RegEx queries require the full syntax (queryType=Full) and do not return search rankings.

Prefix and Suffix queries use the default simple syntax. -->

<!-- ## Requirements

Implementing support for regular expressions and partial term matching is more complicated than straight full text search, but its useful when the following conditions exist:

+ Field type is **Edm.String**. Fields with numeric data types are never analyzed during indexing and are thus tokenized as whole terms.
+ Values include spaces, characters, or meaningful combinations of upper and lower case text
+ Queries are composed of whole or partial terms that include any of the above elements (spaces, special characters, case-sensitive values)

The following table includes examples that indicate a need for a RegEx search:

| String | Explanation |
|--------|-------------|
| `800-642-7676` | Phone numbers follow specific patterns and include delimiters that are part of the value. |
| `support@microsoft.com`  | Email addresses with `@` are candidates for RegEx search.  |
| `Bravern-2` | Alphanumeric content, with some form of delimiter, is often found in addresses, SKUs, product or model identifiers, account numbers, student IDs, and so forth. Search strings that include delimiters are typically constructed using a RegEx query that includes the special character. |
| `"ABCD.23PT1111/Dur/5min"` | Composite terms like this one often need to be matched using partial term queries built from combinations of each part (for example, `1111/Dur/5min`). This type of query is virtually impossible to do unless you are using un-analyzed text and a RegEx query. | -->

## Test analyzer output

The service provides an API that returns tokenized terms for search inputs. You can verify that your custom analyzer is producing expected output by passing individual input strings. 

The following screenshot shows the request and response to [Test Analyzer REST API](https://docs.microsoft.com/rest/api/searchservice/test-analyzer). The equivalent API in .NET is the [AnalyzerResult class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzeresult?view=azure-dotnet).


   ![Postman session input is as-35-sd-f output is 4 tokens](./media/search-query-partial-matching/postman-test-analyzer-rest-api.png "Postman session input is as-35-sd-f output is 4 tokens")

## Define queries for pattern matching

Once you have an index that articulates the terms that you expect, you can proceed with a query construct designed for pattern matching.

[Wildcard](search-query-lucene-examples.md#example-7-wildcard-search) and [Regular expression (RegEx)](search-query-lucene-examples.md#example-6-regex) queries are often used to find patterns on content that is expressed as full tokens in an index. 

1. On the query expression, add `querytype=full` to specify the full Lucene query syntax used for wildcard and RegEx queries.

2. Add `*` or `?` wildcard characters, or for RegEx queries, enclose your pattern or term with `/`, such as `fieldCode:/SQL*Java-Ext/`

> [!NOTE]
> You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match, assuming your index is also set up as described in this article.


## Next steps

This article explains how analyzers both contribute to query problems and solve query problems. As a next step, take a closer look at how analyzers are used to modulate indexing and query operations. In particular, consider using the Analyze Text API to return tokenized output so that you can see exactly what an analyzer is creating for your index.

+ [Language analyzers](search-language-support.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)
+ [Analyze Text (REST)](https://docs.microsoft.com/rest/api/searchservice/test-analyzer) 


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

