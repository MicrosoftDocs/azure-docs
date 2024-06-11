---
title: What's new in Azure AI Studio?
titleSuffix: Azure AI Studio
description: This article provides you with information about new releases and features.
manager: nitinme
keywords: Release notes
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# What's new in Azure AI Studio?

Azure AI Studio is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## May 2024

### Azure AI Studio (GA)

Azure AI Studio is now generally available. Azure AI Studio is a unified platform that brings together various Azure AI capabilities that were previously available as standalone Azure services. Azure AI Studio provides a seamless experience for developers, data scientists, and AI engineers to build, deploy, and manage AI models and applications. With Azure AI Studio, you can access a wide range of AI capabilities, including language models, speech, vision, and more, all in one place.

> [!NOTE]
> Some features are still in public preview and might not be available in all regions. Please refer to the feature level documentation for more information.

### New UI

We've updated the AI Studio navigation experience to help you work more efficiently and seamlessly move through the platform. Get to know the new navigation below: 

#### Quickly transition between hubs and projects

Easily navigate between the global, hub, and project scopes. 
- Go back to the previous scope at any time by using the back button at the top of the navigation. 
- Tools and resources change dynamically based on whether you are working at the global, hub, or project level. 

:::image type="content" source="media/explore/transition-hubs-projects.gif" alt-text="GIF of transitioning between hub and project scopes in AI Studio." lightbox= "media/explore/transition-hubs-projects.gif":::

#### Navigate with breadcrumbs

We have added breadcrumbs to prevent you from getting lost in the product. 
- Breadcrumbs are consistently shown on the top navigation, regardless of what page you are on. 
- Use these breadcrumbs to quickly move through the platform.  

:::image type="content" source="media/explore/breadcrumb-navigation.gif" alt-text="GIF of navigating with breadcrumbs in AI Studio." lightbox= "media/explore/breadcrumb-navigation.gif":::

#### Customize your navigation

The new navigation can be modified and customized to fit your needs. 
- Collapse and expand groupings as needed to easily access the tools you need the most. 
- Collapse the navigation at any time to save screen space. All tools and capabilities will still be available. 

:::image type="content" source="media/explore/custom-navigation.gif" alt-text="GIF of customizing the navigation in AI Studio." lightbox= "media/explore/custom-navigation.gif":::

#### Easily switch between your recent hubs and projects

Switch between recently used hubs and projects at any time using the picker at the top of the navigation. 
- While in a hub, use the picker to access and switch to any of your recently used hubs. 
- While in a project, use the picker to access and switch to any of your recently used projects. 

:::image type="content" source="media/explore/switch-hubs-projects.gif" alt-text="GIF of switching to other hubs and projects in AI Studio." lightbox= "media/explore/switch-hubs-projects.gif":::

### View and track your evaluators in a centralized way 

Evaluator is a new asset in Azure AI Studio. You can define a new evaluator in SDK and use it to run evaluation that generates scores of one or more metrics. You can view and manage both Microsoft curated evaluators and your own customized evaluators in the evaluator library. For more information, see [Evaluate with the prompt flow SDK](./how-to/develop/flow-evaluate-sdk.md).

### Perform continuous monitoring for generative AI applications 

Azure AI Monitoring for Generative AI Applications enables you to continuously track the overall health of your production Prompt Flow deployments. With this feature, you can monitor the quality of LLM responses in addition to obtaining full visibility into the performance of your application, thus, helping you maintain trust and compliance. For more information, see [Monitor quality and safety of deployed prompt flow applications](./how-to/monitor-quality-safety.md).

#### View embeddings benchmarks  

You can now compare benchmarks across embeddings models. For more information, see [Explore model benchmarks in Azure AI Studio](./how-to/model-benchmarks.md).

### Fine-tune and deploy Azure OpenAI models 

Learn how to customize Azure OpenAI models with fine-tuning. You can train models on more examples and get higher quality results. For more information, see [Fine-tune and deploy Azure OpenAI models](../ai-services/openai/how-to/fine-tuning.md?context=/azure/ai-studio/context/context) and [Deploy Azure OpenAI models](./how-to/deploy-models-openai.md).

### Service-side encryption of metadata

We release simplified management when using customer-managed key encryption for workspaces, with less resources hosted in your Azure subscription. This reduces operational cost, and mitigates policy conflicts compared to the current offering.

### Azure AI model Inference API 

The Azure AI Model Inference is an API that exposes a common set of capabilities for foundational models and that can be used by developers to consume predictions from a diverse set of models in a uniform and consistent way. Developers can talk with different models deployed in Azure AI without changing the underlying code they're using. For more information, see [Azure AI Model Inference API](./reference/reference-model-inference-api.md).

### Perform tracing and debugging for GenAI applications  

Tracing is essential for providing detailed visibility into the performance and behavior of GenAI applications' inner workings. It plays a vital role in enhancing the debugging process, increasing observability, and promoting optimization. 
With this new capability, you can now efficiently monitor and rectify issues in your GenAI application during testing, fostering a more collaborative and efficient development process.  

### Use evaluators in the prompt flow SDK 

Evaluators in the prompt flow SDK offer a streamlined, code-based experience for evaluating and improving your generative AI apps. You can now easily use Microsoft curated quality and safety evaluators or define custom evaluators tailored to assess generative AI systems for the specific metrics you value. For more information about evaluators via the prompt flow SDK, see [Evaluate with the prompt flow SDK](./how-to/develop/flow-evaluate-sdk.md).

