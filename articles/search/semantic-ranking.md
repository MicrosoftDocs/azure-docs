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

1. For each document, the semantic ranker evaluates the fields in the searchFields parameter in order, consolidating the contents into one large string.

1. The string is then trimmed to ensure the overall length is not more than 8,000 tokens. If you have very large documents, with a content field or merged_content field that has many pages of content, anything after the token limit is ignored.

1. Each of the 50 documents is now represented by a single long string. This string is sent to the summarization model. The summarization model produces captions (and answers), using machine reading comprehension to identify passages that appear to summarize the content or answer the question. The output of the summarization model is a further reduced string, which be at most 128 tokens.

1. The smaller string becomes the caption of the document, and it represents the most relevant passages found in the larger string. The set of 50 (or fewer) captions is then ranked in order relevance. 

Conceptual and semantic relevance is established through vector representation and term clusters. Whereas a keyword similarity algorithm might give equal weight to any term in the query, the semantic model has been trained to recognize the interdependency and relationships among words that are otherwise unrelated on the surface. As a result, if a query string includes terms from the same cluster, a document containing both will rank higher than one that doesn't.

:::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

## Next steps

Semantic ranking is offered on Standard tiers, in specific regions. For more information and to sign up, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

A new query type enables the relevance ranking and response structures of semantic search. [Create a semantic query](semantic-how-to-query-request.md) to get started.

Alternatively, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Return a semantic answer](semantic-answers.md)