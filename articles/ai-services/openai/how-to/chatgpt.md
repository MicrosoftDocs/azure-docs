---
title: Work with the GPT-35-Turbo and GPT-4 models 
titleSuffix: Azure OpenAI Service
description: Learn about the options for how to use the GPT-35-Turbo and GPT-4 models.
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai, devx-track-python
ms.topic: how-to
ms.date: 04/05/2024
manager: nitinme
keywords: ChatGPT
---

# Work with the GPT-3.5-Turbo and GPT-4 models

The GPT-3.5-Turbo and GPT-4 models are language models that are optimized for conversational interfaces. The models behave differently than the older GPT-3 models. Previous models were text-in and text-out, which means they accepted a prompt string and returned a completion to append to the prompt. However, the GPT-3.5-Turbo and GPT-4 models are conversation-in and message-out. The models expect input formatted in a specific chat-like transcript format. They return a completion that represents a model-written message in the chat. This format was designed specifically for multi-turn conversations, but it can also work well for nonchat scenarios.

This article walks you through getting started with the GPT-3.5-Turbo and GPT-4 models. To get the best results, use the techniques described here. Don't try to interact with the models the same way you did with the older model series because the models are often verbose and provide less useful responses.

[!INCLUDE [Chat Completions](../includes/chat-completion.md)]
