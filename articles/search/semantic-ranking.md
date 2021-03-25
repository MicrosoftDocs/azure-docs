---
title: Semantic ranking
titleSuffix: Azure Cognitive Search
description: Learn how the semantic ranking algorithm works in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/22/2021
---

# Semantic ranking in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API and portal. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), and are not guaranteed to have the same implementation at general availability. These features are billable. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic ranking is an extension of the query execution pipeline that improves precision by reranking the top matches of an initial result set. Semantic ranking is backed by large transformer-based networks, trained for capturing the semantic meaning of query terms, as opposed to linguistic matching on keywords. In contrast with the [default similarity ranking algorithm](index-ranking-similarity.md), the semantic ranker uses the context and meaning of words to determine relevance.

Semantic ranking is both resource and time intensive. In order to complete processing within the expected latency of a query operation, inputs to the semantic ranker are consolidated and reduced so that the underlying summarization and reranking steps can be completed as quickly as possible.

## Preparation for semantic ranking

Before scoring for relevance, content must be reduced to a manageable number of inputs that can be handled efficiently by the semantic ranker. Content reduction includes the following sequence of steps.

1. First, semantic ranking depends on the initial results set returned by the default [similarity ranking algorithm](index-ranking-similarity.md) used for keyword search. For any given query, a results set could be a handful of documents, up to the maximum limit of 1,000. Since a large number of matches would be too much to process, only the top 50 progress to semantic ranking. Whatever the document count, whether one or 50, the initial result set becomes the document corpus for semantic ranking.

1. Across the document corpus, the contents of each field in "searchFields" are extracted and combined into a long string.

1. Any strings that are excessively long are trimmed to ensure the overall length meets the input requirements of the summarization step. This trimming exercise is why it's important to position concise fields first in "searchFields", to ensure they are included in the string. If you have very large documents with text-heavy fields, anything after the maximum limit is ignored.

Each document is now represented by a single long string.

> [!NOTE]
> Parameter inputs to the models are tokens, not characters or words. Tokenization is determined in part by the analyzer assignment on searchable fields. For insights into how strings are tokenized, you can review the token output of an analyzer using the [Test Analyzer REST API](/rest/api/searchservice/test-analyzer).

## Extraction

After string reduction, it's now possible to pass the reduced inputs through machine reading comprehension and language representation models to determine which sentences and phrases best summarize the document, relative to the query. This phase extracts content from the string that will move forward to the semantic ranker.

Inputs to summarization are the long strings obtained for each document in the preparation phase. From each string, the summarization model finds a passage that is the most representative. This passage also constitutes a [semantic caption](semantic-how-to-query-request.md) for the document. Each caption is available in a plain text version and a highlight version, and is frequently fewer than 200 words per document.

A [semantic answer](semantic-answers.md) will also be returned if you specified the "answers" parameter, if the query was posed as a question, and if a passage can be found in the long string that is likely to provide an answer to the question.

## Semantic ranking

1. Captions are evaluated for conceptual and semantic relevance, relative to the query provided.

   The following diagram provides an illustration of what "semantic relevance" means. Consider the term "capital", which could be used in the context of finance, law, geography, or grammar. If a query includes terms from the same vector space (for example, "capital" and "investment"), a document that also includes tokens in the same cluster will score higher than one that doesn't.

   :::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

1. The @search.rerankerScore is assigned to each document based on the semantic relevance of the caption.

1. After all documents are scored, they are listed in descending order by score and included in the query response payload. The payload includes answers, plain text and highlighted captions, and any fields that you marked as retrievable or specified in a select clause.

## Next steps

Semantic ranking is offered on Standard tiers, in specific regions. For more information about availability and sign up, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing). A new query type enables the ranking and response structures of semantic search. To get started, [Create a semantic query](semantic-how-to-query-request.md).

Alternatively, review the following articles about default ranking. Semantic ranking depends on the similarity ranker to return the initial results. Knowing about query execution and ranking will give you a broad understanding of how the entire process works.

+ [Full text search in Azure Cognitive Search](search-lucene-query-architecture.md)
+ [Similarity and scoring in Azure Cognitive Search](index-similarity-and-scoring.md)
+ [Analyzers for text processing in Azure Cognitive Search](search-analyzers.md)