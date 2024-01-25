---
title: Chunk documents in vector search
titleSuffix: Azure AI Search
description: Learn strategies for chunking PDFs, HTML files, and other large documents for vectors and search indexing and query workloads.

author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 10/30/2023
---

# Chunking large documents for vector search solutions in Azure AI Search

This article describes several approaches for chunking large documents so that you can generate embeddings for vector search. Chunking is only required if source documents are too large for the maximum input size imposed by models.

> [!NOTE]
> This article applies to the generally available version of [vector search](vector-search-overview.md), which assumes your application code calls an external library that performs data chunking. A new feature called [integrated vectorization](vector-search-integrated-vectorization.md), currently in preview, offers embedded data chunking. Integrated vectorization takes a dependency on indexers, skillsets, and the Text Split skill.

## Why is chunking important?

The models used to generate embedding vectors have maximum limits on the text fragments provided as input. For example, the maximum length of input text for the [Azure OpenAI](/azure/ai-services/openai/how-to/embeddings) embedding models is 8,191 tokens. Given that each token is around 4 characters of text for common OpenAI models, this maximum limit is equivalent to around 6000 words of text. If you're using these models to generate embeddings, it's critical that the input text stays under the limit. Partitioning your content into chunks ensures that your data can be processed by the Large Language Models (LLM) used for indexing and queries. 

### Common chunking techniques

Here are some common chunking techniques, starting with the most widely used method:

+ Fixed-size chunks: Define a fixed size that's sufficient for semantically meaningful paragraphs (for example, 200 words) and allows for some overlap (for example, 10-15% of the content) can produce good chunks as input for embedding vector generators.

+ Variable-sized chunks based on content: Partition your data based on content characteristics, such as end-of-sentence punctuation marks, end-of-line markers, or using features in the Natural Language Processing (NLP) libraries. Markdown language structure can also be used to split the data.

+ Customize or iterate over one of the above techniques. For example, when dealing with large documents, you might use variable-sized chunks, but also append the document title to chunks from the middle of the document to prevent context loss.

#### Content overlap considerations

When you chunk data, overlapping a small amount of text between chunks can help preserve context. We recommend starting with an overlap of approximately 10%. For example, given a fixed chunk size of 256 tokens, you would begin testing with an overlap of 25 tokens. The actual amount of overlap varies depending on the type of data and the specific use case, but we have found that 10-15% works for many scenarios.

#### Factors for chunking data

When it comes to chunking data, think about these factors:

+ Shape and density of your documents. If you need intact text or passages, larger chunks and variable chunking that preserves sentence structure can produce better results.

+ User queries: Larger chunks and overlapping strategies help preserve context and semantic richness for queries that target specific information.

+ Large Language Models (LLM) have performance guidelines for chunk size. you need to set a chunk size that works best for all of the models you're using. For instance, if you use models for summarization and embeddings, choose an optimal chunk size that works for both.

## How chunking fits into the workflow

If you have large documents, you must insert a chunking step into indexing and query workflows that breaks up large text. When using [integrated vectorization](./vector-search-integrated-vectorization.md), a default chunking strategy using the [text split skill](./cognitive-search-skill-textsplit.md) is applied. You can also apply a custom chunking strategy using a [custom skill](./cognitive-search-custom-skill-web-api.md). Some libraries that provide chunking include:

