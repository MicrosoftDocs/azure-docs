---
title: Structure a semantic response
titleSuffix: Azure Cognitive Search
description: Describes the semantic ranking algorithm in Cognitive Search and how to structure 'semantic answers' and 'semantic captions' from a result set.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
ms.custom: references_regions
---

# Return a semantic answer in Azure Cognitive Search

> [!IMPORTANT]
> Semantic ranking and semantic answers are in public preview, available through the preview REST API only. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Semantic answers use machine learning models from Bing to formulate answers to queries that look like questions. The answers are selected from passages most relevant to the query, as extracted from the top documents in an initial result set. Answers are returned as an independent, top-level object in the query response payload that you can choose to render on the search pages, along side search results.

<!-- Semantic ranking improves the precision of search results by reranking the top matches using a semantic ranking model trained for queries expressed in natural language as opposed to keywords.

This article describes the semantic ranking algorithm and how a semantic response is shaped. A response includes captions, both in plain text and with highlights, and answers (optional).

+ Semantic captions are text passages relevant to the query extracted from the search results. They can help to summarize a result when individual content fields are too large for the results page. Captions feature semantic highlights, allowing users to quickly skim query results to find the most relevant documents thus improving overall user experience. -->

## Prerequisites

+ Queries formulated using the [semantic query type](semantic-how-to-query-request.md). Required query parameters include queryType, queryLanguage, searchFields, and answers. 

All prerequisites that apply to semantic queries also apply to answers, including service tier and region.

## What is a semantic answer?

A semantic answer is an extraction of content from a matching document that serves as an answer to the query itself. Structurally, it's an element of a response that includes text and a key.

A semantic response includes new properties for scores, captions, and answers. A semantic response is built from the standard response, using the top 50 results returned by the [full text search engine](search-lucene-query-architecture.md), which are then re-ranked using the semantic ranker. If more than 50 are specified, the additional results are returned, but they won’t be semantically re-ranked.

As with all queries, a response is composed of all fields marked as retrievable, or just those fields listed in the select statement. It also includes an "answer" field and "captions".

+ For each semantic result, by default, there is one "answer", returned as a distinct field that you can choose to render in a search page. You can specify up to five. Formulation of answer is automated: reading through all the documents in the initial results, running extractive summarization, followed by machine reading comprehension, and finally promoting a direct answer to the user’s question in the answer field.

+ A "caption" is an extraction-based summarization of document content, returned in plain text or with highlights. Captions are included automatically and cannot be suppressed. Highlights are applied using machine reading comprehension to identify which strings should be emphasized. Highlights draw your attention to the most relevant passages, so that you can quickly scan a page of results to find the right document.

A semantically re-ranked result set orders results by the @search.rerankerScore value. If you add an OrderBy clause, an HTTP 400 error will be returned because that clause is not supported in a semantic query.

## Example


## Next steps

+ [Semantic search overview](semantic-search-overview.md)
+ [Similarity algorithm](index-ranking-similarity.md)
+ [Create a semantic query](semantic-how-to-query-request.md)
+ [Create a basic query](search-query-create.md)