Microsoft curated evaluators are also available in the AI Studio evaluator library, where you can view and manage them. However, custom evaluators are currently only available in the prompt flow SDK. For more information about evaluators in AI Studio, see [How to evaluate generative AI apps with Azure AI Studio](./how-to/evaluate-generative-ai-app.md#view-and-manage-the-evaluators-in-the-evaluator-library).

### Use Prompty for engineering and sharing prompts 

Prompty is a new prompt template part of the prompt flow SDK that can be run standalone and integrated into your code. You can download a Prompty from the AI Studio playground, continue iterating on it in your local development environment, and check it into your git repo to share and collaborate on prompts with others. The Prompty format is supported in Semantic Kernel, C#, and LangChain as a community extension.  

### Mistral Small

Mistral Small is available in the Azure AI model catalog. Mistral Small is Mistral AI's smallest proprietary Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency. Developers can access Mistral Small through Models as a Service (MaaS), enabling seamless API-based interactions.

Mistral Small is:

- A small model optimized for low latency: Efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model.
- Specialized in RAG: Crucial information isn't lost in the middle of long context windows. Supports up to 32K tokens.
- Strong in coding: Code generation, review, and comments with support for all mainstream coding languages.
- Multi-lingual by design: Best-in-class performance in French, German, Spanish, and Italian - in addition to English. Dozens of other languages are supported.
- Efficient guardrails baked in the model, with another safety layer with safe prompt option.

For more information about Phi-3, see the [blog announcement](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/introducing-mistral-small-empowering-developers-with-efficient/ba-p/4127678).

## April 2024

### Phi-3

The Phi-3 family of models developed by Microsoft is available in the Azure AI model catalog. Phi-3 models are the most capable and cost-effective small language models (SLMs) available, outperforming models of the same size and next size up across various language, reasoning, coding, and math benchmarks. This release expands the selection of high-quality models for customers, offering more practical choices as they compose and build generative AI applications.

- Phi-3-mini is available in two context-length variants—4K and 128K tokens. It's the first model in its class to support a context window of up to 128K tokens, with little effect on quality.
- It's instruction-tuned, meaning that it's trained to follow different types of instructions reflecting how people normally communicate. This ensures the model is ready to use out-of-the-box.
- It's available on Azure AI to take advantage of the deploy > evaluate > fine-tune toolchain, and is available on Ollama for developers to run locally on their laptops.
- It has been optimized for ONNX Runtime with support for Windows DirectML along with cross-platform support across graphics processing unit (GPU), CPU, and even mobile hardware.
- It's also available as an NVIDIA NIM microservice with a standard API interface that can be deployed anywhere. And has been optimized for NVIDIA GPUs. 

For more information about Phi-3, see the [blog announcement](https://azure.microsoft.com/blog/introducing-phi-3-redefining-whats-possible-with-slms/).

### Meta Llama 3

In collaboration with Meta, Meta Llama 3 models are available in the Azure AI model catalog.

- Meta-Llama-3-8B pretrained and instruction fine-tuned models are recommended for scenarios with limited computational resources, offering faster training times and suitability for edge devices. It's appropriate for use cases like text summarization, classification, sentiment analysis, and translation.
- Meta-Llama-3-70B pretrained and instruction fine-tuned models are geared towards content creation and conversational AI, providing deeper language understanding for more nuanced tasks, like R&D and enterprise applications requiring nuanced text summarization, classification, language modeling, dialog systems, code generation and instruction following.

## February 2024

### Azure AI Studio hub

Azure AI resource is renamed hub. For additional information about the hub, check out [the hub documentation](./concepts/ai-resources.md).

## January 2024

### Benchmarks

New models, datasets, and metrics are released for benchmarks. For additional information about the benchmarks experience, check out [the model catalog documentation](./how-to/model-catalog-overview.md).

Added models:
- `microsoft-phi-2`
- `mistralai-mistral-7b-instruct-v01`
- `mistralai-mistral-7b-v01`
- `codellama-13b-hf`
- `codellama-13b-instruct-hf`
- `codellama-13b-python-hf`
- `codellama-34b-hf`
- `codellama-34b-instruct-hf`
- `codellama-34b-python-hf`
- `codellama-7b-hf`
- `codellama-7b-instruct-hf`
- `codellama-7b-python-hf`

Added datasets:
- `truthfulqa_generation`
- `truthfulqa_mc1`

Added metrics:
- `Coherence`
- `Fluency`
- `GPTSimilarity`

## November 2023

### Benchmarks

Benchmarks are released as public preview in Azure AI Studio. For additional information about the Benchmarks experience, check out  [Model benchmarks](how-to/model-benchmarks.md).

Added models:
- `gpt-35-turbo-0301`
- `gpt-4-0314`
- `gpt-4-32k-0314`
- `llama-2-13b-chat`
- `llama-2-13b`
- `llama-2-70b-chat`
- `llama-2-70b`
- `llama-2-7b-chat`
- `llama-2-7b`

Added datasets:
- `boolq`
- `gsm8k`
- `hellaswag`
- `human_eval`
- `mmlu_humanities`
- `mmlu_other`
- `mmlu_social_sciences`
- `mmlu_stem`
- `openbookqa`
- `piqa`
- `social_iqa`
- `winogrande`

Added tasks:
- `Question Answering`
- `Text Generation`

Added metrics:
- `Accuracy`

## Related content

- Learn more about the [Azure AI Studio](./what-is-ai-studio.md).
- Learn about [what's new in Azure OpenAI Service](../ai-services/openai/whats-new.md).
