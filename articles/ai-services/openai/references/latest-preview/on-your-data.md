---
title: Azure OpenAI on your data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API with Assistants.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Azure OpenAI on your data API (Preview) reference

This article provides reference documentation for Python and REST for the new Azure OpenAI on your data API (Preview). The latest preview api-version is `2024-02-15-preview`.

> [!NOTE]
> In earlier API versions, Azure OpenAI on your data used api path `/extensions/chat/completions`. Since `2024-02-15-preview`, Azure OpenAI on your data uses api path `/extensions/chat/completions`.

```http
POST {endpoint}/openai/deployments/{deployment-id}/chat/completions?api-version=2024-02-15-preview
```

## URI Parameters

|Name               | In   | Type     | Required | Description                                                                           |
|---                |---   |---       |---       |---                                                                                    |
|```deployment-id```|path  |string    |True      |Specifies the chat completions model deployment name to use for this request.          |
|```endpoint```     |path  |string    |True      |Azure OpenAI endpoints. For example: https://YOUR_RESOURCE_NAME.openai.azure.com       |
|```api-version```  |query |string    |True      |The API version to use for this operation.                                             |

## Request Body

The request body shares the same schema of chat completions API, except the additive parameters below:

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `messages` | ChatMessage[] | True | The array of messages to generate chat completions for, in the chat format. The chat message has the `context` property which is added for Azure OpenAI on your data. See [Chat Message](#chat-message) for more details.|
| `data_sources` | AzureChatExtensionConfiguration[] | True | The configuration entries for Azure OpenAI on your data. This additional specification is only compatible with Azure OpenAI. If `data_sources` is not provided, the service will use chat completions model directly, and not use Azure OpenAI on your data.|

## Response Body

The response body shares the same schema of chat completions API, except the chat message has the `context` property which is added for Azure OpenAI on your data. See [Chat Message](#chat-message) for more details.

## Chat Message

In both request and response, chat message schema is extended with property `context`. The schema of the message context is below:

### Context
|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `citations` | Citation[] | True | The data source retrieval result, used to generate the assistant message in the response.|
| `intent` | string | True | The detected intent from the chat history, used to pass to the next turn to carry over the context.|

The message context citation schema is below:

### Citation

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content` | string | True | The content of the citation.|
| `title` | string | False | The title of the citation.|
| `url` | string | False | The URL of the citation.|
| `filepath` | string | False | The file path of the citation.|
| `chunk_id` | string | False | The chunk ID of the citation.|