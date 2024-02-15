---
title: Azure OpenAI on your data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Azure OpenAI on your data API Reference

This article provides reference documentation for Python and REST for the new Azure OpenAI on your data API. The latest preview api-version is `2024-02-15-preview`.

> [!NOTE]
> Since `2024-02-15-preview` we introduced the following breaking changes comparing to earlier API versions:
> * API path is changed from `/extensions/chat/completions` to `/chat/completions`.
> * Naming convention of property keys and enum values is changed from camel casing to snake casing. Example: `deploymentName` is changed to `deployment_name`.
> * The data source type `AzureCognitiveSearch` is changed to `azure_search`.
> * The citations and intent is moved from assistant message's context tool messages to assistant message's context root level with explicit [schema defined](#context).

```http
POST {endpoint}/openai/deployments/{deployment-id}/chat/completions?api-version=2024-02-15-preview
```

## URI parameters

|Name               | In   | Type     | Required | Description                                                                           |
|---                |---   |---       |---       |---                                                                                    |
|```deployment-id```|path  |string    |True      |Specifies the chat completions model deployment name to use for this request.          |
|```endpoint```     |path  |string    |True      |Azure OpenAI endpoints. For example: `https://{YOUR_RESOURCE_NAME}.openai.azure.com`   |
|```api-version```  |query |string    |True      |The API version to use for this operation.                                             |

## Request body

The request body inherits the same schema of chat completions API. This table shows the parameters for Azure OpenAI on your data.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `messages` | [ChatMessage](#chat-message)[] | True | The array of messages to generate chat completions for, in the chat format. The [request chat message](#chat-message) has a `context` property, which is added for Azure OpenAI on your data.|
| `data_sources` | [DataSource](#data-source)[] | True | The configuration entries for Azure OpenAI on your data. This is only compatible with Azure OpenAI. There must be exactly one element in the array. If `data_sources` is not provided, the service uses chat completions model directly, and not use Azure OpenAI on your data.|

## Response body

The response body inherits the same schema of chat completions API. The [response chat message](#chat-message) has a `context` property, which is added for Azure OpenAI on your data.

## Chat message

In both request and response, when the chat message `role` is `assistant`, the chat message schema inherits from the chat completions assistant chat message, and is extended with the property `context`.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content` | string | True | The content of the message.|
| `role` | string | True | Must be `assistant`. |
| `context` | [Context](#context) | True | Represents the incremental steps performed by the Azure OpenAI on your data while processing the request, including the detected search intent and the retrieved documents. |

## Context
|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `citations` | [Citation](#citation)[] | True | The data source retrieval result, used to generate the assistant message in the response.|
| `intent` | string | True | The detected intent from the chat history, used to pass to the next turn to carry over the context.|

## Citation

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content` | string | True | The content of the citation.|
| `title` | string | False | The title of the citation.|
| `url` | string | False | The URL of the citation.|
| `filepath` | string | False | The file path of the citation.|
| `chunk_id` | string | False | The chunk ID of the citation.|

## Data source

This list shows the supported data sources.

* [Azure AI Search](./azure-search.md)
* [Azure Cosmos DB for MongoDB vCore](./cosmos-db.md)
* [Azure Machine Learning index](./azure-ml.md)
* [Elasticsearch](./elasticsearch.md)
* [Pinecone](./pinecone.md)
