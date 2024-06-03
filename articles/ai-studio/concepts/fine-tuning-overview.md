---
title: Fine-tuning in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces fine-tuning of models in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 5/29/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Fine-tune models in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

When we talk about fine-tuning, we really mean *supervised fine-tuning* not continuous pretraining or Reinforcement Learning through Human Feedback (RLHF). Supervised fine-tuning refers to the process of retraining pretrained models on specific datasets, typically to improve model performance on specific tasks or introduce information that wasn't well represented when the base model was originally trained.

In this article, you learn whether or not fine-tuning is the right solution for your given use case and how Azure AI studio can support your fine-tuning needs.

## Getting started with fine-tuning

When deciding whether or not fine-tuning is the right solution to explore for a given use case, there are some key terms that it's helpful to be familiar with:

- [Prompt Engineering](../../ai-services/openai/concepts/prompt-engineering.md) is a technique that involves designing prompts for natural language processing models. This process improves accuracy and relevancy in responses, optimizing the performance of the model.
- [Retrieval Augmented Generation (RAG)](../concepts/retrieval-augmented-generation.md) improves Large Language Model (LLM) performance by retrieving data from external sources and incorporating it into a prompt. RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs.
- [Fine-tuning](#why-do-you-want-to-fine-tune-a-model) retrains an existing Large Language Model using example data, resulting in a new "custom" Large Language Model that's optimized using the provided examples.

Fine-tuning is an advanced technique that requires expertise to use appropriately. The questions below can help you evaluate whether you're ready for fine-tuning, and how well you thought through the process. You can use these to guide your next steps or identify other approaches that might be more appropriate.

## Why do you want to fine-tune a model?

You might be ready for fine-tuning if you:

- You should be able to clearly articulate a specific use case for fine-tuning and identify the [model](../how-to/model-catalog.md) you hope to fine-tune.
- Good use cases for fine-tuning include steering the model to output content in a specific and customized style, tone, or format, or scenarios where the information needed to steer the model is too long or complex to fit into the prompt window.
- Have clear examples on how you have approached the challenges in alternate approaches and what's been tested as possible resolutions to improve performance.
- You've identified shortcomings using a base model, such as inconsistent performance on edge cases, inability to fit enough few shot prompts in the context window to steer the model, high latency, etc.

You might not be ready for fine-tuning if:

- Insufficient knowledge from the model or data source.
- Inability to find the right data to serve the model.
- No clear use case for fine-tuning, or an inability to articulate more than "I want to make a model better".
- If you identify cost as your primary motivator, proceed with caution. Fine-tuning might reduce costs for certain use cases by shortening prompts or allowing you to use a smaller model but there's a higher upfront cost to training and you have to pay for hosting your own custom model. Refer to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) for more information on Azure OpenAI fine-tuning costs.
- If you want to add out of domain knowledge to the model, you should start with retrieval augmented generation (RAG) with features like Azure OpenAI's [on your data](../../ai-services/openai/concepts/use-your-data.md) or [embeddings](../../ai-services/openai/tutorials/embeddings.md). Often, this is a cheaper, more adaptable, and potentially more effective option depending on the use case and data.

## What isn't working with alternate approaches?

Understanding where prompt engineering falls short should provide guidance on going about your fine-tuning. Is the base model failing on edge cases or exceptions? Is the base model not consistently providing output in the right format, and you can't fit enough examples in the context window to fix it?

Examples of failure with the base model and prompt engineering will help you identify the data they need to collect for fine-tuning, and how you should be evaluating your fine-tuned model.

Here's an example: A customer wanted to use GPT-3.5-Turbo to turn natural language questions into queries in a specific, nonstandard query language. They provided guidance in the prompt ("Always return GQL") and used RAG to retrieve the database schema. However, the syntax wasn't always correct and often failed for edge cases. They collected thousands of examples of natural language questions and the equivalent queries for their database, including cases where the model had failed before – and used that data to fine-tune the model. Combining their new fine-tuned model with their engineered prompt and retrieval brought the accuracy of the model outputs up to acceptable standards for use.

## What have you tried so far?

Fine-tuning is an advanced capability, not the starting point for your generative AI journey. You should already be familiar with the basics of using Large Language Models (LLMs). You should start by evaluating the performance of a base model with prompt engineering and/or Retrieval Augmented Generation (RAG) to get a baseline for performance.

Having a baseline for performance without fine-tuning is essential for knowing whether or not fine-tuning has improved model performance. Fine-tuning with bad data makes the base model worse, but without a baseline, it's hard to detect regressions.

**If you are ready for fine-tuning you:**

- Should be able to demonstrate evidence and knowledge of Prompt Engineering and RAG based approaches.
- Be able to share specific experiences and challenges with techniques other than fine-tuning that were already tried for your use case.
- Need to have quantitative assessments of baseline performance, whenever possible.  

**Common signs you might not be ready for fine-tuning yet:**

- Starting with fine-tuning without having tested any other techniques.
- Insufficient knowledge or understanding on how fine-tuning applies specifically to Large Language Models (LLMs).
- No benchmark measurements to assess fine-tuning against.

## What data are you going to use for fine-tuning?

Even with a great use case, fine-tuning is only as good as the quality of the data that you're able to provide. You need to be willing to invest the time and effort to make fine-tuning work. Different models will require different data volumes but you often need to be able to provide fairly large quantities of high-quality curated data.

Another important point is even with high quality data if your data isn't in the necessary format for fine-tuning you'll need to commit engineering resources in order to properly format the data. For more information on how to prepare your data for fine-tuning, refer to the [fine-tuning documentation](../../ai-services/openai/how-to/fine-tuning.md?context=/azure/ai-studio/context/context).

**If you are ready for fine-tuning you:**

- Have identified a dataset for fine-tuning.
- The dataset is in the appropriate format for training.
- Some level of curation has been employed to ensure dataset quality.

**Common signs you might not be ready for fine-tuning yet:**

- Dataset hasn't been identified yet.
- Dataset format doesn't match the model you wish to fine-tune.

## How will you measure the quality of your fine-tuned model?

There isn't a single right answer to this question, but you should have clearly defined goals for what success with fine-tuning looks like. Ideally, this shouldn't just be qualitative but should include quantitative measures of success like utilizing a holdout set of data for validation, as well as user acceptance testing or A/B testing the fine-tuned model against a base model.

## Supported models for fine-tuning in Azure AI Studio

Now that you know when to leverage fine-tuning for your use-case, you can go to Azure AI Studio to find several models available to fine-tune including:
- Azure OpenAI models
- Llama 2 family models


### Azure OpenAI models
The following Azure OpenAI models are supported in Azure AI Studio for fine-tuning: 

|  Model ID  | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to) |
|  --- | --- | :---: | :---: |
| `babbage-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `davinci-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 4,096 | Sep 2021 |
| `gpt-35-turbo` (1106) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo` (0125)  | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 16,385 | Sep 2021 |
| `gpt-4` (0613) <sup>1<sup> | North Central US <br> Sweden Central | 8192 | Sep 2021 |

<sup>1<sup> GPT-4 fine-tuning is currently in public preview. See our [GPT-4 fine-tuning safety evaluation guidance](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-python#safety-evaluation-gpt-4-fine-tuning---public-preview) for more information.

Please note for fine-tuning Azure OpenAI models, you must add a connection to an Azure OpenAI resource with a supported region to your project.

### Llama 2 family models
The following Llama 2 family models are supported in Azure AI Studio for fine-tuning:
- `Llama-2-70b`
- `Llama-2-7b`
- `Llama-2-13b`

Fine-tuning of Llama 2 models is currently supported in projects located in West US 3.

## Related content

- [Learn how to fine-tune an Azure OpenAI model in Azure AI Studio](../../ai-services/openai/how-to/fine-tuning.md?context=/azure/ai-studio/context/context)
- [Learn how to fine-tune a Llama 2 model in Azure AI Studio](../how-to/fine-tune-model-llama.md)
