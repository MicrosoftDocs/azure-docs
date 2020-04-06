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
# Fuzzy search for auto-corrected misspellings and typos

Azure Cognitive Search provides fuzzy search, a type of query that scans for highly similar terms in addition to the verbatim term. Expanding search to include a near-match has the effect of auto-correcting a typo when the discrepancy is just a few characters off. 

## What is fuzzy search?

It's an expansion exercise that produces a match on similarly constructed terms, where the first character is the same, but other discrepancies are limited to one to two characters within the term. For example, given `"special~"`, s

A fuzzy search can expand a term up to 50 additional terms, but a typical expansion is usually much less. 

The distance criteria is the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) metric, where distance is the minimum number of operations (insertions, deletions, substitutions, or transpositions of two adjacent characters) required to change one word into the other. By default the distance is 2. A value of `~0` signifies no expansion (search for the exact term as given), and `~1` signifies one degree of difference.

Fuzzy search applies to whole terms, but you can support phrases through AND constructions. For example, "Unviersty~ of~ "Wshington~" would match on "University of Washington".

## How to use fuzzy search

Fuzzy search is constructed using the full Lucene query syntax, invoking the [Lucene query parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

+ Set the full Lucene parser (`queryType=full`) on the query

+ In the query request, specify fields that were analyzed during indexing with a custom analyzer or built-in analyzer that keeps strings intact (with minimal transformations and reductions). The `searchFields` parameter is used to target a query on specific fields.

+ Use the tilde (`~`) operator at the end of a single word with an optional parameter, a number between 0 and 2 (default), that specifies the edit distance. For example, "blue~" or "blue~1" would return "blue", "blues", and "glue".

In Azure Cognitive Search, besides the term and distance (up to 2), there are no additional parameters to set on the query.

> [!NOTE]
> Fuzzy queries are not [analyzed](search-lucene-query-architecture.md#stage-2-lexical-analysis). Query types with incomplete terms (prefix query, wildcard query, regex query, fuzzy query) are added directly to the query tree, bypassing the analysis stage. The only transformation performed on a partial term search is lower casing.

## How to test fuzzy search

For testing, we recommend Search explorer or Postman for iterating over a query expression.

When the results of a fuzzy search are ambiguous, [hit highlighting](search-pagination-page-layout.md#hit-highlighting) can help you identify the match in the response. 

For example, assume you have a document with this string: `"Description": "Test queries with special characters, plus strings for MSFT, SQL and Java."

Start with a fuzzy search on special and add hit highlighting to the Description field:

    special~&highlight=Description

With the addition of hit highlighting, the response tells you that "special" is the matching term.

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
                "longerText": [
                    "Mix of special characters, plus strings for MSFT, <em>SQL</em>, 2019, Linux, Java."
                ]

The point of this extended example is to illustrate the clarity that hit highlighting can bring to ambiguous results. Had you relied on a document ID to check the match, you might have missed the shift from "special" to "SQL".

## Use fuzzy search with autocomplete for a "did you mean" or "search instead" experience

TBD

## See also

+ [How full text search works in Azure Cognitive Search (query parsing architecture)](search-lucene-query-architecture.md)
+ [Search explorer](search-explorer.md)
+ [How to query in .NET](search-query-dotnet.md)
+ [How to query in REST](search-create-index-rest-api.md)
