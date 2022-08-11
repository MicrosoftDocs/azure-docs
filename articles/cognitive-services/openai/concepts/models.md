---
title: Azure OpenAI Models
titleSuffix: Azure OpenAI
description: Learn about the different AI models that are available. 
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 06/24/2022
ms.custom: event-tier1-build-2022
manager: nitinme
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
keywords: 
---

# Azure OpenAI Models

The service provides access to many different models. Models describe a family of models and are broken out as follows:

|Modes | Description|
|--|--|
| GPT-3 series | A set of GPT-3 models that can understand and generate natural language |
| Codex Series | A set of models that can understand and generate code, including translating natural language to code |
| Embeddings Series | An embedding is a special format of data representation that can be easily utilized by machine learning models and algorithms. The embedding is an information dense representation of the semantic meaning of a piece of text. Currently we offer three families of embedding models for different functionalities: text search, text similarity and code search |

## Naming convention

Azure OpenAI's models follow a standard naming convention: `{task}-{model name}-{version #}`. For example, our most powerful natural language model is called `text-davinci-001` and a codex series model would look like `code-cushman-001`.

> Older versions of the GPT-3 models are available as `ada`, `babbage`, `curie`, `davinci` and do not follow these conventions. These models are primarily intended to be used for fine-tuning and search.

## Finding what models are available

You can easily see the models you have available for both inference and fine-tuning in your resource by using the [Models API](../reference.md#models).


## GPT-3 Series

The GPT-3 models can understand and generate natural language. The service offers four model types with different levels of power suitable for different tasks. Davinci is the most capable model, and Ada is the fastest. Going forward these models are named with the following convention: `text-{model name}-XXX` where `XXX` refers to a numerical value for different versions of the model. Currently the latest versions are:

- text-ada-001
- text-babbage-001
- text-curie-001
- text-davinci-001

While Davinci is the most capable, the other models provide significant speed advantages. Our recommendation is for users to start with Davinci while experimenting since it will produce the best results and validate the value our service can provide. Once you have a prototype working, you can then optimize your model choice with the best latency - performance tradeoff for your application.

### Davinci

Davinci is the most capable model and can perform any task the other models can perform and often with less instruction. For applications requiring deep understanding of the content, like summarization for a specific audience and creative content generation, Davinci is going to produce the best results. These increased capabilities require more compute resources, so Davinci costs more and isn't as fast as the other models.

Another area where Davinci excels is in understanding the intent of text. Davinci is excellent at solving many kinds of logic problems and explaining the motives of characters. Davinci has been able to solve some of the most challenging AI problems involving cause and effect.

**Use for**: Complex intent, cause and effect, summarization for audience

### Curie

Curie is extremely powerful, yet very fast. While Davinci is stronger when it comes to analyzing complicated text, Curie is quite capable for many nuanced tasks like sentiment classification and summarization. Curie is also good at answering questions and performing Q&A and as a general service chatbot.

**Use for**: Language translation, complex classification, text sentiment, summarization

### Babbage

Babbage can perform straightforward tasks like simple classification. It’s also quite capable when it comes to Semantic Search ranking how well documents match up with search queries.

**Use for**: Moderate classification, semantic search classification

### Ada

Ada is usually the fastest model and can perform tasks like parsing text, address correction and certain kinds of classification tasks that don’t require too much nuance. Ada’s performance can often be improved by providing more context.

**Use For** Parsing text, simple classification, address correction, keywords

> [!NOTE]
> Any task performed by a faster model like Ada can be performed by a more powerful model like Curie or Davinci.

## Codex Series

The Codex models are descendants of our base GPT-3 models that can understand and generate code. Their training data contains both natural language and billions of lines of public code from GitHub.

They’re most capable in Python and proficient in over a dozen languages including JavaScript, Go, Perl, PHP, Ruby, Swift, TypeScript, SQL, and even Shell.

Currently we only offer one codex model: `code-cushman-001`.

## Embeddings Models

Currently we offer three families of embedding models for different functionalities: text search, text similarity and code search. Each family includes up to four models across a spectrum of capabilities:

Ada (1024 dimensions),
Babbage (2048 dimensions),
Curie (4096 dimensions),
Davinci (12,288 dimensions).
Davinci is the most capable, but is slower and more expensive than the other models. Ada is the least capable, but is significantly faster and cheaper.

These embedding models are specifically created to be good at a particular task.

### Similarity embeddings

These models are good at capturing semantic similarity between two or more pieces of text.

| USE CASES | AVAILABLE MODELS |
|---|---|
| Clustering, regression, anomaly detection, visualization |Text-similarity-ada-001, <br> text-similarity-babbage-001, <br> text-similarity-curie-001, <br> text-similarity-davinci-001 <br>|

### Text search embeddings

These models help measure whether long documents are relevant to a short search query. There are two types: one for embedding the documents to be retrieved, and one for embedding the search query.

| USE CASES | AVAILABLE MODELS |
|---|---|
| Search, context relevance, information retrieval | text-search-ada-doc-001, <br> text-search-ada-query-001 <br> text-search-babbage-doc-001, <br> text-search-babbage-query-001, <br> text-search-curie-doc-001, <br> text-search-curie-query-001, <br> text-search-davinci-doc-001, <br> text-search-davinci-query-001 <br> |

### Code search embeddings

Similarly to search embeddings, there are two types: one for embedding code snippets to be retrieved and one for embedding natural language search queries.

| USE CASES | AVAILABLE MODELS |
|---|---|
| Code search and relevance | code-search-ada-code-001, <br> code-search-ada-text-001, <br> code-search-babbage-code-001, <br> code-search-babbage-text-001 |

When using our embedding models, please keep in mind their limitations and risks.

## Finding the right model

We recommend starting with our Davinci model since it will be the best way to understand what the service is capable of. After you have an idea of what you want to accomplish, you can either stay with Davinci if you’re not concerned about cost and speed or move onto Curie or another model and try to optimize around its capabilities.

## Next steps

[Learn more about Azure OpenAI](../overview.md).