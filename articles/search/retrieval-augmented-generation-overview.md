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

This article describes several approaches for combining generative AI (specifically ChatGPT) with the storage and retrieval capabilities in Cognitive Search. If your objective is a chat-style of user interaction that draws from content you own and manage, you can build that solution using Cognitive Search, Large Language Models (LLM), and a web client for the frontend.


## What is RAG in Cognitive Search?

Retrieval Augmented Generation (RAG) is a pattern that works with pretrained LLMs and your own data to generate responses interactively. In Azure Cognitive Search, you can:

+ Retrieve information from a prepopulated search index that contains your content.
+ Augment the reponse using prompts, more information from you index, and LLMs like ChatGPT, davinci, or other generative AI models that can produce a coherent response.

The content is your enterprise data that's indexed and secured on Azure Cognitive Search. 

The experience is a web app designed around the capabilities of an LLM. If you want to start with the end in mind, the [entgptsearch.azurewebsites.net/](https://entgptsearch.azurewebsites.net/) sample app shows you a web front end that's been configured to a use prompt template for scoping the question-and-answer interaction over content. In this case, the content is a fictitious health plan.

> [!NOTE]
> New to LLM and RAG concepts? This [video clip](https://youtu.be/2meEvuWAyXs?t=404) from a Microsoft presentation offers a simple explanation.

## Patterns

RAG patterns in Cognitive Search have the following elements:

+ A search index containing your content. 
+ A query request that reads from the index.
+ Integration code that hands off the query response (search results) to an LLM.
+ Client code that provides the web frontend.

On Cognitive Search, you can use any search index, whetheer it's designed for full text search queries, or for vectors. Vectors provide a common mathmatical language for describing disparate content (multiple file formats and languages). Vectors also support similarity search, or finding vector documents in the index that are most similar to the vector query. Because vectors support similarity search, vector search is more nuanced than keyword search (or term search) that matches at the token level.

Cognitive Search doesn't provide LLM integration, web front ends, or vector encoding (embeddings) out of the box, so you'll need to write code that handles those parts of the solution. You can review the [https://aka.ms/entgptsearch](https://aka.ms/entgptsearch) demo for a blueprint of what a full solution entails.

## Workflow


:::image type="content" source="media/retrieval-augmented-generation-overview/architecture-diagram.png" alt-text="Architecture diagram of information retrieval with search and ChatGPT." border="true lightbox="media/retrieval-augmented-generation-overview/architecture-diagram.png":::

## How to get started

+ Use Azure AI Studio and "bring your own data" to experiment with prompts and an existing search index

+ Review this demo

+ Use this accelerator

<!-- Vanity URL for this article
https://aka.ms/what-is-rag -->

<!-- ## Why use RAG?

Traditionally, a base model is trained with point-in-time data to ensure its effectiveness in performing specific tasks and adapting to the desired domain. However, sometimes you need to work with newer or more current data. Two approaches can supplement the base model: fine-tuning or further training of the base model with new data, or RAG that uses prompt engineering to supplement or guide the model in real time. 

Fine-tuning is suitable for continuous domain adaptation, enabling significant improvements in model quality but often incurring higher costs. Conversely, RAG offers an alternative approach, allowing the use of the same model as a reasoning engine over new data provided in a prompt. This technique enables in-context learning without the need for expensive fine-tuning, empowering businesses to use LLMs more efficiently. 

RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs. By adopting RAG, companies can use the reasoning capabilities of LLMs, utilizing their existing models to process and generate responses based on new data. RAG facilitates periodic data updates without the need for fine-tuning, thereby streamlining the integration of LLMs into businesses. 

+ Provide supplemental data as a directive or a prompt to the LLM
+ Adds a fact checking component on your existing models
+ Train your model on up-to-date data without incurring the extra time and costs associated with fine-tuning
+ Train on your business specific data -->