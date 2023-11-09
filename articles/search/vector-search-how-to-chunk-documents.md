---
title: Chunk documents in vector search
titleSuffix: Azure Cognitive Search
description: Learn strategies for chunking PDFs, HTML files, and other large documents for vectors and search indexing and query workloads.

author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/29/2023
---

# Chunking large documents for vector search solutions in Cognitive Search

> [!IMPORTANT]
> Vector search is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It's available through the Azure portal, preview REST API, and [beta client libraries](https://github.com/Azure/cognitive-search-vector-pr#readme).

This article describes several approaches for chunking large documents so that you can generate embeddings for vector search. Chunking is only required if source documents are too large for the maximum input size imposed by models.

## Why is chunking important?

The models used to generate embedding vectors have maximum limits on the text fragments provided as input. For example, the maximum length of input text for the [Azure OpenAI](/azure/ai-services/openai/how-to/embeddings) embedding models is 8,191 tokens. Given that each token is around 4 characters of text for common OpenAI models, this maximum limit is equivalent to around 6000 words of text. If you're using these models to generate embeddings, it's critical that the input text stays under the limit. Partitioning your content into chunks ensures that your data can be processed by the Large Language Models (LLM) used for indexing and queries. 

## How chunking fits into the workflow

Because there isn't a native chunking capability in either Cognitive Search or Azure OpenAI, if you have large documents, you must insert a chunking step into indexing and query workflows that breaks up large text. Some libraries that provide chunking include:

+ [LangChain](https://python.langchain.com/en/latest/index.html)
+ [Semantic Kernel](https://github.com/microsoft/semantic-kernel)

Both libraries support common chunking techniques for fixed size, variable size, or a combination. You can also specify an overlap percentage that duplicates a small amount of content in each chunk for context preservation.

### Common chunking techniques

Here are some common chunking techniques, starting with the most widely used method:

+ Fixed-size chunks: Define a fixed size that's sufficient for semantically meaningful paragraphs (for example, 200 words) and allows for some overlap (for example, 10-15% of the content) can produce good chunks as input for embedding vector generators.

+ Variable-sized chunks based on content: Partition your data based on content characteristics, such as end-of-sentence punctuation marks, end-of-line markers, or using features in the Natural Language Processing (NLP) libraries. Markdown language structure can also be used to split the data.

+ Customize or iterate over one of the above techniques. For example, when dealing with large documents, you might use variable-sized chunks, but also append the document title to chunks from the middle of the document to prevent context loss.

### Content overlap considerations

When you chunk data, overlapping a small amount of text between chunks can help preserve context. We recommend starting with an overlap of approximately 10%. For example, given a fixed chunk size of 256 tokens, you would begin testing with an overlap of 25 tokens. The actual amount of overlap varies depending on the type of data and the specific use case, but we have found that 10-15% works for many scenarios.

### Factors for chunking data

When it comes to chunking data, think about these factors:

+ Shape and density of your documents. If you need intact text or passages, larger chunks and variable chunking that preserves sentence structure can produce better results.

+ User queries: Larger chunks and overlapping strategies help preserve context and semantic richness for queries that target specific information.

+ Large Language Models (LLM) have performance guidelines for chunk size. you need to set a chunk size that works best for all of the models you're using. For instance, if you use models for summarization and embeddings, choose an optimal chunk size that works for both.

## Simple example of how to create chunks with sentences

This section uses an example to demonstrate the logic of creating chunks out of sentences. For this example, assume the following:

+ Tokens are equal to words.
+ Input = `text_to_chunk(string)`
+ Output = `sentences(list[string])`

### Sample input

`"Barcelona is a city in Spain. It is close to the sea and /n the mountains. /n You can both ski in winter and swim in summer."`

+ Sentence 1 contains 6 words: `"Barcelona is a city in Spain."`
+ Sentence 2 contains 9 words: `"It is close to the sea /n and the mountains. /n"`
+ Sentence 3 contains 10 words: `"You can both ski in winter and swim in summer."`

### Approach 1: Sentence chunking with "no overlap"

Given a maximum number of tokens, iterate through the sentences and concatenate sentences until the maximum token length is reached. If a sentence is bigger than the maximum number of chunks, truncate to a maximum number of tokens, and put the rest in the next chunk.

> [!NOTE]
> The examples ignore the newline `/n` character because it's not a token, but if the package or library detects new lines, then you'd see those line breaks here.

**Example: maximum tokens = 10**

```
Barcelona is a city in Spain.
It is close to the sea /n and the mountains. /n
You can both ski in winter and swim in summer.
```

**Example: maximum tokens = 16**

```
Barcelona is a city in Spain. It is close to the sea /n and the mountains. /n
You can both ski in winter and swim in summer.
```

**Example: maximum tokens = 6**

```
Barcelona is a city in Spain.
It is close to the sea /n
and the mountains. /n
You can both ski in winter
and swim in summer.
```

### Approach 2: Sentence chunking with "10% overlap"

Follow the same logic with no overlap approach, except that you create an overlap between chunks according to certain ratio.
A 10% overlap on maximum tokens of 10 is one token.

**Example: maximum tokens = 10**

```
Barcelona is a city in Spain.
Spain. It is close to the sea /n and the mountains. /n 
mountains. /n You can both ski in winter and swim in summer.
```

## Try it out: Chunking and vector embedding generation sample

A [fixed-sized chunking and embedding generation sample](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/Vector/EmbeddingGenerator/README.md) demonstrates both chunking and vector embedding generation using [Azure OpenAI](/azure/ai-services/openai/) embedding models. This sample uses a [Cognitive Search custom skill](cognitive-search-custom-skill-web-api.md) in the [Power Skills repo](https://github.com/Azure-Samples/azure-search-power-skills/tree/main#readme) to wrap the chunking step.

This sample is built on LangChain, Azure OpenAI, and Azure Cognitive Search.

## See also

+ [Understanding embeddings in Azure OpenAI Service](/azure/ai-services/openai/concepts/understand-embeddings)
+ [Learn how to generate embeddings](/azure/ai-services/openai/how-to/embeddings?tabs=console)
+ [Tutorial: Explore Azure OpenAI Service embeddings and document search](/azure/ai-services/openai/tutorials/embeddings?tabs=command-line)
