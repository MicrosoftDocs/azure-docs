---
title: RAG and generative AI
titleSuffix: Azure Cognitive Search
description: Learn how generative AI and retrieval augmented generation (RAG) patterns are used in Cognitive Search solutions.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/18/2023
---

# Retrieval Augmented Generation (RAG) in Azure Cognitive Search

Retrieval Augmentation Generation (RAG) is an architecture that augments the capabilities of a Large Language Model (LLM) like ChatGPT with an information retrieval system that provides the data. The addition of an information retrieval system gives you full control over what data is used by the LLM. For an enterprise solution, it means that you can deploy natural language processing that finds, analyzes, summarizes, describes, and translates your enterprise content obtained from documents, images, audio, and video.

The decision about which information retrieval system to use is critical because it determines the inputs to the LLM.

The information retrieval system should provide:

+ Indexing strategies for loading and refreshing the corpus, at volume, for all of your content, at the frequency you require.

+ Query capabilities and relevance tuning. Can the system return relevant results, in the short-form formats that meet the requirements of LLM inputs on token length.

+ Security, global reach, and reliability for both data and operations.

Azure Cognitive Search is a [proven solution](DEMO-GH-REPO) for a RAG architecture because it provides indexing and query capabilities, with the infrastructure and security of the Azure cloud.

<!-- [From its initial conception](META-LINK) to the many implementations that have followed, RAG has helped developers overcome the challenges of fine-tuning an LLM for specialized tasks by providing an alternative pattern that supplements, or replaces, the domain knowledge that a general purpose LLM draws from. -->

