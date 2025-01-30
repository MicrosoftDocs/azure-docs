---
title: Connect Azure AI services with other Azure services
titleSuffix: Service Connector
description: In this document, learn how to integrate Azure AI Services into your application with Service Connector
author: wchigit
ms.author: wchi
ms.service: service-connector
ms.topic: how-to
ms.date: 01/29/2024
ms.collection: ce-skilling-ai-copilot
---

# Connect to Azure AI services using Service Connector

This page provides information on supported authentication methods and clients, along with sample code for connecting Azure AI services to other cloud services using Service Connector. This page also lists default environment variable names and values obtained when creating the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure AI Services:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below indicates which combinations of authentication methods and clients are supported for connecting your compute service to individual Azure AI Services using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.


| Client type | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|-------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET        |                Yes               |               Yes              |            Yes           |        Yes        |
| Java        |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js     |                Yes               |               Yes              |            Yes           |        Yes        |
| Python      |                Yes               |               Yes              |            Yes           |        Yes        |
| None        |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure AI Services using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure AI Services. For more information about naming conventions, refer to the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity (recommended)

| Default environment variable name | Description                  | Sample value                                     |
| --------------------------------- | ---------------------------- | ------------------------------------------------ |
| AZURE_AISERVICES_OPENAI_BASE   | Azure OpenAI endpoint | `https://<your-Azure-AI-Services-endpoint>.openai.azure.com/` |
| AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<your-Azure-AI-Services-endpoint>.cognitiveservices.azure.com/` |
| AZURE_AISERVICES_SPEECH_ENDPOINT | Speech to Text (Standard) API endpoint | `https://<location>.stt.speech.microsoft.com` |

#### Sample code

Refer to the steps and code below to connect to Azure AI Services using a system-assigned managed identity.
[!INCLUDE [code sample for app config](./includes/code-ai-services-microsoft-entra-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                    |
| --------------------------------- | -------------------------- | ----------------------------------------------- |
| AZURE_AISERVICES_OPENAI_BASE   | Azure OpenAI endpoint | `https://<your-Azure-AI-Services-endpoint>.openai.azure.com/` |
| AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<your-Azure-AI-Services-endpoint>.cognitiveservices.azure.com/` |
| AZURE_AISERVICES_SPEECH_ENDPOINT | Speech to Text (Standard) API endpoint | `https://<location>.stt.speech.microsoft.com` |
| AZURE_AISERVICES_CLIENTID   | Your client ID             | `<client-ID>`                                 |

#### Sample code

Refer to the steps and code below to connect to Azure AI Services using a user-assigned managed identity.
[!INCLUDE [code sample for azure AI Services](./includes/code-ai-services-microsoft-entra-id.md)]

### Connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_AISERVICES_OPENAI_BASE   | Azure OpenAI endpoint | `https://<your-Azure-AI-Services-endpoint>.openai.azure.com/` |
> | AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<your-Azure-AI-Services-endpoint>.cognitiveservices.azure.com/` |
> | AZURE_AISERVICES_SPEECH_ENDPOINT | Speech to Text (Standard) API endpoint | `https://<location>.stt.speech.microsoft.com` |
> | AZURE_AISERVICES_KEY | Azure AI Services API key | `<api-key>` |

#### Sample code

Refer to the steps and code below to connect to Azure AI Services using a connection string.
[!INCLUDE [code sample for azure AI Services](./includes/code-ai-services-secret.md)]


### Service principal

| Default environment variable name   | Description                | Sample value                                   |
| ----------------------------------- | -------------------------- | ---------------------------------------------- |
| AZURE_AISERVICES_OPENAI_BASE   | Azure OpenAI endpoint | `https://<your-Azure-AI-Services-endpoint>.openai.azure.com/` |
| AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<your-Azure-AI-Services-endpoint>.cognitiveservices.azure.com/` |
| AZURE_AISERVICES_SPEECH_ENDPOINT | Speech to Text (Standard) API endpoint | `https://<location>.stt.speech.microsoft.com` |
| AZURE_AISERVICES_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_AISERVICES_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_AISERVICES_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

#### Sample code

Refer to the steps and code below to connect to Azure AI Services using a service principaL.
[!INCLUDE [code sample for azure AI Services](./includes/code-ai-services-microsoft-entra-id.md)]

## Related content

* [Connect to an Azure AI multi-service resource](./how-to-integrate-cognitive-services.md)
* [Azure OpenAI Service integration](./how-to-integrate-openai.md)
* [Connect to Azure OpenAI Service in AKS using a Workload Identity](./tutorial-python-aks-openai-workload-identity.md)
