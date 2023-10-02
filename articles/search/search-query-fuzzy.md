---
title: Fuzzy search
titleSuffix: Azure Cognitive Search
description: Implement a fuzzy search query for a "did you mean" search experience. Fuzzy search auto-corrects a misspelled term or typo on the query.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/20/2023
---
# Fuzzy search to correct misspellings and typos

Azure Cognitive Search supports fuzzy search, a type of query that compensates for typos and misspelled terms in the input string. Fuzzy search scans for terms having a similar composition. Expanding search to cover near-matches has the effect of autocorrecting a typo when the discrepancy is just a few misplaced characters. 

## What is fuzzy search?

It's a query expansion exercise that produces a match on terms having a similar composition. When a fuzzy search is specified, the search engine builds a graph (based on [deterministic finite automaton theory](https://en.wikipedia.org/wiki/Deterministic_finite_automaton)) of similarly composed terms, for all whole terms in the query. For example, if your query includes three terms "university of washington", a graph is created for every term  in the query `search=university~ of~ washington~` (there's no stop-word removal in fuzzy search, so "of" gets a graph).

The graph consists of up to 50 expansions, or permutations, of each term, capturing both correct and incorrect variants in the process. The engine then returns the topmost relevant matches in the response. 

For a term like "university", the graph might have "unversty, universty, university, universe, inverse". Any documents that match on those in the graph are included in results. In contrast with other queries that analyze the text to handle different forms of the same word ("mice" and "mouse"), the comparisons in a fuzzy query are taken at face value without any linguistic analysis on the text. "Universe" and "inverse", which are semantically different, will match because the syntactic discrepancies are small.

A match succeeds if the discrepancies are limited to two or fewer edits, where an edit is an inserted, deleted, substituted, or transposed character. The string correction algorithm that specifies the differential is the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) metric. It's described as the "minimum number of operations (insertions, deletions, substitutions, or transpositions of two adjacent characters) required to change one word into the other". 

In Azure Cognitive Search:

+ Fuzzy query applies to whole terms. Phrases aren't supported directly but you can specify a fuzzy match on each term of a multi-part phrase through AND constructions. For example, `search=dr~ AND cleanin~`.  This query expression finds matches on "dry cleaning".

+ The default distance of an edit is 2. A value of `~0` signifies no expansion (only the exact term is considered a match), but you could specify `~1` for one degree of difference, or one edit. 

+ A fuzzy query can expand a term up to 50 permutations. This limit isn't configurable, but you can effectively reduce the number of expansions by decreasing the edit distance to 1.

+ Responses consist of documents containing a relevant match (up to 50).

During query processing, fuzzy queries don't undergo [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis). The query input is added directly to the query tree and expanded to create a graph of terms. The only transformation performed is lower casing.

Collectively, the graphs are submitted as match criteria against tokens in the index. As you can imagine, fuzzy search is inherently slower than other query forms. The size and complexity of your index can determine whether the benefits are enough to offset the latency of the response.

> [!NOTE]
> Because fuzzy search tends to be slow, it might be worthwhile to investigate alternatives such as n-gram indexing, with its progression of short character sequences (two and three character sequences for bigram and trigram tokens). Depending on your language and query surface, n-gram might give you better performance. The trade off is that n-gram indexing is very storage intensive and generates much bigger indexes.
>
> Another alternative, which you could consider if you want to handle just the most egregious cases, would be a [synonym map](search-synonyms.md). For example, mapping "search" to "serach, serch, sarch", or "retrieve" to "retreive".

## Indexing for fuzzy search

String fields that are attributed as "searchable" are candidates for fuzzy search.

Analyzers aren't used to create an expansion graph, but that doesn't mean analyzers should be ignored in fuzzy search scenarios. Analyzers are important for tokenization during indexing, where tokens in the inverted indexes are used for matching against the graph.

As always, if test queries aren't producing the matches you expect, experiment with different indexing analyzers. For example, try a [language analyzer](index-add-language-analyzers.md) to see if you get better results. Some languages, particularly those with vowel mutations, can benefit from the inflection and irregular word forms generated by the Microsoft natural language processors. In some cases, using the right language analyzer can make a difference in whether a term is tokenized in a way that is compatible with the value provided by the user.

## How to invoke fuzzy search

Fuzzy queries are constructed using the full Lucene query syntax, invoking the [full Lucene query parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html), and appending a tilde character `~` after each whole term entered by the user.

Here's an example of a query request that invokes fuzzy search. It includes four terms, two of which are misspelled:

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30
{
    "search": "seatle~ waterfront~ view~ hotle~",
    "queryType": "full",
    "searchMode": "any",
    "searchFields": "HotelName, Description",
    "select": "HotelName, Description, Address/City,",
    "count": "true"
}
```

1. Set the query type to the full Lucene syntax (`queryType=full`).

1. Provide the query string where each term is followed by a tilde (`~`) operator at the end of each whole term (`search=<string>~`). An expansion graph is created for every term in the query input.

   Include an optional parameter, a number between 0 and 2 (default), if you want to specify the edit distance (`~1`). For example, "blue~" or "blue~1" would return "blue", "blues", and "glue".

Optionally, you can improve query performance by scoping the request to specific fields. Use the `searchFields` parameter to specify which fields to search. You can also use the `select` property to specify which fields are returned in the query response.

## Testing fuzzy search

For simple testing, we recommend [Search explorer](search-explorer.md) or [Postman](search-get-started-rest.md) for iterating over a query expression. Both tools are interactive, which means you can quickly step through multiple variants of a term and evaluate the responses that come back.

When results are ambiguous, [hit highlighting](search-pagination-page-layout.md#hit-highlighting) can help you identify the match in the response. 

> [!NOTE]
> The use of hit highlighting to identify fuzzy matches has limitations and only works for basic fuzzy search. If your index has scoring profiles, or if you layer the query with more syntax, hit highlighting might fail to identify the match. 

### Example 1: fuzzy search with the exact term

Assume the following string exists in a `"Description"` field in a search document: `"Test queries with special characters, plus strings for MSFT, SQL and Java."`

Start with a fuzzy search on "special" and add hit highlighting to the Description field:

```console
search=special~&highlight=Description
```

In the response, because you added hit highlighting, formatting is applied to "special" as the matching term.

```output
"@search.highlights": {
    "Description": [
        "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
    ]
```

Try the request again, misspelling "special" by taking out several letters ("pe"):

```console
search=scial~&highlight=Description
```

So far, no change to the response. Using the default of 2 degrees distance, removing two characters "pe" from "special" still allows for a successful match on that term.

```output
"@search.highlights": {
    "Description": [
        "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
    ]
```

Trying one more request, further modify the search term by taking out one last character for a total of three deletions (from "special" to "scal"):

```console
search=scal~&highlight=Description
```

Notice that the same response is returned, but now instead of matching on "special", the fuzzy match is on "SQL".

```output
        "@search.score": 0.4232868,
        "@search.highlights": {
            "Description": [
                "Mix of special characters, plus strings for MSFT, <em>SQL</em>, 2019, Linux, Java."
            ]
```

The point of this expanded example is to illustrate the clarity that hit highlighting can bring to ambiguous results. In all cases, the same document is returned. Had you relied on document IDs to verify a match, you might have missed the shift from "special" to "SQL".

## See also

+ [How full text search works in Azure Cognitive Search (query parsing architecture)](search-lucene-query-architecture.md)
+ [Search explorer](search-explorer.md)
+ [How to query in .NET](./search-get-started-text.md)
+ [How to query in REST](./search-get-started-powershell.md)
