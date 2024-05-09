---
title: Enable semantic caching for Azure OpenAI APIs in Azure API Management
description: Prereqisites and configuration steps to enable semantic caching for Azure OpenAI APIs in Azure API Management.
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 05/08/2024
ms.author: danlep
---

[INTRO]

Set up and perform semantic caching of responses to Azure OpenAI APIs managed in your Azure API Management instance. With semantic caching, you can return cached responses for identical queries and also for queries that are similar in meaning, even if the text isn't the same.
[Learn more about using Azure Cache for Redis as a semantic cache](../azure-cache-for-redis/cache-tutorial-semantic-cache.md).


## Prerequisites

* One or more Azure OpenAI Service APIs must be added to your API Management instance. For more information, see [Add an Azure OpenAI Service API to Azure API Management](../articles/api-management/azure-openai-api-from-specification.md).
* The Azure OpenAI service must have deployments for:
    * Chat completion (or completion) - Deployment that API consumer calls will use
    * Embedding - Used for semantic caching
* The API Management instance must be configured to use managed identity authentication to the Azure OpenAI API. For more information, see [Authenticate and authorize access to Azure OpenAI APIs using Azure API Management ](../articles/api-management/api-management-authenticate-authorize-azure-openai.md#authenticate-with-managed-identity).
* [Azure Cache for Redis Enterprise](../azure-cache-for-redis/quickstart-create-redis-enterprise.md). The **Redisearch** module must be enabled on the Redis Enterprise cache.
* Configure the external cache for Azure API Management. For steps, see [Use an external Azure Cache for Redis in Azure API Management](../articles/api-management/api-management-howto-cache-external.md).

## Create API operation corresponding to Azure OpenAI chat completion deployment

[STEPS to create and test]

## Create an embeddings backend

[STEPS to create and test]


## Configure semantic caching policies

[STEPS to configure in Inbound]

## Confirm caching


## Related content

