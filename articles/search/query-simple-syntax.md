---
title: Simple query syntax - Azure Search
description: Reference for the simple query syntax used for full text search queries in Azure Search.
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/02/2019
author: "brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Simple query syntax in Azure Search
Azure Search implements two Lucene-based query languages: [Simple Query Parser](https://lucene.apache.org/core/4_7_0/queryparser/org/apache/lucene/queryparser/simple/SimpleQueryParser.html) and the [Lucene Query Parser](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html). In Azure Search, the simple query syntax excludes the fuzzy/slop options.  

> [!NOTE]  
>  Azure Search provides an alternative [Lucene Query Syntax](query-lucene-syntax.md) for more complex queries. To learn more about query parsing architecture and benefits of each syntax, see [How full text search works in Azure Search](search-lucene-query-architecture.md).

## How to invoke simple parsing

Simple syntax is the default. Invocation is only necessary if you are resetting the syntax from full to simple. To explicitly set the syntax, use the `queryType` search parameter. Valid values include `simple|full`, with `simple` as the default, and `full` for Lucene. 

## Query behavior anomalies

Any text with one or more terms is considered a valid starting point for query execution. Azure Search will match documents containing any or all of the terms, including any variations found during analysis of the text. 

As straightforward as this sounds, there is one aspect of query execution in Azure Search that *might* produce unexpected results, increasing rather than decreasing search results as more terms and operators are added to the input string. Whether this expansion actually occurs depends on the inclusion of a NOT operator, combined with a `searchMode` parameter setting that determines how NOT is interpreted in terms of AND or OR behaviors. Given the default, `searchMode=Any`, and a NOT operator, the operation is computed as an OR action, such that `"New York" NOT Seattle` returns all cities that are not Seattle.  

Typically, you're more likely to see these behaviors in user interaction patterns for applications that search over content, where users are more likely to include an operator in a query, as opposed to e-commerce sites that have more built-in navigation structures. For more information, see [NOT operator](#not-operator). 

## Boolean operators (AND, OR, NOT) 

You can embed operators in a query string to build a rich set of criteria against which matching documents are found. 

### AND operator `+`

The AND operator is a plus sign. For example, `wifi+luxury` will search for documents containing both `wifi` and `luxury`.

### OR operator `|`

The OR operator is a vertical bar or pipe character. For example, `wifi | luxury` will search for documents containing either `wifi` or `luxury` or both.

<a name="not-operator"></a>

### NOT operator `-`

The NOT operator is a minus sign. For example, `wifi –luxury` will search for documents that have the `wifi` term and/or do not have `luxury` (and/or is controlled by `searchMode`).

> [!NOTE]  
>  The `searchMode` option controls whether a term with the NOT operator is ANDed or ORed with the other terms in the query in the absence of a `+` or `|` operator. Recall that `searchMode` can be set to either `any` (default) or `all`. If you use `any`, it will increase the recall of queries by including more results, and by default `-` will be interpreted as "OR NOT". For example, `wifi -luxury` will match documents that either contain the term `wifi` or those that do not contain the term `luxury`. If you use `all`, it will increase the precision of queries by including fewer results, and by default - will be interpreted as "AND NOT". For example, `wifi -luxury` will match documents that contain the term `wifi` and do not contain the term "luxury". This is arguably a more intuitive behavior for the `-` operator. Therefore, you should consider using `searchMode=all` instead of `searchMode=any` if You want to optimize searches for precision instead of recall, *and* Your users frequently use the `-` operator in searches.

## Suffix operator

The suffix operator is an asterisk `*`. For example, `lux*` will search for documents that have a term that starts with `lux`, ignoring case.  

## Phrase search operator

The phrase operator encloses a phrase in quotation marks `" "`. For example, while `Roach Motel` (without quotes) would search for documents containing `Roach` and/or `Motel` anywhere in any order, `"Roach Motel"` (with quotes) will only match documents that contain that whole phrase together and in that order (text analysis still applies).

## Precedence operator

The precedence operator encloses the string in parentheses `( )`. For example, `motel+(wifi | luxury)` will search for documents containing the motel term and either `wifi` or `luxury` (or both).  

## Escaping search operators  

 In order to use the above symbols as actual part of the search text, they should be escaped by prefixing them with a backslash. For example, `luxury\+hotel` will result in the term `luxury+hotel`. In order to make things simple for the more typical cases, there are two exceptions to this rule where escaping is not needed:  

- The NOT operator `-` only needs to be escaped if it's the first character after whitespace, not if it's in the middle of a term. For example, `wi-fi` is a single term; whereas GUIDs (such as `3352CDD0-EF30-4A2E-A512-3B30AF40F3FD`) are treated as a single token.
- The suffix operator `*` needs to be escaped only if it's the last character before whitespace, not if it's in the middle of a term. For example, `wi*fi` is treated as a single token.

> [!NOTE]  
>  Although escaping keeps tokens together, text analysis may split them up, depending on the analysis mode. See [Language support &#40;Azure Search Service REST API&#41;](index-add-language-analyzers.md) for details.  

## See also  

+ [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) 
+ [Lucene query syntax](query-lucene-syntax.md)
+ [OData expression syntax](query-odata-filter-orderby-syntax.md) 
