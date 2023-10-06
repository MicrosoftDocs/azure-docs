---
title: How to work with the GPT-35-Turbo and GPT-4 models 
titleSuffix: Azure OpenAI Service
description: Learn about the options for how to use the GPT-35-Turbo and GPT-4 models 
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 05/15/2023
manager: nitinme
keywords: ChatGPT
zone_pivot_groups: openai-chat
---

# Learn how to work with the GPT-35-Turbo and GPT-4 models

The GPT-35-Turbo and GPT-4 models are language models that are optimized for conversational interfaces. The models behave differently than the older GPT-3 models. Previous models were text-in and text-out, meaning they accepted a prompt string and returned a completion to append to the prompt. However, the GPT-35-Turbo and GPT-4 models are conversation-in and message-out. The models expect input formatted in a specific chat-like transcript format, and return a completion that represents a model-written message in the chat. While this format was designed specifically for multi-turn conversations, you'll find it can also work well for non-chat scenarios too.

In Azure OpenAI there are two different options for interacting with these type of models:

- Chat Completion API.
- Completion API with Chat Markup Language (ChatML).

The Chat Completion API is a new dedicated API for interacting with the GPT-35-Turbo and GPT-4 models. This API is the preferred method for accessing these models. **It is also the only way to access the new GPT-4 models**.

ChatML uses the same [completion API](../reference.md#completions) that you use for other models like text-davinci-002, it requires a unique token based prompt format known as Chat Markup Language (ChatML). This provides lower level access than the dedicated Chat Completion API, but also requires additional input validation, only supports gpt-35-turbo models, and **the underlying format is more likely to change over time**.

This article walks you through getting started with the GPT-35-Turbo and GPT-4 models. It's important to use the techniques described here to get the best results. If you try to interact with the models the same way you did with the older model series, the models will often be verbose and provide less useful responses.

::: zone pivot="programming-language-chat-completions"

[!INCLUDE [Studio quickstart](../includes/chat-completion.md)]

::: zone-end

::: zone pivot="programming-language-chat-ml"

[!INCLUDE [Python SDK quickstart](../includes/chat-markup-language.md)]

::: zone-end
