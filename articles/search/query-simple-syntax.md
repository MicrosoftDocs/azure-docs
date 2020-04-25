---
title: Simple query syntax
titleSuffix: Azure Cognitive Search
description: Reference for the simple query syntax used for full text search queries in Azure Cognitive Search.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/24/2020
---

# Simple query syntax in Azure Cognitive Search

Azure Cognitive Search implements two Lucene-based query languages: [Simple Query Parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/simple/SimpleQueryParser.html) and the [Lucene Query Parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

The simple parser is more flexible and will attempt to interpret a request even if it's not perfectly composed. Because of this flexibility, it is the default for queries in Azure Cognitive Search. 

The simple syntax is used for query expressions passed in the `search` parameter of a [Search Documents request](https://docs.microsoft.com/rest/api/searchservice/search-documents), not to be confused with the [OData syntax](query-odata-filter-orderby-syntax.md) used for the [$filter expressions](search-filters.md) parameter of the same Search Documents API. The `search` and `$filter` parameters have different syntax, with their own rules for constructing queries, escaping strings, and so on.

Although the simple parser is based on the [Apache Lucene Simple Query Parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/simple/SimpleQueryParser.html) class, the implementation in Azure Cognitive Search excludes fuzzy search. If you need [fuzzy search](search-query-fuzzy.md) or other advanced query forms, consider the alternative [full Lucene query syntax](query-lucene-syntax.md) instead.

## Invoke simple parsing

Simple syntax is the default. Invocation is only necessary if you are resetting the syntax from full to simple. To explicitly set the syntax, use the `queryType` search parameter. Valid values include `queryType=simple` or `queryType=full`, where `simple` is the default, and `full` invokes the [full Lucene query parser](query-lucene-syntax.md) for more advanced queries. 

## Syntax fundamentals

Any text with one or more terms is considered a valid starting point for query execution. Azure Cognitive Search will match documents containing any or all of the terms, including any variations found during analysis of the text.

As straightforward as this sounds, there is one aspect of query execution in Azure Cognitive Search that *might* produce unexpected results, increasing rather than decreasing search results as more terms and operators are added to the input string. Whether this expansion actually occurs depends on the inclusion of a NOT operator, combined with a **searchMode** parameter setting that determines how NOT is interpreted in terms of AND or OR behaviors. For more information, see [NOT operator](#not-operator).

### Precedence operators (grouping)

You can use parentheses to create subqueries, including operators within the parenthetical statement. For example, `motel+(wifi|luxury)` will search for documents containing the "motel" term and either "wifi" or "luxury" (or both).

Field grouping is similar but scopes the grouping to a single field. For example, `hotelAmenities:(gym+(wifi|pool))` searches the field "hotelAmenities" for "gym" and "wifi", or "gym" and "pool".  

### Escaping search operators  

In the simple syntax, search operators include these characters: `+ | " ( ) ' \`  

If any of these characters are part of a token in the index, escape it by prefixing it with a single backslash (`\`) in the query. For example, suppose you used a custom analyzer for whole term tokenization, and your index contains the string "Luxury+Hotel". To get an exact match on this token, insert an escape character: `search=luxury\+hotel`. 

To make things simple for the more typical cases, there are two exceptions to this rule where escaping is not needed:  

+ The NOT operator `-` only needs to be escaped if it's the first character after a whitespace. If the `-` appears in the middle (for example, in `3352CDD0-EF30-4A2E-A512-3B30AF40F3FD`), you can skip escaping.

+ The suffix operator `*` only needs to be escaped if it's the last character before a whitespace. If the `*` appears in the middle (for example, in `4*4=16`), no escaping is needed.

> [!NOTE]  
> By default, the standard analyzer will delete and break words on hyphens, whitespace, ampersands, and other characters during [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis). If you require special characters to remain in the query string, you might need an analyzer that preserves them in the index. Some choices include Microsoft natural [language analyzers](index-add-language-analyzers.md), which preserves hyphenated words, or a custom analyzer for more complex patterns. For more information, see [Partial terms, patterns, and special characters](search-query-partial-matching.md).

### Encoding unsafe and reserved characters in URLs

Please ensure all unsafe and reserved characters are encoded in a URL. For example, '#' is an unsafe character because it is a fragment/anchor identifier in a URL. The character must be encoded to `%23` if used in a URL. '&' and '=' are examples of reserved characters as they delimit parameters and specify values in Azure Cognitive Search. Please see [RFC1738: Uniform Resource Locators (URL)](https://www.ietf.org/rfc/rfc1738.txt) for more details.

Unsafe characters are ``" ` < > # % { } | \ ^ ~ [ ]``. Reserved characters are `; / ? : @ = + &`.

###  <a name="bkmk_querysizelimits"></a> Query size limits

 There is a limit to the size of queries that you can send to Azure Cognitive Search. Specifically, you can have at most 1024 clauses (expressions separated by AND, OR, and so on). There is also a limit of approximately 32 KB on the size of any individual term in a query. If your application generates search queries programmatically, we recommend designing it in such a way that it does not generate queries of unbounded size.  

## Boolean search

You can embed Boolean operators (AND, OR, NOT) in a query string to build a rich set of criteria against which matching documents are found. 

### AND operator `+`

The AND operator is a plus sign. For example, `wifi + luxury` will search for documents containing both `wifi` and `luxury`.

### OR operator `|`

The OR operator is a vertical bar or pipe character. For example, `wifi | luxury` will search for documents containing either `wifi` or `luxury` or both.

<a name="not-operator"></a>

### NOT operator `-`

The NOT operator is a minus sign. For example, `wifi –luxury` will search for documents that have the `wifi` term and/or do not have `luxury`.

The **searchMode** parameter on a query request controls whether a term with the NOT operator is ANDed or ORed with other terms in the query (assuming there is no `+` or `|` operator on the other terms). Valid values include `any` or `all`.

`searchMode=any` increases the recall of queries by including more results, and by default `-` will be interpreted as "OR NOT". For example, `wifi -luxury` will match documents that either contain the term `wifi` or those that do not contain the term `luxury`.

`searchMode=all` increases the precision of queries by including fewer results, and by default - will be interpreted as "AND NOT". For example, `wifi -luxury` will match documents that contain the term `wifi` and do not contain the term "luxury". This is arguably a more intuitive behavior for the `-` operator. Therefore, you should consider using `searchMode=all` instead of `searchMode=any` if you want to optimize searches for precision instead of recall, *and* Your users frequently use the `-` operator in searches.

When deciding on a **searchMode** setting, consider the user interaction patterns for queries in various applications. Users who are searching for information are more likely to include an operator in a query, as opposed to e-commerce sites that have more built-in navigation structures.

<a name="prefix-search"></a>

## Prefix search

The suffix operator is an asterisk `*`. For example, `lingui*` will find "linguistic" or "linguini", ignoring case. 

Similar to filters, a prefix query looks for an exact match. As such, there is no relevance scoring (all results receive a search score of 1.0). Prefix queries can be slow, especially if the index is large and the prefix consists of a small number of characters. 

If you want to execute a suffix query, matching on the last part of string, use a [wildcard search](query-lucene-syntax.md#bkmk_wildcard) and the full Lucene syntax.

## Phrase search `"`

A term search is a query for one or more terms, where any of the terms are considered a match. A phrase search is an exact phrase enclosed in quotation marks `" "`. For example, while `Roach Motel` (without quotes) would search for documents containing `Roach` and/or `Motel` anywhere in any order, `"Roach Motel"` (with quotes) will only match documents that contain that whole phrase together and in that order (text analysis still applies).

## See also  

+ [How full text search works in Azure Cognitive Search](search-lucene-query-architecture.md)
+ [Query examples for simple search](search-query-simple-examples.md)
+ [Query examples for full Lucene search](search-query-lucene-examples.md)
+ [Search Documents REST API](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
+ [Lucene query syntax](query-lucene-syntax.md)
+ [OData expression syntax](query-odata-filter-orderby-syntax.md) 
