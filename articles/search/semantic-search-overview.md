---
title: Semantic search
titleSuffix: Azure Cognitive Search
description: Learn how Cognitive Search is using deep learning semantic search models from Bing to make search results more intuitive.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/21/2021
ms.custom: references_regions
---
# Semantic search in Azure Cognitive Search

> [!IMPORTANT]
> Semantic search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and beta SDKs. These features are billable. For more information about, see [Availability and pricing](semantic-search-overview.md#availability-and-pricing).

Semantic search is a collection of query-related capabilities that bring semantic relevance and language understanding to search results. This article is a high-level introduction to semantic search all-up, with descriptions of each feature and how they work collectively. The embedded video describes the technology, and the section at the end covers availability and pricing.

Semantic search is a premium feature. We recommend this article for background, but if you'd rather get started, follow these steps:

> [!div class="checklist"]
> * [Check regional and service tier requirements](#availability-and-pricing).
> * [Sign up for the preview program](https://aka.ms/SemanticSearchPreviewSignup). It can take up to two business days to process the request.
> * Upon acceptance, create or modify queries to [return semantic captions and highlights](semantic-how-to-query-request.md).
> * Add a few more query properties to also return [semantic answers](semantic-answers.md).
> * Optionally, invoke [spell check](speller-how-to-add.md) to maximize precision and recall.

## What is semantic search?

Semantic search is collection of features that improve the quality of search results. When enabled on your search service, it extends the query execution pipeline in two ways. First, it adds secondary ranking over an initial result set, promoting the most semantically relevant results to the top of the list. Second, it extracts and returns captions and answers in the response, which you can render on a search page to improve the user's search experience.

## How semantic ranking works

*Semantic ranking* looks for context and relatedness among terms, elevating matches that make more sense given the query. Language understanding finds summarizations or *captions* and *answers* within your content and includes them in the response, which can then be rendered on a search results page for a more productive search experience.

State-of-the-art pretrained models are used for summarization and ranking. To maintain the fast performance that users expect from search, semantic summarization and ranking are applied to just the top 50 results, as scored by the [default similarity scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms). Using those results as the document corpus, semantic ranking re-scores those results based on the semantic strength of the match.

The underlying technology is from Bing and Microsoft Research, and integrated into the Cognitive Search infrastructure as an add-on feature. For more information about the research and AI investments backing semantic search, see [How AI from Bing is powering Azure Cognitive Search (Microsoft Research Blog)](https://www.microsoft.com/research/blog/the-science-behind-semantic-search-how-ai-from-bing-is-powering-azure-cognitive-search/).

The following video provides an overview of the capabilities.

> [!VIDEO https://www.youtube.com/embed/yOf0WfVd_V0]

## Features in semantic search

Semantic search improves precision and recall through these new capabilities:

| Feature | Description |
|---------|-------------|
| [Spell check](speller-how-to-add.md) | Corrects typos before the query terms reach the search engine. |
| [Semantic ranking](semantic-ranking.md) | Uses the context or semantic meaning to compute a new relevance score. |
| [Semantic captions and highlights](semantic-how-to-query-request.md) | Sentences and phrases from a document that best summarize the content, with highlights over key passages for easy scanning. Captions that summarize a result are useful when individual content fields are too dense for the results page. Highlighted text elevates the most relevant terms and phrases so that users can quickly determine why a match was considered relevant. |
| [Semantic answers](semantic-answers.md) | An optional and additional substructure returned from a semantic query. It provides a direct answer to a query that looks like a question. |

### Order of operations

Components of semantic search extend the existing query execution pipeline in both directions. If you enable spelling correction, the [speller](speller-how-to-add.md) corrects typos at query onset, before terms reach the search engine.

:::image type="content" source="media/semantic-search-overview/semantic-workflow.png" alt-text="Semantic components in query execution" border="true":::

Query execution proceeds as usual, with term parsing, analysis, and scans over the inverted indexes. The engine retrieves documents using token matching, and scores the results using the [default similarity scoring algorithm](index-similarity-and-scoring.md#similarity-ranking-algorithms). Scores are calculated based on the degree of linguistic similarity between query terms and matching terms in the index. If you defined them, scoring profiles are also applied at this stage. Results are then passed to the semantic search subsystem.

In the preparation step, the document corpus returned from the initial result set is analyzed at the sentence and paragraph level to find passages that summarize each document. In contrast with keyword search, this step uses machine reading and comprehension to evaluate the content. Through this stage of content processing, a semantic query returns [captions](semantic-how-to-query-request.md) and [answers](semantic-answers.md). To formulate them, semantic search uses language representation to extract and highlight key passages that best summarize a result. If the search query is a question - and answers are requested - the response will also include a text passage that best answers the question, as expressed by the search query. 

For both captions and answers, existing text is used in the formulation. The semantic models do not compose new sentences or phrases from the available content, nor does it apply logic to arrive at new conclusions. In short, the system will never return content that doesn't already exist.

Results are then re-scored based on the [conceptual similarity](semantic-ranking.md) of query terms.

To use semantic capabilities in queries, you'll need to make small modifications to the [search request](semantic-how-to-query-request.md), but no extra configuration or reindexing is required.

## Semantic capabilities and limitations

Semantic search is a newer technology so it's important to set expectations about what it can and cannot do. It improves the quality of search results in two ways:

* First, it promotes matches that are semantically closer to the intent of original query.

* Second, it makes results easier to use when captions, and potentially answers, are present on the page.

Semantic search is not beneficial in every scenario, and before you move forward, make sure that you have content that can utilize its capabilities. The language models in semantic search work best on searchable content that is information-rich and structured as prose. For example, when evaluating your content for answers, the models scan for and extract a verbatim string that looks like an answer, but won't compose new strings as answers to a query, or as captions for a matching document. To answer the question  "what car has the best gas mileage", an index should have phrases like "Hybrid cars offer the best gas mileage of any cars on the market".

Semantic search cannot correlate or infer information from different pieces of content within the document or corpus of documents. For example, given a query for "resort hotels in a desert" absent any geographical input, the engine won't produce matches for hotels located in Arizona or Nevada, even though both states have deserts. Similarly, if the query includes the clause "in the last 5 years", the engine won't calculate a time interval based on the current date to return. In Cognitive Search, mechanisms that might be helpful for the above scenarios include [synonym maps](search-synonyms.md) that allow you to build associations among terms that are outwardly different, or [date filters](search-query-odata-filter.md) specified as an OData expression.

## Availability and pricing

Semantic search is available through [sign-up registration](https://aka.ms/SemanticSearchPreviewSignup). There is one sign-up for both semantic search and spell check.

| Feature | Tier | Region | Sign up | Pricing |
|---------|------|--------|---------------------|-------------------|
| Semantic search (captions, highlights, answers) | Standard tier (S1, S2, S3) | North Central US, West US, West US 2, East US 2, North Europe, West Europe | Required | [Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/)  |
| Spell check | Any | North Central US, West US, West US 2, East US 2, North Europe, West Europe | Required | None (free) |

You can use spell check without semantic search, free of charge. Charges for semantic search are levied when query requests include `queryType=semantic` and the search string is not empty (for example, `search=pet friendly hotels in new york`. Empty search (queries where `search=*`) are not charged, even if queryType is set to `semantic`.

If you do not want semantic search capability on your search service, you can [disable semantic search](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#searchsemanticsearch) to prevent accidental usage and charges.

## Next steps

[Sign-up](https://aka.ms/SemanticSearchPreviewSignup) for the preview on a search service that meets the tier and regional requirements noted in the previous section.

It can take up to two business days to process the request. Once your service is ready, [create a semantic query](semantic-how-to-query-request.md) to evaluate its performance on your content.
