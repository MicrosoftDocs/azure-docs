---
title: Fuzzy search
titleSuffix: Azure Cognitive Search
description: Implement a "did you mean" search experience to auto-correct a misspelled term or typo.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/06/2020
---
# Fuzzy search to correct misspellings and typos

Azure Cognitive Search provides fuzzy search, a type of query that scans for highly similar terms in addition to the exact term. Expanding search to include a near-match has the effect of auto-correcting a typo when the discrepancy is just a few characters off. 

## What is fuzzy search?

It's an expansion exercise that produces a match on similar terms. A term is considered similar if the first character is the same as the query terms, and other differences are numbered two or fewer edits: a character in the comparison string is inserted, deleted, substituted, or transposed.

The string correction algorithm that specifies the difference between two terms is the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) metric, "where distance is the minimum number of operations (insertions, deletions, substitutions, or transpositions of two adjacent characters) required to change one word into the other". 

In Azure Cognitive Search:

+ The default distance is 2. A value of `~0` signifies no expansion (only the exact term is considered a match), and `~1` signifies one degree of difference.

+ A fuzzy query can expand a term up to 50 additional permutations, although a typical expansion is usually much less. 

+ Fuzzy query applies to whole terms, but you can support phrases through AND constructions. For example, "Unviersty~ of~ "Wshington~" would match on "University of Washington".

## How to use fuzzy search

Fuzzy search is constructed using the full Lucene query syntax, invoking the [Lucene query parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

1. Set the full Lucene parser on the query (`queryType=full`).

1. In the query request, make sure you are targeting non-analyzed or minimally analyzed fields that keeps strings intact. Use this parameter to target a query on specific fields (`searchFields=<field1,field2>`). 

  This step assumes you have defined a field that contains the exact string, and that the field was analyzed during indexing with a content-preserving analyzer, such as a keyword analyzer.

1. Use the tilde (`~`) operator at the end of the whole term (`search=<string>~`).

  Alternatively, you can include an optional parameter, a number between 0 and 2 (default), that specifies the edit distance (`~1`). For example, "blue~" or "blue~1" would return "blue", "blues", and "glue".

In Azure Cognitive Search, besides the term and distance (up to 2), there are no additional parameters to set on the query.

> [!NOTE]
> Fuzzy queries are not [analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on a partial term search is lower casing.

## How to test fuzzy search

For simple testing, we recommend [Search explorer](search-explorer.md) or [Postman](search-get-started-postman.md) for iterating over a query expression. Both tools are interactive, which means you can quickly step through multiple variants of a term and evaluate the responses that come back.

When results are ambiguous, [hit highlighting](search-pagination-page-layout.md#hit-highlighting) can help you identify the match in the response. 

> [!Important]
> This technique works best for focused testing on fuzzy search itself. If your index has scoring profiles, or if you combine fuzzy search with additional syntax, hit highlighting might not work in those situations.

Assume the following string exists in a `"Description"` field in a search document: `"Test queries with special characters, plus strings for MSFT, SQL and Java."`

Start with a fuzzy search on "special" and add hit highlighting to the Description field:

    special~&highlight=Description

Because you added hit highlighting, the response tells you that "special" is the matching term.

    "@search.highlights": {
        "Description": [
            "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
        ]

Try again, misspelling "special" by taking out letters several letters ("pe"):

    scial~&highlight=Description

So far, no change to the response. Using the default of 2 degrees distance, removing two characters "pe" from "special" still allows for a successful match on that term.

    "@search.highlights": {
        "Description": [
            "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
        ]

Trying one more, further modify the search term by taking out one last character for a total of three characters:

    scial~&highlight=Description

Notice that the same response is returned, but now instead of matching on "special", the fuzzy match is on "SQL".

            "@search.score": 0.4232868,
            "@search.highlights": {
                "Description": [
                    "Mix of special characters, plus strings for MSFT, <em>SQL</em>, 2019, Linux, Java."
                ]

The point of this extended example is to illustrate the clarity that hit highlighting can bring to ambiguous results. Had you relied on a document ID to check the match, you might have missed the shift from "special" to "SQL".

## Fuzzy search with autocomplete

TBD - for a "did you mean" or "search instead" experience

## See also

+ [How full text search works in Azure Cognitive Search (query parsing architecture)](search-lucene-query-architecture.md)
+ [Search explorer](search-explorer.md)
+ [How to query in .NET](search-query-dotnet.md)
+ [How to query in REST](search-create-index-rest-api.md)
