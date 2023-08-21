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

Retrieval Augmentation Generation (RAG) is an architecture that augments the capabilities of a Large Language Model (LLM) like ChatGPT with an information retrieval system that provides the data. Adding an information retrieval system gives you full control over the data used by an LLM. For an enterprise solution, RAG means that you can constrain natural language processing to *your enterprise content* sourced from documents, images, audio, and video.

The decision about which information retrieval system to use is critical because it determines the inputs to the LLM. The information retrieval system should provide:

+ Indexing strategies for loading and refreshing the corpus, at scale, for all of your content, at the frequency you require.

+ Query capabilities and relevance tuning. The system should return *relevant* results, in the short-form formats necessary for meeting the token length requirements of LLM inputs.

+ Security, global reach, and reliability for both data and operations.

Azure Cognitive Search is a [proven solution](https://github.com/Azure-Samples/azure-search-openai-demo) for a RAG architecture because it provides indexing and query capabilities, with the infrastructure and security of the Azure cloud. Through code and other components, you can design a comprehensive RAG solution that includes all of the elements for generative AI over your proprietary content.

<!-- Is there a way to work in a link to the meta blog post?  It's a good article.  Maybe something like:  [From its initial conception](https://ai.meta.com/blog/retrieval-augmented-generation-streamlining-the-creation-of-intelligent-natural-language-processing-models/) to the many implementations that have followed, RAG has helped developers overcome the challenges of fine-tuning an LLM for specialized tasks by providing an alternative pattern that supplements, or replaces, the domain knowledge that a general purpose LLM draws from. -->

> [!NOTE]
> New to LLM and RAG concepts? This [video clip](https://youtu.be/2meEvuWAyXs?t=404) from a Microsoft presentation offers a simple explanation.

## RAG pattern for Cognitive Search

RAG patterns that include Cognitive Search have the elements indicated in the following illustration.

:::image type="content" source="media/retrieval-augmented-generation-overview/architecture-diagram.png" alt-text="Architecture diagram of information retrieval with search and ChatGPT." border="true" lightbox="media/retrieval-augmented-generation-overview/architecture-diagram.png":::

+ App UX (web app) for the user experience
+ App server or orchestrator (integration and coordination layer)
+ Azure Cognitive Search (information retrieval system)
+ Azure OpenAI (LLM for generative AI)

The web app sets the user experience, providing the presentation, context, and user interaction. Questions or prompts from a user start here. Inputs pass through the integration layer, going first to information retrieval to get the payload, but also go to the LLM for context and intent. 

The app server or orchestrator is the integration code that coordinates the handoffs between information retrieval and the LLM. One option is to use LangChain to coordinate the workflow. LangChain provides an integration module that makes your chain sequence Cognitive-Search-aware.

The information retrieval system provides the searchable index, query logic, and the payload (query response). The query is executed using the existing search engine in Cognitive Search, which can handle keyword (or term) and vector queries. The index is created in advance, based on a schema you define, and loaded with your content that's sourced from files, databases, or storage.

The LLM receives the original prompt, plus the results from Cognitive Search. The LLM analyzes the results and formulates a response. If the LLM is ChatGPT, the user interaction might be a back and forth conversation. If you're using Davinci, the prompt might be a fully composed answer. An Azure solution most likely uses Azure OpenAI, but there's no hard dependency on this specific service.

Cognitive Search doesn't provide LLM integration, web front ends, or vector encoding (embeddings) out of the box, so you need to write code that handles those parts of the solution. You can review demo source ([Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo)) for a blueprint of what a full solution entails.

> [!TIP]
> If you want to start with the end in mind, the ["Chat with your data"](https://entgptsearch.azurewebsites.net/) sample app shows you a web front end that's been configured to a use prompt template for scoping the question-and-answer interaction over a fictitious health plan.

## Searchable content in Cognitive Search

In Cognitive Search, all searchable content is stored in a search index that's hosted on your search service in the cloud. A search index is designed for fast queries with millisecond response times, so its internal data structures exist to support that objective. To that end, a search index stores indexed content, and not whole content files like entire PDFs or images. Internally, the data structures include inverted indexes of tokenized text, vector indexes for embeddings, and unaltered text for cases where verbatim matching is required (for example, in filters, fuzzy search, regular expression queries).

When you set up the data for your RAG solution, you use the features that create and load an index in Cognitive Search. An index includes fields that transfer or represent your source content. An index field might be simple transference (a title or description in a source document becomes a title or description field in a search index), or a field might contain the output of an external process, such as vectorization or skill processing that generates a text description of an image.

One way to approach indexing is through a content-first approach. The following table identifies which indexing features are useful for each content type. 

| Content type | Indexed as | Features |
|--------------|------------|----------|
| text | tokens, unaltered text | Indexers can pull content from other Azure resources. You can also push content to an index. To modify text in flight, use analyzers and normalizers to add lexical processing during indexing. Synonym maps are useful if source documents are missing terminology that might be used in a query. |
| text | vectors <sup>1</sup> | Text can be vectorized externally and then [indexed as vector fields](vector-search-how-to-create-index.md) in your index. |
| image | tokens, unaltered text <sup>2</sup> | Skills for OCR and Image Analysis process images for text recognition or image characteristics. Image information is converted to searchable text and added to the index. Skills have an indexer requirement. |
| image | vectors <sup>1</sup> | Images can be vectorized externally and then [indexed as vector fields](vector-search-how-to-create-index.md) in your index. |
| video | vectors <sup>1</sup> | Video files can be vectorized externally and then [indexed as vector fields](vector-search-how-to-create-index.md) in your index. |
| audio | vectors <sup>1</sup> | Audio files can be vectorized externally and then [indexed as vector fields](vector-search-how-to-create-index.md) in your index. |

 <sup>1</sup> [Vector support](vector-search-overview.md) is in public preview. It currently requires that you call other libraries or models for data chunking and vectorization. See [this repo](https://github.com/Azure/cognitive-search-vector-pr) for samples that call Azure OpenAI embedding models to vectorize content and queries, and that demonstrate data chunking.

<sup>2</sup> [Skills](cognitive-search-working-with-skillsets.md) are built-in support for [AI enrichment](cognitive-search-concept-intro.md). For OCR and Image Analysis, the indexing pipeline makes an internal call to the Azure AI Vision APIs. These skills pass an extracted image to Azure AI for processing, and receive the output as text that's indexed by Cognitive Search.

Vectors provide the best accommodation for dissimilar content (multiple file formats and languages) because content is expressed universally as mathematic representations. Vectors also support similarity search: matching on the coordinates that are most similar to the vector query. Compared to keyword search (or term search) that matches at the token level, similarity search is more nuanced. It's a better choice if there's ambiguity or interpretation requirements in the content or in queries.

## Query layer

Once your data is in a search index, you use the query capabilities of Cognitive Search to return results. In a non-RAG pattern, the results are returned to a client application, and the results would consist exclusively of the verbatim content in the index. In a RAG pattern, the results are forwarded, through the integration layer, to an LLM. Depending on the LLM, the response is generated by AI models and then passed back to the client.

There's no query type in Cognitive Search - not even semantic search or vector search - that composes new answers. Only the LLM provides generative AI. Here are the capabilities in Cognitive Search that are used in a query response:

+ Term or keyword search: simple syntax, full lucene
+ Filters and facets over text or numeric (non-vector) fields
+ Semantic search: re-ranks a BM25 result set using semantic models, but also produces short-form captions and answers that are useful as LLM inputs.
+ Vector search, where the query string is one or more vectors
+ Hybrid search, combination of any or all of the above. Vector and non-vector queries execute in parallel and returned in a unified result sets.

### Structure the query response

A query's response provides the input to the LLM, so the quality of your search results is critical to success.

composition or structure of the results (retrievable fields, rows, filters)
  select for fields
  rows is either what matches, up to $top or k-matches if vector search
content (fields, captions, maybe answers)

### Improve relevance

When you're working with complex processes, a large amount of data, and expectations for millisecond responses, you'll need to ensure that each step adds value and improves the quality of the end result. On the information retrieval side, *relevance tuning* is an activity that improves the quality of the results sent to the LLM.

Relevance applies to keyword (non-vector) search and to hybrid queries (over the non-vector fields). In Cognitive Search, there's no relevance tuning for similarity search and vector queries. 

Approaches to relevance tuning include:

+ Scoring profiles that boost the search score if matches are found in a specific search field or on other criteria
+ Semantic ranking that re-ranks a BM25 results set, using semantic models from Bing to reorder results for a better semantic fit to the original query.

## Integration code and LLMs

Choose an LLM:

+ ChatGPT for a context-building conversation

+ Davinci for analysis

sends search results as prompts

prompt engineering, prompt template -- how does it fit in

parametric and non-parametric (how important is it, and do we need to talk about it? if yes, how, and in what section.  I don't think it goes in this section, but I also don't know.)

## How to get started

+ Use Azure AI Studio and "bring your own data" to experiment with prompts and an existing search index. This step helps you decide what model to use, and whether your existing index needs modification.

+ Review this demo to see a RAG solution in action, and to study the code that builds the experience.

+ Review indexing strategies to determine how you want to ingest and refresh data. Decide whether to use vector search, keyword search, or hybrid search. The kind of content you need to search over, and the type of queries you want to run, will determine index design.

+ Review query and relevance.

+ Use this accelerator to create your own RAG solution.

> [!NOTE]
> Some Cognitive Search features are intended for human interaction and aren't useful in a RAG pattern. Specfically, you can skip autocomplete and suggestions. Other features like facets and orderby might be useful, but would be uncommon in a RAG scenario.

<!-- Vanity URL for this article
https://aka.ms/what-is-rag -->

<!-- ## Why use RAG?  FROM AML DOCS

Traditionally, a base model is trained with point-in-time data to ensure its effectiveness in performing specific tasks and adapting to the desired domain. However, sometimes you need to work with newer or more current data. Two approaches can supplement the base model: fine-tuning or further training of the base model with new data, or RAG that uses prompt engineering to supplement or guide the model in real time. 

Fine-tuning is suitable for continuous domain adaptation, enabling significant improvements in model quality but often incurring higher costs. Conversely, RAG offers an alternative approach, allowing the use of the same model as a reasoning engine over new data provided in a prompt. This technique enables in-context learning without the need for expensive fine-tuning, empowering businesses to use LLMs more efficiently. 

RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs. By adopting RAG, companies can use the reasoning capabilities of LLMs, utilizing their existing models to process and generate responses based on new data. RAG facilitates periodic data updates without the need for fine-tuning, thereby streamlining the integration of LLMs into businesses. 

+ Provide supplemental data as a directive or a prompt to the LLM
+ Adds a fact checking component on your existing models
+ Train your model on up-to-date data without incurring the extra time and costs associated with fine-tuning
+ Train on your business specific data -->