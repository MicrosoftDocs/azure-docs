---
title: Prompt Engineering Techniques with Azure OpenAI
titleSuffix: Azure OpenAI Service
description: Learn about the options for how to use prompt engineering with GPT-3, ChatGPT, and GPT-4 models
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 03/21/2023
manager: nitinme
keywords: ChatGPT
zone_pivot_groups: openai-prompt
---

# Prompt Engineering Techniques

This guide will walk you through some advanced techniques in prompt design and prompt engineering. If you are new to prompt engineering we recommend starting with our [introduction to prompt engineering guide](prompt-engineering.md).

While the principles of prompt engineering can be generalized across many different model types, certain models expect a specialized prompt structure. For Azure OpenAI GPT models, there are currently two distinct APIs where prompt engineering comes into play:

- Chat Completion API.
- Completion API.

Each API requires input data to be formatted differently, which in turn impacts overall prompt design. The Chat Completion API supports the ChatGPT (preview) and GPT-4 (preview) models. These models are designed to take input formatted in a [specific chat-like transcript](../how-to/chatgpt.md) divided across an array of dictionaries.

The Completion API supports the older GPT-3 models and has much more flexible input requirements in that it takes a string of text with no specific format rules.

> [!NOTE]
> Technically the ChatGPT (preview) models can be used with either API's, but we strongly recommend using the Chat Completion API for these models. To learn more, please consult our [in-depth guide on using the two API](../how-to/chatgpt.md). 

::: zone pivot="programming-language-chat-completions"

[!INCLUDE [Prompt Chat Completion](../includes/prompt-chat-completion.md)]

::: zone-end

::: zone pivot="programming-language-completions"

[!INCLUDE [Prompt Completion](../includes/chat-markup-language.md)]

::: zone-end
