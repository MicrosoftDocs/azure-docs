---
title: Azure OpenAI Service getting started with customizing a large language model (LLM)
titleSuffix: Azure OpenAI Service
description: Learn more about the concepts behind customizing an LLM with Azure OpenAI.
ms.topic: conceptual
ms.date: 03/26/2024
ms.service: azure-ai-openai
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
---

# Getting started with customizing a large language model (LLM)

There are several techniques for adapting a pre-trained language model to suit a specific task or domain. These include prompt engineering, RAG (Retrieval Augmented Generation), and fine-tuning. These three techniques are not mutually exclusive but are complementary methods that in combination can be applicable to a specific use case. In this article, we'll explore these techniques, illustrative use cases, things to consider, and provide links to resources to learn more and get started with each.

## Prompt engineering

### Definition

[Prompt engineering](./prompt-engineering.md) is a technique that is both art and science, which involves designing prompts for generative AI models. This process utilizes in-context learning ([zero shot and few shot](./prompt-engineering.md#examples)) and, with iteration, improves accuracy and relevancy in responses, optimizing the performance of the model.

### Illustrative use cases

A Marketing Manager at an environmentally conscious company can use prompt engineering to help guide the model to generate descriptions that are more aligned with their brand’s tone and style. For instance, they can add a prompt like "Write a product description for a new line of eco-friendly cleaning products that emphasizes quality, effectiveness, and highlights the use of environmentally friendly ingredients" to the input. This will help the model generate descriptions that are aligned with their brand’s values and messaging.

### Things to consider

- **Prompt engineering** is the starting point for generating desired output from generative AI models.

- **Craft clear instructions**: Instructions are commonly used in prompts and guide the model's behavior. Be specific and leave as little room for interpretation as possible. Use analogies and descriptive language to help the model understand your desired outcome.

- **Experiment and iterate**: Prompt engineering is an art that requires experimentation and iteration. Practice and gain experience in crafting prompts for different tasks. Every model might behave differently, so it's important to adapt prompt engineering techniques accordingly.

### Getting started

- [Introduction to prompt engineering](./prompt-engineering.md)
- [Prompt engineering techniques](./advanced-prompt-engineering.md)
- [15 tips to become a better prompt engineer for generative AI](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/15-tips-to-become-a-better-prompt-engineer-for-generative-ai/ba-p/3882935)
- [The basics of prompt engineering (video)](https://www.youtube.com/watch?v=e7w6QV1NX1c)

## RAG (Retrieval Augmented Generation)

### Definition 

[RAG (Retrieval Augmented Generation)](../../../ai-studio/concepts/retrieval-augmented-generation.md) is a method that integrates external data into a Large Language Model prompt to generate relevant responses. This approach is particularly beneficial when using a large corpus of unstructured text based on different topics. It allows for answers to be grounded in the organization’s knowledge base (KB), providing a more tailored and accurate response.

RAG is also advantageous when answering questions based on an organization’s private data or when the public data that the model was trained on might have become outdated. This helps ensure that the responses are always up-to-date and relevant, regardless of the changes in the data landscape.

### Illustrative use case

A corporate HR department is looking to provide an intelligent assistant that answers specific employee health insurance related questions such as "are eyeglasses covered?" RAG is used to ingest the extensive and numerous documents associated with insurance plan policies to enable the answering of these specific types of questions.

### Things to consider

- RAG helps ground AI output in real-world data and reduces the likelihood of fabrication.

- RAG is helpful when there is a need to answer questions based on private proprietary data.

- RAG is helpful when you might want questions answered that are recent (for example, before the cutoff date of when the [model version](./models.md) was last trained).

### Getting started

- [Retrieval Augmented Generation in Azure AI Studio - Azure AI Studio | Microsoft Learn](../../../ai-studio/concepts/retrieval-augmented-generation.md)
- [Retrieval Augmented Generation (RAG) in Azure AI Search](../../../search/retrieval-augmented-generation-overview.md)
- [Retrieval Augmented Generation using Azure Machine Learning prompt flow (preview)](../../../machine-learning/concept-retrieval-augmented-generation.md)

## Fine-tuning

### Definition

[Fine-tuning](../how-to/fine-tuning.md), specifically [supervised fine-tuning](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/fine-tuning-now-available-with-azure-openai-service/ba-p/3954693?lightbox-message-images-3954693=516596iC5D02C785903595A) in this context, is an iterative process that adapts an existing large language model to a provided training set in order to improve performance, teach the model new skills, or reduce latency. This approach is used when the model needs to learn and generalize over specific topics, particularly when these topics are generally small in scope.

Fine-tuning requires the use of high-quality training data, in a [special example based format](../how-to/fine-tuning.md#example-file-format), to create the new fine-tuned Large Language Model. By focusing on specific topics, fine-tuning allows the model to provide more accurate and relevant responses within those areas of focus.

### Illustrative use case

An IT department has been using GPT-4 to convert natural language queries to SQL, but they have found that the responses are not always reliably grounded in their schema, and the cost is prohibitively high.

They fine-tune GPT-3.5-Turbo with hundreds of requests and correct responses and produce a model that performs better than the base model with lower costs and latency.

### Things to consider

- Fine-tuning is an advanced capability; it enhances LLM with after-cutoff-date knowledge and/or domain specific knowledge. Start by evaluating the baseline performance of a standard model against their requirements before considering this option.

- Having a baseline for performance without fine-tuning is essential for knowing whether fine-tuning has improved model performance. Fine-tuning with bad data makes the base model worse, but without a baseline, it's hard to detect regressions.

- Good cases for fine-tuning include steering the model to output content in a specific and customized style, tone, or format, or tasks where the information needed to steer the model is too long or complex to fit into the prompt window.

- Fine-tuning costs:

  - Fine-tuning can reduce costs across two dimensions: (1) by using fewer tokens depending on the task (2) by using a smaller model (for example GPT 3.5 Turbo can potentially be fine-tuned to achieve the same quality of GPT-4 on a particular task).

  - Fine-tuning has upfront costs for training the model. And additional hourly costs for hosting the custom model once it's deployed.

### Getting started

- [When to use Azure OpenAI fine-tuning](./fine-tuning-considerations.md)
- [Customize a model with fine-tuning](../how-to/fine-tuning.md)
- [Azure OpenAI GPT 3.5 Turbo fine-tuning tutorial](../tutorials/fine-tune.md)
- [To fine-tune or not to fine-tune? (Video)](https://www.youtube.com/watch?v=0Jo-z-MFxJs)