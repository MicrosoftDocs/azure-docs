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

[!INCLUDE [Feature preview](./includes/feature-preview.md)]

Azure AI Studio is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## May 2024

### Mistral Small

Mistral Small is available in the Azure AI model catalog. Mistral Small is Mistral AI's smallest proprietary Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency. Developers can access Mistral Small through Models as a Service (MaaS), enabling seamless API-based interactions.

Mistral Small is:

- A small model optimized for low latency: Efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model, it outperforms Mixtral 8x7B and has lower latency.
- Specialized in RAG: Crucial information isn't lost in the middle of long context windows. Supports up to 32K tokens.
- Strong in coding: Code generation, review, and comments with support for all mainstream coding languages.
- Multi-lingual by design: Best-in-class performance in French, German, Spanish, and Italian - in addition to English. Dozens of other languages are supported.
- Efficient guardrails baked in the model, with another safety layer with safe prompt option.

For more information about Phi-3, see the [blog announcement](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/introducing-mistral-small-empowering-developers-with-efficient/ba-p/4127678).

## April 2024

### Phi-3

The Phi-3 family of models developed by Microsoft are available in the Azure AI model catalog. Phi-3 models are the most capable and cost-effective small language models (SLMs) available, outperforming models of the same size and next size up across various language, reasoning, coding, and math benchmarks. This release expands the selection of high-quality models for customers, offering more practical choices as they compose and build generative AI applications.

- Phi-3-mini is available in two context-length variants—4K and 128K tokens. It's the first model in its class to support a context window of up to 128K tokens, with little effect on quality.
- It's instruction-tuned, meaning that it’s trained to follow different types of instructions reflecting how people normally communicate. This ensures the model is ready to use out-of-the-box.
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
