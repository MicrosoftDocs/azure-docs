---
title: Connect Azure AI Multi-Service Resource with Azure Services
titleSuffix: Service Connector
description: Use these code samples to integrate an Azure AI multi-service resource into your application with Service Connector.
author: wchigit
ms.author: wchi
ms.service: service-connector
ms.topic: how-to
ms.date: 09/30/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
#customer intent: As a cloud developer, I want to connect my compute services to an Azure AI multi-service resource using Service Connector.
---

# Connect to an Azure AI multi-service resource with Service Connector

This page provides information on supported authentication methods and clients. It provides sample code you can use to connect compute services to Azure AI multi-service resource using Service Connector. This page also lists default environment variable names and values obtained when creating the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to an Azure AI multi-service resource:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

This table indicates the authentication methods and clients supported for connecting your compute service to an Azure AI multi-service resource using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it isn't supported.


| Client type | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|-------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET        |                Yes               |               Yes              |            Yes           |        Yes        |
| Java        |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js     |                Yes               |               Yes              |            Yes           |        Yes        |
| Python      |                Yes               |               Yes              |            Yes           |        Yes        |
| None        |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to an Azure AI multi-service resource using Service Connector.

## Default environment variable names or application properties and sample code

Use the following connection details to connect compute services to an Azure AI multi-service resource. For more information, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity (recommended)

| Default environment variable name | Description                  | Sample value                                     |
| --------------------------------- | ---------------------------- | ------------------------------------------------ |
| AZURE_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<cognitive-service-name>.cognitiveservices.azure.com/` |

#### Sample code

To connect to an Azure AI multi-service resource using a system-assigned managed identity, refer to the following steps and code.

[!INCLUDE [code sample for an Azure AI multi-service resource](./includes/code-cognitive-microsoft-entra-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                    |
| --------------------------------- | -------------------------- | ----------------------------------------------- |
| AZURE_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<cognitive-service-name>.cognitiveservices.azure.com/` |
| AZURE_COGNITIVESERVICES_CLIENTID   | Your client ID             | `<client-ID>`                                 |

#### Sample code

To connect to an Azure AI multi-service resource using a user-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for an Azure AI multi-service resource](./includes/code-cognitive-microsoft-entra-id.md)]

### Connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<cognitive-service-name>.cognitiveservices.azure.com/` |
> | AZURE_COGNITIVESERVICES_KEY | API key of an Azure AI multi-service resource | `<api-key>` |

#### Sample code

To connect to an Azure AI multi-service resource using a connection string, refer to the following steps and code.
[!INCLUDE [code sample for an Azure AI multi-service resource](./includes/code-cognitive-secret.md)]


### Service principal

| Default environment variable name   | Description                | Sample value                                   |
| ----------------------------------- | -------------------------- | ---------------------------------------------- |
| AZURE_COGNITIVESERVICES_ENDPOINT | Azure Cognitive Services token provider service |  `https://<cognitive-service-name>.cognitiveservices.azure.com/` |
| AZURE_COGNITIVESERVICES_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_COGNITIVESERVICES_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_COGNITIVESERVICES_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

#### Sample code

To connect to an Azure AI multi-service resource using a service principal, refer to the following steps and code.

[!INCLUDE [code sample for an Azure AI multi-service resource](./includes/code-cognitive-microsoft-entra-id.md)]

## Related content

- [Connect to Azure AI services](./how-to-integrate-ai-services.md)
- [Connect to Azure OpenAI](./how-to-integrate-openai.md)
- [Connect to Azure OpenAI in AKS](./tutorial-python-aks-openai-workload-identity.md)
