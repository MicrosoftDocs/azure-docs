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

Azure Cognitive Search supports fuzzy search, a type of query that scans for highly similar terms in addition to the exact term. Expanding search to cover near-matches has the effect of auto-correcting a typo when the discrepancy is just a few misplaced characters. 

## What is fuzzy search?

It's an expansion exercise that produces a match on similar terms, in addition to the exact term. Internally, the engine builds a graph of up to 50 variants per term, and then refers to the graph to find, score, and select results. 

A match must start with the same first character, with other discrepancies limited to two or fewer edits, where an edit is an inserted, deleted, substituted, or transposed character. The string correction algorithm that specifies the differential is the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) metric, described as the "minimum number of operations (insertions, deletions, substitutions, or transpositions of two adjacent characters) required to change one word into the other". 

In Azure Cognitive Search:

+ Fuzzy query applies to whole terms, but you can support phrases through AND constructions. For example, "Unviersty~ of~ "Wshington~" would match on "University of Washington".

+ The default distance of an edit is 2. A value of `~0` signifies no expansion (only the exact term is considered a match), and `~1` signifies one degree of difference, or one edit.

+ A fuzzy query can expand a term up to 50 additional permutations. 

## Indexing for fuzzy search

If you are targeting specific fields for fuzzy search, think about which analyzer would produce optimum results for the graph. In contrast with other queries that bypass lexical analysis (namely, wildcard and regex), you might actually want lexical analyzers in your analysis chain so that you have a large pool of tokens, which gives the engine more to work with when constructing the graph. [Lexical analyzers](index-add-language-analyzers.md) are specified on the analyzer property of a [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) operation. Some languages, particularly those with vowel mutations, benefit from the inflection and irregular word forms that Microsoft natural language processors can handle.

> [!NOTE]
> Ngram indexing, with a progression of short character sequences (two-character pairs for bigram, three for trigram, and so forth), is an alternative approach for spell corrections. If you are using fuzzy queries (`~`) in Azure Cognitive Search, avoid using ngram analyzer. It would not be a good fit in terms of constructing the graph.

## How to use fuzzy search

Fuzzy queries are constructed using the full Lucene query syntax, invoking the [Lucene query parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html).

1. Set the full Lucene parser on the query (`queryType=full`).

1. Optionally, scope the request to specific fields, using this parameter (`searchFields=<field1,field2>`). 

1. Append the tilde (`~`) operator at the end of the whole term (`search=<string>~`).

   Include an optional parameter, a number between 0 and 2 (default), if you want to specify the edit distance (`~1`). For example, "blue~" or "blue~1" would return "blue", "blues", and "glue".

In Azure Cognitive Search, besides the term and distance (maximum of 2), there are no additional parameters to set on the query.

> [!NOTE]
> During query processing, fuzzy queries do not undergo the same level of [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis) as full text search. The query input is added directly to the query tree. The only transformation performed is lower casing. The graph used to find and score matches will be based on the input term and the number of edits (2 by default).

## How to test fuzzy search

For simple testing, we recommend [Search explorer](search-explorer.md) or [Postman](search-get-started-postman.md) for iterating over a query expression. Both tools are interactive, which means you can quickly step through multiple variants of a term and evaluate the responses that come back.

When results are ambiguous, [hit highlighting](search-pagination-page-layout.md#hit-highlighting) can help you identify the match in the response. 

> [!Important]
> The use of hit highlighting to identify the match has limitations and works best for focused testing on fuzzy search itself. If your index has scoring profiles, or if you layer the query with additional syntax, hit highlighting might fail to identify the match. 

### Example 1: fuzzy search with the exact term

Assume the following string exists in a `"Description"` field in a search document: `"Test queries with special characters, plus strings for MSFT, SQL and Java."`

Start with a fuzzy search on "special" and add hit highlighting to the Description field:

    search=special~&highlight=Description

In the response, because you added hit highlighting, formatting is applied to "special" as the matching term.

    "@search.highlights": {
        "Description": [
            "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
        ]

Try the request again, misspelling "special" by taking out letters several letters ("pe"):

    search=scial~&highlight=Description

So far, no change to the response. Using the default of 2 degrees distance, removing two characters "pe" from "special" still allows for a successful match on that term.

    "@search.highlights": {
        "Description": [
            "Test queries with <em>special</em> characters, plus strings for MSFT, SQL and Java."
        ]

Trying one more request, further modify the search term by taking out one last character for a total of three characters:

    search=scial~&highlight=Description

Notice that the same response is returned, but now instead of matching on "special", the fuzzy match is on "SQL".

            "@search.score": 0.4232868,
            "@search.highlights": {
                "Description": [
                    "Mix of special characters, plus strings for MSFT, <em>SQL</em>, 2019, Linux, Java."
                ]

The point of this expanded example is to illustrate the clarity that hit highlighting can bring to ambiguous results. Had you relied on a document ID to check the match, you might have missed the shift from "special" to "SQL".

## See also

+ [How full text search works in Azure Cognitive Search (query parsing architecture)](search-lucene-query-architecture.md)
+ [Search explorer](search-explorer.md)
+ [How to query in .NET](search-query-dotnet.md)
+ [How to query in REST](search-create-index-rest-api.md)
