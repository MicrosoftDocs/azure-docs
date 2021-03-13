---
title: Semantic ranking
titleSuffix: Azure Cognitive Search
description: Describes the semantic ranking algorithm in Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/12/2021
---

# Semantic ranking in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), and are not guaranteed to have the same implementation at general availability. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic ranking is an extension of the query execution pipeline that improves the precision and recall by reranking the top matches of an initial result set. Semantic ranking is backed by state-of-the-art deep machine reading comprehension models, trained for queries expressed in natural language as opposed to linguistic matching on keywords. In contrast with the [default similarity ranking algorithm](index-ranking-similarity.md), the semantic ranker uses the context and meaning of words to determine relevance.

## How semantic ranking works

The semantic ranking is both resource and time intensive. In order to complete processing within the expected latency of a query operation, the model takes as an input just the top 50 documents returned from the default [similarity ranking algorithm](index-ranking-similarity.md). Results from the initial ranking can include more than 50 matches, but only the first 50 will be reranked semantically. 

For semantic ranking, the model uses both machine reading comprehension and transfer learning to re-score the documents based on how well each one matches the intent of the query.

### Preparation (passage extraction) phase

For each document in the initial results, there is a passage extraction exercise that identifies key passages. This is a downsizing exercise that reduces content to an amount that can be processed swiftly.

1. For each of the 50 documents, each field in the searchFields parameter is evaluated in consecutive order. Contents from each field are consolidated into one long string. 

1. The long string is then trimmed to ensure the overall length is not more than 8,000 tokens. For this reason, it's recommended that you position concise fields first so that they are included in the string. If you have very large documents with text-heavy fields, anything after the token limit is ignored.

1. Each document is now represented by a single long string that is up to 8,000 tokens. These strings are sent to the summarization model, which will reduce the string further. The summarization model evaluates the long string for key sentences or passages that best summarize the document or answer the question.

1. The output of this phase is a caption (and optionally, an answer). The caption is at most 128 tokens per document, and it is considered the most representative of the document.

### Scoring and ranking phases

In this phase, all 50 captions are evaluated to assess relevance.

1. Scoring is determined by evaluating each caption for conceptual and semantic relevance, relative to the query provided.

   The following diagram provides an illustration of what "semantic relevance" means. Consider the term "capital", which could be used in the context of finance, law, geography, or grammar. If a query includes terms from the same vector space (for example, "capital" and "investment"), a document that also includes tokens in the same cluster will score higher than one that doesn't.

   :::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

1. The output of this phase is an @search.rerankerScore assigned to each document. Once all documents are scored, they are listed in descending order and included in the query response payload.

## Next steps

Semantic ranking is offered on Standard tiers, in specific regions. For more information and to sign up, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing). A new query type enables the relevance ranking and response structures of semantic search. To get started, [Create a semantic query](semantic-how-to-query-request.md).

Alternatively, review either of the following articles for related information.

+ [Semantic search overview](semantic-search-overview.md)
+ [Return a semantic answer](semantic-answers.md)