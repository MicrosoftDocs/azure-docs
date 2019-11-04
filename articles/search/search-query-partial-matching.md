---
title: Match on patterns and special characters using whole or partial terms
titleSuffix: Azure Cognitive Search
description: Use regular expressions (RegEx), wildcard, prefix and suffix queries to match on whole or partial terms in an Azure Cognitive Search query request. Hard-to-match patterns that include special characters introduce can be resolved using full query syntax and custom analyzers.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# Match on patterns and special characters using whole or partial terms

In full text search, query patterns that include spaces or characters (like dashes, slashes, quotes, commas, and periods) are problematic because [analyzers](search-lucene-query-architecture.md#stage-1-query-parsing) both strip out those characters at query time, and use them during indexing to break up and tokenize terms into smaller searchable parts. For example, using the default analyzer, this Microsoft phone number, 800-642-7676, would be tokenized into 3 separate components, which makes finding an exact match on the whole term less likely.

A more realistic scenario is a complex term, such as the following fictitious example that combines upper and lower case text with special characters: `"MSFT/SQL.2019/Linux&Java-Ext"`. If you used the default analyzer on such a term, the index would have tokens for individual parts, but not the term as a whole. As such, queries like `MSFT/SQL*` or `"Linux&Java"` would return zero results.

In Azure Cognitive Search, you can make complex patterns more matchable using a combination of query and indexing capabilities. 

+ Query techniques include using regular expressions (RegEx) and wildcards to match on specific character sequences placed anywhere within a term, including terms that have spaces and symbols. 

+ Indexing techniques include analyzers that tokenize on whole terms to preserve the integrity of the string, as well as anlayzers that generate tokens based on prefix or suffix sequences. 

## Query techniques for matching on patterns

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


You can also include prefix and suffix analyzers for similar use cases that call for pattern matching.

<!-- Transition phrase from query to indexing section? -->

To support matching on specific patterns, whether in whole or partial terms, you want to control how terms are tokenized during indexing, as well as build a query that defines the pattern of interest. 





## Indexing techniques

During indexing, the default analyzer reduces terms to root forms and breaks up complex terms into smaller pieces. Suppose you are indexing terms similar to this one, `featureCode": "MSFT/SQL.2019/Linux&Java-Ext"`, with mixed casing and characters like `/` and `-` that are typically used to break up terms into smaller pieces.

Post-indexing, you confirm that the document containing this term exists, yet when you search on specific parts, such as `MSFT/SQL*` or `"Linux&Java"` nothing comes back.

The problem is that the default analyzer doesn't tokenize various combinations of parts. 

Thus, your first step, in this case, is to change the tokenization behavior by overriding the default analyzer. You can specify analyzers on specific fields so that you only get the modifications where you need them.




### Best practices

Following these suggestions can help you attain the results you expect, withough

accommodate advanced queries, but not at the expense of basic queries.



+ 

## Query techniques 

## Techniques for pattern matching

The following techniques are useful for searching on patterns, including those that contain special characters.

| Type   | Explanation |
|--------|-------------| 
| Wildcard | A type of query available when you use the Full Lucene syntax option.  |
| RegEx    | A type of query available when you use the Full Lucene syntax option.  |
| Prefix analyzer  | Used during indexing and queries to ... |
| Suffix analyzer  | Used during indexing and queries to ... |

Both Wildcard and RegEx queries require the full syntax (queryType=Full) and do not return search rankings.

Prefix and Suffix queries use the default simple syntax.

## Requirements

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
| `"ABCD.23PT1111/Dur/5min"` | Composite terms like this one often need to be matched using partial term queries built from combinations of each part (for example, `1111/Dur/5min`). This type of query is virtually impossible to do unless you are using un-analyzed text and a RegEx query. |

## Tokenize whole terms

Pattern matching using regular expressions requires that the original term remains intact (that is, not analyzed during indexing) so that a pattern can be found. By default, indexing uses the standard Lucene analyzer on string fields to reduce terms to root forms, remove non-essential words, break composite words into component parts, and lower case any upper cases words. As you might expect, this amount of processing can remove context and information necessary for pattern matching. For this reason, your first task is to override the default analyzer with a custom analyzer that preserves the integrity of field contents.

We recommend using keyword tokenizer because it creates a single token for the entire contents of a field. You can also apply a token filter to lower-case text for consistency. 

Analyzer overrides are specified in the [index definition](https://docs.microsoft.com/rest/api/searchservice/create-index) in an `analyzers` section, and then referenced on specific fields so that can accommodate varying analytical requirements. Adding an analyzer to an existing indexed field typically requires an index rebuild.

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


## Create a RegEx query

[Regular expression (RegEx) queries](search-query-lucene-examples.md#example-6-regex) are used to find patterns on content that is expressed as full tokens in an index. 

1. On the query expression, add `querytype=full` to specify the full Lucene query syntax. This is the syntax that provides regular expressions.

2. Add wildcard characters around your pattern or term, such as `/.*800-642.*/`


> [!NOTE]
> You might be inclined to also use `searchFields` as a field constraint, or set `searchMode=all` as an operator contraint, but in most cases you won't need either one. A regular expression query is typically sufficient for finding an exact match, assuming your index is also set up as described in this article.

## Resolving unexpected outcomes

When queries fail to match on content that you know exists, it could be that the content doesn't exist the way you expect it to in the index, or that the query syntax is not valid. This section explores some of the more common issues.

1. Exact phrase returns no results

A keyword tokenizer will output one token for field content. For example, "ABCD.23PT1111/Dur/5min" will be indexed exactly as-is, and any query terms should be exactly the same to match this token from the index. 

Wildcard queries don’t go through analysis, but get lower-cased by design, which will cause a case mismatch. 

## NEW INTRO

Searching over strings composed of upper and lowercase text with special characters can be problematic. Analyzers, which tokenize terms during indexing and queries, commonly lower-case any upper-case text, and break down composite terms into smaller parts when characters like dashes, periods, and slashes are encountered. 

As an illustration, consider how the following fictitious feature code, `"MSFT/SQL.2019/Linux&Java-Ext"`, would be tokenized and indexed into smaller parts, given the default analyzer: `msft`, `sql`, `2019`, `linux`, `java`, `ext`

Given these transformations, you can imagine how searching on a partial term like `"MSFT/SQL"` becomes problematic when the index contains only segments of the term you expect.

To enable searching over complex strings, your challenges are two-fold:

+ First, control the tokenization process to ensure your index actually contains the required information. Instead of segments, you want intact terms so that matching on partial terms or patterns can succeed.

+ Second, create queries that do the best job of setting up the matching criteria. Wildcard queries are a common approach, but many developers incorporate regular expressions for advanced patterns.

### Set up analyzers

Tokenization is a product of analyzers. The default analyzer is standard Lucene, but you can override the default results by providing custom analyzers, which you can set on a field by field basis according to your needs.

Analyzers are used during indexing as well as queries. It's common to use the same analyzer for both but you can configure custom analyzers for each workload.


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

