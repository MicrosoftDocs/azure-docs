---
title: Azure OpenAI Service Assistants API concepts
titleSuffix: Azure OpenAI Service
description: Learn about the concepts behind the Azure OpenAI Assistants API.
ms.topic: conceptual
ms.date: 03/04/2024
ms.service: azure-ai-openai
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
---

# Azure OpenAI Assistants API (Preview)

Assistants, a new feature of Azure OpenAI Service, is now available in public preview. Assistants API makes it easier for developers to create applications with sophisticated copilot-like experiences that can sift through data, suggest solutions, and automate tasks.

* Assistants can call Azure OpenAI’s [models](../concepts/models.md) with specific instructions to tune their personality and capabilities.
* Assistants can access **multiple tools in parallel**. These can be both Azure OpenAI-hosted tools like [code interpreter](../how-to/code-interpreter.md) and [file search](../how-to/file-search.md), or tools you build, host, and access through [function calling](../how-to/function-calling.md).
* Assistants can access **persistent Threads**. Threads simplify AI application development by storing message history and truncating it when the conversation gets too long for the model's context length. You create a Thread once, and simply append Messages to it as your users reply.
* Assistants can access files in several formats. Either as part of their creation or as part of Threads between Assistants and users. When using tools, Assistants can also create files (such as images or spreadsheets) and cite files they reference in the Messages they create.

## Overview

Previously, building custom AI assistants needed heavy lifting even for experienced developers. While the chat completions API is lightweight and powerful, it's inherently stateless, which means that developers had to manage conversation state and chat threads, tool integrations, retrieval documents and indexes, and execute code manually.

The Assistants API, as the stateful evolution of the chat completion API, provides a solution for these challenges.
Assistants API supports persistent automatically managed threads. This means that as a developer you no longer need to develop conversation state management systems and work around a model’s context window constraints. The Assistants API will automatically handle the optimizations to keep the thread below the max context window of your chosen model. Once you create a Thread, you can simply append new messages to it as users respond. Assistants can also access multiple tools in parallel, if needed. These tools include:

- [Code Interpreter](../how-to/code-interpreter.md)
- [Function calling](../how-to/assistant-functions.md)

> [!TIP]
> There is no additional [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) or [quota](../quotas-limits.md) for using Assistants unless you use the [code interpreter](../how-to/code-interpreter.md) or [file search](../how-to/file-search.md) tools.

Assistants API is built on the same capabilities that power OpenAI’s GPT product. Some possible use cases range from AI-powered product recommender, sales analyst app, coding assistant, employee Q&A chatbot, and more. Start building on the no-code Assistants playground on the Azure OpenAI Studio, AI Studio, or start building with the API.

> [!IMPORTANT]
> Retrieving untrusted data using Function calling, Code Interpreter or File Search with file input, and Assistant Threads functionalities could compromise the security of your Assistant, or the application that uses the Assistant. Learn about mitigation approaches [here](https://aka.ms/oai/assistant-rai).

## Assistants playground

We provide a walkthrough of the Assistants playground in our [quickstart guide](../assistants-quickstart.md). This provides a no-code environment to test out the capabilities of assistants.

## Assistants components

:::image type="content" source="../media/assistants/assistants-overview.png" alt-text="A diagram showing the components of an assistant." lightbox="../media/assistants/assistants-overview.png":::

| **Component** | **Description** |
|---|---|
| **Assistant** | Custom AI that uses Azure OpenAI models in conjunction with tools. |
|**Thread** | A conversation session between an Assistant and a user. Threads store Messages and automatically handle truncation to fit content into a model’s context.|
| **Message** | A message created by an Assistant or a user. Messages can include text, images, and other files. Messages are stored as a list on the Thread. |
|**Run** | Activation of an Assistant to begin running based on the contents of the Thread. The Assistant uses its configuration and the Thread’s Messages to perform tasks by calling models and tools. As part of a Run, the Assistant appends Messages to the Thread.|
|**Run Step** | A detailed list of steps the Assistant took as part of a Run. An Assistant can call tools or create Messages during it’s run. Examining Run Steps allows you to understand how the Assistant is getting to its final results. |

## Assistants data access

Currently, assistants, threads, messages, and files created for Assistants are scoped at the Azure OpenAI resource level. Therefore, anyone with access to the Azure OpenAI resource or API key access is able to read/write assistants, threads, messages, and files.

We strongly recommend the following data access controls:

- Implement authorization. Before performing reads or writes on assistants, threads, messages, and files, ensure that the end-user is authorized to do so.
- Restrict Azure OpenAI resource and API key access. Carefully consider who has access to Azure OpenAI resources where assistants are being used and associated API keys.
- Routinely audit which accounts/individuals have access to the Azure OpenAI resource. API keys and resource level access enable a wide range of operations including reading and modifying messages and files.
- Enable [diagnostic settings](../how-to/monitoring.md#configure-diagnostic-settings) to allow long-term tracking of certain aspects of the Azure OpenAI resource's activity log.

## Parameters

The Assistants API has support for several parameters that let you customize the Assistants' output. The `tool_choice` parameter lets you force the Assistant to use a specified tool. You can also create messages with the `assistant` role to create custom conversation histories in Threads. `temperature`, `top_p`, `response_format` let you further tune responses. For more information, see the [reference](../assistants-reference.md#create-an-assistant) documentation.

## Context window management

Assistants automatically truncates text to ensure it stays within the model's maximum context length. You can customize this behavior by specifying the maximum tokens you'd like a run to utilize and/or the maximum number of recent messages you'd like to include in a run.

### Max completion and max prompt tokens

To control the token usage in a single Run, set `max_prompt_tokens` and `max_completion_tokens` when you create the Run. These limits apply to the total number of tokens used in all completions throughout the Run's lifecycle.

For example, initiating a Run with `max_prompt_tokens` set to 500 and `max_completion_tokens` set to 1000 means the first completion will truncate the thread to 500 tokens and cap the output at 1000 tokens. If only 200 prompt tokens and 300 completion tokens are used in the first completion, the second completion will have available limits of 300 prompt tokens and 700 completion tokens.

If a completion reaches the `max_completion_tokens` limit, the Run will terminate with a status of incomplete, and details will be provided in the `incomplete_details` field of the Run object.

When using the File Search tool, we recommend setting the `max_prompt_tokens` to no less than 20,000. For longer conversations or multiple interactions with File Search, consider increasing this limit to 50,000, or ideally, removing the `max_prompt_tokens` limits altogether to get the highest quality results.

## Truncation strategy

You may also specify a truncation strategy to control how your thread should be rendered into the model's context window. Using a truncation strategy of type `auto` will use OpenAI's default truncation strategy. Using a truncation strategy of type `last_messages` will allow you to specify the number of the most recent messages to include in the context window.

## See also
* Learn more about Assistants and [File Search](../how-to/file-search.md)
* Learn more about Assistants and [Code Interpreter](../how-to/code-interpreter.md)
* Learn more about Assistants and [function calling](../how-to/assistant-functions.md)
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)
