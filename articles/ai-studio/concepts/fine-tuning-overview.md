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

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

Fine-tuning retrains an existing large language model (LLM) by using example data. The result is a new, custom LLM that's optimized for the provided examples.

This article can help you decide whether or not fine-tuning is the right solution for your use case. This article also describes how Azure AI Studio can support your fine-tuning needs.

In this article, fine-tuning refers to *supervised fine-tuning*, not continuous pretraining or reinforcement learning through human feedback (RLHF). Supervised fine-tuning is the process of retraining pretrained models on specific datasets. The purpose is typically to improve model performance on specific tasks or to introduce information that wasn't well represented when you originally trained the base model.

## Getting starting with fine-tuning

When you're deciding whether or not fine-tuning is the right solution for your use case, it's helpful to be familiar with these key terms:

- [Prompt engineering](../../ai-services/openai/concepts/prompt-engineering.md) is a technique that involves designing prompts for natural language processing models. This process improves accuracy and relevancy in responses, to optimize the performance of the model.
- [Retrieval-augmented generation (RAG)](../concepts/retrieval-augmented-generation.md) improves LLM performance by retrieving data from external sources and incorporating it into a prompt. RAG can help businesses achieve customized solutions while maintaining data relevance and optimizing costs.

Fine-tuning is an advanced technique that requires expertise to use appropriately. The following questions can help you evaluate whether you're ready for fine-tuning, and how well you thought through the process. You can use these questions to guide your next steps or to identify other approaches that might be more appropriate.

### Why do you want to fine-tune a model?

You might be ready for fine-tuning if:

- You can clearly articulate a specific use case for fine-tuning and identify the [model](../how-to/model-catalog.md) that you hope to fine-tune.

  Good use cases for fine-tuning include steering the model to output content in a specific and customized style, tone, or format. They also include scenarios where the information needed to steer the model is too long or complex to fit into the prompt window.
- You have clear examples of how you addressed the challenges in alternate approaches and what you tested as possible resolutions to improve performance.
- You identified shortcomings by using a base model, such as inconsistent performance on edge cases, inability to fit enough shot prompts in the context window to steer the model, or high latency.

You might not be ready for fine-tuning if:

- There's insufficient knowledge from the model or data source.
- You can't find the right data to serve the model.
- You don't have a clear use case for fine-tuning, or you can't articulate more than "I want to make a model better."

If you identify cost as your primary motivator, proceed with caution. Fine-tuning might reduce costs for certain use cases by shortening prompts or allowing you to use a smaller model. But there's a higher upfront cost to training, and you have to pay for hosting your own custom model. For more information on fine-tuning costs in Azure OpenAI Service, refer to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

If you want to add out-of-domain knowledge to the model, you should start with RAG by using features like Azure OpenAI [On Your Data](../../ai-services/openai/concepts/use-your-data.md) or [embeddings](../../ai-services/openai/tutorials/embeddings.md). Using RAG in this way is often a cheaper, more adaptable, and potentially more effective option, depending on the use case and data.

### What isn't working with alternate approaches?

Understanding where prompt engineering falls short should provide guidance on approaching your fine-tuning. Is the base model failing on edge cases or exceptions? Is the base model not consistently providing output in the right format, and you can't fit enough examples in the context window to fix it?

Examples of failure with the base model and prompt engineering can help you identify the data that they need to collect for fine-tuning, and how you should be evaluating your fine-tuned model.

Here's an example: A customer wants to use GPT-3.5 Turbo to turn natural language questions into queries in a specific, nonstandard query language. The customer provides guidance in the prompt ("Always return GQL") and uses RAG to retrieve the database schema. However, the syntax isn't always correct and often fails for edge cases. The customer collects thousands of examples of natural language questions and the equivalent queries for the database, including cases where the model failed before. The customer then uses that data to fine-tune the model. Combining the newly fine-tuned model with the engineered prompt and retrieval brings the accuracy of the model outputs up to acceptable standards for use.

### What have you tried so far?

Fine-tuning is an advanced capability, not the starting point for your generative AI journey. You should already be familiar with the basics of using LLMs. You should start by evaluating the performance of a base model with prompt engineering and/or RAG to get a baseline for performance.

Having a baseline for performance without fine-tuning is essential for knowing whether or not fine-tuning improves model performance. Fine-tuning with bad data makes the base model worse, but without a baseline, it's hard to detect regressions.