> [!NOTE]
> New to LLM and RAG concepts? This [video clip](https://youtu.be/2meEvuWAyXs?t=404) from a Microsoft presentation offers a simple explanation.

## RAG architecture

RAG patterns that include Cognitive Search have the elements indicated in the following illustration.

:::image type="content" source="media/retrieval-augmented-generation-overview/architecture-diagram.png" alt-text="Architecture diagram of information retrieval with search and ChatGPT." border="true lightbox="media/retrieval-augmented-generation-overview/architecture-diagram.png":::

+ App UX (web app)
+ App server or orchestrator (integration and coordination layer)
+ Azure Cognitive Search (information retrieval system)
+ Azure OpenAI (LLM for generative AI)

The web app sets the user experience, providing the presentation, context, and user interaction. Questions or prompts from a user start here. The input goes first to information retrieval, but it's also passed on to the LLM for context and intent. If you want to start with the end in mind, the [entgptsearch.azurewebsites.net/](https://entgptsearch.azurewebsites.net/) sample app shows you a web front end that's been configured to a use prompt template for scoping the question-and-answer interaction over content. In this case, the content is a fictitious health plan.

The app server or orchestrator is the integration code that coordinates the handoffs between information retrieval and the LLM. One option is to use LangChain to coordinate the workflow.

The information retrieval system provides the searchable index and query logic. The query is executed using the existing search engine in Cognitive Search, which can handle keyword (or term) and vector queries. The index is created in advance, based on a schema you define, and loaded with content that you provide.

The LLM receives the original prompt and the results from Cognitive Search. The LLM analyzes the results and formulates a response. If the LLM is ChatGPT, the user interaction might be a take-turn conversation. If you're using Davinci, the prompt might be a fully composed answer. An Azure solution most likely uses Azure OpenAI, but there's no hard dependency on this specific service.

Cognitive Search doesn't provide LLM integration, web front ends, or vector encoding (embeddings) out of the box, so you need to write code that handles those parts of the solution. You can review the [https://aka.ms/entgptsearch](https://aka.ms/entgptsearch) demo for a blueprint of what a full solution entails.

> [!NOTE]
> Some Cognitive Search features are intended for a human interaction and aren't useful in a RAG pattern. Specfically, you can avoid autocomplete and suggestions. Other features like facets and orderby might be useful, but would be uncommon in a RAG scenario.

## Searchable content in Cognitive Search

In Cognitive Search, all searchable content is stored in a search index that's hosted on your search service in the cloud. A search index is designed for fast queries with millisecond response times, so its internal data structures exist to support that objective. To that end, a search index stores indexed content, and not whole content files like entire PDFs or images. Internally, the data structures include inverted indexes of tokenized text, vector indexes for embeddings, and unaltered text for cases where verbatim matching is required (for example, in filters, fuzzy search, regular expression queries).

When you set up the data for your RAG solution, you use the features that create and load an index in Cognitive Search. An index includes fields that replicate or represent your source content. An index field might be simple transference (a title or description in a source document becomes a title or description field in a search index), or a field might contain the output of an external process, such as vectorization and skills processing that generates a text description of an image.

The following table identifies which indexing features are useful for each content type.

| Content type | Indexed as | Features |
|--------------|------------|----------|
| text | tokens, unaltered text | Indexers (automates several steps). Push model. Analyzers. Synonyms. |
| text | vectors <sup>1</sup> | Text can be vectorized externally and then indexed as vectors. Use the built-in support for indexing vector data, through fields that are defined for that purpose.
| image | tokens, unaltered text <sup>2</sup> | Skills for OCR and Image Analysis process images for text recognition or image characteristics. Image information is converted to searchable text and added to the index.  |
| image | vectors <sup>1</sup> | Images can be vectorized. Use the built-in support for indexing vector data, through fields that are defined for that purpose. |
| video | vectors <sup>1</sup> | Video files can be vectorized externally and then indexed as vectors. Use the built-in support for indexing vector data, through fields that are defined for that purpose. |
| audio | vectors <sup>1</sup> | Audio files can be vectorized externally and then indexed as vectors. Use the built-in support for indexing vector data, through fields that are defined for that purpose. |

 <sup>1</sup> Vector support is in public preview. It currently requires that you call other libraries or models for data chunking and vectorization. See this repo for samples that call Azure OpenAI embedding models to vectorize content and queries, and that demonstrate data chunking.

<sup>2</sup> Skills are built-in support for AI enrichment. For OCR and Image Analysis, the indexing pipeline makes an internal call to the Azure AI Vision APIs. These skills pass an extracted image to Azure AI for processing, and receive the output as text that's indexed by Cognitive Search.

Vectors provide the best accommodation for dissimilar content (multiple file formats and languages) because content is expressed universally as mathematic representations. Vectors also support similarity search: matching on what is most similar to the vector query. Compared to keyword search (or term search) that matches at the token level, similarity search is more nuanced. It's a better choice if there's ambiguity or interpretation requirements in the content or in queries.

## Query layer

Once your data is in a search index, you use the query capabilities of Cognitive Search to return results. In a non-RAG pattern, the results are returned to a client application, and the results would consist exclusively of the verbatim content in the index. In a RAG pattern, the results are forwarded, through the integration layer, to an LLM. Depending on the LLM, the response is generated by AI models and then passed back to the client.

There's no query type in Cognitive Search - not even semantic search or vector search - that composes new answers. Only the LLM provides generative AI. Here are the capabilities in Cognitive Search that are used in a query response:

+ Term or keyword search: simple syntax, full lucene
+ Filters and facets over text or numeric (non-vector) fields
+ Semantic search: re-ranks a BM25 result set using semantic models, but also produces short-form captions and answers that are useful as LLM inputs.
+ Vector search, where the query string is one or more vectors
+ Hybrid search, combination of any or all of the above. Vector and non-vector queries execute in parallel and returned in a unified result sets.

### Control the query response

A query's response provides the input to the LLM, so the quality of your search results is critical to success.

composition or structure of the results (retrievable fields, rows, filters)
  select for fields
  rows is either what matches, up to $top or k-matches if vector search
content (fields, captions, maybe answers)
relevance tuning and ranking (what content gets included)
   scoring profiles, semantic ranking

## LLM

ChatGPT for a context-building conversation

Davinci for analysis

## Integration code

sends search results

parametric and non-parametric

prompt engineering, prompt template

## How to get started

+ Use Azure AI Studio and "bring your own data" to experiment with prompts and an existing search index

+ Review this demo

+ Use this accelerator

<!-- Vanity URL for this article
https://aka.ms/what-is-rag -->

<!-- ## Why use RAG?  FROM AML

Traditionally, a base model is trained with point-in-time data to ensure its effectiveness in performing specific tasks and adapting to the desired domain. However, sometimes you need to work with newer or more current data. Two approaches can supplement the base model: fine-tuning or further training of the base model with new data, or RAG that uses prompt engineering to supplement or guide the model in real time. 

Fine-tuning is suitable for continuous domain adaptation, enabling significant improvements in model quality but often incurring higher costs. Conversely, RAG offers an alternative approach, allowing the use of the same model as a reasoning engine over new data provided in a prompt. This technique enables in-context learning without the need for expensive fine-tuning, empowering businesses to use LLMs more efficiently. 

RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs. By adopting RAG, companies can use the reasoning capabilities of LLMs, utilizing their existing models to process and generate responses based on new data. RAG facilitates periodic data updates without the need for fine-tuning, thereby streamlining the integration of LLMs into businesses. 

+ Provide supplemental data as a directive or a prompt to the LLM
+ Adds a fact checking component on your existing models
+ Train your model on up-to-date data without incurring the extra time and costs associated with fine-tuning
+ Train on your business specific data -->