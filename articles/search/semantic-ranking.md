---
title: Semantic ranking
titleSuffix: Azure Cognitive Search
description: Learn how the semantic ranking algorithm works in Azure Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/18/2021
---

# Semantic ranking in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), and are not guaranteed to have the same implementation at general availability. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic ranking is an extension of the query execution pipeline that improves the precision and recall by reranking the top matches of an initial result set. Semantic ranking is backed by state-of-the-art machine reading comprehension models, trained for queries expressed in natural language as opposed to linguistic matching on keywords. In contrast with the [default similarity ranking algorithm](index-ranking-similarity.md), the semantic ranker uses the context and meaning of words to determine relevance.

Semantic ranking is both resource and time intensive. In order to complete processing within the expected latency of a query operation, inputs are consolidated and simplified so that summarization and analysis can be completed as quickly as possible.

## Preparation for semantic ranking

Prior to scoring for relevance, content must be reduced to a quantity of parameters that can be handled efficiently by the semantic ranker. Content reduction includes the following sequence of steps.

1. Content reduction starts by using the initial results produced by the default [similarity ranking algorithm](index-ranking-similarity.md) of keywords. Results are a maximum of 50, but possibly less, depending on how many matches were found. This result set is the document corpus for semantic ranking.

1. For each document in the corpus, the contents of each field in "searchFields" is extracted and placed into a long string that consolidates all of the values.

1. The long string is then trimmed to ensure the overall length is not more than 8,000 tokens. The trimming exercise is why it's recommended that you position concise fields first in "searchFields" to ensure they are included in the string. If you have very large documents with text-heavy fields, anything after the maximum token limit is ignored.

Each document is now represented by a single long string that is 8,000 tokens or less.

> [!NOTE]
> Parameter inputs to the models are tokens not characters or strings. Tokenization is determined in part by the analyzer assignment on searchable fields. For insights into how strings are tokenized, you can review the token output of an analyzer using the [Test Analyzer REST API](/rest/api/searchservice/test-analyzer).

## Summarization

After string reduction, it's now possible to pass the parameters through machine reading comprehension and language representation to determine which sentences and phrases best summarize the model, relative to the query.

Output of this phase is a caption (and optionally, an answer). The caption is at most 128 tokens per document, and it is considered the most representative of the document. 

An answer will also be returned if you specified the "answers" parameter, if the query was posed as a question, and if a passage can be found in the long string that looks like a plausible answer.

## Scoring and ranking

At this point, you now have captions that are no more than 128 tokens per document. The captions are evaluated to assess relevance.

1. Scoring is determined by evaluating each caption for conceptual and semantic relevance, relative to the query provided.

   The following diagram provides an illustration of what "semantic relevance" means. Consider the term "capital", which could be used in the context of finance, law, geography, or grammar. If a query includes terms from the same vector space (for example, "capital" and "investment"), a document that also includes tokens in the same cluster will score higher than one that doesn't.

   :::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

1. The output of this phase is an @search.rerankerScore assigned to each document. Once all documents are scored, they are listed in descending order and included in the query response payload. The payload includes answers, plain text and highlighted captions, and any fields that you marked as retrievable or specified in a select clause.

## Next steps

Semantic ranking is offered on Standard tiers, in specific regions. For more information about available and sign up, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing). A new query type enables the relevance ranking and response structures of semantic search. To get started, [Create a semantic query](semantic-how-to-query-request.md).

Alternatively, review either of the following articles for related information.

+ [Semantic search overview](semantic-search-overview.md)
+ [Return a semantic answer](semantic-answers.md)