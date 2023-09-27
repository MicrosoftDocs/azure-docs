---
title: Prompt engineering techniques with Azure OpenAI
titleSuffix: Azure OpenAI Service
description: Learn about the options for how to use prompt engineering with GPT-3, GPT-35-Turbo, and GPT-4 models
author: suhridpalsule
ms.author: mbullwin 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 04/20/2023
manager: nitinme
keywords: ChatGPT, GPT-4, prompt engineering, meta prompts, chain of thought
zone_pivot_groups: openai-prompt
---

# Prompt engineering techniques

This guide will walk you through some advanced techniques in prompt design and prompt engineering. If you're new to prompt engineering, we recommend starting with our [introduction to prompt engineering guide](prompt-engineering.md).

While the principles of prompt engineering can be generalized across many different model types, certain models expect a specialized prompt structure. For Azure OpenAI GPT models, there are currently two distinct APIs where prompt engineering comes into play:

- Chat Completion API.
- Completion API.

Each API requires input data to be formatted differently, which in turn impacts overall prompt design. The **Chat Completion API** supports the GPT-35-Turbo and GPT-4 models. These models are designed to take input formatted in a [specific chat-like transcript](../how-to/chatgpt.md) stored inside an array of dictionaries.

The **Completion API** supports the older GPT-3 models and has much more flexible input requirements in that it takes a string of text with no specific format rules. Technically the GPT-35-Turbo models can be used with either APIs, but we strongly recommend using the Chat Completion API for these models. To learn more, please consult our [in-depth guide on using these APIs](../how-to/chatgpt.md).

The techniques in this guide will teach you strategies for increasing the accuracy and grounding of responses you generate with a Large Language Model (LLM). It is, however, important to remember that even when using prompt engineering effectively you still need to validate the responses the models generate. Just because a carefully crafted prompt worked well for a particular scenario doesn't necessarily mean it will generalize more broadly to certain use cases. Understanding the [limitations of LLMs](/legal/cognitive-services/openai/transparency-note?context=/azure/ai-services/openai/context/context#limitations), is just as important as understanding how to leverage their strengths.

::: zone pivot="programming-language-chat-completions"

[!INCLUDE [Prompt Chat Completion](../includes/prompt-chat-completion.md)]

::: zone-end

::: zone pivot="programming-language-completions"

[!INCLUDE [Prompt Completion](../includes/prompt-completion.md)]

::: zone-end
