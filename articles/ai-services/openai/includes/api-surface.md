---
title: Azure OpenAI API surfaces
titleSuffix: Azure OpenAI Service
description: Information on the division of control plane and data plane API surfaces
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 07/09/2024
---


## API specs

Managing and interacting with Azure OpenAI models and resources is divided across three primary API surfaces:

- Control plane
- Data plane - authoring
- Data plane - inference

Each API surface/specification encapsulates a different set of Azure OpenAI capabilities. Each API has its own unique set of preview and stable/generally available (GA) API releases. Preview releases currently tend to follow a monthly cadence.

| API | Latest preview release | Latest GA release | Specifications | Description |
|:---|:----|:----|:----|:---|
| **Control plane** | `2024-04-01-preview` | [`2023-05-01`](/rest/api/aiservices/accountmanagement/deployments/create-or-update?view=rest-aiservices-accountmanagement-2023-05-01&tabs=HTTP&preserve-view=true) | [Spec files](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices) | Azure OpenAI shares a common control plane with all other Azure AI Services. The control plane API is used for things like [creating Azure OpenAI resources](/rest/api/aiservices/accountmanagement/accounts/create?view=rest-aiservices-accountmanagement-2023-05-01&tabs=HTTP&preserve-view=true), [model deployment](/rest/api/aiservices/accountmanagement/deployments/create-or-update?view=rest-aiservices-accountmanagement-2023-05-01&tabs=HTTP&preserve-view=true), and other higher level resource management tasks. The control plane also governs what is possible to do with capabilities like Azure Resource Manager, Bicep, Terraform, and Azure CLI.|
| **Data plane - authoring** | [`2024-05-01-preview`](/rest/api/azureopenai/operation-groups?view=rest-azureopenai-2024-05-01-preview&preserve-view=true) | [`2024-06-01`](/rest/api/azureopenai/operation-groups?view=rest-azureopenai-2024-06-01&preserve-view=true) | [Spec files](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/data-plane/AzureOpenAI/authoring) | The data plane authoring API controls [fine-tuning](/rest/api/azureopenai/fine-tuning?view=rest-azureopenai-2024-05-01-preview&preserve-view=true), [file-upload](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-05-01-preview&tabs=HTTP&preserve-view=true), [ingestion jobs](/rest/api/azureopenai/ingestion-jobs/create?view=rest-azureopenai-2024-05-01-preview&tabs=HTTP&preserve-view=true), and certain [model level queries](/rest/api/azureopenai/models/get?view=rest-azureopenai-2024-05-01-preview&tabs=HTTP&preserve-view=true)
| **Data plane - inference** | [`2024-05-01-preview`](/azure/ai-services/openai/reference-preview#data-plane-inference) | [`2024-06-01`](/azure/ai-services/openai/reference#data-plane-inference) | [Spec files](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference) | The data plane inference API provides the inference capabilities/endpoints for features like completions, chat completions, embeddings, speech/whisper, on your data, Dall-e, assistants, etc. |

## Authentication

Azure OpenAI provides two methods for authentication. You can use  either API Keys or Microsoft Entra ID.

- **API Key authentication**: For this type of authentication, all API requests must include the API Key in the ```api-key``` HTTP header. The [Quickstart](../chatgpt-quickstart.md) provides guidance for how to make calls with this type of authentication.

- **Microsoft Entra ID authentication**: You can authenticate an API call using a Microsoft Entra token. Authentication tokens are included in a request as the ```Authorization``` header. The token provided must be preceded by ```Bearer```, for example ```Bearer YOUR_AUTH_TOKEN```. You can read our how-to guide on [authenticating with Microsoft Entra ID](../how-to/managed-identity.md).

### REST API versioning

The service APIs are versioned using the ```api-version``` query parameter. All versions follow the YYYY-MM-DD date structure. For example:

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2024-06-01
```