+ [LangChain](https://python.langchain.com/en/latest/index.html)
+ [Semantic Kernel](https://github.com/microsoft/semantic-kernel)

All these approaches support common chunking techniques for fixed size, variable size, or a combination. You can also specify an overlap that duplicates a small amount of content in each chunk for context preservation.

## Chunking examples

The following examples demonstrate how chunking strategies from the [text split skill](./cognitive-search-skill-textsplit.md), [LangChain](https://python.langchain.com/en/latest/index.html), [Semantic Kernel](https://github.com/microsoft/semantic-kernel), and a [custom skill](./cognitive-search-custom-skill-scale.md) are applied to the [Earth at Night NASA e-book](https://github.com/Azure-Samples/azure-search-sample-data/blob/main/nasa-e-book/earth_at_night_508.pdf).

### Text Split Skill

There following [parameters](https://learn.microsoft.com/azure/search/cognitive-search-skill-textsplit#skill-parameters) are used to customize text split chunking:

1. `textSplitMode`. There are 2 ways to break up content into smaller chunks:
  1. `pages`. Chunks are made up of multiple sentences.
  1. `sentences`. Chunks are made up of sentences.
  1. What constitutes a sentence is language dependent. For example, in English standard sentence ending punctuation such as `.` or `!` are used. The language the text splitter uses is controlled by the `defaultLanguageCode` parameter.

When `textSplitMode` is `pages`, the following additional parameters are available:
1. `maximumPageLength`. This parameter defines the maximum amount of characters <sup>1</sup> are in each chunk. The text splitter avoids breaking up sentences, so the actual amount of characters depends on the content.
1. `pageOverlapLength`. This parameter defines how many characters from the end of the previous page are included at the start of the next page. If set, this must be less than half the maximum page length.
1. `maximumPagesToTake`. This parameter defines how many pages / chunks to take from a document. The default value is 0 which means take all pages / chunks from the document.

<sup>1</sup> Characters do not align to the defintion of a [token](https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering#space-efficiency). The amount of tokens measured by the LLM may be different than the character size measured by the text split skill.

The following table shows how the choice of parameters affects the total chunk count from the Earth at Night e-book:

| `textSplitMode` | `maximumPageLength` | `pageOverlapLength` | Total Chunk Count |
|-----------------|-----------------|-----------------|-----------------|
| `pages` | 1000 | 0 | 172 |
| `pages` | 1000 | 200 | 216 |
| `pages` | 2000 | 0 | 85 |
| `pages` | 2000 | 500 | 113 |
| `pages` | 5000 | 0 | 34 |
| `pages` | 5000 | 500 | 38 |
| `sentences` | N/A | N/A | 13361 |

Using a `textSplitMode` of `pages` results in a majority of chunks having total character counts close to `maximumPageLength`. Chunk character count varies due to differences on where sentence boundaries fall inside the chunk. Chunk token length varies due to differences in the contents of the chunk.

The following histograms show how the distribution of chunk character length compares to chunk token length for [gpt-35-turbo](https://learn.microsoft.com/azure/ai-services/openai/how-to/chatgpt) when using a `textSplitMode` of `pages`, a `maximumPageLength` of 2000, and a `pageOverlapLength` of 500 on the Earth at Night e-book:

   :::image type="content" source="media/vector-search-how-to-chunk-documents/maximumpagelength-2000-pageoverlaplength-500-charaters.png" alt-text="Histogram of chunk character count for maximumPageLength 2000 and pageOverlapLength 500.":::

   :::image type="content" source="media/vector-search-how-to-chunk-documents/maximumpagelength-2000-pageoverlaplength-500-tokens.png" alt-text="Histogram of chunk token count for maximumPageLength 2000 and pageOverlapLength 500.":::

Using a `textSplitMode` of `sentences` results in a large number of chunks consisting of individual sentences. These chunks are significantly smaller than those produced by `pages`, and the token count of the chunks more closely matches the character counts.

The following histograms show how the distribution of chunk character length compares to chunk token length for [gpt-35-turbo](https://learn.microsoft.com/azure/ai-services/openai/how-to/chatgpt) when using a `textSplitMode` of `sentences` on the Earth at Night e-book:

   :::image type="content" source="media/vector-search-how-to-chunk-documents/sentences-characters.png" alt-text="Histogram of chunk character count for sentences.":::

   :::image type="content" source="media/vector-search-how-to-chunk-documents/sentences-tokens.png" alt-text="Histogram of chunk token count for sentences.":::

The optimal choice of parameters depends on how the chunks will be used. For most applications, it's recommended to start with the following default parameters:

| `textSplitMode` | `maximumPageLength` | `pageOverlapLength` |
|-----------------|-----------------|-----------------|
| `pages` | 2000 | 500 |

### LangChain

### Semantic Kernel

## Custom Skill

A [fixed-sized chunking and embedding generation sample](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/Vector/EmbeddingGenerator/README.md) demonstrates both chunking and vector embedding generation using [Azure OpenAI](/azure/ai-services/openai/) embedding models. This sample uses an [Azure AI Search custom skill](cognitive-search-custom-skill-web-api.md) in the [Power Skills repo](https://github.com/Azure-Samples/azure-search-power-skills/tree/main#readme) to wrap the chunking step.

This sample is built on LangChain, Azure OpenAI, and Azure AI Search.

## See also

+ [Understanding embeddings in Azure OpenAI Service](/azure/ai-services/openai/concepts/understand-embeddings)
+ [Learn how to generate embeddings](/azure/ai-services/openai/how-to/embeddings?tabs=console)
+ [Tutorial: Explore Azure OpenAI Service embeddings and document search](/azure/ai-services/openai/tutorials/embeddings?tabs=command-line)
