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
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic ranking is an extension of the query execution pipeline that improves the precision and recall by reranking the top matches. Semantic ranking is backed by a pretrained machine reading comprehension model, trained for queries expressed in natural language as opposed to keyword search. In contrast with the [default ranking algorithm](index-ranking-similarity.md), the semantic ranker uses the context and meaning of words to determine relevance. 

Conceptual similarity and relatedness are established through vector representation and term clusters. Whereas a keyword similarity algorithm might give equal weight to any term in the query, the semantic model has been trained to recognize the interdependency and relationships among words that are otherwise unrelated on the surface. As a result, if a query string includes terms from the same cluster, a document containing both will rank higher than one that doesn't.

:::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

## Inputs to semantic ranking

The semantic ranking model evaluates the document corpus at the sentence and paragraph level, which is both resource intensive and time consuming. In order to complete processing within the expected latency of a query operation, the model takes as an input just the top 50 documents returned from the default similarity ranking algorithm.

Having received the top 50 matches, the semantic ranking model re-evaluates the document corpus, focusing on the fields specified in the searchFields parameter. Results from the initial ranking can include more than 50 matches, but only the first 50 will be reranked semantically. For semantic ranking, the model uses both machine reading comprehension and transfer learning to re-score the documents based on how well each one matches the intent of the query.

Internally, the extraction model intakes about 10,000 tokens per document, which roughly correspond to about three pages of text. Collectively, if the fields you specify in searchFields contain text that is in excess of the maximum limit, the excess text is ignored. For best results, use semantic ranking on documents and fields that have a workable amount of text.

## Next steps

Semantic ranking is offered on Standard services only. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

A new query type enables the relevance ranking and response structures of semantic search.

First, [create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Return a semantic answer](semantic-answers.md)