---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/08/2024
ms.author: danlep
---

## Prerequisites

* One or more Azure OpenAI Service APIs must be added to your API Management instance. For more information, see [Add an Azure OpenAI Service API to Azure API Management](../articles/api-management/azure-openai-api-from-specification.md).
* The Azure OpenAI service must have deployments for:
    * Chat completion (or completion) - Deployment that API consumer calls will use
    * Embedding - Used for semantic caching
* The API Management instance must be configured to use managed identity authentication to the Azure OpenAI API. For more information, see [Authenticate and authorize access to Azure OpenAI APIs using Azure API Management ](../articles/api-management/api-management-authenticate-authorize-azure-openai.md#authenticate-with-managed-identity).
* Enable an external cache for Azure API Management using [Azure Cache for Redis Enterprise](). For configuration steps, see [Use an external Azure Cache for Redis in Azure API Management](../articles/api-management/api-management-howto-cache-external.md).