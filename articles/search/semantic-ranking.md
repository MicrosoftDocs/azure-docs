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
# Semantic ranking

> [!IMPORTANT]
> Semantic search features are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic ranking improves the precision of search results by reranking the top matches using a semantic ranking model trained for queries expressed in natural language as opposed to keywords.

This article describes the semantic ranking algorithm and how a semantic response is shaped. A response includes captions, both in plain text and with highlights, and answers (optional).

## OTher stuff

A semantic response includes new properties for scores, captions, and answers. A semantic response is built from the standard response, using the top 50 results returned by the [full text search engine](search-lucene-query-architecture.md), which are then re-ranked using the semantic ranker. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked.

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select statement. It also includes an "answer" field and "captions".

+ For each semantic result, by default, there is one "answer", returned as a distinct field that you can choose to render in a search page. You can specify up to five. Formulation of answer is automated: reading through all the documents in the initial results, running extractive summarization, followed by machine reading comprehension, and finally promoting a direct answer to the user’s question in the answer field.

+ A "caption" is an extraction-based summarization of document content, returned in plain text or with highlights. Captions are included automatically and cannot be suppressed. Highlights are applied using machine reading comprehension to identify which strings should be emphasized. Highlights draw your attention to the most relevant passages, so that you can quickly scan a page of results to find the right document.

A semantically re-ranked result set orders results by the @search.rerankerScore value. If you add an OrderBy clause, an HTTP 400 error will be returned because that clause is not supported in a semantic query.

## Semantic ranking workflow

Components of semantic search are layered on top of the existing query execution pipeline. 

Spell correction improves recall by correcting typos in individual query terms.

After parsing and analysis are completed, the search engine retrieves the documents that matched the query and scores them using the [default similarity scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms), either BM25 or classic, depending on when the service was created. Scoring profiles are also applied at this stage.

Having received the top 50 matches, the semantic ranking model re-evaluates the document corpus. Results can include more than 50 matches, but only the first 50 will be reranked. For ranking, the model uses both machine learning and transfer learning to re-score the documents based on how well each one matches the intent of the query.

Internally, the extraction model intakes about 10,000 tokens, which roughly corresponds to about three pages of text. If the fields you specify in searchFields parameter contain text that is in excess of this amount, anything beyond the token limit is ignored. For best results, use semantic ranking on documents and fields that have a workable amount of text.

To create captions and answers, semantic search uses language representation to extract and highlight key passages that best summarize a result. If the search query is a question, and answers are requested, the response will include a text passage that best answers the question, as expressed by the search query.

:::image type="content" source="media/semantic-search-overview/semantic-query-architecture.png" alt-text="Semantic components in a query pipeline" border="true":::

## Next steps

A new query type enables the relevance ranking and response structures of semantic search.

[Create a semantic query](semantic-how-to-query-request.md) to get started. Or, review either of the following articles for related information.

+ [Add spell check to query terms](speller-how-to-add.md)
+ [Semantic ranking and answers](semantic-answers.md)