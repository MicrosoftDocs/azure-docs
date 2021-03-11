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
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During the initial preview launch, there is no charge for semantic search. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic ranking is an extension of the query execution pipeline that improves the precision and recall by reranking the top matches. Semantic ranking is backed by a pretrained machine reading comprehension model, trained for queries expressed in natural language as opposed to keyword search. In contrast with the [default ranking algorithm](index-ranking-similarity.md), the semantic ranker uses the context and meaning of words to determine relevance. 

Whereas a keyword algorithm might give equal weight to any term in the query, the semantic algorithm recognizes the interdependency and relationships among words that are otherwise unrelated on the surface.

:::image type="content" source="media/semantic-search-overview/semantic-vector-representation.png" alt-text="Vector representation for context" border="true":::

## Key points

+ Reranks an initial result set, up to 50 documents, as determined by the default ranking model. Semantic ranking is resource intensive. Evaluating a smaller result set ensure that semantic ranking can be computed quickly.

+ Semantic ranking is offered on Standard services only. For more information, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Having received the top 50 matches, the semantic ranking model re-evaluates the document corpus. Results can include more than 50 matches, but only the first 50 will be reranked. For ranking, the model uses both machine learning and transfer learning to re-score the documents based on how well each one matches the intent of the query.

Internally, the extraction model intakes about 10,000 tokens, which roughly correspond to about three pages of text. If the fields you specify in searchFields parameter contain text that is in excess of this amount, anything beyond the token limit is ignored. For best results, use semantic ranking on documents and fields that have a workable amount of text.

## Improve precision

<!-- A semantic response includes new properties for scores, captions, and answers. A semantic response is built from the standard response, using the top 50 results returned by the [full text search engine](search-lucene-query-architecture.md), which are then re-ranked using the semantic ranker. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked.

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select statement. It also includes an "answer" field and "captions".

+ For each semantic result, by default, there is one "answer", returned as a distinct field that you can choose to render in a search page. You can specify up to five. Formulation of answer is automated: reading through all the documents in the initial results, running extractive summarization, followed by machine reading comprehension, and finally promoting a direct answer to the user’s question in the answer field.

+ A "caption" is an extraction-based summarization of document content, returned in plain text or with highlights. Captions are included automatically and cannot be suppressed. Highlights are applied using machine reading comprehension to identify which strings should be emphasized. Highlights draw your attention to the most relevant passages, so that you can quickly scan a page of results to find the right document. -->

## Next steps

A new query type enables the relevance ranking and response structures of semantic search.

First, [create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Return a semantic answer](semantic-answers.md)