You might be ready for fine-tuning if:

- You can demonstrate evidence and knowledge of prompt engineering and RAG-based approaches.
- You can share specific experiences and challenges with techniques other than fine-tuning that you tried for your use case.
- You have quantitative assessments of baseline performance, whenever possible.  

You might not be ready for fine-tuning if:

- You haven't tested any other techniques.
- You have insufficient knowledge or understanding of how fine-tuning applies specifically to LLMs.
- You have no benchmark measurements to assess fine-tuning against.

### What data are you going to use for fine-tuning?

Even with a great use case, fine-tuning is only as good as the quality of the data that you can provide. You need to be willing to invest the time and effort to make fine-tuning work. Different models require different data volumes, but you often need to be able to provide fairly large quantities of high-quality curated data.

Another important point is that even with high-quality data, if your data isn't in the necessary format for fine-tuning, you'll need to commit engineering resources for the formatting. For more information on how to prepare your data for fine-tuning, refer to the [fine-tuning documentation](../../ai-services/openai/how-to/fine-tuning.md?context=/azure/ai-studio/context/context).

You might be ready for fine-tuning if:

- You identified a dataset for fine-tuning.
- Your dataset is in the appropriate format for training.
- You employed some level of curation to ensure dataset quality.

You might not be ready for fine-tuning if:

- You haven't identified a dataset yet.
- The dataset format doesn't match the model that you want to fine-tune.

### How will you measure the quality of your fine-tuned model?

There isn't a single right answer to this question, but you should have clearly defined goals for what success with fine-tuning looks like. Ideally, this effort shouldn't just be qualitative. It should include quantitative measures of success, like using a holdout set of data for validation, in addition to user acceptance testing or A/B testing the fine-tuned model against a base model.

## Supported models for fine-tuning in Azure AI Studio

Now that you know when to use fine-tuning for your use case, you can go to Azure AI Studio to find models available to fine-tune. The following sections describe the available models.

### Azure OpenAI models

The following Azure OpenAI models are supported in Azure AI Studio for fine-tuning:

|  Model ID  | Fine-tuning regions | Max request (tokens) | Training data (up to) |
|  --- | --- | :---: | :---: |
| `babbage-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `davinci-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 4,096 | Sep 2021 |
| `gpt-35-turbo` (1106) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo` (0125)  | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 16,385 | Sep 2021 |
| `gpt-4` (0613) <sup>1<sup> | North Central US <br> Sweden Central | 8192 | Sep 2021 |

<sup>1</sup> GPT-4 fine-tuning is currently in public preview. For more information, see the [GPT-4 fine-tuning safety evaluation guidance](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-python#safety-evaluation-gpt-4-fine-tuning---public-preview).

To fine-tune Azure OpenAI models, you must add a connection to an Azure OpenAI resource with a supported region to your project.

### Phi-3 family models

The following Phi-3 family models are supported in Azure AI Studio for fine-tuning:

- `Phi-3-mini-4k-instruct`
- `Phi-3-mini-128k-instruct`
- `Phi-3-medium-4k-instruct`
- `Phi-3-medium-128k-instruct`

Fine-tuning of Phi-3 models is currently supported in projects located in East US2.

### Meta Llama 2 family models

The following Llama 2 family models are supported in Azure AI Studio for fine-tuning:

- `Meta-Llama-2-70b`
- `Meta-Llama-2-7b`
- `Meta-Llama-2-13b`

Fine-tuning of Llama 2 models is currently supported in projects located in West US3.

### Meta Llama 3.1 family models

The following Llama 3.1 family models are supported in Azure AI Studio for fine-tuning:

- `Meta-Llama-3.1-70b-Instruct`
- `Meta-Llama-3.1-8b-Instruct`

Fine-tuning of Llama 3.1 models is currently supported in projects located in West US3.

## Related content

- [Fine-tune an Azure OpenAI model in Azure AI Studio](../../ai-services/openai/how-to/fine-tuning.md?context=/azure/ai-studio/context/context)
- [Fine-tune a Llama 2 model in Azure AI Studio](../how-to/fine-tune-model-llama.md)
- [Fine-tune a Phi-3 model in Azure AI Studio](../how-to/fine-tune-phi-3.md)
- [Deploy Phi-3 family of small language models with Azure AI Studio](../how-to/deploy-models-phi-3.md)
